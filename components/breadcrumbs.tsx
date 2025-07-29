"use client"

import { ChevronRight, Home } from "lucide-react"
import { usePathname } from "next/navigation"
import { useEffect } from "react"

import { HydrationSafeLink } from "@/components/ui/hydration-safe-link"
import { cn, getBaseUrl } from "@/lib/utils"

interface BreadcrumbItem {
  label: string
  href: string
}

// Function to strip numeric prefix from blog post slugs
function formatBreadcrumbLabel(segment: string, pathSegments: string[]): string {
  // Check if this is a blog post slug (has numeric prefix pattern like "20.0001-")
  const numericPrefixPattern = /^\d+\.\d+-/
  
  if (numericPrefixPattern.test(segment)) {
    // Remove the numeric prefix and convert to readable format
    const cleanSlug = segment.replace(numericPrefixPattern, '')
    return cleanSlug
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }
  
  // For non-blog-post segments, just capitalize the first letter
  return segment.charAt(0).toUpperCase() + segment.slice(1)
}

export function Breadcrumbs() {
  const pathname = usePathname()

  // Generate breadcrumb items based on the current path
  const breadcrumbs = pathname
    .split('/')
    .filter(Boolean)
    .reduce<BreadcrumbItem[]>((acc, segment, index, array) => {
      const href = `/${array.slice(0, index + 1).join('/')}`
      const label = formatBreadcrumbLabel(segment, array)
      acc.push({ label, href })
      return acc
    }, [])

  // Add home as the first item
  const items = [{ label: 'Home', href: '/' }, ...breadcrumbs]

  // Generate JSON-LD structured data on the client side only
  useEffect(() => {
    const baseUrl = getBaseUrl()
    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: items.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@id': `${baseUrl}${item.href}`,
          name: item.label,
        },
      })),
    }

    // Remove existing breadcrumb structured data
    const existingScript = document.querySelector('script[data-breadcrumb-structured-data]')
    if (existingScript) {
      existingScript.remove()
    }

    // Add new structured data
    const script = document.createElement('script')
    script.type = 'application/ld+json'
    script.setAttribute('data-breadcrumb-structured-data', 'true')
    script.textContent = JSON.stringify(jsonLd)
    document.head.appendChild(script)

    // Cleanup on unmount
    return () => {
      const scriptToRemove = document.querySelector('script[data-breadcrumb-structured-data]')
      if (scriptToRemove) {
        scriptToRemove.remove()
      }
    }
  }, [items])

  return (
    <nav className="flex items-center space-x-1 text-sm text-muted-foreground" suppressHydrationWarning>
      {items.map((item, index) => (
        <div key={item.href} className="flex items-center">
          {index > 0 && <ChevronRight className="h-4 w-4 mx-1" />}
          {index === items.length - 1 ? (
            <span className="font-medium text-foreground">{item.label}</span>
          ) : (
            <HydrationSafeLink
              href={item.href}
              className={cn(
                "hover:text-foreground transition-colors",
                index === 0 && "flex items-center"
              )}
            >
              {index === 0 ? (
                <>
                  <Home className="h-4 w-4" />
                  <span className="sr-only">Home</span>
                </>
              ) : (
                item.label
              )}
            </HydrationSafeLink>
          )}
        </div>
      ))}
    </nav>
  )
} 