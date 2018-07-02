// https://gist.github.com/chrisveness/43bcda93af9f646d083fad678071b90a

let encryptText = async (plainText, password) => {
  const ptUtf8 = new TextEncoder().encode(plainText)

  const pwUtf8 = new TextEncoder().encode(password)
  const pwHash = await crypto.subtle.digest('SHA-256', pwUtf8)

  const iv = crypto.getRandomValues(new Uint8Array(16))
  const alg = { name: 'AES-GCM', iv: iv }
  const key = await crypto.subtle.importKey('raw', pwHash, alg, false, [
    'encrypt'
  ])

  const ctBuffer = await crypto.subtle.encrypt(alg, key, ptUtf8)
  const ctArray = Array.from(new Uint8Array(ctBuffer)) // ciphertext as byte array
  const ctStr = ctArray.map(byte => String.fromCharCode(byte)).join('') // ciphertext as string
  const ctBase64 = btoa(ctStr) // encode ciphertext as base64

  const ivHex = Array.from(iv)
    .map(b => ('00' + b.toString(16)).slice(-2))
    .join('') // iv as hex string
  return ivHex + ctBase64
}

let decryptText = async (ciphertext, password) => {
  const pwUtf8 = new TextEncoder().encode(password)
  const pwHash = await crypto.subtle.digest('SHA-256', pwUtf8)

  const ivHex = ciphertext.slice(0, 32)
  const _iv = ivHex.match(/.{2}/g).map(byte => parseInt(byte, 16)) // get iv from ciphertext
  const iv = new Uint8Array(_iv)

  const alg = { name: 'AES-GCM', iv }
  const key = await crypto.subtle.importKey('raw', pwHash, alg, false, [
    'decrypt'
  ])

  const ctStr = atob(ciphertext.slice(32))
  const ctBuffer = new Uint8Array(
    ctStr.match(/[\s\S]/g).map(ch => ch.charCodeAt(0))
  ) // ciphertext as Uint8Array

  const ptBuffer = await crypto.subtle.decrypt(alg, key, ctBuffer)

  const plaintext = new TextDecoder().decode(ptBuffer)

  return plaintext
}

export { encryptText, decryptText }
