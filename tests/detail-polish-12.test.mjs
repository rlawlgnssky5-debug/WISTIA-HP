import {test} from 'node:test'
import assert from 'node:assert/strict'
import {createRequire} from 'node:module'
import {existsSync,readFileSync} from 'node:fs'
import {spawn} from 'node:child_process'
import {createServer} from 'node:net'
import {interval} from '../lib/notion-availability.mjs'
const require=createRequire(import.meta.url),rules=require('../js/booking-availability.js')
await test('Half-hour availability keeps one-hour gaps and distinguishes occupied cells from unavailable starts',()=>{
 const blocks=[interval({start:'2026-10-11T17:00:00+09:00',end:'2026-10-11T19:00:00+09:00'})]
 assert.equal(rules.timeWindows('solo').length,20)
 assert.equal(rules.timeWindows('duo')[1].label,'오후 1시 30분')
 for(const [time,blocked] of [['14:30',false],['15:00',false],['15:30',true],['19:30',true],['20:00',false]])assert.equal(rules.slotBlocked('2026-10-11',time,60,blocks),blocked,time)
 for(const [time,booked] of [['16:00',false],['16:30',true],['19:00',true],['19:30',false]])assert.equal(rules.cellBooked('2026-10-11',time,blocks),booked,time)
 assert.equal(rules.slotBlocked('2026-10-11','20:00',180,[]),false,'recording may end at 23:00; cleanup is internal')
 assert.equal(rules.slotBlocked('2026-10-11','20:30',180,[]),true)
 const nextDay=[interval({start:'2026-10-12T00:00:00+09:00',end:'2026-10-12T01:00:00+09:00'})]
 assert.equal(rules.slotBlocked('2026-10-11','22:00',60,nextDay),false,'exclusive buffer endpoints')
 const font=readFileSync(new URL('../css/heading-font.css',import.meta.url),'utf8')
 assert.equal((font.match(/font-display:swap/g)||[]).length,3)
 assert.equal((font.match(/https:\/\/cdn.jsdelivr.net\/gh\/fonts-archive\/MaruBuri@/g)||[]).length,3)
 assert.doesNotMatch(font,/\.\.\/assets\/fonts\//)
})
let playwright,executable,skip=false
try{playwright=require('playwright');executable=process.env.WISTIA_BROWSER_EXECUTABLE||['/usr/bin/chromium',playwright.chromium.executablePath()].find(existsSync);if(!executable)skip='Chromium not installed'}catch{skip='Playwright not installed'}
await test('Scrollable time list, selection reset/snapshot/Kakao, location toast and loaded MaruBuri',{skip,timeout:180000},async()=>{
 const probe=createServer();await new Promise(r=>probe.listen(0,'127.0.0.1',r));const port=probe.address().port;await new Promise(r=>probe.close(r))
 const server=spawn(process.execPath,['scripts/local-preview.mjs'],{env:{...process.env,WISTIA_PREVIEW_PORT:String(port)},stdio:['ignore','pipe','pipe']})
 let browser
 try{
  await new Promise((resolve,reject)=>{const timer=setTimeout(()=>reject(Error('preview timeout')),10000);server.stdout.once('data',()=>{clearTimeout(timer);resolve()});server.once('error',reject)})
  browser=await playwright.chromium.launch({headless:true,executablePath:executable,args:['--no-sandbox','--disable-dev-shm-usage']})
  for(const width of [320,360,390,1280]){
   const context=await browser.newContext({viewport:{width,height:844},hasTouch:true,isMobile:width<600}),page=await context.newPage()
   await page.clock.install({time:new Date('2026-10-08T03:00Z')})
   await page.route('https://**/*',r=>r.abort())
   // Use the identical public CDN bytes as an offline fixture when available.
   const fontFixture=process.env.WISTIA_FONT_FIXTURE_DIR
   if(fontFixture)await page.route('https://cdn.jsdelivr.net/gh/fonts-archive/MaruBuri@*/MaruBuri-*.woff2',r=>r.fulfill({body:readFileSync(fontFixture+'/'+new URL(r.request().url()).pathname.split('/').at(-1)),contentType:'font/woff2'}))
   let blocks=[interval({start:'2026-10-11T17:00:00+09:00',end:'2026-10-11T19:00:00+09:00'})]
   await page.route('**/api/availability?*',r=>{const q=new URL(r.request().url()).searchParams;return r.fulfill({json:{ok:true,date:q.get('date'),from:q.get('from'),to:q.get('to'),blocks}})})
   await page.goto(`http://127.0.0.1:${port}/event/solo`,{waitUntil:'domcontentloaded'})
   const tap=async locator=>{await locator.scrollIntoViewIfNeeded();const force=await locator.getAttribute('aria-disabled')==='true';return width<600?locator.tap({force}):locator.click({force})}
   await tap(page.locator('[data-calendar-trigger="bookingDate"]'))
   await tap(page.locator('#calendar-bookingDate [data-calendar-day="2026-10-11"]'))
   await page.waitForFunction(()=>document.querySelector('#contactInquiryForm').dataset.scheduleState==='ready')
   const times=page.locator('[data-calendar-times]'),slot=value=>times.locator(`[data-calendar-time="${value}"]`)
   const layout=await times.evaluate(n=>({columns:getComputedStyle(n).gridTemplateColumns.split(' ').length,rects:[...n.children].map(b=>{const r=b.getBoundingClientRect();return {x:r.x,y:r.y,width:r.width,overflow:b.scrollWidth>b.clientWidth}})}))
   assert.equal(layout.columns,1);assert.equal(layout.rects.length,21)
   for(let i=1;i<layout.rects.length;i++){assert.equal(layout.rects[i].width,layout.rects[0].width);assert.ok(layout.rects[i].y>layout.rects[i-1].y)}
   assert.equal(layout.rects.some(r=>r.overflow),false)
   const scrolling=await times.evaluate(n=>{const s=getComputedStyle(n);return {height:n.clientHeight,content:n.scrollHeight,overflow:s.overflowY,overscroll:s.overscrollBehaviorY,touch:s.touchAction,button:n.firstElementChild.clientHeight}})
   assert.equal(scrolling.height,304);assert.ok(scrolling.content>scrolling.height)
   assert.equal(scrolling.overflow,'auto');assert.equal(scrolling.overscroll,'contain');assert.equal(scrolling.touch,'pan-y')
   assert.ok(scrolling.height/56>5&&scrolling.height/56<6)
   assert.deepEqual(await times.locator('button').allTextContents().then(xs=>xs.slice(0,4)),['미정','13시','13시 30분','14시'])
   assert.equal(await page.locator('.contact-time-field legend').innerText(),'방문 희망 시간')
   // Native touch/trackpad scrolling stays inside the list at both boundaries.
   await times.scrollIntoViewIfNeeded()
   const pageY=await page.evaluate(()=>scrollY),box=await times.boundingBox()
   if(width<600){
    const cdp=await context.newCDPSession(page)
    const x=box.x+box.width/2,y=box.y+box.height-40
    await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x,y}]})
    for(let d=20;d<=180;d+=20)await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x,y:y-d}]})
    await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]})
    await cdp.detach()
   }else{await page.mouse.move(box.x+box.width/2,box.y+box.height/2);await page.mouse.wheel(0,180)}
   await page.waitForFunction(()=>document.querySelector('[data-calendar-times]').scrollTop>0)
   assert.equal(await page.evaluate(()=>scrollY),pageY,'scrolling time choices does not move the page')
   await times.evaluate(n=>{n.scrollTop=n.scrollHeight})
   await page.mouse.move(box.x+box.width/2,box.y+box.height/2);await page.mouse.wheel(0,600)
   await page.waitForTimeout(100)
   assert.equal(await page.evaluate(()=>scrollY),pageY,'the end of the list does not chain scroll to the page')
   await times.evaluate(n=>{n.scrollTop=0})


   assert.match(await slot('16:30').innerText(),/마감/)
   assert.equal(await slot('15:30').getAttribute('aria-disabled'),'true')
   assert.doesNotMatch(await slot('15:30').innerText(),/마감/)
   await tap(slot('15:30'));assert.match(await page.locator('[data-time-help]').innerText(),/이 상품은 1시간이 필요해서 이 시간엔 시작할 수 없어요/)
   await tap(slot('13:30'));assert.equal(await times.locator('.is-covered').count(),2)
   const saved=()=>page.evaluate(()=>{const f=document.querySelector('#contactInquiryForm'),values=WistiaContact.snapshot(f);return {select:f.querySelector('#contact-time').value,values,text:WistiaContact.text(values)}})
   const assertCleared=async()=>{const result=await saved();assert.equal(result.select,'');assert.equal(result.values.timeStart,'');assert.equal(result.values.time,'미정');assert.match(result.text,/방문 희망 시간 : 미정/)}
   await times.evaluate(n=>{n.scrollTop=n.scrollHeight});assert.ok(await times.evaluate(n=>n.scrollTop)>0)
   await tap(page.locator('#calendar-bookingDate [data-calendar-day="2026-10-16"]'))
   await page.waitForFunction(()=>document.querySelector('#contactInquiryForm').dataset.scheduleState==='ready');await assertCleared()
   assert.equal(await times.evaluate(n=>n.scrollTop),0,'changing date resets to undecided at the top')
   await tap(slot('13:30'));await page.locator('[data-base-product="duo"]').check()
   await page.waitForFunction(()=>document.querySelector('#contactInquiryForm').dataset.scheduleState==='ready');await assertCleared()
   await tap(slot('13:30'));assert.equal(await times.locator('.is-covered').count(),4)
   assert.match((await saved()).text,/오후 1시 30분~오후 3시 30분 \(2시간\)/)
   blocks=[interval({start:'2026-10-16T14:00:00+09:00',end:'2026-10-16T16:00:00+09:00'})]
   await page.evaluate(()=>WistiaBooking.refresh());await assertCleared()
   blocks=[];await page.evaluate(()=>WistiaBooking.refresh())
   await page.locator('#bookingService').selectOption('duet-film')
   await page.waitForFunction(()=>document.querySelector('#contactInquiryForm').dataset.scheduleState==='ready');await assertCleared()
   await tap(slot('20:00'));assert.equal(await times.locator('.is-covered').count(),6)
   const colors=await times.locator('.is-covered').evaluateAll(ns=>ns.map(n=>getComputedStyle(n).backgroundColor));assert.equal(new Set(colors).size,1)
   await tap(slot('20:30'));assert.equal(await page.locator('#contact-time').inputValue(),'20:00');assert.match(await page.locator('[data-time-help]').innerText(),/3시간/)
   await page.goto(`http://127.0.0.1:${port}/info/location`,{waitUntil:'domcontentloaded'})
   if(fontFixture)await page.evaluate(async()=>{await document.fonts.load('500 24px MaruBuri','오시는 길');await document.fonts.ready})
   const typography=await page.locator('h1').first().evaluate(n=>({family:getComputedStyle(n).fontFamily,loaded:document.fonts.check('500 24px MaruBuri'),rows:(()=>{const range=document.createRange();range.selectNodeContents(n.querySelector('.svg-section-text')||n);return new Set([...range.getClientRects()].map(r=>Math.round(r.top))).size})()}))
   assert.match(typography.family,/MaruBuri/);if(fontFixture)assert.equal(typography.loaded,true)
   assert.equal(typography.rows,1)
   const gap=()=>page.locator('.wistia-location-links').evaluate(n=>n.getBoundingClientRect().top-n.parentElement.querySelector('.location-address-row').getBoundingClientRect().bottom)
   const before=await gap();assert.ok(before<=24,before)
   await page.evaluate(()=>{navigator.clipboard.writeText=async()=>{}})
   await tap(page.locator('[data-copy-address]'))
   assert.equal(await page.locator('[data-address-copy-status]').innerText(),'복사됐어요');assert.equal(await gap(),before)
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth),0)
   await page.goto(`http://127.0.0.1:${port}/detail/solo`,{waitUntil:'domcontentloaded'})
   if(fontFixture)await page.evaluate(async()=>{await document.fonts.load('500 24px MaruBuri','내 목소리에 맞게 AR 비율을 골라보세요');await document.fonts.ready})
   const title=await page.locator('#wistiaArTitle').evaluate(n=>[...n.children].map(line=>{const range=document.createRange();range.selectNodeContents(line.querySelector('.ar-copy-emphasis-text')||line);return {rows:new Set([...range.getClientRects()].filter(r=>r.width>0).map(r=>Math.round(r.top))).size,overflow:line.scrollWidth>line.clientWidth}}))
   assert.equal(title.length,2);assert.ok(title.every(line=>line.rows===1&&!line.overflow),JSON.stringify(title))
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth),0)
   console.log(width+'px list, resets, Kakao, loaded font, SOLO title and toast passed');await context.close()
  }
 }finally{await browser?.close();server.kill()}
})
