import { BlogPostPage } from "@/components/blog-post-page"
import { generateBlogMetadata } from "@/lib/blog-metadata"
import { getPostSlugsByCategory } from "@/lib/mdx"

export const dynamic = 'force-static'
export const revalidate = false

export async function generateStaticParams() {
  const slugs = getPostSlugsByCategory('personal')
  return slugs.map(slug => ({ slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params
  return generateBlogMetadata({
    slug: resolvedParams.slug,
    categoryTitle: 'Personal Blog',
    backLink: '/blog/personal',
    category: 'personal'
  })
}

export default async function PersonalBlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params
  
  return (
    <BlogPostPage
      slug={resolvedParams.slug}
      category="personal"
      categoryTitle="Personal Blog"
      categoryDisplayName="Personal"
      backLink="/blog/personal"
      backLinkText="Back to Personal Blog"
      articleSection="Personal"
    />
  )
} 