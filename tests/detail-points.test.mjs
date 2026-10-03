import assert from 'node:assert/strict'
import {readFileSync,existsSync} from 'node:fs'
import {runInNewContext} from 'node:vm'
const read=file=>readFileSync(new URL('../'+file,import.meta.url),'utf8')
const app=read('js/app.js'),css=read('css/detail-point-system.css')
const scope={
 PRODUCTS:{solo:{normal:120000,resultVideo:'assets/video/groom-wedding-song-ar.mp4'},duo:{normal:160000,resultVideo:'assets/video/duo-wedding-song-ar.mp4'}},
 AR_DETAIL_CONTENT:{solo:{poster:'assets/img/ar-detail/solo-live-proof.jpg'},'duet-film':{poster:'story.jpg',videoLabel:'스토리'}},
 img:(src,alt)=>'<img src="'+src+'" alt="'+alt+'">',escapeHtml:x=>x,
 EVENTS:[],shortWon:n=>(n/10000)+'만원',
 filmFormatPrice:()=>350000,selectedFilmPeople:2,
 soloReviewCarousel:()=>'<section id="reviews"></section>',
 productPackageOverview:()=>'<div>기본 구성</div>',productComparisonSection:()=>'<section>장점</section>',
 arExpertStory:()=>'<section><header><h2>영상·사운드 제작</h2></header></section>',
 verticalProcessSection:()=>'<section><header><p class="wps-kicker">제작 과정</p><h2>과정</h2></header><details><summary>열기</summary></details></section>',
 bookingGuideSection:()=>'',faq:()=>'',footer:()=>'<footer></footer>',
 arCdRatioSection:()=>'<section id="arRatioExperience"><p class="wistia-ar__eyebrow" data-solo-kicker>AR RATIO EXPERIENCE</p><h2>AR 비율</h2></section>'
}
runInNewContext(app.slice(app.indexOf('function wistiaBeforeAfterSection('),app.indexOf('function setExpertPanel(')),scope)
runInNewContext(app.slice(app.indexOf('function detailPointSection('),app.indexOf('function initArCommerceDetail(')),scope)
const labels=html=>Array.from(html.matchAll(/class="[^"]*detail-point-label"[^>]*>(POINT \d{2})</g),m=>m[1])
for(const key of ['solo','duo']){
 const html=scope.arCommerceDetail(scope.PRODUCTS[key],key),data=scope.arCustomerVideoData(key)
 assert.deepEqual(labels(html),['POINT 01','POINT 02','POINT 03','POINT 04','POINT 05'])
 assert.ok(html.includes('src="'+data.src+'"'))
 assert.ok(html.includes('poster="'+data.poster+'"'))
 assert.match(html,/가사 영상 추가 옵션 · \+40,000원/)
 for(const path of [data.src,data.poster])assert.ok(existsSync(new URL('../'+path,import.meta.url)),path)
}
const story=scope.filmCommerceDetail({videoUrl:'https://www.youtube.com/embed/aSKrlQwmnHI',faq:[]},'duet-film')
assert.deepEqual(labels(story),['POINT 01','POINT 02','POINT 03','POINT 04'])
assert.match(story,/영상에 담길 목소리도<br>자연스럽게 완성합니다/)
assert.doesNotMatch(story,/목소리를 완성하는 작업|노래는 한 소절씩|arRatioExperience|POINT 05/)
assert.equal((story.match(/id="wistiaBeforeAfterTitle"/g)||[]).length,1)
assert.match(story,/350,000/)
const attributes=src=>({attrs:{src},setAttribute(k,v){this.attrs[k]=v},getAttribute(k){return this.attrs[k]},classList:{remove(){}}})
const source=attributes(scope.PRODUCTS.solo.resultVideo),fallback=attributes(),control=attributes(),video=attributes()
let pauses=0,loads=0
video.pause=()=>{pauses++};video.load=()=>{loads++};video.querySelector=()=>source
const root={querySelector:s=>s.includes('video')&&s.includes('media')?video:s.includes('fallback')?fallback:control}
scope.updateArCustomerVideo(root,'duo')
assert.equal(source.attrs.src,scope.PRODUCTS.duo.resultVideo)
assert.equal(video.attrs.poster,scope.arCustomerVideoData('duo').poster)
assert.equal(fallback.attrs.alt,scope.arCustomerVideoData('duo').label)
assert.equal(control.attrs['aria-label'],'영상 재생')
scope.updateArCustomerVideo(root,'duo')
assert.equal(loads,1,'same selection must not restart video')
scope.updateArCustomerVideo(root,'solo')
assert.equal(source.attrs.src,scope.PRODUCTS.solo.resultVideo)
assert.equal(pauses,2);assert.equal(loads,2)
assert.doesNotMatch(app.slice(app.indexOf('function updateArCustomerVideo('),app.indexOf('function arCommerceDetail(')),/\.play\(/)
assert.match(css,/prefers-reduced-motion:no-preference/)
assert.match(css,/data-studio-motion="on"/)
assert.match(css,/prefers-reduced-motion:reduce/)
assert.match(css,/folder-cue-nudge 2\.8s ease-in-out 3/)
assert.match(app,/process-folder-art" aria-hidden="true"/)
console.log('AR and story POINT order, product-specific video swaps, fees and restrained folder cues passed')
