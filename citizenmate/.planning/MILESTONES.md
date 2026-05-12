# CitizenMate — Milestones

## v1.1 Launch Readiness

**Shipped:** 2026-05-12
**Phases:** 4 | **Plans:** 6 | **Requirements:** 11/11

**Delivered:** Production-ready infrastructure, revenue engine (onboarding + Stripe subscriptions + 6 upgrade triggers), and growth mechanics (6-language i18n, referral program, email notifications).

### Accomplishments

1. **Test Automation (Phase 4):** 15/15 unit tests, modular dashboard refactor (687 lines → 8 components), CI/CD test pipeline
2. **Production Infrastructure (Phase 5):** Sentry 3-runtime coverage, Upstash Redis (5 limiters, atomic INCR), PostHog analytics, CSP/HSTS security
3. **Revenue Engine (Phase 6):** 3-step test-date onboarding, 6 upgrade moment triggers, tiered Pro/Premium pricing (5 Stripe price IDs), Conseil-compliant upgrade modal, 8-event webhook handler
4. **Growth & Retention (Phase 7):** 6-language i18n with RTL, "Help a Mate" referral program (codes + atomic RPC rewards + qualification gates), 6-email notification system via Resend

### Git

- Tag: `v1.1`
- Commits since v1.0: ~95

### Tech Debt Carried Forward

- `stat-card` backdrop-filter blur(16px)
- `CountryFactsWidget` glass-card-premium class
- `quiz-header.tsx` backdrop-blur-lg on bg-white/95
- `auth-modal.tsx` legacy bg-cm-navy alias

---

## v1.0 Conseil Design Overhaul

**Shipped:** 2026-04-29
**Phases:** 3 | **Plans:** 8

**Delivered:** Complete Conseil design system overhaul — pixel-accurate match across all 50+ components.

### Git

- Tag: `v1.0`

---

*Living document — updated at each milestone completion.*
