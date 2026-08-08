// Cầu nối giữa slug (set18-slugs.generated.ts, khoá theo `id` kiểu DB, vd
// "champion:tft18_akali") và nội dung thật (set18-champions.ts, set18-traits.ts,
// set18-augments.ts, set18-wisps.ts — các file này KHÔNG mang field `id`).
//
// Vị trí thứ i của mỗi `kind` trong set18-entity-index.ts khớp 1-1, đúng thứ tự,
// với vị trí thứ i trong mảng nội dung tương ứng: cả hai được sinh ra từ CÙNG
// một mảng `rows` trả về bởi từng hàm pull*() trong pull-set18.ts (không lọc/sắp
// lại ở bước nào khác giữa 2 lần dùng). Dùng index để nối vòng qua `id` an toàn,
// không phụ thuộc `name`/`nameVi` phải duy nhất (nameVi của wisp có trùng — xem
// set18-slugs.test.ts).

import { set18Champions } from './set18-champions';
import { set18Traits } from './set18-traits';
import { set18Augments } from './set18-augments';
import { set18Wisps } from './set18-wisps';
import { set18EntityIndex } from './set18-entity-index';
import { findSet18Slug, set18SlugById } from './set18-slugs.generated';
import type { Set18Augment, Set18Champion, Set18EntityKind, Set18Trait, Set18Wisp } from './set18-types';

function idsOfKind(kind: Set18EntityKind): string[] {
  return set18EntityIndex.filter((entry) => entry.kind === kind).map((entry) => entry.id);
}

function buildLookup<T>(kind: Set18EntityKind, items: T[]) {
  const ids = idsOfKind(kind);
  const idToIndex = new Map(ids.map((id, index) => [id, index]));
  const itemToSlug = new Map<T, string>();
  items.forEach((item, index) => {
    const slug = set18SlugById.get(ids[index])?.slug;
    if (slug) itemToSlug.set(item, slug);
  });

  return {
    bySlug(slug: string): T | undefined {
      const entry = findSet18Slug(kind, slug);
      if (!entry) return undefined;
      const index = idToIndex.get(entry.id);
      return index === undefined ? undefined : items[index];
    },
    slugOf(item: T): string | undefined {
      return itemToSlug.get(item);
    },
  };
}

const championLookup = buildLookup<Set18Champion>('champion', set18Champions);
const traitLookup = buildLookup<Set18Trait>('trait', set18Traits);
const augmentLookup = buildLookup<Set18Augment>('augment', set18Augments);
const wispLookup = buildLookup<Set18Wisp>('wisp', set18Wisps);

export const getChampionBySlug = championLookup.bySlug;
export const getChampionSlug = championLookup.slugOf;
export const getTraitBySlug = traitLookup.bySlug;
export const getTraitSlug = traitLookup.slugOf;
export const getAugmentBySlug = augmentLookup.bySlug;
export const getAugmentSlug = augmentLookup.slugOf;
export const getWispBySlug = wispLookup.bySlug;
export const getWispSlug = wispLookup.slugOf;
