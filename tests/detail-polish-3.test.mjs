import assert from 'node:assert/strict'
import {readFileSync,existsSync} from 'node:fs'
import {createHash} from 'node:crypto'
import {runInNewContext} from 'node:vm'
const read=path=>readFileSync(new URL('../'+path,import.meta.url),'utf8')
const app=read('js/app.js')
for(const [kind,expected] of [['bride','b0db72fb56a6d79e7411037ecbcd226c5deafadf70da917c104c6f8adcb3a2be'],['groom','0708ef1da63368d2889001f3f8be6bbbe4f5724fe0c033754f0ca157605b126c']]){
 const bytes=readFileSync(new URL(`../assets/img/story-polish/entrance-${kind}-v2.webp`,import.meta.url))
 assert.equal(createHash('sha256').update(bytes).digest('hex'),expected)
 assert.equal(bytes.subarray(0,4).toString(),'RIFF');assert.equal(bytes.subarray(8,12).toString(),'WEBP')
 assert.ok(existsSync(new URL(`../assets/img/studio-graphics/${kind}-entrance.svg`,import.meta.url)))
}
const scope={selectedOptions:new Set(),img:(src,alt)=>`<img src="${src}" alt="${alt}">`,shortWon:value=>String(value),optionQuantities:{},inquiryUndecided:false,bookingFilmFormatSection:()=>''}
runInNewContext(app.slice(app.indexOf('function renderProductOption('),app.indexOf('function bookingExtraSection(')),scope)
for(const key of ['solo','duo','duet-film']){
 const base=scope.bookingBaseSection(key)
 assert.doesNotMatch(base,/고민\s*중|undecided/)
 assert.equal((base.match(/<option value=/g)||[]).length,2)
}
assert.doesNotMatch(app,/entrance-(bride|groom)-v2\.webp/,'retired image files remain preserved but unreferenced')
assert.doesNotMatch(scope.renderProductOption({key:'extra-verse',label:'1절 녹음 추가',price:60000}),/option-photo|<img/)
const window={};runInNewContext(read('js/contact-form.js'),{window})
for(const mode of [{},{embedded:true},{integrated:true}])assert.doesNotMatch(window.WistiaContact.render(null,mode),/<option[^>]*>상담 후 결정|고민\s*중/)
assert.match(window.WistiaContact.submit(),/작성한 내용으로 카카오톡 문의하기/)
assert.doesNotMatch(window.WistiaContact.submit(),/이제 복사|카카오톡으로!|inquiry-submit-next/)
console.log('Third polish: exact user WebP hashes, retained originals, two product choices and single-line destination CTA passed')
