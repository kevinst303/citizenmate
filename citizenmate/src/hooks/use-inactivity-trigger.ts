"use client";

import { useEffect, useRef } from "react";
import { usePremium } from "@/lib/auth-context";

// ─── Inactivity Detection ──────────────────────────────────
// Detects free users who haven't visited in > INACTIVITY_DAYS
// and triggers the upgrade modal as a reactivation prompt.
//
// Also stashes last-active-date on each visit so we know
// when the user was last on the platform.

const KEY_LAST_ACTIVE = "citizenmate-last-active";
const KEY_INACTIVITY_PROMPT_SHOWN = "citizenmate-inactivity-prompt-shown";
const INACTIVITY_DAYS = 14;
const PROMPT_COOLDOWN_DAYS = 30;

function getLastActive(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(KEY_LAST_ACTIVE);
}

function setLastActive(): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY_LAST_ACTIVE, new Date().toISOString());
}

function wasInactivityPromptRecentlyShown(): boolean {
  if (typeof window === "undefined") return true;
  const raw = localStorage.getItem(KEY_INACTIVITY_PROMPT_SHOWN);
  if (!raw) return false;
  const shownAt = new Date(raw);
  const cooldownEnd = new Date(shownAt);
  cooldownEnd.setDate(cooldownEnd.getDate() + PROMPT_COOLDOWN_DAYS);
  return new Date() < cooldownEnd;
}

function markInactivityPromptShown(): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY_INACTIVITY_PROMPT_SHOWN, new Date().toISOString());
}

/**
 * Triggers the upgrade modal if a free-tier user has been inactive
 * for more than INACTIVITY_DAYS and hasn't seen the prompt recently.
 */
export function useInactivityTrigger() {
  const { tier, isPremium, premiumLoading, isSignedIn, upgrade } = usePremium();
  const triggeredRef = useRef(false);

  useEffect(() => {
    // Don't trigger while auth is loading
    if (premiumLoading) return;

    // Only for signed-in free-tier users
    if (!isSignedIn || isPremium) {
      // Still update last active for premium users
      setLastActive();
      return;
    }

    // Avoid double-firing in dev strict mode
    if (triggeredRef.current) return;

    const lastActive = getLastActive();

    // First visit — just record it
    if (!lastActive) {
      setLastActive();
      return;
    }

    const lastActiveDate = new Date(lastActive);
    const now = new Date();
    const daysSinceLastActive =
      (now.getTime() - lastActiveDate.getTime()) / (1000 * 60 * 60 * 24);

    // Update last active on every visit regardless
    setLastActive();

    if (
      daysSinceLastActive > INACTIVITY_DAYS &&
      !wasInactivityPromptRecentlyShown()
    ) {
      triggeredRef.current = true;
      markInactivityPromptShown();
      // Small delay so the dashboard renders first
      setTimeout(() => upgrade(), 1500);
    }
  }, [tier, isPremium, premiumLoading, isSignedIn, upgrade]);
}
