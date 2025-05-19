'use client'

import type { MDXRemoteSerializeResult } from 'next-mdx-remote';
import dynamic from 'next/dynamic';
import { useMDXComponents } from './mdx-components';

// Using dynamic import with noSSR to avoid React hooks errors during SSR
const MDXRemoteComponent = dynamic(
  async () => {
    const { MDXRemote } = await import('next-mdx-remote');
    return ({ source, components, ...props }: any) => (
      <MDXRemote {...source} components={components} {...props} />
    );
  },
  { ssr: false, loading: () => <div className="text-muted-foreground">Loading content...</div> }
);

interface MDXContentProps {
  source: MDXRemoteSerializeResult;
}

export function MDXContent({ source }: MDXContentProps) {
  const components = useMDXComponents({});

  return (
    <div className="prose prose-gray dark:prose-invert max-w-none">
      <MDXRemoteComponent source={source} components={components} />
    </div>
  );
} 