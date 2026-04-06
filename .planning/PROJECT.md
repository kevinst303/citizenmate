# CitizenMate — Conseil Design Overhaul

## What This Is

CitizenMate is a Next.js 16 civic-education SaaS app (quiz, study, and dashboard flows). The v1.0 milestone delivered a pixel-accurate redesign based on the conseil.pixfort.com consulting template — every visual design token, typography choice, component layout, and page section now matches the Conseil aesthetic throughout the app.

## Core Value

Every page of CitizenMate renders with the Conseil design system: Poppins + Inter typography, teal/purple palette, 15px-radius cards, solid white navbar, and component layouts that match the Conseil reference.

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

---
*Last updated: 2026-04-06 after v1.0 milestone (Conseil Design Overhaul shipped)*
