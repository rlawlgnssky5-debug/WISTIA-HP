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
 // Normalized hashes read from deployed bb14a1f with git show, no process required by tests
 for(const [a,b,hash] of [
  ['const PRODUCTS =','const ACTUAL_REVIEW_IMAGES','91ada631e875c8bd66e46eff55da071d4775a2292e4a936c41db8ee979905985'],
  ['function setExpertPanel(','const WISTIA_ADVANTAGES=','35b5774fda1ab377b40f019994ec884d1efda7757f35de1b4541e6396dabd22c'],
  ['function initArCommerceDetail(','function renderDetail(','d8d7711b7ff70bd9f3699abe069afea99945f3ec8fd42dc4472b6681985300c5'],
  ['function initSoloArRatio(','function initSoloProcessSlider(','a1c515ae0f644d943e7cbdf6a69f3dc99f79fcfb5e409fb047351553fc043dc1'],
  ['function prepareArHookVideo(','const arVideoFeedbackTimers=','81fa4f0227ad2014abd541bda4f14cc7871311c866d74caef781bf3fdfb17b7d'],
  ['function calculate(','function renderProductOption(','aedb3c1dfc12f868d47abe4eb409b4b2a4998eb4ea0e6c8ba515e7a5ddfa6dca'],
  ['function updatePrice(','function quoteState(','4bacbaab5beba1de91c42cc356f20dd4f09e178794d99ba8332f7b5f4102c33a'],
  ['function quoteState(','function showDialog(','4e6ea97cda101b91be4135d85c821a96f48a8862e6d93626592a42d77ae9c8d3']
 ])assert.equal(createHash('sha256').update(section(source,a,b)).digest('hex'),hash,'approved business/playback behaviour remains unchanged: '+a)
}
