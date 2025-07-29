import { CategoryBlogPage } from "@/components/category-blog-page";
import { getBaseUrl } from "@/lib/utils";

const baseUrl = getBaseUrl();

export const metadata = {
  title: "Personal - Blog",
  description: "Personal stories, life lessons, and reflections.",
  openGraph: {
    title: "Personal - Blog",
    description: "Personal stories, life lessons, and reflections.",
    type: "website",
    url: `${baseUrl}/blog/personal`,
  },
};

export default async function PersonalBlogPage({
  searchParams,
}: {
  searchParams?: Promise<{ q?: string }>;
}) {
  const resolvedSearchParams = await searchParams;
  
  return (
    <CategoryBlogPage
      category="personal"
      title="Personal"
      description="Personal stories, life lessons, and reflections."
      searchPlaceholder="Search personal posts..."
      searchParams={resolvedSearchParams}
    />
  );
} 