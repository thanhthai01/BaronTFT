import type { PatchReport } from '../../../src/content/patch-notes';
import type { Set18EntityIndexEntry } from '../../../src/content/set18/set18-types';
import { validatePatchDraft, type PatchDraftValidationResult } from './patch-draft-validation';

export type PatchEntityMutation = {
  id: string;
  entryId?: string;
  table: 'set18_champions' | 'set18_traits' | 'set18_augments' | 'set18_wisps' | 'set18_items' | 'set18_tips';
  entityId: string;
  fieldPath: string;
  expectedCurrent: string | number | boolean | string[] | null;
  nextValue: string | number | boolean | string[] | null;
  matchMode: 'exact' | 'replaceExact' | 'jsonPath' | 'manual';
  risk?: 'safe' | 'needs-review';
  reason?: string;
};

export type PatchUnappliedChange = {
  id: string;
  entryId?: string;
  change: string;
  reason: string;
  validationPath?: string;
  expiry?: string;
};

export type PatchChangeset = {
  id: string;
  expectedTarget: string;
  patchReport: PatchReport;
  entityMutations?: PatchEntityMutation[];
  unappliedChanges?: PatchUnappliedChange[];
  sourceEvidence?: string[];
};

export type PatchChangesetValidationResult = PatchDraftValidationResult & {
  summary: {
    changesetId: string;
    expectedTarget: string;
    patchId: string;
    entries: number;
    entityMutations: number;
    unappliedChanges: number;
    affectedTables: string[];
  };
};

const MUTATION_TABLES: PatchEntityMutation['table'][] = [
  'set18_champions',
  'set18_traits',
  'set18_augments',
  'set18_wisps',
  'set18_items',
  'set18_tips',
];
const MATCH_MODES: PatchEntityMutation['matchMode'][] = ['exact', 'replaceExact', 'jsonPath', 'manual'];

function hasValue<T extends readonly string[]>(values: T, value: unknown): value is T[number] {
  return typeof value === 'string' && values.includes(value);
}

export function validatePatchChangeset(
  changeset: PatchChangeset,
  options: { entities?: Iterable<Pick<Set18EntityIndexEntry, 'id' | 'kind'>> } = {},
): PatchChangesetValidationResult {
  const draftResult = validatePatchDraft(changeset.patchReport, options);
  const errors = [...draftResult.errors];
  const warnings = [...draftResult.warnings];
  const entryIds = new Set((changeset.patchReport.entries ?? []).map((entry) => entry.id));
  const mutationIds = new Set<string>();
  const duplicateMutationIds = new Set<string>();
  const unappliedIds = new Set<string>();
  const duplicateUnappliedIds = new Set<string>();

  if (!changeset.id) errors.push('changeset.id is required');
  if (!changeset.expectedTarget || changeset.expectedTarget === 'unknown') {
    errors.push(`changeset ${changeset.id || '<unknown>'}: expectedTarget must be explicit and cannot be unknown`);
  }
  if (changeset.patchReport.id && changeset.id && !changeset.id.includes(changeset.patchReport.id)) {
    warnings.push(`changeset ${changeset.id}: id does not include patchReport.id "${changeset.patchReport.id}"`);
  }

  for (const mutation of changeset.entityMutations ?? []) {
    if (!mutation.id) errors.push('entity mutation is missing id');
    if (mutation.id && mutationIds.has(mutation.id)) duplicateMutationIds.add(mutation.id);
    if (mutation.id) mutationIds.add(mutation.id);
    if (mutation.entryId && !entryIds.has(mutation.entryId)) {
      errors.push(`mutation ${mutation.id}: entryId "${mutation.entryId}" does not exist in patchReport.entries`);
    }
    if (!hasValue(MUTATION_TABLES, mutation.table)) errors.push(`mutation ${mutation.id}: invalid table "${mutation.table}"`);
    if (!mutation.entityId) errors.push(`mutation ${mutation.id}: entityId is required`);
    if (!mutation.fieldPath) errors.push(`mutation ${mutation.id}: fieldPath is required`);
    if (!hasValue(MATCH_MODES, mutation.matchMode)) errors.push(`mutation ${mutation.id}: invalid matchMode "${mutation.matchMode}"`);
    if (mutation.risk === 'needs-review' && !mutation.reason) errors.push(`mutation ${mutation.id}: reason is required when risk is needs-review`);
  }
  for (const id of duplicateMutationIds) errors.push(`changeset ${changeset.id}: duplicate mutation id "${id}"`);

  for (const unapplied of changeset.unappliedChanges ?? []) {
    if (!unapplied.id) errors.push('unapplied change is missing id');
    if (unapplied.id && unappliedIds.has(unapplied.id)) duplicateUnappliedIds.add(unapplied.id);
    if (unapplied.id) unappliedIds.add(unapplied.id);
    if (unapplied.entryId && !entryIds.has(unapplied.entryId)) {
      errors.push(`unapplied ${unapplied.id}: entryId "${unapplied.entryId}" does not exist in patchReport.entries`);
    }
    if (!unapplied.change) errors.push(`unapplied ${unapplied.id}: change is required`);
    if (!unapplied.reason) errors.push(`unapplied ${unapplied.id}: reason is required`);
  }
  for (const id of duplicateUnappliedIds) errors.push(`changeset ${changeset.id}: duplicate unapplied change id "${id}"`);

  const affectedTables = [...new Set((changeset.entityMutations ?? []).map((mutation) => mutation.table))].sort();
  return {
    errors,
    warnings,
    summary: {
      changesetId: changeset.id,
      expectedTarget: changeset.expectedTarget,
      patchId: changeset.patchReport.id,
      entries: changeset.patchReport.entries.length,
      entityMutations: changeset.entityMutations?.length ?? 0,
      unappliedChanges: changeset.unappliedChanges?.length ?? 0,
      affectedTables,
    },
  };
}

export function assertValidPatchChangeset(
  changeset: PatchChangeset,
  options: { entities?: Iterable<Pick<Set18EntityIndexEntry, 'id' | 'kind'>> } = {},
) {
  const result = validatePatchChangeset(changeset, options);
  if (result.errors.length > 0) {
    throw new Error(`Patch changeset validation failed:\n- ${result.errors.join('\n- ')}`);
  }
  return result;
}
