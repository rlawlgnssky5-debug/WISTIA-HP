// Read-only baseline verification for the two unrelated legacy test failures
import fs from 'node:fs'
import {execFileSync} from 'node:child_process'
import {syncBuiltinESMExports} from 'node:module'
import {fileURLToPath} from 'node:url'
import {resolve,relative} from 'node:path'
const root=resolve(import.meta.dirname,'..'),read=fs.readFileSync,cache=new Map()
fs.readFileSync=function(file,options){
 let local
 try{local=relative(root,file instanceof URL?fileURLToPath(file):resolve(String(file))).replaceAll('\\','/')}catch{return read(file,options)}
 if(!local.startsWith('../')&&!local.startsWith('.git/')&&/\.(?:js|html|css|json)$/.test(local)){
  if(!cache.has(local)){try{cache.set(local,execFileSync('git',['-c','safe.directory='+root,'show','HEAD:'+local],{cwd:root,stdio:['ignore','pipe','pipe']}))}catch{cache.set(local,null)}}
  const data=cache.get(local)
  if(data){const encoding=typeof options==='string'?options:options?.encoding;return encoding?data.toString(encoding):Buffer.from(data)}
 }
 return read(file,options)
}
syncBuiltinESMExports()
