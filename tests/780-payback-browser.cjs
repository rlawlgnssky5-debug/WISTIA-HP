const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict')
const {chromium}=require('C:/Users/User/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright-core')
const root=path.resolve(__dirname,'..'),out=path.join(root,'output/780-payback-20261021')
const phase=process.env.WISTIA_QA_PHASE||'before',base=process.env.WISTIA_QA_URL||'http://127.0.0.1:4203'
const routes=['/','/detail/solo','/detail/duo','/contact','/info/faq','/event/solo','/event/duo','/events','/info/about']
const slug=r=>r==='/'?'home':r.slice(1).replaceAll('/','-')
async function settle(page){
 await page.waitForSelector('#app>:first-child')
 await page.evaluate(async()=>{document.querySelectorAll('img').forEach(i=>i.loading='eager');await Promise.race([document.fonts.ready,new Promise(r=>setTimeout(r,4000))]);await Promise.all([...document.images].map(i=>Promise.race([i.decode().catch(()=>{}),new Promise(r=>setTimeout(r,5000))])))})
 await page.waitForTimeout(400)
 await page.evaluate(()=>scrollTo(0,0))
}
async function measure(page){return page.evaluate(()=>{
 const rect=e=>{if(!e)return null;const r=e.getBoundingClientRect();return {x:r.x,y:r.y+scrollY,width:r.width,height:r.height}}
 const header=document.querySelector('#siteHeader'),inner=header?.querySelector('.header-inner'),main=document.querySelector('main#app'),detail=document.querySelector('.mobile-ar-solo')
 const winning=[]
 function rules(list,file){for(const rule of list){if(rule.cssRules){if(!rule.conditionText||!rule.type||rule.type!==CSSRule.MEDIA_RULE||matchMedia(rule.conditionText).matches)rules(rule.cssRules,file)}else if(rule.selectorText&&rule.style){try{if((rule.style.background||rule.style.backgroundColor)&&document.body.matches(rule.selectorText))winning.push({file,selector:rule.selectorText,background:rule.style.background||rule.style.backgroundColor,important:rule.style.getPropertyPriority('background')||rule.style.getPropertyPriority('background-color')})}catch{}}}}
 for(const sheet of document.styleSheets){try{rules(sheet.cssRules,sheet.href?.split('/').pop()||'inline')}catch{}}
 return {path:location.pathname,bodyBackground:getComputedStyle(document.body).backgroundColor,main:rect(main),header:rect(header),inner:rect(inner),headerPadding:inner?{left:getComputedStyle(inner).paddingLeft,right:getComputedStyle(inner).paddingRight}:null,overflow:document.documentElement.scrollWidth-innerWidth,detail:rect(detail),images:detail?[...detail.querySelectorAll('img')].filter(i=>i.getBoundingClientRect().width>0).map(i=>({src:i.getAttribute('src'),...rect(i),loaded:i.complete&&i.naturalWidth>0})):[],seo:[...document.querySelectorAll('.solo-seo,[data-seo-fallback]')].map(e=>({display:getComputedStyle(e).display,clipped:getComputedStyle(e).clip==='rect(0px, 0px, 0px, 0px)',visible:!!(e.offsetWidth||e.offsetHeight||e.getClientRects().length)})),backgroundRules:winning,bodyText:document.body.innerText,events:window.WistiaQuote?.events?.()||[]}
 })}
;(async()=>{
 fs.mkdirSync(path.join(out,phase),{recursive:true})
 const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'})
 const results=[],errors=[]
 try{
 for(const width of [1280,390])for(const route of routes)for(const mode of ['direct','spa']){
  const page=await browser.newPage({viewport:{width,height:844},deviceScaleFactor:1,reducedMotion:'reduce'})
  page.on('pageerror',e=>errors.push({width,route,mode,message:e.message}))
  await page.route('**/*',r=>{const u=new URL(r.request().url());if(/facebook|google-analytics|googletagmanager|doubleclick|analytics/.test(u.hostname)||(!['GET','HEAD'].includes(r.request().method())))return r.abort();return r.continue()})
  await page.goto(base+(mode==='spa'?'/info/about':route),{waitUntil:'domcontentloaded'})
  await settle(page)
  if(mode==='spa'){
   await page.evaluate(r=>{history.pushState({},'',r);dispatchEvent(new PopStateEvent('popstate'))},route)
   await settle(page)
  }
  const measurement=await measure(page),name=slug(route)+'-'+width+'-'+mode
  await page.screenshot({path:path.join(out,phase,name+'.jpg'),fullPage:true,type:'jpeg',quality:65,animations:'disabled'})
  if(['/', '/detail/solo','/detail/duo'].includes(route)){
   const disclosure=page.locator('.mas-event-disclosure')
   if(await disclosure.count()){
    await disclosure.evaluate(e=>e.open=true)
    await page.waitForTimeout(100)
    measurement.disclosureText=await disclosure.innerText()
    await page.locator('.mas-event-disclosure').screenshot({path:path.join(out,phase,name+'-payback.jpg'),type:'jpeg',quality:85})
    const price=disclosure.locator('.mas-event-note').filter({hasText:'혜택가'}).first()
    if(await price.count())await price.screenshot({path:path.join(out,phase,name+'-price.jpg'),type:'jpeg',quality:85})
   }
  }
  const box=page.locator('[data-benefit-type="payback"]')
  if(await box.count()&&await box.first().isVisible())await box.first().screenshot({path:path.join(out,phase,name+'-checks.jpg'),type:'jpeg',quality:85})
  results.push({width,route,mode,...measurement})
  console.log(phase,name,'bg='+measurement.bodyBackground,'main='+measurement.main?.width,'padding='+JSON.stringify(measurement.headerPadding),'overflow='+measurement.overflow,'images='+measurement.images.length)
  await page.close()
 }
 fs.writeFileSync(path.join(out,phase+'-measurements.json'),JSON.stringify({base,phase,results,errors},null,2))
 if(phase!=='before'){
  for(const r of results){
   assert.equal(r.overflow,0,r.route+' overflow')
   assert.ok(r.seo.every(s=>!s.visible||s.clipped),r.route+' hidden SEO')
   if(r.width===1280){assert.equal(r.bodyBackground,'rgb(255, 255, 255)',r.route+' white outer');assert.equal(r.main.width,780);assert.equal(r.main.x,250);assert.equal(r.headerPadding.left,'22px');assert.equal(r.headerPadding.right,'22px')}
   assert.equal(r.events.length,2);assert.equal(r.events.reduce((sum,e)=>sum+e.discount,0),60000)
   if(r.images.length){assert.ok(r.images.every(i=>i.loaded),r.route+' loaded images');assert.match(r.disclosureText,new RegExp(r.route==='/detail/duo'?'100,000원':'60,000원'))}
  }
  for(const direct of results.filter(r=>r.mode==='direct')){
   const spa=results.find(r=>r.width===direct.width&&r.route===direct.route&&r.mode==='spa')
   assert.deepEqual(spa.main,direct.main,direct.route+' main direct/SPA')
   assert.deepEqual(spa.images,direct.images,direct.route+' images direct/SPA')
  }
  assert.equal(errors.length,0,'browser errors')
 }
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exitCode=1})
