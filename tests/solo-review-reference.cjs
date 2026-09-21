const { chromium } = require(process.env.WISTIA_NODE_MODULES + '/playwright')
const assert = require('node:assert/strict')

const EDGE = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'
const BASE = process.env.WISTIA_BASE || 'http://127.0.0.1:4173/'

async function openSolo(browser, viewport, reducedMotion = 'no-preference') {
  const page = await browser.newPage({ viewport, reducedMotion })
  await page.goto(`${BASE}?review-reference=1#/detail/solo`, { waitUntil: 'domcontentloaded' })
  await page.locator('[data-review-showcase]').waitFor()
  return page
}

async function testDesktopReference(browser) {
  const page = await openSolo(browser, { width: 1280, height: 900 })
  const review = page.locator('[data-review-showcase]')
  await review.scrollIntoViewIfNeeded()
  assert.equal(await review.locator('[data-review-slide]').count(), 11)
  assert.equal(await review.locator('.solo-review-rule').count(), 1)
  assert.equal(await review.locator('.solo-review-index').count(), 1)
  assert.equal(await review.locator('.solo-review-phone-bezel').count(), 1)
  assert.equal(await review.locator('.solo-review-statusbar').count(), 1)
  assert.equal(await review.locator('.solo-review-rail-label').innerText(), 'NEXT REVIEW')
  assert.equal(await review.locator('[data-solo-review-next]').count(), 1)
  assert.equal(await review.locator('[data-solo-review-prev]').count(), 0)

  const metrics = await review.evaluate(section => {
    const box = section.getBoundingClientRect()
    const copy = section.querySelector('.solo-review-copy').getBoundingClientRect()
    const phoneElement = section.querySelector('.solo-review-phone')
    const phone = phoneElement.getBoundingClientRect()
    const rail = section.querySelector('.solo-review-navigation').getBoundingClientRect()
    return {
      width: box.width,
      height: box.height,
      background: getComputedStyle(section).backgroundColor,
      copyLeft: (copy.left - box.left) / box.width,
      copyTop: (copy.top - box.top) / box.height,
      copyWidth: copy.width / box.width,
      phoneLeft: (phone.left - box.left) / box.width,
      phoneTop: (phone.top - box.top) / box.height,
      phoneWidth: phone.width / box.width,
      phoneHeight: phone.height / box.width,
      phoneRadius: parseFloat(getComputedStyle(phoneElement).borderRadius) / box.width,
      railRight: (box.right - rail.right) / box.width,
      titleSize: parseFloat(getComputedStyle(section.querySelector('h2')).fontSize),
      overflow: document.documentElement.scrollWidth - innerWidth
    }
  })
  assert.ok(Math.abs(metrics.height / metrics.width - 700 / 1200) < .03, 'stage should preserve the 1200×700 reference ratio')
  assert.equal(metrics.background, 'rgb(7, 7, 7)')
  assert.ok(Math.abs(metrics.copyLeft - 72 / 1200) < .02)
  assert.ok(Math.abs(metrics.copyTop - 136 / 700) < .03)
  assert.ok(Math.abs(metrics.copyWidth - 405 / 1200) < .03)
  assert.ok(Math.abs(metrics.phoneLeft - 535 / 1200) < .025)
  assert.ok(Math.abs(metrics.phoneTop - 48 / 700) < .03)
  assert.ok(Math.abs(metrics.phoneWidth - 500 / 1200) < .025)
  assert.ok(Math.abs(metrics.phoneHeight - 795 / 1200) < .03)
  assert.ok(Math.abs(metrics.phoneRadius - 78 / 1200) < .02)
  assert.ok(Math.abs(metrics.railRight - 54 / 1200) < .025)
  assert.ok(metrics.titleSize >= 23 && metrics.titleSize <= 25)
  assert.equal(metrics.overflow <= 1, true)

  await review.locator('[data-solo-review-next]').click()
  await page.waitForTimeout(900)
  assert.match(await review.locator('.solo-review-index').innerText(), /02\s*11/)
  assert.equal(await review.locator('[data-review-slide="1"].is-active').count(), 1)
  assert.match(await review.locator('[data-review-slide="0"]').getAttribute('class'), /is-leaving/)
  await page.close()
}

async function testMobileAndReducedMotion(browser) {
  const page = await openSolo(browser, { width: 390, height: 844 }, 'reduce')
  const review = page.locator('[data-review-showcase]')
  await review.scrollIntoViewIfNeeded()
  const metrics = await review.evaluate(section => {
    const box = section.getBoundingClientRect()
    const copy = section.querySelector('.solo-review-kicker').getBoundingClientRect()
    const phone = section.querySelector('.solo-review-phone').getBoundingClientRect()
    const rail = section.querySelector('.solo-review-navigation')
    const slide = section.querySelector('.solo-review-slide')
    return {
      height: box.height,
      copyTop: copy.top - box.top,
      phoneTop: phone.top - box.top,
      phoneWidth: phone.width,
      railDisplay: getComputedStyle(rail).display,
      transition: getComputedStyle(slide).transitionDuration,
      overflow: document.documentElement.scrollWidth - innerWidth
    }
  })
  assert.ok(metrics.height >= 940 && metrics.height <= 980)
  assert.ok(metrics.copyTop >= 70 && metrics.copyTop <= 82)
  assert.ok(metrics.phoneTop >= 380 && metrics.phoneTop <= 405)
  assert.ok(metrics.phoneWidth >= 385 && metrics.phoneWidth <= 390)
  assert.equal(metrics.railDisplay, 'none')
  assert.equal(metrics.transition, '0s')
  assert.equal(metrics.overflow <= 1, true)
  await page.close()
}

;(async () => {
  const browser = await chromium.launch({ headless: true, executablePath: EDGE })
  try {
    await testDesktopReference(browser)
    await testMobileAndReducedMotion(browser)
    console.log('solo review reference checks passed')
  } finally {
    await browser.close()
  }
})().catch(error => {
  console.error(error)
  process.exitCode = 1
})
