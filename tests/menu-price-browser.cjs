const assert = require('node:assert/strict')
const { chromium } = require(process.env.WISTIA_NODE_MODULES + '/playwright')

;(async () => {
  const browser = await chromium.launch({ headless: true, executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe' })
  try {
    for (const width of [320, 390]) {
      const page = await browser.newPage({ viewport: { width, height: 700 }, reducedMotion: 'reduce' })
      const errors = []
      page.on('pageerror', error => errors.push(error.message))
      await page.goto('http://127.0.0.1:4173/#/detail/solo', { waitUntil: 'domcontentloaded' })
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight / 2))
      await page.waitForTimeout(100)
      await page.locator('#menuToggle').click()
      assert.equal(await page.locator('body').evaluate(node => node.classList.contains('menu-open')), true)
      await page.locator('#mainMenu').evaluate(node => { node.scrollTop = node.scrollHeight })
      await page.waitForTimeout(100)
      const header = await page.locator('#siteHeader').boundingBox()
      const toggle = await page.locator('#menuToggle').boundingBox()
      assert.ok(header && Math.abs(header.y) < 1, `header position at ${width}px`)
      assert.ok(toggle && toggle.y >= 0 && toggle.y + toggle.height <= 700, `close button at ${width}px`)
      await page.locator('#menuToggle').click()
      assert.equal(await page.locator('body').evaluate(node => node.classList.contains('menu-open')), false)
      assert.equal(await page.locator('html').evaluate(node => node.scrollWidth > innerWidth), false)
      assert.match(await page.locator('.booking-guide').innerText(), /3회까지 무료/)

      await page.evaluate(() => { location.hash = '#/event/solo' })
      await page.waitForFunction(() => document.body.dataset.page === 'event')
      assert.equal(await page.locator('.booking-calculator').getByText('추가 수정 안내').count(), 0)
      assert.equal(await page.locator('.booking-calculator .option-notice').count(), 0)
      assert.equal(await page.locator('html').evaluate(node => node.scrollWidth > innerWidth), false)
      assert.deepEqual(errors, [])
      await page.close()
    }
  } finally {
    await browser.close()
  }
  console.log('Fixed menu header and price notice checks passed at 320px/390px')
})().catch(error => { console.error(error); process.exitCode = 1 })
