---
phase: 03-component-implementation
plan: C
subsystem: ui
tags: [nextjs, react, tailwind, conseil, landing-page, wave-divider, split-card, features, how-it-works, social-proof]

# Dependency graph
requires:
  - phase: 02-foundation
    provides: Conseil design tokens, card-conseil class, badge-pill-teal, section-alt-bg, btn-rounded-teal, feature-split.jpg image
provides:
  - Wave SVG divider between Hero and Features sections in page.tsx
  - Features 3-col card grid with Popular badge on center card (index 1)
  - How It Works Conseil split-card layout with asymmetric border-radii
  - Social Proof section verified SOCP-01/02/03 compliant
affects: [03-A, 03-B, 03-D, 03-E, 03-F, 03-G]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - Wave SVG divider using viewBox="0 0 1440 80" between dark hero and white section
    - Conseil split-card: flex row, left panel bg-[#F4F4F5] borderRadius "15px 0 0 15px", right panel with next/image fill
    - Data-driven badge on feature cards (badge field in features array, not index check in JSX)

key-files:
  created: []
  modified:
    - citizenmate/src/app/page.tsx
    - citizenmate/src/components/landing/features.tsx
    - citizenmate/src/components/landing/how-it-works.tsx
    - citizenmate/src/components/landing/social-proof.tsx

key-decisions:
  - "Popular badge on center card via data object (features[1].badge) rather than JSX index check — cleaner data-driven pattern"
  - "Wave SVG placed after Hero in natural document flow, no negative margin, to avoid overlap with hero marquee"
  - "HowItWorks: zig-zag alternating layout replaced with single Conseil split-card + simplified 3-step cards below"
  - "Social Proof verified spec-complete with no changes needed (SOCP-01/02/03 already satisfied)"

patterns-established:
  - "Split-card pattern: outer div overflow-hidden borderRadius 15px, left panel borderRadius '15px 0 0 15px', right panel borderRadius '0 15px 15px 0'"
  - "Wave divider: inline SVG in page.tsx after Hero, viewBox 0 0 1440 80, path fills white to bridge hero→features"

requirements-completed: [FEAT-01, FEAT-02, HIOW-01, HIOW-02, SOCP-01, SOCP-02, SOCP-03]

# Metrics
duration: ~20min
completed: 2026-04-06
---

# Phase 03-C: Features / How It Works / Social Proof Summary

**Wave SVG divider, Conseil split-card for How It Works, and Popular badge centered on Features — landing page core sections now spec-complete**

## Performance

- **Duration:** ~20 min
- **Completed:** 2026-04-06
- **Tasks:** 2
- **Files modified:** 4

## Accomplishments
- Added wave SVG divider in page.tsx after Hero for visual continuity between dark hero and white Features section
- Fixed Features Popular badge to center card (index 1, "Bilingual Study Mode") via data-driven `badge` field in features array
- Replaced zig-zag How It Works layout with Conseil split-card (left #F4F4F5 text panel + right feature-split.jpg image, asymmetric 15px radii)
- Verified Social Proof section SOCP-01/02/03 compliant — section-alt-bg, 3-col testimonial grid with avatar/name/rating/quote, dual CTA

## Task Commits

Each task was committed atomically:

1. **Task 1: Wave divider + Features Popular badge fix** - `689fbc3` (feat)
2. **Task 2: HowItWorks split-card + Social Proof verify** - `8ad352f` (feat)

## Files Created/Modified
- `citizenmate/src/app/page.tsx` - Wave SVG divider inserted after Hero component
- `citizenmate/src/components/landing/features.tsx` - Popular badge moved to center card (index 1 in data array)
- `citizenmate/src/components/landing/how-it-works.tsx` - Zig-zag layout replaced with Conseil split-card (164 lines → refactored)
- `citizenmate/src/components/landing/social-proof.tsx` - SOCP compliance comments added, no structural changes needed

## Decisions Made
- Popular badge implemented as a `badge` property on the features data array (`features[1].badge = "Popular"`) rather than conditional JSX based on index. This is cleaner and allows non-center positioning in future.
- Wave divider placed in natural document flow (no negative margin) to avoid overlap with hero's `position: absolute` bottom marquee.
- How It Works: the zig-zag step layout (alternating left/right) was fully replaced with one primary split-card plus three simplified step cards beneath — matching the Conseil single-feature-highlight pattern.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
None.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- Landing page core sections (Hero, Features, HowItWorks, SocialProof) are all Conseil-spec-complete
- Remaining landing sections (CTA, Footer, inline CTA) are handled in sibling plans 03-A/03-B/03-D/03-E/03-F/03-G
- No blockers

---
*Phase: 03-component-implementation*
*Completed: 2026-04-06*
