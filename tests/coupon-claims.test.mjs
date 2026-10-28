import test from 'node:test'
import assert from 'node:assert/strict'
import vm from 'node:vm'
import {readFileSync} from 'node:fs'
const source=readFileSync(new URL('../js/package-pricing.js',import.meta.url),'utf8'),key='wistia:coupon-claims:v1',clockNow=Date.parse('2026-10-27T12:00:00+09:00')
class ClockDate extends Date{constructor(...args){super(...(args.length?args:[clockNow]))}static now(){return clockNow}}
function setup(initial={},blocked=false){const items=new Map(Object.entries(initial)),context=vm.createContext({Intl,Date:ClockDate,setTimeout,localStorage:{getItem:k=>{if(blocked)throw Error('blocked');return items.get(k)||null},setItem:(k,v)=>{if(blocked)throw Error('blocked');items.set(k,v)}}});vm.runInContext(source,context);return {api:context.WistiaPackages,items}}
test('first visit stores a short-lived choice but limited inventory cannot be claimed locally',()=>{
 const {api,items}=setup({'unrelated':'keep'});api.setCouponClaim('firstVisit',true);api.setCouponClaim('yearEndCoupon',true)
 const saved=JSON.parse(items.get(key));assert.deepEqual(Object.keys(saved).sort(),['savedAt','selections','version']);assert.deepEqual(saved.selections,{firstVisit:true});assert.equal(items.get('unrelated'),'keep')
 api.setCouponClaim('firstVisit',false);assert.equal(api.readCouponClaims().firstVisit,false);assert.equal(api.readCouponClaims().yearEndCoupon,undefined)
 api.setCouponClaim('__proto__',true);assert.equal(Object.hasOwn(JSON.parse(items.get(key)).selections,'__proto__'),false)
})
test('coupon choices ignore expired, corrupt, future and nonboolean storage',()=>{
 for(const saved of ['bad',JSON.stringify({version:1,savedAt:clockNow-10800001,selections:{firstVisit:true}}),JSON.stringify({version:1,savedAt:clockNow+50000,selections:{firstVisit:true}})])assert.equal(Object.keys(setup({[key]:saved}).api.readCouponClaims()).length,0)
 assert.equal(Object.keys(setup({[key]:JSON.stringify({version:1,savedAt:clockNow,selections:{firstVisit:'1',yearEndCoupon:1,email:'not stored'}})}).api.readCouponClaims()).length,0)
})
test('blocked storage still carries coupon choices during same-page navigation',()=>{
 const {api}=setup({},true);api.setCouponClaim('firstVisit',true);api.setCouponClaim('yearEndCoupon',true);assert.equal(api.readCouponClaims().firstVisit,true);api.setCouponClaim('firstVisit',false);assert.equal(api.readCouponClaims().firstVisit,false)
})
test('shared coupon controls use the compact approved guide, without duplicate visit notes',()=>{
 const {api}=setup(),main=api.couponClaimCard('firstVisit','detail','/gift.webp'),form=api.couponClaimCard('yearEndCoupon')
 assert.ok(main.includes('여기를 눌러주세요 →'));assert.ok(main.includes('data-coupon-button-copy>쿠폰 받기'));assert.ok(!main.includes('↓'));assert.ok(!main.includes('type="checkbox"'))
 assert.ok(form.includes('name="yearEndCoupon"'));assert.equal((form.match(/2026년 11·12월 방문 시 적용/g)||[]).length,0);assert.ok(!form.includes('data-year-end-note'));assert.ok(!source.includes('브라우저당 1장'))
 assert.ok(!source.includes('선택 완료'),'all coupon buttons must use 받기 완료')
})
