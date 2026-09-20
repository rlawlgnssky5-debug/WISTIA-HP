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
  assert.deepEqual(
    await page.locator('.ar-compare-arrow').evaluateAll(nodes => nodes.map(node => getComputedStyle(node).opacity)),
    ['1', '1', '1', '1'],
    'comparison arrows should remain visible without hover or focus'
  )

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
  await mobile.locator('.ratio-section:not(.is-loading)').waitFor({ timeout: 15000 })
  assert.equal(await mobile.locator('.solo-ratio input[type="range"]').count(), 0, 'premium dial must not use a native range input')
  assert.equal(await mobile.locator('.solo-ratio [data-ratio]').count(), 4, 'dial should expose four direct ratio controls')
  const dial = mobile.locator('[data-ratio-dial]')
  assert.equal(await dial.getAttribute('aria-valuenow'), '70')
  await mobile.locator('[data-ratio-choice="100"]').click()
  await mobile.waitForTimeout(300)
  assert.equal(await dial.getAttribute('aria-valuenow'), '100', 'ratio choice should update the visual dial')
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
  const page = await openSolo(browser, { width: 768, height: 1024 })
  const showcase = page.locator('[data-review-showcase]')
  await showcase.scrollIntoViewIfNeeded()
  assert.match(await showcase.innerText(), /실제 고객 후기/)
  assert.equal(await showcase.locator('[data-review-slide]').count(), 11, 'phone showcase should contain all eleven customer captures')
  assert.equal(await showcase.locator('[data-review-slide].is-active').count(), 1, 'only one review should be emphasized inside the phone')
  assert.match(await showcase.locator('[data-review-status]').innerText(), /01\s*\/\s*11/)

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
  assert.equal(geometry.background, 'rgb(8, 9, 9)', 'review section should be visibly separated with a black stage')
  assert.equal(geometry.overflow, 'hidden')
  assert.ok(geometry.phoneRatio > 1.7, 'phone mockup should use a tall device proportion')
  assert.ok(geometry.phoneBottom > geometry.sectionBottom, 'oversized phone should crop below the section')
  assert.ok(geometry.screenWidth > 180, 'review capture should remain readable inside the enlarged phone')

  await showcase.locator('[data-solo-review-next]').click()
  await page.waitForTimeout(500)
  assert.match(await showcase.locator('[data-review-status]').innerText(), /02\s*\/\s*11/)
  assert.equal(await showcase.locator('[data-review-slide="1"].is-active').count(), 1, 'next control should advance the active capture')
  await page.close()

  const autoPage = await browser.newPage({ viewport: { width: 768, height: 1024 }, reducedMotion: 'no-preference' })
  await autoPage.goto(`${BASE}?solo-review-auto-test=1#/detail/solo`, { waitUntil: 'domcontentloaded' })
  const autoStatus = autoPage.locator('[data-review-status]')
  await autoStatus.waitFor()
  assert.match(await autoStatus.innerText(), /01\s*\/\s*11/)
  await autoPage.waitForTimeout(4000)
  assert.match(await autoStatus.innerText(), /02\s*\/\s*11/, 'review showcase should advance automatically when motion is allowed')
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
  assert.ok(reviewGeometry.height >= 580 && reviewGeometry.height <= 680, 'review stage should keep the reference landscape proportion')
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

  const ratio = page.locator('.solo-ratio')
  const ratioLayout = await ratio.evaluate(section => ({
    columns: getComputedStyle(section.querySelector('.solo-ratio-experience')).gridTemplateColumns,
    glow: section.querySelectorAll('.solo-ratio-orbit-glow').length,
    choices: section.querySelectorAll('[data-ratio-choice]').length
  }))
  assert.ok(ratioLayout.columns.split(' ').length >= 2, 'desktop AR ratio experience should use copy/controls and dial columns')
  assert.equal(ratioLayout.glow, 1, 'ratio dial should expose one glowing current-position marker')
  assert.equal(ratioLayout.choices, 4)
  await ratio.locator('[data-ratio-choice="50"]').click()
  await page.waitForFunction(() => document.querySelector('#ratioAudio')?.dataset.ratioAudio === '50')
  await page.waitForFunction(() => document.querySelector('.solo-ratio-num')?.textContent === '50')
  assert.equal(await ratio.locator('.solo-ratio-num').innerText(), '50')

  const revealTargets = ['.solo-review-copy', '.solo-review-visual', '.ar-story-meta', '.ar-story-copy', '.solo-process-head', '.solo-process-slider', '.solo-ratio-control header', '.solo-ratio-visual']
  for (const selector of revealTargets) {
    assert.equal(await page.locator(selector).first().evaluate(node => node.classList.contains('motion-reveal')), true, `${selector} should participate in restrained scroll motion`)
  }

  await page.close()
}

