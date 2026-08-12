import { describe, expect, it } from 'vitest';
import { assertKnownDbTarget, getDbTargetInfo, redactDatabaseUrl } from '../../scripts/db/lib/db-target';

describe('db target guard', () => {
  it('redacts database URLs to host and path only', () => {
    expect(redactDatabaseUrl('postgres://user:secret@example.neon.tech/dbname?sslmode=require')).toBe('example.neon.tech/dbname');
  });

  it('reports unknown when DB_TARGET_LABEL is missing', () => {
    expect(getDbTargetInfo({ DATABASE_URL: 'postgres://u:p@example.neon.tech/db' })).toEqual({
      label: 'unknown',
      database: 'example.neon.tech/db',
    });
  });

  it('fails closed for missing target labels', () => {
    expect(() => assertKnownDbTarget('db:apply-patch', { DATABASE_URL: 'postgres://u:p@example.neon.tech/db' })).toThrow(
      /DB_TARGET_LABEL/,
    );
  });

  it('returns redacted target info for known labels', () => {
    expect(assertKnownDbTarget('db:apply-patch', { DB_TARGET_LABEL: 'production-clone', DATABASE_URL: 'postgres://u:p@example.neon.tech/db' })).toEqual({
      label: 'production-clone',
      database: 'example.neon.tech/db',
    });
  });
});
