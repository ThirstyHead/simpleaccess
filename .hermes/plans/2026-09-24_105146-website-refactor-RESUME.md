# Resume State: SimpleAccess Website Refactor

Plan: `2026-09-24_105146-website-refactor`
Location: `/Users/scott/code/local/simpleaccess`
Last Updated: 2026-09-25

## Current State
- Current Task Index: Task 2-R (`Task 2-R: WCAG Principle Sub-Guides Remediation`)
- Assigned Model for Current Task: `Gemma-4-31B Dense`
- Current Branch: `main` (clean working tree, synced with `origin/main`)
- Target Branch for Next Task: `refactor/wcag-principles`
- Last Completed Step: Reconciliation of repository state and plan; Task 4 merged (PR #7); legacy MS Word artifacts in `sensory-lab/bread/` pruned.

## State-Probe Block
Run these commands to verify state before taking any action:
```bash
git -C /Users/scott/code/local/simpleaccess status
# Expected: On branch main, working tree clean

node /Users/scott/code/local/simpleaccess/scripts/audit-site.mjs --file index.html
# Expected: 1/1 files passed. Total errors: 0

node /Users/scott/code/local/simpleaccess/scripts/audit-site.mjs --dir guides/office guides/adobe
# Expected: 5/5 files passed. Total errors: 0

node /Users/scott/code/local/simpleaccess/scripts/audit-site.mjs --dir guides/screenreaders
# Expected: 7/7 files passed. Total errors: 0

node /Users/scott/code/local/simpleaccess/scripts/audit-site.mjs --file guides/wcag/index.html
# Expected: 1/1 files passed. Total errors: 0
```

**STOP-AND-ASK RULE**: If the state probe contradicts this file, stop immediately and ask the user.

## Work Specification for Task 2-R (Assigned to Gemma-4-31B Dense)
Refactor the 4 POUR principle sub-guides using **Recipe A (Topic Guide Template)**:
1. `guides/wcag/perceivable/index.html`
2. `guides/wcag/operable/index.html`
3. `guides/wcag/understandable/index.html`
4. `guides/wcag/robust/index.html`

### Required Recipe A Components per Page:
- Remove inline `<style>` block (inherit from `/assets/ds/simpleaccess.css`).
- Link `/assets/ds/simpleaccess.css` in `<head>`.
- Link `<script type="module" src="/assets/ds/simpleaccess.js" defer></script>` in `<head>`.
- Add skip link immediately after `<body>`: `<a href="#main-content" class="m-skip-link">Skip to main content</a>`.
- Add `<ds-header></ds-header>`.
- Add `<ds-nav active-url="/guides/wcag/"></ds-nav>`.
- Use `<main id="main-content" class="l-main">`.
- Wrap guide content inside `<article class="l-container">`.
- Add `<ds-footer></ds-footer>` before `</body>`.

### Verification Gate:
Run per-file audit on each edited file:
```bash
node scripts/audit-site.mjs --file guides/wcag/perceivable/index.html
node scripts/audit-site.mjs --file guides/wcag/operable/index.html
node scripts/audit-site.mjs --file guides/wcag/understandable/index.html
node scripts/audit-site.mjs --file guides/wcag/robust/index.html
```
Run directory audit:
```bash
node scripts/audit-site.mjs --dir guides/wcag
# Expected: Audit complete. 5/5 files passed. Total errors: 0
```

## Next Exact Command to Begin Task 2-R
```bash
cd /Users/scott/code/local/simpleaccess && git checkout -b refactor/wcag-principles
```
