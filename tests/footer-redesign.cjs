const { chromium } = require(process.env.WISTIA_NODE_MODULES + '/playwright')
const assert = require('node:assert/strict')

const EDGE = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'
const BASE = process.env.WISTIA_BASE || 'http://127.0.0.1:4173/'

;(async () => {
  const browser = await chromium.launch({ headless: true, executablePath: EDGE })
  try {
    for (const viewport of [{ width: 1280, height: 900 }, { width: 390, height: 844 }]) {
      const page = await browser.newPage({ viewport, reducedMotion: 'reduce' })
      await page.goto(`${BASE}?footer-redesign=1#/detail/solo`, { waitUntil: 'domcontentloaded' })
      const footer = page.locator('.footer')
      await footer.waitFor()

      assert.equal(await footer.locator('.footer-main').count(), 1)
      assert.equal(await footer.locator('.footer-social a').count(), 3)
      assert.equal(await footer.locator('.footer-social svg').count(), 3)
      assert.equal(await footer.locator('.footer-bottom').count(), 1)
      assert.match(await footer.innerText(), /목소리와 장면/)
      assert.match(await footer.innerText(), /WISTIA/)

      const metrics = await footer.evaluate(node => {
        const box = node.getBoundingClientRect()
        const parent = node.parentElement.getBoundingClientRect()
        const style = getComputedStyle(node)
        return {
          left: box.left,
          right: box.right,
          parentLeft: parent.left,
          parentRight: parent.right,
          background: style.backgroundColor,
          color: style.color
        }
      })
      assert.ok(Math.abs(metrics.left - metrics.parentLeft) < 1)
      assert.ok(Math.abs(metrics.right - metrics.parentRight) < 1)
      assert.equal(metrics.background, 'rgb(31, 34, 35)')
      assert.equal(metrics.color, 'rgb(244, 245, 245)')

      await page.close()
    }
    console.log('footer redesign checks passed')
  } finally {
    await browser.close()
  }
})().catch(error => {
  console.error(error)
  process.exit(1)
})
