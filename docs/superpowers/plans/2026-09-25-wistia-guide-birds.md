# WISTIA Songbird Guide Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Apply the approved 18-scene songbird guide to the current WISTIA hash SPA, then add global pointer following as a later task.

**Architecture:** A single fixed, click-through guide layer holds cream Lead and optional grey Harmony. One controller maps the current route and visible sections to poses, motion clips, sizes and targets; route teardown clears timers/listeners before the next page is rendered. CSS owns responsive positioning and reduced-motion behavior.

**Tech Stack:** Existing vanilla JS/CSS hash SPA; transparent PNG and animated WebP assets with GIF fallbacks; native IntersectionObserver and requestAnimationFrame.

**Spec:** [Approved Notion 18-scene plan](https://app.notion.com/p/2026-09-24-3e5d501433cd8157a115e550a22ae315) and `AGENTS.md`. Asset handoff document: `C:/Users/leeeb/Documents/Codex/2026-09-23/brin/outputs/wistia-songbird/GPT_HANDOFF_KO.md`.

## Global Constraints

- Keep existing cards, pricing, audio, CTA and page transitions intact.
- Do not add React/Vite/Framer Motion or require Lottie files that are absent.
- Use one cream bird on solo/home/about/FAQ and a cream/grey pair on duo/wedding/proposal; grey is 8–12% smaller and staggered 80–120 ms.
- Use animated WebP for brief bird motion; use CSS/JS for section movement, transforms, state and FAB avoidance.
- Support 320px, 390px and 1440px; respect `prefers-reduced-motion`.
- Global cursor pursuit is a later task. Card-local pointer following from scene 03 remains in this plan.

---

### Task 1: Asset and layer foundation

**Files:** Create `assets/guide/bird/*`, `assets/guide/motion/*`, `assets/guide/acc/*`, `js/guide-bird.js`, `css/guide-bird.css`, `tests/guide-bird.test.mjs`; modify `index.html`.

**Interfaces:** `window.WistiaGuide.mount(routeInfo)`, `window.WistiaGuide.destroy()`, `window.WistiaGuide.notify(action, detail)`.

- [ ] Write a browser-facing test fixture that loads the current page and asserts one bird on home, two on duo, no click interception and reduced-motion fallback.
- [ ] Run it and observe the expected missing-guide failure.
- [ ] Copy approved cream/grey assets, add one layer and pose/motion API, link CSS and JS in `index.html`.
- [ ] Run the test to green and check missing image requests.

### Task 2: Route and section timeline

**Files:** Modify `js/app.js`, `js/guide-bird.js`, `css/guide-bird.css`, `tests/guide-bird.test.mjs`.

**Interfaces:** `mount` receives `{type,key,purpose,home,detail,event,info}` after `app.innerHTML` is set; scenes derive from current DOM selectors.

- [ ] Add a failing test for route replacement, section activation and paired birds.
- [ ] Implement mount/destroy at the route boundary with one IntersectionObserver and scroll-position refresh.
- [ ] Map scenes 01–18 to the actual selectors, using pose swap, animated WebP and safe section positions.
- [ ] Re-run tests and verify the correct character count on solo and duo routes.

### Task 3: Interactive scenes and accessibility

**Files:** Modify `js/guide-bird.js`, `css/guide-bird.css`, `tests/guide-bird.test.mjs`.

**Interfaces:** Document event delegation for card hover/pointer, selection, sound, reviews, accordion, process, ratio and price controls. `notify` is available for interactions that need a direct route hook.

- [ ] Add failing tests for card-local follow, selection persistence, FAB non-overlap and reduced-motion.
- [ ] Implement card-local pointer following and hop, one-shot click wink/point, ratio/price/BA reactions and offscreen pausing.
- [ ] Verify mobile touch behavior, width 320/390 and keyboard interactions.

### Task 4: Full verification and delivery

**Files:** Update `AGENTS.md` work log; all changed files.

- [ ] Run JS syntax checks, guide tests, existing layout tests and `git diff --check`.
- [ ] Inspect home, solo detail, duo/wedding detail, BA, event price, about and FAQ at 320/390/1440; confirm core CTAs.
- [ ] Review every Notion scene against behavior and list any exact limitation.
- [ ] Commit on the isolated branch and open a reviewable PR. Do not merge or deploy.
