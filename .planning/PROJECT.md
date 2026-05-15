# CitizenMate — v1.5 Production Hardening

## What This Is

CitizenMate is a Next.js 16 civic-education SaaS app (quiz, study, and dashboard flows). As of v1.4, the codebase is 100% Conseil design system compliant — zero glassmorphism remnants, zero legacy CSS classes, zero deprecated color aliases. All 4 known tech debt items carried from v1.1→v1.3 have been verified clean.

## Current Milestone: v1.5 Production Hardening & v2 Foundation

**Goal:** Close remaining production monitoring gaps and launch-quality polish items before scaling to feature work.

**Target features:**
- Sentry instrumentation (`instrumentation.ts` + `global-error.tsx`) — runtime errors are currently unmonitored in production
- Next.js deprecation fixes (metadataBase on 6 pages, Sentry config migration, middleware→proxy convention)
- Auth route fix (`/auth/login` returns 404 — users can't reach login via direct URL)
- i18n drift correction (hi/zh/ar translations at 0.8% drift)
- Deferred Upstash Redis rate-limiter from v1.4 backlog
- One free sample practice test for conversion funnel (all 15 currently gated behind paywall)

## Core Value

Every page of CitizenMate renders with the Conseil design system. v1.4 confirmed full compliance — the codebase has zero `backdrop-filter`, zero `glass-card-premium`, and zero hardcoded hex values outside the token layer.

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
- ✓ Dashboard page.tsx extracted into 5 modular components — v1.3 (Phase 15)
- ✓ All extracted components use Conseil tokens with TypeScript types — v1.3 (Phase 15)
- ✓ Dashboard renders identically to pre-refactor state — v1.3 (Phase 15)
- ✓ Conseil-styled PWA install modal with animations — v1.3 (Phase 16)
- ✓ Zustand store + localStorage for install modal dismissal — v1.3 (Phase 16)
- ✓ PWA modal i18n (en/vi/es/hi/zh/ar) — v1.3 (Phase 16)
- ✓ Zero hardcoded hex values in Admin/Blog — v1.3 (Phase 17, no-op)
- ✓ Visual consistency verified across all blog admin pages — v1.3 (Phase 17, no-op)

- ✓ **TECH-01**: stat-card — backdrop-filter: blur(16px) replaced with solid Conseil-compliant styling — v1.4 (no-op: already clean)
- ✓ **TECH-02**: CountryFactsWidget — migrated off glass-card-premium class to canonical card — v1.4 (no-op: already clean)
- ✓ **TECH-03**: quiz-header.tsx — backdrop-blur-lg removed from sticky bar — v1.4 (no-op: already clean)
- ✓ **TECH-04**: auth-modal.tsx — legacy bg-cm-navy replaced with cm-teal — v1.4 (no-op: already clean)

### Active

*(Fresh requirements for v1.5 to be defined via `/gsd:new-milestone`)*

- Lenis/Locomotive Scroll — Conseil uses native browser scroll; CitizenMate keeps native scroll
- New pages or features — design-only overhaul
- Conseil's blog section — CitizenMate has its own blog; structure not changed
- Mobile-only design changes — responsive updates only where Conseil spec differs significantly

### Active (v1.5)

- [ ] **PROD-01**: Sentry instrumentation.ts + global-error.tsx for runtime error monitoring
- [ ] **PROD-02**: Fix metadataBase warnings across 6 page layouts
- [ ] **PROD-03**: Migrate Sentry config to current SDK conventions (disableLogger, automaticVercelMonitors, reactComponentAnnotation)
- [ ] **PROD-04**: Migrate middleware.ts → proxy.ts per Next.js 16 convention
- [ ] **PROD-05**: Fix /auth/login 404 — add dedicated login route or redirect
- [ ] **PROD-06**: Correct i18n drift in hi/zh/ar translation files (0.8% each)
- [ ] **PROD-07**: Implement Upstash Redis rate-limiter (deferred from v1.4)
- [ ] **PROD-08**: Add one free sample practice test to conversion funnel

## Context

- Branch: `main` (v1.4 archived 2026-05-14, v1.5 started 2026-05-15)
- Reference: https://conseil.pixfort.com/consulting/
- Design docs: `citizenmate/docs/research/conseil/` (DESIGN_TOKENS.md, BEHAVIORS.md, PAGE_TOPOLOGY.md, HANDOFF.md)
- Foundation gate: Passed (see `citizenmate/docs/research/conseil/FOUNDATION_GATE.md`)
- Key confirmed tokens: Primary #006d77, Secondary #3d348b, Fonts: Poppins + Inter, Cards: 15px radius, 1px #E9ECEF border, dual-layer shadow
- Container: 1140px max-width
- Codebase: 24,159 LOC TypeScript/TSX/CSS
- v1.4 verified: zero glassmorphism, zero legacy CSS, 100% Conseil compliance
- 1 deferred tech debt item → v1.5 active: Upstash Redis rate-limiter
- Production audit (2026-05-15): build clean, all routes live, CSP nonce-based security, 6 warnings identified (all non-blocking)

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
| Dashboard page.tsx split into 5 modular components | Monolith hard to maintain; each component now owns one responsibility | ✓ Good — page.tsx from 712→150 LOC |
| Zustand + IndexedDB for PWA dismissal | localStorage alone isn't durable enough; IndexedDB provides structured persistence | ✓ Good — 7-day cooldown works across reloads |
| Phase 17 declared no-op | Grep audit confirmed all components already on Conseil tokens from prior phases | ✓ Good — zero hex values found |
| Retroactive VALIDATION.md for phases 15-17 | GSD Nyquist compliance requires validation files even for completed phases | ✓ Good — 3/3 Nyquist compliant |
| v1.4 both phases declared no-ops | Grep audits confirmed zero glassmorphism, zero bg-cm-navy in targeted files; pre-resolved in v1.0-v1.3 | ✓ Good — 4/4 TECH requirements verified clean |
| fix-rate-limiter deferred to v1.5 | No in-memory rate limiter exists in codebase today; this is a new feature (Upstash Redis), not a bug fix | ✓ Good — backlogged for v1.5; now active in v1.5 PROD-07 |

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
*Last updated: 2026-05-14 — v1.4 milestone archived (Tech Debt Cleanup)*
