import assert from 'node:assert/strict'
import {createRequire} from 'node:module'
import {writeFileSync,mkdirSync} from 'node:fs'
const {chromium}=createRequire(import.meta.url)('playwright')
const browser=await chromium.launch({executablePath:process.env.WISTIA_BROWSER_EXECUTABLE||'/usr/bin/chromium',args:['--no-sandbox']})
const base=process.env.WISTIA_PREVIEW_URL||'http://127.0.0.1:4175',results=[]
const blocks=[9,18,25].map(day=>({start:`2026-10-${String(day-1).padStart(2,'0')}T15:00Z`,end:`2026-10-${String(day).padStart(2,'0')}T15:00Z`})).concat({start:'2026-10-11T07:30Z',end:'2026-10-11T09:30Z'})
try{
 for(const width of [360,390,1280]){
  const page=await browser.newPage({viewport:{width,height:844},hasTouch:true,isMobile:width<500})
  await page.clock.install({time:new Date('2026-10-08T03:00Z')});await page.route('https://**/*',r=>r.abort())
  let phase='success',pending=[]
  await page.route('**/api/availability?*',async r=>{const q=new URL(r.request().url()).searchParams;if(q.has('from')&&phase==='timeout'){pending.push(r);return}await r.fulfill(phase==='fail'?{status:503,json:{ok:false}}:{json:{ok:true,from:q.get('from'),to:q.get('to'),date:q.get('date'),blocks}})})
  await page.goto(base+'/event/solo',{waitUntil:'domcontentloaded'});await page.locator('#consultForm .consultation-step').first().waitFor({state:'visible'})
  await page.waitForFunction(()=>WistiaBooking.calendarBlocks('2026-10-01','2026-10-31')!==null)
  const tapHere=async locator=>{const r=await locator.boundingBox();assert.ok(r&&r.y>=0&&r.y+r.height<=844,'tap target is already in view');await page.touchscreen.tap(r.x+r.width/2,r.y+r.height/2)}
  const positions=async label=>label.evaluate(n=>({top:n.getBoundingClientRect().top,scrollY:window.scrollY}))
  for(const key of ['eventDate','bookingDate']){
   const mode=page.locator(`[data-contact-date-mode="${key}"][value="date"]`),label=mode.locator('..'),calendar=page.locator('#calendar-'+key)
   await label.evaluate(n=>window.scrollBy({top:n.getBoundingClientRect().top-130,behavior:'instant'}))
   const before=await positions(label);await tapHere(label);const opened=await positions(label)
   assert.deepEqual(opened,before,'opening does not scroll or move the tapped label')
   await tapHere(label);assert.equal(await calendar.isVisible(),true);assert.deepEqual(await positions(label),before)
   const prior=await positions(label);await tapHere(calendar.locator('[data-calendar-day="2026-10-11"]'));const selected=await positions(label)
   assert.deepEqual(selected,prior,'date selection does not move the viewport');assert.equal(await calendar.isVisible(),true)
   const picked=calendar.locator('[data-calendar-day="2026-10-11"]');assert.equal(await picked.getAttribute('aria-pressed'),'true');assert.match(await picked.getAttribute('class'),/is-selected/)
   assert.match(await calendar.locator('[data-calendar-selection]').innerText(),/선택한 날짜: 10월 11일 \(일\)/)
   await page.locator('.contact-date-'+key+' legend').tap();assert.equal(await calendar.isVisible(),true)
   await page.evaluate(()=>window.scrollBy(0,10));assert.equal(await calendar.isVisible(),true)
   await page.keyboard.press('Escape');assert.equal(await calendar.isVisible(),true)
   if(key==='bookingDate'){
    await page.waitForFunction(()=>document.querySelector('#contactInquiryForm').dataset.scheduleState==='ready')
    assert.equal(await page.locator('[data-calendar-time="17:00"]').isDisabled(),true);assert.equal(await page.locator('[data-calendar-time="19:00"]').isDisabled(),false)
   }
   await calendar.locator('[data-calendar-close]').tap();assert.equal(await calendar.isVisible(),false)
   assert.match(await page.locator(`[data-calendar-summary="${key}"]`).innerText(),/선택한 날짜:/)
   await page.locator(`[data-calendar-trigger="${key}"]`).tap();assert.equal(await calendar.isVisible(),true)
   await page.locator(`[data-contact-date-mode="${key}"][value="unknown"]`).locator('..').tap();assert.equal(await calendar.isVisible(),false);assert.equal(await page.locator('#contact-'+key).inputValue(),'')
   await label.tap();assert.equal(await calendar.locator('.is-selected').count(),0,'unknown cancels the previous selected date')
   await calendar.locator('[data-calendar-close]').tap()
   results.push({width,key,before,opened,beforeSelection:prior,afterSelection:selected,explicitCloseOnly:true,unknownClears:true})
  }
  const booking=page.locator('#calendar-bookingDate');await page.locator('[data-contact-date-mode="bookingDate"][value="date"]').locator('..').tap()
  async function closed(){for(const day of [9,18,25]){const cell=booking.locator(`[data-calendar-day="2026-10-${String(day).padStart(2,'0')}"]`);assert.equal(await cell.isDisabled(),true);assert.match(await cell.innerText(),/마감/)}}
  await closed();phase='fail';await page.evaluate(()=>document.dispatchEvent(new Event('visibilitychange')));await page.waitForFunction(()=>WistiaBooking.calendarRangeFailed('2026-10-01','2026-10-31'));await closed()
  assert.match(await booking.locator('[data-calendar-range-status]').innerText(),/카카오톡 확인 필요/)
  phase='timeout';await page.evaluate(()=>{void WistiaBooking.refresh()});await page.waitForTimeout(100);await page.clock.fastForward(8100);await closed()
  assert.match(await booking.locator('[data-calendar-range-status]').innerText(),/카카오톡 확인 필요/)
  for(const r of pending)await r.fulfill({json:{ok:true,from:'2026-10-01',to:'2026-10-31',blocks:[]}}).catch(()=>{})
  await page.waitForTimeout(100);await closed()
  await booking.locator('[data-calendar-close]').tap();phase='success'
  const note=await page.locator('.booking-extra .single-song-note').evaluate(n=>{const r=n.getBoundingClientRect(),parent=n.parentElement.getBoundingClientRect();return {left:r.left,right:r.right,parentLeft:parent.left,parentRight:parent.right,align:getComputedStyle(n).textAlign}});assert.ok(note.left>=note.parentLeft&&note.right<=note.parentRight);assert.equal(note.align,'center')
  const verse=page.locator('input[data-option="extra-verse"]');assert.equal(await verse.count(),1);assert.equal(await page.locator('input[data-option*="entrance"]').count(),0)
  await verse.check();assert.match(await page.locator('#mobilePrice').innerText(),/18만원/)
  await page.locator('input[data-option="lyrics-video"]').check();assert.match(await page.locator('#mobilePrice').innerText(),/22만원/)
  await page.evaluate(()=>{window.copy6='';navigator.clipboard.writeText=async s=>{window.copy6=s}});await page.locator('.contact-submit').tap();await page.waitForFunction(()=>window.copy6.startsWith('[위스티아 상담 요청]'))
  const copy=await page.evaluate(()=>window.copy6);assert.match(copy,/추가 1곡 1절 녹음 \(\+60,000원\)/);assert.match(copy,/예상 금액 : 220,000원/);assert.doesNotMatch(copy,/신부 입장곡|신랑 입장곡/)
  if(width===390){mkdirSync('work',{recursive:true});writeFileSync('work/6-copy-example.txt',copy)}
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth),0)
  // Initial range failure has no validated closures and cannot advertise open dates.
  phase='fail';await page.reload({waitUntil:'domcontentloaded'});await page.locator('#calendar-bookingDate').waitFor({state:'attached'});await page.waitForFunction(()=>WistiaBooking.calendarRangeFailed('2026-10-01','2026-10-31'))
  await page.locator('[data-contact-date-mode="bookingDate"][value="date"]').locator('..').tap()
  for(const day of [9,11,18,25]){const cell=page.locator(`[data-calendar-day="2026-10-${String(day).padStart(2,'0')}"]`).last();assert.equal(await cell.isDisabled(),true);assert.match(await cell.getAttribute('aria-label'),/카카오톡 확인 필요/)}
  phase='timeout';pending=[];await page.reload({waitUntil:'domcontentloaded'});await page.locator('#calendar-bookingDate').waitFor({state:'attached'});while(!pending.length)await page.waitForTimeout(10)
  await page.locator('[data-contact-date-mode="bookingDate"][value="date"]').locator('..').tap()
  assert.match(await page.locator('#calendar-bookingDate [data-calendar-range-status]').innerText(),/확인하고/)
  const firstPending=page.locator('#calendar-bookingDate [data-calendar-day="2026-10-11"]');assert.equal(await firstPending.isDisabled(),true);assert.match(await firstPending.getAttribute('aria-label'),/확인 중/)
  await page.clock.fastForward(8100);await page.waitForFunction(()=>WistiaBooking.calendarRangeFailed('2026-10-01','2026-10-31'));assert.equal(await firstPending.isDisabled(),true);assert.match(await firstPending.getAttribute('aria-label'),/카카오톡 확인 필요/)
  await page.close();console.log(`${width}px touch: stationary opening/selection, explicit close, unknown clears, partial times, retained closures after refresh failure/timeout, first failure disabled, new option/copy passed`)
 }
}finally{await browser.close();mkdirSync('work',{recursive:true});writeFileSync('work/6-touch-measurements.json',JSON.stringify(results,null,2))}
