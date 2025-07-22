# System Patterns

## Architecture Overview

### Next.js App Router Pattern
- **File-based routing**: Routes defined by directory structure in `app/`
- **Server Components by default**: Optimal performance with selective client interactivity
- **Layout composition**: Shared layouts with nested routing
- **Static generation**: Pre-built pages for optimal performance

### Blog System Architecture
```
content/blog/{category}/*.mdx → lib/mdx.ts → app/blog/[category]/page.tsx
                                     ↓
                         components/CategoryBlogPage.tsx
                                     ↓
                         Rendered category pages with search & tier filtering
```

**File Structure**:
```
content/blog/
├── tech/
│   ├── understanding-react-hydration-errors.mdx (reference)
│   ├── favorite-resources.mdx (revisit)
│   ├── interactive-shadcn-components.mdx (revisit)
│   └── getting-started.mdx (read)
├── travel/
│   └── places-to-visit-near-hyderabad.mdx (revisit)
├── spiritual/
│   └── oprah-winfrey-why-i-follow-hinduism.mdx (reference)
└── personal/
    └── (future personal posts)
```

## Key Design Patterns

### 1. Category-Based Organization
**Pattern**: Content categorization with dedicated routes
```
/blog/tech/     - Tech category landing
/blog/travel/   - Travel category landing  
/blog/spiritual/ - Spiritual category landing
/blog/tech/[slug] - Individual tech posts
```

**Benefits**:
- Clear content organization
- SEO-friendly URLs
- Category-specific search
- Scalable content structure

### 2. Reusable Component Pattern
**Implementation**: `CategoryBlogPage` component eliminates duplication
```typescript
// Before: 3 separate category pages with duplicate code
// After: Single reusable component with props
<CategoryBlogPage
  category="tech"
  title="Tech & Software Engineering"
  description="..."
  searchPlaceholder="Search tech posts..."
  searchParams={searchParams}
/>
```

**Benefits**:
- DRY principle adherence
- Consistent behavior across categories
- Single source of truth for category logic
- Easy maintenance and feature additions

### 3. MDX Content Pipeline
**Pattern**: MDX → Gray Matter → Next-MDX-Remote → Rendered Component
```typescript
// 1. Read MDX file
const fileContents = fs.readFileSync(filePath, "utf8")

// 2. Parse frontmatter
const { data, content } = matter(fileContents)

// 3. Serialize for client
const serializedContent = await serialize(content, options)

// 4. Render with components
<MDXWrapper source={serializedContent} />
```

### 4. SEO and Metadata Pattern
**Structured Data**: Comprehensive schema.org implementation
- BlogPosting for individual posts
- BreadcrumbList for navigation
- Organization and Person schemas
- Category-specific metadata

**Meta Tags**: Dynamic generation based on content
```typescript
export async function generateMetadata({ params }) {
  const post = await getPostBySlug(params.slug)
  return {
    title: post.frontMatter.title,
    description: post.frontMatter.description,
    // ... OpenGraph, Twitter, etc.
  }
}
```

### 5. Search Architecture
**Category-Scoped Search**: Each category has independent search
```typescript
// Fuzzy search within category posts only
const fuse = new Fuse(categoryPosts, {
  keys: ['frontMatter.title', 'frontMatter.description', 'frontMatter.tags'],
  threshold: 0.4
})
```

**Benefits**:
- Relevant results within context
- Faster search (smaller dataset)
- Better user experience

## Component Patterns

### 1. Server vs Client Components
**Server Components**: Default for better performance
- Page components
- Static content rendering
- Data fetching

**Client Components**: Only when necessary
- Search functionality
- Interactive elements
- Browser APIs

### 2. Error Boundary Pattern
**Implementation**: Graceful error handling throughout app
```typescript
<ErrorBoundary>
  <QueryProvider>
    <ThemeProvider>
      // App content
    </ThemeProvider>
  </QueryProvider>
</ErrorBoundary>
```

### 3. Hydration Safety Pattern
**Problem**: Server/client rendering differences
**Solution**: `suppressHydrationWarning` for external modifications
```tsx
// For elements modified by browser extensions
<body suppressHydrationWarning={true}>
```

## Data Flow Patterns

### 1. Content Loading Flow
```
getPostSlugs() → getPostBySlug() → serialize() → render
```

### 2. Category Filtering Flow
```
getAllPosts() → filter by category → apply search → render results
```

### 3. Route Generation Flow
```
generateStaticParams() → filter by category → return slug arrays
```

## Performance Patterns

