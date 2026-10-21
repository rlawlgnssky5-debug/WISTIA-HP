// Run the full legacy suite against HEAD without resetting the working tree
import fs from 'node:fs'
import {fileURLToPath} from 'node:url'
import {registerHooks,syncBuiltinESMExports} from 'node:module'
const originalRead=fs.readFileSync.bind(fs)
const sources=JSON.parse(originalRead(new URL('../output/780-payback-20261021/baseline-sources.json',import.meta.url),'utf8'))
const key=path=>{try{return typeof path==='number'?'':(path instanceof URL?fileURLToPath(path):String(path)).replaceAll('\\','/')}catch{return ''}}
fs.readFileSync=function(path,options){const text=sources[key(path)];if(text===undefined)return originalRead(path,options);return typeof options==='string'||options?.encoding?text:Buffer.from(text)}
syncBuiltinESMExports()
registerHooks({load(url,context,next){const text=sources[key(new URL(url))];return text!==undefined&&url.endsWith('.mjs')?{source:text,format:'module',shortCircuit:true}:next(url,context)}})
