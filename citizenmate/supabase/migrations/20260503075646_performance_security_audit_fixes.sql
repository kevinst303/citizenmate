-- Revoke EXECUTE on public SECURITY DEFINER functions
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM public, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.is_admin() FROM public, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.process_referral_reward(uuid, uuid, integer, text) FROM public, anon, authenticated;

-- Drop unused indexes to improve write performance
DROP INDEX IF EXISTS public.idx_quiz_history_user_id;
DROP INDEX IF EXISTS public.idx_processed_webhook_events_processed_at;
DROP INDEX IF EXISTS public.idx_blog_posts_author_id;
DROP INDEX IF EXISTS public.idx_profiles_referred_by;
DROP INDEX IF EXISTS public.idx_referral_rewards_referee_id;

-- Consolidate multiple permissive policies for blog_posts
DROP POLICY IF EXISTS "Admins can manage blog posts" ON public.blog_posts;
DROP POLICY IF EXISTS "Public can read published blog posts" ON public.blog_posts;

CREATE POLICY "Consolidated SELECT for blog_posts" ON public.blog_posts
    FOR SELECT USING (published = true OR is_admin());

CREATE POLICY "Admins can insert blog_posts" ON public.blog_posts
    FOR INSERT WITH CHECK (is_admin());

CREATE POLICY "Admins can update blog_posts" ON public.blog_posts
    FOR UPDATE USING (is_admin());

CREATE POLICY "Admins can delete blog_posts" ON public.blog_posts
    FOR DELETE USING (is_admin());

-- Consolidate multiple permissive policies for profiles
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;

CREATE POLICY "Consolidated SELECT for profiles" ON public.profiles
    FOR SELECT USING (auth.uid() = id OR is_admin());
