# Mobile AR and home centered presentation — 2026-10-03

## Scope

Latest request supersedes the SOLO-only gallery from the previous mobile iteration
Mobile widths up to 768px receive centered SOLO / DUET presentation and a centered vertical mobile home
Desktop markup and styles, story film, calculator and inquiry presentation are not redesigned
No prices, benefit participation conditions, delivery dates or tracking sources were changed

The AR hero contains one actual customer video, without additional photo slides, dots or counters
SOLO uses groom-wedding-song-ar.mp4 and DUET uses duo-wedding-song-ar.mp4
The former gallery script remains on disk for preservation but is neither loaded nor called
Explanatory recording images and genuine customer evidence retain distinct captions

## Actual browser frame checks

Codex browser iframe verification, not a physical iPhone or Safari test
The environment reserves 30px for the scrollbar
All three routes `/`, `/detail/solo`, `/detail/duo` were checked at every width below

| Viewport | Content | Horizontal overflow | Inspected text overflow | H1 | Mobile alignment |
| --- | --- | --- | --- | --- | --- |
| 306 | 276 | 0 | 0 | 1 | centered |
| 320 | 290 | 0 | 0 | 1 | centered |
| 360 | 330 | 0 | 0 | 1 | centered |
| 390 | 360 | 0 | 0 | 1 | centered |
| 430 | 400 | 0 | 0 | 1 | centered |
| 768 | 738 | 0 | 0 | 1 | centered |
| 1440 | 1410 | 0 | 0 | 1 | original desktop |

21 combinations total, 18 mobile combinations
All headings, paragraphs and figure captions inside the three mobile page roots resolve to centered alignment
Closed FAQ answer paragraphs were also inspected
Each of the three recording SVG waveforms has 0px offset from its parent-card center at every mobile width
1440px AR roots do not contain the mobile layout or its bottom controls

At 390px the home AR product photo is 320px wide with full uncropped 4:5 presentation
The story-film home photo uses uncropped 16:9 presentation
Home and AR bottom controls are 48px high, within a 69px fixed bar in the frame environment
Home preserves the original floating action IDs, destinations and tracking behavior

## Click checks

- SOLO at 320px: main video plays with advancing time and correct source, then pauses
- SOLO people card opens DUET with 160,000원, 2인 and 2시간
- DUET FAQ opens with the correct 2시간 guidance
- DUET at 390px: correct two-person video plays with advancing time, then pauses
- DUET quick estimate opens, bottom bar becomes hidden, close restores the page
- DUET main inquiry link opens the unified form with the DUET radio checked and 기본 가격 16만원
- No external Kakao send or inquiry submission was performed
- Home AR card opens SOLO detail
- Home creation disclosure switches to the second item and loads the existing Melodyne image
- Home before/after player starts, changes to after, pauses and retains 1:25 duration
- Home floating controls hide while the player is visible and return at the directions section
- Home menu hides bottom controls and closing the menu restores them

## Verification and limitations

18 directly executable Node regression files pass, including the updated mobile test
JavaScript syntax and Git whitespace checks pass
The desktop-layout.test.mjs standalone browser-launch test was not used in this restricted environment, actual browser checks were used instead
Final mobile preview and direct-detail error/warning logs are empty
Rapid breakpoint switching in the responsive QA frame produced an earlier player fetch-failure notice, direct/mobile playback works and the QA-frame cause is not established
No physical-device Safari verification, remote push or deployment was performed
Meta Pixel, GA4 and Kakao API source files are unchanged
App and mobile CSS cache: 20261003-mobile-center-1, 19 static route shells regenerated

## Proof and preview

- tests/qa/mobile-centered-duet-20261003.png
- tests/qa/mobile-centered-wave-20261003.png
- tests/qa/mobile-centered-expert-20261003.png
- tests/qa/mobile-centered-home-20261003.png
- http://127.0.0.1:4174/tests/mobile-solo-preview.html?page=duo
- http://127.0.0.1:4174/tests/mobile-solo-preview.html?page=home
