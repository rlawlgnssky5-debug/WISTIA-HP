const assert = require('node:assert/strict')
const path = require('node:path')
const { chromium } = require(process.env.WISTIA_NODE_MODULES + '/playwright')

;(async () => {
  const browser = await chromium.launch({ headless: true, executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe' })
  try {
    for (const width of [320, 390, 1440]) {
      const page = await browser.newPage({ viewport: { width, height: 850 }, reducedMotion: 'reduce' })
      const errors = []
      page.on('pageerror', error => errors.push(error.message))
      await page.goto('http://127.0.0.1:4173/#/', { waitUntil: 'domcontentloaded' })
      await page.locator('#finderTitle').waitFor()
      assert.equal(await page.locator('#finderTitle').innerText(), '어떤 순간을 남기고 싶으신가요?')
      assert.equal(await page.evaluate(() => document.querySelector('#app').scrollWidth > document.querySelector('#app').clientWidth), false)
      if (process.env.WISTIA_QA_DIR) await page.locator('#app').screenshot({ path: path.join(process.env.WISTIA_QA_DIR, `home-${width}.png`) })

      await page.locator('#menuToggle').click()
      assert.equal(await page.locator('#mainMenu a[href="#/info/about"]').innerText(), '위스티아는 어떤 곳인가요?')
      await page.locator('#mainMenu a[href="#/events"]').click()
      await page.locator('.wistia-events-list .wistia-event-card').first().waitFor()
      assert.equal(await page.locator('.wistia-event-card').count(), 4)
      assert.equal(await page.locator('.booking-calculator, #mobilePrice').count(), 0)
      assert.equal(await page.locator('#floatingKakao').isVisible(), false)
      if (process.env.WISTIA_QA_DIR) await page.locator('#app').screenshot({ path: path.join(process.env.WISTIA_QA_DIR, `events-${width}.png`) })

      await page.evaluate(() => { location.hash = '#/event/solo' })
      await page.locator('#mobilePrice').waitFor()
      assert.equal(await page.locator('#mobilePrice').innerText(), '12만원')
      await page.evaluate(() => { location.hash = '#/events' })
      await page.locator('.wistia-events-list').waitFor()

      await page.locator('#menuToggle').click()
      await page.locator('#mainMenu a[href="#/info/about"]').click()
      await page.locator('.wistia-about-story').waitFor()
      const aboutMetrics = await page.evaluate(() => ({
        story: document.querySelector('.wistia-about-story').getBoundingClientRect().width,
        specialist: document.querySelector('.wistia-specialist-grid article h3').getBoundingClientRect().width,
        columns: getComputedStyle(document.querySelector('.wistia-about-story')).gridTemplateColumns.split(' ').length
      }))
      assert.equal(aboutMetrics.columns, 1)
      assert.ok(aboutMetrics.story >= 260, JSON.stringify(aboutMetrics))
      assert.ok(aboutMetrics.specialist >= 160, JSON.stringify(aboutMetrics))
      assert.equal(await page.locator('#floatingKakao').isVisible(), false)
      for (const image of await page.locator('.wistia-specialist-grid img').all()) {
        await image.scrollIntoViewIfNeeded()
        await image.evaluate(element => element.decode())
        assert.ok(await image.evaluate(element => element.naturalWidth > 0))
      }
      assert.equal(await page.evaluate(() => document.querySelector('#app').scrollWidth > document.querySelector('#app').clientWidth), false)
      await page.evaluate(() => window.scrollTo(0, 0))
      if (process.env.WISTIA_QA_DIR) await page.locator('#app').screenshot({ path: path.join(process.env.WISTIA_QA_DIR, `about-${width}.png`) })

      await page.evaluate(() => { location.hash = '#/before-after' })
      await page.locator('#wistiaBeforeAfterTitle').waitFor()
      const heading = await page.locator('#wistiaBeforeAfterTitle').evaluate(element => ({
        text: element.textContent,
        height: element.getBoundingClientRect().height,
        lineHeight: parseFloat(getComputedStyle(element).lineHeight),
        scrollWidth: element.scrollWidth,
        clientWidth: element.clientWidth
      }))
      assert.equal(heading.text, '노래를 잘 못해도 괜찮습니다')
      assert.ok(heading.height <= heading.lineHeight * 1.1, JSON.stringify(heading))
      assert.ok(heading.scrollWidth <= heading.clientWidth, JSON.stringify(heading))
      assert.ok(await page.locator('.ba-paragraph').count() === 2)
      await page.locator('.bap-tab[data-mode="after"]').click()
      assert.equal(await page.locator('.bap-tab[data-mode="after"]').getAttribute('aria-pressed'), 'true')
      assert.equal(await page.evaluate(() => document.querySelector('#app').scrollWidth > document.querySelector('#app').clientWidth), false)
      if (process.env.WISTIA_QA_DIR) await page.locator('#app').screenshot({ path: path.join(process.env.WISTIA_QA_DIR, `before-after-${width}.png`) })
      assert.deepEqual(errors, [])
      await page.close()
    }
  } finally {
    await browser.close()
  }
  console.log('Home, events, about, and before/after checks passed at 320px, 390px, and 1440px')
})().catch(error => { console.error(error); process.exitCode = 1 })
