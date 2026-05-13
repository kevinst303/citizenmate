# CitizenMate Roadmap

## Milestones

- ✅ **v1.0 Conseil Design Overhaul** — Phases 1-3 (shipped 2026-04-06)
- ✅ **v1.1 Launch Readiness** — Phases 4-13 (shipped 2026-05-12)
- ✅ **v1.2 PWA Optimization & Mobile** — Phase 14 (shipped 2026-05-13)

## ▶ v1.3 Codebase Polish & UX Refinements

| # | Phase | Goal | Requirements | Success Criteria |
|---|-------|------|--------------|------------------|
| 15 | Dashboard Refactor ✅ | Extract monolithic dashboard/page.tsx (~712 LOC) into modular, typed components | DASH-01, DASH-02, DASH-03 | 4 |
| 16 | PWA Install Modal | Implement custom Conseil-styled install modal with state management and i18n | PWA-01, PWA-02, PWA-03 | 4 |
| 17 | Admin Blog Cleanup | Replace hardcoded hex values with Conseil CSS variables | BLOG-01, BLOG-02 | 3 |

### Phase 15: Dashboard Refactor

**Goal:** Extract the monolithic `src/app/dashboard/page.tsx` (~712 LOC) into modular, typed components that each own a single responsibility, while preserving identical rendering.

**Requirements:** DASH-01, DASH-02, DASH-03

**Success criteria:**
1. Dashboard page.tsx reduced to ≤150 LOC (layout orchestration only)
2. Five modular components extracted: ReadinessPanel, TopicMasteryGrid, QuickActions, StatsSummary, TestDateCard
3. All extracted components have explicit TypeScript interfaces for props
4. `npm run build` passes with zero TypeScript errors and dashboard renders identically

### Phase 16: PWA Install Modal

**Goal:** Implement a custom Conseil-styled "Add to Home Screen" modal that replaces the native browser prompt, using Zustand for dismissal state and supporting all 6 i18n locales.

**Requirements:** PWA-01, PWA-02, PWA-03

**Success criteria:**
1. Custom modal renders with Conseil design tokens (15px radius, Poppins headings, #006d77 CTA)
2. Zustand store persists dismissal state to localStorage — dismissed modal never re-shows
3. Modal copy supports all 6 locales (en/vi/es/hi/zh/ar) via next-intl
4. Modal triggers on beforeinstallprompt event with smooth entrance animation

### Phase 17: Admin Blog Cleanup

**Goal:** Replace all hardcoded hex color values in the Admin/Blog section with canonical Conseil CSS variables for design consistency.

**Requirements:** BLOG-01, BLOG-02

**Success criteria:**
1. Zero hardcoded hex values remain in Admin/Blog components (only CSS variable references)
2. All blog admin pages render visually identical to pre-migration state
3. `npm run build` passes with zero errors

## Phases

<details>
<summary>✅ v1.0 Conseil Design Overhaul (Phases 1-3) — SHIPPED 2026-04-06</summary>

- [x] Phase 1: Foundation (2/2 plans) — completed 2026-03-23
- [x] Phase 2: Authentication (2/2 plans) — completed 2026-03-30
- [x] Phase 3: Core Features (7/7 plans) — completed 2026-04-06

</details>

<details>
<summary>✅ v1.1 Launch Readiness (Phases 4-13) — SHIPPED 2026-05-12</summary>

- [x] Phase 4: Test Automation & Codebase Health (1/1 plan) — completed 2026-05-01
- [x] Phase 5: Production Infrastructure & Monitoring (1/1 plan) — completed 2026-05-01
- [x] Phase 6: Revenue Engine & Monetization (3/3 plans) — completed 2026-05-05
- [x] Phase 7: Growth & Retention (3/3 plans) — completed 2026-05-11
- [x] Phase 8: Super Admin Dashboard (4/4 plans) — completed 2026-05-06
- [x] Phase 9: Stripe Audit & CTA Verification (1/1 plan) — completed 2026-05-11
- [x] Phase 10: Calm UX & Interface Modernization (1/1 plan) — completed 2026-05-11
- [x] Phase 11: Anxiety-Reduction & Wellbeing (1/1 plan) — completed 2026-05-12
- [x] Phase 12: Adaptive Gamification & Trust-building (1/1 plan) — completed 2026-05-12
- [x] Phase 13: Vietnamese Language Support (1/1 plan) — completed 2026-05-07

</details>

### ✅ v1.2 PWA Optimization & Mobile — SHIPPED 2026-05-13

<details>
<summary>✅ v1.2 PWA Optimization & Mobile (Phases 14) — SHIPPED 2026-05-13</summary>

- [x] Phase 14: PWA Optimization & Offline Capabilities (3/3 plans) — completed 2026-05-13
  - [x] Plan 14-1: Setup IndexedDB Storage
  - [x] Plan 14-2: Configure Serwist
  - [x] Plan 14-3: Implement Background Sync

</details>

## Progress

| Phase | Milestone | Plans Complete | Status | Completed |
|-------|-----------|---------------|--------|-----------|
| 1. Foundation | v1.0 | 2/2 | Complete | 2026-03-23 |
| 2. Authentication | v1.0 | 2/2 | Complete | 2026-03-30 |
| 3. Core Features | v1.0 | 7/7 | Complete | 2026-04-06 |
| 4. Test Automation & Codebase Health | v1.1 | 1/1 | Complete | 2026-05-01 |
| 5. Production Infrastructure & Monitoring | v1.1 | 1/1 | Complete | 2026-05-01 |
| 6. Revenue Engine & Monetization | v1.1 | 3/3 | Complete | 2026-05-05 |
| 7. Growth & Retention | v1.1 | 3/3 | Complete | 2026-05-11 |
| 8. Super Admin Dashboard | v1.1 | 4/4 | Complete | 2026-05-06 |
| 9. Stripe Audit & CTA Verification | v1.1 | 1/1 | Complete | 2026-05-11 |
| 10. Calm UX & Interface Modernization | v1.1 | 1/1 | Complete | 2026-05-11 |
| 11. Anxiety-Reduction & Wellbeing | v1.1 | 1/1 | Complete | 2026-05-12 |
| 12. Adaptive Gamification & Trust-building | v1.1 | 1/1 | Complete | 2026-05-12 |
| 13. Vietnamese Language Support | v1.1 | 1/1 | Complete | 2026-05-07 |
| 14. PWA Optimization & Offline Capabilities | v1.2 | 3/3 | Complete | 2026-05-13 |
| 15. Dashboard Refactor | v1.3 | 1/1 | Complete | 2026-05-13 |
| 16. PWA Install Modal | v1.3 | 0/0 | Not Started | — |
| 17. Admin Blog Cleanup | v1.3 | 0/0 | Not Started | — |
