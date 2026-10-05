import assert from 'node:assert/strict'
import {readFileSync} from 'node:fs'
import {createHash} from 'node:crypto'
import {runInNewContext} from 'node:vm'

const read=path=>readFileSync(new URL('../'+path,import.meta.url),'utf8')
const digest=path=>createHash('sha256').update(readFileSync(new URL('../'+path,import.meta.url))).digest('hex')
const css=read('css/luxury-finish.css'),app=read('js/app.js'),index=read('index.html')
const block=selector=>{
 const position=css.indexOf(selector+'{')
 assert.notEqual(position,-1,selector+' must have an explicit finish rule')
 return css.slice(position,css.indexOf('}',position)+1)
}

// Preserve the approved flat broadcast artwork and the genuine lyric example byte-for-byte
assert.equal(digest('assets/img/studio-graphics/broadcast.svg'),'e59ec317eb091527adb6b7553e94bc0e563ad8e9efe5a4e7fff09a57241e270e')
assert.equal(digest('assets/img/song-options/lyric-video-v2.webp'),'ca947d5ef39db38f9e296be8d378f222fad426c55406750693de237616c9414b')
assert.doesNotMatch(css,/@import|font-family:|url\(|grayscale\(|\.ar-expert-broadcast/)

// Earlier inherited cards had padding 27px 0 and no list gap; both are intentionally repaired
assert.match(block('.wistia-advantages ol'),/display:grid!important;gap:18px!important/)
assert.match(block('.wistia-advantages li'),/gap:22px!important;[\s\S]*padding:28px 26px!important/)
assert.match(block('.wistia-advantages li h3'),/margin:10px 0 16px!important/)
assert.match(block('.wistia-advantages li p'),/line-height:1\.85!important;letter-spacing:0!important/)
assert.match(css,/@media\(max-width:600px\)[\s\S]*grid-template-columns:30px minmax\(0,1fr\)!important/)
assert.match(css,/@media\(max-width:360px\)[\s\S]*padding:22px 16px!important/)

// Clear hierarchy for event title, live total, discount groups, checkboxes and terms
assert.match(block('.consultation-gifts'),/margin:36px 0 0!important;padding:28px 24px!important/)
assert.match(block('.consultation-gift-heading'),/display:block!important;margin:0 0 30px!important/)
assert.match(block('.benefit-total'),/margin:22px 0 0!important;padding:14px 16px!important/)
assert.match(block('.event-benefit-group'),/margin:32px 0 0!important/)
assert.match(block('.event-list'),/gap:14px!important/)
assert.match(block('.event-choice'),/min-height:56px!important/)
assert.match(block('.event-terms'),/padding:0 18px 20px 52px!important;[\s\S]*line-height:1\.85!important/)

// Option examples are content, not tiny icons, and remain visible without selecting the checkbox
assert.match(block('.has-option-photo>.option-photo'),/display:block!important;[\s\S]*width:100%!important;[\s\S]*aspect-ratio:16\/9!important/)
assert.match(block(':is(.lyric-option-image,[data-lyric-example])'),/display:block!important;visibility:visible!important;opacity:1!important/)
assert.match(block('.arc-lyrics>figure'),/display:block!important;visibility:visible!important/)
assert.match(block('.arc-lyrics>figure img'),/aspect-ratio:16\/9;object-fit:contain!important;filter:none!important/)

const context={selectedOptions:new Set(),optionQuantities:{},shortWon:price=>price/10000+'만원',img:(src,alt)=>'<img src="'+src+'" alt="'+alt+'">'}
runInNewContext(app.slice(app.indexOf('function renderProductOption('),app.indexOf('function bookingBaseSection(')),context)
const option={key:'lyrics-video',label:'가사 영상 추가',detail:'가사를 담은 영상 추가',price:40000}
const unchecked=context.renderProductOption(option)
context.selectedOptions.add('lyrics-video')
const checked=context.renderProductOption(option)
for(const html of [unchecked,checked]){
 assert.match(html,/class="option-photo lyric-option-image"/)
 assert.match(html,/<img src="assets\/img\/song-options\/lyric-video-v2\.webp"/)
 assert.match(html,/data-option="lyrics-video"/)
 assert.match(html,/\+4만원/)
 assert.doesNotMatch(html,/hidden|display:none/)
}
assert.ok(index.indexOf('css/luxury-finish.css?')>index.indexOf('css/studio-graphics.css?'),'finishing CSS must load after older hiding and graphic rules')
console.log('Luxury spacing, full-size always-visible genuine lyric examples and approved broadcast preserved: passed')
