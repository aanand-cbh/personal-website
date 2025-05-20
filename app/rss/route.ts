import { getAllPosts } from "@/lib/mdx";
import { getBaseUrl } from "@/lib/utils";

// Get base URL dynamically based on environment
export const baseUrl = getBaseUrl();

export async function GET() {
  const posts = await getAllPosts();

  const itemsXml = posts
    .map(
      (post) => `<item>
        <title>${post.frontMatter.title}</title>
        <link>${baseUrl}/blog/${post.slug}</link>
        <description>${post.frontMatter.description || ""}</description>
        <pubDate>${new Date(post.frontMatter.date).toUTCString()}</pubDate>
        ${post.frontMatter.tags ? 
          post.frontMatter.tags.map(tag => `<category>${tag}</category>`).join("\n        ") 
          : ""}
      </item>`
    )
    .join("\n");

  const rssFeed = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Kaivlya's Blog</title>
    <link>${baseUrl}/blog</link>
    <description>Thoughts, ideas, and reflections on various topics</description>
    <language>en</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${baseUrl}/rss" rel="self" type="application/rss+xml" />
    ${itemsXml}
  </channel>
</rss>`;

  return new Response(rssFeed, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
} 