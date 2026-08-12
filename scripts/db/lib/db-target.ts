export type DbTargetEnv = {
  DATABASE_URL?: string;
  DB_TARGET_LABEL?: string;
  [key: string]: string | undefined;
};

export type DbTargetInfo = {
  label: string;
  database: string;
};

export function redactDatabaseUrl(value: string | undefined) {
  if (!value) return 'missing DATABASE_URL';
  try {
    const url = new URL(value);
    return `${url.hostname}${url.pathname}`;
  } catch {
    return 'unparseable DATABASE_URL';
  }
}

export function getDbTargetInfo(env: DbTargetEnv = process.env): DbTargetInfo {
  return {
    label: env.DB_TARGET_LABEL?.trim() || 'unknown',
    database: redactDatabaseUrl(env.DATABASE_URL),
  };
}

export function assertKnownDbTarget(operation: string, env: DbTargetEnv = process.env): DbTargetInfo {
  const target = getDbTargetInfo(env);
  if (target.label === 'unknown') {
    throw new Error(
      `${operation}: DB_TARGET_LABEL chưa được set hoặc đang là "unknown". `
        + 'Set DB_TARGET_LABEL=local|production-clone|staging|production trước khi chạy DB write/dry-run.',
    );
  }
  return target;
}

export function logDbTarget(operation: string, target: DbTargetInfo) {
  console.log(`DB target (${operation}): ${target.label} (${target.database})`);
}
