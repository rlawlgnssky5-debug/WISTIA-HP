const {chromium}=require(process.env.WISTIA_PLAYWRIGHT||'C:/Users/User/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright')
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict')
const out=path.resolve(__dirname,'../output/inquiry-discounts-20261022'),base=process.env.WISTIA_QA_BASE||'http://127.0.0.1:4212'
;(async()=>{
 fs.mkdirSync(out,{recursive:true})
 const browser=await chromium.launch({executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',headless:true})
 try{
  const context=await browser.newContext({reducedMotion:'reduce'}),errors=[],checks=[]
  await context.route(/facebook\.com|connect\.facebook|google-analytics|googletagmanager/,r=>r.abort())
  // A closed 13:00 slot is deliberate test data, never an actual reservation
  await context.route('**/api/availability?*',async r=>{
   const u=new URL(r.request().url()),date=u.searchParams.get('date'),from=u.searchParams.get('from'),to=u.searchParams.get('to')
   await r.fulfill({json:{ok:true,...(date?{date}:{from,to}),blocks:date?[{start:date+'T12:30:00+09:00',end:date+'T14:00:00+09:00'}]:[],timeZone:'Asia/Seoul',operatingDays:[0,4,5,6]}})
  })
  const page=await context.newPage();page.on('pageerror',e=>errors.push(e.message))
  const settled=async()=>{await page.waitForFunction(()=>document.querySelector('main')?.innerText.length>30);await page.evaluate(()=>document.fonts.ready)}
  const q=()=>page.evaluate(()=>WistiaWizard.quote(document.querySelector('form')))
  const capture=async name=>{await page.evaluate(()=>{document.activeElement?.blur();scrollTo(0,0)});await page.waitForTimeout(150);await page.screenshot({path:path.join(out,name+'.png'),fullPage:true})}
  const layout=async()=>{assert.equal(await page.evaluate(()=>Math.max(document.documentElement.scrollWidth,document.body.scrollWidth)-innerWidth),0);assert.deepEqual(await page.evaluate(()=>[...document.querySelectorAll('.package-card-price,.package-first-visit-note,.wf-discount-banner,.wf-time-discount')].filter(e=>e.getClientRects().length&&e.scrollWidth>e.clientWidth+1).map(e=>e.textContent)),[])}
  const setWedding=async()=>{
   const year=await page.evaluate(()=>String(Number(WistiaPackages.today().slice(0,4))+1))
   await page.locator('[data-wf-date-part="year"]').selectOption(year)
   await page.locator('[data-wf-date-part="month"]').selectOption('1')
   await page.locator('[data-wf-date-part="day"]').selectOption('10')
  }
  const setDate=async date=>{
   await page.evaluate(value=>{const input=document.querySelector('#contact-bookingDate');input.value=value;input.dispatchEvent(new Event('change',{bubbles:true}))},date)
   await page.waitForFunction(()=>document.querySelector('form').dataset.scheduleState==='ready')
  }
  for(const width of [390,1280]){
   await page.setViewportSize({width,height:900})
   for(const route of ['/','/detail/solo','/detail/duo']){
    await page.goto(base+route);await settled()
    assert.equal(await page.locator('#packageSelection :is(.package-people,.package-options-guide,.package-discount-guide)').count(),0)
    assert.equal(await page.locator('#packageSelection .package-first-visit-note').textContent(),'첫 이용이라면 10,000원이 할인됩니다')
    assert.deepEqual(await page.locator('.package-card-price').allTextContents(),['90,000원','130,000원','170,000원'])
    assert.equal(await page.locator('.package-card s').count(),0,'no new original-price or strikethrough treatment')
    await layout()
   }
   await page.locator('#packageSelection').screenshot({path:path.join(out,'detail-'+width+'.png')})
   await page.evaluate(()=>localStorage.removeItem('wistia:inquiry-draft:v1:solo'))
   await page.goto(base+'/event/solo?package=A');await settled()
   assert.equal(await page.locator('[name="firstVisit"]').isVisible(),true)
   assert.equal(await page.locator('[name="people"]').count(),2)
   await page.locator('[name="firstVisit"]').check();assert.equal((await q()).total,80000)
   await capture('type-first-use-'+width);await layout()
   await page.reload();await settled();assert.equal(await page.locator('[name="firstVisit"]').isChecked(),true)
   await page.locator('[data-wf-next]').click()
   assert.equal(await page.locator('[name="eventDateUnknown"]').count(),0)
   await page.locator('[data-wf-next]').click()
   assert.equal(await page.evaluate(()=>WistiaWizard.currentStep(document.querySelector('form'))),2)
   assert.equal(await page.locator('[data-wf-error="eventDate"]').isVisible(),true)
   await capture('wedding-required-'+width)
   await setWedding();await page.locator('[data-wf-next]').click()
   const dates=await page.evaluate(()=>{
    const today=WistiaPackages.today(),advance=months=>{const d=new Date(WistiaPackages.addMonths(today,months)+'T12:00:00Z');while(![4,5].includes(d.getUTCDay()))d.setUTCDate(d.getUTCDate()+1);return d.toISOString().slice(0,10)}
    const weekend=new Date(advance(2)+'T12:00:00Z');while(weekend.getUTCDay()!==6)weekend.setUTCDate(weekend.getUTCDate()+1)
    return {one:advance(1),two:advance(2),weekend:weekend.toISOString().slice(0,10)}
   })
   await setDate(dates.one)
   assert.match(await page.locator('[data-wf-advance-note]').textContent(),/^1만원 할인 적용돼요!/)
   await page.locator('[data-wf-change-date]').click();await capture('calendar-one-month-'+width)
   await setDate(dates.two)
   assert.match(await page.locator('[data-wf-advance-note]').textContent(),/^2만원 할인 적용돼요!/)
   await page.locator('[data-wf-change-date]').click();await capture('calendar-two-months-'+width)
   // Exercise the actual month dropdowns and day click, not just the hidden input
   await page.locator('[data-calendar-year]').selectOption(dates.two.slice(0,4))
   await page.locator('[data-calendar-month]').selectOption(String(Number(dates.two.slice(5,7))-1))
   await page.locator('[data-calendar-day="'+dates.two+'"]').click()
   await page.waitForFunction(()=>document.querySelector('form').dataset.scheduleState==='ready')
   assert.equal(await page.locator('[data-wf-time="13:00"]').isDisabled(),true)
   assert.equal(await page.locator('[data-wf-time="13:00"] .wf-time-discount').count(),0)
   assert.deepEqual(await page.locator('[data-wf-time]:has(.wf-time-discount)').evaluateAll(els=>els.map(e=>e.dataset.wfTime)),['15:00','16:00'])
   await page.locator('[data-wf-time="15:00"]').click()
   assert.equal((await q()).discount,40000);assert.equal((await q()).total,50000)
   assert.equal((await q()).discounts.filter(d=>/^advance/.test(d.key)).length,1)
   assert.equal(await page.locator('[data-wf-weekday-note]').textContent(),'목·금 13~16시 시작은 1만원 할인 적용돼요!')
   assert.equal(await page.locator('[data-wf-weekday-note]').getAttribute('class'),'wf-discount-banner is-applied')
   const badgeAbove=await page.locator('[data-wf-time="15:00"]').evaluate(e=>e.querySelector('small').getBoundingClientRect().bottom<=e.querySelector('strong').getBoundingClientRect().top)
   assert.equal(badgeAbove,true)
   await capture('discounted-time-'+width);await layout()
   await page.reload();await settled();await page.waitForFunction(()=>document.querySelector('form').dataset.scheduleState==='ready')
   assert.equal((await q()).total,50000)
   assert.equal(await page.locator('[data-wf-time="15:00"]').getAttribute('aria-pressed'),'true')
   await page.locator('[data-wf-time="17:00"]').click();assert.equal((await q()).total,60000)
   await setDate(dates.weekend);assert.equal(await page.locator('.wf-time-discount').count(),0)
   await page.locator('[data-wf-time="15:00"]').click();assert.equal((await q()).total,60000)
   await setDate(dates.two);await page.locator('[data-wf-time="16:00"]').click()
   await page.locator('[data-wf-next]').click()
   assert.equal(await page.locator('[data-wf-step="3"] [name="firstVisit"]').count(),0)
   assert.equal(await page.locator('[name="extraHour"]').isVisible(),true)
   await page.locator('[name="paybackBlog"]').check();await page.locator('[name="paybackReaction"]').check()
   assert.equal((await q()).total,50000);assert.equal((await q()).payback,60000)
   await capture('options-and-payback-'+width)
   await page.locator('[data-wf-next]').click();await capture('summary-'+width)
   assert.match(await page.evaluate(()=>WistiaWizard.text(document.querySelector('form'))),/총 결제 금액 : 50,000원/)
   checks.push({width,dates,checks:['detail controls removed, inquiry controls retained','unchanged actual A/B/C prices, no new strikethrough','first-use visible in type step and restored','wedding date required','one/two-month banners and exclusive discounts','real calendar selection','badges above eligible available times only','time/date change removes discounts','refresh preserves selection and total','payback separate from payment','no submission or Kakao sending']})
  }
  for(const width of [360,375]){
   await page.setViewportSize({width,height:844});await page.locator('[data-wf-goto="0"]').click();await layout();await capture('first-use-'+width)
   await page.locator('[data-wf-goto="2"]').click();await layout();await capture('time-'+width)
  }
  await page.evaluate(()=>{localStorage.setItem('wistia:inquiry-draft:v1:solo',JSON.stringify({version:1,savedAt:Date.now(),step:4,fields:{package:'A',eventDateMode:'unknown',bookingDate:WistiaPackages.addMonths(WistiaPackages.today(),2),timeStart:'15:00'},wedding:{}}))})
  await page.goto(base+'/event/solo');await settled()
  assert.equal(await page.evaluate(()=>WistiaWizard.currentStep(document.querySelector('form'))),2)
  await page.locator('[data-wf-next]').click();assert.equal(await page.locator('[data-wf-error="eventDate"]').isVisible(),true)
  checks.push('legacy unknown-date drafts return to wedding-date selection and cannot bypass validation')
  assert.deepEqual(errors,[])
  fs.writeFileSync(path.join(out,'focused-results.json'),JSON.stringify({checks,errors},null,2))
  console.log('PASS focused inquiry discount checks and 20 screenshots, no actual submission')
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exitCode=1})
