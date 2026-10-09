import assert from 'node:assert/strict'
import {readFileSync} from 'node:fs'
import {runInNewContext} from 'node:vm'
const read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8'),app=read('js/app.js'),build='20261009-detail-polish-8'
assert.doesNotMatch(app,/<strong>첫 소절과 다음 소절<\/strong>|<span class="mas-key-caption">편안한 음역|<p class="quote-note">|<strong>본식에 맞는 비율을 함께 결정합니다<\/strong>/)
assert.match(app,/<strong>녹음 구간 연결 예시<\/strong>/)
const home=app.split('\n').find(line=>line.includes('id="homeExpert"'))
assert.match(home,/<strong>녹음부터 완성까지<\/strong>/);assert.doesNotMatch(home,/제작 과정 살펴보기/)
assert.match(app,/참여 조건 충족 확인 후 돌려드리는 금액이며, 결제 금액에서 미리 차감하지 않습니다/)
const scope={heading:()=>'',voiceRatio:'70'}
runInNewContext(app.split('\n').find(line=>line.startsWith('function arRatio(')),scope)
const ratio=scope.arRatio(),guide=ratio.match(/<p class="ratio-guide">(.*?)<\/p>/)[1]
assert.equal((guide.match(/결정합니다/g)||[]).length,1)
assert.equal(JSON.parse(read('wistia-config.json')).build,build)
for(const page of ['index.html','before-after.html','detail/solo.html','event/solo.html']){
 const html=read(page);assert.match(html,new RegExp('<html data-build="'+build+'"'))
 for(const asset of ['js/app.js','js/svg-interface.js','js/contact-form.js','js/home-highlight.js','css/booking-availability.css','css/detail-section-layout.css','css/question-cards-kakao.css'])assert.ok(html.includes(asset+'?v='+build),page+' '+asset+' is cache-busted')
 assert.match(html,/https:\/\/www.wistiastudio.com\/assets\/img\/og\/wistia-og.png/)
}
const browser=read('tests/detail-polish-5-browser.mjs')
assert.doesNotMatch(browser,/page\.waitForTimeout\(100\)/)
assert.match(browser,/await page\.unrouteAll\(\{behavior:'wait'\}\)\s+await page\.close\(\)/)
assert.match(browser,/finally\{for\(const context of browser\.contexts\(\)\)for\(const page of context\.pages\(\)\)await page\.unrouteAll/)
console.log('Round 8: distinct copy, one ratio decision, single payback explanation, current build/assets and drained route teardown passed')
