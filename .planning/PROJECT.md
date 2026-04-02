# CitizenMate — Conseil Design Overhaul

## What This Is

CitizenMate is a Next.js 16 civic-education SaaS app (quiz, study, and dashboard flows). This milestone applies a pixel-accurate redesign based on the conseil.pixfort.com consulting template — updating all visual design tokens, typography, component layouts, and page sections to match the Conseil aesthetic throughout every page of the app.

## Core Value

Every page of CitizenMate renders with the Conseil design system: Poppins + Inter typography, teal/purple palette, 15px-radius cards, solid white navbar, and component layouts that match the Conseil reference.

## Requirements

### Validated

- ✓ Design tokens extracted from conseil.pixfort.com — Phase 1
- ✓ Fonts replaced (Manrope → Poppins, DM_Sans → Inter) — Phase 2
- ✓ CSS design tokens updated (primary #006d77, secondary #3d348b, card shadows, radii) — Phase 2
- ✓ Navbar converted to solid white fixed — Phase 2
- ✓ Hero background images generated (Imagen 4) — Phase 2
- ✓ TypeScript + build clean (zero errors) — Phase 2

### Active

- [ ] Navbar, layout shell, and user menu styled to Conseil spec
- [ ] Hero, CTA sections, and Footer styled to Conseil spec
- [ ] Features, How It Works, and Social Proof/Testimonials styled to Conseil spec
- [ ] Pricing, FAQ, and shared modals styled to Conseil spec
- [ ] Quiz flow components styled to Conseil design tokens
- [ ] Study flow components styled to Conseil design tokens
- [ ] Dashboard components styled to Conseil design tokens

### Out of Scope

- Lenis/Locomotive Scroll — Conseil uses native browser scroll; CitizenMate keeps native scroll
- New pages or features — design-only overhaul
- Conseil's blog section — CitizenMate has its own blog; structure not changed
- Mobile-only design changes — responsive updates only where Conseil spec differs significantly

## Context

- Branch: `feat/conseil-design-overhaul`
- Reference: https://conseil.pixfort.com/consulting/
- Design docs: `citizenmate/docs/research/conseil/` (DESIGN_TOKENS.md, BEHAVIORS.md, PAGE_TOPOLOGY.md, HANDOFF.md)
- Foundation gate: Passed (see `citizenmate/docs/research/conseil/FOUNDATION_GATE.md`)
- Key confirmed tokens: Primary #006d77, Secondary #3d348b, Fonts: Poppins + Inter, Cards: 15px radius, 1px #E9ECEF border, dual-layer shadow
- Container: 1140px max-width
- Next.js version has breaking changes — read `node_modules/next/dist/docs/` before writing code

## Constraints

- **Framework**: Next.js 16 with breaking changes — check docs before any Next.js API usage
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
| 7 parallel worktree tracks for Phase 3 | Independent component groups, max parallelism | — Pending |

---
*Last updated: 2026-04-02 after Phase 2 completion (Foundation Gate passed)*
