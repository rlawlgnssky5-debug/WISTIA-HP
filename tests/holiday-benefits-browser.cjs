const {chromium}=require('C:/Users/User/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright')
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict')
const base=process.env.WISTIA_QA_BASE||'http://127.0.0.1:4212',phase=process.env.WISTIA_QA_PHASE||'local',out=path.resolve(__dirname,'../output/holiday-type-20261023',phase)
;(async()=>{fs.mkdirSync(out,{recursive:true});const b=await chromium.launch({executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',headless:true}),results=[],errors=[]
try{
 for(const width of (process.env.WISTIA_HOLIDAY_WIDTHS?process.env.WISTIA_HOLIDAY_WIDTHS.split(',').map(Number):[320,360,375,390,430,780,1280])){
  const c=await b.newContext({viewport:{width,height:844},isMobile:width<780,hasTouch:width<780,reducedMotion:'reduce',timezoneId:'Asia/Seoul'})
  await c.route(/facebook\.com|connect\.facebook|google-analytics|googletagmanager/,r=>r.abort())
  // Browser-only read-only fixture: no production reservation is created or edited
  await c.route('**/api/availability?*',r=>{const p=Object.fromEntries(new URL(r.request().url()).searchParams);return r.fulfill({json:{ok:true,...p,blocks:[]}})})
  const p=await c.newPage();p.on('pageerror',e=>errors.push(e.message))
  const settled=async()=>{await p.waitForFunction(()=>document.querySelector('main')?.innerText.length>30);await p.evaluate(()=>document.fonts.ready)}
  const activate=async s=>width<780?p.locator(s).tap():p.locator(s).click()
  const q=()=>p.evaluate(()=>WistiaWizard.quote(document.querySelector('form')))
  const layout=async()=>{const x=await p.evaluate(()=>({overflow:Math.max(document.documentElement.scrollWidth,document.body.scrollWidth)-innerWidth,width:document.querySelector('main').getBoundingClientRect().width}));assert.equal(x.overflow,0);if(width>=780)assert.equal(x.width,780)}
  for(const route of ['/','/detail/solo','/detail/duo']){
   await p.goto(base+route+'?package=C');await settled();const text=await p.locator('main').innerText()
   assert.ok(!text.includes('필요한 작업을 골라 준비하세요'));assert.ok(!text.includes('왜 저렴한가요?'))
   assert.equal(await p.locator('.hs-slide').count(),5)
   await activate('.mas-event-disclosure summary');assert.equal(await p.locator('.mas-event-disclosure').evaluate(e=>e.open),true)
   assert.equal(await p.locator('[data-benefit-type="discount"] li').count(),4);assert.equal(await p.locator('[data-benefit-type="payback"] li').count(),2)
   assert.match(await p.locator('[data-benefit-type="discount"]').innerText(),/공휴일 제외/)
   const clipped=await p.evaluate(()=>{const clipped=[];for(const e of document.querySelectorAll('.mas-event-disclosure :is(strong,b,h4,p)')){const walker=document.createTreeWalker(e,NodeFilter.SHOW_TEXT);let n;while(n=walker.nextNode()){const range=document.createRange();range.selectNodeContents(n);for(const r of range.getClientRects())if(r.left<-1||r.right>innerWidth+1)clipped.push(n.textContent)}}return clipped});assert.deepEqual(clipped,[])
   await layout();if(width===320||width===390||width===1280)await p.locator('.mas-event-disclosure').screenshot({path:path.join(out,'benefits-'+route.replaceAll('/','_')+'-'+width+'.png')})
   if(route==='/'&&(width===320||width===390))for(const kind of ['discount','payback']){await p.locator('[data-benefit-type="'+kind+'"]').evaluate(e=>scrollTo({top:e.getBoundingClientRect().top+scrollY-80,behavior:'instant'}));await p.screenshot({path:path.join(out,'benefits-'+kind+'-viewport-'+width+'.png')})}
  }
  for(const route of ['/contact','/event/solo','/event/duo']){
   await c.clearCookies();await p.goto(base+route+'?package=C');await settled();await p.evaluate(()=>localStorage.clear());await p.reload();await settled()
   await activate('.welcome-toggle');await activate('[data-wf-next]')
   const pick=async date=>{await p.locator('[data-calendar-year]').selectOption(date.slice(0,4));await p.locator('[data-calendar-month]').selectOption(String(Number(date.slice(5,7))-1));await p.waitForFunction(d=>!document.querySelector('[data-calendar-day="'+d+'"]')?.disabled,date);await activate('[data-calendar-day="'+date+'"]');await p.waitForFunction(()=>document.querySelector('form').dataset.scheduleState==='ready');await activate('[data-wf-next]')}
   for(const date of ['2026-12-25','2026-12-24','2027-05-13','2027-05-14','2028-10-05']){
    await pick(date);const holiday=await p.evaluate(d=>WistiaPackages.isPublicHoliday(d),date)
    assert.equal(await p.locator('.wf-time-discount').count(),holiday?0:4)
    if(holiday)assert.match(await p.locator('[data-wf-weekday-note]').innerText(),/공휴일은/)
    await activate('[data-wf-time="13:00"]');const quote=await q(),isDuo=route==='/event/duo'
    assert.equal(quote.discount,holiday?30000:40000);assert.equal(quote.total,170000+(isDuo?30000:0)-(holiday?30000:40000))
    const copied=await p.evaluate(()=>WistiaWizard.text(document.querySelector('form')));assert.equal(copied.includes('목·금 13~16시 시작'),!holiday)
    if(width===390&&route==='/contact'&&date==='2026-12-25')await p.screenshot({path:path.join(out,'christmas-no-time-discount-390.png')})
    await p.reload();await settled();await p.waitForFunction(()=>document.querySelector('form').dataset.scheduleState==='ready');assert.equal((await q()).total,quote.total)
    results.push({width,route,date,holiday,total:quote.total,discount:quote.discount})
    await activate('[data-wf-change-date]')
   }
   await layout()
  }
  console.log('Holiday quotes, restored drafts and expanded benefits passed '+width+'px');await c.close()
 }
 assert.deepEqual(errors,[]);fs.writeFileSync(path.join(out,'holiday-results.json'),JSON.stringify({base,results,errors,fixture:'Empty browser-only availability, no reservation writes',checks:['two attached text sections removed, five hero photos retained','four discount offers and two paybacks separated','Christmas / Buddha birthday / substitute holiday exclude only weekday discount','regular Thursday and Friday keep 10000 time discount','badges, quote, copied text and restored drafts agree','780px and mobile layout retained','no inquiry submission or Kakao message']},null,2))
}finally{await b.close()}})().catch(e=>{console.error(e);process.exitCode=1})
