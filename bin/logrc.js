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
    .requiredOption('--message <string>', 'set log message')
    .option('--level <string>', 'set log level', LevelInfo)
    .version(version, '-v, --version')

program
    .action(async () => {
        const conf = new Logr({
            udp: program.udp,
            publicKey: program.pub,
            privateKey: program.priv,
        })
        const logger = conf.newLogger(program.logname)
        logger.log(program.level, program.message)
        setTimeout(() => logger.close())
    })

program.parse(process.argv)
