/* Presentation only. Prices, audio and booking remain in their existing modules. */
(function (global) {
  'use strict'
  // 2026-11-19 지훈 시안 4: POINT 표시는 전부 손글씨 ‘Point 1.’ 가운데 정렬 (POINT 01~06 같은 모양)
  // 2026-11-19 지훈: Point 1 시안 2 — 가사마다 디렉터 한마디로 잘될 때까지 반복 → 이어 붙여 완성 음원
  const compTakes = () => {
    const part = (lyric, talks) => '<div class="ed-comp-part"><p class="ed-comp-lyric">' + lyric + '</p><p class="ed-comp-talk">' +
      talks.map((t, i) => '<span' + (i === talks.length - 1 ? ' class="is-ok"' : '') + '>' + t + '</span>').join('') + '</p></div>'
    return '<div class="ed-comp" role="img" aria-label="가사를 한 마디씩 끊어서 디렉팅을 받으며 잘될 때까지 반복 녹음한 뒤 이어 붙여 완성 음원을 만드는 예시">' +
      part('사랑해 너를 사랑해', ['한 번 더 갈게요', '조금만 부드럽게', '좋아요! OK']) +
      part('눈물 나도록 사랑해', ['다시 한 번', '숨 쉬고', '거의 왔어요', '한 번만 더', '완벽해요! OK']) +
      '<p class="ed-comp-join">잘될 때까지 디렉팅하며 반복 ↓</p>' +
      '<div class="ed-comp-final"><span>완성 음원 ♪</span><p>사랑해 너를 사랑해<br>눈물 나도록 사랑해</p></div></div>'
  }
  const pointLabel = point => '<span class="ed-point ed-point-hand" aria-label="' + point + '">Point ' + Number(point.replace(/\D/g, '')) + '.</span>'
  const heading = (eyebrow, title, copy = '') => {
    const point = eyebrow.split(' · ')[1]
    const styledTitle = point ? title.replace(/(<\/span>)?([^<>]+)$/, '$1<b class="ed-title">$2</b>') : title
    // 2026-11-19 지훈: 영어 소제목(VOCAL TUNING 등)은 쓰지 않는다
    return '<header class="ed-heading" data-svg-title="off">' + (point ? pointLabel(point) : '') + '<h2>' + styledTitle + '</h2>' + (copy ? '<p class="ed-description">' + copy + '</p>' : '') + '</header>'
  }
  const editorial = {
    reviews(items) {
      const escape = value => String(value ?? '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]))
      const card = (item, index, clone = false) => '<div class="ed-review-slide' + (index === 0 && !clone ? ' is-current' : '') + '" data-review-slide-index="' + index + '"' + (clone ? ' data-review-clone' : '') + ' role="group" aria-roledescription="슬라이드" aria-label="' + (index + 1) + ' / ' + items.length + '"' + (clone || index !== 0 ? ' aria-hidden="true" inert' : '') + '><article class="ed-review-card"><div class="ed-review-thumb" role="button" tabindex="0" data-review-full="' + escape(item.src) + '" aria-label="' + escape(item.name) + ' 후기 카카오톡 원본 크게 보기"' + (item.highlight ? ' style="--hl-cy:' + ((item.highlight[1] + item.highlight[3] / 2) / 100) + '"' : '') + '><span class="ed-review-frame"><img src="' + escape(item.src) + '" alt="" loading="lazy" decoding="async">' + (item.highlight ? '<span class="ed-review-hl" aria-hidden="true" style="left:' + item.highlight[0] + '%;top:' + item.highlight[1] + '%;width:' + item.highlight[2] + '%;height:' + item.highlight[3] + '%"></span>' : '') + '</span></div><h3>' + escape(item.title) + '</h3></article></div>'
      return '<section class="rv5 ed-reviews" id="reviews" data-solo-reviews aria-labelledby="soloReviewTitle" aria-roledescription="캐러셀" data-svg-title="off"><div class="rv5-in"><header class="ed-review-heading"><h2 id="soloReviewTitle" class="rv5-title">고객님들이 직접 남긴<br><strong>축가 후기</strong></h2></header><div class="ed-review-viewport" tabindex="0" aria-label="후기 카드, 좌우 방향키로 넘기기"><div class="ed-review-track" style="--review-position:1">' + card(items.at(-1), items.length - 1, true) + items.map((item, index) => card(item, index)).join('') + card(items[0], 0, true) + '</div></div><nav class="ed-review-controls" aria-label="후기 넘기기"><button type="button" class="ed-review-arrow" data-ed-review-prev aria-label="이전 후기"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m14 5-7 7 7 7"/></svg></button><div class="ed-review-position"><div class="ed-review-dots">' + items.map((_, index) => '<button type="button" data-ed-review-dot="' + index + '" aria-label="' + (index + 1) + '번째 후기" aria-current="' + (index === 0) + '"><span></span></button>').join('') + '</div></div><button type="button" class="ed-review-arrow" data-ed-review-next aria-label="다음 후기"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m10 5 7 7-7 7"/></svg></button></nav></div><dialog class="solo-review-dialog"><button type="button" class="solo-dialog-close" data-solo-dialog-close aria-label="닫기">닫기</button></dialog></section>'
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
    price() {
      // 2026-11-19 지훈: 상세 후킹 — 녹음 2시간·같은 구성 기준 실제 판매가(솔로) 비교, 다른 녹음실은 이름 없이 A~D, 평균 점선 + 손글씨
      const others = [['A', 350000], ['B', 280000], ['C', 240000], ['D', 190000]]
      const ours = global.WistiaRecording ? global.WistiaRecording.startPrice() : 180000
      const avg = others.reduce((sum, item) => sum + item[1], 0) / others.length
      const max = Math.max(...others.map(item => item[1]), ours)
      const man = value => (Math.round(value / 1000) / 10) + '만'
      const bar = (name, value, us) => '<li class="ed-price-col' + (us ? ' is-us' : '') + '"><i style="height:' + (value / max * 100).toFixed(1) + '%"><b>' + man(value) + '</b></i><span>' + name + '</span></li>'
      return '<section class="ed-section ed-price" id="arcPrice" data-svg-title="off">' +
        // 2026-11-19 지훈 시안 5: 작은 첫 줄 + 큰 질문 한 줄(Pretendard), 그래프는 흰 카드, ‘가격 부담은 낮추고…’ 줄은 뺐다
        '<p class="ed-price-pre">결혼 준비도 비싼데,</p><h2 class="ed-price-hook">축가까지 비쌀 필요 있나요?</h2>' +
        '<p class="ed-price-lead">웨딩 비수기인 만큼,<br><strong>최저가는 위스티아가 잡겠습니다!</strong></p>' +
        '<div class="ed-price-chart"><span class="ed-price-tag">녹음 2시간 · 같은 구성 기준</span>' +
        '<div class="ed-price-plot" role="img" aria-label="녹음 2시간, 보컬 보정·믹싱·마스터링 포함 솔로 가격 비교: 다른 녹음실 ' + others.map(item => item[0] + ' ' + man(item[1])).join(', ') + ', 평균 ' + man(avg) + ', 위스티아 ' + man(ours) + '">' +
        '<ol aria-hidden="true">' + others.map(item => bar(item[0], item[1], false)).join('') + bar('WISTIA', ours, true) + '</ol>' +
        '<span class="ed-price-avg" aria-hidden="true" style="bottom:' + (avg / max * 100).toFixed(1) + '%"><em>평균 ' + man(avg) + '</em></span></div>' +
        '<p class="ed-price-note" aria-hidden="true">평균 ' + man(avg) + '원 → 위스티아 ' + man(ours) + '원</p><p class="ed-price-src">* 2026년 11월 가격조사 기준</p></div></section>'
    },
    recording() {
      return '<section class="ed-worries ed-section" id="arcWorries" data-svg-title="off">' + heading("BRIDE’S WORRY", '이런 고민, 있으셨죠?') +
        // 2026-11-16 지훈 시안 5-B: 검색창 자동완성 모양(로즈 테두리, 줄마다 ‘축가’ 굵게)
        '<div class="ed-worry-search"><div class="ed-worry-input" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></svg>축가 고민<i></i></div><ul><li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></svg><span><b>축가</b> 부탁할 사람이 마땅치 않아요</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M7 17 17 7M8 7h9v9"/></svg></li><li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></svg><span><b>축가</b> 노래를 잘 못해도 괜찮을까요?</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M7 17 17 7M8 7h9v9"/></svg></li><li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></svg><span><b>축가</b> 하객들 앞에서 너무 떨려요</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M7 17 17 7M8 7h9v9"/></svg></li><li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></svg><span><b>축가</b> 미리 녹음하면 티 나지 않을까요?</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M7 17 17 7M8 7h9v9"/></svg></li></ul></div></section>' +
        '<section class="arc-point arc-point-recording ed-section" id="arcRecording" data-svg-title="off">' +
        // 2026-11-18 지훈: POINT 01은 가사에 끊는 표시(디자인 1 + 문구 1) — 한 소절이 아니라 한 마디씩 끊어서 부른다
        '<div class="ed-madi"><header class="ed-heading" data-svg-title="off">' + pointLabel('POINT 01') + '<h2><span>노래 못하는데, 괜찮을까요?</span><b class="ed-title">한 마디씩 끊어서 불러요</b></h2></header>' +
        compTakes() +
        '</div></section>'
    },
    key() {
      return '<section class="arc-point arc-point-poster ed-section ed-key" id="arcKey" data-svg-title="off">' +
        // 2026-11-17 지훈: POINT 02는 0원 영수증 그림(시안 4) — 표·카드 대신 이미지처럼
        '<div class="hg-key"><header class="ed-heading" data-svg-title="off">' + pointLabel('POINT 02') + '<h2><span>음원 편집 · 키 조절</span><b class="ed-title">추가 비용 없어요</b></h2></header>' +
        '<div class="ed-rcpt-wrap"><div class="ed-rcpt" role="img" aria-label="영수증: 음원 편집 0원, 키 조절 0원, 합계 0원"><b class="ed-rcpt-brand">WISTIA</b><i></i><p><span>음원 편집</span><b>0원</b></p><p><span>키 조절</span><b>0원</b></p><i></i><p class="ed-rcpt-sum"><span>합계</span><b>0원</b></p></div><span class="ed-rcpt-stamp" aria-hidden="true">무료</span></div>' +
        '<p class="ed-rcpt-cap">원하는 길이로 자르고, 내 키에 맞춰 드려요</p></div>' +
        '</section>'
    },
    making(key) {
      // 2026-11-13 지훈: 녹음 메이킹은 예약 시간 +1시간, +80,000원 (문의양식 '녹음 메이킹 영상 추가' 스위치)
      return '<section class="arc-point arc-point-making ed-section" id="arcMaking" data-svg-title="off">' +
        // 2026-11-15 지훈: 남는 건 영상 — 1인 2컷·2인 4컷 + 인서트 컷, 축가 중 뒤에 띄우는 용도는 AR이 드러나서 쓰지 않음
        heading('RECORDING MAKING · POINT 05', '<span>둘이 함께 부른 그 순간</span>오래 꺼내 볼 수 있게') +
        // 2026-11-15 지훈: 유튜브 일시정지 화면 + 아래 큰 숫자 칸(1인 2컷 · 2인 4컷 · + 인서트 컷), 시안 7
        '<div class="ed-making-scene ed-yt"><figure class="ed-yt-player"><img src="assets/img/song-options/recording-making-portrait-v3.webp" alt="스튜디오에서 헤드폰을 쓰고 축가를 녹음하는 메이킹 영상 장면" width="1280" height="730" loading="lazy" decoding="async"><span class="ed-yt-ui" aria-hidden="true"><span class="ed-yt-bar"><i></i></span><span class="ed-yt-ctl"><span class="ed-yt-l"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 5h4v14H6zM14 5h4v14h-4z"/></svg><svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 5h2v14H6zM9.5 12 19 5v14z"/></svg><svg viewBox="0 0 24 24" fill="currentColor"><path d="M16 5h2v14h-2zM14.5 12 5 19V5z"/></svg><svg viewBox="0 0 24 24" fill="currentColor"><path d="M4 9h4l5-4v14l-5-4H4z"/><path d="M16 8.5a5 5 0 0 1 0 7" fill="none" stroke="currentColor" stroke-width="2"/></svg><b>0:15 / 3:38</b></span><span class="ed-yt-r"><svg viewBox="0 0 24 24" fill="currentColor"><rect x="3" y="5" width="18" height="14" rx="2" fill="none" stroke="currentColor" stroke-width="2"/><path d="M7 11h4M13 11h4M7 15h7" stroke="currentColor" stroke-width="2"/></svg><span class="ed-yt-gear"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M19.14 12.94c.04-.3.06-.61.06-.94s-.02-.64-.07-.94l2.03-1.58a.49.49 0 0 0 .12-.61l-1.92-3.32a.49.49 0 0 0-.59-.22l-2.39.96a7 7 0 0 0-1.62-.94l-.36-2.54a.48.48 0 0 0-.48-.41h-3.84a.48.48 0 0 0-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96a.49.49 0 0 0-.59.22L2.74 8.87a.48.48 0 0 0 .12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58a.49.49 0 0 0-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32a.48.48 0 0 0-.12-.61l-2.01-1.58zM12 15.6A3.6 3.6 0 1 1 12 8.4a3.6 3.6 0 0 1 0 7.2z"/></svg><em>HD</em></span><svg viewBox="0 0 24 24" fill="currentColor"><path d="M4 9V4h5M15 4h5v5M20 15v5h-5M9 20H4v-5" fill="none" stroke="currentColor" stroke-width="2"/></svg></span></span></span></figure>' +
        '<div class="ed-yt-nums"><div><b>2</b><span>컷</span><small>1인</small></div><div><b>4</b><span>컷</span><small>2인</small></div><div><b>+</b><small>인서트 컷</small></div></div></div>' +
        '<p class="ed-making-price"><strong>+80,000원</strong><span>녹음 메이킹 영상 추가</span></p></section>'
    },
    revision() {
      // 2026-11-16 지훈: 상세 마지막 POINT 06 무제한 수정 — 보통 vs 위스티아 비교 카드, 위스티아 칸에 ∞ (합본 시안 2, 도장 없음)
      return '<section class="arc-point ed-section ed-revision" id="arcRevision" data-svg-title="off">' +
        heading('REVISION · POINT 06', '<span>혹시 마음에 안 들면 어떡하지?</span>걱정하지 마세요') +
        '<div class="ed-rev">' +
        '<div class="ed-rev-card"><div class="ed-rev-cols"><div class="ed-rev-col"><small>보통</small><s>수정 1~2회</s></div><div class="ed-rev-col is-us"><svg class="ed-rev-inf" viewBox="0 0 24 12" aria-hidden="true"><path d="M12 6C10 3.3 8 2 6 2a4 4 0 0 0 0 8c2 0 4-1.3 6-4zm0 0c2 2.7 4 4 6 4a4 4 0 0 0 0-8c-2 0-4 1.3-6 4z"/></svg><b>무제한 수정</b></div></div><p>마음에 드실 때까지 고쳐 드려요</p></div></div></section>'
    },
    tuningHeader() {
      return heading('VOCAL TUNING · POINT 03', '<span>음정·박자가 흔들려도</span>자연스럽게 다듬어 드려요')
    },
    ratioHeader() {
      return heading('LIVE &amp; AR MIX · POINT 04', '<span>비율 고민하지 마세요!</span><b class="ed-title">30% 50% 70% 100% 비율 모두 다 드립니다!</b>', '그날 컨디션에 맞게 골라 쓰세요 :)')
    },
    preparation() {
      return '<section data-svg-title="off" class="package-notices ed-preparation"><header class="ed-preparation-heading"><p>떨림은 덜고, 진심은 그대로</p><h2><span>위스티아에서</span><strong>함께 준비해요</strong></h2><p>내게 맞는 비율로<br>무대에 서세요</p></header><ol class="ed-preparation-list">' +
        [['구간별 녹음과 1:1 디렉팅', '처음부터 끝까지 한 번에 부르지 않아도 괜찮아요'], ['음원 작업은 전부 포함', '보컬 튜닝, 전문 믹싱, 마스터링까지 모두 들어 있어요'], ['여유로운 녹음 시간', '2시간 넉넉하게, 필요하면 1시간 더 추가해요']].map(([title, copy], index) => '<li><span class="ed-preparation-number" aria-hidden="true">0' + (index + 1) + '</span><h3>' + title + '</h3></li>').join('') + '</ol></section>'
    },
    engineer() {
      return '<section class="ed-section ed-engineer" data-svg-title="off">' +
        '<div class="ed-broadcast-logo"><img src="assets/img/ar-detail/broadcast-singagain-on-light.webp" alt="싱어게인2" width="1600" height="533" loading="lazy" decoding="async"></div>' +
        heading('SOUND', '같은 소스여도, <b class="ed-title">사운드 완성도는 달라집니다</b>') +
        '<p class="ed-description"><strong>〈싱어게인2〉 방송 음악 작업 참여 엔지니어가</strong><br>음정·박자 보정은 타입과 옵션에 맞추고<br>전문 믹싱·마스터링으로 마무리합니다</p></section>'
    }
  }
  if (typeof module === 'object' && module.exports) module.exports = editorial
  global.WistiaEditorial = editorial
})(typeof window === 'object' ? window : globalThis)
