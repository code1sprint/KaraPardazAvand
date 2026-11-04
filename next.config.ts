import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

/** Allow privacy analytics host when NEXT_PUBLIC_ANALYTICS_SCRIPT_URL is set at build. */
function analyticsScriptOrigin(): string | null {
  const raw = process.env.NEXT_PUBLIC_ANALYTICS_SCRIPT_URL?.trim();
  if (!raw) return null;
  try {
    return new URL(raw).origin;
  } catch {
    return null;
  }
}

const analyticsOrigin = analyticsScriptOrigin();
const scriptSrc = [
  "'self'",
  "'unsafe-inline'",
  "'unsafe-eval'",
  ...(analyticsOrigin ? [analyticsOrigin] : []),
].join(" ");
const connectSrc = ["'self'", ...(analyticsOrigin ? [analyticsOrigin] : [])].join(
  " ",
);

const securityHeaders = [
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
      "object-src 'none'",
      "img-src 'self' data: blob: https:",
      "font-src 'self' data:",
      "style-src 'self' 'unsafe-inline'",
      `script-src ${scriptSrc}`,
      `connect-src ${connectSrc}`,
      "upgrade-insecure-requests",
    ].join("; "),
  },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "Permissions-Policy",
    value:
      "camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()",
  },
  {
    key: "X-Frame-Options",
    value: "DENY",
  },
];

const nextConfig: NextConfig = {
  output: "standalone",
  cacheComponents: true,
  partialPrefetching: true,
  images: {
    // Allow high-quality encoding when optimized images are used elsewhere.
    qualities: [75, 95],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
  async redirects() {
    return [
      {
        source: "/:locale/legal/privacy",
        destination: "/:locale/privacy",
        permanent: true,
      },
      {
        source: "/:locale/legal/terms",
        destination: "/:locale/terms",
        permanent: true,
      },
    ];
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default withNextIntl(nextConfig);
