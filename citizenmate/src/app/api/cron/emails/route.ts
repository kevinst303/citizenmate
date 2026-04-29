import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";
import { render } from "@react-email/render";
import InactivityEmail from "@/emails/inactivity";

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
    // 2. Find users inactive for more than 3 days but less than 4 days
    // to ensure we only send one email per user for the 3-day inactivity window
    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
    
    const fourDaysAgo = new Date();
    fourDaysAgo.setDate(fourDaysAgo.getDate() - 4);

    const { data: inactiveUsers, error } = await supabaseAdmin
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

    if (error) throw error;

    if (!inactiveUsers || inactiveUsers.length === 0) {
      return NextResponse.json({ message: "No inactive users found" });
    }

    // 3. Send emails
    const emailsToSend = await Promise.all(inactiveUsers.map(async (record: any) => {
      const user = record.profiles;
      const html = await render(InactivityEmail({ userName: user.display_name || "Mate" }));
      
      return {
        from: "CitizenMate <hello@citizenmate.com.au>",
        to: user.email,
        subject: "We miss you, mate! Let's get back to practice.",
        html,
      };
    }));

    const { data, error: sendError } = await resend.batch.send(emailsToSend);

    if (sendError) {
      console.error("[Cron Email] Resend error:", sendError);
      return NextResponse.json({ error: sendError }, { status: 500 });
    }

    return NextResponse.json({ success: true, count: emailsToSend.length, data });
  } catch (err) {
    console.error("[Cron Email] General error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
