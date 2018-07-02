import JsSHA from 'jssha'

// Originally based on the JavaScript implementation as provided by Russell Sayers on his Tin Isles blog:
// http://blog.tinisles.com/2011/10/google-authenticator-one-time-password-algorithm-in-javascript/

const dec2hex = s => (s < 15.5 ? '0' : '') + Math.round(s).toString(16)

const hex2dec = s => parseInt(s, 16)

const base32tohex = base32 => {
  const base32chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'
  let bits = ''
  let hex = ''

  for (let i = 0; i < base32.length; i++) {
    let val = base32chars.indexOf(base32.charAt(i).toUpperCase())
    bits += val.toString(2).padStart(5, '0')
  }

  for (let i = 0; i + 4 <= bits.length; i += 4) {
    let chunk = bits.substr(i, 4)
    hex = hex + parseInt(chunk, 2).toString(16)
  }
  return hex
}

export const generate = (secret, _epoch) => {
  let key = base32tohex(secret)

  // HMAC generator requires secret key to have even number of nibbles
  if (key.length % 2 !== 0) {
    key += '0'
  }

  // If no time is given, set time as now
  const epoch =
    typeof _epoch === 'undefined'
      ? Math.round(new Date().getTime() / 1000.0)
      : _epoch

  const time = dec2hex(Math.floor(epoch / 30)).padStart(16, '0')

  // external library for SHA functionality
  const hmacObj = new JsSHA('SHA-1', 'HEX')
  hmacObj.setHMACKey(key, 'HEX')
  hmacObj.update(time)
  const hmac = hmacObj.getHMAC('HEX')

  const offset =
    hmac !== 'KEY MUST BE IN BYTE INCREMENTS'
      ? hex2dec(hmac.substring(hmac.length - 1))
      : 0

  const otp = (hex2dec(hmac.substr(offset * 2, 8)) & hex2dec('7fffffff')) + ''
  return otp.substr(otp.length - 6, 6).toString()
}
