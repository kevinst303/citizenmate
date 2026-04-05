---
phase: 03-component-implementation
plan: D
subsystem: ui
tags: [tailwind, conseil, design-tokens, modal, pricing, faq, border-radius]

# Dependency graph
requires:
  - phase: 02-foundation
    provides: globals.css card-conseil CSS class and Conseil design tokens
provides:
  - Conseil card tokens (15px radius, #E9ECEF border, dual-layer shadow) applied to pricing cards, FAQ accordion, auth modal, premium gate, and quiz-header dialog
  - globals.css .card-conseil and .card-conseil-popular corrected from 10px → 15px border-radius globally
affects:
  - 03-E
  - 03-F
  - 03-G
  - Any plan using card-conseil CSS class or shared modal components

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Modal panels use inline boxShadow conseil dual-layer instead of Tailwind shadow-2xl"
    - "Cards use .card-conseil CSS class (now 15px) rather than Tailwind rounded-* classes"
    - "Buttons consistently use rounded-[10px], cards use rounded-[15px]"
    - "border border-[#E9ECEF] applied to all Conseil card surfaces"

key-files:
  created: []
  modified:
    - citizenmate/src/app/globals.css
    - citizenmate/src/components/landing/pricing-preview.tsx
    - citizenmate/src/components/landing/faq.tsx
    - citizenmate/src/components/shared/auth-modal.tsx
    - citizenmate/src/components/shared/premium-gate.tsx
    - citizenmate/src/components/quiz/quiz-header.tsx

key-decisions:
  - "Fixed .card-conseil globally in globals.css from 10px → 15px so all consumers update automatically"
  - "Modal panels use inline style boxShadow for the Conseil dual-layer shadow (not Tailwind shadow-2xl)"
  - "quiz-header submit button changed from bg-cm-navy to bg-cm-teal for brand consistency"

patterns-established:
  - "Card pattern: .card-conseil class (15px radius, #E9ECEF border, dual-layer shadow)"
  - "Popular card pattern: .card-conseil-popular class (teal primary gradient, 15px radius)"
  - "Button pattern: rounded-[10px] (not rounded-[15px] — buttons always 10px)"
  - "Modal panel pattern: rounded-[15px] + border border-[#E9ECEF] + inline boxShadow conseil"

requirements-completed: [PRIC-01, PRIC-02, FAQ-01, MODL-01]

# Metrics
duration: ~20min
completed: 2026-04-06
---

# Phase 03 Plan D: Pricing, FAQ, and Modal Panels Summary

**Conseil card tokens (15px radius, #E9ECEF border, dual-layer shadow) applied globally via globals.css fix and individually to pricing cards, FAQ accordion, auth modal, premium gate, and quiz-header dialog**

## Performance

- **Duration:** ~20 min
- **Started:** 2026-04-04T07:40:35Z
- **Completed:** 2026-04-05T15:26:50Z
- **Tasks:** 2
- **Files modified:** 6

## Accomplishments
- Fixed the 10px vs 15px card-conseil discrepancy in globals.css — all card consumers now use the correct 15px radius automatically
- Applied Conseil card tokens to pricing cards (card-conseil, card-conseil-popular classes, max-w-[1140px] container) and FAQ accordion items (rounded-[15px], border-[#E9ECEF])
- Updated shared modal panels — auth-modal.tsx, premium-gate.tsx, quiz-header.tsx submit dialog — to use rounded-[15px], conseil dual-layer shadow, and #E9ECEF border
- Changed quiz-header submit button from bg-cm-navy to bg-cm-teal and set rounded-[10px] for button/card radius consistency

## Task Commits

Each task was committed atomically:

1. **Task 1: Fix .card-conseil to 15px; update pricing and FAQ** - `dd45d29` (feat)
2. **Task 2: Update modal panels to Conseil card tokens** - `3768ab8` (feat)
3. **Task 2 (patch): quiz-header cm-navy → cm-teal, rounded-[10px] buttons** - `ef5e00c` (feat)

## Files Created/Modified
- `citizenmate/src/app/globals.css` - .card-conseil and .card-conseil-popular border-radius corrected from 10px → 15px, comment added for 03-D tracking
- `citizenmate/src/components/landing/pricing-preview.tsx` - Confirmed card-conseil/card-conseil-popular classes, max-w-[1140px] container
- `citizenmate/src/components/landing/faq.tsx` - AccordionItem wrapper gets rounded-[15px] border border-[#E9ECEF]
- `citizenmate/src/components/shared/auth-modal.tsx` - Modal panel updated to rounded-[15px], conseil shadow, #E9ECEF border
- `citizenmate/src/components/shared/premium-gate.tsx` - Modal card updated to rounded-[15px], conseil shadow, #E9ECEF border
- `citizenmate/src/components/quiz/quiz-header.tsx` - Submit dialog panel updated to rounded-[15px], submit button changed to bg-cm-teal rounded-[10px]

## Decisions Made
- Fixed .card-conseil globally in globals.css (rather than per-component) so that all existing and future consumers automatically inherit the correct 15px radius without additional per-file work
- Used inline `style={{ boxShadow: '...' }}` for the Conseil dual-layer shadow on modals — Tailwind's shadow-2xl does not match the Conseil spec
- quiz-header submit button changed from cm-navy to cm-teal to match the Conseil teal CTA pattern used across the app

## Deviations from Plan
None - plan executed exactly as written.

## Issues Encountered
None.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- All shared card and modal surfaces now use the correct Conseil design tokens
- Plans 03-E, 03-F, 03-G can rely on .card-conseil being 15px globally
- No blockers

---
*Phase: 03-component-implementation*
*Completed: 2026-04-06*
