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
      const escape = value => String(value ?? '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]))
      const card = (item, index, clone = false) => '<div class="ed-review-slide' + (index === 0 && !clone ? ' is-current' : '') + '" data-review-slide-index="' + index + '"' + (clone ? ' data-review-clone' : '') + ' role="group" aria-roledescription="슬라이드" aria-label="' + (index + 1) + ' / ' + items.length + '"' + (clone || index !== 0 ? ' aria-hidden="true" inert' : '') + '><article class="ed-review-card"><h3>' + escape(item.title) + '</h3><p>' + escape(item.body) + '</p><footer><div><b>' + escape(item.name) + '</b><span>' + escape(item.meta) + '</span></div><button type="button" data-review-full="' + escape(item.src) + '" aria-label="' + escape(item.name) + ' 후기 카카오톡 원본 크게 보기">원본 보기 <span aria-hidden="true">›</span></button></footer></article></div>'
      return '<section class="rv5 ed-reviews" id="reviews" data-solo-reviews aria-labelledby="soloReviewTitle" aria-roledescription="캐러셀" data-svg-title="off"><div class="rv5-in"><header class="ed-review-heading"><p class="rv5-eye">REAL REVIEW</p><h2 id="soloReviewTitle" class="rv5-title">고객님들이 직접 남긴<br><strong>축가 후기</strong></h2></header><div class="ed-review-viewport" tabindex="0" aria-label="후기 카드, 좌우 방향키로 넘기기"><div class="ed-review-track" style="--review-position:1">' + card(items.at(-1), items.length - 1, true) + items.map((item, index) => card(item, index)).join('') + card(items[0], 0, true) + '</div></div><nav class="ed-review-controls" aria-label="후기 넘기기"><button type="button" class="ed-review-arrow" data-ed-review-prev aria-label="이전 후기"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m14 5-7 7 7 7"/></svg></button><div class="ed-review-position"><p aria-live="off"><strong data-ed-review-count>01</strong></p><div class="ed-review-dots">' + items.map((_, index) => '<button type="button" data-ed-review-dot="' + index + '" aria-label="' + (index + 1) + '번째 후기" aria-current="' + (index === 0) + '"><span></span></button>').join('') + '</div></div><button type="button" class="ed-review-arrow" data-ed-review-next aria-label="다음 후기"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m10 5 7 7-7 7"/></svg></button></nav></div><dialog class="solo-review-dialog"><button type="button" class="solo-dialog-close" data-solo-dialog-close aria-label="닫기">닫기</button></dialog></section>'
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
        const row = root.querySelector('.ed-review-dots'); if (row && dots[index]) { row.scrollLeft = Math.max(0, dots[index].offsetLeft + dots[index].offsetWidth / 2 - row.clientWidth / 2); row.classList.toggle('is-clipped', row.scrollLeft + row.clientWidth < row.scrollWidth - 1) }
        if (animate) settleTimer = global.setTimeout(() => rotation.settle(), motion.matches ? 0 : 700)
      })
      on(root.querySelector('[data-ed-review-prev]'), 'click', () => rotation.move(-1))
      on(root.querySelector('[data-ed-review-next]'), 'click', () => rotation.move(1))
      dots.forEach((dot, index) => on(dot, 'click', () => rotation.go(index)))
      const dotRow = root.querySelector('.ed-review-dots'), clipDots = () => { if (dotRow) dotRow.classList.toggle('is-clipped', dotRow.scrollLeft + dotRow.clientWidth < dotRow.scrollWidth - 1) }
      on(global, 'resize', clipDots); clipDots(); global.requestAnimationFrame(clipDots)
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
      if (autoplay) on(autoplay, 'click', () => { userPaused = !userPaused; rotation[userPaused ? 'pause' : 'resume']('user'); autoplay.setAttribute('aria-pressed', String(userPaused)); autoplay.textContent = userPaused ? '자동 넘김 시작' : '자동 넘김 정지' })
      const syncMotion = () => { rotation[motion.matches ? 'pause' : 'resume']('reduced-motion'); if (autoplay) autoplay.hidden = motion.matches }
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
        '<img class="ed-key-poster" src="assets/editorial/point02-edit-key-free.webp?v=20261108-point02-free-1" alt="POINT 02 음원 편집 · 키 조절. 노래의 감정은 그대로, 내 목소리에 맞게. 무료. 01 음원 편집: 원하는 길이로 자르고 자연스럽게 이어요. 02 키 조절: 내 목소리에 맞는 높이로 조절해요." width="1170" height="1506" loading="lazy" decoding="async">' +
        '</section>'
    },
    tuningHeader() {
      return heading('VOCAL TUNING · POINT 03', '<span>음정·박자가 흔들려도</span>자연스럽게 다듬어 드려요')
    },
    ratioHeader() {
      return heading('LIVE &amp; AR MIX · POINT 04', '<span>비율 고민하지 마세요</span><b class="ed-title">위스티아는<br>전 비율 다 드립니다!</b>', '위스티아는 모든 비율을 다 만들어 드려요,<br>그날 컨디션에 맞게 골라 쓰세요')
    },
    preparation() {
      return '<section data-svg-title="off" class="package-notices ed-preparation"><header class="ed-preparation-heading"><p>떨림은 덜고, 진심은 그대로</p><h2><span>위스티아에서</span><strong>함께 준비해요</strong></h2><p>내게 맞는 비율로<br>무대에 서세요</p></header><ol class="ed-preparation-list">' +
        [['구간별 녹음과 1:1 디렉팅', '처음부터 끝까지 한 번에 부르지 않아도 괜찮아요'], ['보정은 타입마다 달라요', '스탠다드는 음정·박자 보정이 옵션이고, 정밀 믹싱·마스터링은 모든 타입에 있어요'], ['여유로운 녹음 시간', 'PREMIUM과 DUET은 2시간 30분 녹음이에요']].map(([title, copy], index) => '<li><span class="ed-preparation-number" aria-hidden="true">0' + (index + 1) + '</span><h3>' + title + '</h3></li>').join('') + '</ol></section>'
    },
    engineer() {
      return '<section class="ed-section ed-engineer" data-svg-title="off">' +
        '<div class="ed-broadcast-logo"><img src="assets/img/ar-detail/broadcast-singagain-on-light.webp" alt="싱어게인2" width="1600" height="533" loading="lazy" decoding="async"></div>' +
        heading('SOUND', '같은 소스여도, <b class="ed-title">사운드 완성도는 달라집니다</b>') +
        '<p class="ed-description"><strong>〈싱어게인2〉 방송 음악 작업 참여 엔지니어가</strong><br>음정·박자 보정은 타입과 옵션에 맞추고<br>정밀 믹싱·마스터링으로 마무리합니다</p></section>'
    }
  }
  if (typeof module === 'object' && module.exports) module.exports = editorial
  global.WistiaEditorial = editorial
})(typeof window === 'object' ? window : globalThis)
