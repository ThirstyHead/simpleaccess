# SimpleAccess Website Refactoring Plan (Page-by-Page)

Plan Prefix: `2026-09-24_105146-website-refactor`
Location: `/Users/scott/code/local/simpleaccess`
Target Implementer: Local Gemma-4-31B Dense or Gemma-4-26B MoE Model (or Hermes Agent)

---

## 0. How to Resume After Context Loss

1. Read this plan file completely: `.hermes/plans/2026-09-24_105146-website-refactor.md`.
2. Read the resume state file: `.hermes/plans/2026-09-24_105146-website-refactor-RESUME.md`.
3. Read the progress log: `.hermes/plans/2026-09-24_105146-website-refactor-PROGRESS.md`.
4. Run the state probe commands listed in `RESUME.md`.
5. **STOP-AND-ASK RULE**: If any state probe command contradicts what is recorded in `RESUME.md`, do not guess. Stop immediately, document the discrepancy, and ask the user for guidance.

---

## 1. Write-Out & Resume Protocol

Because this plan will be executed page-by-page by local models (Gemma-4-31B dense or Gemma-4-26B MoE):
1. Work in bounded batches (1 to 15 pages per task) to remain well within local context windows and compute limits.
2. For each task:
   - Create feature branch: `git checkout -b <branch-name>`.
   - Apply the standardized Design System template recipe from Section 5.
   - Eliminate redundant inline `<style>` tags in favor of `<link rel="stylesheet" href="/assets/ds/simpleaccess.css">` and `<script type="module" src="/assets/ds/simpleaccess.js" defer></script>`.
   - Run the validation command: `npm test` (or `node scripts/audit-pages.mjs`).
   - Append PROGRESS entry with exact page counts and test status.
   - Rewrite RESUME whole with current task index and next command.
   - Commit: `git commit -am "<task-commit-message>"`.
   - Open PR or request user approval to merge.

---

## 2. Goal

Refactor all 146 HTML pages across `https://simpleaccess.io/` to eliminate design drift, unify the styling under the SMACSS SimpleAccess Design System (`simpleaccess-ds`), replace duplicate navigation/header/footer boilerplate with native `<ds-*>` Web Components, and achieve 100% WCAG 2.2 AA compliance across sight, sound, and touch.

---

## 3. Current Context & Verified Facts

- Repository root: `/Users/scott/code/local/simpleaccess`
- Current Baseline Tag: `v1.0.0` (commit `2b7cde6`)
  - Re-verify: `git -C /Users/scott/code/local/simpleaccess describe --tags` (Expect: `v1.0.0`)
- Current Page Inventory: 146 HTML pages:
  - Homepage: 1 page (`index.html`)
  - Topic Guides: 18 pages (`guides/wcag/`, `guides/screenreaders/`, `guides/office/`, `guides/adobe/pdf/`, `guides/makingof/`)
  - Sensory Lab: 22 pages (`sensory-lab/` overview + 7 labs with accessible/inaccessible pairs)
  - HTML Reference Series: 105 pages (`html/index.html` + 104 element reference pages)
- Source of Design System: `/Users/scott/code/local/simpleaccess-ds/dist/`
  - CSS: `simpleaccess.css` (Base, Layout, Module, State, Theme, Tokens)
  - JS: `simpleaccess.js` (Web Components `<ds-header>`, `<ds-nav>`, `<ds-footer>`, Sensory helper)
- Deployment runtime: Pure static site served via Caddy (`Caddyfile`). Zero runtime build step required.

---

## 4. Architecture & Transformation Pattern

### 4.1 Asset Delivery
To maintain lean web principles and zero build complexity:
The compiled artifacts from `simpleaccess-ds` are placed in:
`/Users/scott/code/local/simpleaccess/assets/ds/`
- `/assets/ds/simpleaccess.css`
- `/assets/ds/simpleaccess.js`
- `/assets/ds/tokens.json`

