import type { MDXComponents } from "mdx/types"
import Image from "next/image"
import Link from "next/link"
import React from "react"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { CodeBlock } from "@/components/ui/code-block"
import { CodeSnippet } from "@/components/ui/code-snippet"
import { Separator } from "@/components/ui/separator"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { cn } from "@/lib/utils"

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    // Typography components
    h1: ({ className, ...props }) => (
      <h1
        className={cn("scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl mt-8 mb-4", className)}
        {...props}
      />
    ),
    h2: ({ className, ...props }) => (
      <h2
        className={cn("scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight mt-8 mb-4", className)}
        {...props}
      />
    ),
    h3: ({ className, ...props }) => (
      <h3 className={cn("scroll-m-20 text-2xl font-semibold tracking-tight mt-6 mb-3", className)} {...props} />
    ),
    h4: ({ className, ...props }) => (
      <h4 className={cn("scroll-m-20 text-xl font-semibold tracking-tight mt-6 mb-3", className)} {...props} />
    ),
    p: ({ className, ...props }) => <p className={cn("leading-7 [&:not(:first-child)]:mt-6", className)} {...props} />,
    a: ({ href, className, ...props }) => {
      const isInternal = href?.startsWith("/")
      if (isInternal) {
        return (
          <Link
            href={href as string}
            className={cn("font-medium underline underline-offset-4 text-primary hover:text-primary/80", className)}
            {...props}
          />
        )
      }
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={cn("font-medium underline underline-offset-4 text-primary hover:text-primary/80", className)}
          {...props}
        />
      )
    },
    ul: ({ className, ...props }) => <ul className={cn("my-6 ml-6 list-disc", className)} {...props} />,
    ol: ({ className, ...props }) => <ol className={cn("my-6 ml-6 list-decimal", className)} {...props} />,
    li: ({ className, ...props }) => <li className={cn("mt-2", className)} {...props} />,
    blockquote: ({ className, ...props }) => (
      <blockquote className={cn("mt-6 border-l-2 border-primary pl-6 italic", className)} {...props} />
    ),
    img: ({ src, alt, className }) => {
      return (
        <div className="my-8 overflow-hidden rounded-md">
          <Image
            src={(src as string) || "/placeholder.svg"}
            alt={alt as string}
            width={800}
            height={500}
            className={cn("rounded-md mx-auto", className)}
          />
        </div>
      )
    },
    hr: () => <Separator className="my-8" />,
    table: ({ className, children, ...props }) => (
      <div className="my-6 w-full overflow-y-auto">
        <Table className={cn("w-full", className)} {...props}>
          {children}
        </Table>
      </div>
    ),
    thead: ({ className, children, ...props }) => (
      <TableHeader className={cn("bg-muted/50", className)} {...props}>
        {children}
      </TableHeader>
    ),
    tbody: ({ className, children, ...props }) => (
      <TableBody className={cn("", className)} {...props}>
        {children}
      </TableBody>
    ),
    tr: ({ className, children, ...props }) => (
      <TableRow className={cn("border-b transition-colors hover:bg-muted/50", className)} {...props}>
        {children}
      </TableRow>
    ),
    th: ({ className, children, ...props }) => (
      <TableHead className={cn("h-12 px-4 text-left align-middle font-medium text-muted-foreground", className)} {...props}>
        {children}
      </TableHead>
    ),
    td: ({ className, children, ...props }) => (
      <TableCell className={cn("p-4 align-middle", className)} {...props}>
        {children}
      </TableCell>
    ),
    code: ({ className, children, ...props }) => {
      const match = /language-(\w+)/.exec(className || '')
      return match ? (
        <code className={cn("relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm", className)} {...props}>
          {children}
        </code>
      ) : (
        <code className={cn("relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm", className)} {...props}>
          {children}
        </code>
      )
    },
    pre: ({ className, children, ...props }) => {
      const match = /language-(\w+)/.exec(className || '')
      const language = match ? match[1] : ''
      
      // Check if children is an object with props (MDX nested structure)
      if (React.isValidElement(children)) {
        const childElement = children as React.ReactElement<{children?: React.ReactNode}>
        if (childElement.props?.children) {
          return (
            <CodeBlock language={language} className={className} {...props}>
              {childElement.props.children}
            </CodeBlock>
          )
        }
      }
      
      return (
        <CodeBlock language={language} className={className} {...props}>
          {children}
        </CodeBlock>
      )
    },
    // Custom components
    Alert: ({ children, ...props }) => (
      <Alert className="my-6" {...props}>
        <AlertDescription>{children}</AlertDescription>
      </Alert>
    ),
    Card: ({ className, ...props }) => <Card className={cn("my-6", className)} {...props} />,
    CardContent: ({ className, ...props }) => <CardContent className={cn("p-6", className)} {...props} />,
    Badge: ({ className, ...props }) => <Badge className={cn("mr-2", className)} {...props} />,
    CodeSnippet: ({ className, ...props }) => <CodeSnippet className={cn("mr-2", className)} {...props} />,
    ...components,
  }
}