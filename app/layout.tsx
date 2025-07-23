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
import { GoogleAnalytics } from '@next/third-parties/google'

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
      <head suppressHydrationWarning>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Enhanced hydration safety - prevent browser extensions from causing hydration mismatches
              (function() {
                // Store original methods
                const originalSetAttribute = Element.prototype.setAttribute;
                const originalClassNameDescriptor = Object.getOwnPropertyDescriptor(Element.prototype, 'className');
                
                // Override setAttribute to prevent browser extension modifications
                Element.prototype.setAttribute = function(name, value) {
                  if (name === 'class' || name === 'className') {
                    // Check if this is a browser extension modification
                    if (typeof value === 'string') {
                      const hasExtensionClass = /clutterFree_|clutter|extension_|cf_|darkreader|ublock|adblock/i.test(value);
                      if (hasExtensionClass) {
                        // Don't set the attribute if it's a browser extension modification
                        return;
                      }
                    }
                  }
                  return originalSetAttribute.call(this, name, value);
                };
                
                // Override className setter to prevent browser extension modifications
                Object.defineProperty(Element.prototype, 'className', {
                  get: function() {
                    return this.getAttribute('class') || '';
                  },
                  set: function(value) {
                    if (typeof value === 'string') {
                      // Check if this is a browser extension modification
                      const hasExtensionClass = /clutterFree_|clutter|extension_|cf_|darkreader|ublock|adblock/i.test(value);
                      if (!hasExtensionClass) {
                        this.setAttribute('class', value);
                      }
                    }
                  },
                  configurable: true
                });
                
                // Enhanced cleanup function
                function cleanupExtensionClasses() {
                  const elements = document.querySelectorAll('*');
                  elements.forEach(function(element) {
                    if (element.className && typeof element.className === 'string') {
                      const cleaned = element.className
                        .replace(/\\bclutterFree_[^\\s]*/g, '')
                        .replace(/\\bclutter[^\\s]*/g, '')
                        .replace(/\\bextension_[^\\s]*/g, '')
                        .replace(/\\bcf_[^\\s]*/g, '')
                        .replace(/\\bdarkreader[^\\s]*/g, '')
                        .replace(/\\bublock[^\\s]*/g, '')
                        .replace(/\\badblock[^\\s]*/g, '')
                        .replace(/\\s+/g, ' ')
                        .trim();
                      if (cleaned !== element.className) {
                        element.setAttribute('class', cleaned);
                      }
                    }
                  });
                }
                
                // Run cleanup at multiple intervals to catch all modifications
                const cleanupIntervals = [0, 50, 100, 200, 500, 1000];
                cleanupIntervals.forEach(delay => {
                  setTimeout(cleanupExtensionClasses, delay);
                });
                
                // Also run cleanup when DOM is ready
                if (document.readyState === 'loading') {
                  document.addEventListener('DOMContentLoaded', cleanupExtensionClasses);
                } else {
                  cleanupExtensionClasses();
                }
                
                // Monitor for new elements and clean them
                const observer = new MutationObserver(function(mutations) {
                  mutations.forEach(function(mutation) {
                    if (mutation.type === 'childList') {
                      mutation.addedNodes.forEach(function(node) {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                          cleanupExtensionClasses();
                        }
                      });
                    }
                  });
                });
                
                // Start observing when DOM is ready
                if (document.readyState === 'loading') {
                  document.addEventListener('DOMContentLoaded', function() {
                    observer.observe(document.body, { childList: true, subtree: true });
                  });
                } else {
                  observer.observe(document.body, { childList: true, subtree: true });
                }
              })();
            `,
          }}
        />
      </head>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          inter.className
        )}
        suppressHydrationWarning={true}
      >
        <GoogleAnalytics gaId="G-9D5QL34VTT" />
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
