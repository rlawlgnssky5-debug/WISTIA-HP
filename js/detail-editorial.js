/* Presentation only. Prices, audio and booking remain in their existing modules. */
(function (global) {
  'use strict'
  const heading = (eyebrow, title, copy = '') => {
    const [label, point] = eyebrow.split(' · ')
    const styledTitle = point ? title.replace(/(<\/span>)?([^<>]+)$/, '$1<b class="ed-title">$2</b>') : title
    return '<header class="ed-heading" data-svg-title="off"><p class="ed-eyebrow">' + label + '</p>' + (point ? '<span class="ed-point">' + point + '</span>' : '') + '<h2>' + styledTitle + '</h2>' + (copy ? '<p class="ed-description">' + copy + '</p>' : '') + '</header>'
  }
  const editorial = {
    reviews(items) {
      const card = (item, index, clone = false) => '<div class="ed-review-slide' + (index === 0 && !clone ? ' is-current' : '') + '" data-review-slide-index="' + index + '"' + (clone ? ' data-review-clone' : '') + ' role="group" aria-roledescription="슬라이드" aria-label="' + (index + 1) + ' / ' + items.length + '"' + (clone || index !== 0 ? ' aria-hidden="true" inert' : '') + '><article class="ed-review-card"><div class="ed-review-stars" aria-label="별점 5점">★★★★★</div><h3>' + item.title + '</h3><p>' + item.body + '</p><footer><div><b>' + item.name + '</b><span>' + item.meta + '</span></div><button type="button" data-review-full="' + item.src + '" aria-label="' + item.name + ' 후기 카카오톡 원본 크게 보기">원본 보기 <span aria-hidden="true">›</span></button></footer></article></div>'
      return '<section class="rv5 ed-reviews" id="reviews" data-solo-reviews aria-labelledby="soloReviewTitle" aria-roledescription="캐러셀" data-svg-title="off"><div class="rv5-in"><header class="ed-review-heading"><p class="rv5-eye">REAL REVIEW</p><h2 id="soloReviewTitle" class="rv5-title">고객님들이 직접 남긴<br><strong>축가 후기</strong></h2></header><div class="ed-review-viewport" tabindex="0" aria-label="후기 카드, 좌우 방향키로 넘기기"><div class="ed-review-track" style="--review-position:1">' + card(items.at(-1), items.length - 1, true) + items.map((item, index) => card(item, index)).join('') + card(items[0], 0, true) + '</div></div><nav class="ed-review-controls" aria-label="후기 넘기기"><button type="button" class="ed-review-arrow" data-ed-review-prev aria-label="이전 후기"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m14 5-7 7 7 7"/></svg></button><div class="ed-review-position"><p aria-live="off"><strong data-ed-review-count>01</strong><span> / ' + String(items.length).padStart(2, '0') + '</span></p><div class="ed-review-dots">' + items.map((_, index) => '<button type="button" data-ed-review-dot="' + index + '" aria-label="' + (index + 1) + '번째 후기" aria-current="' + (index === 0) + '"><span></span></button>').join('') + '</div></div><button type="button" class="ed-review-arrow" data-ed-review-next aria-label="다음 후기"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m10 5 7 7-7 7"/></svg></button></nav><button type="button" class="ed-review-autoplay" data-ed-review-autoplay aria-pressed="false">자동 넘김 정지</button></div><dialog class="solo-review-dialog"><button type="button" class="solo-dialog-close" data-solo-dialog-close aria-label="닫기">닫기</button></dialog></section>'
    },
    createReviewRotation(count, paint, clock = global) {
      let index = 0, position = 1, timer = null, destroyed = false, moving = false
      const queued = []
      const paused = new Set(['offscreen'])
      const stop = () => { if (timer !== null) clock.clearTimeout(timer); timer = null }
      const schedule = () => { stop(); if (!destroyed && !paused.size && count > 1) timer = clock.setTimeout(() => api.move(1), 6000) }
      const show = animate => paint({ index, position, animate })
      const api = {
        move(delta) { if (destroyed) return; if (moving) { queued.push(() => api.move(delta)); return } moving = true; position = index + 1 + delta; index = (index + delta + count) % count; show(true); schedule() },
        go(target) { if (destroyed) return; if (moving) { queued.push(() => api.go(target)); return } moving = true; index = (target + count) % count; position = index + 1; show(true); schedule() },
        settle() { if (destroyed) return; moving = false; if (position === 0 || position === count + 1) { position = index + 1; show(false) } queued.shift()?.() },
        pause(reason) { paused.add(reason); stop() },
        resume(reason) { paused.delete(reason); schedule() },
        destroy() { destroyed = true; queued.length = 0; stop() }
      }
      show(false)
      return api
    },
    mountReviews(root) {
      if (!root) return () => {}
      const track = root.querySelector('.ed-review-track'), viewport = root.querySelector('.ed-review-viewport')
      const slides = [...track.children], dots = [...root.querySelectorAll('[data-ed-review-dot]')]
      const motion = global.matchMedia('(prefers-reduced-motion: reduce)'), removers = []
      let settleTimer = null, down = null, swiped = false, userPaused = false
      const on = (target, event, handler, options) => { target.addEventListener(event, handler, options); removers.push(() => target.removeEventListener(event, handler, options)) }
      const rotation = editorial.createReviewRotation(dots.length, ({index, position, animate}) => {
        global.clearTimeout(settleTimer)
        track.classList.toggle('is-instant', !animate || motion.matches)
        track.style.setProperty('--review-position', position)
        // Commit the invisible clone reset before a queued navigation animates.
        if (!animate) void track.offsetWidth
        root.dataset.reviewIndex = index
        slides.forEach((slide, i) => {
          slide.classList.toggle('is-current', i === position)
          slide.classList.toggle('is-prev', i === position - 1)
          slide.classList.toggle('is-next', i === position + 1)
          const readable = Number(slide.dataset.reviewSlideIndex) === index && !slide.hasAttribute('data-review-clone')
          slide.inert = !readable
          slide.setAttribute('aria-hidden', String(!readable))
        })
        dots.forEach((dot, i) => dot.setAttribute('aria-current', String(i === index)))
        root.querySelector('[data-ed-review-count]').textContent = String(index + 1).padStart(2, '0')
        if (animate) settleTimer = global.setTimeout(() => rotation.settle(), motion.matches ? 0 : 700)
      })
      on(root.querySelector('[data-ed-review-prev]'), 'click', () => rotation.move(-1))
      on(root.querySelector('[data-ed-review-next]'), 'click', () => rotation.move(1))
      dots.forEach((dot, index) => on(dot, 'click', () => rotation.go(index)))
      on(viewport, 'keydown', event => { if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') { event.preventDefault(); rotation.move(event.key === 'ArrowLeft' ? -1 : 1) } })
      on(viewport, 'pointerdown', event => { swiped = false; if (event.isPrimary && !event.target.closest('button')) { down = {x:event.clientX, y:event.clientY, id:event.pointerId}; rotation.pause('pointer') } })
      on(global, 'pointerup', event => {
        if (!down || event.pointerId !== down.id) return
        const dx = event.clientX - down.x, dy = event.clientY - down.y
        if (Math.abs(dx) > 36 && Math.abs(dx) > Math.abs(dy) * 1.3) { swiped = true; rotation.move(dx < 0 ? 1 : -1) }
        down = null; rotation.resume('pointer')
      })
      on(global, 'pointercancel', () => { down = null; rotation.resume('pointer') })
      on(viewport, 'click', event => { if (swiped) { event.preventDefault(); event.stopPropagation(); swiped = false } }, true)
      on(root, 'pointerenter', event => { if (event.pointerType === 'mouse') rotation.pause('hover') })
      on(root, 'pointerleave', event => { if (event.pointerType === 'mouse') rotation.resume('hover') })
      on(root, 'focusin', () => rotation.pause('focus'))
      on(root, 'focusout', event => { if (!root.contains(event.relatedTarget)) rotation.resume('focus') })
      const autoplay = root.querySelector('[data-ed-review-autoplay]')
      on(autoplay, 'click', () => { userPaused = !userPaused; rotation[userPaused ? 'pause' : 'resume']('user'); autoplay.setAttribute('aria-pressed', String(userPaused)); autoplay.textContent = userPaused ? '자동 넘김 시작' : '자동 넘김 정지' })
      const syncMotion = () => { rotation[motion.matches ? 'pause' : 'resume']('reduced-motion'); autoplay.hidden = motion.matches }
      on(motion, 'change', syncMotion); syncMotion()
      const visibility = () => rotation[global.document.hidden ? 'pause' : 'resume']('hidden')
      on(global.document, 'visibilitychange', visibility); visibility()
      const observer = new global.IntersectionObserver(entries => rotation[entries[0].intersectionRatio >= 0.25 ? 'resume' : 'pause']('offscreen'), {threshold:0.25})
      observer.observe(root)
      return () => { rotation.destroy(); observer.disconnect(); global.clearTimeout(settleTimer); removers.forEach(remove => remove()) }
    },
    ratioAtStep(step) { return [30, 50, 70, 100][Number(step)] ?? 50 },
    ratioAtValue(value) {
      const ratio = Number(value)
      if (!Number.isFinite(ratio)) return 50
      return ratio < 40 ? 30 : ratio < 60 ? 50 : ratio < 85 ? 70 : 100
    },
    recording() {
      return '<section class="ed-worries ed-section" id="arcWorries" data-svg-title="off">' + heading("BRIDE’S WORRY", '이런 고민, 있으셨죠?') +
        '<ul><li>축가를 부탁할 사람이 마땅치 않아요</li><li>노래를 잘 못해도 괜찮을까요?</li><li>하객들 앞에서 노래하려니 너무 떨려요</li><li>미리 녹음하면 티가 나지 않을까요?</li></ul></section>' +
        '<section class="arc-point arc-point-recording ed-section" id="arcRecording" data-svg-title="off">' +
        heading('RECORDING POINT · POINT 01', '<span>한 곡을 한 번에?</span>한 소절씩 녹음하세요', '어려운 구간을 나누어 녹음하고<br>1:1 디렉팅으로 차근차근 맞춰갑니다') +
        '<div class="ed-recording-scene"><figure class="ed-photo"><img src="assets/editorial/recording-studio-portrait.webp" alt="녹음용 콘덴서 마이크와 팝 필터를 담은 스튜디오 이미지" width="1122" height="1402" loading="lazy" decoding="async"></figure>' +
        '<ul class="ed-recording-benefits"><li><span aria-hidden="true">+</span>소절 단위로 나눠서 녹음</li><li><span aria-hidden="true">+</span>1:1 실시간 디렉팅</li><li><span aria-hidden="true">+</span>좋은 테이크만 골라 이어붙임</li></ul></div></section>'
    },
    key() {
      return '<section class="arc-point arc-point-poster ed-section ed-key" id="arcKey" data-svg-title="off">' +
        heading('KEY POINT · POINT 02', '음원 편집 · 키 조절', '노래의 감정은 그대로, 내 목소리에 맞게') +
        '<div class="ed-free"><strong>0<span>원</span></strong><p>FREE OF CHARGE</p></div>' +
        '<div class="ed-key-process-block"><p class="ed-eyebrow">PROCESS</p><ol class="ed-key-process">' +
        [['send', '곡·MR 보내기'], ['consult', '키 상담'], ['record', '내 키로 녹음']].map(([icon, label]) => '<li><img class="ed-key-process-icon" src="assets/editorial/process-' + icon + '.svg" alt="" width="48" height="48" aria-hidden="true"><span>' + label + '</span></li>').join('') + '</ol></div>' +
        '<div class="ed-key-artwork"><div class="ed-key-services"><article><span class="ed-key-service-number" aria-hidden="true">01</span><h3>음원 편집</h3><p>원하는 길이로 자르고<br>자연스럽게 이어요.</p><span class="ed-key-connector" aria-hidden="true"></span></article>' +
        '<article><span class="ed-key-service-number" aria-hidden="true">02</span><h3>키 조절</h3><p>내 목소리에 맞는<br>높이로 조절해요.</p><span class="ed-key-connector" aria-hidden="true"></span></article></div>' +
        '<figure class="ed-key-ribbon"><img src="assets/editorial/key-wave-ribbon.png" alt="음원 파형이 이어지고 음표의 높이가 바뀌는 리본" width="1536" height="1024" loading="lazy" decoding="async"><svg class="ed-key-scissors" viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="9" cy="24" r="4"/><circle cx="23" cy="24" r="4"/><path d="M11 20.5 25 5M21 20.5 7 5"/></svg><svg class="ed-key-curve" viewBox="0 0 100 46" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 31C30 3 66 7 94 32M83 28l11 4-4-11"/></svg></figure><p class="ed-key-example">원곡 키 0 <span aria-hidden="true">→</span> 내 키 -2</p></div></section>'
    },
    tuningHeader() {
      return heading('VOCAL TUNING · POINT 03', '<span>음정·박자가 흔들려도</span>자연스럽게 다듬어 드려요', '내 목소리 그대로, 어색한 부분만<br>음정·박자·호흡을 섬세하게 보정합니다')
    },
    ratioHeader() {
      return heading('LIVE &amp; AR MIX · POINT 04', '<span>내 목소리에 맞게</span>AR 비율을 골라보세요', '같은 노래를 라이브와 AR 비율별로<br>직접 비교해 들어보세요.')
    },
    preparation() {
      return '<section data-svg-title="off" class="package-notices ed-preparation"><header class="ed-preparation-heading"><p>떨림은 덜고, 진심은 그대로</p><h2><span>위스티아에서</span><strong>함께 준비해요</strong></h2><p>내게 맞는 비율로<br>무대에 서세요.</p></header><ol class="ed-preparation-list">' +
        [['구간별 녹음과 1:1 디렉팅', '처음부터 끝까지 한 번에 부르지 않아도 괜찮아요'], ['필요한 보정과 믹싱 선택', '목소리와 준비 상황에 맞춰 A·B·C 중 골라 주세요'], ['여유로운 녹음 시간', 'C는 2시간 녹음으로 준비할 수 있어요']].map(([title, copy], index) => '<li><span class="ed-preparation-number" aria-hidden="true">0' + (index + 1) + '</span><h3>' + title + '</h3><p>' + copy + '</p></li>').join('') + '</ol></section>'
    },
    engineer() {
      return '<section class="ed-section ed-engineer" data-svg-title="off">' +
        '<svg class="ed-sound-icon" viewBox="0 0 32 32" fill="none" aria-hidden="true"><path d="M5 18v-3a11 11 0 0 1 22 0v3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><rect x="3" y="16" width="6" height="12" rx="3" fill="currentColor"/><rect x="23" y="16" width="6" height="12" rx="3" fill="currentColor"/></svg>' +
        heading('SOUND', '<span>같은 소스여도,</span><b class="ed-title">사운드 완성도는 달라집니다</b>') +
        '<div class="ed-credit"><p class="ed-eyebrow">사운드 완성</p><div class="ed-broadcast-logo"><img src="assets/editorial/sound-vinyl-reference.png" alt="싱어게인2" width="1024" height="1536" loading="lazy" decoding="async"></div></div>' +
        '<p class="ed-description"><strong>〈싱어게인2〉 방송 음악 작업 참여 엔지니어가</strong><br>직접 수작업 보정부터<br>믹싱·마스터링까지 완성합니다</p></section>'
    }
  }
  if (typeof module === 'object' && module.exports) module.exports = editorial
  global.WistiaEditorial = editorial
})(typeof window === 'object' ? window : globalThis)
