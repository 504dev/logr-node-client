class Count {
    constructor(data) {
        Object.assign(this, {metrics: {}}, data)
    }

    now() {
        this.timestamp = Math.round(Date.now() / 1000)
    }

    inc(num = 1) {
        this.now()
        if (typeof this.metrics.inc === 'undefined') {
            this.metrics.inc = 0
        }
        this.metrics.inc += num
        return this
    }

    max(num) {
        this.now()
        if (typeof this.metrics.max === 'undefined') {
            this.metrics.max = num
        } else {
            this.metrics.max = Math.max(this.metrics.max, num)
        }
        return this
    }

    min(num) {
        this.now()
        if (typeof this.metrics.min === 'undefined') {
            this.metrics.min = num
        } else {
            this.metrics.min = Math.min(this.metrics.min, num)
        }
        return this
    }

    avg(num) {
        this.now()
        if (typeof this.metrics.avg_num === 'undefined') {
            this.metrics.avg_sum = 0
            this.metrics.avg_num = 0
        }
        this.metrics.avg_sum += num
        this.metrics.avg_num += 1
        return this
    }

    per(taken, total) {
        this.now()
        if (typeof this.metrics.per_ttl === 'undefined') {
            this.metrics.per_tkn = 0
            this.metrics.per_ttl = 0
        }
        this.metrics.per_tkn += taken
        this.metrics.per_ttl += total
        return this
    }

    time(dutarion = 1e6) {
        this.now()
        this.metrics.time = dutarion
        const ts = Date.now()
        let delta
        return () => {
            if (typeof delta !== 'undefined') {
                return delta
            }
            delta = Date.now() - ts
            this.avg(delta).min(delta).max(delta)
            return delta
        }
    }
}

module.exports = {Count}
