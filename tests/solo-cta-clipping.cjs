const { chromium } = require(process.env.WISTIA_NODE_MODULES + '/playwright')
const assert = require('node:assert/strict')

const EDGE = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'
const BASE = process.env.WISTIA_BASE || 'http://127.0.0.1:4173/'

;(async () => {
  const browser = await chromium.launch({ headless: true, executablePath: EDGE })
  try {
    for (const width of [901, 1280]) {
      const page = await browser.newPage({ viewport: { width, height: 700 }, reducedMotion: 'reduce' })
      await page.goto(`${BASE}?cta-clipping=1#/detail/solo`, { waitUntil: 'domcontentloaded' })
      const cta = page.locator('#soloDesktopCta')
      await cta.waitFor()
      await cta.hover()
      await page.waitForTimeout(300)

      const buttons = await cta.locator('a').evaluateAll(nodes => nodes.map(node => {
        const icon = node.querySelector('.cta-icon').getBoundingClientRect()
        const label = node.querySelector('.cta-label').getBoundingClientRect()
        const full = node.querySelector('.cta-full').getBoundingClientRect()
        const arrow = node.querySelector('.cta-arrow').getBoundingClientRect()
        const box = node.getBoundingClientRect()
        return {
          buttonWidth: box.width,
          labelWidth: label.width,
          labelHeight: label.height,
          fullWidth: full.width,
          fullHeight: full.height,
          iconRight: icon.right,
          labelLeft: label.left,
          labelRight: label.right,
          arrowLeft: arrow.left,
          buttonRight: box.right,
          viewportWidth: innerWidth,
          columns: getComputedStyle(node).gridTemplateColumns.split(' ').length
        }
      }))

      for (const button of buttons) {
        assert.equal(button.columns, 3, 'desktop CTA must keep icon, copy and arrow in separate columns')
        assert.ok(button.buttonWidth >= 300, 'expanded CTA must reserve enough width for Korean copy')
        assert.ok(button.fullWidth <= button.labelWidth, 'expanded CTA copy must not be clipped horizontally')
        assert.ok(button.fullHeight <= button.labelHeight, 'expanded CTA copy must not be clipped vertically')
        assert.ok(button.iconRight <= button.labelLeft && button.labelRight <= button.arrowLeft, 'CTA columns must not overlap')
        assert.ok(button.buttonRight <= button.viewportWidth, 'CTA must remain inside the viewport')
      }
      await page.close()
    }
    console.log('solo CTA clipping checks passed')
  } finally {
    await browser.close()
  }
})().catch(error => {
  console.error(error)
  process.exit(1)
})
