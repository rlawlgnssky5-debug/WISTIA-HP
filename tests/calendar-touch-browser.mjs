// Optional real coordinate-tap regression: node tests/calendar-touch-browser.mjs [base URL]
import assert from 'node:assert/strict'
import {createRequire} from 'node:module'
import {existsSync,mkdirSync,writeFileSync} from 'node:fs'
const {chromium,webkit,devices}=createRequire(import.meta.url)('playwright')
const base=process.argv[2]||process.env.WISTIA_PREVIEW_URL||'http://127.0.0.1:4175',measurements=[]
const blocks=[9,18,25].map(d=>({start:`2026-10-${String(d-1).padStart(2,'0')}T15:00Z`,end:`2026-10-${String(d).padStart(2,'0')}T15:00Z`})).concat({start:'2026-10-11T07:30Z',end:'2026-10-11T09:30Z'})
for(const engine of [chromium,webkit]){
 const name=engine.name(),executablePath=name==='chromium'?(process.env.WISTIA_BROWSER_EXECUTABLE||'/usr/bin/chromium'):engine.executablePath()
 if(!existsSync(executablePath)){console.log(`SKIP ${name}: browser executable is not installed`);measurements.push({engine:name,skipped:true,reason:'Browser executable not installed'});continue}
 const browser=await engine.launch({executablePath,headless:true,...(name==='chromium'?{args:['--no-sandbox']}:{})})
 try{
  for(const kakao of [false,true])for(const width of name==='chromium'?[360,390,1280]:[390]){
   const device=name==='webkit'?devices['iPhone 13']:{viewport:{width,height:844},hasTouch:true,isMobile:width<500}
   const context=await browser.newContext({...device,...(kakao?{userAgent:(device.userAgent||'Mozilla/5.0 (Linux; Android 13) AppleWebKit/537.36 Chrome/130.0 Mobile Safari/537.36')+' KAKAOTALK 10.8.0'}:{})}),page=await context.newPage()
   const errors=[];page.on('pageerror',e=>errors.push(e.message))
   await page.clock.install({time:new Date('2026-10-08T03:00Z')});await page.route('https://**/*',r=>r.abort())
   await page.route('**/api/availability?*',r=>{const q=new URL(r.request().url()).searchParams;return r.fulfill({json:{ok:true,date:q.get('date'),from:q.get('from'),to:q.get('to'),blocks}})})
   await page.goto(base+'/event/solo');await page.waitForFunction(()=>WistiaBooking.calendarBlocks('2026-10-01','2026-10-31')!==null);await page.evaluate(()=>document.fonts.ready)
   await page.evaluate(()=>{
    window.calendarScrollCalls=[];window.testScroll=(y)=>nativeScroll(0,y)
    const nativeScroll=window.scrollTo.bind(window)
    for(const method of ['scrollTo','scrollBy']){const fn=window[method].bind(window);window[method]=(...args)=>{window.calendarScrollCalls.push(method);return fn(...args)}}
    const scroll=Element.prototype.scrollIntoView;Element.prototype.scrollIntoView=function(...args){window.calendarScrollCalls.push('scrollIntoView');return scroll.apply(this,args)}
    const focus=HTMLElement.prototype.focus;HTMLElement.prototype.focus=function(options){if(!options?.preventScroll)window.calendarScrollCalls.push('focus without preventScroll');return focus.call(this,options)}
   })
   const tap=async locator=>{const b=await locator.boundingBox();assert.ok(b&&b.y>=0&&b.y+b.height<=page.viewportSize().height,'coordinate tap target is already visible');await page.touchscreen.tap(b.x+b.width/2,b.y+b.height/2);await page.waitForTimeout(60)}
   const place=async locator=>{await locator.evaluate(n=>window.testScroll(window.scrollY+n.getBoundingClientRect().top-300));await page.waitForTimeout(70)}
   const position=async label=>label.evaluate(n=>({top:n.getBoundingClientRect().top,scrollY:window.scrollY}))
   const stable=async(label,action,stage)=>{const before=await position(label);await action();const after=await position(label);assert.ok(Math.abs(before.top-after.top)<=1&&Math.abs(before.scrollY-after.scrollY)<=1,`${name} ${width} ${stage}: ${JSON.stringify({before,after})}`);measurements.push({engine:name,width,kakao,stage,before,after})}
   assert.equal(await page.locator('[data-calendar-times] button:not(:disabled)').count(),0)
   assert.equal(await page.locator('[data-time-date-hint]').isVisible(),true)
   for(const key of ['eventDate','bookingDate']){
    const label=page.locator(`[data-contact-date-mode="${key}"][value="date"]`).locator('..'),calendar=page.locator('#calendar-'+key),input=page.locator('#contact-'+key)
    await place(label)
    await stable(label,()=>tap(label),key+' open');assert.equal(await calendar.isVisible(),true)
    await stable(label,()=>tap(label),key+' repeated open');assert.equal(await calendar.isVisible(),true)
    const date=calendar.locator('[data-calendar-day="2026-10-11"]');await place(date)
    await stable(label,()=>tap(date),key+' select');assert.equal(await input.inputValue(),'2026-10-11');assert.equal(await calendar.isVisible(),true)
    assert.match(await date.getAttribute('class'),/is-selected/);assert.match(await calendar.locator('[data-calendar-selection]').innerText(),/선택한 날짜: 10월 11일 \(일\)/)
    for(const outside of [page.locator('#scheduleTitle'),page.locator('.contact-date-'+key+' .contact-date-description')]){await place(outside);await stable(outside,()=>tap(outside),key+' outside');assert.equal(await calendar.isVisible(),true)}
    const blank=page.locator('.contact-date-'+key+' legend');await place(blank);const b=await blank.boundingBox();await stable(blank,()=>page.touchscreen.tap(Math.max(2,b.x-8),b.y+5),key+' blank');assert.equal(await calendar.isVisible(),true)
    await page.evaluate(()=>window.testScroll(window.scrollY+80));assert.equal(await calendar.isVisible(),true)
    await page.keyboard.press('Escape');assert.equal(await calendar.isVisible(),true)
    if(key==='bookingDate'){
     await page.waitForFunction(()=>document.querySelector('#contactInquiryForm').dataset.scheduleState==='ready')
     for(const d of [9,18,25]){const closed=calendar.locator(`[data-calendar-day="2026-10-${String(d).padStart(2,'0')}"]`);assert.equal(await closed.isDisabled(),true);assert.match(await closed.innerText(),/마감/)}
     for(const d of [5,6,7,12,13,14]){const closed=calendar.locator(`[data-calendar-day="2026-10-${String(d).padStart(2,'0')}"]`);assert.equal(await closed.isDisabled(),true);assert.doesNotMatch(await closed.innerText(),/마감/)}
     assert.equal(await page.locator('[data-calendar-time="16:30"]').isDisabled(),true);assert.equal(await page.locator('[data-calendar-time="18:30"]').isDisabled(),false)
    }
    const close=calendar.locator('[data-calendar-close]');await place(label);await stable(label,()=>tap(close),key+' close');assert.equal(await calendar.isVisible(),false)
    assert.match(await page.locator(`[data-calendar-summary="${key}"]`).innerText(),/선택한 날짜: 10월 11일 \(일\)/)
    await stable(label,()=>tap(label),key+' reopen')
    const unknown=page.locator(`[data-contact-date-mode="${key}"][value="unknown"]`).locator('..');await stable(label,()=>tap(unknown),key+' undecided');assert.equal(await calendar.isVisible(),false);assert.equal(await input.inputValue(),'')
    await stable(label,()=>tap(label),key+' cleared reopen');assert.equal(await calendar.locator('.is-selected').count(),0)
    await tap(close)
   }
   assert.equal(await page.locator('[data-calendar-times] button:not(:disabled)').count(),0);assert.equal(await page.locator('#contact-time').inputValue(),'')
   assert.deepEqual(await page.evaluate(()=>window.calendarScrollCalls),[],'no application scrolling/focus jumps during touch flow')
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth),0)
   assert.deepEqual(errors,[])
   await context.close();console.log(`${name} ${width}px ${kakao?'KakaoTalk UA':'normal UA'}: both calendars passed real coordinate taps and stationary viewport`)
  }
 }finally{await browser.close()}
}
mkdirSync('work',{recursive:true});writeFileSync('work/7-touch-measurements.json',JSON.stringify(measurements,null,2))
