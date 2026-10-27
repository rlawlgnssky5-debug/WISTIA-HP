import {test} from 'node:test'
import assert from 'node:assert/strict'
import {createHandler} from '../supabase/functions/limited-coupon/handler.mjs'
import apiHandler from '../api/limited-coupon.js'
test('browser tokens are server signed and invalid claims never reach the database',async()=>{
 let count=0
 const handler=createHandler({secret:'test-only-secret-not-a-real-key',url:'https://fixture.test',fetcher:async(_url,opts)=>{count++;const input=JSON.parse(opts.body);assert.match(input.p_browser_hash,/^[a-f0-9]{64}$/);return Response.json({remaining:20,claimed:false,closed:false,newlyClaimed:false})}})
 assert.equal((await handler(new Request('https://fixture.test',{method:'POST'}))).status,401)
 assert.equal(count,0)
 const status=await(await handler(new Request('https://fixture.test'))).json();assert.match(status.browserToken,/^[a-f0-9-]{36}\.[a-f0-9]{64}$/)
 assert.equal((await handler(new Request('https://fixture.test',{method:'POST',headers:{'x-coupon-token':status.browserToken}}))).status,200)
 assert.equal((await handler(new Request('https://fixture.test',{method:'POST',headers:{'x-coupon-token':status.browserToken.slice(0,-1)+'Z'}}))).status,401)
 assert.equal(count,2)
})
test('database outages fail closed rather than inventing stock or a successful claim',async()=>{
 const handler=createHandler({secret:'test-only',url:'https://fixture.test',fetcher:async()=>Response.json({error:'unavailable'},{status:500})})
 const r=await handler(new Request('https://fixture.test'));assert.equal(r.status,503);assert.deepEqual(await r.json(),{ok:false,error:'temporarily_unavailable'})
})
test('same-origin proxy keeps the browser token HttpOnly and out of JSON; POST rejects cross-site',async()=>{
 const original=globalThis.fetch
 try{
  globalThis.fetch=async()=>Response.json({ok:true,remaining:20,claimed:false,closed:false,browserToken:'signed-fixture'})
  const response=()=>({headers:{},setHeader(k,v){this.headers[k]=v},status(s){this.code=s;return this},json(j){this.body=j}})
  const res=response();await apiHandler({method:'GET',headers:{host:'www.wistiastudio.com'}},res)
  assert.match(res.headers['Set-Cookie'],/HttpOnly; Secure; SameSite=Lax/);assert.equal(res.body.browserToken,undefined);assert.equal(res.headers['Cache-Control'],'no-store')
  const rejected=response();await apiHandler({method:'POST',headers:{host:'www.wistiastudio.com',origin:'https://other.test'}},rejected);assert.equal(rejected.code,403)
 }finally{globalThis.fetch=original}
})
