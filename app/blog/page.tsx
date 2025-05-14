import Link from "next/link"
import { ArrowRight, Calendar } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { SiteHeader } from "@/components/site-header"

export default function BlogPage() {
  // This would typically come from a CMS or file system
  const blogPosts = [
    {
      slug: "getting-started",
      title: "Getting Started with My Personal Website",
      description: "How I built this website and what I learned along the way",
      date: "May 14, 2025",
      readTime: "5 min read",
    },
    {
      slug: "favorite-resources",
      title: "My Favorite Web Development Resources",
      description: "A collection of tools and websites that have helped me in my journey",
      date: "May 10, 2025",
      readTime: "8 min read",
    },
    {
      slug: "learning-nextjs",
      title: "Learning Next.js: My Experience",
      description: "My thoughts on learning and using Next.js for web development",
      date: "May 5, 2025",
      readTime: "6 min read",
    },
  ]

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">My Blog</h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                  Thoughts, ideas, and reflections on various topics
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 lg:grid-cols-2">
              {blogPosts.map((post) => (
                <Card key={post.slug} className="h-full flex flex-col">
                  <CardHeader>
                    <CardTitle>{post.title}</CardTitle>
                    <CardDescription>{post.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                      <Calendar className="h-4 w-4" />
                      <span>{post.date}</span>
                      <span>•</span>
                      <span>{post.readTime}</span>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button asChild variant="ghost" className="w-full justify-start gap-1">
                      <Link href={`/blog/${post.slug}`}>
                        Read More
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>
      <footer className="w-full border-t bg-background py-6">
        <div className="container flex flex-col items-center justify-center gap-4 px-4 md:px-6 md:flex-row">
          <p className="text-sm text-gray-500 dark:text-gray-400">
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
