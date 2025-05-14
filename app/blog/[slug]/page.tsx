import Link from "next/link"
import { ArrowLeft, Calendar } from "lucide-react"

import { Button } from "@/components/ui/button"
import { SiteHeader } from "@/components/site-header"

// This would typically come from a CMS or file system
const blogPosts = {
  "getting-started": {
    title: "Getting Started with My Personal Website",
    date: "May 14, 2025",
    readTime: "5 min read",
    content: `
      <p>Building a personal website is a rewarding experience. It gives you a place to showcase your work, share your thoughts, and connect with others. In this post, I'll share how I built this website and what I learned along the way.</p>
      
      <h2>Why I Built This Website</h2>
      <p>I wanted a place to collect useful resources I've found and share my thoughts on various topics. A personal website seemed like the perfect solution.</p>
      
      <h2>The Technology Stack</h2>
      <p>I chose Next.js for this website because it offers a great developer experience and excellent performance. Combined with Tailwind CSS for styling, it's a powerful combination for building modern websites.</p>
      
      <h2>What I Learned</h2>
      <p>Building this website taught me a lot about web development, design, and content creation. I learned how to structure a website, how to make it responsive, and how to optimize it for performance.</p>
      
      <h2>Next Steps</h2>
      <p>I plan to continue adding to this website, both in terms of content and functionality. I'm excited to see how it evolves over time.</p>
    `,
  },
  "favorite-resources": {
    title: "My Favorite Web Development Resources",
    date: "May 10, 2025",
    readTime: "8 min read",
    content: `
      <p>Over the years, I've collected a number of resources that have been invaluable in my web development journey. In this post, I'll share some of my favorites.</p>
      
      <h2>Documentation</h2>
      <p>Good documentation is essential for any developer. MDN Web Docs is my go-to resource for web development documentation. It's comprehensive, well-written, and regularly updated.</p>
      
      <h2>Learning Platforms</h2>
      <p>There are many great platforms for learning web development. Some of my favorites include freeCodeCamp, Codecademy, and Frontend Masters.</p>
      
      <h2>Tools</h2>
      <p>The right tools can make a big difference in your development workflow. VS Code is my editor of choice, and I use Git for version control. For design, I like Figma.</p>
      
      <h2>Communities</h2>
      <p>Being part of a community can provide support, inspiration, and opportunities to learn. Stack Overflow, GitHub, and various Discord servers are great places to connect with other developers.</p>
    `,
  },
  "learning-nextjs": {
    title: "Learning Next.js: My Experience",
    date: "May 5, 2025",
    readTime: "6 min read",
    content: `
      <p>Next.js is a powerful framework for building React applications. In this post, I'll share my experience learning and using Next.js.</p>
      
      <h2>Why Next.js?</h2>
      <p>I chose Next.js because it offers a great developer experience, excellent performance, and a lot of built-in features that make building web applications easier.</p>
      
      <h2>Getting Started</h2>
      <p>Getting started with Next.js is straightforward. The documentation is excellent, and there are many tutorials and courses available.</p>
      
      <h2>Features I Love</h2>
      <p>Some of my favorite features of Next.js include file-based routing, server-side rendering, and API routes. These features make it easy to build complex applications.</p>
      
      <h2>Challenges</h2>
      <p>Like any technology, Next.js has its challenges. Understanding the different rendering strategies and when to use each one took some time.</p>
      
      <h2>Conclusion</h2>
      <p>Overall, I've had a positive experience learning and using Next.js. It's a powerful tool that I'll continue to use for future projects.</p>
    `,
  },
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = blogPosts[params.slug as keyof typeof blogPosts]

  if (!post) {
    return (
      <div className="flex min-h-screen flex-col">
        <SiteHeader />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-3xl font-bold">Post Not Found</h1>
            <p className="mt-4">The blog post you're looking for doesn't exist.</p>
            <Button asChild className="mt-6">
              <Link href="/blog">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Blog
              </Link>
            </Button>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <article className="container max-w-3xl px-4 py-12 md:py-24 lg:py-32">
          <Button asChild variant="ghost" className="mb-8 -ml-4 gap-1">
            <Link href="/blog">
              <ArrowLeft className="h-4 w-4" />
              Back to Blog
            </Link>
          </Button>
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">{post.title}</h1>
            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <Calendar className="h-4 w-4" />
              <span>{post.date}</span>
              <span>•</span>
              <span>{post.readTime}</span>
            </div>
          </div>
          <div
            className="prose prose-gray max-w-none dark:prose-invert mt-8"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </article>
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
