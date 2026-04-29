# CitizenMate Roadmap

## Phase 4: Test Automation & Codebase Health
**Goal:** Establish a testing baseline and reduce monolithic technical debt to ensure future feature development is safe and maintainable.
**Requirements:** INFRA-01, INFRA-04
**Success Criteria:**
- Vitest is configured and running successfully in CI/CD.
- Unit tests are passing for the SRS engine and Readiness Calculator.
- `src/app/dashboard/page.tsx` and `src/data/questions.ts` are refactored into smaller, maintainable modules without breaking existing functionality.

## Phase 5: Production Infrastructure & Monitoring
**Goal:** Harden the application for production traffic by addressing security vulnerabilities and enabling comprehensive monitoring.
**Requirements:** INFRA-02, INFRA-03, REV-04
**Success Criteria:**
- Sentry is integrated and successfully capturing frontend and backend errors.
- Upstash Redis rate limiting is active for the AI Tutor and Vercel serverless functions.
- PostHog analytics is configured and tracking key conversion funnels.

## Phase 6: Revenue Engine & Monetization
**Goal:** Implement the core business logic necessary to convert free users into paying subscribers at scale.
**Requirements:** REV-01, REV-02, REV-03
**Success Criteria:**
- Users can complete a test-date-anchored onboarding flow that generates a personalized study plan.
- Six distinct upgrade triggers are active and successfully prompt users to subscribe.
- Stripe checkout supports both Pro and Premium tiered subscriptions with recurring and micro-transaction logic.

## Phase 7: Growth & Retention
**Goal:** Deploy features designed to increase top-of-funnel acquisition and re-engage dormant users.
**Requirements:** GROW-01, GROW-02, GROW-03
**Success Criteria:**
- The application UI and content support 4 new language pairs.
- Users can generate and share unique referral links via the "Help a Mate" program.
- Email notifications (via Resend or similar) are successfully triggering based on user inactivity or key milestones.
