import assert from 'node:assert/strict'
import {createHash} from 'node:crypto'

const hash=text=>createHash('sha256').update(text.replace(/\r\n/g,'\n')).digest('hex')

export function assertContactBusinessPreserved(source){
 const start=source.indexOf(' function submitIcon('),end=source.indexOf(' function validationEditor('),copy=source.indexOf(' function text(')
 assert.ok(start>=0&&end>start&&copy>end,'the SVG submit UI and explicitly revised copy formatter have independent boundaries')
 assert.equal(hash(source.slice(0,start)+source.slice(end,copy)),'0bb7626053f21a25fad1239af9dbdf4a2006b5ca2002a5c0569df8c1a02eb12a','contact fields, validation and drafts remain unchanged outside the SVG submit UI and numbered copy formatter')
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
