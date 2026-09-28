const assert = require('node:assert/strict')
const { chromium } = require(process.env.WISTIA_NODE_MODULES + '/playwright')

const base = process.env.WISTIA_PREVIEW_URL || 'http://127.0.0.1:4173'
const routes = [
  ['#/', '위스티아 | 웨딩 사전 녹음·식전·프로포즈 영상'],
  ['#/detail/solo', '사전 녹음 1시간 | 본식 축가 AR · 위스티아'],
  ['#/detail/duo', '사전 녹음 2시간 | 듀엣 축가 AR · 위스티아'],
  ['#/detail/solo-film', '축가 메이킹필름 | 내 목소리 본식 상영 · 위스티아'],
  ['#/detail/wedding', '식전 스토리 필름 | 우리 목소리 웨딩영상 · 위스티아'],
  ['#/detail/proposal', '프로포즈 영상 | 노래로 전하는 고백 · 위스티아'],
  ['#/event/solo', '얼마일까 | 위스티아 사전녹음·영상 가격 계산']
]

;(async () => {
  const browser = await chromium.launch({ headless: true, executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe' })
  try {
    for (const width of [320, 390]) {
      const page = await browser.newPage({ viewport: { width, height: 850 }, reducedMotion: 'reduce' })
      const errors = []
      page.on('pageerror', error => errors.push(error.message))
      await page.route(/(facebook\.net|facebook\.com\/tr|google-analytics\.com|googletagmanager\.com)/, route => route.abort())
      await page.goto(base + '/#/', { waitUntil: 'domcontentloaded' })
      await page.locator('#finderTitle').waitFor()
      for (const [hash, title] of routes) {
        await page.evaluate(next => { location.hash = next }, hash)
        await page.waitForFunction(expected => document.title === expected, title)
        assert.equal(await page.locator('meta[name="description"]').getAttribute('content') !== '', true)
        assert.equal(await page.locator('meta[property="og:title"]').getAttribute('content'), title)
        assert.equal(await page.locator('meta[property="og:url"]').getAttribute('content'), 'https://www.wistiastudio.com/' + hash)
        assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false)
      }
      assert.ok((await page.locator('#floatingKakaoChat').getAttribute('href')).includes('pf.kakao.com'))
      assert.deepEqual(errors, [])
      await page.close()
    }
  } finally {
    await browser.close()
  }
  console.log('SEO route metadata and mobile checks passed at 320px and 390px')
})().catch(error => { console.error(error); process.exitCode = 1 })
