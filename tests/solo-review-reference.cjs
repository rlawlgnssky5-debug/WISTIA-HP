const { chromium } = require(process.env.WISTIA_NODE_MODULES + '/playwright')
const assert = require('node:assert/strict')

const EDGE = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'
const BASE = process.env.WISTIA_BASE || 'http://127.0.0.1:4173/'

;(async () => {
  const browser = await chromium.launch({ headless: true, executablePath: EDGE })
  try {
    for (const width of [390, 1280]) {
      const page = await browser.newPage({ viewport: { width, height: 900 } })
      await page.goto(`${BASE}?review-reference=2#/detail/solo`, { waitUntil: 'domcontentloaded' })
      const review = page.locator('.solo-review-carousel')
      await review.waitFor()
      assert.equal(await review.locator('.solo-review-phone').count(), 0)
      assert.equal(await review.locator('.review-capture').count(), 22)
      assert.equal(await review.locator('.review-carousel-controls button').count(), 2)
      assert.match(await review.innerText(), /실제 고객 후기/)
      const metrics = await review.evaluate(section => ({
        background: getComputedStyle(section).backgroundColor,
        visibleWidth: section.getBoundingClientRect().width,
        overflow: document.documentElement.scrollWidth - innerWidth
      }))
      assert.equal(metrics.background, 'rgb(8, 9, 9)')
      assert.ok(metrics.visibleWidth <= width)
      assert.ok(metrics.overflow <= 1)
      await page.close()
    }
    console.log('solo review reference checks passed')
  } finally {
    await browser.close()
  }
})().catch(error => {
  console.error(error)
  process.exitCode = 1
})
