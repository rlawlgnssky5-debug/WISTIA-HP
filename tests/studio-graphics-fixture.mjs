import assert from 'node:assert/strict'
import {createHash} from 'node:crypto'
export function graphicsFixture(source){
 const start=source.indexOf('const STUDIO_GRAPHIC_ASSETS='),end=source.indexOf('function img(')
 assert.ok(start>=0&&end>start,'load real graphic helpers for isolated render tests')
 return source.slice(start,end)
}
export function assertPreservedAppLogic(source){
 const normalize=s=>s.replace(/\r\n/g,'\n')
 const section=(s,a,b)=>{const i=s.indexOf(a),j=s.indexOf(b,i+a.length);assert.ok(i>=0&&j>i,a);return normalize(s.slice(i,j))}
 // Unchanged sections use deployed baselines; policy boundaries were narrowed
 // using git show HEAD (10b2079), not hashes of the edited implementation.
 for(const [a,b,hash] of [
  ['const PRODUCTS =','const EVENTS =','2e69a7107f25036918a4c67549c8f3b5bf871222b33df61d2f8066d26feb9c37'],
  ['function setExpertPanel(','const WISTIA_ADVANTAGES=','35b5774fda1ab377b40f019994ec884d1efda7757f35de1b4541e6396dabd22c'],
  ['function initArCommerceDetail(','function renderDetail(','d8d7711b7ff70bd9f3699abe069afea99945f3ec8fd42dc4472b6681985300c5'],
  ['function initSoloArRatio(','function initSoloProcessSlider(','a1c515ae0f644d943e7cbdf6a69f3dc99f79fcfb5e409fb047351553fc043dc1'],
  ['function prepareArHookVideo(','const arVideoFeedbackTimers=','81fa4f0227ad2014abd541bda4f14cc7871311c866d74caef781bf3fdfb17b7d'],
  ['function calculate(','function renderProductOption(','aedb3c1dfc12f868d47abe4eb409b4b2a4998eb4ea0e6c8ba515e7a5ddfa6dca'],
  // 2026-10-08: the usage-consent discount was removed at the owner's request (payback-only total text)
  ['function updatePrice(','// The question dialog','39daf1f0f8e2ef31ad66ac31f52692594787109f7656e5f9c5ab3350628e7980'],
  // Only the copy formatter changes under the numbered-inquiry request
  ['function quoteState(','function consultationText(','ab5c1d094d774e59468230190f9b09560d28a62c0539140c8498879047a7f821']
 ])assert.equal(createHash('sha256').update(section(source,a,b)).digest('hex'),hash,'approved business/playback behaviour remains unchanged: '+a)
}
