const { Logr } = require('./index.js')

const conf = new Logr({
    udp: {
        host: 'localhost',
        port: 7776,
    },
    dashId: 2,
    publicKey: 'MCAwDQYJKoZIhvcNAQEBBQADDwAwDAIFAMg7IrMCAwEAAQ==',
    privateKey: 'MC0CAQACBQDIOyKzAgMBAAECBQCHaZwRAgMA0nkCAwDziwIDAL+xAgJMKwICGq0=',
})

const logger = conf.newLogger('node')

logger.info('Hello, Logr!')
