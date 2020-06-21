const udp = require('dgram')
const aes = require('./aes')
const {Count} = require('./count')

class Counter {
    constructor(config, logname) {
        this.conn = null
        this.config = config
        this.logname = logname
        this.tmp = {}
        this.timer = null
    }

    run(interval) {
        this.conn = udp.createSocket('udp4')
        this.timer = setInterval(() => this.flush(), interval)
    }

    flush() {
        for (const keyname in this.tmp) {
            const count = this.tmp[keyname]
            this.send(count)
        }
        this.tmp = {}
    }

    send(count) {
        const cipherText = aes.encryptJson(count, this.config.privateKey)
        const lp = {
            dash_id: this.config.dashId,
            public_key: this.config.publicKey,
            cipher_count: cipherText,
        }
        const msg = JSON.stringify(lp)
        this.conn.send(msg, ...this.config.udpParts())
    }

    blank() {
        return {
            hostname: this.config.getHostname(),
            logname: this.logname,
            version: this.config.getVersion(),
        }
    }

    touch(keyname) {
        if (!this.tmp[keyname]) {
            this.tmp[keyname] = new Count({ ...this.blank(), keyname })
        }
        return this.tmp[keyname]
    }

    inc(key, num) {
        return this.touch(key).inc(num)
    }

    max(key, num) {
        return this.touch(key).max(num)
    }

    min(key, num) {
        return this.touch(key).min(num)
    }

    avg(key, num) {
        return this.touch(key).avg(num)
    }

    per(key, taken, total) {
        return this.touch(key).per(taken, total)
    }

    time(key, d) {
        return this.touch(key).time(d)
    }

    widget(kind, keyname, limit){
        return JSON.stringify({
            widget: 'counter',
            ...this.blank(),
            keyname,
            kind,
            limit
        })
    }
}

module.exports = {Counter}
