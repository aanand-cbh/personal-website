import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/next"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import type React from "react"
import "./globals.css"

import { ErrorBoundary } from "@/components/error-boundary"
import { PerformanceMonitor } from "@/components/performance-monitor"
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
              // Prevent browser extensions from modifying DOM before hydration
              (function() {
                const originalSetAttribute = Element.prototype.setAttribute;
                const originalClassNameSetter = Object.getOwnPropertyDescriptor(Element.prototype, 'className').set;
                
                // Override setAttribute to prevent browser extension modifications
                Element.prototype.setAttribute = function(name, value) {
                  if (name === 'class' || name === 'className') {
                    // Allow only specific classes or prevent modification
                    if (typeof value === 'string' && !value.includes('cf_') && !value.includes('clutter')) {
                      return originalSetAttribute.call(this, name, value);
                    }
                    return;
                  }
                  // Prevent Dark Reader and other extension attributes
                  if (name.startsWith('data-darkreader') || name.startsWith('data-extension')) {
                    return;
                  }
                  return originalSetAttribute.call(this, name, value);
                };
                
                if (originalClassNameSetter) {
                  Object.defineProperty(Element.prototype, 'className', {
                    set: function(value) {
                      if (typeof value === 'string' && !value.includes('cf_') && !value.includes('clutter')) {
                        return originalClassNameSetter.call(this, value);
                      }
                    },
                    get: Object.getOwnPropertyDescriptor(Element.prototype, 'className').get
                  });
                }

                // Override style setter to prevent Dark Reader styles
                const originalStyleSetter = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'style').set;
                Object.defineProperty(HTMLElement.prototype, 'style', {
                  set: function(value) {
                    if (typeof value === 'string' && !value.includes('--darkreader')) {
                      return originalStyleSetter.call(this, value);
                    }
                  },
                  get: Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'style').get
                });
                
                // Monitor for new elements and clean them
                const observer = new MutationObserver(function(mutations) {
                  mutations.forEach(function(mutation) {
                    if (mutation.type === 'attributes') {
                      const target = mutation.target;
                      if (target) {
                        // Remove Dark Reader attributes
                        if (target.hasAttribute && target.hasAttribute('data-darkreader-inline-stroke')) {
                          target.removeAttribute('data-darkreader-inline-stroke');
                        }
                        if (target.hasAttribute && target.hasAttribute('data-darkreader-inline-fill')) {
                          target.removeAttribute('data-darkreader-inline-fill');
                        }
                        if (target.hasAttribute && target.hasAttribute('data-darkreader-inline-bgcolor')) {
                          target.removeAttribute('data-darkreader-inline-bgcolor');
                        }
                        
                        // Remove Dark Reader styles
                        if (target.style && target.style.cssText.includes('--darkreader')) {
                          const cleanStyles = target.style.cssText.replace(/--darkreader[^;]+;?/g, '').trim();
                          if (cleanStyles) {
                            target.style.cssText = cleanStyles;
                          } else {
                            target.removeAttribute('style');
                          }
                        }
                        
                        // Clean class names
                        if (target.className && (target.className.includes('cf_') || target.className.includes('clutter'))) {
                          target.className = target.className.replace(/cf_[^\\s]*/g, '').replace(/clutter[^\\s]*/g, '').trim();
                        }
                      }
                    }
                  });
                });
                
                // Start observing after a short delay to catch all modifications
                [0, 50, 100, 200, 500, 1000].forEach(delay => {
                  setTimeout(() => {
                    observer.observe(document.body, {
                      attributes: true,
                      attributeFilter: ['class', 'style', 'data-darkreader-inline-stroke', 'data-darkreader-inline-fill', 'data-darkreader-inline-bgcolor'],
                      subtree: true
                    });
                  }, delay);
                });

                // Clean existing elements on load
                function cleanExistingElements() {
                  const elements = document.querySelectorAll('*');
                  elements.forEach(function(element) {
                    // Remove Dark Reader attributes
                    if (element.hasAttribute('data-darkreader-inline-stroke')) {
                      element.removeAttribute('data-darkreader-inline-stroke');
                    }
                    if (element.hasAttribute('data-darkreader-inline-fill')) {
                      element.removeAttribute('data-darkreader-inline-fill');
                    }
                    if (element.hasAttribute('data-darkreader-inline-bgcolor')) {
                      element.removeAttribute('data-darkreader-inline-bgcolor');
                    }
                    
                    // Remove Dark Reader styles
                    if (element.style && element.style.cssText.includes('--darkreader')) {
                      const cleanStyles = element.style.cssText.replace(/--darkreader[^;]+;?/g, '').trim();
                      if (cleanStyles) {
                        element.style.cssText = cleanStyles;
                      } else {
                        element.removeAttribute('style');
                      }
                    }
                  });
                }

                // Run cleanup when DOM is ready
                if (document.readyState === 'loading') {
                  document.addEventListener('DOMContentLoaded', cleanExistingElements);
                } else {
                  cleanExistingElements();
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
              <PerformanceMonitor />
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
