(() => {
  let memoryId;
  window.wistiaVisitorId = window.wistiaVisitorId || (() => {
    if (memoryId) return memoryId;
    try {
      const stored = window.localStorage.getItem("wistia_vid");
      if (/^wv_[a-f0-9]{16,64}$/.test(stored || "")) return memoryId = stored;
    } catch {}
    const random = typeof crypto !== "undefined" && crypto.randomUUID
      ? crypto.randomUUID().replace(/-/g, "")
      : Array.from({ length: 32 }, () => Math.floor(Math.random() * 16).toString(16)).join("");
    memoryId = "wv_" + random;
    try { window.localStorage.setItem("wistia_vid", memoryId); } catch {}
    return memoryId;
  });
  // Stable DOM mappings for the current SOLO-based home and both AR details.
  window.wistiaTrackSections = (pagePath, send) => {
    if (!["/", "/detail/solo", "/detail/duo"].includes(pagePath) || typeof IntersectionObserver !== "function") return () => {};
    const selectors = {
      top: ".mas-intro", video: ".mas-gallery", product_info: ".mas-information",
      price: '.detail-price-reason,img[src*="/point-price.webp"]', reviews: "#reviews",
      advantages: 'img[src*="/point-adv.webp"]', credentials: 'img[src*="/cred-a2.webp"]',
      recording: "#arcRecording", key: "#arcKey", tuning: "#arcTuning,.arc-point-tuning",
      ar_ratio: "#soloPoint04,.arc-point-ratio", lyrics: ".arc-lyrics", process: "#arcProcess",
      faq: "#arcFaq", location: "[data-solo-map]", notices: ".arc-notices"
    };
    const states = new Map(), candidates = new Set();
    for (const [name, selector] of Object.entries(selectors)) {
      const element = document.querySelector(selector);
      if (element) states.set(element, { name, since: null, pending: 0 });
    }
    const account = (state, now) => {
      if (state.since !== null) { state.pending += Math.max(0, now - state.since); state.since = null; }
    };
    const flush = (state, beacon) => {
      const seconds = Math.min(1800, Math.floor(state.pending / 1000));
      if (seconds < 1) return;
      state.pending = 0;
      const payload = { section_name: state.name, seconds, page_path: pagePath };
      try { send("section_view", { ...payload, ...(beacon ? { transport_type: "beacon" } : {}) }); } catch {}
      try { window.wistiaMeta?.trackSectionView(payload); } catch {}
    };
    const update = () => {
      frame = null;
      const now = Date.now();
      for (const element of candidates) {
        const state = states.get(element), rect = element.getBoundingClientRect();
        const visible = Math.max(0, Math.min(rect.bottom, window.innerHeight) - Math.max(0, rect.top));
        const width = Math.max(0, Math.min(rect.right, window.innerWidth) - Math.max(0, rect.left));
        const area = visible * width;
        const qualifies = document.visibilityState !== "hidden" && area > 0 &&
          (area >= rect.width * rect.height * 0.5 || area >= window.innerWidth * window.innerHeight * 0.5);
        if (qualifies && state.since === null) state.since = now;
        else if (!qualifies && state.since !== null) { account(state, now); flush(state, false); }
      }
    };
    let frame = null;
    const schedule = () => { if (frame === null) frame = window.requestAnimationFrame(update); };
    const observer = new IntersectionObserver(entries => {
      const now = Date.now();
      for (const entry of entries) {
        if (entry.isIntersecting) candidates.add(entry.target);
        else { const state = states.get(entry.target); account(state, now); flush(state, false); candidates.delete(entry.target); }
      }
      update();
    }, { threshold: [0, 0.5, 1] });
    states.forEach((state, element) => observer.observe(element));
    const flushAll = () => { const now = Date.now(); states.forEach(state => { account(state, now); flush(state, true); }); };
    const visibility = () => { if (document.visibilityState === "hidden") flushAll(); else update(); };
    document.addEventListener("visibilitychange", visibility);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });
    return () => {
      flushAll(); observer.disconnect();
      if (frame !== null) window.cancelAnimationFrame(frame);
      document.removeEventListener("visibilitychange", visibility);
      window.removeEventListener("scroll", schedule); window.removeEventListener("resize", schedule);
    };
  };
  // No text-field values or lengths may pass this boundary.
  window.wistiaFieldValue = (name, value) => {
    if (typeof value !== "string") return undefined;
    const choices = {
      people: ["SOLO", "DUET"],
      discovery: ["\uc778\uc2a4\ud0c0", "\uc2a4\ub808\ub4dc", "\uad11\uace0", "\uce74\ud398", "\ube14\ub85c\uadf8", "\uc9c0\uc778 \ucd94\ucc9c"],
      lyricNone: ["none"], lyricVideo: ["lyric_video", "none"], rush: ["1", "none"]
    };
    if (choices[name]) return value.length <= 40 && choices[name].includes(value) ? value : undefined;
    if (name === "eventDate") {
      if (value === "unknown") return value;
      if (!/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/.test(value)) return undefined;
      const date = new Date(value + "T00:00:00Z");
      return !isNaN(date) && date.toISOString().slice(0, 10) === value ? value : undefined;
    }
    if (name === "timeStart" && /^(unknown|([01]\d|2[0-3]):[0-5]\d)$/.test(value)) return value;
    return undefined;
  };
})();
