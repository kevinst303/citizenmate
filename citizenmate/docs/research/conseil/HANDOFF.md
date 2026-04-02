# Conseil Design Overhaul — Handoff
Date: 2026-04-02

## Current State
Branch: `feat/conseil-design-overhaul`

## Completed
- [x] Design spec: `docs/superpowers/specs/2026-04-02-conseil-design-overhaul.md`
- [x] Phase 1 Reconnaissance:
  - Screenshots at 1440/768/390px → `docs/design-references/conseil/`
  - DESIGN_TOKENS.md, PAGE_TOPOLOGY.md, BEHAVIORS.md → `docs/research/conseil/`
- [x] Step 0: Spec finalized (all reviewer issues resolved)

## Next: Phase 2 — Foundation

### 2.1 Update `citizenmate/src/app/layout.tsx`
Replace fonts:
- `Manrope` → `Poppins` (weights: 400, 500, 600, 700, 800)
- `DM_Sans` → `Inter` (weights: 300, 400, 500, 600)
- Keep var names: `--font-heading-family` and `--font-body`

### 2.2 Update `citizenmate/src/app/globals.css`
Key token changes (from DESIGN_TOKENS.md):
- Primary: `#006d77` (very close to current `#00727a` — keep CitizenMate's teal OR update to exact Conseil value)
- Secondary/accent: `#3d348b` (purple — new addition for secondary CTAs)
- Background: `#FFFFFF`
- Alt bg: `#F4F4F5` (zinc-100)
- Card radius: 15px (update `--radius` and `.card-conseil`)
- Card border: `1px solid #E9ECEF`
- Card shadow: `rgba(0,0,0,0.05) 0px 2px 6px 0px, rgba(0,0,0,0.1) 0px 8px 19.2px 0px`
- Button radius: `10px`
- Body text color: `#3F3F46` (zinc-700)
- Heading color: `#000000`
- Remove glassmorphism from `.navbar-glass` → replace with solid white
- Update `.card-conseil` → white bg, 15px radius, `1px solid #E9ECEF` border, card shadow
- Keep all quiz/dashboard animation keyframes

### 2.3 Update `citizenmate/src/components/shared/layout-shell.tsx`
- Navbar is 66px — verify `pt-16` (64px) spacer is close enough or update to `pt-[66px]`

### 2.4 Generate images with Imagen 2
- Script: `citizenmate/scripts/generate-conseil-images.mjs`
- API key: `GOOGLE_AI_API_KEY` env var
- Save to `citizenmate/public/images/conseil/`
- Log prompts in `citizenmate/public/images/conseil/CREDITS.md`

### 2.5 Extract Conseil SVGs (optional, do after 2.1–2.4)
- Wave divider SVG between hero and services sections
- Arrow icons, check icons used in feature lists

### 2.6 Gate: run `npx tsc --noEmit` AND `npm run build`
- Save output to `docs/research/conseil/FOUNDATION_GATE.md`

## Phase 3 Summary (after Phase 2)
7 parallel worktrees:
- A: Navbar + Layout Shell + User Menu
- B: Hero + CTA + Footer
- C: Features + How It Works + Social Proof
- D: Pricing + FAQ + Shared Modals
- E: Quiz components
- F: Study components
- G: Dashboard components

## Key Design Decisions (confirmed from Conseil)
- Navbar: solid white fixed (NO glassmorphism) — transition: `0.2s cubic-bezier(0.165,0.84,0.44,1)`
- Cards: white, 15px radius, `1px solid #E9ECEF`, shadow
- Fonts: Poppins (headings) + Inter (body)
- No Lenis
- No entrance animations (CitizenMate keeps Framer Motion but softened)
- Container: 1140px
- Section alt bg: `#F4F4F5`

## Files to Read Before Phase 2
- `citizenmate/docs/research/conseil/DESIGN_TOKENS.md`
- `citizenmate/docs/research/conseil/BEHAVIORS.md`
- `citizenmate/src/app/globals.css` (current tokens to update)
- `citizenmate/src/app/layout.tsx` (current font setup)
