import assert from 'node:assert/strict'
import {createRequire} from 'node:module'
import {writeFileSync,mkdirSync} from 'node:fs'
mkdirSync('work',{recursive:true})
const {chromium}=createRequire(import.meta.url)('playwright')
const browser=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox']})
const base=process.env.WISTIA_PREVIEW_URL||'http://127.0.0.1:4175',results=[]
try{
 for(const width of [360,390,430,1280])for(const path of ['/contact','/event/solo','/event/duo','/event/duet-film']){
  const page=await browser.newPage({viewport:{width,height:844}}),errors=[]
  page.on('pageerror',e=>errors.push(e.message));await page.clock.install({time:new Date('2026-10-08T03:00:00Z')});await page.route('https://**/*',r=>r.abort())
  await page.route('**/api/availability?*',r=>{const q=new URL(r.request().url()).searchParams;return r.fulfill({json:q.has('from')?{ok:true,from:q.get('from'),to:q.get('to'),blocks:[]}:{ok:true,date:q.get('date'),blocks:[]}})})
  await page.goto(base+path);await page.locator('#bookingService').waitFor()
  assert.deepEqual(await page.locator('#bookingService option').evaluateAll(nodes=>nodes.map(n=>n.value)),['solo','duet-film'])
  assert.equal(await page.locator('#siteHeader .wordmark small').count(),0)
  const cta=page.locator('.contact-submit');assert.equal((await cta.innerText()).trim(),'작성한 내용으로 카카오톡 문의하기')
  await page.locator('[data-contact-date-mode="eventDate"][value="date"]').check()
  const popup=await page.locator('#calendar-eventDate').evaluate(n=>{const r=n.getBoundingClientRect(),card=document.querySelector('.contact-date-eventDate').getBoundingClientRect();return {left:r.left,right:r.right,height:r.height,cardLeft:card.left,cardRight:card.right}})
  if(width<=430){assert.ok(popup.left>=popup.cardLeft-1);assert.ok(popup.right<=popup.cardRight+1);assert.ok(popup.height<=360)}
  assert.ok(popup.left>=0&&popup.right<=width)
  await page.keyboard.press('Escape')
  await page.locator('[data-contact-date-mode="bookingDate"][value="date"]').check()
  const calendar=page.locator('#calendar-bookingDate');await calendar.waitFor();await page.waitForTimeout(100)
  const metrics=await page.evaluate(()=>{
   const rect=n=>{const r=n.getBoundingClientRect();return {left:r.left,right:r.right,width:r.width,height:r.height}}
   const field=document.querySelector('.contact-date-bookingDate'),calendar=document.querySelector('#calendar-bookingDate'),day=calendar.querySelector('.calendar-day')
   const violations=[]
   for(const field of document.querySelectorAll('.contact-date-field'))for(const n of field.querySelectorAll('legend,.contact-date-description,.calendar-trigger,.calendar-inline,.calendar-navigation,.calendar-caption,.calendar-grid,.calendar-legend,em')){
    if(!n.getBoundingClientRect().width||n.closest('[hidden]'))continue
    const a=rect(n),b=rect(field);if(a.left<b.left-1||a.right>b.right+1||a.left<0||a.right>innerWidth)violations.push({cls:n.className,rect:a,parent:b})
   }
   const label=document.querySelector('.contact-submit [data-submit-label]')
   return {overflow:document.documentElement.scrollWidth>innerWidth,field:rect(field),calendar:rect(calendar),dayHeight:rect(day).height,violations,labelRect:rect(label),buttonRect:rect(document.querySelector('.contact-submit')),labelHeight:rect(label).height,labelLineHeight:parseFloat(getComputedStyle(label).lineHeight),textLines:[...label.childNodes].filter(n=>n.nodeType===3&&n.textContent.trim()).flatMap(n=>{const range=document.createRange();range.selectNodeContents(n);return [...range.getClientRects()]}).length}
  })
  assert.ok(metrics.labelRect.left>=metrics.buttonRect.left&&metrics.labelRect.right<=metrics.buttonRect.right,'CTA label stays inside button');assert.equal(metrics.textLines,1,'CTA text stays on one line')
  assert.equal(metrics.overflow,false,JSON.stringify({width,path,...metrics}));assert.deepEqual(metrics.violations,[],JSON.stringify({width,path,...metrics}))
  if(width<=430){assert.ok(metrics.dayHeight<=36);assert.ok(metrics.calendar.height<=360)}else assert.ok(metrics.dayHeight>=56,'desktop date heights unchanged')
  if(width<=430){
   await calendar.locator('[data-calendar-year]').selectOption('2027');await calendar.locator('[data-calendar-month]').selectOption('4')
   const sixRows=await calendar.evaluate(n=>n.getBoundingClientRect().height)
   assert.ok(sixRows<400,'six-week calendars still fit one mobile viewport');metrics.sixRowHeight=sixRows
   await calendar.locator('[data-calendar-year]').selectOption('2026');await calendar.locator('[data-calendar-month]').selectOption('9')
  }
  await calendar.locator('[data-calendar-day="2026-10-16"]').click();await page.waitForFunction(()=>document.querySelector('#contactInquiryForm').dataset.scheduleState==='ready')
  assert.equal((await cta.innerText()).trim(),'작성한 내용으로 카카오톡 문의하기')
  for(const kind of ['bride','groom']){
   const image=page.locator(`.option-photo img[src$="entrance-${kind}-v2.webp"]`)
   if(await image.count()){await image.scrollIntoViewIfNeeded();await image.evaluate(n=>{n.loading='eager'});await page.waitForFunction(src=>[...document.images].some(n=>n.src.endsWith(src)&&n.naturalWidth===1280),`entrance-${kind}-v2.webp`);assert.deepEqual(await image.evaluate(n=>({fit:getComputedStyle(n).objectFit,position:getComputedStyle(n).objectPosition,loaded:n.naturalWidth})),{fit:'contain',position:'50% 50%',loaded:1280})}
  }
  assert.deepEqual(errors,[])
  results.push({width,path,popup,...metrics})
  if(width===390&&path==='/event/solo')await page.locator('#bookingInquiry').screenshot({path:'work/polish3-inquiry-390.png'})
  console.log(`${width}px ${path}: two products, CTA, header, popup bounds, compact calendar and no overflow passed`)
  await page.close()
 }
 for(const width of [1280,390]){
  const page=await browser.newPage({viewport:{width,height:844}});await page.route('https://**/*',r=>r.abort());await page.goto(base+'/info/location');await page.locator('.studio-address').waitFor();await page.waitForTimeout(100)
  const offsets=await page.locator('.wistia-location').evaluate(n=>[...n.querySelectorAll('.studio-address-city,.studio-address-street,.studio-address-floor,.wistia-location-details article,.wistia-location-details h3,.wistia-location-details p,.wistia-location .svg-title-icon')].filter(n=>n.getBoundingClientRect().width).map(n=>({text:n.textContent.trim(),align:getComputedStyle(n).textAlign,offset:n.getBoundingClientRect().x+n.getBoundingClientRect().width/2-innerWidth/2})))
  for(const row of offsets){if(!row.text)assert.ok(Math.abs(row.offset)<=1);else assert.equal(row.align,'center');assert.ok(Math.abs(row.offset)<=1,JSON.stringify(row))}
  results.push({width,path:'/info/location',offsets});await page.locator('.wistia-location').screenshot({path:`work/polish3-location-${width}.png`});await page.close()
 }
}finally{await browser.close();writeFileSync('work/polish3-mobile-results.json',JSON.stringify(results,null,2))}
