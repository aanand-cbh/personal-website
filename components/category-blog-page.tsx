import Fuse from "fuse.js";
import { Calendar, Tag } from "lucide-react";
import Link from "next/link";

import { CategoryBlogSearch } from "@/components/category-blog-search";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { getAllPosts } from "@/lib/mdx";
import { formatDate } from "@/lib/utils";

interface CategoryBlogPageProps {
  category: string;
  title: string;
  description: string;
  searchPlaceholder: string;
  searchParams?: { q?: string };
}

export async function CategoryBlogPage({
  category,
  title,
  description,
  searchPlaceholder,
  searchParams,
}: CategoryBlogPageProps) {
  const { q } = searchParams || {};
  const query = q || "";
  
  const allPosts = (await getAllPosts()).sort((a, b) => 
    new Date(b.frontMatter.date).getTime() - new Date(a.frontMatter.date).getTime()
  );
  
  // Filter posts that have the specified category
  const allCategoryPosts = allPosts.filter(post => post.frontMatter.category === category);
  
  // Apply search filter if query exists
  const categoryPosts = (() => {
    if (!query) return allCategoryPosts;
    
    try {
      // Use fuzzy search for better results
      const fuse = new Fuse(allCategoryPosts, {
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
      return allCategoryPosts;
    }
  })();

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        <section className="container max-w-3xl py-12">
          <div className="mb-8">
            <Button asChild variant="ghost" className="mb-4 -ml-4">
              <Link href="/blog">← Back to All Posts</Link>
            </Button>
            
            <h1 className="font-semibold text-3xl tracking-tighter mb-2">
              {title}
            </h1>
            <p className="text-muted-foreground">
              {description}
            </p>
          </div>
          
          {/* Search Bar */}
          <CategoryBlogSearch 
            category={category} 
            placeholder={searchPlaceholder} 
          />
          
          {query && (
            <div className="mb-6 mt-2 text-sm text-muted-foreground">
              {categoryPosts.length === 0 ? (
                <p>No results found for &quot;{query}&quot;</p>
              ) : (
                <p>
                  Found {categoryPosts.length} result{categoryPosts.length !== 1 ? 's' : ''} for &quot;{query}&quot;
                </p>
              )}
            </div>
          )}
          
          <Separator className="mb-8" />

          <div className="space-y-4">
            {categoryPosts && categoryPosts.length > 0 ? (
              categoryPosts.map((post, index) => (
                <div key={post.slug} className="pb-0">
                  <div className="flex flex-col space-y-2 mb-3">
                    <Link
                      className="flex flex-col space-y-3 group"
                      href={`/blog/${category}/${post.slug}`}
                    >
                      <h2 className="text-xl font-medium group-hover:text-primary transition-colors">
                        {post.frontMatter.title}
                      </h2>
                      <p className="text-muted-foreground">
                        {post.frontMatter.description}
                      </p>
                    </Link>
                    <div className="flex flex-col gap-2 text-sm text-muted-foreground">
                      {/* Date and reading time - always on top, never compressed */}
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>{formatDate(post.frontMatter.date)}</span>
                        </div>
                        <span>•</span>
                        <span>{post.frontMatter.readTime}</span>
                      </div>

                      {/* Tags - separate row that can wrap freely */}
                      {post.frontMatter.tags && Array.isArray(post.frontMatter.tags) && post.frontMatter.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {post.frontMatter.tags.map((tag: string) => (
                            <Badge
                              key={tag}
                              variant="secondary"
                              className="flex items-center gap-1"
                            >
                              <Tag className="h-3 w-3" />
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {index < categoryPosts.length - 1 && <Separator className="mb-3" />}
                </div>
              ))
            ) : (
              <p className="text-muted-foreground">No {category} posts found.</p>
            )}
          </div>
        </section>
      </main>
    </div>
  );
} 