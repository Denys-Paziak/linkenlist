/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === "production";

const CLOUD_FRONT_HOST = "d3lehtoxndxwf6.cloudfront.net";

const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline' ${isProd ? "" : "'unsafe-eval'"} https:`,
  "style-src 'self' 'unsafe-inline' https:",
  `img-src 'self' data: blob: https://${CLOUD_FRONT_HOST} https:`,
  "font-src 'self' data: https:",
  "connect-src 'self' https:",
  `media-src 'self' blob: https://${CLOUD_FRONT_HOST} https:`,
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "upgrade-insecure-requests",
].filter(Boolean).join("; ");

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

  { key: "Content-Security-Policy-Report-Only", value: csp },
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
