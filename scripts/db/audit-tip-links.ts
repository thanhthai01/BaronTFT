import { neon } from '@neondatabase/serverless';
import { set18EntityIndex } from '../../src/content/set18/set18-entity-index';
import { set18TipRelationProblems } from '../../src/content/set18/set18-tip-validation';
import { getDbTargetInfo, logDbTarget } from './lib/db-target';
import { tipFromRawRow, type RawTipRow } from './lib/tip-draft';

type ColumnExistsRow = { exists: boolean };
type CountRow = { value: number };

const EXPECT_MIGRATED = process.argv.includes('--expect-migrated');

async function main() {
  if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL chưa được set.');
  const target = getDbTargetInfo();
  logDbTarget('read-only tip relation audit', target);
  const sql = neon(process.env.DATABASE_URL);
  const entityIdsColumn = await sql.query(
    'select exists (select 1 from information_schema.columns where table_schema = $1 and table_name = $2 and column_name = $3) as exists',
    ['public', 'set18_tips', 'entity_ids'],
  ) as ColumnExistsRow[];
  const hasEntityIds = entityIdsColumn[0]?.exists ?? false;
  const rows = hasEntityIds
    ? await sql.query('select id, slug, title_vi, content_vi, entity_ids, champion_ids, trait_ids, source_url from set18_tips order by updated_at asc', []) as RawTipRow[]
    : await sql.query('select id, slug, title_vi, content_vi, champion_ids, trait_ids, source_url from set18_tips order by updated_at asc', []) as RawTipRow[];
  const [{ value: emptyEntityIdsCount = 0 } = { value: 0 }] = hasEntityIds
    ? await sql.query("select count(*)::int as value from set18_tips where jsonb_array_length(coalesce(entity_ids, '[]'::jsonb)) = 0 and (jsonb_array_length(champion_ids) > 0 or jsonb_array_length(trait_ids) > 0)", []) as CountRow[]
    : [{ value: rows.length }];
  const tips = rows.map(tipFromRawRow);
  const problems = set18TipRelationProblems(tips, set18EntityIndex, { requireEntityIds: hasEntityIds || EXPECT_MIGRATED });
  if (EXPECT_MIGRATED && !hasEntityIds) problems.push({ tipId: '<schema>', check: 'set18_tips_entity_ids_column_exists', detail: 'entity_ids column is missing' });
  if (emptyEntityIdsCount > 0 && hasEntityIds) problems.push({ tipId: '<schema>', check: 'set18_tips_entity_ids_backfilled', detail: `${emptyEntityIdsCount} rows have empty entity_ids despite legacy links` });

  console.log(`Tips: ${tips.length}`);
  console.log(`entity_ids column: ${hasEntityIds ? 'present' : 'missing'}`);
  console.log(`empty entity_ids with legacy links: ${emptyEntityIdsCount}`);

  if (problems.length > 0) {
    console.error('Set18 tip DB relation audit failed:');
    problems.forEach((problem) => console.error(`- ${problem.tipId}: ${problem.check}: ${problem.detail}`));
    process.exit(1);
  }

  console.log('✓ Set18 tip DB relation audit passed.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
