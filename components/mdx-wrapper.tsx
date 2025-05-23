import type { MDXRemoteSerializeResult } from 'next-mdx-remote'
import { MDXContent } from "./mdx-content"

type MDXWrapperProps = {
  source: MDXRemoteSerializeResult
  clientSide?: boolean
}

export function MDXWrapper({ source, clientSide = false }: MDXWrapperProps) {
  return <MDXContent source={source} clientSide={clientSide} />
} 