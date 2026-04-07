import { MetadataRoute } from "next";
import { studyTopics } from "@/data/study-content";
import { mockTests } from "@/data/tests";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://citizenmate.com.au";

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/practice`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/study`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/cookies`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.3,
    },
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

  return [...staticRoutes, ...studyRoutes, ...practiceRoutes];
}

