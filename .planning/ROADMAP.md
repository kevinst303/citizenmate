# Roadmap: CitizenMate Conseil Design Overhaul

## Overview

Three-phase overhaul applying the conseil.pixfort.com consulting template design to CitizenMate. Phase 1 (reconnaissance) extracted the complete Conseil design system. Phase 2 (foundation) applied global tokens, fonts, and base styles. Phase 3 (components) applies the design to every component and page section via 7 parallel worktree tracks.

## Phases

- [x] **Phase 1: Reconnaissance** - Extract Conseil design system (tokens, topology, behaviors)
- [x] **Phase 2: Foundation** - Apply global CSS tokens, fonts, navbar, base styles; generate hero images
- [x] **Phase 3: Component Implementation** - Apply Conseil design to all components across 7 parallel tracks (completed 2026-04-05)

## Phase Details

### Phase 1: Reconnaissance
**Goal**: Extract complete Conseil design system from conseil.pixfort.com for use as implementation reference
**Depends on**: Nothing
**Requirements**: (pre-GSD — captured in DESIGN_TOKENS.md, PAGE_TOPOLOGY.md, BEHAVIORS.md)
**Success Criteria** (what must be TRUE):
  1. DESIGN_TOKENS.md documents all colors, typography, spacing, shadows, radii
  2. PAGE_TOPOLOGY.md maps every section and its CitizenMate equivalent
  3. BEHAVIORS.md documents all interactions and animations
**Plans**: Complete

Plans:
- [x] Phase 1 complete — artifacts in citizenmate/docs/research/conseil/

### Phase 2: Foundation
**Goal**: Apply Conseil design tokens globally — fonts, CSS variables, navbar, and hero images — so all components inherit the correct base
**Depends on**: Phase 1
**Requirements**: (pre-GSD — verified in FOUNDATION_GATE.md)
**Success Criteria** (what must be TRUE):
  1. `npx tsc --noEmit` passes with zero errors
  2. `npm run build` passes with zero errors/warnings
  3. Poppins and Inter fonts load correctly
  4. CSS tokens match Conseil values (primary #006d77, secondary #3d348b, card shadow, 15px radius)
  5. Navbar renders as solid white fixed (no glassmorphism)
**Plans**: Complete

Plans:
- [x] Phase 2 complete — FOUNDATION_GATE.md passed 2026-04-02

### Phase 3: Component Implementation
**Goal**: Apply Conseil design to all CitizenMate components and page sections across 7 parallel tracks
**Depends on**: Phase 2
**Requirements**: NAV-01, NAV-02, NAV-03, NAV-04, HERO-01, HERO-02, HERO-03, CTA-01, CTA-02, FOOT-01, FOOT-02, FEAT-01, FEAT-02, HIOW-01, HIOW-02, SOCP-01, SOCP-02, SOCP-03, PRIC-01, PRIC-02, FAQ-01, MODL-01, QUIZ-01, QUIZ-02, QUIZ-03, STUD-01, STUD-02, STUD-03, DASH-01, DASH-02, DASH-03
**Success Criteria** (what must be TRUE):
  1. Navbar is solid white 66px fixed with correct scroll transition — no glassmorphism
  2. Hero renders with bg image, dark overlay, star badge, avatar group, white pill CTA, and marquee logo strip
  3. Features section renders as 3-column card grid; How It Works uses split-card layout with wave divider
  4. Testimonials render as 3-col card grid on zinc-100 background
  5. Pricing and FAQ use Conseil card design
  6. Quiz, Study, and Dashboard flows use Conseil design tokens throughout
  7. `npx tsc --noEmit` + `npm run build` pass with zero errors after all tracks merge
**Plans**: 7 plans (all Wave 1 — parallel execution)

Plans:
- [ ] 03-A-PLAN.md — Navbar + Layout Shell + User Menu (NAV-01, NAV-02, NAV-03, NAV-04)
- [ ] 03-B-PLAN.md — Hero + CTA sections + Footer (HERO-01–03, CTA-01–02, FOOT-01–02)
- [ ] 03-C-PLAN.md — Features + How It Works + Social Proof (FEAT-01–02, HIOW-01–02, SOCP-01–03)
- [ ] 03-D-PLAN.md — Pricing + FAQ + Shared Modals (PRIC-01–02, FAQ-01, MODL-01)
- [ ] 03-E-PLAN.md — Quiz components (QUIZ-01–03)
- [ ] 03-F-PLAN.md — Study components (STUD-01–03)
- [ ] 03-G-PLAN.md — Dashboard components (DASH-01–03)

## Progress

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Reconnaissance | ✓ | Complete | 2026-04-02 |
| 2. Foundation | ✓ | Complete | 2026-04-02 |
| 3. Component Implementation | 7/7 | Complete   | 2026-04-05 |
