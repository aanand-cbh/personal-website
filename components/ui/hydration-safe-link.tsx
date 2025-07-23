"use client"

import { cn } from "@/lib/utils"
import Link from "next/link"
import { forwardRef } from "react"

interface HydrationSafeLinkProps {
  href: string
  className?: string
  children: React.ReactNode
  [key: string]: any
}

export const HydrationSafeLink = forwardRef<HTMLAnchorElement, HydrationSafeLinkProps>(
  ({ href, className, children, ...props }, ref) => {
    return (
      <Link
        href={href}
        className={cn(className)}
        ref={ref}
        suppressHydrationWarning={true}
        {...props}
      >
        {children}
      </Link>
    )
  }
)

HydrationSafeLink.displayName = "HydrationSafeLink" 