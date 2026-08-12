import type { PatchEntityMutation } from './patch-changeset';

export type SupportedMutationColumn = {
  column: string;
  kind: 'string' | 'number' | 'boolean' | 'nullable-string' | 'nullable-number';
};

export type PlannedEntityMutation = {
  mutation: PatchEntityMutation;
  column: SupportedMutationColumn;
};

type MutationTable = PatchEntityMutation['table'];

const SUPPORTED_FIELDS = {
  set18_champions: {
    name: { column: 'name', kind: 'string' },
    nicknameVi: { column: 'nickname_vi', kind: 'nullable-string' },
    cost: { column: 'cost', kind: 'number' },
    costLabel: { column: 'cost_label', kind: 'string' },
    costColor: { column: 'cost_color', kind: 'string' },
    mana: { column: 'mana', kind: 'string' },
    range: { column: 'range', kind: 'string' },
    role: { column: 'role', kind: 'string' },
    abilityName: { column: 'ability_name', kind: 'string' },
    abilityNameVi: { column: 'ability_name_vi', kind: 'string' },
    ability: { column: 'ability', kind: 'string' },
    abilityVi: { column: 'ability_vi', kind: 'string' },
  },
  set18_traits: {
    name: { column: 'name', kind: 'string' },
    vi: { column: 'vi', kind: 'string' },
    type: { column: 'type', kind: 'string' },
    typeVi: { column: 'type_vi', kind: 'string' },
    description: { column: 'description', kind: 'string' },
    descriptionVi: { column: 'description_vi', kind: 'string' },
    note: { column: 'note', kind: 'nullable-string' },
    activation: { column: 'activation', kind: 'nullable-string' },
    wide: { column: 'wide', kind: 'boolean' },
  },
  set18_augments: {
    name: { column: 'name', kind: 'string' },
    nameVi: { column: 'name_vi', kind: 'string' },
    rarity: { column: 'rarity', kind: 'string' },
    category: { column: 'category', kind: 'string' },
    categoryVi: { column: 'category_vi', kind: 'string' },
    description: { column: 'description', kind: 'string' },
    descriptionVi: { column: 'description_vi', kind: 'string' },
  },
  set18_wisps: {
    name: { column: 'name', kind: 'string' },
    nameVi: { column: 'name_vi', kind: 'string' },
    category: { column: 'category', kind: 'string' },
    categoryVi: { column: 'category_vi', kind: 'string' },
    tier: { column: 'tier', kind: 'number' },
    cost: { column: 'cost', kind: 'nullable-number' },
    description: { column: 'description', kind: 'string' },
    descriptionVi: { column: 'description_vi', kind: 'string' },
    blossomUpgradeCost: { column: 'blossom_upgrade_cost', kind: 'nullable-number' },
    blossomUpgradeDescriptionVi: { column: 'blossom_upgrade_description_vi', kind: 'nullable-string' },
    appearsVi: { column: 'appears_vi', kind: 'string' },
    appearsStart: { column: 'appears_start', kind: 'nullable-string' },
    appearsEnd: { column: 'appears_end', kind: 'nullable-string' },
  },
  set18_items: {
    apiName: { column: 'api_name', kind: 'string' },
    name: { column: 'name', kind: 'string' },
    nameVi: { column: 'name_vi', kind: 'string' },
    category: { column: 'category', kind: 'string' },
    description: { column: 'description', kind: 'string' },
    descriptionVi: { column: 'description_vi', kind: 'string' },
    statLine: { column: 'stat_line', kind: 'nullable-string' },
    unique: { column: 'unique', kind: 'boolean' },
  },
  set18_tips: {
    slug: { column: 'slug', kind: 'string' },
    titleVi: { column: 'title_vi', kind: 'string' },
    contentVi: { column: 'content_vi', kind: 'string' },
    sourceUrl: { column: 'source_url', kind: 'nullable-string' },
  },
} as const satisfies Record<MutationTable, Record<string, SupportedMutationColumn>>;

export function supportedMutationColumn(table: MutationTable, fieldPath: string): SupportedMutationColumn | undefined {
  return SUPPORTED_FIELDS[table][fieldPath as keyof typeof SUPPORTED_FIELDS[typeof table]];
}

function validateValueKind(value: unknown, kind: SupportedMutationColumn['kind']) {
  if (kind === 'string') return typeof value === 'string';
  if (kind === 'number') return typeof value === 'number';
  if (kind === 'boolean') return typeof value === 'boolean';
  if (kind === 'nullable-string') return value === null || typeof value === 'string';
  if (kind === 'nullable-number') return value === null || typeof value === 'number';
  return false;
}

export function planEntityMutation(mutation: PatchEntityMutation): PlannedEntityMutation {
  if (mutation.risk === 'needs-review') {
    throw new Error(`mutation ${mutation.id}: needs-review mutations cannot be applied automatically`);
  }
  if (mutation.matchMode !== 'exact' && mutation.matchMode !== 'replaceExact') {
    throw new Error(`mutation ${mutation.id}: matchMode ${mutation.matchMode} is not supported by automatic apply`);
  }
  const column = supportedMutationColumn(mutation.table, mutation.fieldPath);
  if (!column) {
    throw new Error(`mutation ${mutation.id}: fieldPath ${mutation.table}.${mutation.fieldPath} is not supported by automatic apply`);
  }
  if (!validateValueKind(mutation.expectedCurrent, column.kind)) {
    throw new Error(`mutation ${mutation.id}: expectedCurrent does not match ${column.kind}`);
  }
  if (!validateValueKind(mutation.nextValue, column.kind)) {
    throw new Error(`mutation ${mutation.id}: nextValue does not match ${column.kind}`);
  }
  if (mutation.matchMode === 'replaceExact' && (typeof mutation.expectedCurrent !== 'string' || typeof mutation.nextValue !== 'string')) {
    throw new Error(`mutation ${mutation.id}: replaceExact requires string expectedCurrent and nextValue`);
  }
  return { mutation, column };
}

export function nextMutationValue(mutation: PatchEntityMutation, currentValue: unknown) {
  if (mutation.matchMode === 'exact') {
    if (currentValue !== mutation.expectedCurrent) {
      throw new Error(`mutation ${mutation.id}: current value does not match expectedCurrent`);
    }
    return mutation.nextValue;
  }

  if (mutation.matchMode === 'replaceExact') {
    if (typeof currentValue !== 'string' || typeof mutation.expectedCurrent !== 'string' || typeof mutation.nextValue !== 'string') {
      throw new Error(`mutation ${mutation.id}: replaceExact requires string current, expectedCurrent, and nextValue`);
    }
    if (!currentValue.includes(mutation.expectedCurrent)) {
      throw new Error(`mutation ${mutation.id}: current value does not include expectedCurrent`);
    }
    return currentValue.split(mutation.expectedCurrent).join(mutation.nextValue);
  }

  throw new Error(`mutation ${mutation.id}: matchMode ${mutation.matchMode} is not supported by automatic apply`);
}

export function quoteIdentifier(identifier: string) {
  if (!/^[a-z_][a-z0-9_]*$/i.test(identifier)) throw new Error(`Unsafe SQL identifier: ${identifier}`);
  return `"${identifier}"`;
}
