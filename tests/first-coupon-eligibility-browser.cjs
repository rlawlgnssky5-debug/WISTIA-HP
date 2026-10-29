const {chromium}=require('C:/Users/User/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright')
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path')
const base=process.env.WISTIA_QA_BASE||'http://127.0.0.1:4319',phase=process.env.WISTIA_QA_PHASE||'local',out=path.resolve(__dirname,'../output/first-coupon-20261030',phase)
;(async()=>{
 fs.mkdirSync(out,{recursive:true});const browser=await chromium.launch({executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',headless:true}),results=[],errors=[]
 try{for(const width of [320,360,375,390,414,780,1280]){
  const context=await browser.newContext({viewport:{width,height:1000},isMobile:width<780,hasTouch:width<780,timezoneId:'Asia/Seoul'})
  await context.route(/facebook\.com|connect\.facebook|google-analytics|googletagmanager/,r=>r.abort())
  await context.route('**/api/availability?*',r=>r.fulfill({json:{ok:true,...Object.fromEntries(new URL(r.request().url()).searchParams),blocks:[]}}))
  await context.route('**/api/limited-coupon',r=>r.fulfill({json:{ok:true,remaining:15,claimed:false,received:false,serverNow:new Date().toISOString(),canClaim:true,closed:false}}))
  await context.route('**/*',r=>{assert.equal(r.request().method(),'GET','no live coupon issuance or inquiry submission');assert.doesNotMatch(r.request().url(),/pf\.kakao|kakaolink/);return r.fallback()})
  const page=await context.newPage();page.on('pageerror',e=>errors.push(e.message))
  const inspect=async(route)=>{
   await page.evaluate(()=>document.fonts.ready)
   const data=await page.evaluate(()=>{
    const first=document.querySelector('[data-coupon-card="firstVisit"]'),limited=document.querySelector('[data-coupon-card="yearEndCoupon"]'),el=first.querySelector('.year-end-products'),range=document.createRange();range.selectNodeContents(el);const box=el.getBoundingClientRect(),rects=[...range.getClientRects()];
    return {text:el.textContent,lines:new Set(rects.map(r=>r.top)).size,clipped:rects.some(r=>r.left<box.left-1||r.right>box.right+1),overflow:Math.max(0,document.documentElement.scrollWidth-innerWidth),firstHeight:first.querySelector('.welcome-gift').getBoundingClientRect().height,limitedHeight:limited.querySelector('.welcome-gift').getBoundingClientRect().height,cardA:document.querySelector('[data-package-coupon-price="A"]').textContent}
   })
   assert.equal(data.text,'DELUXE · PREMIUM · DUET ONLY');assert.equal(data.lines,1,JSON.stringify({width,route,data}));assert.equal(data.clipped,false,JSON.stringify({width,route,data}));assert.equal(data.overflow,0);assert.equal(data.cardA,'90,000원');assert.ok(Math.abs(data.firstHeight-data.limitedHeight)<1,JSON.stringify({width,route,data}));results.push({width,route,...data})
  }
  for(const route of ['/','/detail/solo','/contact','/event/solo','/event/duo']){
   await page.goto(base+route+'?package=B');await page.waitForSelector('[data-coupon-card="firstVisit"]');await page.waitForFunction(()=>WistiaLimitedCoupon.state.ready)
   await page.evaluate(()=>WistiaPackages.setCouponClaim('firstVisit',true));await inspect(route)
   const form=page.locator('form[data-wizard]')
   if(await form.count()){
    for(const [tier,amount] of [['B',150000],['A',90000],['C',200000],['A',90000],['D',220000]]){
     await page.locator('.package-card[data-tier="'+tier+'"]').click()
     const data=await page.evaluate(()=>{const form=document.querySelector('form[data-wizard]'),input=form.querySelector('[name="firstVisit"]'),q=WistiaWizard.quote(form),button=form.querySelector('[data-coupon-claim="firstVisit"]');return {total:q.total,optionTotal:q.optionTotal,applied:q.discounts.some(d=>d.key==='first'),disabled:input.disabled,checked:input.checked,buttonDisabled:button.disabled,hint:button.closest('[data-coupon-card]').querySelector('.coupon-claim-hint').textContent}})
     assert.equal(data.total,amount+data.optionTotal,JSON.stringify({width,route,tier,data}));assert.equal(data.applied,tier!=='A');assert.equal(data.disabled,tier==='A');assert.equal(data.checked,tier!=='A');assert.equal(data.buttonDisabled,tier==='A');if(tier==='A')assert.equal(data.hint,'스탠다드 적용 제외');results.push({width,route,tier,...data})
    }
    await page.locator('.package-card[data-tier="A"]').click();await page.reload();await page.waitForSelector('form[data-wizard]');await page.waitForFunction(()=>WistiaLimitedCoupon.state.ready)
    assert.equal(await page.locator('[name="firstVisit"]').isChecked(),false);assert.equal(await page.locator('[data-coupon-claim="firstVisit"]').isDisabled(),true)
    assert.equal(await page.evaluate(()=>WistiaWizard.quote(document.querySelector('form[data-wizard]')).discounts.some(d=>d.key==='first')),false)
    await page.locator('.package-card[data-tier="B"]').click();assert.equal(await page.locator('[name="firstVisit"]').isChecked(),true)
   }
   if(route==='/contact'&&[390,780].includes(width)){await page.locator('.wf-welcome').evaluate(e=>e.scrollIntoView({block:'center'}));await page.waitForTimeout(500);await page.locator('.wf-welcome').screenshot({path:path.join(out,'coupons-'+width+'.png')})}
  }
  await page.goto(base+'/events');await page.waitForSelector('.events-discount-list');assert.match(await page.locator('.evd-card').first().innerText(),/DELUXE · PREMIUM · DUET ONLY/);assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth),0)
  await context.close()
 }assert.deepEqual(errors,[])}finally{await browser.close();fs.writeFileSync(path.join(out,'results.json'),JSON.stringify({base,results,errors},null,2))}
 console.log('PASS '+results.length+' coupon display, pricing, type switching and saved-draft checks across 7 widths; no live coupon issuance')
})().catch(error=>{console.error(error);process.exitCode=1})
