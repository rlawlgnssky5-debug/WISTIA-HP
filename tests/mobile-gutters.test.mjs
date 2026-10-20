import assert from 'node:assert/strict'
import {readFileSync,existsSync} from 'node:fs'
import {resolve} from 'node:path'
import {test} from 'node:test'
import {inspectCss} from '../scripts/build-css-bundle.mjs'

const root=resolve(import.meta.dirname,'..')
const read=p=>readFileSync(resolve(root,p),'utf8')
const css=read('css/mobile-gutters-1020.css')

test('mobile gutters stay inside the 600px boundary and alter only spacing, radii and type-size compensation',()=>{
  inspectCss(css,'css/mobile-gutters-1020.css')
  assert.match(css,/@media \(max-width:600px\)/)
  assert.match(css,/width:92vw!important/)
  assert.match(css,/margin-left:4vw!important/)
  assert.match(css,/margin-right:4vw!important/)
  assert.match(css,/padding-left:4vw!important/)
  assert.match(css,/padding-right:4vw!important/)
  assert.match(css,/border-radius:8px!important/)
  const properties=[...css.matchAll(/[;{]\s*([\w-]+)\s*:/g)].map(m=>m[1])
  for(const property of properties)assert.ok(['width','max-width','margin-left','margin-right','padding-left','padding-right','border-radius','font-size'].includes(property),property)
  for(const m of css.matchAll(/font-size:([^;}]+)/g))assert.match(m[1],/cqw.*\/ \.92/)
})

test('all requested entry points include the gutter source last and use the refreshed cache',()=>{
  const m=JSON.parse(read('css/bundles.json'))
  for(const page of ['index.html','detail/solo.html','detail/duo.html','info/faq.html','contact.html','event/solo.html','event/duo.html']){
    assert.match(m.pages[page].sources.at(-1),/mobile-gutters-1020\.css/)
    assert.match(m.pages[page].href,/\?v=20261020-mobile-gutters-1$/)
  }
})

const findings='tmp/mobile-gutters-20261020/findings.json'
test('captured mobile and desktop views preserve content, controls and typography without overflow',{skip:!existsSync(resolve(root,findings))},()=>{
  const results=JSON.parse(read(findings))
  assert.equal(results.length,48)
  for(const e of results){
    assert.equal(e.scrollWidth,e.width,e.name+': overflow')
    for(const key of ['textUnchanged','imagesUnchanged','fontsUnchanged','colorsUnchanged','fixedUnchanged','desktopGeometryUnchanged'])assert.equal(e[key],true,e.name+': '+key)
    assert.deepEqual(e.brokenImages,[],e.name)
    assert.deepEqual(e.errors,[],e.name)
  }
})
