const levels = {
    LevelEmerg: 'emerg',
    LevelAlert: 'alert',
    LevelCrit: 'crit',
    LevelError: 'error',
    LevelWarn: 'warn',
    LevelNotice: 'notice',
    LevelInfo: 'info',
    LevelDebug: 'debug',
}

const weights = {
    [levels.LevelEmerg]: 7,
    [levels.LevelAlert]: 6,
    [levels.LevelCrit]: 5,
    [levels.LevelError]: 4,
    [levels.LevelWarn]: 3,
    [levels.LevelNotice]: 2,
    [levels.LevelInfo]: 1,
    [levels.LevelDebug]: 0,
}

module.exports = {
    levels, weights
}
