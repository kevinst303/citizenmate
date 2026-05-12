// ===== CitizenMate: Streak Freeze API Route =====
// GET  /api/gamification/freeze  — returns current freeze state
// POST /api/gamification/freeze  — actions: "use" (consume a freeze to protect streak), "status" (check freeze info)

import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { MAX_STREAK_FREEZES } from "@/lib/gamification-engine";

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

    const { data: streak, error } = await supabase
      .from("user_streaks")
      .select("current_streak, streak_freeze_available, frozen_days, last_freeze_used_date, last_activity_date")
      .eq("user_id", user.id)
      .single();

    if (error && error.code !== "PGRST116") {
      console.error("[freeze] Fetch error:", error);
      return NextResponse.json({ error: "Failed to fetch freeze state" }, { status: 500 });
    }

    if (!streak) {
      return NextResponse.json({
        streak_freeze_available: 0,
        frozen_days: 0,
        max_freezes: MAX_STREAK_FREEZES,
        current_streak: 0,
      });
    }

    return NextResponse.json({
      streak_freeze_available: streak.streak_freeze_available ?? 0,
      frozen_days: streak.frozen_days ?? 0,
      last_freeze_used_date: streak.last_freeze_used_date ?? null,
      last_activity_date: streak.last_activity_date,
      max_freezes: MAX_STREAK_FREEZES,
      current_streak: streak.current_streak,
    });
  } catch (error) {
    console.error("[freeze] Unexpected error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const supabase = await createSupabaseServerClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = (await req.json().catch(() => ({}))) as { action?: string };
    const action = body.action ?? "status";

    if (action === "status") {
      // Redirect to GET logic
      const { data: streak } = await supabase
        .from("user_streaks")
        .select("current_streak, streak_freeze_available, frozen_days, last_freeze_used_date, last_activity_date")
        .eq("user_id", user.id)
        .single();

      return NextResponse.json({
        streak_freeze_available: streak?.streak_freeze_available ?? 0,
        frozen_days: streak?.frozen_days ?? 0,
        last_freeze_used_date: streak?.last_freeze_used_date ?? null,
        max_freezes: MAX_STREAK_FREEZES,
        current_streak: streak?.current_streak ?? 0,
      });
    }

    if (action === "use") {
      // Manually consume a freeze token (e.g., user activates it)
      const { data: streak, error: fetchError } = await supabase
        .from("user_streaks")
        .select("current_streak, streak_freeze_available, frozen_days")
        .eq("user_id", user.id)
        .single();

      if (fetchError) {
        console.error("[freeze] Fetch error:", fetchError);
        return NextResponse.json({ error: "Failed to fetch streak" }, { status: 500 });
      }

      if (!streak || (streak.streak_freeze_available ?? 0) <= 0) {
        return NextResponse.json(
          { error: "No freeze tokens available", streak_freeze_available: 0 },
          { status: 400 }
        );
      }

      const now = new Date().toISOString();
      const { error: updateError } = await supabase
        .from("user_streaks")
        .update({
          streak_freeze_available: (streak.streak_freeze_available ?? 1) - 1,
          frozen_days: (streak.frozen_days ?? 0) + 1,
          last_freeze_used_date: now,
          updated_at: now,
        })
        .eq("user_id", user.id);

      if (updateError) {
        console.error("[freeze] Update error:", updateError);
        return NextResponse.json({ error: "Failed to use freeze" }, { status: 500 });
      }

      return NextResponse.json({
        success: true,
        message: "Freeze token consumed",
        streak_freeze_available: (streak.streak_freeze_available ?? 1) - 1,
        frozen_days: (streak.frozen_days ?? 0) + 1,
      });
    }

    return NextResponse.json({ error: `Unknown action: ${action}` }, { status: 400 });
  } catch (error) {
    console.error("[freeze] Unexpected error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
