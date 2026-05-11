# Phase 6 Audit Report — Revenue Engine & Monetization

**Audit Date:** 2026-05-11  
**Phase:** 06-REV-01  
**Requirements Audited:** REV-01, REV-02, REV-03

---

## Task 1: Stripe Webhook Handler Audit ✅ (1 MINOR gap)

**File:** `src/app/api/webhooks/stripe/route.ts` (369 lines)

### ✅ PASS — Signature Verification
- `stripe.webhooks.constructEvent(body, signature, webhookSecret)` at line 295
- Secret sanitized via `.replace(/\\n/g, '').trim()` (line 277)
- Proper 400 response on invalid signature

### ✅ PASS — Event Coverage (7 of 8 required events)

| Event | Line | Handler | Status |
|---|---|---|---|
| `checkout.session.completed` | 320 | `handleCheckoutCompleted` | ✅ |
| `customer.subscription.created` | 327 | `handleSubscriptionCreatedOrUpdated` | ✅ |
| `customer.subscription.updated` | 328 | `handleSubscriptionCreatedOrUpdated` | ✅ |
| `customer.subscription.deleted` | 329 | `handleSubscriptionCreatedOrUpdated` | ✅ |
| `payment_intent.payment_failed` | 336 | `handlePaymentFailed` | ✅ |
| `charge.dispute.created` | 340 | `handleChargeDisputed` | ✅ (bonus) |
| `charge.refunded` | 347 | `handleChargeRefunded` | ✅ (bonus) |

### ⚠️ MINOR — Missing `invoice.paid` Event
The webhook does **not** explicitly handle `invoice.paid`. For subscription renewals, Stripe fires `invoice.paid` → `customer.subscription.updated`. Currently `customer.subscription.updated` covers the profile update, but `invoice.paid` is the canonical event for payment confirmation. **Impact:** Low. The subscription update event recalculates `premium_expires_at` based on `current_period_end`, so renewals are handled. However, without `invoice.paid`, there's no explicit confirmation that the renewal payment was successful before extending access.

### ✅ PASS — Supabase Updates
- `handleCheckoutCompleted`: Updates `profiles` table — `is_premium`, `premium_expires_at`, `tier`, `stripe_customer_id`
- `handleSubscriptionCreatedOrUpdated`: Updates profiles for active/trialing (grants) and canceled/unpaid/past_due (revokes)
- `handleChargeDisputed`: Revokes premium during disputes
- `handleChargeRefunded`: Revokes premium on full refunds (partial refunds preserved)

### ✅ PASS — Error Handling & Sentry
- 7 `Sentry.captureException()` call sites for different failure modes
- Top-level try/catch in main handler captures unhandled errors (line 365)
- Console.error on all operation failures with structured logging

### ✅ PASS — Idempotency
- `processed_webhook_events` table with `event_id` deduplication
- Failing idempotency check continues processing (fail-open approach, line 314)

### ✅ PASS — Referral Integration
- Referral promo code processing in `checkout.session.completed` (lines 118-143)
- `checkAndProcessPendingReward` called for new buyers

---

## Task 2: Onboarding Flow Audit ⚠️ (2 gaps)

### ✅ PASS — Context Providers Exist

| Provider | File | Purpose | Status |
|---|---|---|---|
| `TestDateProvider` | `src/lib/test-date-context.tsx` | Test date state, urgency calculation | ✅ |
| `StudyProvider` | `src/lib/study-context.tsx` | Study progress, language preference | ✅ |
| `AuthProvider` | `src/lib/auth-context.tsx` | Auth state, checkout flow | ✅ |
| `SRSProvider` | `src/lib/srs-context.tsx` | Spaced repetition | ✅ |

### ✅ PASS — Provider Nesting Correct
`layout.tsx` lines 143-159 nest providers in correct order:
`AuthProvider` → `TestDateProvider` → `StudyProvider` → `SRSProvider` → `I18nProvider` → `MotionProvider`

### ✅ PASS — Onboarding Page
`src/app/[lang]/onboarding/page.tsx` — 3-step flow:
1. Welcome → 2. Test date input → 3. Confirmation → Redirect to `/dashboard`
- Saves `test_date` directly to Supabase `profiles` table (line 32)

