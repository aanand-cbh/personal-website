import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import resourceData from "@/data/resources_bookmark_valid.json"
import Link from "next/link"
import { MobileCategorySelect } from "./mobile-category-select"

export default function ResourcesPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold tracking-tight">Resources</h1>
        <p className="text-muted-foreground mt-2">
          A curated collection of useful resources for developers, designers, and learners.
        </p>
      </div>

      {/* Mobile Dropdown View */}
      <div className="md:hidden">
        <MobileCategorySelect categories={resourceData.categories} />
      </div>

      {/* Desktop Grid View */}
      <div className="hidden md:grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {resourceData.categories.map((category) => (
          <Link key={category.title} href={`/resources/${category.slug}`}>
            <Card className="h-full hover:bg-muted/50 transition-colors">
              <CardHeader>
                <CardTitle>{category.title}</CardTitle>
                <CardDescription>{category.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {category.subcategories.map((subcategory) => (
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
          </Link>
        ))}
      </div>
    </div>
  )
} 