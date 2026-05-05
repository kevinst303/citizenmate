---
phase: 06-revenue-engine
verified: 2026-05-05T06:15:00.000Z
status: human_needed
score: 3/3 must-haves verified
overrides_applied: 0
re_verification: false
gaps: []
human_verification:
  - test: "Onboarding Flow Redirect (UAT #1)"
    expected: "When a new user logs in without a set test date, they are automatically redirected to the onboarding flow to set their test date."
    why_human: "Requires browser-based auth flow with Supabase session — cannot verify programmatically"
  - test: "Global Upgrade Modal (UAT #2)"
    expected: "Clicking an upgrade button or encountering a paywall opens the global Upgrade Modal displaying Pro and Premium subscription options."
    why_human: "Visual rendering and interactive behavior requires browser testing"
  - test: "Smart Practice Free Limit (UAT #3)"
    expected: "For free users, the Smart Practice page displays a remaining session count. Starting more than 1 session in a single day is blocked, triggering the Upgrade Modal instead."
    why_human: "Requires localStorage state manipulation across browser sessions — cannot verify programmatically"
  - test: "Stripe Subscription Checkout (UAT #4)"
    expected: "Selecting a Pro or Premium plan (monthly or yearly) successfully opens a Stripe checkout session in 'subscription' mode for the correct price tier."
    why_human: "Requires live Stripe credentials and a real checkout flow — cannot verify programmatically"
---

# Phase 6: Revenue Engine & Monetization — Verification Report

**Phase Goal:** Implement the core business logic necessary to convert free users into paying subscribers at scale.

**Verified:** 2026-05-05T06:15:00Z  
**Status:** human_needed  
**Re-verification:** No — initial verification

## Goal Achievement

### Observable Truths

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | Users can complete a test-date-anchored onboarding flow | ✓ VERIFIED | `src/app/[lang]/onboarding/page.tsx` (96 lines) — date picker, "Set Goal Date" button, "I don't know my test date yet" skip option, saves to Supabase `profiles.test_date`. `auth-context.tsx` (line 104-112) auto-redirects users without a test date to `/onboarding` (skips admin pages). PostHog `onboarding_completed` event fired. |
| 2 | Six distinct upgrade triggers are active | ✓ VERIFIED | All six triggers wired: (1) Dashboard Banner — `openUpgradeModal("dashboard_banner")` line 148 of dashboard/page.tsx; (2) Mock Test Limit — `openModal("quiz_limit")` in practice/[testId]/page.tsx line 42; (3) AI Tutor Daily Limit — chat-widget.tsx lines 413-431: 3 free questions/day, with "Daily limit reached" UI and upgrade button; (4) Topic Mastery Analytics — `openUpgradeModal("topic_mastery")` line 442 of dashboard/page.tsx; (5) Study Mode Premium Lock — study/page.tsx lines 162-199: locked topics with PremiumBadge + `upgrade()` trigger; (6) SRS Review Limit — smart/page.tsx: `MAX_DAILY_SESSIONS=1`, localStorage tracking `citizenmate-srs-usage`, `upgrade()` on limit reached. |
| 3 | Stripe checkout supports tiered subscriptions (Pro/Premium) | ✓ VERIFIED | `checkout/route.ts` (160 lines): accepts `tier` (pro/premium/sprint_pass) and `interval` (month/year), maps to env Price IDs, dynamically sets `mode:'subscription'` or `mode:'payment'` based on Stripe Price type. `webhooks/stripe/route.ts` (348 lines): handles `customer.subscription.created/updated/deleted`, `checkout.session.completed`, `charge.refunded`, `charge.disputed`. Maps tier back to Supabase `profiles` (tier, is_premium, premium_expires_at). Idempotency via `processed_webhook_events` table. |

**Score:** 3/3 truths verified

