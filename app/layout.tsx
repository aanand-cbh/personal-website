import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/next"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import type React from "react"
import "./globals.css"

import { ErrorBoundary } from "@/components/error-boundary"
import { QueryProvider } from "@/components/providers/query-provider"
import { ScrollToTop } from "@/components/scroll-to-top"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { cn, getBaseUrl } from "@/lib/utils"

// Load Inter font with preload
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  preload: true,
  fallback: ["system-ui", "arial"],
})

// Use the getBaseUrl function to dynamically set the metadata base URL
const baseUrl = getBaseUrl()

// Route segment config
export const fetchCache = 'force-cache' // ensure all data fetching is cached

export const metadata: Metadata = {
  title: {
    default: "Kaivlya",
    template: "%s | Kaivlya",
  },
  description: "A personal website with useful resources and blog posts about technology, software development, and personal growth",
  keywords: [
    "blog",
    "personal website",
    "portfolio",
    "software development",
    "technology",
    "web development",
    "programming",
    "tech blog",
    "developer blog",
    "personal growth"
  ],
  authors: [
    {
      name: "Kaivlya",
    },
  ],
  creator: "Kaivlya",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: baseUrl,
    title: "Kaivlya",
    description: "Personal website and blog of Kaivlya - Technology, Software Development, and Personal Growth",
    siteName: "Kaivlya",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kaivlya",
    description: "Personal website and blog of Kaivlya - Technology, Software Development, and Personal Growth",
    creator: "@kaivlya",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: "/icons/favicon.ico", sizes: "any" },
      { url: "/icons/icon.svg", type: "image/svg+xml" }
    ],
    apple: [
      { url: "/icons/apple-touch-icon.png", sizes: "180x180", type: "image/png" }
    ],
    other: [
      {
        rel: "mask-icon",
        url: "/icons/safari-pinned-tab.svg",
        color: "#5bbad5"
      }
    ]
  },
  manifest: "/site.webmanifest",
  metadataBase: new URL(baseUrl)
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          inter.className
        )}
      >
        <ErrorBoundary>
          <QueryProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <div className="relative flex min-h-screen flex-col">
                <SiteHeader />
                <main className="flex-1">{children}</main>
                <SiteFooter />
              </div>
              <Toaster />
              <Analytics />
              <SpeedInsights />
              <ScrollToTop />
            </ThemeProvider>
          </QueryProvider>
        </ErrorBoundary>
      </body>
    </html>
  )
}
