import assert from 'node:assert/strict'
import {createRequire} from 'node:module'
import {existsSync,mkdirSync,writeFileSync} from 'node:fs'
const {chromium,webkit,devices}=createRequire(import.meta.url)('playwright'),base=process.env.WISTIA_PREVIEW_URL||'http://127.0.0.1:4175'
const address='경기도 부천시 석천로170번길 19, 2층',results=[]
mkdirSync('work/11b-location',{recursive:true})
for(const engine of [chromium,webkit]){
 const name=engine.name(),executablePath=name==='chromium'?(process.env.WISTIA_BROWSER_EXECUTABLE||engine.executablePath()):engine.executablePath()
 if(!existsSync(executablePath)){console.log(`SKIP ${name}: browser executable not installed`);continue}
 const browser=await engine.launch({executablePath,...(name==='chromium'?{args:['--no-sandbox']}:{})})
 try{
  for(const width of [360,390,1280]){
   const context=await browser.newContext({...(name==='webkit'?devices['iPhone 13']:{}),viewport:{width,height:844},hasTouch:true,isMobile:width<600,userAgent:'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 Mobile/15E148 KAKAOTALK 10.8.0'}),page=await context.newPage()
   if(name==='chromium')await context.grantPermissions(['clipboard-read','clipboard-write'],{origin:base})
   await page.route('https://**/*',r=>r.abort())
   await page.goto(base+'/info/location',{waitUntil:'domcontentloaded'});await page.locator('.location-address-copy').waitFor();await page.evaluate(()=>document.fonts.ready)
   const measurements=await page.evaluate(()=>{
    const title=document.querySelector('.location-address-row .studio-address'),row=title.parentElement,range=document.createRange();range.selectNodeContents(title)
    const boxes=[...range.getClientRects()].map(r=>({top:r.top,left:r.left,right:r.right,height:r.height})),r=title.getBoundingClientRect(),card=row.parentElement.getBoundingClientRect(),button=row.querySelector('button').getBoundingClientRect()
    const map=[...document.querySelectorAll('.info-page-location .wistia-location-links a')].map(n=>{const r=n.getBoundingClientRect();return {top:r.top,height:r.height}})
    const icons=[...document.querySelectorAll('.info-page-intro .svg-title-icon>svg,.location-line-icon>svg,.wistia-location-details h3>svg')].map(n=>{const r=n.getBoundingClientRect();return {width:r.width,height:r.height,stroke:getComputedStyle(n).strokeWidth}})
    const headings=[...document.querySelectorAll('.info-page-location :is(h1,h3)')].map(n=>{const text=n.querySelector('.svg-section-text')||n.querySelector('span'),range=document.createRange();range.selectNodeContents(text);return {text:text.textContent,lines:range.getClientRects().length}})
    const heading=document.querySelector('#infoPageTitle .svg-section-text').getBoundingClientRect()
    return {descriptionAlign:getComputedStyle(document.querySelector('.info-page-intro>p')).textAlign,headingCenter:heading.x+heading.width/2-innerWidth/2,width:innerWidth,scrollWidth:document.documentElement.scrollWidth,title:{text:title.textContent,boxes,width:r.width,fontSize:getComputedStyle(title).fontSize,lineHeight:getComputedStyle(title).lineHeight},card:{left:card.left,right:card.right,height:card.height},button:{left:button.left,right:button.right},map,icons,headings,background:getComputedStyle(row.parentElement).backgroundColor}
   })
   assert.equal(measurements.descriptionAlign,'center');assert.ok(parseFloat(measurements.title.fontSize)>=14);assert.ok(Math.abs(measurements.headingCenter)<=1,'page heading centered');assert.equal(measurements.title.text,address);assert.equal(measurements.title.boxes.length,1,'address is one line')
   assert.ok(measurements.title.boxes[0].left>=measurements.card.left);assert.ok(measurements.title.boxes[0].right<=measurements.button.left-3,'address fits beside copy button')
   assert.ok(measurements.button.right<=measurements.card.right);assert.ok(measurements.scrollWidth<=width,'no horizontal scroll')
   assert.equal(measurements.map[0].height,measurements.map[1].height);assert.equal(measurements.map[0].top,measurements.map[1].top)
   assert.equal(measurements.background,'rgb(250, 246, 238)')
   for(const icon of measurements.icons)assert.deepEqual(icon,{width:28,height:28,stroke:'1.5px'})
   for(const title of measurements.headings)assert.equal(title.lines,1,`${title.text} is one line`)
   const copy=page.locator('[data-copy-address]'),status=page.locator('[data-address-copy-status]')
   async function tap(){const b=await copy.boundingBox();await page.touchscreen.tap(b.x+b.width/2,b.y+b.height/2)}
   if(name==='chromium'){
    await page.evaluate(()=>{window.nativeAddressRead=navigator.clipboard.readText.bind(navigator.clipboard);window.nativeAddressWrite=navigator.clipboard.writeText.bind(navigator.clipboard)})
    await page.evaluate(()=>window.nativeAddressWrite('주소 복사 테스트'));await tap();assert.equal(await page.evaluate(()=>window.nativeAddressRead()),address,'native clipboard copy')
    await page.evaluate(async()=>{await window.nativeAddressWrite('대체 복사 테스트');navigator.clipboard.writeText=async()=>{throw Error('clipboard denied')}});await tap();assert.equal(await page.evaluate(()=>window.nativeAddressRead()),address,'native execCommand fallback copy')
   }
   await page.evaluate(()=>{window.copiedAddress='';navigator.clipboard.writeText=async s=>window.copiedAddress=s})
   const before=await page.evaluate(()=>scrollY);await tap();await status.getByText('복사됐어요',{exact:true}).waitFor();assert.equal(await page.evaluate(()=>window.copiedAddress),address);assert.equal(await page.locator('.wistia-location-address').evaluate(n=>n.getBoundingClientRect().height),measurements.card.height,'feedback does not change card height');assert.ok(Math.abs(await page.evaluate(()=>scrollY)-before)<=1)
   await page.evaluate(()=>{window.copyAttempts=[];navigator.clipboard.writeText=async()=>{throw Error('in-app denied')};document.execCommand=command=>{window.copyAttempts.push({command,value:document.activeElement.value,start:document.activeElement.selectionStart,end:document.activeElement.selectionEnd});return true}})
   await tap();assert.deepEqual(await page.evaluate(()=>window.copyAttempts),[{command:'copy',value:address,start:0,end:address.length}]);assert.equal(await status.innerText(),'복사됐어요');assert.ok(Math.abs(await page.evaluate(()=>scrollY)-before)<=1)
   await page.waitForFunction(()=>document.querySelector('[data-address-copy-status]').textContent==='')
   await page.evaluate(()=>{document.execCommand=()=>false});await tap();await status.getByText('주소를 길게 눌러 복사해 주세요',{exact:true}).waitFor();assert.equal(await page.locator('textarea[aria-label="복사할 주소"]').count(),0)
   await page.evaluate(()=>document.querySelector('[data-address-copy-status]').textContent='')
   await page.locator('.wistia-location-details').scrollIntoViewIfNeeded();await page.waitForFunction(()=>[...document.querySelectorAll('.wistia-location-details article')].every(n=>Number(getComputedStyle(n).opacity)===1));await page.evaluate(()=>scrollTo(0,0));
   await page.screenshot({path:`work/11b-location/${name}-${width}.png`,fullPage:true})
   results.push({engine:name,...measurements,nativeClipboard:name==='chromium',nativeFallback:name==='chromium',clipboard:true,fallback:true,failureInstruction:true,scrollDelta:await page.evaluate(()=>scrollY)-before})
   console.log(`${name} ${width}px: address one line, uniform SVGs, equal map buttons, clipboard/fallback/notice and stationary touch passed`)
   await page.unrouteAll({behavior:'wait'});await context.close()
  }
 }finally{await browser.close()}
}
writeFileSync('work/11b-location/measurements.json',JSON.stringify(results,null,2))
