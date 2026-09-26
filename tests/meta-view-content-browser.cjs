const assert = require('node:assert/strict')
const { chromium } = require(process.env.WISTIA_NODE_MODULES + '/playwright')

;(async () => {
  const browser = await chromium.launch({ headless: true, executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe' })
  try {
    for (const width of [320, 390]) {
      const page = await browser.newPage({ viewport: { width, height: 800 }, reducedMotion: 'reduce' })
      const warnings = []
      page.on('pageerror', error => console.error('page error:', error.message))
      page.on('console', message => { if (message.type() === 'warning' && message.text().includes('[wistiaMeta]')) warnings.push(message.text()) })
      await page.addInitScript(() => {
        window.__viewContentEvents = []
        let tracker
        Object.defineProperty(window, 'wistiaMeta', {
          configurable: true,
          get: () => tracker,
          set: value => {
            tracker = value
            value.trackViewContent = payload => {
              window.__viewContentEvents.push(JSON.parse(JSON.stringify(payload)))
              return true
            }
          }
        })
      })
      await page.goto('http://127.0.0.1:4173/#/', { waitUntil: 'domcontentloaded' })
      await page.waitForFunction(() => window.wistiaMeta?.trackViewContent)
      assert.equal(await page.evaluate(() => window.__viewContentEvents.length), 0)

      const expected = [
        ['#/detail/solo', 'solo', 120000],
        ['#/detail/duo', 'duo', 160000],
        ['#/detail/solo-film/solo', 'solo-film-1p', 220000],
        ['#/detail/solo-film/duo', 'solo-film-2p', 280000],
        ['#/detail/wedding', 'wedding', 350000],
        ['#/detail/proposal', 'proposal', 290000],
        ['#/detail/duet-film', 'duet-film', 350000]
      ]
      for (const [hash, id, price] of expected) {
        const previousCount = await page.evaluate(() => window.__viewContentEvents.length)
        await page.evaluate(next => { location.hash = next }, hash)
        await page.waitForFunction(count => window.__viewContentEvents.length > count, previousCount, { timeout: 5000 }).catch(async error => {
          console.error('route state:', await page.evaluate(() => ({ hash: location.hash, events: window.__viewContentEvents, route: typeof route, tracker: Object.keys(window.wistiaMeta || {}) })))
          throw error
        })
        const payload = await page.evaluate(() => window.__viewContentEvents.at(-1))
        assert.deepEqual(payload.content_ids, [id])
        assert.equal(payload.value, price)
        assert.equal(payload.content_type, 'product')
        assert.equal(payload.currency, 'KRW')
        await page.waitForTimeout(100)
      }
      const detailEventCount = await page.evaluate(() => window.__viewContentEvents.length)
      for (const hash of ['#/', '#/events', '#/event/solo', '#/info/about', '#/info/faq', '#/before-after']) {
        await page.evaluate(next => { location.hash = next }, hash)
        await page.waitForTimeout(100)
        assert.equal(await page.evaluate(() => window.__viewContentEvents.length), detailEventCount)
      }
      await page.evaluate(() => {
        delete window.wistiaMeta.trackViewContent
        location.hash = '#/detail/solo'
      })
      await page.waitForFunction(() => location.hash === '#/detail/solo' && document.body.dataset.page === 'detail')
      await page.waitForTimeout(100)
      assert.ok(warnings.some(message => message.includes('trackViewContent missing')))
      assert.equal(await page.evaluate(() => window.__viewContentEvents.length), detailEventCount)
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false)
      await page.close()
    }
  } finally {
    await browser.close()
  }
  console.log('ViewContent detail routing and 320px/390px layout checks passed')
})().catch(error => { console.error(error); process.exitCode = 1 })
