import assert from 'node:assert/strict'
const base='https://tgtuhhczgenuasowykqh.supabase.co/functions/v1/limited-coupon-qa'
const initial=await(await fetch(base)).json();assert.equal(initial.remaining,20)
const tokens=await Promise.all(Array.from({length:30},async()=>{const d=await(await fetch(base)).json();assert.equal(d.ok,true);return d.browserToken}))
const results=await Promise.all(tokens.flatMap(token=>[token,token].map(async t=>{const r=await fetch(base,{method:'POST',headers:{'x-coupon-token':t}});assert.equal(r.status,200);return {token:t,...await r.json()}})))
assert.equal(results.filter(r=>r.newlyClaimed).length,20)
assert.equal(new Set(results.filter(r=>r.claimed).map(r=>r.token)).size,20)
assert.ok(results.every(r=>r.remaining>=0))
const owner=results.find(r=>r.claimed).token
const repeat=await(await fetch(base,{method:'POST',headers:{'x-coupon-token':owner}})).json();assert.equal(repeat.remaining,0);assert.equal(repeat.claimed,true);assert.equal(repeat.newlyClaimed,false)
const fresh=await(await fetch(base)).json();assert.equal(fresh.remaining,0);assert.equal(fresh.closed,true);assert.equal(fresh.claimed,false)
const invalid=await fetch(base,{method:'POST',headers:{'x-coupon-token':'tampered'}});assert.equal(invalid.status,401)
const live=await(await fetch(base.replace('-qa',''))).json();assert.equal(live.remaining,20);assert.equal(live.claimed,false)
console.log('PASS 60 concurrent QA requests: exactly 20 browsers, no duplicate or negative stock; production remains 20')
