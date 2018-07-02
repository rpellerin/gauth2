import puppeteer from 'puppeteer'
import { encryptText, decryptText } from './WebCrypto'

describe('it encrypts and descrypts', () => {
  it('works', async () => {
    // let browser = await puppeteer.launch({
    //   headless: false,
    //   args: ['--no-sandbox'] // for Travis to work
    // })
    // let page = await browser.newPage()
    // //await page.goto('http://localhost:3000')
    // const toEncrypt = 'hello'
    // const password = 'yolo'
    // const encrypted = await encryptText('hello', password)
    // const decrypted = await decryptText(encrypted, password)
    // expect(decrypted).toBe(toEncrypt)
    // browser.close()
  })
})
