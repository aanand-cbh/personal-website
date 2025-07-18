import { CategoryBlogPage } from "@/components/category-blog-page";
import { getBaseUrl } from "@/lib/utils";

const baseUrl = getBaseUrl();

export const metadata = {
  title: "Tech & Software Engineering - Blog",
  description: "My thoughts and experiences on technology, software engineering, and development.",
  openGraph: {
    title: "Tech & Software Engineering - Blog",
    description: "My thoughts and experiences on technology, software engineering, and development.",
    type: "website",
    url: `${baseUrl}/blog/tech`,
  },
};

export default async function TechBlogPage({
  searchParams,
}: {
  searchParams?: Promise<{ q?: string }>;
}) {
  const resolvedSearchParams = await searchParams;
  
  return (
    <CategoryBlogPage
      category="tech"
      title="Tech & Software Engineering"
      description="My thoughts and experiences on technology, software engineering, and development."
      searchPlaceholder="Search tech posts..."
      searchParams={resolvedSearchParams}
    />
  );
} 