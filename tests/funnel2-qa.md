# Funnel2 implementation and verification

No git commit, push or deployment performed

## Changed files

- `js/tracking-common.js` ? shared visitor ID, choice validation, section lifecycle
- `js/analytics.js` ? visitor ID, choice metadata, scroll lifecycle repairs, section integration
- `js/meta-pixel.js` ? visitor ID, choice metadata, SectionView, route visit deduplication reset
- `js/inquiry-funnel.js` ? canonical choice extraction and step choice metadata
- `tests/inquiry-funnel.test.mjs`
- `tests/meta-events.test.mjs`
- `tests/tracking-engagement.test.mjs`
- `tests/funnel2-qa.md` ? this report

HTML changes only add the shared helper before Meta/GA and update changed scripts to `v=20261017-funnel2`

- `ar/friend.html`
- `ar/self.html`
- `before-after.html`
- `contact.html`
- `detail/duet-film.html`
- `detail/duo.html`
- `detail/proposal.html`
- `detail/solo-film.html`
- `detail/solo.html`
- `detail/wedding.html`
- `event/duet-film.html`
- `event/duo.html`
- `event/proposal.html`
- `event/solo-film.html`
- `event/solo.html`
- `event/wedding.html`
- `events.html`
- `film.html`
- `find/people.html`
- `find/role.html`
- `find/service.html`
- `index.html`
- `info/about.html`
- `info/faq.html`
- `info/location.html`
- `info/process.html`
- `section/homeCases.html`
- `section/homeLocation.html`
- `section/homeProcess.html`
- `section/homeServices.html`
- `song.html`

## Final event parameters

Every GA event includes `visitor_id` and `send_to: G-5E0XX7SE8T`
Every Meta browser event includes the same `visitor_id`
ID storage is `wistia_vid`, format `wv_` plus random hexadecimal characters, with page memory fallback when storage is unavailable

| GA event | Meta event | Parameters besides visitor_id and GA send_to |
|---|---|---|
| page_view | PageView (track) | GA: page_location, page_referrer, page_title, page_path / Meta: no other params |
| scroll_depth | ScrollDepth | percent, page_path |
| time_on_page | TimeOnPage | seconds, page_path |
| view_price | ViewPrice | content_name, content_ids, content_type, value, currency / GA additionally page_path |
| page_dwell | ? | page_path, seconds, max_scroll_percent, transport_type: beacon |
| site_click | ? | action, page_path, target_path |
| option_select | ? | page_path, option_type, option_key, selected |
| kakao_chat_click | ? | page_path |
| floating_kakao_click | FloatingKakaoClick | page_path |
| ? | ViewContent (track) | content_name, content_ids, content_type, value, currency |
| ? | Contact (track), KakaoTalkClick (trackCustom) | visitor_id only, unchanged matching eventID options |
| section_view | SectionView | section_name, seconds, page_path / GA transport_type: beacon on lifecycle flush |
| inquiry_open | InquiryOpen | page_path, button_location, button_label |
| inquiry_step_view | InquiryStepView | page_path, step, step_total, optional field_name + field_value |
| form_start | FormStart | page_path, step |
| form_field_complete | FormFieldComplete | page_path, field_name, step, optional field_value |
| form_next | FormNext | page_path, from_step, optional field_name + field_value |
| form_prev | FormPrev | page_path, from_step |
| form_validation_error | FormValidationError | page_path, field_name, step |
| form_abandon | FormAbandon | page_path, last_step, reason / GA transport_type: beacon |
| inquiry_submit_popup | InquirySubmitPopup | page_path, step |

All Meta events use trackCustom except PageView, ViewContent and Contact
Contact and KakaoTalkClick still only trigger on `.contact-ok-action` clicks, share the same eventID, and retain the original `/api/meta-contact` call and body
Local preview guards are preserved
No name, phone, email, IP, Kakao ID, free text value or free text length was added
GA page_location and referrer now exclude query strings and hashes
The existing server Contact source URL handling remains unchanged as explicitly required

## Section names per page

All three pages currently render the canonical SOLO/DUET composition at desktop and mobile widths
Only elements actually present are observed, and hidden/zero-area sections cannot accumulate time

