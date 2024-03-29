const udp = require('dgram')
const osu = require('node-os-utils')
const aes = require('./aes')
const { Count } = require('./count')

class Counter {
    constructor(config, logname) {
        this.conn = null
        this.config = config
        this.logname = logname
        this.tmp = {}
        this.timer = null
    }

    connect() {
        if (!this.conn) {
            this.conn = udp.createSocket('udp4')
        }
    }

    run(interval) {
        if (!this.timer) {
            this.timer = setInterval(() => this.flush(), interval)
        }
    }

    flush() {
        for (const keyname in this.tmp) {
            const count = this.tmp[keyname]
            this.send(count)
        }
        this.tmp = {}
    }

    stop() {
        this.flush()
        if (this.timer) {
            clearInterval(this.timer)
        }
        if (this.timerProcess) {
            clearInterval(this.timerProcess)
        }
        if (this.timerSystem) {
            clearInterval(this.timerSystem)
        }
    }

    close() {
        if (this.conn) {
            this.conn.close()
        }
    }

    send(count) {
        const lp = {
            public_key: this.config.publicKey,
            count
        }
        if (!this.config.noCipher) {
            lp.cipher_count = aes.encryptJson(count, this.config.privateHash)
            delete lp.count
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
        this.connect()
        this.run(20_000)
        if (!this.tmp[keyname]) {
            this.tmp[keyname] = new Count({...this.blank(), keyname})
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

    snippet(kind, keyname, limit = 30) {
        return JSON.stringify({
            widget: 'counter',
            ...this.blank(),
            keyname,
            kind,
            limit
        })
    }

    watchProcess() {
        this.timerProcess = setInterval(async () => {
            const mu = process.memoryUsage()
            for (const key in mu) {
                this.avg(`process.memoryUsage().${key}`, mu[key])
            }
        }, 20_000)
    }

    watchSystem() {
        this.timerSystem = setInterval(async () => {
            const minuteInterval = 60_000
            const netstatInterval = 5_000
            const [l, c, d, m, n, f] = await Promise.all([
                osu.cpu.loadavg(),
                osu.cpu.usage(),
                osu.drive.info(),
                osu.mem.info(),
                osu.netstat.inOut(netstatInterval).catch(() => null),
                osu.openfiles.openFd().catch(() => null)
            ])
            this.avg('la', l[0])
            this.per('cpu', c, 100)
            this.per('disk', +d.usedGb, +d.totalGb)
            this.per('mem', m.usedMemMb, m.totalMemMb)
            if (typeof n === 'object') {
                const { inputMb, outputMb } = n.total
                this.avg('netIn', inputMb * 1e6 * (minuteInterval / netstatInterval))
                this.avg('netOut', outputMb * 1e6 * (minuteInterval / netstatInterval))
            }
            if (typeof f === 'number') {
                this.avg('openFd', f)
            }
        }, 20_000)
    }
}

module.exports = { Counter }
