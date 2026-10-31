(() => {
  const measurementId = "G-5E0XX7SE8T";
  const localPreview = location.protocol === "file:" || ["localhost", "127.0.0.1", "[::1]"].includes(location.hostname);
  let lastPageUrl = "";
  let routeCleanup = null;
  let activePath = "";
  let lastPricePayload = null;
  const sentScroll = new Set();
  const sentTime = new Set();
  const sentPrice = new Set();
  const recentClicks = new Map();

  function currentPagePath() {
    return (location.pathname.replace(/\/$/, "") || "/");
  }

  if (!localPreview) {
    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
    window.gtag("js", new Date());
    window.gtag("config", measurementId, { send_page_view: false, visitor_id: window.wistiaVisitorId() });
    const script = document.createElement("script");
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
    document.head.appendChild(script);
  }

  function send(name, parameters = {}) {
    if (localPreview || typeof window.gtag !== "function") return false;
    window.gtag("event", name, { ...parameters, visitor_id: window.wistiaVisitorId(), send_to: measurementId });
    return true;
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
      return send(name, { ...payload, ...(name === "form_abandon" ? { transport_type: "beacon" } : {}) });
    } catch { return false; }
  }

  function trackPageView() {
    const url = location.href;
    if (url === lastPageUrl) return false;
    const previous = lastPageUrl || document.referrer || undefined;
    lastPageUrl = url;
    return send("page_view", { page_location: url, page_referrer: previous, page_title: document.title, page_path: currentPagePath() });
  }

  function trackKakaoClick() {
    return send("kakao_chat_click", { page_path: currentPagePath() });
  }

  function trackFloatingKakaoClick() {
    return send("floating_kakao_click", { page_path: currentPagePath() });
  }

  function trackSiteClick(action, targetPath = "") {
    if (!/^(navigation|price_link|service_link|menu|media_play|faq_open|review_next|review_previous)$/.test(action)) return false;
    const pagePath = currentPagePath();
    const key = `${pagePath}:${action}:${targetPath}`;
    const now = Date.now();
    if (now - (recentClicks.get(key) || 0) < 800) return false;
    recentClicks.set(key, now);
    return send("site_click", { action, page_path: pagePath, target_path: targetPath });
  }

  function internalPathFromUrl(url) {
    if (url.origin !== location.origin) return "";
    if (url.hash.startsWith("#/")) return url.hash.slice(1).replace(/\/$/, "") || "/";
    const path = url.pathname.replace(/\/$/, "") || "/";
    return path;
  }

  document.addEventListener("click", event => {
    const control = event.target.closest?.("a[href],button,summary");
    if (!control) return;
    if (control.matches("a[href]")) {
      const url = new URL(control.href, location.href);
      if (url.hostname === "pf.kakao.com" && url.pathname.endsWith("/chat")) {
        if ((control.matches(".consult-copy-action")||control.matches(".contact-ok-action"))) trackKakaoClick();
        else if (control.id === "floatingKakaoChat") trackFloatingKakaoClick();
        return;
      }
      const path = internalPathFromUrl(url);
      if (!path) return;
      const action = control.closest("#mainMenu") ? "menu" : control.matches("#floatingPrice,.solo-desktop-cta-price") || path.startsWith("/event/") ? "price_link" : path.startsWith("/detail/") ? "service_link" : "navigation";
      trackSiteClick(action, path);
    } else if (control.matches("#menuToggle")) {
      trackSiteClick("menu", control.getAttribute("aria-expanded") === "true" ? "close" : "open");
    } else if (control.matches("[data-ar-video-toggle],[data-inline-youtube],.bap-play,.wistia-ar__play,#soloRatioPlay")) {
      trackSiteClick("media_play");
    } else if (control.matches("[data-review-next],[data-solo-review-next]")) {
      trackSiteClick("review_next");
    } else if (control.matches("[data-review-prev]")) {
      trackSiteClick("review_previous");
    } else if (control.matches("summary") && control.closest(".faq-list") && !control.parentElement.open) {
      trackSiteClick("faq_open");
    }
  }, true);

  document.addEventListener("change", event => {
    const control = event.target;
    const fields = ["event", "option", "filmPeople", "filmUpgrade", "filmMaking", "filmFormat", "songOption", "baseProduct", "productSelect"];
    const field = fields.find(name => Object.hasOwn(control.dataset || {}, name));
    if (!field) return;
    const rawKey = control.dataset[field] || control.value || "";
    const optionKey = String(rawKey).slice(0, 60);
    if (!/^[a-zA-Z0-9_-]+$/.test(optionKey)) return;
    send("option_select", { page_path: currentPagePath(), option_type: field, option_key: optionKey, selected: control.checked ?? true });
  }, true);

  function startPageTracking(pagePath, pricePayload) {
    const normalized = (pagePath || currentPagePath()).replace(/\/$/, "") || "/";
    if (normalized === activePath) return;
    routeCleanup?.();
    activePath = normalized;
    sentScroll.clear();
    sentTime.clear();
    sentPrice.clear();
    lastPricePayload = pricePayload;
    trackPageView();
    const startedAt = Date.now();
    let maxScrollPercent = 0;
    const onScroll = () => {
      const height = Math.max(document.documentElement.scrollHeight, document.body.scrollHeight);
      const percent = height ? Math.min(100, Math.floor((window.scrollY + window.innerHeight) / height * 100)) : 0;
      maxScrollPercent = Math.max(maxScrollPercent, percent);
      for (const threshold of [25, 50, 75, 100]) {
        const key = `${normalized}:${threshold}`;
        if (percent >= threshold && !sentScroll.has(key) && send("scroll_depth", { percent: threshold, page_path: normalized })) sentScroll.add(key);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    const initialScroll = window.setTimeout(onScroll, 0);
    const timers = [30, 60, 120].map(seconds => window.setTimeout(() => {
      const key = `${normalized}:${seconds}`;
      if (!sentTime.has(key) && send("time_on_page", { seconds, page_path: normalized })) sentTime.add(key);
    }, seconds * 1000));
    const stopSections = window.wistiaTrackSections?.(normalized, send);
    let finished = false;
    routeCleanup = () => {
      if (finished) return;
      finished = true;
      stopSections?.();
      activePath = "";
      window.removeEventListener("scroll", onScroll);
      window.clearTimeout(initialScroll);
      timers.forEach(timer => window.clearTimeout(timer));
      const seconds = Math.floor((Date.now() - startedAt) / 1000);
      if (seconds > 0) send("page_dwell", { page_path: normalized, seconds, max_scroll_percent: maxScrollPercent, transport_type: "beacon" });
    };
  }

  window.addEventListener("pageshow", event => { if (event.persisted) startPageTracking(currentPagePath(), lastPricePayload); });
  window.addEventListener("pagehide", () => routeCleanup?.());

  // GA4 recorded no user_engagement, so send foreground time ourselves once per hide
  let foregroundSince = document.visibilityState === "hidden" ? 0 : Date.now();
  let foregroundMs = 0;
  let engagementSentForHide = false;
  function flushEngagement() {
    if (foregroundSince) { foregroundMs += Date.now() - foregroundSince; foregroundSince = 0; }
    if (engagementSentForHide) return;
    engagementSentForHide = true;
    const ms = Math.round(foregroundMs);
    if (ms <= 0) return;
    if (send("user_engagement", { engagement_time_msec: ms, page_path: currentPagePath(), transport_type: "beacon" })) foregroundMs = 0;
  }
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") flushEngagement();
    else { foregroundSince = Date.now(); engagementSentForHide = false; }
  });
  window.addEventListener("pagehide", flushEngagement);
  window.addEventListener("pageshow", () => { if (document.visibilityState !== "hidden") { foregroundSince = Date.now(); engagementSentForHide = false; } });
  // Called by the booking wizard each time a product's price is shown; once per product per page
  function trackViewPrice(payload) {
    const path = currentPagePath();
    if (!payload || !Array.isArray(payload.content_ids) || !payload.content_ids.length || !Number.isFinite(payload.value) || payload.currency !== "KRW") return false;
    const key = `${path}:${payload.content_ids[0]}`;
    if (sentPrice.has(key) || !send("view_price", { ...payload, page_path: path })) return false;
    sentPrice.add(key);
    return true;
  }

  // Coupon claim tap: only the coupon kind, nothing personal
  function trackCouponClaim(type) {
    if (!["first_visit", "limited"].includes(type)) return false;
    return send("coupon_claim", { coupon_type: type });
  }
  window.wistiaAnalytics = { trackViewPrice, trackCouponClaim, trackFunnel, trackPageView, trackKakaoClick, trackFloatingKakaoClick, trackSiteClick, startPageTracking };
})();
