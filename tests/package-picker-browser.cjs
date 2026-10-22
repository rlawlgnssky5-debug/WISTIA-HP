const {chromium}=require('C:/Users/User/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright')
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict')
const out=path.resolve(__dirname,'../output/type-picker-20261022'),base='http://127.0.0.1:4212'
;(async()=>{
fs.mkdirSync(out,{recursive:true})
const browser=await chromium.launch({executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',headless:true})
try{
const context=await browser.newContext({reducedMotion:'reduce'}),errors=[],results=[]
await context.route(/facebook\.com|connect\.facebook|google-analytics|googletagmanager/,r=>r.abort())
const page=await context.newPage();page.on('pageerror',e=>errors.push(e.message))
const cleanCapture={style:'@layer wistia-packages{#floatingKakaoChat,.solo-footer-inquiry{visibility:hidden!important}}'}
for(const width of [360,375,390,780,1280]){
await page.setViewportSize({width,height:900})
await page.goto(base+'/?wistia_vid=qa-package-picker',{waitUntil:'networkidle'});await page.evaluate(()=>document.fonts.ready)
const flow=await page.evaluate(()=>{const selectors=['.package-intro','.arc-reviews','#arcRecording','#arcKey','#arcTuning','#soloPoint04','[data-solo-map]','#packageSelection'];return {positions:selectors.map(s=>document.querySelector(s).getBoundingClientRect().top+scrollY),counts:['#arcTuning','#wistiaBeforeAfter','#packageSelection'].map(s=>document.querySelectorAll(s).length),numbers:[...document.querySelectorAll('.wistia-section-number')].map(e=>e.textContent)}})
assert.ok(flow.positions.every((v,i,a)=>i===0||v>a[i-1]),'original POINT order → map → type')
assert.deepEqual(flow.counts,[1,1,1],'no duplicate players or selection IDs')
assert.deepEqual(flow.numbers,flow.numbers.map((_,i)=>String(i+1).padStart(2,'0')),'section numbers follow visible order')
for(const key of ['A','B','C']){
await page.locator('.package-card').filter({has:page.locator('input[value="'+key+'"]')}).click()
const panel=page.locator('[data-package-selection-details]');assert.equal(await panel.getAttribute('data-package-key'),key)
assert.equal(await panel.locator('h3').textContent(),await page.evaluate(k=>WistiaPackages.packages[k].title,key))
assert.ok((await panel.locator('.package-selected-meta').textContent()).includes(key==='C'?'2시간':'1시간'))
assert.equal(await page.locator('.package-card.is-selected').count(),1)
assert.equal(new URL(page.url()).searchParams.get('wistia_vid'),'qa-package-picker')
const data=await page.evaluate(()=>{const cards=[...document.querySelectorAll('.package-card')].map(e=>{let r=e.getBoundingClientRect();return {x:r.x,y:r.y,width:r.width}});return {overflow:Math.max(document.documentElement.scrollWidth,document.body.scrollWidth)-innerWidth,cards,clipped:[...document.querySelectorAll('.package-card-price,.package-card-benefit,.package-card-subtitle')].filter(e=>e.scrollWidth>e.clientWidth+1).map(e=>e.textContent)}})
assert.equal(data.overflow,0);assert.equal(new Set(data.cards.map(e=>e.y)).size,1);assert.deepEqual(data.clipped,[])
await page.locator('.package-picker').screenshot({path:path.join(out,'picker-'+key+'-'+width+'.png'),...cleanCapture})
if(width===780){
await page.locator('#packageSelection').screenshot({path:path.join(out,'selection-'+key+'-780.png'),...cleanCapture})
await page.locator('#packageSelection').scrollIntoViewIfNeeded()
const clip=await page.evaluate(()=>{const section=document.querySelector('#packageSelection').getBoundingClientRect(),panel=document.querySelector('[data-package-selection-details]').getBoundingClientRect();return {x:section.x+scrollX,y:section.y+scrollY,width:section.width,height:panel.bottom-section.top+20}})
await page.screenshot({path:path.join(out,'preview-'+key+'-780.png'),fullPage:true,clip,...cleanCapture})
}
results.push({width,key,...data})
}
console.log(width+' A/B/C selection and layout passed')
}
await page.locator('[name="detailPackage"][value="A"]').focus();await page.keyboard.press('ArrowRight')
assert.equal(await page.locator('[data-package-selection-details]').getAttribute('data-package-key'),'B')
await page.locator('.package-card').filter({has:page.locator('input[value="C"]')}).click()
await page.locator('[data-package-inquiry]').click();await page.waitForFunction(()=>document.querySelector('form [name="package"]:checked')?.value==='C')
assert.equal(await page.locator('form [data-package-selection-details]').getAttribute('data-package-key'),'C')
await page.locator('form .package-card').filter({has:page.locator('input[value="B"]')}).click()
assert.equal(await page.locator('form [data-package-selection-details]').getAttribute('data-package-key'),'B')
assert.equal(await page.evaluate(()=>WistiaWizard.quote(document.querySelector('form')).total),130000)
await page.reload();await page.waitForFunction(()=>document.querySelector('form [data-package-selection-details]')?.dataset.packageKey==='B')
assert.deepEqual(errors,[]);fs.writeFileSync(path.join(out,'results.json'),JSON.stringify({results,errors,checks:['15 A/B/C and viewport combinations','same-row 3-column selection','single changing detail panel','780px full selection screenshots','price and visitor query preserved','inquiry selection and reload restoration','no submission or Kakao sending']},null,2))
console.log('PASS inquiry transition, panel switching, draft restoration, no submission')
}finally{await browser.close()}
})().catch(e=>{console.error(e);process.exitCode=1})
