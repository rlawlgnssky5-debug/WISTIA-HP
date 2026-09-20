# WISTIA Solo AR Detail Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make `#/detail/solo` a reliable, editorial white/silver/charcoal experience with working 30·50·70·100 audio, a true silver dial, and non-overlapping responsive layouts.

**Architecture:** Keep the existing static SPA and isolate all behavior and styles under the solo-detail route. Replace the current eager four-file audio bootstrap with a selected-source state flow, then reshape the solo markup into editorial blocks controlled by container queries. Add a dedicated Playwright regression file so the route can be tested without relying on stale whole-site expectations.

**Tech Stack:** Vanilla JavaScript, CSS container queries, HTML5 Audio, Playwright through the bundled Node runtime, Python static server.

**Spec:** `docs/superpowers/specs/2026-09-21-solo-ar-detail-redesign.md`

## Global Constraints

- Only `#/detail/solo` may change visually or behaviorally.
- Use existing real customer and production assets; create no AI imagery.
- Validate 390×844, 768×1024, and 1280×720.
- Use the `.solo-detail-scope` content container, not viewport breakpoints, for internal layout changes.
- Do not commit, push, or deploy.

---

### Task 1: Audio loading and switching reliability

**Files:**
- Modify: `tests/solo-detail-redesign.cjs`
- Modify: `js/app.js`

**Interfaces:**
- Consumes: `RATIO_SOURCES`, `ratioBlobSource(ratio)`, `prepareRatioAudioSources()`, `switchRatioAudio(ratio, options)`.
- Produces: browser WAV paths, single-source initial loading, explicit ready/error UI, end-position reset, and paused-state preservation.

- [x] **Step 1: Write the failing browser assertions**

Assert that all sources end in `-web.wav`, only the selected source is requested before interaction, the player becomes ready, a paused ratio change stays paused, an active change keeps playing, and switching at `duration - 0.2` resets near zero.

- [x] **Step 2: Run the focused test and verify RED**

Run: `node tests/solo-detail-redesign.cjs --audio`

Expected: failure on original WAV paths and end-position behavior.

- [x] **Step 3: Implement the audio state flow**

Change `RATIO_SOURCES` to the four `voice-*-web.wav` files. Cache fetch promises and Blob URLs by ratio. Load only `voiceRatio` during setup, wait for `canplay`, and add a visible error state. Make `switchRatioAudio(ratio,{play})` preserve playback only when requested and reset ended/near-ended positions to zero.

- [x] **Step 4: Run the focused test and verify GREEN**

Run: `node tests/solo-detail-redesign.cjs --audio`

Expected: all audio assertions pass and each sample advances with `muted=false`, `volume=1`, and no media error.

### Task 2: Editorial page composition and HERO/benefit layout

**Files:**
- Modify: `tests/solo-detail-redesign.cjs`
- Modify: `js/app.js`
- Modify: `css/design.css`

**Interfaces:**
- Consumes: `arHookHero()`, `arPrimaryBenefit()`, `reviews()`, `arExpertStory()`.
- Produces: `.solo-editorial-sheet`, asymmetric section blocks, explicit HERO crop rules, and 430px container-query benefit layout.

- [x] **Step 1: Add failing structure and computed-layout assertions**

Assert that reviews and expert content share one editorial wrapper; the canvas background is charcoal; the 500px content container uses a two-column benefit grid; the 390px viewport uses the narrow fallback; and no page-level horizontal overflow exists.

- [x] **Step 2: Run the layout assertions and verify RED**

Run: `node tests/solo-detail-redesign.cjs --layout`

Expected: failure because the benefit is always vertical and no editorial wrapper exists.

- [x] **Step 3: Implement markup grouping and scoped CSS**

Wrap reviews plus expert story in `.solo-editorial-sheet`. Apply the black stage, offset white/silver blocks, HERO 4:5 sizing and explicit object positions. Define the benefit as `55fr 8fr 37fr` at `@container solo-detail (min-width:430px)` and stack below it.

- [x] **Step 4: Run layout assertions and verify GREEN**

Run: `node tests/solo-detail-redesign.cjs --layout`

Expected: all structure, column, crop, and overflow assertions pass at all three viewports.

### Task 3: Comparison, expert panel, and seven-step process

