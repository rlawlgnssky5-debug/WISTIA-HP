const { chromium } = require(process.env.WISTIA_NODE_MODULES + '/playwright')
const assert = require('node:assert/strict')

const EDGE = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'
const BASE = process.env.WISTIA_BASE || 'http://127.0.0.1:4173/'

async function openSolo(browser, options = {}) {
  const page = await browser.newPage({
    viewport: options.viewport || { width: 1280, height: 900 },
    reducedMotion: options.reducedMotion || 'no-preference'
  })
  await page.goto(`${BASE}?ar-cd-test=1#/detail/solo`, { waitUntil: 'domcontentloaded' })
  await page.locator('#arRatioExperience').waitFor({ timeout: 15000 })
  return page
}

async function testStructureAndAssets(browser) {
  const requests = []
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } })
  page.on('request', request => {
    if (/\/assets\/audio\/ar-samples\/voice-/.test(request.url())) requests.push(request.url())
  })
  await page.goto(`${BASE}?ar-cd-assets=1#/detail/solo`, { waitUntil: 'domcontentloaded' })
  const section = page.locator('#arRatioExperience')
  await section.waitFor({ timeout: 15000 })

  assert.equal(await section.locator('.ar-cd-tab').count(), 4)
  assert.equal(await section.locator('.ar-cd-marker').count(), 4)
  assert.match(await section.locator('.ar-cd-title').innerText(), /실제 AR을 들어보고.*내 목소리 비율을 골라보세요/s)
  assert.match(await section.locator('.ar-cd-engineer').innerText(), /비율을 몰라도.*괜찮습니다/s)
  assert.equal(await section.locator('.ar-cd-audio').evaluate(audio => audio.paused), true, 'the CD player must never autoplay')
  assert.deepEqual(
    [...new Set(requests.map(url => new URL(url).pathname.split('/').pop()))],
    ['voice-70-web.wav'],
    'initial load should request only the recommended 70 percent sample'
  )

  const assets = await page.evaluate(async () => {
    const sources = [30, 50, 70, 100].map(value => document.querySelector('#arRatioExperience').getAttribute(`data-audio-${value}`))
    const responses = await Promise.all(sources.map(source => fetch(source)))
    const buffers = await Promise.all(responses.map(response => response.arrayBuffer()))
    const hashes = await Promise.all(buffers.map(async buffer => {
      const digest = await crypto.subtle.digest('SHA-256', buffer)
      return [...new Uint8Array(digest)].map(value => value.toString(16).padStart(2, '0')).join('')
    }))
    return { statuses: responses.map(response => response.status), hashes }
  })
  assert.deepEqual(assets.statuses, [200, 200, 200, 200])
  assert.equal(new Set(assets.hashes).size, 4, 'all four AR ratio samples should contain different audio data')
  await page.close()
}

async function testPlaybackAndSwitching(browser) {
  const page = await openSolo(browser)
  const section = page.locator('#arRatioExperience')
  const audio = section.locator('.ar-cd-audio')
  await page.waitForFunction(() => document.querySelector('.ar-cd-audio')?.readyState >= 3)

  const glowBefore = await section.locator('.ar-cd-glow').evaluate(node => getComputedStyle(node).transform)
  await section.locator('.ar-cd-play').click()
  await page.waitForFunction(() => !document.querySelector('.ar-cd-audio').paused)
  assert.equal(await section.evaluate(node => node.classList.contains('is-playing')), true)

  await audio.evaluate(node => { node.currentTime = 2 })
  await page.waitForFunction(() => document.querySelector('.ar-cd-audio')?.currentTime >= 1.9)
  await section.locator('.ar-cd-tab[data-ratio="50"]').click()
  await page.waitForFunction(() => document.querySelector('.ar-cd-audio')?.dataset.ratio === '50' && !document.querySelector('.ar-cd-audio').paused)
  const switched = await audio.evaluate(node => ({ paused: node.paused, currentTime: node.currentTime }))
  assert.equal(switched.paused, false)
  assert.ok(switched.currentTime >= 1.5, 'switching ratios while playing should preserve playback position')
  assert.equal(await section.locator('.ar-cd-tab[data-ratio="50"]').getAttribute('aria-pressed'), 'true')
  assert.notEqual(await section.locator('.ar-cd-glow').evaluate(node => getComputedStyle(node).transform), glowBefore)

  await section.locator('.ar-cd-progress').evaluate(node => { node.value = 500; node.dispatchEvent(new Event('input', { bubbles: true })) })
  const seek = await audio.evaluate(node => ({ currentTime: node.currentTime, duration: node.duration }))
  assert.ok(Math.abs(seek.currentTime / seek.duration - 0.5) < 0.03, 'progress control should seek the active sample')

  await section.locator('.ar-cd-play').click()
  assert.equal(await audio.evaluate(node => node.paused), true)
  await section.locator('.ar-cd-play').click()
  await page.waitForFunction(() => !document.querySelector('.ar-cd-audio').paused)
  await page.close()
}

async function testResponsiveMotionAndError(browser) {
  const mobile = await openSolo(browser, { viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' })
  const section = mobile.locator('#arRatioExperience')
  const layout = await section.evaluate(node => {
    const root = node.getBoundingClientRect()
    const visual = node.querySelector('.ar-cd-visual').getBoundingClientRect()
    return {
      columns: getComputedStyle(node.querySelector('.ar-cd-layout')).gridTemplateColumns.split(' ').length,
      contained: visual.left >= root.left && visual.right <= root.right,
      overflow: document.documentElement.scrollWidth - innerWidth,
      discAnimation: getComputedStyle(node.querySelector('.ar-cd-disc')).animationName,
      glowTransition: getComputedStyle(node.querySelector('.ar-cd-glow')).transitionDuration
    }
  })
  assert.equal(layout.columns, 1)
  assert.equal(layout.contained, true)
  assert.ok(layout.overflow <= 1)
  assert.equal(layout.discAnimation, 'none')
  assert.equal(layout.glowTransition, '0s')
  await mobile.close()

  const broken = await browser.newPage({ viewport: { width: 390, height: 844 } })
  await broken.route('**/voice-30-web.wav*', route => route.abort())
  await broken.goto(`${BASE}?ar-cd-error=1#/detail/solo`, { waitUntil: 'domcontentloaded' })
  await broken.locator('#arRatioExperience').waitFor()
  await broken.locator('.ar-cd-tab[data-ratio="30"]').click()
  await broken.locator('.ar-cd-error:visible').waitFor({ timeout: 15000 })
  assert.match(await broken.locator('.ar-cd-error').innerText(), /음원을 불러오지 못했습니다/)
  await broken.close()
}

;(async () => {
  const browser = await chromium.launch({ headless: true, executablePath: EDGE })
  try {
    await testStructureAndAssets(browser)
    await testPlaybackAndSwitching(browser)
    await testResponsiveMotionAndError(browser)
    console.log('AR ratio CD checks passed')
  } finally {
    await browser.close()
  }
})().catch(error => {
  console.error(error)
  process.exitCode = 1
})
