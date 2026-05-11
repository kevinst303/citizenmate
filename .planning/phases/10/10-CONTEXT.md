# Phase 10: Calm UX & Interface Modernization - Context

**Gathered:** 2026-05-11
**Status:** COMPLETE — All 4 execution tasks verified (2026-05-11)

<domain>
## Phase Boundary

Reduce cognitive load through progressive disclosure, purposeful micro-interactions, and refined dark mode to create a calmer study environment. This phase focuses on the UX layer only — no backend changes, no new data models.
</domain>

<decisions>
## Implementation Decisions

### Onboarding Progressive Disclosure
- Remove settings toggles (Reduce Animations) from onboarding step 3
- Replace with calming "You're all set!" completion summary card
- Soften Framer Motion slide transitions (slower duration, gentler easing)
- Zustand `reduceMotion` toggle already exists in full Settings page

### Motion Accessibility
- `MotionProvider` wraps app in `<MotionConfig reducedMotion={reduceMotion ? "always" : "user"}>`
- All 48+ Framer Motion components inherit this automatically
- No per-component `useReducedMotion` hooks needed

### Dark Mode Contrast
- Add `.dark` CSS overrides for brand tokens (`cm-teal`, `cm-purple`, `cm-navy`)
- Target WCAG AA contrast ratio ≥4.5:1 for normal text on dark backgrounds
- Brighten teal family to `#4fd1c5` range, purple to `#a78bfa`

### the agent's Discretion
- Exact animation easing curves and durations at agent's discretion
- Summary card visual design at agent's discretion (Conseil design system alignment)
</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
- `MotionProvider` in `src/components/providers/` — global reduced motion config
- `useSettingsStore` — Zustand store with `reduceMotion` boolean
- `onboarding/page.tsx` — 3-step wizard with Framer Motion animations
- `globals.css` — CSS variable system with `.dark` overrides

### Established Patterns
- Tailwind v4 with CSS custom properties for theming
- Framer Motion with `AnimatePresence` for step transitions
- i18n via `useT()` hook with JSON dictionaries per locale

### Integration Points
- Onboarding → `auth-context.tsx` for `refreshPremiumStatus()` and router redirect
- Settings page for `reduceMotion` toggle (not onboarding)
</code_context>

<specifics>
## Specific Ideas

- Calming completion summary should feel reassuring, not overwhelming
- Onboarding flow should progressively disclose only essential information
- Dark mode brand tokens must maintain brand identity while ensuring readability
</specifics>

<deferred>
## Deferred Ideas

- Glassmorphism cleanup on `stat-card`, `CountryFactsWidget`, `quiz-header.tsx` → future phase
- More granular animation preferences beyond binary reduceMotion → Phase 11
</deferred>
