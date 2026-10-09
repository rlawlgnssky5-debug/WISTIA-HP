import assert from 'node:assert/strict'
import {readFileSync,readdirSync,statSync} from 'node:fs'
import {join,relative} from 'node:path'
import {fileURLToPath} from 'node:url'
import {createRequire} from 'node:module'
import {runInNewContext} from 'node:vm'

// Crawlers that do not run JavaScript must receive the shared logo and price-free metadata.
const root=fileURLToPath(new URL('..',import.meta.url))
const skip=new Set(['tests','tmp','node_modules','.git','.vercel','output','work','Claude outputs','assets','supabase','docs'])
const pages=[]
const walk=dir=>{for(const name of readdirSync(dir)){const path=join(dir,name);if(statSync(path).isDirectory()){if(!skip.has(name))walk(path)}else if(name.endsWith('.html'))pages.push(path)}}
walk(root)
assert.ok(pages.length>=32,'all static pages are checked')
const shareImage='https://www.wistiastudio.com/assets/img/og/wistia-og.png'
const image=readFileSync(join(root,'assets/img/og/wistia-og.png'))
assert.deepEqual(image.subarray(0,8),Buffer.from([137,80,78,71,13,10,26,10]),'shared image is PNG')
assert.equal(image.toString('ascii',12,16),'IHDR')
assert.equal(image.readUInt32BE(16),1200,'shared image width')
assert.equal(image.readUInt32BE(20),630,'shared image height')
assert.ok(image.length<=300*1024,'shared image is at most 300 KB')
const price=/₩|\d[\d,.]*\s*(?:만\s*)?원|만원|할인가/
const decode=value=>value.replace(/&amp;/g,'&').replace(/&quot;/g,'"').replace(/&#39;/g,"'").replace(/&lt;/g,'<').replace(/&gt;/g,'>')
const metaFields=head=>{
 const values=[...head.matchAll(/<meta\s+(?:name|property)="(description|og:title|og:description|twitter:title|twitter:description)"\s+content="([^"]*)"/g)].map(match=>[match[1],decode(match[2])])
 const title=head.match(/<title>([^<]*)<\/title>/)
 if(title)values.push(['title',decode(title[1])])
 return values
}
for(const page of pages){
 const name=relative(root,page)
 const head=readFileSync(page,'utf8').split('</head>')[0]
 const expected={'og:image':shareImage,'og:image:width':'1200','og:image:height':'630','og:image:alt':'WISTIA 위스티아 로고','twitter:card':'summary_large_image','twitter:image':shareImage}
 for(const [key,value] of Object.entries(expected)){
  const tags=[...head.matchAll(/<meta\s+(?:property|name)="([^"]*)"\s+content="([^"]*)"[^>]*>/g)].filter(match=>match[1]===key)
  assert.equal(tags.length,1,name+' has exactly one '+key+' in the static head')
  assert.equal(tags[0][2],value,name+' '+key)
 }
 for(const [field,value] of metaFields(head))assert.doesNotMatch(value,price,name+' '+field+' has no price: '+value)
}
const seo=createRequire(import.meta.url)('../js/seo-meta.js')
const entries=[seo.home,seo.event,seo.location,...Object.values(seo.detail),...Object.values(seo.noindex)]
for(const entry of entries)for(const value of [entry.title,entry.description])assert.doesNotMatch(value,price,'runtime SEO copy has no price: '+value)
assert.equal(seo.detail.solo.title,'AR 축가 SOLO(1인) | 위스티아')
assert.equal(seo.detail.duo.title,'AR 축가 DUET(2인) | 위스티아')
// Exercise the actual runtime metadata setter: SPA navigation must keep both image tags in sync.
const app=readFileSync(join(root,'js/app.js'),'utf8')
const start=app.indexOf('function setPageMeta(')
const end=app.indexOf('\nfunction ',start+1)
assert.ok(start>=0 && end>start,'runtime metadata setter exists')
const tags=new Map()
const context={location:{pathname:'/detail/solo'},document:{querySelector:selector=>{if(selector==="meta[name='robots']")return null;if(!tags.has(selector))tags.set(selector,{});return tags.get(selector)}}}
runInNewContext(app.slice(start,end)+'\nsetPageMeta({title:"SOLO",description:"test"});',context)
for(const selector of ["meta[property='og:image']","meta[name='twitter:image']"])assert.equal(tags.get(selector).content,shareImage,'SPA navigation uses the shared logo')
runInNewContext('setPageMeta({title:"SOLO",description:"test",image:"https://example.com/override.png"});',context)
for(const selector of ["meta[property='og:image']","meta[name='twitter:image']"])assert.equal(tags.get(selector).content,'https://example.com/override.png','explicit images stay synchronized')
console.log('Link previews: static logo metadata, 1200×630 PNG under 300KB, synchronized runtime images and price-free copy across',pages.length,'pages passed')
