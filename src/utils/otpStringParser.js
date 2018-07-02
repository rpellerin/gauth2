export default string => {
  const result = decodeURIComponent(string)
  // ?: means non-capturing group
  const regexResult = result.match(/otpauth:\/\/totp\/(?:(.*?):)?(.*?)\?/)
  if (regexResult) {
    const [, issuer1, accountName] = regexResult
    const secret = result.match(/(?:\?|&)secret=(.*?)(?:$|&)/)[1]
    const regexResult2 = result.match(/(?:\?|&)issuer=(.*?)(?:$|&)/)
    const issuer =
      issuer1 || (regexResult2 ? regexResult2[1] : 'Unknown issuer')
    return {
      accountName: `${issuer} (${accountName})`,
      secret
    }
  } else {
    throw new Error('String cannot be parsed')
  }
}
