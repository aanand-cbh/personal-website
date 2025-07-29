import { ArrowLeft, Calendar, Tag } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"

import { getTierBadge } from "@/components/blog-utils"
import { MDXWrapper } from "@/components/mdx-wrapper"
import { ShareButtons } from "@/components/share-buttons"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { getPostBySlug } from "@/lib/mdx"
import { formatDate, getBaseUrl } from "@/lib/utils"

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

interface BlogPostPageProps {
  slug: string;
  category?: string;
  categoryTitle?: string;
  categoryDisplayName?: string;
  backLink: string;
  backLinkText: string;
  articleSection?: string;
  tagsAtBottom?: boolean;
}

export async function BlogPostPage({ 
  slug, 
  category, 
  categoryTitle, 
  categoryDisplayName,
  backLink, 
  backLinkText, 
  articleSection = 'Blog',
  tagsAtBottom = true
}: BlogPostPageProps) {
  const baseUrl = getBaseUrl();
  
  try {
    const post = await getPostBySlug(slug)

    if (!post) {
      console.log(`Post not found for slug: ${slug}`)
      notFound()
    }

    // Verify category if specified
    if (category && post.frontMatter.category !== category) {
      notFound()
    }

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
      url: `${baseUrl}${backLink}/${post.slug}`,
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
        '@id': `${baseUrl}${backLink}/${post.slug}`,
      },
      keywords: post.frontMatter.tags || [],
      articleSection,
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
            <Link href={backLink}>
              <ArrowLeft className="h-4 w-4 mr-2 group-hover:translate-x-[-2px] transition-transform" />
              {backLinkText}
            </Link>
          </Button>

          <div className="space-y-8">
            <div className="space-y-4">
              {/* Category badge */}
              {categoryDisplayName && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <Badge variant="outline">{categoryDisplayName}</Badge>
                  {/* Add tier badge next to category */}
                  {post.frontMatter.tier && getTierBadge(post.frontMatter.tier)}
                </div>
              )}
              
              <h1 className="text-3xl font-bold tracking-tighter">
                {post.frontMatter.title}
              </h1>
              
              {/* Add tier badge if present (for uncategorized posts) */}
              {!categoryDisplayName && post.frontMatter.tier && (
                <div className="flex items-center gap-2">
                  {getTierBadge(post.frontMatter.tier)}
                </div>
              )}
              
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

                {/* Tags - only show in header if not moved to bottom */}
                {!tagsAtBottom && post.frontMatter.tags && Array.isArray(post.frontMatter.tags) && post.frontMatter.tags.length > 0 && (
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
                  url={`${baseUrl}${backLink}/${post.slug}`}
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

            {/* Tags section at the bottom */}
            {tagsAtBottom && post.frontMatter.tags && Array.isArray(post.frontMatter.tags) && post.frontMatter.tags.length > 0 && (
              <>
                <Separator />
                <div className="space-y-4">
                  <h4 className="text-sm font-medium text-muted-foreground">Tags</h4>
                  <div className="flex flex-wrap gap-2">
                    {post.frontMatter.tags.map((tag: string) => (
                      <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                        <Tag className="h-3 w-3" />
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </article>
      </>
    )
  } catch (error) {
    console.error('Error in BlogPostPage:', error)
    notFound()
  }
} 