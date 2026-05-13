import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * POST /api/sync
 *
 * Accepts quiz attempt + SRS data from the Background Sync queue.
 * Called by the service worker (Serwist BackgroundSyncPlugin) after
 * network reconnection. Data originates from IndexedDB while offline.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type } = body;

    if (!type) {
      return NextResponse.json(
        { error: "Missing sync type" },
        { status: 400 }
      );
    }

    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll() {
            // Read-only — we don't modify auth cookies from sync
          },
        },
      }
    );

    // Authenticate via Authorization header (passed from client-side fetch)
    const authHeader = request.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Missing or invalid Authorization header" },
        { status: 401 }
      );
    }

    // Validate the session
    const token = authHeader.slice(7);
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const userId = user.id;

    switch (type) {
      case "quiz-history": {
        const { entries } = body as {
          entries: Array<{
            testId: string;
            score: number;
            total: number;
            valuesCorrect: number;
            valuesTotal: number;
            passed: boolean;
            topicBreakdown?: Record<string, { correct: number; total: number }>;
            completedAt: string;
          }>;
        };

        if (!Array.isArray(entries) || entries.length === 0) {
          return NextResponse.json(
            { error: "No entries provided" },
            { status: 400 }
          );
        }

        // Deduplicate by completed_at
        const { data: existing } = await supabase
          .from("quiz_history")
          .select("completed_at")
          .eq("user_id", userId);

        const existingDates = new Set(
          (existing ?? []).map((r: { completed_at: string }) => r.completed_at)
        );

        const newEntries = entries
          .filter((e) => !existingDates.has(e.completedAt))
          .map((e) => ({
            user_id: userId,
            test_id: e.testId,
            score: e.score,
            total: e.total,
            values_correct: e.valuesCorrect,
            values_total: e.valuesTotal,
            passed: e.passed,
            topic_breakdown: e.topicBreakdown ?? null,
            completed_at: e.completedAt,
          }));

        if (newEntries.length > 0) {
          const { error: insertError } = await supabase
            .from("quiz_history")
            .insert(newEntries);

          if (insertError) {
            console.error("[sync/api] Failed to insert quiz history:", insertError);
            return NextResponse.json(
              { error: "Failed to insert quiz history" },
              { status: 500 }
            );
          }
        }

        return NextResponse.json({
          synced: newEntries.length,
          skipped: entries.length - newEntries.length,
        });
      }

      case "srs-data": {
        const { performances, lastUpdatedAt } = body as {
          performances: Record<string, unknown>;
          lastUpdatedAt: string;
        };

        if (!performances || typeof performances !== "object") {
          return NextResponse.json(
            { error: "Invalid SRS data" },
            { status: 400 }
          );
        }

        const { error: srsError } = await supabase
          .from("srs_performance")
          .upsert(
            {
              user_id: userId,
              performances,
              last_updated_at: lastUpdatedAt,
            },
            { onConflict: "user_id" }
          );

        if (srsError) {
          console.error("[sync/api] Failed to sync SRS data:", srsError);
          return NextResponse.json(
            { error: "Failed to sync SRS data" },
            { status: 500 }
          );
        }

        return NextResponse.json({ synced: true });
      }

      default:
        return NextResponse.json(
          { error: `Unknown sync type: ${type}` },
          { status: 400 }
        );
    }
  } catch (err) {
    console.error("[sync/api] Sync error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
