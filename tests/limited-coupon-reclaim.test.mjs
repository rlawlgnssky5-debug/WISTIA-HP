import test from 'node:test'
import assert from 'node:assert/strict'
import vm from 'node:vm'
import {readFileSync} from 'node:fs'
const source=readFileSync(new URL('../js/limited-coupon.js',import.meta.url),'utf8'),day=86400000,week=7*day,base=Date.parse('2026-10-28T12:00:00+09:00')
function fixture({age=0,stock=18}={}){
 let now=base+age,elapsed=0,issuedAt=base,remaining=stock,posts=0,fail=false
 const fetcher=async(_url,options)=>{
  if(fail)throw Error('offline')
  let fresh=false
  if(options.method==='POST'){posts++;if(now>=issuedAt+week&&remaining>0){remaining--;issuedAt=now;fresh=true}}
  return Response.json({ok:true,remaining,claimed:true,closed:remaining===0,expired:now>=issuedAt+day,issuedAt:new Date(issuedAt).toISOString(),expiresAt:new Date(issuedAt+day).toISOString(),serverNow:new Date(now).toISOString(),nextClaimAt:new Date(issuedAt+week).toISOString(),inCooldown:now<issuedAt+week,canClaim:now>=issuedAt+week&&remaining>0,newlyClaimed:fresh})
 }
 const window={performance:{now:()=>elapsed},document:{querySelectorAll:()=>[],addEventListener(){}},addEventListener(){},dispatchEvent(){},setInterval(){}}
 vm.runInNewContext(source,{window,Date,fetch:fetcher,AbortSignal,Event})
 return {api:window.WistiaLimitedCoupon,advance:ms=>{now+=ms;elapsed+=ms},posts:()=>posts,offline:()=>{fail=true},online:()=>{fail=false}}
}
test('24h usage and 7d reclaim are separate; repeated click issues only one new coupon',async()=>{
 const f=fixture();await f.api.refresh();f.advance(day);f.api.paintTimers();assert.equal(f.api.isUsable(),false);assert.equal(f.api.state.inCooldown,true);await f.api.refresh(true);assert.equal(f.posts(),0)
 f.advance(week-day-1);await f.api.refresh();assert.equal(f.api.state.canClaim,false);assert.equal(f.api.state.remaining,18)
 f.advance(1);f.api.paintTimers();await f.api.refresh();assert.equal(f.api.state.canClaim,true);assert.equal(f.api.state.inCooldown,false);assert.equal(f.api.state.remaining,18);assert.equal(f.posts(),0,'unlock does not auto-issue or replenish inventory')
 await Promise.all([f.api.refresh(true),f.api.refresh(true)]);assert.equal(f.posts(),1);assert.equal(f.api.state.remaining,17);assert.equal(f.api.isUsable(),true);assert.equal(f.api.state.inCooldown,true);assert.equal(Date.parse(f.api.state.expiresAt),base+week+day);assert.equal(Date.parse(f.api.state.nextClaimAt),base+2*week)
 await f.api.refresh(true);assert.equal(f.posts(),1)
})
test('reload after 7 days unlocks the same browser, but sold-out stock still blocks reissue',async()=>{
 const f=fixture({age:week});await f.api.refresh();assert.equal(f.api.state.received,true);assert.equal(f.api.state.expired,true);assert.equal(f.api.state.canClaim,true);assert.equal(f.api.state.remaining,18)
 const empty=fixture({age:week,stock:0});await empty.api.refresh();assert.equal(empty.api.state.canClaim,false);assert.equal(empty.api.state.closed,true);await empty.api.refresh(true);assert.equal(empty.posts(),0)
})
test('offline cooldown boundary does not grant a coupon until the server confirms availability',async()=>{
 const f=fixture({age:week-1});await f.api.refresh();f.offline();f.advance(1);f.api.paintTimers();await f.api.refresh();assert.equal(f.api.state.canClaim,false);assert.equal(f.api.state.remaining,18)
 f.online();await f.api.refresh();assert.equal(f.api.state.canClaim,true);assert.equal(f.api.isUsable(),false);assert.equal(f.posts(),0)
})
