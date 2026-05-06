import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function GET() {
  const results: Record<string, unknown> = {};

  try {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { cookies: { getAll: () => cookieStore.getAll(), setAll: () => {} } }
    );

    // 1. Auth check
    try {
      const { data: { user }, error: userErr } = await supabase.auth.getUser();
      results.current_user_id = user?.id ?? null;
      results.auth_error = userErr?.message ?? null;

      if (!user) {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          results.current_user_id = session.user.id;
          results.auth_note = 'fell back to getSession()';
        }
      }
    } catch (e: unknown) {
      results.getUser_exception = (e as Error).message;
    }

    results.auth_cookies = cookieStore.getAll()
      .filter((c: { name: string }) => c.name.startsWith('sb-'))
      .map((c: { name: string }) => c.name);

    const uid = results.current_user_id as string | null;

    // 2. is_admin RPC
    try {
      const { data, error: rpcErr } = await supabase.rpc('is_admin').maybeSingle();
      results.is_admin_rpc = data;
      results.is_admin_rpc_error = rpcErr?.message ?? null;
    } catch (e: unknown) {
      results.is_admin_rpc_exception = (e as Error).message;
    }

    // 3. Profile
    try {
      const { data: profile, error: profErr } = await supabase
        .from('profiles')
        .select('is_admin, email, tier')
        .eq('id', uid ?? '00000000-0000-0000-0000-000000000000')
        .maybeSingle();
      results.profile = profile ?? null;
      results.profile_error = profErr?.message ?? null;
    } catch (e: unknown) {
      results.profile_exception = (e as Error).message;
    }

    // 4. Blog posts count (head request)
    try {
      const { count, error: cntErr } = await supabase
        .from('blog_posts')
        .select('*', { count: 'exact', head: true });
      results.blog_posts_count = count ?? 0;
      results.blog_posts_error = cntErr?.message ?? null;
    } catch (e: unknown) {
      results.blog_posts_exception = (e as Error).message;
    }

    // 5. Check if is_admin RPC is callable via raw SQL
    try {
      const { data: sqlResult, error: sqlErr } = await supabase.rpc('is_admin');
      results.raw_is_admin = sqlResult;
      results.raw_is_admin_error = sqlErr?.message ?? null;
    } catch (e: unknown) {
      results.raw_is_admin_exception = (e as Error).message;
    }

    // 6. Check RLS policies on blog_posts
    try {
      const { data: policies, error: polErr } = await supabase
        .from('pg_policies')
        .select('policyname, permissive, cmd, qual, with_check')
        .eq('tablename', 'blog_posts');
      results.blog_rls_policies = policies ?? [];
      results.blog_rls_policies_error = polErr?.message ?? null;
    } catch (e: unknown) {
      results.blog_rls_policies_exception = (e as Error).message;
    }

    // 7. Try getSession() to confirm session is available
    try {
      const { data: { session } } = await supabase.auth.getSession();
      results.has_session = !!session;
      results.session_user_id = session?.user?.id ?? null;
    } catch (e: unknown) {
      results.session_exception = (e as Error).message;
    }

    return NextResponse.json(results);
  } catch (e: unknown) {
    return NextResponse.json({ fatal: (e as Error).message }, { status: 500 });
  }
}
