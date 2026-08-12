import { describe, expect, it } from 'vitest';
import type { PatchReport } from '../../src/content/patch-notes';
import { validatePatchDraft } from '../../scripts/db/lib/patch-draft-validation';

const entities = [
  { id: 'champion:tft18_akali', kind: 'champion' as const },
  { id: 'trait:coven', kind: 'trait' as const },
  { id: 'augment:da_heartofsteel', kind: 'augment' as const },
];

function report(overrides: Partial<PatchReport> = {}): PatchReport {
  return {
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
    ...overrides,
  };
}

describe('patch draft validation', () => {
  it('passes valid drafts', () => {
    expect(validatePatchDraft(report(), { entities })).toEqual({ errors: [], warnings: [] });
  });

  it('rejects duplicate entry ids', () => {
    const result = validatePatchDraft(
      report({
        entries: [
          { id: 'dupe', category: 'champion', kind: 'buff', name: 'Akali', entityId: 'champion:tft18_akali' },
          { id: 'dupe', category: 'trait', kind: 'nerf', name: 'Coven', entityId: 'trait:coven' },
        ],
      }),
      { entities },
    );

    expect(result.errors).toContain('report patch-test: duplicate entry id "dupe"');
  });

  it('rejects unresolved entity ids', () => {
    const result = validatePatchDraft(
      report({ entries: [{ id: 'missing', category: 'champion', kind: 'buff', name: 'Missing', entityId: 'champion:tft18_missing' }] }),
      { entities },
    );

    expect(result.errors).toContain('entry missing: entityId "champion:tft18_missing" does not resolve in Set 18 entity index');
  });

  it('rejects entity ids with the wrong kind', () => {
    const result = validatePatchDraft(
      report({ entries: [{ id: 'wrong-kind', category: 'champion', kind: 'buff', name: 'Akali', entityId: 'trait:coven' }] }),
      { entities },
    );

    expect(result.errors).toContain('entry wrong-kind: entityId "trait:coven" is kind "trait", expected "champion"');
  });

  it('rejects invalid enum-like values', () => {
    const result = validatePatchDraft(
      report({
        entries: [
          {
            id: 'bad-enums',
            category: 'champion',
            kind: 'buff',
            name: 'Akali',
            entityId: 'champion:tft18_akali',
            rarity: 'Diamond',
            breakpointStyle: 'rainbow',
          } as unknown as PatchReport['entries'][number],
        ],
      }),
      { entities },
    );

    expect(result.errors).toContain('entry bad-enums: invalid rarity "Diamond"');
    expect(result.errors).toContain('entry bad-enums: invalid breakpointStyle "rainbow"');
  });

  it('rejects impact references to missing entries', () => {
    const result = validatePatchDraft(
      report({
        impacts: [
          {
            id: 'impact-1',
            title: 'Impact',
            direction: 'up',
            verdict: 'Up',
            body: 'Body',
            relatedEntryIds: ['entry-akali', 'missing-entry'],
          },
        ],
      }),
      { entities },
    );

    expect(result.errors).toContain('impact impact-1: relatedEntryId "missing-entry" does not exist in report entries');
  });

  it('warns rather than fails when Set 18 entity entries miss entityId', () => {
    const result = validatePatchDraft(
      report({ entries: [{ id: 'fallback', category: 'champion', kind: 'buff', name: 'Akali' }] }),
      { entities },
    );

    expect(result.errors).toEqual([]);
    expect(result.warnings).toContain('entry fallback: missing entityId for Set 18 champion; UI will fall back to display-name lookup');
  });
});
