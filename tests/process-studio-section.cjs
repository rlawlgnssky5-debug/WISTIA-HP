const { chromium } = require(process.env.WISTIA_NODE_MODULES + '/playwright')
const assert = require('node:assert/strict')
const path = require('node:path')

const EDGE = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'
const BASE = process.env.WISTIA_BASE || 'http://127.0.0.1:4173/'

async function openSolo(browser, viewport, reducedMotion = 'no-preference') {
  const page = await browser.newPage({ viewport, reducedMotion })
  const errors = []
  const processImageRequests = []
  page.on('pageerror', error => errors.push(error.message))
  page.on('request', request => {
    if (/\/assets\/img\/process-studio\//.test(request.url())) processImageRequests.push(request.url())
  })
  page.on('requestfailed', request => {
    if (/\/assets\/img\/process-studio\//.test(request.url())) errors.push(`${request.url()}: ${request.failure()?.errorText}`)
  })
  page.processErrors = errors
  page.processImageRequests = processImageRequests
  await page.goto(`${BASE}?process-studio=1#/detail/solo`, { waitUntil: 'domcontentloaded' })
  await page.locator('[data-process-studio]').waitFor()
  return page
}

;(async () => {
  const browser = await chromium.launch({ headless: true, executablePath: EDGE })
  try {
    const page = await openSolo(browser, { width: 1280, height: 900 })
    const section = page.locator('[data-process-studio]')
    assert.equal(await section.locator('[data-process-chapter]').count(), 7)
    assert.equal(await section.locator('[data-process-image]').count(), 1)
    assert.match(await section.innerText(), /맞춤 제작 상담.*곡과 키 확인/s)
    assert.equal(await section.locator('[data-process-prev]').isDisabled(), true)
    assert.equal(await section.locator('[data-process-next]').isDisabled(), false)
    assert.equal(await section.locator('[data-process-chapter][aria-current="step"]').count(), 1)
    assert.equal(await section.locator('[data-process-feature]').getAttribute('role'), 'group')
    assert.match(await section.locator('[data-process-feature]').getAttribute('aria-label'), /좌우 방향키/)
    assert.equal(await section.locator('.wps-content').getAttribute('aria-live'), 'polite')
    const initialProcessImages = [...new Set(page.processImageRequests.map(url => new URL(url).pathname.split('/').pop()))]
    assert.ok(initialProcessImages.length <= 1 && initialProcessImages.every(name => name === '01-consultation.png'), 'initial page entry should not preload offscreen process images')

    const desktop = await section.evaluate(root => {
      const feature = root.querySelector('[data-process-feature]').getBoundingClientRect()
      const photo = root.querySelector('.wps-photo').getBoundingClientRect()
      const content = root.querySelector('.wps-content').getBoundingClientRect()
      const rootBox = root.getBoundingClientRect()
      return {
        ratio: photo.width / feature.width,
        sideBySide: content.left >= photo.right - 1,
        contained: feature.left >= rootBox.left && feature.right <= rootBox.right,
        overflow: document.documentElement.scrollWidth - innerWidth
      }
    })
    assert.ok(Math.abs(desktop.ratio - 0.59) < 0.03)
    assert.equal(desktop.sideBySide, true)
    assert.equal(desktop.contained, true)
    assert.ok(desktop.overflow <= 1)

    await section.locator('[data-process-next]').click()
    assert.equal((await section.locator('[data-process-current]').innerText()).trim(), '02')
    assert.match(await section.locator('[data-process-title]').innerText(), /스튜디오 방문/)
    assert.match(await section.locator('[data-process-image]').getAttribute('src'), /02-recording/)
    await section.locator('[data-process-feature]').press('ArrowRight')
    assert.equal((await section.locator('[data-process-current]').innerText()).trim(), '03')
    await section.locator('[data-process-chapter="6"]').click()
    assert.equal((await section.locator('[data-process-current]').innerText()).trim(), '07')
    assert.equal(await section.locator('[data-process-next]').isDisabled(), true)
    await section.locator('[data-process-feature]').press('ArrowLeft')
    assert.equal((await section.locator('[data-process-current]').innerText()).trim(), '06')

    for (let index = 0; index < 7; index += 1) {
      await section.locator(`[data-process-chapter="${index}"]`).click()
      await page.waitForFunction(() => {
        const image = document.querySelector('[data-process-image]')
        return image?.complete && image.naturalWidth > 0
      })
      assert.ok((await section.locator('[data-process-title]').innerText()).trim().length > 0, `step ${index + 1} copy must render`)
    }

    const assets = await page.evaluate(async () => {
      const sources = [...document.querySelectorAll('[data-process-chapter]')].map(node => node.dataset.image)
      const responses = await Promise.all(sources.map(source => fetch(source)))
      return responses.map(response => response.status)
    })
    assert.deepEqual(assets, [200, 200, 200, 200, 200, 200, 200])
    assert.deepEqual(page.processErrors, [], 'desktop process section must not emit console errors')
    if (process.env.WISTIA_PROCESS_SCREENSHOTS) {
      await section.locator('[data-process-chapter="1"]').click()
      await page.waitForTimeout(800)
      await section.screenshot({ path: path.join(process.env.WISTIA_PROCESS_SCREENSHOTS, 'process-studio-desktop.png') })
    }
    await page.close()

    for (const width of [360, 390, 430]) {
      const mobile = await openSolo(browser, { width, height: 844 }, 'reduce')
      const mobileSection = mobile.locator('[data-process-studio]')
      const metrics = await mobileSection.evaluate(root => {
        const photo = root.querySelector('.wps-photo').getBoundingClientRect()
        const content = root.querySelector('.wps-content').getBoundingClientRect()
        const chapters = root.querySelector('.wps-chapters')
        return {
          sideBySide: content.left >= photo.right - 1,
          sectionHeight: root.getBoundingClientRect().height,
          pageOverflow: document.documentElement.scrollWidth - innerWidth,
          chapterScrollable: chapters.scrollWidth >= chapters.clientWidth,
          imageAnimation: getComputedStyle(root.querySelector('[data-process-image]')).animationName,
          contentAnimation: getComputedStyle(root.querySelector('.wps-content')).animationName
        }
      })
      assert.equal(metrics.sideBySide, true)
      assert.ok(metrics.sectionHeight < 580, 'mobile process section should stay compact')
      assert.ok(metrics.pageOverflow <= 1, `${width}px viewport must not overflow horizontally`)
      assert.equal(metrics.chapterScrollable, true)
      assert.equal(metrics.imageAnimation, 'none')
      assert.equal(metrics.contentAnimation, 'none')

      const feature = mobileSection.locator('[data-process-feature]')
      await feature.scrollIntoViewIfNeeded()
      await feature.dispatchEvent('touchstart', { changedTouches: [{ identifier: 1, target: null, clientX: 280, clientY: 180 }] })
      await feature.dispatchEvent('touchend', { changedTouches: [{ identifier: 1, target: null, clientX: 220, clientY: 390 }] })
      assert.equal((await mobileSection.locator('[data-process-current]').innerText()).trim(), '01', 'vertical scrolling must not change the process step')
      await feature.dispatchEvent('touchstart', { changedTouches: [{ identifier: 1, target: null, clientX: 280, clientY: 200 }] })
      await feature.dispatchEvent('touchend', { changedTouches: [{ identifier: 1, target: null, clientX: 150, clientY: 200 }] })
      assert.equal((await mobileSection.locator('[data-process-current]').innerText()).trim(), '02')
      await mobile.waitForFunction(() => {
        const image = document.querySelector('[data-process-image]')
        return image?.complete && image.naturalWidth > 0
      })
      assert.deepEqual(mobile.processErrors, [], `${width}px process section must not emit console errors`)
      if (width === 390 && process.env.WISTIA_PROCESS_SCREENSHOTS) {
        await mobile.setViewportSize({ width: 390, height: 1200 })
        await mobileSection.scrollIntoViewIfNeeded()
        await mobileSection.screenshot({ path: path.join(process.env.WISTIA_PROCESS_SCREENSHOTS, 'process-studio-mobile.png') })
      }
      await mobile.close()
    }

    console.log('process studio section checks passed')
  } finally {
    await browser.close()
  }
})().catch(error => {
  console.error(error)
  process.exit(1)
})
