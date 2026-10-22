const { chromium } = require('C:/Users/User/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright')
const fs = require('node:fs'), path = require('node:path'), assert = require('node:assert/strict')
const base = process.env.WISTIA_QA_BASE || 'http://127.0.0.1:4212'
const phase = process.env.WISTIA_QA_PHASE || 'before'
const out = path.resolve(__dirname, '../output/customer-audit-20261023', phase)
const widths = (process.env.WISTIA_QA_WIDTHS || '320,360,375,390,430,600,601,779,780,1024,1280,1440').split(',').map(Number)
const routes = ['/', '/detail/solo', '/detail/duo', '/contact', '/event/solo', '/event/duo', '/events', '/info/faq', '/info/location']
;(async () => {
 fs.mkdirSync(out, { recursive: true })
 const browser = await chromium.launch({ executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', headless: true })
 const results = [], errors = [], broken = [], links = new Set()
 const measure = page => page.evaluate(() => {
  const box = e => { const r = e.getBoundingClientRect(); return { x: r.x, width: r.width } }
  const painted = e => e.getClientRects().length && getComputedStyle(e).visibility === 'visible' && !e.closest('[hidden],.sr-only,.solo-seo,[aria-hidden="true"],svg,.hs-slide')
  const clipped = [], walker = document.createTreeWalker(document.querySelector('main'), NodeFilter.SHOW_TEXT)
  let n
  while (n = walker.nextNode()) {
   if (!n.textContent.trim() || !painted(n.parentElement) || n.parentElement.closest('script,style,select,textarea')) continue
   const range = document.createRange(); range.selectNodeContents(n)
   for (const r of range.getClientRects()) if (r.width && (r.left < -1 || r.right > innerWidth + 1)) clipped.push({ text: n.textContent.trim().slice(0, 100), left: r.left, right: r.right })
  }
  const ids = [...document.querySelectorAll('[id]')].map(e => e.id)
  const duplicates = [...new Set(ids.filter((v, i) => ids.indexOf(v) !== i))]
  const badImages = [...document.querySelectorAll('main img')].filter(e => e.getClientRects().length && e.complete && !e.naturalWidth).map(e => e.getAttribute('src'))
  return { overflow: Math.max(document.body.scrollWidth, document.documentElement.scrollWidth) - innerWidth, main: box(document.querySelector('main')), header: box(document.querySelector('#siteHeader')), footer: document.querySelector('main footer') ? box(document.querySelector('.solo-footer-clean') || document.querySelector('main footer')) : null, clipped, duplicates, badImages }
 })
 const settled = async p => { await p.waitForFunction(() => document.querySelector('main')?.innerText.length > 30); await p.evaluate(() => document.fonts.ready) }
 try {
  for (const width of widths) {
   const context = await browser.newContext({ viewport: { width, height: 844 }, isMobile: width < 780, hasTouch: width < 780, reducedMotion: 'reduce', timezoneId: 'Asia/Seoul' })
   await context.route(/facebook\.com|connect\.facebook|google-analytics|googletagmanager/, r => r.abort())
   const p = await context.newPage()
   p.on('pageerror', e => errors.push({ width, url: p.url(), error: e.message }))
   p.on('response', r => { if (r.url().startsWith(base) && r.status() >= 400) broken.push({ width, url: r.url(), status: r.status() }) })
   for (const route of routes) {
    await p.goto(base + route); await settled(p)
    await p.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += innerHeight * .8) { scrollTo(0, y); await new Promise(r => requestAnimationFrame(r)) } scrollTo(0, 0) })
    await p.waitForTimeout(100)
    const direct = await measure(p)
    for (const link of await p.locator('a[href]').evaluateAll(es => es.map(e => e.getAttribute('href')))) if (link.startsWith('/') && !link.startsWith('//')) links.add(link)
    if ([320,390,780,1280].includes(width)) await p.screenshot({ path: path.join(out, (route === '/' ? 'home' : route.slice(1).replaceAll('/', '-')) + '-' + width + '.png'), fullPage: true })
    await p.evaluate(target => { history.pushState({}, '', '/info/faq'); dispatchEvent(new PopStateEvent('popstate')); history.pushState({}, '', target); dispatchEvent(new PopStateEvent('popstate')) }, route)
    await settled(p); const spa = await measure(p)
    results.push({ route, width, direct, spa })
   }
   console.log('Page audit ' + width + 'px: 9 direct + 9 SPA')
   await context.close()
  }
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, reducedMotion: 'reduce', timezoneId: 'Asia/Seoul' })
  const p = await ctx.newPage()
  await p.goto(base + '/contact?package=C&wistia_vid=qa-retain'); await settled(p)
  await p.locator('[data-wf-prev]').tap(); await p.waitForURL('**/detail/solo*'); await settled(p)
  const previous = { url: p.url(), selected: await p.locator('[name="detailPackage"]:checked').inputValue() }
  await p.goto(base + '/contact?package=C'); await settled(p)
  await p.locator('[data-wf-next]').tap(); await p.waitForTimeout(300)
  const overlays = []
  for (let y = 0; y < await p.evaluate(() => document.body.scrollHeight); y += 80) {
   await p.evaluate(y => scrollTo(0, y), y); await p.waitForTimeout(25)
   const overlap = await p.evaluate(() => {
    const b = document.querySelector('#floatingKakaoChat'), r = b.getBoundingClientRect()
    if (getComputedStyle(b).visibility === 'hidden' || getComputedStyle(b).opacity === '0' || !r.width) return null
    const e = document.elementsFromPoint(r.x + r.width / 2, r.y + r.height / 2).find(e => e.closest('main') && e.closest('button,label,input,select,textarea,a'))
    return e ? { scroll: scrollY, text: e.textContent?.trim().slice(0, 60), tag: e.tagName, chatY: r.y } : null
   })
   if (overlap) overlays.push(overlap)
  }
  await ctx.close()
  const report = { base, phase, results, errors, broken, links: [...links].sort(), previous, overlays }
  fs.writeFileSync(path.join(out, 'results.json'), JSON.stringify(report, null, 2))
  const failures = results.filter(x => [x.direct,x.spa].some(m => m.overflow || m.clipped.length || m.badImages.length || m.duplicates.length || x.width >= 780 && (m.main.width !== 780 || m.header.width !== 780 || m.footer?.width !== 780 || m.main.x !== (x.width - 780) / 2 || m.header.x !== m.main.x || m.footer?.x !== m.main.x)))
  console.log(JSON.stringify({ cases: results.length, failures: failures.map(x => ({ route: x.route, width: x.width, direct: x.direct })), errors, broken, previous, overlays }, null, 2))
  if (phase !== 'before') { assert.deepEqual(failures, []); assert.deepEqual(errors, []); assert.deepEqual(broken, []); assert.equal(previous.selected, 'C'); assert.equal(new URL(previous.url).searchParams.get('wistia_vid'), 'qa-retain'); assert.deepEqual(overlays, []) }
 } finally { await browser.close() }
})().catch(e => { console.error(e); process.exitCode = 1 })
