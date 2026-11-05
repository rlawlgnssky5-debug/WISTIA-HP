import assert from 'node:assert/strict'
import {execFileSync} from 'node:child_process'
import {readFileSync} from 'node:fs'
import {test} from 'node:test'

const root=new URL('../',import.meta.url)
const read=file=>readFileSync(new URL(file,root),'utf8')
const app=read('js/app.js')
const css=read('css/option-explain.css')
const wizard=read('js/booking-wizard.js')

test('homepage option steps use transparent pngs and sit above the type table',()=>{
  const block=app.slice(app.indexOf('function optionExplainSection'),app.indexOf('function packageSalesSection'))
  assert.match(block,/옵션 설명!/)
  assert.match(block,/튜닝중~/)
  assert.match(block,/믹싱중~/)
  assert.match(block,/마스터링중~/)
  for(const line of [
    '한 음, 한 박자까지 수작업으로 정교하게 다듬어',
    '목소리의 자연스러움은 살리고 노래의 완성도를 높입니다',
    '목소리의 음색·질감을 세밀하게 다듬고 반주와 균형을 맞춰,',
    '더 풍성하고 조화로운 사운드로 완성합니다',
    '음원의 음압·다이내믹·주파수 밸런스를 정교하게 조율해',
    '선명도와 깊이를 높이고, 최종 음원으로 마무리합니다'
  ])assert.ok(block.includes(line),line)
  assert.match(block,/assets\/img\/option-explain\/opt-tune\.png/)
  assert.match(block,/assets\/img\/option-explain\/opt-mix\.png/)
  assert.match(block,/assets\/img\/option-explain\/opt-master\.png/)
  assert.doesNotMatch(block,/송송/)
  assert.doesNotMatch(block,/\.jpg/)
  const hook=app.match(/function homeTypeBlock\(key\)\{[^}]+\}/)[0]
  assert.match(hook,/key==='solo'\?optionExplainSection\(\):''/)
  assert.match(hook,/packageSalesSection\(key\)/)
  assert.match(app,/insertAdjacentHTML\('afterend',homeTypeBlock\(key\)\)/)
  assert.doesNotMatch(wizard,/옵션 설명!|튜닝중~|ox-status/)
})

test('status bubble is outside the image and no mascot gets its own plate',()=>{
  assert.match(css,/\.ox-figure\{[^}]*display:flex/)
  assert.match(css,/\.ox-status\{[^}]*flex:0 0 auto/)
  assert.match(css,/\.ox-figure img\{[^}]*background:transparent/)
  assert.match(css,/\.ox-card\{[^}]*min-height:168px/)
  assert.match(read('js/svg-interface.js'),/!section\.matches\('\.mas-selection,\.option-explain'\)/)
  assert.doesNotMatch(css,/\.ox-step:nth-child|data-ox="coral"[\s\S]{0,180}background:\s*#f[0-9a-f]{5}/i)
})

test('mascot pngs are transparent at the corners',()=>{
  const report=execFileSync('python3',['-c',`
from PIL import Image
from pathlib import Path
root=Path('assets/img/option-explain')
for name in ['opt-tune.png','opt-mix.png','opt-master.png']:
    im=Image.open(root/name)
    assert im.mode=='RGBA', name
    w,h=im.size
    for x,y in ((0,0),(w-1,0),(0,h-1),(w-1,h-1)):
        assert im.getpixel((x,y))[3]==0, f'{name} {x},{y}'
    print(name,'ok',w,h)
`],{cwd:new URL('..',import.meta.url),encoding:'utf8'})
  assert.match(report,/opt-master.png ok/)
})
