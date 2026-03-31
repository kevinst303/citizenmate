'use client';

import { motion, Variants } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Calendar } from 'lucide-react';

interface PostFrontmatter {
  title: string;
  description: string;
  date: string;
  image?: string;
}

interface Post {
  slug: string;
  frontmatter: PostFrontmatter;
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 15,
    },
  },
};

export function BlogClient({ posts }: { posts: Post[] }) {
  if (posts.length === 0) {
    return (
      <div className="text-center py-24 text-neutral-400">
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
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
    >
      {/* Hero Header */}
      <motion.div variants={itemVariants} className="mb-16 text-center max-w-3xl mx-auto relative z-10">
        <div className="inline-flex items-center justify-center rounded-full bg-blue-500/10 px-3 py-1 mb-8 border border-blue-500/20 backdrop-blur-md">
          <span className="text-sm font-medium text-blue-400">Discover & Learn</span>
        </div>
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6 text-white [text-wrap:balance]">
          CitizenMate <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-sky-300">Blog</span>
        </h1>
        <p className="text-xl text-neutral-400 [text-wrap:balance]">
          Everything you need to know to pass the Australian Citizenship Test in 2026.
          Expert strategies, study guides, and test preparation advice.
        </p>
      </motion.div>

      {/* Featured Post */}
      <motion.div variants={itemVariants} className="mb-16 relative">
        <div className="absolute -inset-x-6 sm:-inset-x-8 -inset-y-6 sm:-inset-y-8 bg-gradient-to-br from-blue-500/10 via-transparent to-transparent rounded-[3rem] blur-2xl opacity-50 pointer-events-none" />
        
        <Link href={`/blog/${featuredPost.slug}`} className="group block relative rounded-[2rem] bg-white/5 border border-white/10 overflow-hidden hover:bg-white/[0.07] transition-all duration-500">
          <div className="grid md:grid-cols-2 gap-0">
            {/* Image Side */}
            <div className="relative aspect-[4/3] md:aspect-auto h-full w-full overflow-hidden bg-neutral-900/50">
              {featuredPost.frontmatter.image ? (
                <Image
                  src={featuredPost.frontmatter.image}
                  alt={featuredPost.frontmatter.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  priority
                />
              ) : (
                <div className="absolute inset-0 bg-blue-500/20 flex items-center justify-center">
                  <span className="text-blue-400 font-medium text-lg">Featured Article</span>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 md:opacity-60 transition-opacity duration-500" />
            </div>

            {/* Content Side */}
            <div className="flex flex-col justify-center p-8 md:p-12 lg:p-16 relative z-10 backdrop-blur-md">
              <div className="flex items-center gap-x-4 text-sm mb-6">
                <Badge variant="secondary" className="bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 border-0 px-3 py-1 text-xs uppercase tracking-wider font-semibold shadow-inner shadow-blue-500/20">
                  Featured
                </Badge>
                <div className="flex items-center text-neutral-400">
                  <Calendar className="mr-2 h-4 w-4" />
                  <time dateTime={featuredPost.frontmatter.date}>
                    {new Date(featuredPost.frontmatter.date).toLocaleDateString('en-AU', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </time>
                </div>
              </div>

              <h2 className="text-3xl md:text-4xl font-bold leading-tight text-white mb-6 group-hover:text-blue-400 transition-colors duration-300">
                {featuredPost.frontmatter.title}
              </h2>

              <p className="text-neutral-400 text-lg leading-relaxed mb-8 line-clamp-3">
                {featuredPost.frontmatter.description}
              </p>

              <div className="mt-auto flex items-center text-blue-400 font-semibold text-lg group-hover:translate-x-2 transition-transform duration-300">
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
            className="flex flex-col rounded-3xl border border-white/5 bg-white/[0.02] overflow-hidden hover:bg-white/[0.04] hover:border-white/10 transition-all duration-300 group shadow-lg drop-shadow-sm backdrop-blur-sm"
          >
            <Link href={`/blog/${post.slug}`} className="flex flex-col h-full">
              {/* Card Image */}
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-neutral-900/50">
                {post.frontmatter.image ? (
                  <Image
                    src={post.frontmatter.image}
                    alt={post.frontmatter.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                ) : (
                  <div className="absolute inset-0 bg-blue-500/20 flex items-center justify-center">
                    <span className="text-blue-400 font-medium">Article</span>
                  </div>
                )}
                {/* Subtle gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-80" />
                
                {/* Image badging / Date */}
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                  <Badge variant="secondary" className="bg-black/50 backdrop-blur-md text-white border-white/10">
                    Guide
                  </Badge>
                  <time dateTime={post.frontmatter.date} className="text-xs font-medium text-white/80 drop-shadow-md">
                    {new Date(post.frontmatter.date).toLocaleDateString('en-AU', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </time>
                </div>
              </div>

              {/* Card Content */}
              <div className="flex flex-col flex-grow p-6">
                <h3 className="text-xl font-bold leading-tight text-white group-hover:text-blue-400 transition-colors line-clamp-2 mb-3">
                  {post.frontmatter.title}
                </h3>
                <p className="line-clamp-3 text-sm leading-relaxed text-neutral-400 flex-grow">
                  {post.frontmatter.description}
                </p>
                <div className="mt-6 flex items-center text-sm font-semibold text-blue-400 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
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

