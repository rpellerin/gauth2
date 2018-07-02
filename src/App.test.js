import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import App from 'App'
import store from './reducers'
import serve from 'webpack-serve'
import config from '../webpack.config.js'
import puppeteer from 'puppeteer'

let server
let browser

describe('App', () => {
  beforeAll(async () => {
    server = await serve({ config })
    await new Promise((resolve, reject) => server.on('build-finished', resolve))
  }, 15000)
  afterAll(async () => {
    await new Promise((resolve, reject) => server.close(resolve))
    await browser.close()
  })
  it(
    'renders without crashing',
    () => {
      const div = document.createElement('div')
      store().then(store => {
        ReactDOM.render(
          <Provider store={store}>
            <App />
          </Provider>,
          div
        )
      })
    },
    10000
  )
  it(
    'works',
    async () => {
      if (!browser) {
        browser = await puppeteer.launch({
          headless:
            process.env.NO_HEADLESS && process.env.NO_HEADLESS === '1'
              ? false
              : true,
          args: ['--no-sandbox'] // for Travis to work
        })
      }

      let page = await browser.newPage()
      page.setViewport({ height: 1200, width: 1200 })
      await page.goto('http://localhost:8080')
      await page.waitForSelector('form')

      // Adding data
      await page.evaluate(() => {
        window.localStorage.setItem(
          'accounts',
          JSON.stringify([{ accountName: 'Yolo', secret: '1' }])
        )
      })
      await page.reload()

      // Mocking date
      await page.evaluate(() => {
        var date = Date.UTC(2018, 7, 1, 15, 3, 0)
        window.Date = new Proxy(Date, {
          construct: function(target, args) {
            if (args.length === 0) {
              return new target(date)
            }
            return new target(...args)
          }
        })
      })

      await page.waitForSelector('.timeLeft span')
      await page.waitForSelector('.accountRow .otp input[value="722678"]')
      const screenshot = await page.screenshot('src/__image_snapshots/app.png')
      expect(screenshot).toMatchImageSnapshot()
      const accountName = await page.$eval('div.accountName', e => e.innerHTML)
      expect(accountName).toBe('Yolo')
      const otp = await page.$eval('.accountRow .otp input', i => i.value)
      expect(otp).toBe('722678')
    },
    10000
  )
})
