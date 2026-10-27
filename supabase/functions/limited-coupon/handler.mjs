const encode=new TextEncoder()
const hex=bytes=>Array.from(new Uint8Array(bytes),n=>n.toString(16).padStart(2,'0')).join('')
const CAMPAIGN='limited-20261028'
// The signed token identifies only a browser, not a person or an analytics profile
export function createHandler({secret,url,fetcher=fetch,campaign=CAMPAIGN}){
 const signing=crypto.subtle.importKey('raw',encode.encode('wistia-coupon-browser-v1:'+secret),{name:'HMAC',hash:'SHA-256'},false,['sign','verify'])
 const sign=async id=>id+'.'+hex(await crypto.subtle.sign('HMAC',await signing,encode.encode(id)))
 const valid=async token=>{
  if(!/^[a-f0-9-]{36}\.[a-f0-9]{64}$/.test(token))return false
  const [id,sig]=token.split('.')
  return crypto.subtle.verify('HMAC',await signing,Uint8Array.from(sig.match(/../g),s=>parseInt(s,16)),encode.encode(id))
 }
 return async request=>{
  const headers={'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'}
  const reply=(data,status=200)=>new Response(JSON.stringify(data),{status,headers})
  if(!['GET','POST'].includes(request.method))return reply({ok:false},405)
  try{
   let token=request.headers.get('x-coupon-token')||''
   if(!await valid(token)){
    if(request.method==='POST')return reply({ok:false,error:'browser_required'},401)
    token=await sign(crypto.randomUUID())
   }
   const hash=hex(await crypto.subtle.digest('SHA-256',encode.encode(token)))
   const response=await fetcher(url+'/rest/v1/rpc/coupon_inventory',{
    method:'POST',headers:{apikey:secret,...(secret.startsWith('eyJ')?{Authorization:'Bearer '+secret}:{}),'Content-Type':'application/json'},
    body:JSON.stringify({p_campaign:campaign,p_browser_hash:hash,p_issue:request.method==='POST'}),signal:AbortSignal.timeout(8000)
   })
   if(!response.ok)throw Error('Inventory unavailable')
   const state=await response.json()
   return reply({ok:true,...state,browserToken:token})
  }catch{return reply({ok:false,error:'temporarily_unavailable'},503)}
 }
}
