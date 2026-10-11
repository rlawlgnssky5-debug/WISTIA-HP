import {test} from 'node:test'
import assert from 'node:assert/strict'
import {createRequire} from 'node:module'
import {existsSync} from 'node:fs'
import {spawn} from 'node:child_process'
import {createServer} from 'node:net'
const require=createRequire(import.meta.url)
let playwright,executable,skip=false
try{playwright=require('playwright');executable=process.env.WISTIA_BROWSER_EXECUTABLE||['/usr/bin/chromium',playwright.chromium.executablePath()].find(existsSync);if(!executable)skip='Chromium not installed'}catch{skip='Playwright not installed'}
await test('Every event inquiry fits its SVG and one-line submit label at phone widths and hides only its floating CTA',{skip,timeout:90000},async()=>{
 const probe=createServer();await new Promise(r=>probe.listen(0,'127.0.0.1',r));const port=probe.address().port;await new Promise(r=>probe.close(r))
 const server=spawn(process.execPath,['scripts/local-preview.mjs'],{env:{...process.env,WISTIA_PREVIEW_PORT:String(port)},stdio:['ignore','pipe','pipe']})
 let browser
 try{
  await new Promise((resolve,reject)=>{const timer=setTimeout(()=>reject(Error('preview timeout')),10000);server.stdout.once('data',()=>{clearTimeout(timer);resolve()});server.once('error',reject)})
  browser=await playwright.chromium.launch({headless:true,executablePath:executable,args:['--no-sandbox','--disable-dev-shm-usage']})
  for(const width of [320,360,375,390]){
   const context=await browser.newContext({viewport:{width,height:844},isMobile:true,hasTouch:true}),page=await context.newPage()
   await page.route('https://**/*',r=>r.abort())
   await page.route('**/api/availability?*',r=>{const q=new URL(r.request().url()).searchParams;return r.fulfill({json:{ok:true,from:q.get('from'),to:q.get('to'),date:q.get('date'),blocks:[]}})})
   for(const product of ['solo','duo','duet-film']){
    await page.goto(`http://127.0.0.1:${port}/event/${product}`,{waitUntil:'domcontentloaded'})
    await page.locator('.contact-submit .svg-submit-icon svg').waitFor()
    await page.locator('.svg-section-text').first().waitFor()
    const measure=()=>page.evaluate(()=>{
     const button=document.querySelector('.contact-submit'),label=button.querySelector('[data-submit-label]'),svg=label.querySelector('svg'),b=button.getBoundingClientRect(),l=label.getBoundingClientRect(),s=svg.getBoundingClientRect()
     const text=[...label.childNodes].find(n=>n.nodeType===Node.TEXT_NODE&&n.textContent.trim());const range=document.createRange();range.selectNodeContents(text);const lines=[...range.getClientRects()]
     return {button:{left:b.left,right:b.right},label:{left:l.left,right:l.right},svg:{left:s.left,right:s.right},lines:lines.length,text:label.textContent.trim(),overflow:button.scrollWidth-button.clientWidth,float:getComputedStyle(document.querySelector('#floatingKakaoChat')).display,pageOverflow:document.documentElement.scrollWidth-innerWidth}
    })
    for(const icon of ['copy','check']){
     // Both incomplete and ready states use this same SVG/text layout.
     await page.locator('.contact-submit').evaluate((n,icon)=>{n.dataset.submitState=icon==='check'?'ready':'incomplete';n.querySelector('.svg-submit-icon').innerHTML=window.studioIcon(icon)},icon)
     const m=await measure(),tag=product+' '+width+' '+icon
     assert.equal(m.text,'작성한 내용으로 카카오톡 문의하기',tag);assert.equal(m.lines,1,tag);assert.equal(m.overflow,0,tag);assert.equal(m.pageOverflow,0,tag)
     for(const r of [m.label,m.svg]){assert.ok(r.left>=m.button.left,tag+' left '+JSON.stringify(m));assert.ok(r.right<=m.button.right,tag+' right '+JSON.stringify(m))}
     assert.equal(m.float,'none',tag)
    }
   }
   // Client-side navigation must restore the pill outside /event/*, including /contact.
   await page.evaluate(()=>{history.pushState(null,'','/contact');dispatchEvent(new PopStateEvent('popstate'))})
   await page.locator('#floatingKakaoChat').waitFor({state:'visible'})
   assert.equal(await page.locator('body').evaluate(n=>n.classList.contains('is-event-inquiry')),false)
   await context.close()
  }
 }finally{await browser?.close();server.kill()}
})
