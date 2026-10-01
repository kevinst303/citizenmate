-- ===== Lock down profile entitlement columns =====
--
-- The previous policy ("Users can update own profile", USING auth.uid() = id,
-- no column restriction) allowed any signed-in user to self-grant premium:
--   supabase.from('profiles').update({ is_premium: true, tier: 'premium', ... })
--
-- Fix strategy: keep row-level ownership, restrict writes to COLUMN level so
-- entitlement fields can only be changed by the service role (Stripe webhook,
-- admin routes, cron). Browser/authenticated code only ever writes:
--   test_date, study_language (src/lib/sync.ts)
--   xp, level                 (src/app/api/gamification/progression)
--
-- Every other profiles writer already uses createSupabaseAdminClient()
-- (service role, bypasses RLS): stripe webhook, cron emails, unsubscribe,
-- admin users, referral rewards.
--
-- Profile creation is handled by the SECURITY DEFINER trigger
-- handle_new_user(), which runs as the table owner and does not need the
-- INSERT policy, so browser INSERT is revoked entirely.

-- ── 1. Replace the blanket own-profile UPDATE policy ──
-- Row scoping stays the same (own row only); the real restriction is the
-- column-level GRANT below. The policy name changes so re-running the old
-- schema.sql cannot silently restore the unsafe version.
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;

CREATE POLICY "Users can update own profile (non-entitlement columns)"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- ── 2. Column-level UPDATE grants for authenticated ──
-- Supabase grants ALL on public tables to authenticated by default, so a
-- REVOKE is required before the narrow GRANT takes effect.
REVOKE UPDATE ON public.profiles FROM authenticated;
GRANT UPDATE (test_date, study_language, xp, level)
  ON public.profiles TO authenticated;

-- ── 3. No browser INSERT path exists (signup trigger creates profiles) ──
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
REVOKE INSERT ON public.profiles FROM authenticated;
