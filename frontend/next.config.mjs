/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === "production";
const CLOUD_FRONT_HOST = "d3lehtoxndxwf6.cloudfront.net";

const csp = [
  "default-src 'self'",

  `script-src 'self' 'unsafe-inline' 'unsafe-eval' https://challenges.cloudflare.com https://static.cloudflareinsights.com https://maps.googleapis.com https://maps.gstatic.com`,

  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",

  "font-src 'self' data: https://fonts.gstatic.com",

  `img-src 'self' data: blob: https://${CLOUD_FRONT_HOST} https://*.googleusercontent.com https://maps.gstatic.com https://maps.googleapis.com`,

  "connect-src 'self' data: https://maps.googleapis.com https://maps.gstatic.com https://mapsresources-pa.googleapis.com https://api.zippopotam.us",

  `media-src 'self' blob: https://${CLOUD_FRONT_HOST}`,

  "frame-src 'self' https://challenges.cloudflare.com",

  "child-src 'self' blob: https://challenges.cloudflare.com",

  "worker-src 'self' blob:",

  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  {
    key: "Strict-Transport-Security",
    value: isProd ? "max-age=31536000; includeSubDomains; preload" : "max-age=0",
  },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "DENY" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
  },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },

  { key: "Content-Security-Policy", value: csp },
];

const nextConfig = {
  output: "standalone",
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: false,
    remotePatterns: [
      { protocol: "https", hostname: CLOUD_FRONT_HOST, pathname: "/**" },
      { protocol: "https", hostname: "*.googleusercontent.com", pathname: "/**" },
    ],
  },

  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;