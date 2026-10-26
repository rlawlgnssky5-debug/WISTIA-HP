import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";

const read = path => readFileSync(new URL(path, import.meta.url), "utf8");
function client(hostname = "www.wistiastudio.com") {
  const calls = [];
  const window = { fbq: (...args) => calls.push(args) };
  const location = { protocol: "https:", hostname, pathname: "/contact", search: "", hash: "", href: `https://${hostname}/contact` };
  const crypto = { randomUUID: () => "aaaaaaaa-bbbb-4ccc-8ddd-eeeeeeeeeeee" };
  runInNewContext(read("../js/tracking-common.js"), { window, crypto });
  runInNewContext(read("../js/meta-pixel.js"), { window, document: { addEventListener() {} }, location, crypto, fetch: () => Promise.resolve({ ok: true }), URL });
  return { window, calls };
}

test("inquiry_submit_popup also sends InquirySubmit once with no personal data", () => {
  const { window, calls } = client();
  assert.equal(window.wistiaMeta.trackFunnel("inquiry_submit_popup", { step: 4, page_path: "/contact" }), true);
  const names = calls.map(call => call[1]);
  assert.deepEqual(names, ["InquirySubmitPopup", "InquirySubmit"]);
  const submit = calls.filter(call => call[1] === "InquirySubmit");
  assert.equal(submit.length, 1);
  assert.equal(submit[0][0], "trackCustom");
  assert.deepEqual(JSON.parse(JSON.stringify(submit[0][2])), { page_path: "/contact" });
  assert.ok(!names.includes("KakaoTalkClick") && !names.includes("InquiryOpen") && !names.includes("Contact"));
});

test("other funnel events never send InquirySubmit", () => {
  const { window, calls } = client();
  window.wistiaMeta.trackFunnel("inquiry_open", { button_location: "menu", button_label: "문의" });
  window.wistiaMeta.trackFunnel("form_next", { from_step: 1 });
  assert.deepEqual(calls.map(call => call[1]), ["InquiryOpen", "FormNext"]);
});

test("local preview sends nothing", () => {
  const { window, calls } = client("127.0.0.1");
  window.wistiaMeta.trackFunnel("inquiry_submit_popup", { step: 4 });
  assert.equal(calls.length, 0);
});

test("the funnel emits inquiry_submit_popup at most once per submitted form", () => {
  const source = read("../js/inquiry-funnel.js");
  assert.match(source, /if \(!dialog \|\| submitted \|\| !activeForm\) return;\s*submitted = true;\s*emit\("inquiry_submit_popup"/);
});
