export type BlogPostStatus = 'draft' | 'published' | 'archived';

export interface BlogPost {
  id: string;
  author_id: string | null;
  status: BlogPostStatus;
  published_at: string | null;
  is_featured: boolean;
  reading_time: number | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface BlogTranslation {
  id: string;
  blog_post_id: string;
  locale: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  seo_title: string | null;
  seo_description: string | null;
  seo_keywords: string | null;
  og_image_url: string | null;
  created_at: string;
  updated_at: string;
}

export type BlogMediaType = 'image' | 'video';

export interface BlogMedia {
  id: string;
  blog_post_id: string;
  url: string;
  alt_text: string | null;
  type: BlogMediaType;
  is_featured: boolean;
  sort_order: number;
  caption: string | null;
  created_at: string;
}

export interface BlogTag {
  id: string;
  name: string;
  slug: string;
  created_at: string;
}

export interface BlogPostTag {
  blog_post_id: string;
  tag_id: string;
}

export interface Locale {
  code: string;
  name: string;
  native_name: string;
  is_default: boolean;
  is_active: boolean;
  created_at: string;
}

export interface BlogPostWithTranslation extends BlogPost {
  translation: BlogTranslation;
  media: BlogMedia[];
  tags: BlogTag[];
  alternate_slugs: Record<string, string>;
}

export interface BlogPostListItem {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  status: BlogPostStatus;
  published_at: string | null;
  is_featured: boolean;
  reading_time: number | null;
  locale: string;
  featured_image_url: string | null;
  featured_image_alt: string | null;
  tags: BlogTag[];
  created_at: string;
}

export interface BlogPostDetail {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  content: string;
  status: BlogPostStatus;
  published_at: string | null;
  is_featured: boolean;
  reading_time: number | null;
  locale: string;
  author_id: string | null;
  featured_image_url: string | null;
  featured_image_alt: string | null;
  seo_title: string | null;
  seo_description: string | null;
  seo_keywords: string | null;
  og_image_url: string | null;
  tags: BlogTag[];
  media: BlogMedia[];
  alternate_slugs: Record<string, string>;
}

export interface CreateBlogTranslationInput {
  locale: string;
  title: string;
  slug: string;
  excerpt?: string;
  content?: string;
  seo_title?: string;
  seo_description?: string;
  seo_keywords?: string;
  og_image_url?: string;
}

export interface CreateBlogPostInput {
  status?: BlogPostStatus;
  is_featured?: boolean;
  reading_time?: number;
  translation: CreateBlogTranslationInput;
  tag_ids?: string[];
}

export interface UpdateBlogPostInput {
  status?: BlogPostStatus;
  published_at?: string | null;
  is_featured?: boolean;
  reading_time?: number;
  sort_order?: number;
}
