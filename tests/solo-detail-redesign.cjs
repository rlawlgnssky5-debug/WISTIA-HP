const { chromium } = require(process.env.WISTIA_NODE_MODULES + '/playwright')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')

const EDGE = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'
const BASE = process.env.WISTIA_BASE || 'http://127.0.0.1:4173/'
const groups = new Set(process.argv.slice(2))
const runs = name => groups.size === 0 || groups.has(`--${name}`)

async function openSolo(browser, viewport = { width: 390, height: 844 }) {
  const page = await browser.newPage({ viewport, reducedMotion: 'reduce' })
  await page.goto(`${BASE}?solo-redesign-test=1#/detail/solo`, { waitUntil: 'domcontentloaded' })
  await page.locator('.solo-detail-scope').waitFor()
  return page
}

async function testAudio(browser) {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' })
  const audioRequests = []
  page.on('request', request => {
    if (/\/assets\/audio\/ar-samples\/voice-/.test(request.url())) audioRequests.push(request.url())
  })
  await page.goto(`${BASE}?solo-audio-test=1#/detail/solo`, { waitUntil: 'domcontentloaded' })
  await page.locator('.ratio-section:not(.is-loading)').waitFor({ timeout: 15000 })

  assert.deepEqual(
    [...new Set(audioRequests.map(url => new URL(url).pathname.split('/').pop()))],
    ['voice-70-web.wav'],
    'initial render should request only the selected browser-optimized sample'
  )

  const ready = await page.locator('#ratioAudio').evaluate(audio => ({
    readyState: audio.readyState,
    duration: audio.duration,
    paused: audio.paused,
    muted: audio.muted,
    volume: audio.volume,
    error: audio.error?.code || null
  }))
  assert.ok(ready.readyState >= 3, 'selected sample should be playable before controls enable')
  assert.equal(ready.error, null)
  assert.equal(ready.muted, false)
  assert.equal(ready.volume, 1)

  await page.evaluate(async () => {
    const audio = document.querySelector('#ratioAudio')
    audio.pause()
    await switchRatioAudio('30', { play: false })
  })
  assert.equal(await page.locator('#ratioAudio').evaluate(audio => audio.paused), true, 'paused selection must stay paused')

  await page.evaluate(async () => {
    const audio = document.querySelector('#ratioAudio')
    audio.currentTime = 2
    await audio.play()
    await switchRatioAudio('50', { play: true })
  })
  const activeSwitch = await page.locator('#ratioAudio').evaluate(audio => ({ paused: audio.paused, currentTime: audio.currentTime }))
  assert.equal(activeSwitch.paused, false, 'playing selection must keep playing')
  assert.ok(activeSwitch.currentTime >= 1.5, 'normal switches should preserve playback position')

  await page.evaluate(async () => {
    const audio = document.querySelector('#ratioAudio')
    audio.currentTime = audio.duration - 0.2
    await switchRatioAudio('100', { play: true })
  })
  const endSwitch = await page.locator('#ratioAudio').evaluate(audio => ({ currentTime: audio.currentTime, paused: audio.paused }))
  assert.ok(endSwitch.currentTime < 1, 'near-ended switches should restart instead of playing silence')
  assert.equal(endSwitch.paused, false)

  const lastBlobUrl = await page.locator('#ratioAudio').evaluate(audio => audio.src)
  await page.evaluate(() => {
    location.hash = '#/'
  })
  await page.locator('body[data-page="home"]').waitFor()
  assert.equal(
    await page.evaluate(async url => {
      try {
        await fetch(url)
        return true
      } catch {
        return false
      }
    }, lastBlobUrl),
    false,
    'leaving the ratio page should revoke cached Blob URLs'
  )
  await page.close()
}

async function testLayout(browser) {
  for (const viewport of [{ width: 390, height: 844 }, { width: 768, height: 1024 }, { width: 1280, height: 720 }]) {
    const page = await openSolo(browser, viewport)
    assert.equal(await page.locator('.solo-editorial-sheet').count(), 1, 'reviews and expert story should share one editorial sheet')
    const layout = await page.evaluate(() => {
      const scope = document.querySelector('.solo-detail-scope')
      const benefit = document.querySelector('.ar-primary-benefit')
      const hero = document.querySelector('.ar-hook-hero')
      const scopeStyle = getComputedStyle(scope)
      const benefitStyle = getComputedStyle(benefit)
      return {
        viewport: innerWidth,
        scopeWidth: scope.getBoundingClientRect().width,
        scopeBackground: scopeStyle.backgroundColor,
        benefitDisplay: benefitStyle.display,
        benefitColumns: benefitStyle.gridTemplateColumns,
        heroRatio: hero.getBoundingClientRect().height / hero.getBoundingClientRect().width,
        overflow: document.documentElement.scrollWidth - innerWidth
      }
    })
    assert.notEqual(layout.scopeBackground, 'rgba(0, 0, 0, 0)', 'solo canvas should establish the charcoal stage')
    assert.ok(layout.overflow <= 1, `page should not overflow horizontally at ${viewport.width}px`)
    if (layout.scopeWidth >= 430) {
      assert.equal(layout.benefitDisplay, 'grid', 'wide content containers should use the approved horizontal benefit layout')
      assert.equal(layout.benefitColumns.split(' ').length, 3, 'benefit layout should reserve copy, breathing room, and wheel columns')
    } else {
      assert.notEqual(layout.benefitDisplay, 'grid', 'narrow content containers should stack the benefit layout')
      assert.ok(layout.heroRatio <= 1.55, 'mobile hero should not over-crop into an excessively tall panel')
    }
    await page.close()
  }
}

