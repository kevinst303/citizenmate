import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

export async function GET(request: Request) {
  const resend = new Resend(process.env.RESEND_API_KEY || "dummy");
  
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    process.env.SUPABASE_SERVICE_ROLE_KEY || ""
  );

  // 1. Verify cron secret to prevent unauthorized access
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://citizenmate.com.au';
    let emailsSent = 0;
    const batchEmails: any[] = [];

    // --- Inactivity Emails ---
    // 2. Find users inactive for more than 3 days but less than 4 days
    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
    
    const fourDaysAgo = new Date();
    fourDaysAgo.setDate(fourDaysAgo.getDate() - 4);

    const { data: inactiveUsers, error: inactiveError } = await supabaseAdmin
      .from("study_progress")
      .select(`
        last_studied_at,
        profiles!inner (
          id,
          email,
          display_name,
          unsubscribed_from_emails
        )
      `)
      .lt("last_studied_at", threeDaysAgo.toISOString())
      .gt("last_studied_at", fourDaysAgo.toISOString())
      .eq("profiles.unsubscribed_from_emails", false);

    if (inactiveError) throw inactiveError;

    if (inactiveUsers && inactiveUsers.length > 0) {
      for (const record of inactiveUsers) {
        const user = Array.isArray(record.profiles) ? record.profiles[0] : record.profiles;
        if (!user || !user.email) continue;
        batchEmails.push({
          from: "CitizenMate <hello@citizenmate.com.au>",
          to: user.email,
          subject: "We miss you, mate! Let's get back to practice.",
          template: {
            id: process.env.RESEND_TEMPLATE_INACTIVITY || '',
            variables: {
              userName: user.display_name || "Mate",
              unsubscribeUrl: `${siteUrl}/api/unsubscribe?id=${user.id}`
            }
          }
        });
      }
    }

    // --- Milestone Emails ---
    // Find users who completed a quiz in the last 24h
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    const { data: recentQuizzes, error: quizError } = await supabaseAdmin
      .from("quiz_history")
      .select("user_id")
      .gt("completed_at", yesterday.toISOString());

    if (!quizError && recentQuizzes && recentQuizzes.length > 0) {
      const activeUserIds = [...new Set(recentQuizzes.map(q => q.user_id))];

      for (const userId of activeUserIds) {
        const { data: userQuizzes } = await supabaseAdmin
          .from("quiz_history")
          .select("total")
          .eq("user_id", userId);

        if (userQuizzes) {
          const totalQuestions = userQuizzes.reduce((sum, q) => sum + (q.total || 0), 0);
          
          // Heuristic: If they just crossed 100 questions (between 100 and 119)
          if (totalQuestions >= 100 && totalQuestions < 120) {
            const { data: profile } = await supabaseAdmin
              .from("profiles")
              .select("email, display_name, unsubscribed_from_emails")
              .eq("id", userId)
              .single();

            if (profile && !profile.unsubscribed_from_emails && profile.email) {
              batchEmails.push({
                from: "CitizenMate <hello@citizenmate.com.au>",
                to: profile.email,
                subject: `Incredible work! You've answered ${totalQuestions} questions! 🎉`,
                template: {
                  id: process.env.RESEND_TEMPLATE_MILESTONE || '',
                  variables: {
                    userName: profile.display_name || "Mate", 
                    questionsCount: totalQuestions,
                    unsubscribeUrl: `${siteUrl}/api/unsubscribe?id=${userId}`
                  }
                }
              });
            }
          }
        }
      }
    }

    // --- Expiry Warning Emails ---
    // Find users whose premium expires in exactly 3 days
    const threeDaysFromNow = new Date();
    threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);
    
    const fourDaysFromNow = new Date();
    fourDaysFromNow.setDate(fourDaysFromNow.getDate() + 4);

    const { data: expiringUsers, error: expiringError } = await supabaseAdmin
      .from("profiles")
      .select("id, email, display_name, premium_expires_at, unsubscribed_from_emails")
      .eq("is_premium", true)
      .eq("unsubscribed_from_emails", false)
      .gte("premium_expires_at", threeDaysFromNow.toISOString())
      .lt("premium_expires_at", fourDaysFromNow.toISOString());

    if (!expiringError && expiringUsers && expiringUsers.length > 0) {
      for (const user of expiringUsers) {
        if (!user.email) continue;
        const daysLeft = 3;
        batchEmails.push({
          from: "CitizenMate <hello@citizenmate.com.au>",
          to: user.email,
          subject: `⏰ Your Sprint Pass expires in ${daysLeft} days — CitizenMate`,
          template: {
            id: process.env.RESEND_TEMPLATE_EXPIRY_WARNING || '',
            variables: {
              daysLeft,
              userName: user.display_name || "Mate",
              unsubscribeUrl: `${siteUrl}/api/unsubscribe?id=${user.id}`
            }
          }
        });
      }
    }

    // Filter out missing template IDs in development just in case
    const validBatchEmails = batchEmails.filter(e => e.template?.id);

    if (validBatchEmails.length > 0) {
      const { data, error: sendError } = await resend.batch.send(validBatchEmails);
      if (sendError) {
        console.error("[Cron Email] Resend error:", sendError);
        return NextResponse.json({ error: sendError }, { status: 500 });
      }
      emailsSent = validBatchEmails.length;
    } else if (batchEmails.length > 0) {
       console.warn("[Cron Email] Warning: Template IDs missing. No emails sent.");
    }

    return NextResponse.json({ success: true, count: emailsSent });
  } catch (err) {
    console.error("[Cron Email] General error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
