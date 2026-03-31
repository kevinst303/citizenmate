import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { getAllPosts, getPostBySlug } from '@/lib/mdx';
import { mdxComponents } from '@/components/mdx-components';

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
      title: `${post.frontmatter.title} | CitizenMate`,
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
      <article className="mx-auto max-w-3xl py-12">
        <Link 
          href="/blog" 
          className="inline-flex items-center text-sm text-neutral-400 hover:text-white mb-8 transition-colors"
        >
          <ChevronLeft className="mr-1 h-4 w-4" />
          Back to all articles
        </Link>
        <header className="mb-10 text-center">
          <div className="text-sm text-primary font-medium mb-4">
            {new Date(post.frontmatter.date).toLocaleDateString('en-AU', {
              day: 'numeric',
              month: 'long',
              year: 'numeric'
            })}
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-5xl mb-6 leading-tight">
            {post.frontmatter.title}
          </h1>
          <p className="text-xl text-neutral-400 max-w-2xl mx-auto leading-relaxed">
            {post.frontmatter.description}
          </p>
        </header>

        {post.frontmatter.image && (
          <div className="relative w-full aspect-[16/9] mb-12 rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
            <Image
              src={post.frontmatter.image}
              alt={post.frontmatter.title}
              fill
              priority
              className="object-cover"
            />
          </div>
        )}

        <div className="prose prose-invert prose-lg max-w-none prose-headings:font-bold prose-a:text-primary hover:prose-a:text-primary/80 prose-img:rounded-xl">
          <MDXRemote source={post.content} components={mdxComponents} />
        </div>
      </article>
    );
  } catch (error) {
    notFound();
  }
}
