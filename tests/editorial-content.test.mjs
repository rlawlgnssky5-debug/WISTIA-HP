import test from 'node:test'
import assert from 'node:assert/strict'
import { createRequire } from 'node:module'
import { mobileCanvasCss } from '../scripts/mobile-canvas-css.mjs'
const require = createRequire(import.meta.url)
let editorial = {}
try { editorial = require('../js/detail-editorial.js') } catch (error) { if (error.code !== 'MODULE_NOT_FOUND') throw error }
const visibleText = html => html.replace(/<\/?(?:span|strong|small|b)(?:\s[^>]*)?>/g, '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ')

test('the native responsive editorial sheet retains its desktop canvas breakpoint', () => {
  const css = '@media(min-width:780px){.mobile-ar-solo{width:100%;margin-inline:0}}'
  assert.equal(mobileCanvasCss(css, 'css/editorial-unified.css'), css)
})

test('recording artwork becomes readable text without losing the four concerns or three recording benefits', () => {
  assert.equal(typeof editorial.recording, 'function')
  const html = editorial.recording(), text = visibleText(html)
  for (const copy of ['이런 고민, 있으셨죠?', '축가를 부탁할 사람이 마땅치 않아요', '노래를 잘 못해도 괜찮을까요?', '하객들 앞에서 노래하려니 너무 떨려요', '미리 녹음하면 티가 나지 않을까요?', '한 곡을 한 번에?', '한 소절씩 녹음하세요', '어려운 구간을 나누어 녹음하고', '1:1 디렉팅으로 차근차근 맞춰갑니다', '소절 단위로 나눠서 녹음', '1:1 실시간 디렉팅', '좋은 테이크만 골라 이어붙임']) assert.ok(text.includes(copy), copy)
  assert.match(html, /id="arcRecording"/)
  assert.match(html, /<img[^>]+width="1122"[^>]+height="1402"/)
})

test('the ratio slider maps its four stops to the existing recordings', () => {
  assert.equal(typeof editorial.ratioAtStep, 'function')
  assert.deepEqual([0, 1, 2, 3].map(editorial.ratioAtStep), [30, 50, 70, 100])
  assert.equal(editorial.ratioAtStep('2'), 70)
  assert.equal(editorial.ratioAtStep(-1), 50)
  assert.equal(editorial.ratioAtStep(4), 50)
})

test('percentage slider positions snap to the nearest available recording', () => {
  assert.equal(typeof editorial.ratioAtValue, 'function')
  assert.deepEqual([0, 30, 39, 40, 50, 59, 60, 70, 84, 85, 100].map(editorial.ratioAtValue), [30, 30, 30, 50, 50, 50, 70, 70, 70, 100, 100])
  assert.equal(editorial.ratioAtValue('70'), 70)
  assert.equal(editorial.ratioAtValue(NaN), 50)
})

test('key, tuning, ratio and engineering sections preserve the original visible information', () => {
  for (const name of ['key', 'tuningHeader', 'ratioHeader', 'engineer', 'preparation']) assert.equal(typeof editorial[name], 'function', name)
  const keyHtml = editorial.key()
  assert.match(keyHtml, /id="arcKey"/)
  assert.match(keyHtml, /point02-edit-key-free\.webp\?v=20261108-point02-free-1/)
  assert.match(keyHtml, /width="1170"/)
  assert.match(keyHtml, /height="1506"/)
  const keyAlt = (keyHtml.match(/alt="([^"]+)"/) || [])[1] || ''
  for (const copy of ['POINT 02', '음원 편집 · 키 조절', '노래의 감정은 그대로, 내 목소리에 맞게', '무료', '원하는 길이로 자르고 자연스럽게 이어요', '내 목소리에 맞는 높이로 조절해요']) {
    assert.ok(keyAlt.includes(copy), copy)
  }
  assert.equal(keyHtml.includes('0원'), false)
  assert.equal(keyHtml.includes('key-wave-ribbon'), false)
  assert.equal(keyHtml.includes('원곡 키 0'), false)
  assert.equal(keyHtml.includes('내 키 -2'), false)
  const text = visibleText(editorial.tuningHeader() + editorial.ratioHeader() + editorial.engineer() + editorial.preparation())
  for (const copy of ['음정·박자가 흔들려도', '자연스럽게 다듬어 드려요', '30% 50% 70% 100% 비율 모두 다 드립니다!', '같은 소스여도,', '사운드 완성도는 달라집니다', '〈싱어게인2〉 방송 음악 작업 참여 엔지니어가', '음정·박자 보정은 타입과 옵션에 맞추고', '정밀 믹싱·마스터링으로 마무리합니다', '구간별 녹음과 1:1 디렉팅', '보정은 타입마다 달라요', '여유로운 녹음 시간']) assert.ok(text.includes(copy), copy)
  assert.equal(text.includes('기본 믹싱'), false)
  assert.equal(text.includes('수작업 보정부터'), false)
  assert.equal(text.includes('필요한 보정과 믹싱 선택'), false)
  for (const gone of ['KEY POINT', 'FREE OF CHARGE', '곡·MR 보내기', '키 상담', '내 키로 녹음', '내 목소리 그대로, 어색한 부분만', '음정·박자·호흡을 섬세하게 보정합니다']) assert.equal(text.includes(gone), false, gone)
})