### 1. Static Generation Strategy
- **Category pages**: Static with search params
- **Individual posts**: Pre-generated at build time
- **Search functionality**: Client-side for responsiveness

### 2. Image Optimization
- Next.js Image component with automatic optimization
- Proper sizing and lazy loading
- WebP format when supported

### 3. Bundle Optimization
- Automatic code splitting by route
- Dynamic imports for client-only components
- Tree shaking for unused code elimination

## Security Patterns

### 1. Content Security
- MDX content sanitization
- Safe HTML rendering with React
- XSS prevention through React's escaping

### 2. Input Validation
- Search query sanitization
- URL parameter validation
- Safe dynamic route handling

## Development Patterns

### 1. Type Safety
- TypeScript throughout
- Strict type definitions for MDX frontmatter
- Component prop typing

### 2. Error Handling
- Graceful fallbacks for missing content
- Clear error messages in development
- Production error boundaries

### 3. Code Organization
```
app/           # Next.js app router
components/    # Reusable UI components
lib/           # Utility functions and data fetching
content/       # MDX content files
memory-bank/   # Project documentation
```

## Implementation Procedures

### Adding a New Category (Step-by-Step)

Thanks to the CategoryBlogPage refactor, adding new categories is now streamlined. Here's the complete process:

#### 1. Add Category Metadata to Main Blog Page
Update `app/blog/page.tsx` categories array:
```typescript
const categories = [
  // ... existing categories
  {
    title: "Health & Wellness",
    description: "Physical health, mental wellbeing, and lifestyle optimization",
    icon: Heart, // Import from lucide-react
    href: "/blog/health",
    gradient: "from-pink-500 to-red-500",
    posts: healthPosts.length
  }
]
```

#### 2. Create Category Page
Create `app/blog/health/page.tsx`:
```typescript
import { CategoryBlogPage } from "@/components/category-blog-page"

export default function HealthBlog({ searchParams }: { searchParams: { q?: string } }) {
  return (
    <CategoryBlogPage
      category="health"
      title="Health & Wellness"
      description="Physical health, mental wellbeing, and lifestyle optimization"
      searchPlaceholder="Search health posts..."
      searchParams={searchParams}
    />
  )
}

export const metadata = {
  title: "Health & Wellness Blog",
  description: "Physical health, mental wellbeing, and lifestyle optimization"
}
```

#### 3. Create Individual Post Route
Create `app/blog/health/[slug]/page.tsx`:
```typescript
import { getPostBySlug, getPostSlugs } from "@/lib/mdx"
import { MDXContent } from "@/components/mdx-content"
import { notFound } from "next/navigation"

interface PageProps {
  params: { slug: string }
}

export async function generateStaticParams() {
  const posts = await getPostSlugs()
  return posts
    .filter(post => post.frontMatter.category === "health")
    .map(post => ({ slug: post.slug }))
}

export async function generateMetadata({ params }: PageProps) {
  const post = await getPostBySlug(params.slug)
  if (!post || post.frontMatter.category !== "health") return {}
  
  return {
    title: post.frontMatter.title,
    description: post.frontMatter.description,
    // ... additional metadata
  }
}

export default async function HealthPostPage({ params }: PageProps) {
  const post = await getPostBySlug(params.slug)
  
  if (!post || post.frontMatter.category !== "health") {
    notFound()
  }

  return <MDXContent post={post} />
}
```

#### 4. Add Posts with Category Field
In MDX files, include the category in frontmatter:
```yaml
---
title: "Your Health Post Title"
date: "2025-07-18"
description: "Post description"
category: "health"
tags: ["wellness", "fitness"]
---
```

#### 5. Import Icon (if needed)
Add new icon import to `app/blog/page.tsx`:
```typescript
import { Heart, Code2, Plane } from "lucide-react"
```

#### Key Benefits of This Process
- **No Code Duplication**: Everything reuses CategoryBlogPage component
- **Automatic Search**: Category-scoped search included automatically
- **Consistent Styling**: Matches all existing categories
- **Type Safety**: TypeScript ensures proper implementation
- **SEO Optimized**: Metadata and structured data included
- **Scalable**: Pattern works for unlimited categories

#### Post-Creation Checklist
1. ✅ Category metadata added to main blog page
2. ✅ Category page created with CategoryBlogPage component
3. ✅ Individual post route with proper filtering
4. ✅ First post created with correct category field
5. ✅ Icon imported and styled
6. ✅ Build successful with `npm run build`
7. ✅ Routes accessible and search functional 