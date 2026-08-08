import { describe, expect, it } from 'vitest';
import { toSlug } from '../../src/lib/slug';
import { searchIndex } from '../../src/content/search-index.generated';
import { set18Slugs } from '../../src/content/set18/set18-slugs.generated';
import { lessons } from '../../src/content/lessons';

function fold(value: string): string {
  return toSlug(value).replace(/-/g, ' ');
}

describe('search-index.generated.ts', () => {
  it('có đúng số mục: 65 tướng + 36 tộc hệ + 176 tinh linh + 261 nâng cấp + N bài học', () => {
    const byKind = new Map<string, number>();
    for (const entry of searchIndex) byKind.set(entry.kind, (byKind.get(entry.kind) ?? 0) + 1);
    expect(byKind.get('champion')).toBe(65);
    expect(byKind.get('trait')).toBe(36);
    expect(byKind.get('wisp')).toBe(176);
    expect(byKind.get('augment')).toBe(set18Slugs.filter((s) => s.kind === 'augment').length);
    expect(byKind.get('lesson')).toBe(lessons.length);
  });

  it('href tướng/tộc/tinh linh/nâng cấp trỏ tới trang SECTION kèm ?focus=slug (cuộn trong lưới, không phải trang chi tiết đơn lẻ)', () => {
    const validPrefix: Record<string, string> = {
      champion: '/mua-18/chi-tiet-tuong?focus=',
      trait: '/mua-18/chi-tiet-toc-he?focus=',
      wisp: '/mua-18/tinh-linh?focus=',
      augment: '/mua-18/nang-cap?focus=',
      lesson: '/kien-thuc-nen-tang/',
    };
    for (const entry of searchIndex) {
      expect(entry.href.startsWith(validPrefix[entry.kind]), `href sai prefix: ${entry.id} -> ${entry.href}`).toBe(true);
    }
  });

  it('không trùng id', () => {
    const seen = new Set<string>();
    for (const entry of searchIndex) {
      expect(seen.has(entry.id), `id trùng: ${entry.id}`).toBe(false);
      seen.add(entry.id);
    }
  });

  it('tìm "akali" ra đúng Akali', () => {
    const matches = searchIndex.filter((e) => e.folded.includes(fold('akali')));
    expect(matches.some((e) => e.label === 'Akali')).toBe(true);
  });

  it('tìm "thich ung" (đã bỏ dấu) ra đúng trait "Thích Ứng"', () => {
    const query = fold('thich ung');
    const matches = searchIndex.filter((e) => e.folded.includes(query));
    expect(matches.some((e) => e.label === 'Thích Ứng')).toBe(true);
  });

  it('tìm "Thích Ứng" (có dấu, như người dùng gõ thật) sau khi fold vẫn ra kết quả', () => {
    const query = fold('Thích Ứng');
    const matches = searchIndex.filter((e) => e.folded.includes(query));
    expect(matches.some((e) => e.label === 'Thích Ứng')).toBe(true);
  });

  it('tìm theo tên bài học ra đúng bài học đó', () => {
    const lesson = lessons[0];
    const query = fold(lesson.shortTitle);
    const matches = searchIndex.filter((e) => e.kind === 'lesson' && e.folded.includes(query));
    expect(matches.some((e) => e.href === `/kien-thuc-nen-tang/${lesson.slug}`)).toBe(true);
  });
});
