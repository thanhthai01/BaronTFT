'use client';

import { useState } from 'react';
import type { FeedbackStatus } from '@/lib/feedback';
import styles from './FeedbackInbox.module.css';

export type FeedbackInboxItem = {
  id: string;
  message: string;
  contactEmail: string | null;
  status: FeedbackStatus;
  submittedAt: string;
};

const statusLabels: Record<FeedbackStatus, string> = {
  new: 'Chưa đọc',
  read: 'Đã đọc',
  archived: 'Đã lưu trữ',
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat('vi-VN', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value));
}

export function FeedbackInbox({ initialItems }: { initialItems: FeedbackInboxItem[] }) {
  const [items, setItems] = useState(initialItems);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [error, setError] = useState('');

  async function updateStatus(id: string, status: FeedbackStatus) {
    setUpdatingId(id);
    setError('');
    try {
      const response = await fetch('/api/quan-ly/gop-y', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      });
      const result = await response.json().catch(() => null) as { error?: string } | null;
      if (!response.ok) throw new Error(result?.error ?? 'Chưa thể cập nhật góp ý.');
      setItems((current) => current.map((item) => item.id === id ? { ...item, status } : item));
    } catch (updateError) {
      setError(updateError instanceof Error ? updateError.message : 'Chưa thể cập nhật góp ý.');
    } finally {
      setUpdatingId(null);
    }
  }

  return (
    <section aria-label="Hộp thư góp ý" className={styles.inbox}>
      <p aria-live="polite" className={styles.error}>{error}</p>
      {items.length === 0 ? (
        <p className={styles.empty}>Chưa có góp ý nào.</p>
      ) : (
        <ul className={styles.list}>
          {items.map((item) => (
            <li className={styles.item} key={item.id}>
              <div className={styles.meta}>
                <span className={`${styles.status} ${styles[item.status]}`}>{statusLabels[item.status]}</span>
                <time dateTime={item.submittedAt}>{formatDate(item.submittedAt)}</time>
              </div>
              <p className={styles.message}>{item.message}</p>
              {item.contactEmail && <a className={styles.contact} href={`mailto:${item.contactEmail}`}>{item.contactEmail}</a>}
              <div className={styles.actions}>
                {item.status !== 'read' && <button disabled={updatingId === item.id} onClick={() => updateStatus(item.id, 'read')} type="button">Đánh dấu đã đọc</button>}
                {item.status !== 'new' && <button disabled={updatingId === item.id} onClick={() => updateStatus(item.id, 'new')} type="button">Đánh dấu chưa đọc</button>}
                {item.status !== 'archived' && <button disabled={updatingId === item.id} onClick={() => updateStatus(item.id, 'archived')} type="button">Lưu trữ</button>}
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
