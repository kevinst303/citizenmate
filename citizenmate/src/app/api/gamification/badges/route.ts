// ===== CitizenMate: Badge Showcase API Route =====
// GET  /api/gamification/badges  — returns all earned + unclaimed badges with definitions
// For the current authenticated user.

import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { getAllBadgeDefinitions, evaluateBadges } from "@/lib/gamification-engine";
import type { BadgeDefinition, BadgeEvaluationInput } from "@/lib/gamification-types";

export async function GET() {
  try {
    const supabase = await createSupabaseServerClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = user.id;

    // Fetch earned badge IDs
    const { data: earnedRows, error: earnedError } = await supabase
      .from("user_badges")
      .select("badge_id, earned_at")
      .eq("user_id", userId)
      .order("earned_at", { ascending: true });

    if (earnedError) {
      console.error("[badges] Fetch error:", earnedError);
      return NextResponse.json({ error: "Failed to fetch badges" }, { status: 500 });
    }

    const earnedBadgeIds = new Set((earnedRows ?? []).map((r) => r.badge_id));

    // Fetch user stats for unclaimed badge evaluation
    const { data: streakRow } = await supabase
      .from("user_streaks")
      .select("current_streak, longest_streak")
      .eq("user_id", userId)
      .single();

    const { data: xpRows } = await supabase
      .from("xp_log")
      .select("amount")
      .eq("user_id", userId);

    const totalXp = (xpRows ?? []).reduce((sum, r) => sum + r.amount, 0);

    const currentStreak = streakRow?.current_streak ?? 0;
    const longestStreak = streakRow?.longest_streak ?? 0;

    // Build evaluation input from aggregate data
    const evaluationInput: BadgeEvaluationInput = {
      currentStreak,
      longestStreak,
      totalQuestionsAnswered: 0, // filled by caller when available
      totalTestsCompleted: 0,
      masteryPercentage: 0,
      bestTestScore: null,
      valuesMasteryPercentage: 0,
    };

    const allDefinitions = getAllBadgeDefinitions();

    // Separate earned badges (with metadata) from unclaimed
    const earnedBadges: (BadgeDefinition & { earned_at: string })[] = [];
    const unclaimedBadges: BadgeDefinition[] = [];

    for (const badge of allDefinitions) {
      if (earnedBadgeIds.has(badge.id)) {
        const earnedRow = (earnedRows ?? []).find((r) => r.badge_id === badge.id);
        earnedBadges.push({
          ...badge,
          earned_at: earnedRow?.earned_at ?? "",
        });
      } else {
        unclaimedBadges.push(badge);
      }
    }

    // Evaluate which unclaimed badges are earnable right now
    const earnableBadges = evaluateBadges(evaluationInput, earnedBadgeIds);

    return NextResponse.json({
      earned: earnedBadges,
      unclaimed: unclaimedBadges,
      earnableNow: earnableBadges.map((b) => b.id),
      stats: {
        totalEarned: earnedBadges.length,
        totalBadges: allDefinitions.length,
        totalXp,
        currentStreak,
        longestStreak,
      },
    });
  } catch (error) {
    console.error("[badges] Unexpected error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
