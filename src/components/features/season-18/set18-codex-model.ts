import type { Set18Champion, Set18Trait } from '@/content/set18/set18-types';

export function buildSynergyMatrixModel(
  traits: Set18Trait[],
  champions: Set18Champion[],
  traitByName: Map<string, Set18Trait>,
) {
  const origins = traits.filter((trait) => trait.type === 'Origin');
  const classes = traits.filter((trait) => trait.type === 'Class');
  const gridMap: Set18Champion[][][] = origins.map(() => classes.map(() => []));
  const specialChampions: { champion: Set18Champion; uniqueTrait: Set18Trait | null }[] = [];

  for (const champion of champions) {
    const championOrigins = champion.traits.filter((name) => traitByName.get(name)?.type === 'Origin');
    const championClasses = champion.traits.filter((name) => traitByName.get(name)?.type === 'Class');
    if (championOrigins.length === 0 || championClasses.length === 0) {
      const reasonName = champion.traits.find((name) => traitByName.get(name)?.type === 'Unique') ?? champion.traits[0];
      specialChampions.push({ champion, uniqueTrait: reasonName ? (traitByName.get(reasonName) ?? null) : null });
      continue;
    }
    for (const originName of championOrigins) {
      const originIndex = origins.findIndex((trait) => trait.name === originName);
      for (const className of championClasses) {
        const classIndex = classes.findIndex((trait) => trait.name === className);
        if (originIndex >= 0 && classIndex >= 0) gridMap[originIndex][classIndex].push(champion);
      }
    }
  }

  return {
    classes,
    gridMap,
    matrixOrigins: origins
      .map((trait, rowIndex) => ({ trait, rowIndex }))
      .filter(({ rowIndex }) => gridMap[rowIndex].some((cell) => cell.length > 0)),
    specialChampions,
  };
}
