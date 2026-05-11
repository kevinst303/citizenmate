---
wave: 1
phase: 7
plan: 07-grow-02
purpose: Verify "Help a Mate" referral program end-to-end functionality against GROW-02 success criteria
status: ready
depends_on: []
files_modified:
  - src/lib/referrals.ts
  - src/lib/referral-codes.ts
autonomous: true
requirements: [GROW-02]
---

# Plan 07-GROW-02: Referral Program Verification

## Goal
Verify the end-to-end "Help a Mate" referral flow — code generation, qualification gate, reward processing, and edge case handling — meets the ROADMAP requirement: "Users can generate and share unique referral links."

## Pre-Flight Checks (Blocking)
- [ ] `STRIPE_SECRET_KEY` env var configured (required for promo code creation)
- [ ] `STRIPE_REFERRAL_COUPON_ID` env var configured (or falls back to default `osa7HMgY`)
- [ ] Supabase admin client is properly initialized
- [ ] `process_referral_reward` RPC function exists in the database

---

## Task: GROW-02.1 — Audit Referral Code Generation Flow

<read_first>
- src/lib/referral-codes.ts
- .env.local (for STRIPE_SECRET_KEY and STRIPE_REFERRAL_COUPON_ID)
</read_first>

<action>
1. Trace `getOrCreateReferralCode(userId)`:
   a. Confirms it reads `profiles.referral_promo_code` first (cached).
   b. If missing, generates slug via `generateSlug(displayName, email)`.
   c. Handles the `MATE-{slug}` format with collision detection (uniqueness check).
   d. Creates Stripe Promotion Code with `coupon: REFERRAL_COUPON_ID`.
   e. Sets `max_redemptions: 1` and referrer metadata.
   f. Stores the code back to `profiles.referral_promo_code`.
2. Trace `generateSlug` edge cases: null displayName, null email, both null (falls back to random 6-char).
3. Verify `findReferrerByPromoCode` correctly extracts `referrer_user_id` from Stripe metadata.
4. Verify `getReferralStats` aggregates counts correctly from `referral_rewards` table.
5. Document any gaps (missing error handling, missing env var checks).
</action>

<acceptance_criteria>
- [ ] `grep "export async function getOrCreateReferralCode" src/lib/referral-codes.ts` confirms function exists
- [ ] `grep "referral_promo_code" src/lib/referral-codes.ts | wc -l` returns ≥ 3 (code is read, checked, written)
- [ ] `grep "MATE-" src/lib/referral-codes.ts` confirms MATE- prefix pattern
- [ ] `grep "max_redemptions.*1" src/lib/referral-codes.ts` confirms single-use promo codes
- [ ] `grep "generateSlug" src/lib/referral-codes.ts` confirms slug generation handles null inputs
- [ ] `grep "findReferrerByPromoCode" src/lib/referral-codes.ts` confirms metadata lookup
- [ ] `grep "getReferralStats" src/lib/referral-codes.ts` confirms stats aggregation
</acceptance_criteria>

---

## Task: GROW-02.2 — Audit Reward Processing & Qualification Gate

<read_first>
- src/lib/referrals.ts
- Supabase RPC function definition for `process_referral_reward`
</read_first>

<action>
1. Trace `processReferralReward(refereeId)`:
   a. Confirms it fetches `referred_by` from profiles.
   b. Checks `referrerId !== refereeId` (anti-self-referral guard).
   c. Calls `checkQualification` — verifies both quiz completion AND premium status checks.
   d. If unqualified: upserts into `referral_rewards` with `qualified: false` (pending state).
   e. If qualified: calls RPC `process_referral_reward` with correct params (referrer, referee, 7 days, 'premium_days').
   f. Sends both referrer and referee notifications via `Promise.allSettled` (non-blocking).
2. Trace `checkQualification`: verifies `quiz_history` count > 0 OR `profiles.is_premium === true`.
3. Trace `checkAndProcessPendingReward`: verifies it re-queries unqualified rewards and retries processing.
4. Verify RPC function:
   a. Run `supabase db push` or check migration files for the `process_referral_reward` function.
   b. Confirm the function uses atomic transaction (SELECT FOR UPDATE or equivalent).
5. Document edge cases: self-referral, duplicate referral, unsubscribed users, missing profiles.
</action>

