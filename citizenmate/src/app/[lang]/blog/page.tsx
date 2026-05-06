import { getPublishedPosts } from '@/lib/blog-db';
import { BlogClient } from './blog-client';
import { SubpageHero } from '@/components/shared/subpage-hero';
import { getDictionary } from '@/i18n/config';
import type { Locale } from '@/i18n/config';

export const metadata = {
  title: 'CitizenMate Blog - Australian Citizenship Test Tips & Guides',
  description: 'Read the latest guides, tips, and strategies for passing the Australian citizenship test.',
};

export default async function BlogPage({
  params,
  searchParams,
}: {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ tag?: string }>;
}) {
  const { lang } = await params;
  const { tag } = await searchParams;
  const posts = await getPublishedPosts(lang, tag);
  const dict = await getDictionary(lang as Locale);

  return (
    <div className="bg-slate-50 min-h-screen">
      <SubpageHero
        title={dict.blog.hero_title}
        description={dict.blog.hero_desc}
        breadcrumbs={[
          { label: dict.blog.breadcrumb_home, href: `/${lang}` },
          { label: dict.blog.breadcrumb_blog },
        ]}
        curveColorClass="text-slate-50"
      />
      <BlogClient posts={posts} lang={lang} />
    </div>
  );
}
