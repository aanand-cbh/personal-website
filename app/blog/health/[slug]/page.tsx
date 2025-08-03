import { ArrowLeft, Calendar, Tag } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"

import { getTierBadge } from "@/components/blog-utils"
import { MDXWrapper } from "@/components/mdx-wrapper"
import { ShareButtons } from "@/components/share-buttons"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { getPostBySlug, getPostSlugsByCategory } from "@/lib/mdx"
import { formatDate, getBaseUrl } from "@/lib/utils"

const baseUrl = getBaseUrl();

export const dynamic = 'force-static'
export const revalidate = false

export async function generateStaticParams() {
  const slugs = getPostSlugsByCategory('health')
  return slugs.map(slug => ({ slug }))
}

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
      title: `${title} - Health & Wellness Blog`,
      description,
      alternates: {
        canonical: `${baseUrl}/blog/health/${post.slug}`,
      },
      openGraph: {
        title,
        description,
        type: 'article',
        publishedTime: date,
        url: `${baseUrl}/blog/health/${post.slug}`,
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

export default async function HealthBlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  try {
    const resolvedParams = await params
    const post = await getPostBySlug(resolvedParams.slug)

    if (!post) {
      console.log(`Post not found for slug: ${resolvedParams.slug}`)
      notFound()
    }

    // Verify this is actually a health post - if not, show 404
    if (post.frontMatter.category !== 'health') {
      notFound()
    }

    const postImage = post.frontMatter.image
      ? `${baseUrl}${post.frontMatter.image}`
      : `${baseUrl}/og?title=${encodeURIComponent(post.frontMatter.title)}`

    const blogPostingSchema = {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: post.frontMatter.title,
      datePublished: post.frontMatter.date,
      dateModified: post.frontMatter.date,
      description: post.frontMatter.description,
      image: postImage,
      url: `${baseUrl}/blog/health/${post.slug}`,
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
        '@id': `${baseUrl}/blog/health/${post.slug}`,
      },
      keywords: post.frontMatter.tags || [],
      articleSection: 'Health & Wellness',
      inLanguage: 'en-US',
    }

    return (
      <>
        <script
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(blogPostingSchema),
          }}
        />

        <article className="container max-w-3xl py-12">
          <Button asChild variant="ghost" className="mb-8 -ml-4 gap-1 group">
            <Link href="/blog/health">
              <ArrowLeft className="h-4 w-4 mr-2 group-hover:translate-x-[-2px] transition-transform" />
              Back to Health & Wellness Blog
            </Link>
          </Button>

          <div className="space-y-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                <Badge variant="outline">Health & Wellness</Badge>
                {/* Add tier badge next to category */}
                {post.frontMatter.tier && getTierBadge(post.frontMatter.tier)}
              </div>
              
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
              
              <div className="flex flex-col gap-2 pt-4">
                <h4 className="text-sm font-medium text-muted-foreground">Share this post</h4>
                <ShareButtons 
                  url={`${baseUrl}/blog/health/${post.slug}`}
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
    console.error('Error in HealthBlogPostPage:', error)
    notFound()
  }
} 