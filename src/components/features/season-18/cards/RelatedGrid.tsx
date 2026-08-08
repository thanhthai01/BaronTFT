import type { ReactNode } from 'react';
import styles from './EntityDetailShell.module.css';

export function RelatedGrid({ variant, children }: { variant?: 'wisp' | 'augment'; children: ReactNode }) {
  const variantClass = variant === 'wisp' ? styles.relatedGridWisp : variant === 'augment' ? styles.relatedGridAugment : '';
  return <div className={`${styles.relatedGrid} ${variantClass}`}>{children}</div>;
}
