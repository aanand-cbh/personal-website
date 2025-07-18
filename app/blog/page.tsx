import Fuse from "fuse.js";
import { Calendar, Code2, Heart, Plane, Tag, Users, X } from "lucide-react";
import Link from "next/link";


import { RssIcon } from "@/components/icons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
  searchParams?: Promise<{ q?: string; tags?: string }>;
}) {
  const { q, tags } = await searchParams || {};
  const query = q || "";
  const selectedTags = tags ? tags.split(",") : [];
  const allPosts = (await getAllPosts())
    .filter(post => !post.frontMatter.category) // Only show uncategorized posts
    .sort((a, b) => 
      new Date(b.frontMatter.date).getTime() - new Date(a.frontMatter.date).getTime()
    );

  // Get all posts for category counts
  const allPostsWithCategories = await getAllPosts();
  
  // Define categories with their metadata
  const categories = [
    {
      slug: 'tech',
      title: 'Tech & Software Engineering',
      description: 'Technology, software engineering, and development.',
      icon: Code2,
      color: 'from-blue-500 to-purple-600'
    },
    {
      slug: 'travel',
      title: 'Travel',
      description: 'Travel guides, destinations, and adventure stories',
      icon: Plane,
      color: 'from-green-500 to-blue-500'
    },
    {
      slug: 'spiritual',
      title: 'Spiritual',
      description: 'Spiritual insights, personal growth, and mindfulness',
      icon: Heart,
      color: 'from-purple-500 to-pink-500'
    },
    {
      slug: 'personal',
      title: 'Personal',
      description: 'Personal stories, life lessons, and reflections',
      icon: Users,
      color: 'from-orange-500 to-red-500'
    }
  ];

  // Calculate post counts for each category
  const categoriesWithCounts = categories.map(category => ({
    ...category,
    count: allPostsWithCategories.filter(post => post.frontMatter.category === category.slug).length
  })).filter(category => category.count > 0); // Only show categories with posts
  
  // Filter posts based on search query and tags
  const posts = (() => {
    let filteredPosts = allPosts;

    // Filter by tags if any are selected
    if (selectedTags.length > 0) {
      filteredPosts = filteredPosts.filter(post => 
        selectedTags.every(tag => 
          Array.isArray(post.frontMatter.tags) && 
          post.frontMatter.tags.includes(tag)
        )
      );
    }

    // Apply search query filter if present
    if (query) {
      try {
        // First check if any posts contain the exact search term as a whole word
        const exactMatches = filteredPosts.filter(post => {
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
          return exactMatches;
        }
        
        // Check for partial word matches for queries with 3+ characters
        if (query.length >= 3) {
          const partialMatches = filteredPosts.filter(post => {
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
            return partialMatches;
          }
        }
        
        // If no exact or partial matches, use fuzzy search
        const fuse = new Fuse(filteredPosts, {
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
      
        // Only return results with a good score (lower is better)
        const maxScore = 0.65;
        const filteredResults = searchResults
          .filter(result => result.score !== undefined && result.score < maxScore)
          .map(result => result.item);
        
        return filteredResults;
      } catch (err) {
        console.error('Error in search processing:', err);
        return filteredPosts;
      }
    }

    return filteredPosts;
  })();

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

  // Get all unique tags from posts
  const allTags = Array.from(
    new Set(
      allPosts
        .flatMap(post => post.frontMatter.tags || [])
        .filter(Boolean)
    )
  ).sort();

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
          


          {/* Active Tags */}
          {selectedTags.length > 0 && (
            <div className="mb-4 flex flex-wrap gap-2">
              {selectedTags.map(tag => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="flex items-center gap-1"
                >
                  <Tag className="h-3 w-3" />
                  {tag}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-4 w-4 p-0 hover:bg-transparent"
                    asChild
                  >
                    <Link
                      href={{
                        pathname: "/blog",
                        query: {
                          ...(query ? { q: query } : {}),
                          tags: selectedTags.filter(t => t !== tag).join(",")
                        }
                      }}
                    >
                      <X className="h-3 w-3" />
                    </Link>
                  </Button>
                </Badge>
              ))}
            </div>
          )}
          
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

          {/* Categories Section */}
          {!query && !selectedTags.length && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Explore by Category</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {categoriesWithCounts.map((category) => {
                  const IconComponent = category.icon;
                  return (
                    <Link key={category.slug} href={`/blog/${category.slug}`}>
                      <Card className="h-full transition-all hover:shadow-lg hover:scale-[1.02] cursor-pointer group">
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${category.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                              <IconComponent className="w-5 h-5 text-white" />
                            </div>
                            <Badge variant="secondary" className="text-xs">
                              {category.count} post{category.count !== 1 ? 's' : ''}
                            </Badge>
                          </div>
                          <CardTitle className="text-lg group-hover:text-primary transition-colors">
                            {category.title}
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <CardDescription className="text-sm leading-relaxed">
                            {category.description}
                          </CardDescription>
                        </CardContent>
                      </Card>
                    </Link>
                  );
                })}
              </div>
              
              {/* Show all categories link if user is looking at uncategorized posts */}
              {allPosts.length > 0 && (
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-4">
                    Also check out posts from our themed categories above, or browse all uncategorized posts below.
                  </p>
                </div>
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
                                variant={selectedTags.includes(tag) ? "default" : "secondary"}
                                className={`flex items-center gap-1 cursor-pointer transition-colors ${
                                  selectedTags.includes(tag)
                                    ? "hover:bg-primary/90"
                                    : "hover:bg-secondary/80"
                                }`}
                              >
                                <Link
                                  href={{
                                    pathname: "/blog",
                                    query: {
                                      ...(query ? { q: query } : {}),
                                      tags: [...new Set([...selectedTags, tag])].join(",")
                                    }
                                  }}
                                  className="flex items-center gap-1"
                                >
                                  <Tag className="h-3 w-3" />
                                  {tag}
                                </Link>
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
            ) : null}
          </div>
        </section>
      </main>
    </div>
  );
}
