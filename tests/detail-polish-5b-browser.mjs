import assert from 'node:assert/strict'
import {createRequire} from 'node:module'
import {writeFileSync,mkdirSync} from 'node:fs'
const {chromium}=createRequire(import.meta.url)('playwright')
const browser=await chromium.launch({executablePath:process.env.WISTIA_BROWSER_EXECUTABLE||'/usr/bin/chromium',args:['--no-sandbox']})
const results=[],base=process.env.WISTIA_PREVIEW_URL||'http://127.0.0.1:4175'
try{
 for(const width of [360,390]){
  const page=await browser.newPage({viewport:{width,height:844},isMobile:true,hasTouch:true})
  await page.clock.install({time:new Date('2026-10-08T03:00Z')})
  await page.route('https://**/*',r=>r.abort())
  await page.route('**/api/availability?*',r=>r.fulfill({json:{ok:true,blocks:[]}}))
  await page.goto(base+'/event/solo',{waitUntil:'domcontentloaded'})
  await page.locator('#consultForm .consultation-step').first().waitFor({state:'visible'})
  assert.equal(await page.locator('#contact-eventDate-hint').count(),0)
  for(const key of ['eventDate','bookingDate']){
   const calendar=page.locator('#calendar-'+key),mode=page.locator(`[data-contact-date-mode="${key}"][value="date"]`),label=mode.locator('..')
   await calendar.evaluate(n=>{window.touchChanges=[];new MutationObserver(records=>{for(const r of records)if(r.attributeName==='hidden')window.touchChanges.push(r.oldValue===null?'close':'open')}).observe(n,{attributes:true,attributeOldValue:true,attributeFilter:['hidden']})})
   for(const target of [label,label.locator('span'),mode]){
    for(const open of [true,false,true,false]){
     await page.evaluate(()=>{window.touchChanges=[]})
     // Locator.tap sends real touchscreen input, including native label activation.
     await target.tap();await page.waitForTimeout(100)
     assert.equal(await calendar.isVisible(),open,`${width}px ${key} touch toggles`)
     const transitions=await page.evaluate(()=>window.touchChanges)
     assert.deepEqual(transitions,[open?'open':'close'],'one visibility transition per tap, no flicker')
    }
   }
   await label.tap();await calendar.waitFor({state:'visible'})
   await calendar.locator('[data-calendar-year]').selectOption('2027');await calendar.locator('[data-calendar-month]').selectOption('0')
   await calendar.locator('[data-calendar-day="2027-01-09"]').tap()
   assert.equal(await calendar.isVisible(),false)
   const trigger=page.locator(`[data-calendar-trigger="${key}"]`)
   assert.match(await trigger.innerText(),/2027년 1월 9일 \(토\).*변경/s)
   assert.equal(await page.locator('.contact-date-'+key+' em').count(),0,'no stale below-card instruction')
   await trigger.tap();await calendar.locator('[data-calendar-close]').tap();assert.equal(await calendar.isVisible(),false)
   await label.tap();await page.locator(`[data-contact-date-mode="${key}"][value="unknown"]`).locator('..').tap()
   assert.equal(await calendar.isVisible(),false)
   const overflow=await page.evaluate(()=>Math.max(0,document.documentElement.scrollWidth-innerWidth))
   assert.equal(overflow,0)
   results.push({width,key,realTouch:true,targets:['label','span','radio'],cyclesPerTarget:2,oneTransitionPerTap:true,selectedDate:'2027년 1월 9일 (토)',staleHintCount:0,unknownCloses:true,overflow})
  }
  await page.close()
 }
 mkdirSync('work',{recursive:true});writeFileSync('work/5b-touch-measurements.json',JSON.stringify(results,null,2));console.log('360/390px real touchscreen: both date controls label/span/radio open-close cycles, no flicker, selected/unknown hint absence passed')
}finally{await browser.close()}
