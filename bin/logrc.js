#!/usr/bin/env node

const program = require('commander')
const {Logr} = require('../index')
const {LevelInfo} = require('../levels')


let {version} = require('../package')

program
    .option('--udp <string>', 'set udp address', /:/, '127.0.0.1:7776')
    .requiredOption('--pub <string>', 'set public key')
    .requiredOption('--priv <string>', 'set private key')
    .requiredOption('--logname <string>', 'set logname')
    .version(version, '-v, --version')

program
    .command('log')
    .description('send log')
    .requiredOption('--message <string>', 'set log message')
    .option('--level <string>', 'set log level', LevelInfo)
    .action(async (opts) => {
        const conf = new Logr({
            udp: program.udp,
            publicKey: program.pub,
            privateKey: program.priv,
        })
        const logger = conf.newLogger(program.logname)
        logger.log(opts.level, opts.message)
        setTimeout(() => logger.close())
    })

program
    .command('count <type> <keyname> [x] [y]')
    .description('send count')
    .action(async (type, keyname, x, y) => {
        const conf = new Logr({
            udp: program.udp,
            publicKey: program.pub,
            privateKey: program.priv,
        })
        const counter = conf.newCounter(program.logname)
        counter[type](keyname, x, y)
        counter.stop()
        setTimeout(() => counter.close())
    })

program.parse(process.argv)
