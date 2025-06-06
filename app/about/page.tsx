import { FileText } from "lucide-react"
import type { Metadata } from "next"
import Image from "next/image"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { getBaseUrl } from "@/lib/utils"

const baseUrl = getBaseUrl()

export const metadata: Metadata = {
  title: "About Me",
  description: "Learn more about Kaivlya - A technology enthusiast and software developer passionate about sharing knowledge and resources",
  openGraph: {
    title: "About Me",
    description: "Learn more about Kaivlya - A technology enthusiast and software developer passionate about sharing knowledge and resources",
    type: "website",
    url: `${baseUrl}/about`,
    images: [
      {
        url: `${baseUrl}/og?title=About Me`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "About Me",
    description: "Learn more about Kaivlya - A technology enthusiast and software developer passionate about sharing knowledge and resources",
    images: [`${baseUrl}/og?title=About Me`],
  },
}

// JSON-LD structured data for the about page
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'AboutPage',
  name: 'About Kaivlya',
  description: 'Learn more about Kaivlya - A technology enthusiast and software developer passionate about sharing knowledge and resources',
  url: `${baseUrl}/about`,
  mainEntity: {
    '@type': 'Person',
    name: 'Kaivlya',
    description: 'A technology enthusiast and software developer passionate about sharing knowledge and resources',
    url: baseUrl,
    sameAs: [
      'https://linkedin.com/in/abhishekaanand',
    ],
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

export default function AboutPage() {
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
              <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
                <div className="flex flex-col justify-center space-y-4">
                  <div className="space-y-2">
                    <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">About Me</h1>
                    <p className="max-w-[600px] text-gray-500 md:text-xl dark:text-gray-400">
                      Hi, I'm the creator of kaivlya.com. I'm passionate about sharing knowledge and resources that I find
                      valuable.
                    </p>
                  </div>
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <h2 className="text-2xl font-bold">Background</h2>
                      <p className="text-gray-500 dark:text-gray-400">
                        I have a background in technology and enjoy exploring various domains of knowledge. This website
                        serves as my digital garden where I collect useful resources and share my thoughts.
                      </p>
                    </div>
                    <div className="space-y-2">
                      <h2 className="text-2xl font-bold">Interests</h2>
                      <p className="text-gray-500 dark:text-gray-400">
                        My interests span across technology, science, philosophy, and personal development. I'm constantly
                        learning and expanding my horizons, and I use this platform to document my journey.
                      </p>
                    </div>
                    <div className="space-y-2">
                      <h2 className="text-2xl font-bold">Connect With Me</h2>
                      <div className="flex flex-col gap-2 min-[400px]:flex-row">
                        <Button asChild variant="outline" className="gap-1">
                          <a href="https://linkedin.com/in/abhishekaanand" target="_blank" rel="noopener noreferrer">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="h-4 w-4"
                            >
                              <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                              <rect width="4" height="12" x="2" y="9"></rect>
                              <circle cx="4" cy="4" r="2"></circle>
                            </svg>
                            LinkedIn
                          </a>
                        </Button>
                        <Button asChild variant="outline" className="gap-1">
                          <a href="/resume.pdf" target="_blank" rel="noopener noreferrer">
                            <FileText className="h-4 w-4" />
                            Resume
                          </a>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
                <Card className="overflow-hidden">
                  <CardContent className="p-0">
                    <Image
                      src="/placeholder.svg?height=800&width=600"
                      alt="Profile"
                      width={600}
                      height={800}
                      className="aspect-[3/4] object-cover"
                    />
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>
        </main>
      </div>
    </>
  )
}
