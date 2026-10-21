import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import cp from 'node:child_process'
const read=p=>fs.readFileSync(new URL('../'+p,import.meta.url),'utf8')
const original=p=>cp.execFileSync('git',['show','bc0980a:'+p],{cwd:new URL('..',import.meta.url),encoding:'utf8',maxBuffer:8e6})
test('only the approved about card and copy are removed',()=>{
 const about=read('js/app.js').split('const aboutContent=')[1].split('\n const address=')[0]
 assert.match(about,/목소리와 이야기를 담는 스튜디오/)
 assert.match(about,/녹음부터 음원 보정, 믹싱까지 함께합니다/)
 assert.doesNotMatch(about,/영상|촬영|7년 경력|<span>03<\/span>/)
})
test('desktop poster and map raster buttons are replaced without changing map destinations',()=>{
 const app=read('js/app.js')
 assert.doesNotMatch(app,/top_B_pc\.webp/)
 assert.match(app,/class="solo-map-art"><img/)
 for(const site of ['https://map.naver.com/p/search/','https://map.kakao.com/link/search/']){
  assert.equal(app.split(site).length,original('js/app.js').split(site).length)
 }
 assert.equal(cp.execFileSync('git',['diff','bc0980a','--name-only','--','assets'],{cwd:new URL('..',import.meta.url),encoding:'utf8'}).trim(),'')
})
test('privacy legal copy is preserved and section colours remain approval-gated',()=>{
 const previous=original('privacy.html').match(/<main class="wrap">([\s\S]*?)<\/main>/)[1]
 const content=read('js/privacy-content.js').replace(/^window\.WistiaPrivacyContent = /,'').trim()
 assert.equal(JSON.parse(content).replaceAll('\r\n','\n'),previous.replaceAll('\r\n','\n'))
 const tones=s=>s.match(/const sectionTones=\[[\s\S]*?\n \]/)[0]
 assert.equal(tones(read('js/detail-pc-background.js')).replaceAll('\r\n','\n'),tones(original('js/detail-pc-background.js')).replaceAll('\r\n','\n'))
 for(const p of Object.keys(JSON.parse(read('css/bundles.json')).pages))assert.doesNotMatch(read(p),/colour-preview/)
})
