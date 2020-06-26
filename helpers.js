const cp = require('child_process')

module.exports = {
    readCommit() {
        let stdout
        try {
            stdout = cp.execSync('git rev-parse HEAD', {stdio: 'pipe'})
            return stdout.toString()
        } catch (e) {
            return ''
        }

    },

    readTag() {
        let stdout
        try {
            stdout = cp.execSync('git tag -l --points-at HEAD', {stdio: 'pipe'})
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
        const {stack} = new Error()
        const name = stack.split('\n')[5] || ''
        return name
            .replace(/(.+)\((.+)\)/g, '$2')
            .split('/')
            .slice(-2)
            .join('/')
    }
}


