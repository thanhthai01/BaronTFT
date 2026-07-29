import type { Metadata } from 'next';
import styles from '../content-pages.module.css';

export const metadata: Metadata = { title: 'Biểu mẫu luyện tập' };

const templates = ['Phiếu trước phiên', 'Phiếu một trận 60 giây', 'Phiếu board strength', 'Phiếu trước rolldown', 'Phiếu patch', 'Phiếu 20 trận', 'Bộ câu hỏi review sâu'];

export default function TemplatesPage() {
  return (
    <>
      <header className="page-header"><div className="wide-container"><span className="kicker">Practice templates</span><h1>Biểu mẫu luyện tập</h1><p>Chuyển ghi chú sau trận thành hành động cụ thể trong trận tiếp theo.</p></div></header>
      <section className="section"><div className={[styles.simpleGrid, 'wide-container'].join(' ')}>{templates.map((template) => <article className={styles.simpleCard} key={template}><h2>{template}</h2><p>Form nhanh, copy được Markdown và lưu local cho MVP.</p></article>)}</div></section>
    </>
  );
}
