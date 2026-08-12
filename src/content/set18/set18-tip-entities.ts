import type { Set18Tip } from './set18-types';

export function set18TipEntityIds(tip: Pick<Set18Tip, 'entityIds' | 'championIds' | 'traitIds'>) {
  if (tip.entityIds?.length) return tip.entityIds;
  return [...tip.championIds, ...tip.traitIds];
}
