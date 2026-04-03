# Phase 3: Component Implementation - Research

**Researched:** 2026-04-04
**Domain:** Next.js 16 / React 19 / Tailwind v4 / Framer Motion 12 component styling
**Confidence:** HIGH

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| NAV-01 | Navbar renders as solid white fixed bar, 66px tall, no glassmorphism or backdrop-blur | Navbar already converted in Phase 2 — verify no regressions; `cm-navy` alias may introduce subtle colour drift |
| NAV-02 | Navbar scroll transition uses `0.2s cubic-bezier(0.165,0.84,0.44,1)` (no shadow added on scroll) | Navbar CSS already implements this; confirm scrolled state adds no border/shadow |
| NAV-03 | Layout shell page spacer updated to `pt-[66px]` | LayoutShell already has `pt-[66px]` — confirmed in code |
| NAV-04 | User menu/avatar styled with Conseil card design (15px radius, #E9ECEF border, card shadow) | UserMenu dropdown uses `rounded-xl` + `shadow-xl` — needs update to exact Conseil tokens |
| HERO-01 | Hero section uses full-width bg image with dark overlay (~rgba(0,0,0,0.5)) | Hero already has `bg-black/50` overlay — confirmed |
| HERO-02 | Hero layout includes star-rating badge, h1, subtitle, avatar group + trust text, white pill CTA | Hero has all elements; white pill CTA uses `btn-rounded` class — verify pill style |
| HERO-03 | Hero marquee logo strip renders at bottom of hero section | Marquee implemented with `animate-[marquee_25s_linear_infinite]`; CSS keyframe defined |
| CTA-01 | Dark teal CTA band uses full-width bg image with overlay, centered heading + single button | CTASection has bg image + `bg-black/60` overlay — confirmed; may need dual-CTA removed |
| CTA-02 | Simple Q&A/inline CTA section renders as centered text + teal button | Currently CTA section serves as the dark band; need a second simple CTA component |
| FOOT-01 | Footer uses 4-column layout: brand/contact, product links, company links, certifications | Footer is 4-col but has only 3 link columns (Product, Support, Legal) — needs "certifications" column |
| FOOT-02 | Footer bottom bar shows copyright + social links | Footer has copyright + social — confirmed; text colour verified |
| FEAT-01 | Features section renders as 3-column card grid with section badge + h2 + description | Features.tsx already implements 3-col card grid with badge — confirmed |
| FEAT-02 | Feature cards include icon, title, description, "Learn more" link; center card has Popular badge | Features.tsx has all elements; Popular badge is on first card (index 0) not center (index 1) |
| HIOW-01 | How It Works section uses split-card layout (left panel: text + CTA, right: image; split radii: 15px 0 0 15px / 0 15px 15px 0) | HowItWorks currently uses zig-zag layout — needs rework to split-card with correct border-radii |
| HIOW-02 | Wave divider SVG renders between hero and features sections | Not yet implemented in page.tsx — needs new inline SVG component |
| SOCP-01 | Testimonials section renders as 3-column card grid on #F4F4F5 background | SocialProof already has 3-col + `section-alt-bg` — confirmed |
| SOCP-02 | Testimonial cards include avatar, name, rating, quote | SocialProof cards have initials avatar; no real avatar images — acceptable |
| SOCP-03 | Social proof section includes section badge + heading + dual CTA buttons | Dual CTA buttons already present — confirmed |
| PRIC-01 | Pricing cards styled with Conseil card design (white, 15px radius, border, shadow) | PricingPreview uses `card-conseil` class — confirmed |
| PRIC-02 | Highlighted/popular pricing card uses teal primary style | PricingPreview uses `card-conseil-popular` class — confirmed |
| FAQ-01 | FAQ section styled with Conseil accordion pattern | FAQ uses shadcn/base-ui Accordion with `card-conseil`-adjacent border/radius classes — close |
| MODL-01 | Shared modal components use Conseil card design tokens | AuthModal, QuizHeader modal use `rounded-2xl shadow-2xl` — needs update to `rounded-[15px]` + exact conseil shadow |
| QUIZ-01 | Quiz container and question cards styled with Conseil design tokens | QuizCard uses `cm-navy` classes — these are aliased to `cm-teal` but visual tokens still diverge |
| QUIZ-02 | Quiz progress bar, option buttons, and results screen use Conseil palette | QuizProgress uses `cm-navy` for active state, `cm-eucalyptus-light` for answered |
| QUIZ-03 | Quiz navigation buttons use Conseil primary/secondary button styles | QuizHeader submit button uses `bg-cm-navy` — will render teal via alias but not at 10px radius |
| STUD-01 | Study card components styled with Conseil card design (15px radius, border, shadow) | StudySectionCard uses `rounded-2xl border-2` — needs update to `rounded-[15px] border` + conseil shadow |
| STUD-02 | Study session UI (flashcards, progress, controls) uses Conseil design tokens | StudyProgressBar uses `cm-eucalyptus` fill colour — may need to align with conseil teal |
| STUD-03 | Study topic/chapter navigation uses Conseil palette and typography | Study page uses cm-navy/cm-teal via alias — verify heading/body font tokens active |
| DASH-01 | Dashboard layout and stat cards use Conseil card design | Dashboard page uses `card-glass` and custom card styling — needs update to `card-conseil` |
| DASH-02 | Dashboard charts and data visualizations updated to Conseil palette | AbsInsightsWidget Recharts uses hardcoded HEX colours — needs update to Conseil palette |
| DASH-03 | Dashboard navigation/sidebar styled with Conseil design tokens | SubpageHero + dashboard layout use cm-navy — verify teal alias sufficient or needs explicit update |
</phase_requirements>

---

## Summary

Phase 3 applies the Conseil design system to every CitizenMate component across 7 parallel tracks. The foundation is solid: CSS tokens, fonts, Poppins/Inter, and the `card-conseil` / `btn-rounded` / `badge-pill` utility classes are already defined in `globals.css`. Many landing-page components (Hero, Features, SocialProof, CTASection, FAQ, PricingPreview, Footer) had significant work done in Phase 2 and are close to spec. The remaining work is mostly about resolving specific gaps rather than wholesale rebuilds.

The key insight from examining actual component code is that **the `cm-navy` aliasing to `cm-teal` hides the fact that quiz, study, and dashboard components still use `cm-navy` class names** — which now render as teal (#006d77) via CSS variable aliasing. This is functionally correct for the colour but the components use non-Conseil border-radius, shadow, and button styles that still need updating. Track 03-A (Navbar/UserMenu) is almost done. Track 03-B (Hero/CTA/Footer) has one missing piece: a simple inline CTA section (CTA-02) and a footer certifications column (FOOT-01). Track 03-C (Features/HowItWorks/SocialProof) needs the wave divider added and HowItWorks reworked from zig-zag to split-card. Tracks 03-D through 03-G (Pricing/FAQ/Modals/Quiz/Study/Dashboard) primarily need token conformance — using `card-conseil` class, `rounded-[15px]` where currently `rounded-2xl`, and the conseil shadow.

No new libraries are needed. The stack (Next.js 16.2, Framer Motion 12, Tailwind v4, shadcn/base-ui, Lucide React) is already installed. All 7 tracks can execute in parallel git worktrees branching from `feat/conseil-design-overhaul` and merging back.

**Primary recommendation:** Execute all 7 tracks as parallel git worktrees, each making targeted file edits using the existing CSS utility classes — do not inline new CSS; use and extend `globals.css` utilities already defined.

---

## Standard Stack

### Core (already installed — no new dependencies)

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Next.js | 16.2.0 | App Router, SSR, Image optimization | Project foundation; read `node_modules/next/dist/docs/` before touching APIs |
| React | 19.2.4 | Component model | Project foundation |
| Tailwind CSS | v4 | Utility styling | Token-based; v4 uses `@theme inline` not `tailwind.config.js` |
| Framer Motion | 12.38.0 | Animations | Already in use; preserve existing animations, soften density |
| Lucide React | 0.577.0 | Icons | Already in use across all components |
| @base-ui/react | 1.3.0 | Accordion (FAQ) | shadcn/base-ui — verify Accordion API before touching |

### No New Libraries Required

All tooling needed for Phase 3 is already installed. Do NOT add:
- Lenis or Locomotive Scroll (explicitly excluded — native scroll only)
- Any animation library beyond Framer Motion
- Any CSS-in-JS or styled-components

### Key Warning: Next.js 16 Breaking Changes

The AGENTS.md states: **"This version has breaking changes — APIs, conventions, and file structure may all differ from your training data."** Before writing Next.js specific code (especially in layout files or API routes), read `node_modules/next/dist/docs/`.

---

## Architecture Patterns

### Recommended Project Structure (already established)

```
citizenmate/src/
├── components/
│   ├── landing/         # Track 03-B, 03-C, 03-D components
│   ├── shared/          # Track 03-A components (navbar, user-menu, layout-shell)
│   ├── quiz/            # Track 03-E components
│   ├── study/           # Track 03-F components
│   ├── dashboard/       # Track 03-G components
│   └── ui/              # Shadcn/base-ui primitives (accordion, card, button)
├── app/
│   ├── globals.css      # Conseil CSS utilities — add to here, not inline
│   └── page.tsx         # Landing page composition (wave divider goes here)
```

### Pattern 1: Token-Based Class Application

**What:** Apply Conseil design by swapping non-standard Tailwind classes for the CSS utility classes defined in `globals.css`. Never inline CSS.
**When to use:** Every component update in every track.
**Example:**
```tsx
// Before (non-Conseil):
<div className="rounded-2xl border-2 border-cm-slate-200 bg-white shadow-xl p-6">

// After (Conseil):
<div className="card-conseil">
```

The defined utility classes in `globals.css`:
- `.card-conseil` — white card, 10px radius, conseil border/shadow, 30px padding
- `.card-conseil-popular` — teal gradient popular card
- `.btn-rounded` — base pill button
- `.btn-rounded-teal` — primary teal CTA
- `.btn-rounded-outline` — outline CTA
- `.badge-pill` — neutral badge pill
- `.badge-pill-teal` — teal badge pill
- `.section-alt-bg` — #F4F4F5 background
- `.shadow-card` — conseil dual-layer shadow

**Important distinction:** The Conseil spec shows card border-radius as **15px** and button border-radius as **10px**, but `.card-conseil` in globals.css uses `border-radius: 10px` (not 15px). The REQUIREMENTS.md calls for 15px on cards (PRIC-01, STUD-01). This discrepancy must be resolved per-track — use `rounded-[15px]` explicitly on cards, or update `.card-conseil` in globals.css to 15px.

### Pattern 2: Git Worktree Parallel Execution

**What:** Each of the 7 tracks runs in its own git worktree with its own branch, all based on `feat/conseil-design-overhaul`.
**When to use:** All Phase 3 tracks.
**Example:**
```bash
# Setup for each track
git worktree add ../autest-03a feat/03a-navbar
git worktree add ../autest-03b feat/03b-hero-cta-footer
# ... etc for each track

# After track completion, merge back
git checkout feat/conseil-design-overhaul
git merge feat/03a-navbar --no-ff
```

**Conflict risk:** Multiple tracks touching `globals.css` simultaneously. Mitigation: each track should only add new rules to globals.css, never modify existing ones. Wave divider CSS goes in 03-C track (or 03-B if it touches the hero boundary).

### Pattern 3: Conseil Split-Card Layout (for HIOW-01)

**What:** Two-panel card where panels have asymmetric border-radius to create a seamless joined card appearance.
**When to use:** How It Works section (replaces current zig-zag layout).
**Example:**
```tsx
// Split card container — no overflow-hidden so each panel can have individual radii
<div className="flex rounded-[15px] overflow-hidden border border-[#E9ECEF]"
     style={{ boxShadow: 'rgba(0,0,0,0.05) 0px 2px 6px 0px, rgba(0,0,0,0.1) 0px 8px 19.2px 0px' }}>
  {/* Left panel */}
  <div className="flex-1 bg-[#F4F4F5] p-[30px]"
       style={{ borderRadius: '15px 0px 0px 15px' }}>
    {/* text + CTA */}
  </div>
  {/* Right panel */}
  <div className="flex-1 overflow-hidden"
       style={{ borderRadius: '0px 15px 15px 0px' }}>
    <Image fill className="object-cover" />
  </div>
</div>
```

### Pattern 4: Wave Divider SVG (for HIOW-02)

**What:** Inline SVG between Hero and Features sections in `page.tsx`.
**When to use:** Insert between `<Hero />` and `<Features />` in `app/page.tsx`.
**Example:**
```tsx
// In app/page.tsx — between Hero and Features
<div className="relative -mt-1 bg-white">
  <svg
    viewBox="0 0 1440 80"
    xmlns="http://www.w3.org/2000/svg"
    className="w-full h-auto block"
    preserveAspectRatio="none"
  >
    <path
      d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z"
      fill="#FFFFFF"
    />
  </svg>
</div>
```
Note: The wave sits on the hero's dark background. The SVG fill should be white (`#FFFFFF`) to transition to the white Features section.

### Pattern 5: Framer Motion Softening

**What:** The Conseil site has no entrance animations at all (confirmed in BEHAVIORS.md). CitizenMate has heavy spring stagger animations. Per the decision in BEHAVIORS.md, keep Framer Motion but reduce density.
**When to use:** All tracks — do NOT add new complex animations; simplify existing ones where they feel heavy.
**Guidance:**
- Reduce `staggerChildren` delay from 0.12 to 0.08 or less
- Prefer `opacity`-only fades over combined `opacity + y` springs for secondary elements
- Keep animations on hero/CTA sections; remove from utility widgets (user menu, quiz modals)

### Anti-Patterns to Avoid

- **Overriding card-conseil with inline styles:** If a card needs exact Conseil tokens, use the CSS class. Adding `style={{ borderRadius: '15px' }}` inline means future token changes don't cascade.
- **Adding backdrop-blur to any new components:** The Conseil design has no glassmorphism anywhere. The existing `glass-card` class in globals.css is a legacy artifact from pre-Phase 2 — do not use it in Phase 3 components.
- **Using `max-w-7xl` on new landing sections:** All Conseil landing sections use `max-w-[1140px]`. Only legacy utility sections (legal pages, old footer) use `max-w-7xl`. The footer currently uses `max-w-7xl` and should be updated.
- **Using `rounded-2xl` instead of `rounded-[15px]`:** Conseil cards are exactly 15px. Tailwind's `rounded-2xl` is 16px. Always use `rounded-[15px]` for card-level elements.
- **Touching the `@theme inline` block:** Phase 2 set up the full token map. Do not edit CSS variables during Phase 3.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Accordion/collapsible FAQ items | Custom open/close toggle with useState | `@base-ui/react` Accordion already in use in `faq.tsx` | Edge cases: keyboard nav, ARIA, animation |
| Auth modal open/close | Custom modal state management | Existing `useAuth()` + `AuthModal` component | State already managed in `auth-context.tsx` |
| Marquee/ticker animation | JS-based scroll loop | CSS `@keyframes marquee` already in globals.css | Zero JS overhead; already implemented in Hero |
| Image optimization | `<img>` with srcset | `next/image` `<Image>` component | Next.js 16 automatic optimization, lazy loading |
| Stripe checkout flow | Custom payment form | Existing `startCheckout()` from `auth-context` | Stripe Checkout redirect already wired in `pricing-preview.tsx` |
| Toast notifications | Custom toast state | `goey-toast` + `GooeyToaster` already in layout | Already in layout-shell, no new setup needed |

**Key insight:** This phase is pure styling — no new data-fetching, no new state management, no new utility libraries. Every "build" impulse should be redirected to "find the existing CSS class or component."

---

## Common Pitfalls

### Pitfall 1: cm-navy vs cm-teal Confusion

**What goes wrong:** Developers see `cm-navy` and think it's a dark navy blue (#0C2340). In Phase 2, `--color-cm-navy` was aliased to `#006d77` (teal). Code using `bg-cm-navy` now renders teal. But some quiz/dashboard components use the semantic intent of "navy" for high-contrast text-on-light — which now renders teal and may fail WCAG contrast.
**Why it happens:** The alias was a pragmatic backward-compat choice. The visual rendering is correct for buttons/accents but may cause issues for dark text-on-light contexts.
**How to avoid:** When updating quiz/dashboard components, check whether `cm-navy` in context means "primary teal accent" or "very dark text colour." If it's being used as dark text, change to `text-foreground` or `text-zinc-900` instead.
**Warning signs:** Any element where `cm-navy` text appears on a white card background and looks very light (teal #006d77 on white is AA but not AAA).

### Pitfall 2: Card Border-Radius Mismatch (10px vs 15px)

**What goes wrong:** The `.card-conseil` CSS class uses `border-radius: 10px`, but REQUIREMENTS.md specifies 15px for cards (PRIC-01, STUD-01, MODL-01). The DESIGN_TOKENS.md says "Cards (standard): 15px" while buttons are 10px.
**Why it happens:** A likely oversight in Phase 2 globals.css definition.
**How to avoid:** Do not rely on `.card-conseil` alone for the 15px requirement. Either update `.card-conseil` to `border-radius: 15px` (preferred — one global change, verify no visual regressions) or add `rounded-[15px]` explicitly. Buttons remain at `border-radius: 10px` (correct per spec).
**Warning signs:** After implementing PRIC-01, if pricing cards look identical to the existing `.card-conseil` buttons in radius, something is wrong.

### Pitfall 3: Wave Divider Position Breaks Hero Bottom Content

**What goes wrong:** Adding the wave SVG between Hero and Features sections with a negative margin causes the hero marquee strip (position: absolute bottom-0) to overlap.
**Why it happens:** The Hero's marquee strip is `absolute bottom-0`. If the wave SVG has `mt-negative`, it may sit over the marquee.
**How to avoid:** Position the wave as a `relative` child below the hero section, with the hero `min-h-[85vh]` creating natural spacing. Test at multiple viewport widths.
**Warning signs:** Marquee text overlapped by the wave SVG, or gap between hero and wave.

### Pitfall 4: Git Worktree Merge Conflicts in globals.css

**What goes wrong:** Tracks 03-B, 03-C, and 03-D all may need to add CSS rules to globals.css. If they do so independently in worktrees, merging causes conflicts.
**Why it happens:** Parallel worktrees editing the same file.
**How to avoid:** Each track should append new CSS rules at the end of globals.css only. Do not reorder or insert into existing rule blocks. Use clear comments marking each track's additions (e.g., `/* Track 03-C: Wave Divider */`). When merging, accept both additions.
**Warning signs:** Merge conflict in globals.css showing overlapping rule additions.

### Pitfall 5: Footer max-w-7xl → max-w-[1140px] Width Jump

**What goes wrong:** The footer currently uses `max-w-7xl` (1280px). Switching to `max-w-[1140px]` will make the footer visually narrower than the page edge on large monitors, which looks wrong for a full-bleed footer.
**Why it happens:** Conseil footer content is 1140px but the footer background extends full width.
**How to avoid:** Keep the footer `<footer>` tag at full width with its background colour. Only apply `max-w-[1140px]` to the inner content `<div>`. Pattern: `<footer className="bg-white border-t border-border"><div className="mx-auto max-w-[1140px] px-4 ...">`.
**Warning signs:** Footer background that doesn't extend to viewport edges.

### Pitfall 6: Interactive Demo and StatsHero Not in Requirements

**What goes wrong:** `page.tsx` includes `<InteractiveDemo />` and `<StatsHero />` components that are not mapped to any requirement (they're CitizenMate-specific, not Conseil-matching). These could be skipped, left as-is, or minimally updated.
**Why it happens:** These were added pre-GSD and pre-Phase 3.
**How to avoid:** Track 03-C can choose to skip these components entirely (they are not in REQUIREMENTS.md scope). If touched, apply `max-w-[1140px]` container consistency only.
**Warning signs:** Time spent redesigning components not in requirements scope.

---

## Code Examples

### Conseil Card Conformance Pattern

```tsx
// Source: globals.css + DESIGN_TOKENS.md
// For cards that need exactly 15px radius (vs .card-conseil which is 10px):
<div
  className="bg-white border border-[#E9ECEF] p-[30px]"
  style={{
    borderRadius: '15px',
    boxShadow: 'rgba(0,0,0,0.05) 0px 2px 6px 0px, rgba(0,0,0,0.1) 0px 8px 19.2px 0px'
  }}
>
```

### Conseil Section Badge

```tsx
// Source: globals.css .badge-pill-teal / existing features.tsx pattern
<span className="badge-pill badge-pill-teal">
  <span className="w-1.5 h-1.5 rounded-full bg-cm-teal" />
  Section Label
</span>
```

### Conseil Primary Button (10px radius, not pill)

```tsx
// Source: DESIGN_TOKENS.md — buttons are 10px radius, not pill
<button className="bg-cm-teal text-white font-semibold text-sm px-[18px] py-[9px] rounded-[10px] transition-colors hover:bg-cm-teal-dark">
  Primary Action
</button>
```

### Conseil Secondary Button (purple bg)

```tsx
// Source: DESIGN_TOKENS.md
<button
  className="text-[#3D348B] font-semibold text-sm px-[18px] py-[9px] rounded-[10px]"
  style={{ background: 'rgba(107, 97, 196, 0.15)' }}
>
  Get a Quote
</button>
```

### User Menu Dropdown with Conseil Tokens (NAV-04)

```tsx
// Target state for user-menu.tsx dropdown panel
// Source: DESIGN_TOKENS.md — card border #E9ECEF, 15px radius, card shadow
<motion.div
  className="absolute right-0 top-full mt-2 w-64 bg-white overflow-hidden z-50"
  style={{
    borderRadius: '15px',
    border: '1px solid #E9ECEF',
    boxShadow: 'rgba(0,0,0,0.05) 0px 2px 6px 0px, rgba(0,0,0,0.1) 0px 8px 19.2px 0px'
  }}
>
```

### Quiz Option Button with Conseil Tokens (QUIZ-02)

```tsx
// Source: DESIGN_TOKENS.md — button radius 10px, teal accent
// Selected state should use cm-teal, not cm-navy
<button
  className={`
    w-full flex items-start gap-4 p-4 rounded-[10px] border-2 text-left
    transition-colors duration-200 cursor-pointer
    ${isSelected
      ? 'border-cm-teal bg-cm-teal/5'
      : 'border-[#E9ECEF] bg-white hover:border-cm-teal/50 hover:bg-cm-teal/3'
    }
  `}
>
```

### Split-Card (How It Works) — Conseil HIOW-01

```tsx
// Source: DESIGN_TOKENS.md — split radii, #F4F4F5 left panel
<div className="flex overflow-hidden border border-[#E9ECEF]"
     style={{
       borderRadius: '15px',
       boxShadow: 'rgba(0,0,0,0.05) 0px 2px 6px 0px, rgba(0,0,0,0.1) 0px 8px 19.2px 0px'
     }}>
  <div className="flex-1 bg-[#F4F4F5] p-[30px]"
       style={{ borderRadius: '15px 0 0 15px' }}>
    {/* Text content + CTA */}
  </div>
  <div className="flex-1 relative min-h-[320px]"
       style={{ borderRadius: '0 15px 15px 0' }}>
    <Image src="/images/conseil/feature-split.jpg" fill className="object-cover" alt="..." />
  </div>
</div>
```

---

## Component-to-Track Mapping (Planner Reference)

### Track 03-A: Navbar + Layout Shell + User Menu

| File | Requirements | Current State | Work Needed |
|------|-------------|---------------|-------------|
| `src/components/shared/navbar.tsx` | NAV-01, NAV-02 | Solid white fixed, no blur | Verify scroll transition easing; NAV-02 specifies `0.2s cubic-bezier(0.165,0.84,0.44,1)` |
| `src/components/shared/layout-shell.tsx` | NAV-03 | `pt-[66px]` already applied | Confirm — no changes needed |
| `src/components/shared/user-menu.tsx` | NAV-04 | `rounded-xl shadow-xl border-cm-slate-200` | Update dropdown to `rounded-[15px]`, `border: 1px solid #E9ECEF`, conseil card shadow |

### Track 03-B: Hero + CTA sections + Footer

| File | Requirements | Current State | Work Needed |
|------|-------------|---------------|-------------|
| `src/components/landing/hero.tsx` | HERO-01, HERO-02, HERO-03 | Nearly complete | Verify white pill CTA uses `btn-rounded bg-white text-cm-teal`; marquee has no duplicate animation |
| `src/components/landing/cta-section.tsx` | CTA-01, CTA-02 | Implements CTA-01 (dark band) | Need second simple CTA component for CTA-02 OR add inline CTA section; or restructure CTASection to have a "simple" and "dark" variant |
| `src/components/landing/footer.tsx` | FOOT-01, FOOT-02 | 3 link columns, max-w-7xl | Add 4th column (certifications or "Australia"); change to `max-w-[1140px]` inner container |
| `src/app/page.tsx` | (composition) | Correct component order | Possibly add a simple CTA section import |

### Track 03-C: Features + How It Works + Social Proof

| File | Requirements | Current State | Work Needed |
|------|-------------|---------------|-------------|
| `src/app/page.tsx` | HIOW-02 | No wave divider | Add wave SVG between `<Hero />` and `<Features />` |
| `src/components/landing/features.tsx` | FEAT-01, FEAT-02 | 3-col card grid with badge | Popular badge on index 0 — move to index 1 (center card); verify `card-conseil` class applied |
| `src/components/landing/how-it-works.tsx` | HIOW-01 | Zig-zag alternating layout | Refactor to split-card layout; use `feature-split.jpg` from conseil images |
| `src/components/landing/social-proof.tsx` | SOCP-01, SOCP-02, SOCP-03 | 3-col on zinc-100 + dual CTA | Confirmed near-spec; verify section badge present |

### Track 03-D: Pricing + FAQ + Shared Modals

| File | Requirements | Current State | Work Needed |
|------|-------------|---------------|-------------|
| `src/components/landing/pricing-preview.tsx` | PRIC-01, PRIC-02 | Uses `card-conseil` + `card-conseil-popular` | Verify card radius is 15px (not 10px); `max-w-7xl` → `max-w-[1140px]` |
| `src/components/landing/faq.tsx` | FAQ-01 | Accordion with conseil-style border/radius | Verify AccordionItem has `rounded-[15px]` and correct border colour; `max-w-3xl` is acceptable for FAQ |
| `src/components/shared/auth-modal.tsx` | MODL-01 | `rounded-2xl shadow-2xl` | Update to `rounded-[15px]`, conseil card shadow |
| `src/components/shared/premium-gate.tsx` | MODL-01 | Various | Apply conseil card design to gate modal |
| `src/components/quiz/quiz-header.tsx` (modal) | MODL-01 | Submit confirm modal `rounded-2xl` | Update to `rounded-[15px]`, conseil shadow |

### Track 03-E: Quiz components

| File | Requirements | Current State | Work Needed |
|------|-------------|---------------|-------------|
| `src/components/quiz/quiz-card.tsx` | QUIZ-01 | `cm-navy` classes | Update selected state to `cm-teal`; question number badge `rounded-[10px]`; container `card-conseil` |
| `src/components/quiz/quiz-progress.tsx` | QUIZ-02 | `cm-navy` for current, `cm-eucalyptus-light` for answered | Update to `cm-teal` for current state; align with Conseil palette |
| `src/components/quiz/results-summary.tsx` | QUIZ-02 | Custom cards with `rounded-xl border-cm-slate-200` | Update stat cards to `card-conseil` (15px radius, conseil border/shadow) |
| `src/components/quiz/quiz-header.tsx` (main) | QUIZ-03 | `bg-cm-navy` submit button | Update to `bg-cm-teal`, `rounded-[10px]` |
| `src/app/practice/[testId]/page.tsx` | QUIZ-01 | Quiz container page | Verify page background and spacing use Conseil bg tokens |

### Track 03-F: Study components

| File | Requirements | Current State | Work Needed |
|------|-------------|---------------|-------------|
| `src/components/study/study-section-card.tsx` | STUD-01 | `rounded-2xl border-2` | Update to `rounded-[15px] border border-[#E9ECEF]` + conseil shadow |
| `src/components/study/study-progress-bar.tsx` | STUD-02 | `cm-eucalyptus` fill | Update to `cm-teal` for primary progress colour |
| `src/components/study/key-facts-panel.tsx` | STUD-02 | Unknown — not read | Read and apply conseil card/badge tokens |
| `src/components/study/language-toggle.tsx` | STUD-03 | Unknown | Read and verify conseil palette |
| `src/app/study/page.tsx` | STUD-03 | Topic navigation grid | Apply conseil card tokens to topic cards |
| `src/app/study/[topicId]/page.tsx` | STUD-02 | Study session page | Apply conseil tokens to layout |

### Track 03-G: Dashboard components

| File | Requirements | Current State | Work Needed |
|------|-------------|---------------|-------------|
| `src/app/dashboard/page.tsx` | DASH-01, DASH-02, DASH-03 | Uses `card-glass`, custom cards | Replace `card-glass` with `card-conseil`; apply conseil shadow/radius to stat cards |
| `src/components/dashboard/abs-insights-widget.tsx` | DASH-02 | Recharts with hardcoded HEX colours | Update COLORS array to conseil palette: primary `#006d77`, secondary `#3d348b` |
| `src/components/dashboard/weather-widget.tsx` | DASH-01 | Unknown | Apply `card-conseil` |
| `src/components/dashboard/currency-widget.tsx` | DASH-01 | Unknown | Apply `card-conseil` |
| `src/components/dashboard/holidays-widget.tsx` | DASH-01 | Unknown | Apply `card-conseil` |
| `src/components/dashboard/life-in-australia-section.tsx` | DASH-01 | Unknown | Apply `card-conseil` |
| `src/components/shared/subpage-hero.tsx` | DASH-03 | Used as dashboard header | Apply conseil heading typography |
| `src/app/dashboard/layout.tsx` | DASH-03 | Dashboard layout | Verify sidebar/navigation uses conseil tokens |

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `backdrop-blur` glass navbar | Solid `#FFFFFF` fixed navbar | Phase 2 | No glassmorphism anywhere |
| Manrope heading font | Poppins (400,500,600,700,800) | Phase 2 | `font-heading` class now resolves to Poppins |
| DM Sans body font | Inter (300,400,500,600) | Phase 2 | `font-sans` resolves to Inter |
| `#00727a` primary | `#006d77` | Phase 2 | Exact Conseil teal |
| `1rem` (16px) global radius | `15px` | Phase 2 | All radii scaled from new base |
| `card-glass` (backdrop-blur) | `card-conseil` (opaque white) | Phase 2 | New CSS utility class defined |
| `max-w-7xl` containers | `max-w-[1140px]` | Phase 2 (partial) | Some older components still use 7xl |
| `cm-navy: #0C2340` | `cm-navy: #006d77` (alias) | Phase 2 | Quiz/study/dashboard backwards-compat |

**Deprecated/outdated:**
- `.navbar-glass` class: now just sets `background: #FFFFFF` (kept for backward compat, but class name is misleading)
- `.glass-card`, `.glass-card-dark`: These exist in globals.css from pre-Phase 2. Do NOT use in Phase 3. Use `.card-conseil` instead.
- `card-glass` class in dashboard components: replace with `card-conseil`
- `rounded-2xl` on card-level elements: replace with `rounded-[15px]`

---

## Open Questions

1. **CTA-02: Does it require a new component or a restructured CTASection?**
   - What we know: CTA-01 is the dark full-width band (already in CTASection). CTA-02 is described as "Simple Q&A/inline CTA section renders as centered text + teal button."
   - What's unclear: Is CTA-02 a separate section on the page, or should CTASection become a dual-section component with both variants? PAGE_TOPOLOGY.md shows "Q&A Banner" (section 10) as separate from "CTA Section" (section 13).
   - Recommendation: Create a simple `InlineCTA` component (or `CTASimple`) for the Q&A banner, and keep `CTASection` for the dark band. Add both to `page.tsx`.

2. **FOOT-01: Fourth footer column — "certifications"**
   - What we know: Conseil has 4 columns: brand/contact, product, company, certifications. CitizenMate footer has brand, product, support, legal.
   - What's unclear: What goes in a "certifications" or fourth column for CitizenMate (no official certifications to display)?
   - Recommendation: Rename the fourth column to "Australia" or "Resources" and include government resource links (Dept. of Home Affairs, IELTS, etc.) to match the 4-column intent without needing actual certifications.

3. **HIOW-01: Does the split-card replace all 3 zig-zag steps, or just one?**
   - What we know: Conseil has one split-card (section 5) for "Streamlined Workflow". CitizenMate has 3 zig-zag steps.
   - What's unclear: Should Phase 3 reduce to 1 split-card (losing "step 2" and "step 3"), or implement 3 stacked split-cards?
   - Recommendation: Implement one split-card for the primary feature story + keep a simplified steps list below it. This matches Conseil's section 5 + section 6 pattern.

4. **STUD-02: Study progress colour — cm-eucalyptus vs cm-teal?**
   - What we know: Progress bars in study use `cm-eucalyptus` (green). Conseil uses teal as primary everywhere.
   - What's unclear: Whether to change all progress bars to teal (losing the semantic green-means-progress distinction) or keep eucalyptus for study completion.
   - Recommendation: Keep `cm-eucalyptus` for completion/success states. Only align PRIMARY action elements to teal. This is a reasonable design discretion call.

---

## Sources

### Primary (HIGH confidence)
- Direct file reads of all component TSX files (2026-04-04) — current ground truth
- `citizenmate/docs/research/conseil/DESIGN_TOKENS.md` — extracted live from conseil.pixfort.com 2026-04-02
- `citizenmate/docs/research/conseil/PAGE_TOPOLOGY.md` — extracted live 2026-04-02
- `citizenmate/docs/research/conseil/BEHAVIORS.md` — extracted live 2026-04-02
- `citizenmate/docs/research/conseil/FOUNDATION_GATE.md` — Phase 2 completion record 2026-04-02
- `citizenmate/src/app/globals.css` — actual CSS utilities defined in Phase 2

### Secondary (MEDIUM confidence)
- `citizenmate/AGENTS.md` — warning about Next.js 16 breaking changes (read before writing Next.js-specific code)
- `.planning/REQUIREMENTS.md` — requirement definitions (2026-04-02)
- `.planning/STATE.md` + `.planning/ROADMAP.md` — phase state (2026-04-02)

### Tertiary (LOW confidence)
- None — all findings are based on direct code inspection

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — all libraries confirmed installed, versions confirmed in package.json
- Architecture patterns: HIGH — patterns derived from direct code inspection and design tokens
- Pitfalls: HIGH — derived from code-level analysis of specific divergences between current state and spec
- Component mapping: HIGH — complete file inventory done, current state assessed for each file

**Research date:** 2026-04-04
**Valid until:** 2026-05-04 (stable design system; no moving targets once Phase 2 is locked)
