import {test} from 'node:test'
import assert from 'node:assert/strict'
import {createRequire} from 'node:module'
import {existsSync} from 'node:fs'
import {spawn,spawnSync} from 'node:child_process'
import {createServer} from 'node:net'
let skip=false
try{const p=createRequire(import.meta.url)('playwright');if(!existsSync(process.env.WISTIA_BROWSER_EXECUTABLE||p.chromium.executablePath())&&!existsSync(p.webkit.executablePath()))skip='No browser executable installed'}catch(e){if(e.code!=='MODULE_NOT_FOUND')throw e;skip='Playwright not installed'}
await test('Calendar real touch: Chromium and optional WebKit/iPhone, KakaoTalk UA',{skip},async()=>{
 const probe=createServer();await new Promise(r=>probe.listen(0,'127.0.0.1',r));const port=probe.address().port;await new Promise(r=>probe.close(r))
 const server=spawn(process.execPath,['scripts/local-preview.mjs'],{env:{...process.env,WISTIA_PREVIEW_PORT:String(port)},stdio:['ignore','pipe','pipe']})
 try{
  await new Promise((resolve,reject)=>{const t=setTimeout(()=>reject(Error('preview timeout')),10000);server.stdout.once('data',()=>{clearTimeout(t);resolve()});server.once('error',reject)})
  const r=spawnSync(process.execPath,['tests/calendar-touch-browser.mjs',`http://127.0.0.1:${port}`],{env:process.env,encoding:'utf8',timeout:300000});assert.equal(r.status,0,r.stderr||String(r.error));console.log(r.stdout.trim())
 }finally{server.kill()}
})
