const Levels = {
    LevelEmerg: 'emerg',
    LevelAlert: 'alert',
    LevelCrit: 'crit',
    LevelError: 'error',
    LevelWarn: 'warn',
    LevelNotice: 'notice',
    LevelInfo: 'info',
    LevelDebug: 'debug',
}

const Weights = {
    [Levels.LevelEmerg]: 7,
    [Levels.LevelAlert]: 6,
    [Levels.LevelCrit]: 5,
    [Levels.LevelError]: 4,
    [Levels.LevelWarn]: 3,
    [Levels.LevelNotice]: 2,
    [Levels.LevelInfo]: 1,
    [Levels.LevelDebug]: 0,
}

module.exports = { Levels, Weights }
