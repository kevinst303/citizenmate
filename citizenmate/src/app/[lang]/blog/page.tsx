import { getAllPosts } from '@/lib/mdx';
import { BlogClient } from './blog-client';
import { SubpageHero } from '@/components/shared/subpage-hero';

export const metadata = {
  title: 'CitizenMate Blog - Australian Citizenship Test Tips & Guides',
  description: 'Read the latest guides, tips, and strategies for passing the Australian citizenship test.',
};

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <div className="bg-slate-50 min-h-screen">
      <SubpageHero 
        title="Blog"
        description="Everything you need to know to pass the Australian Citizenship Test in 2026. Expert strategies, study guides, and test preparation advice."
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Blog' }
        ]}
        curveColorClass="text-slate-50"
      />
      <BlogClient posts={posts} />
    </div>
  );
}
