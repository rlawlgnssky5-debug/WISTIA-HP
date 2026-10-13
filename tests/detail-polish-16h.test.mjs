import {test} from 'node:test'
import assert from 'node:assert/strict'
import {createRequire} from 'node:module'
import {copyFileSync,existsSync,readFileSync} from 'node:fs'
import {spawn} from 'node:child_process'
import {createServer} from 'node:net'

const read=path=>readFileSync(new URL('../'+path,import.meta.url),'utf8')

await test('16h solo posters keep a live ratio player and duo stays on the table',()=>{
 const app=read('js/app.js'),css=read('css/detail-point-16f.css'),index=read('index.html')
 assert.match(app,/function soloPoint04Section\(\)[\s\S]*point04-mix\.webp\?v=16h/)
 assert.match(app,/const tones=\[30,50,70,100\]\.map\(value=>'<button type="button" class="wistia-ar__tone" data-ar-tone="'\+value\+'"/)
 assert.match(app,/wistia-ar__disc-stage[\s\S]*wistia-ar__play[\s\S]*wistia-ar__seek[\s\S]*wistia-ar__volume[\s\S]*wistia-ar__ratio-input/)
 assert.match(app,/key==='solo'\?soloPoint04Section\(\)/)
 assert.match(app,/info-product\.webp\?v=16h/)
 assert.match(app,/key==='solo'\?'<section class="mas-information mas-information-poster"/)
 assert.match(css,/\.wistia-ar--poster[\s\S]*padding:0!important/)
 assert.match(css,/\.mas-information-poster \.detail-poster-image[\s\S]*object-fit:unset!important/)
 assert.match(index,/js\/ar-ratio-cd\.js\?v=20261013-detail-polish-16h/)
 assert.match(index,/css\/detail-point-16f\.css\?v=20261013-detail-polish-16h/)
 assert.match(index,/css\/booking-availability\.css\?v=20261013-detail-polish-16g/)
 assert.match(index,/data-build="20261013-detail-polish-16f"/)
 const ratio=read('js/ar-ratio-cd.js')
 assert.match(ratio,/\[data-ar-tone\][\s\S]*setValue\(Number\(button\.dataset\.arTone\),true\)/)
 assert.match(ratio,/if\(autoPlay&&!isPlaying&&!pendingPlay\)start\(\)/)
})

let chromium,executable,skip=false
try{
 chromium=createRequire('/tmp/pw/node_modules/playwright-core/package.json')('playwright-core').chromium
 executable=['/opt/google/chrome/chrome','/usr/bin/google-chrome'].find(existsSync)
 if(!executable)skip='Chrome not installed'
}catch{skip='playwright-core not installed'}

await test('16h solo ratio buttons play and product info stays uncropped at 360/375/390/1280',{skip,timeout:180000},async()=>{
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
   const poster=page.locator('.wistia-ar--poster')
   await poster.waitFor()
   await page.locator('.wistia-ar--poster .detail-poster-image').scrollIntoViewIfNeeded()
   await page.locator('.mas-information-poster .detail-poster-image').scrollIntoViewIfNeeded()
   await page.waitForFunction(()=>{
    const mix=document.querySelector('.wistia-ar--poster .detail-poster-image')
    const info=document.querySelector('.mas-information-poster .detail-poster-image')
    return mix?.complete&&mix.naturalWidth===1080&&info?.complete&&info.naturalWidth===1080
   })
   const layout=await page.evaluate(()=>{
    const root=document.querySelector('.wistia-ar--poster')
    const image=root.querySelector('.detail-poster-image')
    const info=document.querySelector('.mas-information-poster .detail-poster-image')
    const frame=root.querySelector('.arc-ratio-frame').getBoundingClientRect()
    const disc=root.querySelector('.wistia-ar__disc-stage').getBoundingClientRect()
    const tones=root.querySelector('.wistia-ar__tones').getBoundingClientRect()
    const imageBox=image.getBoundingClientRect()
    const infoStyle=getComputedStyle(info)
    const inside=(box)=>box.top>=imageBox.top-2&&box.bottom<=imageBox.bottom+2&&box.left>=imageBox.left-2&&box.right<=imageBox.right+2
    return {
     src:image.currentSrc||image.src,
     natural:[image.naturalWidth,image.naturalHeight],
     rendered:[Math.round(imageBox.width),Math.round(imageBox.height)],
     fit:getComputedStyle(image).objectFit,
     infoSrc:info.currentSrc||info.src,
     infoNatural:[info.naturalWidth,info.naturalHeight],
     infoRendered:[Math.round(info.getBoundingClientRect().width),Math.round(info.getBoundingClientRect().height)],
     infoFit:infoStyle.objectFit,
     infoDisplay:infoStyle.display,
     ratio:Math.abs(imageBox.width/imageBox.height-1080/2912),
     infoRatio:Math.abs(info.getBoundingClientRect().width/info.getBoundingClientRect().height-1080/1110),
     discInside:inside(disc)&&disc.width>40,
     tonesInside:inside(tones)&&tones.width>frame.width*.7,
     playSvg:!!root.querySelector('.wistia-ar__play-icon svg'),
     page:document.documentElement.scrollWidth-innerWidth
    }
   })
   assert.match(layout.src,/point04-mix\.webp\?v=16h/)
   assert.deepEqual(layout.natural,[1080,2912])
   assert.ok(layout.rendered[0]<=860,JSON.stringify(layout))
   assert.notEqual(layout.fit,'cover')
   assert.ok(layout.ratio<0.02,JSON.stringify(layout))
   assert.match(layout.infoSrc,/info-product\.webp\?v=16h/)
   assert.deepEqual(layout.infoNatural,[1080,1110])
   assert.ok(layout.infoRendered[0]<=860,JSON.stringify(layout))
   assert.equal(layout.infoDisplay,'block')
   assert.notEqual(layout.infoFit,'cover')
   assert.ok(layout.infoRatio<0.02,JSON.stringify(layout))
   assert.equal(layout.discInside,true,JSON.stringify(layout))
   assert.equal(layout.tonesInside,true,JSON.stringify(layout))
   assert.equal(layout.playSvg,true)
   assert.equal(layout.page,0,width+' page overflow')
   const root=page.locator('#arRatioExperience')
   for(const tone of [30,50,70,100]){
    await page.locator('[data-ar-tone="'+tone+'"]').click()
    await page.waitForFunction(value=>{
     const node=document.querySelector('#arRatioExperience')
     const button=node?.querySelector('[data-ar-tone="'+value+'"]')
     return node?.dataset.tone===String(value)&&button?.getAttribute('aria-pressed')==='true'&&button.classList.contains('is-active')&&node.classList.contains('is-playing')&&Number(node.querySelector('.wistia-ar__seek')?.value)>0.2
    },tone,{timeout:15000})
   }
   await page.locator('.wistia-ar--poster .wistia-ar__play').click()
   await page.waitForFunction(()=>!document.querySelector('#arRatioExperience')?.classList.contains('is-playing'))
   await page.locator('.wistia-ar--poster .wistia-ar__disc-stage').click()
   await page.waitForFunction(()=>{
    const node=document.querySelector('#arRatioExperience')
    return node?.classList.contains('is-playing')&&node.querySelector('.wistia-ar__disc-stage')?.getAttribute('aria-pressed')==='true'&&Number(node.querySelector('.wistia-ar__seek')?.value)>0.2
   })
   await page.locator('.wistia-ar--poster .wistia-ar__seek').evaluate(node=>{node.value='8';node.dispatchEvent(new Event('input',{bubbles:true}))})
   await page.waitForFunction(()=>Math.abs(Number(document.querySelector('#arRatioExperience .wistia-ar__seek')?.value)-8)<1.2)
   await page.locator('.wistia-ar--poster .wistia-ar__volume').click()
   assert.equal(await page.locator('.wistia-ar--poster .wistia-ar__volume').getAttribute('aria-pressed'),'true')
   if(width===390){
    const shot='/tmp/16h-point04-390.png'
    await root.screenshot({path:shot})
    copyFileSync(shot,'/opt/cursor/artifacts/screenshots/16h-point04-390.png')
    const info='/tmp/16h-info-390.png'
    await page.locator('.mas-information-poster').screenshot({path:info})
    copyFileSync(info,'/opt/cursor/artifacts/screenshots/16h-info-390.png')
   }
   assert.deepEqual(errors,[])
   await context.close()
   console.log(width+'px solo ratio playback and product poster passed')
  }
  const quiet=await browser.newContext({viewport:{width:390,height:900}})
  const duo=await quiet.newPage()
  await duo.route('https://**/*',route=>route.abort())
  await duo.goto('http://127.0.0.1:'+port+'/detail/duo',{waitUntil:'domcontentloaded'})
  await duo.waitForSelector('#arRatioExperience')
  const duoState=await duo.evaluate(()=>({
   mix:document.body.innerHTML.includes('point04-mix.webp'),
   info:document.body.innerHTML.includes('info-product.webp'),
   platter:!!document.querySelector('.wistia-ar__platter'),
   table:!!document.querySelector('.mas-information dl'),
   poster:document.querySelectorAll('.wistia-ar--poster,.mas-information-poster').length
  }))
  assert.equal(duoState.mix,false)
  assert.equal(duoState.info,false)
  assert.equal(duoState.platter,true)
  assert.equal(duoState.table,true)
  assert.equal(duoState.poster,0)
  await quiet.close()
 }finally{await browser?.close();server.kill()}
})
