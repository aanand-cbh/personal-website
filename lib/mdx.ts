import fs from "fs"
import path from "path"
import matter from "gray-matter"
import { serialize } from "next-mdx-remote/serialize"
import remarkGfm from "remark-gfm"

// Define the posts directory
const postsDirectory = path.join(process.cwd(), "content/blog")

// Calculate reading time based on content length
function calculateReadTime(content: string): string {
  const wordsPerMinute = 200
  const wordCount = content.split(/\s+/).length
  const minutes = Math.ceil(wordCount / wordsPerMinute)
  return `${minutes} min read`
}

// Interface for post frontmatter
export interface PostFrontMatter {
  title: string
  date: string
  description: string
  category: string
  tier?: string
  tags: string[]
  readTime: string
  clientSide: boolean
  image?: string
  schemas?: any[]
  [key: string]: any
}

// Interface for a complete post
export interface Post {
  slug: string
  frontMatter: PostFrontMatter
  content: any
}

// Function to strip numeric prefix from slug
export function getCleanSlug(fullSlug: string): string {
  const numericPrefixPattern = /^\d+\.\d+-/
  return fullSlug.replace(numericPrefixPattern, '')
}

// Function to get full slug from clean slug (searches across all categories)
export function getFullSlugFromCleanSlug(cleanSlug: string): string | null {
  try {
    const categories = getCategories()
    
    for (const category of categories) {
      const categoryPath = path.join(postsDirectory, category)
      const files = fs
        .readdirSync(categoryPath)
        .filter((file) => file.endsWith(".mdx") || file.endsWith(".md"))
        .map((file) => file.replace(/\.mdx?$/, ""))
      
      // Find the file that matches the clean slug
      const matchingFile = files.find(file => getCleanSlug(file) === cleanSlug)
      if (matchingFile) {
        return matchingFile
      }
    }
    
    return null
  } catch (error) {
    console.error("Error finding full slug from clean slug:", error)
    return null
  }
}

// Get all available categories
function getCategories(): string[] {
  try {
    return fs
      .readdirSync(postsDirectory, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name)
  } catch (error) {
    console.error("Error reading categories:", error)
    return []
  }
}

// Get all post slugs from all categories (returns clean slugs)
export function getPostSlugs(): string[] {
  try {
    const categories = getCategories()
    const allSlugs: string[] = []
    
    for (const category of categories) {
      const categoryPath = path.join(postsDirectory, category)
      const files = fs
        .readdirSync(categoryPath)
        .filter((file) => file.endsWith(".mdx") || file.endsWith(".md"))
        .map((file) => file.replace(/\.mdx?$/, ""))
      
      // Convert to clean slugs
      const cleanSlugs = files.map(file => getCleanSlug(file))
      allSlugs.push(...cleanSlugs)
    }
    
    return allSlugs
  } catch (error) {
    console.error("Error reading post directories:", error)
    return []
  }
}

// Get post data by clean slug (searches across all categories)
export async function getPostBySlug(cleanSlug: string): Promise<Post | null> {
  try {
    const fullSlug = getFullSlugFromCleanSlug(cleanSlug)
    if (!fullSlug) {
      return null
    }

    const categories = getCategories()
    
    // Search for the file in each category directory
    for (const category of categories) {
      const categoryPath = path.join(postsDirectory, category)
      const fullPath = path.join(categoryPath, `${fullSlug}.mdx`)
      const fallbackPath = path.join(categoryPath, `${fullSlug}.md`)

      let filePath: string | null = null
      if (fs.existsSync(fullPath)) {
        filePath = fullPath
      } else if (fs.existsSync(fallbackPath)) {
        filePath = fallbackPath
      }

      if (filePath) {
        const fileContents = fs.readFileSync(filePath, "utf8")
        const { data, content } = matter(fileContents)

        // Calculate read time if not provided
        if (!data.readTime) {
          data.readTime = calculateReadTime(content)
        }

        const frontMatter = {
          title: data.title || "",
          date: data.date || "",
          description: data.description || "",
          category: data.category || category, // Use directory name as fallback
          tier: data.tier,
          tags: data.tags || [],
          readTime: data.readTime,
          clientSide: data.clientSide || false,
          ...data
        }

        // Serialize the MDX content with better error handling
        let serializedContent
        try {
          serializedContent = await serialize(content, {
            mdxOptions: {
              remarkPlugins: [remarkGfm],
              rehypePlugins: [],
            },
            parseFrontmatter: false,
          })
        } catch (serializeError) {
          console.error(`Error serializing MDX content for ${cleanSlug}:`, serializeError)
          // Return a basic serialized structure if serialization fails
          serializedContent = {
            compiledSource: '',
            frontmatter: {},
            scope: {}
          }
        }

        const post = {
          slug: cleanSlug, // Use clean slug for consistency
          frontMatter,
          content: serializedContent
        }

        return post
      }
    }
    
    // File not found in any category
    return null
  } catch (error) {
    console.error(`Error getting post by slug ${cleanSlug}:`, error)
    return null
  }
}

// Get all posts (returns posts with clean slugs)
export async function getAllPosts(): Promise<Post[]> {
  const slugs = getPostSlugs()
  const posts = await Promise.all(
    slugs.map(async (slug) => {
      return await getPostBySlug(slug)
    })
  )

  const filteredPosts = posts
    .filter((post): post is Post => post !== null)
    .sort((post1, post2) => 
      new Date(post2.frontMatter.date).getTime() - new Date(post1.frontMatter.date).getTime()
    )
  return filteredPosts
}

