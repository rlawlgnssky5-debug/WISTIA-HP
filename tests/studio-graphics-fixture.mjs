import assert from 'node:assert/strict'
import {createHash} from 'node:crypto'
export function graphicsFixture(source){
 const start=source.indexOf('const STUDIO_GRAPHIC_ASSETS='),end=source.indexOf('function img(')
 assert.ok(start>=0&&end>start,'load real graphic helpers for isolated render tests')
 return source.slice(start,end)
}
export function assertPreservedAppLogic(source){
 const normalize=s=>s.replace(/\r\n/g,'\n')
 const section=(s,a,b)=>{const i=s.indexOf(a),j=s.indexOf(b,i+a.length);assert.ok(i>=0&&j>i,a);return normalize(s.slice(i,j)).replace('const discount=0,payback=',"const discount=chosen.filter(e=>e.type!=='payback').reduce((sum,e)=>sum+e.discount,0),payback=").replace("'페이백 '+shortWon(c.payback)","'선택 할인 '+shortWon(c.discount)+' · 페이백 '+shortWon(c.payback)")}
 // Normalize only the explicitly removed consent-discount calculation and label;
 // all other pricing and playback source remains protected.
 // Unchanged sections use deployed baselines; policy boundaries were narrowed
 // using git show HEAD (10b2079), not hashes of the edited implementation.
 for(const [a,b,hash] of [
  ['const PRODUCTS =','const EVENTS =','2e69a7107f25036918a4c67549c8f3b5bf871222b33df61d2f8066d26feb9c37'],
  ['function setExpertPanel(','const WISTIA_ADVANTAGES=','35b5774fda1ab377b40f019994ec884d1efda7757f35de1b4541e6396dabd22c'],
  ['function initArCommerceDetail(','function renderDetail(','d8d7711b7ff70bd9f3699abe069afea99945f3ec8fd42dc4472b6681985300c5'],
  ['function initSoloArRatio(','function initSoloProcessSlider(','a1c515ae0f644d943e7cbdf6a69f3dc99f79fcfb5e409fb047351553fc043dc1'],
  ['function prepareArHookVideo(','const arVideoFeedbackTimers=','81fa4f0227ad2014abd541bda4f14cc7871311c866d74caef781bf3fdfb17b7d'],
  ['function calculate(','function renderProductOption(','aedb3c1dfc12f868d47abe4eb409b4b2a4998eb4ea0e6c8ba515e7a5ddfa6dca'],
  ['function updatePrice(','// The question dialog','e6224c67f0c874b3060d2dcb5fb2e12d6644ba730e1c6c4a2714dbb686d5c387'],
  // Only the copy formatter changes under the numbered-inquiry request
  // Round 6 explicitly removes retired option keys from restored selections.
  ['function quoteState(','function consultationText(','37f2a87e73896d2bbdc4a5e8dc7fbe9f39deae2a0be13466093e5c2c8514f70d']
 ])assert.equal(createHash('sha256').update(section(source,a,b)).digest('hex'),hash,'approved business/playback behaviour remains unchanged: '+a)
}
