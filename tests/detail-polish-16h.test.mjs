import {readWithBundleSources} from './bundled-html-fixture.mjs'
import {test} from 'node:test'
import assert from 'node:assert/strict'
import {createRequire} from 'node:module'
import {copyFileSync,existsSync,mkdirSync,readFileSync} from 'node:fs'
import {spawn} from 'node:child_process'
import {createServer} from 'node:net'

const read=readWithBundleSources

await test('16j12 solo and duo details share the approved layout',()=>{
 const app=read('js/app.js'),css=read('css/detail-point-16i.css'),index=read('index.html'),booking=read('js/booking-availability.js')
 assert.match(app,/function soloPoint04Section\(\)[\s\S]*assets\/detail-solo-16j\/point04_ui_390\.png/)
 assert.match(app,/data-solo-ratio[\s\S]*solo-p4-stop[\s\S]*data-solo-audio/)
 assert.doesNotMatch(app.slice(app.indexOf('function soloPoint04Section'),app.indexOf('function soloReviewGrid')),/point04-mix\.webp|wistia-ar__disc-stage|wistia-ar__play/)
 assert.match(app,/'assets\/16j\/duo\/':'assets\/detail-solo-16j\/'/)
 assert.match(app,/shot\+'top_A_pc\.png"/)
 assert.match(app,/shot\+'top_A\.png"/)
 assert.match(app,/shot\+'info_v5\.png"/)
 assert.match(app,/\['solo','duo'\]\.includes\(key\)\?soloPoint04Section\(\)/)
 assert.match(app,/lyric-d\.webp\?v=16i[\s\S]*point-adv\.webp\?v=16i[\s\S]*point-price\.webp\?v=16i[\s\S]*cred-a2\.webp\?v=16i[\s\S]*point05-c3\.webp\?v=16i/)
 assert.match(app,/map\.naver\.com\/p\/search\/[\s\S]*map\.kakao\.com\/link\/search\//)
 assert.match(app,/assets\/img\/song-options\/lyric-video-v2\.webp/)
 assert.match(booking,/bookable\+=minutes[\s\S]*next=start\+minutes\*60000[\s\S]*Math\.floor\(bookable\/180\)/)
 assert.doesNotMatch(booking.slice(booking.indexOf('function teamsRemaining'),booking.indexOf('function dayClosed')),/minutes\+60|60\*60000/)
 assert.match(css,/\.solo-p4-pointer[\s\S]*pointer-events:none/)
 assert.match(css,/#C62828/)
 assert.match(index,/js\/app\.js\?v=20261019-promo30/)
 assert.match(index,/js\/booking-availability\.js\?v=20261014-detail-polish-16j12/)
 assert.match(index,/css\/detail-point-16i\.css\?v=20261014-detail-polish-16j12/)
 assert.match(index,/js\/ar-ratio-cd\.js\?v=20261014-detail-polish-16j12/)
 assert.match(index,/css\/detail-point-16f\.css\?v=20261014-detail-polish-16j12/)
 assert.match(index,/css\/booking-availability\.css\?v=20261014-detail-polish-16j12/)
 assert.match(index,/data-build="20261013-detail-polish-16f"/)
 const solo=read('detail/solo.html'),duo=read('detail/duo.html')
 assert.match(solo,/css\/detail-solo-16j\.css\?v=20261014-detail-polish-16j12/)
 assert.match(duo,/css\/detail-solo-16j\.css\?v=20261014-detail-polish-16j12/)
})

let chromium,executable,skip=false
try{
 chromium=createRequire('/tmp/pw/node_modules/playwright-core/package.json')('playwright-core').chromium
 executable=['/opt/google/chrome/chrome','/usr/bin/google-chrome'].find(existsSync)
 if(!executable)skip='Chrome not installed'
}catch{skip='playwright-core not installed'}

await test('16j12 live controls and layout at 360/375/390/1280',{skip,timeout:420000},async()=>{
 const probe=createServer();await new Promise(resolve=>probe.listen(0,'127.0.0.1',resolve));const port=probe.address().port;await new Promise(resolve=>probe.close(resolve))
 const server=spawn(process.execPath,['scripts/local-preview.mjs'],{env:{...process.env,WISTIA_PREVIEW_PORT:String(port)},stdio:['ignore','pipe','pipe']})
 let browser
 try{
  await new Promise((resolve,reject)=>{const timer=setTimeout(()=>reject(Error('preview timeout')),10000);server.stdout.once('data',()=>{clearTimeout(timer);resolve()});server.once('error',reject)})
  browser=await chromium.launch({headless:true,executablePath:executable,args:['--no-sandbox','--disable-dev-shm-usage','--autoplay-policy=no-user-gesture-required']})
  for(const product of ['solo','duo']){
  for(const width of [360,375,390,1280]){
   const context=await browser.newContext({viewport:{width,height:900},deviceScaleFactor:1})
   const page=await context.newPage()
   const errors=[]
   page.on('pageerror',error=>errors.push(error.message))
   await page.route('https://**/*',route=>route.abort())
   await page.goto('http://127.0.0.1:'+port+'/detail/'+product,{waitUntil:'domcontentloaded'})
   await page.locator('#soloPoint04').waitFor()
   await page.locator('.mas-gallery-slide.is-current video source').waitFor({state:'attached'})
   await page.evaluate(async()=>{
    for(const image of document.querySelectorAll('.detail-poster-image, .solo-shot-img')){
     image.loading='eager'
     image.scrollIntoView({block:'center'})
     if(!image.complete||!image.naturalWidth)await new Promise(resolve=>{image.addEventListener('load',resolve,{once:true});image.addEventListener('error',resolve,{once:true})})
    }
    window.scrollTo(0,0)
   })
   await page.waitForFunction(()=>{
    const info=document.querySelector('.mas-information-poster .solo-shot-img')
    const price=document.querySelector('img[src*="point-price.webp"]')
    return info?.complete&&info.naturalWidth===1080&&price?.complete&&price.naturalWidth===860
   })
   const layout=await page.evaluate(()=>{
    const box=node=>{const r=node.getBoundingClientRect();return {w:Math.round(r.width),h:Math.round(r.height),fit:getComputedStyle(node).objectFit}}
    const posters=[...document.querySelectorAll('.mobile-ar-solo .detail-poster-image')].map(node=>({src:node.getAttribute('src'),...box(node),natural:[node.naturalWidth,node.naturalHeight]}))
    const selected=document.querySelector('.mas-variant.is-selected')
    const open=document.querySelector('.mas-variant:not(.is-selected)')
    const benefit=getComputedStyle(document.querySelector('.mas-event-price strong'))
    const html=document.body.innerHTML
    return {
     page:document.documentElement.scrollWidth-innerWidth,
     posters,
     cards:[selected,open].map(node=>{const r=node.getBoundingClientRect();const style=getComputedStyle(node);return {h:Math.round(r.height),top:Math.round(r.top),transform:style.transform,scale:style.scale,bg:style.backgroundColor}}),
     benefit:benefit.color,
     faq:document.querySelectorAll('.solo-faq details').length,
     map:document.querySelector('.solo-map-links')?.innerHTML||'',
     footer:document.querySelector('.solo-footer')?.innerHTML||'',
     cta:(()=>{
      const node=document.querySelector('.solo-footer-inquiry')
      if(!node)return null
      const s=getComputedStyle(node),r=node.getBoundingClientRect(),img=node.parentElement.querySelector('.solo-shot-img').getBoundingClientRect()
      return {text:node.innerText.replace(/\s+/g,' ').trim(),bg:s.backgroundColor,color:s.color,fs:parseFloat(s.fontSize),href:node.getAttribute('href'),h:Math.round(r.height),covers:r.left<=img.left+img.width*0.07&&r.right>=img.left+img.width*0.93&&r.top<=img.top+img.height*0.085&&r.bottom>=img.top+img.height*0.175,fixed:['fixed','sticky'].includes(s.position)}
     })(),
     intro:document.querySelector('.mas-intro .solo-shot-img')?.getAttribute('src')||'',
     pc:document.querySelector('.mas-intro source')?.getAttribute('srcset')||'',
     info:document.querySelector('.mas-information-poster .solo-shot-img')?.getAttribute('src')||'',
     video:document.querySelector('.mas-gallery-slide.is-current video source')?.getAttribute('src')||'',
     selected:selected?.textContent||'',
     openHref:open?.getAttribute('href')||'',
     tryHint:!!document.querySelector('.bap-try'),
     platter:!!document.querySelector('.wistia-ar__platter'),
     table:!!document.querySelector('.mas-information dl'),
     shared:['reviews6_390_v2.png','point04_ui_390.png','map_C3.png','footer_A.png'].every(name=>html.includes('assets/detail-solo-16j/'+name))
    }
   })
   assert.equal(layout.page,0,product+' '+width+' page overflow')
   const geometry=await page.evaluate(()=>({top:document.querySelector('.solo-shot-top .solo-shot-img').getBoundingClientRect().width,sections:[...document.querySelectorAll('.solo-shot-narrow')].map(n=>n.getBoundingClientRect().width),fab:getComputedStyle(document.querySelector('#floatingKakaoChat')).display,answer:document.querySelector('.solo-faq details[open] .solo-faq-answer').getBoundingClientRect().height}))
   assert.ok(Math.abs(geometry.top-width)<2,'top uses full design width')
   assert.ok(geometry.sections.every(w=>Math.abs(w-Math.min(width,480))<2),'one centered 480px column')
   assert.notEqual(geometry.fab,'none')
   assert.ok(geometry.answer>60,'open answer is visible')
   assert.equal(layout.faq,6)
   assert.equal(layout.benefit,'rgb(196, 128, 140)')
   for(const poster of layout.posters){
    assert.ok(poster.w<=860,JSON.stringify(poster))
    assert.notEqual(poster.fit,'cover',poster.src)
    assert.ok(Math.abs(poster.w/poster.h-poster.natural[0]/poster.natural[1])<0.03,JSON.stringify(poster))
   }
   assert.equal(layout.cards[0].h,layout.cards[1].h)
   assert.ok(layout.cards[0].h>108)
   assert.ok(Math.abs(layout.cards[0].top-layout.cards[1].top)<3)
   assert.match(layout.map,/map\.naver\.com\/p\/search\//)
   assert.match(layout.map,/map\.kakao\.com\/link\/search\//)
   assert.match(layout.footer,new RegExp('class="solo-footer-inquiry" href="/event/'+product+'"'))
   assert.match(layout.footer,/>문의양식 작성</)
   assert.doesNotMatch(layout.footer,/문의양식 작성하기/)
   assert.doesNotMatch(layout.footer,/카카오톡 문의/)
   assert.doesNotMatch(layout.footer,/data-kakao-inquiry/)
   assert.equal(layout.cta.text,'문의양식 작성')
   assert.equal(layout.cta.bg,'rgb(196, 128, 140)')
   assert.equal(layout.cta.color,'rgb(255, 255, 255)')
   assert.equal(layout.cta.href,'/event/'+product)
   assert.ok(layout.cta.fs>=14,product+' '+width+' footer label size')
   assert.ok(layout.cta.h>=32,product+' '+width+' footer button height')
   assert.equal(layout.cta.covers,true,product+' '+width+' footer button covers the painted label')
   assert.equal(layout.cta.fixed,false)
   assert.equal(layout.shared,true,product+' shared section images')
   assert.equal(layout.platter,false)
   assert.equal(layout.table,false)
   if(product==='duo'){
    assert.match(layout.intro,/assets\/16j\/duo\/top_A\.png/)
    assert.match(layout.info,/assets\/16j\/duo\/info_v5\.png/)
    assert.match(layout.video,/duo-wedding-song-ar\.mp4/)
    assert.match(layout.selected,/DUET/)
    assert.equal(layout.openHref,'/detail/solo')
    assert.equal(layout.tryHint,false)
    if(width>=901)assert.match(layout.pc,/assets\/16j\/duo\/top_A_pc\.png/)
   }else{
    assert.match(layout.intro,/^assets\/detail-solo-16j\/top_A\.png$/)
    assert.match(layout.info,/^assets\/detail-solo-16j\/info_v5\.png$/)
    assert.match(layout.video,/groom-wedding-song-ar\.mp4/)
    assert.match(layout.selected,/SOLO/)
    assert.equal(layout.openHref,'/detail/duo')
    assert.equal(layout.tryHint,true)
    if(width>=901)assert.match(layout.pc,/^assets\/detail-solo-16j\/top_A_pc\.png$/)
   }
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
   assert.equal(await faq.evaluate(node=>node.open),true)
   await faq.locator('summary').click()
   assert.equal(await faq.evaluate(node=>node.open),false)
   await faq.locator('summary').click()
   assert.equal(await faq.evaluate(node=>node.open),true)
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
    const shot='/tmp/16j-'+product+'-390.png'
    await page.screenshot({path:shot,fullPage:false})
    mkdirSync('/opt/cursor/artifacts/screenshots',{recursive:true})
    copyFileSync(shot,'/opt/cursor/artifacts/screenshots/16j-'+product+'-390.png')
   }
   assert.deepEqual(errors,[])
   await context.close()
   console.log(width+'px '+product+' 16j interactions passed')
  }
  }
 }finally{await browser?.close();server.kill()}
})
