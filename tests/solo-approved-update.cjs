const { chromium } = require(process.env.WISTIA_NODE_MODULES + '/playwright')
const assert = require('node:assert/strict')
const crypto = require('node:crypto')

const EDGE = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'
const BASE = process.env.WISTIA_BASE || 'http://127.0.0.1:4173/'

const hash = buffer => crypto.createHash('sha256').update(buffer).digest('hex')

async function openSolo(browser, options = {}) {
  const page = await browser.newPage({
    viewport: options.viewport || { width: 390, height: 844 },
    reducedMotion: options.reducedMotion || 'reduce'
  })
  await page.goto(`${BASE}?solo-approved-update=1#/detail/solo`, { waitUntil: 'domcontentloaded' })
  await page.locator('.solo-detail-scope').waitFor()
  return page
}

async function testStructureAndReferenceGeometry(browser) {
  const page = await openSolo(browser, { reducedMotion: 'no-preference' })
  const ba = page.locator('#wistiaBeforeAfter')
  await ba.waitFor({ timeout: 5000 })

  const sectionOrder = await page.evaluate(() => {
    const story = document.querySelector('.solo-editorial-sheet')
    const audio = document.querySelector('#wistiaBeforeAfter')
    const compare = document.querySelector('[data-ar-compare]')
    return story.compareDocumentPosition(audio) & Node.DOCUMENT_POSITION_FOLLOWING &&
      audio.compareDocumentPosition(compare) & Node.DOCUMENT_POSITION_FOLLOWING
  })
  assert.ok(sectionOrder, 'Before/After must sit between brand story and comparison')

  const top = await page.evaluate(() => {
    const rect = selector => document.querySelector(selector).getBoundingClientRect()
    const hero = document.querySelector('.ar-hook-hero')
    const copyEnd = hero.querySelector('.ar-hook-copy>p:last-child').getBoundingClientRect()
    const videoStyle = getComputedStyle(hero.querySelector('video'))
    const heroStyle = getComputedStyle(hero)
    return {
      header: rect('#siteHeader').height,
      event: rect('.solo-top-cta').height,
      tabs: rect('.solo-person-tabs').height,
      hero: rect('.ar-hook-hero').height,
      copyBottomGap: rect('.ar-hook-hero').bottom - copyEnd.bottom,
      radius: parseFloat(heroStyle.borderBottomLeftRadius),
      videoTransform: videoStyle.transform,
      videoPosition: videoStyle.objectPosition,
      overflow: document.documentElement.scrollWidth - innerWidth
    }
  })
  assert.ok(Math.abs(top.header - 48) <= 2, `solo header should be 48px, got ${top.header}`)
  assert.ok(Math.abs(top.event - 36) <= 2, `event bar should be 36px, got ${top.event}`)
  assert.ok(Math.abs(top.tabs - 54) <= 2, `person tabs should be 54px, got ${top.tabs}`)
  assert.ok(top.hero >= 430 && top.hero <= 465, `hero should follow the 447px reference, got ${top.hero}`)
  assert.ok(top.copyBottomGap >= 32 && top.copyBottomGap <= 56, 'hero copy should sit slightly above the lower edge')
  assert.ok(top.radius <= 34, 'hero lower rounding should stay shallow')
  assert.notEqual(top.videoTransform, 'none', 'hero video should be zoomed to place the subject inside the marked area')
  assert.equal(top.overflow <= 1, true, '390px layout must not overflow')

  assert.match(await page.locator('.ar-compare-title').innerText(), /위스티아는\s*다릅니다/)
  assert.equal(await page.locator('[data-ar-compare-row]').count(), 4)
  const compareColumns = await page.locator('.ar-compare-table').evaluate(table => {
    const columns = getComputedStyle(table).gridTemplateColumns.split(' ').map(parseFloat)
    const sum = columns.reduce((total, value) => total + value, 0)
    return columns.map(value => value / sum)
  })
  assert.ok(Math.abs(compareColumns[0] - .30) < .025)
  assert.ok(Math.abs(compareColumns[1] - .15) < .025)
  assert.ok(Math.abs(compareColumns[2] - .55) < .025)
  const compareGeometry = await page.locator('.ar-compare-table').evaluate(table => {
    const tableRect = table.getBoundingClientRect()
    const shellRect = table.closest('.shell').getBoundingClientRect()
    const headRect = table.querySelector('.ar-compare-head > strong').getBoundingClientRect()
    const firstCellRect = table.querySelector('.ar-compare-row .ar-compare-wistia').getBoundingClientRect()
    return {
      rightAlignment: Math.abs(tableRect.right - shellRect.right),
      headerGap: firstCellRect.top - headRect.bottom
    }
  })
  assert.ok(compareGeometry.rightAlignment <= 1, 'comparison table should align to the shared right edge')
  assert.ok(Math.abs(compareGeometry.headerGap) <= 1, 'WISTIA header should connect directly to its first row')

  const process = await page.locator('[data-process-studio]').evaluate(section => {
    const feature = section.querySelector('[data-process-feature]').getBoundingClientRect()
    const photo = section.querySelector('.wps-photo').getBoundingClientRect()
    const content = section.querySelector('.wps-content').getBoundingClientRect()
    const chapters = section.querySelector('.wps-chapters')
    return {
      stacked: photo.bottom <= content.top + 1,
      contained: feature.left >= section.getBoundingClientRect().left && feature.right <= section.getBoundingClientRect().right,
      chapterScrollable: chapters.scrollWidth >= chapters.clientWidth,
      chapterCount: section.querySelectorAll('[data-process-chapter]').length
    }
  })
  assert.equal(process.stacked, false)
  assert.equal(process.contained, true)
  assert.equal(process.chapterScrollable, true)
  assert.equal(process.chapterCount, 7)

  const baLayout = await ba.evaluate(section => ({
    columns: getComputedStyle(section.querySelector('.wistia-ba-layout')).gridTemplateColumns,
    background: getComputedStyle(section).backgroundColor,
    overflow: section.scrollWidth - section.clientWidth
  }))
  assert.equal(baLayout.columns.split(' ').length, 1, 'Before/After should stack on mobile')
  assert.equal(baLayout.background, 'rgb(243, 244, 244)')
  assert.ok(baLayout.overflow <= 1)
  await page.close()
}

