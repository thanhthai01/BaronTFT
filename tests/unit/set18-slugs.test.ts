import { describe, expect, it } from 'vitest';
import { foldDiacritics, toSlug } from '../../src/lib/slug';
import { set18EntityIndex } from '../../src/content/set18/set18-entity-index';
import { set18Slugs, set18SlugById, findSet18Slug } from '../../src/content/set18/set18-slugs.generated';
import { buildSet18Slugs } from '../../scripts/db/lib/build-set18-slugs';

describe('foldDiacritics / toSlug', () => {
  it('bỏ dấu tiếng Việt kể cả đ/Đ (normalize NFD không tự tách được)', () => {
    expect(foldDiacritics('Đấu Sĩ')).toBe('Dau Si');
    expect(foldDiacritics('Thích Ứng')).toBe('Thich Ung');
  });

  it('sinh slug ascii, lowercase, gạch nối', () => {
    expect(toSlug('Thích Ứng')).toBe('thich-ung');
    expect(toSlug('Sunfire Cape')).toBe('sunfire-cape');
    expect(toSlug('  Nhiều   khoảng --trắng  ')).toBe('nhieu-khoang-trang');
  });
});

describe('set18-slugs.generated.ts', () => {
  it('mọi entity trong set18-entity-index đều có slug', () => {
    for (const entity of set18EntityIndex) {
      expect(set18SlugById.get(entity.id), `thiếu slug cho ${entity.id}`).toBeDefined();
    }
  });

  it('không có 2 entity cùng kind trùng slug', () => {
    const seen = new Set<string>();
    for (const entry of set18Slugs) {
      const key = `${entry.kind}:${entry.slug}`;
      expect(seen.has(key), `slug trùng: ${key}`).toBe(false);
      seen.add(key);
    }
  });

  it('slug của wisp sinh từ nameVi, không phải name (tên EN Tinh Linh bị lệch hàng)', () => {
    // Vài Tinh Linh trùng nameVi (vd 2 wisp cùng tên "Túi Bảo Bối") — dedup thêm
    // hậu tố -2/-3, nên chỉ khẳng định slug bắt đầu bằng gốc toSlug(nameVi),
    // không so bằng tuyệt đối.
    const wispEntities = set18EntityIndex.filter((e) => e.kind === 'wisp');
    for (const entity of wispEntities) {
      const slugEntry = set18SlugById.get(entity.id);
      expect(slugEntry).toBeDefined();
      if (entity.nameVi) {
        const base = toSlug(entity.nameVi);
        expect(slugEntry!.slug === base || slugEntry!.slug.startsWith(`${base}-`)).toBe(true);
      }
    }
  });

  it('khớp với build-set18-slugs chạy lại trên chính entity-index hiện tại (bắt drift khi db:pull đổi tên)', () => {
    const rebuilt = buildSet18Slugs(set18EntityIndex);
    expect(rebuilt).toEqual(set18Slugs);
  });

  it('findSet18Slug tra được đúng entity theo kind + slug', () => {
    const champion = set18Slugs.find((e) => e.kind === 'champion');
    expect(champion).toBeDefined();
    expect(findSet18Slug('champion', champion!.slug)).toEqual(champion);
    expect(findSet18Slug('champion', 'khong-ton-tai')).toBeUndefined();
  });
});
