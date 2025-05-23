"use client"

import { useEffect } from 'react'

export function ScrollRestoration() {
  useEffect(() => {
    // Disable scroll restoration
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual'
    }

    // Scroll to top on mount
    window.scrollTo(0, 0)

    // Prevent any automatic scrolling
    const preventScroll = (e: Event) => {
      e.preventDefault()
      window.scrollTo(0, 0)
    }

    // Add event listeners to prevent automatic scrolling
    window.addEventListener('load', preventScroll)
    window.addEventListener('DOMContentLoaded', preventScroll)

    return () => {
      window.removeEventListener('load', preventScroll)
      window.removeEventListener('DOMContentLoaded', preventScroll)
    }
  }, [])

  return null
} 