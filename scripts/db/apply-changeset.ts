import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { count, eq, min } from 'drizzle-orm';
import { set18EntityIndex } from '../../src/content/set18/set18-entity-index';
import {
  patchEntries,
  patchReports,
  set18Augments,
  set18Champions,
  set18Items,
  set18Tips,
  set18Traits,
  set18Wisps,
} from '../../src/db/schema';
import { db } from '../../src/db/client';
import { assertKnownDbTarget, logDbTarget } from './lib/db-target';
import { assertValidPatchChangeset, type PatchChangeset, type PatchEntityMutation } from './lib/patch-changeset';
import { nextMutationValue, planEntityMutation } from './lib/patch-changeset-apply';

type ScalarValue = string | number | boolean | string[] | null;

const championFields = {
  name: set18Champions.name,
  nicknameVi: set18Champions.nicknameVi,
  cost: set18Champions.cost,
  costLabel: set18Champions.costLabel,
  costColor: set18Champions.costColor,
  mana: set18Champions.mana,
  range: set18Champions.range,
  role: set18Champions.role,
  abilityName: set18Champions.abilityName,
  abilityNameVi: set18Champions.abilityNameVi,
  ability: set18Champions.ability,
  abilityVi: set18Champions.abilityVi,
} as const;

const traitFields = {
  name: set18Traits.name,
  vi: set18Traits.vi,
  type: set18Traits.type,
  typeVi: set18Traits.typeVi,
  description: set18Traits.description,
  descriptionVi: set18Traits.descriptionVi,
  note: set18Traits.note,
  activation: set18Traits.activation,
  wide: set18Traits.wide,
} as const;

const augmentFields = {
  name: set18Augments.name,
  nameVi: set18Augments.nameVi,
  rarity: set18Augments.rarity,
  category: set18Augments.category,
  categoryVi: set18Augments.categoryVi,
  description: set18Augments.description,
  descriptionVi: set18Augments.descriptionVi,
} as const;

const wispFields = {
  name: set18Wisps.name,
  nameVi: set18Wisps.nameVi,
  category: set18Wisps.category,
  categoryVi: set18Wisps.categoryVi,
  tier: set18Wisps.tier,
  cost: set18Wisps.cost,
  description: set18Wisps.description,
  descriptionVi: set18Wisps.descriptionVi,
  blossomUpgradeCost: set18Wisps.blossomUpgradeCost,
  blossomUpgradeDescriptionVi: set18Wisps.blossomUpgradeDescriptionVi,
  appearsVi: set18Wisps.appearsVi,
  appearsStart: set18Wisps.appearsStart,
  appearsEnd: set18Wisps.appearsEnd,
} as const;

const itemFields = {
  apiName: set18Items.apiName,
  name: set18Items.name,
  nameVi: set18Items.nameVi,
  category: set18Items.category,
  description: set18Items.description,
  descriptionVi: set18Items.descriptionVi,
  statLine: set18Items.statLine,
  unique: set18Items.unique,
} as const;

const tipFields = {
  slug: set18Tips.slug,
  titleVi: set18Tips.titleVi,
  contentVi: set18Tips.contentVi,
  entityIds: set18Tips.entityIds,
  championIds: set18Tips.championIds,
  traitIds: set18Tips.traitIds,
  sourceUrl: set18Tips.sourceUrl,
} as const;

async function loadChangeset(filePath: string): Promise<PatchChangeset> {
  const absPath = path.resolve(process.cwd(), filePath);
  const mod: Record<string, unknown> = await import(pathToFileURL(absPath).href);
  const changeset = (mod.default ?? mod.changeset) as PatchChangeset | undefined;
  if (!changeset) {
    throw new Error(`Changeset "${filePath}" phải export default (hoặc export const changeset) một object PatchChangeset.`);
  }
  return changeset;
}

function assertSingleRow(rows: { value: ScalarValue }[], mutation: PatchEntityMutation) {
  if (rows.length !== 1) throw new Error(`mutation ${mutation.id}: expected 1 row for ${mutation.table}.${mutation.entityId}, found ${rows.length}`);
  return rows[0].value;
}

async function readCurrentValue(mutation: PatchEntityMutation) {
  switch (mutation.table) {
    case 'set18_champions': {
      const column = championFields[mutation.fieldPath as keyof typeof championFields];
      const rows = await db.select({ value: column }).from(set18Champions).where(eq(set18Champions.id, mutation.entityId));
      return assertSingleRow(rows, mutation);
    }
    case 'set18_traits': {
      const column = traitFields[mutation.fieldPath as keyof typeof traitFields];
      const rows = await db.select({ value: column }).from(set18Traits).where(eq(set18Traits.id, mutation.entityId));
      return assertSingleRow(rows, mutation);
    }
    case 'set18_augments': {
      const column = augmentFields[mutation.fieldPath as keyof typeof augmentFields];
      const rows = await db.select({ value: column }).from(set18Augments).where(eq(set18Augments.id, mutation.entityId));
      return assertSingleRow(rows, mutation);
    }
    case 'set18_wisps': {
      const column = wispFields[mutation.fieldPath as keyof typeof wispFields];
      const rows = await db.select({ value: column }).from(set18Wisps).where(eq(set18Wisps.id, mutation.entityId));
      return assertSingleRow(rows, mutation);
    }
    case 'set18_items': {
      const column = itemFields[mutation.fieldPath as keyof typeof itemFields];
      const rows = await db.select({ value: column }).from(set18Items).where(eq(set18Items.id, mutation.entityId));
      return assertSingleRow(rows, mutation);
    }
    case 'set18_tips': {
      const column = tipFields[mutation.fieldPath as keyof typeof tipFields];
      const rows = await db.select({ value: column }).from(set18Tips).where(eq(set18Tips.id, mutation.entityId));
      return assertSingleRow(rows, mutation);
    }
  }
}