**Files:**
- Modify: `tests/solo-detail-redesign.cjs`
- Modify: `js/app.js`
- Modify: `css/design.css`

**Interfaces:**
- Consumes: `arComparisonSection()`, `initExpertSplitPanel()`, `soloProcessSlider()`, `initSoloProcessSlider()`.
- Produces: fixed comparison arrows, readable 35:65 panels, approved process copy, and pointer/keyboard slider controls.

- [x] **Step 1: Add failing interaction assertions**

Assert four comparison rows with permanently visible center arrows, 35:65 expert width reversal after click, seven process cards with six real images and one `약 7일` information card, approved intro copy, and ArrowRight movement.

- [x] **Step 2: Run the interaction assertions and verify RED**

Run: `node tests/solo-detail-redesign.cjs --content`

Expected: failure on comparison arrow placement, process copy, duration-card copy, and drag behavior.

- [x] **Step 3: Implement the minimal content and interaction changes**

Remove comparison focus/dimming behavior, insert a fixed arrow between cells, strengthen expert gradients and image positions, change the process intro, display `약 7일`, and add pointer-drag scrolling while keeping native trackpad/touch scrolling.

- [x] **Step 4: Run interaction assertions and verify GREEN**

Run: `node tests/solo-detail-redesign.cjs --content`

Expected: all comparison, expert, and process assertions pass.

### Task 4: Brushed-silver dial and CTA policy

**Files:**
- Modify: `tests/solo-detail-redesign.cjs`
- Modify: `js/app.js`
- Modify: `css/design.css`
- Modify: `index.html`

**Interfaces:**
- Consumes: `soloArRatioSection()`, `initSoloArRatio()`, `soloDesktopCta`.
- Produces: `.solo-ratio-dial`, four ratio buttons, keyboard/pointer selection, one price CTA, desktop CONTACT-only helper, and mobile inline contact.

- [x] **Step 1: Add failing dial and CTA assertions**

Assert there is no range input, there are four ratio buttons, ArrowRight changes 70 to 100, direct selection stops automatic comparison, only the sticky price CTA is visible, desktop shows CONTACT without PRICE, and mobile has no fixed Kakao overlay.

- [x] **Step 2: Run the assertions and verify RED**

Run: `node tests/solo-detail-redesign.cjs --controls`

Expected: failure because the page still uses a range and duplicate desktop/mobile fixed controls.

- [x] **Step 3: Implement the dial and CTA behavior**

Render a focusable central dial plus four surrounding buttons. Use CSS radial/conic/repeating-linear gradients for brushed metal. Map click, ArrowLeft/ArrowRight, and pointer angle to the four steps. Remove the FAQ price CTA, hide the global floating Kakao on solo mobile, and make the desktop helper CONTACT-only.

- [x] **Step 4: Run the assertions and verify GREEN**

Run: `node tests/solo-detail-redesign.cjs --controls`

Expected: all dial, auto-compare cancellation, and CTA assertions pass.

### Task 5: Full verification and visual QA

**Files:**
- Modify: `index.html`
- Modify: `tests/solo-detail-redesign.cjs`
- Create: `tests/qa/solo-redesign-390.png`
- Create: `tests/qa/solo-redesign-768.png`
- Create: `tests/qa/solo-redesign-1280.png`

**Interfaces:**
- Consumes: completed solo route.
- Produces: current cache versions, test report, and three visual QA artifacts.

- [x] **Step 1: Run JavaScript and focused regression checks**

Run: `node --check js/app.js`

Run: `node tests/solo-detail-redesign.cjs`

Expected: syntax success and all focused assertions pass.

- [x] **Step 2: Run existing suites and classify baseline failures**

Run: `node --test tests/desktop-layout.test.mjs`

Run: `node tests/redesign-qa.cjs`

Expected: no new solo-detail failures; report the two pre-existing baseline failures separately if unchanged.

- [x] **Step 3: Capture and inspect exact-size screenshots**

Capture full-page screenshots at 390×844, 768×1024, and 1280×720. Inspect HERO crop, all editorial transitions, comparison arrows, process card peeking, dial labels, fixed controls, and horizontal overflow.

- [x] **Step 4: Confirm repository state**

Run: `git diff --check` and `git status --short`.

Expected: only the approved source, test, plan/spec, and QA artifact changes; no commit, push, or deployment.
