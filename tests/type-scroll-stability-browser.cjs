const {chromium}=require('C:/Users/User/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright')
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict')
const base=process.env.WISTIA_QA_BASE||'http://127.0.0.1:4212',phase=process.env.WISTIA_QA_PHASE||'before'
const out=path.resolve(__dirname,'../output/holiday-type-20261023',phase)
;(async()=>{fs.mkdirSync(out,{recursive:true});const b=await chromium.launch({executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',headless:true}),results=[],errors=[]
try{
 for(const [width,height] of (process.env.WISTIA_SCROLL_SIZES?process.env.WISTIA_SCROLL_SIZES.split(',').map(s=>s.split('x').map(Number)):[[320,568],[360,800],[375,812],[390,844],[430,932],[780,900],[1280,900]])){
  const c=await b.newContext({viewport:{width,height},isMobile:width<780,hasTouch:true,reducedMotion:process.env.WISTIA_SCROLL_MOTION||'reduce',timezoneId:'Asia/Seoul'})
  await c.route(/facebook\.com|connect\.facebook|google-analytics|googletagmanager/,r=>r.abort())
  const p=await c.newPage();p.on('pageerror',e=>errors.push(e.message))
  for(const route of (process.env.WISTIA_SCROLL_ROUTES?process.env.WISTIA_SCROLL_ROUTES.split(','):['/','/detail/solo','/detail/duo','/contact','/event/solo','/event/duo'])){
   await p.goto(base+route+'?package=C');await p.waitForFunction(()=>document.querySelector('.package-card'));await p.evaluate(()=>document.fonts.ready)
   // Load images above the selector first so lazy decoding is not mistaken for a selection jump.
   await p.evaluate(async()=>{for(let y=0;y<document.body.scrollHeight;y+=innerHeight){scrollTo({top:y,behavior:'instant'});await new Promise(r=>requestAnimationFrame(r))}await Promise.all([...document.images].filter(i=>i.complete&&i.naturalWidth&&i.getClientRects().length).map(i=>i.decode().catch(()=>{})))})
   for(const offset of (process.env.WISTIA_SCROLL_OFFSETS||'150').split(',').map(Number))for(const key of ['A','B','C','A','C','B','A']){
    await p.locator('.package-cards').evaluate((e,offset)=>scrollTo({top:e.getBoundingClientRect().top+scrollY-offset,behavior:'instant'}),offset);await p.waitForTimeout(100)
    const card=p.locator('.package-card').filter({has:p.locator('input[value="'+key+'"]')}),r=await card.boundingBox()
    const before=await p.evaluate(()=>({y:scrollY,top:document.querySelector('.package-cards').getBoundingClientRect().top,height:document.documentElement.scrollHeight}))
    await p.evaluate(()=>{window.scrollSamples=[];let n=0;const sample=()=>{scrollSamples.push({y:scrollY,top:document.querySelector('.package-cards').getBoundingClientRect().top});if(++n<30)requestAnimationFrame(sample)};requestAnimationFrame(sample)})
    await p.touchscreen.tap(r.x+r.width/2,r.y+r.height/2);await p.waitForTimeout(600)
    const after=await p.evaluate(()=>({y:scrollY,top:document.querySelector('.package-cards').getBoundingClientRect().top,height:document.documentElement.scrollHeight,samples:scrollSamples}))
    const jump=Math.max(...after.samples.map(s=>Math.abs(s.y-before.y)),Math.abs(after.y-before.y))
    results.push({route,width,height,offset,key,before,after,jump})
   }
   if(route==='/'&&(width===390||width===1280))await p.screenshot({path:path.join(out,'selection-'+width+'.png')})
  }
  console.log('Scroll stability '+width+'px');await c.close()
 }
 fs.writeFileSync(path.join(out,'scroll-results.json'),JSON.stringify({base,results,errors},null,2))
 const jumps=results.filter(r=>r.jump>1);console.log(JSON.stringify({cases:results.length,jumpCount:jumps.length,jumps:jumps.slice(0,8).map(({route,width,key,jump,before,after})=>({route,width,key,jump,before,after:{y:after.y,top:after.top}})),errors},null,2))
 if(phase!=='before'){assert.deepEqual(jumps,[]);assert.deepEqual(errors,[])}
}finally{await b.close()}})().catch(e=>{console.error(e);process.exitCode=1})
