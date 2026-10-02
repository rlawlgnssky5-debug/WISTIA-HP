import assert from 'node:assert/strict'
import {readFileSync} from 'node:fs'
import {runInNewContext} from 'node:vm'

const source=readFileSync(new URL('../js/site-motion.js',import.meta.url),'utf8')
const carousel=source.slice(source.indexOf('function carousel()'),source.indexOf('function processCards()'))
for(const count of [3,4])for(const reduced of [false,true]){
 const cycle=count*120
 let nextFrame,scroll=0
 const classes={add(){},remove(){},contains(){return false}}
 const track={children:[],dataset:{},classList:classes,contains:()=>false,querySelector:()=>null,scrollTo({left}){this.scrollLeft=left},append(card){card.offsetLeft=this.children.length*120;this.children.push(card)}}
 Object.defineProperty(track,'scrollLeft',{get:()=>scroll,set:value=>{scroll=Math.round(value)}})
 const makeCard=()=>({offsetLeft:0,dataset:{},cloneNode:()=>makeCard(),remove(){track.children=track.children.filter(card=>card!==this)}})
 for(let i=0;i<count;i++)track.append(makeCard())
 const cleanups=[]
 const context={window:{},document:{hidden:false,activeElement:{},body:{classList:classes},querySelector:()=>null,querySelectorAll:()=>[track]},cleanups,listen(){},limited:()=>reduced,performance:{now:()=>0},requestAnimationFrame:fn=>{nextFrame=fn;return 1},cancelAnimationFrame(){nextFrame=null}}
 runInNewContext(carousel+';carousel()',context)
 assert.equal(track.children.length,count*3)
 assert.equal(scroll,cycle)
 let totalMotion=0,wraps=0
 for(let i=0;i<5000;i++){
  const previous=scroll;nextFrame(i*16)
  let distance=scroll-previous
  if(distance<0){distance+=cycle;wraps++}
  assert.ok(distance>=0&&distance<=2,'loop boundary must not jump between unrelated cards')
  totalMotion+=distance
 }
 assert.ok(totalMotion>500)
 assert.ok(wraps>=1)
 assert.ok(scroll>=cycle&&scroll<=cycle*2,'integer scroll positions may round the final subpixel to the equivalent boundary')
 track.dataset.casePlaying='true'
 const paused=scroll
 for(let i=5000;i<5100;i++)nextFrame(i*16)
 assert.equal(scroll,paused,'playing a case pauses automatic movement')
 delete track.dataset.casePlaying
 for(let i=5100;i<5200;i++)nextFrame(i*16)
 assert.notEqual(scroll,paused)
 cleanups.forEach(fn=>fn())
 assert.equal(track.children.length,count)
 assert.equal(nextFrame,null)
}
console.log('Showcase continuous normal/reduced loops, fractional movement, boundary wrapping, playback pause and teardown passed')
