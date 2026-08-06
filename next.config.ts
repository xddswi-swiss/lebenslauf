import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // AVIF/WebP instead of the 1.3MB source PNG for the hero portrait.
    formats: ["image/avif", "image/webp"],
  },
  experimental: {
    // react-icons ships one barrel re-exporting thousands of icons; without
    // this the whole package gets pulled in during development.
    optimizePackageImports: ["react-icons"],
  },
};

export default nextConfig;
