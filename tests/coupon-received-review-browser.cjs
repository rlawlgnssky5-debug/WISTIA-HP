const {chromium}=require('C:/Users/User/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright')
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict')
const base=process.env.WISTIA_QA_BASE||'http://127.0.0.1:4272',phase=process.env.WISTIA_QA_PHASE||'local',out=path.resolve(__dirname,'../output/coupon-received-review-20261028',phase)
;(async()=>{
 const b=await chromium.launch({executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',headless:true}),results=[],errors=[]
 fs.mkdirSync(out,{recursive:true})
 try{for(const width of [360,375,390,414,780,1280]){
  const c=await b.newContext({viewport:{width,height:1000},isMobile:width<780,hasTouch:width<780,timezoneId:'Asia/Seoul',reducedMotion:'no-preference'})
  await c.route(/facebook\.com|connect\.facebook|google-analytics|googletagmanager/,r=>r.abort())
  await c.route('**/api/availability?*',r=>r.fulfill({json:{ok:true,...Object.fromEntries(new URL(r.request().url()).searchParams),blocks:[]}}))
  await c.route('**/*',r=>{assert.equal(r.request().method(),'GET');assert.doesNotMatch(r.request().url(),/pf\.kakao|kakaolink/);return r.fallback()})
  const p=await c.newPage();p.on('pageerror',e=>errors.push(e.message))
  for(const route of ['/','/detail/solo']){
   await p.goto(base+route+'?package=B');await p.waitForSelector('[data-solo-reviews]');const root=p.locator('[data-solo-reviews]'),slides=root.locator('.ed-review-slide:not([data-review-clone])')
   assert.equal(await slides.count(),15);const sources=await p.evaluate(()=>WistiaReviewSources.map(({id,src,title,body})=>({id,src,title,body})))
   assert.deepEqual(sources.slice(0,14).map(item=>item.id),['review-17','review-01','review-02','review-03','review-04','review-05','review-06','review-07','review-08','review-09','review-12','review-13','review-14','review-n7'])
   assert.equal(sources[14].src,'assets/img/reviews/review-18.webp?v=20261028-received-review-1');assert.ok(sources[14].body.includes(sources[14].title))
   await root.locator('[data-ed-review-dot="14"]').click();await p.waitForTimeout(750);assert.equal(await root.getAttribute('data-review-index'),'14')
   const current=root.locator('.ed-review-slide.is-current');assert.equal(await current.locator('h3').innerText(),sources[14].title);assert.equal(await current.locator('p').innerText(),sources[14].body)
   await p.evaluate(()=>document.fonts.ready)
   if([390,1280].includes(width))await root.screenshot({path:path.join(out,'review-'+(route==='/'?'main':'detail')+'-'+width+'.png')})
   await current.locator('[data-review-full]').click();const dialog=root.locator('dialog'),added=dialog.locator('img');await added.evaluate(el=>el.decode())
   const m=await added.evaluate(el=>{const r=el.getBoundingClientRect();return {loaded:el.complete&&el.naturalWidth>0,width:el.naturalWidth,height:el.naturalHeight,paintedWidth:r.width,paintedHeight:r.height,overflow:document.documentElement.scrollWidth-innerWidth,main:document.querySelector('main').getBoundingClientRect().width,fit:getComputedStyle(el).objectFit}})
   assert.equal(m.loaded,true);assert.equal(m.width,2160);assert.equal(m.height,3840);assert.ok(m.paintedWidth>100);assert.equal(m.overflow,0);if(width===1280)assert.equal(m.main,780)
   if([390,1280].includes(width))await p.screenshot({path:path.join(out,'original-'+(route==='/'?'main':'detail')+'-'+width+'.png')})
   await dialog.locator('[data-solo-dialog-close]').click();await root.locator('[data-ed-review-next]').click();await p.waitForTimeout(750);assert.equal(await root.getAttribute('data-review-index'),'0');await root.locator('[data-ed-review-prev]').click();await p.waitForTimeout(750);assert.equal(await root.getAttribute('data-review-index'),'14')
   await root.locator('.ed-review-viewport').focus();await p.keyboard.press('ArrowRight');await p.waitForTimeout(750);assert.equal(await root.getAttribute('data-review-index'),'0')
   results.push({width,route,reviewCount:15,...m})
  }
  for(const route of ['/contact','/event/solo','/event/duo']){
   await p.goto(base+route+'?package=B');await p.waitForSelector('[data-coupon-claim]')
   for(const key of ['firstVisit','yearEndCoupon']){
    const button=p.locator('[data-coupon-claim="'+key+'"]');if(await button.getAttribute('aria-pressed')!=='true')await button.click()
    assert.equal(await button.locator('[data-coupon-button-copy]').innerText(),'받기 완료');assert.equal(await p.locator('[name="'+key+'"]').isChecked(),true)
   }
   assert.equal(await p.locator('body').innerText().then(t=>t.includes('선택 완료')),false)
   assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth-innerWidth),0)
   if(route==='/contact'&&[390,1280].includes(width))await p.locator('.wf-welcome').screenshot({path:path.join(out,'coupons-'+width+'.png')})
   await p.reload();await p.waitForSelector('[data-coupon-claim]');for(const key of ['firstVisit','yearEndCoupon'])assert.equal(await p.locator('[data-coupon-claim="'+key+'"] [data-coupon-button-copy]').innerText(),'받기 완료')
   results.push({width,route,copy:'받기 완료',reload:true})
  }
  await c.close()
 }assert.deepEqual(errors,[])
 }finally{await b.close();fs.writeFileSync(path.join(out,'results.json'),JSON.stringify({base,results,errors},null,2))}
 console.log('PASS '+results.length+' review order/loading/navigation and inquiry received-copy checks')
})().catch(e=>{console.error(e);process.exitCode=1})
