import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import webpush from "web-push";

// Ensure VAPID details are set in the environment variables
const publicVapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || "";
const privateVapidKey = process.env.VAPID_PRIVATE_KEY || "";
const mailto = process.env.VAPID_MAILTO || "mailto:admin@citizenmate.com";

if (publicVapidKey && privateVapidKey) {
  webpush.setVapidDetails(mailto, publicVapidKey, privateVapidKey);
}

export async function POST(request: Request) {
  try {
    // Basic protection: simple secret for triggering notifications
    const authHeader = request.headers.get("Authorization");
    const secret = process.env.NOTIFICATION_SECRET;
    if (secret && authHeader !== `Bearer ${secret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { userId, title, message, url } = body;

    if (!userId || !title || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (!publicVapidKey || !privateVapidKey) {
      return NextResponse.json({ error: "VAPID keys not configured" }, { status: 500 });
    }

    const supabase = await createSupabaseServerClient();

    // Fetch all active subscriptions for the user
    const { data: subscriptions, error } = await supabase
      .from("push_subscriptions")
      .select("*")
      .eq("user_id", userId);

    if (error) {
      console.error("[push] Database error fetching subscriptions:", error);
      return NextResponse.json({ error: "Database error" }, { status: 500 });
    }

    if (!subscriptions || subscriptions.length === 0) {
      return NextResponse.json({ success: true, message: "No subscriptions found for user" });
    }

    const payload = JSON.stringify({
      title,
      body: message,
      url: url || "/",
    });

    const sendPromises = subscriptions.map(async (sub) => {
      const pushSubscription = {
        endpoint: sub.endpoint,
        keys: {
          p256dh: sub.p256dh,
          auth: sub.auth,
        },
      };

      try {
        await webpush.sendNotification(pushSubscription, payload);
      } catch (err: any) {
        // HTTP 410 or 404 indicates the subscription is no longer valid
        if (err.statusCode === 410 || err.statusCode === 404) {
          console.log("[push] Subscription expired, removing:", sub.endpoint);
          await supabase.from("push_subscriptions").delete().eq("endpoint", sub.endpoint);
        } else {
          console.error("[push] Error sending notification:", err);
        }
      }
    });

    await Promise.all(sendPromises);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[push] Internal error sending notification:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
