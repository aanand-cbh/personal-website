import { getPostSlugsByCategory } from "@/lib/mdx"
import { generateBlogMetadata } from "@/lib/blog-metadata"
import { BlogPostPage } from "@/components/blog-post-page"

export const dynamic = 'force-static'
export const revalidate = false

export async function generateStaticParams() {
  const slugs = getPostSlugsByCategory('money')
  return slugs.map(slug => ({ slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params
  return generateBlogMetadata({
    slug: resolvedParams.slug,
    categoryTitle: 'Money Matters Blog',
    backLink: '/blog/money',
    category: 'money'
  })
}

export default async function MoneyBlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params
  
  return (
    <BlogPostPage
      slug={resolvedParams.slug}
      category="money"
      categoryTitle="Money Matters Blog"
      categoryDisplayName="Money Matters"
      backLink="/blog/money"
      backLinkText="Back to Money Matters Blog"
      articleSection="Money Matters"
    />
  )
} 