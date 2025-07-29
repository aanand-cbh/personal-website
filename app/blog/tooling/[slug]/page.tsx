import { BlogPostPage } from "@/components/blog-post-page"
import { generateBlogMetadata } from "@/lib/blog-metadata"
import { getPostSlugsByCategory } from "@/lib/mdx"

export const dynamic = 'force-static'
export const revalidate = false

export async function generateStaticParams() {
  const slugs = getPostSlugsByCategory('tooling')
  return slugs.map(slug => ({ slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params
  return generateBlogMetadata({
    slug: resolvedParams.slug,
    categoryTitle: 'Developer Tools Blog',
    backLink: '/blog/tooling',
    category: 'tooling'
  })
}

export default async function ToolingBlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params
  
  return (
    <BlogPostPage
      slug={resolvedParams.slug}
      category="tooling"
      categoryTitle="Developer Tools Blog"
      categoryDisplayName="Developer Tools"
      backLink="/blog/tooling"
      backLinkText="Back to Developer Tools Blog"
      articleSection="Developer Tools"
    />
  )
} 