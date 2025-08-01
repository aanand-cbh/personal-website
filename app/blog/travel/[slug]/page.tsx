import { BlogPostPage } from "@/components/blog-post-page"
import { generateBlogMetadata } from "@/lib/blog-metadata"
import { getPostSlugsByCategory } from "@/lib/mdx"

export const dynamic = 'force-static'
export const revalidate = false

export async function generateStaticParams() {
  const slugs = getPostSlugsByCategory('travel')
  return slugs.map(slug => ({ slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params
  return generateBlogMetadata({
    slug: resolvedParams.slug,
    categoryTitle: 'Travel Blog',
    backLink: '/blog/travel',
    category: 'travel'
  })
}

export default async function TravelBlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params
  
  return (
    <BlogPostPage
      slug={resolvedParams.slug}
      category="travel"
      categoryTitle="Travel Blog"
      categoryDisplayName="Travel"
      backLink="/blog/travel"
      backLinkText="Back to Travel Blog"
      articleSection="Travel"
    />
  )
} 