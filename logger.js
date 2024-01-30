const _ = require('lodash')
const dgram = require('dgram')
const chalk = require('chalk')
const util = require('util')
const process = require('process')
const helpers = require('./helpers')
const { Counter } = require('./counter')
const { Logpack } = require('./logpack')
const { Levels, Weights } = require('./levels')

const { LevelDebug, LevelInfo, LevelNotice, LevelWarn, LevelError, LevelCrit, LevelAlert, LevelEmerg } = Levels

const MAX_MESSAGE_SIZE = 9000

const std = new Proxy({}, {
    get: function (target, prop) {
        return {
            [LevelEmerg]: process.stderr,
            [LevelAlert]: process.stderr,
            [LevelCrit]: process.stderr,
            [LevelError]: process.stderr,
            [LevelWarn]: process.stderr,
            [LevelNotice]: process.stdout,
            [LevelInfo]: process.stdout,
            [LevelDebug]: process.stdout,
        }[prop] || process.stdout
    }
})

const lvl = new Proxy({}, {
    get: function (target, prop) {
        return {
            [LevelEmerg]: chalk.red.bold(LevelEmerg),
            [LevelAlert]: chalk.red.bold(LevelAlert),
            [LevelCrit]: chalk.red.bold(LevelCrit),
            [LevelError]: chalk.red(LevelError),
            [LevelWarn]: chalk.yellow(LevelWarn),
            [LevelNotice]: chalk.green.bold(LevelNotice),
            [LevelInfo]: chalk.green(LevelInfo),
            [LevelDebug]: chalk.blue(LevelDebug),
        }[prop] || chalk.grey(prop)
    }
})

const now = (() => {
    let timestamp = Date.now()
    let order = 0
    return () => {
        const now = Date.now()
        if (now > timestamp) {
            timestamp = now
            order = 0
        } else {
            order += 1
        }
        return { timestamp, order }
    }
})()

class Logger {
    constructor(config, logname, options = {}) {
        this.conn = config.udp ? dgram.createSocket('udp4') : null
        // this.pool = config.udp ? _.times(3, () => dgram.createSocket('udp4')) : null
        this.config = config
        this.logname = logname
        this.prefix = '{time} {level} '
        this.body = '[{version}, pid={pid}, {initiator}] {message}'
        this.counter = new Counter(config, logname)
        this.options = { level: LevelDebug, console: true, ...options }
    }

    setLevel(level) {
        this.options.level = level
    }

    consoleOff() {
        this.options.console = false
    }

    _getPrefix(level) {
        let res = this.prefix
        res = res.replace('{time}', new Date().toISOString())
        res = res.replace('{level}', lvl[level])
        return res
    }

    _getBody(...args) {
        const msg = util.formatWithOptions({colors: true}, ...args)
        let res = this.body
        res = res.replace('{version}', this.config.getVersion())
        res = res.replace('{pid}', this.config.getPid())
        res = res.replace('{initiator}', helpers.initiator())
        res = res.replace('{message}', msg)
        return res
    }

    emerg(...v) {
        this.log(LevelEmerg, ...v)
    }

    alert(...v) {
        this.log(LevelAlert, ...v)
    }

    crit(...v) {
        this.log(LevelCrit, ...v)
    }

    error(...v) {
        this.log(LevelError, ...v)
    }

    warn(...v) {
        this.log(LevelWarn, ...v)
    }

    notice(...v) {
        this.log(LevelNotice, ...v)
    }

    info(...v) {
        this.log(LevelInfo, ...v)
    }

    debug(...v) {
        this.log(LevelDebug, ...v)
    }

    delta(ts) {
        return (Date.now() - ts) / 1000
    }

    log(level, ...args) {
        const consoleLevel = this.options.consoleLevel || this.options.level
        const udpLevel = this.options.udpLevel || this.options.level
        if (this.options.console && Weights[level] >= Weights[consoleLevel]) {
            this.console(level, ...args)
        }
        if (this.conn && Weights[level] >= Weights[udpLevel]) {
        // if (this.pool) {
            this.udp(level, ...args)
        }
    }

    console(level, ...args) {
        const prefix = this._getPrefix(level)
        const body = this._getBody(...args)
        std[level].write(prefix + body + '\n')
    }

    udp(level, ...args) {
        const body = this._getBody(...args)
        const log = this._blank(level, body)
        return this._send(log)
    }

    _blank(level = LevelInfo, message = '') {
        const { timestamp, order } = now()
        return {
            timestamp,
            order,
            logname: this.logname,
            hostname: this.config.getHostname(),
            pid: this.config.getPid(),
            version: this.config.getVersion(),
            level,
            message
        }
    }

    _send(log) {
        const { timestamp, order = 0 } = log
        log.timestamp = new Date(timestamp).getTime() + '000000'
        log.timestamp = order.toString().padStart(log.timestamp.length, log.timestamp)
        const logpack = new Logpack({
            public_key: this.config.publicKey,
            log: _.pick(log, ['timestamp', 'logname', 'hostname', 'pid', 'version', 'level', 'message'])
        })
        if (this.config.noCipher) {
            logpack.serializeLog()
        } else {
            logpack.cipherLog(this.config.privateHash)
        }

        const chunks = logpack.chunkify(MAX_MESSAGE_SIZE, this.config.privateHash)

        for (const chunk of chunks) {
            this.conn.send(chunk, ...this.config.udpParts())
        }
        // return _.sample(this.pool).send(msg, ...this.config.udpParts())
    }

    close() {
        if (this.conn) {
            this.conn.close()
        }
        // if (this.pool) {
        //     this.pool.map(conn => conn.close())
        // }
    }
}

module.exports = { Logger }
