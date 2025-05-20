import Link from "next/link"

export function SiteFooter() {
  return (
    <footer className="w-full border-t bg-background py-6">
      <div className="container flex flex-col items-center justify-center gap-4 px-4 md:px-6 md:flex-row">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          © {new Date().getFullYear()} kaivlya.com. All rights reserved.
        </p>
        <nav className="flex gap-4">
          <Link href="/" className="text-sm hover:underline">
            Home
          </Link>
          <Link href="/about" className="text-sm hover:underline">
            About
          </Link>
          <Link href="/blog" className="text-sm hover:underline">
            Blog
          </Link>
        </nav>
      </div>
    </footer>
  )
} 