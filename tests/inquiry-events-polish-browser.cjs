const {chromium}=require('C:/Users/User/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright')
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict')
const base=process.env.WISTIA_QA_BASE||'http://127.0.0.1:4272',phase=process.env.WISTIA_QA_PHASE||'local',out=path.resolve(__dirname,'../output/inquiry-events-polish-20261028',phase)
;(async()=>{
 const b=await chromium.launch({executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',headless:true}),results=[],errors=[]
 fs.mkdirSync(out,{recursive:true})
 try{for(const width of [320,360,375,390,414,780,822,1280]){
  const c=await b.newContext({viewport:{width,height:1000},isMobile:width<780,hasTouch:width<780,timezoneId:'Asia/Seoul'})
  await c.route(/facebook\.com|connect\.facebook|google-analytics|googletagmanager/,r=>r.abort())
  await c.route('**/api/availability?*',r=>r.fulfill({json:{ok:true,...Object.fromEntries(new URL(r.request().url()).searchParams),blocks:[]}}))
  await c.route('**/*',r=>{assert.equal(r.request().method(),'GET');assert.doesNotMatch(r.request().url(),/pf\.kakao|kakaolink/);return r.fallback()})
  const p=await c.newPage();p.on('pageerror',e=>errors.push(e.message))
  const layout=async route=>{
   const m=await p.evaluate(()=>{const header=document.querySelector('#siteHeader').getBoundingClientRect(),s=getComputedStyle(document.body);return {headerHeight:header.height,headerBottom:header.bottom,padding:parseFloat(s.paddingTop),main:document.querySelector('main').getBoundingClientRect().width,overflow:document.documentElement.scrollWidth-innerWidth,toggle:document.querySelector('#menuToggle').getBoundingClientRect().height}})
   assert.equal(m.overflow,0,JSON.stringify({width,route,m}));assert.equal(m.headerHeight,width<780?52:104);assert.equal(m.padding,m.headerHeight);assert.ok(m.toggle>=44);if(width>=780)assert.equal(Math.round(m.main),780)
   await p.locator('#menuToggle').click();assert.equal(await p.locator('#menuToggle').getAttribute('aria-expanded'),'true');const menu=await p.locator('#mainMenu').boundingBox();assert.ok(Math.abs(menu.y-m.headerBottom)<=1,JSON.stringify({width,route,menu,m}));await p.keyboard.press('Escape');assert.equal(await p.locator('#menuToggle').getAttribute('aria-expanded'),'false')
   return m
  }
  for(const route of ['/','/detail/solo']){
   assert.equal((await p.goto(base+route+'?package=B')).status(),200);await p.waitForSelector('.ed-hero-price-jump');await layout(route)
   assert.equal(await p.locator('[data-mobile-gallery] .mas-gallery-slide').count(),5)
   await p.locator('[data-hs-step="1"]').click();await p.waitForTimeout(500);assert.match(await p.locator('.hs-count').innerText(),/02/);await p.locator('[data-hs-step="-1"]').click()
   const styles=await p.evaluate(()=>{const t=document.querySelector('#arcTuning'),r=document.querySelector('#soloPoint04'),reviews=document.querySelector('.arc-reviews .ed-reviews');return {tuning:getComputedStyle(t,'::before').backgroundColor,ratio:getComputedStyle(r,'::before').backgroundColor,curve:getComputedStyle(reviews).borderBottomLeftRadius,worry:getComputedStyle(document.querySelector('.ed-worries')).background}})
   assert.notEqual(styles.tuning,styles.ratio);assert.ok(parseFloat(styles.curve)>0);assert.ok(styles.worry.includes('radial-gradient'))
   const before=await p.evaluate(()=>location.pathname);await p.locator('.ed-hero-price-jump').click();await p.waitForFunction(()=>{const y=document.querySelector('#packageSelection').getBoundingClientRect().top,h=document.querySelector('#siteHeader').getBoundingClientRect().height;return y>=h-1&&y<h+70},null,{timeout:6000});assert.equal(await p.evaluate(()=>location.pathname),before)
   const target=await p.locator('#packageSelection').boundingBox(),head=await p.locator('#siteHeader').boundingBox();assert.ok(target.y>=head.height-1&&target.y<head.height+70,JSON.stringify({width,target,head}))
   assert.ok(await p.locator('[data-solo-map]').evaluate(e=>!!(e.compareDocumentPosition(document.querySelector('#packageSelection'))&Node.DOCUMENT_POSITION_FOLLOWING)))
   if(route==='/'&&[390,1280].includes(width)){
    for(const [name,sel] of [['price-jump','.ed-hero-actions'],['curve','.arc-reviews'],['point3','#arcTuning'],['point4','#soloPoint04']])await p.locator(sel).screenshot({path:path.join(out,name+'-'+width+'.png'),style:'#siteHeader,.floating-kakao-pill,.solo-footer-inquiry,.skip-link{visibility:hidden!important}'})
   }
   results.push({width,route,type:'hero, price jump, gallery, section colours and arch',...styles})
  }
  assert.equal((await p.goto(base+'/events')).status(),200);await p.waitForSelector('.pb-clean');await layout('/events')
  const payback=await p.locator('.pb-clean').innerText();for(const phrase of ['60,000원','30,000원','일 방문자 100명','가이드','링크','얼굴 공개','인스타그램','편집','미리 차감하지','환급','하나씩 참여'])assert.ok(payback.includes(phrase),phrase)
  assert.equal(await p.locator('.pb-card').count(),2);assert.equal(await p.locator('.pb-steps li').count(),6);assert.equal(await p.locator('.pb-clean .ev2-bar,.pb-clean .ev2-note').count(),0)
  if([390,1280].includes(width))await p.locator('.pb-clean').screenshot({path:path.join(out,'payback-'+width+'.png'),style:'#siteHeader,.floating-kakao-pill,.skip-link{visibility:hidden!important}'})
  results.push({width,route:'/events',type:'payback layout and all participation/refund conditions'})
  assert.equal((await p.goto(base+'/info/faq')).status(),200);await p.waitForSelector('.info-page-faq');await layout('/info/faq')
  const faq=p.locator('details').filter({has:p.locator('summary',{hasText:'녹음은 현장에서 어떻게 진행되나요?'})});assert.equal(await faq.count(),1);await faq.locator('summary').click();const answer=await faq.innerText();assert.ok(answer.includes('한 구간씩'));assert.doesNotMatch(answer,/240,000|원이에요|패키지/)
  results.push({width,route:'/info/faq',type:'process answer has no price or package upsell'})
  assert.equal((await p.goto(base+'/info/location')).status(),200);await p.waitForSelector('.lc2');await layout('/info/location');results.push({width,route:'/info/location',type:'header, menu and canvas'})
  for(const route of ['/contact','/event/solo','/event/duo']){
   await p.goto(base+route+'?package=A');await p.waitForSelector('[data-wf-people-add]',{state:'attached'});await layout(route);await p.locator('[data-wf-goto="0"]').click()
   await p.locator('[name="people"][value="0"]').locator('..').click();await p.locator('[data-wf-goto="1"]').click()
   const title=await p.locator('[data-wf-step="1"] h2').boundingBox();assert.ok(title.y<(width<780?340:500),JSON.stringify({width,route,title}))
   const date=await p.evaluate(()=>{const d=new Date(WistiaPackages.today()+'T12:00:00+09:00');d.setDate(d.getDate()+7);while([1,2,3].includes(d.getDay()))d.setDate(d.getDate()+1);return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0')})
   await p.evaluate(date=>{const e=document.querySelector('[name="bookingDate"]');document.querySelector('[name="bookingDateMode"][value="date"]').checked=true;e.value=date;e.dispatchEvent(new Event('change',{bubbles:true}))},date)
   await p.waitForFunction(()=>document.querySelector('form').dataset.scheduleState!=='loading');await p.locator('#contact-time').selectOption('18:00',{force:true});await p.locator('[data-wf-goto="2"]').click();await p.waitForSelector('[data-wf-step="2"]:not([hidden])')
   const q=()=>p.evaluate(()=>{const f=document.querySelector('form'),q=WistiaWizard.quote(f);return {total:q.total,minutes:q.minutes,people:q.v.people,duetLines:q.options.filter(o=>o[0]==='2인(듀엣곡) 변경').length,fields:[...new FormData(f).keys()],peopleValues:new FormData(f).getAll('people'),text:WistiaWizard.text(f)}})
   const start=await q(),proxy=p.locator('[data-wf-people-add]');assert.equal(start.people,'0');assert.equal(await proxy.isChecked(),false)
   await p.locator('[data-wf-option="people"] .wf-check-row')[width<780?'tap':'click']();const added=await q();assert.equal(added.total,start.total+30000);assert.equal(added.minutes,start.minutes);assert.equal(added.people,'1');assert.equal(added.peopleValues.length,1);assert.ok(!added.fields.includes('peopleAdd'));assert.ok(added.text.includes('2인(듀엣곡) 변경'))
   await p.reload();await p.waitForSelector('[data-wf-step="2"]:not([hidden])');assert.equal(await proxy.isChecked(),true);assert.equal((await q()).total,added.total)
   await p.locator('[data-wf-goto="0"]').click();assert.equal(await p.locator('[name="people"][value="1"]').isChecked(),true);await p.locator('[name="people"][value="0"]').locator('..').click();await p.locator('[data-wf-goto="2"]').click();assert.equal(await proxy.isChecked(),false);assert.equal((await q()).total,start.total)
   for(const key of ['B','C','D','A']){
    await p.locator('[data-wf-goto="0"]').click();await p.locator('.package-card[data-tier="'+key+'"]').click();await p.locator('[data-wf-goto="2"]').click();await p.waitForSelector('[data-wf-step="2"]:not([hidden])')
    if(key==='D'){assert.equal(await proxy.isDisabled(),true);assert.equal(await proxy.isChecked(),true);assert.equal((await q()).total,240000);assert.match(await p.locator('[data-wf-option="people"] strong').innerText(),/포함/)}else{assert.equal(await proxy.isDisabled(),false);const prior=await q();await p.locator('[data-wf-option="people"] .wf-check-row')[width<780?'tap':'click']();const next=await q();assert.equal(next.total-prior.total,prior.people==='1'?-30000:30000);await p.locator('[data-wf-option="people"] .wf-check-row')[width<780?'tap':'click']()}
   }
   assert.equal(await p.locator('.package-extra-options > [data-wf-tip]').count(),0);assert.equal(await p.locator('[data-wf-option]').count(),6)
   if(route==='/contact'&&[390,1280].includes(width)){await p.waitForTimeout(500);await p.locator('[data-wf-step="2"]').screenshot({path:path.join(out,'duet-option-'+width+'.png'),style:'#siteHeader,.floating-kakao-pill,.wf-nav,.skip-link{visibility:hidden!important}'});await p.locator('[data-wf-goto="1"]').click();await p.screenshot({path:path.join(out,'compact-date-'+width+'.png')})}
   results.push({width,route,type:'compact header, mirrored people choice, single fee, reload, D inclusion and all types'})
  }
  await c.close()
 }assert.deepEqual(errors,[])
 }finally{await b.close();fs.writeFileSync(path.join(out,'results.json'),JSON.stringify({base,results,errors},null,2))}
 console.log('PASS '+results.length+' requested-polish page/viewport checks, including mirrored duet pricing and all page headers')
})().catch(e=>{console.error(e);process.exitCode=1})
