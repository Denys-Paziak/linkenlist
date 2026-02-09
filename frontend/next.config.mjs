/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === "production";
const CLOUD_FRONT_HOST = "d3lehtoxndxwf6.cloudfront.net";

// Мінімально-потрібний CSP (enforce), щоб не ламати Next + Turnstile + CF Insights + Maps + Fonts
const csp = [
  "default-src 'self'",

  // Сумісно з Next + 3rd-party (Turnstile/CF insights/Maps)
  `script-src 'self' 'unsafe-inline' ${isProd ? "" : "'unsafe-eval'"} https://challenges.cloudflare.com https://static.cloudflareinsights.com https://maps.googleapis.com https://maps.gstatic.com`
    .trim(),

  // Next часто потребує inline styles + Google Fonts stylesheet
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",

  // Google Fonts font files
  "font-src 'self' data: https://fonts.gstatic.com",

  // CloudFront assets + Google avatars + Maps images
  `img-src 'self' data: blob: https://${CLOUD_FRONT_HOST} https://*.googleusercontent.com https://maps.gstatic.com https://maps.googleapis.com`,

  // Same-domain API + Maps extra endpoint
  "connect-src 'self' https://maps.googleapis.com https://maps.gstatic.com https://mapsresources-pa.googleapis.com",

  // Якщо медіа/файли віддаються через CloudFront
  `media-src 'self' blob: https://${CLOUD_FRONT_HOST}`,

  // Для blob workers (React/Next/інколи Maps)
  "worker-src 'self' blob:",
  "child-src 'self' blob:",

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

  // ✅ Enforced CSP (мінімально потрібний)
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
      // Google OAuth avatars (payload.picture)
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
