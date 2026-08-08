import { describe, expect, it } from 'vitest';
import { buildSlugRefMap, slugsForKind } from '../../src/content/set18/set18-slug-index';
import { set18EntityIndex } from '../../src/content/set18/set18-entity-index';
import { set18SlugById } from '../../src/content/set18/set18-slugs.generated';
import { set18Champions } from '../../src/content/set18/set18-champions';
import { getChampionSlug } from '../../src/content/set18/set18-lookup';

describe('set18-slug-index (client-safe, không import content files)', () => {
  it('slugsForKind trả về đúng số lượng slug và khớp với set18-lookup (nguồn tin cậy đã test)', () => {
    const slugs = slugsForKind('champion', set18EntityIndex, set18SlugById);
    expect(slugs.length).toBe(set18Champions.length);
    set18Champions.forEach((champion, index) => {
      expect(slugs[index]).toBe(getChampionSlug(champion));
    });
  });

  it('buildSlugRefMap tra cứu đúng theo tham chiếu object, không lẫn giữa các phần tử trùng tên', () => {
    const map = buildSlugRefMap('champion', set18Champions, set18EntityIndex, set18SlugById);
    for (const champion of set18Champions) {
      expect(map.get(champion)).toBe(getChampionSlug(champion));
    }
  });
});
