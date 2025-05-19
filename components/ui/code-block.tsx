"use client"

import { cn } from "@/lib/utils"
import React from "react"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { nightOwl } from "react-syntax-highlighter/dist/esm/styles/prism"

interface CodeBlockProps {
  children: string
  language?: string
  className?: string
}

export function CodeBlock({ children, language = 'text', className }: CodeBlockProps) {
  // Extract language from className if provided (format: "language-js")
  const languageFromClass = className?.replace(/language-/, '') || language
  
  // Clean the code string (trim and remove any raw literal markers)
  const code = React.Children.toArray(children)
    .filter((child): child is string => typeof child === 'string')
    .join('')
    .trim()
  
  return (
    <div className={cn("relative my-6 rounded-md overflow-hidden", className)}>
      <div className="bg-zinc-800 text-zinc-300 text-xs px-4 py-1.5 flex items-center justify-between">
        <span>{languageFromClass}</span>
      </div>
      <SyntaxHighlighter
        language={languageFromClass}
        style={nightOwl}
        customStyle={{ margin: 0, borderRadius: '0 0 0.375rem 0.375rem' }}
        showLineNumbers
      >
        {code}
      </SyntaxHighlighter>
    </div>
  )
}
