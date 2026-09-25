# Resume State: SimpleAccess Website Refactor

Plan: `2026-09-24_105146-website-refactor`
Location: `/Users/scott/code/local/simpleaccess`
Last Updated: 2026-09-24

## Current State
- Current Task Index: 3 (`Task 3: Refactor Screen Reader Guides`)
- Suggested Model for Current Task: `Gemma-4-26B MoE` (or Hermes Agent)
- Current Branch: `main`
- Last Completed Step: Task 2 (Core Guides & Making Of)
- Base HEAD: `4db4ddf`

## State-Probe Block
Run these commands to verify state before taking any action:
```bash
git -C /Users/scott/code/local/simpleaccess status
# Expected: On branch main, clean working directory

node /Users/scott/code/local/simpleaccess/scripts/audit-site.mjs --file index.html
# Expected: Audit complete. 1/1 files passed. Total errors: 0
```

**STOP-AND-ASK RULE**: If the state probe contradicts this file, stop immediately and ask the user.

## Dependency
Ensure `main` is up to date with all merged PRs from Task 0, 1, and 2.

## Next Exact Command
```bash
cd /Users/scott/code/local/simpleaccess && git checkout -b refactor/guides-screenreaders
```
