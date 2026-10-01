import { describe, it, expect } from "vitest";
import {
  subscriptionExpiryFromPeriod,
  fallbackSubscriptionExpiry,
  stackedSprintExpiry,
  finalExpiry,
  pastDueGraceExpiry,
  SPRINT_PASS_DAYS,
  SUBSCRIPTION_GRACE_DAYS,
  PAST_DUE_GRACE_DAYS,
} from "../entitlement";

const NOW = new Date("2026-10-01T00:00:00.000Z");

// Mirror the implementation's calendar-day arithmetic (setDate). Fixed
// millisecond math would drift ±1h across DST transitions, which is exactly
// the behaviour calendar-day expiry dates are allowed to have.
const days = (n: number, from: Date = NOW) => {
  const d = new Date(from.getTime());
  d.setDate(d.getDate() + n);
  return d;
};

describe("subscriptionExpiryFromPeriod", () => {
  it("anchors to the real period end plus grace days", () => {
    // Yearly subscription ending 2027-09-30 (365 days out)
    const periodEndSec = Math.floor(days(365).getTime() / 1000);
    const expiry = subscriptionExpiryFromPeriod(periodEndSec);
    expect(expiry.getTime()).toBe(days(365 + SUBSCRIPTION_GRACE_DAYS).getTime());
  });

  it("does not collapse a yearly plan to ~31 days", () => {
    const periodEndSec = Math.floor(days(365).getTime() / 1000);
    const expiry = subscriptionExpiryFromPeriod(periodEndSec);
    expect(expiry.getTime()).toBeGreaterThan(days(300).getTime());
  });
});

describe("fallbackSubscriptionExpiry", () => {
  it("grants roughly a month plus grace from now", () => {
    const expiry = fallbackSubscriptionExpiry(NOW);
    const expected = days(31 + SUBSCRIPTION_GRACE_DAYS);
    expect(expiry.getTime()).toBe(expected.getTime());
  });
});

describe("stackedSprintExpiry", () => {
  it("adds a full sprint pass from now when nothing is active", () => {
    const expiry = stackedSprintExpiry(null, NOW);
    expect(expiry.getTime()).toBe(days(SPRINT_PASS_DAYS).getTime());
  });

  it("stacks on top of an existing later expiry instead of resetting", () => {
    const existing = days(30);
    const expiry = stackedSprintExpiry(existing, NOW);
    expect(expiry.getTime()).toBe(days(30 + SPRINT_PASS_DAYS).getTime());
  });

  it("ignores an expired previous purchase (base = now)", () => {
    const expired = days(-5);
    const expiry = stackedSprintExpiry(expired, NOW);
    expect(expiry.getTime()).toBe(days(SPRINT_PASS_DAYS).getTime());
  });
});

describe("finalExpiry", () => {
  it("never shortens a later existing expiry (referral bonus survives renewals)", () => {
    const existing = days(90); // e.g. sprint pass + referral bonus
    const candidate = days(40); // e.g. subscription period end + grace
    expect(finalExpiry(candidate, existing).getTime()).toBe(existing.getTime());
  });

  it("keeps the candidate when it is later", () => {
    const existing = days(10);
    const candidate = days(40);
    expect(finalExpiry(candidate, existing).getTime()).toBe(candidate.getTime());
  });

  it("keeps the candidate when there is no existing expiry", () => {
    expect(finalExpiry(days(40), null).getTime()).toBe(days(40).getTime());
  });
});

describe("pastDueGraceExpiry", () => {
  it("gives a lapsed member a short grace window on first failed payment", () => {
    const expiry = pastDueGraceExpiry(null, NOW);
    expect(expiry.getTime()).toBe(days(PAST_DUE_GRACE_DAYS).getTime());
  });

  it("never shortens an expiry that is still in the future", () => {
    const existing = days(20);
    expect(pastDueGraceExpiry(existing, NOW).getTime()).toBe(existing.getTime());
  });
});
