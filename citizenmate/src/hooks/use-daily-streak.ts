// ===== CitizenMate: useDailyStreak Hook =====
// Client-side hook that manages daily check-in lifecycle.
// Uses localStorage to avoid redundant API calls on the same day.
// Returns streak data, loading state, and check-in status.

"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useAuth } from "@/lib/auth-context";

export interface DailyStreakData {
  current_streak: number;
  longest_streak: number;
  last_activity_date: string | null;
  total_active_days: number;
  streak_freeze_available: number;
  frozen_days: number;
  last_freeze_used_date: string | null;
}

export interface DailyStreakState {
  streak: DailyStreakData | null;
  isLoading: boolean;
  isCheckedInToday: boolean;
  freezeConsumed: boolean;
  freezeAwarded: boolean;
  xpRewards: { amount: number; source: string; reason: string }[];
  newlyEarnedBadges: { id: string; name: string; description: string; icon: string }[];
  error: string | null;
}

const LOCAL_STORAGE_KEY = "citizenmate_last_checkin_date";

function getLastCheckinDate(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(LOCAL_STORAGE_KEY);
}

function setLastCheckinDate(date: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(LOCAL_STORAGE_KEY, date);
}

export function useDailyStreak(): DailyStreakState & {
  doCheckIn: () => Promise<void>;
  refresh: () => Promise<void>;
} {
  const { user } = useAuth();
  const [streak, setStreak] = useState<DailyStreakData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCheckedInToday, setIsCheckedInToday] = useState(false);
  const [freezeConsumed, setFreezeConsumed] = useState(false);
  const [freezeAwarded, setFreezeAwarded] = useState(false);
  const [xpRewards, setXpRewards] = useState<
    { amount: number; source: string; reason: string }[]
  >([]);
  const [newlyEarnedBadges, setNewlyEarnedBadges] = useState<
    { id: string; name: string; description: string; icon: string }[]
  >([]);
  const [error, setError] = useState<string | null>(null);
  const hasMounted = useRef(false);
  const isCheckingIn = useRef(false);

  const todayStr = new Date().toISOString().slice(0, 10);

  const fetchStreak = useCallback(async () => {
    if (!user) {
      setStreak(null);
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/gamification/freeze");
      if (!res.ok) throw new Error("Failed to fetch streak data");
      const data = await res.json();

      setStreak({
        current_streak: data.current_streak ?? 0,
        longest_streak: data.current_streak ?? 0, // will be corrected by check-in
        last_activity_date: data.last_activity_date ?? null,
        total_active_days: 0,
        streak_freeze_available: data.streak_freeze_available ?? 0,
        frozen_days: data.frozen_days ?? 0,
        last_freeze_used_date: data.last_freeze_used_date ?? null,
      });

      // Check if already checked in today
      const lastCheckin = getLastCheckinDate();
      if (lastCheckin === todayStr) {
        setIsCheckedInToday(true);
      }
    } catch (err) {
      console.error("[useDailyStreak] Fetch error:", err);
      setError(err instanceof Error ? err.message : "Failed to load streak");
    } finally {
      setIsLoading(false);
    }
  }, [user, todayStr]);

  const doCheckIn = useCallback(async () => {
    if (!user || isCheckingIn.current) return;

    // Prevent re-checkin on same day
    const lastCheckin = getLastCheckinDate();
    if (lastCheckin === todayStr) {
      setIsCheckedInToday(true);
      return;
    }

    isCheckingIn.current = true;
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/gamification/check-in", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: "Check-in failed" }));
        throw new Error(err.error ?? "Check-in failed");
      }

      const data = await res.json();

      // Update local state
      setStreak(data.streak);
      setIsCheckedInToday(!data.alreadyCheckedIn);
      setFreezeConsumed(data.freezeConsumed ?? false);
      setFreezeAwarded(data.freezeAwarded ?? false);
      setXpRewards(data.xpRewards ?? []);
      setNewlyEarnedBadges(data.newlyEarnedBadges ?? []);

      // Persist check-in date to localStorage
      if (!data.alreadyCheckedIn) {
        setLastCheckinDate(todayStr);
      }
    } catch (err) {
      console.error("[useDailyStreak] Check-in error:", err);
      setError(err instanceof Error ? err.message : "Check-in failed");
    } finally {
      setIsLoading(false);
      isCheckingIn.current = false;
    }
  }, [user, todayStr]);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    await fetchStreak();
  }, [fetchStreak]);

  // Auto check-in on mount + auth load
  useEffect(() => {
    if (hasMounted.current || !user) return;
    hasMounted.current = true;
    fetchStreak().then(() => {
      const lastCheckin = getLastCheckinDate();
      if (lastCheckin !== todayStr) {
        doCheckIn();
      } else {
        setIsCheckedInToday(true);
      }
    });
  }, [user, fetchStreak, doCheckIn, todayStr]);

  // Reset when user changes
  useEffect(() => {
    hasMounted.current = false;
    setStreak(null);
    setIsCheckedInToday(false);
    setFreezeConsumed(false);
    setFreezeAwarded(false);
    setXpRewards([]);
    setNewlyEarnedBadges([]);
    setError(null);
  }, [user]);

  return {
    streak,
    isLoading,
    isCheckedInToday,
    freezeConsumed,
    freezeAwarded,
    xpRewards,
    newlyEarnedBadges,
    error,
    doCheckIn,
    refresh,
  };
}
