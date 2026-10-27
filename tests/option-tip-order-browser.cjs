const {chromium}=require('C:/Users/User/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright')
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict')
const base=process.env.WISTIA_QA_BASE||'http://127.0.0.1:4272',phase=process.env.WISTIA_QA_PHASE||'local',out=path.resolve(__dirname,'../output/option-tip-order-20261028',phase)
;(async()=>{
 const b=await chromium.launch({executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',headless:true}),results=[],errors=[]
 fs.mkdirSync(out,{recursive:true})
 try{for(const width of [320,360,375,390,414,780,822,1280]){
  const c=await b.newContext({viewport:{width,height:1000},isMobile:width<780,hasTouch:width<780,timezoneId:'Asia/Seoul'})
  await c.route(/facebook\.com|connect\.facebook|google-analytics|googletagmanager/,r=>r.abort())
  await c.route('**/api/availability?*',r=>r.fulfill({json:{ok:true,...Object.fromEntries(new URL(r.request().url()).searchParams),blocks:[]}}))
  await c.route('**/*',r=>{assert.equal(r.request().method(),'GET');assert.doesNotMatch(r.request().url(),/pf\.kakao|kakaolink/);return r.fallback()})
  const p=await c.newPage();p.on('pageerror',e=>errors.push(e.message))
  for(const route of ['/contact','/event/solo','/event/duo']){
   await p.goto(base+route+'?package=A');await p.waitForSelector('.package-card[data-tier="B"]',{state:'attached'})
   const date=await p.evaluate(()=>{const d=new Date(WistiaPackages.today()+'T12:00:00+09:00');d.setDate(d.getDate()+7);while([1,2,3].includes(d.getDay()))d.setDate(d.getDate()+1);return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0')})
   for(const key of ['B','A','C','A','D','B','A']){
    await p.locator('[data-wf-goto="0"]').click();await p.locator('.package-card[data-tier="'+key+'"]').click()
    // Fill only synthetic scheduling fields, never submit or open Kakao
    await p.evaluate(date=>{const form=document.querySelector('form'),input=form.querySelector('[name="bookingDate"]'),mode=form.querySelector('[name="bookingDateMode"][value="date"]');mode.checked=true;input.value=date;input.dispatchEvent(new Event('change',{bubbles:true}))},date)
    await p.waitForFunction(()=>document.querySelector('form').dataset.scheduleState!=='loading')
    await p.locator('#contact-time').selectOption('18:00',{force:true})
    await p.locator('[data-wf-goto="2"]').click();await p.waitForSelector('[data-wf-step="2"]:not([hidden])')
    const m=await p.evaluate(()=>{const fieldset=document.querySelector('.package-extra-options'),rows=[...fieldset.querySelectorAll('[data-wf-option]')],tips=[...fieldset.querySelectorAll('[data-wf-tip]')],rect=el=>{const r=el.getBoundingClientRect();return {left:r.left,right:r.right,top:r.top,bottom:r.bottom}};return {orphanTips:tips.filter(tip=>tip.closest('[data-wf-option]')?.dataset.wfOption!==tip.dataset.wfTip).map(t=>t.dataset.wfTip),rows:rows.map(row=>{const input=row.querySelector('input'),tip=row.querySelector('[data-wf-tip]'),label=row.querySelector('.wf-check-row');return {key:row.dataset.wfOption,disabled:input.disabled,tip:tip?{hidden:tip.hidden,display:getComputedStyle(tip).display,...rect(tip)}:null,label:rect(label)}}),overflow:document.documentElement.scrollWidth-innerWidth,main:document.querySelector('main').getBoundingClientRect().width,quote:WistiaWizard.quote(document.querySelector('form')).total}})
    assert.deepEqual(m.orphanTips,[],JSON.stringify({width,route,key,m}));assert.equal(m.rows.length,5);assert.equal(m.overflow,0);if(width===1280)assert.equal(m.main,780)
    let disabledSeen=false;for(const row of m.rows){if(row.disabled)disabledSeen=true;else assert.equal(disabledSeen,false,'included/disabled rows stay after selectable rows');if(row.tip){assert.equal(row.tip.hidden,row.disabled);if(!row.disabled){assert.notEqual(row.tip.display,'none');assert.ok(row.tip.bottom<=row.label.top+1);assert.ok(row.label.top-row.tip.bottom<=18);assert.ok(row.tip.left>=row.label.left-1);assert.ok(row.tip.right<=row.label.right+1)}}}
    const duetAdded=key!=='D'&&await p.locator('[name="people"]:checked').inputValue()==='1'?30000:0
    assert.equal(m.quote,{A:90000,B:170000,C:220000,D:240000}[key]+duetAdded)
    results.push({width,route,key,quote:m.quote,orphanTips:m.orphanTips,rows:m.rows.map(({key,disabled,tip})=>({key,disabled,tipHidden:tip?.hidden}))})
    if(route==='/contact'&&key==='A'&&[390,822,1280].includes(width))await p.locator('[data-wf-step="2"]').screenshot({path:path.join(out,'options-A-'+width+'.png')})
   }
   // Tuning changes rush eligibility and triggers another reorder without detaching any tip
   const tune=p.locator('[data-wf-option="tuning"] .wf-check-row');await tune.click();assert.equal(await p.locator('[name="tuning"]').isChecked(),true);await tune.click();assert.equal(await p.locator('[name="tuning"]').isChecked(),false)
   await p.reload();await p.waitForSelector('[data-wf-step="2"]:not([hidden])');assert.equal(await p.locator('.package-extra-options > [data-wf-tip]').count(),0);assert.equal(await p.locator('[data-wf-option] > [data-wf-tip]').count(),4)
  }
  await c.close()
 }assert.deepEqual(errors,[])
 }finally{await b.close();fs.writeFileSync(path.join(out,'results.json'),JSON.stringify({base,results,errors},null,2))}
 console.log('PASS '+results.length+' option tip grouping, repeated type switches, real options-step geometry, pricing and reload checks')
})().catch(e=>{console.error(e);process.exitCode=1})
