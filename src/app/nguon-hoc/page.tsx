import type { Metadata } from 'next';
import styles from '../content-pages.module.css';

export const metadata: Metadata = { title: 'Nguồn học' };

const resources = [
  ['Riot official', 'Đọc thay đổi hệ thống, item và trait bằng ngôn ngữ gốc.'],
  ['Tactics.tools', 'Kiểm tra average placement, pick rate, top-4 rate và sample size.'],
  ['TFT Academy', 'Lấy ý tưởng line, nhưng phải map lại theo kỹ năng của mình.'],
  ['LoLCHESS', 'Xem lobby/history để review hành vi, không chỉ xem comp cuối.'],
];

export default function ResourcesPage() {
  return (
    <>
      <header className="page-header"><div className="wide-container"><span className="kicker">Nguồn học</span><h1>Dùng dữ liệu để đặt câu hỏi tốt hơn</h1><p>Nguồn dữ liệu không thay bạn ra quyết định. Nó chỉ cho biết bạn nên đặt câu hỏi ở đâu.</p></div></header>
      <section className="section"><div className={[styles.simpleGrid, 'wide-container'].join(' ')}>{resources.map(([title, text]) => <article className={styles.simpleCard} key={title}><h2>{title}</h2><p>{text}</p></article>)}</div></section>
    </>
  );
}
