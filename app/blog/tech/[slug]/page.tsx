import { getPostSlugsByCategory } from "@/lib/mdx"
import { generateBlogMetadata } from "@/lib/blog-metadata"
import { BlogPostPage } from "@/components/blog-post-page"

export const dynamic = 'force-static'
export const revalidate = false

export async function generateStaticParams() {
  const slugs = getPostSlugsByCategory('tech')
  return slugs.map(slug => ({ slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params
  return generateBlogMetadata({
    slug: resolvedParams.slug,
    categoryTitle: 'Tech Blog',
    backLink: '/blog/tech',
    category: 'tech'
  })
}

export default async function TechBlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params
  
  return (
    <BlogPostPage
      slug={resolvedParams.slug}
      category="tech"
      categoryTitle="Tech Blog"
      categoryDisplayName="Tech & Software Engineering"
      backLink="/blog/tech"
      backLinkText="Back to Tech Blog"
      articleSection="Technology"
    />
  )
} 