"use client"

import mermaid from "mermaid"
import { useCallback, useEffect, useRef, useState } from "react"

interface MermaidProps {
  children: string
  className?: string
}

let mermaidInitialized = false

export function Mermaid({ children, className = "" }: MermaidProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [hasError, setHasError] = useState(false)
  const [svgContent, setSvgContent] = useState<string>("")

  const initializeMermaid = useCallback(async () => {
    try {
      if (!mermaidInitialized) {
        mermaid.initialize({
          startOnLoad: false,
          theme: 'default',
          securityLevel: 'loose',
          fontFamily: 'Inter, sans-serif',
          suppressErrorRendering: true,
          logLevel: 'error',
          flowchart: {
            useMaxWidth: true,
            htmlLabels: true,
            nodeSpacing: 60,
            rankSpacing: 60,
            curve: 'basis',
            padding: 15,
          },
          themeVariables: {
            fontFamily: 'Inter, sans-serif',
            fontSize: '16px',
            primaryColor: '#3b82f6',
            primaryTextColor: '#ffffff',
            primaryBorderColor: '#1d4ed8',
            lineColor: '#6b7280',
            secondaryColor: '#f3f4f6',
            tertiaryColor: '#ffffff',
          }
        })
        mermaidInitialized = true
      }
    } catch (error) {
      console.warn('Mermaid initialization failed:', error)
      setHasError(true)
    }
  }, [])

  const renderDiagram = useCallback(async () => {
    if (!children.trim() || !containerRef.current) return

    try {
      // Clear previous content
      setSvgContent("")
      setIsLoaded(false)
      setHasError(false)

      // Initialize mermaid if needed
      await initializeMermaid()

      // Generate unique ID
      const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`
      
      // Create a temporary container for rendering
      const tempContainer = document.createElement('div')
      tempContainer.className = 'mermaid'
      tempContainer.id = id
      tempContainer.textContent = children.trim()
      
      // Render the diagram
      const { svg } = await mermaid.render(id, children.trim())
      
      // Set the SVG content
      setSvgContent(svg)
      setIsLoaded(true)
      
    } catch (error) {
      console.warn('Mermaid rendering failed:', error)
      setHasError(true)
      setIsLoaded(true) // Mark as loaded to show fallback
    }
  }, [children, initializeMermaid])

  useEffect(() => {
    renderDiagram()
  }, [renderDiagram])

  if (!children.trim()) {
    return null
  }

  return (
    <div 
      ref={containerRef} 
      className={`my-6 flex justify-center overflow-x-auto ${className}`}
      suppressHydrationWarning
    >
      {!isLoaded && (
        <div className="flex items-center justify-center p-8 text-muted-foreground">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-current"></div>
          <span className="ml-2">Loading diagram...</span>
        </div>
      )}
      
      {isLoaded && !hasError && svgContent && (
        <div 
          className="mermaid-container"
          dangerouslySetInnerHTML={{ __html: svgContent }}
        />
      )}
      
      {isLoaded && hasError && (
        <pre className="mermaid-fallback bg-muted p-4 rounded-md overflow-x-auto">
          <code className="text-sm">{children}</code>
        </pre>
      )}
    </div>
  )
} 