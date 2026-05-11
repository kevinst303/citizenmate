---
wave: 1
phase: 7
plan: 07-grow-03
purpose: Verify email notification triggers meet GROW-03 success criteria — transactional emails fire correctly for key milestones
status: ready
depends_on: []
files_modified:
  - src/lib/email.ts
  - src/lib/referrals.ts (email notification functions)
autonomous: true
requirements: [GROW-03]
---

# Plan 07-GROW-03: Email Notification Verification

## Goal
Verify email notifications (via Resend) are successfully triggering for purchase confirmation, premium expiry warning, welcome emails, referral bonus, and referral welcome — meeting the ROADMAP requirement: "Email notifications are successfully triggering based on user inactivity or key milestones."

## Pre-Flight Checks (Blocking)
- [ ] `RESEND_API_KEY` env var configured
- [ ] `RESEND_FROM_EMAIL` env var configured (or falls back to `hello@citizenmate.com.au`)
- [ ] Template env vars documented (see Task GROW-03.1)

---

## Task: GROW-03.1 — Audit Email Template Env Var Requirements

<read_first>
- src/lib/email.ts
- src/lib/referrals.ts (lines 137-191, notification functions)
- .env.local or .env.example
</read_first>

<action>
1. Extract all Resend template ID env var references from the codebase:
   - `RESEND_TEMPLATE_PURCHASE` (email.ts:90) — purchase confirmation
   - `RESEND_TEMPLATE_EXPIRY_WARNING` (email.ts:102) — premium expiry
   - `RESEND_TEMPLATE_WELCOME` (email.ts:114) — welcome email
   - `RESEND_TEMPLATE_REFERRAL_BONUS` (referrals.ts:152) — referrer bonus notification
   - `RESEND_TEMPLATE_REFERRAL_WELCOME` (referrals.ts:181) — referee welcome notification
2. Check if `.env.example` or `.env.local` documents all 5 template env vars.
3. Verify each template reference has a `console.warn` fallback when env var is missing (graceful degradation).
4. If any template env var is undocumented or missing from `.env.example`, flag as gap.
5. Write findings to `.planning/phases/07-growth-retention/07-email-audit.md`.
</action>

<acceptance_criteria>
- [ ] `grep "RESEND_TEMPLATE_" src/lib/email.ts src/lib/referrals.ts` returns 5 unique template ID references
- [ ] `grep "RESEND_TEMPLATE_" .env.example 2>/dev/null || echo "NO_ENV_EXAMPLE"` — check if documented
- [ ] Each template reference is wrapped in a `console.warn` for missing env var (pattern: `if (!templateId) console.warn...`)
- [ ] Audit file exists at `.planning/phases/07-growth-retention/07-email-audit.md` with env var documentation status
</acceptance_criteria>

---

## Task: GROW-03.2 — Audit Email Service Core (`sendEmail`)

<read_first>
- src/lib/email.ts (lines 1-79)
</read_first>

<action>
1. Trace `sendEmail` function:
   a. Confirms `getResendClient()` lazily initializes Resend with `RESEND_API_KEY`.
   b. Falls back to console.log when API key is missing (dev mode).
   c. Supports both template-based (`templateId` + `variables`) and raw HTML/text paths.
   d. Sets `from` to `RESEND_FROM_EMAIL` or default `hello@citizenmate.com.au`.
   e. Sets `replyTo` to configurable or default `support@citizenmate.com.au`.
   f. Returns `{ success: true/false }` with error catching.
2. Verify the `payload.template` structure matches Resend API spec: `{ id: string, variables: Record<string, unknown> }`.
3. Verify error path returns `{ success: false, error }` (callers can detect failures).
4. Document any gaps (e.g., retry logic missing, rate limiting, bounce handling).
</action>

<acceptance_criteria>
- [ ] `grep "export async function sendEmail" src/lib/email.ts` confirms function exists
- [ ] `grep "RESEND_API_KEY" src/lib/email.ts` confirms API key check
- [ ] `grep "console.log.*Would send" src/lib/email.ts` confirms dev mode fallback
- [ ] `grep "payload.template" src/lib/email.ts` confirms template support
- [ ] `grep "FROM_ADDRESS" src/lib/email.ts` confirms sender configuration
- [ ] `grep "replyTo" src/lib/email.ts` confirms reply-to header
- [ ] `grep "catch.*error" src/lib/email.ts` confirms error handling
</acceptance_criteria>

---

## Task: GROW-03.3 — Audit Pre-built Email Functions

<read_first>
- src/lib/email.ts (lines 81-124)
</read_first>

<action>
1. Trace `sendPurchaseConfirmation(email, expiresAt)`:
   a. Formats date as `en-AU` locale with long month format.
   b. Uses `RESEND_TEMPLATE_PURCHASE` template.
   c. Passes `{ expiryDate }` as template variable.
2. Trace `sendPremiumExpiryWarning(email, daysLeft)`:
   a. Uses `RESEND_TEMPLATE_EXPIRY_WARNING` template.
   b. Passes `{ daysLeft }` as template variable.
   c. Handles singular/plural in subject line (`day` vs `days`).
