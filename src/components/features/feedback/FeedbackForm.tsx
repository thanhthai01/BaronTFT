'use client';

import { useRef, useState, type FormEvent } from 'react';
import { MAX_FEEDBACK_MESSAGE_LENGTH, MIN_FEEDBACK_MESSAGE_LENGTH } from '@/lib/feedback';
import styles from './FeedbackForm.module.css';

const MIN_FILL_MS = 3000;

type Status = { tone: 'idle' | 'success' | 'error'; text: string };

export function FeedbackForm() {
  const [message, setMessage] = useState('');
  const [contact, setContact] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<Status>({ tone: 'idle', text: '' });
  const mountedAt = useRef(Date.now());

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    // Bot trap: real users never see or fill this field. Report a fake success
    // instead of an error so scripts don't learn to route around the check.
    if (Date.now() - mountedAt.current < MIN_FILL_MS) {
      setStatus({ tone: 'error', text: 'Bạn thao tác hơi nhanh, thử lại sau vài giây nhé.' });
      return;
    }

    const trimmedMessage = message.trim();
    if (trimmedMessage.length < MIN_FEEDBACK_MESSAGE_LENGTH) {
      setStatus({ tone: 'error', text: `Viết thêm chút nữa nhé (tối thiểu ${MIN_FEEDBACK_MESSAGE_LENGTH} ký tự).` });
      return;
    }
    if (trimmedMessage.length > MAX_FEEDBACK_MESSAGE_LENGTH) {
      setStatus({ tone: 'error', text: `Nội dung đang dài hơn ${MAX_FEEDBACK_MESSAGE_LENGTH} ký tự, rút gọn giúp mình nhé.` });
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: trimmedMessage, contact: contact.trim(), company: honeypot }),
      });
      const result = await response.json().catch(() => null) as { error?: string } | null;
      if (!response.ok) throw new Error(result?.error ?? 'Chưa thể gửi góp ý. Bạn thử lại sau nhé.');

      setMessage('');
      setContact('');
      setHoneypot('');
      setStatus({ tone: 'success', text: 'Đã lưu góp ý. Cảm ơn bạn!' });
    } catch (error) {
      setStatus({ tone: 'error', text: error instanceof Error ? error.message : 'Chưa thể gửi góp ý. Bạn thử lại sau nhé.' });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className={styles.form} noValidate onSubmit={handleSubmit}>
      <div className={styles.field}>
        <label htmlFor="feedback-message">Nội dung góp ý</label>
        <textarea
          id="feedback-message"
          maxLength={MAX_FEEDBACK_MESSAGE_LENGTH}
          placeholder="Ví dụ: dữ liệu tướng ở Mùa 18 bị sai giá, hoặc checklist thiếu một câu hỏi..."
          value={message}
          onChange={(event) => setMessage(event.target.value)}
        />
      </div>

      <div className={styles.field}>
        <label htmlFor="feedback-contact">Email để mình phản hồi lại (không bắt buộc)</label>
        <input
          autoComplete="email"
          id="feedback-contact"
          type="email"
          value={contact}
          onChange={(event) => setContact(event.target.value)}
        />
      </div>

      <div aria-hidden="true" className={styles.honeypot}>
        <label htmlFor="feedback-company">Company</label>
        <input
          autoComplete="off"
          id="feedback-company"
          tabIndex={-1}
          value={honeypot}
          onChange={(event) => setHoneypot(event.target.value)}
        />
      </div>

       <button className={styles.submit} disabled={isSubmitting} type="submit">{isSubmitting ? 'Đang gửi...' : 'Gửi góp ý'}</button>
      <p aria-live="polite" className={[styles.status, status.tone !== 'idle' ? styles[status.tone] : ''].filter(Boolean).join(' ')}>
        {status.text}
      </p>
    </form>
  );
}
