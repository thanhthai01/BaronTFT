export const MIN_FEEDBACK_MESSAGE_LENGTH = 10;
export const MAX_FEEDBACK_MESSAGE_LENGTH = 500;
export const MAX_FEEDBACK_CONTACT_LENGTH = 254;

export const feedbackStatuses = ['new', 'read', 'archived'] as const;
export type FeedbackStatus = (typeof feedbackStatuses)[number];

export type FeedbackSubmissionInput = {
  message: string;
  contactEmail: string | null;
  honeypot: string;
};

type ValidationResult =
  | { ok: true; value: FeedbackSubmissionInput }
  | { ok: false; error: string };

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateFeedbackSubmission(payload: unknown): ValidationResult {
  if (!payload || typeof payload !== 'object') {
    return { ok: false, error: 'Dữ liệu góp ý không hợp lệ.' };
  }

  const { message, contact, company } = payload as Record<string, unknown>;
  if (typeof message !== 'string') {
    return { ok: false, error: 'Nội dung góp ý không hợp lệ.' };
  }

  const trimmedMessage = message.trim();
  if (trimmedMessage.length < MIN_FEEDBACK_MESSAGE_LENGTH) {
    return { ok: false, error: `Viết thêm chút nữa nhé (tối thiểu ${MIN_FEEDBACK_MESSAGE_LENGTH} ký tự).` };
  }
  if (trimmedMessage.length > MAX_FEEDBACK_MESSAGE_LENGTH) {
    return { ok: false, error: `Nội dung đang dài hơn ${MAX_FEEDBACK_MESSAGE_LENGTH} ký tự, rút gọn giúp mình nhé.` };
  }

  if (contact !== undefined && typeof contact !== 'string') {
    return { ok: false, error: 'Email liên hệ không hợp lệ.' };
  }
  const trimmedContact = (contact ?? '').trim();
  if (trimmedContact.length > MAX_FEEDBACK_CONTACT_LENGTH || (trimmedContact && !EMAIL_PATTERN.test(trimmedContact))) {
    return { ok: false, error: 'Email liên hệ không hợp lệ.' };
  }

  return {
    ok: true,
    value: {
      message: trimmedMessage,
      contactEmail: trimmedContact || null,
      honeypot: typeof company === 'string' ? company.trim() : '',
    },
  };
}

export function isFeedbackStatus(value: unknown): value is FeedbackStatus {
  return typeof value === 'string' && feedbackStatuses.includes(value as FeedbackStatus);
}
