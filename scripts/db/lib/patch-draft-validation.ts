import type { PatchCategory, PatchChangeKind, PatchContentOrigin, PatchReport } from '../../../src/content/patch-notes';
import type { Set18EntityIndexEntry } from '../../../src/content/set18/set18-types';

export type PatchDraftValidationResult = {
  errors: string[];
  warnings: string[];
};

export type PatchDraftValidationOptions = {
  entities?: Iterable<Pick<Set18EntityIndexEntry, 'id' | 'kind'>>;
};

const PATCH_CATEGORIES = ['champion', 'trait', 'item', 'wisp', 'augment', 'mechanic'] as const satisfies PatchCategory[];
const PATCH_KINDS = ['buff', 'nerf', 'rework', 'mechanic'] as const satisfies PatchChangeKind[];
const PATCH_ORIGINS = ['official', 'analysis'] as const satisfies PatchContentOrigin[];
const AUGMENT_RARITIES = ['Silver', 'Gold', 'Prismatic'] as const;
const BREAKPOINT_STYLES = ['bronze', 'silver', 'gold', 'chromatic', 'unique'] as const;
const SET18_ENTITY_CATEGORIES = ['champion', 'trait', 'augment', 'wisp'] as const satisfies PatchCategory[];

function hasValue<T extends readonly string[]>(values: T, value: unknown): value is T[number] {
  return typeof value === 'string' && values.includes(value);
}

function entityKindFromCategory(category: PatchCategory) {
  return (SET18_ENTITY_CATEGORIES as readonly string[]).includes(category) ? category as Set18EntityIndexEntry['kind'] : null;
}

export function validatePatchDraft(report: PatchReport, options: PatchDraftValidationOptions = {}): PatchDraftValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const entityById = new Map<string, Pick<Set18EntityIndexEntry, 'id' | 'kind'>>();
  for (const entity of options.entities ?? []) entityById.set(entity.id, entity);

  if (!report.id) errors.push('report.id is required');
  if (!report.version) errors.push(`report ${report.id || '<unknown>'}: version is required`);
  if (!report.title) errors.push(`report ${report.id || '<unknown>'}: title is required`);
  if (!Array.isArray(report.entries)) errors.push(`report ${report.id || '<unknown>'}: entries must be an array`);
  if (report.summaryOrigin && !hasValue(PATCH_ORIGINS, report.summaryOrigin)) {
    errors.push(`report ${report.id}: invalid summaryOrigin "${report.summaryOrigin}"`);
  }

  const entryIds = new Set<string>();
  const duplicateEntryIds = new Set<string>();
  for (const entry of report.entries ?? []) {
    if (!entry.id) errors.push(`report ${report.id}: entry is missing id`);
    if (entry.id && entryIds.has(entry.id)) duplicateEntryIds.add(entry.id);
    if (entry.id) entryIds.add(entry.id);

    if (!hasValue(PATCH_CATEGORIES, entry.category)) {
      errors.push(`entry ${entry.id || '<missing id>'}: invalid category "${entry.category}"`);
    }
    if (!hasValue(PATCH_KINDS, entry.kind)) {
      errors.push(`entry ${entry.id || '<missing id>'}: invalid kind "${entry.kind}"`);
    }
    if (entry.rarity && !hasValue(AUGMENT_RARITIES, entry.rarity)) {
      errors.push(`entry ${entry.id}: invalid rarity "${entry.rarity}"`);
    }
    if (entry.breakpointStyle && !hasValue(BREAKPOINT_STYLES, entry.breakpointStyle)) {
      errors.push(`entry ${entry.id}: invalid breakpointStyle "${entry.breakpointStyle}"`);
    }

    const expectedKind = hasValue(PATCH_CATEGORIES, entry.category) ? entityKindFromCategory(entry.category) : null;
    if (entry.entityId) {
      const entity = entityById.get(entry.entityId);
      if (!entity) {
        errors.push(`entry ${entry.id}: entityId "${entry.entityId}" does not resolve in Set 18 entity index`);
      } else if (expectedKind && entity.kind !== expectedKind) {
        errors.push(`entry ${entry.id}: entityId "${entry.entityId}" is kind "${entity.kind}", expected "${expectedKind}"`);
      }
    } else if ((report.entitySet ?? 18) === 18 && expectedKind) {
      warnings.push(`entry ${entry.id}: missing entityId for Set 18 ${expectedKind}; UI will fall back to display-name lookup`);
    }
  }

  for (const id of duplicateEntryIds) errors.push(`report ${report.id}: duplicate entry id "${id}"`);

  for (const impact of report.impacts ?? []) {
    if (impact.origin && !hasValue(PATCH_ORIGINS, impact.origin)) {
      errors.push(`impact ${impact.id}: invalid origin "${impact.origin}"`);
    }
    for (const relatedId of impact.relatedEntryIds ?? []) {
      if (!entryIds.has(relatedId)) errors.push(`impact ${impact.id}: relatedEntryId "${relatedId}" does not exist in report entries`);
    }
  }

  return { errors, warnings };
}

export function assertValidPatchDraft(report: PatchReport, options: PatchDraftValidationOptions = {}) {
  const result = validatePatchDraft(report, options);
  if (result.errors.length > 0) {
    throw new Error(`Patch draft validation failed:\n- ${result.errors.join('\n- ')}`);
  }
  return result;
}