| Page | section_name |
|---|---|
| / | top, video, product_info, price, reviews, advantages, credentials, recording, key, tuning, ar_ratio, lyrics, process, faq, location, notices, footer_cta |
| /detail/solo | top, video, product_info, price, reviews, advantages, credentials, recording, key, tuning, ar_ratio, lyrics, process, faq, location, notices, footer_cta |
| /detail/duo | top, video, product_info, price, reviews, advantages, credentials, recording, key, tuning, ar_ratio, lyrics, process, faq, location, notices, footer_cta |

Mappings: `.mas-intro` -> top, `.mas-gallery` -> video, `.mas-information` -> product_info, `#reviews` -> reviews, `#arcRecording` -> recording, `#arcKey` -> key, `#arcTuning` / `.arc-point-tuning` -> tuning, `#soloPoint04` / `.arc-point-ratio` -> ar_ratio, `.arc-lyrics` -> lyrics, `#arcProcess` -> process, `#arcFaq` -> faq, `[data-solo-map]` -> location, `.arc-notices` -> notices, `.solo-footer-inquiry` -> footer_cta
Price/advantages/credentials use their existing poster image src selectors: point-price.webp, point-adv.webp, cred-a2.webp
The hidden #arcDetails anchor is deliberately excluded

IntersectionObserver selects viewport candidates, with passive scroll/resize and animation-frame geometry checks for tall-section 50% viewport crossings
A section must expose at least half its area or half the viewport area
Visible time pauses while hidden, aggregates fractions across visits, sends at most once per leave when >=1 second, and caps each payload at 1800 seconds
Hidden/pagehide/route cleanup flush remaining time, using GA beacon transport

## Choice field_value formats

| field_name | Allowed field_value |
|---|---|
| people | SOLO or DUET, mapped from actual radio values 0 and 1 |
| discovery | Exact one of the six wizard source options, max 40 characters |
| lyricNone | none |
| lyricVideo | lyric_video when checked, none when unchecked |
| rush | 1 when checked (actual fixed checkbox value), none when unchecked |
| eventDate | YYYY-MM-DD with strict regex and real calendar-date validation, or unknown for eventDateUnknown |
| timeStart | HH:MM, hours 00-23 and minutes 00-59, or unknown for undecided |
| specialNotes | No field_value and no length, identifier only |

No other field can pass a field_value through either funnel tracker
Optional step metadata uses people on step 1, eventDate on step 2, timeStart on step 3 and lyricVideo on step 4

## scroll_depth finding

No funnel1 event allowlist blocks scroll_depth because it is sent directly through send(), outside trackFunnel()
The shared route renderer calls startPageTracking() for home, both details and all event pages
The document is the main vertical scroll surface, while inner gallery/time selectors are intentionally separate from page depth
The reported realtime disappearance cannot be attributed to a verified universal outage from the available local evidence

Two real lifecycle defects were found and repaired

- Per-path sentScroll persisted across SPA visits, preventing the same thresholds on a return to an already visited route
- pagehide removed tracking listeners but left activePath populated and had no persisted pageshow restart, preventing tracking after bfcache restoration

GA now resets visit deduplication on route start, clears the active path on cleanup and restarts on persisted pageshow
Meta visit deduplication now resets on a successful new route PageView
Initial document depth is sampled after rendering even if no initial scroll event occurs
Names and thresholds remain scroll_depth and 25/50/75/100
Existing page_dwell sends on pagehide and route change, now with visitor_id and beacon transport

## Validation

Passed:

`node --test --experimental-test-isolation=none tests/inquiry-funnel.test.mjs tests/meta-events.test.mjs tests/tracking-engagement.test.mjs`

3 test files passed, 0 failed
The default node --test child-process mode returned spawn EPERM under the environment sandbox, so the same tests ran in Node's no-isolation mode

Coverage includes choice collector and radio group values, strict invalid-date/time rejection, free text value/length exclusion, shared storage and denied-storage fallback, all existing Meta trigger/server-deduplication checks, six paths at 390/1280 simulated viewport widths, SPA return visits, persisted pageshow, page dwell, tall/short section timing, hidden pause, minimum duration and 1800-second cap

JS syntax checks passed for all four changed/new JS files
Git diff whitespace check passed
All 31 referencing HTML files have the correct helper order and cache versions
These are code-level and simulated DOM checks, not a new live browser or GA4 realtime verification
