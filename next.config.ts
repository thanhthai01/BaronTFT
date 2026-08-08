import createMDX from '@next/mdx';
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  pageExtensions: ['js', 'jsx', 'mdx', 'ts', 'tsx'],
  reactStrictMode: true,
  experimental: {
    optimizePackageImports: ['cmdk'],
  },
  async redirects() {
    return [
      // /mua-18?section=x -> /mua-18/x — URL cũ (còn trong search-actions.ts,
      // link chia sẻ trước đây) trỏ về path route mới, tránh 2 URL cùng nội dung.
      {
        source: '/mua-18',
        has: [{ type: 'query', key: 'section', value: '(?<section>.*)' }],
        destination: '/mua-18/:section',
        permanent: true,
      },
    ];
  },
};

const withMDX = createMDX({});

export default withMDX(nextConfig);
