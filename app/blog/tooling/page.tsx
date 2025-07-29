import { CategoryBlogPage } from "@/components/category-blog-page";
import { getBaseUrl } from "@/lib/utils";

const baseUrl = getBaseUrl();

export const metadata = {
  title: "Tooling - Blog",
  description: "Tools, utilities, and productivity enhancements.",
  openGraph: {
    title: "Tooling - Blog",
    description: "Tools, utilities, and productivity enhancements.",
    type: "website",
    url: `${baseUrl}/blog/tooling`,
  },
};

export default async function ToolingBlogPage({
  searchParams,
}: {
  searchParams?: Promise<{ q?: string }>;
}) {
  const resolvedSearchParams = await searchParams;
  
  return (
    <CategoryBlogPage
      category="tooling"
      title="Tooling"
      description="Tools, utilities, and productivity enhancements."
      searchPlaceholder="Search tooling posts..."
      searchParams={resolvedSearchParams}
    />
  );
} 