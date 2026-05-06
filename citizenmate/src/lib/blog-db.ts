import { createSupabaseServerClient } from '@/lib/supabase-server';
import { cache } from 'react';
import type { BlogPostListItem, BlogPostDetail } from '@/lib/blog-types';

function flattenPostListItem(row: Record<string, unknown>): BlogPostListItem {
  const blogPost = (row.blog_post as Record<string, unknown>) || {};
  const media = (blogPost.media as Array<Record<string, unknown>>) || [];
  const tags = ((row.tags as Array<{ tag: Record<string, unknown> }>) || []).map(
    (t: { tag: Record<string, unknown> }) => ({
      id: t.tag.id as string,
      name: t.tag.name as string,
      slug: t.tag.slug as string,
      created_at: t.tag.created_at as string,
    })
  );
  const featuredMedia = media.find((m) => m.is_featured) || media[0];

  return {
    id: blogPost.id as string,
    slug: row.slug as string,
    title: row.title as string,
    excerpt: (row.excerpt as string) || null,
    status: blogPost.status as BlogPostListItem['status'],
    published_at: (blogPost.published_at as string) || null,
    is_featured: (blogPost.is_featured as boolean) || false,
    reading_time: (blogPost.reading_time as number) || null,
    locale: row.locale as string,
    featured_image_url: (featuredMedia?.url as string) || null,
    featured_image_alt: (featuredMedia?.alt_text as string) || null,
    tags,
    created_at: blogPost.created_at as string,
  };
}

export const getPublishedPosts = cache(
  async (locale: string, tagSlug?: string): Promise<BlogPostListItem[]> => {
    const supabase = await createSupabaseServerClient();

    let query = supabase
      .from('blog_translations')
      .select(`
        slug,
        title,
        excerpt,
        locale,
        blog_post:blog_post_id!inner (
          id,
          status,
          published_at,
          is_featured,
          reading_time,
          sort_order,
          created_at,
          media:blog_media (url, alt_text, is_featured),
          tags:blog_post_tags (tag:blog_tags (id, name, slug))
        )
      `)
      .eq('locale', locale)
      .not('blog_post', 'is', null)
      .eq('blog_post.status', 'published')
      .lte('blog_post.published_at', new Date().toISOString())
      .order('published_at', { foreignTable: 'blog_post', ascending: false });

    if (tagSlug) {
      query = query.filter('blog_post.tags.tag.slug', 'eq', tagSlug);
    }

    const { data, error } = await query;

    if (error) {
      console.error('getPublishedPosts error:', error);
      return [];
    }

    return (data || []).map(flattenPostListItem);
  }
);

export const getPostBySlug = cache(
  async (locale: string, slug: string): Promise<BlogPostDetail | null> => {
    const supabase = await createSupabaseServerClient();

    const { data, error } = await supabase
      .rpc('get_blog_post_by_slug', { p_locale: locale, p_slug: slug })
      .single();

    if (error || !data) return null;

    const translation = (data as Record<string, unknown>).translation as Record<string, unknown>;
    const media = ((data as Record<string, unknown>).media as Array<Record<string, unknown>>) || [];
    const tags = (((data as Record<string, unknown>).tags as Array<Record<string, unknown>>) || []).map(
      (t: Record<string, unknown>) => ({
        id: t.id as string,
        name: t.name as string,
        slug: t.slug as string,
        created_at: (t.created_at as string) || '',
      })
    );

    const featuredMedia = media.find((m) => m.is_featured) || media[0];

    return {
      id: (data as Record<string, unknown>).id as string,
      slug: translation?.slug as string,
      title: translation?.title as string,
      excerpt: (translation?.excerpt as string) || null,
      content: (translation?.content as string) || '',
      status: (data as Record<string, unknown>).status as BlogPostDetail['status'],
      published_at: ((data as Record<string, unknown>).published_at as string) || null,
      is_featured: ((data as Record<string, unknown>).is_featured as boolean) || false,
      reading_time: ((data as Record<string, unknown>).reading_time as number) || null,
      locale,
      author_id: ((data as Record<string, unknown>).author_id as string) || null,
      featured_image_url: (featuredMedia?.url as string) || null,
      featured_image_alt: (featuredMedia?.alt_text as string) || null,
      seo_title: (translation?.seo_title as string) || null,
      seo_description: (translation?.seo_description as string) || null,
      seo_keywords: (translation?.seo_keywords as string) || null,
      og_image_url: (translation?.og_image_url as string) || null,
      tags,
      media: media.map((m: Record<string, unknown>) => ({
        id: m.id as string,
        blog_post_id: m.blog_post_id as string,
        url: m.url as string,
        alt_text: (m.alt_text as string) || null,
        type: (m.type as 'image' | 'video') || 'image',
        is_featured: (m.is_featured as boolean) || false,
        sort_order: (m.sort_order as number) || 0,
        caption: (m.caption as string) || null,
        created_at: (m.created_at as string) || '',
      })),
      alternate_slugs: ((data as Record<string, unknown>).alternate_slugs as Record<string, string>) || {},
    };
  }
);

export const getBlogSlugs = cache(
  async (): Promise<Array<{ lang: string; slug: string }>> => {
    const supabase = await createSupabaseServerClient();

    const { data } = await supabase
      .from('blog_translations')
      .select('locale, slug, blog_post:blog_post_id!inner(status, published_at)')
      .eq('blog_post.status', 'published')
      .lte('blog_post.published_at', new Date().toISOString());

    return (data || []).map((row: Record<string, unknown>) => ({
      lang: row.locale as string,
      slug: row.slug as string,
    }));
  }
);

export const getAllTags = cache(async () => {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from('blog_tags')
    .select('*')
    .order('name', { ascending: true });
  return data || [];
});
