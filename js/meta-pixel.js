(() => {
  const localPreview = location.protocol === "file:" || ["localhost", "127.0.0.1", "[::1]"].includes(location.hostname);
  let lastPageViewUrl = "";
  let lastViewContentKey = "";
  const scrollDepthSent = new Set();
  const timeOnPageSent = new Set();
  const viewPriceSent = new Set();

  function currentPagePath() {
    return (location.pathname.replace(/\/$/, "") || "/");
  }

  function normalizePagePath(pagePath) {
    if (typeof pagePath !== "string" || !pagePath) return currentPagePath();
    if (pagePath.startsWith("#/")) return pagePath.slice(1).replace(/\/$/, "") || "/";
    return pagePath.replace(/\/$/, "") || "/";
  }

  function trackCustomOnce(name, key, payload, sent) {
    if (localPreview || typeof window.fbq !== "function" || sent.has(key)) return false;
    try {
      window.fbq("trackCustom", name, payload);
      sent.add(key);
      return true;
    } catch {
      return false;
    }
  }

  function trackScrollDepth(percent, pagePath) {
    const path = normalizePagePath(pagePath);
    if (![25, 50, 75, 100].includes(percent) || !path.startsWith("/")) return false;
    return trackCustomOnce("ScrollDepth", `${path}:${percent}`, { percent, page_path: path }, scrollDepthSent);
  }

  function trackTimeOnPage(seconds, pagePath) {
    const path = normalizePagePath(pagePath);
    if (![30, 60, 120].includes(seconds) || !path.startsWith("/")) return false;
    return trackCustomOnce("TimeOnPage", `${path}:${seconds}`, { seconds, page_path: path }, timeOnPageSent);
  }

  function trackViewPrice(payload, pagePath) {
    const path = normalizePagePath(pagePath);
    if (!payload || !Array.isArray(payload.content_ids) || !payload.content_ids.length || !Number.isFinite(payload.value) || payload.currency !== "KRW") return false;
    if (!path.startsWith("/")) return false;
    return trackCustomOnce("ViewPrice", path, payload, viewPriceSent);
  }

  function trackPageView() {
    if (localPreview || typeof window.fbq !== "function") return false;
    const url = location.pathname + location.search + (location.hash || "");
    if (url === lastPageViewUrl) return false;
    lastPageViewUrl = url;
    lastViewContentKey = "";
    window.fbq("track", "PageView");
    return true;
  }

  function trackViewContent(payload) {
    if (localPreview || typeof window.fbq !== "function") return false;
    if (!payload || !Array.isArray(payload.content_ids) || !payload.content_ids.length || !Number.isFinite(payload.value)) return false;
    const key = currentPagePath() + ":" + payload.content_ids.join(",");
    if (key === lastViewContentKey) return false;
    try {
      window.fbq("track", "ViewContent", payload);
      lastViewContentKey = key;
      return true;
    } catch {
      return false;
    }
  }

  function trackContact() {
    if (localPreview) return false;
    const eventId = crypto.randomUUID();
    if (typeof window.fbq === "function") {
      try {
        window.fbq("track", "Contact", {}, { eventID: eventId });
        window.fbq("trackCustom", "KakaoTalkClick", {}, { eventID: eventId });
      } catch {
        // A blocked browser pixel must not prevent the server event.
      }
    }
    fetch("/api/meta-contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "same-origin",
      keepalive: true,
      body: JSON.stringify({ event_id: eventId, event_source_url: location.href })
    }).catch(() => {});
    return true;
  }

  function trackFloatingKakaoClick() {
    if (localPreview || typeof window.fbq !== "function") return false;
    try {
      window.fbq("trackCustom", "FloatingKakaoClick", { page_path: currentPagePath() });
      return true;
    } catch {
      return false;
    }
  }

  document.addEventListener("click", event => {
    const link = event.target.closest?.("a[href]");
    if (!link) return;
    const url = new URL(link.href, location.href);
    if (url.hostname !== "pf.kakao.com" || !url.pathname.endsWith("/chat")) return;
    if (link.matches(".consult-copy-action")) trackContact();
    else if (link.id === "floatingKakaoChat") trackFloatingKakaoClick();
  }, true);

  window.wistiaMeta = Object.assign({}, window.wistiaMeta || {}, { trackPageView, trackViewContent, trackContact, trackFloatingKakaoClick, trackScrollDepth, trackTimeOnPage, trackViewPrice });
})();
