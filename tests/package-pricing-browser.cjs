const {chromium}=require(process.env.WISTIA_PLAYWRIGHT||'C:/Users/User/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright')
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict')
const root=path.resolve(__dirname,'..'),out=path.resolve(root,process.env.WISTIA_QA_OUT||'output/packages'),baseline=process.argv.includes('--baseline'),phase=baseline?'before':'after'
const base=baseline?'https://www.wistiastudio.com':process.env.WISTIA_QA_BASE||'http://127.0.0.1:4212'
const routes=['/','/detail/solo','/detail/duo','/contact','/event/solo','/event/duo','/events','/info/faq','/info/location']
const slug=route=>route==='/'?'home':route.slice(1).replaceAll('/','-')
const results=[],errors=[],checks=[]
async function settled(page){await page.waitForFunction(()=>document.querySelector('#app')?.innerText.trim().length>30);await page.evaluate(()=>Promise.race([document.fonts.ready,new Promise(r=>setTimeout(r,1500))]));await page.waitForTimeout(100)}
async function measure(page){return page.evaluate(()=>{
 const rect=s=>{const el=document.querySelector(s);if(!el)return null;const r=el.getBoundingClientRect();return {x:r.x,width:r.width}}
 const hidden=document.querySelector('[data-seo-fallback]'),style=hidden?getComputedStyle(hidden):null
 const clipped=[]
 document.querySelectorAll('.package-card-name,.package-card-price,.package-section h2,.package-information h2,.package-notices h2').forEach(el=>{const r=el.getBoundingClientRect();const walker=document.createTreeWalker(el,NodeFilter.SHOW_TEXT);let node;while(node=walker.nextNode()){const range=document.createRange();range.selectNodeContents(node);for(const line of range.getClientRects())if(line.left<r.left-1||line.right>r.right+1)clipped.push(el.textContent)}})
 return {width:innerWidth,overflow:Math.max(document.documentElement.scrollWidth,document.body.scrollWidth)-innerWidth,main:rect('main'),header:rect('#siteHeader'),footer:rect('.solo-footer-clean'),body:getComputedStyle(document.body).backgroundColor,hiddenSeo:!hidden||style.clipPath!=='none'||style.clip!=='auto',removedPaidAr:!document.querySelector('[name="lipsync"]')&&!document.querySelector('#app')?.textContent.includes('100% 립싱크')&&!document.querySelector('script[type="application/ld+json"]')?.textContent.includes('100% 립싱크'),clipped,cards:[...document.querySelectorAll('.package-card')].map(x=>({width:x.getBoundingClientRect().width,parentWidth:x.parentElement.getBoundingClientRect().width,size:getComputedStyle(x.querySelector('.package-card-name')).fontSize})),removed:[...document.querySelectorAll('main img')].filter(x=>/lyric|top_B|info_v|notice-c|point-price|point-adv|point05-c3/.test(x.src)).map(x=>x.src)}
 })}
