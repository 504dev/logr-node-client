# logr-node-client

[Logr] client library for Node.js.

[Logr]: https://github.com/504dev/logr

### Available logger functions

* logger.error
* logger.warn
* logger.info
* logger.debug

### Available counter functions

* counter.inc
* counter.avg
* counter.max
* counter.min
* counter.per
* counter.time

### Code snippets

```javascript
const conf = new Logr({
    udp: ':7776',
    publicKey: 'MCAwDQYJKoZIhvcNAQEBBQADDwAwDAIFAMg7IrMCAwEAAQ==',
    privateKey: 'MC0CAQACBQDIOyKzAgMBAAECBQCHaZwRAgMA0nkCAwDziwIDAL+xAgJMKwICGq0=',
});

const logger = conf.newLogger('hello.log');

logger.info('Hello, Logr!');
logger.counter.inc('greeting');
```
