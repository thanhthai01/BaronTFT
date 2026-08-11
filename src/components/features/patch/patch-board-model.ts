import {
  patchCategoryReadingOrder,
  patchKindOrder,
  patchRarityMeta,
  type PatchCategory,
  type PatchChangeKind,
  type PatchEntry,
} from '@/content/patch-notes';
import { resolveEntity, wispFacetsFromIcon } from './patch-entity-resolvers';

export type PatchBoardGroup = {
  category: PatchCategory;
  entries: PatchEntry[];
};

export function buildPatchBoardModel(
  entries: PatchEntry[],
  entitySet: number,
  category: PatchCategory | 'all',
  kindFilter: PatchChangeKind | 'all',
) {
  const byKind = kindFilter === 'all' ? entries : entries.filter((entry) => entry.kind === kindFilter);
  const byCategory = category === 'all' ? entries : entries.filter((entry) => entry.category === category);
  const categoryCounts = { all: byKind.length } as Record<PatchCategory | 'all', number>;
  const kindCounts = { all: byCategory.length } as Record<PatchChangeKind | 'all', number>;

  patchCategoryReadingOrder.forEach((key) => {
    categoryCounts[key] = byKind.filter((entry) => entry.category === key).length;
  });
  patchKindOrder.forEach((kind) => {
    kindCounts[kind] = byCategory.filter((entry) => entry.kind === kind).length;
  });

  const filtered = byCategory.filter((entry) => kindFilter === 'all' || entry.kind === kindFilter);
  const groups = groupPatchEntries(filtered, entitySet);

  return { categoryCounts, kindCounts, filtered, groups };
}

export function groupPatchEntries(entries: PatchEntry[], entitySet: number): PatchBoardGroup[] {
  const kindRank = (kind: PatchChangeKind) => patchKindOrder.indexOf(kind);

  const rankOf = (entry: PatchEntry) => {
    const entity = resolveEntity(entry, entitySet);
    switch (entry.category) {
      case 'champion':
        return entry.cost ?? entity?.cost ?? 0;
      case 'augment': {
        const rarity = entry.rarity ?? entity?.rarity;
        return rarity ? patchRarityMeta[rarity].rank : 0;
      }
      case 'wisp': {
        const facets = wispFacetsFromIcon(entity?.icon ?? entry.icon);
        return entry.wispTier ?? facets.wispTier ?? entry.cost ?? 0;
      }
      case 'trait':
        return Number(entry.breakpoint ?? 0);
      default:
        return 0;
    }
  };

  const subRankOf = (entry: PatchEntry) => {
    if (entry.category !== 'wisp') return '';
    const entity = resolveEntity(entry, entitySet);
    return entry.wispCategory ?? wispFacetsFromIcon(entity?.icon ?? entry.icon).wispCategory ?? '';
  };

  return patchCategoryReadingOrder
    .map((key) => ({
      category: key,
      entries: entries
        .filter((entry) => entry.category === key)
        .slice()
        .sort((a, b) => {
          const rankDiff = rankOf(a) - rankOf(b);
          if (rankDiff !== 0) return rankDiff;
          const subDiff = subRankOf(a).localeCompare(subRankOf(b));
          if (subDiff !== 0) return subDiff;
          if (a.kind !== b.kind) return kindRank(a.kind) - kindRank(b.kind);
          return a.name.localeCompare(b.name);
        }),
    }))
    .filter((group) => group.entries.length > 0);
}
