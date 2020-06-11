const os = require('os')
const udp = require('dgram')
const chalk = require('chalk')
const crypto = require('crypto')
const util = require('util')
const process = require('process')
const helpers = require('./helpers')
const aes = require('./aes')

const hostname = os.hostname()
const pid = process.pid
const commit = helpers.readCommit()
const tag = helpers.readTag()

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

class Logr {
    constructor({udp, dashId, publicKey, privateKey, hostname = '', version}) {
        Object.assign(this, {udp, dashId, publicKey, privateKey, hostname, version})
    }

    getHostname() {
        if (this.hostname !== '') {
            return this.hostname
        }
        return hostname
    }

    getPid() {
        return pid
    }

    getVersion() {
        if (this.version) {
            return this.version
        } else if (tag !== '') {
            return tag
        } else if (commit.length >= 6) {
            return commit.slice(0, 6)
        } else {
            return ''
        }
    }

    newLogger(logname) {
        return new Logger(this, logname)
    }
}

class Logger {
    constructor(config, logname) {
        this.conn = udp.createSocket('udp4')
        this.config = config
        this.logname = logname
        this.prefix = '{time} {level} '
        this.body = '[{version}, pid={pid}, {initiator}] {message}'
    }

    getPrefix(level) {
        const dt = new Date().toISOString()
        let flevel = level
        switch (level) {
            case LevelDebug:
                flevel = chalk.blue(level)
                break
            case LevelInfo:
                flevel = chalk.green(level)
                break
            case LevelWarn:
                flevel = chalk.yellow(level)
                break
            case LevelError:
                flevel = chalk.red(level)
                break
        }
        let res = this.prefix
        res = res.replace('{time}', dt)
        res = res.replace('{level}', flevel)
        return res
    }

    getBody(msg) {
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
        const body = this.getBody(util.formatWithOptions({colors: true}, ...args))
        std[level].write(prefix + body + '\n')
        this.writeLevel(level, body)
    }

    blankLog() {
        return {
            logname: this.logname,
            timestamp: Date.now() * 1e6,
            dashId: this.config.dashId,
            hostname: this.config.getHostname(),
            pid: this.config.getPid(),
            version: this.config.getVersion(),
        }
    }

    writeLevel(level, msg) {
        const log = this.blankLog()
        log.level = level
        log.message = msg

        return this.writeLog(log)
    }

    writeLog(log) {
        const cipherText = this.encryptJson(log, this.config.privateKey)
        const logpack = {
            dash_id: this.config.dashId,
            public_key: this.config.publicKey,
            cipher_log: cipherText,
        }
        const msg = JSON.stringify(logpack)
        this.conn.send(msg, this.config.udp.port, this.config.udp.host)
    }

    encryptJson(data, key) {
        const text = JSON.stringify(data)
        return aes.encrypt(text, key)
    }

    decryptJson(text, key) {
        const json = aes.decrypt(text, key)
        return JSON.parse(json)
    }

}

module.exports = {Logr}
