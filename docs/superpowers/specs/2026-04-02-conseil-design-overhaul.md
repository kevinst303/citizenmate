# CitizenMate — Conseil/Pixfort Design Overhaul

**Date:** 2026-04-02
**Reference:** https://conseil.pixfort.com/consulting/
**Methodology:** AI Website Cloner pipeline (https://github.com/JCodesMore/ai-website-cloner-template)
**Fidelity:** Pixel-perfect
**Asset strategy:** Imagen 2 (Google AI) for stock photo generation; free Google Fonts equivalents for typography

---

## Goal

Apply the Conseil/Pixfort consulting site design pixel-perfectly across all pages of CitizenMate — landing, study, practice, dashboard, quiz, blog, and legal pages. The cloner template's 5-phase pipeline (Recon → Foundation → Spec+Build → Assembly → QA) is adapted to CitizenMate's existing Next.js codebase rather than a fresh scaffold.

---

## Architecture

### Phase 1: Reconnaissance

Use Playwright MCP to inspect `https://conseil.pixfort.com/consulting/`.

**Output directories:**
- Screenshots → `citizenmate/docs/design-references/conseil/` (visual references only)
- Analysis docs → `citizenmate/docs/research/conseil/` (BEHAVIORS.md, PAGE_TOPOLOGY.md, DESIGN_TOKENS.md)
- Component specs → `citizenmate/docs/research/conseil/components/<name>.spec.md`

These are three distinct directories. Screenshots never go in the research folder and vice versa.

**Screenshots:**
- Full-page at **1440px** (desktop), **768px** (tablet), **390px** (mobile)
- Save with descriptive names to `citizenmate/docs/design-references/conseil/`

**Interaction sweep** (mandatory, before any other extraction):

- **Scroll sweep:** Scroll top-to-bottom slowly. Document: navbar shrink/blur trigger (exact scroll-Y px), entrance animations (which elements, animation type), sticky elements, scroll-snap points, smooth scroll library presence
- **Click sweep:** Every button, tab, pill, dropdown. Record state changes and content per state
- **Hover sweep:** All cards, buttons, nav items. Record before/after CSS and transition values
- **Responsive sweep:** Document layout shifts at 1440/768/390, noting which breakpoint triggers each change

Save all findings to `citizenmate/docs/research/conseil/BEHAVIORS.md`.

**Smooth scroll / Lenis detection (required checklist item):**
- Check for `.lenis` class, `.locomotive-scroll`, or custom scroll container wrappers
- Check `<script>` tags and network requests for Lenis/Locomotive packages
- Document the result explicitly: "Uses Lenis: YES/NO" in BEHAVIORS.md
- This decision must be made in Phase 1 because it affects Phase 2 (`layout.tsx` provider wrapping)

**Page topology:**
Map every section top-to-bottom with: working name, visual order, fixed/sticky vs flow, interaction model (static / click / scroll / time), z-index layer, dependencies on other sections.
Save to `citizenmate/docs/research/conseil/PAGE_TOPOLOGY.md`.

**Design token extraction:**
Run `getComputedStyle()` across key elements. Capture exact values for: colors (all variants), font families/sizes/weights/line-heights/letter-spacing, spacing scale, border radii, box shadows, transitions.
Save to `citizenmate/docs/research/conseil/DESIGN_TOKENS.md`.

### Phase 2: Foundation

Sequential. Complete and verify before Phase 3 begins. Document the outcome in `citizenmate/docs/research/conseil/FOUNDATION_GATE.md` (build output + font variable map + Lenis decision).

1. **`globals.css`** — Replace CitizenMate's current design tokens with Conseil's extracted values:
   - Color palette (background, foreground, primary, muted, border, card, etc.)
   - Keyframe animations: marquee scroll, fade-up entrance, glassmorphism transitions
   - Global utility classes: backdrop blur, cubic-bezier transitions (`0.4s cubic-bezier(0.165, 0.84, 0.44, 1)`)
   - Scroll behaviors

2. **`layout.tsx`** — Update font stack to free Google Fonts equivalents of Conseil's typography:
   - Identify Conseil's font families from Phase 1 computed styles
   - Map to Google Fonts equivalents with matching metrics
   - The existing font registrations use `Manrope` and `DM_Sans` with CSS variables `--font-heading-family` and `--font-body`. Replace these imports with the Conseil equivalents and update the variable values. Do not add duplicate registrations.
   - If Lenis is detected in Phase 1: wrap the layout in a Lenis provider here

3. **TypeScript types** — Create the `src/types/` directory if it does not exist, then create/update interfaces for any new content structures observed

4. **SVG icons** — Extract Conseil's inline SVGs as named React components in `src/components/icons.tsx`

5. **Asset generation** — Use Imagen 2 (Google AI API, key in `GOOGLE_AI_API_KEY` env var) to generate realistic stock photos matching Conseil's imagery style. Write a script `scripts/generate-conseil-images.mjs` that calls Imagen 2 with descriptive prompts derived from Conseil's image subjects. Save outputs to `public/images/conseil/`. Record each generated image's prompt and filename in `public/images/conseil/CREDITS.md`.

6. **Verify:** Run `npx tsc --noEmit` AND `npm run build`. Both must pass before proceeding to Phase 3.

### Phase 3: Component Specification & Parallel Rebuild

For each component: **extract** (Playwright MCP + `getComputedStyle()`), **write spec file**, **dispatch builder agent** in git worktree.

All design tokens are finalised in Phase 2 and are **read-only** during parallel component builds. Spec files must declare which CSS custom properties each component consumes (in the "Tokens Consumed" field) so builder agents don't attempt to modify `globals.css`.

Builders run in parallel; extraction continues while builders work.

#### Spec File Format

Each spec file at `citizenmate/docs/research/conseil/components/<name>.spec.md` must include all sections:

```markdown
# <ComponentName> Specification

## Overview
- **Target file:** `src/components/<path>/<ComponentName>.tsx`
- **Screenshot:** `docs/design-references/conseil/<screenshot>.png`
- **Interaction model:** <static | click-driven | scroll-driven | time-driven>

## Tokens Consumed
List all CSS custom properties this component reads from globals.css
(e.g., --color-background, --color-primary, --radius, etc.)
These are READ-ONLY during the build phase.

## DOM Structure
<Element hierarchy — what contains what>

## Computed Styles (exact values from getComputedStyle)

### Container
- display: ...
- padding: ...
- maxWidth: ...

### <Child element N>
- fontSize: ...
- color: ...

## States & Behaviors

### <Behavior name>
- **Trigger:** <exact mechanism>
- **State A (before):** <CSS values>
- **State B (after):** <CSS values>
- **Transition:** <duration, easing>
- **Implementation:** <CSS transition | IntersectionObserver | scroll listener | etc.>

### Hover states
- **<Element>:** <property>: <before> → <after>, transition: <value>

## Per-State Content (if applicable)
### State: "<name>"
- <content per state>

## Assets
- Images: `public/images/conseil/<file>` (generated via Imagen 2)
- Icons: <IconName> from icons.tsx

## Text Content (verbatim from Conseil — will be replaced with CitizenMate copy)

## Responsive Behavior
- **Desktop (1440px):** <layout>
- **Tablet (768px):** <changes>
- **Mobile (390px):** <changes>
- **Breakpoint:** layout switches at ~<N>px
```

Builder agents must verify `npx tsc --noEmit` before finishing.

#### Landing Page Components

| Component | File | Conseil Equivalent | Disposition |
|---|---|---|---|
| Navbar | `src/components/shared/navbar.tsx` | Glassmorphism header, blur backdrop, scroll-triggered shrink | Full restyle |
| Hero | `src/components/landing/hero.tsx` | Full-bleed headline, CTA buttons, imagery | Full restyle |
| How It Works | `src/components/landing/how-it-works.tsx` | Step/process section | Full restyle |
| Features | `src/components/landing/features.tsx` | Feature cards with icons, hover states | Full restyle |
| Social Proof | `src/components/landing/social-proof.tsx` | Logo marquee (50s) + testimonials | Full restyle |
| Pricing Preview | `src/components/landing/pricing-preview.tsx` | Conseil pricing cards | Full restyle |
| FAQ | `src/components/landing/faq.tsx` | Accordion FAQ | Full restyle |
| CTA Section | `src/components/landing/cta-section.tsx` | Bottom CTA band | Full restyle |
| Footer | `src/components/landing/footer.tsx` | Multi-column footer | Full restyle |

#### Shared Components

| Component | File | Disposition |
|---|---|---|
| Layout Shell | `src/components/shared/layout-shell.tsx` | Update `pt-16` spacer to match new navbar height; preserve z-index stacking order for all floating elements |
| Legal Layout | `src/components/shared/legal-layout.tsx` | Token-level only (bg, border, padding propagate via globals.css) |
| User Menu | `src/components/shared/user-menu.tsx` | Update avatar/dropdown to Conseil card aesthetic |
| Auth Modal | `src/components/shared/auth-modal.tsx` | Conseil card aesthetic (10px radius, subtle border, deep shadow) |
| Premium Gate | `src/components/shared/premium-gate.tsx` | Conseil modal/overlay patterns |
| Test Date Banner | `src/components/shared/test-date-banner.tsx` | Apply Conseil token-level restyling (bg, border, typography) |
| Test Date Modal | `src/components/shared/test-date-modal.tsx` | Apply Conseil card aesthetic |
| Cookie Consent | `src/components/shared/cookie-consent.tsx` | Token-level only (colors, radius, shadow) |
| Install Prompt | `src/components/shared/install-prompt.tsx` | Token-level only — preserve overlap fix with cookie consent from commit b730bef |
| Chat Widget | `src/components/shared/chat-widget.tsx` | Token-level only (colors, radius, shadow) |

#### Quiz Components

| Component | File | Disposition |
|---|---|---|
| Practice layout (top-level) | `src/app/practice/layout.tsx` | Token-level only; regression check in Phase 5 |
| Practice hub | `src/app/practice/page.tsx` | Apply Conseil interior page layout |
| Quiz layout | `src/app/practice/[testId]/layout.tsx` | Suppress global nav (already does) — update focused header to Conseil style |
| Quiz page | `src/app/practice/[testId]/page.tsx` | Apply Conseil interior page patterns |
| Quiz results | `src/app/practice/[testId]/results/page.tsx` | Token-level only; regression check in Phase 5 |
| Smart practice | `src/app/practice/smart/page.tsx` | Apply Conseil interior page patterns |
| Smart practice session | `src/app/practice/smart/session/page.tsx` | Token-level only; regression check in Phase 5 |
| Quiz header | `src/components/quiz/quiz-header.tsx` | Full restyle |
| Quiz progress | `src/components/quiz/quiz-progress.tsx` | Apply Conseil token |
| Quiz timer | `src/components/quiz/quiz-timer.tsx` | Apply Conseil token |
| Quiz card | `src/components/quiz/quiz-card.tsx` | Conseil card aesthetic (10px radius, shadow) |
| Results summary | `src/components/quiz/results-summary.tsx` | Conseil card aesthetic |
| Question review | `src/components/quiz/question-review.tsx` | Conseil card aesthetic |

#### Study Components

| Component | File | Disposition |
|---|---|---|
| Study page | `src/app/study/page.tsx` | Apply Conseil interior page layout |
| Study topic page | `src/app/study/[topicId]/page.tsx` | Apply Conseil interior page layout |
| Study section card | `src/components/study/study-section-card.tsx` | Conseil card aesthetic |
| Key facts panel | `src/components/study/key-facts-panel.tsx` | Conseil card aesthetic |
| Study progress bar | `src/components/study/study-progress-bar.tsx` | Apply Conseil token |
| Language toggle | `src/components/study/language-toggle.tsx` | Apply Conseil token |

#### Dashboard Components

| Component | File | Disposition |
|---|---|---|
| Dashboard page | `src/app/dashboard/page.tsx` | Conseil card grid layout |
| ABS Insights widget | `src/components/dashboard/abs-insights-widget.tsx` | Conseil card aesthetic |
| Country facts widget | `src/components/dashboard/country-facts-widget.tsx` | Conseil card aesthetic |
| Currency widget | `src/components/dashboard/currency-widget.tsx` | Conseil card aesthetic |
| Holidays widget | `src/components/dashboard/holidays-widget.tsx` | Conseil card aesthetic |
| Life in Australia | `src/components/dashboard/life-in-australia-section.tsx` | Conseil card aesthetic |
| Weather widget | `src/components/dashboard/weather-widget.tsx` | Conseil card aesthetic |

#### Blog, Legal & Utility Pages (scope decision)

These pages are **in scope for token-level restyling only** (colors, typography, border radii propagate automatically via `globals.css`). No layout restructuring unless the page looks broken after global token changes.

| Page | Disposition |
|---|---|
| `src/app/blog/page.tsx` + `[slug]/` | Token-level; regression check in Phase 5 |
| `src/app/terms/page.tsx` | Token-level; regression check in Phase 5 |
| `src/app/privacy/page.tsx` | Token-level; regression check in Phase 5 |
| `src/app/cookies/page.tsx` | Token-level; regression check in Phase 5 |
| `src/app/offline/page.tsx` | Token-level; regression check in Phase 5 |

### Phase 4: Page Assembly

After all components are built and merged:

- **Landing page (`src/app/page.tsx`):** Wire all section components; implement scroll snap, IntersectionObserver entrance animations, sticky positioning, z-index layering
- **Dashboard (`src/app/dashboard/page.tsx`):** Wire all widget components into Conseil card grid layout
- **Study hub (`src/app/study/page.tsx`):** Apply Conseil interior page assembly with study section components
- If Lenis was detected in Phase 1 and added in Phase 2: verify smooth scroll feels correct on all pages
- Verify `npm run build` passes clean

### Phase 5: Visual QA

**Layout QA:**
- Playwright screenshots side-by-side: Conseil vs CitizenMate at 1440px and 390px
- Compare section by section — every discrepancy traced back to its spec file
- Spatial tolerance: ~5px for layout boxes and spacing

**Typography QA:**
- Verify `line-height`, `letter-spacing`, and `font-size` for all heading levels (h1–h4) and body text match Conseil's extracted computed values within one rounding unit

**Interaction QA:**
- Test all interactions: navbar scroll, marquee, hover states, entrance animations, quiz card, dashboard widgets
- Responsive resize: verify layout at 1440, 768, 390

**Regression QA:**
- Verify blog, terms, privacy, cookies, and offline pages render correctly after global token changes
- Verify PWA install prompt does not overlap cookie consent (regression from commit b730bef)
- Verify auth, quiz, study, and payment flows are functionally unchanged

---

## Design Token Summary (confirmed in Phase 1)

| Token | Current CitizenMate | Target (Conseil) |
|---|---|---|
| Background | dark/teal mix | `#ffffff` |
| Primary | `#00727a` (teal) | Extracted in Phase 1 |
| Card border radius | mixed | `10px` |
| Card border | custom | `1px solid rgba(0,0,0,0.08)` |
| Card shadow (deep) | custom | `12px 12px 50px rgba(0,0,0,0.2)` |
| Card shadow (natural) | custom | `6px 6px 9px rgba(0,0,0,0.2)` |
| Navbar | standard | glassmorphism, `backdrop-filter: blur(20px) saturate(180%)`, 80% opacity |
| Standard transition | varies | `0.4s cubic-bezier(0.165, 0.84, 0.44, 1)` |
| Marquee | none | `50s linear infinite` |
| Font (heading) | Manrope (`--font-heading-family`) | Free equivalent of Conseil stack |
| Font (body) | DM Sans (`--font-body`) | Free equivalent of Conseil stack |
| Container max-width | varies | `1140px` |

---

## Constraints & Decisions

- **Fonts:** Use Google Fonts equivalents — no borrowed font URLs from Conseil
- **Images:** Generate realistic stock photos using Imagen 2 (Google AI). API key stored in `GOOGLE_AI_API_KEY` env var. Credits logged in `public/images/conseil/CREDITS.md`
- **CitizenMate content:** All text content remains CitizenMate's (Australian citizenship test prep) — Conseil copy is used as layout reference only
- **Auth/payments:** No changes to auth logic, Stripe integration, or API routes
- **Scope boundary:** Visual layer only — no changes to `src/lib/`, `src/app/api/`, or data logic
- **Design token ownership:** Tokens are set in Phase 2 and are read-only during Phase 3 parallel builds

---

## Out of Scope

- Backend / API / database changes
- Authentication logic changes
- Stripe / payment flow changes
- SEO metadata
- Accessibility audit
- New features or content changes
- Layout restructuring of blog/legal pages (token-level only)

---

## Success Criteria

- Side-by-side visual diff at 1440px: all landing sections match Conseil layout within ~5px
- Side-by-side visual diff at 390px: mobile layout matches
- Typography match: `font-size`, `line-height`, `letter-spacing` on all heading levels and body text within one rounding unit of Conseil's computed values
- All interactive behaviors replicated: navbar scroll/blur, marquee, hover states, entrance animations
- Blog/legal pages render correctly after global token changes
- PWA install prompt does not overlap cookie consent
- `npx tsc --noEmit` passes clean
- `npm run build` passes clean
- All existing functionality (auth, quiz, study, payments) continues to work
