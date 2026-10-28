const {chromium}=require('C:/Users/User/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright')
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path')
const base=process.env.WISTIA_QA_BASE||'http://127.0.0.1:4274',out=path.resolve(__dirname,'../output/limited-coupon-pricing-20261029',process.env.WISTIA_QA_PHASE||'local'),day=86400000,start=Date.parse('2026-10-29T09:00:00+09:00')
;(async()=>{fs.mkdirSync(out,{recursive:true});const b=await chromium.launch({executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',headless:true}),results=[],errors=[]
 try{for(const width of [320,360,375,390,414,780,1280]){
  const c=await b.newContext({viewport:{width,height:1000},isMobile:width<780,hasTouch:width<780,timezoneId:'Asia/Seoul'});let now=start,posts=0
  await c.route(/facebook\.com|connect\.facebook|google-analytics|googletagmanager/,r=>r.abort())
  await c.route('**/api/availability?*',r=>r.fulfill({json:{ok:true,...Object.fromEntries(new URL(r.request().url()).searchParams),blocks:[]}}))
  await c.route('**/api/limited-coupon',r=>{if(r.request().method()!=='GET')posts++;return r.fulfill({json:{ok:true,remaining:17,claimed:true,expired:now>=start+day,expiresAt:new Date(start+day).toISOString(),serverNow:new Date(now).toISOString(),nextClaimAt:new Date(start+7*day).toISOString(),inCooldown:true,canClaim:false,closed:false}})})
  await c.route('**/*',r=>{assert.equal(r.request().method(),'GET','QA cannot issue stock or submit inquiries');assert.doesNotMatch(r.request().url(),/pf\.kakao|kakaolink/);return r.fallback()})
  const p=await c.newPage();p.on('pageerror',e=>errors.push(e.message));await p.clock.install({time:new Date(now)})
  for(const route of ['/','/detail/solo','/contact','/event/solo','/event/duo']){
   await p.goto(base+route+'?package=B');await p.waitForFunction(()=>WistiaLimitedCoupon.state.ready)
   await p.locator('.package-card[data-tier="B"]').first().click()
   const card=p.locator('[data-coupon-card="yearEndCoupon"]');assert.equal(await card.locator('[data-coupon-button-copy]').innerText(),'받기 완료')
   assert.equal(await card.locator('[data-limited-stock]').innerText(),'17장 남음');assert.equal(await p.evaluate(()=>WistiaLimitedCoupon.isUsable()),true)
   const form=p.locator('form').filter({has:p.locator('[name="yearEndCoupon"]')})
   if(await form.count()){
    await p.evaluate(()=>WistiaPackages.setCouponClaim('firstVisit',true))
    for(const date of ['','2026-10-30','2026-11-27','2026-12-25','2027-01-02']){
     await p.evaluate(date=>{const f=document.querySelector('form'),e=f.querySelector('[name="bookingDate"]');e.value=date;e.dispatchEvent(new Event('change',{bubbles:true}))},date)
     const actual=await p.evaluate(()=>{const f=document.querySelector('form'),q=WistiaWizard.quote(f);return {amount:q.discounts.find(d=>d.key==='yearEnd')?.amount,coupon:q.v.yearEndCoupon,panel:f.querySelector('.is-coupon').innerText,quote:q.total}})
     assert.equal(actual.amount,20000,JSON.stringify({width,route,date,actual}));assert.equal(actual.coupon,'1')
     assert.match(actual.panel,/선착순 쿠폰 \+ 첫 이용 적용가/);assert.match(actual.panel,/130,000원/)
     results.push({width,route,date,limited:actual.amount,total:actual.quote})
    }
    await p.evaluate(()=>{const e=document.querySelector('[name="bookingDate"]');e.value='2026-10-30';e.dispatchEvent(new Event('change',{bubbles:true}))})
    for(const [tier,amount] of [['A',70000],['B',130000],['C',180000],['D',200000],['B',130000]]){
     await p.locator('.package-card[data-tier="'+tier+'"]').click()
     const q=await p.evaluate(()=>WistiaWizard.quote(document.querySelector('form')));assert.equal(q.total,amount+q.optionTotal);assert.equal(q.discounts.some(d=>d.key==='yearEnd'),tier!=='A')
    }
    await p.reload();await p.waitForFunction(()=>WistiaLimitedCoupon.state.ready);const restored=await p.evaluate(()=>WistiaWizard.quote(document.querySelector('form')));assert.equal(restored.total,130000+restored.optionTotal)
   }
   const couponRow=p.locator('[data-package-selection-details] .is-coupon').first();assert.match(await couponRow.innerText(),/130,000원/)
   await p.evaluate(()=>document.fonts.ready);assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth-innerWidth),0)
   const clipping=await p.locator('.package-price-lines').first().evaluate(e=>{const bad=[];for(const el of e.querySelectorAll('dt,dd,.package-price-label,.price-down-pill')){const b=el.getBoundingClientRect(),range=document.createRange();range.selectNodeContents(el);for(const r of range.getClientRects())if(r.left<b.left-1||r.right>b.right+1)bad.push(el.textContent)}return bad});assert.deepEqual(clipping,[])
   if(route==='/contact'&&[390,780].includes(width)){const price=p.locator('[data-package-selection-details] .package-price-lines');await price.evaluate(e=>e.scrollIntoView({block:'center'}));await p.waitForTimeout(600);await price.screenshot({path:path.join(out,'corrected-prices-'+width+'.png')})}
  }
  now=start+day+1000;await p.clock.fastForward(day+1000);await p.evaluate(()=>WistiaLimitedCoupon.refresh())
  await p.waitForFunction(()=>!WistiaLimitedCoupon.isUsable());assert.equal(await p.evaluate(()=>WistiaWizard.quote(document.querySelector('form')).discounts.some(d=>d.key==='yearEnd')),false)
  assert.equal(await p.locator('[data-coupon-card="yearEndCoupon"] [data-coupon-button-copy]').innerText(),'받기 완료');assert.equal(await p.locator('[data-limited-stock]').innerText(),'17장 남음');assert.equal(posts,0)
  results.push({width,expired:true,stock:17,posts});await c.close()
 }assert.deepEqual(errors,[])}finally{await b.close();fs.writeFileSync(path.join(out,'results.json'),JSON.stringify({base,results,errors},null,2))}
 console.log('PASS '+results.length+' received-coupon pricing and expiry cases, 7 widths and 5 routes; no live issue POST')
})().catch(e=>{console.error(e);process.exitCode=1})
