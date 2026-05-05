-- Blog posts RLS policies
-- Table already has RLS enabled; this adds the access control rules.

-- 1. SELECT: admins see all posts, public sees only published
CREATE POLICY "Admins can view all blog posts"
  ON public.blog_posts
  FOR SELECT
  USING (public.is_admin());

CREATE POLICY "Public can view published blog posts"
  ON public.blog_posts
  FOR SELECT
  USING (published = TRUE);

-- 2. INSERT: only admins
CREATE POLICY "Admins can create blog posts"
  ON public.blog_posts
  FOR INSERT
  WITH CHECK (public.is_admin());

-- 3. UPDATE: only admins
CREATE POLICY "Admins can update blog posts"
  ON public.blog_posts
  FOR UPDATE
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- 4. DELETE: only admins
CREATE POLICY "Admins can delete blog posts"
  ON public.blog_posts
  FOR DELETE
  USING (public.is_admin());
