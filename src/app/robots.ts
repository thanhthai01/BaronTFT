import type { MetadataRoute } from 'next';
import { SITE_URL, IS_PRODUCTION_DEPLOY } from '@/lib/site';

// Chặn index mọi deployment không phải production (preview branch/PR trên
// Vercel có domain *-git-*.vercel.app riêng) — nếu không, mỗi bản preview sẽ bị
// Google index thành một bản sao của site, tự cạnh tranh thứ hạng với chính nó.
export default function robots(): MetadataRoute.Robots {
  if (!IS_PRODUCTION_DEPLOY) {
    return { rules: { userAgent: '*', disallow: '/' } };
  }

  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
