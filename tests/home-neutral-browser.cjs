const {chromium}=require('C:/Users/User/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright')
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict')
const phase=process.argv.includes('--before')?'before':'after'
const out=path.resolve(__dirname,'../output/home-neutral-20261022')
const selectors=['main','#siteHeader','.package-section','.package-card','.package-card-price','.package-information','.package-brand-summary','.package-notices','.rv5','.solo-map-links a','.package-inquiry-link']
async function snapshot(page){return page.evaluate(selectors=>({text:document.querySelector('main').innerText.replace(/\d+\s*\/\s*5/g,'gallery'),overflow:Math.max(document.body.scrollWidth,document.documentElement.scrollWidth)-innerWidth,media:[...document.querySelectorAll('main img')].map(e=>({src:e.getAttribute('src'),filter:getComputedStyle(e).filter})),elements:selectors.flatMap(s=>[...document.querySelectorAll(s)].map(e=>{const r=e.getBoundingClientRect(),c=getComputedStyle(e);return {selector:s,x:r.x,width:r.width,height:r.height,fontSize:c.fontSize,color:c.color,background:c.backgroundColor,border:c.borderColor}})),pink:[...document.querySelectorAll('body *')].filter(e=>{const c=getComputedStyle(e),r=e.getBoundingClientRect();return r.width&&r.height&&c.display!=='none'&&c.visibility!=='hidden'&&(c.color.includes('166, 90, 108')||c.backgroundColor.includes('251, 241, 241')||c.backgroundColor.includes('166, 90, 108')||c.color.includes('90, 58, 64'))}).map(e=>({tag:e.tagName,id:e.id,cls:e.className,text:e.textContent.trim().slice(0,35),color:getComputedStyle(e).color,bg:getComputedStyle(e).backgroundColor})).slice(0,200)}),selectors)}
;(async()=>{
fs.mkdirSync(out,{recursive:true})
const browser=await chromium.launch({executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',headless:true})
const context=await browser.newContext({reducedMotion:'reduce'})
await context.route(/facebook\.com|connect\.facebook|google-analytics|googletagmanager/,r=>r.abort())
// Reproduce the pre-theme homepage without touching the local working tree
if(phase==='before')await context.route('**/js/app.js?*',r=>r.fulfill({contentType:'text/javascript',body:fs.readFileSync(path.resolve(__dirname,'../js/app.js'),'utf8').replace(' document.body.classList.toggle("home-neutral-tone",rootSolo);','')}))
const cleanCapture={style:'.solo-footer-inquiry,#floatingKakaoChat{visibility:hidden!important}'}
const page=await context.newPage(),results=[],errors=[];page.on('pageerror',e=>errors.push(e.message))
for(const width of [390,1280]){
await page.setViewportSize({width,height:width===1280?900:844})
await page.goto('http://127.0.0.1:4212/',{waitUntil:'networkidle'})
await page.evaluate(()=>document.fonts.ready)
await page.evaluate(async()=>{for(let y=0;y<document.body.scrollHeight;y+=1000){scrollTo(0,y);await new Promise(r=>setTimeout(r,30))}scrollTo(0,0);document.querySelectorAll('audio,video').forEach(e=>e.pause())})
await page.waitForTimeout(700)
const data=await snapshot(page);assert.equal(data.overflow,0)
await page.screenshot({path:path.join(out,phase+'-home-'+width+'.jpg'),fullPage:true,type:'jpeg',quality:75})
await page.locator('.package-section').screenshot({path:path.join(out,phase+'-packages-'+width+'.png'),...cleanCapture})
for(const key of ['A','B','C']){await page.locator('.package-card').filter({has:page.locator('input[value="'+key+'"]')}).click();await page.locator('.package-cards').screenshot({path:path.join(out,phase+'-cards-'+key+'-'+width+'.png'),...cleanCapture});if(phase==='after'){const ratios=await page.evaluate(()=>{const rgb=c=>c.match(/[\d.]+/g).slice(0,3).map(Number),lum=c=>rgb(c).map(v=>v/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4).reduce((s,v,i)=>s+v*[.2126,.7152,.0722][i],0);return [...document.querySelectorAll('.package-card .package-card-name,.package-card .package-card-price,.package-card-features>span,.package-card-saving b,.package-card-saving small')].map(e=>{let b=e;while(b&&getComputedStyle(b).backgroundColor==='rgba(0, 0, 0, 0)')b=b.parentElement;const a=lum(getComputedStyle(e).color),z=lum(getComputedStyle(b).backgroundColor);return {text:e.textContent,ratio:(Math.max(a,z)+.05)/(Math.min(a,z)+.05)}})});for(const r of ratios)assert.ok(r.ratio>=4.5,'low contrast '+key+' '+r.text+' '+r.ratio)}}
results.push({width,route:'/',data})
for(const route of ['/detail/solo','/contact','/events']){
await page.evaluate(route=>{history.pushState({},'',route);dispatchEvent(new PopStateEvent('popstate'))},route)
await page.waitForTimeout(500);const data=await snapshot(page);assert.equal(data.overflow,0);results.push({width,route,data})
}
await page.evaluate(()=>{history.pushState({},'','/');dispatchEvent(new PopStateEvent('popstate'))});await page.waitForTimeout(500)
assert.equal((await page.locator('.package-card').count()),3)
await page.locator('#menuToggle').click();await page.screenshot({path:path.join(out,phase+'-menu-'+width+'.png')})
console.log(phase+' '+width+' captured')
}
if(phase==='after')for(const width of [360,375]){await page.setViewportSize({width,height:844});await page.goto('http://127.0.0.1:4212/?package=B',{waitUntil:'networkidle'});const d=await snapshot(page);assert.equal(d.overflow,0);await page.locator('.package-section').screenshot({path:path.join(out,'after-packages-'+width+'.png'),...cleanCapture});console.log('after '+width+' no overflow')}
fs.writeFileSync(path.join(out,phase+'.json'),JSON.stringify({results,errors},null,2));await browser.close();assert.deepEqual(errors,[])
if(phase==='after'){
const before=JSON.parse(fs.readFileSync(path.join(out,'before.json'),'utf8'))
for(const current of results){const old=before.results.find(e=>e.width===current.width&&e.route===current.route);assert.equal(current.data.text,old.data.text,'copy changed '+current.route);assert.deepEqual(current.data.media,old.data.media,'media changed '+current.route);for(let i=0;i<old.data.elements.length;i++){const a=current.data.elements[i],b=old.data.elements[i];for(const key of ['selector','x','width','height','fontSize'])assert.equal(a[key],b[key],key+' changed '+current.route+' '+a.selector);if(current.route!=='/')assert.deepEqual(a,b,'other page palette changed '+current.route)}}
console.log('PASS copy / images / fonts / geometry unchanged, other pages unchanged, SPA transitions checked')
}
})().catch(e=>{console.error(e);process.exitCode=1})
