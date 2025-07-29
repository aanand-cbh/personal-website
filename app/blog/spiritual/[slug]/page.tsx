import { BlogPostPage } from "@/components/blog-post-page"
import { generateBlogMetadata } from "@/lib/blog-metadata"
import { getPostSlugsByCategory } from "@/lib/mdx"

export const dynamic = 'force-static'
export const revalidate = false

export async function generateStaticParams() {
  const slugs = getPostSlugsByCategory('spiritual')
  return slugs.map(slug => ({ slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params
  return generateBlogMetadata({
    slug: resolvedParams.slug,
    categoryTitle: 'Spiritual Blog',
    backLink: '/blog/spiritual',
    category: 'spiritual'
  })
}

export default async function SpiritualBlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params
  
  return (
    <BlogPostPage
      slug={resolvedParams.slug}
      category="spiritual"
      categoryTitle="Spiritual Blog"
      categoryDisplayName="Spiritual"
      backLink="/blog/spiritual"
      backLinkText="Back to Spiritual Blog"
      articleSection="Spiritual"
    />
  )
} 