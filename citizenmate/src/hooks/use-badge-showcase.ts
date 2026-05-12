// ===== CitizenMate: useBadgeShowcase Hook =====
// Client-side hook that fetches and caches badge data for the BadgeShowcase UI.
// Handles loading, error, and data refresh states.

"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useAuth } from "@/lib/auth-context";
import type { BadgeDefinition } from "@/lib/gamification-types";

export interface EarnedBadge extends BadgeDefinition {
  earned_at: string;
}

export interface BadgeShowcaseStats {
  totalEarned: number;
  totalBadges: number;
  totalXp: number;
  currentStreak: number;
  longestStreak: number;
}

export interface BadgeShowcaseData {
  earned: EarnedBadge[];
  unclaimed: BadgeDefinition[];
  earnableNow: string[];
  stats: BadgeShowcaseStats;
}

export interface BadgeShowcaseState {
  data: BadgeShowcaseData | null;
  isLoading: boolean;
  error: string | null;
  activeCategory: BadgeCategory;
}

export type BadgeCategory = "all" | "streak" | "mastery" | "effort" | "milestone";

const CATEGORY_LABELS: Record<BadgeCategory, string> = {
  all: "All Badges",
  streak: "Streak",
  mastery: "Mastery",
  effort: "Effort",
  milestone: "Milestone",
};

const CATEGORY_ORDER: BadgeCategory[] = ["all", "streak", "mastery", "effort", "milestone"];

const CATEGORY_COLORS: Record<BadgeCategory, string> = {
  all: "bg-cm-navy text-white",
  streak: "bg-orange-100 text-orange-700",
  mastery: "bg-purple-100 text-purple-700",
  effort: "bg-blue-100 text-blue-700",
  milestone: "bg-amber-100 text-amber-700",
};

function getBadgeCategory(badge: BadgeDefinition): BadgeCategory {
  return badge.category as BadgeCategory;
}

export function useBadgeShowcase(): BadgeShowcaseState & {
  refresh: () => Promise<void>;
  setCategory: (cat: BadgeCategory) => void;
  categoryLabels: Record<BadgeCategory, string>;
  categoryOrder: BadgeCategory[];
  categoryColors: Record<BadgeCategory, string>;
  getBadgeCategory: (badge: BadgeDefinition) => BadgeCategory;
} {
  const { user } = useAuth();
  const [data, setData] = useState<BadgeShowcaseData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<BadgeCategory>("all");
  const hasMounted = useRef(false);
  const isFetching = useRef(false);

  const fetchBadges = useCallback(async () => {
    if (!user || isFetching.current) {
      if (!user) {
        setData(null);
        setIsLoading(false);
      }
      return;
    }

    isFetching.current = true;
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/gamification/badges");
      if (!res.ok) throw new Error("Failed to fetch badges");
      const json: BadgeShowcaseData = await res.json();
      setData(json);
    } catch (err) {
      console.error("[useBadgeShowcase] Fetch error:", err);
      setError(err instanceof Error ? err.message : "Failed to load badges");
    } finally {
      setIsLoading(false);
      isFetching.current = false;
    }
  }, [user]);

  // Fetch on mount
  useEffect(() => {
    if (hasMounted.current || !user) return;
    hasMounted.current = true;
    fetchBadges();
  }, [user, fetchBadges]);

  // Reset when user changes
  useEffect(() => {
    hasMounted.current = false;
    isFetching.current = false;
    setData(null);
    setActiveCategory("all");
    setError(null);
  }, [user]);

  return {
    data,
    isLoading,
    error,
    activeCategory,
    refresh: fetchBadges,
    setCategory: setActiveCategory,
    categoryLabels: CATEGORY_LABELS,
    categoryOrder: CATEGORY_ORDER,
    categoryColors: CATEGORY_COLORS,
    getBadgeCategory,
  };
}
