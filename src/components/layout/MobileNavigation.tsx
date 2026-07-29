'use client';

import Link from 'next/link';
import { useCommandPalette } from '../features/command-palette/CommandPaletteProvider';
import styles from './MobileNavigation.module.css';

export function MobileNavigation() {
  const { openPalette } = useCommandPalette();

  return (
    <nav aria-label="Điều hướng nhanh trên điện thoại" className={styles.nav}>
      <Link className={styles.item} href="/kien-thuc-nen-tang">Học</Link>
      <Link className={styles.item} href="/checklist">Checklist</Link>
      <Link className={styles.item} href="/review">Review</Link>
      <button className={styles.item} type="button" onClick={openPalette}>Tìm</button>
    </nav>
  );
}
