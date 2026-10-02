# 2026-10-01 local renewal QA

- Local preview only, no push or deployment
- Tested home, AR 1/2-hour, story film, legacy making film and AR/story calculators at 320 / 390 / 768 / 1440px: no horizontal overflow, no broken loaded images, no console errors
- 390 × 650: AR price and both primary CTAs are above the bottom bar
- Mobile pointer clicks on 1/2-hour calculator cards preserve scrollY=0, totals change 12/16만원
- AR detail 2-hour selection → consultation CTA → calculator 16만원 → bride entrance option → 20만원 → copied consultation includes 2시간 / 160,000 / +40,000 / 200,000
- Story calculator 35만원 → making change → 28만원, existing options and copy-confirmation flow retained
- FAQ expands, menu closes on navigation, case next button changes 01/03 → 02/03, internal URLs remain path-based
- Browser uses prefers-reduced-motion: reduce, animation dependencies and cursor are intentionally skipped in that environment
- Unit tests exercise normal desktop/mobile motion setup, reduced-motion fallback, failed dependency fallback and navigation teardown
- Protected Meta / GA4 / contact API SHA256 hashes remain identical, their cache versions remain 20260929-path-1
- Live Meta / GA4 receiving cannot be tested on localhost because the existing local-preview guard intentionally skips external transmission
# 2026-10-02 — Depth / typography / floating controls

- 32 browser combinations: 320 / 390 / 768 / 1440px × home, location, about, AR solo, AR duo, story film, price, before-after
- Document horizontal overflow and heading internal overflow: 0 in every combination, road address fits one line at 320px
- Explicit per-site motion opt-in under OS reduced motion: live record matrix3d changes between frames, actual pointer click on scene caption sets tilt -7.01 / -8.31 degrees, craft photo caption sets card rotateX -3.36 degrees
- Menu hides floating controls, closing restores them, floating price opens the correct story calculator at 350000 KRW, consultation only opens the existing copy-confirmation dialog and no external tab
- 390×650 story first fold: price bottom 254px, consultation controls bottom 367px, floating controls begin 538px, no first-fold CTA overlap
- Added studio-depth unit regression covers decorative structure, address grouping, button-only motion toggle selection, reduced-motion explicit opt-in and observer/listener/frame teardown
- Tracking source hash checks and Meta / GA4 / AR commerce / renewal unit tests pass, no deployment or push

## 2026-10-02 — 21 browser comments

- Responsive iframe CSS widths 320/390/768/1440/3030 × home, SOLO, DUET, both AR calculators and story film: 30 checks, no internal horizontal overflow
- Widths exclude the browser's visible scrollbar for available content measurement; document scrollWidth equals body width in each frame
- Mobile CTA remains above 650px; final 390px AR CTA bottom 458px after restoring meaningful line breaks
- Desktop product cards about 271px high, showcase videos 560×315px; mobile product cards about 225/248px high with 125px images
- Three own pre-existing YouTube video IDs connected with click-loaded iframe and separate YouTube fallback link
- Each craft item opens its corresponding real directing/tuning/mixing image and closes the other items
- Audio comparison plays 1:25 source, switches to TUNED and remains playing, no console errors
- AR DUET selection updates 160000 price, 120 minutes, DUET(2인) text and both detail/floating calculator URLs
- DUET plus lyric video copies 200000 KRW with 1곡 기준 and 2인; first click opens dialog only and leaves external tabs unchanged
- Price breakdown always rendered as non-collapsible section, product label and dark footer message verified
- Protected tracking hashes, all five unit suites, JavaScript syntax and Git whitespace checks pass; no push or deployment
