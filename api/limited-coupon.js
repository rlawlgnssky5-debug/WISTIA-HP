const endpoint='https://tgtuhhczgenuasowykqh.supabase.co/functions/v1/limited-coupon'
const cookieName='wistia_coupon_browser_v1'
export default async function handler(request,response){
 response.setHeader('Cache-Control','no-store')
 response.setHeader('Vary','Cookie')
 if(!['GET','POST'].includes(request.method)){response.setHeader('Allow','GET, POST');response.status(405).json({ok:false});return}
 const origin=request.headers.origin,host=request.headers['x-forwarded-host']||request.headers.host
 let foreign=false
 try{foreign=!!origin&&new URL(origin).host!==host}catch{foreign=true}
 if(request.method==='POST'&&(foreign||request.headers['sec-fetch-site']==='cross-site')){response.status(403).json({ok:false});return}
 const token=String(request.headers.cookie||'').split(';').map(s=>s.trim()).find(s=>s.startsWith(cookieName+'='))?.slice(cookieName.length+1)||''
 try{
  const upstream=await fetch(endpoint,{method:request.method,headers:{'x-coupon-token':token},signal:AbortSignal.timeout(10000)})
  const data=await upstream.json()
  if(data.browserToken){
   response.setHeader('Set-Cookie',cookieName+'='+data.browserToken+'; Path=/; Max-Age=31536000; HttpOnly; Secure; SameSite=Lax')
   delete data.browserToken
  }
  response.status(upstream.status).json(data)
 }catch{response.status(503).json({ok:false,error:'temporarily_unavailable'})}
}
