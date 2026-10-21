import {test} from 'node:test'
import assert from 'node:assert/strict'
import {createRequire} from 'node:module'
import {existsSync,readFileSync} from 'node:fs'
import {spawn} from 'node:child_process'
import {createServer} from 'node:net'
const require=createRequire(import.meta.url)
let playwright,executable,skip=false
try{playwright=require('playwright');executable=process.env.WISTIA_BROWSER_EXECUTABLE||['/usr/bin/chromium',playwright.chromium.executablePath()].find(existsSync);if(!executable)skip='Chromium not installed'}catch{skip='Playwright not installed'}
await test('16c: actual body font stays readable, diagram retains intrinsic ratio and H2 typography is uniform',{skip,timeout:120000},async()=>{
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

   for(const path of ['/info/location']){
    await page.goto(`http://127.0.0.1:${port}`+path,{waitUntil:'domcontentloaded'});await page.locator('#app h1').first().waitFor();await page.evaluate(()=>document.fonts.ready)
    if(bodyFont)assert.equal(await page.evaluate(()=>document.fonts.check('400 13px \"Pretendard Variable\"')),true)
    const elements=await page.locator(path==='/info/about'?'.about-fixed-lines':'.studio-address').evaluateAll(ns=>ns.map(n=>{
     const walker=document.createTreeWalker(n,NodeFilter.SHOW_TEXT),rs=[]
     while(walker.nextNode()){const range=document.createRange();range.selectNodeContents(walker.currentNode);rs.push(...range.getClientRects())}
     const b=n.getBoundingClientRect();return {text:n.textContent,size:parseFloat(getComputedStyle(n).fontSize),rows:new Set(rs.map(r=>Math.round(r.top))).size,expected:n.querySelectorAll('br').length+1,inside:rs.every(r=>r.left>=b.left-1&&r.right<=b.right+1&&r.right<=innerWidth),family:getComputedStyle(n).fontFamily}
    }))
    assert.ok(elements.every(n=>n.size>=13&&n.rows===n.expected&&n.inside),path+' '+width+' '+JSON.stringify(elements));if(path==='/info/about')assert.equal(new Set(elements.map(n=>n.size)).size,1)
   }
   for(const product of ['solo','duo']){
    await page.goto(`http://127.0.0.1:${port}/detail/${product}`,{waitUntil:'domcontentloaded'});await page.locator('.ar-commerce-detail h2').first().waitFor();await page.evaluate(()=>document.fonts.ready)
    const titles=await page.locator('.ar-commerce-detail h2').evaluateAll(ns=>ns.map(n=>{
     const content=n.querySelector('.svg-section-text')||n,walker=document.createTreeWalker(content,NodeFilter.SHOW_TEXT),rs=[]
     while(walker.nextNode()){if(!walker.currentNode.textContent.trim())continue;const range=document.createRange();range.selectNodeContents(walker.currentNode);rs.push(...range.getClientRects())}
     const s=getComputedStyle(n),b=content.getBoundingClientRect();return {text:n.textContent,size:s.fontSize,weight:s.fontWeight,line:s.lineHeight,rows:new Set(rs.map(r=>Math.round(r.top))).size,expected:['wistiaArTitle','arExpertStoryTitle'].includes(n.id)?2:content.querySelectorAll('br').length+1,inside:rs.every(r=>r.left>=b.left-1&&r.right<=b.right+1&&r.right<=innerWidth)}
    }))
    assert.equal(new Set(titles.map(n=>n.size)).size,1,JSON.stringify(titles));assert.ok(titles.every(n=>n.weight==='600'&&n.inside&&n.rows===n.expected),product+' '+width+' '+JSON.stringify(titles));assert.equal(new Set(titles.map(n=>n.line)).size,1)
    if(product!=='duet-film'){
     const poster=page.locator('#arcRecording .detail-poster-image');await poster.scrollIntoViewIfNeeded();await poster.evaluate(n=>n.decode())
     const m=await poster.evaluate(n=>{const s=getComputedStyle(n),b=n.getBoundingClientRect();return {width:b.width,height:b.height,fit:s.objectFit,ratio:n.naturalWidth/n.naturalHeight,display:s.display}})
     assert.ok(Math.abs(m.width/m.height-860/2236)<.02,JSON.stringify(m));assert.notEqual(m.fit,'cover');assert.equal(m.display,'block');assert.ok(m.width<=860.5,JSON.stringify(m))
    }
   }
   await context.close()
  }
 }finally{await browser?.close();server.kill()}
})
