import { NextResponse } from 'next/server'
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { sendWelcomeEmail } from '@/lib/email'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  // if "next" is in param, use it as the redirect URL
  const next = searchParams.get('next') ?? '/dashboard'

  if (code) {
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
          set(name: string, value: string, options: CookieOptions) {
            cookieStore.set({ name, value, ...options })
          },
          remove(name: string, options: CookieOptions) {
            cookieStore.set({ name, value: '', ...options })
          },
        },
      }
    )
    
    // Exchange the auth code for a user session
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error && data.user) {
      // Check if this is a newly created user (within the last 60 seconds)
      const createdAt = new Date(data.user.created_at)
      const now = new Date()
      const isNewUser = now.getTime() - createdAt.getTime() < 60000

      if (isNewUser && data.user.email) {
        const name = data.user.user_metadata?.full_name || data.user.user_metadata?.name || undefined;
        // Await the email sending so Vercel doesn't kill the serverless function prematurely
        try {
          await sendWelcomeEmail(data.user.email, name);
        } catch (err) {
          console.error('[Auth Callback] Failed to send welcome email:', err);
        }
      }

      // Successful login, redirect to the desired page
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  // Failed login or missing code
  return NextResponse.redirect(`${origin}/?error=auth-callback-failed`)
}
