

/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: 'https', hostname: 'd3lehtoxndxwf6.cloudfront.net', pathname: '/**' }
    ],
  },
  async rewrites() {
    return [
      { source: '/backend/:path*', destination: 'http://localhost:3001/:path*' },
    ]
  }
}

export default nextConfig