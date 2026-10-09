// Browser regressions are optional on PCs without Playwright or a browser installation.
import assert from 'node:assert/strict'
import {test} from 'node:test'
import {createRequire} from 'node:module'
import {existsSync} from 'node:fs'
import {spawn,spawnSync} from 'node:child_process'
import {createServer} from 'node:net'
import {fileURLToPath} from 'node:url'
let skipReason=false,executable
try{
 const {chromium}=createRequire(import.meta.url)('playwright')
 executable=process.env.WISTIA_BROWSER_EXECUTABLE||(existsSync('/usr/bin/chromium')?'/usr/bin/chromium':chromium.executablePath())
 if(!existsSync(executable))skipReason='브라우저가 설치되지 않아 브라우저 회귀 테스트를 건너뜁니다'
}catch(error){if(error.code!=='MODULE_NOT_FOUND')throw error;skipReason='Playwright가 없어 브라우저 회귀 테스트를 건너뜁니다'}
await test('문의 달력 및 고정 바 PC/모바일 브라우저 회귀',{skip:skipReason},async()=>{
 const root=fileURLToPath(new URL('../',import.meta.url)),probe=createServer()
 await new Promise(resolve=>probe.listen(0,'127.0.0.1',resolve))
 const port=probe.address().port
 await new Promise(resolve=>probe.close(resolve))
 const server=spawn(process.execPath,['scripts/local-preview.mjs'],{cwd:root,env:{...process.env,WISTIA_PREVIEW_PORT:String(port)},stdio:['ignore','pipe','pipe']})
 try{
  await new Promise((resolve,reject)=>{const timer=setTimeout(()=>reject(Error('preview startup timeout')),10000);server.stdout.once('data',()=>{clearTimeout(timer);resolve()});server.once('error',error=>{clearTimeout(timer);reject(error)});server.once('exit',code=>{clearTimeout(timer);reject(Error('preview exited: '+code))})})
  for(const script of ['detail-polish-3b-browser.mjs','detail-polish-4-browser.mjs','detail-polish-5-browser.mjs','detail-polish-6-browser.mjs','detail-polish-7-browser.mjs']){
   const run=spawnSync(process.execPath,['tests/'+script],{cwd:root,env:{...process.env,WISTIA_PREVIEW_URL:`http://127.0.0.1:${port}`,WISTIA_BROWSER_EXECUTABLE:executable},encoding:'utf8',timeout:240000})
   assert.equal(run.status,0,run.stderr||String(run.error));console.log(run.stdout.trim())
  }
 }finally{server.kill()}
})
