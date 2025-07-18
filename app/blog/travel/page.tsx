import { CategoryBlogPage } from "@/components/category-blog-page";
import { getBaseUrl } from "@/lib/utils";

const baseUrl = getBaseUrl();

export const metadata = {
  title: "Travel - Blog",
  description: "Travel guides, destinations, and adventure stories from my journeys.",
  openGraph: {
    title: "Travel - Blog",
    description: "Travel guides, destinations, and adventure stories from my journeys.",
    type: "website",
    url: `${baseUrl}/blog/travel`,
  },
};

export default async function TravelBlogPage({
  searchParams,
}: {
  searchParams?: Promise<{ q?: string }>;
}) {
  const resolvedSearchParams = await searchParams;
  
  return (
    <CategoryBlogPage
      category="travel"
      title="Travel"
      description="Travel guides, destinations, and adventure stories from my journeys."
      searchPlaceholder="Search travel posts..."
      searchParams={resolvedSearchParams}
    />
  );
} 