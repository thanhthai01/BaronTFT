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

export function splitMigrationStatements(sql: string) {
  const statements: string[] = [];
  let current = '';
  let dollarQuote: string | null = null;
  let singleQuote = false;
  let doubleQuote = false;

  for (let i = 0; i < sql.length; i += 1) {
    const char = sql[i];
    const next = sql[i + 1];
    current += char;

    if (!singleQuote && !doubleQuote && char === '-' && next === '-') {
      while (i + 1 < sql.length && sql[i + 1] !== '\n') {
        i += 1;
        current += sql[i];
      }
      continue;
    }

    if (!singleQuote && !doubleQuote && char === '$') {
      const match = sql.slice(i).match(/^\$[A-Za-z0-9_]*\$/);
      if (match) {
        const token = match[0];
        if (dollarQuote === token) {
          dollarQuote = null;
        } else if (!dollarQuote) {
          dollarQuote = token;
        }
        for (let j = 1; j < token.length; j += 1) {
          i += 1;
          current += sql[i];
        }
        continue;
      }
    }

    if (dollarQuote) continue;
    if (!doubleQuote && char === "'" && sql[i - 1] !== "'") singleQuote = !singleQuote;
    if (!singleQuote && char === '"') doubleQuote = !doubleQuote;
    if (!singleQuote && !doubleQuote && char === ';') {
      const statement = current.trim();
      if (statement) statements.push(statement);
      current = '';
    }
  }

  const trailing = current.trim();
  if (trailing) statements.push(trailing);
  return statements;
}
