"use client"

import { Command, CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator, CommandShortcut } from "@/components/ui/command"
import { ToastButton } from "@/components/ui/toast-button"
import { useToast } from "@/components/ui/use-toast"
import { ChevronDown } from "lucide-react"
import type { MDXRemoteSerializeResult } from 'next-mdx-remote'
import { MDXRemote } from "next-mdx-remote"
import Image from "next/image"
import Link from "next/link"
import React from "react"
import { CartesianGrid, Line, LineChart, Legend as RechartsLegend, Tooltip as RechartsTooltip, XAxis, YAxis } from "recharts"
import { highlight } from 'sugar-high'

// Import all components (both client and server-side)
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription as AlertDialogDescriptionPrimitive, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage } from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { ChartContainer as Chart } from "@/components/ui/chart"
import { Checkbox } from "@/components/ui/checkbox"
import { CodeBlock } from "@/components/ui/code-block"
import { CodeSnippet } from "@/components/ui/code-snippet"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Dialog, DialogContent, DialogDescription as DialogDescriptionPrimitive, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { FloatingNavigationMenu } from "@/components/ui/floating-navigation-menu"
import { Form, FormControl, FormField, FormLabel, FormMessage } from "@/components/ui/form"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Mermaid } from "@/components/ui/mermaid"
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from "@/components/ui/navigation-menu"
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Skeleton } from "@/components/ui/skeleton"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Toast } from "@/components/ui/toast"
import { ToastProvider } from "@/components/ui/toast-context"
import { ToastDemo } from "@/components/ui/toast-demo"
import { ToastWrapper } from "@/components/ui/toast-wrapper"
import { Toggle } from "@/components/ui/toggle"
import { ToggleDemo } from "@/components/ui/toggle-demo"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Tooltip as ShadcnTooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

// Add type for the MDX component props
type MDXComponentProps = {
  source: MDXRemoteSerializeResult
}

// Add proper types for the component props
function CustomLink(props: React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  const { href, ...rest } = props

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

  return <a target="_blank" rel="noopener noreferrer" suppressHydrationWarning {...props} />
}

function RoundedImage(props: React.ComponentProps<typeof Image>) {
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

// Client-side components mapping (includes both client and server components)
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
  ChevronDown,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  RechartsTooltip,
  RechartsLegend,
  ToastButton,
  toast: useToast,
  Mermaid,
  
  // All shadcn/ui components (both client and server-side)
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Alert,
  AlertTitle,
  AlertDescription,
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription: (props: React.HTMLAttributes<HTMLSpanElement>) => (
    <AlertDialogDescriptionPrimitive asChild>
      <span {...props} />
    </AlertDialogDescriptionPrimitive>
  ),
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
  AspectRatio,
  Avatar,
  AvatarImage,
  AvatarFallback,
  Badge,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  Checkbox,
  CodeBlock,
  CodeSnippet,
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription: (props: React.HTMLAttributes<HTMLSpanElement>) => (
    <DialogDescriptionPrimitive asChild>
      <span {...props} />
    </DialogDescriptionPrimitive>
  ),
  DialogFooter,
  Form,
  FormField,
  FormLabel,
  FormControl,
  FormMessage,
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
  Input,
  Label,
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  Popover,
  PopoverTrigger,
  PopoverContent,
  Progress,
  RadioGroup,
  RadioGroupItem,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  Separator,
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  Skeleton,
  Slider,
  Switch,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  Textarea,
  Toast,
  Toggle,
  ToggleGroup,
  ToggleGroupItem,
  Tooltip: ShadcnTooltip,
  TooltipTrigger,
  TooltipContent,
  Chart,
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
  useToast,
  ToastDemo,
  ToastWrapper,
  ToggleDemo,
  FloatingNavigationMenu,
}

// Client component for MDX rendering
export function ClientMDX({ source }: MDXComponentProps) {
  return (
    <ToastProvider>
      <TooltipProvider>
        <div className="prose prose-gray dark:prose-invert max-w-none">
          <MDXRemote {...source} components={components} />
        </div>
      </TooltipProvider>
    </ToastProvider>
  )
} 