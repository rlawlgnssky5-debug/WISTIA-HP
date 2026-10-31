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
      window.fbq("trackCustom", name, { ...payload, visitor_id: window.wistiaVisitorId() });
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

  const funnelEvents = {
    inquiry_open: ["InquiryOpen", ["button_location", "button_label"]],
    inquiry_step_view: ["InquiryStepView", ["step", "step_total"]],
    form_start: ["FormStart", ["step"]],
    form_field_complete: ["FormFieldComplete", ["field_name", "step"]],
    form_next: ["FormNext", ["from_step"]],
    form_prev: ["FormPrev", ["from_step"]],
    form_validation_error: ["FormValidationError", ["field_name", "step"]],
    form_abandon: ["FormAbandon", ["last_step", "reason"]],
    inquiry_submit_popup: ["InquirySubmitPopup", ["step"]]
  };

  function trackFunnel(name, params = {}) {
    try {
      const definition = funnelEvents[name];
      if (localPreview || !definition) return false;
      const pagePath = typeof params.page_path === "string" && params.page_path.startsWith("/") ? params.page_path.split(/[?#]/)[0] : currentPagePath();
      const payload = { page_path: pagePath };
      for (const key of definition[1]) {
        const value = params[key];
        if (["step", "step_total", "from_step", "last_step"].includes(key)) {
          if (!Number.isInteger(value) || value < 1 || value > 100) return false;
        } else if (key === "reason") {
          if (!["close", "pagehide", "hidden"].includes(value)) return false;
        } else if (key === "field_name") {
          if (typeof value !== "string" || !/^[a-zA-Z][a-zA-Z0-9_-]{0,63}$/.test(value)) return false;
        } else if (typeof value !== "string" || value.length > 40) return false;
        payload[key] = value;
      }
      if (["form_field_complete", "form_next", "inquiry_step_view"].includes(name)) {
        const field = params.field_name;
        const value = window.wistiaFieldValue?.(field, params.field_value);
        if (value !== undefined) {
          payload.field_name = field;
          payload.field_value = value;
        }
      }
      // The server copy of InquirySubmit must go out even when the browser pixel is blocked
      const submitEventId = name === "inquiry_submit_popup" ? sendServerEvent("inquiry_submit") : "";
      const openEventId = name === "inquiry_open" ? sendServerEvent("inquiry_open") : "";
      if (typeof window.fbq !== "function") return false;
      if (openEventId) window.fbq("trackCustom", definition[0], { ...payload, visitor_id: window.wistiaVisitorId() }, { eventID: openEventId });
      else window.fbq("trackCustom", definition[0], { ...payload, visitor_id: window.wistiaVisitorId() });
      if (name === "inquiry_submit_popup") {
        window.fbq("trackCustom", "InquirySubmit", { page_path: pagePath }, { eventID: submitEventId });
      }
      return true;
    } catch { return false; }
  }

  function trackPageView() {
    if (localPreview || typeof window.fbq !== "function") return false;
    const url = location.pathname + location.search + (location.hash || "");
    if (url === lastPageViewUrl) return false;
    try {
      window.fbq("track", "PageView", { visitor_id: window.wistiaVisitorId() });
      scrollDepthSent.clear();
      timeOnPageSent.clear();
      viewPriceSent.clear();
      lastPageViewUrl = url;
      lastViewContentKey = "";
      return true;
    } catch {
      // Tracking failures must not interrupt rendering or consume the retry.
      return false;
    }
  }

  function trackViewContent(payload) {
    if (localPreview || typeof window.fbq !== "function") return false;
    if (!payload || !Array.isArray(payload.content_ids) || !payload.content_ids.length || !Number.isFinite(payload.value)) return false;
    const key = currentPagePath() + ":" + payload.content_ids.join(",");
    if (key === lastViewContentKey) return false;
    try {
      window.fbq("track", "ViewContent", { ...payload, visitor_id: window.wistiaVisitorId() });
      lastViewContentKey = key;
      return true;
    } catch {
      return false;
    }
  }

  // Sends only the event name, a shared event_id and the page URL; the server adds IP, user agent and _fbp/_fbc
  // Keep the landing fbclid exactly as written in the URL (no decoding) for when the pixel never set _fbc
  const fbclidKey = "wistia:fbclid:v1";
  try {
    const raw = /[?&]fbclid=([^&#]*)/.exec(location.search)?.[1];
    if (raw) localStorage.setItem(fbclidKey, JSON.stringify({ fbclid: raw, at: Date.now() }));
  } catch {}
  function rawCookie(name) {
    const part = String(document.cookie || "").split(";").map(item => item.trim()).find(item => item.startsWith(name + "="));
    return part ? part.slice(name.length + 1) : undefined;
  }
  function clickIds() {
    const ids = { fbp: rawCookie("_fbp"), fbc: rawCookie("_fbc") };
    try {
      const saved = JSON.parse(localStorage.getItem(fbclidKey) || "null");
      if (saved && typeof saved.fbclid === "string" && Date.now() - saved.at < 90 * 864e5) { ids.fbclid = saved.fbclid; ids.fbclid_at = saved.at; }
    } catch {}
    return ids;
  }

  function sendServerEvent(kind, eventId = crypto.randomUUID()) {
    // Strip query and hash so nothing typed into a URL reaches Meta; keep only a Meta test code
    const sourceUrl = new URL(location.href);
    const testCode = sourceUrl.searchParams.get("meta_test_code");
    sourceUrl.search = "";
    sourceUrl.hash = "";
    if (testCode && /^TEST[A-Z0-9]{4,32}$/.test(testCode)) sourceUrl.searchParams.set("meta_test_code", testCode);
    fetch("/api/meta-contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "same-origin",
      keepalive: true,
      body: JSON.stringify({ event_id: eventId, event_source_url: sourceUrl.href, kind, ...clickIds() })
    }).catch(() => {});
    return eventId;
  }

  function trackCouponClaim(type) {
    if (localPreview || !["first_visit", "limited"].includes(type)) return false;
    const eventId = crypto.randomUUID();
    if (typeof window.fbq === "function") {
      try {
        window.fbq("trackCustom", "CouponClaim", { coupon_type: type, visitor_id: window.wistiaVisitorId() }, { eventID: eventId });
      } catch {
        // A blocked browser pixel must not prevent the server event.
      }
    }
    sendServerEvent(type === "limited" ? "coupon_claim_limited" : "coupon_claim_first_visit", eventId);
    return true;
  }

  function trackContact() {
    if (localPreview) return false;
    const eventId = crypto.randomUUID();
    if (typeof window.fbq === "function") {
      try {
        window.fbq("track", "Contact", { visitor_id: window.wistiaVisitorId() }, { eventID: eventId });
        window.fbq("trackCustom", "KakaoTalkClick", { visitor_id: window.wistiaVisitorId() }, { eventID: eventId });
      } catch {
        // A blocked browser pixel must not prevent the server event.
      }
    }
    sendServerEvent("contact", eventId);
    return true;
  }

  function trackFloatingKakaoClick() {
    if (localPreview || typeof window.fbq !== "function") return false;
    try {
      window.fbq("trackCustom", "FloatingKakaoClick", { page_path: currentPagePath(), visitor_id: window.wistiaVisitorId() });
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
    if (link.matches(".contact-ok-action")) trackContact();
    else if (link.id === "floatingKakaoChat") trackFloatingKakaoClick();
  }, true);

  function trackSectionView(payload) {
    if (localPreview || typeof window.fbq !== "function") return false;
    window.fbq("trackCustom", "SectionView", { ...payload, visitor_id: window.wistiaVisitorId() });
    return true;
  }

  window.wistiaMeta = Object.assign({}, window.wistiaMeta || {}, { trackCouponClaim, trackSectionView, trackFunnel, trackPageView, trackViewContent, trackContact, trackFloatingKakaoClick, trackScrollDepth, trackTimeOnPage, trackViewPrice });
})();
