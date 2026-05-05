import { NextResponse } from "next/server";
import { verifyAdmin } from "@/lib/admin-auth";
import { createSupabaseAdminClient } from "@/lib/supabase-admin";

export async function GET(req: Request) {
  const admin = await verifyAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const days = parseInt(searchParams.get("days") || "30");
    const now = new Date();
    const currentStart = new Date(now);
    currentStart.setDate(currentStart.getDate() - days);
    const previousStart = new Date(currentStart);
    previousStart.setDate(previousStart.getDate() - days);

    const supabase = createSupabaseAdminClient();

    // Current period counts
    const [totalUsers, usersCurrent, usersPrevious] = await Promise.all([
      supabase.from("profiles").select("*", { count: "exact", head: true }),
      supabase
        .from("profiles")
        .select("*", { count: "exact", head: true })
        .gte("created_at", currentStart.toISOString()),
      supabase
        .from("profiles")
        .select("*", { count: "exact", head: true })
        .gte("created_at", previousStart.toISOString())
        .lt("created_at", currentStart.toISOString()),
    ]);

    const [subsCurrent, subsPrevious] = await Promise.all([
      supabase
        .from("profiles")
        .select("*", { count: "exact", head: true })
        .or("is_premium.eq.true,tier.in.(pro,premium,sprint_pass)"),
      supabase
        .from("profiles")
        .select("*")
        .or("is_premium.eq.true,tier.in.(pro,premium,sprint_pass)")
        .lt("created_at", currentStart.toISOString()),
    ]);

    const [quizzesCurrent, quizzesPrevious] = await Promise.all([
      supabase
        .from("quiz_history")
        .select("*", { count: "exact", head: true })
        .gte("created_at", currentStart.toISOString()),
      supabase
        .from("quiz_history")
        .select("*", { count: "exact", head: true })
        .gte("created_at", previousStart.toISOString())
        .lt("created_at", currentStart.toISOString()),
    ]);

    const [postsCurrent, postsPrevious] = await Promise.all([
      supabase
        .from("blog_posts")
        .select("*", { count: "exact", head: true })
        .gte("created_at", currentStart.toISOString()),
      supabase
        .from("blog_posts")
        .select("*", { count: "exact", head: true })
        .gte("created_at", previousStart.toISOString())
        .lt("created_at", currentStart.toISOString()),
    ]);

    const calcTrend = (current: number | null, previous: number | null) => {
      const prev = previous || 0;
      if (prev === 0) return current && current > 0 ? 100 : 0;
      return Math.round(((current || 0) - prev) / prev * 100);
    };

    // User growth per day
    const userGrowth: { date: string; count: number }[] = [];
    const userMap = new Map<string, number>();
    const { data: allUsers } = await supabase
      .from("profiles")
      .select("created_at")
      .gte("created_at", currentStart.toISOString())
      .order("created_at", { ascending: true });
    allUsers?.forEach((u) => {
      const d = new Date(u.created_at).toISOString().split("T")[0];
      userMap.set(d, (userMap.get(d) || 0) + 1);
    });
    for (let i = 0; i < days; i++) {
      const d = new Date(currentStart);
      d.setDate(d.getDate() + i + 1);
      const key = d.toISOString().split("T")[0];
      userGrowth.push({ date: key, count: userMap.get(key) || 0 });
    }

    // Quiz completions per day
    const quizData: { date: string; count: number }[] = [];
    const quizMap = new Map<string, number>();
    const { data: allQuizzes } = await supabase
      .from("quiz_history")
      .select("created_at")
      .gte("created_at", currentStart.toISOString())
      .order("created_at", { ascending: true });
    allQuizzes?.forEach((q) => {
      const d = new Date(q.created_at).toISOString().split("T")[0];
      quizMap.set(d, (quizMap.get(d) || 0) + 1);
    });
    for (let i = 0; i < days; i++) {
      const d = new Date(currentStart);
      d.setDate(d.getDate() + i + 1);
      const key = d.toISOString().split("T")[0];
      quizData.push({ date: key, count: quizMap.get(key) || 0 });
    }

    // Revenue approximation (users who became premium per day)
    const revenueData: { date: string; value: number }[] = [];
    const premiumMap = new Map<string, number>();
    const { data: allPremium } = await supabase
      .from("profiles")
      .select("premium_expires_at")
      .not("premium_expires_at", "is", null)
      .gte("premium_expires_at", currentStart.toISOString());
    allPremium?.forEach((p) => {
      if (p.premium_expires_at) {
        const d = new Date(p.premium_expires_at).toISOString().split("T")[0];
        premiumMap.set(d, (premiumMap.get(d) || 0) + 1);
      }
    });
    for (let i = 0; i < days; i++) {
      const d = new Date(currentStart);
      d.setDate(d.getDate() + i + 1);
      const key = d.toISOString().split("T")[0];
      revenueData.push({ date: key, value: (premiumMap.get(key) || 0) * 29 });
    }

    const subsCount = subsCurrent.count || 0;
    const subsCountPrev = Array.isArray(subsPrevious.data)
      ? subsPrevious.data.length
      : 0;

    return NextResponse.json({
      kpis: {
        totalUsers: totalUsers.count || 0,
        activeSubs: subsCount,
        totalQuizzes: quizzesCurrent.count || 0,
        totalPosts: postsCurrent.count || 0,
        trends: {
          users: calcTrend(usersCurrent.count, usersPrevious.count),
          subs: calcTrend(subsCount, subsCountPrev),
          quizzes: calcTrend(quizzesCurrent.count, quizzesPrevious.count),
          posts: calcTrend(postsCurrent.count, postsPrevious.count),
        },
      },
      charts: {
        userGrowth,
        quizCompletions: quizData,
        revenue: revenueData,
      },
    });
  } catch (error) {
    console.error("[AdminAnalytics] GET error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
