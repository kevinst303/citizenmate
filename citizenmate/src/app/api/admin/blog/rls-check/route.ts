import { NextResponse } from 'next/server';
import { verifyAdmin } from '@/lib/admin-auth';
import { createSupabaseServerClient } from '@/lib/supabase-server';

export async function GET() {
  const admin = await verifyAdmin();
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const supabase = await createSupabaseServerClient();

  const results: Record<string, unknown> = {};

  // Check if RLS is enabled
  const { data: rlsInfo, error: rlsError } = await supabase
    .rpc('check_blog_rls')
    .select('*')
    .maybeSingle();

  results.rls_check = { data: rlsInfo, error: rlsError?.message };

  // Try SELECT
  const { data: posts, error: selectError } = await supabase
    .from('blog_posts')
    .select('*', { count: 'exact', head: true });

  results.select = { count: posts, error: selectError?.message };

  // Try SELECT with admin user context
  const { data: adminPosts, error: adminError } = await supabase
    .from('blog_posts')
    .select('*', { count: 'exact', head: true });

  results.adminSelect = { count: adminPosts, error: adminError?.message };

  // Check if is_admin function works
  const { data: isAdmin } = await supabase.rpc('is_admin');

  results.isAdminRpc = isAdmin;

  return NextResponse.json(results);
}
