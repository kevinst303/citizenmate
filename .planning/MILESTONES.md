# Milestones

## v1.0 Conseil Design Overhaul (Shipped: 2026-04-06)

**Phases completed:** 3 phases, 7 plans, 15 tasks
**Timeline:** 2026-03-23 → 2026-04-06 (14 days)
**Files changed:** 42 files (952 insertions, 1,936 deletions)
**Codebase:** 24,159 LOC TypeScript/TSX/CSS

**Key accomplishments:**
1. Solid white 66px navbar with exact Conseil cubic-bezier scroll transition — no glassmorphism
2. Hero section with bg image, star badge, avatar group, white pill CTA, and marquee logo strip; footer rebuilt as 4-column max-w-[1140px] layout
3. Wave SVG divider, Features Popular badge data-driven, How It Works Conseil split-card with asymmetric 15px radii
4. `.card-conseil` globally corrected 10px→15px; pricing cards, FAQ accordion, auth/premium modals all updated
5. Full quiz flow Conseil-compliant — QuizCard, QuizProgress, ResultsSummary, practice page using cm-teal, rounded-[15px] cards, rounded-[10px] buttons
6. Full study flow converted — cm-eucalyptus replaced with cm-teal throughout; StudySectionCard, StudyProgressBar, LanguageToggle, study pages all updated
7. Dashboard widgets + Recharts charts using Conseil palette (#006d77/#3d348b); SubpageHero Poppins headings on authenticated pages

**Archive:** `.planning/milestones/v1.0-ROADMAP.md`
**Requirements:** `.planning/milestones/v1.0-REQUIREMENTS.md`
**Audit:** `.planning/milestones/v1.0-MILESTONE-AUDIT.md` (passed)

## v1.1 Launch Readiness (Shipped: 2026-05-12)

**Phases completed:** 10 phases, 15 plans
**Timeline:** 2026-05-01 → 2026-05-12 (11 days)
**Commits:** 97 commits across 10 phases
**Requirements:** All 11 requirements (INFRA-01–04, REV-01–04, GROW-01–03) — 100% complete

**Key accomplishments:**
1. Automated test framework (Vitest), SRS engine unit tests, dashboard refactoring — stable testing baseline established
2. Sentry error tracking, Upstash Redis rate limiting, PostHog analytics — production monitoring fully wired
3. Test-date onboarding flow, 6 upgrade triggers, tiered Pro/Premium Stripe subscriptions — revenue engine live
4. 6-language i18n (en/es/hi/zh/ar/vi), "Help a Mate" referral program, Resend email cron — growth mechanics deployed
5. Super Admin Dashboard with analytics hub, user CRUD, blog CMS, referral management — full admin infrastructure
6. Calm UX (progressive disclosure, reduced motion, dark mode refinement) — cognitive load reduced
7. Anxiety-reduction features (AI hint system, wellbeing prompts, copy reframe) — evaluative stress mitigated
8. Adaptive gamification (daily streaks engine, achievement badges, gamification widget, XAI tooltips) — engagement engine built
9. Vietnamese language support — 6th locale registered and deployed

**Archive:** `.planning/milestones/v1.1-ROADMAP.md`
**Requirements:** `.planning/milestones/v1.1-REQUIREMENTS.md`

**Key decisions:**
- Sentry, PostHog, and Upstash all configured with CSP whitelisting
- Stripe tiered pricing with monthly/yearly intervals mapped to Supabase profiles
- 6-language i18n via DeepL pipeline with automatic translation validation
- Referral system with qualification gating (quiz/purchase) and 7-day premium extensions
- Streak freeze mechanic (1 freeze per 7 days) to reduce churn from missed days
- Conseil design system applied to all admin pages including analytics charts

**Known tech debt carried forward:**
- `stat-card` CSS class retains `backdrop-filter: blur(16px)`
- `CountryFactsWidget` retains `glass-card-premium` class
- `quiz-header.tsx` sticky bar uses `backdrop-blur-lg`
- `auth-modal.tsx` submit button uses legacy `bg-cm-navy` alias

---

## v1.3 Codebase Polish & UX Refinements (Shipped: 2026-05-14)

**Phases completed:** 3 phases, 3 plans
**Timeline:** 2026-05-13 → 2026-05-14 (2 days)
**Files changed:** 37 files (+1,942 / -1,040 lines)
**Requirements:** 8/8 complete — all Nyquist compliant

**Key accomplishments:**
1. Extracted 712 LOC dashboard monolith into 5 modular, type-safe components (ReadinessPanel, TopicMasteryGrid, QuickActions, StatsSummary, TestDateCard)
2. Built Conseil-styled PWA install modal with Zustand + IndexedDB persistence and 6-locale i18n
3. Verified zero hardcoded hex values across all admin/blog directories (no-op — pre-migrated)
4. Closed all Nyquist paperwork gaps — VALIDATION.md created retroactively for all 3 phases

**Archive:** `.planning/milestones/v1.3-ROADMAP.md`
**Requirements:** `.planning/milestones/v1.3-REQUIREMENTS.md`
**Audit:** `.planning/milestones/v1.3-MILESTONE-AUDIT.md` (gaps_resolved)

**Key decisions:**
- Phase 17 declared no-op after grep audit confirmed zero hardcoded hex values
- Retroactive VALIDATION.md creation for phases 15-17 to satisfy GSD Nyquist compliance

**Known tech debt carried forward:**
- `stat-card` backdrop-filter: blur(16px) — dashboard stats grid
- `CountryFactsWidget` glass-card-premium class
- `quiz-header.tsx` sticky bar backdrop-blur-lg
- `auth-modal.tsx` legacy bg-cm-navy alias
