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
    readTime?: string
    tags?: string[]
    clientSide?: boolean
    [key: string]: any
  }
  content: any // Changed from string to any to accommodate serialized content
}

// Define the directory where blog posts are stored
const postsDirectory = path.join(process.cwd(), "content/blog")

// Get all post slugs
export function getPostSlugs(): string[] {
  try {
    return fs
      .readdirSync(postsDirectory)
      .filter((file) => file.endsWith(".mdx") || file.endsWith(".md"))
      .map((file) => file.replace(/\.mdx?$/, ""))
  } catch (error) {
    console.error("Error reading post directory:", error)
    return []
  }
}

// Get post data by slug
export async function getPostBySlug(slug: string): Promise<Post | null> {
  try {
    const fullPath = path.join(postsDirectory, `${slug}.mdx`)
    const fallbackPath = path.join(postsDirectory, `${slug}.md`)

    let filePath: string
    if (fs.existsSync(fullPath)) {
      filePath = fullPath
    } else if (fs.existsSync(fallbackPath)) {
      filePath = fallbackPath
    } else {
      return null
    }

    const fileContents = fs.readFileSync(filePath, "utf8")
    const { data, content } = matter(fileContents)

    // Calculate read time if not provided
    if (!data.readTime) {
      data.readTime = calculateReadTime(content)
    }

    // Ensure tags is always an array
    if (data.tags && !Array.isArray(data.tags)) {
      if (typeof data.tags === 'string') {
        // Parse YAML array format or comma-separated string
        if (data.tags.startsWith('[') && data.tags.endsWith(']')) {
          data.tags = data.tags.slice(1, -1).split(',').map((tag: string) => tag.trim())
        } else {
          data.tags = data.tags.split(',').map((tag: string) => tag.trim())
        }
      } else {
        data.tags = []
      }
    }

    const frontMatter = {
      title: data.title || "Untitled",
      date: data.date || new Date().toISOString(),
      description: data.description || "",
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

// Helper function to calculate read time
function calculateReadTime(content: string): string {
  const wordsPerMinute = 175
  const wordCount = content.split(/\s+/).length
  const readTime = Math.ceil(wordCount / wordsPerMinute)
  return `${readTime} min read`
}
