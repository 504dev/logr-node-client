const udp = require('dgram')
const chalk = require('chalk')
const util = require('util')
const process = require('process')
const helpers = require('./helpers')
const aes = require('./aes')
const {Counter} = require('./counter')

const LevelDebug = 'debug'
const LevelInfo = 'info'
const LevelWarn = 'warn'
const LevelError = 'error'

const std = {
    [LevelDebug]: process.stdout,
    [LevelInfo]: process.stdout,
    [LevelWarn]: process.stderr,
    [LevelError]: process.stderr,
}

const lvl = {
    [LevelDebug]: chalk.blue(LevelDebug),
    [LevelInfo]: chalk.green(LevelInfo),
    [LevelWarn]: chalk.yellow(LevelWarn),
    [LevelError]: chalk.red(LevelError),
}


class Logger {
    constructor(config, logname) {
        this.conn = udp.createSocket('udp4')
        this.config = config
        this.logname = logname
        this.prefix = '{time} {level} '
        this.body = '[{version}, pid={pid}, {initiator}] {message}'
        this.counter = new Counter(config, logname)
        this.counter.run(10 * 1000)
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

    send(level, message) {
        const log = {
            logname: this.logname,
            timestamp: Date.now() * 1e6,
            dashId: this.config.dashId,
            hostname: this.config.getHostname(),
            pid: this.config.getPid(),
            version: this.config.getVersion(),
            level,
            message
        }

        const cipherText = aes.encryptJson(log, this.config.privateKey)
        const logpack = {
            dash_id: this.config.dashId,
            public_key: this.config.publicKey,
            cipher_log: cipherText,
        }
        const msg = JSON.stringify(logpack)
        this.conn.send(msg, ...this.config.udpParts())
    }
}

module.exports = {Logger}
