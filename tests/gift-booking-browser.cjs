const {chromium}=require('C:/Users/User/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright')
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict')
const base=process.env.WISTIA_QA_BASE||'http://127.0.0.1:4212',phase=process.env.WISTIA_QA_PHASE||'local',out=path.resolve(__dirname,'../output/gift-booking-20261023',phase)
;(async()=>{fs.mkdirSync(out,{recursive:true});const b=await chromium.launch({executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',headless:true})
try{
 const results=[],errors=[],routes=['/','/detail/solo','/detail/duo','/contact','/event/solo','/event/duo','/events','/info/faq','/info/location']
 for(const width of [320,360,375,390,430,780,1280]){
  const ctx=await b.newContext({viewport:{width,height:900},isMobile:width<780,hasTouch:width<780,reducedMotion:'reduce',timezoneId:'Asia/Seoul'})
  await ctx.route(/facebook\.com|connect\.facebook|google-analytics|googletagmanager/,r=>r.abort())
  const page=await ctx.newPage();page.on('pageerror',e=>errors.push(e.message))
  const settled=async()=>{await page.waitForFunction(()=>document.querySelector('main')?.innerText.length>30);await page.evaluate(()=>document.fonts.ready)}
  const shot=async name=>{await page.evaluate(()=>{document.activeElement?.blur();scrollTo(0,0)});await page.waitForTimeout(100);await page.screenshot({path:path.join(out,name+'-'+width+'.png'),fullPage:true})}
  const measure=async()=>page.evaluate(()=>{
   const clipped=[];for(const e of document.querySelectorAll('.package-card-price,.package-card-name,.welcome-gift strong,.wf-earlybird-legend strong,.package-selected-head h3,.package-selected-features span,.events-discount-list h3')){if(!e.getClientRects().length)continue;const r=e.getBoundingClientRect(),w=document.createTreeWalker(e,NodeFilter.SHOW_TEXT);let n;while(n=w.nextNode()){const range=document.createRange();range.selectNodeContents(n);for(const t of range.getClientRects())if(t.left<r.left-1||t.right>r.right+1)clipped.push(e.textContent)}}const m=document.querySelector('main').getBoundingClientRect();return {overflow:Math.max(document.body.scrollWidth,document.documentElement.scrollWidth)-innerWidth,main:{x:m.x,width:m.width},clipped}
  })
  const layout=async()=>{const d=await measure();assert.equal(d.overflow,0);assert.deepEqual(d.clipped,[]);if(width>=780){assert.equal(d.main.width,780);assert.equal(d.main.x,(width-780)/2)}return d}
  for(const route of routes){
   await page.goto(base+route);await settled();const direct=await layout()
   assert.equal(await page.locator('.wistia-section-number').count(),0)
   assert.deepEqual(await page.locator('#mainMenu .menu-group').first().locator('a').allTextContents(),['AR 축가 사전녹음'])
   if(await page.locator('#packageSelection').count()){
    const order=await page.evaluate(()=>['#arcRecording','#arcKey','#arcTuning','#soloPoint04','[data-solo-map]','#packageSelection'].map(s=>document.querySelector(s).getBoundingClientRect().top+scrollY));assert.ok(order.every((v,i,a)=>i===0||v>a[i-1]))
    assert.equal(await page.locator('.package-information').count(),0);assert.ok(!(await page.locator('main').textContent()).includes('예약 전에 확인하세요'))
    assert.equal(await page.locator('.package-selected-features svg,.package-selected-saving s').count(),0)
    for(const key of ['A','B','C']){await page.locator('.package-card').filter({has:page.locator('input[value="'+key+'"]')}).click();await layout()}
    assert.equal(await page.locator('.hs-slide').count(),5);await page.locator('.hs-next').click();await page.waitForFunction(()=>document.querySelector('.hs-count').textContent==='2 / 5')
    assert.equal(await page.locator('.welcome-gift').count(),1)
    if(route==='/'&&(width===390||width===1280)){await page.locator('#packageSelection').screenshot({path:path.join(out,'type-C-'+width+'.png')})}
   }
   if(route==='/events'){
    assert.ok(await page.locator('.events-discounts').evaluate(e=>!!(e.compareDocumentPosition(document.querySelector('.events-payback'))&4)))
    assert.equal(await page.locator('.events-discount-list article').count(),3)
    assert.match(await page.locator('.events-payback').textContent(),/리뷰 작성 가이드 확인하기/)
    assert.match(await page.locator('.events-payback').textContent(),/얼굴 공개 및 인스타그램 게시에 동의/)
    if(width===390||width===1280)await shot('events-full')
   }
   await page.evaluate(target=>{history.pushState({},'','/info/faq');dispatchEvent(new PopStateEvent('popstate'));setTimeout(()=>{history.pushState({},'',target);dispatchEvent(new PopStateEvent('popstate'))},50)},route);await page.waitForTimeout(200);await settled();const spa=await layout();results.push({route,width,direct,spa})
  }
  await page.goto(base+'/contact?package=C');await settled();await page.evaluate(()=>localStorage.clear());await page.reload();await settled()
  const q=()=>page.evaluate(()=>WistiaWizard.quote(document.querySelector('form')))
  assert.deepEqual(await page.locator('.wf-progress small').allTextContents(),['상품','날짜','시간','옵션','확인'])
  assert.equal(await page.locator('[name="eventDate"],[name="paybackBlog"],[name="paybackReaction"]').count(),0)
  assert.match(await page.locator('.wf-people').textContent(),/2인\(듀엣곡\)으로 변경/);assert.ok(!(await page.locator('.wf-people').textContent()).includes('유지'))
  await page.locator('.welcome-toggle').click();assert.equal((await q()).total,160000)
  await page.locator('[name="people"][value="1"]').check();assert.equal((await q()).total,190000);assert.equal((await q()).minutes,120)
  if(width===390||width===1280)await shot('first-use')
  await page.locator('[data-wf-next]').click();assert.equal(await page.locator('[data-wf-date-view]').isVisible(),true);assert.equal(await page.locator('[data-wf-time-view]').isVisible(),false)
  assert.equal(await page.locator('[data-wf-advance-note]').isVisible(),false)
  await page.locator('[data-wf-next]').click();assert.equal(await page.locator('[data-wf-error="bookingDate"]').isVisible(),true)
  const dates=await page.evaluate(()=>{const today=WistiaPackages.today(),one=WistiaPackages.addMonths(today,1),two=WistiaPackages.addMonths(today,2),d=new Date(two+'T12:00:00Z');while(d.getUTCDay()!==4)d.setUTCDate(d.getUTCDate()+1);return {one,two,target:d.toISOString().slice(0,10)}})
  const legend=await page.locator('.wf-earlybird-legend').textContent();assert.ok(legend.includes(Number(dates.one.slice(5,7))+'월 '+Number(dates.one.slice(8,10))+'일'));assert.ok(legend.includes('20,000원'))
  await page.locator('[data-calendar-year]').selectOption(dates.target.slice(0,4));await page.locator('[data-calendar-month]').selectOption(String(Number(dates.target.slice(5,7))-1))
  await page.waitForFunction(date=>!document.querySelector('[data-calendar-day="'+date+'"]')?.disabled,dates.target)
  assert.equal(await page.locator('[data-calendar-day="'+dates.target+'"]').getAttribute('data-discount'),'20000')
  await page.locator('[data-calendar-day="'+dates.target+'"]').click()
  await page.waitForFunction(()=>document.querySelector('form').dataset.scheduleState==='ready')
  assert.equal(await page.evaluate(()=>WistiaWizard.currentStep(document.querySelector('form'))),2,'calendar selection stays in date step')
  assert.match(await page.locator('[data-wf-advance-note]').textContent(),/20,000원 할인 적용/)
  if(width===390||width===1280)await shot('calendar-two-months')
  await page.locator('[data-wf-next]').click();assert.equal(await page.locator('[data-wf-date-view]').isVisible(),false);assert.equal(await page.locator('[data-wf-time-view]').isVisible(),true)
  await page.locator('[data-wf-next]').click();assert.equal(await page.locator('[data-wf-error="timeStart"]').isVisible(),true)
  const available=await page.locator('[data-wf-time]:not(:disabled):has(.wf-time-discount)').first().getAttribute('data-wf-time')
  await page.locator('[data-wf-time="'+available+'"]').click();assert.equal((await q()).discount,40000);assert.equal((await q()).total,160000)
  if(width===390||width===1280)await shot('discounted-time')
  await page.reload();await settled();await page.waitForFunction(()=>document.querySelector('form').dataset.scheduleState==='ready');assert.equal((await q()).total,160000)
  await page.locator('[data-wf-next]').click();assert.match(await page.locator('[data-wf-option="tuning"] strong').textContent(),/패키지에 포함되어 있어요/)
  await page.locator('[name="extraHour"]').check();assert.equal((await q()).minutes,180);assert.equal((await q()).total,210000);await page.waitForFunction(()=>document.querySelector('form').dataset.scheduleState==='ready')
  assert.equal(await page.locator('[data-wf-time="21:00"]').isDisabled(),true)
  if(width===390||width===1280)await shot('options')
  await page.locator('[data-wf-next]').click();await page.locator('[name="specialNotes"]').fill('새 문의 흐름 검수 · 실제 제출하지 않음')
  const text=await page.evaluate(()=>WistiaWizard.text(document.querySelector('form')));assert.ok(!/페이백|결혼식|예식일/.test(text));assert.match(text,/2인\(듀엣곡\)/);assert.match(text,/총 결제 금액 : 210,000원/)
  if(width===390||width===1280)await shot('summary')
  await layout()
  await page.evaluate(()=>{localStorage.setItem('wistia:inquiry-draft:v1:solo',JSON.stringify({version:1,savedAt:Date.now(),step:4,fields:{package:'A',bookingDate:WistiaPackages.addMonths(WistiaPackages.today(),2),timeStart:'15:00',eventDate:'2027-01-10',paybackBlog:'1',paybackReaction:'1',specialNotes:'이전 초안'},wedding:{year:'2027',month:'1',day:'10'}}))})
  await page.goto(base+'/contact');await settled();assert.equal(await page.locator('[name="eventDate"]').count(),0);assert.equal((await q()).payback,0);assert.ok(!/페이백|결혼식/.test(await page.evaluate(()=>WistiaWizard.text(document.querySelector('form')))))
  console.log(width+' gift, 5 separate steps, calendar discounts, options, restored POINT order and SPA passed');await ctx.close()
 }
 const ctx=await b.newContext({viewport:{width:390,height:900},isMobile:true,hasTouch:true,reducedMotion:'no-preference'}),p=await ctx.newPage();await p.goto(base+'/contact');await p.waitForFunction(()=>document.querySelector('.welcome-toggle'));await p.locator('.welcome-toggle').click();assert.equal(await p.locator('.wf-welcome .benefit-confetti i').count(),16);await p.waitForTimeout(1800);assert.equal(await p.locator('.benefit-confetti').count(),0);await ctx.close()
 assert.deepEqual(errors,[]);fs.writeFileSync(path.join(out,'results.json'),JSON.stringify({results,errors,checks:['63 direct and 63 SPA layouts','mobile 320/360/375/390/430 and PC 780/1280','original POINT order and picker after map','five original photos and navigation preserved','gift card and 16 short-lived confetti pieces','work dividers without check icons or crossed-out comparison','product menu unified','separate date/time steps, no wedding or payback selection','colored calendar boundaries match actual quote','included wording and no duplicate charge','old drafts drop removed fields','no real submission or Kakao message']},null,2))
}finally{await b.close()}})().catch(e=>{console.error(e);process.exitCode=1})
