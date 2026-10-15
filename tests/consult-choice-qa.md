# Floating consultation chooser — 2026-10-15

- Cause: the floating yellow link pointed straight to Kakao, while the existing chooser was only wired to product-inquiry links
- Restored floating button interception and a distinct choice dialog, no changes to copy-confirmation or event dialogs
- Direct choice: 일단 상담부터 받을래요! → configured Kakao channel
- Form choice: 문의 양식 작성하고 상담받을래요! → SOLO / DUET form matching current detail, generic pages → /contact
- Visible 40px close button, Escape handling, background inert state and focus return to the yellow button
- Design uses warm rose/white and a pale yellow Kakao card with actual SVG icons
- 320 / 360 / 375 / 390 / 1280 / 1440 CSS px: two choices, visible close control, dialog stays inside viewport, no horizontal overflow
- Actual SOLO form navigation and DUET form link checked, actual Kakao destination opened and verified, no custom inquiry text submitted
- Chooser, question-card/Kakao, five-step inquiry and contact validation regressions passed
- Legacy browser suite expectations updated for the new chooser, that old suite was not run via terminal browser automation
