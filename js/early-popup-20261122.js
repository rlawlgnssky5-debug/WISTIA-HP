/* 2026-11-22 지훈: 처음 들어온 손님에게 사전 예약 할인 1:1 포스터 팝업 (시안 5 뱃지형)
   홈(셀프 축가 AR)·프로포즈 상세에서만, 이동 버튼 없음(지훈: 바로 넘어가면 이상함) — 닫기·X·바깥·Esc는 이번 방문 동안 그 페이지에서만, ‘오늘 하루 보지 않기’는 24시간 숨김. 자동화 브라우저(navigator.webdriver)에서는 띄우지 않는다 */
(() => {
  const KEY = 'wistia_early_popup_until'
  const PAGES = ['/', '/proposal']
  const path = () => location.pathname.replace(/\/+$/, '') || '/'
  const hidden = () => { try { return Number(localStorage.getItem(KEY) || 0) > Date.now() || sessionStorage.getItem(KEY + ':' + path()) === '1' } catch { return false } }
  const sessionSnooze = () => { try { sessionStorage.setItem(KEY + ':' + path(), '1') } catch {} }
  const snooze = () => { try { localStorage.setItem(KEY, String(Date.now() + 24 * 3600 * 1000)) } catch {} }
  const cal = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" aria-hidden="true"><rect x="3.5" y="5" width="17" height="15.5" rx="2.5"/><path d="M3.5 10h17M8 3v4M16 3v4"/></svg>'
  const badge = (months, man, primary) => '<div class="ep-badge' + (primary ? ' is-primary' : '') + '"><span>' + months + '개월 일찍</span><b>' + man + '만원</b><span>할인</span></div>'
  function open() {
    if (document.getElementById('earlyPopup')) return
    const dialog = document.createElement('dialog')
    dialog.id = 'earlyPopup'
    dialog.className = 'early-popup'
    dialog.setAttribute('aria-labelledby', 'earlyPopupTitle')
    dialog.innerHTML = '<div class="ep-poster" tabindex="-1" autofocus><p class="ep-pill">' + cal + '사전 예약 할인</p>' +
      '<h2 id="earlyPopupTitle">일찍 예약할수록<br><em>할인!</em></h2>' +
      '<div class="ep-badges">' + badge(1, 1, false) + badge(2, 2, true) + '</div>' +
      '<p class="ep-note">방문일 기준 · 문의양식에서 자동 적용</p></div>' +
      '<div class="ep-actions"><button type="button" class="ep-cta" data-ep-close>닫기</button>' +
      '<button type="button" class="ep-close" data-ep-day>오늘 하루 보지 않기</button></div>' +
      '<button type="button" class="ep-x" data-ep-close aria-label="닫기"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg></button>'
    document.body.append(dialog)
    const close = day => { if (day) snooze(); else sessionSnooze(); dialog.close(); dialog.remove(); document.body.classList.remove('ep-open') }
    dialog.addEventListener('click', event => {
      if (event.target.closest('[data-ep-day]')) close(true)
      else if (event.target === dialog || event.target.closest('[data-ep-close]')) close(false)
    })
    dialog.addEventListener('cancel', event => { event.preventDefault(); close(false) })
    document.body.classList.add('ep-open')
    dialog.showModal()
  }
  function maybe() {
    if (navigator.webdriver || hidden() || !PAGES.includes(path())) return
    if (document.querySelector('dialog[open]')) return
    setTimeout(() => { if (!hidden() && PAGES.includes(path())) open() }, 900)
  }
  // 페이지 안에서 홈 ↔ 프로포즈로 넘어가도(SPA) 그 페이지 처음이면 띄운다, 닫기는 페이지별로 기억
  let lastPath = ''
  const check = () => { const now = path(); if (now === lastPath) return; lastPath = now; maybe() }
  const start = () => { check(); const app = document.getElementById('app'); if (app) new MutationObserver(check).observe(app, { childList: true }); addEventListener('popstate', check) }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start)
  else start()
})()
