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

### 4. Johnny.Decimal Blog Post Naming Convention
**CRITICAL**: All new blog posts must follow Johnny.Decimal naming to maintain IDE organization and prevent file chaos.

**Naming Structure**: `{category-id}.{post-id}-{descriptive-slug}.mdx`

**Category IDs** (following Johnny.Decimal principles):
- **Tech**: `10` (Technology & Development)
- **Travel**: `20` (Travel & Exploration) 
- **Spiritual**: `30` (Spirituality & Philosophy)
- **Money**: `40` (Finance & Money Matters)
- **Personal**: `50` (Personal Stories & Life)
- **Health**: `60` (Health & Wellness) - Future category

### 5. MDX Hydration Error Prevention Pattern
**CRITICAL**: MDX automatically wraps content in `<p>` tags, causing hydration errors when using `<p>` tags inside components.

**Problem**: 
```jsx
// ❌ This causes nested <p> tags and hydration errors
<p className="mb-4">
  <p>Content here</p>  // Nested <p> inside <p>
</p>
```

**Solution**: Use `<div>` tags instead of `<p>` tags in MDX content
```jsx
// ✅ This prevents hydration errors
<div className="mb-4">
  <div>Content here</div>  // No nesting issues
</div>
```

**Affected Components**:
- `TooltipContent` - Replace `<p>` with `<div>`
- `HoverCardContent` - Replace `<p>` with `<div>`
- `CardContent` paragraphs - Replace `<p className="mb-4">` with `<div className="mb-4">`
- Grid card content - Replace `<p className="text-sm">` with `<div className="text-sm">`

**Error Pattern**: 
```
In HTML, <p> cannot be a descendant of <p>.
This will cause a hydration error.
```

**Prevention Checklist**:
- [ ] Never use `<p>` tags inside MDX content
- [ ] Use `<div>` tags for all content blocks
- [ ] Maintain same styling with `className` attributes
- [ ] Test with `npm run dev` to verify no hydration errors

**Post IDs**: Sequential numbering within each category (0001-9999)
- Start at `0001` for each category
- Increment sequentially: `0001`, `0002`, `0003`, etc.
- Never skip numbers or reuse them
- Maximum 9999 posts per category

**Examples**:
```
content/blog/tech/
├── 10.0001-getting-started.mdx
├── 10.0002-favorite-resources.mdx
├── 10.0003-interactive-shadcn-components.mdx
├── 10.0004-understanding-react-hydration-errors.mdx
├── 10.0005-cursor-memory-bank.mdx
└── 10.0006-learning-nextjs.mdx

content/blog/travel/
├── 20.0001-places-to-visit-near-hyderabad.mdx

content/blog/spiritual/
├── 30.0001-oprah-winfrey-why-i-follow-hinduism.mdx
└── 30.0002-15-books-every-bharatiya-must-read.mdx

content/blog/money/
└── 40.0001-triple-witching-hour-explained.mdx
```

**Benefits**:
- **IDE Organization**: Files sort numerically, maintaining logical order
- **Scalability**: Supports up to 9999 posts per category (59,994 total posts)
- **Memory**: Easy to remember and reference specific posts
- **Communication**: "Check post 10.0003" is clear and memorable
- **Future-Proof**: System grows without reorganization
- **Consistency**: Uniform naming across all categories

**Implementation Rules**:
1. **Always use the format**: `{category-id}.{post-id}-{descriptive-slug}.mdx`
2. **Category IDs are fixed**: Never change once established
3. **Post IDs are sequential**: No gaps or reuse
4. **Descriptive slugs**: Use kebab-case for readability
5. **Leading zeros**: Always use `0001`, `0002`, etc. (not `1`, `2`)
6. **Maximum length**: Keep descriptive part under 50 characters

**Migration Strategy**:
- Existing posts can be renamed gradually
- Update internal links and references
- Maintain redirects if needed
- Update memory bank documentation

### 6. Blog Post Creation Protocol
**MANDATORY**: This protocol must be followed for every new blog post to ensure consistent quality, SEO optimization, and optimal UI/UX.

#### Step 1: UI Component Analysis
**Before writing any content**, analyze available UI components:

1. **List All Components**: 
   ```bash
   ls components/ui/
   ```

2. **Deep Component Inspection**: For each relevant component:
   - Read the component file to understand props and functionality
   - Check for client-side requirements (`use client`, event handlers)
   - Understand styling and theming options
   - Note any dependencies or requirements

3. **Component Selection Strategy**:
   - **Cards**: For content sections, feature highlights, key takeaways
   - **Tabs**: For organizing related content (e.g., different perspectives, time periods)
   - **Alerts**: For warnings, tips, important notes
   - **Badges**: For categorization, status indicators, tags
   - **Tables**: For structured data, comparisons, statistics
   - **Progress**: For visual representations of metrics, risk levels
   - **Accordion**: For expandable content, FAQs, detailed explanations
   - **Tooltips/HoverCards**: For inline explanations without breaking flow
   - **Separators**: For visual content separation
   - **Buttons**: For call-to-actions, navigation elements

