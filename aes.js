const crypto = require('crypto')

module.exports = {
    encrypt(text, key, iv) {
        if (!iv) {
            iv = crypto.randomBytes(16)
        } else {
            const salt = crypto.createHash('sha256').update(iv).digest()
            iv = salt.slice(0, 16)
        }
        let cipher = crypto.createCipheriv('aes-256-cfb', key, iv)
        let encrypted = cipher.update(text)
        encrypted = Buffer.concat([encrypted, cipher.final()])
        return Buffer.concat([iv, encrypted]).toString('base64')
    },

    decrypt(text, key) {
        let encryptedText = Buffer.from(text, 'base64')
        const iv = encryptedText.slice(0, 16)
        encryptedText = encryptedText.slice(16)
        let decipher = crypto.createDecipheriv('aes-256-cfb', key, iv)
        let decrypted = decipher.update(encryptedText)
        decrypted = Buffer.concat([decrypted, decipher.final()])
        return decrypted.toString()
    },

    encryptJson(data, key) {
        const text = JSON.stringify(data)
        return this.encrypt(text, key)
    },

    decryptJson(text, key) {
        const json = this.decrypt(text, key)
        return JSON.parse(json)
    }
}
