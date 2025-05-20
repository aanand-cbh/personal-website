import { getAllPosts } from "@/lib/mdx";
import { getBaseUrl } from "@/lib/utils";
import { MetadataRoute } from "next";

// Get base URL dynamically based on environment
export const baseUrl = getBaseUrl();

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Get all blog posts
  const posts = await getAllPosts();
  
  // Map blog posts to sitemap entries
  const blogEntries = posts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.frontMatter.date),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  // Define static routes
  const routes = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.5,
    },
  ];

  return [...routes, ...blogEntries];
} 