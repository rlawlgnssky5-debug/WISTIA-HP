import {createServer} from 'node:http'
import {readFile,stat} from 'node:fs/promises'
import {resolve,extname,sep} from 'node:path'
const root=resolve(import.meta.dirname,'..')
const mime={'.html':'text/html; charset=utf-8','.css':'text/css','.js':'text/javascript','.json':'application/json','.svg':'image/svg+xml','.webp':'image/webp','.jpg':'image/jpeg','.png':'image/png','.mp4':'video/mp4','.woff2':'font/woff2'}
createServer(async(req,res)=>{
 try{
  let path=decodeURIComponent(new URL(req.url,'http://localhost').pathname)
  if(path==='/')path='/index.html'
  else if(!extname(path))path+='.html'
  let file=resolve(root,'.'+path)
  if(!file.startsWith(root+sep)){res.writeHead(403).end();return}
  try{if(!(await stat(file)).isFile())throw Error()}catch{if(extname(path)!=='.html'){res.writeHead(404).end();return}file=resolve(root,'index.html')}
  const data=await readFile(file)
  res.writeHead(200,{'Content-Type':mime[extname(file)]||'application/octet-stream','Cache-Control':'no-store'}).end(data)
 }catch{res.writeHead(500).end()}
}).listen(4174,'127.0.0.1',()=>console.log('Local preview: http://127.0.0.1:4174'))
