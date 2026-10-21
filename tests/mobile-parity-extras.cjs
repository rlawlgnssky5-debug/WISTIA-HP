const fs=require('node:fs'),path=require('node:path')
const {chromium}=require('C:/Users/User/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright-core')
const root=path.resolve(__dirname,'..'),out=path.join(root,'output/mobile-parity-20261021'),base=process.env.WISTIA_QA_URL||'http://127.0.0.1:4203'
const routes=['/','/detail/solo','/detail/duo','/contact','/event/solo','/event/duo','/events','/info/about','/info/process','/info/faq','/info/location','/before-after','/ar/self','/ar/friend','/song','/privacy']
;(async()=>{
 fs.mkdirSync(path.join(out,'extras'),{recursive:true})
 const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'})
 const results=[]
 try{
 for(const width of [360,375,390,1280]){
  const context=await browser.newContext({viewport:{width,height:844},deviceScaleFactor:1,reducedMotion:'reduce'})
  await context.route('**/*',r=>!['GET','HEAD'].includes(r.request().method())||/facebook|google-analytics|googletagmanager|doubleclick/.test(new URL(r.request().url()).hostname)?r.abort():r.continue())
  const page=await context.newPage();page.setDefaultTimeout(20000)
  for(const route of routes){
   await page.goto(base+route,{waitUntil:'domcontentloaded'});await page.waitForFunction(()=>document.querySelector('#app>*'))
   await page.evaluate(async()=>{document.querySelectorAll('img').forEach(i=>i.loading='eager');await Promise.race([document.fonts.ready,new Promise(r=>setTimeout(r,1800))]);await Promise.all([...document.images].map(i=>Promise.race([i.decode().catch(()=>{}),new Promise(r=>setTimeout(r,4000))])))})
   await page.waitForTimeout(200)
   const result=await page.evaluate(()=>{
    const shown=e=>{const s=getComputedStyle(e);return e.getClientRects().length&&s.display!=='none'&&s.visibility!=='hidden'&&s.clip!=='rect(0px, 0px, 0px, 0px)'&&e.getBoundingClientRect().width>2}
    const clipped=[...document.querySelectorAll('#app h1,#app h2,#app h3,#app p,#app legend,#app label')].filter(shown).flatMap(e=>{const range=document.createRange();range.selectNodeContents(e);const r=range.getBoundingClientRect();return r.left<-.8||r.right>innerWidth+.8?[{text:e.textContent.slice(0,90),left:r.left,right:r.right}]:[]})
    const rect=e=>{const r=e?.getBoundingClientRect();return r&&{x:r.x,width:r.width}}
    return {overflow:document.documentElement.scrollWidth-innerWidth,clipped,app:rect(document.querySelector('#app')),header:rect(document.querySelector('#siteHeader')),footer:rect(document.querySelector('.footer')),body:getComputedStyle(document.body).backgroundColor,posters:[...document.querySelectorAll('.solo-shot-frame img')].map(i=>i.currentSrc),specialists:document.querySelectorAll('.wistia-specialist-grid article').length}
   })
   results.push({route,width,...result});console.log(width,route,'overflow',result.overflow,'clipped',result.clipped.length)
   if(route==='/detail/solo'){
    if(width===360)await page.locator('.rv5').screenshot({path:path.join(out,'extras/review-360.png')})
    if(width===390||width===1280){
     await page.locator('.solo-map').screenshot({path:path.join(out,'extras/map-'+width+'.png'),style:'.fixed-price,.home-mobile-cta,.solo-footer-inquiry,.floating-kakao-pill{visibility:hidden!important}'})
     const links=await page.locator('.solo-map-links a').evaluateAll(es=>es.map(e=>{const s=getComputedStyle(e);return {href:e.href,background:s.backgroundColor,color:s.color,border:s.borderColor,shadow:s.boxShadow}}));results.push({kind:'map',width,links})
     await page.evaluate(()=>scrollTo(0,0));await page.locator('#menuToggle').click();await page.waitForTimeout(250)
     const menu=await page.locator('#mainMenu').evaluate(e=>{const r=e.getBoundingClientRect(),s=getComputedStyle(e);return {left:r.left,right:r.right,width:r.width,background:s.backgroundColor,color:s.color,labels:[...e.querySelectorAll('.menu-group-label')].map(l=>getComputedStyle(l).color)}})
     results.push({kind:'menu',width,...menu});await page.screenshot({path:path.join(out,'extras/menu-'+width+'.png')});await page.locator('#menuToggle').click()
    }
   }
  }
  await context.close()
 }
 // Colour approval preview is injected into this browser only, never shipped
 const tones=[['.mas-intro','#FFFFFF'],['.mas-information','#FBF1F1'],['.arc-reviews','#F6E4E6'],['#arcRecording','#FBF1F1'],['#arcKey','#FFFFFF'],['#arcTuning','#FBF1F1'],['#soloPoint04','#FFFFFF'],['.solo-lyric-poster','#FBF1F1'],['[data-tone-poster="point-adv"]','#FFFFFF'],['[data-tone-poster="point-price"]','#FBF1F1'],['[data-tone-poster="cred-a2"]','#FFFFFF'],['#arcProcess','#FBF1F1'],['#arcFaq','#FFFFFF'],['.solo-notice','#F6E4E6'],['.solo-map','#FFFFFF']]
 for(const width of [390,1280]){
  const context=await browser.newContext({viewport:{width,height:844},deviceScaleFactor:1,reducedMotion:'reduce'})
  await context.route('**/*',async r=>{
   const req=r.request(),u=new URL(req.url());if(!['GET','HEAD'].includes(req.method())||/facebook|google-analytics|googletagmanager|doubleclick/.test(u.hostname))return r.abort()
   if(u.pathname.endsWith('/js/detail-pc-background.js')){const res=await r.fetch(),s=await res.text();return r.fulfill({response:res,body:s.replace(/const sectionTones=\[[\s\S]*?\n \]/,'const sectionTones='+JSON.stringify(tones))})}
   return r.continue()
  })
  const page=await context.newPage()
  for(const route of ['/detail/solo','/info/about','/info/process','/info/faq','/info/location','/contact','/events']){
   await page.goto(base+route,{waitUntil:'domcontentloaded'});await page.waitForFunction(()=>document.querySelector('#app>*'))
   await page.evaluate(async()=>{document.querySelectorAll('img').forEach(i=>i.loading='eager');await Promise.all([...document.images].map(i=>i.decode().catch(()=>{})));await document.fonts.ready})
   const scope='html body '+'#app'.repeat(36)
   const band=(selectors,color)=>selectors.map(s=>scope+' '+s).join(',')+'{background:'+color+'!important}'
   await page.addStyleTag({content:
    band(['.info-page>header','.wistia-about-story','.wf-progress','.wf-location-bar','.ev2-hero','.ev2-card:nth-child(even)','.lc2-map'],'#FFFFFF')+
    band(['.wistia-specialists','.faq-category:nth-child(2n)','.wf-step','.ev2-big','.ev2-card:nth-child(odd)','.booking-guide','.lc2-addr'],'#FBF1F1')+
    band(['.wistia-about-closing','.wf-nav','.ev2-note','.lc2-side'],'#F6E4E6')});
   await page.waitForTimeout(400)
   await page.screenshot({path:path.join(out,'extras/colour-preview-'+route.slice(1).replaceAll('/','-')+'-'+width+'.jpg'),fullPage:true,type:'jpeg',quality:80,timeout:30000})
  }
  await context.close()
 }
 }finally{await browser.close();fs.writeFileSync(path.join(out,'extras-measurements.json'),JSON.stringify(results,null,2))}
 const failures=results.filter(r=>r.overflow>0||r.clipped?.length)
 if(failures.length){console.error(JSON.stringify(failures,null,2));process.exitCode=1}
})().catch(e=>{console.error(e);process.exitCode=1})
