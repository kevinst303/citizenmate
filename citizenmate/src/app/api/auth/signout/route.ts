import { NextResponse } from 'next/server';
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { authLimiter } from '@/lib/rate-limit';

export async function POST(request: Request) {
  // ── Rate limit: 10 requests per 15 min per IP ──
  const ip = request.headers.get('x-forwarded-for') ?? '127.0.0.1';
  const { success } = await authLimiter.limit(ip);
  if (!success) {
    return NextResponse.json({ error: 'Too many sign-out attempts. Please wait a moment.' }, { status: 429 });
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

  // Check if we have a session
  const { data: { session } } = await supabase.auth.getSession();
  
  if (session) {
    await supabase.auth.signOut();
  }

  return NextResponse.json({ success: true });
}
