import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import Image from 'next/image';
import { getPostBySlug, getAllPosts } from '@/lib/mdx';
import { mdxComponents } from '@/components/mdx-components';
import { SubpageHero } from '@/components/shared/subpage-hero';

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    const post = getPostBySlug(slug);
    return {
      title: `${post.frontmatter.title} | CitizenMate Blog`,
      description: post.frontmatter.description,
      openGraph: {
        title: post.frontmatter.title,
        description: post.frontmatter.description,
        type: 'article',
        publishedTime: post.frontmatter.date,
        images: post.frontmatter.image ? [post.frontmatter.image] : [],
      },
    };
  } catch (error) {
    return {
      title: 'Blog Post Not Found | CitizenMate',
    };
  }
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    const post = getPostBySlug(slug);

    return (
      <div className="bg-slate-50 min-h-screen">
        <SubpageHero
          title={post.frontmatter.title}
          description={post.frontmatter.description}
          badge={post.frontmatter.category || 'Article'}
          breadcrumbs={[
            { label: 'Home', href: '/' },
            { label: 'Blog', href: '/blog' },
            { label: post.frontmatter.title }
          ]}
          bgImage={post.frontmatter.image}
          curveColorClass="text-slate-50"
        />

        <article className="mx-auto max-w-3xl py-16 px-4 md:px-0">
          <header className="mb-10 text-center">
            <div className="text-sm text-conseil-teal font-medium mb-4 uppercase tracking-wider">
              {new Date(post.frontmatter.date).toLocaleDateString('en-AU', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              })}
            </div>
            {/* The title is already in the hero, but we keep the date here for reading flow */}
          </header>

          <div className="prose prose-lg prose-slate max-w-none prose-headings:font-bold prose-headings:text-cm-dark prose-headings:tracking-tight prose-p:text-cm-slate-600 prose-p:leading-relaxed prose-a:text-cm-teal prose-a:no-underline hover:prose-a:text-cm-teal-dark hover:prose-a:underline prose-img:rounded-[24px] prose-img:shadow-card prose-li:text-cm-slate-600 prose-strong:text-cm-slate-800 pb-24">
            <MDXRemote source={post.content} components={mdxComponents} />
          </div>
        </article>
      </div>
    );
  } catch (error) {
    notFound();
  }
}
