// 2026-11-19 지훈: 사장·AI 도구 방문을 광고 숫자에서 빼기
// ?test=1 → 이 브라우저를 테스트 기기로 1년 기억, ?test=0 → 해제. 헤드리스(webdriver)도 테스트로 봄.
// 테스트면 메타 픽셀(fbq)을 빈 함수로 막고, GA4는 analytics.js가, CAPI는 서버가 이 표시를 보고 보내지 않는다.
(() => {
  const KEY = "wistia_test";
  let stored = false;
  try {
    const url = new URL(location.href);
    const flag = url.searchParams.get("test");
    if (flag === "1") {
      try { localStorage.setItem(KEY, "1"); } catch {}
      document.cookie = KEY + "=1; Max-Age=31536000; Path=/; SameSite=Lax" + (location.protocol === "https:" ? "; Secure" : "");
    } else if (flag === "0") {
      try { localStorage.removeItem(KEY); } catch {}
      document.cookie = KEY + "=; Max-Age=0; Path=/; SameSite=Lax" + (location.protocol === "https:" ? "; Secure" : "");
    }
    if (flag === "1" || flag === "0") {
      url.searchParams.delete("test");
      history.replaceState(history.state, "", url.pathname + url.search + url.hash);
    }
    try { stored = localStorage.getItem(KEY) === "1"; } catch {}
    if (!stored) stored = /(?:^|;\s*)wistia_test=1(?:;|$)/.test(document.cookie);
  } catch {}
  const bot = navigator.webdriver === true;
  const test = stored || bot;
  window.wistiaTestMode = test;
  if (!test) return;
  // 픽셀 스니펫은 window.fbq가 있으면 fbevents.js를 불러오지 않는다 → init·PageView·커스텀 이벤트 모두 안 나감
  const noop = function () {};
  noop.queue = []; noop.loaded = true; noop.version = "2.0"; noop.push = noop; noop.callMethod = null;
  window.fbq = window._fbq = noop;
  if (!stored) return; // 자동 도구에는 표시를 띄우지 않음
  const badge = () => {
    if (document.getElementById("wistiaTestBadge")) return;
    const el = document.createElement("div");
    el.id = "wistiaTestBadge";
    el.textContent = "TEST";
    el.setAttribute("aria-hidden", "true");
    el.style.cssText = "position:fixed;left:6px;top:6px;z-index:2147483647;padding:2px 6px;border-radius:4px;background:#111;color:#fff;font:700 10px/1.4 system-ui,sans-serif;letter-spacing:.08em;opacity:.7;pointer-events:none";
    document.body.appendChild(el);
  };
  if (document.body) badge(); else document.addEventListener("DOMContentLoaded", badge);
})();
