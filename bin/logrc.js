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
    .command('count <kind> <keyname> [x] [y]')
    .description('send count')
    .action(async (kind, keyname, x, y) => {
        x = typeof x === 'undefined' ? x : parseFloat(x)
        y = typeof y === 'undefined' ? y : parseFloat(y)
        if (x !== x || y !== y) { // check NaN
            console.error('Error: X and Y must be a number')
            return
        }
        const kinds = ['inc', 'min', 'max', 'avg', 'per', 'time']
        if (!kinds.includes(kind)) {
            console.error(`Error: Unknown kind «${kind}» (use ${kinds})`)
            return
        }
        const conf = new Logr({
            udp: program.udp,
            publicKey: program.pub,
            privateKey: program.priv,
        })
        const counter = conf.newCounter(program.logname)
        counter[kind](keyname, x, y)
        counter.stop()
        setTimeout(() => counter.close())
    })

program.parse(process.argv)
