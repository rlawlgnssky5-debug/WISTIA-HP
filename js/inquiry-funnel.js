(() => {
  // Lifecycle state belongs to this document, including SPA route changes.
  let started = false, submitted = false, abandoned = false;
  let activeForm = null, lastStep = 1, formPath = "/";
  const viewed = new WeakMap(), completed = new Set(), errors = new Map(), gestures = new WeakSet();
  const safe = fn => (...args) => { try { return fn(...args); } catch { return false; } };
  const path = () => location.pathname.replace(/\/$/, "") || "/";
  const step = form => window.WistiaWizard?.currentStep?.(form) || 1;
  function emit(name, params = {}) {
    const payload = { ...params, page_path: path() };
    try { window.wistiaAnalytics?.trackFunnel(name, payload); } catch {}
    try { window.wistiaMeta?.trackFunnel(name, payload); } catch {}
  }
  function view(form) {
    if (!form || form.hidden || form.closest('[hidden]')) return;
    activeForm = form; lastStep = step(form); formPath = path();
    if (viewed.get(form) === lastStep) return;
    viewed.set(form, lastStep);
    emit("inquiry_step_view", { step: lastStep, step_total: form.dataset.wizard ? 4 : 1, ...stepChoice(form, lastStep) });
  }
  function start(form) {
    view(form);
    if (started) return;
    started = true;
    emit("form_start", { step: step(form) });
  }
  function choice(control, form) {
    let name = control?.name, value;
    if (name === "people") value = control.value === "0" ? "SOLO" : control.value === "1" ? "DUET" : undefined;
    else if (name === "discovery") value = control.value;
    else if (name === "lyricNone") value = control.checked ? "none" : undefined;
    else if (name === "lyricVideo") value = control.checked ? "lyric_video" : "none";
    else if (name === "rush") value = control.checked ? control.value : "none";
    else if (name === "eventDateUnknown") { name = "eventDate"; value = control.checked ? "unknown" : form.elements.eventDate?.value; }
    else if (name === "eventDate") value = form.elements.eventDateUnknown?.checked ? "unknown" : control.value;
    else if (name === "timeStart") value = control.value || "unknown";
    value = window.wistiaFieldValue?.(name, value);
    return value === undefined ? {} : { field_name: name, field_value: value };
  }
  function stepChoice(form, number) {
    const names = { 1: "people", 2: "eventDate" };
    const control = form.elements?.[names[number]];
    return control ? choice(control.name ? control : { name: names[number], value: control.value }, form) : {};
  }
  function fieldComplete(control, form) {
    const name = control?.name || control?.id || ["event", "option", "filmPeople", "filmUpgrade", "filmMaking", "filmFormat", "songOption", "baseProduct", "productSelect"].find(key => Object.hasOwn(control?.dataset || {}, key));
    if (!name || control.disabled || control.validity?.valid === false) return;
    const metadata = choice(control, form);
    if (!metadata.field_value && (["checkbox", "radio"].includes(control.type) ? !control.checked : !String(control.value || "").trim())) return;
    const key = name + ":" + (metadata.field_value || "filled");
    if (completed.has(key)) return;
    completed.add(key);
    emit("form_field_complete", { field_name: name, step: step(form), ...metadata });
  }
  function validation(form, name, number = step(form)) {
    const key = name + ":" + number, now = Date.now();
    if (errors.has(key) && now - errors.get(key) < 1000) return;
    errors.set(key, now);
    emit("form_validation_error", { field_name: name, step: number });
  }
  function abandon(reason) {
    if (!started || submitted || abandoned) return;
    abandoned = true;
    const payload = { last_step: lastStep, reason, page_path: formPath };
    try { window.wistiaAnalytics?.trackFunnel("form_abandon", payload); } catch {}
    try { window.wistiaMeta?.trackFunnel("form_abandon", payload); } catch {}
  }
  function popup() {
    // Validation/consultation-choice dialogs deliberately do not match.
    const dialog = document.querySelector('dialog[open] .contact-ok-action,dialog[open] .consult-copy-mark,dialog[open] .consult-copy-fallback');
    if (!dialog || submitted || !activeForm) return;
    submitted = true;
    emit("inquiry_submit_popup", { step: lastStep });
  }
  function scan() {
    popup();
    const form = document.querySelector("#contactInquiryForm");
    if (activeForm && (!activeForm.isConnected || activeForm.hidden || activeForm.closest('[hidden]'))) abandon("close");
    if (form) view(form);
  }
  function locationOf(control) {
    if (control.closest("#mainMenu")) return "menu";
    if (control.matches("#floatingPrice")) return "floating_price";
    if (control.closest(".solo-desktop-cta" ) || control.id.startsWith("soloDesktopCta")) return "detail_desktop_cta";
    if (control.closest(".detail-sticky,.arc-fixed-cta,.mas-sticky") || control.matches(".solo-footer-inquiry,[data-inquiry-jump]")) return "detail_footer_fixed";
    if (control.closest(".hero")) return "home_hero";
    if (control.closest(".consult-choice-form")) return "consult_choice_form";
    if (control.closest(".footer,.solo16j-footer")) return "detail_footer";
    return (control.id || control.classList[0] || control.closest("section")?.id || "inquiry_link").replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 40);
  }
  document.addEventListener("click", safe(event => {
    const control = event.target.closest?.("a,button,input,select,textarea");
    if (!control || control.disabled) return;
    const form = control.closest("#contactInquiryForm");
    if (!form && control.id === "headerBack" && activeForm?.isConnected) emit("form_prev", { from_step: lastStep });
    if (form) {
      const number = step(form);
      if (control.matches("[data-wf-next]")) emit("form_next", { from_step: number, ...stepChoice(form, number) });
      if (control.matches("[data-wf-prev]")) emit("form_prev", { from_step: number });
      if (event.isTrusted && control.matches("[data-calendar-day],[data-calendar-time],[data-wf-time]") && !control.hasAttribute("data-time-unavailable")) {
        gestures.add(form);
        setTimeout(() => gestures.delete(form), 0);
        start(form);
      }
      return;
    }
    const raw = control.getAttribute("href");
    let opens = control.hasAttribute("data-inquiry-jump");
    if (raw) {
      const url = new URL(raw, location.href);
      const target = url.hash.startsWith("#/") ? url.hash.slice(1).split("?")[0] : url.pathname;
      opens ||= url.origin === location.origin && (/^\/event\//.test(target) || /^\/contact\/?$/.test(target));
    }
    if (opens) emit("inquiry_open", { button_location: locationOf(control), button_label: control.textContent.trim().replace(/\s+/g, " ").slice(0, 40) });
  }), true);
  for (const type of ["input", "change", "blur"]) document.addEventListener(type, safe(event => {
    const control = event.target, form = control.closest?.("#contactInquiryForm");
    if (!form) return;
    if (event.isTrusted && type !== "blur") start(form);
    if (!started || type === "input" || (!event.isTrusted && !gestures.has(form))) return;
    // Defer until the wizard has updated canonical date fields and validity.
    queueMicrotask(safe(() => {
      fieldComplete(control, form);
      if (control.hasAttribute("data-wf-date-part")) fieldComplete(form.elements.eventDate, form);
    }));
  }), true);
  document.addEventListener("visibilitychange", safe(() => { if (document.visibilityState === "hidden") { popup(); abandon("hidden"); } }));
  window.addEventListener("pagehide", safe(() => { popup(); abandon("pagehide"); }));
  window.WistiaInquiryFunnel = { view: safe(view), validation: safe(validation), abandon: safe(abandon) };
  new MutationObserver(safe(scan)).observe(document.documentElement, { childList: true, subtree: true, attributes: true, attributeFilter: ["hidden", "open"] });
  safe(scan)();
})();
