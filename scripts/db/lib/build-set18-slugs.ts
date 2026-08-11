// Sinh slug ổn định cho route /mua-18/{tuong,toc-he,tinh-linh,nang-cap}/[slug].
// Dùng chung bởi pull-set18.ts (khi có dữ liệu DB mới) và
// scripts/db/generate-set18-slugs.ts (chạy offline từ set18-entity-index.ts
// đã generate sẵn, không cần kết nối Neon).
//
// Slug sinh từ `name` (tiếng Anh, ASCII sẵn, ổn định qua các lần đổi tên hiển
// thị) — RIÊNG wisp bắt buộc sinh từ `nameVi` vì tên tiếng Anh của Tinh Linh
// bị lệch hàng so với dữ liệu thật (xem set18-wisps.ts).

import { writeFileSync } from 'node:fs';
import { toSlug } from '../../../src/lib/slug';
import type { Set18EntityKind, Set18SlugEntry } from '../../../src/content/set18/set18-types';

export type Set18SlugSourceEntry = {
  id: string;
  kind: Set18EntityKind;
  name: string;
  nameVi?: string;
};

function slugBaseFor(entry: Set18SlugSourceEntry): string {
  const source = entry.kind === 'wisp' ? entry.nameVi ?? entry.name : entry.name;
  return toSlug(source);
}

/** Trùng slug trong cùng `kind` → thêm hậu tố -2, -3... theo thứ tự đầu vào
 * (đầu vào đã ổn định theo `id`), để lần chạy sau cho kết quả giống hệt. */
export function buildSet18Slugs(entries: Set18SlugSourceEntry[]): Set18SlugEntry[] {
  const seenCountByKindAndBase = new Map<string, number>();
  return entries.map((entry) => {
    const base = slugBaseFor(entry) || entry.kind;
    const key = `${entry.kind}:${base}`;
    const count = (seenCountByKindAndBase.get(key) ?? 0) + 1;
    seenCountByKindAndBase.set(key, count);
    const slug = count === 1 ? base : `${base}-${count}`;
    return { slug, id: entry.id, kind: entry.kind };
  });
}

export function buildSet18SlugsSource(entries: Set18SlugEntry[], generatorNote: string) {
  return [
    '// GENERATED FILE — do not edit by hand.',
    `// ${generatorNote}`,
    '// Slug là hợp đồng URL vĩnh viễn — KHÔNG sửa tay để "làm đẹp" slug hiện có,',
    '// sửa sẽ đổi URL đã được Google index. Chỉ đổi bằng cách sửa build-set18-slugs.ts',
    '// rồi chạy lại và chấp nhận review diff.',
    '',
    "import type { Set18SlugEntry } from './set18-types';",
    '',
    `export const set18Slugs: Set18SlugEntry[] = ${JSON.stringify(entries)};`,
    'export const set18SlugByKindAndSlug = new Map(set18Slugs.map((entry) => [`${entry.kind}:${entry.slug}`, entry]));',
    'export const set18SlugById = new Map(set18Slugs.map((entry) => [entry.id, entry]));',
    "export function findSet18Slug(kind: Set18SlugEntry['kind'], slug: string) {",
    '  return set18SlugByKindAndSlug.get(`${kind}:${slug}`);',
    '}',
    '',
  ].join('\n');
}

export function writeSet18Slugs(entries: Set18SlugEntry[], generatorNote: string) {
  writeFileSync('src/content/set18/set18-slugs.generated.ts', buildSet18SlugsSource(entries, generatorNote));
  console.log(`✓ set18-slugs.generated.ts: ${entries.length} dòng`);
}
