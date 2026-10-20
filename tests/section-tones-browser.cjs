const assert=require('node:assert/strict')
const fs=require('node:fs')
const path=require('node:path')
const os=require('node:os')
const {execFileSync}=require('node:child_process')
const root=path.resolve(__dirname,'..')
const runtime=path.join(os.homedir(),'.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright-core')
const {chromium}=require(runtime)
const out=path.join(root,'output/section-tones-20261021')
const url=process.env.WISTIA_SECTION_PREVIEW||'http://127.0.0.1:4201'
const original=execFileSync('git',['-c','safe.directory='+root.replaceAll('\\','/'),'show','HEAD:js/detail-pc-background.js'],{cwd:root,encoding:'utf8'})
const errors=[],results=[]
const measure=page=>page.locator('.mobile-ar-solo').evaluate(scope=>({
 overflow:document.documentElement.scrollWidth-innerWidth,
 images:[...scope.querySelectorAll('img')].filter(img=>img.getBoundingClientRect().width>0).map(img=>{
  const r=img.getBoundingClientRect()
  return {src:img.getAttribute('src'),width:r.width,height:r.height,top:r.top+scrollY}
 }),
 sections:[...scope.querySelectorAll('[data-wistia-section]')].map(s=>({
  number:s.dataset.wistiaSection,surface:getComputedStyle(s).backgroundColor,
  badges:s.querySelectorAll(':scope>.wistia-section-number').length,
  pointer:getComputedStyle(s.querySelector('.wistia-section-number')).pointerEvents
 }))
}))
async function loadAll(page){
 for(const img of await page.locator('.mobile-ar-solo img').all()){
  if(await img.isVisible())await img.scrollIntoViewIfNeeded()
 }
 await page.waitForTimeout(150)
 await page.evaluate(()=>scrollTo(0,0))
}
;(async()=>{
 fs.mkdirSync(out,{recursive:true})
 const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'})
 try{
  for(const route of ['/','/detail/duo'])for(const width of [320,360,375,390,768,1280]){
   const page=await browser.newPage({viewport:{width,height:844},deviceScaleFactor:1,reducedMotion:'reduce'})
   page.on('pageerror',e=>errors.push({route,width,message:e.message}))
   const matcher='**/js/detail-pc-background.js?*'
   await page.route(matcher,r=>r.fulfill({status:200,contentType:'text/javascript',body:original}))
   await page.goto(url+route,{waitUntil:'networkidle'})
   await loadAll(page)
   const before=await measure(page)
   const name=(route==='/'?'home':'duo')+'-'+width
   if(route==='/'&&[390,1280].includes(width))await page.screenshot({path:path.join(out,name+'-before.jpg'),fullPage:true,type:'jpeg',quality:72})
   await page.unroute(matcher)
   await page.reload({waitUntil:'networkidle'})
   await loadAll(page)
   const after=await measure(page)
   assert.equal(after.overflow,0,name+' overflow')
   assert.equal(after.sections.length,15,name+' section count')
   assert.equal(new Set(after.sections.map(s=>s.surface)).size,15,name+' distinct colors')
   after.sections.forEach((s,i)=>{
    assert.equal(s.number,String(i+1).padStart(2,'0'))
    assert.equal(s.badges,1)
    assert.equal(s.pointer,'none')
   })
   assert.equal(after.images.length,before.images.length,name+' image preservation')
   after.images.forEach((img,i)=>{
    assert.equal(img.src,before.images[i].src,name+' original image URL')
    for(const field of ['width','height','top'])assert.ok(Math.abs(img[field]-before.images[i][field])<1,name+' image '+i+' '+field+' '+before.images[i][field]+' -> '+img[field])
   })
   await page.evaluate(()=>window.WistiaPCBackground.mount(document.querySelector('#app')))
   assert.equal(await page.locator('.wistia-section-number').count(),15,name+' idempotence')
   if(route==='/'&&[390,1280].includes(width)){
    await page.screenshot({path:path.join(out,name+'-after.jpg'),fullPage:true,type:'jpeg',quality:72})
    const review=page.locator('.rv5-thumb').first()
    await review.click()
    assert.equal(await page.locator('.solo-review-dialog').evaluate(e=>e.open),true)
    await page.keyboard.press('Escape')
    const faq=page.locator('#arcFaq details').nth(1)
    await faq.locator('summary').click()
    assert.ok(await faq.getAttribute('open')!==null,name+' FAQ')
    await page.locator('[data-solo-ratio="70"]').click()
    await page.waitForTimeout(500)
    assert.equal(await page.locator('[data-solo-ratio="70"]').getAttribute('aria-pressed'),'true')
    await page.locator('.solo-p4-stop').click()
    assert.ok(await page.locator('[data-solo-audio]').evaluate(e=>e.paused))
    await page.locator('.mas-selection [data-detail-person="duo"]').click()
    await page.waitForURL('**/detail/duo')
    assert.equal(await page.locator('.wistia-section-number').count(),15)
    await page.locator('.mas-selection [data-detail-person="solo"]').click()
    await page.waitForURL('**/detail/solo')
    assert.equal(await page.locator('.wistia-section-number').count(),15)
    const inquiry=page.locator('.solo-footer-inquiry')
    assert.equal(await inquiry.getAttribute('href'),'/event/solo')
   }
   results.push({route,width,overflow:after.overflow,sections:after.sections.length,originalImageGeometryPreserved:true})
   console.log('PASS '+name)
   await page.close()
  }
  assert.deepEqual(errors,[],'browser runtime errors')
  const page=await browser.newPage({viewport:{width:390,height:844}})
  await page.goto(url+'/event/solo',{waitUntil:'networkidle'})
  assert.equal(await page.locator('.wistia-section-number').count(),0,'form is unaffected, never submitted')
  await page.locator('[data-wf-prev]').click()
  await page.waitForURL('**/detail/solo')
  // This local HTML has a pre-existing unfinished ivory mockup, kept untouched
  const separateIvoryPreview=await page.locator('html').evaluate(e=>e.classList.contains('ivory-preview'))
  assert.equal(await page.locator('.wistia-section-number').count(),separateIvoryPreview?0:15,'existing separate ivory preview remains protected')
  await page.close()
  fs.writeFileSync(path.join(out,'checks.json'),JSON.stringify({results,errors,formSubmitted:false,separateIvoryPreviewPreserved:separateIvoryPreview},null,2))
  console.log('PASS '+results.length+' responsive comparisons, interactive controls and untouched inquiry form')
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exitCode=1})
