import { describe, expect, it } from 'vitest';
import type { PatchEntityMutation } from '../../scripts/db/lib/patch-changeset';
import { nextMutationValue, planEntityMutation, quoteIdentifier } from '../../scripts/db/lib/patch-changeset-apply';

const mutation: PatchEntityMutation = {
  id: 'mut-1',
  table: 'set18_champions',
  entityId: 'champion:tft18_akali',
  fieldPath: 'abilityVi',
  expectedCurrent: 'old',
  nextValue: 'new',
  matchMode: 'exact',
};

describe('patch changeset apply planning', () => {
  it('plans supported scalar mutations', () => {
    expect(planEntityMutation(mutation).column).toEqual({ column: 'ability_vi', kind: 'string' });
  });

  it('plans set18 tip entity id array mutations', () => {
    expect(
      planEntityMutation({
        ...mutation,
        table: 'set18_tips',
        entityId: 'tip-akali-ap-carry',
        fieldPath: 'entityIds',
        expectedCurrent: ['champion:tft18_akali'],
        nextValue: ['champion:tft18_akali', 'augment:tft18_example'],
      }).column,
    ).toEqual({ column: 'entity_ids', kind: 'string-array' });
  });

  it('rejects unsupported nested field paths', () => {
    expect(() => planEntityMutation({ ...mutation, fieldPath: 'forms[].abilityHtmlVi' })).toThrow(/not supported/);
  });

  it('rejects needs-review mutations', () => {
    expect(() => planEntityMutation({ ...mutation, risk: 'needs-review', reason: 'manual' })).toThrow(/needs-review/);
  });

  it('computes exact next values only when current value matches', () => {
    expect(nextMutationValue(mutation, 'old')).toBe('new');
    expect(() => nextMutationValue(mutation, 'other')).toThrow(/does not match/);
  });

  it('computes replaceExact next values', () => {
    expect(nextMutationValue({ ...mutation, expectedCurrent: 'old', nextValue: 'new', matchMode: 'replaceExact' }, 'old old')).toBe('new new');
  });

  it('quotes only safe SQL identifiers', () => {
    expect(quoteIdentifier('set18_champions')).toBe('"set18_champions"');
    expect(() => quoteIdentifier('set18_champions; drop table patch_reports')).toThrow(/Unsafe SQL identifier/);
  });
});
