# CitizenMate Roadmap

## Milestones

- ✅ **v1.0 Conseil Design Overhaul** — Phases 1-3 (shipped 2026-04-06)
- ✅ **v1.1 Launch Readiness** — Phases 4-13 (shipped 2026-05-12)
- ✅ **v1.2 PWA Optimization & Mobile** — Phase 14 (shipped 2026-05-13)
- ✅ **v1.3 Codebase Polish & UX Refinements** — Phases 15-17 (shipped 2026-05-14)
- ✅ **v1.4 Tech Debt Cleanup** — Phases 18-19 (shipped 2026-05-14)
- 🔵 **v1.5 Production Hardening & v2 Foundation** — Phases 20-26 (in progress)

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

<details>
<summary>✅ v1.4 Tech Debt Cleanup (Phases 18-19) — SHIPPED 2026-05-14</summary>

- [x] Phase 18: Glassmorphism Removal (1/1 plan) — completed 2026-05-14 (no-op, pre-verified clean)
- [x] Phase 19: Color Alias Migration (1/1 plan) — completed 2026-05-14 (no-op, pre-verified clean)

</details>

<details>
<summary>🔵 v1.5 Production Hardening & v2 Foundation (Phases 20-26) — IN PROGRESS</summary>

- [ ] **Phase 20: Sentry Instrumentation** — Create `instrumentation.ts` and `global-error.tsx` for runtime error monitoring
  - Requirements: PROD-01, PROD-02
  - Success criteria:
    1. `npm run build` exits 0 with Sentry SDK initialized on server
    2. Uncaught React errors display Conseil-styled fallback UI and reach Sentry dashboard
    3. `instrumentation.ts` registered in `next.config.ts` and loaded on startup

- [ ] **Phase 21: Build Warnings Resolution** — Fix metadataBase, Sentry deprecations, and outputFileTracingRoot
  - Requirements: PROD-03, PROD-04, FW-02
  - Success criteria:
    1. Zero `metadataBase` warnings in `npm run build` output
    2. Zero Sentry deprecation warnings (`disableLogger`, `automaticVercelMonitors`, `reactComponentAnnotation`)
    3. Zero `outputFileTracingRoot` inference warning
    4. All 6 page layouts reference `https://citizenmate.com.au` as metadataBase

- [ ] **Phase 22: Middleware Migration** — Migrate `middleware.ts` → `proxy.ts` per Next.js 16
  - Requirements: FW-01
  - Success criteria:
    1. Build passes with `proxy.ts` instead of `middleware.ts`
    2. Auth protection still guards `/dashboard`, `/practice`, `/study`, `/admin`
    3. CSP nonce headers still injected correctly
    4. Locale detection and i18n routing unchanged

- [ ] **Phase 23: Auth Route Fix** — Fix `/auth/login` 404
  - Requirements: UX-01
  - Success criteria:
    1. Navigating to `/auth/login` returns 200 (not 404)
    2. User sees login form or is redirected to homepage with auth modal open
    3. Login flow works end-to-end from the dedicated URL

- [ ] **Phase 24: Free Sample Test** — Add one free practice test for conversion funnel
  - Requirements: UX-02
  - Success criteria:
    1. Unauthenticated users visiting `/practice` see at least one free test
    2. Free test functions identically to premium tests (same quiz UI)
    3. Premium tests remain gated behind paywall
    4. Free test does not affect subscription conversion logic

- [ ] **Phase 25: i18n Drift Correction** — Fix translation drift in hi/zh/ar
  - Requirements: QUAL-01
  - Success criteria:
    1. `tsx scripts/validate-i18n.ts` reports zero missing keys for hi, zh, ar
    2. No English fallback text visible on any locale when tested manually

- [ ] **Phase 26: Rate Limiter** — Implement Upstash Redis rate-limiter for AI chat
  - Requirements: QUAL-02
  - Success criteria:
    1. `/api/chat` returns 429 after exceeding `CHAT_RATE_LIMIT` requests per hour per IP
    2. User sees Conseil-styled rate limit error message
    3. X-RateLimit-Remaining and X-RateLimit-Reset headers present on chat responses
    4. Rate limit does not apply to other API routes

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
| 16. PWA Install Modal | v1.3 | 1/1 | Complete | 2026-05-13 |
| 17. Admin Blog Cleanup | v1.3 | 0/0 | Complete (No-Op) | 2026-05-14 |
| 18. Glassmorphism Removal | v1.4 | 1/1 | Complete (No-Op) | 2026-05-14 |
| 19. Color Alias Migration | v1.4 | 1/1 | Complete (No-Op) | 2026-05-14 |
| **20. Sentry Instrumentation** | **v1.5** | **0/1** | **Not Started** | — |
| **21. Build Warnings Resolution** | **v1.5** | **0/1** | **Not Started** | — |
| **22. Middleware Migration** | **v1.5** | **0/1** | **Not Started** | — |
| **23. Auth Route Fix** | **v1.5** | **0/1** | **Not Started** | — |
| **24. Free Sample Test** | **v1.5** | **0/1** | **Not Started** | — |
| **25. i18n Drift Correction** | **v1.5** | **0/1** | **Not Started** | — |
| **26. Rate Limiter** | **v1.5** | **0/1** | **Not Started** | — |
