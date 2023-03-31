import CryptoJS from 'crypto-js'
import md5 from 'crypto-js/md5'
import UTF8 from 'crypto-js/enc-utf8'
import Base64 from 'crypto-js/enc-base64'
import start from './startCrty/start'
import end from './endCrypto/end'
import middle from './middleCrypto/middle'
import start16 from './startCrty/16Start'
import end16 from './endCrypto/16end'
import middle16 from './middleCrypto/16middle'

const key = CryptoJS.enc.Utf8.parse(start + middle + end)
const iv = CryptoJS.enc.Utf8.parse(start16 + middle16 + end16)

export interface EncryptionParams {
  key: string
  iv: string
}

export function encryptByBase64(cipherText: string) {
  return UTF8.parse(cipherText).toString(Base64)
}

export function decodeByBase64(cipherText: string) {
  return Base64.parse(cipherText).toString(UTF8)
}

export function encryptByMd5(password: string) {
  return md5(password).toString()
}

export function encrypt(word: any) {
  const src = CryptoJS.enc.Utf8.parse(word)
  const encrypted = CryptoJS.AES.encrypt(src, key, {
    iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  })
  return encrypted.ciphertext.toString()
}

export function decrypt(word: any) {
  const encryptedHexStr = CryptoJS.enc.Hex.parse(word)
  const src = CryptoJS.enc.Base64.stringify(encryptedHexStr)
  const decrypt = CryptoJS.AES.decrypt(src, key, {
    iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  })
  const decryptedStr = decrypt.toString(CryptoJS.enc.Utf8)
  return decryptedStr.toString()
}
