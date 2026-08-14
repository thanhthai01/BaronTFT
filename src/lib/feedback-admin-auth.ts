import { createHmac, timingSafeEqual } from 'node:crypto';

export const FEEDBACK_ADMIN_COOKIE = 'baron_feedback_admin';
export const FEEDBACK_ADMIN_SESSION_MAX_AGE = 60 * 60 * 24 * 14;

function adminToken() {
  return process.env.FEEDBACK_ADMIN_TOKEN;
}

function signature(expiresAt: number, token: string) {
  return createHmac('sha256', token).update(`feedback-admin:${expiresAt}`).digest('base64url');
}

export function hasFeedbackAdminToken() {
  return Boolean(adminToken());
}

export function createFeedbackAdminSession() {
  const token = adminToken();
  if (!token) return null;

  const expiresAt = Date.now() + FEEDBACK_ADMIN_SESSION_MAX_AGE * 1000;
  return `${expiresAt}.${signature(expiresAt, token)}`;
}

export function isFeedbackAdminSession(value: string | undefined) {
  const token = adminToken();
  if (!token || !value) return false;

  const [expiresAtText, receivedSignature] = value.split('.');
  const expiresAt = Number(expiresAtText);
  if (!Number.isSafeInteger(expiresAt) || expiresAt <= Date.now() || !receivedSignature) return false;

  const expectedSignature = signature(expiresAt, token);
  const received = Buffer.from(receivedSignature);
  const expected = Buffer.from(expectedSignature);
  return received.length === expected.length && timingSafeEqual(received, expected);
}
