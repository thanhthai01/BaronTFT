import { describe, expect, it } from 'vitest';
import type { Set18Tip } from '../../src/content/set18/set18-types';
import { assertValidTipLinks, buildTipUpsertPlan, normalizeTipForWrite } from '../../scripts/db/lib/tip-draft';

const tip: Set18Tip = {
  id: 'tip-akali-ap-carry',
  slug: 'akali-ap-carry',
  titleVi: 'Akali carry AP',
  contentVi: 'Giu do AP cho Akali.',
  entityIds: ['champion:tft18_akali', 'augment:tft18_example'],
  championIds: [],
  traitIds: [],
  sourceUrl: null,
};

const entities = [{ id: 'champion:tft18_akali' }, { id: 'augment:tft18_example' }];

describe('tip draft helpers', () => {
  it('normalizes legacy champion and trait subsets from entityIds', () => {
    expect(normalizeTipForWrite(tip)).toMatchObject({
      entityIds: ['champion:tft18_akali', 'augment:tft18_example'],
      championIds: ['champion:tft18_akali'],
      traitIds: [],
    });
  });

  it('validates entity ids against the generated entity index', () => {
    expect(() => assertValidTipLinks(normalizeTipForWrite(tip), entities)).not.toThrow();
    expect(() => assertValidTipLinks(normalizeTipForWrite({ ...tip, entityIds: ['champion:tft18_missing'] }), entities)).toThrow(/không có trong set18-entity-index/);
  });

  it('builds an upsert that includes entity_ids after migration', () => {
    const plan = buildTipUpsertPlan(normalizeTipForWrite(tip), true);
    expect(plan.sql).toContain('entity_ids');
    expect(plan.values).toEqual([
      'tip-akali-ap-carry',
      'akali-ap-carry',
      'Akali carry AP',
      'Giu do AP cho Akali.',
      '["champion:tft18_akali","augment:tft18_example"]',
      '["champion:tft18_akali"]',
      '[]',
      null,
    ]);
  });

  it('builds a legacy upsert before entity_ids migration', () => {
    const plan = buildTipUpsertPlan(normalizeTipForWrite(tip), false);
    expect(plan.sql).not.toContain('entity_ids');
    expect(plan.values).toEqual([
      'tip-akali-ap-carry',
      'akali-ap-carry',
      'Akali carry AP',
      'Giu do AP cho Akali.',
      '["champion:tft18_akali"]',
      '[]',
      null,
    ]);
  });
});
