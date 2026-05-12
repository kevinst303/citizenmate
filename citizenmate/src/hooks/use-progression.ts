// ===== CitizenMate: useProgression Hook =====
// Fetches and caches user level, XP, and progression data.
// Aggregates XP from xp_log on the server side and returns computed level info.

"use client";

import { useState, useEffect, useCallback } from "react";

export interface ProgressionData {
  totalXp: number;
  level: number;
  currentLevelXp: number;
  nextLevelXp: number;
  progress: number;
  isMaxLevel: boolean;
  levelTitle: string;
  recentActivity: {
    amount: number;
    source: string;
    createdAt: string;
  }[];
  xpBySource: Record<string, number>;
}

interface UseProgressionReturn {
  data: ProgressionData | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

const CACHE_KEY = "citizenmate_progression_cache";
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

export function useProgression(): UseProgressionReturn {
  const [data, setData] = useState<ProgressionData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProgression = useCallback(async () => {
    // Check cache first
    if (typeof window !== "undefined") {
      const cached = sessionStorage.getItem(CACHE_KEY);
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          if (Date.now() - parsed.timestamp < CACHE_TTL_MS) {
            setData(parsed.data);
            setIsLoading(false);
            return;
          }
        } catch {
          // Stale cache — ignore
        }
      }
    }

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/gamification/progression");
      if (!res.ok) {
        throw new Error(`Failed to fetch progression: ${res.status}`);
      }
      const json: ProgressionData = await res.json();
      setData(json);

      // Cache in sessionStorage
      if (typeof window !== "undefined") {
        sessionStorage.setItem(
          CACHE_KEY,
          JSON.stringify({ data: json, timestamp: Date.now() })
        );
      }
    } catch (err) {
      console.error("[useProgression] Error:", err);
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProgression();
  }, [fetchProgression]);

  return { data, isLoading, error, refetch: fetchProgression };
}
