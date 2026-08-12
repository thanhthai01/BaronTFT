import { describe, expect, it } from 'vitest';
import { assertSafeMigrationSql, buildMigrationManifest, checksumSql, migrationIdFromPath } from '../../scripts/db/lib/migration-runner';

describe('migration runner helpers', () => {
  it('derives migration ids from sql paths', () => {
    expect(migrationIdFromPath('src/db/migrations/0001_authoring_constraints.sql')).toBe('0001_authoring_constraints');
  });

  it('checksums normalized line endings', () => {
    expect(checksumSql('select 1;\n')).toBe(checksumSql('select 1;\r\n'));
  });

  it('builds migration manifests', () => {
    expect(buildMigrationManifest('src/db/migrations/0001_authoring_constraints.sql', 'select 1;')).toMatchObject({
      id: '0001_authoring_constraints',
      filePath: 'src/db/migrations/0001_authoring_constraints.sql',
      sql: 'select 1;',
    });
  });

  it('blocks destructive SQL', () => {
    const migration = buildMigrationManifest('001.sql', 'drop table patch_reports;');
    expect(() => assertSafeMigrationSql(migration)).toThrow(/destructive SQL/);
  });

  it('blocks concurrent indexes for transaction runner', () => {
    const migration = buildMigrationManifest('001.sql', 'create index concurrently idx on t (id);');
    expect(() => assertSafeMigrationSql(migration)).toThrow(/CREATE INDEX CONCURRENTLY/);
  });
});