3. Trace `sendWelcomeEmail(email, name?)`:
   a. Uses `RESEND_TEMPLATE_WELCOME` template.
   b. Passes `{ userName: name || 'there' }` as template variable (falls back to 'there').
4. Verify each function has a `console.warn` when its template env var is missing.
5. Verify each function calls `sendEmail` with the correct `to`, `subject`, and `templateId`.
</action>

<acceptance_criteria>
- [ ] `grep "sendPurchaseConfirmation" src/lib/email.ts` confirms function exists
- [ ] `grep "sendPremiumExpiryWarning" src/lib/email.ts` confirms function exists
- [ ] `grep "sendWelcomeEmail" src/lib/email.ts` confirms function exists
- [ ] `grep "en-AU" src/lib/email.ts` confirms AU locale date formatting
- [ ] `grep "userName.*there" src/lib/email.ts` confirms fallback for missing name
</acceptance_criteria>

---

## Task: GROW-03.4 — Audit Referral Email Notifications

<read_first>
- src/lib/referrals.ts (lines 137-191)
</read_first>

<action>
1. Trace `sendReferrerNotification(referrerId, refereeName)`:
   a. Fetches referrer email, display_name, and `unsubscribed_from_emails` from profiles.
   b. Returns early if no email or user has unsubscribed.
   c. Uses `RESEND_TEMPLATE_REFERRAL_BONUS` template.
   d. Passes `{ userName, refereeName }` as template variables.
   e. Falls back to 'Mate' for display name.
2. Trace `sendRefereeNotification(refereeId, email, displayName)`:
   a. Returns early if no email.
   b. Fetches `unsubscribed_from_emails` from profiles, returns early if unsubscribed.
   c. Uses `RESEND_TEMPLATE_REFERRAL_WELCOME` template.
   d. Passes `{ userName }` as template variable, falls back to 'there'.
3. Verify both functions respect unsubscribe preferences.
4. Verify both functions are called via `Promise.allSettled` (non-blocking, error-isolated).
5. Document any gaps.
</action>

<acceptance_criteria>
- [ ] `grep "sendReferrerNotification" src/lib/referrals.ts` confirms function exists
- [ ] `grep "sendRefereeNotification" src/lib/referrals.ts` confirms function exists
- [ ] `grep "unsubscribed_from_emails" src/lib/referrals.ts | wc -l` returns ≥ 2 (checked in both notification functions)
- [ ] `grep "RESEND_TEMPLATE_REFERRAL_BONUS" src/lib/referrals.ts` confirms referrer template
- [ ] `grep "RESEND_TEMPLATE_REFERRAL_WELCOME" src/lib/referrals.ts` confirms referee template
- [ ] `grep "Promise.allSettled" src/lib/referrals.ts` confirms non-blocking pattern
</acceptance_criteria>

---

## Task: GROW-03.5 — Verify Email Trigger Integration Points

<read_first>
- Search codebase for all callers of sendPurchaseConfirmation, sendPremiumExpiryWarning, sendWelcomeEmail, processReferralReward
</read_first>

<action>
1. Find all call sites for email trigger functions:
   - `sendPurchaseConfirmation` — should be called after successful Stripe checkout
   - `sendPremiumExpiryWarning` — should be called by a CRON/scheduled job when premium nears expiry
   - `sendWelcomeEmail` — should be called after user registration
   - `processReferralReward` — should be called after quiz completion or purchase
2. Trace each integration point to confirm:
   a. The trigger fires at the correct moment (e.g., post-payment, post-registration).
   b. The correct user email is passed.
   c. Errors in email sending don't block the parent operation (non-blocking pattern).
3. If any trigger point is missing or unconfirmed, document as gap.
4. Write integration audit to the email audit file.
</action>

<acceptance_criteria>
- [ ] `grep -r "sendPurchaseConfirmation" src/app/ src/lib/` finds at least 1 call site
- [ ] `grep -r "sendWelcomeEmail" src/app/ src/lib/` finds at least 1 call site
- [ ] `grep -r "processReferralReward\|checkAndProcessPendingReward" src/app/ src/lib/` finds at least 1 call site outside referrals.ts
- [ ] All call sites use try-catch or `.catch()` to handle email failures without propagating errors
- [ ] Integration audit documented in `.planning/phases/07-growth-retention/07-email-audit.md`
</acceptance_criteria>

---

## Task: GROW-03.6 — Build Check

<read_first>
- package.json
</read_first>

<action>
1. Run `npm run build` to verify email and referral files compile without errors.
2. Check for any Resend-related build warnings.
</action>

<acceptance_criteria>
- [ ] `npm run build` exits with code 0
- [ ] No build errors reference `src/lib/email.ts`
</acceptance_criteria>

---

## must_haves
1. All 5 Resend template env vars are identified and documented
2. `sendEmail` core service gracefully degrades when API key is missing (dev mode)
3. All pre-built email functions (`sendPurchaseConfirmation`, `sendPremiumExpiryWarning`, `sendWelcomeEmail`) are correctly wired
4. Referral email notifications respect unsubscribe preferences
5. Email sending is non-blocking (errors don't cascade to parent operations)
6. Integration trigger points (purchase, registration, quiz completion) are verified
