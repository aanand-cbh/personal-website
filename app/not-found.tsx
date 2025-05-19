import { ArrowLeft } from "lucide-react"
import Link from "next/link"

import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-6xl font-bold">404</h1>
          <h2 className="text-3xl font-bold mt-4">Page Not Found</h2>
          <p className="mt-4 text-gray-500 dark:text-gray-400">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <Button asChild className="mt-8">
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </Button>
        </div>
      </main>
    </div>
  )
}
