const udp = require('dgram')
const aes = require('./aes')
const {Count} = require('./Count')

class Counter {
    constructor(config, logname) {
        this.conn = udp.createSocket('udp4')
        this.config = config
        this.logname = logname
        this.tmp = {}
        this.timer = null
    }

    run(interval) {
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


    touch(key) {
        if (!this.tmp[key]) {
            this.tmp[key] = new Count({
                dashId: this.config.dashId,
                hostname: this.config.getHostname(),
                logname: this.logname,
                keyname: key,
                version: this.config.getVersion(),
            })
        }
        return this.tmp[key]
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
}

module.exports = {Counter}
