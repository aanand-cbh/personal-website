import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface Resource {
  name: string
  description: string
  url: string
}

interface Subcategory {
  title: string
  description: string
  links: Resource[]
}

interface ResourceGridProps {
  title: string
  description: string
  subcategories: Subcategory[]
}

export function ResourceGrid({ title, description, subcategories }: ResourceGridProps) {
  // Sort subcategories by number of links (lowest to highest)
  const sortedSubcategories = [...subcategories].sort((a, b) => a.links.length - b.links.length)

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold tracking-tight">{title}</h1>
        <p className="text-muted-foreground mt-2">{description}</p>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {sortedSubcategories.map((subcategory) => (
          <Card key={subcategory.title + " " + subcategory.links.length} className="h-full">
            <CardHeader>
              <CardTitle>{subcategory.title}</CardTitle>
              <CardDescription>{subcategory.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {subcategory.links.map((link) => (
                  <li key={link.name + " " + link.url} className="text-sm">
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium hover:underline"
                    >
                      {link.name}
                    </a>
                    <span className="text-muted-foreground"> — {link.description}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
} 