const { chromium } = require(process.env.WISTIA_NODE_MODULES + '/playwright')
const assert = require('node:assert/strict')

const EDGE = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'
const BASE = process.env.WISTIA_BASE || 'http://127.0.0.1:4173/'

;(async () => {
  const browser = await chromium.launch({ headless: true, executablePath: EDGE })
  try {
    const page = await browser.newPage({ viewport: { width: 500, height: 900 } })
    await page.goto(`${BASE}?faq-ratio-refresh=1#/detail/solo`, { waitUntil: 'domcontentloaded' })

    const ratioTrack = page.locator('.wistia-ar__ratio-line')
    const trackStyle = await ratioTrack.evaluate(node => {
      const style = getComputedStyle(node)
      return { width: parseFloat(style.width), radius: style.borderRadius, background: style.backgroundColor }
    })
    assert.ok(trackStyle.width >= 10, 'vertical ratio control must read as a thick draggable track')
    assert.notEqual(trackStyle.radius, '0px')
    assert.notEqual(trackStyle.background, 'rgba(0, 0, 0, 0)')

    const faq = page.locator('.worry-section')
    const layout = await faq.evaluate(root => {
      const rootBox = root.getBoundingClientRect()
      const list = root.querySelector('.faq-list').getBoundingClientRect()
      const cta = root.querySelector('.solo-inline-contact').getBoundingClientRect()
      const ctaStyle = getComputedStyle(root.querySelector('.solo-inline-contact'))
      return {
        listRatio: list.width / rootBox.width,
        listOffset: list.left - rootBox.left,
        ctaRatio: cta.width / rootBox.width,
        ctaOffset: cta.left - rootBox.left,
        ctaBackground: ctaStyle.backgroundColor,
        ctaRadius: parseFloat(ctaStyle.borderRadius)
      }
    })
    assert.ok(layout.listRatio <= .68, 'FAQ list should be roughly half-width')
    assert.ok(layout.listOffset > 40, 'FAQ list should sit to the right')
    assert.ok(layout.ctaRatio <= .68 && layout.ctaOffset > 40, 'consultation CTA should align with the FAQ list')
    assert.equal(layout.ctaBackground, 'rgb(31, 34, 35)')
    assert.ok(layout.ctaRadius >= 14)
    assert.match(await faq.locator('.solo-inline-contact').innerText(), /더 궁금한 점이 있나요\?\s*상담하기/)

    const first = faq.locator('details').first()
    await first.locator('summary').click()
    assert.equal(await first.getAttribute('open'), '')
    assert.equal(await first.locator('p').evaluate(node => getComputedStyle(node).animationName), 'solo-faq-answer-in')
    assert.ok(await faq.evaluate(root => document.documentElement.scrollWidth - innerWidth <= 1))
    console.log('solo FAQ and ratio control refresh checks passed')
  } finally {
    await browser.close()
  }
})().catch(error => {
  console.error(error)
  process.exit(1)
})
