import test from 'node:test'
import assert from 'node:assert/strict'
import {createRequire} from 'node:module'
const pricing=createRequire(import.meta.url)('../js/package-pricing.js')
const text=markup=>markup.replace(/<[^>]*>/g,'').replace(/\s+/g,' ').trim()
const rows=markup=>[...markup.matchAll(/<li\b([^>]*)>([\s\S]*?)<\/li>/g)].map(([,attrs,body])=>({attrs,body,text:text(body)}))

test('B and C show one included detail mixing row in both shared card contexts',()=>{
 for(const key of ['B','C'])for(const mode of ['detail','wizard']){
  const displayed=rows(pricing.cards(key,mode))
  assert.deepEqual(displayed.map(row=>row.text),[
   `녹음 시간 : ${key==='C'?'2':'1'}시간`,
   '디렉팅 : 1:1',
   '믹싱 : 디테일 믹싱 (서비스)',
   '음정·박자 보정 : 포함',
   '전달 : 영업일 7일 이내'
  ])
 }
})

test('shared rows identify included upgrades and carry decorative SVG icons',()=>{
 for(const key of ['A','B','C']){
  const displayed=rows(pricing.selectionDetails(key))
  assert.equal(displayed.length,5)
  for(const row of displayed){
   assert.match(row.body,/<svg[^>]*aria-hidden="true"/)
   assert.match(row.body,/class="package-feature-mark"/)
   const enhanced=key!=='A'&&(row.text.startsWith('믹싱')||row.text.startsWith('음정')||(key==='C'&&row.text.startsWith('녹음 시간')))
   assert.equal(/data-feature-enhanced="true"/.test(row.attrs),enhanced,key+' '+row.text)
  }
 }
 assert.equal(rows(pricing.selectionDetails('A'))[2].text,'믹싱 : 기본 믹싱(목소리와 MR 밸런스·울림)')
})

test('display changes preserve complete titles, approved charges and included option protection',()=>{
 const titles={A:'음정·박자 보정은 필요 없어요!',B:'음정·박자 보정이 필요해요!',C:'음정·박자 보정과 여유로운 녹음 시간이 필요해요!'}
 for(const [key,total,minutes] of [['A',200000,120],['B',180000,120],['C',220000,180]]){
  assert.ok(pricing.selectionDetails(key).includes('<h3>'+titles[key]+'</h3>'))
  const quote=pricing.quote({package:key,tuning:'1',detailMix:'1',extraHour:'1'},'2026-10-24')
  assert.equal(quote.total,total)
  assert.equal(quote.minutes,minutes)
  assert.equal(quote.options.length,key==='A'?3:1)
 }
})
