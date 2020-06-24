const cp = require('child_process')

module.exports = {
    readCommit() {
        let stdout
        try {
            stdout = cp.execSync('git rev-parse HEAD')
            return stdout.toString()
        } catch (e) {
            return ''
        }

    },

    readTag() {
        let stdout
        try {
            stdout = cp.execSync('git tag -l --points-at HEAD')
        } catch (e) {
            return ''
        }
        const parts = stdout.toString().split('\n')
        if (parts.length > 1) {
            return parts[parts.length - 2]
        }
        return ''
    },

    initiator() {
        const name = new Error().stack.split('\n')[4] || ''
        return name
            .replace(/(.+)\((.+)\)/g, '$2')
            .split('/')
            .slice(-2)
            .join('/')
    }
}