async function testAudio(browser) {
  const page = await openSolo(browser, { viewport: { width: 1096, height: 900 }, reducedMotion: 'no-preference' })
  const root = page.locator('#wistiaBeforeAfter')
  await root.waitFor()
  assert.equal(await root.locator('.bap-tab').count(), 2)
  assert.equal(await root.locator('.bap-tab[data-mode="before"]').getAttribute('aria-pressed'), 'true')
  assert.equal(await root.locator('.bap-play').getAttribute('aria-label'), '재생')

  const urls = await root.evaluate(section => [section.dataset.beforeSrc, section.dataset.afterSrc])
  const responses = await Promise.all(urls.map(url => page.request.get(new URL(url, page.url()).href)))
  responses.forEach(response => assert.equal(response.status(), 200, `${response.url()} must return 200`))
  const buffers = await Promise.all(responses.map(response => response.body()))
  assert.notEqual(hash(buffers[0]), hash(buffers[1]), 'Before and After audio files must differ')

  await root.locator('.bap-play').click()
  await page.waitForFunction(() => document.querySelector('#wistiaBeforeAfter')?.classList.contains('is-playing'))
  await page.waitForFunction(() => Number(document.querySelector('#wistiaBeforeAfter')?.dataset.position) > .35, null, { timeout: 5000 })
  const beforeSwitch = await root.evaluate(section => Number(section.dataset.position))
  assert.ok(beforeSwitch > .35, 'playback position should advance')
  await root.locator('.bap-tab[data-mode="after"]').click()
  await page.waitForTimeout(180)
  const afterSwitch = await root.evaluate(section => Number(section.dataset.position))
  assert.equal(await root.locator('.bap-tab[data-mode="after"]').getAttribute('aria-pressed'), 'true')
  assert.ok(Math.abs(afterSwitch - beforeSwitch) < .65, 'tab switch should keep the same playback position')
  assert.equal(await root.locator('.bap-badge b').innerText(), 'VOCAL 노이즈 제거 · 보컬튜닝 · 보컬믹싱 · 마스터링')

  const canvas = root.locator('.bap-wave')
  const box = await canvas.boundingBox()
  await page.mouse.click(box.x + box.width * .72, box.y + box.height / 2)
  await page.waitForTimeout(120)
  assert.ok(await root.evaluate(section => Number(section.dataset.position)) > 1, 'waveform click should seek')
  await root.locator('.bap-play').click()
  assert.equal(await root.locator('.bap-play').getAttribute('aria-label'), '재생')

  await page.evaluate(() => { location.hash = '#/' })
  await page.locator('body[data-page="home"]').waitFor()
  assert.equal(await page.locator('#wistiaBeforeAfter').count(), 0, 'route change should destroy the player')
  await page.close()
}

async function testErrorAndReducedMotion(browser) {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' })
  await page.route('**/assets/audio/before-after/after.mp3*', route => route.abort())
  await page.goto(`${BASE}?solo-ba-error=1#/detail/solo`, { waitUntil: 'domcontentloaded' })
  const root = page.locator('#wistiaBeforeAfter')
  await root.waitFor()
  await root.locator('.bap-tab[data-mode="after"]').click()
  await root.locator('.bap-error:not([hidden])').waitFor({ timeout: 10000 })
  assert.match(await root.locator('.bap-error').innerText(), /불러오지 못했습니다/)
  const motion = await root.evaluate(section => ({
    tab: getComputedStyle(section.querySelector('.bap-tab')).transitionDuration,
    play: getComputedStyle(section.querySelector('.bap-play')).transitionDuration
  }))
  assert.equal(motion.tab, '0s')
  assert.equal(motion.play, '0s')
  await page.close()
}

;(async () => {
  const browser = await chromium.launch({ headless: true, executablePath: EDGE })
  try {
    await testStructureAndReferenceGeometry(browser)
    await testAudio(browser)
    await testErrorAndReducedMotion(browser)
    console.log('solo approved update checks passed')
  } finally {
    await browser.close()
  }
})().catch(error => {
  console.error(error)
  process.exitCode = 1
})
