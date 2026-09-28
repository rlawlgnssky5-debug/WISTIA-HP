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
  ['/event/solo', '얼마일까 | 위스티아 사전녹음·영상 가격 계산']
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
    browser = await chromium.launch({headless:true,executablePath:'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'})
    for (const width of [320, 390]) {
      const page = await browser.newPage({viewport:{width,height:850},reducedMotion:'reduce',permissions:['clipboard-read','clipboard-write']})
      const errors=[]
      page.on('pageerror', error => errors.push(error.message))
      await page.goto('http://127.0.0.1:4173/#/detail/solo', {waitUntil:'domcontentloaded'})
      await page.waitForURL('**/detail/solo')
      await page.locator('#arHookTitle').waitFor()
      assert.equal(await page.title(), expected[1][1])
      assert.equal(await page.locator('meta[property="og:url"]').getAttribute('content'),'https://www.wistiastudio.com/detail/solo')
      await page.goto('http://127.0.0.1:4173/')
      await page.locator('.finder-choice').first().click()
      await page.waitForURL('**/detail/solo')
      await page.locator('#floatingPrice').click()
      await page.waitForURL('**/event/solo')
      await page.locator('#consultForm button[type="submit"]').click()
      await page.locator('.consult-copy-action').waitFor()
      assert.ok((await page.locator('.consult-copy-action').getAttribute('href')).includes('pf.kakao.com'))
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
