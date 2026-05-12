# CitizenMate Roadmap

## Phase 4: Test Automation & Codebase Health
**Goal:** Establish a testing baseline and reduce monolithic technical debt to ensure future feature development is safe and maintainable.
**Requirements:** INFRA-01, INFRA-04
**Success Criteria:**
- Vitest is configured and running successfully in CI/CD.
- Unit tests are passing for the SRS engine and Readiness Calculator.
- `src/app/dashboard/page.tsx` and `src/data/questions.ts` are refactored into smaller, maintainable modules without breaking existing functionality.

## Phase 5: Production Infrastructure & Monitoring
**Goal:** Harden the application for production traffic by addressing security vulnerabilities and enabling comprehensive monitoring.
**Requirements:** INFRA-02, INFRA-03, REV-04
**Success Criteria:**
- Sentry is integrated and successfully capturing frontend and backend errors.
- Upstash Redis rate limiting is active for the AI Tutor and Vercel serverless functions.
- PostHog analytics is configured and tracking key conversion funnels.

## Phase 6: Revenue Engine & Monetization
**Goal:** Implement the core business logic necessary to convert free users into paying subscribers at scale.
**Requirements:** REV-01, REV-02, REV-03
**Success Criteria:**
- Users can complete a test-date-anchored onboarding flow that generates a personalized study plan.
- Six distinct upgrade triggers are active and successfully prompt users to subscribe.
- Stripe checkout supports both Pro and Premium tiered subscriptions with recurring and micro-transaction logic.

## Phase 7: Growth & Retention
**Goal:** Deploy features designed to increase top-of-funnel acquisition and re-engage dormant users.
**Requirements:** GROW-01, GROW-02, GROW-03
**Success Criteria:**
- The application UI and content support 4 new language pairs.
- Users can generate and share unique referral links via the "Help a Mate" program.
- Email notifications (via Resend or similar) are successfully triggering based on user inactivity or key milestones.

### Phase 8: Super Admin Dashboard

**Goal:** Provide a full-featured admin dashboard with analytics, user management, blog CMS, and referral program management. All pages use the Conseil design system consistently, with functional CRUD operations, pagination, and responsive layout.

**Requirements**: ADMIN-01, ADMIN-02, ADMIN-03
**Depends on:** Phase 7
**Plans:** 4 plans

Plans:
- [x] 01 — Schema, auth guard, admin layout shell (executed)
- [x] 02 — Dashboard insights + users table + blog list (executed)
- [x] 03 — Referral management dashboard (executed)
- [x] 04 — UI refinement: analytics hub, user CRUD modals, Conseil alignment, pagination, confirmation dialogs (completed 2026-05-06)

### Phase 9: Audit stripe integration and check all CTA

**Goal:** Verify Stripe checkout flow works end-to-end for all pricing tiers and intervals.
**Requirements**: REV-01, REV-02, REV-03
**Depends on:** Phase 8
**Plans:** 1 plan

Plans:
- [x] 01 — Stripe audit & CTA verification (passed 2026-05-11)

### Phase 10: Calm UX & Interface Modernization

**Goal:** Reduce cognitive load through progressive disclosure, purposeful micro-interactions, and refined dark mode to create a calmer study environment.
**Requirements**: UX-01
**Depends on:** Phase 7
**Plans:** 1 plan

Plans:
- [x] 01 — Calm UX & Interface Modernization (completed 2026-05-11 — WCAG AA/AAA verified)

### Phase 11: Anxiety-Reduction & Wellbeing Features

**Goal:** Specifically mitigate evaluative stress with scaffolded AI feedback, anxiety-reducing copywriting, and optional wellbeing micro-interventions (e.g. breathing prompts).
**Requirements**: UX-02
**Depends on:** Phase 10
**Plans:** 1 plan

Plans:
- [x] 01 — Anxiety-Reduction & Wellbeing Features (completed 2026-05-12)
  - ✅ Wave 1 (AI Hint System) — built & integrated
  - ✅ Wave 2 (WellbeingPrompt) — built & integrated
  - ✅ Wave 3 (Copy Audit & Reframe) — completed

### Phase 12: Adaptive Gamification & Trust-building

**Goal:** Increase daily engagement and retention using non-competitive, effort-based gamification, and build trust with Explainable AI (XAI) for the SRS algorithm.
**Requirements**: UX-03
**Depends on:** Phase 11
**Plans:** 1 plan

Plans:
- [x] 01 — Adaptive Gamification & Trust-building (completed 2026-05-12)

### Phase 13: Add Vietnamese (Vi) to supported language of our platform

**Goal:** [To be planned]
**Requirements**: TBD
**Depends on:** Phase 12
**Plans:** 1/1 plans complete

Plans:
- [x] TBD — Vietnamese language support (completed 2026-05-07, verified)
