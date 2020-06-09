const os = require('os')
const process = require('process')

const hostname = os.hostname()
const pid = process.pid
const commit = ''//readCommit()
const tag = ''//readTag()


class Logr {
    constructor({ udp, dashId, publicKey, privateKey, hostname = '', version }) {
        Object.assign(this, { udp, dashId, publicKey, privateKey, hostname, version })
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
    GetVersion() {
        if (this.version !== '') {
            return this.version
        } else if (tag !== '') {
            return tag
        } else if (commit.length >= 6) {
            return commit.slice(0,6)
        } else {
            return ''
        }
    }
}

module.exports = { Logr }
