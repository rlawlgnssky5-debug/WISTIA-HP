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
    assert.equal(await page.locator('.solo-editorial-sheet .solo-review-carousel').count(), 0, 'black review stage should remain visually separate from the expert sheet')
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
  assert.equal((await page.locator('.ar-compare-title').innerText()).replace(/\s/g, ''), '같은녹음이라도,결과는같지않습니다.')
  assert.equal((await page.locator('.ar-compare-sub').innerText()).replace(/\s/g, ''), '비슷해보이는서비스도완성도를만드는기준은다릅니다.일반제작과위스티아의차이를직접비교해보세요.')
  assert.deepEqual(await page.locator('[data-ar-compare-row]').evaluateAll(rows => rows.map(row => ({
    criterion: row.querySelector('.ar-compare-criteria').textContent.trim(),
    general: row.querySelector('.ar-compare-general').textContent.trim(),
    wistia: row.querySelector('.ar-compare-wistia').textContent.trim()
  }))), [
    { criterion: '준비 범위', general: '단계별 개별 진행', wistia: '상담부터 AR 제작까지 한 번에' },
    { criterion: '녹음 방식', general: '완곡 중심의 일괄 녹음', wistia: '구간별 1:1 디렉팅' },
    { criterion: '보컬 보정', general: '기본 음정·박자 보정', wistia: '음색을 살린 수작업 보정' },
    { criterion: '최종 전달', general: '완성 음원 제공', wistia: '완성 음원 + 본식용 AR 제공' }
  ])

  const expert = page.locator('[data-story-carousel]')
  assert.equal(await expert.locator('[data-story-slide]').count(), 2)
  await expert.locator('[data-story-next]').click()
  await page.waitForTimeout(650)
  assert.equal(await expert.locator('[data-story-slide="1"].is-active').count(), 1, 'brand story next control should slide to the second editorial story')

  const process = page.locator('[data-process-studio]')
  assert.equal(await process.locator('[data-process-chapter]').count(), 7)
  assert.equal(await process.locator('[data-process-image]').count(), 1)
  assert.match(await process.locator('.wps-head').innerText(), /처음부터 끝까지,.*맞춤형으로 케어해드립니다/s)
  assert.match(await process.locator('[data-process-chapter]').last().getAttribute('aria-label'), /최종 검수 · 전달/)
  await process.locator('[data-process-feature]').press('ArrowRight')
  await page.waitForTimeout(500)
  assert.equal((await process.locator('[data-process-current]').innerText()).trim(), '02', 'ArrowRight should advance the process panel')
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
  const showcase = page.locator('.solo-review-carousel')
  await showcase.scrollIntoViewIfNeeded()
  assert.match(await showcase.innerText(), /실제 고객 후기/)
  assert.equal(await showcase.locator('.review-capture').count(), 22, 'carousel should contain eleven customer captures and their seamless clones')
  assert.equal(await showcase.locator('.solo-review-phone').count(), 0, 'phone mockup should be removed')

  const geometry = await showcase.evaluate(section => {
    const styles = getComputedStyle(section)
    return {
      background: styles.backgroundColor,
      overflow: styles.overflow,
      pageOverflow: document.documentElement.scrollWidth - innerWidth
    }
  })
  assert.equal(geometry.background, 'rgb(8, 9, 9)', 'review section should retain its black background')
  assert.equal(geometry.overflow, 'hidden')
  assert.ok(geometry.pageOverflow <= 1)

  const before = await showcase.locator('.review-loop').evaluate(node => getComputedStyle(node).transform)
  await showcase.locator('[data-review-next]').click()
  await page.waitForTimeout(700)
  const after = await showcase.locator('.review-loop').evaluate(node => getComputedStyle(node).transform)
  assert.notEqual(after, before, 'next control should move the review carousel')
  await page.close()
}

