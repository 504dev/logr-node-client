# logr-node-client

[Logr] client library for Node.js.

[Logr]: https://github.com/504dev/logr


    npm i logr-node-client

### Available `logr` methods

* `logr.emerg`
* `logr.alert`
* `logr.crit`
* `logr.error`
* `logr.warn`
* `logr.notice`
* `logr.info`
* `logr.debug`

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

const logr = conf.newLogger('hello.log');
logr.setLevel(Levels.LevelInfo);

// Logging
logr.info('Hello, Logr!');
logr.debug({ logr }); // level 'debug' will be ignored
logr.notice('It`s cool!');

// Counter usage
logr.counter.watchSystem(); // watch load average, cpu, memory, disk
logr.counter.inc('greeting', 5);

// Counter snippet example
logr.info('Its Widget %s Bro!', logr.counter.snippet('inc', 'greeting', 30));

// Disable console output
logr.consoleOff();
logr.info('this message will not be printed to the console');
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
