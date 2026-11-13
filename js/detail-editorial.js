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
      const card = (item, index, clone = false) => '<div class="ed-review-slide' + (index === 0 && !clone ? ' is-current' : '') + '" data-review-slide-index="' + index + '"' + (clone ? ' data-review-clone' : '') + ' role="group" aria-roledescription="슬라이드" aria-label="' + (index + 1) + ' / ' + items.length + '"' + (clone || index !== 0 ? ' aria-hidden="true" inert' : '') + '><article class="ed-review-card"><div class="ed-review-thumb" role="button" tabindex="0" data-review-full="' + escape(item.src) + '" aria-label="' + escape(item.name) + ' 후기 카카오톡 원본 크게 보기"' + (item.highlight ? ' style="--hl-cy:' + ((item.highlight[1] + item.highlight[3] / 2) / 100) + '"' : '') + '><span class="ed-review-frame"><img src="' + escape(item.src) + '" alt="" loading="lazy" decoding="async">' + (item.highlight ? '<span class="ed-review-hl" aria-hidden="true" style="left:' + item.highlight[0] + '%;top:' + item.highlight[1] + '%;width:' + item.highlight[2] + '%;height:' + item.highlight[3] + '%"></span>' : '') + '</span></div><h3>' + escape(item.title) + '</h3></article></div>'
      return '<section class="rv5 ed-reviews" id="reviews" data-solo-reviews aria-labelledby="soloReviewTitle" aria-roledescription="캐러셀" data-svg-title="off"><div class="rv5-in"><header class="ed-review-heading"><p class="rv5-eye">REAL REVIEW</p><h2 id="soloReviewTitle" class="rv5-title">고객님들이 직접 남긴<br><strong>축가 후기</strong></h2></header><div class="ed-review-viewport" tabindex="0" aria-label="후기 카드, 좌우 방향키로 넘기기"><div class="ed-review-track" style="--review-position:1">' + card(items.at(-1), items.length - 1, true) + items.map((item, index) => card(item, index)).join('') + card(items[0], 0, true) + '</div></div><nav class="ed-review-controls" aria-label="후기 넘기기"><button type="button" class="ed-review-arrow" data-ed-review-prev aria-label="이전 후기"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m14 5-7 7 7 7"/></svg></button><div class="ed-review-position"><div class="ed-review-dots">' + items.map((_, index) => '<button type="button" data-ed-review-dot="' + index + '" aria-label="' + (index + 1) + '번째 후기" aria-current="' + (index === 0) + '"><span></span></button>').join('') + '</div></div><button type="button" class="ed-review-arrow" data-ed-review-next aria-label="다음 후기"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m10 5 7 7-7 7"/></svg></button></nav></div><dialog class="solo-review-dialog"><button type="button" class="solo-dialog-close" data-solo-dialog-close aria-label="닫기">닫기</button></dialog></section>'
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
      // 지금 보이는 카드 높이에 맞춰 캐러셀 높이를 정한다 (짧은 카드 아래가 비지 않게)
      const fitTrack = () => { const current = track.querySelector('.ed-review-slide.is-current'); if (current) track.style.setProperty('height', current.offsetHeight + 'px', 'important') }
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
        fitTrack()
        const row = root.querySelector('.ed-review-dots'); if (row && dots[index]) { row.scrollLeft = Math.max(0, dots[index].offsetLeft + dots[index].offsetWidth / 2 - row.clientWidth / 2); row.classList.toggle('is-clipped', row.scrollLeft + row.clientWidth < row.scrollWidth - 1) }
        if (animate) settleTimer = global.setTimeout(() => rotation.settle(), motion.matches ? 0 : 700)
      })
      // 후기 캡처 미리보기: 핵심 문장(빨간 박스)이 보이도록 높이·위치를 이미지 비율에 맞춘다
      const fitThumb = thumb => { const img = thumb.querySelector('img'); if (!img || !img.naturalWidth) return; const ratio = img.naturalHeight / img.naturalWidth; thumb.style.setProperty('--ratio', ratio); thumb.style.height = Math.min(168, Math.round(thumb.clientWidth * ratio)) + 'px' ; fitTrack() }
      root.querySelectorAll('.ed-review-thumb').forEach(thumb => { const img = thumb.querySelector('img'); if (img.complete) fitThumb(thumb); else on(img, 'load', () => fitThumb(thumb)); on(thumb, 'keydown', event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); thumb.click() } }) })
      on(global, 'resize', () => { root.querySelectorAll('.ed-review-thumb').forEach(fitThumb); fitTrack() })
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
        '<div class="hg-key"><header class="ed-heading" data-svg-title="off"><span class="ed-point">POINT 02</span><h2>음원 편집 · <b class="ed-title">키 조절</b></h2><p class="ed-description">노래의 감정은 그대로, 내 목소리에 맞게</p></header>' +
        '<p class="hg-key-free"><b>무료</b></p>' +
        '<ul class="hg-key-cards"><li class="hg-key-card"><small>01</small><strong>음원 편집</strong><p>원하는 길이로 자르고<br>자연스럽게 이어요</p></li><li class="hg-key-card"><small>02</small><strong>키 조절</strong><p>내 목소리에 맞는<br>높이로 조절해요</p></li></ul></div>' +
        '</section>'
    },
    tuningHeader() {
      return heading('VOCAL TUNING · POINT 03', '<span>음정·박자가 흔들려도</span>자연스럽게 다듬어 드려요')
    },
    ratioHeader() {
      return heading('LIVE &amp; AR MIX · POINT 04', '<span>비율 고민하지 마세요!</span><b class="ed-title">30% 50% 70% 100% 비율 모두 다 드립니다!</b>', '그날 컨디션에 맞게 골라 쓰세요 :)')
    },
    preparation() {
      return '<section data-svg-title="off" class="package-notices ed-preparation"><header class="ed-preparation-heading"><p>떨림은 덜고, 진심은 그대로</p><h2><span>위스티아에서</span><strong>함께 준비해요</strong></h2><p>내게 맞는 비율로<br>무대에 서세요</p></header><ol class="ed-preparation-list">' +
        [['구간별 녹음과 1:1 디렉팅', '처음부터 끝까지 한 번에 부르지 않아도 괜찮아요'], ['음원 작업은 골라서', '음정·박자 보정, 정밀 믹싱, 마스터링을 필요한 만큼 선택해요'], ['여유로운 녹음 시간', '50분, 1시간 30분, 2시간 30분 중에서 골라요']].map(([title, copy], index) => '<li><span class="ed-preparation-number" aria-hidden="true">0' + (index + 1) + '</span><h3>' + title + '</h3></li>').join('') + '</ol></section>'
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
