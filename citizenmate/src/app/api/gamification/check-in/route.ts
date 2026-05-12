// ===== CitizenMate: Daily Check-in API Route =====
// POST /api/gamification/check-in
// Updates the user's streak using freeze-aware logic from the gamification engine.
// Returns the updated streak state and any newly earned badges + XP rewards.

import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import {
  calculateStreakWithFreeze,
  evaluateBadges,
  getStreakMilestoneXp,
  getStreakFreezeAward,
  getAllBadgeDefinitions,
  MAX_STREAK_FREEZES,
} from "@/lib/gamification-engine";
import type { UserStreak, BadgeDefinition, BadgeEvaluationInput } from "@/lib/gamification-types";

export async function POST(req: Request) {
  try {
    const supabase = await createSupabaseServerClient();

    // Authenticate via session
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = user.id;

    // Fetch current streak record
    const { data: streakRow, error: fetchError } = await supabase
      .from("user_streaks")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (fetchError && fetchError.code !== "PGRST116") {
      // PGRST116 = no rows, first-time user
      console.error("[check-in] Fetch error:", fetchError);
      return NextResponse.json({ error: "Failed to fetch streak" }, { status: 500 });
    }

    const currentStreak = streakRow?.current_streak ?? 0;
    const longestStreak = streakRow?.longest_streak ?? 0;
    const lastActivityDate = streakRow?.last_activity_date ?? null;
    const totalActiveDays = streakRow?.total_active_days ?? 0;
    const streakFreezeAvailable = streakRow?.streak_freeze_available ?? 0;
    const frozenDays = streakRow?.frozen_days ?? 0;
    const lastFreezeUsedDate = streakRow?.last_freeze_used_date ?? null;

    // Calculate new streak with freeze-aware logic
    const result = calculateStreakWithFreeze(
      lastActivityDate,
      currentStreak,
      streakFreezeAvailable,
      frozenDays,
      lastFreezeUsedDate
    );

    // If already checked in today, return current state
    if (!result.isIncremented) {
      return NextResponse.json({
        streak: {
          current_streak: currentStreak,
          longest_streak: longestStreak,
          last_activity_date: lastActivityDate,
          total_active_days: totalActiveDays,
          streak_freeze_available: streakFreezeAvailable,
          frozen_days: frozenDays,
          last_freeze_used_date: lastFreezeUsedDate,
        },
        isIncremented: false,
        freezeConsumed: false,
        alreadyCheckedIn: true,
      });
    }

    const now = new Date().toISOString();
    const newLongestStreak = Math.max(result.newStreak, longestStreak);
    const newTotalActiveDays = totalActiveDays + 1;

    // Calculate milestone XP rewards
    const milestoneXp = getStreakMilestoneXp(result.newStreak);

    // Calculate freeze award: 1 freeze per 7 days, capped
    const currentFreezes = result.remainingFreezes;
    const earnedFreezeAward = getStreakFreezeAward(result.newStreak);
    // The engine returns remainingFreezes after consumption.
    // We need to check if a new freeze should be awarded based on the new streak value.
    // Award: if newStreak is a multiple of 7, and we haven't exceeded max AND streak wasn't just a freeze-preserve
    const shouldAwardFreeze =
      !result.freezeConsumed &&
      result.newStreak % 7 === 0 &&
      currentFreezes < MAX_STREAK_FREEZES;
    const newFreezeCount = shouldAwardFreeze
      ? Math.min(currentFreezes + 1, MAX_STREAK_FREEZES)
      : currentFreezes;

    // Upsert the streak record
    const upsertPayload: Record<string, unknown> = {
      user_id: userId,
      current_streak: result.newStreak,
      longest_streak: newLongestStreak,
      last_activity_date: now,
      total_active_days: newTotalActiveDays,
      streak_freeze_available: newFreezeCount,
      frozen_days: result.newFrozenDays,
      updated_at: now,
    };

    // Track freeze usage date
    if (result.freezeConsumed) {
      upsertPayload.last_freeze_used_date = now;
    }

    const { error: upsertError } = await supabase
      .from("user_streaks")
      .upsert(upsertPayload, { onConflict: "user_id" });

    if (upsertError) {
      console.error("[check-in] Upsert error:", upsertError);
      return NextResponse.json({ error: "Failed to update streak" }, { status: 500 });
    }

    // Award milestone XP if applicable
    const xpRewards: { amount: number; source: string; reason: string }[] = [];
    if (milestoneXp > 0) {
      const { error: xpError } = await supabase.from("xp_log").insert({
        user_id: userId,
        amount: milestoneXp,
        source: "streak_milestone",
        metadata: { streak: result.newStreak, milestone: true },
      });
      if (!xpError) {
        xpRewards.push({
          amount: milestoneXp,
          source: "streak_milestone",
          reason: `${result.newStreak}-day streak milestone`,
        });
      } else {
        console.error("[check-in] XP award error:", xpError);
      }
    }

    // Evaluate streak badges
    const allBadges = getAllBadgeDefinitions();
    const { data: earnedBadgeRows } = await supabase
      .from("user_badges")
      .select("badge_id")
      .eq("user_id", userId);

    const alreadyEarnedIds = new Set(
      (earnedBadgeRows ?? []).map((r: { badge_id: string }) => r.badge_id)
    );

    const streakBadges = evaluateBadges(
      { currentStreak: result.newStreak, longestStreak: newLongestStreak, totalQuestionsAnswered: 0, totalTestsCompleted: 0, masteryPercentage: 0, bestTestScore: null, valuesMasteryPercentage: 0 },
      alreadyEarnedIds
    );

    // Persist newly earned badges
    for (const badge of streakBadges) {
      await supabase.from("user_badges").insert({
        user_id: userId,
        badge_id: badge.id,
      });
    }

    return NextResponse.json({
      streak: {
        current_streak: result.newStreak,
        longest_streak: newLongestStreak,
        last_activity_date: now,
        total_active_days: newTotalActiveDays,
        streak_freeze_available: newFreezeCount,
        frozen_days: result.newFrozenDays,
        last_freeze_used_date: result.freezeConsumed ? now : streakRow?.last_freeze_used_date ?? null,
      },
      isIncremented: true,
      freezeConsumed: result.freezeConsumed,
      alreadyCheckedIn: false,
      freezeAwarded: shouldAwardFreeze,
      xpRewards,
      newlyEarnedBadges: streakBadges.map((b: BadgeDefinition) => ({
        id: b.id,
        name: b.name,
        description: b.description,
        icon: b.icon,
      })),
    });
  } catch (error) {
    console.error("[check-in] Unexpected error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
