/* 2026-11-21 지훈 움직임 시안 1~4: 섹션이 화면에 들어올 때 한 번만 움직임
   1 가격 막대 차례로 올라옴 · 2 고민 말풍선 입력중… 후 톡톡 · 3 가사 디렉팅 칩 순서대로 · 4 영수증 출력 + 무료 도장
   2026-11-26 지훈: 더 빨리 — 화면에 조금만 보여도 시작, 시간은 약 절반
   움직임 줄이기를 켠 기기에서는 아무것도 하지 않는다 (CSS도 html.sm-ready일 때만 숨김) */
(() => {
  if (!('IntersectionObserver' in window)) return
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return
  document.documentElement.classList.add('sm-ready')

  const play = {
    price(root) {
      root.querySelectorAll('.ed-price-col').forEach((col, i) => col.style.setProperty('--sm-d', (i * 0.12).toFixed(2) + 's'))
    },
    worries(root) {
      const bubbles = [...root.querySelectorAll('.ed-bubble')]
      let t = 80
      bubbles.forEach(bubble => {
        // 자리는 미리 잡아 두고(아래 내용이 밀리지 않게) 같은 자리에 입력중… 말풍선을 띄운다
        const typing = document.createElement('span')
        typing.className = 'sm-typing'
        typing.setAttribute('aria-hidden', 'true')
        typing.innerHTML = '<i></i><i></i><i></i>'
        setTimeout(() => { bubble.append(typing) }, t)
        setTimeout(() => { typing.remove(); bubble.classList.add('sm-show') }, t + 380)
        t += 500
      })
    },
    comp(root) {
      let d = 0.15
      root.querySelectorAll('.ed-comp-part').forEach(part => {
        part.querySelectorAll('.ed-comp-talk span').forEach(span => { span.style.setProperty('--sm-d', d.toFixed(2) + 's'); d += 0.25 })
        d += 0.12
      })
      root.querySelectorAll('.ed-comp-join, .ed-comp-final').forEach(el => { el.style.setProperty('--sm-d', d.toFixed(2) + 's'); d += 0.2 })
    },
    receipt() {}
  }
  const targets = [
    ['.ed-price-chart', 'price'],
    ['.ed-worry-chat', 'worries'],
    ['.ed-comp', 'comp'],
    ['.ed-rcpt-wrap', 'receipt']
  ]
  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    if (!entry.isIntersecting) return
    const el = entry.target
    observer.unobserve(el)
    play[el.dataset.sm](el)
    requestAnimationFrame(() => el.classList.add('sm-in'))
  }), { threshold: 0.12, rootMargin: '0px 0px -6% 0px' })

  const scan = () => targets.forEach(([selector, kind]) => document.querySelectorAll(selector).forEach(el => {
    if (el.dataset.sm) return
    el.dataset.sm = kind
    observer.observe(el)
  }))
  const start = () => {
    scan()
    const app = document.getElementById('app')
    if (app) new MutationObserver(scan).observe(app, { childList: true, subtree: true })
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start)
  else start()
})()
