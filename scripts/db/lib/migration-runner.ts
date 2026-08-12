import { createHash } from 'node:crypto';
import path from 'node:path';

export type MigrationManifest = {
  id: string;
  filePath: string;
  checksum: string;
  sql: string;
};

export function migrationIdFromPath(filePath: string) {
  return path.basename(filePath).replace(/\.sql$/i, '');
}

export function checksumSql(sql: string) {
  return createHash('sha256').update(sql.replace(/\r\n/g, '\n')).digest('hex');
}

export function buildMigrationManifest(filePath: string, sql: string): MigrationManifest {
  return {
    id: migrationIdFromPath(filePath),
    filePath,
    checksum: checksumSql(sql),
    sql,
  };
}

export function assertSafeMigrationSql(migration: MigrationManifest) {
  if (/create\s+index\s+concurrently/i.test(migration.sql)) {
    throw new Error(`Migration ${migration.id} uses CREATE INDEX CONCURRENTLY, which is not allowed in this transaction runner.`);
  }
  if (/drop\s+table|drop\s+column|truncate\s+table/i.test(migration.sql)) {
    throw new Error(`Migration ${migration.id} contains destructive SQL; use a separately reviewed runbook.`);
  }
}
