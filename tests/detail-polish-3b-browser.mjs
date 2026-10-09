import assert from 'node:assert/strict'
import {createRequire} from 'node:module'
import {writeFileSync,mkdirSync} from 'node:fs'
mkdirSync('work',{recursive:true})
const {chromium}=createRequire(import.meta.url)('playwright')
const browser=await chromium.launch({executablePath:process.env.WISTIA_BROWSER_EXECUTABLE||'/usr/bin/chromium',args:['--no-sandbox']})
const base=process.env.WISTIA_PREVIEW_URL||'http://127.0.0.1:4175',results=[]
const blocks=[9,18,25].map(day=>({start:`2026-10-${String(day-1).padStart(2,'0')}T15:00:00Z`,end:`2026-10-${String(day).padStart(2,'0')}T15:00:00Z`})).concat({start:'2026-10-11T07:30:00Z',end:'2026-10-11T09:30:00Z'})
try{
 for(const width of [1280,390]){
  const page=await browser.newPage({viewport:{width,height:844}});await page.clock.install({time:new Date('2026-10-08T03:00:00Z')});await page.route('https://**/*',r=>r.abort())
  const pending=[];let fail=false,requests=0
  await page.route('**/api/availability?*',async r=>{const q=new URL(r.request().url()).searchParams;if(q.has('from')){requests++;await new Promise(resolve=>pending.push(resolve));await r.fulfill(fail?{status:503,json:{ok:false}}:{json:{ok:true,from:q.get('from'),to:q.get('to'),blocks}})}else await r.fulfill({json:{ok:true,date:q.get('date'),blocks}})})
  await page.goto(base+'/event/solo');await page.locator('[data-contact-date-mode="bookingDate"][value="date"]').check()
  const calendar=page.locator('#calendar-bookingDate')
  async function release(){while(!pending.length)await page.waitForTimeout(10);pending.shift()();await page.waitForTimeout(100)}
  async function closed(){for(const day of [9,18,25]){const cell=calendar.locator(`[data-calendar-day="2026-10-${String(day).padStart(2,'0')}"]`);assert.equal(await cell.isDisabled(),true);assert.match(await cell.innerText(),/마감/);assert.match(await cell.getAttribute('aria-label'),/마감/)}assert.equal(await calendar.locator('[data-calendar-day="2026-10-11"]').isDisabled(),false)}
  // Return to October while requests are pending: completion must repaint the current DOM.
  await calendar.locator('[data-calendar-move="1"]').click();await calendar.locator('[data-calendar-move="-1"]').click();await release();await closed();await release();await closed()
  for(let day=1;day<=7;day++){const cell=calendar.locator(`[data-calendar-day="2026-10-0${day}"]`);assert.equal(await cell.innerText(),String(day));assert.equal(await cell.isDisabled(),true)}
  await page.clock.fastForward(31000);await page.evaluate(()=>WistiaContact.mountCalendars(document.querySelector('#contactInquiryForm')));await closed();await release();await closed()
  await page.locator('[data-contact-date-mode="eventDate"][value="date"]').check()
  const popup=await page.locator('#calendar-eventDate').evaluate(n=>{const r=n.getBoundingClientRect(),card=n.closest('.contact-date-field').getBoundingClientRect(),next=document.querySelector('.contact-date-bookingDate').getBoundingClientRect();return {position:getComputedStyle(n).position,top:r.top,bottom:r.bottom,left:r.left,right:r.right,cardBottom:card.bottom,nextTop:next.top}})
  if(width===390){assert.equal(popup.position,'relative');assert.ok(popup.bottom<=popup.cardBottom&&popup.bottom<popup.nextTop);assert.ok(popup.left>=0&&popup.right<=390)}
  await page.locator('#calendar-eventDate [data-calendar-close]').click();await page.locator('[data-calendar-trigger="bookingDate"]').click();await calendar.locator('[data-calendar-day="2026-10-11"]').click();await page.waitForFunction(()=>document.querySelector('#contactInquiryForm').dataset.scheduleState==='ready')
  assert.equal(await page.locator('[data-calendar-time="17:00"]').isDisabled(),true);assert.equal(await page.locator('[data-calendar-time="19:00"]').isDisabled(),false)
  await page.locator('[data-calendar-trigger="bookingDate"]').click()
  const layout=await page.evaluate(()=>{const offset=(n,parent)=>{const a=n.getBoundingClientRect(),b=parent.getBoundingClientRect();return a.x+a.width/2-b.x-b.width/2};const calendar=document.querySelector('#calendar-bookingDate'),times=document.querySelector('[data-calendar-times]');return {calendarOffset:offset(calendar,calendar.closest('fieldset')),timeOffset:offset(times,times.closest('fieldset')),overflow:document.documentElement.scrollWidth-innerWidth,padding:parseFloat(getComputedStyle(document.querySelector('#app')).paddingBottom),barHeight:document.querySelector('.inquiry-actions').getBoundingClientRect().height}})
  assert.ok(Math.abs(layout.calendarOffset)<=1);assert.ok(Math.abs(layout.timeOffset)<=1);assert.equal(layout.overflow,0);assert.ok(layout.padding>layout.barHeight+16)
  const unobscured=[]
  for(const selector of ['[data-calendar-time="22:00"]','.booking-extra .option-choice']){const target=page.locator(selector).first();await target.scrollIntoViewIfNeeded();const clear=await target.evaluate(n=>{const r=n.getBoundingClientRect(),bar=document.querySelector('.inquiry-actions').getBoundingClientRect();return {selector:n.className||n.dataset.calendarTime,bottom:r.bottom,barTop:bar.top,visible:r.bottom<=bar.top}});assert.equal(clear.visible,true);unobscured.push(clear)}
  layout.unobscured=unobscured
  if(!await calendar.isVisible())await page.locator('[data-calendar-trigger="bookingDate"]').click()
  fail=true;await page.evaluate(()=>{void WistiaBooking.loadRange('2026-10-01','2026-10-31',true).catch(()=>{})});await release();assert.match(await calendar.locator('[data-calendar-range-status]').innerText(),/카카오톡 확인 필요/);assert.equal(await calendar.locator('[data-calendar-range-status]').isVisible(),true)
  // Failed refresh preserves validated closures and displays the Kakao fallback.
  assert.equal(await calendar.locator('[data-calendar-day="2026-10-09"]').isDisabled(),true)
  results.push({width,path:'/event/solo',requests,popup,...layout,closures:[9,18,25],lateResponse:true,expiryRemount:true,failureNotice:true});await page.close()
  for(const path of ['/detail/solo','/detail/duet-film']){
   const p=await browser.newPage({viewport:{width,height:844}});await p.route('https://**/*',r=>r.abort());await p.goto(base+path);await p.locator('.mas-location').waitFor();await p.waitForTimeout(100)
   const measurements=await p.locator('.mas-location').evaluate(n=>({rows:[...n.querySelectorAll('.mas-location-city,address,dt,dd,dd small')].map(x=>({text:x.textContent.trim(),align:getComputedStyle(x).textAlign,offset:x.getBoundingClientRect().x+x.getBoundingClientRect().width/2-innerWidth/2})),before:getComputedStyle(n,'::before').content,after:getComputedStyle(n,'::after').content,headerBackground:getComputedStyle(n.querySelector('header')).backgroundColor}))
   for(const row of measurements.rows){assert.equal(row.align,'center');assert.ok(Math.abs(row.offset)<=1,JSON.stringify(row))}
   await p.evaluate(()=>window.scrollTo(0,document.documentElement.scrollHeight));const bottom=await p.locator('.mas-bottom').evaluate(n=>innerHeight-n.getBoundingClientRect().bottom);if(width===390)assert.equal(bottom,0)
   await p.locator('.mas-location').screenshot({path:`work/3b-directions-${width}-${path.split('/').at(-1)}.png`});results.push({width,path,...measurements,bottomGap:bottom});await p.close()
  }
 }
}finally{await browser.close();writeFileSync('work/3b-measurements.json',JSON.stringify(results,null,2))}
console.log('3b: delayed closures, cache-expiry remount, past dates, partial times, fallback, centered controls, inline popup and real detail directions passed at 1280/390')
