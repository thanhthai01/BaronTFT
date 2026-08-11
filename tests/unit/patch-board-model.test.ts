import { describe, expect, it } from 'vitest';
import { buildPatchBoardModel, groupPatchEntries } from '../../src/components/features/patch/patch-board-model';
import type { PatchEntry } from '../../src/content/patch-notes';

const entries: PatchEntry[] = [
  { id: 'c5', category: 'champion', kind: 'buff', name: 'Zed', cost: 5 },
  { id: 'c1', category: 'champion', kind: 'nerf', name: 'Akali', cost: 1 },
  { id: 'a-prism', category: 'augment', kind: 'nerf', name: 'Prism', rarity: 'Prismatic' },
  { id: 'a-silver', category: 'augment', kind: 'buff', name: 'Silver', rarity: 'Silver' },
  { id: 't6', category: 'trait', kind: 'nerf', name: 'Blackthorn', breakpoint: '6' },
];

describe('patch-board model', () => {
  it('counts categories against the active kind filter and kinds against the active category filter', () => {
    const model = buildPatchBoardModel(entries, 18, 'champion', 'nerf');

    expect(model.categoryCounts.champion).toBe(1);
    expect(model.categoryCounts.augment).toBe(1);
    expect(model.categoryCounts.trait).toBe(1);
    expect(model.kindCounts.nerf).toBe(1);
    expect(model.kindCounts.buff).toBe(1);
    expect(model.filtered.map((entry) => entry.id)).toEqual(['c1']);
  });

  it('groups in reading order and sorts inside category by player-facing rank', () => {
    const groups = groupPatchEntries(entries, 18);

    expect(groups.map((group) => group.category)).toEqual(['champion', 'trait', 'augment']);
    expect(groups[0].entries.map((entry) => entry.id)).toEqual(['c1', 'c5']);
    expect(groups[2].entries.map((entry) => entry.id)).toEqual(['a-silver', 'a-prism']);
  });
});
