import { describe, expect, it } from 'vitest';
import type { Set18Tip } from '../../src/content/set18/set18-types';
import { set18TipRelationProblems } from '../../src/content/set18/set18-tip-validation';

const entities = [
  { id: 'champion:tft18_akali', kind: 'champion' as const },
  { id: 'trait:executioner', kind: 'trait' as const },
  { id: 'augment:tft18_example', kind: 'augment' as const },
];

const tip: Set18Tip = {
  id: 'tip-akali',
  slug: 'akali',
  titleVi: 'Akali',
  contentVi: 'Giữ đồ AP.',
  entityIds: ['champion:tft18_akali', 'trait:executioner', 'augment:tft18_example'],
  championIds: ['champion:tft18_akali'],
  traitIds: ['trait:executioner'],
  sourceUrl: null,
};

describe('Set18 tip relation validation', () => {
  it('accepts canonical entityIds with mirrored legacy champion/trait fields', () => {
    expect(set18TipRelationProblems([tip], entities, { requireEntityIds: true })).toEqual([]);
  });

  it('reports unknown and duplicate entity ids', () => {
    expect(
      set18TipRelationProblems(
        [{ ...tip, entityIds: ['champion:tft18_akali', 'champion:tft18_akali', 'champion:tft18_missing'], championIds: ['champion:tft18_akali'] }],
        entities,
      ).map((problem) => problem.check),
    ).toEqual([
      'set18_tip_entity_ids_unique',
      'set18_tip_entity_ids_known',
      'set18_tip_champion_ids_mirror_entity_ids',
      'set18_tip_trait_ids_mirror_entity_ids',
    ]);
  });

  it('reports legacy fields that do not mirror entityIds', () => {
    expect(set18TipRelationProblems([{ ...tip, championIds: [], traitIds: [] }], entities).map((problem) => problem.check)).toEqual([
      'set18_tip_champion_ids_mirror_entity_ids',
      'set18_tip_trait_ids_mirror_entity_ids',
    ]);
  });

  it('allows legacy tips without entityIds unless strict mode requires them', () => {
    const legacyTip = { ...tip, entityIds: undefined, championIds: ['champion:tft18_akali'], traitIds: ['trait:executioner'] };
    expect(set18TipRelationProblems([legacyTip], entities)).toEqual([]);
    expect(set18TipRelationProblems([legacyTip], entities, { requireEntityIds: true }).map((problem) => problem.check)).toEqual(['set18_tip_entity_ids_required']);
  });
});
