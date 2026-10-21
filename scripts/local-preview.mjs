import {createServer} from 'node:http'
import {readFile,stat} from 'node:fs/promises'
import {resolve,extname,sep} from 'node:path'
import {isGonePath,goneDocument} from '../js/gone-paths.mjs'
const root=resolve(import.meta.dirname,'..')
const port=Number(process.env.WISTIA_PREVIEW_PORT||4174)
const availabilityHandler=(await import('../api/availability.js')).default
const mime={'.html':'text/html; charset=utf-8','.css':'text/css','.js':'text/javascript','.json':'application/json','.svg':'image/svg+xml','.webp':'image/webp','.jpg':'image/jpeg','.png':'image/png','.mp4':'video/mp4','.mp3':'audio/mpeg','.wav':'audio/wav','.m4a':'audio/mp4','.woff2':'font/woff2'}
createServer(async(req,res)=>{
 try{
  let path=decodeURIComponent(new URL(req.url,'http://localhost').pathname)
  if(path==='/api/availability'){
   req.query=Object.fromEntries(new URL(req.url,'http://localhost').searchParams)
   res.status=code=>{res.statusCode=code;return res}
   res.json=value=>{res.setHeader('Content-Type','application/json; charset=utf-8');res.end(JSON.stringify(value));return res}
   if(!process.env.NOTION_BOOKING_TOKEN||!process.env.NOTION_BOOKING_DATA_SOURCE_ID){
    const {validDate,validRange,operatingDays}=await import('../js/booking-availability.js').then(m=>m.default)
    const {date,from,to}=req.query,range=from!==undefined||to!==undefined
    res.setHeader('Cache-Control','no-store')
    if(req.method!=='GET'){res.setHeader('Allow','GET');res.status(405).json({ok:false});return}
    if(range?(!validRange(from,to)||date!==undefined):!validDate(date)){res.status(400).json({ok:false});return}
    res.status(200).json({ok:true,...(range?{from,to}:{date}),timeZone:'Asia/Seoul',operatingDays,blocks:[],checkedAt:new Date().toISOString(),preview:true});return
   }
   await availabilityHandler(req,res);return
  }
  if(path.split('/').some(part=>part.startsWith('.'))||/^\/(?:api|lib)(?:\/|$)/.test(path)){res.writeHead(404).end();return}
  if(isGonePath(path)){res.writeHead(410,{'Content-Type':'text/html; charset=utf-8','X-Robots-Tag':'noindex','Cache-Control':'no-store'}).end(goneDocument());return}
  if(path==='/')path='/index.html'
  else if(!extname(path))path+='.html'
  let file=resolve(root,'.'+path)
  if(!file.startsWith(root+sep)){res.writeHead(403).end();return}
  try{if(!(await stat(file)).isFile())throw Error()}catch{if(extname(path)!=='.html'){res.writeHead(404).end();return}file=resolve(root,'index.html')}
  const data=await readFile(file)
  if(req.headers.range){
   const match=/^bytes=(\d+)-(\d*)$/.exec(req.headers.range)
   if(match){
    const start=Number(match[1]),end=Math.min(match[2]?Number(match[2]):data.length-1,data.length-1)
    if(start>end||start>=data.length){res.writeHead(416,{'Content-Range':'bytes */'+data.length}).end();return}
    res.writeHead(206,{'Content-Type':mime[extname(file)]||'application/octet-stream','Accept-Ranges':'bytes','Content-Range':`bytes ${start}-${end}/${data.length}`,'Content-Length':end-start+1,'Cache-Control':'no-store'}).end(data.subarray(start,end+1));return
   }
  }
  res.writeHead(200,{'Content-Type':mime[extname(file)]||'application/octet-stream','Cache-Control':'no-store'}).end(data)
 }catch{res.writeHead(500).end()}
}).listen(port,'127.0.0.1',()=>console.log('Local preview: http://127.0.0.1:'+port))
