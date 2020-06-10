const cp = require('child_process')

module.exports = {
    readCommit() {
        const stdout = cp.execSync('git rev-parse HEAD')
        return stdout.toString()
    },

    readTag() {
        const stdout = cp.execSync('git tag -l --points-at HEAD')
        const parts = stdout.toString().split('\n')
        if (parts.length > 1) {
            return parts[parts.length-2]
        }
        return ''
    }
}


