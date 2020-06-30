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
        const lines = stack.split('\n')
        let name
        for (let i = lines.length - 1; i >= 0; i--) {
            if (lines[i].includes('at Logger.')) {
                name = lines[i + 1] || ''
                break
            }
        }
        return name
            .replace(/(.+)\((.+)\)/g, '$2')
            .split('/')
            .slice(-2)
            .join('/')
    }
}


