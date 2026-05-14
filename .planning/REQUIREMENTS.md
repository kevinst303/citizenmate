# Milestone v1.4 Requirements: Tech Debt Cleanup

**Created:** 2026-05-14
**Status:** Planning

## Active

### Glassmorphism Removal

- [ ] **TECH-01**: stat-card — replace `backdrop-filter: blur(16px)` with solid Conseil-compliant styling. The dashboard stats grid must render with the canonical `.card-conseil` appearance (no glassmorphism).
- [ ] **TECH-02**: CountryFactsWidget — migrate off `glass-card-premium` class to `.card-conseil` or equivalent canonical card styling.
- [ ] **TECH-03**: quiz-header.tsx — remove `backdrop-blur-lg` from sticky bar; use solid `bg-white` with standard Conseil border/shadow.

### Color Alias Migration

- [ ] **TECH-04**: auth-modal.tsx — replace legacy `bg-cm-navy` alias with canonical `cm-teal` (identical rendered color, no visual change expected).

## Constraints

- **Zero behavioral changes:** CSS/token-only migration. No logic, layout, or interaction changes.
- **Build gate:** `npx tsc --noEmit` + `npm run build` must pass with zero errors after each fix.
- **Visual regression:** Each component must render identically before/after (except stat-card which changes from glass to solid — this is intentional).
- **Audit completeness:** After all 4 items are fixed, a grep audit must confirm zero remaining instances of `backdrop-filter`, `glass-card-premium`, `backdrop-blur-lg`, and `bg-cm-navy` in the codebase.

## Future

*(None — this milestone is scoped to exactly 4 items)*

## Out of Scope

- Tailwind class migration (e.g., `backdrop-blur-lg` → custom utility) — only removing, not replacing with new abstractions
- Any other `backdrop-filter` usage not in the 4 known items without explicit user approval
- Design system refactors beyond the 4 targeted items
- Component restructuring or new features

## Traceability

| REQ-ID | Phase | Status |
|--------|-------|--------|
| TECH-01 | 18 | Not Started |
| TECH-02 | 18 | Not Started |
| TECH-03 | 18 | Not Started |
| TECH-04 | 19 | Not Started |
