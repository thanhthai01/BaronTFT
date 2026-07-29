import type { Metadata } from 'next';
import { Callout } from '@/components/design-system/Callout/Callout';
import styles from '../content-pages.module.css';

export const metadata: Metadata = { title: 'Hệ thống cập nhật patch' };

const cards = ['Phiếu mùa 60 phút', 'Phiếu patch 30 phút', 'Đọc dữ liệu đúng', 'Bộ lọc sample size'];

export default function PatchPage() {
  return (
    <>
      <header className="page-header"><div className="wide-container"><span className="kicker">Patch system</span><h1>Cập nhật patch mà không học lại từ đầu</h1><p>Dữ liệu chỉ cho bạn biết nên đặt câu hỏi ở đâu. Nó không thay bạn ra quyết định trong lobby.</p></div></header>
      <section className="section"><div className="wide-container"><Callout title="Cảnh báo quan trọng" tone="warning"><p>Đừng đổi toàn bộ cách chơi chỉ vì một chỉ số win rate.</p></Callout><div className={styles.simpleGrid} style={{ marginTop: '1rem' }}>{cards.map((card) => <article className={styles.simpleCard} key={card}><h2>{card}</h2><p>Biến patch note và stat thành giả thuyết luyện tập, không thành niềm tin mù.</p></article>)}</div></div></section>
    </>
  );
}
