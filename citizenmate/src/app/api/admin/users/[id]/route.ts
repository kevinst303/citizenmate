import { NextResponse } from "next/server";
import { verifyAdmin } from "@/lib/admin-auth";
import { createSupabaseAdminClient } from "@/lib/supabase-admin";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await verifyAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const supabase = createSupabaseAdminClient();

    const [profileRes, quizRes, referralRes] = await Promise.all([
      supabase.from("profiles").select("*").eq("id", id).single(),
      supabase
        .from("quiz_history")
        .select("id, score, total_questions, created_at", { count: "exact" })
        .eq("user_id", id),
      supabase
        .from("referral_rewards")
        .select("*", { count: "exact" })
        .or(`referrer_id.eq.${id},referee_id.eq.${id}`),
    ]);

    if (profileRes.error) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      profile: profileRes.data,
      quizSummary: {
        total: quizRes.count || 0,
        averageScore: quizRes.data?.length
          ? Math.round(
              quizRes.data.reduce((sum, q) => sum + (q.score || 0), 0) /
                quizRes.data.length
            )
          : 0,
        recentQuizzes: quizRes.data?.slice(0, 5) || [],
      },
      referralActivity: {
        total: referralRes.count || 0,
        items: referralRes.data?.slice(0, 10) || [],
      },
    });
  } catch (error) {
    console.error("[AdminUserDetail] GET error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
