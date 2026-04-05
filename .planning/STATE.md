# Project State: CitizenMate Conseil Design Overhaul

## Project Reference

See: .planning/PROJECT.md (updated 2026-04-02)

**Core value:** Every page of CitizenMate renders with the Conseil design system
**Current focus:** Phase 3 — Component Implementation

## Current Phase

**Phase 3: Component Implementation**
Status: In progress — Plans A–G complete

### Plan Progress

| Plan | Name | Status | Completed |
|------|------|--------|-----------|
| 03-A | Navbar, Layout Shell & User Menu | Complete | 2026-04-04 |
| 03-B | Hero, Feature Section & Pricing Cards | Complete | 2026-04-04 |
| 03-C | Wave Divider & Popular Badge | Complete | 2026-04-04 |
| 03-D | Modal Panels (MODL-01) | Complete | 2026-04-04 |
| 03-E | QuizCard Conseil Tokens | Complete | 2026-04-04 |
| 03-F | Study Flow Components | Complete | 2026-04-05 |
| 03-G | ABS Chart & SubpageHero | Complete | 2026-04-05 |

## Completed Phases

- **Phase 1: Reconnaissance** — Complete (2026-04-02)
  - DESIGN_TOKENS.md, PAGE_TOPOLOGY.md, BEHAVIORS.md extracted
  - Location: citizenmate/docs/research/conseil/

- **Phase 2: Foundation** — Complete (2026-04-02)
  - Fonts: Poppins + Inter
  - Tokens: #006d77, #3d348b, card shadows, 15px radius, solid white navbar
  - Images: hero-bg.jpg, feature-split.jpg, operations.jpg, cta-bg.jpg (Imagen 4)
  - Gate: TypeScript ✓, Build ✓ (citizenmate/docs/research/conseil/FOUNDATION_GATE.md)

## Key Decisions

| Decision | Rationale | Date |
|----------|-----------|------|
| No Lenis | Conseil uses native browser scroll | 2026-04-02 |
| Navbar: solid white fixed | Conseil has no backdrop-blur/glassmorphism | 2026-04-02 |
| Poppins + Inter fonts | Exact Conseil font stack | 2026-04-02 |
| 7 parallel worktree tracks for Phase 3 | Independent component groups | 2026-04-02 |
| Imagen 4 for image generation | Imagen 2 unavailable on API key | 2026-04-02 |
| cm-eucalyptus replaced with cm-teal in study flow | cm-eucalyptus not in Conseil palette | 2026-04-05 |
| LanguageToggle uses rounded-[10px] not 15px | Button-sized element uses smaller radius per Conseil spec | 2026-04-05 |
| InlineCTA as standalone zero-prop component | Cleaner import pattern vs inline JSX in page.tsx | 2026-04-06 |
| CTASection reduced to single CTA button | Spec requires single button; removed secondary View Pricing action | 2026-04-06 |
| Footer Support → Company + Australia 4th column | Matches Conseil 4-column layout spec | 2026-04-06 |
| globals.css .card-conseil fixed globally (10px → 15px) | All card consumers update automatically without per-file changes (03-D) | 2026-04-06 |
| Modal panels use inline boxShadow for Conseil dual-layer shadow | Tailwind shadow-2xl does not match Conseil spec (03-D) | 2026-04-06 |
| quiz-header submit button: cm-navy → cm-teal | Consistent with Conseil teal CTA pattern (03-D) | 2026-04-06 |

## Branch

`feat/conseil-design-overhaul`

---
*State initialized: 2026-04-02*
