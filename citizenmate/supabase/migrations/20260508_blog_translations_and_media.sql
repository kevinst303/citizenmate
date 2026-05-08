-- Blog translations and media tables
-- These tables support the multilingual blog system.

-- 1. Locales reference table (required for blog_translations FK)
CREATE TABLE IF NOT EXISTS public.locales (
  code VARCHAR(5) PRIMARY KEY,
  name TEXT NOT NULL,
  native_name TEXT,
  is_active BOOLEAN DEFAULT TRUE
);

-- Seed default locales
INSERT INTO public.locales (code, name, native_name) VALUES
  ('en', 'English', 'English'),
  ('es', 'Spanish', 'Español'),
  ('hi', 'Hindi', 'हिन्दी'),
  ('zh', 'Chinese', '中文'),
  ('ar', 'Arabic', 'العربية'),
  ('vi', 'Vietnamese', 'Tiếng Việt')
ON CONFLICT (code) DO NOTHING;

-- 2. Blog translations table
CREATE TABLE IF NOT EXISTS public.blog_translations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  blog_post_id UUID REFERENCES public.blog_posts(id) ON DELETE CASCADE NOT NULL,
  locale VARCHAR(5) REFERENCES public.locales(code) NOT NULL,
  title VARCHAR(200) NOT NULL,
  slug VARCHAR(200) NOT NULL,
  excerpt TEXT,
  content TEXT,
  seo_title VARCHAR(70),
  seo_description VARCHAR(200),
  seo_keywords TEXT,
  og_image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(blog_post_id, locale),
  UNIQUE(locale, slug)
);

CREATE INDEX IF NOT EXISTS idx_blog_trans_locale ON public.blog_translations (locale);
CREATE INDEX IF NOT EXISTS idx_blog_trans_post ON public.blog_translations (blog_post_id);
CREATE INDEX IF NOT EXISTS idx_blog_trans_slug ON public.blog_translations (locale, slug);

-- 3. Blog media table
CREATE TABLE IF NOT EXISTS public.blog_media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  blog_post_id UUID REFERENCES public.blog_posts(id) ON DELETE CASCADE NOT NULL,
  url TEXT NOT NULL,
  alt_text VARCHAR(200),
  type VARCHAR(20) DEFAULT 'image',
  is_featured BOOLEAN DEFAULT FALSE,
  sort_order INTEGER DEFAULT 0,
  caption TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_blog_media_post ON public.blog_media (blog_post_id);
CREATE INDEX IF NOT EXISTS idx_blog_media_featured ON public.blog_media (blog_post_id, is_featured)
  WHERE is_featured = true;

-- 4. RLS: blog_translations
ALTER TABLE public.blog_translations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read translations of published posts"
  ON public.blog_translations
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.blog_posts
      WHERE blog_posts.id = blog_translations.blog_post_id
        AND blog_posts.status = 'published'
        AND blog_posts.published_at <= NOW()
    )
  );

CREATE POLICY "Admins can manage blog translations"
  ON public.blog_translations
  FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- 5. RLS: blog_media
ALTER TABLE public.blog_media ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read media of published posts"
  ON public.blog_media
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.blog_posts
      WHERE blog_posts.id = blog_media.blog_post_id
        AND blog_posts.status = 'published'
        AND blog_posts.published_at <= NOW()
    )
  );

CREATE POLICY "Admins can manage blog media"
  ON public.blog_media
  FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- 6. Triggers
CREATE TRIGGER blog_translations_updated_at
  BEFORE UPDATE ON public.blog_translations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
