import assert from 'node:assert/strict'
import {createRequire} from 'node:module'
import {writeFileSync,mkdirSync} from 'node:fs'
mkdirSync('work',{recursive:true})
const {chromium}=createRequire(import.meta.url)('playwright')
const browser=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox']})
const base=process.env.WISTIA_PREVIEW_URL||'http://127.0.0.1:4175',measurements=[]
try{
 for(const width of [1280,390]){
  const page=await browser.newPage({viewport:{width,height:900}})
  await page.clock.install({time:new Date('2026-10-08T03:00:00Z')})
  await page.route('https://**/*',r=>r.abort())
  const pending=[];let rangeCalls=0
  await page.route('**/api/availability?*',async route=>{
   const q=new URL(route.request().url()).searchParams
   if(q.has('from')){const call=++rangeCalls;await new Promise(resolve=>pending.push(resolve));await route.fulfill({json:{ok:true,from:q.get('from'),to:q.get('to'),blocks:[{start:call===3?'2026-10-09T15:00:00Z':'2026-10-08T15:00:00Z',end:call===3?'2026-10-10T15:00:00Z':'2026-10-09T15:00:00Z'}]}})}
   else await route.fulfill({json:{ok:true,date:q.get('date'),blocks:[]}})
  })
  await page.goto(base+'/event/solo')
  await page.locator('[data-contact-date-mode="bookingDate"][value="date"]').check()
  const calendar=page.locator('#calendar-bookingDate')
  await page.waitForFunction(()=>!!window.WistiaBooking)
  while(!pending.length)await page.waitForTimeout(20)
  assert.equal(await calendar.locator('[data-calendar-day="2026-10-09"]').isDisabled(),false,'pending range does not invent closures')
  pending.shift()()
  await page.waitForFunction(()=>document.querySelector('#calendar-bookingDate [data-calendar-day="2026-10-09"]').disabled)
  assert.match(await calendar.locator('[data-calendar-day="2026-10-09"]').innerText(),/마감/,'late UTC full-day response repaints event/solo')
  for(const day of ['12','13','14']){const cell=calendar.locator(`[data-calendar-day="2026-10-${day}"]`);assert.equal(await cell.isDisabled(),true);assert.equal(await cell.innerText(),String(Number(day)))}
  assert.equal(await page.locator('#contact-bookingDate-hint').count(),0)
  await calendar.locator('[data-calendar-move="1"]').click()
  while(!pending.length)await page.waitForTimeout(20)
  // October and November requests can complete out of order; only the visible month paints.
  await calendar.locator('[data-calendar-move="-1"]').click()
  assert.equal(await calendar.locator('[data-calendar-day="2026-10-09"]').isDisabled(),true)
  pending.shift()()
  await page.waitForTimeout(50)
  assert.equal(await calendar.locator('[data-calendar-day="2026-10-09"]').isDisabled(),true)
  await calendar.locator('[data-calendar-move="1"]').click()
  assert.equal(await calendar.locator('[data-calendar-day="2026-11-05"]').isDisabled(),false)
  await calendar.locator('[data-calendar-move="-1"]').click()
  assert.equal(await calendar.locator('[data-calendar-day="2026-10-09"]').isDisabled(),true)
  // A refresh initiated outside paintCalendar must also repaint the already-mounted month.
  await page.evaluate(()=>{void window.WistiaBooking.loadRange('2026-10-01','2026-10-31',true)})
  while(!pending.length)await page.waitForTimeout(20)
  pending.shift()()
  await page.waitForFunction(()=>document.querySelector('#calendar-bookingDate [data-calendar-day="2026-10-10"]').disabled)
  assert.equal(await calendar.locator('[data-calendar-day="2026-10-09"]').isDisabled(),false,'a successful external refresh replaces old range data and redraws')
  console.log(`${width}px: delayed UTC full-day range, month navigation and weekday number-only cells passed`)
  await page.close()
  for(const path of ['/','/detail/solo','/detail/duo','/detail/duet-film']){
   const p=await browser.newPage({viewport:{width,height:900}});await p.route('https://**/*',r=>r.abort());await p.goto(base+path);await p.locator(path==='/'?'.home-point-layout':'.detail-section-layout').first().waitFor();await p.waitForTimeout(200)
   const points=await p.evaluate(()=>{
    const center=n=>{const r=n.getBoundingClientRect();return r.x+r.width/2},visible=n=>n&&n.getBoundingClientRect().width>0
    return [...document.querySelectorAll('.ar-commerce-detail .detail-point-label,.we-home .home-point-layout .we-section-tag')].filter(visible).map(badge=>{
     const section=badge.closest('.detail-section-layout,.home-point-layout'),title=section.querySelector('h2'),icon=title?.querySelector('.svg-title-icon'),description=section.querySelector('p.svg-section-description')||section.querySelector('header>p:not(.detail-point-label)'),box=[...section.querySelectorAll('.review-captures,.bap-player,.mas-key-note,.arc-recording-poster,.ar-expert-story,.mas-story-chapters>ol,.we-services,.we-carousel,.story-process-folder,.faq,.we-directions')].find(visible)||section.querySelector('figure')
     return {point:badge.textContent.trim(),badge:center(badge),title:visible(title)?center(title):null,icon:visible(icon)?center(icon):null,description:visible(description)?center(description):null,box:visible(box)?center(box):null,background:getComputedStyle(badge).backgroundColor}
    })
   })
   for(const point of points)for(const part of ['badge','title','icon','description','box'])if(point[part]!==null)assert.ok(Math.abs(point[part]-width/2)<=1,`${path} ${width} ${point.point} ${part} center ${point[part]}`)
   assert.equal(await p.locator('.ar-commerce-detail .price-reason-label').filter({hasText:'POINT'}).count(),0)
   const warm=await p.locator('.bap-player').first().evaluate(n=>getComputedStyle(n).backgroundColor).catch(()=>null)
   if(warm)assert.equal(warm,'rgb(239, 234, 225)')
   if(path!=='/'){
    const notice=await p.locator('.arc-notices ul').evaluate(n=>({width:n.getBoundingClientRect().width,center:n.getBoundingClientRect().x+n.getBoundingClientRect().width/2,lines:[...n.querySelectorAll('li,li div,li strong,li small')].map(x=>getComputedStyle(x).textAlign)}))
    assert.ok(notice.width<=800);assert.ok(Math.abs(notice.center-width/2)<=1);assert.ok(notice.lines.every(x=>x==='center'))
   }
   measurements.push({width,path,pageCenter:width/2,points})
   console.log(`${width}px ${path}: ${points.length} POINT centers measured`)
   await p.screenshot({path:`work/polish2-${width}-${path.replaceAll('/','-')||'home'}.png`,fullPage:true})
   await p.close()
  }
 }
}finally{await browser.close();writeFileSync('work/polish2-measurements.json',JSON.stringify(measurements,null,2))}
