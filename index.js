const os = require('os')
const crypto = require('crypto')
const process = require('process')
const helpers = require('./helpers')
const {Logger} = require('./logger')
const {Counter} = require('./counter')
const {Levels} = require('./levels')

const hostname = os.hostname()
const pid = process.pid
const commit = helpers.readCommit()
const tag = helpers.readTag()

class Logr {
    constructor({udp = '', publicKey = '', privateKey = '', hostname = '', version, noCipher = false } = {}) {
        Object.assign(this, { udp, publicKey, privateKey, hostname, version, noCipher })
        this.privateHash = crypto.createHash('sha256').update(privateKey, 'base64').digest()
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

    udpParts() {
        const splitted = this.udp.split(':')
        const host = splitted[0] || 'localhost'
        const port = parseInt(splitted[1]) || 7776
        return [port, host]
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

    newLogger(logname, options) {
        return new Logger(this, logname, options)
    }

    newCounter(name) {
        return new Counter(this, name)
    }
}

module.exports = {Logr, Levels}
