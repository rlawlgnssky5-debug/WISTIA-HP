import assert from 'node:assert/strict'
import {createHash} from 'node:crypto'

const hash=text=>createHash('sha256').update(text.replace(/\r\n/g,'\n')).digest('hex')

export function assertContactBusinessPreserved(source){
 const start=source.indexOf(' function submitIcon('),end=source.indexOf(' function validationEditor('),copy=source.indexOf(' function text(')
 assert.ok(start>=0&&end>start&&copy>end,'the SVG submit UI and explicitly revised copy formatter have independent boundaries')
 // Date/time controls and their validation are intentionally revised for Notion.
 // Protect untouched fields/render/draft logic with hashes from deployed 10b2079.
 for(const [a,b,digest] of [
  ['(function(global){',' function dateField(','b2e2b97304cbe9bf5139b3b4efc3047a540183fa979825a233c0d5e13698bc17'],
  [' function render(',' function submitIcon(','4cf2f4a241858c68132ce2d5f3382ce7539c39ef89ff03056e356ca6a7313e6d'],
  [' function validationEditor(',' function restore(','a2a829e8d2ef4343e15088c5468d9f03688c3f62e18275f27ab39b00aa250afd'],
  [' function restore(',' function text(','5090a2553b89985f780526c969cb20db6574c334481b6d9684a86e6c5948d28e']
 ]){
  const i=source.indexOf(a),j=source.indexOf(b,i+a.length)
  const protectedText=source.slice(i,j).replace(/\r\n/g,'\n').replace("  global.WistiaBooking?.changed(form.querySelector('#contact-bookingDate'))\n",'')
  assert.equal(hash(protectedText),digest,'unchanged contact logic: '+a)
 }
 assert.match(source,/global.WistiaContact=\{render,submit,text,update,syncQuote,syncReview,snapshot,restore,validationIssues,syncSubmitState,validationEditor\}/)
}

export function assertBeforeAfterCorePreserved(source){
 for(const [start,end,digest] of [
  ['    function start(offset){','    function activate(next,autoPlay=false){','f4dc19e3ada603f939e215ac15fc03de245aecdde3397843ae242ff830000d5f'],
  ['    function makePeaks(buffer,count=120){',"    root.classList.add('is-loading')",'d0682b27127d7e7e8c7ec77ff3fbe063a39fc844e9a0f0e2eb87af94a74f5109']
 ]){
  const a=source.indexOf(start),b=source.indexOf(end,a+start.length)
  assert.ok(a>=0&&b>a,'audio core boundaries remain available')
  assert.equal(hash(source.slice(a,b)),digest,'before/after audio timing, decoding and waveform remain unchanged')
 }
}
