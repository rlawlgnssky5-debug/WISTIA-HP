import test from 'node:test'
import assert from 'node:assert/strict'
import {readFileSync} from 'node:fs'
const source=readFileSync(new URL('../js/app.js',import.meta.url),'utf8')
test('all Kakao map areas show Wistia search results with the registered place',()=>{
 const place=new URL(source.match(/const KAKAO_STUDIO_PLACE_URL = "([^"]+)"/)[1])
 assert.equal(place.origin,'https://map.kakao.com')
 assert.equal(place.searchParams.get('q'),'위스티아')
 assert.equal(place.searchParams.get('itemId'),'389994210')
 assert.equal((source.match(/KAKAO_STUDIO_PLACE_URL/g)||[]).length,5)
 assert.doesNotMatch(source,/map\.kakao\.com\/link\/search/)
 assert.ok(source.includes('https://map.naver.com/p/search/'))
})