async function testContent(browser) {
  const page = await openSolo(browser, { width: 768, height: 1024 })
  await page.locator('.ar-compare').scrollIntoViewIfNeeded()
  await page.waitForTimeout(100)
  assert.equal(await page.locator('[data-ar-compare-row]').count(), 4)
  assert.deepEqual(
    await page.locator('.ar-compare-arrow').evaluateAll(nodes => nodes.map(node => getComputedStyle(node).opacity)),
    ['1', '1', '1', '1'],
    'comparison arrows should remain visible without hover or focus'
  )

  const expert = page.locator('[data-expert-split]')
  const before = await expert.locator('[data-expert-panel]').evaluateAll(nodes => nodes.map(node => node.getBoundingClientRect().width))
  assert.ok(before[1] > before[0] * 1.6, 'second expert panel should start at approximately 65 percent')
  await expert.locator('[data-expert-panel]').first().click()
  await page.waitForTimeout(450)
  const after = await expert.locator('[data-expert-panel]').evaluateAll(nodes => nodes.map(node => node.getBoundingClientRect().width))
  assert.ok(after[0] > after[1] * 1.6, 'click should reverse the 35:65 expert panel emphasis')

  assert.equal(await page.locator('[data-solo-process-card]').count(), 7)
  assert.equal(await page.locator('[data-solo-process-card] img').count(), 6)
  assert.match(await page.locator('.solo-process-section .section-heading').innerText(), /노래가 익숙하지 않아도 괜찮습니다.*녹음부터 보정까지 WISTIA가 완성합니다/s)
  assert.match(await page.locator('[data-solo-process-card]').last().innerText(), /약 7일/)
  const rail = page.locator('[data-solo-process-rail]')
  const start = await rail.evaluate(node => node.scrollLeft)
  await rail.press('ArrowRight')
  await page.waitForTimeout(500)
  assert.ok(await rail.evaluate((node, initial) => node.scrollLeft > initial, start), 'ArrowRight should advance the process rail')
  await page.close()
}

async function testControls(browser) {
  const mobile = await openSolo(browser, { width: 390, height: 844 })
  await mobile.locator('.ratio-section:not(.is-loading)').waitFor({ timeout: 15000 })
  assert.equal(await mobile.locator('.solo-ratio input[type="range"]').count(), 0, 'premium dial must not use a native range input')
  assert.equal(await mobile.locator('.solo-ratio [data-ratio]').count(), 4, 'dial should expose four direct ratio controls')
  const dial = mobile.locator('[data-ratio-dial]')
  assert.equal(await dial.getAttribute('aria-valuenow'), '70')
  await dial.press('ArrowRight')
  await mobile.waitForTimeout(300)
  assert.equal(await dial.getAttribute('aria-valuenow'), '100', 'ArrowRight should move the dial to the next ratio')
  const dialBox = await dial.boundingBox()
  await mobile.mouse.click(dialBox.x + 60, dialBox.y + 60)
  await mobile.waitForTimeout(300)
  assert.equal(await dial.getAttribute('aria-valuenow'), '30', 'turning toward the upper-left mark should select 30 percent')
  assert.equal(await mobile.locator('.solo-top-cta a[href="#/event/solo"]:visible').count(), 1)
  assert.equal(await mobile.locator('.detail-faq-price:visible,.fixed-price:visible').count(), 0, 'duplicate price calls to action should be removed')
  assert.equal(await mobile.locator('#floatingKakao:visible').count(), 0, 'mobile Kakao control must not cover content')
  assert.equal(await mobile.locator('.solo-inline-contact').count(), 1, 'mobile contact should remain available inline')
  await mobile.close()

  const desktop = await openSolo(browser, { width: 1280, height: 720 })
  assert.equal(await desktop.locator('#soloDesktopCta .solo-desktop-cta-price:visible').count(), 0, 'desktop must not repeat the sticky price CTA')
  assert.equal(await desktop.locator('#soloDesktopCta .solo-desktop-cta-kakao:visible').count(), 1, 'desktop should retain the compact contact helper')
  await desktop.close()
}

async function captureVisuals(browser) {
  const output = path.join(__dirname, 'qa')
  fs.mkdirSync(output, { recursive: true })
  for (const viewport of [{ width: 390, height: 844 }, { width: 768, height: 1024 }, { width: 1280, height: 720 }]) {
    const page = await openSolo(browser, viewport)
    await page.evaluate(async () => {
      await document.fonts.ready
      for (const image of document.images) {
        image.loading = 'eager'
        await image.decode().catch(() => {})
      }
    })
    await page.screenshot({ path: path.join(output, `solo-redesign-${viewport.width}.png`), fullPage: true })
    await page.close()
  }
}

;(async () => {
  const browser = await chromium.launch({ headless: true, executablePath: EDGE })
  try {
    if (runs('audio')) await testAudio(browser)
    if (runs('layout')) await testLayout(browser)
    if (runs('content')) await testContent(browser)
    if (runs('controls')) await testControls(browser)
    if (groups.size === 0) await captureVisuals(browser)
    console.log('solo detail redesign checks passed')
  } finally {
    await browser.close()
  }
})().catch(error => {
  console.error(error)
  process.exitCode = 1
})
