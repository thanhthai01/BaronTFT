import { timingSafeEqual } from 'node:crypto';
import { NextResponse } from 'next/server';
import {
  createFeedbackAdminSession,
  FEEDBACK_ADMIN_COOKIE,
  FEEDBACK_ADMIN_SESSION_MAX_AGE,
  hasFeedbackAdminToken,
} from '@/lib/feedback-admin-auth';
import { consumeFeedbackRateLimit, hasAllowedOrigin } from '@/lib/feedback-rate-limit';
import { readJsonWithLimit } from '@/lib/request-security';

const MAX_ADMIN_LOGIN_BODY_BYTES = 1_024;

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
  if (!hasFeedbackAdminToken()) {
    return NextResponse.json({ error: 'Chưa cấu hình FEEDBACK_ADMIN_TOKEN.' }, { status: 503 });
  }

  const { db } = await import('@/db/client');
  try {
    const rateLimit = await consumeFeedbackRateLimit(db, request, 'admin-login', 5);
    if (!rateLimit.allowed) {
      return NextResponse.json({ error: rateLimit.reason ?? 'Bạn đã thử đăng nhập quá nhiều lần. Thử lại sau 15 phút nhé.' }, {
        status: rateLimit.reason ? 503 : 429,
        headers: rateLimit.reason ? undefined : { 'Retry-After': '900' },
      });
    }
  } catch (error) {
    console.error('Unable to check feedback admin rate limit', error instanceof Error ? error.name : 'unknown');
    return NextResponse.json({ error: 'Không thể đăng nhập lúc này.' }, { status: 503 });
  }

  const payload = await readJsonWithLimit(request, MAX_ADMIN_LOGIN_BODY_BYTES);
  if (!payload.ok) return NextResponse.json({ error: payload.error }, { status: payload.status });

  const token = payload.value && typeof payload.value === 'object' ? (payload.value as { token?: unknown }).token : undefined;
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

export function DELETE(request: Request) {
  if (!hasAllowedOrigin(request)) {
    return NextResponse.json({ error: 'Nguồn gửi không hợp lệ.' }, { status: 403 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(FEEDBACK_ADMIN_COOKIE, '', { httpOnly: true, maxAge: 0, path: '/' });
  return response;
}
