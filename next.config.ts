import createMDX from '@next/mdx';
import type { NextConfig } from 'next';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  outputFileTracingRoot: projectRoot,
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
      // Route bài học cũ đã đổi sang /kien-thuc-nen-tang; giữ redirect để
      // bookmark/backlink không 404 và không làm nhiễu Speed Insights bởi URL cũ.
      {
        source: '/bai-hoc/:slug*',
        destination: '/kien-thuc-nen-tang/:slug*',
        permanent: true,
      },
    ];
  },
};

const withMDX = createMDX({});

export default withMDX(nextConfig);
