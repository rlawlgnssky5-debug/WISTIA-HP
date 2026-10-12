import {test} from 'node:test'
import assert from 'node:assert/strict'
import {createRequire} from 'node:module'
import {existsSync,readFileSync} from 'node:fs'
import {spawn} from 'node:child_process'
import {createServer} from 'node:net'
const require=createRequire(import.meta.url)
let playwright,executable,skip=false
try{playwright=require('playwright');executable=process.env.WISTIA_BROWSER_EXECUTABLE||['/usr/bin/chromium',playwright.chromium.executablePath()].find(existsSync);if(!executable)skip='Chromium not installed'}catch{skip='Playwright not installed'}
await test('Unified addresses, responsive SVG illustrations, composite photo and stable person selection',{skip,timeout:120000},async()=>{
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

   for(const path of ['/info/location','/','/detail/solo','/detail/duo']){
    await page.goto(`http://127.0.0.1:${port}`+path,{waitUntil:'domcontentloaded'});await page.locator('#app h1').first().waitFor()
    for(const address of await page.locator('.studio-address').all()){
     const m=await address.evaluate(n=>{const range=document.createRange();range.selectNodeContents(n);return {text:n.textContent,children:n.children.length,lines:range.getClientRects().length,inside:[...range.getClientRects()].every(r=>r.right<=innerWidth),font:getComputedStyle(n).fontFamily}})
     assert.equal(m.text,'경기도 부천시 석천로170번길 19, 2층');assert.equal(m.children,0);assert.equal(m.lines,1);assert.ok(m.inside,JSON.stringify(m));assert.match(m.font,/Pretendard/);assert.doesNotMatch(m.font,/MaruBuri|Georgia/)
    }
    if(path.startsWith('/detail/')){
     const graphic=page.locator('.recording-join-illustration');await graphic.scrollIntoViewIfNeeded();await graphic.evaluate(n=>n.decode())
     assert.ok(await graphic.evaluate(n=>n.naturalWidth>0));assert.equal(await page.locator('.mas-cut-clips,.mas-joined-clip').count(),0)
     assert.equal(await page.locator('.mas-cut-poster figcaption').innerText(),'어려운 구간은 나누어 녹음하고 1:1 디렉팅으로 차근차근 맞춰갑니다')
     const advantages=page.locator('.advantages-illustration img');await advantages.scrollIntoViewIfNeeded();await advantages.evaluate(n=>n.decode())
     assert.match(await advantages.evaluate(n=>n.currentSrc),width<=700?/advantages-mobile/:/advantages-desktop/)
     const alt=await advantages.getAttribute('alt');for(const word of ['구간별 녹음 + 1:1 디렉팅','음정·박자 수작업 보정','상담 시 안내드린 금액 그대로','당일 추가 비용은 없습니다'])assert.ok(alt.includes(word))
     const photo=page.locator('.mas-key-caption-image');await photo.scrollIntoViewIfNeeded();await photo.evaluate(n=>n.decode());assert.match(await photo.getAttribute('alt'),/노래의 감정은 그대로, 내 목소리에 맞게/);assert.equal(await page.locator('#arcKey .mas-key-note,#arcKey figcaption').count(),0)
    }
   }
   await page.goto(`http://127.0.0.1:${port}/detail/solo`,{waitUntil:'domcontentloaded'})
   const measure=()=>page.locator('.mas-selection .mas-variant').evaluateAll(ns=>ns.map(n=>{const r=n.getBoundingClientRect(),p=n.parentElement.getBoundingClientRect(),s=getComputedStyle(n);return {x:r.x-p.x,y:r.y-p.y,w:r.width,h:r.height,pad:s.padding,transform:s.transform}}))
   assert.equal(await page.locator('.mas-selection.detail-section-layout').count(),0);assert.equal(await page.locator('.mas-selection').evaluate(n=>getComputedStyle(n).gridTemplateColumns.split(' ').length),width>768?2:1);assert.equal(await page.locator('#masSelectionTitle').evaluate(n=>getComputedStyle(n).display),'grid')
   const before=await measure();assert.ok(Math.abs(before[0].w-before[1].w)<1);if(width>768){assert.ok(before[0].w>=490);assert.ok(Math.abs(before[0].y-before[1].y)<1)}else assert.equal(before[0].x,before[1].x);await page.locator('.mas-variant[href="/detail/duo"]').click();await page.locator('[data-ar-product="duo"]').waitFor();const after=await measure()
   for(let i=0;i<2;i++){for(const k of ['x','y','w','h'])assert.ok(Math.abs(before[i][k]-after[i][k])<=1,JSON.stringify({before,after}));assert.equal(before[i].pad,after[i].pad);assert.equal(after[i].transform,'none')}
   for(const file of ['recording-join.svg','advantages-mobile.svg','advantages-desktop.svg']){
    const bounds=await page.evaluate(async file=>{
     const markup=await fetch('/assets/img/studio-illustrations/'+file).then(r=>r.text()),host=document.createElement('div');host.innerHTML=markup;host.style.cssText='position:absolute;left:-3000px;width:1120px';document.body.append(host)
     const svg=host.querySelector('svg'),view=svg.viewBox.baseVal;const result=[...svg.querySelectorAll('text')].map(n=>{const b=n.getBBox(),group=n.closest('g'),card=group?.querySelector(':scope>rect');return {text:n.textContent,inside:b.x>=0&&b.y>=0&&b.x+b.width<= (card?Number(card.getAttribute('width'))-20:view.width)&&b.y+b.height<= (card?Number(card.getAttribute('height')):view.height)}});const geometry=file==='recording-join.svg'?{top:[...svg.querySelectorAll(':scope>rect')].map(n=>({x:Number(n.getAttribute('x')),y:Number(n.getAttribute('y')),w:Number(n.getAttribute('width')),h:Number(n.getAttribute('height'))})),joined:svg.querySelector('clipPath rect').getAttribute('width'),centers:[...svg.querySelectorAll(':scope>circle')].map(n=>Number(n.getAttribute('cx')))}:null;host.remove();return {result,geometry}
    },file)
    assert.ok(bounds.result.every(n=>n.inside),file+' '+JSON.stringify(bounds));if(bounds.geometry){const [a,b]=bounds.geometry.top;assert.equal(a.w,b.w);assert.equal(a.h,b.h);assert.equal(a.y,b.y);assert.equal(b.x+b.w-a.x,Number(bounds.geometry.joined));assert.ok(bounds.geometry.centers.every(x=>x===(a.x+a.w+b.x)/2))}
   }
   await context.close()
  }
 }finally{await browser?.close();server.kill()}
})
