import assert from 'node:assert/strict'
import {test} from 'node:test'
import {mobileCanvasCss} from '../scripts/mobile-canvas-css.mjs'
import {createRequire} from 'node:module'
const require=createRequire(import.meta.url)
const {chromium}=require('C:/Users/User/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright-core')

test('desktop uses the real 390px cascade, including nested media, without altering mobile CSS',async()=>{
 const source='/* @media(min-width:1px){ ignored } */ .probe{font-size:clamp(10px,4vw,30px);width:92vw;display:grid;grid-template-columns:1fr;--literal:"@media(x){y}"}@media(min-width:780px){.probe{font-size:48px;grid-template-columns:repeat(3,1fr)}}@media(max-width:600px){@supports(display:grid){.probe{color:rgb(10,20,30)}}}@media(min-width:341px) and (max-width:374px){.probe{font-size:12px}}'
 const compiled=mobileCanvasCss(source,'fixture.css')
 assert.ok(compiled.includes(source))
 const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'})
 try{
  for(const width of [360,375,390,779,780,1280]){
   const page=await browser.newPage({viewport:{width,height:800}})
   await page.setContent('<style>'+compiled+'</style><div class="probe">hello</div>')
   const s=await page.locator('.probe').evaluate(e=>{const s=getComputedStyle(e);return {font:parseFloat(s.fontSize),width:parseFloat(s.width),cols:s.gridTemplateColumns.split(' ').length,color:s.color}})
   assert.ok(Math.abs(s.font-(width>=780?15.6:width<=374?12:Math.min(30,width*.04)))<.02,JSON.stringify({width,s}))
   assert.equal(s.cols,1)
   assert.ok(Math.abs(s.width-(width>=780?717.6:width*.92))<.02)
   if(width<=600||width>=780)assert.equal(s.color,'rgb(10, 20, 30)')
   await page.close()
  }
 }finally{await browser.close()}
})

test('real canvas override is not compiled into a virtual phone width',()=>{
 const source='@media(min-width:780px){body{background:white}}'
 assert.equal(mobileCanvasCss(source,'css/mobile-parity-780.css'),source)
})

test('named detail container queries use the phone content width rather than the wide desktop container',()=>{
 const css=mobileCanvasCss('@container solo-detail (min-width:430px){.a{display:grid;grid-template-columns:1fr 1fr}}@container solo-detail (max-width:370px){.a{display:block}}','fixture.css')
 const desktop=css.split('@media (min-width:780px){')[1]
 assert.doesNotMatch(desktop,/grid-template-columns/)
 assert.match(desktop,/@container solo-detail \(min-width: 0px\)\{\.a\{display:block\}\}/)
})
