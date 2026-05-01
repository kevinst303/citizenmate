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

          <div className="prose prose-lg max-w-none prose-headings:font-bold prose-headings:text-gray-900 prose-p:text-gray-600 prose-p:leading-relaxed prose-a:text-conseil-teal hover:prose-a:text-conseil-teal/80 prose-img:rounded-[10px] prose-img:shadow-[0_4px_16px_rgba(0,0,0,0.1)] pb-24">
            <MDXRemote source={post.content} components={mdxComponents} />
          </div>
        </article>
      </div>
    );
  } catch (error) {
    notFound();
  }
}
