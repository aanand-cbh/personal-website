import createMDX from '@next/mdx'
import remarkGfm from 'remark-gfm'

const withMDX = createMDX({
  options: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [],
  },
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configure pageExtensions to include md and mdx
  pageExtensions: ['js', 'jsx', 'mdx', 'ts', 'tsx'],
  // Disable strict mode for now to avoid double rendering issues
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  transpilePackages: ['next-mdx-remote'],
  experimental: {
    optimizePackageImports: [
      '@radix-ui/react-icons',
      'lucide-react',
      '@radix-ui/react-dialog',
      '@radix-ui/react-slot',
      '@radix-ui/react-toast',
    ],
    serverActions: {
      allowedOrigins: ['localhost:3000', 'kaivlya.com'],
    },
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  poweredByHeader: false,
  // Modern browser optimization
  webpack: (config, { dev, isServer, webpack }) => {
    // Optimize for modern browsers
    if (!dev && !isServer) {
      config.target = 'web'
      config.output = {
        ...config.output,
        chunkFormat: 'array-push'
      }
    }

    return config
  },
}

export default withMDX(nextConfig)
