import { CategoryBlogPage } from "@/components/category-blog-page";
import { getBaseUrl } from "@/lib/utils";

const baseUrl = getBaseUrl();

export const metadata = {
  title: "Spiritual - Blog",
  description: "Spiritual insights, personal growth, and mindfulness reflections.",
  openGraph: {
    title: "Spiritual - Blog",
    description: "Spiritual insights, personal growth, and mindfulness reflections.",
    type: "website",
    url: `${baseUrl}/blog/spiritual`,
  },
};

export default async function SpiritualBlogPage({
  searchParams,
}: {
  searchParams?: Promise<{ q?: string }>;
}) {
  const resolvedSearchParams = await searchParams;
  
  return (
    <CategoryBlogPage
      category="spiritual"
      title="Spiritual"
      description="Spiritual insights, personal growth, and mindfulness reflections."
      searchPlaceholder="Search spiritual posts..."
      searchParams={resolvedSearchParams}
    />
  );
} 