import type { NextConfig } from 'next';

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

const nextConfig: NextConfig = {
  reactStrictMode: true,

  output: 'export',

  basePath,
  assetPrefix: basePath,

  images: {
    unoptimized: true,
  },

  turbopack: {},

  experimental: {
    optimizePackageImports: ['framer-motion'],
  },
};

export default nextConfig;
