import { CategoryBlogPage } from "@/components/category-blog-page"

export default function MoneyBlog({ searchParams }: { searchParams: { q?: string } }) {
  return (
    <CategoryBlogPage
      category="money"
      title="Money Matters"
      description="Personal finance, investing, and financial literacy"
      searchPlaceholder="Search money posts..."
      searchParams={searchParams}
    />
  )
}

export const metadata = {
  title: "Money Matters Blog",
  description: "Personal finance, investing, and financial literacy"
} 