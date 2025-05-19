import { ArrowLeft, Calendar, Tag } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"

import { MDXContent } from "@/components/mdx-content"
import { SiteHeader } from "@/components/site-header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { getPostBySlug, getPostSlugs } from "@/lib/mdx"

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
  return {
    title: post.frontMatter.title,
    description: post.frontMatter.description,
  }
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params
  const post = await getPostBySlug(resolvedParams.slug)

  if (!post) {
    notFound()
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <article className="container max-w-3xl px-4 py-12 md:py-24 lg:py-32">
          <Button asChild variant="ghost" className="mb-8 -ml-4 gap-1 group">
            <Link href="/blog">
              <ArrowLeft className="h-4 w-4 mr-2 group-hover:translate-x-[-2px] transition-transform" />
              Back to Blog
            </Link>
          </Button>

          <Card className="overflow-hidden border-none shadow-none">
            <CardContent className="p-0">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  {post.frontMatter.title}
                </h1>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {new Date(post.frontMatter.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                  <span>•</span>
                  <span>{post.frontMatter.readTime}</span>
                </div>
                {post.frontMatter.tags && post.frontMatter.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    {post.frontMatter.tags.map((tag: string) => (
                      <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                        <Tag className="h-3 w-3" />
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              <Separator className="my-8" />

              <MDXContent source={post.mdxSource} />
            </CardContent>
          </Card>
        </article>
      </main>
      <footer className="w-full border-t bg-background py-6">
        <div className="container flex flex-col items-center justify-center gap-4 px-4 md:px-6 md:flex-row">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} kaivlya.com. All rights reserved.
          </p>
          <nav className="flex gap-4">
            <Link href="/" className="text-sm hover:underline">
              Home
            </Link>
            <Link href="/about" className="text-sm hover:underline">
              About
            </Link>
            <Link href="/blog" className="text-sm hover:underline">
              Blog
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  )
}
