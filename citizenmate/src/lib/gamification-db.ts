// ===== CitizenMate Gamification Database Layer =====
// Wraps the pure-logic gamification engine with Supabase persistence.
// Follows the same patterns as sync.ts (browser client, isSupabaseConfigured guard).

import { getSupabaseBrowserClient } from "@/lib/supabase";
import { calculateStreak, evaluateBadges, getAllBadgeDefinitions } from "@/lib/gamification-engine";
import type { UserStreak, UserBadge, BadgeDefinition, BadgeEvaluationInput, XpEntry, XpSource } from "@/lib/gamification-types";

// ── Guards ────────────────────────────────────────────

function isSupabaseConfigured(): boolean {
  return !!(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

// ─── Streak Operations ──────────────────────────────────

/**
 * Fetch the current streak record for a user.
 * Returns null if no streak record exists yet.
 */
export async function getUserStreak(userId: string): Promise<UserStreak | null> {
  if (!isSupabaseConfigured()) return null;

  const supabase = getSupabaseBrowserClient();
  const { data, error } = await supabase
    .from("user_streaks")
    .select("current_streak, longest_streak, last_activity_date, total_active_days")
    .eq("user_id", userId)
    .single();

  if (error || !data) return null;
  return {
    current_streak: data.current_streak,
    longest_streak: data.longest_streak,
    last_activity_date: data.last_activity_date,
    total_active_days: data.total_active_days,
  };
}

/**
 * Update the user's streak: calls calculateStreak() from the engine,
 * then persists the result. Automatically increments total_active_days
 * on new activity days.
 *
 * Returns the updated streak state and any newly earned badges.
 */
export async function updateStreak(userId: string): Promise<{
  streak: UserStreak;
  isIncremented: boolean;
  newlyEarnedBadges: BadgeDefinition[];
}> {
  const supabase = getSupabaseBrowserClient();

  // Get current state
  const current = await getUserStreak(userId);
  const currentStreak = current?.current_streak ?? 0;
  const lastActivity = current?.last_activity_date ?? null;
  const totalActiveDays = current?.total_active_days ?? 0;

  // Calculate new streak
  const { newStreak, isIncremented } = calculateStreak(lastActivity, currentStreak);

  // Build updated record
  const now = new Date().toISOString();
  const newLongestStreak = Math.max(newStreak, current?.longest_streak ?? 0);
  const newTotalActiveDays = isIncremented ? totalActiveDays + 1 : totalActiveDays;
  const updated: Record<string, unknown> = {
    user_id: userId,
    current_streak: newStreak,
    longest_streak: newLongestStreak,
    last_activity_date: now,
    total_active_days: newTotalActiveDays,
    updated_at: now,
  };

  // Upsert
  const { error } = await supabase
    .from("user_streaks")
    .upsert(updated, { onConflict: "user_id" });

  if (error) {
    console.error("[gamification-db] Failed to update streak:", error);
    throw error;
  }

  // Evaluate badges after streak update
  const allBadges = getAllBadgeDefinitions();
  const earnedIds = new Set((await getEarnedBadges(userId)).map((b) => b.badge_id));
  const input: BadgeEvaluationInput = {
    currentStreak: newStreak,
    longestStreak: newLongestStreak,
    totalQuestionsAnswered: 0, // filled by caller
    totalTestsCompleted: 0, // filled by caller
    masteryPercentage: 0, // filled by caller
    bestTestScore: null, // filled by caller
    valuesMasteryPercentage: 0, // filled by caller
  };

  // We only evaluate streak-based badges here; full eval happens elsewhere
  const streakBadges = evaluateBadges(
    { ...input, currentStreak: newStreak },
    earnedIds
  );

  // Persist any newly earned streak badges
  for (const badge of streakBadges) {
    await earnBadge(userId, badge.id);
  }

  return {
    streak: {
      current_streak: newStreak,
      longest_streak: newLongestStreak,
      last_activity_date: now,
      total_active_days: newTotalActiveDays,
    },
    isIncremented,
    newlyEarnedBadges: streakBadges,
  };
}

// ─── Badge Operations ────────────────────────────────────

/**
 * Get all badges earned by a user.
 */
export async function getEarnedBadges(userId: string): Promise<UserBadge[]> {
  if (!isSupabaseConfigured()) return [];

  const supabase = getSupabaseBrowserClient();
  const { data, error } = await supabase
    .from("user_badges")
    .select("id, badge_id, earned_at")
    .eq("user_id", userId)
    .order("earned_at", { ascending: true });

  if (error || !data) return [];
  return data.map((r) => ({
    id: r.id,
    badge_id: r.badge_id,
    earned_at: r.earned_at,
  }));
}

/**
 * Persist a single badge award.
 */
export async function earnBadge(userId: string, badgeId: string): Promise<void> {
  if (!isSupabaseConfigured()) return;

  const supabase = getSupabaseBrowserClient();
  const { error } = await supabase.from("user_badges").insert({
    user_id: userId,
    badge_id: badgeId,
  });

  if (error) {
    // Ignore unique constraint violations — badge already earned
    if (error.code === "23505") return;
    console.error("[gamification-db] Failed to earn badge:", error);
    throw error;
  }
}

/**
 * Evaluate which badges a user should earn based on full input.
 * Persists newly earned badges and returns them.
 */
export async function evaluateAndEarnBadges(
  userId: string,
  input: BadgeEvaluationInput
): Promise<BadgeDefinition[]> {
  if (!isSupabaseConfigured()) return [];

  const earnedIds = new Set((await getEarnedBadges(userId)).map((b) => b.badge_id));
  const newlyEarned = evaluateBadges(input, earnedIds);

  for (const badge of newlyEarned) {
    await earnBadge(userId, badge.id);
  }

  return newlyEarned;
}

/**
 * Compute which badges are earnable (not yet earned) given current stats.
 * Does NOT persist anything — useful for badge showcase UI.
 */
export async function getUnclaimedBadges(
  userId: string,
  input: BadgeEvaluationInput
): Promise<BadgeDefinition[]> {
  if (!isSupabaseConfigured()) return getAllBadgeDefinitions();

  const earnedIds = new Set((await getEarnedBadges(userId)).map((b) => b.badge_id));
  return getAllBadgeDefinitions().filter((b) => !earnedIds.has(b.id));
}

// ─── XP Operations ───────────────────────────────────────

/**
 * Add an XP entry to the log.
 */
export async function addXp(
  userId: string,
  amount: number,
  source: XpSource,
  metadata?: Record<string, unknown>
): Promise<void> {
  if (!isSupabaseConfigured()) return;

  const supabase = getSupabaseBrowserClient();
  const { error } = await supabase.from("xp_log").insert({
    user_id: userId,
    amount,
    source,
    metadata: metadata ?? {},
  });

  if (error) {
    console.error("[gamification-db] Failed to add XP:", error);
    throw error;
  }
}

/**
 * Get the total XP earned by a user.
 */
export async function getTotalXp(userId: string): Promise<number> {
  if (!isSupabaseConfigured()) return 0;

  const supabase = getSupabaseBrowserClient();
  const { data, error } = await supabase
    .from("xp_log")
    .select("amount")
    .eq("user_id", userId);

  if (error || !data) return 0;
  return data.reduce((sum, row) => sum + row.amount, 0);
}

/**
 * Get XP history for a user, most recent first.
 */
export async function getXpHistory(
  userId: string,
  limit: number = 50
): Promise<XpEntry[]> {
  if (!isSupabaseConfigured()) return [];

  const supabase = getSupabaseBrowserClient();
  const { data, error } = await supabase
    .from("xp_log")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error || !data) return [];
  return data as XpEntry[];
}
