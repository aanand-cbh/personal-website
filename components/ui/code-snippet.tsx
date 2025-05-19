"use client"

import { Check, Copy } from "lucide-react"
import React from "react"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism"

import { Button } from "@/components/ui/button"

interface CodeSnippetProps {
  code: string
  language?: string
  className?: string
}

export function CodeSnippet({ code, language = "text", className }: CodeSnippetProps) {
  const [copied, setCopied] = React.useState(false)
  const codeRef = React.useRef<HTMLDivElement>(null)

  const handleCopy = () => {
    if (codeRef.current) {
      navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="relative group">
      <div ref={codeRef}>
        <SyntaxHighlighter
          language={language}
          style={vscDarkPlus}
          customStyle={{
            margin: 0,
            padding: "1rem",
            background: "black",
            borderRadius: "0.5rem",
            border: "1px solid hsl(var(--border))",
            fontSize: "0.875rem",
            lineHeight: 1.7,
          }}
          showLineNumbers
          wrapLines
          lineNumberStyle={{
            color: "rgb(156, 163, 175)",
            marginRight: "1.5rem",
            minWidth: "2.5em",
            paddingRight: "1em",
            userSelect: "none",
            textAlign: "right",
          }}
          codeTagProps={{
            style: {
              fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
              whiteSpace: "pre",
            }
          }}
          wrapLongLines={false}
        >
          {code}
        </SyntaxHighlighter>
      </div>
      {language && <div className="absolute top-2 right-10 text-xs text-gray-400 font-mono">{language}</div>}
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={handleCopy}
      >
        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
        <span className="sr-only">Copy code</span>
      </Button>
    </div>
  )
}
