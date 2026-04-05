---
phase: 03-component-implementation
plan: A
subsystem: ui
tags: [navbar, layout, conseil, framer-motion, tailwind]

# Dependency graph
requires:
  - phase: 02-foundation
    provides: Conseil CSS tokens, globals.css, color palette, font stack
provides:
  - Solid white fixed navbar (66px) with cubic-bezier scroll transition
  - Layout shell spacer pt-[66px] confirmed
  - User menu dropdown with Conseil card tokens (15px radius, #E9ECEF border, dual-layer shadow)
affects: [03-B, 03-C, 03-D, all phases that render the navbar or layout shell]

# Tech tracking
tech-stack:
  added: []
  patterns: [Conseil card token pattern — inline style for arbitrary border-radius + dual-layer box-shadow]

key-files:
  created: []
  modified:
    - citizenmate/src/components/shared/navbar.tsx
    - citizenmate/src/components/shared/layout-shell.tsx
    - citizenmate/src/components/shared/user-menu.tsx

key-decisions:
  - "Use inline style for scroll transition property to ensure exact cubic-bezier value is preserved (Tailwind JIT cannot guarantee arbitrary easing)"
  - "User menu dropdown uses both className rounded-[15px] and inline style borderRadius: '15px' for cross-browser safety"

patterns-established:
  - "Conseil card shadow pattern: inline style with rgba(0,0,0,0.05) 0px 2px 6px 0px, rgba(0,0,0,0.1) 0px 8px 19.2px 0px"
  - "Conseil dropdown border: border-[#E9ECEF] className or inline 1px solid #E9ECEF"

requirements-completed: [NAV-01, NAV-02, NAV-03, NAV-04]

# Metrics
duration: 1min
completed: 2026-04-04
---

# Phase 03 Plan A: Navbar, Layout Shell & User Menu Summary

**Solid white fixed 66px navbar with cubic-bezier(0.165,0.84,0.44,1) scroll transition, pt-[66px] layout spacer, and user menu dropdown updated to Conseil card tokens (15px radius, #E9ECEF border, dual-layer shadow)**

## Performance

- **Duration:** ~1 min (verification + token update only)
- **Started:** 2026-04-04T07:40:16Z
- **Completed:** 2026-04-04T07:40:46Z
- **Tasks:** 2
- **Files modified:** 3

## Accomplishments
- Navbar scroll transition updated to exact Conseil spec: `transition: 'top 0.2s cubic-bezier(0.165,0.84,0.44,1)'` via inline style; no shadow or border added on scroll
- Layout shell spacer confirmed as `pt-[66px]` with NAV-03 comment inline
- User menu dropdown panel updated to Conseil card tokens: `rounded-[15px]`, `border border-[#E9ECEF]`, and dual-layer `boxShadow` via inline style; no backdrop-blur present

## Task Commits

Each task was committed atomically:

1. **Task 1: Verify and update Navbar scroll transition (NAV-01, NAV-02)** - `124bd53` (feat)
2. **Task 2: Confirm layout shell spacer and update user menu card tokens (NAV-03, NAV-04)** - `6fce015` (feat)

## Files Created/Modified
- `citizenmate/src/components/shared/navbar.tsx` - Fixed white 66px bar; scroll transition uses inline style with cubic-bezier(0.165,0.84,0.44,1); no shadow on scroll; no backdrop-blur
- `citizenmate/src/components/shared/layout-shell.tsx` - Spacer div confirmed at pt-[66px]; NAV-03 comment added
- `citizenmate/src/components/shared/user-menu.tsx` - Dropdown panel updated to Conseil card tokens: borderRadius 15px, border #E9ECEF, dual-layer box-shadow; Framer Motion animation preserved

## Decisions Made
- Used inline style for the scroll `top` transition rather than Tailwind arbitrary value to guarantee the exact cubic-bezier easing string is not rewritten by PostCSS
- User menu panel uses both Tailwind `rounded-[15px]` in className and `borderRadius: '15px'` in inline style for belt-and-suspenders cross-browser radius

## Deviations from Plan
None - plan executed exactly as written.

## Issues Encountered
None.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- Navbar chrome is pixel-accurate per Conseil spec; all NAV requirements satisfied
- Ready for 03-B through 03-G to proceed; the layout shell spacer they depend on is confirmed

---
*Phase: 03-component-implementation*
*Completed: 2026-04-04*
