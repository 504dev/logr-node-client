const _ = require('lodash')
const udp = require('dgram')
const chalk = require('chalk')
const util = require('util')
const process = require('process')
const helpers = require('./helpers')
const aes = require('./aes')
const {Counter} = require('./counter')

const {LevelDebug, LevelInfo, LevelWarn, LevelError} = require('./levels')

const std = new Proxy({}, {
    get: function (target, prop) {
        return {
            [LevelDebug]: process.stdout,
            [LevelInfo]: process.stdout,
            [LevelWarn]: process.stderr,
            [LevelError]: process.stderr,
        }[prop] || process.stdout
    }
})

const lvl = new Proxy({}, {
    get: function (target, prop) {
        return {
            [LevelDebug]: chalk.blue(LevelDebug),
            [LevelInfo]: chalk.green(LevelInfo),
            [LevelWarn]: chalk.yellow(LevelWarn),
            [LevelError]: chalk.red(LevelError),
        }[prop] || chalk.grey(prop)
    }
})


class Logger {
    constructor(config, logname) {
        this.conn = udp.createSocket('udp4')
        this.config = config
        this.logname = logname
        this.prefix = '{time} {level} '
        this.body = '[{version}, pid={pid}, {initiator}] {message}'
        this.counter = new Counter(config, logname)
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

    debug(...v) {
        this.log(LevelDebug, ...v)
    }

    info(...v) {
        this.log(LevelInfo, ...v)
    }

    warn(...v) {
        this.log(LevelWarn, ...v)
    }

    error(...v) {
        this.log(LevelError, ...v)
    }

    log(level, ...args) {
        const prefix = this.getPrefix(level)
        const body = this.getBody(...args)
        std[level].write(prefix + body + '\n')
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
        const log = this.blank(level, message)
        return this._send(log)
    }

    _send(log) {
        log = _.pick(log, ['timestamp', 'logname', 'hostname', 'pid', 'version', 'level', 'message'])
        log.timestamp = new Date(log.timestamp) * 1e6
        const cipherText = aes.encryptJson(log, this.config.privateKey)
        const logpack = {
            public_key: this.config.publicKey,
            cipher_log: cipherText,
        }
        const msg = JSON.stringify(logpack)
        this.conn.send(msg, ...this.config.udpParts())
    }

    close() {
        if (this.conn) {
            this.conn.close()
        }
    }
}

module.exports = {Logger}
