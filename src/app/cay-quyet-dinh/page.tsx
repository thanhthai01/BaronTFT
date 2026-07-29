import type { Metadata } from 'next';
import { Button } from '@/components/design-system/Button/Button';
import styles from '../content-pages.module.css';

export const metadata: Metadata = { title: 'Cây quyết định' };

const trees = ['Khi nào lên cấp', 'Khi nào roll', 'Khi nào pivot', 'Khi nào slam đồ', 'Top 1 / top 4 / cứu top 6', 'Khi nào scout'];

export default function DecisionTreesPage() {
  return (
    <>
      <header className="page-header"><div className="wide-container"><span className="kicker">Decision trees</span><h1>Cây quyết định theo trạng thái trận</h1><p>Mỗi node phải kết thúc bằng một hành động cụ thể: lên cấp, roll, giữ vàng, pivot, scout hoặc đổi vị trí.</p></div></header>
      <section className="section"><div className={[styles.simpleGrid, 'wide-container'].join(' ')}>{trees.map((tree) => <article className={styles.simpleCard} key={tree}><h2>{tree}</h2><p>Trả lời yes/no theo HP, vàng, board strength và lobby.</p><Button href="/checklist" variant="secondary">Mở checklist liên quan</Button></article>)}</div></section>
    </>
  );
}
