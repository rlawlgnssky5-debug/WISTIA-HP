import assert from 'node:assert/strict'
import {createRequire} from 'node:module'
import {existsSync} from 'node:fs'
const require=createRequire(import.meta.url)
let playwright
try{playwright=require('playwright')}catch{playwright=createRequire('/tmp/pw/node_modules/playwright-core/package.json')('playwright-core')}
const executable=process.env.WISTIA_BROWSER_EXECUTABLE||['/usr/bin/chromium','/opt/google/chrome/chrome',playwright.chromium.executablePath()].find(existsSync)
const browser=await playwright.chromium.launch({executablePath:executable,args:['--no-sandbox']})
const base=process.env.WISTIA_PREVIEW_URL||'http://127.0.0.1:4174'
const pages=['/contact','/event/solo','/event/duo']
try{
 const page=await browser.newPage({viewport:{width:375,height:812},hasTouch:true,isMobile:true})
 await page.clock.install({time:new Date('2026-10-13T03:00:00Z')})
 await page.route('**/api/availability*',route=>route.fulfill({json:{ok:true,blocks:[]}}))
 for(const path of pages){
  await page.goto(base+path,{waitUntil:'domcontentloaded'})
  await page.locator('#contactInquiryForm').waitFor()
  const legend=page.locator('.contact-date-eventDate legend')
  await legend.scrollIntoViewIfNeeded()
  assert.match(await legend.innerText(),/① 결혼식 날짜/)
  const trigger=page.locator('[data-calendar-trigger="eventDate"]')
  await trigger.click()
  const calendar=page.locator('#calendar-eventDate')
  await calendar.waitFor({state:'visible'})
  const close=calendar.locator('[data-calendar-close]')
  assert.equal((await close.innerText()).replace(/\s+/g,''),'×닫기')
  assert.equal(await close.evaluate(node=>node.classList.contains('is-confirm')),false)
  const before=await close.evaluate(node=>{
   const box=node.getBoundingClientRect(),panel=node.closest('.contact-calendar').getBoundingClientRect(),style=getComputedStyle(node)
   return {text:node.textContent.trim(),right:Math.round(panel.right-box.right),top:Math.round(box.top-panel.top),width:box.width,height:box.height,bg:style.backgroundColor,color:style.color,overflow:document.documentElement.scrollWidth-document.documentElement.clientWidth}
  })
  assert.ok(before.right<=12&&before.right>=-2,JSON.stringify(before))
  assert.ok(before.top<=16,JSON.stringify(before))
  assert.ok(before.width>=52&&before.height>=32,JSON.stringify(before))
  assert.equal(before.overflow,0)
  await calendar.locator('[data-calendar-day="2026-10-20"]').click()
  assert.equal(await calendar.isVisible(),true)
  assert.equal((await close.innerText()).replace(/\s+/g,''),'확인')
  assert.equal(await close.getAttribute('aria-label'),'선택한 날짜 확인')
  const filled=await close.evaluate(node=>{
   const style=getComputedStyle(node),span=getComputedStyle(node.querySelector('span'))
   return {bg:style.backgroundColor,color:style.color,span:span.color,border:style.borderTopColor}
  })
  assert.equal(filled.bg,'rgb(37, 36, 33)')
  assert.equal(filled.color,'rgb(255, 255, 255)')
  assert.equal(filled.span,'rgb(255, 255, 255)')
  await close.click()
  await calendar.waitFor({state:'hidden'})
  assert.equal(await page.locator('#contact-eventDate').inputValue(),'2026-10-20')
  assert.match(await page.locator('[data-calendar-summary="eventDate"]').innerText(),/10월 20일/)
  await trigger.click()
  await calendar.waitFor({state:'visible'})
  assert.equal((await close.innerText()).replace(/\s+/g,''),'확인')
  await page.locator('[data-contact-date-mode="eventDate"][value="unknown"]').click()
  await calendar.waitFor({state:'hidden'})
  const booking=page.locator('#calendar-bookingDate')
  await page.locator('[data-calendar-trigger="bookingDate"]').click()
  await booking.waitFor({state:'visible'})
  const bookingClose=booking.locator('[data-calendar-close]')
  assert.match(await bookingClose.innerText(),/닫기/)
  assert.equal(await bookingClose.evaluate(node=>node.classList.contains('is-confirm')),false)
  assert.equal(await bookingClose.locator('svg').count(),1)
  await booking.locator('[data-calendar-close]').click()
  console.log(path+' 375px × 닫기 → 확인 passed',before)
 }
}finally{await browser.close()}
