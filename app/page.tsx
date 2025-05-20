import { ArrowRight } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getBaseUrl } from "@/lib/utils"

const baseUrl = getBaseUrl()

// JSON-LD structured data for the home page
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Kaivlya',
  description: 'A personal website with useful resources and blog posts about technology, software development, and personal growth',
  url: baseUrl,
  potentialAction: {
    '@type': 'SearchAction',
    target: `${baseUrl}/search?q={search_term_string}`,
    'query-input': 'required name=search_term_string'
  },
  publisher: {
    '@type': 'Organization',
    name: 'Kaivlya',
    logo: {
      '@type': 'ImageObject',
      url: `${baseUrl}/icons/icon.svg`,
    },
  },
  inLanguage: 'en-US',
}

export default function HomePage() {
  const linkCategories = [
    {
      title: "Development",
      description: "Useful resources for software development",
      links: [
        { title: "GitHub", url: "https://github.com", description: "Code hosting platform" },
        { title: "Stack Overflow", url: "https://stackoverflow.com", description: "Developer Q&A community" },
        { title: "MDN Web Docs", url: "https://developer.mozilla.org", description: "Web development documentation" },
      ],
    },
    {
      title: "Design",
      description: "Resources for UI/UX design",
      links: [
        { title: "Dribbble", url: "https://dribbble.com", description: "Design inspiration" },
        { title: "Figma", url: "https://figma.com", description: "Design tool" },
        { title: "Unsplash", url: "https://unsplash.com", description: "Free high-quality images" },
      ],
    },
    {
      title: "Learning",
      description: "Educational resources",
      links: [
        { title: "Coursera", url: "https://coursera.org", description: "Online courses" },
        { title: "Khan Academy", url: "https://khanacademy.org", description: "Free education" },
        { title: "freeCodeCamp", url: "https://freecodecamp.org", description: "Learn to code for free" },
      ],
    },
  ]

  return (
    <>
      {/* JSON-LD structured data for SEO */}
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd),
        }}
      />
      <div className="flex min-h-screen flex-col">
        <main className="flex-1">
          <section className="w-full py-12 md:py-24 lg:py-32">
            <div className="container px-4 md:px-6">
              <div className="flex flex-col items-center justify-center space-y-4 text-center">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Welcome to kaivlya.com</h1>
                  <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                    A curated collection of useful resources and personal thoughts
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button asChild>
                    <Link href="/blog">
                      Read My Blog
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline">
                    <Link href="/about">About Me</Link>
                  </Button>
                </div>
              </div>
            </div>
          </section>
          <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-50 dark:bg-gray-900">
            <div className="container px-4 md:px-6">
              <div className="flex flex-col items-center justify-center space-y-4 text-center">
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Useful Resources</h2>
                  <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                    A collection of links I've found helpful, organized by category
                  </p>
                </div>
              </div>
              <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
                {linkCategories.map((category) => (
                  <Card key={category.title} className="h-full">
                    <CardHeader>
                      <CardTitle>{category.title}</CardTitle>
                      <CardDescription>{category.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-4">
                        {category.links.map((link) => (
                          <li key={link.title}>
                            <a
                              href={link.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex flex-col space-y-1 hover:underline"
                            >
                              <span className="font-medium">{link.title}</span>
                              <span className="text-sm text-gray-500 dark:text-gray-400">{link.description}</span>
                            </a>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        </main>
      </div>
    </>
  )
}
