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
  await page.locator('#arRatioExperience:not(.is-loading)').waitFor({ timeout: 15000 })

  assert.deepEqual(
    [...new Set(audioRequests.map(url => new URL(url).pathname.split('/').pop()))],
    ['voice-70-web.wav'],
    'initial render should request only the selected browser-optimized sample'
  )

  const ready = await page.locator('.ar-cd-audio').evaluate(audio => ({
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

  const audio = page.locator('.ar-cd-audio')
  await page.locator('.ar-cd-tab[data-ratio="30"]').click()
  await page.locator('#arRatioExperience:not(.is-loading)').waitFor({ timeout: 15000 })
  assert.equal(await audio.evaluate(node => node.paused), true, 'paused selection must stay paused')

  await page.locator('.ar-cd-play').click()
  await page.waitForFunction(() => !document.querySelector('.ar-cd-audio').paused)
  await audio.evaluate(node => { node.currentTime = 2 })
  await page.waitForFunction(() => document.querySelector('.ar-cd-audio').currentTime >= 1.9)
  await page.locator('.ar-cd-tab[data-ratio="50"]').click()
  await page.waitForFunction(() => document.querySelector('.ar-cd-audio').dataset.ratio === '50' && !document.querySelector('.ar-cd-audio').paused && document.querySelector('.ar-cd-audio').currentTime >= 1.5)
  const activeSwitch = await audio.evaluate(node => ({ paused: node.paused, currentTime: node.currentTime }))
  assert.equal(activeSwitch.paused, false, 'playing selection must keep playing')
  assert.ok(activeSwitch.currentTime >= 1.5, 'normal switches should preserve playback position')

  await page.evaluate(() => {
    location.hash = '#/'
  })
  await page.locator('body[data-page="home"]').waitFor()
  assert.equal(await page.locator('.ar-cd-audio').count(), 0, 'leaving the ratio page should destroy the CD audio element')
  await page.close()
}

async function testLayout(browser) {
  for (const viewport of [{ width: 390, height: 844 }, { width: 768, height: 1024 }, { width: 1096, height: 875 }, { width: 1280, height: 720 }]) {
    const page = await openSolo(browser, viewport)
    assert.equal(await page.locator('.solo-editorial-sheet .ar-expert-story').count(), 1, 'expert story should remain on its light editorial sheet')
    assert.equal(await page.locator('.solo-editorial-sheet [data-review-showcase]').count(), 0, 'black review stage should remain visually separate from the expert sheet')
    const layout = await page.evaluate(() => {
      const scope = document.querySelector('.solo-detail-scope')
      const benefit = document.querySelector('.ar-primary-benefit')
      const hero = document.querySelector('.ar-hook-hero')
      const scopeStyle = getComputedStyle(scope)
      const benefitStyle = getComputedStyle(benefit)
      const benefitBox = benefit.getBoundingClientRect()
      const indexItems = [...benefit.querySelectorAll('.ar-index-item')].map(item => item.getBoundingClientRect())
      return {
        viewport: innerWidth,
        scopeWidth: scope.getBoundingClientRect().width,
        scopeBackground: scopeStyle.backgroundColor,
        benefitDisplay: benefitStyle.display,
        benefitColumns: benefitStyle.gridTemplateColumns,
        benefitContainsItems: indexItems.every(item => item.left >= benefitBox.left && item.right <= benefitBox.right),
        heroRatio: hero.getBoundingClientRect().height / hero.getBoundingClientRect().width,
        overflow: document.documentElement.scrollWidth - innerWidth
      }
    })
    assert.notEqual(layout.scopeBackground, 'rgba(0, 0, 0, 0)', 'solo canvas should establish the charcoal stage')
    assert.ok(layout.overflow <= 1, `page should not overflow horizontally at ${viewport.width}px`)
    assert.equal(layout.benefitContainsItems, true, `benefit labels must remain inside the white panel at ${viewport.width}px`)
    if (layout.scopeWidth <= 500) {
      assert.equal(layout.benefitDisplay, 'flex', 'the constrained solo canvas should stack copy and wheel instead of colliding horizontally')
    }
    if (layout.scopeWidth < 430) {
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
  assert.equal(await page.locator('.ar-compare-criteria').count(), 4, 'comparison criteria should remain centered between both providers')
  assert.match(await page.locator('.ar-compare-title').innerText(), /위스티아는\s*다릅니다/)

  const expert = page.locator('[data-story-carousel]')
  assert.equal(await expert.locator('[data-story-slide]').count(), 2)
  await expert.locator('[data-story-next]').click()
  await page.waitForTimeout(650)
  assert.equal(await expert.locator('[data-story-slide="1"].is-active').count(), 1, 'brand story next control should slide to the second editorial story')

  assert.equal(await page.locator('[data-solo-process-card]').count(), 7)
  assert.equal(await page.locator('[data-solo-process-card] img').count(), 6)
  assert.match(await page.locator('.solo-process-head').innerText(), /노래가 익숙하지 않아도.*완성까지 함께합니다/s)
  assert.match(await page.locator('[data-solo-process-card]').last().textContent(), /약 7일/)
  const rail = page.locator('[data-solo-process-rail]')
  const start = await rail.evaluate(node => node.scrollLeft)
  await rail.press('ArrowRight')
  await page.waitForTimeout(500)
  assert.ok(await rail.evaluate((node, initial) => node.scrollLeft > initial, start), 'ArrowRight should advance the process rail')
  await page.close()
}

async function testControls(browser) {
  const mobile = await openSolo(browser, { width: 390, height: 844 })
  await mobile.locator('#arRatioExperience:not(.is-loading)').waitFor({ timeout: 15000 })
  assert.equal(await mobile.locator('.ar-cd-progress').count(), 1, 'CD player should expose one seek control')
  assert.equal(await mobile.locator('.ar-cd-tab').count(), 4, 'CD player should expose four direct ratio controls')
  assert.equal(await mobile.locator('.ar-cd-marker').count(), 4, 'CD orbit should mirror the four ratios')
  assert.equal(await mobile.locator('.ar-cd-tab[data-ratio="70"]').getAttribute('aria-pressed'), 'true')
  await mobile.locator('.ar-cd-tab[data-ratio="100"]').click()
  await mobile.waitForFunction(() => document.querySelector('.ar-cd-disc-copy strong')?.textContent.includes('100'))
  assert.equal(await mobile.locator('.ar-cd-tab[data-ratio="100"]').getAttribute('aria-pressed'), 'true', 'ratio choice should update the CD visualization')
  assert.equal(await mobile.locator('.solo-top-cta a[href="#/event/solo"]:visible').count(), 1)
  assert.equal(await mobile.locator('.detail-faq-price:visible,.fixed-price:visible').count(), 0, 'duplicate price calls to action should be removed')
  assert.equal(await mobile.locator('#floatingKakao:visible').count(), 0, 'mobile Kakao control must not cover content')
  assert.equal(await mobile.locator('.solo-inline-contact').count(), 1, 'mobile contact should remain available inline')
  await mobile.close()

  const desktop = await openSolo(browser, { width: 1280, height: 720 })
  assert.equal(await desktop.locator('#soloDesktopCta .solo-desktop-cta-price:visible').count(), 1, 'desktop should retain the price action beside contact')
  assert.equal(await desktop.locator('#soloDesktopCta .solo-desktop-cta-kakao:visible').count(), 1, 'desktop should retain the compact contact helper')
  await desktop.close()
}

async function testReviewShowcase(browser) {
  const page = await openSolo(browser, { width: 1024, height: 900 })
  const showcase = page.locator('[data-review-showcase]')
  await showcase.scrollIntoViewIfNeeded()
  assert.match(await showcase.innerText(), /실제 고객 후기/)
  assert.equal(await showcase.locator('[data-review-slide]').count(), 11, 'phone showcase should contain all eleven customer captures')
  assert.equal(await showcase.locator('[data-review-slide].is-active').count(), 1, 'only one review should be emphasized inside the phone')
  assert.equal((await showcase.locator('[data-review-status]').innerText()).trim(), '01')
  assert.match(await showcase.locator('.solo-review-index').innerText(), /11/)

  const geometry = await showcase.evaluate(section => {
    const phone = section.querySelector('.solo-review-phone').getBoundingClientRect()
    const screen = section.querySelector('.solo-review-phone-screen').getBoundingClientRect()
    const styles = getComputedStyle(section)
    return {
      background: styles.backgroundColor,
      overflow: styles.overflow,
      phoneRatio: phone.height / phone.width,
      phoneBottom: phone.bottom,
      sectionBottom: section.getBoundingClientRect().bottom,
      screenWidth: screen.width
    }
  })
  assert.equal(geometry.background, 'rgb(7, 7, 7)', 'review section should use the approved HTML black stage')
  assert.equal(geometry.overflow, 'hidden')
  assert.ok(Math.abs(geometry.phoneRatio - 795 / 500) < 0.03, 'phone mockup should keep the approved HTML device proportion')
  assert.ok(geometry.phoneBottom > geometry.sectionBottom, 'oversized phone should crop below the section')
  assert.ok(geometry.screenWidth > 180, 'review capture should remain readable inside the enlarged phone')

  await showcase.locator('[data-solo-review-next]').click()
  await page.waitForTimeout(500)
  assert.equal((await showcase.locator('[data-review-status]').innerText()).trim(), '02')
  assert.equal(await showcase.locator('[data-review-slide="1"].is-active').count(), 1, 'next control should advance the active capture')
  await page.close()

  const autoPage = await browser.newPage({ viewport: { width: 768, height: 1024 }, reducedMotion: 'no-preference' })
  await autoPage.goto(`${BASE}?solo-review-auto-test=1#/detail/solo`, { waitUntil: 'domcontentloaded' })
  const autoStatus = autoPage.locator('[data-review-status]')
  await autoStatus.waitFor()
  assert.equal((await autoStatus.innerText()).trim(), '01')
  await autoPage.waitForTimeout(5900)
  assert.equal((await autoStatus.innerText()).trim(), '02', 'review showcase should advance automatically when motion is allowed')
  await autoPage.close()
}

async function testReferenceProcess(browser) {
  const page = await openSolo(browser, { width: 768, height: 1024 })
  const section = page.locator('.solo-process-section')
  await section.scrollIntoViewIfNeeded()
  assert.equal(await section.locator('[data-solo-process-card]').count(), 7)
  assert.equal(await section.locator('[data-solo-process-card].is-active').count(), 1)
  assert.match(await section.locator('[data-process-status]').innerText(), /01\s*\/\s*07/)

  const geometry = await section.evaluate(root => {
    const cards = [...root.querySelectorAll('[data-solo-process-card]')]
    const active = root.querySelector('[data-solo-process-card].is-active')
    const inactive = cards.find(card => card !== active)
    const media = active.querySelector('.solo-process-media').getBoundingClientRect()
    const activeBox = active.getBoundingClientRect()
    const inactiveBox = inactive.getBoundingClientRect()
    return {
      activeWidth: activeBox.width,
      activeHeight: activeBox.height,
      inactiveWidth: inactiveBox.width,
      inactiveHeight: inactiveBox.height,
      mediaRatio: media.width / media.height,
      activeIndex: Number(active.dataset.soloProcessCard)
    }
  })
  assert.equal(geometry.activeIndex, 0)
  assert.ok(geometry.activeWidth > geometry.inactiveWidth * 1.55, 'focused step should be substantially wider than side cards')
  assert.ok(geometry.activeHeight > geometry.inactiveHeight * 1.3, 'focused step should visibly scale above side cards')
  assert.ok(Math.abs(geometry.mediaRatio - 16 / 9) < 0.12, 'focused process image should follow the reference 16:9 crop')

  await section.locator('[data-process-next]').click()
  await page.waitForTimeout(500)
  assert.equal(await section.locator('[data-solo-process-card="1"].is-active').count(), 1)
  assert.match(await section.locator('[data-process-status]').innerText(), /02\s*\/\s*07/)
  await page.close()
}

async function testFinalPolish(browser) {
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 }, reducedMotion: 'no-preference' })
  await page.goto(`${BASE}?solo-final-polish=1#/detail/solo`, { waitUntil: 'domcontentloaded' })
  await page.locator('.solo-detail-scope').waitFor()

  const desktopCta = page.locator('#soloDesktopCta')
  assert.equal(await desktopCta.locator('a').count(), 2, 'desktop floating CTA should include price and contact actions')
  assert.notEqual(await desktopCta.locator('.solo-desktop-cta-price').evaluate(node => getComputedStyle(node).display), 'none', 'price action must remain visible')
  assert.equal(await desktopCta.evaluate(node => getComputedStyle(node).position), 'fixed', 'desktop actions should float at the right edge instead of entering page flow')
  assert.equal(await page.locator('.solo-top-cta').evaluate(node => getComputedStyle(node).position), 'static', 'top event bar should stay in document flow')

  const benefit = await page.locator('.ar-primary-benefit').evaluate(section => {
    const box = section.getBoundingClientRect()
    const copy = section.querySelector('.ar-benefit-copy').getBoundingClientRect()
    const wheel = section.querySelector('.ar-index-wheel').getBoundingClientRect()
    return {
      textAlign: getComputedStyle(section.querySelector('.ar-benefit-copy')).textAlign,
      copyCenterError: Math.abs((copy.left + copy.width / 2) - (box.left + box.width / 2)),
      wheelCenterError: Math.abs((wheel.left + wheel.width / 2) - (box.left + box.width / 2)),
      copyWidth: copy.width,
      sectionWidth: box.width
    }
  })
  assert.equal(benefit.textAlign, 'center')
  assert.ok(benefit.copyCenterError < 3 && benefit.wheelCenterError < 3, 'benefit copy and wheel should share the same visual center')
  assert.ok(benefit.copyWidth < benefit.sectionWidth * 0.82, 'benefit copy should not leave an accidental blank column')

  const story = page.locator('[data-story-carousel]')
  assert.equal(await story.locator('[data-story-slide]').count(), 2, 'brand story should use two editorial slides')
  assert.equal(await story.locator('[data-story-slide].is-active').count(), 1)
  assert.match(await story.locator('[data-story-status]').innerText(), /01\s*\/\s*02/)
  const storyLayout = await story.locator('[data-story-slide].is-active').evaluate(slide => {
    const image = slide.querySelector('.ar-story-image').getBoundingClientRect()
    return {
      columns: getComputedStyle(slide.querySelector('.ar-story-copy')).gridTemplateColumns,
      imageRatio: image.width / image.height
    }
  })
  assert.ok(storyLayout.columns.split(' ').length >= 2, 'desktop story copy should follow the reference two-column editorial layout')
  assert.ok(storyLayout.imageRatio > 1.8, 'story image should be a wide editorial photograph')
  await story.locator('[data-story-next]').click()
  await page.waitForTimeout(650)
  assert.match(await story.locator('[data-story-status]').innerText(), /02\s*\/\s*02/)

  const review = page.locator('[data-review-showcase]')
  assert.match(await review.innerText(), /실제 고객 후기/)
  const reviewGeometry = await review.evaluate(section => {
    const phone = section.querySelector('.solo-review-phone').getBoundingClientRect()
    const copy = section.querySelector('.solo-review-copy').getBoundingClientRect()
    return { height: section.getBoundingClientRect().height, phoneWidth: phone.width, copyWidth: copy.width }
  })
  assert.ok(Math.abs(reviewGeometry.height / 500 - 7 / 12) < 0.02, 'review stage should keep the approved HTML 1200:700 proportion')
  assert.ok(reviewGeometry.phoneWidth > reviewGeometry.copyWidth, 'phone should be the dominant visual')

  const process = page.locator('.solo-process-section')
  const processStyle = await process.evaluate(section => {
    const active = section.querySelector('.solo-process-card.is-active')
    const inactive = section.querySelector('.solo-process-card:not(.is-active)')
    return {
      accent: getComputedStyle(section.querySelector('.solo-process-head strong')).color,
      shadow: getComputedStyle(active.querySelector('.solo-process-card-inner')).boxShadow,
      transition: getComputedStyle(active).transitionDuration,
      inactiveOpacity: Number(getComputedStyle(inactive).opacity)
    }
  })
  assert.equal(processStyle.accent, 'rgb(21, 25, 26)', 'process heading should use the neutral black reference color')
  assert.notEqual(processStyle.shadow, 'none', 'active process card should have a soft elevated shadow')
  assert.ok(processStyle.transition.split(',').some(value => parseFloat(value) >= 0.45), 'process card motion should be deliberate and smooth')
  assert.ok(processStyle.inactiveOpacity < 0.7, 'side cards should recede softly behind the active card')

  const ratio = page.locator('#arRatioExperience')
  const ratioLayout = await ratio.evaluate(section => ({
    columns: getComputedStyle(section.querySelector('.ar-cd-layout')).gridTemplateColumns,
    glow: section.querySelectorAll('.ar-cd-glow').length,
    choices: section.querySelectorAll('.ar-cd-tab').length,
    disc: section.querySelectorAll('.ar-cd-disc').length
  }))
  assert.ok(ratioLayout.columns.split(' ').length >= 1, 'AR ratio experience should retain its responsive editorial layout')
  assert.equal(ratioLayout.glow, 1, 'CD orbit should expose one glowing current-position marker')
  assert.equal(ratioLayout.choices, 4)
  assert.equal(ratioLayout.disc, 1)
  await ratio.locator('.ar-cd-tab[data-ratio="50"]').click()
  await page.waitForFunction(() => document.querySelector('.ar-cd-audio')?.dataset.ratio === '50')
  await page.waitForFunction(() => document.querySelector('.ar-cd-disc-copy strong')?.textContent.includes('50'))
  assert.match(await ratio.locator('.ar-cd-disc-copy strong').innerText(), /50/)

  const revealTargets = ['.ar-story-meta', '.ar-story-copy', '.solo-process-head', '.solo-process-slider', '.ar-cd-copy', '.ar-cd-visual']
  for (const selector of revealTargets) {
    assert.equal(await page.locator(selector).first().evaluate(node => node.classList.contains('motion-reveal')), true, `${selector} should participate in restrained scroll motion`)
  }

  await page.close()
}

async function testReferenceSpacing(browser) {
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 }, reducedMotion: 'no-preference' })
  await page.goto(`${BASE}?reference-spacing=1#/detail/solo`, { waitUntil: 'domcontentloaded' })
  await page.locator('#arRatioExperience:not(.is-loading)').waitFor({ timeout: 15000 })

  const storyMetrics = await page.locator('[data-story-slide].is-active').evaluate(slide => {
    const meta = slide.querySelector('.ar-story-meta')
    const copy = slide.querySelector('.ar-story-copy')
    const title = copy.querySelector('h2').getBoundingClientRect()
    const body = copy.querySelector('p').getBoundingClientRect()
    const image = slide.querySelector('.ar-story-image').getBoundingClientRect()
    const slideStyle = getComputedStyle(slide)
    const copyStyle = getComputedStyle(copy)
    return {
      paddingTop: parseFloat(slideStyle.paddingTop),
      paddingInline: parseFloat(slideStyle.paddingLeft),
      metaGap: parseFloat(getComputedStyle(meta).marginBottom),
      copyToImage: parseFloat(copyStyle.marginBottom),
      titleToBodyRatio: title.width / body.width,
      imageRatio: image.width / image.height,
      titleSize: parseFloat(getComputedStyle(copy.querySelector('h2')).fontSize),
      transitionMs: parseFloat(getComputedStyle(slide.closest('[data-expert-track]')).transitionDuration) * 1000
    }
  })
  assert.ok(Math.abs(storyMetrics.paddingTop - 70) <= 2)
  assert.ok(Math.abs(storyMetrics.paddingInline - 42) <= 2)
  assert.ok(Math.abs(storyMetrics.metaGap - 52) <= 2)
  assert.ok(storyMetrics.titleToBodyRatio >= 0.6 && storyMetrics.titleToBodyRatio <= 0.74, 'story title/body columns should follow the reference 40:60 rhythm')
  assert.ok(storyMetrics.copyToImage >= 84 && storyMetrics.copyToImage <= 96, 'story copy should keep the reference editorial breathing room before the image')
  assert.ok(storyMetrics.imageRatio >= 2.75 && storyMetrics.imageRatio <= 2.95, 'story photograph should use the reference panoramic crop')
  assert.ok(Math.abs(storyMetrics.titleSize - 29) <= 1)
  assert.ok(storyMetrics.transitionMs >= 650 && storyMetrics.transitionMs <= 720)
  const storyPunctuationTogether = await page.locator('.ar-story-slide.is-active .ar-story-copy h2').evaluate(title => {
    const walker = document.createTreeWalker(title, NodeFilter.SHOW_TEXT)
    let text
    while (walker.nextNode()) if (walker.currentNode.textContent.trim().endsWith('.')) text = walker.currentNode
    const value = text?.textContent || ''
    if (value.length < 2) return false
    const before = document.createRange()
    const punctuation = document.createRange()
    before.setStart(text, value.length - 2); before.setEnd(text, value.length - 1)
    punctuation.setStart(text, value.length - 1); punctuation.setEnd(text, value.length)
    return Math.abs(before.getBoundingClientRect().top - punctuation.getBoundingClientRect().top) < 2
  })
  assert.equal(storyPunctuationTogether, true, 'story punctuation should not be orphaned on its own line')

  const story = page.locator('[data-story-carousel]')
  await story.locator('.ar-story-viewport').press('ArrowRight')
  await page.waitForTimeout(720)
  assert.match(await story.locator('[data-story-status]').innerText(), /02\s*\/\s*02/, 'keyboard navigation should move the story left-to-right')

  const ratioMetrics = await page.locator('#arRatioExperience').evaluate(section => {
    const experience = section.querySelector('.ar-cd-layout')
    const style = getComputedStyle(section)
    const visual = section.querySelector('.ar-cd-visual').getBoundingClientRect()
    const box = section.getBoundingClientRect()
    return {
      paddingTop: parseFloat(style.paddingTop),
      paddingInline: parseFloat(style.paddingLeft),
      columns: getComputedStyle(experience).gridTemplateColumns,
      headingSize: parseFloat(getComputedStyle(section.querySelector('.ar-cd-title')).fontSize),
      markerTransitionMs: parseFloat(getComputedStyle(section.querySelector('.ar-cd-glow')).transitionDuration) * 1000,
      background: style.backgroundImage,
      visualContained: visual.left >= box.left && visual.right <= box.right
    }
  })
  assert.ok(ratioMetrics.paddingTop >= 52 && ratioMetrics.paddingTop <= 56)
  assert.ok(ratioMetrics.paddingInline >= 20 && ratioMetrics.paddingInline <= 24)
  assert.ok(ratioMetrics.headingSize >= 23 && ratioMetrics.headingSize <= 26)
  assert.equal(ratioMetrics.columns.split(' ').length, 2, 'CD experience should retain the approved left/right composition')
  assert.ok(ratioMetrics.markerTransitionMs >= 500 && ratioMetrics.markerTransitionMs <= 600)
  assert.match(ratioMetrics.background, /radial-gradient/, 'CD experience should retain the ZIP black radial stage')
  assert.equal(ratioMetrics.visualContained, true)

  const marker = page.locator('.ar-cd-glow')
  const beforeMarker = await marker.evaluate(node => getComputedStyle(node).transform)
  await page.locator('.ar-cd-tab[data-ratio="50"]').click()
  await page.waitForFunction(() => document.querySelector('.ar-cd-disc-copy strong')?.textContent.includes('50'))
  await page.waitForTimeout(600)
  const afterMarker = await marker.evaluate(node => getComputedStyle(node).transform)
  assert.notEqual(afterMarker, beforeMarker, 'glowing marker should move with the selected percentage')
  assert.equal(await page.locator('.ar-cd-audio').evaluate(audio => audio.paused), true, 'choosing a ratio must not autoplay without pressing play')

  const mobile = await browser.newPage({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' })
  await mobile.goto(`${BASE}?reference-spacing-mobile=1#/detail/solo`, { waitUntil: 'domcontentloaded' })
  await mobile.locator('#arRatioExperience:not(.is-loading)').waitFor({ timeout: 15000 })
  const mobileColumnsOverlap = await mobile.locator('#arRatioExperience').evaluate(section => {
    const copy = section.querySelector('.ar-cd-copy').getBoundingClientRect()
    const visual = section.querySelector('.ar-cd-visual').getBoundingClientRect()
    return Math.min(copy.bottom, visual.bottom) > Math.max(copy.top, visual.top)
  })
  assert.equal(mobileColumnsOverlap, true, 'mobile AR ratio copy and CD visual should share the same horizontal stage')
  const mobileDialContained = await mobile.locator('#arRatioExperience').evaluate(section => {
    const sectionRect = section.getBoundingClientRect()
    const dialRect = section.querySelector('.ar-cd-visual').getBoundingClientRect()
    return {
      contained: dialRect.left >= sectionRect.left && dialRect.right <= sectionRect.right,
      columns: getComputedStyle(section.querySelector('.ar-cd-layout')).gridTemplateColumns,
      discAnimation: getComputedStyle(section.querySelector('.ar-cd-disc')).animationName,
      glowTransition: getComputedStyle(section.querySelector('.ar-cd-glow')).transitionDuration
    }
  })
  assert.equal(mobileDialContained.contained, true, 'mobile CD visual should stay inside the section')
  assert.equal(mobileDialContained.columns.split(' ').length, 2, 'mobile CD experience should preserve the approved two-column composition')
  assert.equal(mobileDialContained.discAnimation, 'none', 'reduced motion should disable CD rotation')
  assert.equal(mobileDialContained.glowTransition, '0s', 'reduced motion should disable orbit motion')
  assert.equal(await mobile.locator('.ar-story-slide.is-active .ar-story-copy').evaluate(node => getComputedStyle(node).gridTemplateColumns.split(' ').length), 1, 'mobile story copy should stack title and body')
  await mobile.close()
  await page.close()
}

async function captureVisuals(browser) {
  const output = path.join(__dirname, 'qa')
  fs.mkdirSync(output, { recursive: true })
  for (const viewport of [{ width: 390, height: 844 }, { width: 768, height: 1024 }, { width: 1096, height: 875 }, { width: 1280, height: 720 }]) {
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
    if (runs('reviews')) await testReviewShowcase(browser)
    if (runs('process-ref')) await testReferenceProcess(browser)
    if (runs('final-polish')) await testFinalPolish(browser)
    if (runs('reference-spacing')) await testReferenceSpacing(browser)
    if (groups.size === 0) await captureVisuals(browser)
    console.log('solo detail redesign checks passed')
  } finally {
    await browser.close()
  }
})().catch(error => {
  console.error(error)
  process.exitCode = 1
})
