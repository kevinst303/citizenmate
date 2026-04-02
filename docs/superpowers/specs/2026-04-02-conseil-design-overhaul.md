# CitizenMate — Conseil/Pixfort Design Overhaul

**Date:** 2026-04-02
**Reference:** https://conseil.pixfort.com/consulting/
**Methodology:** AI Website Cloner pipeline (https://github.com/JCodesMore/ai-website-cloner-template)
**Fidelity:** Pixel-perfect
**Asset strategy:** Free/open-source equivalents for fonts and imagery

---

## Goal

Apply the Conseil/Pixfort consulting site design pixel-perfectly across all pages of CitizenMate — landing, study, practice, and dashboard. The cloner template's 5-phase pipeline (Recon → Foundation → Spec+Build → Assembly → QA) is adapted to CitizenMate's existing Next.js codebase rather than a fresh scaffold.

---

## Architecture

### Phase 1: Reconnaissance

Use Playwright MCP to inspect `https://conseil.pixfort.com/consulting/`:

- Full-page screenshots at **1440px** (desktop), **768px** (tablet), **390px** (mobile)
- Save to `citizenmate/docs/design-references/conseil/`
- **Interaction sweep:**
  - Scroll sweep: observe scroll-triggered behaviors (navbar shrink/blur, entrance animations, sticky elements)
  - Click sweep: every button, tab, pill, dropdown — record state changes
  - Hover sweep: all cards, buttons, nav items — record before/after CSS
  - Responsive sweep: document layout shifts at each breakpoint
- Save findings to `citizenmate/docs/research/conseil/BEHAVIORS.md`
- **Page topology:** Map every section top-to-bottom with working names, interaction models (static / click / scroll / time), z-index layers
- Save to `citizenmate/docs/research/conseil/PAGE_TOPOLOGY.md`
- **Design token extraction:** Run `getComputedStyle()` across key elements to capture exact values for colors, typography, spacing, shadows, border radii, transitions
- Save to `citizenmate/docs/research/conseil/DESIGN_TOKENS.md`

### Phase 2: Foundation

Sequential — apply globally before any component rebuilds:

1. **`globals.css`** — Replace CitizenMate's current design tokens with Conseil's extracted values:
   - Color palette (background, foreground, primary, muted, border, card, etc.)
   - Keyframe animations: marquee scroll, fade-up entrance, glassmorphism transitions
   - Global utility classes: backdrop blur, cubic-bezier transitions (`0.4s cubic-bezier(0.165, 0.84, 0.44, 1)`)
   - Scroll behaviors

2. **`layout.tsx`** — Update font stack to free equivalents of Conseil's typography:
   - Identify Conseil's font families from computed styles
   - Map to Google Fonts equivalents with matching metrics
   - Configure via `next/font/google`

3. **TypeScript types** — Create/update `src/types/` interfaces for any new content structures

4. **SVG icons** — Extract Conseil's inline SVGs as named React components in `src/components/icons.tsx`

5. **Asset download** — Write and run `scripts/download-conseil-assets.mjs` to fetch all images, videos from Conseil to `public/images/conseil/`

6. **Verify:** `npm run build` passes before proceeding

### Phase 3: Component Specification & Parallel Rebuild

For each component, three steps: **extract** (Playwright MCP + `getComputedStyle()`), **write spec file** (`citizenmate/docs/research/conseil/components/<name>.spec.md`), **dispatch builder agent** in git worktree.

Builders run in parallel; extraction continues while builders work.

#### Landing Page Components

| Component | File | Conseil Equivalent |
|---|---|---|
| Navbar | `src/components/shared/navbar.tsx` | Glassmorphism header, blur backdrop, scroll-triggered shrink |
| Hero | `src/components/landing/hero.tsx` | Full-bleed headline, CTA buttons, supporting imagery |
| How It Works | `src/components/landing/how-it-works.tsx` | Conseil's step/process section |
| Features | `src/components/landing/features.tsx` | Feature cards with icons, hover states |
| Social Proof | `src/components/landing/social-proof.tsx` | Logo marquee (50s animation) + testimonials |
| Pricing Preview | `src/components/landing/pricing-preview.tsx` | Conseil's pricing cards |
| FAQ | `src/components/landing/faq.tsx` | Conseil's accordion FAQ |
| CTA Section | `src/components/landing/cta-section.tsx` | Conseil's bottom CTA band |
| Footer | `src/components/landing/footer.tsx` | Conseil's multi-column footer |

#### Shared Components

| Component | File | Notes |
|---|---|---|
| Auth Modal | `src/components/shared/auth-modal.tsx` | Conseil card aesthetic (10px radius, subtle border, deep shadow) |
| Premium Gate | `src/components/shared/premium-gate.tsx` | Conseil modal/overlay patterns |

#### App Pages

| Page | Files | Notes |
|---|---|---|
| Study | `src/app/study/page.tsx` | Conseil interior page layout patterns |
| Practice | `src/app/practice/page.tsx` | Conseil interior page layout patterns |
| Dashboard | `src/app/dashboard/` | Conseil dashboard card grid patterns |

#### Spec File Format

Each spec file must include:
- Target file path
- Screenshot reference
- Interaction model (static / click / scroll / time)
- DOM structure
- Computed styles (exact values from `getComputedStyle()`)
- All states & behaviors (trigger, before/after CSS, transition)
- Text content (verbatim)
- Assets (image paths)
- Responsive behavior at 1440 / 768 / 390

### Phase 4: Page Assembly

After all components are built and merged:

- Wire all section components into `src/app/page.tsx`
- Implement page-level behaviors: scroll snap, IntersectionObserver entrance animations, sticky positioning, z-index layering
- Check smooth scroll feel (add Lenis if Conseil uses it)
- Verify `npm run build` passes clean

### Phase 5: Visual QA

- Playwright screenshots side-by-side: Conseil vs CitizenMate at 1440px and 390px
- Compare section by section — every discrepancy traced back to spec file
- Test all interactions: scroll, hover, click, responsive resize
- Fix discrepancies until visual match is confirmed

---

## Design Token Summary (to be confirmed in Phase 1)

| Token | Current CitizenMate | Target (Conseil) |
|---|---|---|
| Background | dark/teal mix | `#ffffff` |
| Primary | `#00727a` (teal) | Extracted in Phase 1 |
| Card border radius | mixed | `10px` |
| Card border | custom | `1px solid rgba(0,0,0,0.08)` |
| Card shadow | custom | `12px 12px 50px rgba(0,0,0,0.2)` |
| Navbar | standard | glassmorphism, `backdrop-filter: blur(20px)` |
| Standard transition | varies | `0.4s cubic-bezier(0.165, 0.84, 0.44, 1)` |
| Marquee | none | `50s linear infinite` |
| Font | Geist | Free equivalent of Conseil stack |
| Container max-width | varies | `1140px` |

---

## Constraints & Decisions

- **Fonts:** Use Google Fonts equivalents — no borrowed font URLs from Conseil
- **Images:** Download Conseil's images to `public/images/conseil/` for local reference; replace with stock equivalents where licensing is unclear
- **CitizenMate content:** All text content remains CitizenMate's (Australian citizenship test prep) — only visual design is cloned, not copy
- **Auth/payments:** No changes to auth logic, Stripe integration, or API routes
- **Scope boundary:** Only visual layer — no changes to `src/lib/`, `src/app/api/`, or data logic

---

## Out of Scope

- Backend / API / database changes
- Authentication logic changes
- Stripe / payment flow changes
- SEO metadata (separate concern)
- Accessibility audit
- New features or content changes

---

## Success Criteria

- Side-by-side visual diff at 1440px: all sections match Conseil layout within ~5px
- Side-by-side visual diff at 390px: mobile layout matches
- All interactive behaviors replicated (navbar scroll, marquee, hover states, entrance animations)
- `npm run build` passes clean
- No TypeScript errors
- All existing functionality (auth, quiz, study, payments) continues to work
