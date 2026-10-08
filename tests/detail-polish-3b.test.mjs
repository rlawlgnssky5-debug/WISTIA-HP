// Run the real desktop/mobile regression against an isolated local preview.
import assert from 'node:assert/strict'
import {spawn,spawnSync} from 'node:child_process'
import {createServer} from 'node:net'
import {fileURLToPath} from 'node:url'
const root=fileURLToPath(new URL('../',import.meta.url)),probe=createServer()
await new Promise(resolve=>probe.listen(0,'127.0.0.1',resolve))
const port=probe.address().port
await new Promise(resolve=>probe.close(resolve))
const server=spawn(process.execPath,['scripts/local-preview.mjs'],{cwd:root,env:{...process.env,WISTIA_PREVIEW_PORT:String(port)},stdio:['ignore','pipe','pipe']})
try{
 await new Promise((resolve,reject)=>{const timer=setTimeout(()=>reject(Error('preview startup timeout')),10000);server.stdout.once('data',()=>{clearTimeout(timer);resolve()});server.once('error',error=>{clearTimeout(timer);reject(error)});server.once('exit',code=>{clearTimeout(timer);reject(Error('preview exited: '+code))})})
 const run=spawnSync(process.execPath,['tests/detail-polish-3b-browser.mjs'],{cwd:root,env:{...process.env,WISTIA_PREVIEW_URL:`http://127.0.0.1:${port}`},encoding:'utf8',timeout:120000})
 assert.equal(run.status,0,run.stderr||String(run.error));console.log(run.stdout.trim())
}finally{server.kill()}
