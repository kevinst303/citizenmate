# Phase 7: Growth & Retention - Context

**Gathered:** 2026-05-11
**Status:** Ready for planning

<domain>
## Phase Boundary

Verify and harden the existing Growth & Retention features that are already implemented in the codebase: i18n support for 6 languages, the "Help a Mate" referral program, and email notification triggers via Resend. This is primarily a verification and audit phase — the core code already exists.
</domain>

<decisions>
## Implementation Decisions

### Verification Approach
- All three GROW requirements have pre-existing implementations; verify they meet ROADMAP success criteria
- i18n: Confirm all 6 language dictionaries (en, es, hi, zh, ar, vi) load correctly and UI renders in each locale
- Referral: Verify the end-to-end referral flow — code generation, qualification check, reward processing via Supabase RPC
- Email: Verify trigger integration (purchase confirmation, expiry warning, welcome, referral bonus/welcome emails)
- No new code needed unless verification reveals gaps; focus on audit and documentation

### Gap Handling
- If verification finds gaps, create minimal fix plans rather than full new implementations
- Max scope: environment variable checks, edge case hardening, missing template warnings

### the agent's Discretion
- All verification approach, test methodology, and gap classification at the agent's discretion
</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/lib/referrals.ts` — Core referral reward processing (processReferralReward, checkAndProcessPendingReward)
- `src/lib/referral-codes.ts` — Stripe promo code management (getOrCreateReferralCode, findReferrerByPromoCode, getReferralStats)
- `src/lib/email.ts` — Resend email service (sendEmail, sendPurchaseConfirmation, sendPremiumExpiryWarning, sendWelcomeEmail)
- `src/i18n/config.ts` — Locale configuration (6 languages: en, es, hi, zh, ar, vi)
- `src/i18n/i18n-context.tsx` — React I18n provider with dynamic dictionary loading
- `src/i18n/dictionaries/` — 6 JSON dictionaries (ar.json, en.json, es.json, hi.json, vi.json, zh.json)

### Established Patterns
- Firebase-style RPC for atomic referral reward processing
- Resend template-based emails with env var configuration
- Dynamic import pattern for i18n dictionaries
- React context pattern for i18n provider
</code_context>

<specifics>
## Specific Ideas

### i18n Verification
- Confirm all 6 locales listed in config.ts (en, es, hi, zh, ar, vi) map to valid dictionary files
- Check that the ROADMAP requirement for "4 new language pairs" is satisfied (en was v1.0; es, hi, zh, ar, vi are 5 new pairs — exceeds requirement)
- Verify RTL support for Arabic (ar) if not already confirmed
- Check that all user-facing strings have dictionary entries

### Referral Verification
- Verify the referral code generation flow (getOrCreateReferralCode)
- Verify qualification gate logic (quiz completion or purchase)
- Verify RPC function process_referral_reward exists in database
- Test edge cases: self-referral, duplicate referral, unsubscribed user

### Email Verification
- Confirm all required Resend template env vars are documented
- Verify purchase confirmation, expiry warning, welcome, referral bonus, and referral welcome email triggers
- Check unsubscribe handling in referral notification functions
</specifics>

<deferred>
## Deferred Ideas

- CRON-based automated re-engagement emails (listed in ROADMAP but not blocking — can be Phase 7.1)
- Referral analytics dashboard (belongs in a future phase)
- A/B testing for referral copy (future optimization)
</deferred>
