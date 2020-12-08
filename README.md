# logr-node-client

[Logr] client library for Node.js.

[Logr]: https://github.com/504dev/logr


    npm i logr-node-client

### Available `logger` methods

* `logger.emerg`
* `logger.alert`
* `logger.crit`
* `logger.error`
* `logger.warn`
* `logger.notice`
* `logger.info`
* `logger.debug`

### Available `counter` methods

* `counter.inc`
* `counter.avg`
* `counter.max`
* `counter.min`
* `counter.per`
* `counter.time`
* `counter.snippet` bonus method!

### Example

```javascript
const { Logr, Levels } = require('logr-node-client');

const conf = new Logr({
    udp: ':7776',
    publicKey: 'MCAwDQYJKoZIhvcNAQEBBQADDwAwDAIFAMg7IrMCAwEAAQ==',
    privateKey: 'MC0CAQACBQDIOyKzAgMBAAECBQCHaZwRAgMA0nkCAwDziwIDAL+xAgJMKwICGq0=',
});

const logger = conf.newLogger('hello.log');
logger.setLevel(Levels.LevelInfo);

// Logging
logger.info('Hello, Logr!');
logger.debug({ logger }); // level 'debug' will be ignored
logger.notice('It`s cool!');

// Counter usage
logger.counter.watchSystem(); // watch load average, cpu, memory, disk
logger.counter.inc('greeting', 5);

// Counter snippet example
logger.info('Its Widget %s Bro!', logger.counter.snippet('inc', 'greeting', 30));

// Disable console output
logger.consoleOff();
logger.info('this message will not be printed to the console');
```

## Command line usage

### Install
    npm i logr-node-client -g

### Usage
    Options:
      --udp <string>                  set udp address (default: "127.0.0.1:7776")
      --pub <string>                  set public key
      --priv <string>                 set private key
      --logname <string>              set logname
      -v, --version                   output the version number
      -h, --help                      display help for command

    Commands:
      log [options]                   send log
      count <kind> <keyname> [x] [y]  send count
      help [command]                  display help for command


### Example

```bash
logrc log --pub="MCAwDQYJKoZIhvcNAQEBBQADDwAwDAIFAMg7IrMCAwEAAQ==" \
          --priv="MC0CAQACBQDIOyKzAgMBAAECBQCHaZwRAgMA0nkCAwDziwIDAL+xAgJMKwICGq0=" \
          --logname="hello.log" \
          --level=debug \
          --message="Privet"

```
```bash
logrc count --pub="MCAwDQYJKoZIhvcNAQEBBQADDwAwDAIFAMg7IrMCAwEAAQ==" \
            --priv="MC0CAQACBQDIOyKzAgMBAAECBQCHaZwRAgMA0nkCAwDziwIDAL+xAgJMKwICGq0=" \
            --logname="hello.log" \
            inc \
            greeting \
            5
```
