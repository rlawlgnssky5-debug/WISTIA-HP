import assert from 'node:assert/strict'
import {readFileSync,existsSync} from 'node:fs'
import {runInNewContext} from 'node:vm'
const read=file=>readFileSync(new URL('../'+file,import.meta.url),'utf8')
const source=read('js/app.js'),css=read('css/mobile-ar-solo.css')
const scope={
 img:(src,alt)=>'<img src="'+src+'" alt="'+alt+'">',escapeHtml:x=>x,shortWon:n=>(n/10000)+'만원',
 arExpertStory:()=>'<section><header><h2>영상·사운드 제작</h2></header></section>',
 soloReviewCarousel:()=>'<section id="reviews"><header><span data-solo-kicker>고객 후기</span><h2>실제 고객 후기</h2><p data-solo-sub>직접 보내주신 카카오톡 후기 원문입니다</p></header></section>',
 footer:()=>'<footer><strong class="mas-footer-slogan">완성도는 높이고, 부담은 줄인 가격을 약속드립니다</strong></footer>',
 faq:items=>'<div class="faq-list">'+items.map(([q,a])=>'<details><summary>'+q+'</summary><p>'+a+'</p></details>').join('')+'</div>',
 detailStudioSteps:()=>Array.from({length:7},(_,i)=>({id:i+1,title:'단계',description:'제작 설명'}))
}
const evaluate=(start,end)=>runInNewContext(source.slice(source.indexOf(start),source.indexOf(end)),scope)
evaluate('const PRODUCTS =','const EVENTS =')
evaluate('const EVENTS =','const ACTUAL_REVIEW_IMAGES')
evaluate('const FILM_FORMAT_PRICES =','const BASE_FILM_FORMAT =')
evaluate('function filmFormatPrice(','function proposalFormatPreview(')
evaluate('const AR_DETAIL_CONTENT=','function detailHookHero(')
evaluate('const WISTIA_ADVANTAGES=','function prepareArHookVideo(')
evaluate('function wistiaBeforeAfterSection(','function setExpertPanel(')
evaluate('function storyProcessCards(','function processTypeButton(')
evaluate('function detailPointSection(','function initArCommerceDetail(')
const html=runInNewContext('mobileStoryFilmDetail(PRODUCTS["duet-film"])',scope)
assert.match(html,/mobile-ar-solo mobile-story-film/)
assert.match(html,/data-ar-product="duet-film"/)
assert.equal((html.match(/<h1 /g)||[]).length,1)
assert.match(html,/350,000<small>원/)
assert.match(html,/할인·페이백 모두 적용 후 혜택가<\/span><strong>270,000원/)
assert.match(html,/총 180분/)
assert.match(html,/음정·박자 보정/)
assert.match(html,/촬영·자료 전달 완료 후 약 14일/)
assert.match(html,/href="\/event\/duet-film">카카오톡 문의/)
assert.match(html,/data-inline-youtube="https:\/\/www.youtube.com\/embed\/aSKrlQwmnHI/)
assert.match(css,/\.mas-story-media\{[^}]*aspect-ratio:16\/9/)
assert.deepEqual([...html.matchAll(/detail-point-label"[^>]*>(POINT \d{2})</g)].map(m=>m[1]),['POINT 01','POINT 02','POINT 03','POINT 04'])
for(const id of ['arcProductTitle','masInfoTitle','reviews','arcDetails','wistiaBeforeAfter','wistiaBeforeAfterTitle','arcProcess','arcFaq','detailPriceReasonTitle'])assert.equal((html.match(new RegExp('id="'+id+'"','g'))||[]).length,1,id)
assert.equal((html.match(/class="story-process-card"/g)||[]).length,8)
assert.equal((html.match(/class="mas-event-disclosure"/g)||[]).length,1)
assert.doesNotMatch(html,/<details class="mas-event-disclosure" open|arRatioExperience|POINT 05|film-commerce-detail|完成/)
assert.doesNotMatch(html.slice(html.indexOf('mas-information'),html.indexOf('arc-reviews')),/수작업 보정/)
const events=scope.mobileDetailEvents()
assert.equal((events.match(/<li>/g)||[]).length,6)
for(const term of ['최대 8만원','블로그 리뷰','일 방문자 100명 이상','현장 리액션 영상','웨딩 카페 후기','300자 이상','인스타그램 후기','공개 계정','얼굴 공개','예약 상담','최종 혜택 적용 여부','월~목','미리 차감하지 않습니다'])assert.ok(events.includes(term),term)
assert.doesNotMatch(events,/<input|<form|data-discount/,'disclosure must not mutate calculator selections')
assert.equal((html.match(/완성도는 높이고, 부담은 줄인 가격을 약속드립니다/g)||[]).length,1)
const advantageHtml=scope.productComparisonSection()
assert.equal((advantageHtml.match(/<li>/g)||[]).length,3)
assert.equal((advantageHtml.match(/왜 저렴한가요\?/g)||[]).length,1)
assert.ok(advantageHtml.indexOf('detail-price-reason')>advantageHtml.indexOf('</ol>'))
for(const path of [...html.matchAll(/src="(assets\/[^"]+)"/g)].map(m=>m[1]))assert.ok(existsSync(new URL('../'+path,import.meta.url)),path)
assert.match(source,/key==='duet-film'&&matchMedia\('\(max-width: 768px\)'\).matches\?mobileStoryFilmDetail\(p\):filmCommerceDetail/)
assert.match(read('tests/mobile-solo-preview.html'),/story:'\/detail\/duet-film'/)
console.log('Story mobile commerce, approved events, standalone price explanation, real assets and preserved desktop route passed')
