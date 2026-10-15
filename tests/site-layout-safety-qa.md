# Full route layout audit — 2026-10-15

## Fixed

- The approved top posters contain baked-in old 60,000 / 100,000 benefit prices and maximum 60k payback text, now covered by live price and event-summary UI driven by EVENTS (SOLO 50k / DUET 90k / maximum 70k)
- Event content used absolute positioning inside an image-sized hero, overlapping selection and product information when open, now a native modal with a constrained width/height and its own scroll
- Shared footer no longer renders privacy/support/voice-video tagline, including inquiry pages
- Detail footer no longer uses the poster containing the redundant map-bottom Kakao CTA and removed legal line, actual logo/channels/copyright remain, fixed inquiry CTA remains
- Native privacy page links are not intercepted by the SPA router
- Destroyed or canceled before/after audio fetches do not surface as playback failures after navigation

## Verified locally

- 31 routes including retired/redirected addresses × 360, 375, 390, 1280, 1440 CSS pixels = 155 route/width combinations
- Each route rendered, all visible images decoded, full page scrolled, missing main title / image / horizontal overflow / removed footer text = 0 after waiting for asynchronous app initialization
- 390 and 1280 runs also center-hit-tested event summaries, participant switches and map controls, blocked controls = 0
- SOLO and DUET × five inquiry stages × five widths = 50 combinations, horizontal overflow = 0, mobile nav fixed / PC nav static, removed footer text absent
- SOLO event modal at all five widths: open/close works, hero details stays closed, no modal horizontal overflow, correct reaction 20k and maximum 70k
- Escape closes modal and clears modal-open/inert state
- Actual inquiry navigation, optional wedding date, recording date/hour, lyric option +40k, SOLO 15–16 / DUET 15–17 and first-step back to detail checked
- Map and review original enlargement loaded, before/after playback+switch and AR 30% playback+stop checked
- Header/selection, main poster and footer screenshots visually inspected, original poster/media assets unchanged
- App and before-after syntax, 13 targeted regression suites passed

## Scope limits

- Browser responsive checks are not physical phone hardware tests
- No external Kakao message was sent and no real reservation/Notion data was modified
- Production commit/status and final screenshots recorded after publication
