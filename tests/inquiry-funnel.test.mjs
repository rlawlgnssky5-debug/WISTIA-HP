import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";

const read = name => readFileSync(new URL("../js/" + name, import.meta.url), "utf8");
const events = {
  inquiry_open: ["InquiryOpen", { button_location: "detail_footer_fixed", button_label: "문의양식 작성" }],
  inquiry_step_view: ["InquiryStepView", { step: 1, step_total: 5 }],
  form_start: ["FormStart", { step: 1 }],
  form_field_complete: ["FormFieldComplete", { field_name: "phone", step: 2 }],
  form_next: ["FormNext", { from_step: 2 }],
  form_prev: ["FormPrev", { from_step: 3 }],
  form_validation_error: ["FormValidationError", { field_name: "eventDate", step: 2 }],
  form_abandon: ["FormAbandon", { last_step: 3, reason: "close" }],
  inquiry_submit_popup: ["InquirySubmitPopup", { step: 5 }]
};
function trackers(hostname = "www.wistiastudio.com") {
  const ga = [], meta = [], server = [];
  const window = { gtag: (...args) => ga.push(args), fbq: (...args) => meta.push(args), addEventListener() {} };
  const document = { addEventListener() {}, head: { appendChild() {} }, createElement: () => ({}) };
  const location = { protocol: "https:", hostname, pathname: "/event/solo", search: "?phone=PRIVATE", href: `https://${hostname}/event/solo?phone=PRIVATE` };
  location.origin = `https://${hostname}`;
  let n = 0;
  const crypto = { randomUUID: () => `00000000-0000-4000-8000-${String(++n).padStart(12, "0")}` };
  const fetch = (url, options) => { server.push([url, JSON.parse(options.body)]); return Promise.resolve({}); };
  const context = { window, document, location, crypto, fetch, URL, URLSearchParams };
  runInNewContext(read("tracking-common.js"), context);
  runInNewContext(read("analytics.js"), context);
  runInNewContext(read("meta-pixel.js"), context);
  return { window, ga, meta, server };
}
const client = trackers();
for (const [name, [metaName, params]] of Object.entries(events)) {
  const dirty = { ...params, name: "PRIVATE", phone: "01012345678", email: "PRIVATE@example.com", value: "PRIVATE", specialNotes: "PRIVATE", search: "?PRIVATE" };
  assert.equal(client.window.wistiaAnalytics.trackFunnel(name, dirty), true);
  assert.equal(client.window.wistiaMeta.trackFunnel(name, dirty), true);
  const ga = client.ga.at(-1), meta = client.meta.findLast(call => call[1] === metaName);
  if (name === "inquiry_submit_popup") {
    const submit = client.meta.at(-1), sent = client.server.at(-1);
    assert.equal(submit[1], "InquirySubmit"); assert.ok(!client.meta.some(call => call[1] === "Lead"));
    assert.deepEqual(JSON.parse(JSON.stringify(submit[2])), { page_path: "/event/solo" });
    assert.equal(sent[1].event_id, submit[3].eventID);
    assert.deepEqual(sent, ["/api/meta-contact", { event_id: submit[3].eventID, event_source_url: "https://www.wistiastudio.com/event/solo", kind: "inquiry_submit" }]);
    assert.doesNotMatch(JSON.stringify([submit, sent]), /PRIVATE|01012345678/);
  }
  assert.equal(ga[1], name);
  assert.equal(meta[1], metaName);
  assert.deepEqual(JSON.parse(JSON.stringify(meta[2])), { page_path: "/event/solo", ...params, visitor_id: client.window.wistiaVisitorId() });
  assert.deepEqual(JSON.parse(JSON.stringify(ga[2])), { page_path: "/event/solo", ...params, visitor_id: client.window.wistiaVisitorId(), ...(name === "form_abandon" ? { transport_type: "beacon" } : {}), send_to: "G-5E0XX7SE8T" });
  assert.doesNotMatch(JSON.stringify([ga, meta]), /PRIVATE|01012345678/);
}
for (const tracker of [client.window.wistiaAnalytics, client.window.wistiaMeta]) {
  assert.equal(tracker.trackFunnel("unknown", {}), false);
  assert.equal(tracker.trackFunnel("form_start", { step: "PRIVATE" }), false);
  assert.equal(tracker.trackFunnel("form_field_complete", { field_name: "PRIVATE@example.com", step: 1 }), false);
  assert.equal(tracker.trackFunnel("form_abandon", { reason: "PRIVATE", last_step: 1 }), false);
}
for (const hostname of ["localhost", "127.0.0.1", "[::1]"]) {
  const local = trackers(hostname);
  for (const [name, [, params]] of Object.entries(events)) {
    assert.equal(local.window.wistiaAnalytics.trackFunnel(name, params), false);
    assert.equal(local.window.wistiaMeta.trackFunnel(name, params), false);
  }
  assert.equal(local.meta.length + local.ga.length, 0);
}
client.window.gtag = client.window.fbq = () => { throw Error("blocked"); };
assert.equal(client.window.wistiaAnalytics.trackFunnel("form_start", { step: 1 }), false);
assert.equal(client.window.wistiaMeta.trackFunnel("form_start", { step: 1 }), false);

