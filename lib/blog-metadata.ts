import { getPostBySlug } from "@/lib/mdx";
import { getBaseUrl } from "@/lib/utils";

interface GenerateBlogMetadataOptions {
  slug: string;
  categoryTitle?: string;
  backLink: string;
  category?: string;
}

export async function generateBlogMetadata({ 
  slug, 
  categoryTitle, 
  backLink,
  category 
}: GenerateBlogMetadataOptions) {
  const baseUrl = getBaseUrl();
  
  try {
    const post = await getPostBySlug(slug)
    if (!post) {
      return {
        title: 'Post Not Found',
      }
    }

    // Verify category if specified
    if (category && post.frontMatter.category !== category) {
      return {
        title: 'Post Not Found',
      }
    }

    const { title, description, date } = post.frontMatter
    const ogImage = post.frontMatter.image 
      ? post.frontMatter.image 
      : `${baseUrl}/og?title=${encodeURIComponent(title)}`

    const pageTitle = categoryTitle ? `${title} - ${categoryTitle}` : title;

    return {
      title: pageTitle,
      description,
      alternates: {
        canonical: `${baseUrl}${backLink}/${post.slug}`,
      },
      openGraph: {
        title,
        description,
        type: 'article',
        publishedTime: date,
        url: `${baseUrl}${backLink}/${post.slug}`,
        images: [
          {
            url: ogImage,
          },
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: [ogImage],
      },
    }
  } catch (error) {
    console.error('Error generating metadata:', error)
    return {
      title: 'Post Not Found',
    }
  }
} 