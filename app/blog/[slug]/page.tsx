import { ArrowLeft, Calendar, Tag } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"

import { MDXWrapper } from "@/components/mdx-wrapper"
import { ShareButtons } from "@/components/share-buttons"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { getPostBySlug, getPostSlugs } from "@/lib/mdx"
import { formatDate, getBaseUrl } from "@/lib/utils"

// Get base URL for absolute URLs in metadata
const baseUrl = getBaseUrl();

// Route segment config for better caching
export const dynamic = 'force-static'
export const revalidate = false

// Generate static params for uncategorized blog posts only
export async function generateStaticParams() {
  try {
    const posts = getPostSlugs()
    // Get all posts and filter out categorized ones
    const allPosts = await Promise.all(
      posts.map(async (slug) => {
        const post = await getPostBySlug(slug)
        return post
      })
    )
    
    // Only return slugs for posts without a category (uncategorized posts)
    const uncategorizedPosts = allPosts
      .filter((post): post is NonNullable<typeof post> => post !== null)
      .filter(post => !post.frontMatter.category)
      .map(post => ({ slug: post.slug }))
    
    return uncategorizedPosts
  } catch (error) {
    console.error('Error generating static params:', error)
    return []
  }
}

// Generate metadata for the page
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  try {
    const resolvedParams = await params
    const post = await getPostBySlug(resolvedParams.slug)
    if (!post) {
      return {
        title: 'Post Not Found',
      }
    }

    const { title, description, date } = post.frontMatter
    const ogImage = post.frontMatter.image 
      ? post.frontMatter.image 
      : `${baseUrl}/og?title=${encodeURIComponent(title)}`

    return {
      title,
      description,
      alternates: {
        canonical: `${baseUrl}/blog/${post.slug}`,
      },
      openGraph: {
        title,
        description,
        type: 'article',
        publishedTime: date,
        url: `${baseUrl}/blog/${post.slug}`,
        images: [
          {
            url: ogImage,
          },
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: [ogImage],
      },
    }
  } catch (error) {
    console.error('Error generating metadata:', error)
    return {
      title: 'Post Not Found',
    }
  }
}

interface SchemaOrgDefinition {
  type: string;
  name?: string;
  description?: string;
  about?: {
    type: string;
    name: string;
    containedInPlace?: {
      type: string;
      name: string;
      containedInPlace?: {
        type: string;
        name: string;
      };
    };
  };
  audience?: {
    type: string;
    audienceType: string;
  };
  mainEntity?: {
    type: string;
    itemListElement: Array<{
      type: string;
      position: number;
      item: {
        type: string;
        name: string;
      };
    }>;
  };
}

// Helper function to convert type to @type recursively
function convertTypeToAtType(obj: any): any {
  if (!obj || typeof obj !== 'object') return obj;
  
  const result: any = {};
  
  for (const [key, value] of Object.entries(obj)) {
    if (key === 'type') {
      result['@type'] = value;
    } else if (key === 'id') {
      result['@id'] = value;
    } else if (Array.isArray(value)) {
      result[key] = value.map(item => convertTypeToAtType(item));
    } else if (typeof value === 'object') {
      result[key] = convertTypeToAtType(value);
    } else {
      result[key] = value;
    }
  }
  
  return result;
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  try {
    const resolvedParams = await params
    const post = await getPostBySlug(resolvedParams.slug)

    if (!post) {
      console.log(`Post not found for slug: ${resolvedParams.slug}`)
      notFound()
    }

    // For JSON-LD structured data
    const postImage = post.frontMatter.image
      ? `${baseUrl}${post.frontMatter.image}`
      : `${baseUrl}/og?title=${encodeURIComponent(post.frontMatter.title)}`

    // Default BlogPosting schema
    const blogPostingSchema = {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: post.frontMatter.title,
      datePublished: post.frontMatter.date,
      dateModified: post.frontMatter.date,
      description: post.frontMatter.description,
      image: postImage,
      url: `${baseUrl}/blog/${post.slug}`,
      author: {
        '@type': 'Person',
        name: 'Kaivlya',
        url: baseUrl,
      },
      publisher: {
        '@type': 'Organization',
        name: 'Kaivlya',
        logo: {
          '@type': 'ImageObject',
          url: `${baseUrl}/icons/icon.svg`,
        },
      },
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': `${baseUrl}/blog/${post.slug}`,
      },
      keywords: post.frontMatter.tags || [],
      articleSection: 'Blog',
      inLanguage: 'en-US',
    }

    // Process schemas from frontmatter
    const customSchemas = post.frontMatter.schemas
      ?.map((schema: SchemaOrgDefinition) => ({
        '@context': 'https://schema.org',
        '@type': schema.type,
        ...convertTypeToAtType(schema),
        // Remove the type field as it's already used in @type
        type: undefined
      })) || []

    // Combine all schemas
    const schemas = [blogPostingSchema, ...customSchemas]

    return (
      <>
        {/* Schema.org structured data */}
        {schemas.length > 0 && (
          <script
            type="application/ld+json"
            suppressHydrationWarning
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(schemas),
            }}
          />
        )}

        <article className="container max-w-3xl py-12">
          <Button asChild variant="ghost" className="mb-8 -ml-4 gap-1 group">
            <Link href="/blog">
              <ArrowLeft className="h-4 w-4 mr-2 group-hover:translate-x-[-2px] transition-transform" />
              Back to Blog
            </Link>
          </Button>

          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-3xl font-bold tracking-tighter">
                {post.frontMatter.title}
              </h1>
              
              <div className="flex flex-col gap-3 text-sm text-muted-foreground">
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
                      <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                        <Tag className="h-3 w-3" />
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
              
              {post.frontMatter.description && (
                <p className="text-muted-foreground text-lg">
                  {post.frontMatter.description}
                </p>
              )}
              
              {/* Social Sharing Buttons */}
              <div className="flex flex-col gap-2 pt-4">
                <h4 className="text-sm font-medium text-muted-foreground">Share this post</h4>
                <ShareButtons 
                  url={`${baseUrl}/blog/${post.slug}`}
                  title={post.frontMatter.title}
                  description={post.frontMatter.description}
                />
              </div>
            </div>

            <Separator />

            <MDXWrapper 
              source={post.content} 
              clientSide={post.frontMatter.clientSide === true}
            />
          </div>
        </article>
      </>
    )
  } catch (error) {
    console.error('Error in BlogPostPage:', error)
    notFound()
  }
}
