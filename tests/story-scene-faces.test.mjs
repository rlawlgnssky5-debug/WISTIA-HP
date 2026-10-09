import assert from 'node:assert/strict'
import {readFileSync,existsSync} from 'node:fs'
import {runInNewContext} from 'node:vm'
import {assertPreservedAppLogic} from './studio-graphics-fixture.mjs'

const read=path=>readFileSync(new URL('../'+path,import.meta.url))
const app=read('js/app.js').toString()
const names=['duet-guest-message','duet-interview','duet-memories','duet-recording','duet-music-video','duet-letter-bride','duet-letter-groom']
const sourceFor=name=>'assets/img/duet-film/'+name+'.webp'
const outputFor=name=>'assets/img/story-scenes-retouched/'+name+'-face-v1.webp'
const helperStart=app.indexOf('function storySceneImage('),rendererStart=app.indexOf('function mobileStoryFilmDetail(')
assert.ok(helperStart>=0&&rendererStart>helperStart,'the scoped chapter-only face-image helper must be present')
const helper=app.slice(helperStart,rendererStart)
const scope={
 img:(src,alt)=>'<img src="'+src+'" alt="'+alt+'">',
 escapeHtml:x=>x,
 filmFormatPrice:()=>350000,
 EVENTS:[],
 AR_DETAIL_CONTENT:{'duet-film':{poster:'assets/img/song-film/duet-video-cover.jpg',videoLabel:'실제 제작 영상'}},
 detailPointSection:html=>html,
 arExpertStory:()=>'',storyVocalSection:()=>'',verticalProcessSection:()=>'',productComparisonSection:()=>'',
 detailRecordingOptions:()=>'',mobileStudioBrand:()=>'',mobileDetailEvents:()=>'',mobileDetailReviews:()=>'',faq:()=>'',mobileArNotices:()=>'',mobileDetailFooter:()=>''
}
runInNewContext(helper,scope)
for(const name of names){
 const original=sourceFor(name),output=outputFor(name)
 const html=scope.storySceneImage(original,'장면 예시')
 assert.equal(html,'<img src="'+output+'" alt="장면 예시 · 얼굴 보정한 구성 안내 예시">',name+' has its exact approved face edit and explicit disclosure')
 assert.ok(existsSync(new URL('../'+original,import.meta.url)),name+' retains its original still')
 const data=read(output)
 assert.equal(data.subarray(0,4).toString(),'RIFF',output)
 assert.equal(data.subarray(8,12).toString(),'WEBP',output)
 assert.ok(data.length>1000,output+' is a real image asset')
}

// The scoped helper must not replace actual reviews, videos, lyric examples or arbitrary images
for(const original of [
 'assets/img/reviews/review-16.webp',
 'assets/img/home-approved/aSKrlQwmnHI.jpg',
 'assets/img/song-options/lyric-video-v2.webp',
 'assets/img/duet-film/duet-unlisted.webp',
 'assets/img/duet-film/duet-recording.jpg',
 '../assets/img/duet-film/duet-recording.webp'
])assert.equal(scope.storySceneImage(original,'원본 자료'),'<img src="'+original+'" alt="원본 자료">',original+' is unchanged outside the seven precisely authorized stills')

runInNewContext(app.slice(app.indexOf('const PRODUCTS ='),app.indexOf('const EVENTS =')),scope)
runInNewContext(app.slice(rendererStart,app.indexOf('function mobileArSoloDetail(',rendererStart)),scope)
const html=runInNewContext('mobileStoryFilmDetail(PRODUCTS["duet-film"])',scope)
const chapters=html.match(/<section class="arc-section mas-story-chapters"[\s\S]*?<\/section>/)?.[0]
assert.ok(chapters,'the existing story composition section remains present')
const chapterMedia=[...chapters.matchAll(/<figure><img src="([^"]+)" alt="([^"]+)"/g)]
assert.equal(chapterMedia.length,6,'all six composition cards are kept')
assert.deepEqual(chapterMedia.map(([,src])=>src),names.slice(0,6).map(outputFor),'the chapter renderer uses the scoped helper for all six images')
assert.ok(chapterMedia.every(([,src,alt])=>src&&alt.includes('얼굴 보정한 구성 안내 예시')),'each edited composition still is disclosed, not represented as an untouched customer image')
assert.doesNotMatch(html.slice(0,html.indexOf('mas-story-chapters')),/story-scenes-retouched/,'the actual hero/video proof is not retouched')

const manifest=JSON.parse(read('assets/img/story-scenes-retouched/manifest.json'))
assert.deepEqual(manifest.assets.map(asset=>asset.source),names.map(sourceFor))
assert.deepEqual(manifest.assets.map(asset=>asset.output),names.map(outputFor))

// The original PRODUCTS composition, price, playback and consultation data are byte-preserved
assertPreservedAppLogic(app)
const reviews=runInNewContext(app.slice(app.indexOf('const ACTUAL_REVIEW_IMAGES'),app.indexOf('const SOLO_REVIEW_IMAGES'))+';ACTUAL_REVIEW_IMAGES')
assert.equal(reviews.length,16)
assert.equal(new Set(reviews).size,16)
assert.equal(reviews[5],'assets/img/reviews/review-06-clean.webp')
assert.equal(reviews[11],'assets/img/reviews/review-12.webp')
assert.equal(reviews[15],'assets/img/reviews/review-16.webp')
for(const review of reviews){
 assert.doesNotMatch(review,/story-scenes-retouched/)
 assert.ok(existsSync(new URL('../'+review,import.meta.url)),review)
}
console.log('Seven exact face-edit mappings, six disclosed composition cards, original product data and 16 actual reviews preserved: passed')
