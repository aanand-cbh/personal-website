"use client"

import type { MDXRemoteSerializeResult } from 'next-mdx-remote'
import { CustomMDX } from "./mdx"
import { ClientMDX } from "./mdx-client"

type MDXContentProps = {
  source: MDXRemoteSerializeResult
  clientSide?: boolean
}

export function MDXContent({ source, clientSide = false }: MDXContentProps) {
  if (clientSide) {
    return <ClientMDX source={source} />
  }
  return <CustomMDX source={source} />
} 