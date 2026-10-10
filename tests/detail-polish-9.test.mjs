import assert from 'node:assert/strict'
import {readFileSync} from 'node:fs'
const read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8'),app=read('js/app.js')
assert.doesNotMatch(app,/group\('payback','후기 페이백','조건 확인 후 지급'/)
assert.equal((app.match(/group\('payback','후기 페이백','',/g)||[]).length,3)
assert.match(app,/참여 조건 충족 확인 후 돌려드리는 금액이며, 결제 금액에서 미리 차감하지 않습니다/)
assert.match(app,/<h2 id="soloReviewTitle" class="single-line-heading" data-solo-title>직접 남겨 주신 이야기<\/h2>/)
assert.match(app,/POINT 05 · 보컬 보정/);assert.doesNotMatch(app,/실제 제작 영상, 눌러 확인하세요/)
assert.match(app,/<h2 id="specialistTitle" class="single-line-heading">함께 완성하는 전문가들<\/h2>/)
assert.doesNotMatch(app,/<span>01 \/ SUBWAY<\/span>|<span>02 \/ PARKING<\/span>|<span>WISTIA STUDIO · BUCHEON<\/span>|<p class="info-section-kicker">ONE TEAM, THREE SPECIALISTS<\/p>/)
assert.doesNotMatch(app,/heading\("녹음 인원 선택","한 사람 또는 두 사람"/)
assert.equal(JSON.parse(read('wistia-config.json')).build,'20261011-detail-polish-13')
assert.match(read('js/svg-interface.js'),/리뷰\|직접 남겨 주신 이야기/)
console.log('Round 9: single payback sentence, distinct POINT copy, single location/people/expert headings, SVG mapping, current build and historical browser expectations passed')
