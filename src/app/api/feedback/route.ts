import { randomUUID } from 'node:crypto';
import { NextResponse } from 'next/server';
import { feedbackSubmissions } from '@/db/schema';
import { validateFeedbackSubmission } from '@/lib/feedback';
import { consumeFeedbackRateLimit, hasAllowedOrigin } from '@/lib/feedback-rate-limit';
import { readJsonWithLimit } from '@/lib/request-security';

const MAX_FEEDBACK_BODY_BYTES = 4_096;

export async function POST(request: Request) {
  if (!hasAllowedOrigin(request)) {
    return NextResponse.json({ error: 'Nguồn gửi không hợp lệ.' }, { status: 403 });
  }
  const { db } = await import('@/db/client');
  try {
    const rateLimit = await consumeFeedbackRateLimit(db, request, 'submit', 5);
    if (!rateLimit.allowed) {
      return NextResponse.json({ error: rateLimit.reason ?? 'Bạn đã gửi quá nhiều góp ý. Thử lại sau 15 phút nhé.' }, {
        status: rateLimit.reason ? 503 : 429,
        headers: rateLimit.reason ? undefined : { 'Retry-After': '900' },
      });
    }
  } catch (error) {
    console.error('Unable to check feedback rate limit', error instanceof Error ? error.name : 'unknown');
    return NextResponse.json({ error: 'Chưa thể gửi góp ý. Bạn thử lại sau nhé.' }, { status: 503 });
  }

  const payload = await readJsonWithLimit(request, MAX_FEEDBACK_BODY_BYTES);
  if (!payload.ok) return NextResponse.json({ error: payload.error }, { status: payload.status });

  const result = validateFeedbackSubmission(payload.value);
  if (!result.ok) return NextResponse.json({ error: result.error }, { status: 400 });

  // Honeypot submissions receive the same response but are never persisted.
  if (result.value.honeypot) return NextResponse.json({ ok: true }, { status: 201 });

  try {
    await db.insert(feedbackSubmissions).values({
      id: randomUUID(),
      message: result.value.message,
      contactEmail: result.value.contactEmail,
    });
  } catch (error) {
    console.error('Unable to save feedback submission', error instanceof Error ? error.name : 'unknown');
    return NextResponse.json({ error: 'Chưa thể gửi góp ý. Bạn thử lại sau nhé.' }, { status: 503 });
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}