### ⚠️ MAJOR — Data Flow Disconnect: Onboarding ↔ TestDateProvider

**The gap:** Onboarding writes `test_date` to Supabase profiles, but `TestDateProvider` reads from **localStorage** on mount (line 67). There's no sync from Supabase → localStorage.

**Flow trace:**
1. User completes onboarding → `test_date` written to `profiles` table ✅
2. User lands on dashboard → `TestDateProvider` mounts → reads `localStorage` ❌ (nothing there)
3. `TestDateBanner` shows "Set your test date" prompt even though date exists in Supabase

**Fix needed:** Onboarding should either:
- Call `setTestDate()` from TestDateProvider context (which writes to localStorage + syncs to Supabase), OR
- TestDateProvider should hydrate from Supabase on mount when localStorage is empty

### ⚠️ MINOR — StudyProvider Doesn't Generate a "Plan"

`StudyProvider` tracks progress through study sections but does **not** generate a dynamic study plan. The "study plan" concept exists implicitly through the dashboard's display of topics and progress, but there's no `generatePlan()` function based on test date + knowledge gaps.

---

## Task 3: Upgrade Trigger Count & Categorization ⚠️ (4 triggers)

### Triggers Found: 4 in-app + 1 marketing

| # | Trigger | File | Condition | Type | Status |
|---|---|---|---|---|---|
| 1 | Quiz Results (free user CTA) | `src/components/quiz/results-summary.tsx` | After quiz results, `profile.tier === 'free'` | Feature-gate | ✅ Active |
| 2 | Dashboard "Go Pro" CTA | `src/app/[lang]/dashboard/page.tsx` | Dashboard view for free users | Persistent CTA | ✅ Active |
| 3 | Practice Test Completion | `src/app/[lang]/practice/[testId]/page.tsx` | After completing a practice test | Usage-based | ✅ Active |
| 4 | Settings → Upgrade | `src/app/[lang]/settings/page.tsx` | Settings page for free users | Self-serve | ✅ Active |
| 5 | Landing Pricing (Sprint Pass) | `src/components/landing/pricing-preview.tsx` | Marketing page CTA | Direct purchase | ✅ Active |

### Trigger Mechanism Types