// Get posts for a specific category (optimized, returns clean slugs)
export async function getPostsByCategory(category: string): Promise<Post[]> {
  try {
    const categoryPath = path.join(postsDirectory, category)
    
    // Check if category directory exists
    if (!fs.existsSync(categoryPath)) {
      console.warn(`Category directory not found: ${category}`)
      return []
    }
    
    // Get slugs only from this category
    const categoryFiles = fs
      .readdirSync(categoryPath)
      .filter((file) => file.endsWith(".mdx") || file.endsWith(".md"))
      .map((file) => file.replace(/\.mdx?$/, ""))
    
    // Load posts only from this category
    const posts = await Promise.all(
      categoryFiles.map(async (fullSlug) => {
        const cleanSlug = getCleanSlug(fullSlug)
        const filePath = path.join(categoryPath, `${fullSlug}.mdx`)
        const fallbackPath = path.join(categoryPath, `${fullSlug}.md`)
        
        let actualPath: string
        if (fs.existsSync(filePath)) {
          actualPath = filePath
        } else if (fs.existsSync(fallbackPath)) {
          actualPath = fallbackPath
        } else {
          return null
        }
        
        const fileContents = fs.readFileSync(actualPath, "utf8")
        const { data, content } = matter(fileContents)

        // Calculate read time if not provided
        if (!data.readTime) {
          data.readTime = calculateReadTime(content)
        }

        const frontMatter: Post['frontMatter'] = {
          title: data.title || "",
          date: data.date || "",
          description: data.description || "",
          category: data.category || category,
          tier: data.tier,
          tags: data.tags || [],
          readTime: data.readTime,
          clientSide: data.clientSide || false,
          ...data
        }

        // Serialize the MDX content
        let serializedContent
        try {
          serializedContent = await serialize(content, {
            mdxOptions: {
              remarkPlugins: [remarkGfm],
              rehypePlugins: [],
            },
            parseFrontmatter: false,
          })
        } catch (serializeError) {
          console.error(`Error serializing MDX content for ${cleanSlug}:`, serializeError)
          serializedContent = {
            compiledSource: '',
            frontmatter: {},
            scope: {}
          }
        }

        return {
          slug: cleanSlug, // Use clean slug for consistency
          frontMatter,
          content: serializedContent
        } as Post
      })
    )
    
    const validPosts = posts.filter((post): post is Post => post !== null)
    
    return validPosts.sort((post1, post2) => 
      new Date(post2.frontMatter.date).getTime() - new Date(post1.frontMatter.date).getTime()
    )
  } catch (error) {
    console.error(`Error getting posts for category ${category}:`, error)
    return []
  }
}

// Get post slugs for a specific category (returns clean slugs, useful for generateStaticParams)
export function getPostSlugsByCategory(category: string): string[] {
  try {
    const categoryPath = path.join(postsDirectory, category)
    
    // Check if category directory exists
    if (!fs.existsSync(categoryPath)) {
      console.warn(`Category directory not found: ${category}`)
      return []
    }
    
    // Get slugs only from this category
    const categoryFiles = fs
      .readdirSync(categoryPath)
      .filter((file) => file.endsWith(".mdx") || file.endsWith(".md"))
      .map((file) => file.replace(/\.mdx?$/, ""))
    
    // Convert to clean slugs
    return categoryFiles.map(file => getCleanSlug(file))
  } catch (error) {
    console.error(`Error getting slugs for category ${category}:`, error)
    return []
  }
}

// Get posts metadata without serializing content (returns clean slugs, useful for RSS, sitemaps, etc.)
export async function getPostsMetadata(): Promise<Omit<Post, 'content'>[]> {
  try {
    const categories = getCategories()
    const allPosts: Omit<Post, 'content'>[] = []
    
    for (const category of categories) {
      const categoryPath = path.join(postsDirectory, category)
      
      // Check if category directory exists
      if (!fs.existsSync(categoryPath)) {
        continue
      }
      
      // Get slugs only from this category
      const categoryFiles = fs
        .readdirSync(categoryPath)
        .filter((file) => file.endsWith(".mdx") || file.endsWith(".md"))
        .map((file) => file.replace(/\.mdx?$/, ""))
      
      // Load posts metadata only from this category
      for (const fullSlug of categoryFiles) {
        const cleanSlug = getCleanSlug(fullSlug)
        const filePath = path.join(categoryPath, `${fullSlug}.mdx`)
        const fallbackPath = path.join(categoryPath, `${fullSlug}.md`)
        
        let actualPath: string
        if (fs.existsSync(filePath)) {
          actualPath = filePath
        } else if (fs.existsSync(fallbackPath)) {
          actualPath = fallbackPath
        } else {
          continue
        }
        
        const fileContents = fs.readFileSync(actualPath, "utf8")
        const { data, content } = matter(fileContents)

        // Calculate read time if not provided
        if (!data.readTime) {
          data.readTime = calculateReadTime(content)
        }

        const frontMatter: Post['frontMatter'] = {
          title: data.title || "",
          date: data.date || "",
          description: data.description || "",
          category: data.category || category,
          tier: data.tier,
          tags: data.tags || [],
          readTime: data.readTime,
          clientSide: data.clientSide || false,
          ...data
        }

        allPosts.push({
          slug: cleanSlug, // Use clean slug for consistency
          frontMatter
        })
      }
    }
    
    return allPosts.sort((post1, post2) => 
      new Date(post2.frontMatter.date).getTime() - new Date(post1.frontMatter.date).getTime()
    )
  } catch (error) {
    console.error("Error getting posts metadata:", error)
    return []
  }
}