async function capture(page,file){
 await page.evaluate(async()=>{for(let y=0;y<document.documentElement.scrollHeight;y+=1000){scrollTo(0,y);await new Promise(r=>setTimeout(r,25))}scrollTo(0,0);document.querySelectorAll('audio,video').forEach(m=>m.pause())})
 await page.waitForTimeout(150);await page.screenshot({path:file,fullPage:true,type:'jpeg',quality:70})
}
async function run(){
 fs.mkdirSync(path.join(out,phase),{recursive:true})
 const browser=await chromium.launch({executablePath:process.env.WISTIA_BROWSER||'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',headless:true,args:['--disable-gpu']})
 const context=await browser.newContext({viewport:{width:390,height:844},reducedMotion:'reduce'})
 await context.route(/facebook\.com|connect\.facebook|google-analytics|googletagmanager/,r=>r.abort())
 const page=await context.newPage();page.on('pageerror',e=>errors.push({url:page.url(),message:e.message}))
 for(const width of (process.argv.includes('--functional-only')?[]:[360,375,390,1280])){
  await page.setViewportSize({width,height:width===1280?900:844})
  for(const route of routes){
   await page.goto(base+route,{waitUntil:'domcontentloaded'});await settled(page)
   const data=await measure(page);results.push({route,width,direct:data})
   if(!baseline){assert.equal(data.overflow,0,route+' '+width+' overflow');assert.equal(data.hiddenSeo,true);assert.equal(data.removedPaidAr,true,'removed paid AR option '+route);assert.equal(data.clipped.length,0,route+' heading clipping');for(const c of data.cards){assert.ok(Math.abs(c.width*3+16-c.parentWidth)<1);assert.equal(c.size,'20px')}if(width===1280){assert.equal(data.main.width,780);assert.equal(data.main.x,250);assert.equal(data.body,'rgb(255, 255, 255)')}assert.equal(data.removed.length,0,'removed option/old-price images')}
   await capture(page,path.join(out,phase,slug(route)+'-'+width+'.jpg'))
   if(!baseline){
    await page.evaluate(target=>{history.pushState({},'', '/info/location');dispatchEvent(new PopStateEvent('popstate'));history.pushState({},'',target);dispatchEvent(new PopStateEvent('popstate'))},route)
    await settled(page);const spa=await measure(page);results.at(-1).spa=spa
    assert.equal(spa.overflow,0);assert.equal(spa.removedPaidAr,true,'SPA restored removed paid AR option');assert.equal(spa.main.width,data.main.width);assert.equal(spa.cards.length,data.cards.length)
   }
   console.log(phase+' '+width+' '+route+' OK')
  }
 }
 if(!baseline)await functional(page)
 const previous=process.argv.includes('--functional-only')&&fs.existsSync(path.join(out,phase+'-results.json'))?JSON.parse(fs.readFileSync(path.join(out,phase+'-results.json'),'utf8')):null
 fs.writeFileSync(path.join(out,phase+'-results.json'),JSON.stringify({results:previous?.results||results,errors,checks},null,2))
 await browser.close();if(errors.length)throw Error(JSON.stringify(errors));console.log(phase+' finished: '+results.length+' captures, '+checks.length+' functional checks')
}
async function functional(page){
 await page.setViewportSize({width:390,height:844})
 await page.goto(base+'/?wistia_vid=qa-preserved');await settled(page)
 await page.locator('.package-card').filter({has:page.locator('input[value="C"]')}).click()
 assert.equal(new URL(page.url()).searchParams.get('package'),'C')
 assert.equal(new URL(page.url()).searchParams.get('wistia_vid'),'qa-preserved')
 await page.locator('[data-package-inquiry]').click();await settled(page)
 assert.equal(new URL(page.url()).searchParams.get('package'),'C');assert.equal(new URL(page.url()).searchParams.get('wistia_vid'),'qa-preserved')
 assert.equal(await page.locator('[name="package"]:checked').inputValue(),'C');checks.push('detail package and visitor query survive SPA inquiry navigation')
 const value=()=>page.evaluate(()=>WistiaWizard.quote(document.querySelector('form')))
 assert.equal((await value()).total,170000)
 await page.locator('[name="people"][value="1"]').check();assert.equal((await value()).total,200000);assert.equal((await value()).minutes,120);checks.push('duet adds 30000 without silently extending time')
 await page.reload();await settled(page);assert.equal(await page.locator('[name="people"]:checked').inputValue(),'1');assert.equal((await value()).total,200000);checks.push('package and people draft restoration')
 // Move through the real steps; never click the submit control or a Kakao link
 await page.locator('[data-wf-next]').click();await page.locator('[name="eventDateUnknown"]').check();await page.locator('[data-wf-next]').click()
 const target=await page.evaluate(()=>{const d=new Date();d.setUTCDate(d.getUTCDate()+20);while(![4,5].includes(d.getUTCDay()))d.setUTCDate(d.getUTCDate()+1);return d.toISOString().slice(0,10)})
 await page.evaluate(date=>{const f=document.querySelector('form');f.querySelector('#contact-bookingDate').value=date;f.querySelector('#contact-bookingDate').dispatchEvent(new Event('change',{bubbles:true}))},target)
 await page.waitForFunction(()=>document.querySelector('form').dataset.scheduleState==='ready')
 await page.locator('[data-wf-time="14:00"]').click();await page.locator('[data-wf-next]').click()
 assert.equal(await page.locator('[name="tuning"]').isDisabled(),true);assert.equal(await page.locator('[name="detailMix"]').isDisabled(),true)
 await page.locator('[name="extraHour"]').check();assert.equal((await value()).minutes,180)
 await page.waitForFunction(()=>WistiaBooking.duration(WistiaBooking.calendarKey())===180)
 assert.equal(await page.locator('[data-wf-time="21:00"]').isDisabled(),true);checks.push('C further hour updates availability, including closing time')
 assert.equal(await page.locator('[name="lipsync"]').count(),0);await page.locator('[name="firstVisit"]').check();await page.locator('[name="paybackBlog"]').check();await page.locator('[name="paybackReaction"]').check()
 const expected=await value();assert.equal(expected.payback,60000)
 await page.locator('[name="specialNotes"]').count().then(()=>{})
 await capture(page,path.join(out,'after','inquiry-options-390.jpg'))
 await page.locator('[data-wf-next]').click();await page.locator('[name="specialNotes"]').fill('테스트용 입력 · 실제 제출하지 않음')
 const text=await page.evaluate(()=>WistiaWizard.text(document.querySelector('form')))
 assert.ok(text.includes('패키지 : C'));assert.ok(text.includes('듀엣'));assert.ok(!/100%|립싱크|가사|추가 1절/.test(text));assert.ok(text.includes('총 결제 금액 : '+expected.total.toLocaleString('ko-KR')+'원'));checks.push('summary and generated consultation text agree, removed AR option absent, no submission')
 await capture(page,path.join(out,'after','inquiry-summary-390.jpg'))
 await page.reload();await settled(page);assert.equal((await value()).total,expected.total);assert.equal((await value()).payback,60000);assert.equal(await page.locator('[name="specialNotes"]').inputValue(),'테스트용 입력 · 실제 제출하지 않음');checks.push('all new options, discount, payback and notes survive refresh')
 await page.evaluate(()=>localStorage.clear())
 await page.goto(base+'/event/solo?package=A');await settled(page)
 assert.equal(await page.locator('[name="rush"]').count(),0)
 await page.locator('[data-wf-next]').click()
 await page.locator('[data-wf-date-part="year"]').selectOption('2026');await page.locator('[data-wf-date-part="month"]').selectOption('12');await page.locator('[data-wf-date-part="day"]').selectOption('30')
 assert.equal((await value()).minutes,60);assert.equal((await value()).total,90000);checks.push('latest remote policy keeps package duration without a 2026 promo')
 await page.evaluate(()=>{const f=document.querySelector('form');f.elements.package.value='B';f.elements.package[1].dispatchEvent(new Event('change',{bubbles:true}))})
 assert.equal((await value()).minutes,60);assert.equal((await value()).total,130000)
 assert.equal(await page.locator('[name="rush"]').count(),0)
 await page.evaluate(()=>{const f=document.querySelector('form');f.elements.package.value='A';f.elements.package[0].dispatchEvent(new Event('change',{bubbles:true}));f.elements.tuning.checked=true;f.elements.detailMix.checked=true;f.elements.tuning.dispatchEvent(new Event('change',{bubbles:true}))})
 assert.equal((await value()).total,150000);checks.push('individual options total 150000 versus B package 130000')
 await page.evaluate(()=>{const f=document.querySelector('form');f.elements.package.value='B';f.elements.package[1].dispatchEvent(new Event('change',{bubbles:true}))});assert.equal((await value()).total,130000);checks.push('switching to B removes duplicate tuning and mixing charges')
 await page.evaluate(()=>{localStorage.clear();localStorage.setItem('wistia:inquiry-draft:v1:solo',JSON.stringify({version:1,savedAt:Date.now(),step:3,fields:{package:'A',people:'0',lipsync:'1',specialNotes:'이전 초안 보존 검사'},wedding:{}}))})
 await page.goto(base+'/event/solo');await settled(page)
 assert.equal((await value()).total,90000)
 assert.equal(await page.locator('[name="lipsync"]').count(),0)
 assert.equal(await page.locator('[name="specialNotes"]').inputValue(),'이전 초안 보존 검사')
 assert.equal(await page.evaluate(()=>WistiaBookingDraft.read('solo').fields.lipsync),undefined)
 assert.ok(!/100%|립싱크/.test(await page.evaluate(()=>WistiaWizard.text(document.querySelector('form')))))
 checks.push('old saved 100% AR choice is neither restored nor charged nor copied')
 await page.evaluate(()=>localStorage.clear())
}
run().catch(error=>{fs.mkdirSync(out,{recursive:true});fs.writeFileSync(path.join(out,phase+'-failure.json'),JSON.stringify({error:error.stack,results,errors,checks},null,2));console.error(error);process.exitCode=1})
