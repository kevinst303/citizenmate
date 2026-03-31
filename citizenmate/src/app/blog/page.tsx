import { getAllPosts } from '@/lib/mdx';
import { BlogClient } from './blog-client';

export const metadata = {
  title: 'CitizenMate Blog - Australian Citizenship Test Tips & Guides',
  description: 'Read the latest guides, tips, and strategies for passing the Australian citizenship test.',
};

export default function BlogPage() {
  const posts = getAllPosts();

  return <BlogClient posts={posts} />;
}
