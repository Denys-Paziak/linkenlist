/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === "production";

const CLOUD_FRONT_HOST = "d3lehtoxndxwf6.cloudfront.net";

const allowedImgHosts = [
  `https://${CLOUD_FRONT_HOST}`,
  "https://*.googleusercontent.com",
  "https://maps.gstatic.com",
  "https://maps.googleapis.com",
];

const allowedConnectHosts = [
  "'self'",
  "https://maps.googleapis.com",
  "https://maps.gstatic.com",
  // Google Maps additional resources (your violation shows this exact domain)
  "https://mapsresources-pa.googleapis.com",
  // If you really call accounts.google.com from browser you can keep it,
  // otherwise it can be removed.
  "https://accounts.google.com",
];

const allowedScriptHosts = [
  // Google Maps (if used)
  "https://maps.googleapis.com",
  "https://maps.gstatic.com",

  // Cloudflare Turnstile + Cloudflare Insights
  "https://challenges.cloudflare.com",
  "https://static.cloudflareinsights.com",
];

const allowedStyleHosts = [
  // Google Fonts stylesheet (you have evidence in console logs)
  "https://fonts.googleapis.com",
];

const allowedFontHosts = [
  "'self'",
  "data:",
  // Google Fonts font files (evidence: fonts.gstatic.com)
  "https://fonts.gstatic.com",
];


// CSP baseline (enforced)
const csp = [
  "default-src 'self'",

  // Inline scripts allowed (compat); restrict external script elements separately
  `script-src 'self' 'unsafe-inline' ${isProd ? "" : "'unsafe-eval'"}`.trim(),

  // External <script src="..."> allowlist (this fixes your Turnstile/Insights blocks)
  `script-src-elem 'self' ${allowedScriptHosts.join(" ")}`.trim(),

  // Styles (inline allowed) + Google Fonts stylesheet
  `style-src 'self' 'unsafe-inline' ${allowedStyleHosts.join(" ")}`.trim(),

  // Images
  `img-src 'self' data: blob: ${allowedImgHosts.join(" ")}`.trim(),

  // Fonts
  `font-src ${allowedFontHosts.join(" ")}`.trim(),

  // API calls (Maps extra domain included)
  `connect-src ${allowedConnectHosts.join(" ")}`.trim(),

  // Media
  `media-src 'self' blob: https://${CLOUD_FRONT_HOST}`,

  // ✅ Fix for "Creating a worker from blob violates CSP"
  "worker-src 'self' blob:",
  // Some browsers use child-src fallback for workers
  "child-src 'self' blob:",

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

  // ✅ Enforced CSP (hardening)
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
      // For Google OAuth avatars in next/image
      { protocol: "https", hostname: "*.googleusercontent.com", pathname: "/**" },
      // Enable only if you use Google Maps images via next/image (usually not needed)
      { protocol: "https", hostname: "maps.gstatic.com", pathname: "/**" },
      { protocol: "https", hostname: "maps.googleapis.com", pathname: "/**" },
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
