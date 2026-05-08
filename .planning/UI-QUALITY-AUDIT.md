---
status: gaps_found
audited: "2026-05-08"
audit_type: "6-pillar visual audit (code-only, no dev server)"
scores:
  copywriting: 3
  visuals: 3
  color: 2
  typography: 3
  spacing: 2
  experience_design: 3
  total: 16
framework: Conseil Design System (Pixfort)
design_tokens: "Primary #006d77 · Secondary #3d348b · Fonts Poppins + Inter"
project: CitizenMate (Next.js 16 civic-education SaaS)
---

# CitizenMate — 6-Pillar UI Quality Audit

**Audited:** 2026-05-08
**Methodology:** Code-only audit (no dev server at localhost:3000/5173)
**Baseline:** Conseil Design System + abstract 6-pillar standards
**Prior Audits Reviewed:** v1.1-MILESTONE-AUDIT.md, v1.1-MILESTONE-AUDIT-I18N.md, ROADMAP.md

---

## Executive Summary

CitizenMate's UI is **substantially mature** for a pre-launch product. The landing page is polished with Conseil-inspired design, 29+ components are wired with i18n, Framer Motion animations are rich (1,148 animation/transition references), and error/empty/loading states are generally well-handled. The design token system in `globals.css` is comprehensive.

**Three systemic weaknesses drag the score down:**

1. **Dark mode is defined but dead** — 36 `dark:` CSS variable overrides exist, yet no toggle, no `.dark` class application, and no user-facing dark mode. This is wasted design investment.
2. **Arabic RTL is half-implemented** — `dir="rtl"` is set on `<html>`, fonts lack Arabic character support, no RTL CSS logical property overrides exist, and `shadcn/components.json` has `rtl: false`. Arabic users see LTR layout in RTL direction — compounding layout breakage.
3. **Hardcoded colors undermine the token system** — 20+ hex colors in `admin/blog/page.tsx` alone, `cm-navy` legacy alias still used in 10+ files, and `border-[#E9ECEF]` appears as a hardcoded pattern across 15+ files. The Conseil token palette exists but is inconsistently applied.

**Overall Score: 16/24** — Good foundation with targeted fixes needed for launch readiness.

---

## Pillar Scores

