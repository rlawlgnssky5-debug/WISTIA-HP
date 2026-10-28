import test from 'node:test'
import assert from 'node:assert/strict'
import vm from 'node:vm'
import {readFileSync} from 'node:fs'
const source=readFileSync(new URL('../js/limited-coupon.js',import.meta.url),'utf8'),day=86400000,base=Date.parse('2026-10-28T12:00:00+09:00')
function fixture({claimed=true,missingTime=false}={}){
 let elapsed=0,posts=0,fail=false,wall=base
 const timer={textContent:''},events=[]
 class Clock extends Date{static now(){return wall}}
 const fetcher=async(_url,options)=>{if(options.method==='POST')posts++;if(fail)throw Error('offline');return Response.json({ok:true,remaining:18,claimed,closed:false,newlyClaimed:false,...(missingTime?{}:{expiresAt:new Date(base+day).toISOString(),serverNow:new Date(base+elapsed).toISOString(),expired:elapsed>=day})})}
 const window={performance:{now:()=>elapsed},document:{querySelectorAll:()=>[timer],addEventListener(){}},addEventListener(){},dispatchEvent:e=>events.push(e.type),setInterval(){}}
 vm.runInNewContext(source,{window,Date:Clock,fetch:fetcher,AbortSignal,Event,console})
 return {api:window.WistiaLimitedCoupon,advance:ms=>{elapsed+=ms;wall+=ms},setWall:t=>{wall=t},offline:()=>{fail=true},posts:()=>posts,timer,events}
}
test('coupon expires at receipt plus 24 hours, not a sliding browser deadline',async()=>{
 const f=fixture();await f.api.refresh();assert.equal(f.api.state.received,true);assert.equal(f.api.isUsable(),true);assert.equal(f.api.remainingMs(),day)
 f.advance(day-1000);await f.api.refresh();assert.equal(f.api.remainingMs(),1000);f.api.paintTimers();assert.equal(f.timer.textContent,'00:00:01')
 f.setWall(base+999*day);assert.equal(f.api.remainingMs(),1000,'changing the device clock cannot reset the server-based timer')
 f.advance(1000);assert.equal(f.api.isUsable(),false);f.api.paintTimers();assert.equal(f.api.state.expired,true);assert.equal(f.api.state.claimed,false);assert.equal(f.api.state.received,true);assert.equal(f.api.state.remaining,18)
 await f.api.refresh(true);assert.equal(f.posts(),0,'expired browsers never attempt another issue')
})
test('reload of an expired receipt restores expiry and does not return inventory',async()=>{
 const f=fixture();f.advance(day+1);await f.api.refresh();assert.equal(f.api.state.received,true);assert.equal(f.api.state.expired,true);assert.equal(f.api.isUsable(),false);assert.equal(f.api.state.remaining,18);await f.api.refresh(true);assert.equal(f.posts(),0)
})
test('offline browsers still expire on time and cannot keep an old discount alive',async()=>{
 const f=fixture();await f.api.refresh();f.offline();await f.api.refresh();assert.equal(f.api.state.error,true);f.advance(day);f.api.paintTimers();assert.equal(f.api.isUsable(),false);assert.equal(f.api.state.remaining,18)
})
test('a receipt missing server expiry fails closed',async()=>{
 const f=fixture({missingTime:true});await f.api.refresh();assert.equal(f.api.state.error,true);assert.equal(f.api.state.received,false);assert.equal(f.api.isUsable(),false)
})
