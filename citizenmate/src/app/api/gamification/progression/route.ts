// ===== CitizenMate: Progression API Route =====
// GET  /api/gamification/progression — returns user level, XP, and progression stats
// Also syncs XP from xp_log into profiles.xp for fast reads

import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { calculateLevel, getLevelTitle } from "@/lib/gamification-engine";

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

    // Fetch total XP from xp_log
    const { data: xpRows, error: xpError } = await supabase
      .from("xp_log")
      .select("amount")
      .eq("user_id", userId);

    if (xpError) {
      console.error("[progression] XP fetch error:", xpError);
      return NextResponse.json({ error: "Failed to fetch XP" }, { status: 500 });
    }

    const totalXp = (xpRows ?? []).reduce((sum, r) => sum + r.amount, 0);

    // Calculate level from XP
    const levelInfo = calculateLevel(totalXp);
    const levelTitle = getLevelTitle(levelInfo.level);

    // Sync into profiles table for fast reads
    await supabase
      .from("profiles")
      .update({ xp: totalXp, level: levelInfo.level })
      .eq("id", userId);

    // Fetch recent XP history for progression breakdown
    const { data: recentXp } = await supabase
      .from("xp_log")
      .select("amount, source, created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(20);

    // Group XP by source for breakdown
    const xpBySource: Record<string, number> = {};
    for (const row of xpRows ?? []) {
      // Need to fetch source too — use recentXp which has source
    }
    for (const row of recentXp ?? []) {
      xpBySource[row.source] = (xpBySource[row.source] ?? 0) + row.amount;
    }

    return NextResponse.json({
      totalXp,
      ...levelInfo,
      levelTitle,
      recentActivity: (recentXp ?? []).map((r) => ({
        amount: r.amount,
        source: r.source,
        createdAt: r.created_at,
      })),
      xpBySource,
    });
  } catch (error) {
    console.error("[progression] Unexpected error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