### Required Artifacts

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `src/app/[lang]/onboarding/page.tsx` | Test-date anchored onboarding page | ✓ VERIFIED | 96 lines, date picker, "I don't know" skip, saves to Supabase, PostHog tracking |
| `src/lib/auth-context.tsx` | Auth context with onboarding redirect | ✓ VERIFIED | 406 lines, fetches profile.test_date, redirects to /onboarding if missing (line 104-112) |
| `src/components/global/upgrade-modal.tsx` | Global UpgradeModal with Pro/Premium tiers | ✓ VERIFIED | 169 lines, premium aesthetic, Pro ($14.99/mo) and Premium ($29.99/60-day) tiers, framer-motion animations, i18n support |
| `src/lib/store/useUpgradeModal.ts` | Zustand store for upgrade modal state | ✓ VERIFIED | 23 lines, openModal(source), closeModal, PostHog tracking on open |
| `src/app/api/checkout/route.ts` | Tiered Stripe Checkout API | ✓ VERIFIED | 160 lines, supports tier+interval, maps to Price IDs, subscription/payment modes, promo codes, rate limited, Sentry error capture, server-side user verification |
| `src/app/api/webhooks/stripe/route.ts` | Stripe Webhook Handler | ✓ VERIFIED | 348 lines, handles 7 event types, idempotency via processed_webhook_events, updates Supabase profiles, sends confirmation emails, processes referral rewards |
| `src/components/shared/premium-gate.tsx` | Premium gate component (overlay/block/badge) | ✓ VERIFIED | 134 lines, three variants: overlay (blur), block (full replacement), badge (small lock overlay) |
| `src/components/shared/chat-widget.tsx` | AI Tutor chat with daily limit for free users | ✓ VERIFIED | 475 lines, 3 free questions/day, "Daily limit reached" UI with upgrade button, remaining counter |
| `src/app/[lang]/practice/smart/page.tsx` | Smart Practice with SRS review limit | ✓ VERIFIED | 515 lines, `MAX_DAILY_SESSIONS=1`, localStorage tracking `citizenmate-srs-usage`, upgrade trigger on limit |
| `src/app/[lang]/dashboard/page.tsx` | Dashboard with upgrade triggers | ✓ VERIFIED | 675 lines, triggers: dashboard_banner, topic_mastery analytics lock |
| `src/app/[lang]/study/page.tsx` | Study mode with premium content lock | ✓ VERIFIED | 348 lines, locked topics with PremiumBadge + upgrade button |
| `src/app/[lang]/practice/[testId]/page.tsx` | Mock test with quiz limit | ✓ VERIFIED | Trigger: `openModal("quiz_limit")` for free users |

### Key Link Verification

| From | To | Via | Status | Details |
|------|----|-----|--------|---------|
| `auth-context.tsx` (fetchProfileData) | `/onboarding` page | `window.location.href` redirect when `test_date` is null | ✓ WIRED | line 110: redirects to `/{lang}/onboarding` |
| `useUpgradeModal` store | `upgrade-modal.tsx` | Zustand `isOpen` state | ✓ WIRED | Modal reads `isOpen`, renders via `AnimatePresence` |
| Dashboard/Study/Practice pages | `useUpgradeModal.openModal()` | Direct import and call | ✓ WIRED | 6 distinct trigger sources: dashboard_banner, quiz_limit, topic_mastery, premium_gate, chat_limit, srs_daily_limit |
| `upgrade-modal.tsx` (handleUpgrade) | `startCheckout()` in auth-context | `useAuth().startCheckout(tier, interval)` | ✓ WIRED | line 24: calls `startCheckout(tier.toLowerCase(), interval)` |
| `checkout/route.ts` | Stripe API | `stripe.checkout.sessions.create()` | ✓ WIRED | line 148: creates session with tier-mapped Price ID |
| `webhooks/stripe/route.ts` | Supabase `profiles` table | `adminSupabase.from('profiles').update()` | ✓ WIRED | Updates tier, is_premium, premium_expires_at on subscription events |
| `premium-gate.tsx` (PremiumGate/PremiumBadge) | `usePremium().upgrade()` | Direct call from `auth-context.tsx` | ✓ WIRED | `upgrade: () => openModal("premium_gate")` (line 404) |

### Six Upgrade Triggers — Detailed Verification