#### Step 2: SEO and Metadata Implementation
**Every blog post must include comprehensive frontmatter**:

```yaml
---
title: "Descriptive, SEO-Optimized Title"
date: "YYYY-MM-DD"
description: "Compelling 150-160 character description for search results"
category: "category-name"
tags: [
  "primary-tag",
  "secondary-tag",
  "related-tag"
]
keywords: [
  "primary-keyword",
  "long-tail-keyword",
  "semantic-variations"
]
schemas:
  - type: "Article"
    name: "Article Title"
    description: "Detailed article description"
    about:
      type: "Thing"
      name: "Main Topic"
      description: "Topic description"
    audience:
      type: "Audience"
      audienceType: ["Target Audience 1", "Target Audience 2"]
    author:
      - type: "Person"
        name: "Abhishek"
        description: "Author description"
    mainEntityOfPage:
      type: "WebPage"
      name: "Page Title"
      description: "Page description"
    keywords: ["keyword1", "keyword2"]
    articleSection: "Category Name"
    articleBody: "Article content summary"
    datePublished: "YYYY-MM-DD"
    dateModified: "YYYY-MM-DD"
    wordCount: 1500
    inLanguage: "en-US"
    isAccessibleForFree: true
    isFamilyFriendly: true
    publisher:
      type: "Organization"
      name: "Personal Website"
      url: "https://kaivlya.com"
    image:
      type: "ImageObject"
      url: "https://kaivlya.com/blog/category/image.jpg"
      width: 1200
      height: 630
      alt: "Descriptive alt text"
  - type: "FAQPage"
    mainEntity:
      - type: "Question"
        name: "Common question about topic?"
        acceptedAnswer:
          type: "Answer"
          text: "Clear, concise answer"
  - type: "BreadcrumbList"
    itemListElement:
      - type: "ListItem"
        position: 1
        name: "Home"
        item: "https://kaivlya.com"
      - type: "ListItem"
        position: 2
        name: "Blog"
        item: "https://kaivlya.com/blog"
      - type: "ListItem"
        position: 3
        name: "Category"
        item: "https://kaivlya.com/blog/category"
      - type: "ListItem"
        position: 4
        name: "Post Title"
        item: "https://kaivlya.com/blog/category/post-slug"
tier: "reference|revisit|read"
readTime: "X min read"
clientSide: true  # REQUIRED if using interactive components
---
```

#### Step 3: Client-Side Component Detection
**CRITICAL**: If using any interactive components, add `clientSide: true` to frontmatter:

**Interactive Components Requiring clientSide: true**:
- `Tooltip` / `TooltipContent` / `TooltipTrigger`
- `HoverCard` / `HoverCardContent` / `HoverCardTrigger`
- `Accordion` / `AccordionContent` / `AccordionTrigger`
- `Tabs` / `TabsContent` / `TabsList` / `TabsTrigger`
- `Dialog` / `AlertDialog`
- `Popover`
- `DropdownMenu`
- `ContextMenu`
- `Command` (search components)
- `Carousel`
- `Slider`
- `Switch`
- `Checkbox`
- `RadioGroup`
- `Select`
- `Form` components with validation

**Static Components (No clientSide needed)**:
- `Card` / `CardContent` / `CardHeader` / `CardTitle`
- `Badge`
- `Alert` / `AlertDescription` / `AlertTitle`
- `Separator`
- `Progress`
- `Table` / `TableBody` / `TableCell` / `TableHead` / `TableHeader` / `TableRow`
- `Button` (without onClick handlers)
- `Avatar`
- `Image`
- `AspectRatio`
- `Skeleton`

#### Step 4: Content Quality Checklist
- [ ] **UI Components**: Appropriate components selected and implemented
- [ ] **SEO Metadata**: Complete frontmatter with all required fields
- [ ] **Client-Side Detection**: `clientSide: true` added if using interactive components
- [ ] **Hydration Prevention**: No `<p>` tags in MDX content (use `<div>` instead)
- [ ] **Johnny.Decimal Naming**: Proper file naming convention followed
- [ ] **Content Structure**: Logical flow with proper headings and sections
- [ ] **Visual Hierarchy**: Clear information architecture with appropriate components
- [ ] **Mobile Responsiveness**: Components work well on all screen sizes
- [ ] **Accessibility**: Proper alt text, ARIA labels, keyboard navigation
- [ ] **Performance**: No unnecessary client-side JavaScript for static content

### 7. SEO and Metadata Pattern
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

### 4.1. Blog Post SEO Requirements Pattern
**CRITICAL**: Every new blog post must include comprehensive SEO metadata for optimal search visibility.

