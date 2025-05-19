/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configure pageExtensions to include md and mdx
  pageExtensions: ['js', 'jsx', 'ts', 'tsx'],
  // Disable strict mode for now to avoid double rendering issues
  reactStrictMode: false,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  transpilePackages: ['next-mdx-remote'],
  // experimental: {
  //   esmExternals: 'loose',
  // },
}

export default nextConfig
