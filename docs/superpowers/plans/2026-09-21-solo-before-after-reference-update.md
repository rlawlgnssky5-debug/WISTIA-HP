# Solo Before/After and Reference Update Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add the approved Before/After audio comparison and align the solo hero, comparison table, and process carousel with the supplied references.

**Architecture:** Keep the existing hash-routed static application and isolate the imported player in its own stylesheet and script. Render the player only on the solo detail page, initialize and destroy it with the route lifecycle, and preserve every other section. Apply reference-specific hero, table, and process rules inside `.solo-detail-scope` so they cannot affect other products.

**Tech Stack:** HTML, scoped CSS, vanilla JavaScript, Web Audio API, Canvas 2D, Playwright regression tests.

**Spec:** User-approved in-chat specification dated 2026-09-21 and `wistia-before-after-section.zip/README.md` plus `ORIGINAL-SOURCE.md`.

## Global Constraints

- The solo page canvas remains 500px maximum and must not overflow at a 390px viewport.
- The top stack uses 16px side rhythm, 48px header, 36px event bar, 54px person tabs, and an approximately 447px hero on the 377px reference canvas.
- Hero lower corners are shallow, copy sits slightly above the reference baseline, and the video subject is zoomed/positioned away from the copy.
- Before/After appears immediately after brand story with `#f6f7f8` surroundings and keeps the ZIP audio behavior.
- Comparison columns use 34% general, 18% criteria, and 48% WISTIA proportions with the approved four rows.
- Process movement uses approximately 700ms easing; only the active card shows full content and adjacent cards expose only their lower summary area.
- No autoplay; AudioContext resumes only inside a user click.
- All player timers, animation frames, resize listeners, nodes, and AudioContext resources are cleaned up on route change.

---

### Task 1: Lock the approved behavior in browser tests

**Files:**
- Create: `tests/solo-approved-update.cjs`

**Interfaces:**
- Consumes: `#/detail/solo`, existing Playwright dependency and local static server.
- Produces: assertions for section order, hero geometry, table proportions, process geometry, audio behavior, errors, and reduced motion.

- [x] **Step 1: Write the failing test** for the missing Before/After section and changed reference geometry.
- [x] **Step 2: Run `node tests/solo-approved-update.cjs`** and confirm it fails because `#wistiaBeforeAfter` is absent.

### Task 2: Port the Before/After player as an isolated component

**Files:**
- Create: `css/before-after.css`
- Create: `js/before-after.js`
- Copy: `assets/audio/before-after/before.mp3`
- Copy: `assets/audio/before-after/after.mp3`
- Modify: `index.html`
- Modify: `js/app.js`

**Interfaces:**
- Consumes: `initWistiaBeforeAfter({root,beforeSrc,afterSrc})` and two MP3 assets.
- Produces: `{setMode, play, pause, destroy}` lifecycle object; DOM rooted at `#wistiaBeforeAfter`.

- [x] **Step 1: Add scoped markup** after the brand story and before the comparison table.
- [x] **Step 2: Port CSS** using current font tokens and monochrome palette, with desktop editorial columns and mobile stacking.
- [x] **Step 3: Port audio logic** while preventing AudioContext creation before user action, preserving time on tab changes, drawing decoded waveforms, exposing loading/error states, and cleaning up on route change.
- [x] **Step 4: Run the new test** and make the player assertions pass.

### Task 3: Apply the approved hero, comparison, and process geometry

**Files:**
- Modify: `css/design.css`
- Modify: `js/app.js`

**Interfaces:**
- Consumes: existing `.ar-hook-hero`, `[data-ar-compare]`, and `.solo-process-section` structures.
- Produces: reference-sized top stack, `위스티아는 다릅니다` comparison, and 700ms active-card process transitions.

- [x] **Step 1: Adjust hero crop and copy** to a shallow lower radius, slightly higher copy, and zoomed subject placement.
- [x] **Step 2: Restructure comparison markup** into 34/18/48 columns while preserving the approved row copy.
- [x] **Step 3: Restrict inactive process cards** to the approved lower summary reveal and use approximately 700ms easing.
- [x] **Step 4: Run the new test** until all reference geometry assertions pass.

### Task 4: Verify the complete page and integrate main

**Files:**
- Modify: existing regression expectations only where the approved design intentionally changes them.

**Interfaces:**
- Consumes: all solo-page tests and browser screenshots.
- Produces: clean commit on remote and local `main`.

- [x] **Step 1: Run AR CD, new update, and full solo regression suites.**
- [x] **Step 2: Capture and inspect 390px and desktop screenshots.**
- [x] **Step 3: Verify both MP3 requests return 200 and decoded audio differs.**
- [x] **Step 4: Run syntax and diff checks.**
- [ ] **Step 5: Commit, push `HEAD:main`, and fast-forward the GitHub Desktop checkout.**
