import type { Set18EntityIndexEntry, Set18Tip } from './set18-types';
import { set18TipEntityIds } from './set18-tip-entities';

export type Set18TipRelationProblem = {
  tipId: string;
  check: string;
  detail: string;
};

export type Set18TipRelationValidationOptions = {
  requireEntityIds?: boolean;
};

function sameItems(left: string[], right: string[]) {
  return left.length === right.length && left.every((item, index) => item === right[index]);
}

function duplicateValues(values: string[]) {
  const seen = new Set<string>();
  const duplicates = new Set<string>();
  for (const value of values) {
    if (seen.has(value)) duplicates.add(value);
    seen.add(value);
  }
  return [...duplicates];
}

export function set18TipRelationProblems(
  tips: Pick<Set18Tip, 'id' | 'slug' | 'entityIds' | 'championIds' | 'traitIds'>[],
  entities: Iterable<Pick<Set18EntityIndexEntry, 'id' | 'kind'>>,
  options: Set18TipRelationValidationOptions = {},
) {
  const problems: Set18TipRelationProblem[] = [];
  const entityById = new Map([...entities].map((entity) => [entity.id, entity]));
  const duplicateTipIds = new Set(duplicateValues(tips.map((tip) => tip.id)));
  const duplicateSlugs = new Set(duplicateValues(tips.map((tip) => tip.slug)));

  for (const tip of tips) {
    if (duplicateTipIds.has(tip.id)) problems.push({ tipId: tip.id, check: 'set18_tip_id_unique', detail: `duplicate tip id "${tip.id}"` });
    if (duplicateSlugs.has(tip.slug)) problems.push({ tipId: tip.id, check: 'set18_tip_slug_unique', detail: `duplicate tip slug "${tip.slug}"` });
    if (options.requireEntityIds && !tip.entityIds) problems.push({ tipId: tip.id, check: 'set18_tip_entity_ids_required', detail: 'entityIds is required in generated Set18 tips' });

    const relationIds = set18TipEntityIds(tip);
    const duplicateRelationIds = duplicateValues(relationIds);
    if (duplicateRelationIds.length > 0) {
      problems.push({ tipId: tip.id, check: 'set18_tip_entity_ids_unique', detail: `duplicate related entity ids: ${duplicateRelationIds.join(', ')}` });
    }

    const unknownIds = relationIds.filter((id) => !entityById.has(id));
    if (unknownIds.length > 0) {
      problems.push({ tipId: tip.id, check: 'set18_tip_entity_ids_known', detail: `unknown related entity ids: ${unknownIds.join(', ')}` });
    }

    const badChampionIds = tip.championIds.filter((id) => entityById.get(id)?.kind !== 'champion');
    if (badChampionIds.length > 0) {
      problems.push({ tipId: tip.id, check: 'set18_tip_champion_ids_kind', detail: `championIds contains non-champion ids: ${badChampionIds.join(', ')}` });
    }

    const badTraitIds = tip.traitIds.filter((id) => entityById.get(id)?.kind !== 'trait');
    if (badTraitIds.length > 0) {
      problems.push({ tipId: tip.id, check: 'set18_tip_trait_ids_kind', detail: `traitIds contains non-trait ids: ${badTraitIds.join(', ')}` });
    }

    if (tip.entityIds) {
      const expectedChampionIds = tip.entityIds.filter((id) => entityById.get(id)?.kind === 'champion');
      const expectedTraitIds = tip.entityIds.filter((id) => entityById.get(id)?.kind === 'trait');
      if (!sameItems(tip.championIds, expectedChampionIds)) {
        problems.push({ tipId: tip.id, check: 'set18_tip_champion_ids_mirror_entity_ids', detail: 'championIds must mirror the champion subset of entityIds' });
      }
      if (!sameItems(tip.traitIds, expectedTraitIds)) {
        problems.push({ tipId: tip.id, check: 'set18_tip_trait_ids_mirror_entity_ids', detail: 'traitIds must mirror the trait subset of entityIds' });
      }
    }
  }

  return problems;
}
