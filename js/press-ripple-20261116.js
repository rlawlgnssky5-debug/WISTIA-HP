/* 2026-11-16 지훈: 모든 버튼 누르는 느낌 — 시안 8 (누른 자리에서 물결 + 아이폰처럼 살짝 작아졌다 부드럽게 돌아옴)
   - 대상: button, 버튼 역할 요소, 버튼처럼 생긴 링크(class에 btn/cta/button/dock-row/offer)
   - transform 대신 `scale` 속성을 써서 기존 transform(가운데 정렬 등)과 겹치지 않게
   - 물결은 버튼 안에 넣는 별도 레이어(overflow hidden)라 버튼 자체의 overflow는 건드리지 않음 */
(function () {
  if (window.__wistiaPress) return;
  window.__wistiaPress = true;
  var SEL = 'button, [role="button"], input[type="submit"], input[type="button"], a[class*="btn"], a[class*="cta"], a[class*="button"], .home-dock-row > a, .home-offer a';
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var css = document.createElement('style');
  css.textContent =
    '.wpr-target{transition:scale .35s cubic-bezier(.2,1.25,.4,1)}' +
    '.wpr-target.wpr-down{scale:.96;transition:scale .12s ease}' +
    '.wpr-layer{position:absolute;inset:0;border-radius:inherit;overflow:hidden;pointer-events:none;z-index:0}' +
    '.wpr-dot{position:absolute;border-radius:50%;transform:scale(0);opacity:1;animation:wpr-rip .55s ease-out forwards}' +
    '@keyframes wpr-rip{to{transform:scale(1);opacity:0}}';
  document.head.appendChild(css);

  function isDark(el) {
    var m = getComputedStyle(el).backgroundColor.match(/\d+(\.\d+)?/g);
    if (!m || (m[3] !== undefined && Number(m[3]) < 0.3)) return false;
    return (0.299 * m[0] + 0.587 * m[1] + 0.114 * m[2]) < 150;
  }
  function ripple(el, x, y) {
    if (reduce) return;
    if (getComputedStyle(el).position === 'static') el.style.position = 'relative';
    var layer = el.querySelector(':scope > .wpr-layer');
    if (!layer) { layer = document.createElement('span'); layer.className = 'wpr-layer'; layer.setAttribute('aria-hidden', 'true'); el.appendChild(layer); }
    var r = el.getBoundingClientRect(), s = Math.max(r.width, r.height) * 2.2, dot = document.createElement('span');
    dot.className = 'wpr-dot';
    dot.style.cssText = 'width:' + s + 'px;height:' + s + 'px;left:' + ((x == null ? r.width / 2 : x - r.left) - s / 2) + 'px;top:' + ((y == null ? r.height / 2 : y - r.top) - s / 2) + 'px;background:' + (isDark(el) ? 'rgba(255,255,255,.32)' : 'rgba(226,103,127,.2)');
    layer.appendChild(dot);
    setTimeout(function () { dot.remove(); }, 600);
  }
  var current = null;
  function up() { if (current) { current.classList.remove('wpr-down'); current = null; } }
  document.addEventListener('pointerdown', function (e) {
    if (e.button && e.button !== 0) return;
    var el = e.target.closest && e.target.closest(SEL);
    if (!el || el.disabled || el.getAttribute('aria-disabled') === 'true') return;
    if (el.tagName === 'INPUT') { el.classList.add('wpr-target', 'wpr-down'); current = el; return; }
    el.classList.add('wpr-target');
    if (!reduce) el.classList.add('wpr-down');
    current = el;
    ripple(el, e.clientX, e.clientY);
  }, { passive: true });
  ['pointerup', 'pointercancel', 'dragstart'].forEach(function (t) { document.addEventListener(t, up, { passive: true }); });
  window.addEventListener('blur', up);
  document.addEventListener('pointermove', function (e) {
    if (current && !current.contains(document.elementFromPoint(e.clientX, e.clientY))) up();
  }, { passive: true });
})();
