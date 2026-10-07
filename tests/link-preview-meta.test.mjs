import assert from 'node:assert/strict'
import {readFileSync,readdirSync,statSync} from 'node:fs'
import {join,relative} from 'node:path'
import {fileURLToPath} from 'node:url'
import {createRequire} from 'node:module'

// Shared links (Threads, Kakao, etc.) must not show a photo or a price in the preview card.
const root=fileURLToPath(new URL('..',import.meta.url))
const skip=new Set(['tests','tmp','node_modules','.git','.vercel','output','Claude outputs','assets','supabase','docs'])
const pages=[]
const walk=dir=>{for(const name of readdirSync(dir)){const path=join(dir,name);if(statSync(path).isDirectory()){if(!skip.has(name))walk(path)}else if(name.endsWith('.html'))pages.push(path)}}
walk(root)
assert.ok(pages.length>=32,'all static pages are checked')
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
 assert.doesNotMatch(head,/(?:property|name)="(?:og:image|twitter:image)[^"]*"/,name+' has no preview image')
 for(const card of head.matchAll(/name="twitter:card"\s+content="([^"]*)"/g))assert.equal(card[1],'summary',name+' uses the small text card')
 for(const [field,value] of metaFields(head))assert.doesNotMatch(value,price,name+' '+field+' has no price: '+value)
}
const seo=createRequire(import.meta.url)('../js/seo-meta.js')
const entries=[seo.home,seo.event,seo.location,...Object.values(seo.detail),...Object.values(seo.noindex)]
for(const entry of entries)for(const value of [entry.title,entry.description])assert.doesNotMatch(value,price,'runtime SEO copy has no price: '+value)
assert.equal(seo.detail.solo.title,'AR 축가 SOLO(1인) | 위스티아')
assert.equal(seo.detail.duo.title,'AR 축가 DUET(2인) | 위스티아')
console.log('Link previews: no og:image/twitter:image, summary card and no price in titles/descriptions across',pages.length,'pages passed')
