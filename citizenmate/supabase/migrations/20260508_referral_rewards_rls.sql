-- Referral rewards RLS policies
-- Table already has RLS enabled with SELECT policy.
-- All mutations go through service_role or SECURITY DEFINER functions.
-- Explicitly deny direct INSERT/UPDATE/DELETE from anon/authenticated roles.

-- 1. INSERT: only via service_role / SECURITY DEFINER functions
DO $$ BEGIN
  CREATE POLICY "Service role only - insert"
    ON public.referral_rewards
    FOR INSERT
    WITH CHECK (false);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- 2. UPDATE: only via service_role / SECURITY DEFINER functions
DO $$ BEGIN
  CREATE POLICY "Service role only - update"
    ON public.referral_rewards
    FOR UPDATE
    USING (false);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- 3. DELETE: never allowed
DO $$ BEGIN
  CREATE POLICY "Service role only - delete"
    ON public.referral_rewards
    FOR DELETE
    USING (false);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
