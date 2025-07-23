import { ChevronDown } from "lucide-react"
import type { MDXComponents } from "mdx/types"
import Image from "next/image"
import Link from "next/link"
import React from "react"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage } from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { CodeBlock } from "@/components/ui/code-block"
import { CodeSnippet } from "@/components/ui/code-snippet"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { FloatingNavigationMenu } from "@/components/ui/floating-navigation-menu"
import { Form, FormControl, FormField, FormLabel, FormMessage } from "@/components/ui/form"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { Input } from "@/components/ui/input"
import { Mermaid } from "@/components/ui/mermaid"
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from "@/components/ui/navigation-menu"
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Toast } from "@/components/ui/toast"
import { Toggle } from "@/components/ui/toggle"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { YouTubeEmbed } from "@/components/ui/youtube-embed"
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
    AlertTitle: ({ className, ...props }) => <AlertTitle className={cn("", className)} {...props} />,
    AlertDescription: ({ className, ...props }) => <AlertDescription className={cn("", className)} {...props} />,
    AlertDialog: ({ children, ...props }) => (
      <AlertDialog {...props}>
        {children}
      </AlertDialog>
    ),
    AlertDialogAction: ({ children, ...props }) => (
      <AlertDialogAction {...props}>
        {children}
      </AlertDialogAction>
    ),
    AlertDialogCancel: ({ children, ...props }) => (
      <AlertDialogCancel {...props}>
        {children}
      </AlertDialogCancel>
    ),
    AlertDialogContent: ({ children, ...props }) => (
      <AlertDialogContent {...props}>
        {children}
      </AlertDialogContent>
    ),
    AlertDialogDescription: ({ children, ...props }) => (
      <AlertDialogDescription {...props}>
        {children}
      </AlertDialogDescription>
    ),
    AlertDialogFooter: ({ children, ...props }) => (
      <AlertDialogFooter {...props}>
        {children}
      </AlertDialogFooter>
    ),
    AlertDialogHeader: ({ children, ...props }) => (
      <AlertDialogHeader {...props}>
        {children}
      </AlertDialogHeader>
    ),
    AlertDialogTitle: ({ children, ...props }) => (
      <AlertDialogTitle {...props}>
        {children}
      </AlertDialogTitle>
    ),
    AlertDialogTrigger: ({ children, ...props }) => (
      <AlertDialogTrigger {...props}>
        {children}
      </AlertDialogTrigger>
    ),
    AspectRatio: ({ className, ...props }) => <AspectRatio className={cn("", className)} {...props} />,
    Avatar: ({ className, ...props }) => <Avatar className={cn("", className)} {...props} />,
    AvatarImage: ({ className, ...props }) => <AvatarImage className={cn("", className)} {...props} />,
    AvatarFallback: ({ className, ...props }) => <AvatarFallback className={cn("", className)} {...props} />,
    Badge: ({ className, ...props }) => <Badge className={cn("mr-2", className)} {...props} />,
    Breadcrumb: ({ className, ...props }) => <Breadcrumb className={cn("", className)} {...props} />,
    BreadcrumbItem: ({ className, ...props }) => <BreadcrumbItem className={cn("", className)} {...props} />,
    BreadcrumbLink: ({ className, ...props }) => <BreadcrumbLink className={cn("", className)} {...props} />,
    BreadcrumbPage: ({ className, ...props }) => <BreadcrumbPage className={cn("", className)} {...props} />,
    Button: ({ className, ...props }) => <Button className={cn("", className)} {...props} />,
    Card: ({ className, ...props }) => <Card className={cn("my-6", className)} {...props} />,
    CardHeader: ({ className, ...props }) => <CardHeader className={cn("", className)} {...props} />,
    CardTitle: ({ className, ...props }) => <CardTitle className={cn("", className)} {...props} />,
    CardDescription: ({ className, ...props }) => <CardDescription className={cn("", className)} {...props} />,
    CardContent: ({ className, ...props }) => <CardContent className={cn("p-6", className)} {...props} />,
    CardFooter: ({ className, ...props }) => <CardFooter className={cn("", className)} {...props} />,
    Checkbox: ({ className, ...props }) => <Checkbox className={cn("", className)} {...props} />,
    CodeBlock: ({ className, ...props }) => <CodeBlock className={cn("", className)} {...props} />,
    CodeSnippet: ({ className, ...props }) => <CodeSnippet className={cn("mr-2", className)} {...props} />,
    Collapsible: ({ className, ...props }) => <Collapsible className={cn("", className)} {...props} />,
    CollapsibleTrigger: ({ className, ...props }) => <CollapsibleTrigger className={cn("", className)} {...props} />,
    CollapsibleContent: ({ className, ...props }) => <CollapsibleContent className={cn("", className)} {...props} />,
    Form: ({ className, ...props }) => <Form className={cn("", className)} {...props} />,
    FormField: ({ className, ...props }) => <FormField className={cn("", className)} {...props} />,
    FormLabel: ({ className, ...props }) => <FormLabel className={cn("", className)} {...props} />,
    FormControl: ({ className, ...props }) => <FormControl className={cn("", className)} {...props} />,
    FormMessage: ({ className, ...props }) => <FormMessage className={cn("", className)} {...props} />,
    HoverCard: ({ className, ...props }) => <HoverCard className={cn("", className)} {...props} />,
    HoverCardTrigger: ({ className, ...props }) => <HoverCardTrigger className={cn("", className)} {...props} />,
    HoverCardContent: ({ className, ...props }) => <HoverCardContent className={cn("", className)} {...props} />,
    Input: ({ className, ...props }) => <Input className={cn("", className)} {...props} />,
    NavigationMenu: ({ className, ...props }) => <NavigationMenu className={cn("", className)} {...props} />,
    NavigationMenuList: ({ className, ...props }) => <NavigationMenuList className={cn("", className)} {...props} />,
    NavigationMenuItem: ({ className, ...props }) => <NavigationMenuItem className={cn("", className)} {...props} />,
    NavigationMenuTrigger: ({ className, ...props }) => <NavigationMenuTrigger className={cn("", className)} {...props} />,
    NavigationMenuContent: ({ className, ...props }) => <NavigationMenuContent className={cn("", className)} {...props} />,
    NavigationMenuLink: ({ className, ...props }) => <NavigationMenuLink className={cn("", className)} {...props} />,
    Pagination: ({ className, ...props }) => <Pagination className={cn("", className)} {...props} />,
    PaginationContent: ({ className, ...props }) => <PaginationContent className={cn("", className)} {...props} />,
    PaginationItem: ({ className, ...props }) => <PaginationItem className={cn("", className)} {...props} />,
    PaginationLink: ({ className, ...props }) => <PaginationLink className={cn("", className)} {...props} />,
    PaginationPrevious: ({ className, ...props }) => <PaginationPrevious className={cn("", className)} {...props} />,
    PaginationNext: ({ className, ...props }) => <PaginationNext className={cn("", className)} {...props} />,
    Popover: ({ className, ...props }) => <Popover className={cn("", className)} {...props} />,
    PopoverTrigger: ({ className, ...props }) => <PopoverTrigger className={cn("", className)} {...props} />,
    PopoverContent: ({ className, ...props }) => <PopoverContent className={cn("", className)} {...props} />,
    Progress: ({ className, ...props }) => <Progress className={cn("", className)} {...props} />,
    RadioGroup: ({ className, ...props }) => <RadioGroup className={cn("", className)} {...props} />,
    RadioGroupItem: ({ className, ...props }) => <RadioGroupItem className={cn("", className)} {...props} />,
    Select: ({ className, ...props }) => <Select className={cn("", className)} {...props} />,
    SelectTrigger: ({ className, ...props }) => <SelectTrigger className={cn("", className)} {...props} />,
    SelectValue: ({ className, ...props }) => <SelectValue className={cn("", className)} {...props} />,
    SelectContent: ({ className, ...props }) => <SelectContent className={cn("", className)} {...props} />,
    SelectItem: ({ className, ...props }) => <SelectItem className={cn("", className)} {...props} />,
    Separator: ({ className, ...props }) => <Separator className={cn("", className)} {...props} />,
    Skeleton: ({ className, ...props }) => <Skeleton className={cn("", className)} {...props} />,
    Slider: ({ className, ...props }) => <Slider className={cn("", className)} {...props} />,
    Switch: ({ className, ...props }) => <Switch className={cn("", className)} {...props} />,
    Table: ({ className, ...props }) => <Table className={cn("", className)} {...props} />,
    TableHeader: ({ className, ...props }) => <TableHeader className={cn("", className)} {...props} />,
    TableBody: ({ className, ...props }) => <TableBody className={cn("", className)} {...props} />,
    TableRow: ({ className, ...props }) => <TableRow className={cn("", className)} {...props} />,
    TableHead: ({ className, ...props }) => <TableHead className={cn("", className)} {...props} />,
    TableCell: ({ className, ...props }) => <TableCell className={cn("", className)} {...props} />,
    Tabs: ({ className, ...props }) => <Tabs className={cn("", className)} {...props} />,
    TabsList: ({ className, ...props }) => <TabsList className={cn("", className)} {...props} />,
    TabsTrigger: ({ className, ...props }) => <TabsTrigger className={cn("", className)} {...props} />,
    TabsContent: ({ className, ...props }) => <TabsContent className={cn("", className)} {...props} />,
    Textarea: ({ className, ...props }) => <Textarea className={cn("", className)} {...props} />,
    Toast: ({ className, ...props }) => <Toast className={cn("", className)} {...props} />,
    Toggle: ({ className, ...props }) => <Toggle className={cn("", className)} {...props} />,
    ToggleGroup: ({ className, ...props }) => <ToggleGroup className={cn("", className)} {...props} />,
    ToggleGroupItem: ({ className, ...props }) => <ToggleGroupItem className={cn("", className)} {...props} />,
    Tooltip: ({ className, ...props }) => <Tooltip className={cn("", className)} {...props} />,
    TooltipTrigger: ({ className, ...props }) => <TooltipTrigger className={cn("", className)} {...props} />,
    TooltipContent: ({ className, ...props }) => <TooltipContent className={cn("", className)} {...props} />,
    Accordion: ({ className, ...props }) => <Accordion className={cn("my-6", className)} {...props} />,
    AccordionItem: ({ className, ...props }) => <AccordionItem className={cn("", className)} {...props} />,
    AccordionTrigger: ({ className, ...props }) => <AccordionTrigger className={cn("", className)} {...props} />,
    AccordionContent: ({ className, ...props }) => <AccordionContent className={cn("", className)} {...props} />,
    FloatingNavigationMenu: ({ className, ...props }) => (
      <FloatingNavigationMenu className={cn("", className)} {...props} />
    ),
    YouTubeEmbed: ({ className, ...props }) => (
      <YouTubeEmbed className={cn("", className)} {...props} />
    ),
    Mermaid: ({ className, ...props }) => <Mermaid className={cn("", className)} {...props} />,
    ChevronDown: ({ className, ...props }) => <ChevronDown className={cn("", className)} {...props} />,
    Link: ({ href, className, children, ...props }) => (
      <Link
        href={href as string}
        className={cn("font-medium underline underline-offset-4 text-primary hover:text-primary/80", className)}
        {...props}
      >
        {children}
      </Link>
    ),
    ...components,
  }
}