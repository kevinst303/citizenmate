---
gsd_state_version: 1.0
milestone: v1.5
milestone_name: Production Hardening & v2 Foundation
status: in_progress
last_updated: "2026-05-15T05:03:00.000Z"
last_activity: 2026-05-15 — Roadmap created (7 phases)
progress:
  total_phases: 7
  completed_phases: 3
  total_plans: 7
  completed_plans: 3
  percent: 43
---

# Project State: CitizenMate Production Hardening

## Project Reference

See: .planning/PROJECT.md (updated 2026-05-15 for v1.5 milestone)

**Core value:** Every page of CitizenMate renders with the Conseil design system. v1.4 eliminated the final 4 tech debt items — the codebase is 100% Conseil compliant. v1.5 closes remaining production monitoring gaps and launch-quality polish items identified in the 2026-05-15 production readiness audit.

**Current status:** Milestone v1.5 INITIATED — Defining requirements.

## Current Position

Phase: 23 — Auth Route Fix (login 404)
Plan: 23-PLAN.md
Status: Phase 22 complete — executing Phase 23
Last activity: 2026-05-15 — middleware.ts migrated to proxy.ts, build verified

## Branch

`main`

## Target Features

- PROD-01: Sentry instrumentation.ts + global-error.tsx
- PROD-02: Fix metadataBase warnings across 6 page layouts
- PROD-03: Migrate Sentry config to current SDK conventions
- PROD-04: Migrate middleware.ts → proxy.ts per Next.js 16
- PROD-05: Fix /auth/login 404
- PROD-06: Correct i18n drift (hi/zh/ar)
- PROD-07: Implement Upstash Redis rate-limiter (deferred from v1.4)
- PROD-08: Add free sample practice test

## Pending Todos

- `fix-rate-limiter` (from v1.4 backlog) — now PROD-07

## Blockers/Concerns

None.

---

*State last updated: 2026-05-15 — v1.5 milestone initiated (Production Hardening & v2 Foundation)*

## Operator Next Steps

- Phase 20 ✅ Complete — Sentry instrumentation.ts + global-error.tsx created, build passes
- Phase 21 🔄 Next — Migrate middleware.ts → proxy.ts conventions
