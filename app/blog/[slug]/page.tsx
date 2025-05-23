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

// Generate static params for all blog posts
export async function generateStaticParams() {
  const posts = getPostSlugs()
  return posts.map((slug) => ({ slug }))
}

// Generate metadata for the page
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
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
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params
  const post = await getPostBySlug(resolvedParams.slug)

  if (!post) {
    notFound()
  }

  // For JSON-LD structured data
  const postImage = post.frontMatter.image
    ? `${baseUrl}${post.frontMatter.image}`
    : `${baseUrl}/og?title=${encodeURIComponent(post.frontMatter.title)}`

  const jsonLd = {
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

  return (
    <>
      {/* JSON-LD structured data for SEO */}
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd),
        }}
      />

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
                      <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                        <Tag className="h-3 w-3" />
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </>
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
}
