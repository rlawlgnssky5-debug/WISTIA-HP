# 16j12 local QA — 2026-10-14

Changes remain in the working tree, with no staging, commit, push, merge or deployment

Implemented:

- Full-width desktop top artwork and matching percentage-based gallery/event/people positions
- Centered maximum 480px column for information, reviews, POINT 04, FAQ, map and footer
- Visible HTML ratio cards, playback state, elapsed/total time, seek, stop and live/AR balance
- Native FAQ accordion with answers in normal flow, plus SVG controls and no painted fixed answer
- Footer logo/social overlay cleanup and corrected social/legal hit positions
- Rose gallery label, white top caption pill, plain white dots and SVG play control
- Yellow floating Kakao chat link on both details
- Blush backgrounds on former beige wrappers and the DUET people SVG
- Story product removed from active navigation, product/service options, process CTA, FAQ category and sitemap
- Story detail/event routes have noindex and return to the root, while source files and product data remain available
- Root renders SOLO directly with https://wistiastudio.com/ canonical, previous home renderer preserved as renderLegacyHome
- Brief intro with the existing WISTIA logo and three actual photographs
- Cache version 20261014-detail-polish-16j12 across regenerated static pages

Passed:

- `node --check js/app.js`
- `node --check js/intro-16j.js`
- `node tests/detail-polish-16j-qa.test.mjs`: rendered SOLO/DUET, local asset paths, playback lifecycle, all four ratio labels, elapsed time, seek, stop, root SEO, story routing/navigation and JSON-LD parsing
- `node tests/mobile-ar-solo.test.mjs`: both product compositions and preserved media/actions
- `node tests/contact-calendar.test.mjs`: calendar/date rules and inquiry constraints
- `node tests/contact-validation.test.mjs`: no name gate, optional dates, draft safety and copy validation
- `node tests/calendar-refresh-safety.test.mjs`: failed/late refresh safety and recovery
- `node tests/detail-polish-16h.test.mjs`: updated structural check passed
- Local server started with `node scripts/local-preview.mjs` at http://127.0.0.1:4186

Incomplete verification:

- Browser surfaces inventory is empty, and Windows Edge headless execution failed with access denied in its process/IPC startup
- Playwright is unavailable, and its registry installation was denied by the environment's offline cache policy
- Actual 360/375/390/1280 screenshots, pixel comparison, interactive browser testing and external console 503 request identification remain unverified
- No claim is made that the unidentified 503 was fixed, remote font CDN requests could not be inspected successfully in this environment
- Existing `booking-availability-ui.test.mjs` fails at line 28: its Sunday 2027-10-10 19:00 selection expects `ready`, but the existing Sunday 18:00 closure rule yields `closed`, booking implementation was not modified
- Browser portions of `detail-polish-16h.test.mjs` and `calendar-touch.test.mjs` are explicitly skipped, not counted as passes

The changed-file inventory is recorded in `detail-polish-16j-changed-files.md`
