import {test} from 'node:test'
import assert from 'node:assert/strict'
import {createRequire} from 'node:module'
import {copyFileSync,existsSync,readFileSync} from 'node:fs'
import {spawn} from 'node:child_process'
import {createServer} from 'node:net'
import {runInNewContext} from 'node:vm'
const require=createRequire(import.meta.url)
const rules=require('../js/booking-availability.js')
const read=path=>readFileSync(new URL('../'+path,import.meta.url),'utf8')
const now=Date.parse('2026-10-08T03:00:00Z')
const dayBlock=(date,end)=>[{start:date+'T13:00:00+09:00',end:date+'T'+end+':00+09:00'}]
const blocks=[
 {start:'2026-10-09T00:00:00+09:00',end:'2026-10-10T00:00:00+09:00'},
 ...dayBlock('2026-10-15','21:30'),
 ...dayBlock('2026-10-16','20:30'),
 ...dayBlock('2026-10-17','19:30')
]

await test('16g Sunday cutoff, past cells and exactly one remaining team',()=>{
 assert.equal(rules.slotBlocked('2026-10-11','17:30',60,[]),false)
 assert.equal(rules.slotBlocked('2026-10-11','18:00',60,[]),true)
 assert.equal(rules.dayClosed('2026-10-11','solo',[],now),false)
 assert.equal(rules.teamsRemaining('2026-10-12','solo',[],now),0,'Monday is closed, so no remaining team')
 assert.equal(rules.teamsRemaining('2026-10-15','solo',[],now),3,'session minutes divided by 180, without a 60-minute prep gap')
 assert.equal(rules.teamsRemaining('2026-10-15','solo',dayBlock('2026-10-15','21:30'),now),0,'under three bookable hours is not a team')
 assert.equal(rules.teamsRemaining('2026-10-15','duo',dayBlock('2026-10-15','21:30'),now),0)
 assert.equal(rules.teamsRemaining('2026-10-16','duo',dayBlock('2026-10-16','20:30'),now),0,'a short leftover is not one team')
 assert.equal(rules.teamsRemaining('2026-10-16','solo',dayBlock('2026-10-16','16:30'),now),2,'six hours of session time is two teams')
 assert.equal(rules.teamsRemaining('2026-10-17','duet-film',dayBlock('2026-10-17','19:30'),now),1)
 assert.equal(rules.teamsRemaining('2026-10-17','solo',dayBlock('2026-10-17','19:30'),now),1)
 assert.equal(rules.teamsRemaining('2026-10-11','solo',[],now),1,'Sunday evening starts are not bookable time')
 assert.equal(rules.teamsRemaining('2026-10-11','duo',[],now),2)
 assert.equal(rules.teamsRemaining('2026-10-11','duet-film',[],now),2)
 assert.equal(rules.teamsRemaining('2026-10-11','solo',dayBlock('2026-10-11','17:00'),now),0)
 assert.equal(rules.teamsRemaining('2026-10-10','solo',[],now),3)

 const window={}
 runInNewContext(read('js/contact-form.js'),{window,Date,Intl})
 window.WistiaBooking={
  dayClosed:(date,key,list)=>rules.dayClosed(date,key,list,now),
  teamsRemaining:(date,key,list)=>rules.teamsRemaining(date,key,list,now)
 }
 const cell=(product,date)=>window.WistiaContact.calendar.cells(2026,9,'bookingDate','','2026-10-08',blocks,product).match(new RegExp('<button[^>]*data-calendar-day="'+date+'"[^>]*>.*?</button>'))[0]
 const past=cell('solo','2026-10-07'),monday=cell('solo','2026-10-12'),closed=cell('solo','2026-10-09')
 assert.match(past,/is-past/);assert.doesNotMatch(past,/<small>|1팀 남음|마감/)
 assert.match(monday,/ disabled/);assert.doesNotMatch(monday,/<small>|1팀 남음|마감/)
 assert.match(closed,/notion-closed/);assert.match(closed,/<small>마감<\/small>/);assert.doesNotMatch(closed,/1팀 남음/)
 assert.doesNotMatch(cell('solo','2026-10-15'),/has-one-team|팀 남음|마감/)
 assert.match(cell('duo','2026-10-15'),/<small>마감<\/small>/);assert.doesNotMatch(cell('duo','2026-10-15'),/팀 남음/)
 const openSaturday=cell('solo','2026-10-10')
 assert.match(openSaturday,/<span>10<\/span><\/button>/)
 assert.doesNotMatch(openSaturday,/has-one-team|팀 남음|마감|disabled/)
 assert.match(cell('solo','2026-10-11'),/<small class="one-team">1팀 남음<\/small>/);assert.doesNotMatch(cell('solo','2026-10-11'),/마감/)
 assert.match(cell('duo','2026-10-11'),/<small class="one-team">2팀 남음<\/small>/)
 const fridayDuo=cell('duo','2026-10-16')
 assert.doesNotMatch(fridayDuo,/팀 남음|마감/)
 assert.doesNotMatch(fridayDuo,/disabled/)
 assert.match(cell('duet-film','2026-10-17'),/<small class="one-team">1팀 남음<\/small>/)
 assert.match(cell('solo','2026-10-17'),/<small class="one-team">1팀 남음<\/small>/)
 const css=read('css/booking-availability.css')
 assert.match(css,/calendar-day\.is-past\{opacity:\.15!important\}/)
 assert.match(css,/small\.one-team/)
 assert.doesNotMatch(css,/one-team[\s\S]{0,240}#C62828|#C62828[\s\S]{0,80}one-team/)
})

await test('16g rose cue is only on the solo comparison player',()=>{
 const scope={studioIcon:()=>'<svg></svg>'}
 runInNewContext(read('js/app.js').slice(read('js/app.js').indexOf('function wistiaBeforeAfterSection('),read('js/app.js').indexOf('function setExpertPanel(')),scope)
 assert.doesNotMatch(scope.wistiaBeforeAfterSection(true),/여기 눌러보세요|bap-try/)
 assert.match(scope.wistiaBeforeAfterSection(true,true),/<p class="bap-try"><span>여기 눌러보세요!<\/span><\/p>/)
 const app=read('js/app.js')
 assert.match(app,/arc-point-tuning-rose[\s\S]{0,1200}wistiaBeforeAfterSection\(true,key==='solo'\)/)
 assert.match(app,/id="homeSound"[\s\S]{0,400}wistiaBeforeAfterSection\(true\)/)
 assert.doesNotMatch(app,/wistiaBeforeAfterSection\(true,true\)[\s\S]{0,80}id="homeSound"/)
 const rose=read('css/detail-point-16f.css')
 assert.match(rose,/\.bap-try/)
 assert.match(rose,/pointer-events:none!important/)
 assert.match(rose,/#fff7f4/)
 assert.match(rose,/#7d3a4f/)
})

let chromium,executable,skip=false
try{
 chromium=createRequire('/tmp/pw/node_modules/playwright-core/package.json')('playwright-core').chromium
 executable=['/opt/google/chrome/chrome','/usr/bin/google-chrome'].find(existsSync)
 if(!executable)skip='Chrome not installed'
}catch{skip='playwright-core not installed'}

await test('16g calendar at 360/375/390/1280 shows one team, Sunday evening and faded past dates',{skip,timeout:180000},async()=>{
 const probe=createServer();await new Promise(resolve=>probe.listen(0,'127.0.0.1',resolve));const port=probe.address().port;await new Promise(resolve=>probe.close(resolve))
 const server=spawn(process.execPath,['scripts/local-preview.mjs'],{env:{...process.env,WISTIA_PREVIEW_PORT:String(port)},stdio:['ignore','pipe','pipe']})
 let browser
 try{
  await new Promise((resolve,reject)=>{const timer=setTimeout(()=>reject(Error('preview timeout')),10000);server.stdout.once('data',()=>{clearTimeout(timer);resolve()});server.once('error',reject)})
  browser=await chromium.launch({headless:true,executablePath:executable,args:['--no-sandbox','--disable-dev-shm-usage']})
  const shots=[]
  for(const width of [360,375,390,1280]){
   const context=await browser.newContext({viewport:{width,height:900},deviceScaleFactor:1})
   const page=await context.newPage()
   const errors=[]
   page.on('pageerror',error=>errors.push(error.message))
   await page.clock.setFixedTime(new Date('2026-10-08T03:00:00Z'))
   await page.route('https://**/*',route=>route.abort())
   await page.route('**/api/availability?*',route=>{
    const params=new URL(route.request().url()).searchParams
    if(params.has('from'))return route.fulfill({json:{ok:true,from:params.get('from'),to:params.get('to'),blocks}})
    return route.fulfill({json:{ok:true,date:params.get('date'),blocks}})
   })
   const expectDay=async(date,check)=>{
    const day=page.locator('#calendar-bookingDate [data-calendar-day="'+date+'"]')
    const box=await day.evaluate(node=>{
     const label=node.querySelector('small'),cell=node.getBoundingClientRect(),text=label?.getBoundingClientRect()
     return {text:node.textContent,disabled:node.disabled,opacity:getComputedStyle(node).opacity,label:label?.textContent||'',color:label?getComputedStyle(label).color:'',overflow:label?label.scrollWidth-label.clientWidth:0,outside:text?text.right>cell.right+1||text.left<cell.left-1:false,page:document.documentElement.scrollWidth-innerWidth}
    })
    check(box)
    assert.equal(box.page,0,width+' page overflow')
   }
   for(const [path,product,date,time,dateTeams,sundayTeams] of [['/event/solo','solo','2026-10-17','20:00','1팀 남음','1팀 남음'],['/event/duo','duo','2026-10-16','21:00','','2팀 남음']]){
    await page.goto('http://127.0.0.1:'+port+path,{waitUntil:'domcontentloaded'})
    await page.locator('[data-contact-date-mode="bookingDate"][value="date"]').click()
    await page.waitForFunction(value=>document.querySelector('#calendar-bookingDate [data-calendar-day="'+value+'"]'),date)
    await expectDay('2026-10-07',box=>{assert.match(box.text,/7/);assert.equal(box.disabled,true);assert.equal(box.opacity,'0.15');assert.equal(box.label,'');assert.doesNotMatch(box.text,/마감|1팀/)})
    await expectDay('2026-10-12',box=>{assert.equal(box.disabled,true);assert.equal(box.opacity,'1');assert.equal(box.label,'');assert.doesNotMatch(box.text,/마감|1팀/)})
    await expectDay('2026-10-09',box=>{assert.equal(box.disabled,true);assert.equal(box.opacity,'1');assert.equal(box.label,'마감');assert.equal(box.color,'rgb(121, 117, 107)')})
    await expectDay('2026-10-10',box=>{assert.equal(box.disabled,false);assert.equal(box.label,'');assert.match(box.text,/^10$/);assert.doesNotMatch(box.text,/마감|팀 남음/)})
    await expectDay('2026-10-11',box=>{assert.equal(box.disabled,false);assert.equal(box.label,sundayTeams);assert.doesNotMatch(box.text,/마감/)})
    await expectDay(date,box=>{
     assert.equal(box.disabled,false);assert.equal(box.label,dateTeams);if(dateTeams)assert.equal(box.color,'rgb(37, 36, 33)');assert.ok(box.overflow<=1,JSON.stringify(box));assert.equal(box.outside,false);assert.doesNotMatch(box.text,/마감/)
    })
    await page.locator('#calendar-bookingDate [data-calendar-day="'+date+'"]').click()
    await page.waitForFunction(value=>document.querySelector('#contactInquiryForm')?.dataset.scheduleState==='ready'&&document.querySelector('[data-calendar-time="'+value+'"]'),time)
    const slot=async value=>page.locator('[data-calendar-time="'+value+'"]').evaluate(node=>{
     const label=node.querySelector('small')
     return {text:node.textContent,disabled:node.disabled,label:label?.textContent||'',color:label?getComputedStyle(label).color:'',overflow:node.scrollWidth-node.clientWidth}
    })
    const open=await slot(time)
    assert.equal(open.disabled,false,path+' '+time);assert.equal(open.label,'');assert.match(open.text,/시/);assert.doesNotMatch(open.text,/팀 남음/);assert.ok(open.overflow<=1,JSON.stringify(open))
    const closedSlot=await slot('18:00')
    if(date==='2026-10-11')assert.match(closedSlot.text,/마감/)
    await page.locator('#calendar-bookingDate [data-calendar-day="2026-10-11"]').click()
    await page.waitForFunction(()=>document.querySelector('#contactInquiryForm')?.dataset.scheduleState==='ready')
    const early=await slot('17:30'),late=await slot('18:00')
    assert.equal(early.disabled,false,product+' Sunday 17:30');assert.equal(early.label,'');assert.match(early.text,/17시 30분/);assert.doesNotMatch(early.text,/팀 남음|마감/)
    assert.equal(late.disabled,true,product+' Sunday 18:00');assert.match(late.text,/마감/);assert.doesNotMatch(late.text,/팀 남음/)
    assert.doesNotMatch(await page.locator('[data-calendar-times]').innerText(),/팀 남음/)
    if(product==='solo'){
     await page.locator('#calendar-bookingDate [data-calendar-day="2026-10-10"]').click()
     await page.waitForFunction(()=>document.querySelector('#contactInquiryForm')?.dataset.scheduleState==='ready'&&document.querySelector('[data-calendar-time="13:00"]'))
     const plenty=await slot('13:00')
     assert.equal(plenty.disabled,false,path+' three teams keep the start open')
     assert.equal(plenty.label,'')
     assert.doesNotMatch(plenty.text,/팀 남음|마감/)
    }
    await page.locator('[data-contact-date-mode="bookingDate"][value="unknown"]').click()
    assert.equal(await page.locator('#contact-bookingDate').isDisabled(),true)
    assert.equal(await page.locator('[data-calendar-times]').isHidden(),true)
    if(width===390&&path==='/event/solo'){
     await page.locator('[data-contact-date-mode="bookingDate"][value="date"]').click()
     await page.waitForFunction(()=>document.querySelector('#calendar-bookingDate [data-calendar-day="2026-10-17"] .one-team'))
     await page.locator('#calendar-bookingDate').screenshot({path:'/opt/cursor/artifacts/screenshots/16g-one-team-390.png'})
     shots.push(width)
    }
   }
   assert.deepEqual(errors,[])
   await context.close()
   console.log(width+'px Sunday cutoff, faded past date and one remaining team passed')
  }
  assert.deepEqual(shots,[390])
 }finally{await browser?.close();server.kill()}
})

await test('16g rose hint is visible and play produces sound at 360/375/390/1280',{skip,timeout:180000},async()=>{
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
   const hint=page.locator('.arc-point-tuning-rose .bap-try')
   await hint.waitFor()
   const box=await hint.evaluate(node=>{
    const chip=node.querySelector('span'),player=node.closest('.bap-player').getBoundingClientRect(),text=chip.getBoundingClientRect()
    const style=getComputedStyle(chip)
    return {text:chip.textContent,color:style.color,background:style.backgroundColor,events:getComputedStyle(node).pointerEvents,overflow:chip.scrollWidth-chip.clientWidth,outside:text.right>player.right+1||text.left<player.left-1||text.bottom>player.bottom+1,page:document.documentElement.scrollWidth-innerWidth,visible:text.width>0&&text.height>0}
   })
   assert.equal(box.text,'여기 눌러보세요!')
   assert.equal(box.color,'rgb(125, 58, 79)')
   assert.equal(box.background,'rgb(255, 247, 244)')
   assert.equal(box.events,'none')
   assert.equal(box.visible,true)
   assert.ok(box.overflow<=1,JSON.stringify(box))
   assert.equal(box.outside,false,JSON.stringify(box))
   assert.equal(box.page,0,width+' page overflow')
   const play=page.locator('.arc-point-tuning-rose .bap-play')
   await page.waitForFunction(()=>document.querySelector('.arc-point-tuning-rose .bap-play')?.getAttribute('aria-busy')!=='true')
   await play.click()
   await page.waitForFunction(()=>{
    const root=document.querySelector('.arc-point-tuning-rose #wistiaBeforeAfter')
    return root?.classList.contains('is-playing')&&root.querySelector('.bap-play')?.getAttribute('aria-pressed')==='true'&&Number(root.dataset.position)>0.05
   })
   await page.locator('.arc-point-tuning-rose .bap-switch').click()
   await page.waitForFunction(()=>document.querySelector('.arc-point-tuning-rose .bap-tab[data-mode="after"]')?.getAttribute('aria-pressed')==='true'&&document.querySelector('.arc-point-tuning-rose #wistiaBeforeAfter')?.classList.contains('is-playing'))
   assert.equal(await hint.textContent(),'여기 눌러보세요!')
   if(width===390){
    const shot='/tmp/16g-rose-hint-390.png'
    await page.locator('.arc-point-tuning-rose .bap-player').screenshot({path:shot})
    copyFileSync(shot,'/opt/cursor/artifacts/screenshots/16g-rose-hint-390.png')
   }
   assert.deepEqual(errors,[])
   await context.close()
   console.log(width+'px rose hint visible and playback advanced')
  }
  const quiet=await browser.newContext({viewport:{width:390,height:900}})
  const page=await quiet.newPage()
  await page.route('https://**/*',route=>route.abort())
  for(const path of ['/','/detail/duo']){
   await page.goto('http://127.0.0.1:'+port+path,{waitUntil:'domcontentloaded'})
   await page.waitForSelector('.bap-play')
   assert.equal(await page.locator('.bap-try').count(),0,path+' must not show the rose cue')
  }
  await quiet.close()
 }finally{await browser?.close();server.kill()}
})
