const {chromium}=require('C:/Users/User/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright')
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict')
const base=process.env.WISTIA_QA_BASE||'http://127.0.0.1:4212',out=path.resolve(__dirname,'../output/mobile-gallery-20261023',process.env.WISTIA_QA_PHASE||'local')
;(async()=>{
 fs.mkdirSync(out,{recursive:true});const b=await chromium.launch({executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',headless:true})
 try{
 const results=[],errors=[],routes=['/','/detail/solo','/detail/duo','/contact','/event/solo','/event/duo','/events','/info/faq','/info/location']
 for(const width of (process.env.WISTIA_QA_WIDTHS?process.env.WISTIA_QA_WIDTHS.split(',').map(Number):[320,360,375,390,430,600,601,779,780,1280,1440])){
  const context=await b.newContext({viewport:{width,height:900},deviceScaleFactor:1,isMobile:width<780,hasTouch:width<780,reducedMotion:'reduce',timezoneId:'Asia/Seoul'})
  await context.route(/facebook\.com|connect\.facebook|google-analytics|googletagmanager/,r=>r.abort())
  const page=await context.newPage();page.on('pageerror',e=>errors.push(e.message))
  const settled=async()=>{await page.waitForFunction(()=>document.querySelector('#app')?.innerText.length>30);await page.evaluate(()=>document.fonts.ready)}
  const shot=async name=>{await page.evaluate(()=>document.activeElement?.blur());await page.waitForTimeout(150);await page.screenshot({path:path.join(out,name+'.png')})}
  const measure=async()=>page.evaluate(()=>{
   const rect=e=>{const r=e.getBoundingClientRect();return {x:r.x,width:r.width}}
   const clipped=[]
   for(const e of document.querySelectorAll('.package-card-name,.package-card-price,.package-card-subtitle,.package-selected-head h3,.package-selected-features li>span')){
    if(!e.getClientRects().length)continue
    const r=e.getBoundingClientRect(),walker=document.createTreeWalker(e,NodeFilter.SHOW_TEXT);let n
    while(n=walker.nextNode()){const range=document.createRange();range.selectNodeContents(n);for(const t of range.getClientRects())if(t.left<r.left-.8||t.right>r.right+.8)clipped.push(e.textContent)}
   }
   const prices=[...document.querySelectorAll('.package-card-price')].filter(e=>e.getClientRects().length).map(e=>{const r=document.createRange();r.selectNodeContents(e);const t=r.getBoundingClientRect();return {left:t.left,right:t.right,text:e.textContent}})
   return {width:innerWidth,overflow:Math.max(document.body.scrollWidth,document.documentElement.scrollWidth)-innerWidth,main:rect(document.querySelector('main')),header:rect(document.querySelector('#siteHeader')),picker:document.querySelector('.package-cards')?rect(document.querySelector('.package-cards')):null,panel:document.querySelector('.package-selected-detail')?rect(document.querySelector('.package-selected-detail')):null,prices,clipped}
  })
  for(const route of (width===390||width===1280?routes:['/','/detail/solo','/detail/duo','/event/solo'])){
   await page.goto(base+route);await settled()
   const data=await measure();assert.equal(data.overflow,0,route+' '+width+' overflow');assert.deepEqual(data.clipped,[],route+' '+width+' clipped text')
   if(width>=780){assert.equal(data.main.width,780);assert.equal(data.main.x,(width-780)/2);assert.equal(data.header.width,780);if(route==='/'||route.startsWith('/detail/')){assert.equal(data.picker.width,780);assert.equal(data.panel.width,780)}}
   else if(route==='/'||route.startsWith('/detail/')){assert.ok(Math.abs(data.picker.width-(width<=600?width*.92:width))<1,'only the existing mobile gutter, no nested inset');assert.ok(Math.abs(data.panel.width-data.picker.width)<1)}
   for(let i=1;i<data.prices.length;i++)assert.ok(data.prices[i].left-data.prices[i-1].right>=8,'price text has visible space between columns')
   const gallery=page.locator('[data-mobile-gallery]')
   if(await gallery.count()){
    assert.equal(await gallery.locator('.hs-slide').count(),5);assert.equal(await gallery.locator('.hs-dots button').count(),5)
    assert.equal(await gallery.locator('.hs-next').isVisible(),true)
    for(let i=2;i<=5;i++){await gallery.locator('.hs-next').click();await page.waitForFunction(n=>document.querySelector('.hs-count').textContent===n+' / 5',i)}
    assert.equal(await gallery.locator('.hs-next').isDisabled(),true)
    await gallery.locator('.hs-dots button').first().click();await page.waitForFunction(()=>document.querySelector('.mas-gallery-track').scrollLeft<2)
    if(width===390||width===1280){await page.evaluate(()=>scrollTo(0,0));await shot('gallery-first-'+route.replaceAll('/','_')+'-'+width)}
    if(width===390){
     // Real CDP touch gestures exercise the browser's native swipe implementation
     const session=await context.newCDPSession(page),box=await page.locator('.mas-gallery-track').boundingBox(),y=box.y+Math.min(box.height/2,300),start=box.x+box.width*.75,end=box.x+box.width*.1
     await session.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:start,y}]})
     for(let i=1;i<=12;i++){await session.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:start+(end-start)*i/12,y}]});await page.waitForTimeout(20)}
     await session.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]})
     await page.waitForFunction(()=>document.querySelector('.mas-gallery-track').scrollLeft>100)
     await page.waitForFunction(()=>document.querySelector('.hs-count').textContent!=='1 / 5')
     assert.match(await page.locator('.mas-gallery-track').evaluate(e=>getComputedStyle(e).touchAction),/manipulation|pinch-zoom/)
     await shot('gallery-swiped-'+route.replaceAll('/','_')+'-'+width)
     await session.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:box.x+box.width/2,y}]})
     for(let i=1;i<=10;i++){await session.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:box.x+box.width/2,y:y-150*i/10}]});await page.waitForTimeout(20)}
     await session.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await page.waitForFunction(()=>scrollY>20)
     await page.evaluate(()=>scrollTo(0,0));await session.detach()
    }
    if(width===1280){
     await gallery.locator('.hs-dots button').first().click();await page.waitForFunction(()=>document.querySelector('.mas-gallery-track').scrollLeft<2)
     await page.evaluate(()=>scrollTo(0,0));await page.waitForTimeout(150)
     const box=await page.locator('.mas-gallery-track').boundingBox(),y=box.y+300
     await page.mouse.move(box.x+box.width*.8,y);await page.mouse.down();await page.mouse.move(box.x+box.width*.2,y,{steps:12});await page.mouse.up()
     await page.waitForFunction(()=>document.querySelector('.hs-count').textContent==='2 / 5')
     await gallery.locator('.mas-gallery-track').focus();await page.keyboard.press('End');await page.waitForFunction(()=>document.querySelector('.hs-count').textContent==='5 / 5')
     await page.keyboard.press('Home');await page.waitForFunction(()=>document.querySelector('.hs-count').textContent==='1 / 5')
    }
    if(width<=430||width===780||width===1280){
     for(const key of ['A','B','C']){
      await page.locator('.package-card').filter({has:page.locator('input[value="'+key+'"]')}).click()
      assert.deepEqual((await measure()).clipped,[],'selected '+key+' type text fits')
      await page.locator('#packageSelection').scrollIntoViewIfNeeded();await page.evaluate(()=>scrollBy(0,-75));await shot('type-'+key+'-'+route.replaceAll('/','_')+'-'+width)
     }
    }
   }
   // Returning through another SPA route must recreate a working carousel
   await page.evaluate(target=>{history.pushState({},'','/info/faq');dispatchEvent(new PopStateEvent('popstate'));setTimeout(()=>{history.pushState({},'',target);dispatchEvent(new PopStateEvent('popstate'))},50)},route)
   await page.waitForTimeout(150);await settled()
   const spa=await measure();assert.equal(spa.overflow,0);assert.deepEqual(spa.clipped,[]);assert.equal(spa.picker?.width,data.picker?.width)
   if(await page.locator('.hs-next').count()){await page.locator('.hs-next').click();await page.waitForFunction(()=>document.querySelector('.hs-count').textContent==='2 / 5')}
   results.push({route,width,direct:data,spa})
  }
  if(width===1280){
   await page.goto(base+'/');await settled();await page.locator('.hs-next').click();await page.waitForFunction(()=>document.querySelector('.mas-gallery-track').scrollLeft>700)
   await page.setViewportSize({width:390,height:900});await page.waitForTimeout(200)
   assert.equal(await page.locator('.hs-count').textContent(),'2 / 5');assert.ok(Math.abs(await page.locator('.mas-gallery-track').evaluate(e=>e.scrollLeft/e.clientWidth)-1)<.02)
   await page.setViewportSize({width:1280,height:900});await page.waitForTimeout(200);assert.ok(Math.abs(await page.locator('.mas-gallery-track').evaluate(e=>e.scrollLeft/e.clientWidth)-1)<.02)
  }
  console.log(width+' mobile-first layout, prices, 5 photos, arrows and SPA passed');await context.close()
 }
 assert.deepEqual(errors,[]);fs.writeFileSync(path.join(out,'results.json'),JSON.stringify({results,errors,checks:['real mobile touch contexts at 320–779px','actual text bounds and at least 8px price separation','one mobile gutter, 780px desktop picker and panel','five original images and visible arrows/dots','native touch swipe','mouse drag and keyboard navigation','SPA recreation and resize','no inquiry submission or Kakao sending']},null,2))
 }finally{await b.close()}
})().catch(e=>{console.error(e);process.exitCode=1})
