import fs from "fs"
import matter from "gray-matter"
import { serialize } from 'next-mdx-remote/serialize'
import path from "path"
import remarkGfm from 'remark-gfm'

// Define the Post type
export type Post = {
  slug: string
  frontMatter: {
    title: string
    date: string
    description: string
    category?: string
    tier?: 'reference' | 'revisit' | 'read'
    readTime?: string
    tags?: string[]
    clientSide?: boolean
    [key: string]: any
  }
  content: any // Changed from string to any to accommodate serialized content
}

// Define the directory where blog posts are stored
const postsDirectory = path.join(process.cwd(), "content/blog")

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

// Get all post slugs from all categories
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
      
      allSlugs.push(...files)
    }
    
    return allSlugs
  } catch (error) {
    console.error("Error reading post directories:", error)
    return []
  }
}

// Get post data by slug (searches across all categories)
export async function getPostBySlug(slug: string): Promise<Post | null> {
  try {
    const categories = getCategories()
    
    // Search for the file in each category directory
    for (const category of categories) {
      const categoryPath = path.join(postsDirectory, category)
      const fullPath = path.join(categoryPath, `${slug}.mdx`)
      const fallbackPath = path.join(categoryPath, `${slug}.md`)

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
          console.error(`Error serializing MDX content for ${slug}:`, serializeError)
          // Return a basic serialized structure if serialization fails
          serializedContent = {
            compiledSource: '',
            frontmatter: {},
            scope: {}
          }
        }

        const post = {
          slug,
          frontMatter,
          content: serializedContent
        }

        return post
      }
    }
    
    // File not found in any category
    return null
  } catch (error) {
    console.error(`Error getting post by slug ${slug}:`, error)
    return null
  }
}

// Get all posts with their data
export async function getAllPosts(): Promise<Post[]> {
  const slugs = getPostSlugs()
  const posts = await Promise.all(
    slugs.map(async (slug) => {
      const post = await getPostBySlug(slug)
      return post
    })
  )
  const filteredPosts = posts
    .filter((post): post is Post => post !== null)
    .sort((post1, post2) => 
      new Date(post2.frontMatter.date).getTime() - new Date(post1.frontMatter.date).getTime()
    )
  return filteredPosts
}

// Get posts for a specific category (optimized)
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
      categoryFiles.map(async (slug) => {
        const filePath = path.join(categoryPath, `${slug}.mdx`)
        const fallbackPath = path.join(categoryPath, `${slug}.md`)
        
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
          console.error(`Error serializing MDX content for ${slug}:`, serializeError)
          serializedContent = {
            compiledSource: '',
            frontmatter: {},
            scope: {}
          }
        }

        return {
          slug,
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

// Helper function to calculate read time
function calculateReadTime(content: string): string {
  const wordsPerMinute = 175
  const wordCount = content.split(/\s+/).length
  const readTime = Math.ceil(wordCount / wordsPerMinute)
  return `${readTime} min read`
}
