import type { Metadata } from 'next';
import { Suspense } from 'react';
import { Set18Codex } from '@/components/features/season-18/Set18Codex';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'Mùa 18',
};

export default function Season18Page() {
  return (
    <section aria-label="Nội dung Mùa 18" className={styles.readerSection}>
      <Suspense fallback={null}>
        <Set18Codex />
      </Suspense>
    </section>
  );
}
