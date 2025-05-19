import { ArrowRight, Calendar, Tag } from "lucide-react"
import Link from "next/link"

import { SiteHeader } from "@/components/site-header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { getAllPosts } from "@/lib/mdx"

export default async function BlogPage() {
  const posts = await getAllPosts()
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">My Blog</h1>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Thoughts, ideas, and reflections on various topics
                </p>
              </div>
              <Separator className="w-[80px] mx-auto my-4" />
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 lg:grid-cols-2">
              {posts && posts.length > 0 ? (
                posts.map((post) => (
                  <Card key={post.slug} className="h-full flex flex-col overflow-hidden">
                    <CardHeader className="pb-0">
                      <CardTitle className="text-2xl">{post.frontMatter.title}</CardTitle>
                      <CardDescription className="text-base">{post.frontMatter.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1 pt-6">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar suppressHydrationWarning className="h-4 w-4" />
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
                              <Tag suppressHydrationWarning className="h-3 w-3" />
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </CardContent>
                    <CardFooter className="pt-0">
                      <Button
                        asChild
                        variant="ghost"
                        className="w-full justify-start gap-1 px-0 hover:bg-transparent hover:text-primary"
                      >
                        <Link href={`/blog/${post.slug}`}>
                          Read More
                          <ArrowRight suppressHydrationWarning className="h-4 w-4 ml-1" />
                        </Link>
                      </Button>
                    </CardFooter>
                  </Card>
                ))
              ) : (
                <div className="col-span-2 text-center py-12">
                  <h3 className="text-xl font-medium">No blog posts found</h3>
                  <p className="text-muted-foreground mt-2">
                    Start writing by adding Markdown files to the content/blog directory.
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>
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
