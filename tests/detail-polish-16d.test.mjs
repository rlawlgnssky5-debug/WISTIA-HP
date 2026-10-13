import {test} from 'node:test'
import assert from 'node:assert/strict'
import {createRequire} from 'node:module'
import {existsSync,readFileSync} from 'node:fs'
import {spawn} from 'node:child_process'
import {createServer} from 'node:net'
const require=createRequire(import.meta.url)
let playwright,executable,skip=false
try{playwright=require('playwright');executable=process.env.WISTIA_BROWSER_EXECUTABLE||['/usr/bin/chromium',playwright.chromium.executablePath()].find(existsSync);if(!executable)skip='Chromium not installed'}catch{skip='Playwright not installed'}
await test('16d: home/inquiry titles, refined image bounds and retired detail redirect',{skip,timeout:120000},async()=>{
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
   const bodyFont=process.env.WISTIA_PRETENDARD_FIXTURE
   if(bodyFont){
    await page.route('**/pretendardvariable-dynamic-subset.min.css',r=>r.fulfill({contentType:'text/css',headers:{'access-control-allow-origin':'*'},body:"@font-face{font-family:'Pretendard Variable';font-weight:45 920;src:url('http://127.0.0.1:"+port+"/__pretendard.woff2')}"}))
    await page.route('**/__pretendard.woff2',r=>r.fulfill({body:readFileSync(bodyFont),contentType:'font/woff2'}))
   }

   const fontFixture=process.env.WISTIA_FONT_FIXTURE_DIR
   if(fontFixture)await page.route('https://cdn.jsdelivr.net/gh/fonts-archive/MaruBuri@*/MaruBuri-*.woff2',r=>r.fulfill({body:readFileSync(fontFixture+'/'+new URL(r.request().url()).pathname.split('/').at(-1)),contentType:'font/woff2'}))
   await page.route('**/api/availability?*',r=>{const q=new URL(r.request().url()).searchParams;return r.fulfill({json:{ok:true,from:q.get('from'),to:q.get('to'),date:q.get('date'),blocks:[]}})})

   for(const path of ['/','/event/solo','/event/duo','/event/duet-film']){
    await page.goto(`http://127.0.0.1:${port}`+path,{waitUntil:'domcontentloaded'});await page.locator('#app h2').first().waitFor();await page.evaluate(()=>document.fonts.ready)
    const titles=await page.locator(path==='/'?'.we-home h2':'.consultation-step-heading h2').evaluateAll(ns=>ns.map(n=>{
     const content=n.querySelector('.svg-section-text')||n,walker=document.createTreeWalker(content,NodeFilter.SHOW_TEXT),rs=[]
     while(walker.nextNode()){if(!walker.currentNode.textContent.trim())continue;const r=document.createRange();r.selectNodeContents(walker.currentNode);rs.push(...r.getClientRects())}
     const s=getComputedStyle(n),b=content.getBoundingClientRect();return {text:n.textContent,size:s.fontSize,weight:s.fontWeight,line:s.lineHeight,rows:new Set(rs.map(r=>Math.round(r.top))).size,expected:content.querySelectorAll('br').length+1,inside:rs.every(r=>r.left>=b.left-1&&r.right<=b.right+1&&r.right<=innerWidth)}
    }))
    assert.ok(titles.length>=3,path);assert.equal(new Set(titles.map(n=>n.size)).size,1,path+' '+width+' '+JSON.stringify(titles));assert.equal(new Set(titles.map(n=>n.weight)).size,1);assert.equal(new Set(titles.map(n=>n.line)).size,1)
    assert.ok(titles.every(n=>n.rows===n.expected&&n.inside),path+' '+width+' '+JSON.stringify(titles))
    if(path!=='/')assert.equal(titles.find(n=>n.text==='어디에서 보고 오셨나요?').size,width<=768?'19px':titles[0].size)
   }
   await page.goto(`http://127.0.0.1:${port}/detail/solo-film?utm_source=regression`,{waitUntil:'domcontentloaded'});await page.locator('.ar-commerce-detail').waitFor()
   assert.equal(new URL(page.url()).pathname,'/detail/duet-film');assert.equal(new URL(page.url()).search,'?utm_source=regression');assert.equal(await page.locator('.we-home').count(),0)
   await page.goto(`http://127.0.0.1:${port}/detail/solo`,{waitUntil:'domcontentloaded'});await page.locator('#arcRecording .detail-poster-image').scrollIntoViewIfNeeded()
   const image=await page.locator('#arcRecording .detail-poster-image').evaluate(async n=>{await n.decode();const b=n.getBoundingClientRect(),p=n.parentElement.getBoundingClientRect();return {width:b.width,height:b.height,center:b.left+b.width/2,parentCenter:p.left+p.width/2,src:n.currentSrc,natural:n.naturalWidth+'x'+n.naturalHeight}})
   assert.equal(image.natural,'860x2236');assert.match(image.src,/point01-recording\.webp\?v=16f/);assert.ok(image.width<=860.5,JSON.stringify(image));assert.ok(Math.abs(image.width/image.height-860/2236)<.02);assert.ok(Math.abs(image.center-image.parentCenter)<1)
   await page.locator('.advantages-illustration img').scrollIntoViewIfNeeded()
   const art=await page.locator('.advantages-illustration img').evaluate(async n=>{await n.decode();return {width:n.getBoundingClientRect().width,url:n.currentSrc,alt:n.alt}})
   assert.match(art.url,new RegExp(width<=700?'advantages-mobile':'advantages-desktop'))
   if(width<=700)assert.ok(17.5*art.width/360>=13,JSON.stringify(art))
   for(const term of ['녹음 방식','구간별 녹음 + 1:1 디렉팅','음정·박자 수작업 보정','상담 시 안내드린 금액 그대로'])assert.ok(art.alt.includes(term),term)
   await page.locator('#arcKey .detail-poster-image').scrollIntoViewIfNeeded();assert.equal(await page.locator('#arcKey .detail-poster-image').evaluate(async n=>{await n.decode();return n.naturalWidth===860&&n.naturalHeight===1840&&/point02-key\.webp\?v=16f/.test(n.currentSrc)}),true)
   await context.close()
  }
 }finally{await browser?.close();server.kill()}
})
await test('16d: illustrations use centered labels, smooth joined gradients and readable uniform typography',()=>{
 const root=new URL('../assets/img/studio-illustrations/',import.meta.url),join=readFileSync(new URL('recording-join.svg',root),'utf8')
 assert.match(join,/<text x="92" y="89" text-anchor="middle"/);assert.match(join,/<text x="268" y="89" text-anchor="middle"/);assert.match(join,/fill="url\(#joined-tone\)"/);assert.match(join,/fill="url\(#joined-wave\)"/)
 for(const name of ['advantages-desktop.svg','advantages-mobile.svg']){
  const svg=readFileSync(new URL(name,root),'utf8');assert.match(svg,/Pretendard Variable/);assert.equal((svg.match(/stroke-width="1.3"/g)||[]).length,3);assert.equal((svg.match(/font-size="17.5"/g)||[]).length,8);assert.match(svg,/linearGradient id="paper"/)
 }
 const config=JSON.parse(readFileSync(new URL('../vercel.json',import.meta.url),'utf8'));assert.ok(config.redirects.some(r=>r.source==='/detail/solo-film/:path*'&&r.destination==='/detail/duet-film'&&r.permanent))
})
