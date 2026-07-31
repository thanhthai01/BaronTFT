'use client';

import { useRef, useState, type FormEvent } from 'react';
import styles from './FeedbackForm.module.css';

const CONTACT_EMAIL = 'barontft.starguardianbaron00@gmail.com';
const MIN_FILL_MS = 3000;
const MIN_MESSAGE_LENGTH = 10;
// Kept short deliberately: encodeURIComponent expands Vietnamese diacritics to
// multi-byte %XX sequences, and mailto: URLs still hit ~2000-char limits on
// several mail-client handlers — a long message can silently fail to open.
const MAX_MESSAGE_LENGTH = 500;

type Status = { tone: 'idle' | 'success' | 'error'; text: string };

export function FeedbackForm() {
  const [message, setMessage] = useState('');
  const [contact, setContact] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [status, setStatus] = useState<Status>({ tone: 'idle', text: '' });
  const mountedAt = useRef(Date.now());

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    // Bot trap: real users never see or fill this field. Report a fake success
    // instead of an error so scripts don't learn to route around the check.
    if (honeypot.trim().length > 0) {
      setStatus({ tone: 'success', text: 'Đã gửi. Cảm ơn bạn!' });
      return;
    }

    if (Date.now() - mountedAt.current < MIN_FILL_MS) {
      setStatus({ tone: 'error', text: 'Bạn thao tác hơi nhanh, thử lại sau vài giây nhé.' });
      return;
    }

    const trimmedMessage = message.trim();
    if (trimmedMessage.length < MIN_MESSAGE_LENGTH) {
      setStatus({ tone: 'error', text: `Viết thêm chút nữa nhé (tối thiểu ${MIN_MESSAGE_LENGTH} ký tự).` });
      return;
    }
    if (trimmedMessage.length > MAX_MESSAGE_LENGTH) {
      setStatus({ tone: 'error', text: `Nội dung đang dài hơn ${MAX_MESSAGE_LENGTH} ký tự, rút gọn giúp mình nhé.` });
      return;
    }

    const trimmedContact = contact.trim();
    // trimmedContact only ever goes into the mail body text, never into a
    // mailto query param (to/cc/bcc) — keeps user input from being able to
    // add extra recipients via the URL.
    const bodyLines = [trimmedMessage, trimmedContact ? `\nLiên hệ lại: ${trimmedContact}` : ''];
    const mailtoUrl = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent('Đóng góp ý kiến — Baron TFT')}&body=${encodeURIComponent(bodyLines.join('\n'))}`;

    window.location.href = mailtoUrl;
    setStatus({ tone: 'success', text: 'Đã mở ứng dụng mail — bấm gửi ở đó để hoàn tất.' });
  }

  return (
    <form className={styles.form} noValidate onSubmit={handleSubmit}>
      <div className={styles.field}>
        <label htmlFor="feedback-message">Nội dung góp ý</label>
        <textarea
          id="feedback-message"
          maxLength={MAX_MESSAGE_LENGTH}
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

      <button className={styles.submit} type="submit">Gửi góp ý qua email</button>
      <p aria-live="polite" className={[styles.status, status.tone !== 'idle' ? styles[status.tone] : ''].filter(Boolean).join(' ')}>
        {status.text}
      </p>
    </form>
  );
}
