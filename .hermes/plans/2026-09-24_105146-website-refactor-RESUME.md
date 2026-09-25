# Resume State: SimpleAccess Website Refactor

Plan: `2026-09-24_105146-website-refactor`
Location: `/Users/scott/code/local/simpleaccess`
Last Updated: 2026-09-25

## Current State
- Current Task Index: Task 5-R (`Task 5-R: Sensory Lab Hubs & Alt-Text Accessible Remediation`)
- Assigned Model for Current Task: `Gemma-4-31B Dense`
- Current Branch: `refactor/wcag-principles` (Task 2-R complete, ready to merge)
- Target Branch for Next Task: `refactor/sensory-lab-hubs`
- Last Completed Step: Refactored 4/4 WCAG Principle sub-guides (Task 2-R); verified 5/5 pages in `guides/wcag` pass audit.

## State-Probe Block
Run these commands to verify state before taking any action:
```bash
git -C /Users/scott/code/local/simpleaccess status
# Expected: On branch refactor/wcag-principles, working tree clean (or ready to commit)

node /Users/scott/code/local/simpleaccess/scripts/audit-site.mjs --dir guides/wcag
# Expected: Audit complete. 5/5 files passed. Total errors: 0
```

**STOP-AND-ASK RULE**: If the state probe contradicts this file, stop immediately and ask the user.

## Work Specification for Task 5-R (Assigned to Gemma-4-31B Dense)
Refactor the 7 Sensory Lab hub and accessible demo pages:
1. `sensory-lab/alt-text/index.html`
2. `sensory-lab/alt-text/accessible/index.html`
3. `sensory-lab/bread/index.html`
4. `sensory-lab/document-language/index.html`
5. `sensory-lab/empty-buttons/index.html`
6. `sensory-lab/empty-links/index.html`
7. `sensory-lab/form-labels/index.html`

### Required Recipe A/C Components per Page:
- Apply Recipe A (Topic Guide Template) to the 6 lab hub pages.
- Fix missing design system assets and navigation in `sensory-lab/alt-text/accessible/index.html` (Recipe C).
- **CRITICAL**: Do NOT alter any broken demos in `inaccessible/` subpages.
- Ensure all links point to existing routes (`accessible/`, `inaccessible/`).

### Verification Gate:
Run directory audit:
```bash
node scripts/audit-site.mjs --dir sensory-lab
# Expected: Audit complete. 22/22 pages in sensory-lab pass audit (0 errors).
```

## Next Exact Command to Begin Task 5-R
```bash
cd /Users/scott/code/local/simpleaccess && git commit -am "refactor: complete wcag principle sub-guides (Task 2-R complete)" && git checkout main && git merge refactor/wcag-principles && git checkout -b refactor/sensory-lab-hubs
```