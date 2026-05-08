import { NextResponse } from 'next/server'
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { sendWelcomeEmail } from '@/lib/email'

const ALLOWED_REDIRECTS = new Set([
  '/dashboard',
  '/practice',
  '/study',
  '/onboarding',
  '/admin',
  '/blog',
]);

function isValidRedirect(path: string): boolean {
  if (path.startsWith('//') || path.includes('\\')) return false;
  if (path.includes('@')) return false;
  if (path.startsWith('/')) {
    const base = path.split('?')[0].split('#')[0];
    if (ALLOWED_REDIRECTS.has(base)) return true;
    if (base.startsWith('/dashboard') || base.startsWith('/practice')) return true;
    if (base.startsWith('/study') || base.startsWith('/blog')) return true;
    if (base.startsWith('/admin')) return true;
  }
  return false;
}

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const nextRaw = searchParams.get('next') ?? '/dashboard'
  const next = isValidRedirect(nextRaw) ? nextRaw : '/dashboard'

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
    
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error && data.user) {
      const createdAt = new Date(data.user.created_at)
      const now = new Date()
      const isNewUser = now.getTime() - createdAt.getTime() < 60000

      if (isNewUser && data.user.email) {
        const name = data.user.user_metadata?.full_name || data.user.user_metadata?.name || undefined;
        try {
          await sendWelcomeEmail(data.user.email, name);
        } catch (err) {
          console.error('[Auth Callback] Failed to send welcome email:', err);
        }
      }

      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  return NextResponse.redirect(`${origin}/?error=auth-callback-failed`)
}
