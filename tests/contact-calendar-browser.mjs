// Run against scripts/local-preview.mjs: node tests/contact-calendar-browser.mjs [base URL]
import assert from 'node:assert/strict'
import {createRequire} from 'node:module'
const {chromium}=createRequire(import.meta.url)('playwright')
const browser=await chromium.launch({executablePath:process.env.LAYOUT_BROWSER||'/usr/bin/chromium',headless:true,args:['--no-sandbox']})
const base=process.argv[2]||'http://127.0.0.1:4175'
try{
 for(const width of [320,390,1440]){
  const context=await browser.newContext({viewport:{width,height:900}}),page=await context.newPage(),errors=[]
  page.on('pageerror',error=>errors.push(error.message))
  await page.clock.install({time:new Date('2026-10-08T03:00:00Z')})
  await page.route('https://**/*',route=>route.abort())
  let requests=0,rangeRequests=0,mode='ready'
  await page.route('**/api/availability?*',async route=>{
   requests++;if(mode==='timeout')return
   if(mode==='offline'){await route.abort();return}
   const params=new URL(route.request().url()).searchParams,date=params.get('date')
   if(params.has('from')){
    rangeRequests++
    await route.fulfill({json:{ok:true,from:params.get('from'),to:params.get('to'),blocks:[{start:'2026-10-09T00:00:00+09:00',end:'2026-10-10T00:00:00+09:00'},{start:'2026-10-10T14:00:00+09:00',end:'2026-10-11T00:00:00+09:00'},{start:'2026-10-11T17:00:00+09:00',end:'2026-10-11T19:00:00+09:00'}]}});return
   }
   await route.fulfill({json:{ok:true,date,blocks:[{start:date+'T15:00:00+09:00',end:date+'T16:00:00+09:00'}]}})
  })
  await page.goto(base+'/contact')
  await page.locator('#bookingService').selectOption('solo')
  assert.equal(await page.locator('.calendar-operating,.booking-availability-note,[data-booking-refresh]').count(),0)
  assert.equal(await page.locator('[data-booking-status]').isVisible(),false)
  const eventMode=page.locator('[data-contact-date-mode="eventDate"][value="date"]')
  await eventMode.check();const trigger=page.locator('[data-calendar-trigger="eventDate"]'),popup=page.locator('#calendar-eventDate')
  await trigger.click();await popup.waitFor({state:'visible'})
  await popup.locator('[data-calendar-year]').selectOption('2027')
  await popup.locator('[data-calendar-month]').selectOption('9')
  assert.equal(await popup.locator('.calendar-day:disabled').count(),0,'wedding accepts all weekdays')
  await popup.locator('[data-calendar-day="2027-10-14"]').focus()
  await page.keyboard.press('ArrowRight');assert.equal(await page.evaluate(()=>document.activeElement.dataset.calendarDay),'2027-10-15')
  await page.keyboard.press('Enter');await popup.waitFor({state:'hidden'})
  assert.equal(await page.locator('#contact-eventDate').inputValue(),'2027-10-15')
  assert.match(await trigger.innerText(),/2027년 10월 15일 \(금\)/)
  await trigger.click();await page.keyboard.press('Escape');await popup.waitFor({state:'hidden'})
  assert.equal(await trigger.evaluate(el=>el===document.activeElement),true,'Escape returns focus')
  await trigger.click();await page.locator('#scheduleTitle').click();await popup.waitFor({state:'hidden'})
  await page.locator('[data-contact-date-mode="bookingDate"][value="date"]').check()
  const calendar=page.locator('#calendar-bookingDate')
  await page.waitForFunction(()=>document.querySelector('[data-calendar-day="2026-10-09"]').disabled)
  assert.match(await calendar.locator('[data-calendar-day="2026-10-09"]').innerText(),/마감/)
  assert.equal(await calendar.locator('[data-calendar-day="2026-10-10"]').isDisabled(),false,'SOLO fits before 14:00')
  assert.equal(await calendar.locator('[data-calendar-day="2026-10-11"]').isDisabled(),false,'17–19 partial closure stays clickable')
  assert.equal(rangeRequests,1,'one month query shared across mounts')
  if(process.env.WISTIA_CALENDAR_SCREENSHOTS){await calendar.scrollIntoViewIfNeeded();await page.screenshot({path:process.env.WISTIA_CALENDAR_SCREENSHOTS+'/calendar-'+width+'.png'})}
  assert.equal(await page.locator('[data-event="voice-photo-consent"]').count(),0)
  assert.doesNotMatch(await page.locator('#contactInquiryForm').innerText(),/활용 동의|선택 할인|할인 최대/)

  for(const day of ['12','13','14']){
   const closed=calendar.locator('[data-calendar-day="2026-10-'+day+'"]')
   assert.equal(await closed.isDisabled(),true);assert.doesNotMatch(await closed.innerText(),/마감/)
  }
  assert.equal(await calendar.locator('[data-calendar-day="2026-10-07"]').isDisabled(),true)
  await calendar.locator('[data-calendar-day="2026-10-16"]').click()
  await page.waitForFunction(()=>document.querySelector('#contactInquiryForm').dataset.scheduleState==='ready')
  assert.equal(await page.locator('#contact-bookingDate').inputValue(),'2026-10-16')
  assert.equal(await page.locator('[data-booking-status]').isVisible(),false,'normal schedule keeps operating notice hidden')
  assert.match(await calendar.locator('[data-calendar-selection]').innerText(),/2026년 10월 16일 \(금\)/)
  assert.equal(await calendar.locator('.is-selected>span').evaluate(el=>getComputedStyle(el).color),'rgb(255, 252, 245)','selected date text stays readable on charcoal')
  await page.keyboard.press('ArrowLeft');assert.equal(await page.evaluate(()=>document.activeElement.dataset.calendarDay),'2026-10-15')
  await page.keyboard.press('ArrowLeft');assert.equal(await page.evaluate(()=>document.activeElement.dataset.calendarDay),'2026-10-11','arrows skip closed weekdays')
  await page.keyboard.press('Enter');assert.equal(await page.locator('#contact-bookingDate').inputValue(),'2026-10-11')
  await calendar.locator('[data-calendar-day="2026-10-16"]').click()
  await page.waitForFunction(()=>document.querySelector('#contactInquiryForm').dataset.scheduleState==='ready')
  const times=page.locator('[data-calendar-times]');assert.equal(await times.isVisible(),true)
  const blocked=times.locator('[data-calendar-time="14:30"]');assert.equal(await blocked.isDisabled(),true);assert.match(await blocked.innerText(),/마감/)
  await times.locator('[data-calendar-time="13:00"]').click()
  assert.equal(await page.locator('#contact-time').inputValue(),'13:00')
  assert.equal(await times.locator('[data-calendar-time="13:00"]').getAttribute('aria-checked'),'true')
  const values=await page.evaluate(()=>Object.fromEntries(new FormData(document.querySelector('#contactInquiryForm'))))
  assert.equal(values.bookingDate,'2026-10-16');assert.equal(values.eventDate,'2027-10-15')
  const layout=await calendar.evaluate(el=>{
   const rect=el.getBoundingClientRect();return {overflow:document.documentElement.scrollWidth>innerWidth,targets:[...el.querySelectorAll('button,select')].map(day=>{const r=day.getBoundingClientRect();return {width:r.width,height:r.height,inside:r.left>=rect.left&&r.right<=rect.right}})}
  })
  assert.equal(layout.overflow,false);assert.ok(layout.targets.every(x=>x.width>=40&&x.height>=40&&x.inside),'date targets stay inside the calendar and are >=40px')
  // Re-mounting for product changes preserves ISO values and re-evaluates duration.
  await page.locator('[data-base-product="duo"]').click()
  assert.equal(await page.locator('#contact-bookingDate').inputValue(),'2026-10-16')
  assert.equal(await page.locator('[data-booking-status]').isVisible(),false,'normal schedule keeps operating notice hidden')
  assert.equal(await page.locator('[data-calendar-day="2026-10-10"]').isDisabled(),true,'DUET has no possible starts')
  assert.equal(rangeRequests,1,'product switch reuses month data')
  await page.waitForFunction(()=>document.querySelector('#contactInquiryForm').dataset.scheduleState==='ready')
  assert.equal(await page.locator('[data-calendar-time="13:30"]').isDisabled(),true,'DUET duration closes overlapping starts')
  await page.evaluate(()=>{window.calendarCopied='';navigator.clipboard.writeText=async text=>{window.calendarCopied=text}})
  const before=requests;await page.locator('.contact-submit').click()
  await page.waitForFunction(()=>window.calendarCopied.includes('녹음 방문일'))
  assert.ok(requests>before,'copy performs a fresh schedule query')
  assert.match(await page.evaluate(()=>window.calendarCopied),/녹음 방문일 \(스튜디오 예약일\) : 2026년 10월 16일/)
  await page.keyboard.press('Escape')
  mode='timeout';await page.evaluate(()=>{void window.WistiaBooking.refresh()})
  await page.waitForFunction(()=>document.querySelector('#contactInquiryForm').dataset.scheduleState==='loading')
  await page.clock.runFor(8001)
  await page.waitForFunction(()=>document.querySelector('#contactInquiryForm').dataset.scheduleState==='unavailable')
  assert.equal(await page.locator('[data-booking-status]').isVisible(),true)
  assert.match(await page.locator('[data-booking-status]').innerText(),/카카오톡 확인 필요/)
  assert.equal(await page.locator('[data-booking-refresh]').count(),0)
  assert.equal(await page.locator('[data-calendar-day="2026-10-09"]').isDisabled(),false,'failed range must not close days with stale data')
  assert.equal(await page.locator('[data-calendar-time="13:00"]').isDisabled(),false,'fallback keeps wish times selectable with a notice')
  await page.locator('[data-contact-date-mode="bookingDate"][value="unknown"]').check()
  assert.equal(await calendar.isVisible(),false)
  assert.equal(await page.locator('#contact-bookingDate').isDisabled(),true)
  assert.equal(await times.isVisible(),false)
  assert.equal(await page.locator('#contact-time').isVisible(),true)
  assert.equal(errors.length,0,errors.join('\n'))
  console.log(width+'px: keyboard/popup, weekdays, ISO values, times, product restore, fresh copy and 8s fallback passed')
  await context.close()
 }
 for(const path of ['/event/solo','/event/duo','/event/duet-film','/event/proposal','/event/wedding','/event/solo-film']){
  const page=await browser.newPage({viewport:{width:390,height:844}})
  await page.route('https://**/*',route=>route.abort());await page.goto(base+path)
  // Legacy routes resolve to their existing destination; activate forms where present.
  if(await page.locator('[data-contact-date-mode="bookingDate"]').count()){
   await page.locator('[data-contact-date-mode="bookingDate"][value="date"]').check()
   assert.equal(await page.locator('#calendar-bookingDate').isVisible(),true,path)
   assert.equal(await page.locator('.calendar-operating,.booking-availability-note,[data-booking-refresh]').count(),0,path)
  }
  await page.close()
 }
}finally{await browser.close()}
