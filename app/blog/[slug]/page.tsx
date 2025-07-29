import { BlogPostPage } from "@/components/blog-post-page"
import { generateBlogMetadata } from "@/lib/blog-metadata"
import { getPostBySlug, getPostSlugs } from "@/lib/mdx"

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
  const resolvedParams = await params
  return generateBlogMetadata({
    slug: resolvedParams.slug,
    backLink: '/blog'
  })
}

export default async function UncategorizedBlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params
  
  return (
    <BlogPostPage
      slug={resolvedParams.slug}
      backLink="/blog"
      backLinkText="Back to Blog"
      articleSection="Blog"
      tagsAtBottom={false}
    />
  )
}