function lifecycle() {
  const calls = [], docListeners = {}, winListeners = {}, tasks = [];
  let observer, current = 1, present = true, popup = false;
  const form = { dataset: { wizard: "true" }, isConnected: true, hidden: false, closest: () => null, elements: {} };
  const window = {
    WistiaWizard: { currentStep: () => current },
    wistiaAnalytics: { trackFunnel: (name, params) => calls.push([name, params]) },
    wistiaMeta: { trackFunnel: (name, params) => calls.push(["meta:" + name, params]) },
    addEventListener: (name, fn) => winListeners[name] = fn
  };
  const document = {
    visibilityState: "visible", documentElement: {},
    querySelector: selector => selector === "#contactInquiryForm" ? (present ? form : null) : popup ? {} : null,
    addEventListener: (name, fn) => docListeners[name] = fn
  };
  class MutationObserver { constructor(fn) { observer = fn; } observe() {} }
  runInNewContext(read("tracking-common.js"), { window });
  runInNewContext(read("inquiry-funnel.js"), { window, document, location: { pathname: "/event/solo", href: "https://example.com/event/solo", origin: "https://example.com" }, URL, MutationObserver, queueMicrotask: fn => tasks.push(fn), setTimeout: fn => tasks.push(fn), Date });
  const field = { name: "specialNotes", value: "PRIVATE TEXT", type: "textarea", validity: { valid: true }, closest: () => form, hasAttribute: () => false };
  const fire = (type, target = field, trusted = true) => { docListeners[type]({ target, isTrusted: trusted }); while (tasks.length) tasks.shift()(); };
  return { calls, window, form, field, fire, view: number => { current = number; window.WistiaInquiryFunnel.view(form); }, scan: () => observer(), hide: () => { document.visibilityState = "hidden"; fire("visibilitychange", document); }, pagehide: () => winListeners.pagehide(), close: () => { form.isConnected = false; present = false; observer(); }, popup: () => { popup = true; observer(); } };
}
const flow = lifecycle();
const count = (flow, name) => flow.calls.filter(call => call[0] === name).length;
assert.equal(count(flow, "inquiry_step_view"), 1);
flow.scan();
flow.fire("change", flow.field, false); // Restored draft is not a user interaction.
assert.equal(count(flow, "form_start"), 0);
flow.fire("input"); flow.fire("change"); flow.fire("blur");
assert.equal(count(flow, "form_start"), 1);
assert.equal(count(flow, "form_field_complete"), 1);
assert.doesNotMatch(JSON.stringify(flow.calls), /PRIVATE TEXT/);
flow.view(2); flow.view(2); flow.view(1);
assert.equal(count(flow, "inquiry_step_view"), 3);
flow.window.WistiaInquiryFunnel.validation(flow.form, "eventDate", 2);
flow.window.WistiaInquiryFunnel.validation(flow.form, "eventDate", 2);
assert.equal(count(flow, "form_validation_error"), 1);
for (const [attribute, name] of [["data-wf-next", "form_next"], ["data-wf-prev", "form_prev"]]) {
  const button = { disabled: false, closest: () => flow.form, matches: selector => selector === `[${attribute}]` };
  flow.fire("click", { closest: () => button });
  assert.equal(count(flow, name), 1);
}
flow.hide(); flow.pagehide(); flow.close();
assert.equal(count(flow, "form_abandon"), 1);
assert.equal(flow.calls.find(call => call[0] === "form_abandon")[1].reason, "hidden");
const success = lifecycle();
success.fire("input"); success.view(5); success.popup(); success.popup(); success.hide(); success.pagehide();
assert.equal(count(success, "inquiry_submit_popup"), 1);
assert.equal(count(success, "form_abandon"), 0);
assert.equal(success.calls.find(call => call[0] === "inquiry_submit_popup")[1].step, 5);
const closed = lifecycle(); closed.fire("input"); closed.close(); closed.pagehide();
assert.equal(count(closed, "form_abandon"), 1);
assert.equal(closed.calls.find(call => call[0] === "form_abandon")[1].reason, "close");
const left = lifecycle(); left.fire("input"); left.pagehide(); left.hide();
assert.equal(count(left, "form_abandon"), 1);
assert.equal(left.calls.find(call => call[0] === "form_abandon")[1].reason, "pagehide");
const opening = lifecycle();
const link = {
  id: "", classList: ["solo-footer-inquiry"], textContent: "  문의양식 작성  ",
  getAttribute: name => name === "href" ? "/event/duo?PRIVATE" : null,
  hasAttribute: () => false, closest: () => null,
  matches: selector => selector.includes(".solo-footer-inquiry")
};
opening.fire("click", { closest: () => link });
assert.equal(count(opening, "inquiry_open"), 1);
assert.equal(opening.calls.find(call => call[0] === "inquiry_open")[1].button_location, "detail_footer_fixed");
assert.doesNotMatch(JSON.stringify(opening.calls), /PRIVATE/);
for (const flow of [opening, closed, left, success]) {
  const ga = flow.calls.filter(call => !call[0].startsWith("meta:"));
  const meta = flow.calls.filter(call => call[0].startsWith("meta:")).map(([name, params]) => [name.slice(5), params]);
  assert.deepEqual(ga, meta);
}
const choices = lifecycle();
for (const [name, value, expected, checked = true] of [["people", "1", "DUET"], ["discovery", "\uc2a4\ub808\ub4dc", "\uc2a4\ub808\ub4dc"], ["lyricVideo", "1", "lyric_video"], ["lyricNone", "1", "none"], ["rush", "1", "1"], ["timeStart", "13:00", "13:00"], ["timeStart", "", "unknown"]]) {
  const control = { ...choices.field, name, value, checked, type: name === "timeStart" ? "select-one" : "radio" };
  choices.fire("change", control);
  assert.equal(choices.calls.filter(call => call[0] === "form_field_complete").at(-1)[1].field_value, expected);
}
choices.form.elements.people = { value: "1" }; // Real radio groups expose RadioNodeList.value.
choices.view(1);
const next = { disabled: false, closest: () => choices.form, matches: selector => selector === "[data-wf-next]" };
choices.fire("click", { closest: () => next });
assert.equal(choices.calls.find(call => call[0] === "form_next")[1].field_value, "DUET");
client.window.gtag = (...args) => client.ga.push(args);
client.window.fbq = (...args) => client.meta.push(args);
for (const tracker of [client.window.wistiaAnalytics, client.window.wistiaMeta]) {
  for (const [field_name, field_value] of [["people", "SOLO"], ["people", "DUET"], ["discovery", "\uc2a4\ub808\ub4dc"], ["lyricNone", "none"], ["lyricVideo", "lyric_video"], ["rush", "1"], ["eventDate", "2028-02-29"], ["eventDate", "unknown"], ["timeStart", "13:00"], ["timeStart", "unknown"]]) {
    tracker.trackFunnel("form_field_complete", { field_name, field_value, step: 1 });
    const call = tracker === client.window.wistiaAnalytics ? client.ga.at(-1) : client.meta.at(-1);
    assert.equal(call[2].field_value, field_value);
    assert.match(call[2].visitor_id, /^wv_[a-f0-9]{16,64}$/);
  }
  for (const [field_name, field_value] of [["specialNotes", "PRIVATE TEXT"], ["specialNotes", 12], ["phone", "01012345678"], ["discovery", "PRIVATE"], ["people", "PRIVATE"], ["eventDate", "2026-02-30"], ["timeStart", "25:00"]]) {
    tracker.trackFunnel("form_field_complete", { field_name, field_value, step: 1, length: 12, value_length: 12 });
    const call = tracker === client.window.wistiaAnalytics ? client.ga.at(-1) : client.meta.at(-1);
    assert.equal(call[2].field_value, undefined);
    assert.equal(call[2].length, undefined);
    assert.equal(call[2].value_length, undefined);
  }
}
console.log("Funnel event pairs, privacy allowlists, local guards, lifecycle deduplication and popup completion passed");
