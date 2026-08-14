import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { feedbackSubmissions } from '@/db/schema';
import { FEEDBACK_ADMIN_COOKIE, isFeedbackAdminSession } from '@/lib/feedback-admin-auth';
import { isFeedbackStatus } from '@/lib/feedback';
import { hasAllowedOrigin } from '@/lib/feedback-rate-limit';
import { readJsonWithLimit } from '@/lib/request-security';

const MAX_ADMIN_MUTATION_BODY_BYTES = 1_024;

export async function PATCH(request: Request) {
  if (!hasAllowedOrigin(request)) {
    return NextResponse.json({ error: 'Nguồn gửi không hợp lệ.' }, { status: 403 });
  }

  const cookieStore = await cookies();
  if (!isFeedbackAdminSession(cookieStore.get(FEEDBACK_ADMIN_COOKIE)?.value)) {
    return NextResponse.json({ error: 'Không có quyền truy cập.' }, { status: 401 });
  }

  const payload = await readJsonWithLimit(request, MAX_ADMIN_MUTATION_BODY_BYTES);
  if (!payload.ok) return NextResponse.json({ error: payload.error }, { status: payload.status });

  if (!payload.value || typeof payload.value !== 'object') {
    return NextResponse.json({ error: 'Dữ liệu không hợp lệ.' }, { status: 400 });
  }
  const { id, status } = payload.value as Record<string, unknown>;
  if (typeof id !== 'string' || !isFeedbackStatus(status)) {
    return NextResponse.json({ error: 'Dữ liệu không hợp lệ.' }, { status: 400 });
  }

  const { db } = await import('@/db/client');
  const [updated] = await db
    .update(feedbackSubmissions)
    .set({
      status,
      readAt: status === 'new' ? null : new Date(),
      updatedAt: new Date(),
    })
    .where(eq(feedbackSubmissions.id, id))
    .returning({ id: feedbackSubmissions.id, status: feedbackSubmissions.status });

  if (!updated) return NextResponse.json({ error: 'Không tìm thấy góp ý.' }, { status: 404 });
  return NextResponse.json({ ok: true, feedback: updated });
}
