import {test} from 'node:test'
import assert from 'node:assert/strict'
import {createRequire} from 'node:module'
import {existsSync,readFileSync} from 'node:fs'
import {spawn} from 'node:child_process'
import {createServer} from 'node:net'
const require=createRequire(import.meta.url)
let playwright,executable,skip=false
try{playwright=require('playwright');executable=process.env.WISTIA_BROWSER_EXECUTABLE||['/usr/bin/chromium',playwright.chromium.executablePath()].find(existsSync);if(!executable)skip='Chromium not installed'}catch{skip='Playwright not installed'}
await test('About title, label and prose rails match; icons center on the first line and shared inquiry headings stay aligned',{skip,timeout:120000},async()=>{
 const probe=createServer();await new Promise(r=>probe.listen(0,'127.0.0.1',r));const port=probe.address().port;await new Promise(r=>probe.close(r))
 const server=spawn(process.execPath,['scripts/local-preview.mjs'],{env:{...process.env,WISTIA_PREVIEW_PORT:String(port)},stdio:['ignore','pipe','pipe']})
 let browser
 try{
  await new Promise((resolve,reject)=>{const timer=setTimeout(()=>reject(Error('preview timeout')),10000);server.stdout.once('data',()=>{clearTimeout(timer);resolve()});server.once('error',reject)})
  browser=await playwright.chromium.launch({headless:true,executablePath:executable,args:['--no-sandbox','--disable-dev-shm-usage']})
  for(const width of [360,375,390,1280]){
   const context=await browser.newContext({viewport:{width,height:844},isMobile:true,hasTouch:true}),page=await context.newPage()
   await page.clock.setFixedTime(new Date('2026-10-12T03:00Z'))
   await page.route('https://**/*',r=>r.abort())
   const fontFixture=process.env.WISTIA_FONT_FIXTURE_DIR
   if(fontFixture)await page.route('https://cdn.jsdelivr.net/gh/fonts-archive/MaruBuri@*/MaruBuri-*.woff2',r=>r.fulfill({body:readFileSync(fontFixture+'/'+new URL(r.request().url()).pathname.split('/').at(-1)),contentType:'font/woff2'}))
   await page.route('**/api/availability?*',r=>{const q=new URL(r.request().url()).searchParams;return r.fulfill({json:{ok:true,from:q.get('from'),to:q.get('to'),date:q.get('date'),blocks:[]}})})

   await page.goto(`http://127.0.0.1:${port}/info/about`,{waitUntil:'domcontentloaded'})
   await page.locator('.about-specialist-title[data-title-aligned]').last().waitFor()
   await page.evaluate(()=>document.fonts.ready)
   const measures=()=>page.locator('.info-page-about :is(.svg-section-title,.svg-item-title)').evaluateAll(ns=>ns.map(n=>{
    const icon=n.querySelector('.svg-title-icon').getBoundingClientRect(),text=n.querySelector('.svg-section-text'),box=text.getBoundingClientRect(),parent=n.parentElement
    const walker=document.createTreeWalker(text,NodeFilter.SHOW_TEXT),rects=[]
    while(walker.nextNode()){if(!walker.currentNode.textContent.trim())continue;const range=document.createRange();range.selectNodeContents(walker.currentNode);rects.push(...range.getClientRects())}
    const article=n.closest('article'),column=article?article.getBoundingClientRect().left-document.querySelector('.wistia-specialist-grid').getBoundingClientRect().left:0
    return {tag:n.tagName,icon:icon.left-column,text:box.left-column,gap:box.left-icon.right,size:icon.width,center:(icon.top+icon.bottom)/2-(rects[0].top+rects[0].bottom)/2,lines:[...new Set(rects.map(r=>Math.round(r.top)))],lineLefts:rects.map(r=>r.left-box.left),font:getComputedStyle(n).fontSize,weight:getComputedStyle(n).fontWeight,lineHeight:getComputedStyle(n).lineHeight,body:[...parent.children].filter(p=>p.matches('p,small')).map(p=>p.getBoundingClientRect().left-column),overflow:n.scrollWidth-n.clientWidth}
   }))
   const paragraphs=await page.locator('.about-fixed-lines').evaluateAll(ns=>ns.map(n=>{
    const walker=document.createTreeWalker(n,NodeFilter.SHOW_TEXT),rects=[]
    while(walker.nextNode()){const range=document.createRange();range.selectNodeContents(walker.currentNode);rects.push(...range.getClientRects())}
    return {lines:n.innerHTML.split(/<br\s*\/?\s*>/).map(line=>{const div=document.createElement('div');div.innerHTML=line;return div.textContent}),rows:new Set(rects.map(r=>Math.round(r.top))).size,left:n.getBoundingClientRect().left,inside:rects.every(r=>r.right<=n.getBoundingClientRect().right+1&&r.right<=innerWidth),weights:[...n.querySelectorAll('strong')].map(n=>getComputedStyle(n).fontWeight)}
   }))
   assert.deepEqual(paragraphs.map(p=>p.lines),[['위스티아는 경기도 부천에 위치한','웨딩 축가 전문 스튜디오입니다'],['AR 축가 사전녹음과 축가 스토리 필름으로','본식에서 전할 노래를 함께 준비합니다'],['말로 다 전하지 못한 마음을','직접 부른 노래와 영상에 담습니다'],['한 곡의 노래가 한 편의 영상이 되기까지,','목소리에 담긴 마음이 장면까지 자연스럽게 이어지도록','녹음부터 음원 작업, 촬영과 편집을 함께합니다']])
   assert.deepEqual(paragraphs.map(p=>p.rows),[2,2,2,3]);assert.ok(paragraphs.every(p=>p.inside),JSON.stringify(paragraphs));assert.ok(paragraphs[1].weights.every(w=>Number(w)>=600&&Number(w)<=700))
   const records=await measures();assert.equal(records.length,6)
   for(const p of paragraphs)assert.ok(Math.abs(p.left-records[0].text)<1)
   for(const r of records){
    assert.ok(Math.abs(r.icon-records[0].icon)<1,JSON.stringify(records));assert.ok(Math.abs(r.text-records[0].text)<1,JSON.stringify(records));assert.equal(r.gap,8);assert.equal(r.size,24);assert.ok(Math.abs(r.center)<3,JSON.stringify(r))
    for(const left of r.body)assert.ok(Math.abs(left-r.text)<1,JSON.stringify(r))
    for(const left of r.lineLefts)assert.ok(Math.abs(left)<1,JSON.stringify(r))
   }
   assert.equal(records[0].lines.length,1)
   if(width<600){assert.equal(records[1].lines.length,1);assert.equal(records[4].lines.length,1);assert.equal(records[5].lines.length,1)}
   const roles=records.slice(1);assert.equal(new Set(roles.map(r=>r.font)).size,1);assert.equal(new Set(roles.map(r=>r.weight)).size,1);assert.equal(new Set(roles.map(r=>r.lineHeight)).size,1);assert.ok(roles.every(r=>r.lines.length===1));assert.equal(await page.locator('.info-page-intro h1 br').count(),0);assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth),0)
   if(width===1280){
    assert.equal(await page.locator('.wistia-specialist-grid').evaluate(n=>getComputedStyle(n).gridTemplateColumns.split(' ').length),3)
    await page.setViewportSize({width:375,height:844});await page.waitForTimeout(100)
    const resized=await measures();assert.ok(resized.every(r=>Math.abs(r.icon-resized[0].icon)<1&&Math.abs(r.center)<3),JSON.stringify(resized))
   }
   await page.goto(`http://127.0.0.1:${port}/event/solo`,{waitUntil:'domcontentloaded'})
   await page.locator('#sourceTitle[data-title-aligned]').waitFor()
   const shared=await page.locator('#scheduleTitle').evaluate(n=>{const t=n.querySelector('.svg-section-text'),p=n.parentElement.querySelector('p');return {text:t.getBoundingClientRect().left,body:p.getBoundingClientRect().left}})
   assert.ok(Math.abs(shared.text-shared.body)<1,JSON.stringify(shared))
   await context.close()
  }
 }finally{await browser?.close();server.kill()}
})
