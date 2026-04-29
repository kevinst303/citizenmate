# CitizenMate — Launch Readiness

## Current Milestone: v1.1 Launch Readiness

**Goal:** Get CitizenMate production-ready with infrastructure hardening, revenue conversion engine, and growth mechanics from the business plan.

**Target features:**
- Infrastructure: Automated tests, Sentry error tracking, Redis rate limiting, dashboard refactor
- Revenue Engine: Test-date onboarding, 6 upgrade moment triggers, tiered pricing (Pro/Premium), PostHog analytics
- Growth: 4 new language pairs, "Help a Mate" referral program, email notifications

## What This Is

CitizenMate is a Next.js 16 civic-education SaaS app (quiz, study, and dashboard flows). The v1.1 milestone focuses on transitioning from an MVP to a revenue-generating SaaS by implementing test automation, robust infrastructure, and business-critical features.

## Core Value

Every page of CitizenMate renders with the Conseil design system. v1.1 ensures the application is reliable, secure, and optimized for user conversion and growth.

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

### Active

*(Next milestone requirements — defined via `/gsd:new-milestone`)*
- INFRA-01: Implement automated test framework (Vitest)
- INFRA-02: Add Sentry error tracking
- INFRA-03: Implement Redis rate limiting
- INFRA-04: Refactor dashboard monolithic structure
- REV-01: Build test-date onboarding flow
- REV-02: Implement 6 upgrade moment triggers
- REV-03: Implement tiered pricing (Pro/Premium)
- REV-04: Integrate PostHog analytics
- GROW-01: Add 4 new language pairs
- GROW-02: Build "Help a Mate" referral program
- GROW-03: Implement email notifications

### Out of Scope

- Lenis/Locomotive Scroll — Conseil uses native browser scroll; CitizenMate keeps native scroll
- New pages or features — design-only overhaul
- Conseil's blog section — CitizenMate has its own blog; structure not changed
- Mobile-only design changes — responsive updates only where Conseil spec differs significantly

## Context

- Branch: `feat/conseil-design-overhaul` (v1.0 shipped)
- Reference: https://conseil.pixfort.com/consulting/
- Design docs: `citizenmate/docs/research/conseil/` (DESIGN_TOKENS.md, BEHAVIORS.md, PAGE_TOPOLOGY.md, HANDOFF.md)
- Foundation gate: Passed (see `citizenmate/docs/research/conseil/FOUNDATION_GATE.md`)
- Key confirmed tokens: Primary #006d77, Secondary #3d348b, Fonts: Poppins + Inter, Cards: 15px radius, 1px #E9ECEF border, dual-layer shadow
- Container: 1140px max-width
- Codebase: 24,159 LOC TypeScript/TSX/CSS (post-v1.0)
- Known tech debt: stat-card CSS class retains backdrop-blur; CountryFactsWidget retains glass-card-premium; quiz-header sticky bar has backdrop-blur-lg

## Constraints

- **Framework**: Next.js 16 with breaking changes — check `node_modules/next/dist/docs/` before any Next.js API usage
- **Design fidelity**: Pixel-accurate match to conseil.pixfort.com — token values are locked (FOUNDATION_GATE.md)
- **Animations**: CitizenMate keeps Framer Motion, but entrance animations softened to match Conseil's subtler motion
- **Build gate**: `npx tsc --noEmit` + `npm run build` must pass zero errors after every phase

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
| conseil-teal → cm-teal in SubpageHero | conseil-teal was undefined; cm-teal is canonical | ✓ Good — caught in audit |

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
*Last updated: 2026-04-29 starting v1.1 milestone (Launch Readiness)*
