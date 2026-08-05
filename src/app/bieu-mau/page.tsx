import type { Metadata } from 'next';
import { PracticeFormsView } from '@/components/features/practice-forms/PracticeFormsView';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'Biểu mẫu luyện tập',
};

export default function PracticeFormsPage() {
  return (
    <>
      <header className={styles.header}>
        <div className="wide-container">
          <span className="kicker">Biểu mẫu luyện tập</span>
          <h1>Mở bên cạnh khi chơi, điền tay sau mỗi trận</h1>
          <p>7 biểu mẫu để ghi lại phiên chơi, trận đấu, board strength, rolldown, patch và review 20 trận — cộng bộ 10 câu hỏi review sâu.</p>
        </div>
      </header>
      <section className={styles.body}>
        <div className="wide-container">
          <PracticeFormsView />
        </div>
      </section>
    </>
  );
}
