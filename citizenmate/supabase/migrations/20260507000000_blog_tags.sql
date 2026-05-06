-- Add missing columns to existing blog_posts table (from flat to rich schema)
ALTER TABLE public.blog_posts 
  ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'draft',
  ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS reading_time INTEGER,
  ADD COLUMN IF NOT EXISTS sort_order INTEGER DEFAULT 0;

-- Create blog_tags table
CREATE TABLE IF NOT EXISTS public.blog_tags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(50) NOT NULL,
    slug VARCHAR(50) NOT NULL UNIQUE,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Create junction table for blog post tags
CREATE TABLE IF NOT EXISTS public.blog_post_tags (
    blog_post_id UUID NOT NULL REFERENCES public.blog_posts(id) ON DELETE CASCADE,
    tag_id UUID NOT NULL REFERENCES public.blog_tags(id) ON DELETE CASCADE,
    PRIMARY KEY (blog_post_id, tag_id)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_blog_tags_slug ON public.blog_tags (slug);
CREATE INDEX IF NOT EXISTS idx_blog_post_tags_post ON public.blog_post_tags (blog_post_id);
CREATE INDEX IF NOT EXISTS idx_blog_post_tags_tag ON public.blog_post_tags (tag_id);

-- Enable RLS
ALTER TABLE public.blog_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_post_tags ENABLE ROW LEVEL SECURITY;

-- RLS: Public read access
CREATE POLICY "Public can read blog tags" ON public.blog_tags
    FOR SELECT USING (true);

CREATE POLICY "Public can read blog_post_tags" ON public.blog_post_tags
    FOR SELECT USING (true);

-- RLS: Admin write access
CREATE POLICY "Admins can manage blog tags" ON public.blog_tags
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

CREATE POLICY "Admins can manage blog_post_tags" ON public.blog_post_tags
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- Grants for all roles
GRANT ALL ON TABLE public.blog_tags TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.blog_post_tags TO anon, authenticated, service_role;
