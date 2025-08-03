import { CategoryBlogPage } from "@/components/category-blog-page";
import { getBaseUrl } from "@/lib/utils";

const baseUrl = getBaseUrl();

export const metadata = {
  title: "Health & Wellness - Blog",
  description: "Physical health, mental wellness, and lifestyle optimization insights and tips.",
  openGraph: {
    title: "Health & Wellness - Blog",
    description: "Physical health, mental wellness, and lifestyle optimization insights and tips.",
    type: "website",
    url: `${baseUrl}/blog/health`,
  },
};

export default async function HealthBlogPage({
  searchParams,
}: {
  searchParams?: Promise<{ q?: string }>;
}) {
  const resolvedSearchParams = await searchParams;
  
  return (
    <CategoryBlogPage
      category="health"
      title="Health & Wellness"
      description="Physical health, mental wellness, and lifestyle optimization insights and tips."
      searchPlaceholder="Search health posts..."
      searchParams={resolvedSearchParams}
    />
  );
} 