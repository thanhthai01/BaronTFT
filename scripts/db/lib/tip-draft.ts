import type { Set18Tip } from '../../../src/content/set18/set18-types';
import type { Set18EntityIndexEntry } from '../../../src/content/set18/set18-types';

export type NormalizedSet18Tip = Set18Tip & { entityIds: string[] };

export type TipUpsertPlan = {
  sql: string;
  values: (string | null)[];
};

export function normalizeTipForWrite(tip: Set18Tip): NormalizedSet18Tip {
  const entityIds = tip.entityIds?.length ? tip.entityIds : [...tip.championIds, ...tip.traitIds];
  const championIds = tip.championIds.length > 0 ? tip.championIds : entityIds.filter((id) => id.startsWith('champion:'));
  const traitIds = tip.traitIds.length > 0 ? tip.traitIds : entityIds.filter((id) => id.startsWith('trait:'));
  return { ...tip, entityIds, championIds, traitIds };
}

export function assertValidTipLinks(tip: NormalizedSet18Tip, entities: Iterable<Pick<Set18EntityIndexEntry, 'id'>>) {
  const knownIds = new Set([...entities].map((entity) => entity.id));
  const fields = { entityIds: tip.entityIds, championIds: tip.championIds, traitIds: tip.traitIds };
  for (const [field, ids] of Object.entries(fields)) {
    if (!Array.isArray(ids) || ids.some((id) => typeof id !== 'string')) {
      throw new Error(`Draft "${tip.id}" field ${field} phải là string[].`);
    }
  }
  const badChampionIds = tip.championIds.filter((id) => !id.startsWith('champion:'));
  if (badChampionIds.length) throw new Error(`Draft "${tip.id}" championIds chứa ID không có prefix champion:: ${badChampionIds.join(', ')}`);
  const badTraitIds = tip.traitIds.filter((id) => !id.startsWith('trait:'));
  if (badTraitIds.length) throw new Error(`Draft "${tip.id}" traitIds chứa ID không có prefix trait:: ${badTraitIds.join(', ')}`);
  const unknownIds = [...new Set([...tip.entityIds, ...tip.championIds, ...tip.traitIds])].filter((id) => !knownIds.has(id));
  if (unknownIds.length) throw new Error(`Draft "${tip.id}" chứa entity ID không có trong set18-entity-index: ${unknownIds.join(', ')}`);
}

export function buildTipUpsertPlan(tip: NormalizedSet18Tip, hasEntityIdsColumn: boolean): TipUpsertPlan {
  if (hasEntityIdsColumn) {
    return {
      sql: [
        'insert into set18_tips (id, slug, title_vi, content_vi, entity_ids, champion_ids, trait_ids, source_url)',
        'values ($1, $2, $3, $4, $5::jsonb, $6::jsonb, $7::jsonb, $8)',
        'on conflict (id) do update set',
        'slug = excluded.slug,',
        'title_vi = excluded.title_vi,',
        'content_vi = excluded.content_vi,',
        'entity_ids = excluded.entity_ids,',
        'champion_ids = excluded.champion_ids,',
        'trait_ids = excluded.trait_ids,',
        'source_url = excluded.source_url,',
        'updated_at = now()',
      ].join(' '),
      values: [tip.id, tip.slug, tip.titleVi, tip.contentVi, JSON.stringify(tip.entityIds), JSON.stringify(tip.championIds), JSON.stringify(tip.traitIds), tip.sourceUrl],
    };
  }

  return {
    sql: [
      'insert into set18_tips (id, slug, title_vi, content_vi, champion_ids, trait_ids, source_url)',
      'values ($1, $2, $3, $4, $5::jsonb, $6::jsonb, $7)',
      'on conflict (id) do update set',
      'slug = excluded.slug,',
      'title_vi = excluded.title_vi,',
      'content_vi = excluded.content_vi,',
      'champion_ids = excluded.champion_ids,',
      'trait_ids = excluded.trait_ids,',
      'source_url = excluded.source_url,',
      'updated_at = now()',
    ].join(' '),
    values: [tip.id, tip.slug, tip.titleVi, tip.contentVi, JSON.stringify(tip.championIds), JSON.stringify(tip.traitIds), tip.sourceUrl],
  };
}
