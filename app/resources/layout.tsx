import resourceData from "@/data/resources_bookmark_valid.json"
import Link from "next/link"

interface ResourcesLayoutProps {
  children: React.ReactNode
}

export default function ResourcesLayout({ children }: ResourcesLayoutProps) {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <aside className="hidden md:block md:col-span-1">
          <nav className="sticky top-8">
            <h2 className="text-lg font-semibold mb-4">Categories</h2>
            <ul className="space-y-2">
              {resourceData.categories.map((category) => (
                <li key={category.slug}>
                  <Link 
                    href={`/resources/${category.slug}`} 
                    className="text-muted-foreground hover:text-foreground"
                  >
                    {category.title}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </aside>
        <main className="md:col-span-3">
          {children}
        </main>
      </div>
    </div>
  )
} 