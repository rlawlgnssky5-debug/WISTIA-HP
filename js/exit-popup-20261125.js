/* 2026-11-25 지훈: 뒤로가기 누르면 한 번 더 붙잡는 '잠깐만요!' 팝업 — 이번 달 예약 혜택표(정가 → 첫 이용 → N월 최저가 보상 → 지금 예약하면,
   선택 할인 1·2개월 → 2개월 일찍 예약하면) + 할인가로 문의양식 작성하기 + 그냥 나갈게요(카톡 채널 버튼은 지훈이 빼라고 함)
   홈(셀프 축가 AR)·/proposal(프로포즈 필름)에서만, 한 방문에 한 번, 화면을 한 번이라도 만진 사람만(크롬도 그렇게 막는다), 자동화 브라우저 제외
   금액은 WistiaRecording.quote 그대로 — 지어내지 않는다, 달 이름도 자동 */
(() => {
  const SHOWN = 'wistia_exit_popup_shown'
  const PAGES = ['/', '/proposal']
  const path = () => location.pathname.replace(/\/+$/, '') || '/'
  const shown = () => { try { return sessionStorage.getItem(SHOWN) === '1' } catch { return true } }
  const markShown = () => { try { sessionStorage.setItem(SHOWN, '1') } catch {} }
  const won = n => Number(n).toLocaleString('ko-KR') + '원'
  let trapPath = ''

  function benefits(proposal) {
    const rec = window.WistiaRecording, pkg = window.WistiaPackages
    if (!rec || !pkg) return null
    const v = { product: proposal ? 'proposal' : '', people: '0', recordingMinutes: '120', firstUse: '1', bookingDate: '' }
    const now = rec.quote(v)
    const far = rec.quote({ ...v, bookingDate: pkg.addMonths(pkg.today(), 2) })
    const near = rec.quote({ ...v, bookingDate: pkg.addMonths(pkg.today(), 1) })
    const name = d => d.key === 'monthly' ? d.label.replace(/\s*이벤트$/, '') : d.key === 'yearEnd' ? '연말 기념 할인' : d.label
    return {
      title: rec.eventMonth() + ' ' + (proposal ? '프로포즈 필름' : '셀프 축가 AR') + ' 혜택',
      list: now.list, rows: now.discounts.map(d => [name(d), d.amount]), total: now.total,
      advance: [['1개월 일찍 예약', near.advance?.amount || 0], ['2개월 일찍 예약', far.advance?.amount || 0]].filter(r => r[1]),
      best: far.total
    }
  }
  function inquiryHref(proposal) {
    if (proposal) return '/event/solo?product=proposal'
    const dock = document.querySelector('[data-dock-href]')
    return dock?.dataset.dockHref || '/event/solo'
  }
  function go(href) {
    history.pushState({ ...history.state, wistiaDepth: (history.state?.wistiaDepth || 0) + 1 }, '', href)
    dispatchEvent(new PopStateEvent('popstate'))
  }
  function open() {
    const proposal = path() === '/proposal', b = benefits(proposal)
    if (!b || document.getElementById('exitPopup')) return false
    const row = (label, amount, cls) => '<div class="xp-row' + (cls ? ' ' + cls : '') + '"><span>' + label + '</span>' + (cls === 'is-list' ? '<s>' + won(amount) + '</s>' : '<b>−' + won(amount) + '</b>') + '</div>'
    const dialog = document.createElement('dialog')
    dialog.id = 'exitPopup'
    dialog.className = 'exit-popup'
    dialog.setAttribute('aria-labelledby', 'exitPopupTitle')
    dialog.innerHTML = '<div class="xp-top" tabindex="-1" autofocus><h2 id="exitPopupTitle">잠깐만요!</h2><p class="xp-sub">지금 예약하면 받는 혜택이에요</p>' +
      '<div class="xp-box"><p class="xp-cap">' + b.title + '</p>' + row('정가', b.list, 'is-list') + b.rows.map(r => row(r[0], r[1])).join('') +
      '<div class="xp-total"><span>지금 예약하면</span><b>' + won(b.total) + '</b></div>' +
      (b.advance.length ? '<div class="xp-opt"><p class="xp-cap is-muted">선택 할인 · 사전 예약</p>' + b.advance.map(r => row(r[0], r[1])).join('') + '</div>' +
      '<div class="xp-total is-best"><span>2개월 일찍 예약하면</span><b>' + won(b.best) + '</b></div>' : '') + '</div></div>' +
      '<div class="xp-actions"><button type="button" class="xp-form" data-xp="form">할인가로 문의양식 작성하기</button>' +
      '<button type="button" class="xp-leave" data-xp="leave">그냥 나갈게요</button></div>' +
      '<button type="button" class="xp-x" data-xp="stay" aria-label="닫기"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg></button>'
    document.body.append(dialog)
    const close = () => { dialog.close(); dialog.remove(); document.body.classList.remove('xp-open') }
    dialog.addEventListener('click', event => {
      const act = event.target === dialog ? 'stay' : event.target.closest('[data-xp]')?.dataset.xp
      if (!act) return
      close()
      if (act === 'form') go(inquiryHref(proposal))
      else if (act === 'leave') history.back()
    })
    dialog.addEventListener('cancel', event => { event.preventDefault(); close() })
    document.body.classList.add('xp-open')
    dialog.showModal()
    return true
  }
  // 손님이 화면을 만지면 지금 주소를 한 칸 더 쌓아 두고, 뒤로가기로 그 칸이 빠질 때 팝업을 띄운다(페이지는 그대로)
  function arm() {
    if (trapPath || shown() || navigator.webdriver || !PAGES.includes(path())) return
    trapPath = path()
    history.pushState({ ...history.state, wistiaExitTrap: trapPath }, '', location.href)
  }
  addEventListener('popstate', event => {
    if (!trapPath) return
    if (path() !== trapPath || history.state?.wistiaExitTrap) { if (path() !== trapPath) trapPath = ''; return }
    trapPath = ''
    if (shown() || document.querySelector('dialog[open]')) return
    event.stopImmediatePropagation()
    if (open()) markShown()
  }, true)
  // 페이지 안 이동으로 다른 화면에 가면 그 칸은 버린다, 프로포즈로 오면 거기서 다시 준비
  const watch = () => { if (trapPath && path() !== trapPath) trapPath = '' }
  for (const type of ['pointerdown', 'keydown', 'scroll', 'touchstart']) addEventListener(type, event => { if (event.isTrusted) { watch(); arm() } }, { passive: true, capture: true })
})()
