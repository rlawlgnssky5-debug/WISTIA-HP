const assert = require('node:assert/strict')
const { chromium } = require(process.env.WISTIA_NODE_MODULES + '/playwright')

;(async () => {
  const browser = await chromium.launch({ headless: true, executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe' })
  try {
    for (const width of [320, 390]) {
      const page = await browser.newPage({ viewport: { width, height: 800 }, reducedMotion: 'reduce' })
      await page.clock.install()
      const errors = []
      page.on('pageerror', error => errors.push(error.message))
      await page.addInitScript(() => {
        window.__metaEvents = []
        window.__analyticsRoutes = []
        let analytics
        Object.defineProperty(window, 'wistiaAnalytics', {
          configurable: true,
          get: () => analytics,
          set: value => {
            analytics = value
            const original = value.startPageTracking
            value.startPageTracking = (...args) => { if (window.__analyticsRoutes.at(-1) !== args[0]) window.__analyticsRoutes.push(args[0]); return original(...args) }
          }
        })
        let tracker
        Object.defineProperty(window, 'wistiaMeta', {
          configurable: true,
          get: () => tracker,
          set: value => {
            tracker = value
            for (const name of ['trackPageView', 'trackViewContent', 'trackScrollDepth', 'trackTimeOnPage', 'trackViewPrice']) {
              value[name] = (...args) => { window.__metaEvents.push({ name, args }); return true }
            }
          }
        })
      })
      await page.goto('http://127.0.0.1:4173/#/detail/solo', { waitUntil: 'domcontentloaded' })
      await page.waitForFunction(() => window.__metaEvents.some(event => event.name === 'trackViewContent'))
      assert.deepEqual(await page.evaluate(() => window.__analyticsRoutes), ['#/detail/solo'])
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
      await page.waitForTimeout(200)
      const scroll = await page.evaluate(() => window.__metaEvents.filter(event => event.name === 'trackScrollDepth'))
      assert.deepEqual([...new Set(scroll.map(event => event.args[0]))], [25, 50, 75, 100])
      assert.ok(scroll.every(event => event.args[1] === '#/detail/solo'))
      assert.equal(await page.evaluate(() => window.__metaEvents.some(event => event.name === 'trackViewPrice')), false)
      await page.evaluate(() => { location.hash = '#/event/solo' })
      await page.waitForFunction(() => document.querySelector('.booking-base-amount'))
      assert.deepEqual(await page.evaluate(() => window.__analyticsRoutes), ['#/detail/solo', '#/event/solo'])
      await page.locator('.booking-base-amount').scrollIntoViewIfNeeded()
      await page.waitForFunction(() => window.__metaEvents.some(event => event.name === 'trackViewPrice'))
      const price = await page.evaluate(() => window.__metaEvents.find(event => event.name === 'trackViewPrice').args[0])
      assert.deepEqual(price.content_ids, ['solo'])
      assert.equal(price.value, 120000)
      assert.equal(price.currency, 'KRW')
      await page.clock.fastForward(30000)
      const time = await page.evaluate(() => window.__metaEvents.filter(event => event.name === 'trackTimeOnPage'))
      assert.deepEqual(time.map(event => event.args), [[30, '#/event/solo']])
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false)
      assert.deepEqual(errors, [])
      await page.close()
    }
  } finally {
    await browser.close()
  }
  console.log('Meta engagement scroll and price visibility checks passed at 320px and 390px')
})().catch(error => { console.error(error); process.exitCode = 1 })
