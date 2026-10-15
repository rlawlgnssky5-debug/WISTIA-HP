# Recording calendar / time panel switch — 2026-10-15

## Scope

- Mon/Tue/Wed stay disabled, with no visible closure badge, accessible labels say 휴무
- True booking closures retain 마감, remaining-team labels stay absent
- Date selection immediately replaces the calendar with the hourly time panel in the same slot
- 날짜 다시 선택 restores the calendar without clearing the existing selection
- Choosing the same date restores its selected time, choosing a different date clears the old time
- Recording date and time validation remains visible, async availability updates do not close a manually reopened calendar
- Existing pricing, rush, lyric video, duration, Notion read-only access and collision checks unchanged

## Automated verification

Passed: booking-schedule-switch, calendar-no-team-labels, five-step-inquiry, booking-availability-ui, calendar-refresh-safety, booking-six-steps-capacity, booking-amount-animation, notion-availability, notion-personal-busy, contact-validation, consult-choice, site-layout-safety

JavaScript syntax checks passed, 30 static routes regenerated

## Browser verification

- SOLO: actual calendar → time → calendar → same date, preserved 15:00 selection
- Different date: 10/22 → 10/25 clears the previous time
- Sunday 18:00–22:00 remains disabled with line-through and 마감
- 320/375/390/1280/1440px: calendar and time occupy the same document slot, horizontal overflow 0
- DUET 320/390/1280px: 15:00–17:00 and total 160,000원 preserved
- Advancing with no time shows 시작 시간을 골라주세요 in the visible time panel
- Options → recording return preserves the selected time panel
- Direct local inquiry tab console errors 0
- Responsive iframe harness recorded one MutationObserver error on iframe navigation, no such observer exists in the delivered app sources, direct inquiry tab did not reproduce it
- Evidence (local only): tests/qa/schedule-switch-widths-20261015.json and tests/qa/schedule-switch-duo-20261015.json

No actual customer messages sent, no ledger rows changed, no phone hardware testing claimed

## Deployment

Pending final commit, Vercel status and public verification
