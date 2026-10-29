const {chromium}=require('C:/Users/User/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright')
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path')
const base=process.env.WISTIA_QA_BASE||'http://127.0.0.1:4319',phase=process.env.WISTIA_QA_PHASE||'local',out=path.resolve(__dirname,'../output/weekday-compact-20261030',phase)
;(async()=>{
 fs.mkdirSync(out,{recursive:true});const b=await chromium.launch({executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',headless:true}),results=[],errors=[]
 try{for(const width of [320,360,375,390,414,780,1280]){
  const context=await b.newContext({viewport:{width,height:1000},isMobile:width<780,hasTouch:width<780,timezoneId:'Asia/Seoul',reducedMotion:'reduce'})
  await context.route(/facebook\.com|connect\.facebook|google-analytics|googletagmanager/,r=>r.abort())
  await context.route('**/api/availability?*',r=>r.fulfill({json:{ok:true,...Object.fromEntries(new URL(r.request().url()).searchParams),blocks:[]}}))
  await context.route('**/api/limited-coupon',r=>r.fulfill({json:{ok:true,remaining:15,claimed:false,received:false,serverNow:new Date().toISOString(),canClaim:true,closed:false}}))
  await context.route('**/*',r=>{assert.equal(r.request().method(),'GET','never submit an inquiry or issue a real coupon');assert.doesNotMatch(r.request().url(),/pf\.kakao|kakaolink/);return r.fallback()})
  const page=await context.newPage();page.on('pageerror',e=>errors.push(e.message))
  for(const route of ['/contact','/event/solo','/event/duo']){
   await page.goto(base+route+'?package=C');await page.waitForSelector('form[data-wizard]');await page.locator('[data-wf-goto="1"]').click()
   const setDate=async date=>{await page.evaluate(date=>{const time=document.querySelector('[name="timeStart"]');time.value='';time.dispatchEvent(new Event('change',{bubbles:true}));const input=document.querySelector('[name="bookingDate"]');input.value=date;input.dispatchEvent(new Event('change',{bubbles:true}))},date);await page.waitForFunction(()=>document.querySelector('form[data-wizard]').dataset.scheduleState==='ready');await page.locator('[data-wf-time="13:00"]').waitFor();await page.evaluate(()=>document.fonts.ready)}
   const inspect=async(label,applied,maxHeight=74)=>{
    const m=await page.locator('[data-wf-weekday-note]').evaluate(el=>{const r=el.getBoundingClientRect(),style=getComputedStyle(el),bad=[];for(const node of el.querySelectorAll('.wf-weekday-copy,.wf-weekday-condition')){const box=node.getBoundingClientRect(),range=document.createRange();range.selectNodeContents(node);for(const text of range.getClientRects())if(text.left<box.left-1||text.right>box.right+1||text.top<r.top-1||text.bottom>r.bottom+1)bad.push(node.textContent)}return {width:r.width,height:r.height,applied:el.classList.contains('is-applied'),text:el.textContent,font:style.fontSize,bg:style.backgroundImage,bad,overflow:Math.max(0,document.documentElement.scrollWidth-innerWidth),gift:getComputedStyle(el,'::before').display,amount:getComputedStyle(el.querySelector('strong')||el).fontSize}})
    assert.equal(m.applied,applied,JSON.stringify({width,route,label,m}));assert.equal(m.overflow,0);assert.deepEqual(m.bad,[],JSON.stringify({width,route,label,m}));assert.ok(m.height<=maxHeight,JSON.stringify({width,route,label,m}));assert.equal(m.gift,'none');assert.ok(parseFloat(m.amount)<=14,JSON.stringify({width,route,label,m}));results.push({width,route,label,...m});return m
   }
   await setDate('2026-11-05');const before=await inspect('not selected',false)
   assert.match(before.bg,/linear-gradient/);assert.match(before.text,/公휴일|공휴일 제외/)
   await page.locator('[data-wf-time="13:00"]').click();const applied=await inspect('13:00 selected',true)
   assert.match(applied.text,/할인 적용/);assert.ok(Math.abs(applied.height-before.height)<1,'applied state should keep the same compact height')
   let q=await page.evaluate(()=>WistiaWizard.quote(document.querySelector('form[data-wizard]')));assert.equal(q.discounts.find(d=>d.key==='weekday').amount,10000);assert.equal(q.total,q.base+q.optionTotal-10000)
   if([390,780].includes(width)&&route==='/contact'){await page.locator('[data-wf-weekday-note]').evaluate(e=>e.scrollIntoView({block:'center'}));await page.locator('[data-wf-weekday-note]').screenshot({path:path.join(out,'applied-'+width+'.png')})}
   await page.locator('[data-wf-time="17:00"]').click();await inspect('17:00 no discount',false);q=await page.evaluate(()=>WistiaWizard.quote(document.querySelector('form[data-wizard]')));assert.equal(q.discounts.some(d=>d.key==='weekday'),false)
   if([390,780].includes(width)&&route==='/contact')await page.locator('[data-wf-weekday-note]').screenshot({path:path.join(out,'unselected-'+width+'.png')})
   await setDate('2026-12-25');await page.locator('[data-wf-time="13:00"]').click();const holiday=await inspect('Christmas excluded',false);assert.match(holiday.text,/공휴일은/);q=await page.evaluate(()=>WistiaWizard.quote(document.querySelector('form[data-wizard]')));assert.equal(q.discounts.some(d=>d.key==='weekday'),false)
   await setDate('2026-11-05');await page.locator('[data-wf-time="13:00"]').click();await page.reload();await page.waitForSelector('[data-wf-weekday-note].is-applied');await inspect('restored selection',true)
   if(width===390&&route==='/contact'){
    await page.addStyleTag({content:'.wf-weekday-copy,.wf-weekday-condition{zoom:1.25}'});await inspect('125 percent text',true,100)
   }
  }
  await context.close()
 }assert.deepEqual(errors,[])}finally{await b.close();fs.writeFileSync(path.join(out,'results.json'),JSON.stringify({base,results,errors},null,2))}
 console.log('PASS '+results.length+' compact banner, selected-time pricing, holiday and restore checks at 7 widths across 3 inquiry routes')
})().catch(e=>{console.error(e);process.exitCode=1})
