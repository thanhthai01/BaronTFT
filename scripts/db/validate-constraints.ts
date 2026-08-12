import { neon } from '@neondatabase/serverless';
import { assertKnownDbTarget, logDbTarget } from './lib/db-target';
import { constraintProblems, type ConstraintValidationCounts } from './lib/db-constraint-validation';

type CountRow = { value: number };
type ColumnExistsRow = { exists: boolean };

async function main() {
  const target = assertKnownDbTarget('db:validate-constraints');
  logDbTarget('read-only constraint validation', target);
  if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL chưa được set.');
  const sql = neon(process.env.DATABASE_URL);
  const entityIdsColumn = await sql`
    select exists (
      select 1
      from information_schema.columns
      where table_schema = 'public'
        and table_name = 'set18_tips'
        and column_name = 'entity_ids'
    ) as exists
  ` as ColumnExistsRow[];
  const hasTipEntityIds = entityIdsColumn[0]?.exists ?? false;

  const [
    duplicatePatchReportOrders,
    duplicateTipSlugs,
    invalidTipEntityIdsJson,
    invalidTipChampionIdsJson,
    invalidTipTraitIdsJson,
    invalidPatchEntryCategories,
    invalidPatchEntryKinds,
    invalidAugmentRarities,
    invalidTraitTypes,
  ] = await Promise.all([
    sql`select count(*)::int as value from (select report_order from patch_reports group by report_order having count(*) > 1) t` as unknown as Promise<CountRow[]>,
    sql`select count(*)::int as value from (select slug from set18_tips group by slug having count(*) > 1) t` as unknown as Promise<CountRow[]>,
    hasTipEntityIds
      ? sql`select count(*)::int as value from set18_tips where entity_ids is not null and jsonb_typeof(entity_ids) <> 'array'` as unknown as Promise<CountRow[]>
      : Promise.resolve([{ value: 0 }]),
    sql`select count(*)::int as value from set18_tips where jsonb_typeof(champion_ids) <> 'array'` as unknown as Promise<CountRow[]>,
    sql`select count(*)::int as value from set18_tips where jsonb_typeof(trait_ids) <> 'array'` as unknown as Promise<CountRow[]>,
    sql`select count(*)::int as value from patch_entries where category not in ('champion', 'trait', 'item', 'wisp', 'augment', 'mechanic')` as unknown as Promise<CountRow[]>,
    sql`select count(*)::int as value from patch_entries where kind not in ('buff', 'nerf', 'rework', 'mechanic')` as unknown as Promise<CountRow[]>,
    sql`select count(*)::int as value from set18_augments where rarity not in ('Silver', 'Gold', 'Prismatic')` as unknown as Promise<CountRow[]>,
    sql`select count(*)::int as value from set18_traits where type not in ('Origin', 'Class', 'Unique')` as unknown as Promise<CountRow[]>,
  ]);

  const counts: ConstraintValidationCounts = {
    duplicatePatchReportOrders: duplicatePatchReportOrders[0]?.value ?? 0,
    duplicateTipSlugs: duplicateTipSlugs[0]?.value ?? 0,
    invalidTipEntityIdsJson: invalidTipEntityIdsJson[0]?.value ?? 0,
    invalidTipChampionIdsJson: invalidTipChampionIdsJson[0]?.value ?? 0,
    invalidTipTraitIdsJson: invalidTipTraitIdsJson[0]?.value ?? 0,
    invalidPatchEntryCategories: invalidPatchEntryCategories[0]?.value ?? 0,
    invalidPatchEntryKinds: invalidPatchEntryKinds[0]?.value ?? 0,
    invalidAugmentRarities: invalidAugmentRarities[0]?.value ?? 0,
    invalidTraitTypes: invalidTraitTypes[0]?.value ?? 0,
  };
  const problems = constraintProblems(counts);
  if (problems.length > 0) {
    console.error('DB constraint preflight failed:');
    problems.forEach((problem) => console.error(`- ${problem.check}: ${problem.detail} (${problem.count})`));
    process.exit(1);
  }

  console.log('✓ DB constraint preflight passed. Authoring constraint migrations can be reviewed for this target.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
