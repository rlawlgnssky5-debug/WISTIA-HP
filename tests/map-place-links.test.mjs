import test from 'node:test'
import assert from 'node:assert/strict'
import {readFileSync} from 'node:fs'
const source=readFileSync(new URL('../js/app.js',import.meta.url),'utf8')
test('all Kakao map areas use the verified registered Wistia place instead of address searches',()=>{
 assert.match(source,/const KAKAO_STUDIO_PLACE_URL = "https:\/\/map\.kakao\.com\/link\/map\/389994210"/)
 assert.equal((source.match(/KAKAO_STUDIO_PLACE_URL/g)||[]).length,5)
 assert.doesNotMatch(source,/map\.kakao\.com\/link\/search/)
 assert.ok(source.includes('https://map.naver.com/p/search/'))
})
