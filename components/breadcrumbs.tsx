"use client"

import { ChevronRight, Home } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { cn, getBaseUrl } from "@/lib/utils"

interface BreadcrumbItem {
  label: string
  href: string
}

export function Breadcrumbs() {
  const pathname = usePathname()
  const baseUrl = getBaseUrl()

  // Generate breadcrumb items based on the current path
  const breadcrumbs = pathname
    .split('/')
    .filter(Boolean)
    .reduce<BreadcrumbItem[]>((acc, segment, index, array) => {
      const href = `/${array.slice(0, index + 1).join('/')}`
      const label = segment.charAt(0).toUpperCase() + segment.slice(1)
      acc.push({ label, href })
      return acc
    }, [])

  // Add home as the first item
  const items = [{ label: 'Home', href: '/' }, ...breadcrumbs]

  // Generate JSON-LD structured data
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

  return (
    <>
      {/* JSON-LD structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Visual breadcrumbs */}
      <nav className="flex items-center space-x-1 text-sm text-muted-foreground">
        {items.map((item, index) => (
          <div key={item.href} className="flex items-center">
            {index > 0 && <ChevronRight className="h-4 w-4 mx-1" />}
            {index === items.length - 1 ? (
              <span className="font-medium text-foreground">{item.label}</span>
            ) : (
              <Link
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
              </Link>
            )}
          </div>
        ))}
      </nav>
    </>
  )
} 