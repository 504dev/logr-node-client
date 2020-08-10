const {Logr} = require('./index')
const { levels } = require('./levels')

const conf = new Logr({
    udp: ':7776',
    publicKey: 'MCAwDQYJKoZIhvcNAQEBBQADDwAwDAIFAMg7IrMCAwEAAQ==',
    privateKey: 'MC0CAQACBQDIOyKzAgMBAAECBQCHaZwRAgMA0nkCAwDziwIDAL+xAgJMKwICGq0=',
})

const logger = conf.newLogger('hello.log', levels.LevelDebug)

for (const key in levels) {
    const level = levels[key]
    logger.log(level, 'Hello, Logr!')
}

logger.counter.inc('greeting')
logger.info('Its Widget %s Bro!', conf.newCounter('crypto.log').snippet('max', 'price:BTC_USDT', 30))
logger.counter.watchSystem()
