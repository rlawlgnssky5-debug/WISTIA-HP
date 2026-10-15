# Inquiry draft persistence and compact mobile scale — 2026-10-15

## Behavior

- Functional drafts stay in this browser's localStorage, never posted to the website server
- 7-day expiry, versioned and separate SOLO/DUET route keys
- Allowlisted person choice, discovery, partial wedding selectors/unknown mode, booking date/time, rush, lyric video, notes, step and date/time panel state
- No name, phone, email, retired extra verse, stored price or arbitrary extra fields
- Corrupt/blocked storage safely falls back, explanatory note reflects unavailable storage
- Restored date/time rechecked against availability, newly unavailable selections cannot bypass final validation
- Mobile only: h1 26→22px, step heading 22→18px, nav 15→14px, time 15→14px, person price 18→16px, spacing reduced
- Native selects and textarea remain 16px, nav touch targets at least 50px, browser pinch zoom remains available
- PC type sizes/layout preserved

## Verification

14 focused regression scripts passed: booking-draft, booking-mobile-scale, five-step-inquiry, booking-schedule-switch, calendar-no-team-labels, booking-availability-ui, calendar-refresh-safety, booking-six-steps-capacity, booking-amount-animation, notion-availability, notion-personal-busy, contact-validation, consult-choice, site-layout-safety

New JS syntax checks and static route generation passed

Actual local browser reload checks:

- DUET selection + discovery + partial wedding year/month + step 2 restored
- Full date, 15:00–17:00, rush and lyric selection + step 5 + multiline notes restored, calculated total stays 230,000원
- Date re-selection view restored after reload, previous time preserved
- Wedding unknown mode and disabled date selectors restored
- Explicit DUET route draft did not overwrite SOLO-route draft
- 320/360/375/390/430/1280px × 5 steps: horizontal overflow 0, inspected controls outside viewport 0
- Mobile measured 22/18/14px headings/nav, 16px textarea, PC measured prior 26/22/15px

Local evidence: tests/qa/draft-mobile-matrix-20261015.json and tests/qa/draft-mobile-local-390-20261015.png

No customer messages sent or ledger records changed, phone hardware/Safari keyboard auto-zoom not directly tested

## Deployment

Pending commit and public verification