<acceptance_criteria>
- [ ] `grep "export async function processReferralReward" src/lib/referrals.ts` confirms function exists
- [ ] `grep "referred_by" src/lib/referrals.ts` confirms referrer lookup
- [ ] `grep "Cannot refer yourself" src/lib/referrals.ts` confirms self-referral guard
- [ ] `grep "checkQualification" src/lib/referrals.ts` confirms qualification check
- [ ] `grep "process_referral_reward" src/lib/referrals.ts` confirms RPC call
- [ ] `grep "REWARD_DAYS = 7" src/lib/referrals.ts` confirms 7-day reward
- [ ] `grep "Promise.allSettled" src/lib/referrals.ts` confirms non-blocking email notifications
- [ ] `grep "checkAndProcessPendingReward" src/lib/referrals.ts` confirms pending reward re-processing
- [ ] `grep "unsubscribed_from_emails" src/lib/referrals.ts` confirms unsubscribe handling in both notification functions
- [ ] RPC function `process_referral_reward` exists in database (verified via migration check or Supabase dashboard)
</acceptance_criteria>

---

## Task: GROW-02.3 — Verify Stripe Coupon Configuration

<read_first>
- src/lib/referral-codes.ts
- .env.local
</read_first>

<action>
1. Check `STRIPE_REFERRAL_COUPON_ID` env var — if not set, confirm the fallback `osa7HMgY` is a valid Stripe coupon ID.
2. Verify the coupon referenced provides 20% off (as stated in code comments and project docs).
3. Verify `Stripe(promotionCodes.create)` uses `promotion.type: 'coupon'` and `promotion.coupon` correctly.
4. Verify `metadata: { referrer_user_id, type: 'referral' }` is set on each promo code for webhook lookup.
5. Document if the default coupon ID `osa7HMgY` needs to exist in production Stripe account.
</action>

<acceptance_criteria>
- [ ] `grep "REFERRAL_COUPON_ID" src/lib/referral-codes.ts` confirms coupon ID configuration
- [ ] `grep "type.*coupon" src/lib/referral-codes.ts` confirms coupon type
- [ ] `grep "referrer_user_id" src/lib/referral-codes.ts` confirms metadata for webhook matching
- [ ] `grep "promotionCodes.create" src/lib/referral-codes.ts` confirms Stripe API call
</acceptance_criteria>

---

## Task: GROW-02.4 — Verify Referral UI/API Integration Points

<read_first>
- src/lib/referral-codes.ts (getReferralStats)
- src/app/dashboard/ (referral widget, if any)
- src/app/api/ (referral-related API routes, if any)
</read_first>

<action>
1. Search for UI components that invoke `getReferralStats` or display referral codes.
2. Search for API routes that handle referral link sharing or referral code lookup.
3. Confirm the referral link format is documented (e.g., `https://citizenmate.com.au/?ref=MATE-XXX`).
4. If no UI/API integration exists, note this as a gap to be addressed (the backend is ready but frontend may need wiring).
5. Document integration status in audit file.
</action>

<acceptance_criteria>
- [ ] `grep -r "getReferralStats\|getOrCreateReferralCode" src/app/ src/components/` returns at least 1 match (frontend integration exists) OR gap is explicitly documented as deferred
- [ ] Referral link format is clearly defined (code comments or documentation)
- [ ] Integration audit documented in `.planning/phases/07-growth-retention/07-referral-audit.md`
</acceptance_criteria>

---

## Task: GROW-02.5 — Build Check

<read_first>
- package.json
</read_first>

<action>
1. Run `npm run build` to verify referral code files compile without TypeScript errors.
2. Check for any build warnings related to Stripe imports or Supabase RPC calls.
3. If build succeeds, GROW-02 code verification passes.
</action>

<acceptance_criteria>
- [ ] `npm run build` exits with code 0
- [ ] No build errors reference `src/lib/referrals.ts` or `src/lib/referral-codes.ts`
</acceptance_criteria>

---

## must_haves
1. `getOrCreateReferralCode` generates unique MATE-{slug} codes per user
2. `processReferralReward` enforces qualification gate (quiz completion OR premium)
3. Self-referral is blocked
4. Reward processing uses atomic RPC for consistency
5. Stripe promo codes are single-use (max_redemptions: 1) with referrer metadata
6. Email notifications respect unsubscribe preference
7. Pending rewards are retried via `checkAndProcessPendingReward`
