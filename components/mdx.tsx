import { MDXRemote } from "next-mdx-remote/rsc"
import Image from "next/image"
import Link from "next/link"
import React from "react"
import remarkGfm from 'remark-gfm'
import { highlight } from 'sugar-high'

import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { CodeSnippet } from "@/components/ui/code-snippet"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { cn } from "@/lib/utils"

// Add type for the MDX component props
type MDXComponentProps = {
  source: string
}

// Add proper types for the component props
function CustomLink(props: React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  const href = props.href

  if (href?.startsWith("/")) {
    return (
      <Link href={href} {...props}>
        {props.children}
      </Link>
    )
  }

  if (href?.startsWith("#")) {
    return <a {...props} />
  }

  return <a target="_blank" rel="noopener noreferrer" {...props} />
}

function RoundedImage(props: React.ComponentProps<typeof Image>) {
  // Extract alt to avoid duplication
  const { alt, ...rest } = props;
  
  return (
    <Image
      alt={alt as string || "Blog image"}
      className="rounded-lg mx-auto my-8"
      width={800}
      height={500}
      style={{ maxWidth: "100%", height: "auto" }}
      {...rest}
    />
  )
}

function Code({ children, ...props }: { children: string; [key: string]: any }) {
  const codeHTML = highlight(children);
  return <code dangerouslySetInnerHTML={{ __html: codeHTML }} {...props} />
}

function slugify(str: string): string {
  return str
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/&/g, "-and-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-")
}

function createHeading(level: number) {
  const Heading = ({ children }: { children: React.ReactNode }) => {
    const slug = slugify(children?.toString() || "")
    return React.createElement(
      `h${level}`,
      { id: slug },
      [
        React.createElement("a", {
          href: `#${slug}`,
          key: `link-${slug}`,
          className: "anchor",
        }),
      ],
      children
    )
  }

  Heading.displayName = `Heading${level}`

  return Heading
}

// Type-safe components mapping
const components = {
  h1: createHeading(1),
  h2: createHeading(2),
  h3: createHeading(3),
  h4: createHeading(4),
  h5: createHeading(5),
  h6: createHeading(6),
  Image: RoundedImage,
  a: CustomLink,
  img: RoundedImage,
  code: Code,
  
  // shadcn/ui components
  Alert: ({ children, ...props }: React.ComponentProps<typeof Alert>) => (
    <Alert className="my-6" {...props}>
      <AlertDescription>{children}</AlertDescription>
    </Alert>
  ),
  Badge: ({ className, ...props }: React.ComponentProps<typeof Badge>) => (
    <Badge className={cn("mr-2", className)} {...props} />
  ),
  Card: ({ className, ...props }: React.ComponentProps<typeof Card>) => (
    <Card className={cn("my-6", className)} {...props} />
  ),
  CardContent: ({ className, ...props }: React.ComponentProps<typeof CardContent>) => (
    <CardContent className={cn("p-6", className)} {...props} />
  ),
  
  // Table components
  table: ({ className, ...props }: React.ComponentProps<typeof Table>) => (
    <div className="my-6 w-full overflow-y-auto">
      <Table className={cn("w-full", className)} {...props} />
    </div>
  ),
  thead: ({ ...props }) => <TableHeader {...props} />,
  tbody: ({ ...props }) => <TableBody {...props} />,
  tr: ({ ...props }) => <TableRow {...props} />,
  th: ({ ...props }) => <TableHead {...props} />,
  td: ({ ...props }) => <TableCell {...props} />,
  
  CodeSnippet: ({ children, language, code, ...props }: React.ComponentProps<typeof CodeSnippet> & { children?: string, language?: string, code?: string }) => (
    <CodeSnippet code={code || (children as string)} language={language} {...props} />
  ),
}

// Server component for MDX rendering
export function CustomMDX({ source }: MDXComponentProps) {
  return (
    <div className="prose dark:prose-invert max-w-none">
      <MDXRemote
        source={source}
        components={components}
        options={{
          parseFrontmatter: true,
          mdxOptions: {
            remarkPlugins: [
              remarkGfm,
            ],
            rehypePlugins: [],
            format: 'mdx',
          },
        }}
      />
    </div>
  )
} 