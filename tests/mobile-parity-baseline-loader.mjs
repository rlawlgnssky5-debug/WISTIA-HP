import fs from 'node:fs'
import {fileURLToPath} from 'node:url'
import {registerHooks,syncBuiltinESMExports} from 'node:module'
const read=fs.readFileSync.bind(fs)
const sources=JSON.parse(read(new URL('../output/mobile-parity-20261021/baseline-test-sources.json',import.meta.url),'utf8'))
const key=p=>{try{return (p instanceof URL?fileURLToPath(p):String(p)).replaceAll('\\','/')}catch{return ''}}
fs.readFileSync=function(p,options){const s=sources[key(p)];return s===undefined?read(p,options):typeof options==='string'||options?.encoding?s:Buffer.from(s)}
syncBuiltinESMExports()
registerHooks({load(url,context,next){const s=sources[key(new URL(url))];return s!==undefined&&url.endsWith('.mjs')?{source:s,format:'module',shortCircuit:true}:next(url,context)}})
