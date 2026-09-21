const { chromium } = require(process.env.WISTIA_NODE_MODULES + '/playwright')
const assert = require('node:assert/strict')

const EDGE = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'
const BASE = process.env.WISTIA_BASE || 'http://127.0.0.1:4173/'

;(async () => {
  const browser = await chromium.launch({ headless: true, executablePath: EDGE })
  try {
    const page = await browser.newPage({ viewport: { width: 500, height: 1000 } })
    await page.goto(`${BASE}?review-story-refresh=1#/detail/solo`, { waitUntil: 'domcontentloaded' })

    const review = page.locator('.solo-review-carousel')
    await review.waitFor()
    assert.equal(await review.locator('.solo-review-phone').count(), 0, 'phone mockup must be removed')
    assert.equal(await review.locator('.review-capture').count(), 22, 'review cards and seamless clones must render')
    assert.match(await review.innerText(), /실제 고객 후기/)
    const reviewStyle = await review.evaluate(node => ({
      background: getComputedStyle(node).backgroundColor,
      overflow: document.documentElement.scrollWidth - innerWidth
    }))
    assert.equal(reviewStyle.background, 'rgb(8, 9, 9)')
    assert.ok(reviewStyle.overflow <= 1)

    const story = page.locator('.ar-expert-story')
    await story.waitFor()
    assert.match(await story.locator('.ar-story-intro').innerText(), /같은 소스여도,\s*전문가들과 함께라면 다릅니다/)
    assert.equal((await story.locator('[data-expert-card].is-active .ar-story-role').innerText()).trim(), '영상 연출')
    const hierarchy = await story.evaluate(node => ({
      title: parseFloat(getComputedStyle(node.querySelector('.ar-story-intro h2')).fontSize),
      role: parseFloat(getComputedStyle(node.querySelector('.ar-story-role')).fontSize),
      topBreathingRoom: parseFloat(getComputedStyle(node.closest('.solo-editorial-sheet')).borderTopWidth),
      topBreathingColor: getComputedStyle(node.closest('.solo-editorial-sheet')).borderTopColor,
      copyAreaHeight: node.querySelector('.ar-story-image').getBoundingClientRect().top - node.querySelector('.ar-story-slide').getBoundingClientRect().top,
      sectionHeight: node.getBoundingClientRect().height
    }))
    assert.ok(hierarchy.title > hierarchy.role, 'section message must be larger than the slide role')
    assert.ok(hierarchy.topBreathingRoom >= 24, 'brand story should retain a small separator below reviews')
    assert.equal(hierarchy.topBreathingColor, 'rgb(255, 255, 255)', 'the separator must continue the white brand-story surface')
    assert.ok(hierarchy.copyAreaHeight <= 150, 'brand story copy area should be compact')
    assert.ok(hierarchy.sectionHeight <= 650, 'brand story vertical space should be roughly half the oversized layout')

    await page.waitForFunction(() => document.querySelector('[data-expert-track]')?.dataset.index === '1', null, { timeout: 7000 })
    assert.equal((await story.locator('[data-expert-card].is-active .ar-story-role').innerText()).trim(), '사운드 완성')
    await page.waitForFunction(() => document.querySelector('[data-expert-track]')?.dataset.index === '0', null, { timeout: 7000 })

    const reduced = await browser.newPage({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' })
    await reduced.goto(`${BASE}?review-reduced-motion=1#/detail/solo`, { waitUntil: 'domcontentloaded' })
    const reducedReview = reduced.locator('.solo-review-carousel')
    await reducedReview.waitFor()
    const reducedStart = await reducedReview.locator('.review-loop').evaluate(node => getComputedStyle(node).transform)
    await reduced.waitForTimeout(500)
    const reducedEnd = await reducedReview.locator('.review-loop').evaluate(node => getComputedStyle(node).transform)
    assert.equal(reducedEnd, reducedStart, 'review carousel must remain still for reduced-motion users')
    const introInset = await reduced.locator('.ar-story-intro h2').evaluate(node => node.getBoundingClientRect().left)
    assert.ok(introInset >= 23, 'brand story heading should align with the mobile slide gutter')
    await reduced.close()

    console.log('solo review and brand story refresh checks passed')
  } finally {
    await browser.close()
  }
})().catch(error => {
  console.error(error)
  process.exit(1)
})
