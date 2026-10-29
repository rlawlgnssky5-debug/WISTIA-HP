const {chromium}=require('C:/Users/User/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright'),fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict')
const base=process.env.WISTIA_QA_BASE||'http://127.0.0.1:4319',phase=process.env.WISTIA_QA_PHASE||'local',out=path.resolve(__dirname,'../output/option-hour-late-20261030',phase)
;(async()=>{fs.mkdirSync(out,{recursive:true});const results=[],errors=[],browser=await chromium.launch({executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',headless:true})
 try{for(const width of (phase==='production'?[390,1280]:[320,360,375,390,414,780,1280])){
  const c=await browser.newContext({viewport:{width,height:1000},isMobile:width<780,hasTouch:width<780,timezoneId:'Asia/Seoul'});await c.route('**/*',r=>{if(/facebook\.com|connect\.facebook|google-analytics|googletagmanager/.test(r.request().url()))return r.abort();assert.equal(r.request().method(),'GET');assert.doesNotMatch(r.request().url(),/pf\.kakao|kakaolink/);return r.continue()})
  if(phase==='local')await c.route('**/api/availability?*',r=>r.fulfill({json:{ok:true,...Object.fromEntries(new URL(r.request().url()).searchParams),blocks:[]}}))
  const page=await c.newPage();page.on('pageerror',e=>errors.push(e.message))
  for(const key of ['A','B','C','D']){
   await page.goto(base+'/contact?package='+key);await page.locator('[data-wf-goto="0"]').click();await page.locator('.package-card[data-tier="'+key+'"]').click()
   if(key!=='D'){assert.equal(await page.locator('[data-wf-tip="people"]').innerText(),'듀엣 패키지로 하면 더 가성비 있어요!');if(width===390&&key==='A')await page.locator('.wf-people').screenshot({path:path.join(out,'duet-value-copy.png')})}
   await page.evaluate(()=>{const input=document.querySelector('[name="bookingDate"]');input.value='2026-11-05';input.dispatchEvent(new Event('change',{bubbles:true}))})
   await page.waitForFunction(()=>document.querySelector('form').dataset.scheduleState==='ready',{},{timeout:20000})
   await page.locator('[data-wf-goto="1"]').click();const late=page.locator('[data-wf-time="23:00"]');assert.equal(await late.isDisabled(),false,key+' 23:00');await late.click()
   assert.equal(await page.locator('#contact-time').inputValue(),'23:00')
   await page.locator('[data-wf-goto="2"]').click();await page.locator('[data-wf-step="2"]:not([hidden])').waitFor()
   const tip=page.locator('[data-wf-tip="extraHour"]');assert.equal(await tip.isVisible(),['A','B'].includes(key),key+' premium tip')
   if(['A','B'].includes(key))assert.equal(await tip.innerText(),'프리미엄 패키지에 포함되어 있어요!')
   for(const name of ['tuning','detailMix','precisionMix']){const t=page.locator('[data-wf-tip="'+name+'"]');assert.equal(await t.isVisible(),key==='A');if(key==='A')assert.equal(await t.innerText(),'디럭스 패키지에 포함되어 있어요!')}
   const row=page.locator('[data-wf-option="extraHour"]');assert.match(await row.innerText(),/녹음 1시간 추가/)
   if(key!=='D'){assert.equal(await row.locator('strong').innerText(),'+60,000원');await row.locator('.wf-check-row').click()}
   const quote=await page.evaluate(()=>{const f=document.querySelector('form'),q=WistiaWizard.quote(f);return {total:q.total,minutes:q.minutes,text:WistiaWizard.text(f),range:f.querySelector('[data-wf-recording-range]').textContent,overflow:document.documentElement.scrollWidth-innerWidth,main:document.querySelector('main').getBoundingClientRect().width}})
   assert.equal(quote.total,{A:150000,B:230000,C:280000,D:240000}[key]);assert.equal(quote.minutes,{A:110,B:150,C:210,D:150}[key]);assert.equal(quote.overflow,0);if(width===1280)assert.equal(quote.main,780)
   assert.match(quote.range,/23:00~다음 날/);assert.doesNotMatch(quote.text,/녹음 50분|더 저렴해요/);if(key!=='D')assert.match(quote.text,/\(추가\) 녹음 1시간 추가/)
   if([390,1280].includes(width)){await page.waitForTimeout(450);await page.locator('[data-wf-step="2"]').screenshot({path:path.join(out,'options-'+key+'-'+width+'.png')})}
   if(key!=='D'){await page.reload();await page.locator('[data-wf-step="2"]:not([hidden])').waitFor();assert.equal(await page.locator('[name="extraHour"]').isChecked(),true);const restored=await page.evaluate(()=>WistiaWizard.quote(document.querySelector('form')).total);assert.equal(restored,quote.total)}
   if(width===390&&key==='C'){await page.locator('[data-wf-goto="1"]').click();await page.locator('[data-wf-time="23:00"]').scrollIntoViewIfNeeded();await page.waitForTimeout(450);await page.screenshot({path:path.join(out,'late-start-C-390.png')})}
   results.push({width,key,total:quote.total,minutes:quote.minutes,range:quote.range,overflow:quote.overflow});await page.evaluate(()=>localStorage.clear())
  }
  await c.close();console.log('PASS '+width+' A/B/C/D copy, 23:00, extra hour, quote and reload')
 }assert.deepEqual(errors,[])
 }finally{await browser.close();fs.writeFileSync(path.join(out,'results.json'),JSON.stringify({base,phase,results,errors},null,2))}
 console.log('PASS '+results.length+' type/width flows')
})().catch(e=>{console.error(e);process.exitCode=1})
