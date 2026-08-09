import type { Metadata } from 'next';
import { Suspense } from 'react';
import { ChecklistApp } from '@/components/features/checklist/ChecklistApp';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'Checklist trong trận',
  description: 'Checklist ngắn dùng ngay trong trận TFT: lobby, từng stage, late game và sau trận — câu hỏi thực chiến, không lý thuyết dài dòng.',
  alternates: { canonical: '/checklist' },
};

export default function ChecklistPage() {
  return (
    <section aria-labelledby="checklist-title" className={styles.page}>
      <div className={[styles.inner, 'wide-container'].join(' ')}>
        <header className={styles.intro}>
          <div className={styles.titleBlock}>
            <span className="kicker">Dùng khi đang chơi</span>
            <h1 id="checklist-title">Checklist trong trận</h1>
          </div>
          <p>Font lớn, câu hỏi ngắn, local state. Mở trên điện thoại hoặc màn hình phụ và chỉ tick những quyết định thật sự đổi trận.</p>
        </header>
        <Suspense fallback={null}>
          <ChecklistApp />
        </Suspense>
      </div>
    </section>
  );
}
