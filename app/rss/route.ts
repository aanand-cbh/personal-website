import { getPostsMetadata } from '@/lib/mdx';
import { getBaseUrl } from '@/lib/utils';

const baseUrl = getBaseUrl()

function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

// Cache posts metadata to avoid refetching
let cachedPosts: Awaited<ReturnType<typeof getPostsMetadata>> | null = null
let cacheTime = 0
const CACHE_DURATION = 365 * 24 * 60 * 60 * 1000 // 1 year (365 days) to align with CDN cache

async function getCachedPosts() {
  const now = Date.now()
  if (!cachedPosts || now - cacheTime > CACHE_DURATION) {
    cachedPosts = await getPostsMetadata()
    cacheTime = now
  }
  return cachedPosts
}

export async function GET() {
  const posts = await getCachedPosts();

  const itemsXml = posts
    .map(
      (post) => `<item>
        <title>${escapeXml(post.frontMatter.title)}</title>
        <link>${baseUrl}/blog/${post.frontMatter.category}/${post.slug}</link>
        <description>${escapeXml(post.frontMatter.description || "")}</description>
        <pubDate>${new Date(post.frontMatter.date).toUTCString()}</pubDate>
        ${post.frontMatter.tags ? 
          post.frontMatter.tags.map(tag => `<category>${escapeXml(tag)}</category>`).join("\n        ") 
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
      "Cache-Control": "public, max-age=31536000, s-maxage=31536000, immutable", // 1 year cache
    },
  });
} 