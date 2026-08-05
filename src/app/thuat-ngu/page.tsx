import type { Metadata } from 'next';
import { glossaryTerms } from '@/content/glossary.generated';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'Thuật ngữ',
};

export default function GlossaryPage() {
  return (
    <>
      <header className={styles.header}>
        <div className="wide-container">
          <span className="kicker">Thuật ngữ</span>
          <h1>Thuật ngữ dùng trong giáo trình evergreen</h1>
          <p>{glossaryTerms.length} thuật ngữ, sắp theo bảng chữ cái. Dùng Ctrl+F để tìm nhanh.</p>
        </div>
      </header>
      <section className={styles.body}>
        <div className="wide-container">
          <dl className={styles.list}>
            {glossaryTerms.map((entry) => (
              <div className={styles.entry} key={entry.term}>
                <dt className={styles.term}>{entry.term}</dt>
                <dd className={styles.definition}>{entry.definition}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>
    </>
  );
}
