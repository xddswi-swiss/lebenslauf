import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Serve the hero portrait as AVIF/WebP instead of the 1.3MB source PNG.
    formats: ["image/avif", "image/webp"],
  },
  experimental: {
    // react-icons is one barrel re-exporting thousands of icons; without this
    // the whole package is pulled in during development.
    optimizePackageImports: ["react-icons"],
  },
};

export default nextConfig;
