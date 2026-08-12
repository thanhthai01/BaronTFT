import { readFileSync } from 'node:fs';
import path from 'node:path';
import { neon } from '@neondatabase/serverless';
import { sql } from 'drizzle-orm';
import { db } from '../../src/db/client';
import { assertKnownDbTarget, logDbTarget } from './lib/db-target';
import { assertSafeMigrationSql, buildMigrationManifest, splitMigrationStatements } from './lib/migration-runner';

type JournalRow = {
  id: string;
  checksum: string;
};

function requiredArg(name: string) {
  const value = process.argv[process.argv.indexOf(name) + 1];
  if (process.argv.indexOf(name) === -1 || !value) throw new Error(`Missing required ${name} <value>`);
  return value;
}

async function main() {
  const filePath = process.argv[2];
  if (!filePath) {
    console.error('Dùng: pnpm db:migrate:apply src/db/migrations/<migration>.sql --expect-target <target>');
    process.exit(1);
  }
  const expectedTarget = requiredArg('--expect-target');
  const target = assertKnownDbTarget('db:migrate:apply');
  logDbTarget('schema migration write', target);
  if (target.label !== expectedTarget) {
    throw new Error(`Migration target mismatch: DB_TARGET_LABEL=${target.label}, --expect-target=${expectedTarget}`);
  }

  const absPath = path.resolve(process.cwd(), filePath);
  const migration = buildMigrationManifest(filePath, readFileSync(absPath, 'utf8'));
  assertSafeMigrationSql(migration);

  await db.execute(sql.raw(`
    CREATE TABLE IF NOT EXISTS "schema_migrations" (
      "id" text PRIMARY KEY NOT NULL,
      "checksum" text NOT NULL,
      "applied_at" timestamp DEFAULT now() NOT NULL,
      "target_label" text NOT NULL,
      "database" text NOT NULL,
      "git_revision" text,
      "file_path" text NOT NULL
    );
  `));

  if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL chưa được set.');
  const query = neon(process.env.DATABASE_URL);
  const existing = await query.query('select id, checksum from schema_migrations where id = $1', [migration.id]) as JournalRow[];
  if (existing.length > 0) {
    if (existing[0].checksum !== migration.checksum) {
      throw new Error(`Migration ${migration.id} already applied with a different checksum.`);
    }
    console.log(`- Migration ${migration.id} already applied; checksum matches.`);
    return;
  }

  const gitRevision = process.env.GIT_COMMIT_SHA ?? null;
  const statements = splitMigrationStatements(migration.sql);
  if (statements.length === 0) throw new Error(`Migration ${migration.id} has no SQL statements.`);
  const batchItems = [
    ...statements.map((statement) => db.execute(sql.raw(statement))),
    db.execute(sql`
      INSERT INTO "schema_migrations" ("id", "checksum", "target_label", "database", "git_revision", "file_path")
      VALUES (${migration.id}, ${migration.checksum}, ${target.label}, ${target.database}, ${gitRevision}, ${migration.filePath})
    `),
  ] as unknown as Parameters<typeof db.batch>[0];
  await db.batch(batchItems);

  console.log(`✓ Applied migration ${migration.id}.`);
  console.log(`Checksum: ${migration.checksum}`);
  console.log('Run `pnpm db:check-schema` and relevant validation after this migration.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
