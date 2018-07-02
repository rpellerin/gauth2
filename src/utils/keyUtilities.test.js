import { generate } from './keyUtilities'

describe('gauth.KeyUtilities', () => {
  describe('#generate()', () => {
    it('respond with known key', () => {
      expect(generate('JBSWY3DPEHPK3PXP', Date.UTC(1981, 1, 1) / 1000.0)).toBe(
        '684675'
      )
    })
  })
})
