import {test} from 'node:test'
import assert from 'node:assert/strict'
import {createRequire} from 'node:module'
import {existsSync,readFileSync} from 'node:fs'
import {spawn} from 'node:child_process'
import {createServer} from 'node:net'
const require=createRequire(import.meta.url)
let playwright,executable,skip=false
try{playwright=require('playwright');executable=process.env.WISTIA_BROWSER_EXECUTABLE||['/usr/bin/chromium',playwright.chromium.executablePath()].find(existsSync);if(!executable)skip='Chromium not installed'}catch{skip='Playwright not installed'}
await test('Requested titles fit mobile and enlarged text; only the recording start is dark and shows the correct end',{skip,timeout:120000},async()=>{
 const probe=createServer();await new Promise(r=>probe.listen(0,'127.0.0.1',r));const port=probe.address().port;await new Promise(r=>probe.close(r))
 const server=spawn(process.execPath,['scripts/local-preview.mjs'],{env:{...process.env,WISTIA_PREVIEW_PORT:String(port)},stdio:['ignore','pipe','pipe']})
 let browser
 try{
  await new Promise((resolve,reject)=>{const timer=setTimeout(()=>reject(Error('preview timeout')),10000);server.stdout.once('data',()=>{clearTimeout(timer);resolve()});server.once('error',reject)})
  browser=await playwright.chromium.launch({headless:true,executablePath:executable,args:['--no-sandbox','--disable-dev-shm-usage']})
  for(const width of [360,375,390]){
   const context=await browser.newContext({viewport:{width,height:844},isMobile:true,hasTouch:true}),page=await context.newPage()
   await page.clock.setFixedTime(new Date('2026-10-12T03:00Z'))
   await page.route('https://**/*',r=>r.abort())
   const fontFixture=process.env.WISTIA_FONT_FIXTURE_DIR
   if(fontFixture)await page.route('https://cdn.jsdelivr.net/gh/fonts-archive/MaruBuri@*/MaruBuri-*.woff2',r=>r.fulfill({body:readFileSync(fontFixture+'/'+new URL(r.request().url()).pathname.split('/').at(-1)),contentType:'font/woff2'}))
   await page.route('**/api/availability?*',r=>{const q=new URL(r.request().url()).searchParams;return r.fulfill({json:{ok:true,from:q.get('from'),to:q.get('to'),date:q.get('date'),blocks:[]}})})
   const checkTitle=async(selector,lines)=>{
    await page.locator(selector+' .svg-section-text').waitFor()
    await page.evaluate(()=>document.fonts.ready)
    for(const large of [false,true]){
     const setting=large?await page.addStyleTag({content:'html{font-size:32px!important;-webkit-text-size-adjust:200%!important;text-size-adjust:200%!important}'}):null
     const m=await page.locator(selector).evaluate(n=>{
      const text=n.querySelector('.svg-section-text'),walker=document.createTreeWalker(text,NodeFilter.SHOW_TEXT),rects=[]
      while(walker.nextNode()){if(!walker.currentNode.textContent.trim())continue;const range=document.createRange();range.selectNodeContents(walker.currentNode);rects.push(...range.getClientRects())}
      const b=n.getBoundingClientRect(),style=getComputedStyle(n)
      return {rows:new Set(rects.map(r=>Math.round(r.top))).size,inside:rects.every(r=>r.left>=b.left-1&&r.right<=b.right+1&&r.right<=innerWidth),nowrap:getComputedStyle(text).whiteSpace,adjust:style.textSizeAdjust||style.webkitTextSizeAdjust,overflow:n.scrollWidth-n.clientWidth}
     })
     assert.equal(m.rows,lines,selector+' '+width+' large='+large+' '+JSON.stringify(m));assert.ok(m.inside,JSON.stringify(m));assert.equal(m.nowrap,'nowrap');assert.ok(m.overflow<=1,JSON.stringify(m))
     await setting?.evaluate(n=>n.remove())
    }
   }
   await page.goto(`http://127.0.0.1:${port}/info/about`,{waitUntil:'domcontentloaded'})
   await checkTitle('.about-story-title',1)
   // Measure both specialist headings independently (their article order is stable).
   for(const child of [2,3])await checkTitle('.wistia-specialist-grid article:nth-child('+child+') .about-specialist-title',1)
   for(const [product,hours] of [['solo',1],['duo',2],['duet-film',3]]){
    await page.goto(`http://127.0.0.1:${port}/event/${product}`,{waitUntil:'domcontentloaded'})
    await checkTitle('#sourceTitle',1)
    await page.locator('[data-calendar-trigger="bookingDate"]').tap()
    await page.locator('#calendar-bookingDate [data-calendar-day="2026-10-15"]').tap()
    await page.waitForFunction(()=>document.querySelector('#contactInquiryForm').dataset.scheduleState==='ready')
    const times=page.locator('[data-calendar-times]')
    for(const half of [false,true]){
     const value=half?'13:30':'13:00',start=half?'13시 30분':'13시',end=(13+hours)+'시'+(half?' 30분':'')
     await times.locator('[data-calendar-time="'+value+'"]').tap()
     const cells=await times.locator('.is-covered').evaluateAll(ns=>ns.map(n=>({checked:n.getAttribute('aria-checked'),text:n.textContent,bg:getComputedStyle(n).backgroundColor,fg:getComputedStyle(n).color,overflow:n.scrollWidth-n.clientWidth})))
     assert.equal(cells.length,hours*2);assert.equal(cells[0].checked,'true');assert.equal(cells[0].text,start);assert.equal(await page.locator('[data-time-help]').innerText(),start+'~'+end);assert.equal(cells[0].bg,'rgb(48, 45, 39)');const resultStyle=await page.locator('[data-time-help]').evaluate(n=>({size:parseFloat(getComputedStyle(n).fontSize),weight:getComputedStyle(n).fontWeight,color:getComputedStyle(n).color}));assert.ok(resultStyle.size>=16);assert.equal(resultStyle.weight,'600');assert.equal(resultStyle.color,'rgb(25, 25, 25)')
     for(const cell of cells.slice(1)){assert.equal(cell.checked,'false');assert.equal(cell.bg,'rgb(235, 232, 224)');assert.match(cell.text,/^\d+시(?: 30분)?$/)}
     assert.ok(cells.every(c=>c.overflow<=1));assert.doesNotMatch(await times.innerText(),/선택 구간/)
     assert.equal(await page.locator('#contact-time').inputValue(),value)
     const snapshot=await page.evaluate(()=>WistiaContact.snapshot(document.querySelector('#contactInquiryForm')))
     assert.equal(snapshot.timeStart,value);assert.equal(snapshot.time,'오후 1시'+(half?' 30분':'')+'~오후 '+(1+hours)+'시'+(half?' 30분':'')+' ('+hours+'시간)')
    }
    await times.locator('[data-calendar-time=""]').tap()
    assert.equal(await page.locator('[data-time-help]').innerText(),'시작 시간을 고르시면 상품 시간만큼 함께 선택돼요')
    assert.equal(await page.locator('#contact-time').inputValue(),'');assert.equal(await page.locator('[data-time-help]').evaluate(n=>n.classList.contains('has-time-selection')),false)
   }
   await context.close()
  }
 }finally{await browser?.close();server.kill()}
})
