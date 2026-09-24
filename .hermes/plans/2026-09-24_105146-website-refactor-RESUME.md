# Resume State: SimpleAccess Website Refactor

Plan: `2026-09-24_105146-website-refactor`
Location: `/Users/scott/code/local/simpleaccess`
Last Updated: 2026-09-24

## Current State
- Current Task Index: 2 (`Task 2: Refactor Core Guides & Making Of`)
- Suggested Model for Current Task: `Gemma-4-31B Dense` (or Hermes Agent)
- Current Branch: `refactor/homepage` (Task 1 complete)
- Last Completed Step: Task 1 (Homepage Refactor)
- Base HEAD: `2b7cde6` (Tag `v1.0.0`)

## State-Probe Block
Run these commands to verify state before taking any action:
```bash
git -C /Users/scott/code/local/simpleaccess status
# Expected: On branch refactor/homepage, changes to index.html and package.json committed

node /Users/scott/code/local/simpleaccess/scripts/audit-site.mjs --file index.html
# Expected: Audit complete. 1/1 files passed. Total errors: 0
```

**STOP-AND-ASK RULE**: If the state probe contradicts this file, stop immediately and ask the user.

## Dependency
Ensure the `refactor/homepage` branch is committed and merged (or used as base) before starting Task 2.

## Next Exact Command
```bash
cd /Users/scott/code/local/simpleaccess && git checkout -b refactor/guides-core
```
