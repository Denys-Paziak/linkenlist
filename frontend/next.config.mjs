/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === "production";

const CLOUD_FRONT_HOST = "d3lehtoxndxwf6.cloudfront.net";

/**
 * External origins (tight allowlist)
 * - CloudFront: your asset CDN
 * - googleusercontent: Google OAuth avatars (payload.picture)
 */
const allowedImgHosts = [
  `https://${CLOUD_FRONT_HOST}`,
  "https://*.googleusercontent.com",
  // Google Maps tiles/static assets (enable only if you use Google Maps)
  "https://maps.gstatic.com",
  "https://maps.googleapis.com",
];

const allowedConnectHosts = [
  "'self'",
  // Google Maps API calls (enable only if you use Google Maps)
  "https://maps.googleapis.com",
  "https://maps.gstatic.com",
  // Google APIs (enable only if you call them from browser)
  "https://accounts.google.com",
];

const allowedScriptHosts = [
  // by default: only self; enable maps domains only if needed
  "https://maps.googleapis.com",
  "https://maps.gstatic.com",
];

const allowedStyleHosts = [
  // If you actually use Google Fonts stylesheets:
  "https://fonts.googleapis.com",
];

const allowedFontHosts = [
  "'self'",
  "data:",
  // If you actually use Google Fonts font files:
  "https://fonts.gstatic.com",
];

// CSP baseline (enforced)
const csp = [
  "default-src 'self'",

  // Next app router: keep unsafe-inline for compatibility unless you implement nonce.
  // Remove https: wildcard to keep it tight.
  `script-src 'self' 'unsafe-inline' ${isProd ? "" : "'unsafe-eval'"} ${allowedScriptHosts.join(" ")}`.trim(),

  // Keep unsafe-inline for styles (Next/various libs may inline styles).
  `style-src 'self' 'unsafe-inline' ${allowedStyleHosts.join(" ")}`.trim(),

  // Images: self + data/blob + explicit external hosts (CloudFront + googleusercontent)
  `img-src 'self' data: blob: ${allowedImgHosts.join(" ")}`.trim(),

  // Fonts: self + data (+ optional fonts.gstatic.com)
  `font-src ${allowedFontHosts.join(" ")}`.trim(),

  // Same-domain API: self (plus optional explicit external APIs)
  `connect-src ${allowedConnectHosts.join(" ")}`.trim(),

  // Media: self + blob + CloudFront (if you serve videos/audio/files from there)
  `media-src 'self' blob: https://${CLOUD_FRONT_HOST}`,

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
