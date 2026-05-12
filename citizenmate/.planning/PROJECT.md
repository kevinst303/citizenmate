# CitizenMate — Adaptive Gamification & Trust-building

## Current Milestone: v1.2 Adaptive Gamification & Trust-building

**Status:** 🚧 Planning
**Goal:** Increase user engagement and retention through adaptive gamification (streaks, badges, progression) and build trust via explainable AI tooltips that demystify the SRS scheduling algorithm.

**Target Features:**
- Daily login streaks with streak-freeze recovery
- Achievement badges (milestone-based + skill-based)
- Progression system with visual level indicators
- XAI tooltips explaining SRS card scheduling rationale
- Gamification dashboard widget showing stats and progress
- Accessibility: reduced-motion support for all gamification animations

---

## What This Is

CitizenMate is a Next.js 16 civic-education SaaS app (quiz, study, and dashboard flows). v1.1 shipped production infrastructure, revenue engine, and growth mechanics. v1.2 focuses on increasing engagement through adaptive gamification (streaks, badges, progression) and building trust via explainable AI tooltips for the SRS algorithm.

## Core Value

Every page of CitizenMate renders with the Conseil design system. v1.2 deepens user engagement and trust through gamification mechanics and explainable AI.

## Requirements

### Validated

- ✓ Design tokens extracted from conseil.pixfort.com — v1.0 (Phase 1)
- ✓ Fonts replaced (Manrope → Poppins, DM_Sans → Inter) — v1.0 (Phase 2)
- ✓ CSS design tokens updated (primary #006d77, secondary #3d348b, card shadows, radii) — v1.0 (Phase 2)
- ✓ Navbar converted to solid white fixed 66px — v1.0 (Phase 2 + 03-A)
- ✓ Hero background images generated (Imagen 4) — v1.0 (Phase 2)
- ✓ TypeScript + build clean (zero errors) — v1.0 (Phase 2)
- ✓ Navbar + layout shell + user menu styled to Conseil spec — v1.0 (03-A)
- ✓ Hero, CTA sections, and Footer styled to Conseil spec — v1.0 (03-B)
- ✓ Features, How It Works, and Social Proof styled to Conseil spec — v1.0 (03-C)
- ✓ Pricing, FAQ, and shared modals styled to Conseil spec — v1.0 (03-D)
- ✓ Quiz flow components styled to Conseil design tokens — v1.0 (03-E)
- ✓ Study flow components styled to Conseil design tokens — v1.0 (03-F)
- ✓ Dashboard components styled to Conseil design tokens — v1.0 (03-G)
- ✓ **INFRA-01**: Automated test framework (Vitest) — v1.1 (Phase 4)
- ✓ **INFRA-02**: Sentry error tracking — v1.1 (Phase 5)
- ✓ **INFRA-03**: Redis rate limiting via Upstash — v1.1 (Phase 5)
- ✓ **INFRA-04**: Dashboard monolithic refactor — v1.1 (Phase 4)
- ✓ **REV-01**: Test-date-anchored onboarding flow — v1.1 (Phase 6)
- ✓ **REV-02**: 6 upgrade moment triggers — v1.1 (Phase 6)
- ✓ **REV-03**: Tiered pricing (Pro/Premium) — v1.1 (Phase 6)
- ✓ **REV-04**: PostHog analytics — v1.1 (Phase 5)
- ✓ **GROW-01**: 4+ new language pairs — v1.1 (Phase 7) — exceeded (6 delivered)
- ✓ **GROW-02**: "Help a Mate" referral program — v1.1 (Phase 7)
- ✓ **GROW-03**: Email notifications — v1.1 (Phase 7)

### Active

*(To be defined — requirements gathered in new-milestone workflow)*

### Out of Scope

- Lenis/Locomotive Scroll — Conseil uses native browser scroll; CitizenMate keeps native scroll
- New pages or features — design-only overhaul
- Conseil's blog section — CitizenMate has its own blog; structure not changed
- Mobile-only design changes — responsive updates only where Conseil spec differs significantly

## Context

- **Current version:** v1.2 Adaptive Gamification & Trust-building 🚧 Planning
- **Previous:** v1.1 Launch Readiness ✅ shipped 2026-05-12
- **Branch:** `main`
- **Codebase:** ~150 commits, 480+ files changed since v1.0
- **Tech stack:** Next.js 16, Supabase (Postgres + auth), Stripe (subscriptions), Resend (email), Sentry (errors), PostHog (analytics), Upstash Redis (rate limiting), Vitest (tests)
- **Known tech debt (carried forward):** `stat-card` backdrop-filter, `CountryFactsWidget` glass-card-premium, `quiz-header` backdrop-blur-lg, `auth-modal` bg-cm-navy alias
- **Reference:** https://conseil.pixfort.com/consulting/

## Constraints

- **Framework**: Next.js 16 with breaking changes — check `node_modules/next/dist/docs/` before any Next.js API usage
- **Build gate**: `npx tsc --noEmit` + `npm run build` must pass zero errors after every phase
- **Accessibility gate**: All new gamification animations must support `prefers-reduced-motion`
- **Environment**: 7 `RESEND_TEMPLATE_*` variables required for email functionality

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Poppins 400/500/600/700/800 for headings | Matches Conseil exactly | ✓ Good |
| Inter 300/400/500/600 for body | Matches Conseil exactly | ✓ Good |
| Primary teal #006d77 | Conseil exact value (vs old #00727a) | ✓ Good |
| No Lenis | Conseil uses native scroll; confirmed in recon | ✓ Good |
| Navbar: solid white fixed, no glassmorphism | Conseil has no backdrop-blur | ✓ Good |
| Images via Imagen 4 (not Imagen 2) | Imagen 2 unavailable on this API key | ✓ Good |
| 7 parallel worktree tracks for Phase 3 | Independent component groups, max parallelism | ✓ Good — all 7 merged cleanly |
| InlineCTA as standalone zero-prop component | Cleaner import pattern vs inline JSX | ✓ Good |
| CTASection reduced to single CTA button | Spec requires single button | ✓ Good |
| Footer Support → Company + Australia 4th column | Matches Conseil 4-column layout spec | ✓ Good |
| .card-conseil fixed globally (10px → 15px) | All card consumers update automatically | ✓ Good |
| Modal panels use inline boxShadow | Tailwind shadow-2xl doesn't match Conseil spec | ✓ Good |
| cm-eucalyptus → cm-teal throughout study flow | cm-eucalyptus not in Conseil palette | ✓ Good |
| conseil-teal → cm-teal in SubpageHero | conseil-teal was undefined; cm-teal is canonical | ✓ Good |
| Reuse existing implems (Phases 4, 5 verification-only) | Infrastructure already production-grade | ✓ Good |
| TestDateProvider hydrates from Supabase | Fix for localStorage-only approach on fresh sessions | ✓ Good |
| Shared getResendClient() for graceful degradation | Cron resilience when Resend unconfigured | ✓ Good |
| 6th upgrade trigger as inactivity detection | Completes business plan 6-trigger requirement | ✓ Good |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd-transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd-complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-05-12 — v1.2 Adaptive Gamification & Trust-building milestone started*

