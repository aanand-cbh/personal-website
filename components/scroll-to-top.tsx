"use client"

import { ArrowUp } from "lucide-react"
import { useEffect, useState } from "react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false)

  // Show button when user scrolls down 300px
  const toggleVisibility = () => {
    if (window.scrollY > 300) {
      setIsVisible(true)
    } else {
      setIsVisible(false)
    }
  }

  // Scroll to top smoothly
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }

  useEffect(() => {
    window.addEventListener("scroll", toggleVisibility)
    return () => window.removeEventListener("scroll", toggleVisibility)
  }, [])

  return (
    <div className={cn(
      "fixed bottom-8 right-8 z-50 transition-all duration-300 transform",
      isVisible ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0 pointer-events-none"
    )}>
      <Button
        aria-label="Scroll to top"
        onClick={scrollToTop}
        size="icon"
        className="rounded-full h-10 w-10 shadow-md hover:shadow-lg transition-all hover:scale-110 duration-200"
      >
        <ArrowUp className="h-5 w-5" />
      </Button>
    </div>
  )
} 