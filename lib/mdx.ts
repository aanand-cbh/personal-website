import fs from "fs"
import matter from "gray-matter"
import { serialize } from 'next-mdx-remote/serialize'
import path from "path"
import remarkGfm from 'remark-gfm'

// Define the directory where blog posts are stored
const postsDirectory = path.join(process.cwd(), "content/blog")

// Define the Post type
export type Post = {
  slug: string
  frontMatter: {
    title: string
    date: string
    description: string
    readTime?: string
    tags?: string[]
    [key: string]: any
  }
  content: string
  mdxSource: any
}

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

    const filePath = fs.existsSync(fullPath) ? fullPath : fallbackPath

    if (!fs.existsSync(filePath)) {
      return null
    }

    const fileContents = fs.readFileSync(filePath, "utf8")
    const { data, content } = matter(fileContents)
    
    // Serialize the MDX content
    const mdxSource = await serialize(content, {
      parseFrontmatter: true,
      mdxOptions: {
        development: process.env.NODE_ENV === 'development',
        format: 'mdx',
        remarkPlugins: [remarkGfm],
        rehypePlugins: [],
      },
    })

    return {
      slug,
      frontMatter: {
        title: data.title || "Untitled",
        date: data.date || new Date().toISOString(),
        description: data.description || "",
        readTime: data.readTime || calculateReadTime(content),
        ...data,
      },
      content,
      mdxSource: JSON.parse(JSON.stringify(mdxSource)),
    }
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
    .sort((post1, post2) => new Date(post2.frontMatter.date).getTime() - new Date(post1.frontMatter.date).getTime())
  return filteredPosts
}

// Helper function to calculate read time
function calculateReadTime(content: string): string {
  const wordsPerMinute = 200
  const wordCount = content.split(/\s+/).length
  const readTime = Math.ceil(wordCount / wordsPerMinute)
  return `${readTime} min read`
}
