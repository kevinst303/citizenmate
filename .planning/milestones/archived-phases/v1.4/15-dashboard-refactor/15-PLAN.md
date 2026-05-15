---
phase: 15
name: Dashboard Refactor
slug: dashboard-refactor
completed: "2026-05-13"
plans:
  - id: "15-1"
    title: "Extract Five Dashboard Components & Refactor page.tsx"
    status: "completed"
---

# Phase 15 Plan: Dashboard Refactor

## Goal

Extract the monolithic `src/app/[lang]/dashboard/page.tsx` (~712 LOC) into modular components, reducing page.tsx to ≤150 LOC of layout orchestration.

## Plan: DASH-01 — Extract Components & Refactor page.tsx

### Extracted Components

| Component | Lines | Props | Description |
|-----------|-------|-------|-------------|
| `ReadinessPanel` | ~50 | `readiness: ReadinessData` | Readiness ring + stat pills |
| `TestDateCard` | ~100 | `testDate`, `daysUntilTest`, `urgencyLevel`, `openModal`, `t` | Test date countdown card |
| `TopicMasteryGrid` | ~125 | `readiness: ReadinessData`, `isPremium: boolean`, `openUpgradeModal`, `t` | Topic mastery grid (locked/unlocked) |
| `QuickActions` | ~90 | `recommendedAction?: string`, `t` | 4 action cards grid |
| `StatsSummary` | ~75 | `readiness: ReadinessData`, `t` | 4 stat cards grid |

### Files to Create
1. `src/components/dashboard/readiness-panel.tsx`
2. `src/components/dashboard/test-date-card.tsx`
3. `src/components/dashboard/topic-mastery-grid.tsx`
4. `src/components/dashboard/quick-actions.tsx`
5. `src/components/dashboard/stats-summary.tsx`

### File to Modify
- `src/app/[lang]/dashboard/page.tsx` — Reduce to layout orchestrator (≤150 LOC)

### Pre-refactor: TypeScript Sanity
All 5 components will use explicit TypeScript interfaces derived from existing types in `@/lib/readiness`.

### Post-refactor: Verification
```bash
npx tsc --noEmit && npm run build
```
Must pass with zero errors. Dashboard page must render identically to pre-refactor state.

### Components Already Extracted (No Changes Needed)
- `readiness-ring.tsx` — Already a standalone component
- `streak-card.tsx` — Already a standalone component
- `badge-showcase.tsx` — Already a standalone component
- `progression-card.tsx` — Already a standalone component
- `abs-insights-widget.tsx` — Already a standalone component
- `life-in-australia-section.tsx` — Already a standalone component
