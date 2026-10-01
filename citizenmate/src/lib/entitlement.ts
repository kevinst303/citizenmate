// ===== Entitlement Expiry Math =====
// Pure date logic used by the Stripe webhook to grant, extend, and preserve
// premium access. Kept side-effect-free so the money-critical rules can be
// unit-tested (src/lib/__tests__/entitlement.test.ts).
//
// Rules encoded here:
//   1. Subscriptions are anchored to Stripe's current_period_end (+ grace),
//      never a hardcoded interval — a yearly plan must not lapse at day 31.
//   2. Sprint Pass purchases stack: 60 days from the later of now or the
//      existing expiry, instead of resetting it.
//   3. A webhook can never shorten an existing later expiry — referral bonus
//      days and stacked purchases survive subscription renewals.
//   4. past_due grants a grace window rather than cutting access instantly.

export const SPRINT_PASS_DAYS = 60;
export const SUBSCRIPTION_GRACE_DAYS = 3;
export const PAST_DUE_GRACE_DAYS = 3;
// Fallback only, used when the subscription object can't be retrieved.
export const DEFAULT_SUBSCRIPTION_DAYS = 31;

function addDays(from: Date, days: number): Date {
  const d = new Date(from.getTime());
  d.setDate(d.getDate() + days);
  return d;
}

/** Subscription expiry from the real period end (seconds) + grace. */
export function subscriptionExpiryFromPeriod(periodEndSec: number): Date {
  return addDays(new Date(periodEndSec * 1000), SUBSCRIPTION_GRACE_DAYS);
}

/** Fallback subscription expiry when no period end is available. */
export function fallbackSubscriptionExpiry(now: Date = new Date()): Date {
  return addDays(now, DEFAULT_SUBSCRIPTION_DAYS + SUBSCRIPTION_GRACE_DAYS);
}

/** Stacked Sprint Pass expiry: 60d from the later of now or current expiry. */
export function stackedSprintExpiry(
  currentExpiry: Date | null,
  now: Date = new Date()
): Date {
  const base = currentExpiry && currentExpiry > now ? currentExpiry : now;
  return addDays(base, SPRINT_PASS_DAYS);
}

/** Never return a date earlier than the existing expiry. */
export function finalExpiry(candidate: Date, currentExpiry: Date | null): Date {
  return currentExpiry && currentExpiry > candidate ? currentExpiry : candidate;
}

/**
 * past_due grace: the member keeps access for at least PAST_DUE_GRACE_DAYS,
 * but a still-valid later expiry is never shortened.
 */
export function pastDueGraceExpiry(
  currentExpiry: Date | null,
  now: Date = new Date()
): Date {
  const grace = addDays(now, PAST_DUE_GRACE_DAYS);
  return finalExpiry(grace, currentExpiry);
}
