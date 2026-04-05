---
phase: 03-component-implementation
plan: B
subsystem: ui
tags: [nextjs, tailwind, landing-page, hero, cta, footer, marquee]

# Dependency graph
requires:
  - phase: 02-foundation
    provides: Conseil CSS tokens (btn-rounded, btn-rounded-teal, badge-pill, @keyframes marquee), hero-bg.jpg, cta-bg.jpg, globals.css

provides:
  - Hero section with bg image + black/50 overlay, star badge, avatar group, white pill CTA, marquee logo strip (HERO-01, HERO-02, HERO-03)
  - CTASection simplified to single CTA button (CTA-01)
  - InlineCTA standalone component — Q&A banner with teal button (CTA-02)
  - Footer with max-w-[1140px] inner container, 4-column layout (brand/contact, Product, Company, Australia), social links bottom bar (FOOT-01, FOOT-02)

affects: [03-C, 03-D, 03-E, 03-F, 03-G, page-assembly]

# Tech tracking
tech-stack:
  added: []
  patterns: [InlineCTA as static zero-prop component, footer full-width bg with inner max-w container, CTASection single-CTA pattern]

key-files:
  created:
    - citizenmate/src/components/landing/inline-cta.tsx
  modified:
    - citizenmate/src/components/landing/hero.tsx
    - citizenmate/src/components/landing/cta-section.tsx
    - citizenmate/src/components/landing/footer.tsx
    - citizenmate/src/app/page.tsx

key-decisions:
  - "InlineCTA as standalone zero-prop component (not inline JSX in page.tsx) for clarity"
  - "CTASection reduced to single CTA button — removed secondary 'View Pricing' action per spec"
  - "Footer Support column renamed to Company; new Australia resources column added as 4th"

patterns-established:
  - "Footer pattern: <footer> full-width for bg, inner <div> gets max-w-[1140px] constraint"
  - "InlineCTA pattern: static section, no props, no animations — pure Tailwind"
  - "Page order: Hero → wave → Features → HowItWorks → SocialProof → InlineCTA → CTASection → PricingPreview → FAQ → Footer"

requirements-completed: [HERO-01, HERO-02, HERO-03, CTA-01, CTA-02, FOOT-01, FOOT-02]

# Metrics
duration: ~20min
completed: 2026-04-06
---

# Phase 03 Plan B: Hero, CTA Sections, and Footer Summary

**Hero bg-image + black/50 overlay, white pill CTA, marquee strip; new InlineCTA Q&A banner; CTASection reduced to single button; footer rebuilt to 4-column max-w-[1140px] layout**

## Performance

- **Duration:** ~20 min
- **Started:** 2026-04-06T01:04:00Z (estimated)
- **Completed:** 2026-04-06T01:24:47Z
- **Tasks:** 2
- **Files modified:** 4 modified, 1 created

## Accomplishments
- Hero confirmed spec-complete: bg-black/50 overlay, star-rating badge, h1, subtitle, avatar group, white pill CTA (btn-rounded bg-white text-cm-teal), marquee logo strip with animate-[marquee_25s_linear_infinite]
- New InlineCTA component created and inserted into page.tsx between SocialProof and CTASection — static centered section with teal button (CTA-02)
- CTASection simplified: single CTA button replacing previous dual-button layout (CTA-01)
- Footer rebuilt: max-w-[1140px] inner container, Support column renamed to Company, Australia resources column added as 4th, social icon links in bottom bar (FOOT-01, FOOT-02)

## Task Commits

Each task was committed atomically:

1. **Task 1: Verify Hero completeness** — included in `562d354` (hero.tsx already spec-complete, no changes needed)
2. **Task 2: Add InlineCTA, simplify CTASection, rebuild footer** — `562d354` (feat)

**Note:** Both tasks landed in a single commit because hero.tsx required no changes; all work was in the Task 2 files.

## Files Created/Modified
- `citizenmate/src/components/landing/inline-cta.tsx` — New zero-prop CTA-02 section (Q&A banner, teal button)
- `citizenmate/src/components/landing/cta-section.tsx` — Simplified to single CTA button
- `citizenmate/src/components/landing/footer.tsx` — 4-column layout in max-w-[1140px] inner container; Australia column added
- `citizenmate/src/app/page.tsx` — InlineCTA import + render inserted before CTASection

## Decisions Made
- InlineCTA as a standalone component (not inline JSX) — cleaner import pattern and reusability
- CTASection secondary "View Pricing" button removed per spec ("single button")
- Footer 3rd column renamed Support → Company; 4th Australia column added with Dept. of Home Affairs, IELTS, DIBP, immi.homeaffairs.gov.au links

## Deviations from Plan

None — plan executed exactly as written. Hero.tsx was already spec-complete from Phase 2 work; Task 1 required zero changes.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Hero, CTASection, InlineCTA, and Footer are Conseil spec-complete
- page.tsx composition order is locked in for remaining component tracks (03-C through 03-G)
- All 7 requirements (HERO-01 through FOOT-02) satisfied; ready for downstream component plans

---
*Phase: 03-component-implementation*
*Completed: 2026-04-06*
