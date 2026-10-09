import assert from 'node:assert/strict'
import {createRequire} from 'node:module'
import {writeFileSync,mkdirSync} from 'node:fs'
mkdirSync('work',{recursive:true})
const {chromium}=createRequire(import.meta.url)('playwright')
const browser=await chromium.launch({executablePath:process.env.WISTIA_BROWSER_EXECUTABLE||'/usr/bin/chromium',args:['--no-sandbox']})
const base=process.env.WISTIA_PREVIEW_URL||'http://127.0.0.1:4175',results=[]
const blocks=[9,18,25].map(day=>({start:`2026-10-${String(day-1).padStart(2,'0')}T15:00Z`,end:`2026-10-${String(day).padStart(2,'0')}T15:00Z`})).concat({start:'2026-10-11T07:30Z',end:'2026-10-11T09:30Z'})
try{
 for(const width of [360,390,1280]){
  const page=await browser.newPage({viewport:{width,height:844}});await page.clock.install({time:new Date('2026-10-08T03:00Z')});await page.route('https://**/*',r=>r.abort())
  await page.route('**/api/availability?*',async r=>{const q=new URL(r.request().url()).searchParams;if(q.has('from'))await new Promise(resolve=>setTimeout(resolve,100));await r.fulfill({json:{ok:true,date:q.get('date'),from:q.get('from'),to:q.get('to'),blocks}})})
  await page.goto(base+'/event/solo',{waitUntil:'domcontentloaded'})
  await page.locator('#consultForm .consultation-step').first().waitFor({state:'visible'})
  const order=await page.locator('#consultForm .consultation-step').evaluateAll(nodes=>nodes.map(n=>({number:n.querySelector('.booking-step').textContent,title:n.querySelector('h2').textContent})))
  assert.deepEqual(order.map(x=>x.number),['01','02','03','04']);assert.match(order[1].title,/어디에서/);assert.match(order[2].title,/일정/)
  for(const key of ['eventDate','bookingDate']){
   const mode=page.locator(`[data-contact-date-mode="${key}"][value="date"]`),calendar=page.locator(`#calendar-${key}`),trigger=page.locator(`[data-calendar-trigger="${key}"]`)
   assert.equal(await calendar.isVisible(),false)
   await mode.check();await calendar.waitFor({state:'visible'});assert.equal(await trigger.getAttribute('aria-expanded'),'true')
   await mode.click();assert.equal(await calendar.isVisible(),true,'repeated date selection only opens')
   await mode.click();await calendar.waitFor({state:'visible'})
   const controls=await calendar.locator('select').evaluateAll(nodes=>nodes.map(n=>{const s=getComputedStyle(n),r=n.getBoundingClientRect(),canvas=document.createElement('canvas'),ctx=canvas.getContext('2d');ctx.font=`${s.fontWeight} ${s.fontSize} ${s.fontFamily}`;const text=n.selectedOptions[0].textContent;return {text,width:r.width,textWidth:ctx.measureText(text).width,available:r.width-parseFloat(s.paddingLeft)-parseFloat(s.paddingRight)-parseFloat(s.borderLeftWidth)-parseFloat(s.borderRightWidth)-22,left:r.left,right:r.right}}))
   assert.deepEqual(controls.map(x=>x.text),['2026년','10월']);for(const c of controls){assert.ok(c.available>=c.textWidth,JSON.stringify(c));assert.ok(c.left>=0&&c.right<=width)}
   if(key==='bookingDate'){
    await page.waitForFunction(()=>document.querySelector('#calendar-bookingDate [data-calendar-day="2026-10-09"]').disabled)
    for(const day of ['09','18','25']){const cell=calendar.locator(`[data-calendar-day="2026-10-${day}"]`);assert.equal(await cell.isDisabled(),true);assert.match(await cell.innerText(),/마감/);assert.match(await cell.getAttribute('aria-label'),/마감/)}
    for(const day of ['01','02','03','04','05','06','07','12','13','14']){const cell=calendar.locator(`[data-calendar-day="2026-10-${day}"]`);assert.equal(await cell.isDisabled(),true);assert.equal(await cell.innerText(),String(Number(day)))}
   }
   await calendar.locator('[data-calendar-day="2026-10-11"]').click();assert.equal(await calendar.isVisible(),true);await calendar.locator('[data-calendar-close]').click();assert.equal(await trigger.getAttribute('aria-expanded'),'false');assert.match(await page.locator(`[data-calendar-summary="${key}"]`).innerText(),/선택한 날짜: 10월 11일 \(일\)/)
   let time=null
   if(key==='bookingDate'){
    await page.waitForFunction(()=>document.querySelector('#contactInquiryForm').dataset.scheduleState==='ready')
    assert.equal(await page.locator('[data-calendar-time="17:00"]').isDisabled(),true);assert.equal(await page.locator('[data-calendar-time="19:00"]').isDisabled(),false)
    await page.locator('.contact-time-field').scrollIntoViewIfNeeded()
    time=await page.locator('.contact-time-field').evaluate(n=>{const r=n.getBoundingClientRect();return {top:r.top,bottom:r.bottom,headerBottom:document.querySelector('#siteHeader').getBoundingClientRect().bottom,barTop:document.querySelector('.inquiry-actions').getBoundingClientRect().top}})
    assert.ok(time.top>=time.headerBottom&&time.top<time.barTop,JSON.stringify(time))
    const columns=await page.locator('[data-calendar-times]').evaluate(n=>getComputedStyle(n).gridTemplateColumns.split(' ').length)
    assert.equal(columns,width<=430?2:4)
    const undecidedRow=await page.locator('[data-calendar-times]').evaluate(n=>{const a=n.children[0].getBoundingClientRect(),b=n.children[1].getBoundingClientRect();return {sameRow:a.top===b.top,sameWidth:a.width===b.width}});assert.equal(undecidedRow.sameRow,true);assert.equal(undecidedRow.sameWidth,true)
    const lastTime=page.locator('[data-calendar-time="22:00"]');await lastTime.scrollIntoViewIfNeeded();assert.ok(await lastTime.evaluate(n=>n.getBoundingClientRect().bottom<document.querySelector('.inquiry-actions').getBoundingClientRect().top))
    const closed=page.locator('[data-calendar-time="17:00"]');assert.match(await closed.innerText(),/마감/);assert.ok(await closed.evaluate(n=>n.scrollWidth<=n.clientWidth))
   }
   await trigger.click();await calendar.waitFor({state:'visible'});await calendar.locator('[data-calendar-close]').click();assert.equal(await calendar.isVisible(),false);assert.equal(await mode.evaluate(n=>n===document.activeElement),true)
   await trigger.click();await calendar.waitFor({state:'visible'});await page.locator(`[data-contact-date-mode="${key}"][value="unknown"]`).check();assert.equal(await calendar.isVisible(),false);assert.equal(await page.locator(`#contact-${key}`).isDisabled(),true)
   await mode.check();await calendar.waitFor({state:'visible'});await calendar.locator('[data-calendar-year]').selectOption('2027');await calendar.locator('[data-calendar-month]').selectOption('4')
   const last=calendar.locator('[data-calendar-day="2027-05-31"]');await last.evaluate(n=>window.scrollTo({top:window.scrollY+n.getBoundingClientRect().top-innerHeight/2,behavior:'instant'}))
   const lastRow=await page.evaluate(key=>{const n=document.querySelector('#calendar-'+key+' [data-calendar-day="2027-05-31"]'),r=n.getBoundingClientRect();return {top:r.top,bottom:r.bottom,barTop:document.querySelector('.inquiry-actions').getBoundingClientRect().top,overflow:document.documentElement.scrollWidth-innerWidth,calendarHeight:document.querySelector('#calendar-'+key).getBoundingClientRect().height}},key)
   assert.equal(lastRow.overflow,0);assert.ok(lastRow.top>=0&&lastRow.bottom<lastRow.barTop,JSON.stringify(lastRow))
   await calendar.screenshot({path:`work/5-${width}-${key}.png`})
   await calendar.locator('[data-calendar-close]').click();results.push({width,key,controls,time,lastRow,openToggle:true,selectionStaysOpen:true,summaryChange:true,closeButton:true,unknownCloses:true})
   console.log(`${width}px ${key}: open/reopen/select-stays-open/change/explicit-close/unknown, year-month text and last row passed`)
  }
  await page.locator('[data-contact-date-mode="eventDate"][value="unknown"]').check()
  await page.locator('[data-calendar-trigger="bookingDate"]').click();const bookingCalendar=page.locator('#calendar-bookingDate');await bookingCalendar.locator('[data-calendar-year]').selectOption('2026');await bookingCalendar.locator('[data-calendar-month]').selectOption('9');await bookingCalendar.locator('[data-calendar-day="2026-10-11"]').click();await bookingCalendar.locator('[data-calendar-close]').click()
  await page.evaluate(()=>{window.copy5='';navigator.clipboard.writeText=async value=>{window.copy5=value}})
  await page.locator('.contact-submit').click();await page.waitForFunction(()=>window.copy5.startsWith('[위스티아 상담 요청]'))
  const plain=await page.evaluate(()=>window.copy5);assert.match(plain,/추가 옵션 : 없음/);assert.match(plain,/예상 금액 : 120,000원/);assert.doesNotMatch(plain,/^\d+\) /gm)
  await page.keyboard.press('Escape')
  await page.locator('[data-contact-date-mode="eventDate"][value="date"]').click()
  const wedding=page.locator('#calendar-eventDate');await wedding.locator('[data-calendar-year]').selectOption('2027');await wedding.locator('[data-calendar-month]').selectOption('0');await wedding.locator('[data-calendar-day="2027-01-09"]').click()
  await page.locator('[data-calendar-time="15:00"]').click()
  for(const option of ['lyrics-video','extra-verse'])await page.locator(`input[data-option="${option}"]`).check()
  for(const event of ['blog','instagram'])await page.locator(`input[data-event="${event}"]`).check()
  await page.locator('#contact-source').selectOption('메타 광고')
  await page.evaluate(()=>{window.copy5=''})
  await page.locator('.contact-submit').click();await page.waitForFunction(()=>window.copy5.startsWith('[위스티아 상담 요청]'))
  const full=await page.evaluate(()=>window.copy5)
  assert.match(full,/예상 금액 : 220,000원/);assert.match(full,/페이백 합계 : −40,000원/);assert.match(full,/예식일 : 2027년 1월 9일 \(토\)/);assert.match(full,/희망 시간 : 15시/);assert.equal((full.match(/[📦💰📅]/gu)||[]).length,3)
  if(width===390)writeFileSync('work/5-copy-examples.json',JSON.stringify({plain,full},null,2))
  await page.unrouteAll({behavior:'wait'})
  await page.close()
 }
}finally{for(const context of browser.contexts())for(const page of context.pages())await page.unrouteAll({behavior:'wait'});await browser.close();writeFileSync('work/5-calendar-measurements.json',JSON.stringify(results,null,2))}
