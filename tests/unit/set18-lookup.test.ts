import { describe, expect, it } from 'vitest';
import { set18Champions } from '../../src/content/set18/set18-champions';
import { set18Traits } from '../../src/content/set18/set18-traits';
import { set18Augments } from '../../src/content/set18/set18-augments';
import { set18Wisps } from '../../src/content/set18/set18-wisps';
import {
  getAugmentBySlug,
  getAugmentSlug,
  getChampionBySlug,
  getChampionSlug,
  getTraitBySlug,
  getTraitSlug,
  getWispBySlug,
  getWispSlug,
} from '../../src/content/set18/set18-lookup';

describe('set18-lookup: entity <-> slug đi được cả 2 chiều cho mọi phần tử', () => {
  it('champion', () => {
    for (const champion of set18Champions) {
      const slug = getChampionSlug(champion);
      expect(slug, `thiếu slug cho champion ${champion.name}`).toBeDefined();
      expect(getChampionBySlug(slug!)).toBe(champion);
    }
  });

  it('trait', () => {
    for (const trait of set18Traits) {
      const slug = getTraitSlug(trait);
      expect(slug, `thiếu slug cho trait ${trait.name}`).toBeDefined();
      expect(getTraitBySlug(slug!)).toBe(trait);
    }
  });

  it('augment', () => {
    for (const augment of set18Augments) {
      const slug = getAugmentSlug(augment);
      expect(slug, `thiếu slug cho augment ${augment.name}`).toBeDefined();
      expect(getAugmentBySlug(slug!)).toBe(augment);
    }
  });

  it('wisp (kiểm tra kỹ vì nameVi có trùng)', () => {
    for (const wisp of set18Wisps) {
      const slug = getWispSlug(wisp);
      expect(slug, `thiếu slug cho wisp ${wisp.nameVi}`).toBeDefined();
      expect(getWispBySlug(slug!)).toBe(wisp);
    }
  });

  it('slug không tồn tại trả về undefined, không throw', () => {
    expect(getChampionBySlug('khong-ton-tai')).toBeUndefined();
    expect(getWispBySlug('khong-ton-tai')).toBeUndefined();
  });
});
