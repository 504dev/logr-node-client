const {Logr} = require('./index.js')

const conf = new Logr({
    udp: ':7776',
    publicKey: 'MCAwDQYJKoZIhvcNAQEBBQADDwAwDAIFAMg7IrMCAwEAAQ==',
    privateKey: 'MC0CAQACBQDIOyKzAgMBAAECBQCHaZwRAgMA0nkCAwDziwIDAL+xAgJMKwICGq0=',
})

const logger = conf.newLogger('hello.log')

logger.counter.inc('greeting')
logger.info('Hello, Logr!')
logger.info('Its Widget %s Bro!', conf.newCounter('crypto.log').snippet('max', 'price:BTC_USDT', 30))
logger.counter.watchSystem()
