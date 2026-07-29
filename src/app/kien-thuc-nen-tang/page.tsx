import type { Metadata } from 'next';
import { KnowledgeReader } from '@/components/features/knowledge-reader/KnowledgeReader';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'Kiến thức nền tảng',
};

export default function FoundationalKnowledgePage() {
  return (
    <>
      <header className={styles.header}>
        <div className="wide-container">
          <span className="kicker">Kiến thức nền tảng</span>
          <h1>Đọc đúng kỹ năng, áp dụng ngay trong trận</h1>
          <p>Gộp lộ trình và bài học thành một phòng đọc: chọn chủ đề bên trái, nội dung ở giữa đổi theo bài, panel bên phải nhắc cách áp dụng.</p>
        </div>
      </header>
      <section className={styles.readerSection} aria-label="Nội dung kiến thức nền tảng">
        <div className="wide-container">
          <KnowledgeReader />
        </div>
      </section>
    </>
  );
}
