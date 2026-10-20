import {test} from 'node:test'
import assert from 'node:assert/strict'
import {createRequire} from 'node:module'
import {readFileSync} from 'node:fs'
const {sectionTones}=createRequire(import.meta.url)('../js/detail-pc-background.js')
const read=path=>readFileSync(new URL('../'+path,import.meta.url),'utf8')

test('15 ordered sections use distinct, restrained light surfaces',()=>{
 assert.equal(sectionTones.length,15)
 assert.equal(new Set(sectionTones.map(([selector])=>selector)).size,15)
 assert.equal(new Set(sectionTones.map(([,color])=>color)).size,15)
 for(const [,color]of sectionTones){
  assert.match(color,/^#[\dA-F]{6}$/)
  for(const hex of color.slice(1).match(/../g))assert.ok(parseInt(hex,16)>=225)
 }
 assert.equal(sectionTones[0][0],'.mas-intro')
 assert.equal(sectionTones.at(-1)[0],'.solo-map')
 assert.ok(!sectionTones.some(([selector])=>/footer|kakao|wizard|contact/.test(selector)))
})
test('section numbers are decorative, cannot intercept controls and do not filter media',()=>{
 const js=read('js/detail-pc-background.js'),css=read('css/section-tones.css')
 assert.match(js,/badge\.setAttribute\('aria-hidden','true'\)/)
 assert.match(js,/section\.querySelector\(':scope>\.wistia-section-number'\)/)
 assert.match(css,/\.wistia-section-number\{[\s\S]*?pointer-events:none!important/)
 assert.match(css,/font-size:10px!important/)
 assert.doesNotMatch(css,/img\s*\{[^}]*filter:|mix-blend-mode|opacity:0/)
 assert.match(js,/backgroundMask\(pixels,width,height,protections\(src\)\)/)
 assert.match(js,/ivory-preview/)
})
test('home and normal DUET entries load the section CSS and fresh background script',()=>{
 const manifest=JSON.parse(read('css/bundles.json'))
 for(const page of ['index.html','detail/duo.html']){
  assert.ok(manifest.pages[page].sources.includes('css/section-tones.css?v=20261021-section-tones-1'))
  assert.match(read(page),/js\/detail-pc-background\.js\?v=20261021-section-tones-1/)
 }
})
