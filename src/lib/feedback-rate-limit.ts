import { createHmac } from 'node:crypto';
import { sql } from 'drizzle-orm';
import type { db as database } from '@/db/client';

const WINDOW_MS = 15 * 60 * 1000;
let nextPruneAt = 0;

type Database = typeof database;
type RateLimitRow = { request_count: number };

function clientAddress(request: Request) {
  const vercelAddress = firstForwardedAddress(request.headers.get('x-vercel-forwarded-for'));
  if (isReasonableIpAddress(vercelAddress)) return vercelAddress;

  if (process.env.NODE_ENV === 'production') return 'unknown';
  const forwardedFor = request.headers.get('x-forwarded-for');
  const localAddress = firstForwardedAddress(forwardedFor);
  return isReasonableIpAddress(localAddress) ? localAddress : 'unknown';
}

function firstForwardedAddress(value: string | null) {
  return value?.split(',')[0]?.trim() ?? null;
}

function isReasonableIpAddress(value: string | null) {
  return Boolean(value && /^[0-9a-f:.]{3,45}$/i.test(value));
}

function requestKey(request: Request, scope: string) {
  const secret = process.env.FEEDBACK_RATE_LIMIT_SECRET;
  if (!secret) return null;
  const digest = createHmac('sha256', secret).update(`${scope}:${clientAddress(request)}`).digest('hex');
  return `${scope}:${digest}`;
}

export function hasAllowedOrigin(request: Request) {
  if (process.env.NODE_ENV !== 'production') return true;

  const origin = request.headers.get('origin');
  if (!origin) return true;

  const host = request.headers.get('host');
  const protocol = request.headers.get('x-forwarded-proto') ?? 'https';
  return Boolean(host) && origin === `${protocol}://${host}`;
}

export async function consumeFeedbackRateLimit(db: Database, request: Request, scope: string, maximumAttempts: number) {
  const key = requestKey(request, scope);
  if (!key) return { allowed: false, reason: 'Chưa cấu hình lớp bảo vệ gửi góp ý.' };

  const now = new Date();
  const windowStart = new Date(now.getTime() - WINDOW_MS);
  const result = await db.execute<RateLimitRow>(sql`
    INSERT INTO "feedback_request_limits" ("key", "window_started_at", "request_count", "updated_at")
    VALUES (${key}, ${now}, 1, ${now})
    ON CONFLICT ("key") DO UPDATE SET
      "request_count" = CASE
        WHEN "feedback_request_limits"."window_started_at" < ${windowStart} THEN 1
        ELSE "feedback_request_limits"."request_count" + 1
      END,
      "window_started_at" = CASE
        WHEN "feedback_request_limits"."window_started_at" < ${windowStart} THEN ${now}
        ELSE "feedback_request_limits"."window_started_at"
      END,
      "updated_at" = ${now}
    RETURNING "request_count";
  `);

  // Instances are short-lived, so this is only an opportunistic cleanup. The
  // window remains enforced atomically by the upsert above in every instance.
  if (Date.now() >= nextPruneAt) {
    nextPruneAt = Date.now() + 60 * 60 * 1000;
    void db.execute(sql`DELETE FROM "feedback_request_limits" WHERE "updated_at" < ${new Date(Date.now() - 24 * 60 * 60 * 1000)};`);
  }

  return { allowed: Number(result.rows[0]?.request_count) <= maximumAttempts };
}
