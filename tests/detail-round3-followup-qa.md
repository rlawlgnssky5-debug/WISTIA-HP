# 16j PC round 3 follow-up — local verification

Applied _codex_prompt4.txt in this folder only, without committing or pushing
Cache: app.js and detail-solo-16j.css use 20261014-detail-polish-16j15, top picture URLs use 16j15

Changes
- PC top play circle is 88px, white with a rose SVG triangle and soft shadow, mobile stays 52px
- POINT 04 cue uses normal flow after the instruction line, flush with the left edge of the 30% card, ratio group extra top margin removed
- Transport uses one 12px white rounded SVG square while playing and one triangle with 재생 while idle, idle activation restarts the selected ratio, stop resets elapsed time
- Rose status dot has a soft halo
- DUET starts with the existing real duet-live-proof-v2.jpg and duo-wedding-song-ar.mp4, first dot selected, corresponding second dot opens SOLO
- DUET photo crop, caption, badge and dot offsets follow the duo mockup source, existing photo zoom removed on the first DUET slide
- Chat stays hidden until the top section is passed, then fades out when FAQ, POINT 04, person cards, event prices or footer intersect its bottom-right 120px zone, hidden chat is excluded from tab order
- Calendar code already changes × 닫기 to 확인 after selection, confirmation closes the calendar and preserves the date, no calendar source edit required
- Regenerated 30 route HTML pages from index.html for cache references only

Passed checks, run directly with node because child-process test workers are restricted
- node --check js/app.js
- node tests/detail-round2-functional.test.mjs, including single stop SVG, idle play, selected-ratio restart, elapsed time, progress, seek and external pause
- node tests/detail-round3-followup.test.mjs, including SOLO/DUET first poster and dot, protected chat regions, boundary positions and route reset
- node tests/contact-calendar.test.mjs
- node tests/calendar-holidays.test.mjs
- node tests/calendar-refresh-safety.test.mjs
- node tests/booking-availability-ui.test.mjs
- git diff --check

Visual QA limitation
- Approved mockups, qa3 paired screenshots and the existing DUET poster were inspected directly
- Actual updated 390px and 1280px screenshots and real browser playback remain unverified
- Playwright Edge launch returned spawn EPERM, computer-use inventory returned no browsers or apps
- No public deployment or external message was sent

Changed files
- ar/friend.html
- ar/self.html
- before-after.html
- contact.html
- css/detail-solo-16j.css
- detail/duet-film.html
- detail/duo.html
- detail/proposal.html
- detail/solo-film.html
- detail/solo.html
- detail/wedding.html
- event/duet-film.html
- event/duo.html
- event/proposal.html
- event/solo-film.html
- event/solo.html
- event/wedding.html
- events.html
- film.html
- find/people.html
- find/role.html
- find/service.html
- index.html
- info/about.html
- info/faq.html
- info/location.html
- info/process.html
- js/app.js
- section/homeCases.html
- section/homeLocation.html
- section/homeProcess.html
- section/homeServices.html
- song.html
- tests/detail-round2-functional.test.mjs
- tests/detail-round3-followup.test.mjs
- tests/detail-round3-followup-qa.md
