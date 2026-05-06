import { MetadataRoute } from "next";
import { studyTopics } from "@/data/study-content";
import { mockTests } from "@/data/tests";
import { supabasePublic } from "@/lib/supabase-public";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://citizenmate.com.au";

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${baseUrl}/practice`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/study`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/privacy`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.3 },
    { url: `${baseUrl}/terms`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.3 },
    { url: `${baseUrl}/cookies`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.3 },
  ];

  const studyRoutes: MetadataRoute.Sitemap = studyTopics.map((topic) => ({
    url: `${baseUrl}/study/${topic.id}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const practiceRoutes: MetadataRoute.Sitemap = mockTests.map((test) => ({
    url: `${baseUrl}/practice/${test.id}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  // Fetch blog slugs from Supabase for sitemap
  let blogRoutes: MetadataRoute.Sitemap = [];
  try {
    const { data } = await supabasePublic
      .from('blog_translations')
      .select('locale, slug, blog_post:blog_post_id!inner(published_at, updated_at, status)')
      .eq('blog_post.status', 'published')
      .lte('blog_post.published_at', new Date().toISOString());

    blogRoutes = (data || []).map((row: Record<string, unknown>) => {
      const locale = row.locale as string;
      const slug = row.slug as string;
      const blogPost = row.blog_post as Record<string, unknown>;
      const updatedAt = blogPost?.updated_at
        ? new Date(blogPost.updated_at as string)
        : new Date();

      return {
        url: locale === 'en' 
          ? `${baseUrl}/blog/${slug}`
          : `${baseUrl}/${locale}/blog/${slug}`,
        lastModified: updatedAt,
        changeFrequency: "weekly" as const,
        priority: 0.7,
      };
    });
  } catch {
    // Graceful degradation if DB is unreachable
  }

  return [...staticRoutes, ...studyRoutes, ...practiceRoutes, ...blogRoutes];
}
