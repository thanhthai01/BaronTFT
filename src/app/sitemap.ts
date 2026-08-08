import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/site';
import { set18Sections } from '@/content/set18/set18-meta';
import { set18Slugs } from '@/content/set18/set18-slugs.generated';
import { lessons } from '@/content/lessons';

const KIND_PREFIX: Record<string, string> = {
  champion: '/mua-18/tuong/',
  trait: '/mua-18/toc-he/',
  wisp: '/mua-18/tinh-linh/',
  augment: '/mua-18/nang-cap/',
};

const STATIC_ROUTES = ['/', '/checklist', '/cay-quyet-dinh', '/lo-trinh', '/nguon-hoc', '/patch', '/gop-y'];

// lastModified bị bỏ qua có chủ đích: PatchReport.dateVi là chuỗi tiếng Việt tự
// do (vd "Bản PBE 06/08"), không parse tin cậy thành Date — thà thiếu field tuỳ
// chọn còn hơn ghi sai ngày. Thêm ISO date thật vào patch-notes nếu cần bật lại.
export default function sitemap(): MetadataRoute.Sitemap {
  const staticEntries = STATIC_ROUTES.map((path) => ({ url: `${SITE_URL}${path}` }));

  const sectionEntries = set18Sections.map((section) => ({ url: `${SITE_URL}/mua-18/${section.id}` }));

  const entityEntries = set18Slugs.map((entry) => ({
    url: `${SITE_URL}${KIND_PREFIX[entry.kind]}${entry.slug}`,
  }));

  const lessonEntries = lessons.map((lesson) => ({ url: `${SITE_URL}/kien-thuc-nen-tang/${lesson.slug}` }));

  return [...staticEntries, ...sectionEntries, ...entityEntries, ...lessonEntries];
}
