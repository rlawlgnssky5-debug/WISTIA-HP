(() => {
  const measurementId = "G-5E0XX7SE8T";
  const localPreview = location.protocol === "file:" || ["localhost", "127.0.0.1", "[::1]"].includes(location.hostname);
  let lastPageUrl = "";
  let routeCleanup = null;
  let activePath = "";
  const sentScroll = new Set();
  const sentTime = new Set();
  const sentPrice = new Set();
  const recentClicks = new Map();

  if (!localPreview) {
    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
    window.gtag("js", new Date());
    window.gtag("config", measurementId, { send_page_view: false });
    const script = document.createElement("script");
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
    document.head.appendChild(script);
  }

  function send(name, parameters = {}) {
    if (localPreview || typeof window.gtag !== "function") return false;
    window.gtag("event", name, { ...parameters, send_to: measurementId });
    return true;
  }

  function trackPageView() {
    const url = location.href;
    if (url === lastPageUrl) return false;
    const previous = lastPageUrl || document.referrer || undefined;
    lastPageUrl = url;
    return send("page_view", { page_location: url, page_referrer: previous, page_title: document.title });
  }

  function trackKakaoClick() {
    return send("kakao_chat_click", { page_path: location.hash || "#/" });
  }

  function trackFloatingKakaoClick() {
    return send("floating_kakao_click", { page_path: location.hash || "#/" });
  }

  function trackSiteClick(action, targetPath = "") {
    if (!/^(navigation|price_link|service_link|menu|media_play|faq_open|review_next|review_previous)$/.test(action)) return false;
    const pagePath = location.hash || "#/";
    const key = `${pagePath}:${action}:${targetPath}`;
    const now = Date.now();
    if (now - (recentClicks.get(key) || 0) < 800) return false;
    recentClicks.set(key, now);
    return send("site_click", { action, page_path: pagePath, target_path: targetPath });
  }

  document.addEventListener("click", event => {
    const control = event.target.closest?.("a[href],button,summary");
    if (!control) return;
    if (control.matches("a[href]")) {
      const url = new URL(control.href, location.href);
      if (url.hostname === "pf.kakao.com" && url.pathname.endsWith("/chat")) {
        // Ad conversion and GA4 kakao_chat_click both belong to the consultation modal only.
        if (control.matches(".consult-copy-action")) trackKakaoClick();
        else if (control.id === "floatingKakaoChat") trackFloatingKakaoClick();
        return;
      }
      if (url.origin !== location.origin || !url.hash.startsWith("#/")) return;
      const action = control.closest("#mainMenu") ? "menu" : control.matches("#floatingPrice,.solo-desktop-cta-price") || url.hash.startsWith("#/event/") ? "price_link" : url.hash.startsWith("#/detail/") ? "service_link" : "navigation";
      trackSiteClick(action, url.hash);
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
    send("option_select", { page_path: location.hash || "#/", option_type: field, option_key: optionKey, selected: control.checked ?? true });
  }, true);

  function startPageTracking(pagePath, pricePayload) {
    if (pagePath === activePath) return;
    routeCleanup?.();
    activePath = pagePath;
    trackPageView();
    const startedAt = Date.now();
    let maxScrollPercent = 0;
    const onScroll = () => {
      const height = Math.max(document.documentElement.scrollHeight, document.body.scrollHeight);
      const percent = height ? Math.min(100, Math.floor((window.scrollY + window.innerHeight) / height * 100)) : 0;
      maxScrollPercent = Math.max(maxScrollPercent, percent);
      for (const threshold of [25, 50, 75, 100]) {
        const key = `${pagePath}:${threshold}`;
        if (percent >= threshold && !sentScroll.has(key) && send("scroll_depth", { percent: threshold, page_path: pagePath })) sentScroll.add(key);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    const timers = [30, 60, 120].map(seconds => window.setTimeout(() => {
      const key = `${pagePath}:${seconds}`;
      if (!sentTime.has(key) && send("time_on_page", { seconds, page_path: pagePath })) sentTime.add(key);
    }, seconds * 1000));
    let observer = null;
    const priceBlock = pricePayload ? document.querySelector(".booking-base-amount") : null;
    if (priceBlock && typeof IntersectionObserver === "function") {
      observer = new IntersectionObserver(entries => {
        if (!entries.some(entry => entry.isIntersecting && entry.intersectionRatio >= 0.5) || sentPrice.has(pagePath)) return;
        const payload = pricePayload();
        if (payload && send("view_price", { ...payload, page_path: pagePath })) {
          sentPrice.add(pagePath);
          observer.disconnect();
        }
      }, { threshold: 0.5 });
      observer.observe(priceBlock);
    }
    let finished = false;
    routeCleanup = () => {
      if (finished) return;
      finished = true;
      window.removeEventListener("scroll", onScroll);
      timers.forEach(timer => window.clearTimeout(timer));
      observer?.disconnect();
      const seconds = Math.floor((Date.now() - startedAt) / 1000);
      if (seconds > 0) send("page_dwell", { page_path: pagePath, seconds, max_scroll_percent: maxScrollPercent });
    };
  }

  window.addEventListener("pagehide", () => routeCleanup?.());
  window.wistiaAnalytics = { trackPageView, trackKakaoClick, trackFloatingKakaoClick, trackSiteClick, startPageTracking };
})();
