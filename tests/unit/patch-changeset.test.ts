import { describe, expect, it } from 'vitest';
import type { PatchChangeset } from '../../scripts/db/lib/patch-changeset';
import { validatePatchChangeset } from '../../scripts/db/lib/patch-changeset';

const entities = [{ id: 'champion:tft18_akali', kind: 'champion' as const }];

function changeset(overrides: Partial<PatchChangeset> = {}): PatchChangeset {
  return {
    id: 'changeset-patch-test',
    expectedTarget: 'production-clone',
    patchReport: {
      id: 'patch-test',
      version: 'Test',
      title: 'Test Patch',
      author: 'Baron TFT',
      dateVi: '01/01/2026',
      summaryVi: 'Test summary',
      entries: [
        {
          id: 'entry-akali',
          entityId: 'champion:tft18_akali',
          category: 'champion',
          kind: 'buff',
          name: 'Akali',
        },
      ],
    },
    entityMutations: [
      {
        id: 'mut-akali-ability',
        entryId: 'entry-akali',
        table: 'set18_champions',
        entityId: 'champion:tft18_akali',
        fieldPath: 'abilityVi',
        expectedCurrent: 'old',
        nextValue: 'new',
        matchMode: 'replaceExact',
      },
    ],
    unappliedChanges: [],
    ...overrides,
  };
}

describe('patch changeset validation', () => {
  it('summarizes valid changesets', () => {
    const result = validatePatchChangeset(changeset(), { entities });

    expect(result.errors).toEqual([]);
    expect(result.summary).toEqual({
      changesetId: 'changeset-patch-test',
      expectedTarget: 'production-clone',
      patchId: 'patch-test',
      entries: 1,
      entityMutations: 1,
      unappliedChanges: 0,
      affectedTables: ['set18_champions'],
    });
  });

  it('rejects unknown expected targets', () => {
    const result = validatePatchChangeset(changeset({ expectedTarget: 'unknown' }), { entities });

    expect(result.errors).toContain('changeset changeset-patch-test: expectedTarget must be explicit and cannot be unknown');
  });

  it('rejects mutation references to missing entries', () => {
    const result = validatePatchChangeset(
      changeset({ entityMutations: [{ ...changeset().entityMutations![0], entryId: 'missing-entry' }] }),
      { entities },
    );

    expect(result.errors).toContain('mutation mut-akali-ability: entryId "missing-entry" does not exist in patchReport.entries');
  });

  it('rejects duplicate mutation ids', () => {
    const mutation = changeset().entityMutations![0];
    const result = validatePatchChangeset(changeset({ entityMutations: [mutation, mutation] }), { entities });

    expect(result.errors).toContain('changeset changeset-patch-test: duplicate mutation id "mut-akali-ability"');
  });

  it('requires reasons for needs-review mutations', () => {
    const result = validatePatchChangeset(
      changeset({ entityMutations: [{ ...changeset().entityMutations![0], risk: 'needs-review' }] }),
      { entities },
    );

    expect(result.errors).toContain('mutation mut-akali-ability: reason is required when risk is needs-review');
  });

  it('rejects invalid unapplied changes', () => {
    const result = validatePatchChangeset(
      changeset({ unappliedChanges: [{ id: 'skip-1', entryId: 'missing-entry', change: '', reason: '' }] }),
      { entities },
    );

    expect(result.errors).toContain('unapplied skip-1: entryId "missing-entry" does not exist in patchReport.entries');
    expect(result.errors).toContain('unapplied skip-1: change is required');
    expect(result.errors).toContain('unapplied skip-1: reason is required');
  });
});
