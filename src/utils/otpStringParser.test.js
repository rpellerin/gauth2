import otpStringParser from './otpStringParser'

// Documentation: https://github.com/google/google-authenticator/wiki/Key-Uri-Format

describe('otpStringParser', () => {
  it('parses 2 different issuers + account name', () => {
    expect(
      otpStringParser(
        'otpauth://totp/Example:alice@google.com?secret=JBSWY3DPEHPK3PXP&issuer=Example2'
      )
    ).toEqual({
      accountName: 'Example (alice@google.com)',
      secret: 'JBSWY3DPEHPK3PXP'
    })
  })
  it('parses 1 issuer in label + account name', () => {
    expect(
      otpStringParser(
        'otpauth://totp/:alice@google.com?secret=JBSWY3DPEHPK3PXP&issuer=Example'
      )
    ).toEqual({
      accountName: 'Example (alice@google.com)',
      secret: 'JBSWY3DPEHPK3PXP'
    })
  })
  it('parses 1 issuer as parameter + account name', () => {
    expect(
      otpStringParser(
        'otpauth://totp/Example:alice@google.com?secret=JBSWY3DPEHPK3PXP'
      )
    ).toEqual({
      accountName: 'Example (alice@google.com)',
      secret: 'JBSWY3DPEHPK3PXP'
    })
  })
  it('parses unknown issuer + account name', () => {
    expect(
      otpStringParser('otpauth://totp/alice@google.com?secret=JBSWY3DPEHPK3PXP')
    ).toEqual({
      accountName: 'Unknown issuer (alice@google.com)',
      secret: 'JBSWY3DPEHPK3PXP'
    })
  })
  it('parses all possible parameters', () => {
    expect(
      otpStringParser(
        'otpauth://totp/ACME%20Co:john.doe@email.com?secret=HXDMVJECJJWSRB3HWIZR4IFUGFTMXBOZ&issuer=ACME%20Co&algorithm=SHA1&digits=6&period=30'
      )
    ).toEqual({
      accountName: 'ACME Co (john.doe@email.com)',
      secret: 'HXDMVJECJJWSRB3HWIZR4IFUGFTMXBOZ'
    })
  })
  it('parses url-encoded parameters', () => {
    expect(
      otpStringParser(
        'otpauth://totp/Google%3Aromain.yolo%40gmail.com?secret=secret&issuer=Google'
      )
    ).toEqual({
      accountName: 'Google (romain.yolo@gmail.com)',
      secret: 'secret'
    })
  })
  it('parses account name that is not an email address', () => {
    expect(
      otpStringParser(
        'otpauth://totp/OVH:pr12345-ovh?secret=secret&image=https://www.ovh.com/images/totp/ovh.png'
      )
    ).toEqual({
      accountName: 'OVH (pr12345-ovh)',
      secret: 'secret'
    })
  })
})
