import assert from 'node:assert/strict'
import {createRequire} from 'node:module'
import {writeFileSync,mkdirSync} from 'node:fs'
mkdirSync('work',{recursive:true})
const {chromium}=createRequire(import.meta.url)('playwright')
const browser=await chromium.launch({executablePath:process.env.WISTIA_BROWSER_EXECUTABLE||'/usr/bin/chromium',args:['--no-sandbox']})
const base=process.env.WISTIA_PREVIEW_URL||'http://127.0.0.1:4175',results=[]
try{
 for(const width of [1280,390])for(const path of ['/event/solo','/event/duo','/event/duet-film','/contact','/detail/solo','/detail/duo','/detail/duet-film']){
  const page=await browser.newPage({viewport:{width,height:844}})
  await page.route('https://**/*',r=>r.abort())
  await page.route('**/api/availability?*',r=>{const q=new URL(r.request().url()).searchParams;return r.fulfill({json:{ok:true,from:q.get('from'),to:q.get('to'),date:q.get('date'),blocks:[]}})})
  await page.goto(base+path,{waitUntil:'domcontentloaded'});const event=path.startsWith('/event/')||path==='/contact'
  await page.locator(event?'.inquiry-actions':'.mas-bottom').waitFor()
  if(event){await page.locator('[data-contact-date-mode="bookingDate"][value="date"]').check();const day=page.locator('#calendar-bookingDate button:not(:disabled)[data-calendar-day]').last();await day.click();await page.waitForFunction(()=>document.querySelector('#contactInquiryForm').dataset.scheduleState==='ready')}
  await page.evaluate(()=>window.scrollTo(0,document.documentElement.scrollHeight));await page.waitForTimeout(100)
  const layout=await page.evaluate(event=>{
   const rect=n=>{const r=n.getBoundingClientRect();return {left:r.left,right:r.right,top:r.top,bottom:r.bottom,width:r.width,height:r.height}}
   const bar=document.querySelector(event?'.inquiry-actions':'.mas-bottom'),container=document.querySelector(event?'.consultation-flow':'.ar-commerce-detail')
   const selectors=event?['#contact-source','[data-calendar-time="23:00"]','.booking-extra .option-choice']:['.mas-map-links a']
   return {bar:rect(bar),container:rect(container),overflow:document.documentElement.scrollWidth-innerWidth,targets:selectors.flatMap(selector=>[...document.querySelectorAll(selector)].map(n=>({selector,...rect(n)}))),headerBottom:document.querySelector('#siteHeader').getBoundingClientRect().bottom,padding:parseFloat(getComputedStyle(document.querySelector(event?'#contactInquiryForm':'.ar-commerce-detail')).paddingBottom)}
  },event)
  assert.equal(layout.overflow,0)
  if(width===1280){assert.equal((layout.bar.left+layout.bar.right)/2,width/2);if(event){assert.equal(layout.bar.left,layout.container.left);assert.equal(layout.bar.right,layout.container.right)}assert.ok(layout.padding>=(event?160:112));for(const target of layout.targets)if(target.height)assert.ok(target.bottom<layout.bar.top,JSON.stringify({path,width,target,bar:layout.bar}))}
  else{assert.equal(layout.bar.left,0);assert.equal(layout.bar.right,390);assert.equal(layout.bar.bottom,844)}
  const scrollChecks=[]
  if(event&&width===1280)for(const selector of ['#contact-source','[data-calendar-time="23:00"]','.booking-extra .option-choice']){
   const target=page.locator(selector).last();if(!await target.count())continue
   await target.scrollIntoViewIfNeeded()
   const clear=await target.evaluate(n=>{const r=n.getBoundingClientRect(),bar=document.querySelector('.inquiry-actions').getBoundingClientRect();return {top:r.top,bottom:r.bottom,barTop:bar.top}})
   assert.ok(clear.top>=0&&clear.bottom<clear.barTop,JSON.stringify({path,selector,...clear}));scrollChecks.push({selector,...clear})
  }
  if(!event&&width===1280)for(const target of layout.targets){assert.ok(target.top>=layout.headerBottom&&target.bottom<=844,'map buttons fully visible below header at page end')}
  results.push({width,path,...layout,scrollChecks});console.log(`${width}px ${path}: bar and content clearance passed`);await page.close()
 }
}finally{await browser.close();writeFileSync('work/4-bar-measurements.json',JSON.stringify(results,null,2))}
console.log('4차: 1280/390 문의 4종·상세 3종의 바 위치, 데스크톱 하단 콘텐츠 가림 없음, 모바일 배치 유지 통과')
