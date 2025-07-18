"use client"

import { Search, X } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { useCallback, useEffect, useState } from "react"

import { Input } from "@/components/ui/input"

interface CategoryBlogSearchProps {
  category: string
  placeholder?: string
}

export function CategoryBlogSearch({ 
  category, 
  placeholder = "Search posts in this category..." 
}: CategoryBlogSearchProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [searchTerm, setSearchTerm] = useState(searchParams.get("q") || "")
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm)

  // Update the URL when the search term changes
  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      if (value) {
        params.set(name, value)
      } else {
        params.delete(name)
      }
      return params.toString()
    },
    [searchParams]
  )

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm)
    }, 500)
    return () => clearTimeout(timer)
  }, [searchTerm])

  // Auto-search when debounced term changes
  useEffect(() => {
    if (debouncedSearchTerm !== searchParams.get("q")) {
      const newQuery = createQueryString("q", debouncedSearchTerm)
      router.push(`/blog/${category}${newQuery ? `?${newQuery}` : ""}`, { scroll: false })
    }
  }, [debouncedSearchTerm, createQueryString, router, searchParams, category])

  // Submit search term
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newQuery = createQueryString("q", searchTerm)
    router.push(`/blog/${category}${newQuery ? `?${newQuery}` : ""}`, { scroll: false })
  }

  // Clear search
  const clearSearch = () => {
    setSearchTerm("")
    setDebouncedSearchTerm("")
    router.push(`/blog/${category}`, { scroll: false })
  }

  return (
    <form onSubmit={handleSubmit} className="relative mb-6">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder={placeholder}
          className="pl-10 pr-10"
        />
        {searchTerm && (
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground"
            onClick={clearSearch}
          >
            <X className="h-3 w-3" />
            <span className="sr-only">Clear search</span>
          </button>
        )}
      </div>
    </form>
  )
} 