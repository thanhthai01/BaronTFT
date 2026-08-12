import { neon } from '@neondatabase/serverless';
import { getTableColumns, getTableName } from 'drizzle-orm';
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

type DbColumn = {
  table_name: string;
  column_name: string;
  is_nullable: 'YES' | 'NO';
};

const OPTIONAL_PENDING_MIGRATION_COLUMNS = new Set(['set18_tips.entity_ids']);

const tables = [
  set18Champions,
  set18Traits,
  set18Augments,
  set18Wisps,
  set18Items,
  patchReports,
  patchEntries,
  set18Tips,
];

function expectedColumns() {
  return tables.map((table) => {
    const columns = Object.values(getTableColumns(table)).map((column) => ({
      name: column.name,
      notNull: column.notNull,
    }));
    return { table: getTableName(table), columns };
  });
}

async function main() {
  if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL chưa được set.');
  const sql = neon(process.env.DATABASE_URL);
  const rows = await sql`
    select table_name, column_name, is_nullable
    from information_schema.columns
    where table_schema = 'public'
    order by table_name, ordinal_position
  ` as DbColumn[];

  const actual = new Map<string, Map<string, DbColumn>>();
  for (const row of rows) {
    const table = actual.get(row.table_name) ?? new Map<string, DbColumn>();
    table.set(row.column_name, row);
    actual.set(row.table_name, table);
  }

  const problems: string[] = [];
  for (const expected of expectedColumns()) {
    const table = actual.get(expected.table);
    if (!table) {
      problems.push(`missing table: ${expected.table}`);
      continue;
    }
    for (const column of expected.columns) {
      const actualColumn = table.get(column.name);
      if (!actualColumn) {
        if (OPTIONAL_PENDING_MIGRATION_COLUMNS.has(`${expected.table}.${column.name}`)) continue;
        problems.push(`missing column: ${expected.table}.${column.name}`);
        continue;
      }
      if (column.notNull && actualColumn.is_nullable !== 'NO') {
        problems.push(`nullable drift: ${expected.table}.${column.name} should be NOT NULL`);
      }
    }
  }

  if (problems.length > 0) {
    console.error('Schema drift detected:');
    problems.forEach((problem) => console.error(`- ${problem}`));
    process.exit(1);
  }

  console.log(`✓ Schema drift check passed for ${tables.length} tables.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
