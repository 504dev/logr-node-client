# logr-node-client

[Logr] client library for Node.js.

[Logr]: https://github.com/504dev/logr


    npm i logr-node-client

### Available `logger` functions

* `logger.error`
* `logger.warn`
* `logger.info`
* `logger.debug`

### Available `counter` functions

* `counter.inc`
* `counter.avg`
* `counter.max`
* `counter.min`
* `counter.per`
* `counter.time`

### Example

```javascript
const conf = new Logr({
    udp: ':7776',
    publicKey: 'MCAwDQYJKoZIhvcNAQEBBQADDwAwDAIFAMg7IrMCAwEAAQ==',
    privateKey: 'MC0CAQACBQDIOyKzAgMBAAECBQCHaZwRAgMA0nkCAwDziwIDAL+xAgJMKwICGq0=',
});

const logger = conf.newLogger('hello.log');

// Send log
logger.info('Hello, Logr!');
logger.debug('It`s cool!');

// Counter usage
logger.counter.inc('greeting', 5);

// Counter snippet example
logger.info('Its Widget %s Bro!', logger.counter.snippet('inc', 'greeting', 30))
```

## Command line usage

### Install
    npm i logr-node-client -g

### Options
     --udp <string>      set udp address (default: "127.0.0.1:7776")
     --pub <string>      set public key
     --priv <string>     set private key
     --logname <string>  set logname
     --message <string>  set log message
     --level <string>    set log level (default: "info")
     -v, --version       output the version number
     -h, --help          display help for command

### Example

```bash
logrc --pub="MCAwDQYJKoZIhvcNAQEBBQADDwAwDAIFAMg7IrMCAwEAAQ=="
      --priv="MC0CAQACBQDIOyKzAgMBAAECBQCHaZwRAgMA0nkCAwDziwIDAL+xAgJMKwICGq0="
      --logname="hello.log"
      --message="Privet"
      --level=debug
```
