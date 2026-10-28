const {chromium}=require('C:/Users/User/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright')
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict')
const base=process.env.WISTIA_QA_BASE||'http://127.0.0.1:4272',phase=process.env.WISTIA_QA_PHASE||'local',out=path.resolve(__dirname,'../output/coupon-particles-visible-20261028',phase)
;(async()=>{
 const b=await chromium.launch({executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',headless:true}),results=[],errors=[]
 fs.mkdirSync(out,{recursive:true})
 try{
  for(const motion of ['no-preference','reduce','native'])for(const width of (motion==='no-preference'?[360,375,390,414,1280]:[390,1280]))for(const route of (motion==='native'?['/']:['/','/contact'])){
   const c=await b.newContext({viewport:{width,height:1000},isMobile:width<780,hasTouch:width<780,timezoneId:'Asia/Seoul',...(motion==='native'?{}:{reducedMotion:motion})})
   await c.route(/facebook\.com|connect\.facebook|google-analytics|googletagmanager/,r=>r.abort())
   await c.route('**/api/availability?*',r=>r.fulfill({json:{ok:true,...Object.fromEntries(new URL(r.request().url()).searchParams),blocks:[]}}))
   let owned=false,issuedAt=Date.now()
   await c.route('**/api/limited-coupon',r=>{const fresh=r.request().method()==='POST'&&!owned;if(fresh){owned=true;issuedAt=Date.now()}return r.fulfill({json:{ok:true,remaining:owned?19:20,claimed:owned,expired:false,expiresAt:owned?new Date(issuedAt+86400000).toISOString():null,serverNow:new Date().toISOString(),closed:false,newlyClaimed:fresh,canClaim:!owned,inCooldown:owned}})})
   await c.route('**/*',r=>{if(new URL(r.request().url()).pathname==='/api/limited-coupon')return r.fallback();assert.equal(r.request().method(),'GET');assert.doesNotMatch(r.request().url(),/pf\.kakao|kakaolink/);return r.fallback()})
   const p=await c.newPage();p.on('pageerror',e=>errors.push(e.message));await p.goto(base+route+'?package=B');await p.waitForSelector('[data-coupon-claim]');await p.waitForFunction(()=>WistiaLimitedCoupon.state.ready);await p.evaluate(()=>document.fonts.ready)
   const reduced=await p.evaluate(()=>matchMedia('(prefers-reduced-motion: reduce)').matches)
   for(const key of ['firstVisit','yearEndCoupon']){
    const card=p.locator('[data-coupon-card="'+key+'"]'),button=card.locator('button')
    await card.evaluate(el=>scrollTo({top:el.getBoundingClientRect().top+scrollY-(innerHeight-el.getBoundingClientRect().height)/2,behavior:'instant'}))
    const before=await p.evaluate(()=>scrollY),r=await button.boundingBox()
    if(width<780)await p.touchscreen.tap(r.x+r.width/2,r.y+r.height/2);else await p.mouse.click(r.x+r.width/2,r.y+r.height/2)
    await p.waitForTimeout(140)
    const first=await card.locator('.coupon-particle-layer').evaluate(el=>[...el.children].map(bit=>getComputedStyle(bit).transform))
    await p.waitForTimeout(310)
    const m=await card.evaluate(el=>{
     const r=el.getBoundingClientRect(),layer=el.querySelector('.coupon-particle-layer'),lr=layer.getBoundingClientRect(),bits=[...layer.children].map(bit=>{const s=getComputedStyle(bit),b=bit.getBoundingClientRect();return {opacity:+s.opacity,display:s.display,animation:s.animationName,transform:s.transform,width:b.width,height:b.height,left:b.left,right:b.right,top:b.top,bottom:b.bottom}})
     const visible=bits.filter(b=>b.opacity>.5&&b.display!=='none'&&b.right>Math.max(r.left,0)&&b.left<Math.min(r.right,innerWidth)&&b.bottom>Math.max(r.top,0)&&b.top<Math.min(r.bottom,innerHeight))
     return {cardWidth:r.width,layerDisplay:getComputedStyle(layer).display,visible:visible.length,spread:Math.max(...visible.map(b=>Math.min(b.right,r.right)))-Math.min(...visible.map(b=>Math.max(b.left,r.left))),large:visible.filter(b=>b.width>=12&&b.height>=12).length,bits,overflow:document.documentElement.scrollWidth-innerWidth}
    })
    assert.equal(m.layerDisplay,'block');assert.equal(m.overflow,0);assert.equal(await button.getAttribute('aria-pressed'),'true');assert.ok(Math.abs(await p.evaluate(()=>scrollY)-before)<=1)
    assert.ok(m.visible>=(reduced?8:28),JSON.stringify({width,route,motion,m}));assert.ok(m.spread>=m.cardWidth*.65,JSON.stringify({width,route,motion,m}));assert.ok(m.large>=(reduced?5:16),JSON.stringify({width,route,motion,m}))
    if(reduced){assert.ok(m.bits.every(bit=>bit.animation==='none'));assert.deepEqual(m.bits.map(bit=>bit.transform),first)}else{assert.ok(m.bits.some((bit,i)=>bit.transform!==first[i]),'particles must actually move, not just exist')}
    if([390,1280].includes(width)&&motion!=='native'){
     await card.evaluate(el=>el.querySelectorAll('.coupon-particle-layer i').forEach(bit=>bit.getAnimations().forEach(a=>{a.pause();a.currentTime=450})))
     await card.screenshot({path:path.join(out,motion+'-'+(route==='/'?'main':'form')+'-'+key+'-'+width+'.png')})
     await card.evaluate(el=>el.querySelectorAll('.coupon-particle-layer i').forEach(bit=>bit.getAnimations().forEach(a=>a.play())))
    }
    results.push({width,route,motion,reduced,key,visible:m.visible,spread:m.spread,large:m.large})
   }
   await p.waitForTimeout(1900);assert.equal(await p.locator('.coupon-particle-layer').count(),0,'temporary feedback must clean up')
   await c.close()
  }
  assert.deepEqual(errors,[])
 }finally{await b.close();fs.writeFileSync(path.join(out,'visibility-results.json'),JSON.stringify({base,results,errors},null,2))}
 console.log('PASS '+results.length+' painted particle visibility, real animation, reduced motion, native preference, raw tap and cleanup checks')
})().catch(e=>{console.error(e);process.exitCode=1})
