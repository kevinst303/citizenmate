import { notFound } from 'next/navigation';
import { getPostBySlug } from '@/lib/blog-db';
import { supabasePublic } from '@/lib/supabase-public';
import { BlogHtmlContent } from '@/components/blog-html-content';
import { SubpageHero } from '@/components/shared/subpage-hero';
import type { Metadata } from 'next';

export const dynamicParams = true;

export async function generateStaticParams() {
  const { data } = await supabasePublic
    .from('blog_translations')
    .select('locale, slug');

  return (data || []).map((row) => ({
    lang: row.locale,
    slug: row.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}): Promise<Metadata> {
  try {
    const { lang, slug } = await params;
    const post = await getPostBySlug(lang, slug);
    if (!post) return { title: 'Blog Post Not Found | CitizenMate' };

    return {
      title: post.seo_title || `${post.title} | CitizenMate Blog`,
      description: post.seo_description || post.excerpt || undefined,
      keywords: post.seo_keywords?.split(',').map((s: string) => s.trim()),
      openGraph: {
        title: post.seo_title || post.title,
        description: post.seo_description || post.excerpt || undefined,
        type: 'article',
        publishedTime: post.published_at || undefined,
        images: post.og_image_url || post.featured_image_url
          ? [{ url: post.og_image_url || post.featured_image_url! }]
          : [],
      },
    };
  } catch {
    return { title: 'Blog Post Not Found | CitizenMate' };
  }
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  try {
    const { lang, slug } = await params;
    const post = await getPostBySlug(lang, slug);

    if (!post) notFound();

    return (
      <div className="bg-slate-50 min-h-screen">
        <SubpageHero
          title={post.title}
          description={post.excerpt || ''}
          badge={post.tags[0]?.name || 'Article'}
          breadcrumbs={[
            { label: 'Home', href: `/${lang}` },
            { label: 'Blog', href: `/${lang}/blog` },
            { label: post.title },
          ]}
          bgImage={post.featured_image_url || undefined}
          curveColorClass="text-slate-50"
        />

        <article className="mx-auto max-w-3xl py-16 px-4 md:px-0">
          <header className="mb-10 text-center">
            {post.published_at && (
              <div className="text-sm text-conseil-teal font-medium mb-4 uppercase tracking-wider">
                {new Date(post.published_at).toLocaleDateString(lang, {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </div>
            )}
          </header>

          <BlogHtmlContent content={post.content} />
        </article>
      </div>
    );
  } catch {
    notFound();
  }
}
