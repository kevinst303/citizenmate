import { createSupabaseServerClient } from '@/lib/supabase-server';

/**
 * Verify the current user is an admin.
 * Returns the user object if admin, null otherwise.
 */
export async function verifyAdmin() {
  const supabase = await createSupabaseServerClient();
  let { data: { user }, error: authError } = await supabase.auth.getUser();

  // Fallback: if getUser() fails (token refresh contention), read session from cookies
  if ((authError || !user)) {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) user = session.user;
  }

  if (!user) return null;

  const { data: profile } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', user.id)
    .single();

  if (!profile?.is_admin) return null;

  return user;
}
