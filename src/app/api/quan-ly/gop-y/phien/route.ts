import { timingSafeEqual } from 'node:crypto';
import { NextResponse } from 'next/server';
import {
  createFeedbackAdminSession,
  FEEDBACK_ADMIN_COOKIE,
  FEEDBACK_ADMIN_SESSION_MAX_AGE,
  hasFeedbackAdminToken,
} from '@/lib/feedback-admin-auth';
import { consumeFeedbackRateLimit, hasAllowedOrigin } from '@/lib/feedback-rate-limit';

function suppliedTokenMatches(value: unknown) {
  const expected = process.env.FEEDBACK_ADMIN_TOKEN;
  if (!expected || typeof value !== 'string') return false;

  const received = Buffer.from(value);
  const configured = Buffer.from(expected);
  return received.length === configured.length && timingSafeEqual(received, configured);
}

export async function POST(request: Request) {
  if (!hasAllowedOrigin(request)) {
    return NextResponse.json({ error: 'Nguồn gửi không hợp lệ.' }, { status: 403 });
  }
  if (Number(request.headers.get('content-length')) > 1_024) {
    return NextResponse.json({ error: 'Dữ liệu gửi quá lớn.' }, { status: 413 });
  }
  if (!hasFeedbackAdminToken()) {
    return NextResponse.json({ error: 'Chưa cấu hình FEEDBACK_ADMIN_TOKEN.' }, { status: 503 });
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: 'Mật khẩu không hợp lệ.' }, { status: 400 });
  }

  const { db } = await import('@/db/client');
  const rateLimit = await consumeFeedbackRateLimit(db, request, 'admin-login', 5);
  if (!rateLimit.allowed) {
    return NextResponse.json({ error: rateLimit.reason ?? 'Bạn đã thử đăng nhập quá nhiều lần. Thử lại sau 15 phút nhé.' }, {
      status: rateLimit.reason ? 503 : 429,
      headers: rateLimit.reason ? undefined : { 'Retry-After': '900' },
    });
  }

  const token = payload && typeof payload === 'object' ? (payload as { token?: unknown }).token : undefined;
  if (!suppliedTokenMatches(token)) {
    return NextResponse.json({ error: 'Mật khẩu không đúng.' }, { status: 401 });
  }

  const session = createFeedbackAdminSession();
  if (!session) return NextResponse.json({ error: 'Chưa cấu hình FEEDBACK_ADMIN_TOKEN.' }, { status: 503 });

  const response = NextResponse.json({ ok: true });
  response.cookies.set(FEEDBACK_ADMIN_COOKIE, session, {
    httpOnly: true,
    maxAge: FEEDBACK_ADMIN_SESSION_MAX_AGE,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
  });
  return response;
}

export function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set(FEEDBACK_ADMIN_COOKIE, '', { httpOnly: true, maxAge: 0, path: '/' });
  return response;
}
