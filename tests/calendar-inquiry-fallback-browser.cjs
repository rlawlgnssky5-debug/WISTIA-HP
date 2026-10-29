const {chromium}=require('C:/Users/User/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright'),fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict')
const base=process.env.WISTIA_QA_BASE||'http://127.0.0.1:4319',out=path.resolve(__dirname,'../output/calendar-fallback-20261030'),results=[]
;(async()=>{fs.mkdirSync(out,{recursive:true});const browser=await chromium.launch({executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',headless:true})
 try{for(const width of (process.env.WISTIA_FAULT_WIDTHS?process.env.WISTIA_FAULT_WIDTHS.split(',').map(Number):[390,1280]))for(const scenario of (process.env.WISTIA_FAULT_MODES?process.env.WISTIA_FAULT_MODES.split(','):['http503','network','malformed','timeout','range-only','day-only','cached'])){
  const context=await browser.newContext({viewport:{width,height:1000},isMobile:width<780,hasTouch:width<780,timezoneId:'Asia/Seoul'});let recovered=false,refreshFail=false
  await context.route('**/*',r=>{if(/facebook\.com|connect\.facebook|google-analytics|googletagmanager/.test(r.request().url()))return r.abort();assert.equal(r.request().method(),'GET');assert.doesNotMatch(r.request().url(),/pf\.kakao|kakaolink/);return r.continue()})
  await context.route('**/api/availability?*',async r=>{
   const query=Object.fromEntries(new URL(r.request().url()).searchParams),range=!!query.from
   const success=()=>r.fulfill({json:{ok:true,...query,blocks:scenario==='cached'&&!recovered?[{start:'2026-11-05T00:00:00+09:00',end:'2026-11-06T00:00:00+09:00'}]:[]}})
   if(recovered||scenario==='range-only'&&!range||scenario==='day-only'&&range||scenario==='cached'&&!refreshFail)return success()
   if(scenario==='network')return r.abort('failed')
   if(scenario==='malformed')return r.fulfill({json:{ok:true,...query,blocks:[{start:'bad',end:'bad'}]}})
   if(scenario==='timeout')return
   return r.fulfill({status:503,json:{ok:false,message:'Synthetic outage'}})
  })
  const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));await page.goto(base+'/contact?package=A');await page.locator('[data-wf-goto="1"]').click();await page.locator('[data-calendar-month]').selectOption('10')
  if(scenario==='cached'){
   await page.waitForFunction(()=>document.querySelector('[data-calendar-day="2026-11-05"]')?.textContent.includes('마감'))
   refreshFail=true;await page.evaluate(()=>WistiaBooking.loadRange('2026-11-01','2026-11-30',true).catch(()=>{}));assert.equal(await page.locator('[data-calendar-day="2026-11-05"]').isDisabled(),true,'verified closure stays protected')
  }
  const date=scenario==='cached'?'2026-11-06':'2026-11-05';await page.waitForFunction(date=>document.querySelector('[data-calendar-day="'+date+'"]')?.disabled===false,date,{timeout:15000})
  const sundayClosed=await page.locator('[data-calendar-day="2026-11-09"]').isDisabled();assert.equal(sundayClosed,true,'regular Monday closure')
  if(!['day-only','cached'].includes(scenario))assert.match(await page.locator('[data-calendar-range-status]').innerText(),/희망 날짜/)
  if(width===390&&scenario==='http503')await page.locator('[data-calendar="bookingDate"]').screenshot({path:path.join(out,'outage-calendar-still-selectable.png')})
  await page.locator('[data-calendar-day="'+date+'"]').click();const failedDay=scenario!=='range-only';await page.waitForFunction(expected=>document.querySelector('form').dataset.scheduleState===expected,failedDay?'unavailable':'ready',{timeout:15000})
  const time=page.locator('[data-wf-time="13:00"]');assert.equal(await time.isDisabled(),false);await time.click();if(width===390&&scenario==='http503'){await time.scrollIntoViewIfNeeded();await page.waitForTimeout(450);await page.screenshot({path:path.join(out,'outage-time-wish-inquiry.png')})}
  await page.locator('[data-wf-goto="3"]').click();await page.locator('[data-wf-step="3"]:not([hidden])').waitFor();const text=await page.evaluate(()=>WistiaWizard.text(document.querySelector('form')))
  if(failedDay){assert.match(text,/자동 확인 불가 · 희망 일정 \/ 상담 후 확정/);assert.match(await page.locator('[data-wf-review]').innerText(),/상담 후 확정/)}else assert.doesNotMatch(text,/자동 확인 불가/)
  recovered=true;await page.evaluate(()=>WistiaBooking.refresh());await page.waitForFunction(()=>document.querySelector('form').dataset.scheduleState==='ready');assert.doesNotMatch(await page.evaluate(()=>WistiaWizard.text(document.querySelector('form'))),/자동 확인 불가/)
  await page.locator('[data-wf-goto="1"]').click();await page.waitForFunction(()=>document.querySelector('[data-calendar-day="2026-11-05"]')?.disabled===false)
  assert.deepEqual(errors,[]);assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth),0)
  results.push({width,scenario,wishInquiry:true,recovered:true});await context.close();console.log('PASS '+width+' '+scenario)
 }
 }finally{await browser.close();fs.writeFileSync(path.join(out,process.env.WISTIA_FAULT_REPORT||(process.env.WISTIA_FAULT_MODES?'fault-tests-small.json':'fault-tests.json')),JSON.stringify({base,simulatedFailures:true,results},null,2))}
 console.log('PASS '+results.length+' simulated failure/recovery flows without submission')
})().catch(e=>{console.error(e);process.exitCode=1})
