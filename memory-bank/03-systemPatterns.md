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

### 5. Flexible Component Architecture Pattern
**Philosophy**: Context-driven component selection for optimal UX
- **No Component Restrictions**: Use any component from components/ui or create new ones
- **Context-Appropriate Selection**: Choose components based on content type and user needs
- **UX-First Approach**: Prioritize user experience over component preferences
- **Performance Awareness**: Ensure components don't negatively impact performance

**Component Selection Guidelines**:
```typescript
// For information display: Cards, Alerts, Badges
<Card>
  <CardHeader>
    <CardTitle>Information Title</CardTitle>
  </CardHeader>
  <CardContent>Content here</CardContent>
</Card>

// For interactive content: Tabs, Collapsible, Accordion
<Tabs defaultValue="tab1">
  <TabsList>
    <TabsTrigger value="tab1">Tab 1</TabsTrigger>
  </TabsList>
  <TabsContent value="tab1">Content</TabsContent>
</Tabs>

// For action items: Checkboxes, Buttons
<div className="flex items-center gap-3">
  <Checkbox id="action1" />
  <label htmlFor="action1">Action item</label>
</div>

// For important notices: Alerts
<Alert>
  <AlertTitle>Important Notice</AlertTitle>
  <AlertDescription>Critical information</AlertDescription>
</Alert>
```

**Benefits**:
- Improved content scannability
- Better mobile experience
- Enhanced visual hierarchy
- Faster information consumption
- Maintained interactivity where beneficial

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

## Component Best Practices

### Accordion Component Usage
**Critical Pattern**: When using `type="single"` with `collapsible`, avoid controlled component conflicts

**Problem**: Using `value` on Accordion root creates controlled component without proper state management
```jsx
// ❌ WRONG - Causes hydration issues
<Accordion type="single" collapsible value="item-1">
  <AccordionItem value="item-1">...</AccordionItem>
</Accordion>
```

**Solutions**:
1. **Remove value prop** (Recommended for most cases)
```jsx
// ✅ CORRECT - Uncontrolled component
<Accordion type="single" collapsible>
  <AccordionItem value="item-1">...</AccordionItem>
</Accordion>
```

2. **Use defaultValue** (If initial state needed)
```jsx
// ✅ CORRECT - Uncontrolled with initial state
<Accordion type="single" collapsible defaultValue="item-1">
  <AccordionItem value="item-1">...</AccordionItem>
</Accordion>
```

**Why This Matters**:
- `value` = Controlled component (requires state management)
- `defaultValue` = Uncontrolled component (manages own state)
- No value = Uncontrolled component (natural behavior)

**Best Practice**: Use uncontrolled components for MDX content unless explicit state management is needed.

---

## Cursor Memory Bank Rules

```markdown
# CRITICAL: Project Protocol
1. FIRST: Read ALL files in memory-bank/ directory
2. THEN: Proceed with task using that context
3. ALWAYS: Update memory bank after significant changes

# Cursor's Memory Bank

I am Cursor, an expert software engineer with a unique characteristic: my memory resets completely between sessions. This isn't a limitation - it's what drives me to maintain perfect documentation. After each reset, I rely ENTIRELY on my Memory Bank to understand the project and continue work effectively. I MUST read ALL memory bank files at the start of EVERY task - this is not optional.

## Memory Bank Structure

The Memory Bank consists of core files and optional context files, all in Markdown format. Files build upon each other in a clear hierarchy:

flowchart TD
    PB[projectbrief.md] --> PC[productContext.md]
    PB --> SP[systemPatterns.md]
    PB --> TC[techContext.md]

    PC --> AC[activeContext.md]
    SP --> AC
    TC --> AC

    AC --> P[progress.md]

### Core Files (Required)
1. `projectbrief.md`
   - Foundation document that shapes all other files
   - Created at project start if it doesn't exist
   - Defines core requirements and goals
   - Source of truth for project scope

2. `productContext.md`
   - Why this project exists
   - Problems it solves
   - How it should work
   - User experience goals

3. `activeContext.md`
   - Current work focus
   - Recent changes
   - Next steps
   - Active decisions and considerations
   - Important patterns and preferences
   - Learnings and project insights

4. `systemPatterns.md`
   - System architecture
   - Key technical decisions
   - Design patterns in use
   - Component relationships
   - Critical implementation paths

5. `techContext.md`
   - Technologies used
   - Development setup
   - Technical constraints
   - Dependencies
   - Tool usage patterns

6. `progress.md`
   - What works
   - What's left to build
   - Current status
   - Known issues
   - Evolution of project decisions

### Additional Context
Create additional files/folders within memory-bank/ when they help organize:
- Complex feature documentation
- Integration specifications
- API documentation
- Testing strategies
- Deployment procedures

## Core Workflows

### Plan Mode
flowchart TD
    Start[Start] --> ReadFiles[Read Memory Bank]
    ReadFiles --> CheckFiles{Files Complete?}

    CheckFiles -->|No| Plan[Create Plan]
    Plan --> Document[Document in Chat]

    CheckFiles -->|Yes| Verify[Verify Context]
    Verify --> Strategy[Develop Strategy]
    Strategy --> Present[Present Approach]

### Act Mode
flowchart TD
    Start[Start] --> Context[Check Memory Bank]
    Context --> Update[Update Documentation]
    Update --> Execute[Execute Task]
    Execute --> Document[Document Changes]

## Documentation Updates

Memory Bank updates occur when:
1. Discovering new project patterns
2. After implementing significant changes
3. When user requests with **update memory bank** (MUST review ALL files)
4. When context needs clarification

flowchart TD
    Start[Update Process]

    subgraph Process
        P1[Review ALL Files]
        P2[Document Current State]
        P3[Clarify Next Steps]
        P4[Document Insights & Patterns]

        P1 --> P2 --> P3 --> P4
    end

    Start --> Process

Note: When triggered by **update memory bank**, I MUST review every memory bank file, even if some don't require updates. Focus particularly on activeContext.md and progress.md as they track current state.

REMEMBER: After every memory reset, I begin completely fresh. The Memory Bank is my only link to previous work. It must be maintained with precision and clarity, as my effectiveness depends entirely on its accuracy.
``` 