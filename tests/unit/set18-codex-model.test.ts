import { describe, expect, it } from 'vitest';
import { buildSynergyMatrixModel } from '../../src/components/features/season-18/set18-codex-model';
import type { Set18Champion, Set18Trait } from '../../src/content/set18/set18-types';

function trait(name: string, type: Set18Trait['type']): Set18Trait {
  return {
    name,
    vi: name,
    type,
    typeVi: type,
    accent: '#000',
    accentSoft: '#111',
    breakpoints: ['1'],
    breaksLabel: '1',
    breakpointDetails: [],
    iconSlug: name,
    icon: `/icon/${name}.png`,
    description: '',
    descriptionVi: '',
    champions: [],
  };
}

function champion(name: string, traits: string[]): Set18Champion {
  return {
    name,
    cost: 1,
    costLabel: '1 vàng',
    costColor: '#fff',
    image: '',
    traits,
    mana: '0/0',
    range: '1',
    role: '',
    abilityIcon: '',
    abilityName: '',
    abilityNameVi: '',
    ability: '',
    abilityVi: '',
    stats: {
      health: [1, 1, 1],
      mana: [0, 0, 0],
      attackDamage: [1, 1, 1],
      abilityPower: 100,
      armor: 0,
      magicResist: 0,
      attackSpeed: 1,
      critChance: 0,
      critChance_pct: '0%',
      critMultiplier: 0,
      critMultiplier_pct: '0%',
      range: 1,
    },
  };
}

describe('set18 codex model', () => {
  it('builds origin/class intersections and separates special champions', () => {
    const traits = [trait('Origin A', 'Origin'), trait('Origin B', 'Origin'), trait('Class A', 'Class'), trait('Class B', 'Class'), trait('Unique X', 'Unique')];
    const traitByName = new Map(traits.map((item) => [item.name, item]));
    const champions = [
      champion('Multi', ['Origin A', 'Origin B', 'Class A', 'Class B']),
      champion('Special', ['Unique X']),
    ];

    const model = buildSynergyMatrixModel(traits, champions, traitByName);

    expect(model.classes.map((item) => item.name)).toEqual(['Class A', 'Class B']);
    expect(model.matrixOrigins.map(({ trait: item }) => item.name)).toEqual(['Origin A', 'Origin B']);
    expect(model.gridMap[0][0].map((item) => item.name)).toEqual(['Multi']);
    expect(model.gridMap[1][1].map((item) => item.name)).toEqual(['Multi']);
    expect(model.specialChampions[0]).toMatchObject({ champion: { name: 'Special' }, uniqueTrait: { name: 'Unique X' } });
  });
});
