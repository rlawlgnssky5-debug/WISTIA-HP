# 16j PC round 3 verification

Changes remain in the working tree; no commit or push was performed

Implemented: single painted person-selection title, DUET-specific approved top assets, visible SVG video play control, POINT 04 layout and active equalizer, audio metadata/current time/progress/seek/stop, closed FAQ plus icons, full-screen 1.6-second intro with reduced-motion handling, complete mobile intro crop, compact safe-area Kakao button with collision suppression, lazy calendar requests, local credentials-free availability response, and media byte ranges

Cache: 20261014-detail-polish-16j14; static pages regenerated
Production api/availability.js is unchanged

Passed:
- node syntax checks for changed JavaScript and preview server
- tests/detail-round2-functional.test.mjs (date confirmation/close, lazy lookup, failure fallback, four ratios, metadata/time, focused slider updates, seeking, stopping)
- tests/booking-availability-ui.test.mjs (duration overlap, product switches, timeout/cache sharing, failed refresh, forced checks before copying)
- tests/calendar-refresh-safety.test.mjs
- tests/contact-calendar.test.mjs
- tests/calendar-holidays.test.mjs
- HTTP preview checks on port 4188: date and range availability return 200 with valid empty blocks; WAV byte range returns 206, audio/wav and correct length
- git diff --check

Visual verification limitation:
The required 360/375/390/1280 browser comparisons were attempted but could not run: Playwright browser launch returned spawn EPERM, the hidden Edge CDP launch was unavailable (ECONNREFUSED), and the computer-use inventory had no browsers
Do not treat responsive screenshots or actual browser media playback as verified
The browser regression script remains at tests/detail-round2.test.cjs for a browser-enabled environment
Mockups and the corrected intro raster were inspected directly

Temporary QA browser folder cleanup was rejected by the automatic approval policy; tmp/qa-browser remains
