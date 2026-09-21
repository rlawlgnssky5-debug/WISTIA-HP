const { chromium } = require(process.env.WISTIA_NODE_MODULES + '/playwright')
const assert = require('node:assert/strict')

const EDGE = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'
const BASE = process.env.WISTIA_BASE || 'http://127.0.0.1:4173/'

;(async () => {
  const browser = await chromium.launch({ headless: true, executablePath: EDGE })
  try {
    const page = await browser.newPage({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' })
    await page.goto(`${BASE}#/detail/solo`, { waitUntil: 'domcontentloaded' })
    const section = page.locator('#wistiaBeforeAfter')
    await section.waitFor()

    assert.equal((await section.locator('#wistiaBeforeAfterTitle').innerText()).replace(/\s+/g, ' ').trim(), '노래를 잘 못해도 괜찮아요')
    assert.equal(await section.locator('.bap-body').evaluate(node => getComputedStyle(node).backgroundColor), 'rgb(255, 255, 255)')
    await section.locator('[data-mode="after"]').click()
    assert.equal(await section.locator('.bap-body').evaluate(node => getComputedStyle(node).backgroundColor), 'rgb(243, 244, 244)')
    const sectionEdges = await page.evaluate(() => {
      const left = selector => document.querySelector(selector).getBoundingClientRect().left
      const compare = document.querySelector('.ar-compare')
      return {
        compareBackground: getComputedStyle(compare).backgroundColor,
        storyLeft: left('.ar-story-intro'),
        beforeAfterLeft: left('.wistia-ba-copy'),
        compareLeft: left('.ar-compare-intro'),
        storyRadius: getComputedStyle(document.querySelector('.solo-editorial-sheet')).borderBottomLeftRadius
      }
    })
    assert.equal(sectionEdges.compareBackground, 'rgb(89, 89, 89)')
    assert.ok(Math.abs(sectionEdges.storyLeft - sectionEdges.beforeAfterLeft) <= 1)
    assert.ok(Math.abs(sectionEdges.storyLeft - sectionEdges.compareLeft) <= 1)
    assert.equal(sectionEdges.storyRadius, '24px')
    console.log('before/after surface checks passed')
  } finally {
    await browser.close()
  }
})().catch(error => {
  console.error(error)
  process.exitCode = 1
})
