import resourceData from "@/data/resources.json"
import { ArrowRight, MoveRight } from "lucide-react"
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
  const linkCategories = resourceData.categories.map((cat) => ({
    title: cat.title,
    description: cat.description,
    links: cat.subcategories.flatMap((sub) => sub.links.slice(0, 3)) // show up to 3 links per category
  }))

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
                <div className="flex flex-row gap-4">
                  <Button asChild>
                    <Link href="/blog" className="group">
                      Read My Blog
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
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
              <div className="relative mx-auto max-w-5xl">
                <div className="grid grid-cols-1 gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
                  {linkCategories.map((category) => (
                    <Card key={category.title} className="h-full">
                      <CardHeader>
                        <CardTitle>{category.title}</CardTitle>
                        <CardDescription>{category.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-4">
                          {category.links.map((link) => (
                            <li key={link.name}>
                              <a
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex flex-col space-y-1 hover:underline"
                              >
                                <span className="font-medium">{link.name}</span>
                                <span className="text-sm text-gray-500 dark:text-gray-400">{link.description}</span>
                              </a>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                {/* View All Resources Button */}
                <div className="flex justify-center mt-8">
                  <Button asChild size="lg">
                    <Link href="/resources" className="group">
                      View All Resources
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </Button>
                </div>
                {/* Desktop Arrow Button */}
                <Link 
                  href="/resources" 
                  className="absolute -right-36 top-1/2 -translate-y-1/2 hidden lg:block"
                  aria-label="View all resources"
                >
                  <Button 
                    size="lg" 
                    variant="ghost" 
                    className="h-48 w-48 rounded-full p-0 hover:bg-transparent hover:scale-110 transition-transform flex items-center justify-center"
                    aria-hidden="true"
                  >
                    <MoveRight className="h-40 w-40 text-foreground" strokeWidth={1.5} />
                  </Button>
                </Link>
                {/* Legal Disclaimer */}
                <div className="mt-12 text-center">
                  <p className="text-xs text-muted-foreground max-w-2xl mx-auto">
                    Disclaimer: The resources provided on this website are for informational and educational purposes only. 
                    We do not claim ownership of any external content linked herein. Users are responsible for verifying the 
                    legality of their use of these resources and must comply with all applicable laws and regulations. 
                    For more information, please refer to our{' '}
                    <Link href="/terms" className="underline hover:text-foreground">
                      Terms of Service
                    </Link>
                    {' '}and{' '}
                    <Link href="/privacy" className="underline hover:text-foreground">
                      Privacy Policy
                    </Link>
                    .
                  </p>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </>
  )
}
