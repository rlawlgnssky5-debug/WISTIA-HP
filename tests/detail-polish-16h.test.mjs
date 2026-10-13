import {test} from 'node:test'
import assert from 'node:assert/strict'
import {createRequire} from 'node:module'
import {copyFileSync,existsSync,readFileSync} from 'node:fs'
import {spawn} from 'node:child_process'
import {createServer} from 'node:net'

const read=path=>readFileSync(new URL('../'+path,import.meta.url),'utf8')

await test('16i solo detail is real UI and duo keeps the shared player',()=>{
 const app=read('js/app.js'),css=read('css/detail-point-16i.css'),index=read('index.html'),booking=read('js/booking-availability.js')
 assert.match(app,/function soloPoint04Section\(\)[\s\S]*point04-top\.webp\?v=16i/)
 assert.match(app,/data-solo-ratio[\s\S]*solo-p4-stop[\s\S]*data-solo-audio/)
 assert.doesNotMatch(app.slice(app.indexOf('function soloPoint04Section'),app.indexOf('function soloReviewGrid')),/point04-mix\.webp|wistia-ar__disc-stage|wistia-ar__play/)
 assert.match(app,/info-product\.webp\?v=16h/)
 assert.match(app,/key==='solo'\?soloPoint04Section\(\)/)
 assert.match(app,/lyric-d\.webp\?v=16i[\s\S]*point-adv\.webp\?v=16i[\s\S]*point-price\.webp\?v=16i[\s\S]*cred-a2\.webp\?v=16i[\s\S]*point05-c3\.webp\?v=16i/)
 assert.match(app,/map\.naver\.com\/p\/search\/[\s\S]*map\.kakao\.com\/link\/search\//)
 assert.match(app,/assets\/img\/song-options\/lyric-video-v2\.webp/)
 assert.match(booking,/bookable\+=minutes[\s\S]*next=start\+minutes\*60000[\s\S]*Math\.floor\(bookable\/180\)/)
 assert.doesNotMatch(booking.slice(booking.indexOf('function teamsRemaining'),booking.indexOf('function dayClosed')),/minutes\+60|60\*60000/)
 assert.match(css,/\.solo-p4-pointer[\s\S]*pointer-events:none/)
 assert.match(css,/#C62828/)
 assert.match(index,/js\/app\.js\?v=20261013-detail-polish-16i/)
 assert.match(index,/js\/booking-availability\.js\?v=20261013-detail-polish-16i/)
 assert.match(index,/css\/detail-point-16i\.css\?v=20261014-hotfix-16i-caption/)
 assert.match(index,/js\/ar-ratio-cd\.js\?v=20261013-detail-polish-16h/)
 assert.match(index,/css\/detail-point-16f\.css\?v=20261013-detail-polish-16h/)
 assert.match(index,/css\/booking-availability\.css\?v=20261013-detail-polish-16g/)
 assert.match(index,/data-build="20261013-detail-polish-16f"/)
})

let chromium,executable,skip=false
try{
 chromium=createRequire('/tmp/pw/node_modules/playwright-core/package.json')('playwright-core').chromium
 executable=['/opt/google/chrome/chrome','/usr/bin/google-chrome'].find(existsSync)
 if(!executable)skip='Chrome not installed'
}catch{skip='playwright-core not installed'}

await test('16i solo player, FAQ, map, footer, reviews and fixed cards at 360/375/390/1280',{skip,timeout:240000},async()=>{
 const probe=createServer();await new Promise(resolve=>probe.listen(0,'127.0.0.1',resolve));const port=probe.address().port;await new Promise(resolve=>probe.close(resolve))
 const server=spawn(process.execPath,['scripts/local-preview.mjs'],{env:{...process.env,WISTIA_PREVIEW_PORT:String(port)},stdio:['ignore','pipe','pipe']})
 let browser
 try{
  await new Promise((resolve,reject)=>{const timer=setTimeout(()=>reject(Error('preview timeout')),10000);server.stdout.once('data',()=>{clearTimeout(timer);resolve()});server.once('error',reject)})
  browser=await chromium.launch({headless:true,executablePath:executable,args:['--no-sandbox','--disable-dev-shm-usage','--autoplay-policy=no-user-gesture-required']})
  for(const width of [360,375,390,1280]){
   const context=await browser.newContext({viewport:{width,height:900},deviceScaleFactor:1})
   const page=await context.newPage()
   const errors=[]
   page.on('pageerror',error=>errors.push(error.message))
   await page.route('https://**/*',route=>route.abort())
   await page.goto('http://127.0.0.1:'+port+'/detail/solo',{waitUntil:'domcontentloaded'})
   await page.locator('#soloPoint04').waitFor()
   await page.evaluate(async()=>{
    for(const image of document.querySelectorAll('.detail-poster-image')){
     image.loading='eager'
     image.scrollIntoView({block:'center'})
     if(!image.complete||!image.naturalWidth)await new Promise(resolve=>{image.addEventListener('load',resolve,{once:true});image.addEventListener('error',resolve,{once:true})})
    }
    window.scrollTo(0,0)
   })
   await page.waitForFunction(()=>{
    const info=document.querySelector('.mas-information-poster .detail-poster-image')
    const price=document.querySelector('img[src*="point-price.webp"]')
    return info?.complete&&info.naturalWidth===1080&&price?.complete&&price.naturalWidth===860
   })
   const layout=await page.evaluate(()=>{
    const box=node=>{const r=node.getBoundingClientRect();return {w:Math.round(r.width),h:Math.round(r.height),fit:getComputedStyle(node).objectFit}}
    const posters=[...document.querySelectorAll('.mobile-ar-solo[data-ar-product="solo"] .detail-poster-image')].map(node=>({src:node.getAttribute('src'),...box(node),natural:[node.naturalWidth,node.naturalHeight]}))
    const selected=document.querySelector('.mas-variant.is-selected')
    const open=document.querySelector('.mas-variant:not(.is-selected)')
    const benefit=getComputedStyle(document.querySelector('.mas-event-price strong'))
    return {
     page:document.documentElement.scrollWidth-innerWidth,
     posters,
     cards:[selected,open].map(node=>{const r=node.getBoundingClientRect();const style=getComputedStyle(node);return {h:Math.round(r.height),transform:style.transform,scale:style.scale,bg:style.backgroundColor}}),
     benefit:benefit.color,
     faq:document.querySelectorAll('.solo-faq details').length,
     map:document.querySelector('.solo-map-links')?.innerHTML||'',
     footer:document.querySelector('.solo-footer')?.innerHTML||''
    }
   })
   assert.equal(layout.page,0,width+' page overflow')
   assert.equal(layout.faq,6)
   assert.equal(layout.benefit,'rgb(198, 40, 40)')
   for(const poster of layout.posters){
    assert.ok(poster.w<=860,JSON.stringify(poster))
    assert.notEqual(poster.fit,'cover',poster.src)
    assert.ok(Math.abs(poster.w/poster.h-poster.natural[0]/poster.natural[1])<0.03,JSON.stringify(poster))
   }
   assert.equal(layout.cards[0].h,layout.cards[1].h)
   assert.equal(layout.cards[0].h,108)
   assert.equal(layout.cards[0].bg,'rgb(255, 255, 255)')
   assert.equal(layout.cards[1].bg,'rgb(164, 83, 106)')
   assert.match(layout.map,/map\.naver\.com\/p\/search\//)
   assert.match(layout.map,/map\.kakao\.com\/link\/search\//)
   assert.match(layout.footer,/href="\/event\/solo"/)
   assert.match(layout.footer,/href="\/privacy"/)
   assert.match(layout.footer,/aidoc\.kr\/support/)
   const selected=page.locator('.mas-variant.is-selected')
   const before=await selected.boundingBox()
   await selected.hover()
   await page.mouse.down()
   const during=await selected.boundingBox()
   await page.mouse.up()
   assert.equal(Math.round(during.height),Math.round(before.height))
   assert.equal(Math.round(during.width),Math.round(before.width))
   const faq=page.locator('.solo-faq details').first()
   await faq.locator('summary').click()
   assert.equal(await faq.evaluate(node=>node.open),true)
   await faq.locator('summary').click()
   assert.equal(await faq.evaluate(node=>node.open),false)
   await page.locator('[data-solo-ratio="50"]').click()
   await page.waitForFunction(()=>{
    const button=document.querySelector('[data-solo-ratio="50"]')
    const audio=document.querySelector('[data-solo-audio]')
    return button?.classList.contains('is-playing')&&button.getAttribute('aria-pressed')==='true'&&audio&&!audio.paused&&audio.currentTime>0.2
   },null,{timeout:15000})
   await page.locator('.solo-p4-stop').click()
   await page.waitForFunction(()=>{
    const audio=document.querySelector('[data-solo-audio]')
    return audio?.paused&&audio.currentTime===0&&!document.querySelector('[data-solo-ratio="50"]')?.classList.contains('is-playing')&&document.querySelector('[data-solo-ratio="50"]')?.classList.contains('is-on')
   })
   await page.locator('[data-solo-ratio="70"]').click()
   await page.waitForFunction(()=>Number(document.querySelector('[data-solo-audio]')?.currentTime)>0.2)
   await page.locator('.solo-p4-seek').evaluate(node=>{node.value='4';node.dispatchEvent(new Event('input',{bubbles:true}))})
   await page.waitForFunction(()=>Math.abs(Number(document.querySelector('[data-solo-audio]')?.currentTime)-4)<1.2)
   await page.locator('[data-review-full]').first().click()
   await page.waitForFunction(()=>document.querySelector('.solo-review-dialog')?.open===true)
   const review=await page.locator('.solo-review-dialog img').evaluate(node=>({src:node.currentSrc||node.src,fit:getComputedStyle(node).objectFit}))
   assert.match(review.src,/review-n4\.webp\?v=16i/)
   assert.equal(review.fit,'contain')
   await page.locator('.solo-review-dialog [data-solo-dialog-close]').click()
   await page.locator('[data-map-zoom]').click()
   await page.waitForFunction(()=>document.querySelector('.solo-map-dialog')?.open===true)
   const mapFit=await page.locator('.solo-map-dialog img').evaluate(node=>getComputedStyle(node).objectFit)
   assert.equal(mapFit,'contain')
   await page.locator('.solo-map-dialog [data-solo-dialog-close]').click()
   const after=await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth)
   assert.equal(after,0,width+' overflow after interaction')
   if(width===390){
    const shot='/tmp/16i-solo-390.png'
    await page.screenshot({path:shot,fullPage:false})
    copyFileSync(shot,'/opt/cursor/artifacts/screenshots/16i-solo-390.png')
   }
   assert.deepEqual(errors,[])
   await context.close()
   console.log(width+'px solo 16i interactions passed')
  }
  const quiet=await browser.newContext({viewport:{width:390,height:900}})
  const duo=await quiet.newPage()
  await duo.route('https://**/*',route=>route.abort())
  await duo.goto('http://127.0.0.1:'+port+'/detail/duo',{waitUntil:'domcontentloaded'})
  await duo.waitForSelector('#arRatioExperience')
  const duoState=await duo.evaluate(()=>{
   const html=document.body.innerHTML
   return {
    soloPlayer:!!document.querySelector('#soloPoint04'),
    posters:['point-price.webp','point-adv.webp','cred-a2.webp','lyric-d.webp','point05-c3.webp','notice-c.webp','map-rose.webp'].filter(name=>html.includes(name)),
    info:html.includes('info-product.webp'),
    platter:!!document.querySelector('.wistia-ar__platter'),
    table:!!document.querySelector('.mas-information dl'),
    lyric:html.includes('lyric-video-v2.webp'),
    footer:!!document.querySelector('.solo-footer')
   }
  })
  assert.equal(duoState.soloPlayer,false)
  assert.deepEqual(duoState.posters,[])
  assert.equal(duoState.info,false)
  assert.equal(duoState.platter,true)
  assert.equal(duoState.table,true)
  assert.equal(duoState.lyric,true)
  assert.equal(duoState.footer,false)
  await quiet.close()
 }finally{await browser?.close();server.kill()}
})
