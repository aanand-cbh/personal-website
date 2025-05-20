import Fuse from "fuse.js";
import { Calendar, Tag } from "lucide-react";
import Link from "next/link";

import { BlogSearch } from "@/components/blog-search";
import { RssIcon } from "@/components/icons";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { getAllPosts } from "@/lib/mdx";
import { containsExactWord, containsPartialWord, formatDate, getBaseUrl } from "@/lib/utils";

// Get base URL for absolute URLs in metadata
const baseUrl = getBaseUrl();

export const metadata = {
  title: "Blog",
  description: "Read my thoughts, ideas, and reflections on various topics.",
  openGraph: {
    title: "Blog",
    description: "Read my thoughts, ideas, and reflections on various topics.",
    type: "website",
    url: `${baseUrl}/blog`,
    images: [
      {
        url: `${baseUrl}/og?title=My Blog`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog",
    description: "Read my thoughts, ideas, and reflections on various topics.",
    images: [`${baseUrl}/og?title=My Blog`],
  },
};

export default async function BlogPage({
  searchParams,
}: {
  searchParams?: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams || {};
  const query = q || "";
  const allPosts = await getAllPosts();
  
  // Filter posts based on search query
  const posts = query
    ? (() => {
        try {
          console.log(`Searching for "${query}"`);
          
          // First check if any posts contain the exact search term as a whole word
          const exactMatches = allPosts.filter(post => {
            try {
              const content = post.content || '';
              const title = post.frontMatter.title || '';
              const description = post.frontMatter.description || '';
              const tags = Array.isArray(post.frontMatter.tags) 
                ? post.frontMatter.tags.join(' ') 
                : '';
                
              // Check if the search term appears as a whole word
              return (
                containsExactWord(content, query) || 
                containsExactWord(title, query) ||
                containsExactWord(description, query) ||
                containsExactWord(tags, query)
              );
            } catch (err) {
              console.error('Error checking exact match for post:', err);
              return false;
            }
          });
          
          // If we found exact matches, return only those
          if (exactMatches.length > 0) {
            console.log(`Found ${exactMatches.length} exact matches for "${query}"`);
            return exactMatches;
          }
          
          // Check for partial word matches for queries with 3+ characters
          // This will catch searches like "documentat" for "documentation"
          if (query.length >= 3) {
            const partialMatches = allPosts.filter(post => {
              try {
                const content = post.content || '';
                const title = post.frontMatter.title || '';
                const description = post.frontMatter.description || '';
                const tags = Array.isArray(post.frontMatter.tags) 
                  ? post.frontMatter.tags.join(' ') 
                  : '';
                  
                // Check if the search term appears as a partial word
                return (
                  containsPartialWord(content, query) || 
                  containsPartialWord(title, query) ||
                  containsPartialWord(description, query) ||
                  containsPartialWord(tags, query)
                );
              } catch (err) {
                console.error('Error checking partial match for post:', err);
                return false;
              }
            });
            
            if (partialMatches.length > 0) {
              console.log(`Found ${partialMatches.length} partial matches for "${query}"`);
              return partialMatches;
            }
          }
          
          // If no exact or partial matches, use fuzzy search
          const fuse = new Fuse(allPosts, {
            keys: [
              'frontMatter.title',
              'frontMatter.description',
              'frontMatter.tags',
              'content'
            ],
            threshold: 0.4,
            ignoreLocation: true,
            includeScore: true
          });
          
          const searchResults = fuse.search(query);
          
          // For debugging
          if (searchResults.length > 0) {
            console.log('Search scores:', searchResults.map(r => ({ 
              title: r.item.frontMatter.title, 
              score: r.score 
            })));
          }
          
          // Only return results with a good score (lower is better)
          // Filter out poor matches (high scores)
          const maxScore = 0.65; // Slightly more lenient maximum score
          const filteredResults = searchResults
            .filter(result => result.score !== undefined && result.score < maxScore)
            .map(result => result.item);
            
          console.log(`Found ${filteredResults.length} fuzzy matches for "${query}"`);
          return filteredResults;
        } catch (err) {
          console.error('Error in search processing:', err);
          return allPosts;
        }
      })()
    : allPosts;

  // Create JSON-LD structured data for the blog list
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'My Blog',
    description: 'Read my thoughts, ideas, and reflections on various topics.',
    url: `${baseUrl}/blog`,
    blogPost: posts.map(post => ({
      '@type': 'BlogPosting',
      headline: post.frontMatter.title,
      description: post.frontMatter.description,
      datePublished: post.frontMatter.date,
      url: `${baseUrl}/blog/${post.slug}`,
      author: {
        '@type': 'Person',
        name: 'Kaivlya',
      },
    })),
  }

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        {/* JSON-LD structured data for SEO */}
        <script
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd),
          }}
        />

        <section className="container max-w-3xl py-12">
          <div className="flex items-center justify-between mb-2">
            <h1 className="font-semibold text-3xl tracking-tighter">
              My Blog
            </h1>
            <Link 
              href="/rss" 
              className="flex items-center text-sm text-muted-foreground hover:text-primary transition-colors"
              title="RSS Feed"
            >
              <RssIcon className="h-4 w-4 mr-1" />
              <span>RSS</span>
            </Link>
          </div>
          <p className="text-muted-foreground mb-8">
            Thoughts, ideas, and reflections on various topics
          </p>
          
          {/* Search Bar */}
          <BlogSearch />
          
          {query && (
            <div className="mb-6 mt-2 text-sm text-muted-foreground">
              {posts.length === 0 ? (
                <p>No results found for &quot;{query}&quot;</p>
              ) : (
                <p>
                  Found {posts.length} result{posts.length !== 1 ? 's' : ''} for &quot;{query}&quot;
                  <span className="block mt-1 text-xs italic">
                    {posts.some(post => 
                      containsExactWord(post.content || '', query) ||
                      containsExactWord(post.frontMatter.title || '', query) ||
                      containsExactWord(post.frontMatter.description || '', query) ||
                      (Array.isArray(post.frontMatter.tags) && 
                        containsExactWord(post.frontMatter.tags.join(' '), query))
                    )
                      ? "Showing exact matches for your search term"
                      : "Our smart search finds matches even with typos or similar words"}
                  </span>
                </p>
              )}
            </div>
          )}
          
          <Separator className="mb-8" />

          <div className="space-y-4">
            {posts && posts.length > 0 ? (
              posts.map((post, index) => (
                <div key={post.slug + Math.random().toString(36).substring(2, 6)} className="pb-0">
                  <div className="flex flex-col space-y-2 mb-3">
                    <Link
                      key={
                        post.slug + Math.random().toString(36).substring(2, 6)
                      }
                      className="flex flex-col space-y-3 group"
                      href={`/blog/${post.slug}`}
                    >
                      <h2 className="text-xl font-medium group-hover:text-primary transition-colors">
                        {post.frontMatter.title}
                      </h2>
                      <p className="text-muted-foreground">
                        {post.frontMatter.description}
                      </p>
                    </Link>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>{formatDate(post.frontMatter.date)}</span>
                      </div>
                      <span>•</span>
                      <span>{post.frontMatter.readTime}</span>

                      {post.frontMatter.tags && Array.isArray(post.frontMatter.tags) && post.frontMatter.tags.length > 0 && (
                        <>
                          <span>•</span>
                          <div className="flex flex-wrap gap-2">
                            {post.frontMatter.tags.map((tag: string) => (
                              <Badge
                                key={tag + Math.random().toString(36).substring(2, 6)}
                                variant="secondary"
                                className="flex items-center gap-1"
                              >
                                <Tag className="h-3 w-3" />
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                  
                  {index < posts.length - 1 && <Separator className="mb-3" />}
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                {query ? (
                  <>
                    <h3 className="text-xl font-medium">No matching posts found</h3>
                    <p className="text-muted-foreground mt-2">
                      Try a different search term or browse all posts.
                    </p>
                  </>
                ) : (
                  <>
                    <h3 className="text-xl font-medium">No blog posts found</h3>
                    <p className="text-muted-foreground mt-2">
                      Start writing by adding Markdown files to the content/blog
                      directory.
                    </p>
                  </>
                )}
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