### 4.2. MDX Content Structure Pattern
**CRITICAL**: Avoid nested HTML elements that cause hydration errors in MDX content.

**Common Issues to Avoid**:
- **Nested `<p>` tags**: Never use `<p>` tags inside other `<p>` tags
- **Lead paragraphs**: Use `<div className="lead">` instead of `<p className="lead">`
- **Custom components**: Ensure custom components don't create invalid HTML nesting

**Best Practices**:
```mdx
<!-- ✅ Correct -->
<div className="lead">
  This is a lead paragraph with proper structure.
</div>

<!-- ❌ Incorrect -->
<p className="lead">
  <p>This creates nested p tags and causes hydration errors.</p>
</p>
```

**Validation**:
- All MDX files are validated during build
- Check for nested `<p>` tags before publishing
- Use browser dev tools to verify no hydration warnings

**Required Frontmatter Elements**:
```yaml
---
title: "Descriptive, keyword-rich title"
date: "YYYY-MM-DD"
description: "Compelling 150-160 character description with primary keywords"
category: "category-name"
tags: [
  "primary-tag",
  "secondary-tag",
  "related-tag",
  "long-tail-keyword"
]
keywords: [
  "primary keyword",
  "secondary keyword",
  "long-tail phrases",
  "related terms"
]
schemas:
  - type: "Article"
    name: "Post Title"
    description: "Detailed article description"
    about:
      type: "Thing"
      name: "Topic Name"
      description: "Topic description"
    audience:
      type: "Audience"
      audienceType: ["Target Audience 1", "Target Audience 2"]
    author:
      - type: "Person"
        name: "Author Name"
        description: "Author description"
    mainEntityOfPage:
      type: "WebPage"
      name: "Page Title"
      description: "Page description"
    keywords: ["schema keywords"]
    articleSection: "Category Name"
    articleBody: "Content summary"
    datePublished: "YYYY-MM-DD"
    dateModified: "YYYY-MM-DD"
    wordCount: 2500
    inLanguage: "en-US"
    isAccessibleForFree: true
    isFamilyFriendly: true
    publisher:
      type: "Organization"
      name: "Personal Website"
      url: "https://kaivlya.com"
    image:
      type: "ImageObject"
      url: "https://kaivlya.com/blog/category/post-image.jpg"
      width: 1200
      height: 630
      alt: "Descriptive alt text"
  - type: "FAQPage"
    mainEntity:
      - type: "Question"
        name: "Common question about topic?"
        acceptedAnswer:
          type: "Answer"
          text: "Clear, helpful answer to the question"
  - type: "BreadcrumbList"
    itemListElement:
      - type: "ListItem"
        position: 1
        name: "Home"
        item: "https://kaivlya.com"
      - type: "ListItem"
        position: 2
        name: "Blog"
        item: "https://kaivlya.com/blog"
      - type: "ListItem"
        position: 3
        name: "Category"
        item: "https://kaivlya.com/blog/category"
      - type: "ListItem"
        position: 4
        name: "Post Title"
        item: "https://kaivlya.com/blog/category/post-slug"
tier: "reference|revisit|read"
readTime: "X min read"
---
```

**SEO Checklist for New Posts**:
- [ ] **Title**: Descriptive, keyword-rich, under 60 characters
- [ ] **Description**: Compelling, 150-160 characters, includes primary keywords
- [ ] **Tags**: 5-10 relevant tags for categorization and discovery
- [ ] **Keywords**: 10-15 targeted keywords for search optimization
- [ ] **Article Schema**: Complete metadata with audience, author, and content details
- [ ] **FAQ Schema**: 3-5 common questions users search for
- [ ] **Breadcrumb Schema**: Complete navigation path
- [ ] **Word Count**: Accurate count for content length indication
- [ ] **Image Metadata**: Proper dimensions, alt text, and URL
- [ ] **Category Consistency**: Proper categorization for internal linking

**Reference Examples**:
- **15-books-every-bharatiya-must-read.mdx**: Comprehensive spiritual content SEO
- **triple-witching-hour-explained.mdx**: Financial content SEO with trading focus

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

## Memory Bank Verification
After reading this file, I should be able to answer:
- What are the key architectural patterns?
- How does the blog categorization system work?
- What are the component patterns?

If I cannot answer these questions confidently, I have not read this file properly.

## Memory Bank Reading Reminder
**CRITICAL**: This is file 03 of 06. I must also read:
- 01-projectbrief.md (Project foundation and scope) ✓
- 02-productContext.md (Why this project exists and how it should work) ✓
- 04-techContext.md (Technology stack and development setup)
- 05-activeContext.md (Current work focus and recent changes)
- 06-progress.md (What works and what's left to build)

Only proceed with tasks after reading ALL numbered files (01-06) in order.
``` 