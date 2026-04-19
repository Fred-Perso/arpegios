import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Prevent SSR bundling of alphaTab (client-only library)
  serverExternalPackages: ['@coderline/alphatab'],
  // Silence Turbopack warning — no custom config needed
  turbopack: {},
};

export default nextConfig;