### 4.2 Standard Page Anatomy (For Gemma Models)
Every refactored page follows this exact structure:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>[Page Title] | SimpleAccess.io</title>
    
    <!-- SimpleAccess Design System: WCAG 2.2 AA Multi-Sensory Standards -->
    <link rel="stylesheet" href="/assets/ds/simpleaccess.css">
    <script type="module" src="/assets/ds/simpleaccess.js" defer></script>
</head>
<body>

    <!-- Accessible Skip Link: SC 2.4.1 Bypass Blocks -->
    <a href="#main-content" class="m-skip-link">Skip to main content</a>

    <!-- Global Header Component -->
    <ds-header></ds-header>

    <!-- Global Nav Component (dynamically resolves aria-current="page") -->
    <ds-nav></ds-nav>

    <!-- Page Specific Main Content -->
    <main id="main-content" class="l-main">
        <!-- Content organized using SMACSS .l-* and .m-* classes -->
    </main>

    <!-- Global Footer Component -->
    <ds-footer></ds-footer>

</body>
</html>
```

---

## 5. Gemma Model Implementation Recipes

### 5.1 Recipe A: Topic Guide Pages (`guides/*`)
Used for WCAG principles, Screen Readers, MS Office, and Adobe PDF guides.
- Replace inline `<style>` and hardcoded header/nav/footer with `<ds-header>`, `<ds-nav>`, `<ds-footer>`.
- Wrap main article content in `<article class="l-container">`.
- Use `.m-card` for callouts and sub-topic links.
- Use `.m-badge` for WCAG Level badges (e.g. `Level AA`).

### 5.2 Recipe B: HTML Element Reference Pages (`html/*`)
Used for all 105 pages in the HTML elements series.
- Keep the specific educational explanation, demo box, code block, and spec link intact!
- Wrap the demo box in `<div class="m-demo">`.
- Wrap syntax in `<pre class="m-code-block"><code>...</code></pre>`.
- Use `<a class="m-ref-link" target="_blank" rel="noopener noreferrer">` for W3C/WHATWG spec links.
- Remove all inline `style="..."` attributes on navigation and headers.

### 5.3 Recipe C: Sensory Lab Pages (`sensory-lab/*`)
Used for Sensory Lab comparison pages.
- **CRITICAL RULE**: Do NOT "fix" the accessibility barriers on the `inaccessible/` subpages! Those are intentionally inaccessible teaching tools.
- Refactor the outer page chrome (header, nav, footer, layout containers) to use the design system while preserving the exact inner barrier demonstration markup.
- For `accessible/` subpages, ensure all positive sensory cues (earcon trigger, tactile haptic response, high contrast) are highlighted.

---

## 6. Test Suite & Validation Strategy

Before starting page refactoring, create a lightweight automated test script:
`scripts/audit-site.mjs`
Runs with Node native test runner:
- Validates all HTML files parse cleanly without unclosed tags.
- Verifies that every page links to `/assets/ds/simpleaccess.css` and `/assets/ds/simpleaccess.js`.
- Verifies that every page contains `<a href="#main-content" class="m-skip-link">` and `<main id="main-content"`.
- Verifies that every page specifies `<html lang="en">` and `<meta name="viewport"`.
- Checks for broken internal links.

Command to run:
`node scripts/audit-site.mjs`

---

## 7. Step-by-Step Refactoring Batches

### Task 0: Infrastructure & Design System Asset Integration
- **Suggested Model**: `gemma-4-31b` (Dense) — High reasoning required to import compiled assets, author test runner `scripts/audit-site.mjs`, and verify test pipeline.
- **Branch**: `refactor/ds-asset-integration`
- **Actions**:
  1. Build latest `simpleaccess-ds` artifacts.
  2. Copy `dist/simpleaccess.css` and `dist/simpleaccess.js` into `/Users/scott/code/local/simpleaccess/assets/ds/`.
  3. Author `scripts/audit-site.mjs` test runner.
  4. Verify static serving via Caddyfile or test server.
- **Verification Command**:
  - `node scripts/audit-site.mjs --smoke`
- **Expected Output**: Asset files exist; smoke audit passes.
- **Bookkeeping**: Append PROGRESS, rewrite RESUME, commit `chore: import simpleaccess-ds assets and audit runner`.

### Task 1: Refactor Homepage (`index.html`)
- **Suggested Model**: `gemma-4-31b` (Dense) — High structural complexity: hero layout, cards, test-suite table, and multi-sensory audio/haptic trigger wiring.
- **Branch**: `refactor/homepage`
- **Actions**:
  1. Update `/Users/scott/code/local/simpleaccess/index.html` to link `/assets/ds/simpleaccess.css` and `/assets/ds/simpleaccess.js`.
  2. Replace inline `<style>` block with design system styles.
  3. Verify hero module, grid layout, cards, and test-suite table render perfectly.
  4. Add sensory delight triggers to the hero buttons (earcon audio + tactile haptic tick).
- **Verification Commands**:
  - `node scripts/audit-site.mjs --file index.html`
- **Expected Output**: Pass.
- **Bookkeeping**: Append PROGRESS, rewrite RESUME, commit `refactor: unify homepage with simpleaccess-ds`.

### Task 2: Refactor Core Guides & Making Of (2/6 pages complete)
- **Status**: Partially Complete (2/6 passed: `guides/makingof/index.html` and `guides/wcag/index.html`). 4 sub-guides were skipped by earlier batch execution and moved to Task 2-R.

### Task 2-R (Remediation): Refactor WCAG Principle Sub-Guides (4 pages)
- **Assigned Model**: `gemma-4-31b` (Dense) — Core educational architecture: POUR sub-guides requiring clean Recipe A layout, removal of inline styles, and correct relative asset/nav paths.
- **Branch**: `refactor/wcag-principles`
- **Pages**:
  - `guides/wcag/perceivable/index.html`
  - `guides/wcag/operable/index.html`
  - `guides/wcag/understandable/index.html`
  - `guides/wcag/robust/index.html`
- **Actions**:
  1. Apply Recipe A (Topic Guide Template) to all 4 pages.
  2. Strip inline `<style>` blocks.
  3. Wire up `<ds-header>`, `<ds-nav>`, skip-link, and `<ds-footer>`.
- **Verification Commands**:
  - `node scripts/audit-site.mjs --dir guides/wcag`
- **Expected Output**: 5/5 pages in `guides/wcag` pass audit (0 errors).
- **Bookkeeping**: Append PROGRESS, rewrite RESUME, commit `refactor: complete wcag principle sub-guides (Task 2-R complete)`.

### Task 3: Refactor Screen Reader Guides (7 pages)
- **Status**: COMPLETED (7/7 passed, merged via PR #6).
- **Model**: `gemma-4-26b` (MoE) / verified.
- **Pages**:
  - `guides/screenreaders/index.html`
  - `guides/screenreaders/macos/voiceover/index.html`
  - `guides/screenreaders/ios/voiceover/index.html`
  - `guides/screenreaders/narrator/index.html`
  - `guides/screenreaders/nvda/index.html`
  - `guides/screenreaders/jaws/index.html`
  - `guides/screenreaders/android/talkback/index.html`

### Task 4: Refactor Productivity Guides: Office & PDF (5 pages)
- **Status**: COMPLETED (5/5 passed, merged via PR #7).
- **Model**: Reconciled & completed via `gemma-4-31b` / web-developer.
- **Pages**:
  - `guides/office/index.html`
  - `guides/office/word/index.html`
  - `guides/office/excel/index.html`
  - `guides/office/powerpoint/index.html`
  - `guides/adobe/pdf/index.html`

### Task 5: Refactor Sensory Lab Hub & Comparison Suites (15/22 pages complete)
- **Status**: Partially Complete (15/22 passed, merged via PR #5; legacy Word export artifacts and duplicates pruned). 7 pages moved to Task 5-R.

### Task 5-R (Remediation): Refactor Sensory Lab Hubs & Alt-Text Accessible (7 pages)
- **Assigned Model**: `gemma-4-31b` (Dense) — High constraint: Lab hub overviews and fixing `alt-text/accessible/index.html` without altering any broken demos in `inaccessible/` subpages.
- **Branch**: `refactor/sensory-lab-hubs`
- **Pages**:
  - `sensory-lab/alt-text/index.html`
  - `sensory-lab/alt-text/accessible/index.html`
  - `sensory-lab/bread/index.html`
  - `sensory-lab/document-language/index.html`
  - `sensory-lab/empty-buttons/index.html`
  - `sensory-lab/empty-links/index.html`
  - `sensory-lab/form-labels/index.html`
- **Actions**:
  1. Apply Recipe A/C to the 6 lab hub pages.
  2. Fix missing design system assets and navigation in `sensory-lab/alt-text/accessible/index.html`.
  3. Ensure all links point to existing routes (`accessible/`, `inaccessible/`).
- **Verification Commands**:
  - `node scripts/audit-site.mjs --dir sensory-lab`
- **Expected Output**: 22/22 pages in `sensory-lab` pass audit (0 errors).
- **Bookkeeping**: Append PROGRESS, rewrite RESUME, commit `refactor: complete sensory lab hubs and accessible demos (Task 5-R complete)`.

### Task 6: Refactor HTML Reference Series (105 pages in Sub-Batches)
- **Assigned Model**: `gemma-4-31b` (Dense) across all sub-batches — Reassigned from `gemma-4-26b` to enforce rigorous software engineering practice, verified audits per file, and zero-drift batch execution.
- **Sub-Task 6A: Sectioning & Grouping (16 pages)**
  - Assigned Model: `gemma-4-31b` (Dense)
  - Branch: `refactor/html-sectioning-grouping`
  - Elements: `body`, `article`, `section`, `nav`, `aside`, `h1`-`h6`, `hgroup`, `header`, `footer`, `address`, `p`, `hr`, `pre`, `blockquote`, `ol`, `ul`, `menu`, `li`, `dl`, `dt`, `dd`, `figure`, `figcaption`, `main`, `div`
- **Sub-Task 6B: Text-Level Semantics (29 pages)**
  - Assigned Model: `gemma-4-31b` (Dense)
  - Branch: `refactor/html-text-semantics`
  - Elements: `a`, `em`, `strong`, `small`, `s`, `cite`, `q`, `dfn`, `abbr`, `ruby`, `rt`, `rp`, `data`, `time`, `code`, `var`, `samp`, `kbd`, `sub`, `sup`, `i`, `b`, `u`, `mark`, `bdi`, `bdo`, `span`, `br`, `wbr`
- **Sub-Task 6C: Forms & Interactive (17 pages)**
  - Assigned Model: `gemma-4-31b` (Dense)
  - Branch: `refactor/html-forms-interactive`
  - Elements: `form`, `label`, `input`, `button`, `select`, `datalist`, `optgroup`, `option`, `textarea`, `output`, `progress`, `meter`, `fieldset`, `legend`, `details`, `summary`, `dialog`
- **Sub-Task 6D: Embedded & Media (11 pages)**
  - Assigned Model: `gemma-4-31b` (Dense)
  - Branch: `refactor/html-media`
  - Elements: `picture`, `source`, `img`, `iframe`, `embed`, `object`, `video`, `audio`, `track`, `map`, `area`
- **Sub-Task 6E: Tabular Data (10 pages)**
  - Assigned Model: `gemma-4-31b` (Dense)
  - Branch: `refactor/html-tables`
  - Elements: `table`, `caption`, `colgroup`, `col`, `tbody`, `thead`, `tfoot`, `tr`, `td`, `th`
- **Sub-Task 6F: Metadata, Scripting, and Hubs (22 pages)**
  - Assigned Model: `gemma-4-31b` (Dense)
  - Branch: `refactor/html-meta-scripting`
  - Elements: `html`, `head`, `title`, `base`, `link`, `meta`, `style`, `script`, `noscript`, `template`, `slot`, `canvas`, `html/index.html`
- **Verification Commands**:
  - `node scripts/audit-site.mjs --dir html`
- **Expected Output**: All 105 element pages pass audit.
- **Bookkeeping**: Append PROGRESS, rewrite RESUME, commit after each sub-task.

### Task 7: Full-Site WCAG 2.2 AA Audit & Baseline Release
- **Assigned Model**: `gemma-4-31b` (Dense) — Comprehensive multi-page reasoning: full-site regression triage, link checking, WCAG 2.2 AA verification, and release tag orchestration.
- **Branch**: `refactor/final-validation`
- **Actions**:
  1. Run full-site audit across all 146 pages.
  2. Validate 0 broken links, 0 missing landmarks, 0 color contrast failures.
  3. Clean up any leftover temporary files (e.g. `~$index.html`).
  4. Tag release: `git tag -a v2.0.0 -m "simpleaccess.io v2.0.0 - design system refactor complete"`.
- **Verification Commands**:
  - `node scripts/audit-site.mjs --all`
- **Expected Output**: 146/146 pages PASS.
- **Bookkeeping**: Append PROGRESS, rewrite RESUME, commit `release: v2.0.0 design system refactor`.

---

## 8. Manual Verification Checklist for Final Pass

- [ ] Every page links to `/assets/ds/simpleaccess.css` and `/assets/ds/simpleaccess.js`.
- [ ] No inline `<style>` tags remain on any page (except intentional inaccessible demos in sensory-lab).
- [ ] Active navigation item correctly highlights with `aria-current="page"`.
- [ ] Skip links work smoothly on every single page.
- [ ] VoiceOver screen reader test passes cleanly on guides and reference pages.
- [ ] Zero broken relative links.

---

## 9. Risks, Tradeoffs & Model Guidance

### 9.1 Model Assignment Matrix (Dense Unified Architecture)
- **Gemma-4-31B Dense (Assigned to ALL Remaining Tasks)**:
  - Assigned to: **Task 2-R** (WCAG Principles Remediation), **Task 5-R** (Sensory Lab Remediation), **Task 6 (6A–6F)** (All 105 HTML reference pages), and **Task 7** (Site-wide triage & Release).
  - Rationale: High reasoning rigor, exact adherence to multi-step software engineering protocols, precise landmark placement, and prevention of multi-task batch drift.
- **Gemma-4-26B MoE (RETIRED)**:
  - Retired due to execution drift: hallucinated task completions, skipped files without running verification audits, bundled unrelated tasks, and failed to maintain progress trackers.

### 9.2 Execution Safeguards & Quality Gates for Gemma-4-31B
- **Per-File Audit Rule**: For every modified HTML file, immediately run:
  `node scripts/audit-site.mjs --file <path>`
  Never wait until the end of the batch or session to audit.
- **Directory Audit Gate**: Before committing or creating a PR, run:
  `node scripts/audit-site.mjs --dir <path>`
  Every single file in the batch must PASS with 0 errors. If any file fails, fix it immediately before committing.
- **Single-Batch Branching**: Strictly one Git branch per task/sub-task (e.g., `refactor/wcag-principles`). Never bundle changes across multiple tasks into a single commit or branch.
- **Model Context Limits**: Process 5–10 pages per prompt turn. Never attempt to refactor an entire multi-element batch in a single turn without verifying each file.
- **Educational Preservation**: Do not erase or simplify the technical explanations or WHATWG spec links on the HTML element pages.
- **Intentional Inaccessible Demos**: Gemma models must NOT "fix" the intentionally broken demos in `sensory-lab/*/inaccessible/`. Only update external chrome/assets if required by recipe.

---

## 10. Principles

1. **Deterministic Execution**: Follow Recipe A, B, or C strictly without improvising new CSS classes.
2. **Zero Regressions**: Content, code examples, and specs remain 100% intact.
3. **WCAG 2.2 AA Compliance**: Guaranteed by consuming the centralized design system.
4. **Conference-Grade Source Quality**: Markup remains an educational artifact.
