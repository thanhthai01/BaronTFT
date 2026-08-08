import { set18Slugs } from '@/content/set18/set18-slugs.generated';
import type { Set18EntityKind } from '@/content/set18/set18-types';

/** Tiền tố route chi tiết theo loại entity trong codex Set 18 — dùng chung
 * giữa sitemap.ts và bất kỳ nơi nào cần dựng URL từ `entityId` (vd PatchBoard). */
export const KIND_PREFIX: Record<Set18EntityKind, string> = {
  champion: '/mua-18/tuong/',
  trait: '/mua-18/toc-he/',
  wisp: '/mua-18/tinh-linh/',
  augment: '/mua-18/nang-cap/',
};

const urlByEntityId = new Map<string, string>(
  set18Slugs.map((entry) => [entry.id, `${KIND_PREFIX[entry.kind]}${entry.slug}`]),
);

/** Trả về URL trang codex của một entity (vd "champion:tft18_akali" →
 * "/mua-18/tuong/akali"), hoặc `undefined` nếu id không khớp entity nào —
 * gọi nơi dùng phải tự xử lý trường hợp không link được (giữ nguyên text). */
export function set18EntityUrl(entityId: string | undefined): string | undefined {
  return entityId ? urlByEntityId.get(entityId) : undefined;
}
