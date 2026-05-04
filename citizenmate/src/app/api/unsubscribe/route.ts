import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("id");

  if (!userId) {
    return new NextResponse("Invalid or missing user ID.", { status: 400 });
  }

  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    process.env.SUPABASE_SERVICE_ROLE_KEY || ""
  );

  const { error } = await supabaseAdmin
    .from("profiles")
    .update({ unsubscribed_from_emails: true })
    .eq("id", userId);

  if (error) {
    console.error("[Unsubscribe] Failed to update profile:", error);
    return new NextResponse("An error occurred while processing your request. Please try again.", { status: 500 });
  }

  return new NextResponse(
    `<!DOCTYPE html>
    <html>
      <head>
        <title>Unsubscribed - CitizenMate</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; text-align: center; padding: 50px; color: #333; }
          h1 { color: #0d9488; }
          a { color: #0d9488; text-decoration: none; font-weight: bold; }
        </style>
      </head>
      <body>
        <h1>Successfully Unsubscribed</h1>
        <p>You have been unsubscribed from automated emails.</p>
        <p><a href="/">Return to Home</a></p>
      </body>
    </html>`,
    {
      status: 200,
      headers: { "Content-Type": "text/html" },
    }
  );
}