function updateSet(mutation: PatchEntityMutation, value: ScalarValue) {
  return { [mutation.fieldPath]: value, updatedAt: new Date() };
}

function updateMutationQuery(mutation: PatchEntityMutation, value: ScalarValue) {
  switch (mutation.table) {
    case 'set18_champions':
      return db.update(set18Champions).set(updateSet(mutation, value)).where(eq(set18Champions.id, mutation.entityId));
    case 'set18_traits':
      return db.update(set18Traits).set(updateSet(mutation, value)).where(eq(set18Traits.id, mutation.entityId));
    case 'set18_augments':
      return db.update(set18Augments).set(updateSet(mutation, value)).where(eq(set18Augments.id, mutation.entityId));
    case 'set18_wisps':
      return db.update(set18Wisps).set(updateSet(mutation, value)).where(eq(set18Wisps.id, mutation.entityId));
    case 'set18_items':
      return db.update(set18Items).set(updateSet(mutation, value)).where(eq(set18Items.id, mutation.entityId));
    case 'set18_tips':
      return db.update(set18Tips).set(updateSet(mutation, value)).where(eq(set18Tips.id, mutation.entityId));
  }
}

async function main() {
  const filePath = process.argv[2];
  if (!filePath) {
    console.error('Dùng: pnpm db:apply-changeset <đường dẫn file changeset.ts>');
    process.exit(1);
  }

  const target = assertKnownDbTarget('db:apply-changeset');
  logDbTarget('changeset write', target);

  const changeset = await loadChangeset(filePath);
  if (target.label !== changeset.expectedTarget) {
    throw new Error(`Changeset target mismatch: DB_TARGET_LABEL=${target.label}, expectedTarget=${changeset.expectedTarget}`);
  }

  const validation = assertValidPatchChangeset(changeset, { entities: set18EntityIndex });
  validation.warnings.forEach((warning) => console.warn(`Changeset warning: ${warning}`));
  const plannedMutations = (changeset.entityMutations ?? []).map((mutation) => planEntityMutation(mutation).mutation);

  const { patchReport } = changeset;
  const { entries, ...reportFields } = patchReport;
  const existing = await db
    .select({ reportOrder: patchReports.reportOrder })
    .from(patchReports)
    .where(eq(patchReports.id, patchReport.id));
  const [{ minOrder }] = existing.length > 0 ? [{ minOrder: existing[0].reportOrder }] : await db.select({ minOrder: min(patchReports.reportOrder) }).from(patchReports);
  const reportOrder = existing.length > 0 ? existing[0].reportOrder : minOrder === null ? 0 : minOrder - 1;
  const reportRow: typeof patchReports.$inferInsert = { ...reportFields, reportOrder };
  const entryRows: (typeof patchEntries.$inferInsert)[] = entries.map((entry, sortOrder) => ({ ...entry, reportId: patchReport.id, sortOrder }));

  const countQuery = db.select({ value: count() }).from(patchEntries).where(eq(patchEntries.reportId, patchReport.id));
  const entityUpdateQueries = [];
  for (const mutation of plannedMutations) {
    const currentValue = await readCurrentValue(mutation);
    const nextValue = nextMutationValue(mutation, currentValue) as ScalarValue;
    entityUpdateQueries.push(updateMutationQuery(mutation, nextValue));
  }
  const result = entryRows.length > 0
    ? await db.batch([
        db.insert(patchReports).values(reportRow).onConflictDoUpdate({ target: patchReports.id, set: reportRow }),
        db.delete(patchEntries).where(eq(patchEntries.reportId, patchReport.id)),
        db.insert(patchEntries).values(entryRows),
        ...entityUpdateQueries,
        countQuery,
      ] as unknown as Parameters<typeof db.batch>[0])
    : await db.batch([
        db.insert(patchReports).values(reportRow).onConflictDoUpdate({ target: patchReports.id, set: reportRow }),
        db.delete(patchEntries).where(eq(patchEntries.reportId, patchReport.id)),
        ...entityUpdateQueries,
        countQuery,
      ] as unknown as Parameters<typeof db.batch>[0]);
  const insertedCount = (result.at(-1) as { value: number }[] | undefined)?.[0]?.value;
  if (insertedCount !== entries.length) {
    throw new Error(`Ghi "${patchReport.id}" không khớp số mục: draft=${entries.length}, DB=${insertedCount ?? 'unknown'}.`);
  }

  console.log(`✓ Đã apply changeset "${changeset.id}".`);
  console.log(`Patch entries: ${entries.length}`);
  console.log(`Entity mutations: ${plannedMutations.length}`);
  console.log(`Unapplied changes documented: ${changeset.unappliedChanges?.length ?? 0}`);
  console.log('Chạy `pnpm db:pull`, `pnpm db:pull:check`, audit publish, rồi review generated diff trước khi commit/deploy.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