async function testReferenceProcess(browser) {
  const page = await openSolo(browser, { width: 768, height: 1024 })
  const section = page.locator('.solo-process-section')
  await section.scrollIntoViewIfNeeded()
  assert.equal(await section.locator('[data-process-chapter]').count(), 7)
  assert.equal(await section.locator('[data-process-chapter][aria-current="step"]').count(), 1)
  assert.equal((await section.locator('[data-process-current]').innerText()).trim(), '01')

  const geometry = await section.evaluate(root => {
    const feature = root.querySelector('[data-process-feature]').getBoundingClientRect()
    const media = root.querySelector('.wps-photo').getBoundingClientRect()
    const content = root.querySelector('.wps-content').getBoundingClientRect()
    return {
      mediaShare: media.width / feature.width,
      sideBySide: content.left >= media.right - 1,
      contained: feature.left >= root.getBoundingClientRect().left && feature.right <= root.getBoundingClientRect().right
    }
  })
  assert.ok(Math.abs(geometry.mediaShare - .59) < .03, 'desktop process image should occupy 59 percent of the fixed panel')
  assert.equal(geometry.sideBySide, true)
  assert.equal(geometry.contained, true)

  await section.locator('[data-process-next]').click()
  await page.waitForTimeout(500)
  assert.equal(await section.locator('[data-process-chapter="1"][aria-current="step"]').count(), 1)
  assert.equal((await section.locator('[data-process-current]').innerText()).trim(), '02')
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

  const review = page.locator('.solo-review-carousel')
  assert.match(await review.innerText(), /실제 고객\s*후기/)
  const reviewGeometry = await review.evaluate(section => {
    const card = section.querySelector('.review-capture').getBoundingClientRect()
    return { height: section.getBoundingClientRect().height, cardWidth: card.width, overflow: document.documentElement.scrollWidth-innerWidth }
  })
  assert.ok(reviewGeometry.height > 300, 'review stage should keep readable card height')
  assert.ok(reviewGeometry.cardWidth > 200, 'review captures should remain readable')
  assert.ok(reviewGeometry.overflow <= 1, 'review carousel must not widen the page')

  const process = page.locator('.solo-process-section')
  await process.locator('[data-process-next]').click()
  await page.waitForTimeout(260)
  const processStyle = await process.evaluate(section => {
    const feature = section.querySelector('[data-process-feature]')
    const active = section.querySelector('[data-process-chapter].is-active')
    const inactive = section.querySelector('[data-process-chapter]:not(.is-active)')
    return {
      accent: getComputedStyle(section.querySelector('.wps-head [data-solo-title]')).color,
      shadow: getComputedStyle(feature).boxShadow,
      transition: getComputedStyle(section.querySelector('[data-process-image]')).animationDuration,
      activeBackground: getComputedStyle(active).backgroundColor,
      inactiveBackground: getComputedStyle(inactive).backgroundColor
    }
  })
  assert.equal(processStyle.accent, 'rgb(32, 36, 38)', 'process heading should use the shared charcoal type color')
  assert.notEqual(processStyle.shadow, 'none', 'main process panel should have a soft elevated shadow')
  assert.ok(processStyle.transition.split(',').some(value => parseFloat(value) >= 0.43), 'process image motion should be deliberate and smooth')
  assert.equal(processStyle.activeBackground, 'rgb(24, 24, 23)', 'active chapter should use the black selection state')
  assert.equal(processStyle.inactiveBackground, 'rgba(0, 0, 0, 0)', 'inactive chapters should retain the warm gray navigation background')

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

  const revealTargets = ['.ar-story-meta', '.ar-story-copy', '.wps-head', '.wps-feature', '.ar-cd-copy', '.ar-cd-visual']
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
    const title = copy.querySelector('.ar-story-role').getBoundingClientRect()
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
      titleSize: parseFloat(getComputedStyle(copy.querySelector('.ar-story-role')).fontSize),
      transitionMs: parseFloat(getComputedStyle(slide.closest('[data-expert-track]')).transitionDuration) * 1000
    }
  })
  assert.ok(Math.abs(storyMetrics.paddingTop - 70) <= 2)
  assert.ok(Math.abs(storyMetrics.paddingInline - 42) <= 2)
  assert.ok(Math.abs(storyMetrics.metaGap - 52) <= 2)
  assert.ok(storyMetrics.titleToBodyRatio >= 0.6 && storyMetrics.titleToBodyRatio <= 0.74, 'story title/body columns should follow the reference 40:60 rhythm')
  assert.ok(storyMetrics.copyToImage >= 38 && storyMetrics.copyToImage <= 46, 'story copy should keep clear breathing room before the image')
  assert.ok(storyMetrics.imageRatio >= 2.75 && storyMetrics.imageRatio <= 2.95, 'story photograph should use the reference panoramic crop')
  assert.ok(Math.abs(storyMetrics.titleSize - 19) <= 1)
  assert.ok(storyMetrics.transitionMs >= 650 && storyMetrics.transitionMs <= 720)
  const storyPunctuationTogether = await page.locator('.ar-story-slide.is-active .ar-story-copy p').evaluate(title => {
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
  assert.ok(ratioMetrics.headingSize >= 17 && ratioMetrics.headingSize <= 19)
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
