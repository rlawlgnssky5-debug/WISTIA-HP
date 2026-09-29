const assert = require('node:assert/strict')
const { createServer } = require('node:http')
const { readFile, stat } = require('node:fs/promises')
const { resolve, extname } = require('node:path')
const { chromium } = require(process.env.WISTIA_NODE_MODULES + '/playwright')

const root = resolve(__dirname, '..')
const mime = {'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.xml':'application/xml; charset=utf-8','.txt':'text/plain; charset=utf-8','.json':'application/json; charset=utf-8'}
const expected = [
  ['/', '위스티아 | 웨딩 사전 녹음·식전·프로포즈 영상'],
  ['/detail/solo', '사전 녹음 1시간 | 본식 축가 AR · 위스티아'],
  ['/event/solo', '얼마일까 | 위스티아 사전녹음·영상 가격 계산'],
  ['/info/location', '오시는 길 | 경기도 부천 위스티아']
]

;(async () => {
  const server = createServer(async (request, response) => {
    let path = decodeURIComponent(new URL(request.url, 'http://127.0.0.1').pathname)
    if (path === '/') path = '/index.html'
    else if (!extname(path)) path = /^\/(detail|event)\/[^/]+\/[^/]+$/.test(path) ? path.split('/').slice(0, 3).join('/') + '.html' : path + '.html'
    let file = resolve(root, '.' + path)
    if (!file.startsWith(root)) {response.writeHead(403).end();return}
    try {if (!(await stat(file)).isFile()) throw Error('not a file')}
    catch {file = resolve(root, 'index.html')}
    response.setHeader('Content-Type', mime[extname(file)] || 'application/octet-stream')
    response.end(await readFile(file))
  })
  await new Promise(done => server.listen(4173, '127.0.0.1', done))
  let browser
  try {
    for (const [path, title] of expected) {
      const html = await (await fetch('http://127.0.0.1:4173' + path)).text()
      assert.ok(html.includes(`<title>${title}</title>`), path)
      assert.ok(html.includes(`href="https://www.wistiastudio.com${path}"`), path)
    }
    const sitemap = await (await fetch('http://127.0.0.1:4173/sitemap.xml')).text()
    assert.ok(!sitemap.includes('#'))
    assert.ok(sitemap.includes('/info/location'))
    browser = await chromium.launch({headless:true,executablePath:'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'})
    for (const width of [320, 390, 579]) {
      const page = await browser.newPage({viewport:{width,height:width===579?729:850},reducedMotion:'reduce',permissions:['clipboard-read','clipboard-write']})
      const errors=[]
      page.on('pageerror', error => errors.push(error.message))
      await page.addInitScript(() => {
        window.__trackingRoutes = []
        let tracker
        Object.defineProperty(window, 'wistiaMeta', {
          configurable: true,
          get: () => tracker,
          set: value => {
            tracker = value
            value.trackPageView = () => {window.__trackingRoutes.push(['PageView', location.pathname]);return true}
            value.trackViewContent = payload => {window.__trackingRoutes.push(['ViewContent', location.pathname, payload.content_ids[0]]);return true}
          }
        })
      })
      await page.goto('http://127.0.0.1:4173/#/detail/solo', {waitUntil:'domcontentloaded'})
      await page.waitForURL('**/detail/solo')
      await page.locator('#arHookTitle').waitFor()
      assert.equal(await page.locator('.ar-expert-panel-keyword').allTextContents().then(items => items.includes('영상 연출')), false)
      assert.equal(await page.locator('.ar-expert-panel-keyword').allTextContents().then(items => items.includes('사운드 완성')), true)
      assert.ok((await page.locator('.ar-expert-panel-sub').first().textContent()).includes('싱어게인2'))
      assert.equal(await page.locator('.ar-expert-split.is-single .ar-expert-panel').count(), 1)
      assert.equal(await page.locator('.floating-price-mark').count(), 0)
      assert.equal(await page.title(), expected[1][1])
      assert.equal(await page.locator('meta[property="og:url"]').getAttribute('content'),'https://www.wistiastudio.com/detail/solo')
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth),false)
      await page.goto('http://127.0.0.1:4173/detail/duo')
      assert.equal(await page.locator('.ar-expert-panel-keyword').allTextContents().then(items => items.includes('영상 연출')), false)
      assert.ok((await page.locator('.wistia-advantages').textContent()).includes('경기도 부천에서 만나는 합리적인 가격'))
      await page.locator('#menuToggle').click()
      await page.locator('#mainMenu a[href="/info/location"]').click()
      await page.waitForURL('**/info/location')
      assert.ok((await page.locator('.wistia-location-address').textContent()).includes('경기도 부천시 석천로170번길 19, 2층'))
      assert.equal(await page.locator('.wistia-location-links a').count(), 2)
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false)
      await page.goto('http://127.0.0.1:4173/')
      await page.locator('.finder-choice').first().click()
      await page.waitForURL('**/detail/solo')
      await page.locator('#floatingPrice').click()
      await page.waitForURL('**/event/solo')
      await page.locator('[data-option="lyrics-video"]').check()
      await page.locator('[data-base-product="duo"]').scrollIntoViewIfNeeded()
      await page.evaluate(() => {window.__priceForm = document.querySelector('#consultForm');scrollTo(0,150)})
      const beforeDuration = await page.evaluate(() => scrollY)
      await page.locator('label:has([data-base-product="duo"])').click()
      await page.waitForURL('**/event/duo')
      await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))))
      assert.ok(Math.abs((await page.evaluate(() => scrollY)) - beforeDuration) <= 2, 'AR duration choice changed scroll position')
      assert.equal(await page.evaluate(() => document.querySelector('#consultForm') === window.__priceForm), true, 'AR duration choice rebuilt the form')
      assert.equal(await page.locator('[data-option="lyrics-video"]').isChecked(), true)
      assert.equal(await page.locator('#mobilePrice').textContent(), '20만원')
      await page.goto('http://127.0.0.1:4173/event/solo-film')
      await page.locator('label:has([data-film-people="2"])').click({trial:true})
      const beforePeople = await page.evaluate(() => scrollY)
      await page.locator('label:has([data-film-people="2"])').click()
      await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))))
      assert.ok(Math.abs((await page.evaluate(() => scrollY)) - beforePeople) <= 2, `film people choice changed scroll position at ${width}px from ${beforePeople} to ${await page.evaluate(() => scrollY)}`)
      assert.equal(await page.locator('#basePrice').textContent(), '28만원')
      await page.locator('label:has([data-film-people="1"])').click({trial:true})
      const beforeBackToOne = await page.evaluate(() => scrollY)
      await page.locator('label:has([data-film-people="1"])').click()
      await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))))
      assert.ok(Math.abs((await page.evaluate(() => scrollY)) - beforeBackToOne) <= 2, 'film people reverse choice changed scroll position')
      assert.equal(await page.locator('#basePrice').textContent(), '22만원')
      await page.locator('label:has([data-option])').first().click({trial:true})
      const beforeOption = await page.evaluate(() => scrollY)
      await page.locator('label:has([data-option])').first().click()
      await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))))
      assert.ok(Math.abs((await page.evaluate(() => scrollY)) - beforeOption) <= 2, 'option choice changed scroll position')
      await page.goto('http://127.0.0.1:4173/detail/solo-film')
      assert.equal(await page.locator('.ar-expert-panel-keyword').allTextContents().then(items => items.includes('영상 연출')), true)
      await page.goto('http://127.0.0.1:4173/event/solo')
      await page.locator('#consultForm button[type="submit"]').click()
      await page.locator('.consult-copy-action').waitFor()
      assert.ok((await page.locator('.consult-copy-action').getAttribute('href')).includes('pf.kakao.com'))
      await page.goto('http://127.0.0.1:4173/detail/solo')
      await page.waitForFunction(() => window.__trackingRoutes.some(event => event[0] === 'ViewContent' && event[1] === '/detail/solo'))
      const beforeLegacyHash = await page.evaluate(() => window.__trackingRoutes.length)
      await page.evaluate(() => {location.hash = '#/detail/duo'})
      await page.waitForURL('**/detail/duo')
      await page.locator('#arHookTitle').waitFor()
      await page.waitForTimeout(100)
      assert.deepEqual(await page.evaluate(start => window.__trackingRoutes.slice(start), beforeLegacyHash), [
        ['PageView', '/detail/duo'],
        ['ViewContent', '/detail/duo', 'duo']
      ])
      const beforeLegacyHome = await page.evaluate(() => window.__trackingRoutes.length)
      await page.evaluate(() => {location.hash = '#/'})
      await page.waitForURL('http://127.0.0.1:4173/')
      await page.waitForTimeout(100)
      assert.deepEqual(await page.evaluate(start => window.__trackingRoutes.slice(start), beforeLegacyHome), [
        ['PageView', '/']
      ])
      const beforeBrowserBack = await page.evaluate(() => window.__trackingRoutes.length)
      await page.goBack()
      await page.waitForURL('**/detail/duo')
      await page.locator('#arHookTitle').waitFor()
      await page.waitForTimeout(100)
      assert.deepEqual(await page.evaluate(start => window.__trackingRoutes.slice(start), beforeBrowserBack), [
        ['PageView', '/detail/duo'],
        ['ViewContent', '/detail/duo', 'duo']
      ])
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth),false)
      assert.deepEqual(errors,[])
      await page.close()
    }
    console.log('Path prerender and mobile consultation flow checks passed')
  } finally {
    await browser?.close()
    await new Promise(done => server.close(done))
  }
})().catch(error => {console.error(error);process.exitCode=1})
