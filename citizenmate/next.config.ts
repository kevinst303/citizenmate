import type { NextConfig } from "next";
import withSerwistInit from "@serwist/next";

const withSerwist = withSerwistInit({
  swSrc: "src/sw.ts",
  swDest: "public/sw.js",
  disable: process.env.NODE_ENV === "development",
});

const nextConfig: NextConfig = {
  // Allow Turbopack in dev mode while @serwist/next adds webpack config.
  // Production builds use --webpack flag (see package.json build script).
  turbopack: {},
};

export default withSerwist(nextConfig);
