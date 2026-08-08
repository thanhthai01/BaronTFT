import type { Set18EntityIndexEntry, Set18EntityKind, Set18SlugEntry } from './set18-types';

/** Trả về mảng slug xếp ĐÚNG vị trí với mảng nội dung gốc cùng `kind`
 * (set18-champions.ts, set18-traits.ts, set18-wisps.ts, set18-augments.ts) — vị
 * trí thứ i của entity-index theo kind khớp 1-1 với vị trí thứ i của mảng nội
 * dung, cùng lý do đã giải thích ở set18-lookup.ts.
 *
 * Tách riêng khỏi set18-lookup.ts (module đó `import` cả 4 file content — dùng
 * ổn ở server component/script, nhưng nếu Set18Codex.tsx (client) import theo sẽ
 * kéo eager cả ~470KB dữ liệu Set18 vào bundle, phá vỡ lazy-load per-section đang
 * có). Hàm này KHÔNG import content file nào — Set18Codex tự lazy-load
 * set18-entity-index + set18-slugs.generated cùng lúc với content của section
 * đang xem, rồi gọi hàm thuần này để nối slug. */
export function slugsForKind(
  kind: Set18EntityKind,
  entityIndex: Set18EntityIndexEntry[],
  slugById: Map<string, Set18SlugEntry>,
): (string | undefined)[] {
  return entityIndex.filter((entry) => entry.kind === kind).map((entry) => slugById.get(entry.id)?.slug);
}

/** Map object nội dung (tham chiếu, không phải tên) -> slug — dùng tham chiếu vì
 * tên/nameVi có thể trùng (vd 2 Tinh Linh cùng "Túi Bảo Bối"), map theo tên sẽ
 * gán nhầm slug cho phần tử trùng thứ 2. */
export function buildSlugRefMap<T>(
  kind: Set18EntityKind,
  items: T[],
  entityIndex: Set18EntityIndexEntry[],
  slugById: Map<string, Set18SlugEntry>,
): Map<T, string> {
  const slugs = slugsForKind(kind, entityIndex, slugById);
  const map = new Map<T, string>();
  items.forEach((item, index) => {
    const slug = slugs[index];
    if (slug) map.set(item, slug);
  });
  return map;
}
