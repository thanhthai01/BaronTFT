import type { Metadata } from 'next';
import { RoadmapView } from '@/components/features/roadmap/RoadmapView';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'Lộ trình học',
};

export default function RoadmapPage() {
  return (
    <>
      <header className={styles.header}>
        <div className="wide-container">
          <span className="kicker">Lộ trình học</span>
          <h1>Biết đọc lỗi trước, rồi mới chọn bài luyện đúng thứ tự</h1>
          <p>Bắt đầu từ bảng chẩn đoán triệu chứng trong trận, rồi đi theo lộ trình 9 tuần — mỗi tuần chỉ luyện một năng lực chính.</p>
        </div>
      </header>
      <section className={styles.body}>
        <div className="wide-container">
          <RoadmapView />
        </div>
      </section>
    </>
  );
}
