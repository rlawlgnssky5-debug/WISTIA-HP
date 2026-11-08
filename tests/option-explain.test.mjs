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
  assert.match(app,/어떤 타입이 나에게 맞을까요\?/)
  assert.match(app,/나에게 맞는 타입을 선택하고, 패키지 할인 혜택까지 챙겨보세요!/)
  const hook=app.match(/function homeTypeBlock\(key\)\{[^}]+\}/)[0]
  assert.match(hook,/class="type-unify"/)
  assert.match(hook,/typeGuideSection\(\)/)
  assert.match(hook,/\.replace\('<h2 id="packageSelectionTitle" class="package-guide-title">/)
  assert.doesNotMatch(hook,/optionExplainSection\(\)/)
  assert.match(app,/function typeGuideSection\(\)\{return '<img class="type-unify-poster"/)
  assert.match(app,/assets\/img\/type-guide\/type-final\.webp/)
  assert.match(app,/alt="어떤 타입이 나한테 맞을까\?"/)
  assert.doesNotMatch(wizard,/type-guide|type-final/)
  assert.match(hook,/packageSalesSection\(key\)/)
  assert.match(app,/insertAdjacentHTML\('afterend',homeTypeBlock\(key\)\)/)
  assert.doesNotMatch(wizard,/옵션 설명!|튜닝중~|ox-status/)
})

test('status bubble is outside the image and no mascot gets its own plate',()=>{
  assert.match(css,/\.ox-figure\{[^}]*display:flex/)
  assert.match(css,/\.ox-status\{[^}]*flex:0 0 auto/)
  assert.match(css,/\.ox-figure img\{[^}]*background:transparent/)
  assert.match(css,/\.ox-figure img\{[^}]*max-height:72px/)
  assert.match(css,/\.ox-card\{[^}]*padding:5px 12px 6px/)
  assert.match(read('js/svg-interface.js'),/!section\.matches\('\.mas-selection,\.option-explain'\)/)
  const pricing=read('js/package-pricing.js')
  for(const line of [
    '50분 녹음과 정밀 믹싱·마스터링이 필요하다면? 기본에 충실한 스탠다드를 추천드려요!',
    '1시간 30분의 여유로운 녹음부터 믹싱·마스터링까지! 완성도 높은 축가를 위한 올인원 패키지예요',
    '노래에 조금 자신이 없는 분들을 위한 패키지! 2시간 30분의 넉넉한 녹음 시간으로 한 소절씩 여유롭게 완성해 보세요!',
    '두 분이 함께 부르는 축가라면? 2시간 30분의 넉넉한 녹음 시간에 믹싱·마스터링까지 포함된 듀엣 전용 올인원 패키지예요!'
  ])assert.ok(pricing.includes(line),line)
  assert.match(pricing,/'<i>'\+esc\(picked\.name\)\+'<\/i>'\+save/)
  assert.doesNotMatch(pricing,/picked\.key==='D'\?'':esc\(picked\.guide/)
  assert.match(read('css/type-guide.css'),/\[data-package-selection-details\] \{\s*display: none !important/)
  assert.doesNotMatch(css,/\.ox-step:nth-child|data-ox="coral"[\s\S]{0,180}background:\s*#f[0-9a-f]{5}/i)
})

test('mascot pngs are transparent at the corners and opaque on the face',()=>{
  const report=execFileSync('python3',['-c',`
from PIL import Image
from pathlib import Path
root=Path('assets/img/option-explain')
for name in ['opt-tune.png','opt-mix.png','opt-master.png']:
    im=Image.open(root/name).convert('RGBA')
    w,h=im.size
    for x,y in ((0,0),(w-1,0),(0,h-1),(w-1,h-1)):
        assert im.getpixel((x,y))[3]==0, f'{name} corner {x},{y}'
    cream=False
    for y in range(int(h*0.2), int(h*0.5)):
        for x in range(int(w*0.35), int(w*0.65)):
            r,g,b,a=im.getpixel((x,y))
            if a>200 and r>220 and g>200 and b>180:
                cream=True
                break
        if cream: break
    assert cream, name+' missing cream face'
    print(name,'ok',w,h)
`],{cwd:new URL('..',import.meta.url),encoding:'utf8'})
  assert.match(report,/opt-master.png ok/)
})
