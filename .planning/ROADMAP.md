# CitizenMate Roadmap

## Milestones

- ✅ **v1.0 Conseil Design Overhaul** — Phases 1-3 (shipped 2026-04-06)
- ✅ **v1.1 Launch Readiness** — Phases 4-13 (shipped 2026-05-12)
- ✅ **v1.2 PWA Optimization & Mobile** — Phase 14 (shipped 2026-05-13)
- ✅ **v1.3 Codebase Polish & UX Refinements** — Phases 15-17 (shipped 2026-05-14)
- ✅ **v1.4 Tech Debt Cleanup** — Phases 18-19 (shipped 2026-05-14)

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

<details>
<summary>✅ v1.2 PWA Optimization & Mobile (Phase 14) — SHIPPED 2026-05-13</summary>

- [x] Phase 14: PWA Optimization & Offline Capabilities (3/3 plans) — completed 2026-05-13
  - [x] Plan 14-1: Setup IndexedDB Storage
  - [x] Plan 14-2: Configure Serwist
  - [x] Plan 14-3: Implement Background Sync

</details>

<details>
<summary>✅ v1.3 Codebase Polish & UX Refinements (Phases 15-17) — SHIPPED 2026-05-14</summary>

- [x] Phase 15: Dashboard Refactor (1/1 plan) — completed 2026-05-13
- [x] Phase 16: PWA Install Modal (1/1 plan) — completed 2026-05-13
- [x] Phase 17: Admin Blog Cleanup (0/0 — no-op) — completed 2026-05-14

</details>

### v1.4 Tech Debt Cleanup

#### Phase 18: Glassmorphism Removal ✅
**Goal:** Remove all glassmorphism effects from dashboard and quiz components, replacing with solid Conseil-compliant styling.
**Requirements:** TECH-01, TECH-02, TECH-03
**Result:** No-op — all glassmorphism already removed in prior milestones.
**Success criteria:**
1. ✅ `stat-card` renders with solid `.card-conseil` styling (no `backdrop-filter: blur()`)
2. ✅ `CountryFactsWidget` uses `.card-conseil` or equivalent canonical class (not `glass-card-premium`)
3. ✅ `quiz-header.tsx` sticky bar uses solid `bg-white` (no `backdrop-blur-lg`)
4. ✅ `npx tsc --noEmit` and `npm run build` pass with zero errors

#### Phase 19: Color Alias Migration ✅
**Goal:** Replace legacy `bg-cm-navy` alias with canonical `cm-teal` in auth-modal.tsx.
**Requirements:** TECH-04
**Result:** No-op — all targeted files already use canonical tokens.
**Success criteria:**
1. ✅ `auth-modal.tsx` uses `cm-teal` (not `bg-cm-navy`)
2. ✅ Visual rendering is identical (both map to same hex value)
3. ✅ Grep audit confirms zero instances in targeted files

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
| 16. PWA Install Modal | v1.3 | 1/1 | Complete | 2026-05-13 |
| 17. Admin Blog Cleanup | v1.3 | 0/0 | Complete (No-Op) | 2026-05-14 |
| 18. Glassmorphism Removal | v1.4 | 1/1 | Complete (No-Op) | 2026-05-14 |
| 19. Color Alias Migration | v1.4 | 1/1 | Complete (No-Op) | 2026-05-14 |
