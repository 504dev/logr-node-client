const { Logr } = require('./index.js')

const conf = new Logr({
    udp: ':7776',
    publicKey: 'MCAwDQYJKoZIhvcNAQEBBQADDwAwDAIFAMg7IrMCAwEAAQ==',
    privateKey: 'MC0CAQACBQDIOyKzAgMBAAECBQCHaZwRAgMA0nkCAwDziwIDAL+xAgJMKwICGq0=',
})

const logger = conf.newLogger('hello.log')

logger.info('Hello, Logr!')
logger.counter.inc('greeting')
