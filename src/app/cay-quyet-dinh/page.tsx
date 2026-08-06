import type { Metadata } from 'next';
import { DecisionMindmap } from '@/components/features/decision-mindmap/DecisionMindmap';
import styles from './page.module.css';

export const metadata: Metadata = { title: 'Cây quyết định' };

export default function DecisionTreesPage() {
  return (
    <>
      <header className={styles.header}>
        <div className="wide-container">
          <span className="kicker">Decision trees</span>
          <h1>Cây quyết định theo trạng thái trận</h1>
          <p>Xem toàn bộ cây dạng mindmap, chọn một nhánh để zoom vào và đọc chi tiết. Mỗi node kết thúc bằng một hành động cụ thể: lên cấp, roll, giữ vàng, pivot, scout hoặc đổi vị trí.</p>
        </div>
      </header>
      <section aria-label="Mindmap cây quyết định" className={styles.mapSection}>
        <div className="wide-container">
          <DecisionMindmap />
        </div>
      </section>
    </>
  );
}
