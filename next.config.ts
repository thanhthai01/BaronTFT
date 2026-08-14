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
  async headers() {
    const contentSecurityPolicy = [
      "default-src 'self'",
      "base-uri 'self'",
      "object-src 'none'",
      "frame-ancestors 'none'",
      "form-action 'self'",
      "img-src 'self' data: blob:",
      "font-src 'self' data:",
      "style-src 'self' 'unsafe-inline'",
      "script-src 'self' 'unsafe-inline' https://va.vercel-scripts.com",
      "connect-src 'self' https://vitals.vercel-insights.com https://*.vercel-insights.com",
      'upgrade-insecure-requests',
    ].join('; ');

    return [
      {
        source: '/:path*',
        headers: [
          { key: 'Content-Security-Policy', value: contentSecurityPolicy },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Permissions-Policy', value: 'camera=(), geolocation=(), microphone=(), payment=(), usb=()' },
        ],
      },
    ];
  },
};

const withMDX = createMDX({});

export default withMDX(nextConfig);
