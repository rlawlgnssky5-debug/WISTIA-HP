import assert from 'node:assert/strict'
import {readFileSync} from 'node:fs'
import {createRequire} from 'node:module'
import test from 'node:test'
const pricing=createRequire(import.meta.url)('../js/package-pricing.js')
const wizard=readFileSync(new URL('../js/booking-wizard.js',import.meta.url),'utf8')
const app=readFileSync(new URL('../js/app.js',import.meta.url),'utf8')
const ref='2026-10-29'
const thursday='2026-10-30'
const later='2026-12-29'

test('STANDARD keeps 90,000, includes mix and mastering, and charges pitch correction',()=>{
  const pack=pricing.packages.A
  assert.equal(pack.price,90000)
  assert.equal(pack.mixing,true)
  assert.equal(pack.tuning,false)
  assert.match(pricing.features(pack).join('\n'),/음정·박자 보정 : 미포함/)
  assert.match(pricing.features(pack).join('\n'),/믹싱 : 정밀 믹싱 포함/)
  assert.match(pricing.features(pack).join('\n'),/마스터링 : 포함/)
  assert.equal(pricing.quote({package:'A'}).total,90000)
  assert.equal(pricing.quote({package:'A',tuning:'1'}).total,130000)
  assert.equal(pricing.quote({package:'A',precisionMix:'1',detailMix:'1'}).total,90000)
  assert.equal(pricing.quote({package:'A',extraHour:'1',people:'1',rush:'1'}).total,210000)
  assert.equal(pricing.quote({package:'B'}).total,170000)
  assert.equal(pricing.quote({package:'C'},'2026-10-06').total,220000)
  assert.equal(pricing.quote({package:'D'},'2026-10-06').total,240000)
  assert.equal(pricing.options.find(option=>option.key==='tuning').price,40000)
  assert.equal(pricing.options.find(option=>option.key==='rush').price,30000)
  const timed=pricing.priceLines(pricing.packages.B,ref,thursday,'','13:00')
  assert.doesNotMatch(timed,/목·금|13~16|1~4시/)
  assert.match(timed,/170,000원/)
  assert.match(pricing.priceLines(pricing.packages.A,ref,thursday,'','13:00'),/90,000원/)
  assert.doesNotMatch(pricing.priceLines(pricing.packages.A,ref,thursday,'','13:00'),/목·금|13~16/)
  assert.equal(pricing.options.find(option=>option.key==='precisionMix').detail,'목소리와 반주의 밸런스를 세밀하게 맞춰 드려요')
  assert.equal(pricing.options.find(option=>option.key==='detailMix').detail,'음압과 톤을 정리해 최종 음원으로 마무리해요')
  assert.equal(pricing.features(pack).join('\n').includes('기본 믹싱'),false)
  assert.equal(wizard.includes('기본 믹싱'),false)
  assert.equal(app.includes('기본 믹싱'),false)
  assert.match(wizard,/dateTouch/)
  assert.doesNotMatch(wizard,/weekdayDiscount|13~16|목·금 오후/)
  assert.match(wizard,/녹음 1인 추가/)
  assert.doesNotMatch(wizard,/녹음 1인 추가 \(듀엣곡으로 변경\)/)
})

test('STANDARD applies none of the shared discounts, and other types keep them',()=>{
  const standard=pricing.quote({package:'A',firstVisit:'1',yearEndCoupon:'1',bookingDate:later,timeStart:'13:00'},ref)
  assert.equal(standard.discount,0)
  assert.equal(standard.total,90000)
  assert.equal(standard.discounts.length,0)
  const deluxe=pricing.quote({package:'B',firstVisit:'1',bookingDate:thursday,timeStart:'13:00'},ref)
  assert.equal(deluxe.discounts.find(item=>item.key==='first').amount,20000)
  assert.equal(deluxe.discounts.some(item=>item.key==='weekday'),false)
  assert.equal(deluxe.total,150000)
  const premium=pricing.quote({package:'C',firstVisit:'1',bookingDate:later,timeStart:'13:00'},ref)
  assert.equal(premium.discounts.find(item=>item.key==='first').amount,20000)
  assert.equal(premium.discounts.find(item=>item.key==='advance1').amount,10000)
  assert.equal(premium.total,190000)
  const back=pricing.quote({package:'D',firstVisit:'1'},ref)
  assert.equal(back.total,220000)
  assert.equal(pricing.bestCouponPrice(pricing.packages.A,ref),90000)
  assert.doesNotMatch(pricing.priceLines(pricing.packages.A,ref,later),/첫 이용 쿠폰/)
  assert.doesNotMatch(pricing.priceLines(pricing.packages.A,ref,later),/목·금|13~16/)
  assert.match(pricing.typeTable.toString(),/마스터링/)
  assert.doesNotMatch(pricing.typeTable.toString(),/\['전달'/)
})

test('every type delivers in 7 days, and rush stays a separate paid option',()=>{
  for(const key of ['A','B','C','D']){
    assert.equal(pricing.quote({package:key}).delivery,'녹음일 기준 7일 이내 전달')
    const rushed=pricing.quote({package:key,rush:'1'})
    assert.equal(rushed.delivery,'녹음일 기준 3일 이내 전달')
    assert.equal(rushed.options.some(option=>option.key==='rush'),true)
  }
  assert.equal(pricing.quote({package:'A',rush:'1'}).total,120000)
  assert.match(app,/모든 타입은 녹음일 기준/)
  assert.doesNotMatch(app,/STANDARD 기본 구성은 당일/)
  assert.match(wizard,/q\.package\.tuning\?\[/)
  assert.doesNotMatch(wizard,/q\.package\.tuning\|\|q\.package\.key==='A'/)
})
