import assert from 'node:assert/strict'
import {existsSync} from 'node:fs'
import {runInNewContext} from 'node:vm'
import {readWithBundleSources} from './bundled-html-fixture.mjs'
import {graphicsFixture} from './studio-graphics-fixture.mjs'
const read=readWithBundleSources,source=read('js/app.js')
const scope={EXTRA_RECORDING_OPTIONS:[],
 PRODUCTS:{solo:{normal:120000,resultVideo:'assets/video/groom-wedding-song-ar.mp4'},duo:{normal:160000,resultVideo:'assets/video/duo-wedding-song-ar.mp4'}},
 AR_DETAIL_CONTENT:{solo:{poster:'assets/img/ar-detail/solo-live-proof.jpg'}},
 img:(src,alt)=>'<img src="'+src+'" alt="'+alt+'">',escapeHtml:x=>x,
 config:{accounts:{instagram:'https://www.instagram.com/wistia.film/',youtube:'https://www.youtube.com/@wistia_film',kakao:'https://pf.kakao.com/wistia'}},
 kakao:()=> 'https://pf.kakao.com/wistia',footerIcon:()=>'<svg></svg>',studioIcon:()=>'<svg></svg>',
 EVENTS:[{type:'payback',label:'네이버 블로그 리뷰',discount:30000,detail:'일 방문자 100명 이상'},{type:'payback',label:'본식 현장 리액션 영상',discount:30000,detail:'인스타그램 공개 동의'}],
 shortWon:n=>(n/10000)+'만원',won:n=>n.toLocaleString('ko-KR')+'원',ratioSource:()=> 'assets/audio/ratio-50.mp3',
 soloReviewCarousel:()=>'<section id="reviews"><header><h2 id="soloReviewTitle">실제 고객 후기</h2></header></section>',
 productPackageOverview:()=>'<div>기본 구성</div>',productComparisonSection:()=>'<section>장점</section>',arExpertStory:()=>'<section>엔지니어</section>',
 faq:items=>items.map(([q,a])=>'<details><summary>'+q+'</summary><p>'+a+'</p></details>').join(''),footer:()=>'<footer class="footer shell"></footer>',
 arCdRatioSection:()=>'<section id="arRatioExperience"></section>',matchMedia:()=>({matches:false})}
runInNewContext(graphicsFixture(source)+source.slice(source.indexOf('const SOLO_STUDIO_PROCESS='),source.indexOf('const DUO_STUDIO_PROCESS=')),scope)
for(const [from,to] of [['function detailStudioSteps(','function processStudioMeta('],['function wistiaBeforeAfterSection(','function setExpertPanel('],['function detailPointSection(','function filmCommerceDetail('],['function arRecordingPoster(','function initArCommerceDetail(']])runInNewContext(source.slice(source.indexOf(from),source.indexOf(to)),scope)
for(const key of ['solo','duo']){
 const html=scope.arCommerceDetail(scope.PRODUCTS[key],key)
 assert.match(html,new RegExp('data-ar-product="'+key+'"'))
 assert.equal((html.match(/class="mas-gallery-slide hs-slide/g)||[]).length,5,'keep the latest approved five-photo hero')
 assert.equal((html.match(/class="hs-photo"/g)||[]).length,5)
 assert.doesNotMatch(html,/<video |mas-format-badge|data-quick-estimate/)
 assert.match(html,/class="mas-summary solo-seo"/,'search-only product text stays in its hidden class')
 assert.match(html,/참여 혜택 최대 6만원/)
 assert.match(html,new RegExp('페이백 완료 후 혜택가 <strong>'+(key==='solo'?'60,000':'100,000')+'원'))
 assert.equal((html.match(/<li><div><strong>(네이버 블로그 리뷰|본식 현장 리액션 영상)/g)||[]).length,2)
 assert.match(html,/카카오톡으로 환급/)
 assert.match(html,new RegExp('class="solo-footer-inquiry" href="/event/'+key+'"'))
 assert.match(html,/info_v[56]\.webp/)
 assert.match(html,/lyric-d\.webp/)
 assert.doesNotMatch(html,/웨딩 카페 후기|인스타그램 후기/)
}
assert.doesNotMatch(source,/sizes="\(min-width: 901px\)/)
assert.match(source,/sizes="\(min-width: 780px\)/)
for(const page of ['index.html','detail/solo.html','detail/duo.html','info/about.html','events.html','contact.html']){
 if(!existsSync(new URL('../'+page,import.meta.url)))continue
 const html=read(page)
 assert.match(html,/mobile-gutters-1020\.css/,'SPA entries must retain the same gutters')
 assert.match(html,/canvas-780\.css\?v=20261021-780-payback-1/)
}
assert.ok(existsSync(new URL('../assets/16j/duo/top_B.webp',import.meta.url)))
console.log('Current five-photo SOLO/DUET layout, two paybacks, exact effective prices, preserved poster/actions and all-entry mobile gutters passed')