| # | Trigger | Location | Trigger Source | Status |
|---|---------|----------|---------------|--------|
| 1 | Dashboard Banner | `dashboard/page.tsx:148` | `openUpgradeModal("dashboard_banner")` | ✓ WIRED |
| 2 | Mock Test Limit | `practice/[testId]/page.tsx:42` | `openModal("quiz_limit")` | ✓ WIRED |
| 3 | AI Tutor Daily Limit | `chat-widget.tsx:413-431` | 3 free questions/day, "Daily limit reached" + upgrade button | ✓ WIRED |
| 4 | Topic Mastery Analytics | `dashboard/page.tsx:442` | `openUpgradeModal("topic_mastery")` | ✓ WIRED |
| 5 | Study Mode Premium Lock | `study/page.tsx:162-199` | PremiumBadge + upgrade() on locked topics | ✓ WIRED |
| 6 | SRS Review Limit | `practice/smart/page.tsx:128` | `MAX_DAILY_SESSIONS=1`, `upgrade()` on limit reached | ✓ WIRED |

### Requirements Coverage

| Requirement | Phase | Description | Status | Evidence |
|-------------|-------|-------------|--------|----------|
| REV-01 | Phase 6 | Build test-date-anchored onboarding flow to trigger personalized study plans. | ✓ SATISFIED | Onboarding page with date picker + skip option, saves to profiles.test_date, auth-context redirects users without test date |
| REV-02 | Phase 6 | Implement 6 upgrade moment triggers throughout the user journey as defined in the business plan. | ✓ SATISFIED | All 6 triggers verified: dashboard banner, mock test limit, AI tutor daily limit, topic mastery analytics lock, study mode premium content, SRS review limit |
| REV-03 | Phase 6 | Implement tiered subscription pricing logic (Pro/Premium) in Stripe checkout to support recurring and micro-transactions. | ✓ SATISFIED | Checkout API supports tier/interval → Price ID mapping, dynamic mode detection (subscription vs payment), webhook updates Supabase profiles, idempotency protection |

### Anti-Patterns Found

| File | Line | Pattern | Severity |
|------|------|---------|----------|
| — | — | No blockers, stubs, or anti-patterns detected | ℹ️ Info |

### Human Verification Required

All four UAT tests from `06-UAT.md` remain pending and require human testing:

1. **Onboarding Flow Redirect (UAT #1)**
   - **Test:** Sign up as a new user without a test date. Verify you are automatically redirected to the onboarding flow.
   - **Expected:** Redirect to `/onboarding` occurs. Test date is correctly set in the profile after completion.
   - **Why human:** Requires browser-based Supabase auth flow — cannot simulate programmatically.

2. **Global Upgrade Modal (UAT #2)**
   - **Test:** Click an upgrade button or trigger a paywall. Verify the global Upgrade Modal opens.
   - **Expected:** Modal displays Pro ($14.99/mo) and Premium ($29.99/60 days) options with correct feature lists. Clicking a plan initiates checkout.
   - **Why human:** Visual rendering, animations, and interactive Stripe redirect require browser testing.

3. **Smart Practice Free Limit (UAT #3)**
   - **Test:** As a free user, start 2 smart practice sessions in one day.
   - **Expected:** First session starts normally; second attempt is blocked with the Upgrade Modal. Session count resets at midnight.
   - **Why human:** Requires localStorage manipulation across browser sessions and time-based reset testing.

4. **Stripe Subscription Checkout (UAT #4)**
   - **Test:** Select a Pro or Premium plan (monthly or yearly) from the Upgrade Modal.
   - **Expected:** Stripe checkout opens in subscription mode with the correct Price ID for the chosen tier.
   - **Why human:** Requires live Stripe credentials and a real checkout flow — cannot be tested with mock data.

5. **Stripe Webhook Processing (Additional)**
   - **Test:** Simulate `customer.subscription.created` webhook (via `stripe trigger` CLI or Stripe Dashboard).
   - **Expected:** User's Supabase `profiles` row updates with `tier`, `is_premium: true`, and `premium_expires_at`. Referral rewards are credited if applicable.
   - **Why human:** Requires live Stripe webhook secret and Supabase admin access.

---

_Verified: 2026-05-05T06:15:00Z_  
_Verifier: OpenCode (gsd-verifier)_
