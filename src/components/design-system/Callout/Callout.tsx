import type { ReactNode } from 'react';
import styles from './Callout.module.css';

export function Callout({
  title,
  children,
  tone = 'note',
}: {
  title: string;
  children: ReactNode;
  tone?: 'note' | 'tip' | 'warning' | 'danger';
}) {
  return (
    <aside className={[styles.callout, styles[tone]].join(' ')}>
      <h2 className={styles.title}>{title}</h2>
      <div className={styles.body}>{children}</div>
    </aside>
  );
}
