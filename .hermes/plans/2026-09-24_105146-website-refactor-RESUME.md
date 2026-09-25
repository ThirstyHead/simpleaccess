# Resume State: SimpleAccess Website Refactor

Plan: `2026-09-24_105146-website-refactor`
Location: `/Users/scott/code/local/simpleaccess`
Last Updated: 2026-09-25

## Current State
- Current Task Index: 6A (`Task 6A: HTML Elements: Sectioning & Grouping`)
- Suggested Model for Current Task: `Gemma-4-26B MoE` or `Gemini-3.8-flash`
- Current Branch: `refactor/guides-productivity`
- Last Completed Step: Task 4 (Office & PDF Productivity Guides)

## State-Probe Block
Run these commands to verify state before taking any action:
```bash
git -C /Users/scott/code/local/simpleaccess status

node /Users/scott/code/local/simpleaccess/scripts/audit-site.mjs --dir guides/office
# Expected: Audit complete. 4/4 files passed. Total errors: 0

node /Users/scott/code/local/simpleaccess/scripts/audit-site.mjs --dir guides/adobe
# Expected: Audit complete. 1/1 files passed. Total errors: 0
```

**STOP-AND-ASK RULE**: If the state probe contradicts this file, stop immediately and ask the user.

## Dependency
Merge `refactor/guides-productivity` into `main`, then cut branch `refactor/html-sectioning-grouping`.

## Next Exact Command
```bash
cd /Users/scott/code/local/simpleaccess && git checkout main && git merge refactor/guides-productivity && git checkout -b refactor/html-sectioning-grouping
```
