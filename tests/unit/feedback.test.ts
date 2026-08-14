import { describe, expect, it } from 'vitest';
import { isFeedbackStatus, validateFeedbackSubmission } from '../../src/lib/feedback';

describe('feedback validation', () => {
  it('trims and accepts a valid submission', () => {
    expect(validateFeedbackSubmission({ message: '  Góp ý rất hữu ích.  ', contact: ' test@example.com ', company: '' })).toEqual({
      ok: true,
      value: { message: 'Góp ý rất hữu ích.', contactEmail: 'test@example.com', honeypot: '' },
    });
  });

  it('rejects short messages and malformed contact emails', () => {
    expect(validateFeedbackSubmission({ message: 'ngắn', contact: '' })).toMatchObject({ ok: false });
    expect(validateFeedbackSubmission({ message: 'Góp ý này đủ dài.', contact: 'khong-phai-email' })).toMatchObject({ ok: false });
    expect(validateFeedbackSubmission({ message: 'Góp ý này đủ dài.', contact: 'test@example.com?subject=Injected' })).toMatchObject({ ok: false });
  });

  it('recognizes only supported inbox statuses', () => {
    expect(isFeedbackStatus('new')).toBe(true);
    expect(isFeedbackStatus('read')).toBe(true);
    expect(isFeedbackStatus('deleted')).toBe(false);
  });
});
