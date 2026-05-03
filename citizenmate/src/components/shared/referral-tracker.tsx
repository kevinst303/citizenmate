"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

// ===== Referral Tracker =====
// Captures referral attribution from URL parameters and persists as cookies.
// Supports two referral modes:
//   1. ?ref=<userId>     — direct referral link (tracked via user ID)
//   2. ?promo=<code>     — promo code entry (tracked via code)
// Both are stored as cookies for 30 days and consumed at signup/checkout.

export function ReferralTracker() {
  const searchParams = useSearchParams();

  useEffect(() => {
    // Track direct referral (user ID)
    const ref = searchParams.get("ref");
    if (ref) {
      const d = new Date();
      d.setTime(d.getTime() + 30 * 24 * 60 * 60 * 1000);
      document.cookie = `citizenmate_ref=${ref};expires=${d.toUTCString()};path=/;SameSite=Lax`;
    }

    // Track promo code referral
    const promo = searchParams.get("promo");
    if (promo) {
      const d = new Date();
      d.setTime(d.getTime() + 30 * 24 * 60 * 60 * 1000);
      document.cookie = `citizenmate_promo=${promo};expires=${d.toUTCString()};path=/;SameSite=Lax`;
    }
  }, [searchParams]);

  return null;
}
