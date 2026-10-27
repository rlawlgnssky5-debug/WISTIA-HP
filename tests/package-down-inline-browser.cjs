const {chromium}=require('C:/Users/User/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright')
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict')
const base=process.env.WISTIA_QA_BASE||'http://127.0.0.1:4272',phase=process.env.WISTIA_QA_PHASE||'local',out=path.resolve(__dirname,'../output/year-end-ticket-20261027',phase)
;(async()=>{
 const browser=await chromium.launch({executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',headless:true}),results=[],errors=[]
 try{
  for(const width of [320,360,375,390,414,780,1280]){
   const ctx=await browser.newContext({viewport:{width,height:900},isMobile:width<780,hasTouch:width<780,timezoneId:'Asia/Seoul',reducedMotion:'reduce'})
   await ctx.route(/facebook\.com|connect\.facebook|google-analytics|googletagmanager/,r=>r.abort())
   await ctx.route('**/api/availability?*',r=>r.fulfill({json:{ok:true,...Object.fromEntries(new URL(r.request().url()).searchParams),blocks:[]}}))
   await ctx.route('**/*',r=>{assert.equal(r.request().method(),'GET');assert.doesNotMatch(r.request().url(),/pf\.kakao|kakaolink/);return r.fallback()})
   const page=await ctx.newPage();page.on('pageerror',e=>errors.push(e.message))
   await page.clock.install({time:new Date('2026-10-27T12:00:00+09:00')})
   for(const route of ['/','/detail/solo','/contact','/event/solo','/event/duo']){
    await page.goto(base+route+'?package=B');await page.waitForSelector('.package-price-lines');await page.evaluate(()=>document.fonts.ready)
    for(const [key,saving,price] of [['B','40,000원 DOWN','170,000원'],['C','50,000원 DOWN','220,000원'],['D','60,000원 DOWN','240,000원']]){
     await page.locator('.package-card[data-tier="'+key+'"]').click()
     const row=page.locator('.package-price-lines>.is-pkg'),pill=row.locator('dt>.price-down-pill')
     assert.equal(await pill.innerText(),saving);assert.equal(await row.locator('.price-down-pill').count(),1);assert.equal(await row.locator('dd').innerText(),price)
     const m=await row.evaluate(el=>{const rect=sel=>{const r=el.querySelector(sel).getBoundingClientRect();return {left:r.left,right:r.right,top:r.top,bottom:r.bottom,center:r.top+r.height/2}},label=rect('.package-price-label'),pill=rect('.price-down-pill'),price=rect('dd');return {label,pill,price,overflow:document.documentElement.scrollWidth-innerWidth,main:document.querySelector('main').getBoundingClientRect().width}})
     assert.ok(m.pill.left>=m.label.right+2,JSON.stringify({width,route,key,m}));assert.ok(m.price.left>=m.pill.right+3,JSON.stringify({width,route,key,m}));assert.ok(Math.abs(m.label.center-m.pill.center)<1,JSON.stringify({width,route,key,m}));assert.equal(m.overflow,0);if(width===1280)assert.equal(m.main,780)
     results.push({width,route,key,...m})
    }
    if(route==='/'||route==='/contact'){fs.mkdirSync(out,{recursive:true});const prices=page.locator('.package-price-lines');await prices.evaluate(el=>el.scrollIntoView({block:'center'}));await prices.screenshot({path:path.join(out,'inline-down-'+(route==='/'?'home':'contact')+'-'+width+'.png')})}
   }
   await ctx.close()
  }
  assert.deepEqual(errors,[])
 }finally{await browser.close();fs.mkdirSync(out,{recursive:true});fs.writeFileSync(path.join(out,'inline-down-results.json'),JSON.stringify({base,results,errors},null,2))}
 console.log('PASS '+results.length+' inline DOWN badge checks')
})().catch(e=>{console.error(e);process.exitCode=1})
