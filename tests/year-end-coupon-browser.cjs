const {chromium}=require('C:/Users/User/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright')
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path')
const base=process.env.WISTIA_QA_BASE||'http://127.0.0.1:4270',phase=process.env.WISTIA_QA_PHASE||'local'
const out=path.resolve(__dirname,'..',process.env.WISTIA_QA_OUT||'output/year-end-coupon-20261027',phase),results=[],errors=[]
const routes=['/','/detail/solo','/contact','/event/solo','/event/duo','/events','/info/faq','/info/location']
async function run(){
 fs.mkdirSync(out,{recursive:true})
 const browser=await chromium.launch({executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',headless:true})
 try{
 for(const width of [360,375,390,414,1280]){
  const ctx=await browser.newContext({viewport:{width,height:900},isMobile:width<780,hasTouch:width<780,timezoneId:'Asia/Seoul',reducedMotion:'reduce'})
  await ctx.route(/facebook\.com|connect\.facebook|google-analytics|googletagmanager/,r=>r.abort())
  await ctx.route('**/api/availability?*',r=>r.fulfill({json:{ok:true,...Object.fromEntries(new URL(r.request().url()).searchParams),blocks:[]}}))
  await ctx.route('**/*',r=>{
   const req=r.request(),u=req.url()
   if(req.method()!=='GET'||/pf\.kakao|kakaolink|kakao\.com\/talk/.test(u))throw Error('Forbidden QA action '+req.method()+' '+u)
   return r.fallback()
  })
  const page=await ctx.newPage();page.on('pageerror',e=>errors.push({width,url:page.url(),error:e.message}))
  await page.clock.install({time:new Date('2026-10-27T12:00:00+09:00')})
  for(const route of routes){
   const response=await page.goto(base+route+'?package=B');assert.equal(response.status(),200,route)
   await page.waitForFunction(()=>document.querySelector('main')?.innerText.length>30)
   await page.evaluate(()=>document.fonts.ready)
   await page.waitForTimeout(200)
   assert.doesNotMatch(await page.locator('main').innerText(),/10월.*(?:쿠폰|예약 이벤트|패키지 할인)/)
   const measure=await page.evaluate(()=>{
    const issues=[]
    for(const el of document.querySelectorAll('[data-year-end-gift] small,[data-year-end-gift] em>span,.year-end-products,.package-selected-cheaper,.price-down-pill,.package-price-lines dt,.welcome-toggle>span,.welcome-toggle>strong,.yearEnd-note')){
     const box=el.getBoundingClientRect();if(!box.width||!box.height)continue
     const range=document.createRange();range.selectNodeContents(el);const lines=[...range.getClientRects()].filter(r=>r.width>0)
     if(new Set(lines.map(r=>Math.round(r.top))).size>1||lines.some(r=>r.left<box.left-1||r.right>box.right+1||r.left<0||r.right>innerWidth))issues.push({text:el.textContent,box:{left:box.left,right:box.right},lines:lines.map(r=>({left:r.left,right:r.right,top:r.top}))})
    }
    return {overflow:Math.max(document.documentElement.scrollWidth,document.body.scrollWidth)-innerWidth,main:document.querySelector('main').getBoundingClientRect().width,issues}
   })
   assert.equal(measure.overflow,0,JSON.stringify({width,route,measure}));assert.deepEqual(measure.issues,[],JSON.stringify({width,route,measure}));if(width===1280)assert.equal(measure.main,780)
   if(route==='/'||route==='/detail/solo'){
    await page.locator('[data-year-end-gift]').evaluate(el=>scrollTo(0,el.getBoundingClientRect().top+scrollY-150))
    await page.screenshot({path:path.join(out,route==='/'?'home-'+width+'.png':'detail-'+width+'.png')})
    assert.match(await page.locator('[data-year-end-gift]').innerText(),/연말 방문 할인 쿠폰/)
    assert.match(await page.locator('[data-year-end-gift]').innerText(),/2026년 11·12월 방문 시 적용/)
    assert.match(await page.locator('[data-year-end-gift]').innerText(),/DELUXE · PREMIUM · DUET ONLY/)
    assert.equal(await page.locator('#packageSelection .welcome-gift,#packageSelection [data-package-total],#packageSelection .package-selection-total').count(),0)
    await page.locator('[data-benefit-list="discount"] summary').click()
    assert.match(await page.locator('[data-benefit-type="discount"]').innerText(),/2026년 11·12월/)
    for(const type of ['A','B','C','D']){await page.locator('input[name="detailPackage"][value="'+type+'"]').evaluate(el=>el.closest('label').click());assert.equal(await page.locator('.package-card.is-selected').getAttribute('data-tier'),type);assert.match(await page.locator('#packageSelection [data-package-inquiry]').getAttribute('href'),new RegExp('package='+type))}
    await page.locator('#packageSelection').screenshot({path:path.join(out,'picker-'+route.replaceAll('/','_')+'-'+width+'.png')})
   }
   if(route==='/events'){const coupon=page.locator('.evd-card').filter({hasText:'연말 방문 할인 쿠폰'});assert.match(await coupon.innerText(),/2026년 11·12월 방문 시 적용/);assert.equal(await coupon.locator('.year-end-products').innerText(),'DELUXE · PREMIUM · DUET ONLY');await coupon.screenshot({path:path.join(out,'events-coupon-'+width+'.png')})}
   if(['/contact','/event/solo','/event/duo'].includes(route)){
    await page.evaluate(()=>localStorage.clear());await page.reload();await page.waitForSelector('[name="yearEndCoupon"]')
    assert.match(await page.locator('[data-year-end-gift]').innerText(),/2026년 11·12월 방문 시 적용/)
    assert.match(await page.locator('[data-year-end-gift]').innerText(),/DELUXE · PREMIUM · DUET ONLY/)
    await page.locator('[name="firstVisit"]').check();await page.locator('[name="yearEndCoupon"]').check()
    assert.equal((await page.evaluate(()=>WistiaWizard.quote(document.querySelector('form')))).discounts.some(d=>d.key==='yearEnd'),false,'no date means no applied year-end discount')
    await page.locator('[data-wf-next]').click()
    const pick=async date=>{
     await page.locator('[data-calendar-year]').selectOption(date.slice(0,4));await page.locator('[data-calendar-month]').selectOption(String(Number(date.slice(5,7))-1))
     await page.waitForFunction(d=>{const el=document.querySelector('[data-calendar-day="'+d+'"]');return el&&!el.disabled},date)
     await page.locator('[data-calendar-day="'+date+'"]').click()
     await page.waitForFunction(()=>document.querySelector('form').dataset.scheduleState==='ready')
     await page.locator('[data-wf-time="13:00"]').click()
    }
    for(const [date,total,keys] of [['2026-10-30',140000,['first','weekday']],['2026-11-01',130000,['yearEnd','first']],['2026-12-31',100000,['yearEnd','first','weekday','advance2']],['2027-01-02',130000,['first','advance2']],['2026-12-31',100000,['yearEnd','first','weekday','advance2']]]){
     await pick(date)
     const q=await page.evaluate(()=>WistiaWizard.quote(document.querySelector('form')));assert.equal(q.total,total+(route==='/event/duo'?30000:0),JSON.stringify({width,route,date,q}));assert.deepEqual(q.discounts.map(d=>d.key),keys)
     assert.equal(await page.locator('[data-package-coupon-price="B"]').innerText(),date>='2026-11-01'&&date<='2026-12-31'?'130,000원':'150,000원')
     results.push({width,route,date,total:q.total,keys})
    }
    await page.reload();await page.waitForFunction(()=>document.querySelector('form')?.dataset.scheduleState==='ready')
    assert.equal((await page.evaluate(()=>WistiaWizard.quote(document.querySelector('form')))).total,route==='/event/duo'?130000:100000,'draft restores date and coupon')
    await page.locator('[data-wf-goto="0"]').click()
    await page.locator('[name="package"][value="A"]').evaluate(el=>el.closest('label').click())
    assert.equal(await page.locator('[name="yearEndCoupon"]').isDisabled(),true)
    assert.equal((await page.evaluate(()=>WistiaWizard.quote(document.querySelector('form')))).discounts.some(d=>d.key==='yearEnd'),false)
    await page.locator('[name="package"][value="B"]').evaluate(el=>el.closest('label').click());await page.locator('[name="yearEndCoupon"]').check()
    await page.screenshot({path:path.join(out,route.replaceAll('/','_')+'-form-'+width+'.png')})
   }
   results.push({width,route,measure})
  }
  // Test expiry in an already-open page and a fresh visit, at the exact KST boundary
  for(const route of ['/','/events','/contact']){
   await page.clock.setSystemTime(new Date('2026-12-31T23:59:59+09:00'))
   await page.goto(base+route+'?package=B');await page.waitForFunction(()=>document.querySelector('main')?.innerText.length>30)
   if(route==='/contact'){await page.locator('[name="yearEndCoupon"]').check()}
   assert.match(await page.locator('main').innerText(),/연말/)
   await page.clock.runFor(1100)
   assert.doesNotMatch(await page.locator('main').innerText(),/연말 방문 할인 쿠폰|연말 쿠폰/)
   if(route==='/contact')assert.equal((await page.evaluate(()=>WistiaWizard.quote(document.querySelector('form')))).discounts.some(d=>d.key==='yearEnd'),false)
   await page.reload();await page.waitForFunction(()=>document.querySelector('main')?.innerText.length>30)
   assert.doesNotMatch(await page.locator('main').innerText(),/연말 방문 할인 쿠폰|연말 쿠폰/)
   results.push({width,route,expiry:'passed'})
  }
  await ctx.close()
 }
 assert.deepEqual(errors,[])
 }finally{await browser.close();fs.writeFileSync(path.join(out,'results.json'),JSON.stringify({base,results,errors},null,2))}
 console.log('PASS '+results.length+' checks, five widths, no submissions or Kakao opening')
}
run().catch(e=>{console.error(e);process.exitCode=1})
