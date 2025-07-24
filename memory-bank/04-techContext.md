# Technical Context

## Technology Stack

### Core Framework
- **Next.js 15.2.4**: Latest App Router with React Server Components
- **React 19**: Latest stable version with modern patterns
- **TypeScript**: Strict typing throughout the application
- **Node.js**: Server-side runtime

### Styling & UI
- **Tailwind CSS**: Utility-first CSS framework
- **shadcn/ui**: High-quality, accessible component library
- **Lucide React**: Icon library with consistent design
- **Inter Font**: Modern, readable typography

### Content Management
- **MDX**: Markdown with React components for rich content
- **Gray Matter**: Frontmatter parsing for metadata
- **Next-MDX-Remote**: Server-side MDX compilation
- **Remark/Rehype**: Markdown processing pipeline

### Development Tools
- **ESLint**: Code linting and quality enforcement
- **Prettier**: Code formatting (implied by consistent formatting)
- **Git**: Version control
- **pnpm**: Package management (lockfile present)

### Analytics & Monitoring
- **Vercel Analytics**: Performance and usage tracking
- **Vercel Speed Insights**: Core Web Vitals monitoring
- **Google Analytics**: Detailed user behavior analysis

### Build & Deployment
- **Vercel**: Hosting and deployment platform
- **Static Generation**: Pre-built pages for performance
- **Edge Runtime**: Some pages use edge runtime for global distribution

## Development Setup

### Package Manager
```bash
pnpm install  # Primary package manager
npm install   # Fallback (package-lock.json present)
```

### Key Scripts
```json
{
  "dev": "next dev",
  "build": "npm run validate-mdx && npm run validate-resources && next build",
  "start": "next start",
  "validate-mdx": "node scripts/validate-mdx.js",
  "validate-resources": "ts-node scripts/validateResources.ts"
}
```

### Configuration Files
- `next.config.mjs`: Next.js configuration with edge runtime settings
- `tailwind.config.ts`: Tailwind CSS customization
- `tsconfig.json`: TypeScript configuration
- `components.json`: shadcn/ui component configuration

## File Structure

### Application Structure
```
app/
├── globals.css                 # Global styles
├── layout.tsx                  # Root layout with providers
├── page.tsx                    # Homepage
├── about/page.tsx              # About page
├── blog/
│   ├── page.tsx                # Main blog page with categories
│   ├── [slug]/page.tsx         # Individual blog posts (uncategorized)
│   ├── tech/
│   │   ├── page.tsx            # Tech category page
│   │   └── [slug]/page.tsx     # Tech blog posts
│   ├── travel/[slug]/page.tsx  # Travel blog posts
│   └── spiritual/[slug]/page.tsx # Spiritual blog posts
├── resources/                  # Resource pages
└── [other routes]/
```

### Content Structure
```
content/
└── blog/
    ├── *.mdx                   # Blog post files with frontmatter
    └── [post-images]/          # Associated media files
```

### Component Organization
```
components/
├── ui/                         # shadcn/ui components
├── providers/                  # React context providers
├── category-blog-page.tsx      # Reusable category page
├── category-blog-search.tsx    # Category search component
├── mdx-*.tsx                   # MDX rendering components
└── [other components]/
```

## Technical Constraints

### Performance Requirements
- **Core Web Vitals**: Must pass all metrics
- **Page Load**: < 2 seconds for optimal user experience
- **SEO**: Perfect Lighthouse scores for search ranking
- **Mobile Performance**: Optimized for mobile-first usage

### Browser Support
- **Modern Browsers**: ES2020+ features assumed
- **Mobile Safari**: Critical for mobile experience
- **Chrome/Firefox**: Primary desktop browsers

### Content Constraints
- **MDX Processing**: Content must be valid MDX
- **Frontmatter Schema**: Strict typing for metadata
- **Image Optimization**: Next.js Image component required
- **Static Generation**: Content changes require rebuild

## Dependencies

### Critical Dependencies
```json
{
  "next": "15.2.4",
  "react": "^19.0.0",
  "@next/mdx": "^15.2.4",
  "next-mdx-remote": "^5.0.0",
  "gray-matter": "^4.0.3",
  "fuse.js": "^7.0.0"
}
```

### UI Dependencies
```json
{
  "tailwindcss": "^3.4.1",
  "lucide-react": "^0.344.0",
  "@radix-ui/*": "Multiple radix components",
  "class-variance-authority": "^0.7.0"
}
```

### Analytics Dependencies
```json
{
  "@vercel/analytics": "^1.5.0",
  "@vercel/speed-insights": "^1.1.0",
  "@next/third-parties": "^15.2.4"
}
```

## Build Process

### Validation Pipeline
1. **MDX Validation**: `scripts/validate-mdx.js` checks all MDX files
2. **Resource Validation**: `scripts/validateResources.ts` validates resource data
3. **TypeScript Check**: Type checking during build
4. **Static Generation**: Pre-builds all static pages

### Environment Configuration
- **Development**: Hot reloading with fast refresh
- **Production**: Optimized builds with static generation
- **Vercel Deployment**: Automatic builds on git push

## Performance Optimizations

### Image Handling
- **Next.js Image**: Automatic optimization and lazy loading
- **Multiple Formats**: WebP with fallbacks
- **Responsive Images**: Proper sizing for all devices

### Code Splitting
- **Route-based**: Automatic splitting by Next.js
- **Component-based**: Dynamic imports for heavy components
- **Bundle Analysis**: Monitor bundle sizes

### Caching Strategy
- **Static Files**: Long-term caching with CDN
- **API Responses**: Appropriate cache headers
- **Build Cache**: Incremental builds for faster deployment

## Security Considerations

### Content Security
- **MDX Sanitization**: Safe rendering of user content
- **XSS Prevention**: React's built-in escaping
- **HTTPS Only**: Secure transmission of all data

### Dependency Security
- **Regular Updates**: Keep dependencies current
- **Vulnerability Scanning**: Monitor for security issues
- **Minimal Dependencies**: Reduce attack surface

## Monitoring & Debugging

### Development Tools
- **React DevTools**: Component inspection and profiling
- **Next.js DevTools**: Framework-specific debugging
- **Browser DevTools**: Performance and network analysis

### Production Monitoring
- **Vercel Analytics**: Real user monitoring
- **Error Tracking**: Built-in error boundaries
- **Performance Metrics**: Core Web Vitals tracking

## Future Technical Considerations

### Scalability
- **Content Growth**: MDX system scales with file-based approach
- **Performance**: Static generation maintains speed at scale
- **Search**: May need server-side search for large content volumes

### Technology Evolution
- **React Updates**: Stay current with React ecosystem
- **Next.js Updates**: Leverage new framework features
- **Performance Tools**: Adopt new optimization techniques

## Memory Bank Verification
After reading this file, I should be able to answer:
- What is the technology stack?
- What are the performance requirements?
- How does the build process work?

If I cannot answer these questions confidently, I have not read this file properly.

## Memory Bank Reading Reminder
**CRITICAL**: This is file 04 of 06. I must also read:
- 01-projectbrief.md (Project foundation and scope) ✓
- 02-productContext.md (Why this project exists and how it should work) ✓
- 03-systemPatterns.md (Technical architecture and design patterns) ✓
- 05-activeContext.md (Current work focus and recent changes)
- 06-progress.md (What works and what's left to build)

Only proceed with tasks after reading ALL numbered files (01-06) in order. 