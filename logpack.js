const crypto = require('crypto');
const aes = require('./aes');

class Logpack {
  constructor(logpack) {
    Object.assign(this, logpack)
  }

  chunkify(size, privateHash) {
    const uid = Logpack.generateRandomUniqueId(6)
    this.sign(uid, 0, 1, privateHash)

    const msg = JSON.stringify(this)
    const buf = Buffer.from(msg)

    if (buf.length <= size) {
      return [msg]
    }

    const data = this.cipher_log || this._log

    const headSize = buf.length - data.length
    const chunkSize = size - headSize

    const chunks = Logpack.chunkifyString(data, chunkSize)

    return chunks.map((chunk, i) => {
      const lpi = new Logpack({ ...this })
      lpi.sign(uid, i, chunks.length, privateHash)
      if (lpi.cipher_log) {
        lpi.cipher_log = chunk
      } else {
        lpi._log = chunk
      }
      return JSON.stringify(lpi)
    })
  }

  sign(uid, i, n, privateHash) {
    const ts = Date.now()
    this.chunk = { uid, ts, i, n }
    const message = `${ts}|${uid}|${i}|${n}`
    this.sig = aes.encrypt(message, privateHash, uid)
  }

  serializeLog() {
    this._log = Buffer.from(JSON.stringify(this.log)).toString('base64')
    delete this.log
  }

  cipherLog(privateHash) {
    this.cipher_log = aes.encryptJson(this.log, privateHash)
    delete this.log
  }

  static generateRandomUniqueId(length) {
    let buffer = crypto.randomBytes(length)
    return buffer.toString('base64').slice(0, length)
  }

  static chunkifyString(input, length) {
    const result = []
    for (let i = 0; i < input.length; i += length) {
      result.push(input.slice(i, i + length))
    }
    return result
  }
}

module.exports = { Logpack }