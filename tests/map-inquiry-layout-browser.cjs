const {chromium}=require('C:/Users/User/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright')
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path')
const base=process.env.WISTIA_QA_BASE||'http://127.0.0.1:4274',phase=process.env.WISTIA_QA_PHASE||'local',out=path.resolve(__dirname,'../output/map-inquiry-layout-20261028',phase),place='https://map.kakao.com/?q=%EC%9C%84%EC%8A%A4%ED%8B%B0%EC%95%84&itemId=389994210'
;(async()=>{fs.mkdirSync(out,{recursive:true});const b=await chromium.launch({executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',headless:true}),results=[],errors=[]
 try{for(const width of [303,320,360,375,390,414,780,822,1280]){
  const c=await b.newContext({viewport:{width,height:1000},isMobile:width<780,hasTouch:width<780,timezoneId:'Asia/Seoul'})
  await c.route(/facebook\.com|connect\.facebook|google-analytics|googletagmanager/,r=>r.abort());await c.route('**/api/limited-coupon',r=>r.fulfill({json:{ok:true,remaining:17,claimed:false,closed:false,canClaim:true,inCooldown:false}}));await c.route('**/api/availability?*',r=>r.fulfill({json:{ok:true,...Object.fromEntries(new URL(r.request().url()).searchParams),blocks:[]}}));await c.route('**/*',r=>{assert.equal(r.request().method(),'GET');assert.doesNotMatch(r.request().url(),/pf\.kakao|kakaolink/);return r.fallback()})
  await c.route(place,r=>r.fulfill({contentType:'text/html',body:'<title>Registered map destination fixture</title>'}))
  const p=await c.newPage();p.on('pageerror',e=>errors.push(e.message))
  for(const route of ['/','/detail/solo','/info/location']){
   assert.equal((await p.goto(base+route)).status(),200);await p.waitForSelector('a[href*="map.kakao.com"]');const links=await p.locator('a[href*="map.kakao.com"]').evaluateAll(nodes=>nodes.map(e=>({href:e.href,target:e.target,rel:e.rel})));assert.ok(links.length>0);assert.ok(links.every(l=>l.href===place&&l.target==='_blank'&&l.rel.includes('noopener')))
   if([390,1280].includes(width)){const [popup]=await Promise.all([p.waitForEvent('popup'),p.locator('a[href="'+place+'"]').first()[width<780?'tap':'click']()]);await popup.waitForLoadState('domcontentloaded');assert.equal(popup.url(),place);await popup.close()}
   results.push({width,route,map:'registered place'})
  }
  for(const route of ['/contact','/event/solo','/event/duo']){
   await p.goto(base+route+'?package=D');await p.waitForSelector('[data-wf-location-duration] .wf-location-session');await p.locator('[data-wf-goto="0"]').click()
   for(const tier of ['A','B','C','D']){
    await p.locator('.package-card[data-tier="'+tier+'"]').click();await p.evaluate(()=>document.fonts.ready)
    const m=await p.locator('.wf-location-bar').evaluate(e=>{const box=e.getBoundingClientRect(),title=e.querySelector('strong').getBoundingClientRect(),address=e.querySelector('small').getBoundingClientRect(),meta=e.querySelector('[data-wf-location-duration]').getBoundingClientRect(),bad=[];for(const el of e.querySelectorAll('strong,small,[data-wf-location-duration],.wf-location-session')){const r=el.getBoundingClientRect(),range=document.createRange();range.selectNodeContents(el);for(const t of range.getClientRects())if(t.left<r.left-1||t.right>r.right+1)bad.push(el.textContent)}return {overflow:document.documentElement.scrollWidth-innerWidth,main:document.querySelector('main').getBoundingClientRect().width,titleRight:title.right,metaLeft:meta.left,metaRight:meta.right,right:box.right,addressTop:address.top,contentBottom:Math.max(title.bottom,meta.bottom),bad,text:e.innerText,height:box.height,metaColumn:getComputedStyle(e.querySelector('[data-wf-location-duration]')).gridColumnStart}})
    assert.equal(m.overflow,0,JSON.stringify({width,route,tier,m}));assert.deepEqual(m.bad,[]);assert.equal(m.metaColumn,'3');assert.ok(m.titleRight+6<=m.metaLeft,JSON.stringify({width,route,tier,m}));assert.ok(Math.abs(m.metaRight-m.right)<2);assert.ok(m.addressTop>=m.contentBottom);assert.ok(m.text.includes('석천로170번길 19, 부광프라자 2층'));if(width>=780)assert.equal(m.main,780)
    const expected=await p.evaluate(()=>{const q=WistiaWizard.quote(document.querySelector('form'));return {name:q.package.name,time:WistiaPackages.hoursText(q.minutes)}});const duration=await p.locator('[data-wf-location-duration]').innerText();assert.ok(duration.includes(expected.name));assert.ok(duration.includes(expected.time))
    if(tier==='D'&&route==='/contact'&&[320,390,780,1280].includes(width))await p.locator('.wf-location-bar').screenshot({path:path.join(out,'duet-right-'+width+'.png')})
    results.push({width,route,tier,layout:m})
   }
  }await c.close()
 }assert.deepEqual(errors,[])}finally{await b.close();fs.writeFileSync(path.join(out,'results.json'),JSON.stringify({base,results,errors},null,2))}
 console.log('PASS '+results.length+' registered-map and right-aligned inquiry checks')
})().catch(e=>{console.error(e);process.exitCode=1})
