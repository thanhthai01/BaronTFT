import type { Metadata } from 'next';
import { PatchBoard } from '@/components/features/patch/PatchBoard';
import styles from './page.module.css';

export const metadata: Metadata = { title: 'Patch' };

export default function PatchPage() {
  return (
    <>
      <header className={styles.header}>
        <div className="wide-container">
          <h1>Patch</h1>
          <p>Xem đầy đủ thay đổi của bản cập nhật trước, sau đó đọc phần phân tích chi tiết ở bên dưới.</p>
        </div>
      </header>
      <section className="section">
        <div className="wide-container">
          <PatchBoard />
        </div>
      </section>
    </>
  );
}
