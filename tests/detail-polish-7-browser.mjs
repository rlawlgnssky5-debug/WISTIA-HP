import assert from 'node:assert/strict'
import {createRequire} from 'node:module'
import {mkdirSync,writeFileSync} from 'node:fs'
const {chromium}=createRequire(import.meta.url)('playwright')
const browser=await chromium.launch({executablePath:process.env.WISTIA_BROWSER_EXECUTABLE||'/usr/bin/chromium',args:['--no-sandbox']})
const base=process.env.WISTIA_PREVIEW_URL||'http://127.0.0.1:4175',results=[]
mkdirSync('work',{recursive:true})
try{
 for(const width of [360,390,1280]){
  const page=await browser.newPage({viewport:{width,height:844}});await page.clock.install({time:new Date('2026-10-08T03:00Z')});await page.route('https://**/*',r=>r.abort())
  await page.route('**/api/availability?*',r=>{const q=new URL(r.request().url()).searchParams;return r.fulfill({json:{ok:true,date:q.get('date'),from:q.get('from'),to:q.get('to'),blocks:[]}})})
  let noteRequests=[];page.on('request',r=>{if(r.postData()?.includes('둘이 같이 와요')||r.url().includes('둘이 같이 와요'))noteRequests.push(r.url())})
  for(const path of ['/event/solo','/event/duo','/event/duet-film']){
   await page.goto(base+path);await page.locator('#contact-specialNotes').waitFor({state:'attached'})
   assert.equal(await page.locator('[data-calendar-times] button:not(:disabled)').count(),0)
   assert.match(await page.locator('[data-time-date-hint]').innerText(),/날짜를 먼저 골라/)
   const initial=await page.locator('#contact-time').inputValue();await page.locator('[data-calendar-time="15:00"]').evaluate(n=>n.click());assert.equal(await page.locator('#contact-time').inputValue(),initial)
   for(const key of ['extra-verse','extra-full'])assert.equal(await page.locator('input[data-option="'+key+'"]').count(),1)
   await page.locator('input[data-option="extra-full"]').check()
   const selected=await page.evaluate(()=>WistiaQuote.context());assert.ok(selected.options.includes('extra-full'))
   const total=await page.evaluate(()=>calculate().finalPrice),price=path.endsWith('solo')?120000:path.endsWith('duo')?160000:350000;assert.equal(total,price+120000)
   await page.locator('#contact-specialNotes').fill('둘이 같이 와요\n키를 낮추고 싶어요')
   await page.locator('[data-calendar-time="15:00"]').evaluate(n=>n.click());assert.equal(await page.locator('#contact-time').inputValue(),'')
   await page.evaluate(()=>{window.copy7='';navigator.clipboard.writeText=async s=>{window.copy7=s}});await page.locator('.contact-submit').click();await page.waitForFunction(()=>window.copy7.startsWith('[위스티아 상담 요청]'))
   const copy=await page.evaluate(()=>window.copy7);assert.match(copy,/추가 1곡 완곡 녹음 \(\+120,000원\)/);assert.match(copy,/특이사항\n둘이 같이 와요\n키를 낮추고 싶어요\n━━━━━━━━━━━━/);assert.equal(noteRequests.length,0)
   const order=await page.locator('#consultForm .consultation-step').evaluateAll(nodes=>nodes.map(n=>n.querySelector('.booking-step').textContent));assert.deepEqual(order,['01','02','03','04'])
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth),0)
   await page.keyboard.press('Escape');results.push({width,path,total,notesInClipboardOnly:true,timeBeforeDateDisabled:true})
  }
  for(const path of ['/','/detail/solo','/detail/duo','/detail/duet-film']){
   await page.goto(base+path);await page.locator('.detail-point-label,.we-section-tag').first().waitFor({state:'visible'});await page.evaluate(()=>document.fonts.ready)
   assert.equal(await page.locator('.detail-recording-options').count(),1,path+' shows both additional recording options')
   assert.match(await page.locator('.detail-recording-options').innerText(),/추가 1곡 완곡 녹음/)
   assert.doesNotMatch(await page.locator('.detail-price-reason,#homePriceReason').innerText(),/1곡 기준|다른 곡/)
   if(path==='/'){
    const comparison=page.locator('#homeSound');assert.equal(await comparison.locator('h2').count(),1);assert.equal(await comparison.locator('.wistia-ba-copy').count(),0)
    const title=await comparison.locator('.svg-section-text').evaluate(n=>{const r=n.getBoundingClientRect();return {text:n.textContent,width:r.width,height:r.height,lineHeight:parseFloat(getComputedStyle(n).lineHeight),scrollWidth:n.scrollWidth,clientWidth:n.clientWidth}})
    assert.equal(title.text,'노래를 다듬은 전후 비교');assert.ok(title.height<=title.lineHeight+1);assert.ok(title.scrollWidth<=title.clientWidth)
    assert.equal(await comparison.locator('.bap-player').count(),1)
    await comparison.scrollIntoViewIfNeeded();await page.screenshot({path:`work/7-home-sound-${width}.png`})
   }
   const points=await page.evaluate(()=>{
    const center=n=>{const r=n.getBoundingClientRect();return r.x+r.width/2-innerWidth/2},visible=n=>n&&n.getBoundingClientRect().width>0
    return [...document.querySelectorAll('.ar-commerce-detail .detail-point-label,.we-home .home-point-layout .we-section-tag')].filter(visible).map(badge=>{
     const section=badge.closest('.detail-section-layout,.home-point-layout'),title=section.querySelector('h2'),icon=title?.querySelector('.svg-title-icon'),description=section.querySelector('p.svg-section-description')||section.querySelector('header>p:not(.detail-point-label)'),box=[...section.querySelectorAll('.review-captures,.bap-player,.mas-key-note,.arc-recording-poster,.ar-expert-story,.mas-story-chapters>ol,.we-services,.we-carousel,.story-process-folder,.faq,.we-directions')].find(visible)||section.querySelector('figure')
     const style=getComputedStyle(badge)
     return {point:badge.textContent.trim(),fontSize:style.fontSize,numberSize:badge.querySelector('.detail-point-number')?getComputedStyle(badge.querySelector('.detail-point-number')).fontSize:null,padding:style.padding,badge:center(badge),title:visible(title)?center(title):null,icon:visible(icon)?center(icon):null,description:visible(description)?center(description):null,box:visible(box)?center(box):null}
    })
   })
   for(const p of points){assert.equal(p.fontSize,'10px');if(p.numberSize)assert.equal(p.numberSize,'15px');for(const part of ['badge','title','icon','description','box'])if(p[part]!==null)assert.ok(Math.abs(p[part])<=1,`${path} ${width} ${p.point} ${part}: ${p[part]}`)}
   const guide=await page.locator('.detail-recording-options h2').evaluate(n=>{const r=n.getBoundingClientRect();return r.x+r.width/2-innerWidth/2});assert.ok(Math.abs(guide)<=1)
   for(const icon of await page.locator('.svg-title-icon,.svg-chrome-icon').all())assert.equal(await icon.locator('svg').count(),1)
   assert.equal(await page.locator('img[src*="folder.webp"],.mas-event-gift img:not([src$=".svg"])').count(),0)
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth),0)
   results.push({width,path,points,guideCenterDeviation:guide,horizontalOverflow:0})
  }
  await page.close();console.log(`${width}px: inquiry options/notes/privacy, time prerequisite, single-line comparison, compact SVG POINT centers and layout passed`)
 }
}finally{await browser.close();writeFileSync('work/7-layout-measurements.json',JSON.stringify(results,null,2))}
