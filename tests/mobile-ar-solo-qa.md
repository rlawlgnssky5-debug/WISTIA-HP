# AR SOLO mobile commerce QA — 2026-10-03

## Scope

Only `/detail/solo` at viewport widths up to 768px receives the new layout
The existing desktop renderer, DUET, story film, home, calculator, inquiry and tracking files remain unchanged in this task
The shared renderer now passes its existing desktop HTML to the mobile renderer only for SOLO at the mobile breakpoint

Layout: large video/photo gallery → product and price → people selection → gift/benefit strip → product-information table → detail tabs → POINT 01–05 → actual reviews and existing information
No copied Coupang logos, ratings, counts, cart or checkout
Photos used to explain recording are labeled as explanatory images

## Browser layout checks

Actual Codex browser iframe checks, not physical iPhone/Safari tests
The test environment reserves 30px for the scrollbar

| Viewport | Content | Mobile layout | Horizontal overflow | Inspected clipped text | H1 |
| --- | --- | --- | --- | --- | --- |
| 306 | 276 | yes | 0 | 0 | 1 |
| 320 | 290 | yes | 0 | 0 | 1 |
| 360 | 330 | yes | 0 | 0 | 1 |
| 390 | 360 | yes | 0 | 0 | 1 |
| 430 | 400 | yes | 0 | 0 | 1 |
| 768 | 738 | yes | 0 | 0 | 1 |
| 1440 | 1410 | no | 0 | 0 | 1 |

Inspected elements: summary H1, price, variant rows, information values, bottom buttons, POINT headings/badges, vocal player time/tab labels and explanation badge
After final recording-photo changes, repeated 320/390/430 checks found no overflow, one H1, new bar visible and original floating bar hidden
Recording photos displayed in one column at widths 258/320/360px respectively
Crossing 768px in both directions rebuilt only SOLO and maintained one H1 and one set of player IDs
Direct local detail tab at 894px had no mobile layout, no horizontal overflow and no error/warning logs

## Interaction checks

- Gallery dot buttons advanced 1/3 → 2/3 and right arrow advanced 2/3 → 3/3
- SOLO customer video played from `groom-wedding-song-ar.mp4`, moving to a photo paused it
- Gallery includes no automatically cycling timer; native touch scrolling uses scroll snap
- Menu and quick-estimate dialog hid the new bottom action bar
- Quick estimate AR → 1 person → no options → no events returned 120,000원 and linked to `/event/solo`, focused `contact-name`, with one native form and no mobile detail bar
- Direct bottom inquiry link opened `/event/solo`, one form, no duplicate detail bar
- Mobile DUET link opened the untouched `/detail/duo`, displayed 160,000원 and `duo-wedding-song-ar.mp4`, no new mobile layout
- Story film still had one H1 and no new mobile layout
- Detail tab reached the new cover, POINT labels remained 01–05 and reviews followed the POINT section
- Vocal player played, selected after audio (`aria-pressed=true`) and paused
- AR ratio changed 70% → 69%, play/pause button changed state, error status remained hidden
- Existing copy-confirm dialog/Kakao handoff implementation was not changed and no external Kakao transmission was performed

## Automated checks

18 direct-run Node regression files passed, including the new `mobile-ar-solo.test.mjs`
The new test verifies mobile-only branching, preserved desktop/DUET output, unique headings/player/section IDs, truthful prices/fees, gallery photo assets, pause-on-exit, dot/keyboard controls, reduced-motion behavior, width-change alignment and complete listener cleanup
JS syntax checks and `git diff --check` passed
The separate Edge-launch desktop-layout script was not run; relevant layout was checked in the actual browser

## Log limitations

Iframe inspection emitted the previously recorded source-less MutationObserver error
During rapid route changes, the previous shared before/after player emitted fetch failures as its page was replaced
No matching MutationObserver call exists in the site source and the precise origin is not confirmed
Current player controls and playback worked, with the AR error message hidden
Direct local detail tab error/warning logs were empty

## Proof and handoff

- `tests/qa/mobile-solo-commerce-20261003.png` — gallery and product name with fixed actions
- `tests/qa/mobile-solo-product-20261003.png` — price, variants and gift benefit strip
- `tests/qa/mobile-solo-point-20261003.png` — POINT 01 heading and large recording image
- Preview: http://127.0.0.1:4174/tests/mobile-solo-preview.html
- Product: http://127.0.0.1:4174/detail/solo

App and new CSS/gallery cache: `20261003-mobile-solo-1`, 19 static HTML shells regenerated
No push, commit or production deployment performed
