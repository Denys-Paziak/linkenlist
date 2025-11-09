/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: false,
    remotePatterns: [
      { protocol: 'https', hostname: 'd3lehtoxndxwf6.cloudfront.net', pathname: '/**' }
    ],
  },
};

export default nextConfig;