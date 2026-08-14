import { randomUUID } from 'node:crypto';
import { NextResponse } from 'next/server';
import { feedbackSubmissions } from '@/db/schema';
import { validateFeedbackSubmission } from '@/lib/feedback';
import { consumeFeedbackRateLimit, hasAllowedOrigin } from '@/lib/feedback-rate-limit';

export async function POST(request: Request) {
  if (!hasAllowedOrigin(request)) {
    return NextResponse.json({ error: 'Nguồn gửi không hợp lệ.' }, { status: 403 });
  }
  if (Number(request.headers.get('content-length')) > 4_096) {
    return NextResponse.json({ error: 'Nội dung gửi quá lớn.' }, { status: 413 });
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: 'Dữ liệu góp ý không hợp lệ.' }, { status: 400 });
  }

  const result = validateFeedbackSubmission(payload);
  if (!result.ok) return NextResponse.json({ error: result.error }, { status: 400 });

  // Honeypot submissions receive the same response but are never persisted.
  if (result.value.honeypot) return NextResponse.json({ ok: true }, { status: 201 });

  try {
    const { db } = await import('@/db/client');
    const rateLimit = await consumeFeedbackRateLimit(db, request, 'submit', 5);
    if (!rateLimit.allowed) {
      return NextResponse.json({ error: rateLimit.reason ?? 'Bạn đã gửi quá nhiều góp ý. Thử lại sau 15 phút nhé.' }, {
        status: rateLimit.reason ? 503 : 429,
        headers: rateLimit.reason ? undefined : { 'Retry-After': '900' },
      });
    }
    await db.insert(feedbackSubmissions).values({
      id: randomUUID(),
      message: result.value.message,
      contactEmail: result.value.contactEmail,
    });
  } catch (error) {
    console.error('Unable to save feedback submission', error);
    return NextResponse.json({ error: 'Chưa thể gửi góp ý. Bạn thử lại sau nhé.' }, { status: 503 });
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}
