(() => {
  const localPreview = location.protocol === "file:" || ["localhost", "127.0.0.1", "[::1]"].includes(location.hostname);
  let lastPageViewUrl = "";
  let lastViewContentKey = "";
  const scrollDepthSent = new Set();
  const timeOnPageSent = new Set();
  const viewPriceSent = new Set();

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

  function trackScrollDepth(percent, pagePath = location.hash || "#/") {
    if (![25, 50, 75, 100].includes(percent) || typeof pagePath !== "string" || !pagePath.startsWith("#/")) return false;
    return trackCustomOnce("ScrollDepth", `${pagePath}:${percent}`, { percent, page_path: pagePath }, scrollDepthSent);
  }

  function trackTimeOnPage(seconds, pagePath = location.hash || "#/") {
    if (![30, 60, 120].includes(seconds) || typeof pagePath !== "string" || !pagePath.startsWith("#/")) return false;
    return trackCustomOnce("TimeOnPage", `${pagePath}:${seconds}`, { seconds, page_path: pagePath }, timeOnPageSent);
  }

  function trackViewPrice(payload, pagePath = location.hash || "#/") {
    if (!payload || !Array.isArray(payload.content_ids) || !payload.content_ids.length || !Number.isFinite(payload.value) || payload.currency !== "KRW") return false;
    if (typeof pagePath !== "string" || !pagePath.startsWith("#/")) return false;
    return trackCustomOnce("ViewPrice", pagePath, payload, viewPriceSent);
  }

  function trackPageView() {
    if (localPreview || typeof window.fbq !== "function") return false;
    const url = location.pathname + location.search + (location.hash || "#/");
    if (url === lastPageViewUrl) return false;
    lastPageViewUrl = url;
    lastViewContentKey = "";
    window.fbq("track", "PageView");
    return true;
  }

  function trackViewContent(payload) {
    if (localPreview || typeof window.fbq !== "function") return false;
    if (!payload || !Array.isArray(payload.content_ids) || !payload.content_ids.length || !Number.isFinite(payload.value)) return false;
    const key = (location.hash || "#/") + ":" + payload.content_ids.join(",");
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

  document.addEventListener("click", event => {
    const link = event.target.closest?.("a[href]");
    if (!link) return;
    const url = new URL(link.href, location.href);
    if (url.hostname === "pf.kakao.com" && url.pathname.endsWith("/chat")) trackContact();
  }, true);

  window.wistiaMeta = Object.assign({}, window.wistiaMeta || {}, { trackPageView, trackViewContent, trackContact, trackScrollDepth, trackTimeOnPage, trackViewPrice });
})();
