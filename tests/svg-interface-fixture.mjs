import assert from 'node:assert/strict'
import {createHash} from 'node:crypto'

const hash=text=>createHash('sha256').update(text.replace(/\r\n/g,'\n')).digest('hex')

export function assertContactBusinessPreserved(source){
 const start=source.indexOf(' function submitIcon('),end=source.indexOf(' function validationEditor(')
 assert.ok(start>=0&&end>start,'the independent SVG submit UI has explicit boundaries')
 assert.equal(hash(source.slice(0,start)+source.slice(end)),'552616bc6bbd3e39d7d42b072c10c3d5c17068cedabe2f7baf69e260f32d7ffe','contact fields, validation, drafts and copy text remain unchanged outside the SVG submit label UI')
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
