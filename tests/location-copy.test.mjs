import {test} from 'node:test'
import assert from 'node:assert/strict'
import {createRequire} from 'node:module'
import {existsSync,readFileSync} from 'node:fs'
import {spawn,spawnSync} from 'node:child_process'
import {createServer} from 'node:net'
const require=createRequire(import.meta.url),read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8')
await test('Directions keep the original information and expose an accessible address copy control',()=>{
 const app=read('js/app.js'),location=app.split('\n').find(line=>line.startsWith(' const locationContent='))
 assert.match(location,/data-copy-address/);assert.match(location,/aria-label="주소 복사"/)
 assert.match(location,/studioIcon\('pin'\)/);assert.match(location,/studioIcon\('train'\)/);assert.match(location,/studioIcon\('car'\)/)
 assert.match(location,/부천시청역 1번 출구에서 도보 약 300m 이동해 주세요/)
 assert.match(location,/스튜디오 바로 옆 공영주차장을 이용하실 수 있습니다 주차 요금은 별도이며 주차비 지원은 어렵습니다/)
 assert.match(app,/area\.setSelectionRange\(0,text\.length\)/)
 assert.match(app,/document\.execCommand\('copy'\)/)
})
let skip=false
try{const p=require('playwright');if(!existsSync(process.env.WISTIA_BROWSER_EXECUTABLE||p.chromium.executablePath()))skip='Playwright Chromium executable not installed'}catch(e){if(e.code!=='MODULE_NOT_FOUND')throw e;skip='Playwright not installed'}
await test('One-line address, warm directions layout and touch clipboard fallback at 360/390/1280px',{skip,timeout:180000},async()=>{
 const probe=createServer();await new Promise(r=>probe.listen(0,'127.0.0.1',r));const port=probe.address().port;await new Promise(r=>probe.close(r))
 const server=spawn(process.execPath,['scripts/local-preview.mjs'],{env:{...process.env,WISTIA_PREVIEW_PORT:String(port)},stdio:['ignore','pipe','pipe']})
 try{
  await new Promise((resolve,reject)=>{const t=setTimeout(()=>reject(Error('preview timeout')),10000);server.stdout.once('data',()=>{clearTimeout(t);resolve()});server.once('error',reject)})
  const r=spawnSync(process.execPath,['tests/location-copy-browser.mjs'],{env:{...process.env,WISTIA_PREVIEW_URL:`http://127.0.0.1:${port}`},encoding:'utf8',timeout:170000})
  assert.equal(r.status,0,[r.stdout,r.stderr,r.error&&String(r.error)].filter(Boolean).join('\n'));console.log(r.stdout.trim())
 }finally{server.kill()}
})
