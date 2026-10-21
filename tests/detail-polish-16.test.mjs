import {test} from 'node:test'
import assert from 'node:assert/strict'
import {createRequire} from 'node:module'
import {existsSync,readFileSync} from 'node:fs'
import {spawn} from 'node:child_process'
import {createServer} from 'node:net'
const require=createRequire(import.meta.url)
let playwright,executable,skip=false
try{playwright=require('playwright');executable=process.env.WISTIA_BROWSER_EXECUTABLE||['/usr/bin/chromium',playwright.chromium.executablePath()].find(existsSync);if(!executable)skip='Chromium not installed'}catch{skip='Playwright not installed'}
await test('About title, label and prose rails match; icons center on the first line and shared inquiry headings stay aligned',{skip,timeout:120000},async()=>{
 const probe=createServer();await new Promise(r=>probe.listen(0,'127.0.0.1',r));const port=probe.address().port;await new Promise(r=>probe.close(r))
 const server=spawn(process.execPath,['scripts/local-preview.mjs'],{env:{...process.env,WISTIA_PREVIEW_PORT:String(port)},stdio:['ignore','pipe','pipe']})
 let browser
 try{
  await new Promise((resolve,reject)=>{const timer=setTimeout(()=>reject(Error('preview timeout')),10000);server.stdout.once('data',()=>{clearTimeout(timer);resolve()});server.once('error',reject)})
  browser=await playwright.chromium.launch({headless:true,executablePath:executable,args:['--no-sandbox','--disable-dev-shm-usage']})
  for(const width of [360,375,390,1280]){
   const context=await browser.newContext({viewport:{width,height:844},isMobile:true,hasTouch:true}),page=await context.newPage()
   await page.clock.setFixedTime(new Date('2026-10-12T03:00Z'))
   await page.route('https://**/*',r=>r.abort())
   const fontFixture=process.env.WISTIA_FONT_FIXTURE_DIR
   if(fontFixture)await page.route('https://cdn.jsdelivr.net/gh/fonts-archive/MaruBuri@*/MaruBuri-*.woff2',r=>r.fulfill({body:readFileSync(fontFixture+'/'+new URL(r.request().url()).pathname.split('/').at(-1)),contentType:'font/woff2'}))
   await page.route('**/api/availability?*',r=>{const q=new URL(r.request().url()).searchParams;return r.fulfill({json:{ok:true,from:q.get('from'),to:q.get('to'),date:q.get('date'),blocks:[]}})})

   const gone=await page.goto(`http://127.0.0.1:${port}/info/about`,{waitUntil:'domcontentloaded'})
   assert.equal(gone.status(),410)
   assert.match(await page.content(),/없어진 페이지예요/)
   assert.equal(await page.locator('#app').count(),0)
   await page.goto(`http://127.0.0.1:${port}/event/solo`,{waitUntil:'domcontentloaded'})
   await page.locator('#sourceTitle[data-title-aligned]').waitFor()
   const shared=await page.locator('#scheduleTitle').evaluate(n=>{const t=n.querySelector('.svg-section-text'),p=n.parentElement.querySelector('p');return {text:t.getBoundingClientRect().left,body:p.getBoundingClientRect().left}})
   assert.ok(Math.abs(shared.text-shared.body)<1,JSON.stringify(shared))
   await context.close()
  }
 }finally{await browser?.close();server.kill()}
})
