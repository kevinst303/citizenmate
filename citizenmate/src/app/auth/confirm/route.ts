import { NextResponse } from 'next/server';
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { sendWelcomeEmail } from '@/lib/email';

/**
 * GET /auth/confirm
 *
 * Handles Supabase email verification links (signup confirmation, password reset, etc.).
 * Exchanges the token_hash for a verified session and redirects to the dashboard.
 *
 * Supabase redirects here by default after email verification.
 * The path is set via emailRedirectTo in signUp() options.
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const tokenHash = searchParams.get('token_hash');
  const type = searchParams.get('type') || 'email';

  if (!tokenHash) {
    // No token — redirect home with error
    return NextResponse.redirect(`${origin}/?error=confirm-no-token`);
  }

  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          cookieStore.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          cookieStore.set({ name, value: '', ...options });
        },
      },
    }
  );

  const { data, error } = await supabase.auth.verifyOtp({
    type: type as 'email' | 'recovery' | 'invite',
    token_hash: tokenHash,
  });

  if (error || !data.user) {
    console.error('[Auth Confirm] Verification failed:', error?.message);
    return NextResponse.redirect(`${origin}/?error=confirm-failed`);
  }

  // Send welcome email for brand-new users (created within last 60 seconds)
  const createdAt = new Date(data.user.created_at);
  const now = new Date();
  const isNewUser = now.getTime() - createdAt.getTime() < 60_000;

  if (isNewUser && data.user.email) {
    const name =
      data.user.user_metadata?.full_name ||
      data.user.user_metadata?.name ||
      undefined;
    try {
      await sendWelcomeEmail(data.user.email, name);
    } catch (err) {
      console.error('[Auth Confirm] Failed to send welcome email:', err);
    }
  }

  // Success — redirect to dashboard
  return NextResponse.redirect(`${origin}/dashboard`);
}
