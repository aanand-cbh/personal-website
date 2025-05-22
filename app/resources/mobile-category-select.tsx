"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useEffect, useState } from "react"

interface Category {
  title: string
  slug: string
  description: string
  subcategories: {
    title: string
    links: Array<{
      name: string
      description: string
    }>
  }[]
}

interface MobileCategorySelectProps {
  categories: Category[]
}

export function MobileCategorySelect({ categories }: MobileCategorySelectProps) {
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)

  // Set the first category as default when component mounts
  useEffect(() => {
    if (categories.length > 0 && !selectedCategory) {
      setSelectedCategory(categories[0])
    }
  }, [categories, selectedCategory])

  const handleCategorySelect = (value: string) => {
    const category = categories.find((cat) => cat.slug === value)
    setSelectedCategory(category || null)
  }

  return (
    <div className="space-y-4">
      <Select 
        onValueChange={handleCategorySelect}
        defaultValue={categories[0]?.slug}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select a category" />
        </SelectTrigger>
        <SelectContent>
          {categories.map((category) => (
            <SelectItem key={category.slug} value={category.slug}>
              {category.title}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {selectedCategory && (
        <Card className="w-full">
          <CardHeader>
            <CardTitle>{selectedCategory.title}</CardTitle>
            <CardDescription>{selectedCategory.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {selectedCategory.subcategories.map((subcategory) => (
                <div key={subcategory.title}>
                  <h3 className="text-sm font-medium mb-2">{subcategory.title}</h3>
                  {subcategory.links[0] && (
                    <div className="text-sm text-muted-foreground">
                      {subcategory.links[0].name} — {subcategory.links[0].description}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
} 