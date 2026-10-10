import {test} from 'node:test'
import assert from 'node:assert/strict'
import {createRequire} from 'node:module'
import {readFileSync,existsSync} from 'node:fs'
import {runInNewContext} from 'node:vm'
import {spawn,spawnSync} from 'node:child_process'
import {createServer} from 'node:net'
const require=createRequire(import.meta.url),rules=require('../js/booking-availability.js'),read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8')
await test('Complete recording intervals share duration, overlap and closing-hour rules',()=>{
 for(const [key,minutes,last,count]of [['solo',60,'오후 10시 30분',20],['duo',120,'오후 10시 30분',20],['duet-film',180,'오후 10시 30분',20],['solo-film',180,'오후 10시 30분',20],['unknown',60,'오후 10시 30분',20]]){const slots=rules.timeWindows(key);assert.equal(rules.duration(key),minutes);assert.equal(slots.length,count);assert.equal(slots.at(-1).label,last)}
 const blocks=[{start:'2026-10-11T16:30:00+09:00',end:'2026-10-11T18:30:00+09:00'}]
 for(const [start,blocked]of [['14:00',false],['15:00',true],['18:00',true],['19:00',false],['19:30',false]])assert.equal(rules.slotBlocked('2026-10-11',start,120,blocks),blocked)
 assert.equal(rules.slotBlocked('2026-10-11','22:00',120,[]),true)
 assert.equal(rules.slotBlocked('2026-10-11','21:00',120,[]),false)
 const window={};runInNewContext(read('js/contact-form.js'),{window,Date,Intl})
 const api=window.WistiaContact
 for(const minutes of [60,120,180])assert.match(api.text({timeStart:'13:00'},{details:{product:'상품',bookingMinutes:minutes,base:120000,total:120000,options:[],paybacks:[],paybackTotal:0}}),new RegExp('희망 시간 : 오후 1시~오후 '+(1+minutes/60)+'시 \\('+(minutes/60)+'시간\\)'))
 const app=read('js/app.js');assert.doesNotMatch(app,/extra-full|추가 1곡 완곡 녹음|detailRecordingOptions/);assert.match(app,/추가 1절 녹음/)
 assert.doesNotMatch(api.render().match(/<textarea[^>]*>/)[0],/placeholder=/)
 assert.match(app,/같은 노래로 직접 들어보세요/)
})
let skip=false
try{const p=require('playwright');if(!existsSync(process.env.WISTIA_BROWSER_EXECUTABLE||p.chromium.executablePath()))skip='Playwright Chromium executable not installed'}catch(e){if(e.code!=='MODULE_NOT_FOUND')throw e;skip='Playwright not installed'}
await test('Recording intervals and remaining option at 360/390/1280px',{skip,timeout:650000},async()=>{
 const probe=createServer();await new Promise(r=>probe.listen(0,'127.0.0.1',r));const port=probe.address().port;await new Promise(r=>probe.close(r))
 const server=spawn(process.execPath,['scripts/local-preview.mjs'],{env:{...process.env,WISTIA_PREVIEW_PORT:String(port)},stdio:['ignore','pipe','pipe']})
 try{await new Promise((resolve,reject)=>{const t=setTimeout(()=>reject(Error('preview timeout')),10000);server.stdout.once('data',()=>{clearTimeout(t);resolve()});server.once('error',reject)})
 const r=spawnSync(process.execPath,['tests/time-intervals-browser.mjs'],{env:{...process.env,WISTIA_PREVIEW_URL:`http://127.0.0.1:${port}`},encoding:'utf8',timeout:600000});assert.equal(r.status,0,[r.stdout,r.stderr,r.error&&String(r.error)].filter(Boolean).join('\n'));console.log(r.stdout.trim())
 }finally{server.kill()}
})
