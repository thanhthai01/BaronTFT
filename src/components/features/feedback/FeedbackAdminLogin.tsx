'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import styles from './FeedbackAdminLogin.module.css';

export function FeedbackAdminLogin() {
  const router = useRouter();
  const [token, setToken] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/quan-ly/gop-y/phien', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });
      const result = await response.json().catch(() => null) as { error?: string } | null;
      if (!response.ok) throw new Error(result?.error ?? 'Không thể đăng nhập.');
      router.replace('/quan-ly/gop-y');
      router.refresh();
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : 'Không thể đăng nhập.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <label htmlFor="feedback-admin-token">Mật khẩu quản trị</label>
      <input autoComplete="current-password" id="feedback-admin-token" onChange={(event) => setToken(event.target.value)} required type="password" value={token} />
      <button disabled={isSubmitting} type="submit">{isSubmitting ? 'Đang mở...' : 'Mở hộp thư'}</button>
      <p aria-live="polite" className={styles.error}>{error}</p>
    </form>
  );
}
