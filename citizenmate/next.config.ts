import type { NextConfig } from "next";
import withSerwistInit from "@serwist/next";
import { withSentryConfig } from "@sentry/nextjs";
import withBundleAnalyzer from "@next/bundle-analyzer";

const analyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

const withSerwist = withSerwistInit({
  swSrc: "src/sw.ts",
  swDest: "public/sw.js",
  disable: process.env.NODE_ENV === "development",
});

const isDev = process.env.NODE_ENV === "development";

const securityHeaders = [
  { key: "X-DNS-Prefetch-Control", value: "on" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  // CSP is set per-request in middleware with nonce-based script-src
  // Prevent indexing of preview/staging deployments
  ...(process.env.VERCEL_ENV && process.env.VERCEL_ENV !== 'production'
    ? [{ key: "X-Robots-Tag", value: "noindex, nofollow" }]
    : []),
];

const nextConfig: NextConfig = {
  ...(isDev ? { distDir: "/tmp/citizenmate-next" } : {}),
  experimental: {
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'mbyhviucjxkeuyshawzj.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
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

export default withSentryConfig(withSerwist(analyzer(nextConfig)), {
  // For all available options, see:
  // https://github.com/getsentry/sentry-webpack-plugin#options
  org: "citizenmate",
  project: "citizenmate",
  silent: !process.env.CI,
  widenClientFileUpload: true,
  reactComponentAnnotation: {
    enabled: true,
  },
  tunnelRoute: "/monitoring",
  disableLogger: true,
  automaticVercelMonitors: true,
});

