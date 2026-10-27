const {chromium}=require('C:/Users/User/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright')
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path')
const base=process.env.WISTIA_QA_BASE||'http://127.0.0.1:4274',out=path.resolve(__dirname,'../output/limited-coupon-20261028',process.env.WISTIA_QA_PHASE||'local')
;(async()=>{
 fs.mkdirSync(out,{recursive:true});const b=await chromium.launch({executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',headless:true}),results=[],errors=[]
 try{for(const width of [320,360,375,390,414,780,1280]){
  const c=await b.newContext({viewport:{width,height:950},isMobile:width<780,hasTouch:width<780,timezoneId:'Asia/Seoul'});let remaining=20,owned=false,posts=0,fail=false
  await c.route(/facebook\.com|connect\.facebook|google-analytics|googletagmanager/,r=>r.abort())
  await c.route('**/api/availability?*',r=>r.fulfill({json:{ok:true,...Object.fromEntries(new URL(r.request().url()).searchParams),blocks:[]}}))
  await c.route('**/api/limited-coupon',r=>{if(fail)return r.fulfill({status:503,json:{ok:false}});let fresh=false;if(r.request().method()==='POST'){posts++;if(!owned&&remaining>0){remaining--;owned=true;fresh=true}}return r.fulfill({json:{ok:true,remaining,claimed:owned,closed:remaining===0,newlyClaimed:fresh}})})
  await c.route('**/*',r=>{assert.ok(r.request().method()==='GET'||new URL(r.request().url()).pathname==='/api/limited-coupon');assert.doesNotMatch(r.request().url(),/pf\.kakao|kakaolink/);return r.fallback()})
  const p=await c.newPage();p.on('pageerror',e=>errors.push(e.message));await p.clock.setFixedTime(new Date('2026-10-28T12:00:00+09:00'))
  const button=()=>p.locator('[data-coupon-claim="yearEndCoupon"]'),card=()=>p.locator('[data-coupon-card="yearEndCoupon"]')
  const layout=async()=>{
   await p.evaluate(()=>document.fonts.ready)
   const m=await p.evaluate(()=>{const card=document.querySelector('[data-coupon-card="yearEndCoupon"]'),bad=[];for(const el of card.querySelectorAll('small,strong,em>span,.coupon-claim-hint,.limited-coupon-note')){const box=el.getBoundingClientRect(),range=document.createRange();range.selectNodeContents(el);for(const r of range.getClientRects())if(r.left<box.left-1||r.right>box.right+1)bad.push(el.textContent)}return {bad,overflow:document.documentElement.scrollWidth-innerWidth,main:document.querySelector('main').getBoundingClientRect().width,heights:[...document.querySelectorAll('.coupon-claim-card>.welcome-gift')].map(e=>e.getBoundingClientRect().height)}})
   assert.equal(m.overflow,0);assert.deepEqual(m.bad,[]);assert.ok(Math.abs(m.heights[0]-m.heights[1])<1);if(width>=780)assert.equal(m.main,780)
  }
  for(const route of ['/','/detail/solo']){
   await p.goto(base+route+'?package=B');await p.waitForFunction(()=>WistiaLimitedCoupon.state.ready)
   assert.match(await card().innerText(),/선착순 한정 수량 쿠폰/);await layout()
   assert.equal(await p.locator('#arcTuning').evaluate(e=>getComputedStyle(e,'::before').backgroundColor),'rgb(255, 255, 255)')
   if(route==='/'){
    assert.equal(await card().locator('[data-limited-stock]').innerText(),'20장 남음');await button()[width<780?'tap':'click']();await p.waitForFunction(()=>WistiaLimitedCoupon.state.claimed);assert.equal(posts,1);assert.equal(await card().locator('[data-limited-stock]').innerText(),'19장 남음');assert.equal(await button().locator('[data-coupon-button-copy]').innerText(),'받기 완료');assert.equal(await button().isDisabled(),true);assert.equal(await card().locator('.coupon-particle-layer i').count(),48)
    if(width===390)await card().screenshot({path:path.join(out,'received-390.png')})
   }
   assert.ok((await p.locator('.package-price-lines').innerText()).includes('선착순 쿠폰 + 첫 이용 적용가'));assert.doesNotMatch(await p.locator('body').innerText(),/연말 쿠폰|연말 방문 할인 쿠폰/)
   await p.reload();await p.waitForFunction(()=>WistiaLimitedCoupon.state.ready);assert.equal(await button().isDisabled(),true);assert.equal(posts,1)
  }
  for(const route of ['/contact','/event/solo','/event/duo']){
   await p.goto(base+route+'?package=B');await p.waitForFunction(()=>WistiaLimitedCoupon.state.ready);assert.equal(await p.locator('[name="yearEndCoupon"]').isChecked(),true);await layout()
   await p.evaluate(()=>{const e=document.querySelector('[name="bookingDate"]');e.value='2026-12-31';e.dispatchEvent(new Event('change',{bubbles:true}))})
   assert.equal(await p.evaluate(()=>WistiaWizard.quote(document.querySelector('form')).discounts.find(d=>d.key==='yearEnd').amount),20000)
   await p.locator('.package-card[data-tier="A"]').click();assert.equal(await p.locator('[name="yearEndCoupon"]').isChecked(),false);await p.locator('.package-card[data-tier="B"]').click();assert.equal(await p.locator('[name="yearEndCoupon"]').isChecked(),true)
   await p.evaluate(()=>{document.querySelector('[name="bookingDate"]').value='2027-01-02'});assert.equal(await p.evaluate(()=>WistiaWizard.quote(document.querySelector('form')).discounts.some(d=>d.key==='yearEnd')),false)
  }
  await p.goto(base+'/events');await p.waitForSelector('.events-discount-list');assert.equal(await p.locator('.evd-card').count(),4);assert.doesNotMatch(await p.locator('.events-discount-list').innerText(),/선착순|연말/)
  remaining=0;owned=false;await p.goto(base+'/?package=B');await p.waitForFunction(()=>WistiaLimitedCoupon.state.ready);assert.match(await card().innerText(),/0장 남음[\s\S]*쿠폰이 마감되었어요/);assert.equal(await button().isDisabled(),true);assert.doesNotMatch(await p.locator('.package-price-lines').innerText(),/선착순/);assert.equal(await p.locator('[data-package-coupon-price="B"]').innerText(),'150,000원');await layout();if(width===390)await card().screenshot({path:path.join(out,'closed-390.png')})
  owned=true;await p.reload();await p.waitForFunction(()=>WistiaLimitedCoupon.state.ready);assert.match(await button().innerText(),/받기 완료/);assert.doesNotMatch(await card().innerText(),/쿠폰이 마감되었어요/)
  fail=true;owned=false;await p.reload();await p.waitForFunction(()=>WistiaLimitedCoupon.state.error);assert.equal(await p.locator('[data-limited-stock]').innerText(),'수량 확인 필요');assert.doesNotMatch(await button().innerText(),/받기 완료/);assert.equal(posts,1)
  results.push({width,pages:6,claims:posts,checks:'stock, one issue, reload, all inquiry routes, date/products, exhausted, owner, outage, white background and layout'});await c.close()
 }assert.deepEqual(errors,[])}finally{await b.close();fs.writeFileSync(path.join(out,'results.json'),JSON.stringify({base,results,errors},null,2))}
 console.log('PASS limited coupon browser checks at '+results.length+' widths')
})().catch(e=>{console.error(e);process.exitCode=1})
