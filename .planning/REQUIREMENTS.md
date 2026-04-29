# Milestone v1.1 Requirements

## Infrastructure
- [ ] **INFRA-01**: Implement automated test framework (Vitest). Specifically, unit tests for SRS engine and Readiness Calculator.
- [ ] **INFRA-02**: Add Sentry error tracking for production visibility.
- [ ] **INFRA-03**: Implement Redis rate limiting via Upstash to replace the ineffective in-memory rate limiter for the AI Tutor.
- [ ] **INFRA-04**: Refactor the dashboard monolithic structure (`src/app/dashboard/page.tsx` and `src/data/questions.ts`) to improve maintainability and bundle size.

## Revenue Engine
- [ ] **REV-01**: Build test-date-anchored onboarding flow to trigger personalized study plans.
- [ ] **REV-02**: Implement 6 upgrade moment triggers throughout the user journey as defined in the business plan.
- [ ] **REV-03**: Implement tiered subscription pricing logic (Pro/Premium) in Stripe checkout to support recurring and micro-transactions.
- [ ] **REV-04**: Integrate PostHog analytics to track conversion funnels and user engagement.

## Growth
- [ ] **GROW-01**: Add 4 new language pairs to expand the addressable market.
- [ ] **GROW-02**: Build the "Help a Mate" referral program to establish growth loops.
- [ ] **GROW-03**: Implement email notifications to drive re-engagement.

## Future Requirements (Deferred)
- (None defined yet)

## Out of Scope
- Major UI/UX redesigns (already completed in v1.0).

## Traceability
*(To be filled by roadmap)*
