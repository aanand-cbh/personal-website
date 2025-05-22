import { ResourceGrid } from "@/components/resources/resource-grid"
import resourceData from "@/data/resources_bookmark_valid.json"
import { notFound } from "next/navigation"

export async function generateStaticParams() {
  return resourceData.categories.map((cat) => ({ slug: cat.slug }))
}

export default async function ResourceCategoryPage({ params }: { params: { slug: string } }) {
  const { slug } = await params
  const category = resourceData.categories.find((cat) => cat.slug === slug)
  if (!category) return notFound()
  return (
    <ResourceGrid
      title={category.title}
      description={category.description}
      subcategories={category.subcategories}
    />
  )
} 