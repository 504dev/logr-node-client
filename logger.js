const _ = require('lodash')
const dgram = require('dgram')
const chalk = require('chalk')
const util = require('util')
const process = require('process')
const helpers = require('./helpers')
const aes = require('./aes')
const { Counter } = require('./counter')

const { levels, weights } = require('./levels')
const { LevelDebug, LevelInfo, LevelNotice, LevelWarn, LevelError, LevelCrit, LevelAlert, LevelEmerg } = levels

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


class Logger {
    constructor(config, logname, level = LevelDebug, terminal = true) {
        // this.conn = config.udp ? dgram.createSocket('udp4') : null
        this.pool = config.udp ? _.times(10, () => dgram.createSocket('udp4')) : null
        this.config = config
        this.logname = logname
        this.prefix = '{time} {level} '
        this.body = '[{version}, pid={pid}, {initiator}] {message}'
        this.counter = new Counter(config, logname)
        this.level = level
        this.terminal = terminal
    }

    getPrefix(level) {
        let res = this.prefix
        res = res.replace('{time}', new Date().toISOString())
        res = res.replace('{level}', lvl[level])
        return res
    }

    getBody(...args) {
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

    log(level, ...args) {
        const body = this.getBody(...args)
        if (this.terminal) {
            const prefix = this.getPrefix(level)
            std[level].write(prefix + body + '\n')
        }
        this.send(level, body)
    }

    blank(level = LevelInfo, message = '') {
        return {
            timestamp: Date.now(),
            logname: this.logname,
            hostname: this.config.getHostname(),
            pid: this.config.getPid(),
            version: this.config.getVersion(),
            level,
            message
        }
    }

    send(level, message) {
        if (weights[level] < weights[this.level]) {
            return
        }
        // if (!this.conn) {
        if (!this.pool) {
            return false
        }
        const log = this.blank(level, message)
        return this._send(log)
    }

    _send(log) {
        log = _.pick(log, ['timestamp', 'logname', 'hostname', 'pid', 'version', 'level', 'message'])
        log.timestamp = String(new Date(log.timestamp) * 1e6)
        const cipherText = aes.encryptJson(log, this.config.privateHash)
        const logpack = {
            public_key: this.config.publicKey,
            cipher_log: cipherText,
        }
        const msg = JSON.stringify(logpack)
        // return this.conn.send(msg, ...this.config.udpParts())
        return _.sample(this.pool).send(msg, ...this.config.udpParts())
    }

    close() {
        // if (this.conn) {
        //     this.conn.close()
        // }
        if (this.pool) {
            this.pool.map(conn => conn.close())
        }
    }
}

module.exports = {Logger}