| Type | Count | Triggers |
|---|---|---|
| Direct Stripe Checkout (bypasses modal) | 2 | Landing Sprint Pass (#5), User Menu (#implied) |
| Upgrade Modal (`useUpgradeModal().openModal()`) | 4 | Dashboard, Practice, Settings, Quiz Results |

### ⚠️ GAP — Only 4 in-app upgrade modal triggers (requirement: 6)

The REV-02 requirement specifies **6 distinct upgrade triggers**. Currently only 4 in-app triggers exist that open the upgrade modal. Missing triggers:
- **AI Tutor usage limit** — No AI chat message count tracking found that triggers the modal
- **Inactivity/reactivation** — No inactivity detection that prompts upgrade

---

## Task 4: Stripe Price ID Mapping ✅ PASS

**File:** `src/app/api/checkout/route.ts` (165 lines)

### ✅ PASS — All 5 Price IDs in .env.example

| Variable | Purpose | In .env.example | Used in checkout |
|---|---|---|---|
| `NEXT_PUBLIC_STRIPE_PRICE_ID_PRO_MONTH` | Pro monthly | ✅ Line 21 | ✅ Line 65 |
| `NEXT_PUBLIC_STRIPE_PRICE_ID_PRO_YEAR` | Pro yearly | ✅ Line 22 | ✅ Line 64 |
| `NEXT_PUBLIC_STRIPE_PRICE_ID_PREMIUM_MONTH` | Premium monthly | ✅ Line 23 | ✅ Line 72 |
| `NEXT_PUBLIC_STRIPE_PRICE_ID_PREMIUM_YEAR` | Premium yearly | ✅ Line 24 | ✅ Line 71 |
| `NEXT_PUBLIC_STRIPE_PRICE_ID_SPRINT_PASS` | Sprint Pass (one-time) | ✅ Line 25 | ✅ Line 67 |

### ✅ PASS — Tier Routing Logic (lines 62-73)
```typescript
if (tier === 'pro')       → PRO_MONTH or PRO_YEAR
else if (tier === 'sprint_pass') → SPRINT_PASS
else (default premium)    → PREMIUM_MONTH or PREMIUM_YEAR
```

### ✅ PASS — Mode Detection
- `stripe.prices.retrieve(priceId)` called to check `price.type` (line 80)
- `one_time` → `payment` mode, `recurring` → `subscription` mode (line 81)

### ✅ PASS — Checkout Callers Map Correctly
| Caller | Tier | Interval | Result |
|---|---|---|---|
| `upgrade-modal.tsx` Pro button | `'pro'` | `'month'` or `'year'` | ✅ |
| `upgrade-modal.tsx` Premium button | `'premium'` | `'month'` or `'year'` | ✅ |
| `pricing-preview.tsx` Sprint Pass | `'sprint_pass'` | `'one_time'` | ✅ (intentional; `one_time` → falls through to SPRINT_PASS lookup) |

### ⚠️ MINOR — Sprint Pass interval handling
The `pricing-preview.tsx` passes `interval: 'one_time'`, but the checkout route only checks `tier === 'sprint_pass'` and ignores the interval. This works correctly but the `'one_time'` string is misleading.

---

## Task 5: Upgrade Modal Design Audit ⚠️ (3 minor deviations)

**File:** `src/components/global/upgrade-modal.tsx` (199 lines)

### Conseil Design Token Compliance

| Token | Conseil Spec | Modal Implementation | Verdict |
|---|---|---|---|
| Primary color | `#006d77` (cm-teal) | `bg-cm-teal`, `text-cm-teal`, `border-cm-teal` | ✅ |
| Heading font | Poppins | Inherited via CSS variable `--font-heading-family` | ✅ |
| Body font | Inter | Inherited via CSS variable `--font-body` | ✅ |
| Card border | `#E9ECEF` | `border-neutral-200` | ⚠️ Close but not exact |
| Card radius | 15px | `rounded-2xl` (16px), `rounded-3xl` (24px) | ⚠️ Slightly off |
| Dual shadow | Conseil dual-layer | `shadow-2xl` (single) | ⚠️ Single shadow |
| Backdrop | Blur + dark | `bg-black/60 backdrop-blur-sm` | ✅ |

### Functional Audit

| Feature | Status |
|---|---|
| Modal overlay with backdrop | ✅ `bg-black/60 backdrop-blur-sm` |
| Close button (X icon) | ✅ Accessible, top-right corner |
| Pricing display (2 tiers) | ✅ Pro + Premium with monthly/yearly toggle |
| Feature comparison | ✅ Checkmark list per tier |
| CTA buttons | ✅ "Get Pro" / "Get Premium" with tier-specific styling |
| Loading state | ✅ "Processing..." text + disabled button |
| Error state | ⚠️ No visible error UI — `startCheckout` errors are silently caught |
| Animation | ✅ Framer Motion spring + AnimatePresence |
| Most Popular badge | ✅ Teal pill with Zap icon |

### Deviations Summary
1. **Card border** uses `border-neutral-200` instead of `#E9ECEF` (minor visual difference)
2. **Card radius** uses `rounded-3xl` (24px) for outer modal vs spec'd 15px — acceptable for modals
3. **No error UI** — If Stripe checkout fails, user sees no feedback beyond button re-enabling

---

## Summary

| Task | Status | Severity |
|---|---|---|
| 1. Stripe Webhook | ✅ 7/8 events | 1 MINOR (`invoice.paid` missing) |
| 2. Onboarding Flow | ⚠️ Data disconnect | 1 MAJOR (localStorage vs Supabase), 1 MINOR (no dynamic plan) |
| 3. Upgrade Triggers | ⚠️ 4 of 6 required | 2 MISSING (AI tutor limit, inactivity prompt) |
| 4. Price ID Mapping | ✅ All 5 mapped | Clean |
| 5. Upgrade Modal Design | ✅ Largely compliant | 3 minor deviations |

### Priority Actions
1. **CRITICAL:** Fix TestDateProvider to hydrate from Supabase (or have onboarding call `setTestDate()`)
2. **HIGH:** Add 2 more upgrade triggers (AI tutor limit + inactivity prompt)
3. **MEDIUM:** Add `invoice.paid` webhook handler
4. **LOW:** Add error UI to upgrade modal on checkout failure
5. **LOW:** Align modal border/radius with Conseil spec
