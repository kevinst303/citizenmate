'use client';

import { motion, Variants } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Calendar, Tag as TagIcon } from 'lucide-react';
import type { BlogPostListItem } from '@/lib/blog-types';

interface Post extends BlogPostListItem {}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 100, damping: 15 },
  },
};

export function BlogClient({ posts, lang }: { posts: Post[]; lang: string }) {
  if (posts.length === 0) {
    return (
      <div className="text-center py-24 text-gray-500">
        No posts available right now.
      </div>
    );
  }

  const featuredPost = posts[0];
  const regularPosts = posts.slice(1);

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 -mt-8 relative z-10"
    >
      {/* Featured Post */}
      <motion.div variants={itemVariants} className="mb-16">
        <Link
          href={`/${lang}/blog/${featuredPost.slug}`}
          className="group block overflow-hidden bg-white rounded-[10px] shadow-[0_1px_3px_0_rgba(0,0,0,0.1),0_1px_2px_-1px_rgba(0,0,0,0.1)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.1)] transition-all duration-300 transform hover:-translate-y-1"
        >
          <div className="grid md:grid-cols-2">
            <div className="relative aspect-[4/3] md:aspect-auto h-full w-full overflow-hidden bg-gray-100">
              {featuredPost.featured_image_url ? (
                <Image
                  src={featuredPost.featured_image_url}
                  alt={featuredPost.featured_image_alt || featuredPost.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  priority
                />
              ) : (
                <div className="absolute inset-0 bg-conseil-teal/10 flex items-center justify-center">
                  <span className="text-conseil-teal font-medium text-lg">Featured Article</span>
                </div>
              )}
            </div>

            <div className="flex flex-col justify-center p-8 md:p-12 lg:p-16 relative bg-white">
              <div className="flex items-center gap-x-4 mb-6">
                {featuredPost.tags.length > 0 && (
                  <div className="bg-conseil-teal/10 text-conseil-teal px-3 py-1 text-xs font-semibold rounded-full">
                    {featuredPost.tags[0].name}
                  </div>
                )}
                <div className="flex items-center text-gray-500 text-sm">
                  <Calendar className="mr-2 h-4 w-4" />
                  <time dateTime={featuredPost.published_at || ''}>
                    {featuredPost.published_at
                      ? new Date(featuredPost.published_at).toLocaleDateString('en-AU', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                        })
                      : ''}
                  </time>
                </div>
              </div>

              <h2 className="text-3xl md:text-4xl font-bold leading-tight text-gray-900 mb-4 group-hover:text-conseil-teal transition-colors duration-300">
                {featuredPost.title}
              </h2>

              <p className="text-gray-600 text-lg leading-relaxed mb-8 line-clamp-3">
                {featuredPost.excerpt}
              </p>

              <div className="mt-auto flex items-center text-conseil-teal font-semibold text-lg group-hover:translate-x-2 transition-transform duration-300">
                Read full article <ArrowRight className="ml-2 h-5 w-5" />
              </div>
            </div>
          </div>
        </Link>
      </motion.div>

      {/* Grid of Remaining Posts */}
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {regularPosts.map((post) => (
          <motion.article
            variants={itemVariants}
            key={post.slug}
            className="flex flex-col bg-white rounded-[10px] shadow-[0_1px_3px_0_rgba(0,0,0,0.1),0_1px_2px_-1px_rgba(0,0,0,0.1)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.1)] transition-all duration-300 transform hover:-translate-y-1 group overflow-hidden"
          >
            <Link href={`/${lang}/blog/${post.slug}`} className="flex flex-col h-full">
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-gray-100">
                {post.featured_image_url ? (
                  <Image
                    src={post.featured_image_url}
                    alt={post.featured_image_alt || post.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div className="absolute inset-0 bg-conseil-teal/10 flex items-center justify-center">
                    <span className="text-conseil-teal font-medium">Article</span>
                  </div>
                )}

                {post.tags.length > 0 && (
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-conseil-teal px-3 py-1 text-xs font-semibold rounded-[10px] shadow-sm">
                    {post.tags[0].name}
                  </div>
                )}
              </div>

              <div className="flex flex-col flex-grow p-6 bg-white">
                <time
                  dateTime={post.published_at || ''}
                  className="text-sm font-medium text-gray-500 mb-3 flex items-center"
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  {post.published_at
                    ? new Date(post.published_at).toLocaleDateString('en-AU', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })
                    : ''}
                </time>
                <h3 className="text-xl font-bold leading-tight text-gray-900 group-hover:text-conseil-teal transition-colors line-clamp-2 mb-3">
                  {post.title}
                </h3>
                <p className="line-clamp-3 text-sm leading-relaxed text-gray-600 flex-grow">
                  {post.excerpt}
                </p>
                <div className="mt-6 flex items-center text-sm font-semibold text-conseil-teal opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                  Read article <ArrowRight className="ml-1 h-4 w-4" />
                </div>
              </div>
            </Link>
          </motion.article>
        ))}
      </div>
    </motion.div>
  );
}
