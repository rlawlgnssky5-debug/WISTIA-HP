(() => {
  const localPreview = location.protocol === "file:" || ["localhost", "127.0.0.1", "[::1]"].includes(location.hostname);
  let lastPageViewUrl = "";

  function trackPageView() {
    if (localPreview || typeof window.fbq !== "function") return false;
    const url = location.pathname + location.search + (location.hash || "#/");
    if (url === lastPageViewUrl) return false;
    lastPageViewUrl = url;
    window.fbq("track", "PageView");
    return true;
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

  window.wistiaMeta = { trackPageView, trackContact };
})();