async function testReferenceSpacing(browser) {
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 }, reducedMotion: 'no-preference' })
  await page.goto(`${BASE}?reference-spacing=1#/detail/solo`, { waitUntil: 'domcontentloaded' })
  await page.locator('.solo-ratio:not(.is-loading)').waitFor({ timeout: 15000 })

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

  const ratioMetrics = await page.locator('.solo-ratio').evaluate(section => {
    const experience = section.querySelector('.solo-ratio-experience')
    const columns = getComputedStyle(experience).gridTemplateColumns.split(' ').map(parseFloat)
    const heading = section.querySelector('.solo-ratio-control header').getBoundingClientRect()
    const innerWidth = section.clientWidth - parseFloat(getComputedStyle(section).paddingLeft) - parseFloat(getComputedStyle(section).paddingRight)
    const style = getComputedStyle(section)
    return {
      paddingTop: parseFloat(style.paddingTop),
      paddingInline: parseFloat(style.paddingLeft),
      headingCoverage: heading.width / innerWidth,
      columnRatio: columns[0] / columns[1],
      headingSize: parseFloat(getComputedStyle(section.querySelector('.solo-ratio-control h2')).fontSize),
      markerTransitionMs: parseFloat(getComputedStyle(section.querySelector('.solo-ratio-orbit-glow')).transitionDuration) * 1000
    }
  })
  assert.ok(Math.abs(ratioMetrics.paddingTop - 76) <= 2)
  assert.ok(Math.abs(ratioMetrics.paddingInline - 36) <= 2)
  assert.ok(ratioMetrics.headingCoverage > 0.95, 'AR heading should span the full composition instead of being squeezed into the control column')
  assert.ok(ratioMetrics.columnRatio >= 1.0 && ratioMetrics.columnRatio <= 1.15)
  assert.ok(Math.abs(ratioMetrics.headingSize - 27) <= 1)
  assert.ok(ratioMetrics.markerTransitionMs >= 700)

  const marker = page.locator('.solo-ratio-orbit-glow')
  const beforeMarker = await marker.evaluate(node => getComputedStyle(node).transform)
  await page.locator('[data-ratio-choice="50"]').click()
  await page.waitForFunction(() => document.querySelector('.solo-ratio-num')?.textContent === '50')
  await page.waitForTimeout(760)
  const afterMarker = await marker.evaluate(node => getComputedStyle(node).transform)
  assert.notEqual(afterMarker, beforeMarker, 'glowing marker should move with the selected percentage')
  assert.equal(await page.locator('#ratioAudio').evaluate(audio => audio.paused), false, 'choosing a ratio should immediately play its audio')

  const mobile = await browser.newPage({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' })
  await mobile.goto(`${BASE}?reference-spacing-mobile=1#/detail/solo`, { waitUntil: 'domcontentloaded' })
  await mobile.locator('.solo-ratio:not(.is-loading)').waitFor({ timeout: 15000 })
  const mobileOrder = await mobile.locator('.solo-ratio').evaluate(section => {
    const top = selector => section.querySelector(selector).getBoundingClientRect().top
    return [top('.solo-ratio-control header'), top('.solo-ratio-visual'), top('.solo-ratio-choices'), top('.solo-ratio-player'), top('.solo-ratio-guide')]
  })
  assert.deepEqual([...mobileOrder].sort((a, b) => a - b), mobileOrder, 'mobile AR ratio content should flow heading, dial, choices, player, guide')
  const mobileDialContained = await mobile.locator('.solo-ratio').evaluate(section => {
    const sectionRect = section.getBoundingClientRect()
    const dialRect = section.querySelector('.solo-ratio-orbit').getBoundingClientRect()
    return dialRect.left >= sectionRect.left && dialRect.right <= sectionRect.right
  })
  assert.equal(mobileDialContained, true, 'mobile AR dial should stay inside the section instead of occupying an implicit second column')
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
