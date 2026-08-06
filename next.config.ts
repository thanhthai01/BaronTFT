import createMDX from '@next/mdx';
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  pageExtensions: ['js', 'jsx', 'mdx', 'ts', 'tsx'],
  reactStrictMode: true,
  experimental: {
    optimizePackageImports: ['cmdk'],
  },
};

const withMDX = createMDX({});

export default withMDX(nextConfig);