| Pillar | Score | Key Finding |
|--------|-------|-------------|
| 1. Copywriting | 3/4 | 6 dictionaries, 29+ wired components — but offline page, blog empty state, and AI system prompt are hardcoded English |
| 2. Visuals | 3/4 | Rich animations, consistent Lucide icons, excellent hero — but dark mode dead, no RTL visual handling |
| 3. Color | 2/4 | Token system exists — but heavily undermined by hardcoded hex, cm-navy legacy alias, and border-[#E9ECEF] pattern |
| 4. Typography | 3/4 | Poppins + Inter consistent, good hierarchy — but no Arabic/Hindi font subsets loaded |
| 5. Spacing | 2/4 | Conseil 1140px grid respected — but arbitrary px values and inconsistent token usage scattered |
| 6. Experience Design | 3/4 | Error boundaries, toasts, skeletons, confirm dialogs — but offline page is i18n-dead and dark mode unreachable |

**Overall: 16/24**

---

## Top 10 Priority UI Fixes (Ranked)

| # | Priority | Issue | Pillars Affected | Fix |
|---|----------|-------|------------------|-----|
| 1 | 🔴 CRITICAL | No dark mode activation | Color, Visuals, Experience Design | Add `next-themes` provider, wire toggle to navbar, test `.dark` class application |
| 2 | 🔴 CRITICAL | Arabic RTL half-broken | Typography, Spacing, Experience Design, Copywriting | Add Arabic font subset, set `rtl: true` in components.json, add RTL CSS logical properties |
| 3 | 🔴 HIGH | Offline page entirely hardcoded English | Copywriting, Experience Design | Wire `useT()` to offline page, add `offline.*` keys to all dictionaries |
| 4 | 🔴 HIGH | 20+ hardcoded hex colors in admin/blog | Color | Replace all `#[0-9a-f]` in admin with `cm-teal`, `cm-slate-*`, etc. |
| 5 | 🟡 MEDIUM | cm-navy legacy alias still in 10+ files | Color, Spacing | Global replace `cm-navy` → `cm-teal` (navy tokens already map to teal) |
| 6 | 🟡 MEDIUM | Hardcoded links without locale prefix | Copywriting, Experience Design | Replace `href="/practice"` with `getUrl("/practice")` in not-found, dashboard, practice/smart |
| 7 | 🟡 MEDIUM | AI system prompt hardcoded English | Copywriting | Externalize system prompt to i18n dictionary or per-locale config |
| 8 | 🟡 MEDIUM | Blog empty state not translatable | Copywriting | Wire `useT()` to `blog-client.tsx` — "No posts available right now." |
| 9 | 🟢 LOW | `border-[#E9ECEF]` hardcoded across 15+ files | Color, Spacing | Add `--color-cm-border-light: #E9ECEF` token, use `border-cm-border-light` |
| 10 | 🟢 LOW | Add Hindi font subset + Arabic font support | Typography | Configure Inter CDN with Arabic script, add Noto Sans for Hindi fallback |

---

## Detailed Findings

### Pillar 1: Copywriting (3/4)

**What Works Well:**
- 6 dictionaries fully translated: `en.json` (67KB), `es.json` (75KB), `hi.json` (133KB), `zh.json` (66KB), `ar.json` (93KB), `vi.json` (90KB)
- 29+ components wired with `useT()` — all landing sections, quiz, study, navbar, auth modal, checkout, results
- Locale-aware URL construction via `useLocalizedPath()` in navbar and hero
- Error states are well-crafted and on-brand: "Something went wrong, mate", "Page not found, mate"
- CTA labels all translatable with Australian personality ("Start Free Practice", "Get Sprint Pass", "See How It Works")
- Toast system uses i18n keys
- Blog translated via database layer (`blog_translations` table)

**Gaps & Issues:**

| File | Line | Issue | Severity |
|------|------|-------|----------|
| `src/app/[lang]/offline/page.tsx` | 26-67 | **Entire page hardcoded English** — no `useT()` import, all strings are literals: "You're offline, mate", "No worries — it happens!", "Try Again", "While you're offline, you can still:", "Review study sections you've already loaded", "Check your readiness dashboard and study progress" | 🔴 CRITICAL |
| `src/app/[lang]/blog/blog-client.tsx` | 32 | `No posts available right now.` — hardcoded English empty state | 🟡 MEDIUM |
| `src/lib/chat-context.ts` | 28-50 | **AI system prompt** (50 lines) entirely hardcoded English — defines personality, rules, and scope | 🟡 MEDIUM |
| `src/components/admin/confirm-dialog.tsx` | 85 | `Cancel` — hardcoded label | 🟢 LOW |
| `src/app/[lang]/not-found.tsx` | 53 | Quick links use hardcoded `href` without locale prefix: `/dashboard`, `/study`, `/practice`, `/` | 🟡 MEDIUM |

---

### Pillar 2: Visuals (3/4)

**What Works Well:**
- **Lucide icons** used consistently — 207+ icon references across all components
- **Framer Motion** animations rich: staggered children, spring transitions, hover/tap feedback, AnimatePresence route transitions
- **Hero**: Background image with overlay, star rating badge, marquee strip — Conseil-inspired premium aesthetic
- **Feature cards**: Image + gradient overlay + badge, card-conseil with 24px radius and hover elevation
- **Results**: Animated score cards, topic breakdown bars, AI recommendation with urgency-based styling
- **Glassmorphism**: Properly applied in `glass-card`, `glass-card-premium`, `feature-card-glass` classes
- **Skeleton loading**: Present in `user-menu.tsx` (loading state) and `life-in-australia-section.tsx` (WidgetSkeleton)
- **Scroll animations**: `useInView` with `once: true` for performance, staggered reveal
- **Reduced motion**: `@media (prefers-reduced-motion: reduce)` block in globals.css with full animation disabling

**Gaps & Issues:**

| File | Line | Issue | Severity |
|------|------|-------|----------|
| Project-wide | — | **No dark mode toggle exists** — 36 `dark:` CSS variable overrides defined but never activated | 🔴 CRITICAL |
| `src/app/[lang]/layout.tsx` | 125 | `dir="rtl"` set but **no RTL visual processing** — flexbox directions, padding/margin, text alignment all remain LTR | 🔴 CRITICAL |
| `components.json` | 19 | `"rtl": false` — shadcn primitives will not apply RTL-aware styles | 🔴 CRITICAL |
| `src/components/quiz/quiz-card.tsx` | 25-26 | Inline `boxShadow` style — inconsistent with rest of project's utility class approach | 🟢 LOW |

---

### Pillar 3: Color (2/4)

**What Works Well:**
- Comprehensive Conseil-aligned token system in `globals.css`: `cm-teal`, `cm-purple`, `cm-dark`, `cm-slate-*`, functional colors (`cm-red`, `cm-gold`, `cm-eucalyptus`, `cm-sky`)
- Light/dark mode CSS variables correctly defined on `:root` and `.dark`
- Chart colors defined as semantic tokens
- Selection colors branded (`cceded` background, `#006d77` text)
- Focus ring uses semantic `--ring` variable
- Gradient utilities use brand teal (`text-gradient-teal`, `text-gradient-aussie`)

**Gaps & Issues:**

| File | Pattern | Count | Severity |
|------|---------|-------|----------|
| `src/app/[lang]/admin/blog/page.tsx` | Hardcoded `#[0-9a-f]` hex colors | 20+ instances | 🔴 HIGH |
| `src/app/[lang]/dashboard/page.tsx` | `cm-navy`, `cm-navy-50`, `cm-navy-darker` legacy aliases | 10+ instances | 🟡 MEDIUM |
| `src/app/[lang]/settings/page.tsx` | `cm-navy`, `cm-navy-50`, `cm-navy-light` | 4 instances | 🟡 MEDIUM |
| `src/app/[lang]/study/page.tsx` | `cm-navy-50`, `cm-navy` | 5+ instances | 🟡 MEDIUM |
| `src/app/[lang]/not-found.tsx` | `cm-navy-50`, `cm-navy`, `bg-cm-navy` | 4 instances | 🟡 MEDIUM |
| Multiple files (15+) | `border-[#E9ECEF]` — hardcoded border color | 15+ files | 🟢 LOW |
| Multiple files (8+) | `rounded-[15px]` — non-standard radius | 8+ files | 🟢 LOW |

**Hardcoded hex colors in admin/blog/page.tsx:**
```
Line 439: bg-[#006d77] hover:bg-[#005a63]
Line 473: focus:ring-[#006d77]
Line 521: border-[#006d77] text-[#006d77]
Line 527: bg-[#006d77]
Line 541: focus:ring-[#006d77]
Line 553: focus:ring-[#006d77]
Line 570: focus:ring-[#006d77]
Line 599: bg-[#006d77]/10 text-[#006d77]
Line 628: focus:ring-[#006d77]
Line 637: hover:bg-[#006d77]/5
Line 649: text-[#006d77] hover:bg-[#006d77]/5
```

---

### Pillar 4: Typography (3/4)

**What Works Well:**
- **Poppins** (headings, `--font-heading-family`) and **Inter** (body, `--font-body`) loaded via `next/font/google` in layout.tsx
- `font-heading` utility used 207+ times consistently throughout components
- Comprehensive weight distribution: regular, medium, semibold, bold, extrabold
- Legal page typography has dedicated `.legal-content` rules with proper hierarchy
- `text-balance` utility used where appropriate (hero heading)
- Good responsive scaling: `text-4xl sm:text-5xl md:text-6xl lg:text-[4rem]` on hero
- `tracking-tight` applied to large headings for refined spacing
- Font sizes `xs` to `5xl` in use — broad but justified for a marketing + app hybrid

**Gaps & Issues:**

| File | Line | Issue | Severity |
|------|------|-------|----------|
| `src/app/[lang]/layout.tsx` | 28-39 | **Poppins + Inter loaded with `subsets: ["latin"]` only** — Arabic characters will render in system fallback, not Poppins/Inter. Hindi also unsupported. | 🔴 HIGH |
| `src/app/[lang]/layout.tsx` | 36 | Inter loaded with `subsets: ["latin"]` — no Arabic/Hindi script support. Inter does support Arabic via Google Fonts but requires explicit subset. | 🔴 HIGH |
| `src/app/[lang]/layout.tsx` | 29 | Poppins loaded with `subsets: ["latin"]` — Poppins lacks Arabic character support entirely; Arabic will always fallback. | 🟡 MEDIUM |

---

### Pillar 5: Spacing (2/4)

**What Works Well:**
- **Conseil 1140px max-width** constraint respected across landing, navbar, study, and pricing pages
- `section-alt-bg` utility for alternating section backgrounds (`#F4F4F5`)
- Responsive breakpoints consistently used: `sm:`, `md:`, `lg:`
- Good vertical rhythm on landing page sections: `pt-[140px] pb-[100px]`, `py-20 sm:py-28`
- Navbar height fixed at `h-[66px]`

**Gaps & Issues:**

| File | Pattern | Issue | Severity |
|------|---------|-------|----------|
| Multiple files (15+) | `border-[#E9ECEF]` | Hardcoded border color pattern — should use `border-cm-slate-100` or new token | 🟢 LOW |
| Multiple files (8+) | `rounded-[15px]` | Non-standard radius value — should use `rounded-xl` or `rounded-2xl` or design token | 🟢 LOW |
| `src/app/[lang]/dashboard/page.tsx` | 404 | `blur-[3px] grayscale-[0.3]` — arbitrary CSS values for premium blur | 🟢 LOW |
| `src/app/[lang]/blog/blog-client.tsx` | 51,114 | `shadow-[0_1px_3px_0_rgba(0,0,0,0.1),0_1px_2px_-1px_rgba(0,0,0,0.1)]` — long arbitrary shadow string | 🟢 LOW |
| `src/components/landing/features.tsx` | 74 | `pt-[140px] pb-[100px]` — arbitrary large padding values | 🟢 LOW |

---

### Pillar 6: Experience Design (3/4)

**What Works Well:**
- **Global error boundary**: `error.tsx` with Sentry `captureException()`, digest display, reset() function, and dashboard fallback link
- **Not Found page**: Branded 404 with emoji icon, quick nav links, and "Back to home"
- **Offline page**: UI exists with WifiOff icon, reload button, and helpful tips (though hardcoded English)
- **Toast system**: Achievement, success, info, warning, error, default variants — all wired to i18n
- **Loading states**: Skeleton in `user-menu.tsx`, `WidgetSkeleton` in `life-in-australia-section.tsx`
- **Empty states**: Handled in admin users, admin blog, referrals, dashboard, blog list
- **Confirm dialog**: `ConfirmDialog` component with Escape key support, backdrop click dismiss
- **Disabled states**: 54 `disabled`/`pointer-events-none` references for buttons and inputs
- **Interactive feedback**: Framer Motion hover/tap on buttons (`whileHover`, `whileTap`), AnimatePresence for route animations
- **Reduced motion**: Media query in globals.css disables all animations/transitions
- **Keyboard**: `aria-label` on 13 interactive elements (nav menu, chat, auth, cookie consent)

**Gaps & Issues:**

| File | Line | Issue | Severity |
|------|------|-------|----------|
| Project-wide | — | **Dark mode unreachable** — CSS variables defined, no toggle, no `.dark` class management | 🔴 CRITICAL |
| `src/app/[lang]/offline/page.tsx` | Entire file | **No i18n** — offline users in non-English languages see English text | 🔴 HIGH |
| `src/app/[lang]/layout.tsx` | 125 | **RTL set but no CSS RTL support** — `dir="rtl"` on `<html>` without logical property overrides; shadcn `rtl: false` | 🔴 HIGH |
| `components.json` | 19 | `"rtl": false` — shadcn primitives won't apply RTL styles | 🔴 HIGH |
| `src/app/[lang]/not-found.tsx` | 53-67 | Quick links use hardcoded paths (no locale prefix) — causes 307 redirects | 🟡 MEDIUM |
| `src/app/[lang]/dashboard/page.tsx` | 378 | `href="/study/australian-values"` — hardcoded path | 🟡 MEDIUM |
| `src/app/[lang]/practice/smart/session/page.tsx` | 330,373 | `href="/practice/smart"` — hardcoded path | 🟡 MEDIUM |
| `src/app/[lang]/practice/page.tsx` | 137 | `href="/practice/smart"` — hardcoded path | 🟡 MEDIUM |

---

## Cross-Pillar Critical Issues

### 1. Arabic RTL — 4-Pillar Compound Breakage

The `dir="rtl"` attribute is correctly set on `<html>` in `layout.tsx:125`, but **no supporting infrastructure** exists:

| Pillar | Impact |
|--------|--------|
| **Copywriting** | Arabic dictionary exists (93KB, fully translated) but renders broken |
| **Typography** | Poppins/Inter loaded with `latin` subset only — Arabic text falls back to system font |
| **Spacing** | Padding, margin, flexbox direction all remain LTR; `text-left` classes override `dir="rtl"` |
| **Experience Design** | `shadcn/components.json` has `rtl: false`; no RTL CSS logical properties; mobile sheet slides from wrong side |

**Fix**: (1) Load Arabic font subset, (2) Set `rtl: true` in `components.json`, (3) Replace directional utilities (`ml-*` → `ms-*`, `pl-*` → `ps-*`, `text-left` → `text-start`) project-wide.

### 2. Dark Mode — Wasted Design Investment

The dark mode palette is **comprehensively defined** (36 CSS custom properties in `.dark` block, globals.css:142-174) but **never activated**. No `next-themes` provider, no toggle, no `.dark` class management. Dark mode is investment risk: the code exists but creates zero user value.

| Pillar | Impact |
|--------|--------|
| **Color** | 36 dark token definitions unused; chart colors, sidebar, accent all defined |
| **Visuals** | No dark mode screenshots, no dark mode QA, glassmorphism only tested in light |
| **Experience Design** | Users on system dark preference get no dark mode; accessibility gap |

**Fix**: Add `next-themes` `<ThemeProvider>`, add toggle to navbar/user-menu, test all 18+ pages in dark mode.

### 3. Hardcoded Colors — Token Drift

Despite a comprehensive token system, **hardcoded hex values** proliferate in admin pages and `border-[#E9ECEF]` appears across 15+ files. The `cm-navy` legacy alias remains in 10+ files despite being mapped to `cm-teal` values in globals.css.

| Pillar | Impact |
|--------|--------|
| **Color** | Token consistency undermined; future theme changes will miss hardcoded instances |
| **Spacing** | Non-standard `rounded-[15px]` bypasses the design token radius scale |

---

## Recommendations for Upcoming UX Phases (10-12)

### Phase 10: Calm UX & Interface Modernization

**Before starting Phase 10**, resolve these prerequisite issues:

1. **Activate dark mode** (Priority Fix #1) — Calm UX cannot ship without dark mode; the study experience happens at night.
2. **Fix Arabic RTL** (Priority Fix #2) — RTL support is table stakes for "calm UX" across all supported languages.
3. **Eliminate hardcoded hex colors** (Priority Fixes #4, #5, #9) — Calm UX requires clean token infrastructure.
4. **Add font subsets for Arabic/Hindi** (Priority Fix #10) — Typography is the foundation of calm.

**Phase 10-specific opportunities:**
- The `glass-card`/`glass-card-premium` glassmorphism utilities are ready for calm, soft-background treatments
- `animate-float`, `animate-glow`, `gentle-float` keyframes already exist and can be dialed up for ambient motion
- `border-gradient-hover` utility can be extended for focus-state calm transitions
- The `reduce-motion` media query is already in place — Phase 10 can build on it with `prefers-color-scheme` awareness

### Phase 11: Anxiety-Reduction & Wellbeing

**Prerequisites from this audit:**
- Fix hardcoded AI system prompt (Priority Fix #7) — the AI tutor's "personality" is defined in English only; anxiety-reduction copywriting must be localizable.
- Translate offline page (Priority Fix #3) — anxious users losing connection should see comforting text in their language.

**Existing assets to leverage:**
- `animate-urgency` keyframe exists for countdowns — can be repurposed for breathing exercises
- Toast system already supports `achievement` variant — can trigger wellbeing micro-interventions
- `ai-insight-card` with `source-fade` animation exists — can power scaffolded feedback

### Phase 12: Adaptive Gamification & Trust-building

**Prerequisites from this audit:**
- Fix hardcoded links (Priority Fix #6) — gamification rewards/streaks need locale-prefixed URLs
- Translate blog empty state (Priority Fix #8) — trust-building content must be readable in all languages

**Existing assets to leverage:**
- `animate-count`, `animate-shimmer`, `recommended-pulse` keyframes already defined — ready for streak animations, badge reveals
- `ReadinessRing` component exists — can be extended with trust-building "how we calculated this" overlay (XAI)
- `topic-row` with accent color and hover states — ready for mastery progression visualization
- `animate-star` for achievement stars exists

---

## Registry Safety

**shadcn components.json:** Standard shadcn official registry only — no third-party registries configured (`"registries": {}`). No registry safety audit required.

---

## Files Audited

| Category | Files |
|----------|-------|
| **Design System** | `src/app/globals.css` (964 lines), `components.json` |
| **Root Layout** | `src/app/[lang]/layout.tsx` |
| **Landing** | `hero.tsx`, `features.tsx`, `pricing-preview.tsx`, `how-it-works.tsx`, `faq.tsx`, `footer.tsx`, `cta-section.tsx`, `social-proof.tsx`, `stats-hero.tsx`, `inline-cta.tsx`, `interactive-demo.tsx` |
| **Shared/Nav** | `navbar.tsx`, `layout-shell.tsx`, `auth-modal.tsx`, `language-switcher.tsx`, `user-menu.tsx`, `cookie-consent.tsx`, `chat-widget.tsx`, `referral-tracker.tsx`, `referral-cta.tsx`, `test-date-modal.tsx`, `test-date-banner.tsx`, `premium-gate.tsx`, `subpage-hero.tsx` |
| **Quiz** | `quiz-card.tsx`, `quiz-header.tsx`, `quiz-timer.tsx`, `quiz-progress.tsx`, `results-summary.tsx`, `question-review.tsx` |
| **Study** | `study-section-card.tsx`, `study-progress-bar.tsx`, `key-facts-panel.tsx`, `language-toggle.tsx` |
| **Dashboard** | `dashboard/page.tsx`, `readiness-ring.tsx`, `referral-card.tsx`, `abs-insights-widget.tsx`, `country-facts-widget.tsx`, `currency-widget.tsx`, `holidays-widget.tsx`, `weather-widget.tsx`, `life-in-australia-section.tsx` |
| **Admin** | `admin/page.tsx`, `admin/blog/page.tsx`, `admin/users/page.tsx`, `admin/referrals/page.tsx`, `confirm-dialog.tsx`, `user-edit-modal.tsx`, `referral-dashboard.tsx` |
| **Blog** | `blog/page.tsx`, `blog/[slug]/page.tsx`, `blog-client.tsx` |
| **Error/State** | `error.tsx`, `not-found.tsx`, `offline/page.tsx` |
| **Checkout** | `checkout/success/page.tsx`, `checkout/cancel/page.tsx` |
| **i18n** | `i18n-context.tsx`, `config.ts`, 6 dictionaries (`en`, `es`, `hi`, `zh`, `ar`, `vi`) |
| **AI/System** | `lib/chat-context.ts` (system prompt) |
| **Other Pages** | `onboarding/page.tsx`, `settings/page.tsx`, `about/page.tsx`, `terms/page.tsx`, `privacy/page.tsx`, `cookies/page.tsx` |
| **Practice** | `practice/page.tsx`, `practice/[testId]/page.tsx`, `practice/[testId]/results/page.tsx`, `practice/smart/page.tsx`, `practice/smart/session/page.tsx` |

**Total files audited: ~70**

---

*Report generated by gsd-ui-review workflow — 6-pillar visual audit*
