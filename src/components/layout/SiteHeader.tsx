'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { isNavigationRouteActive } from '@/lib/navigation';
import { useCommandPalette } from '../features/command-palette/CommandPaletteProvider';
import { Button } from '../design-system/Button/Button';
import styles from './SiteHeader.module.css';

const links = [
  { href: '/kien-thuc-nen-tang', label: 'Kiến thức nền tảng' },
  { href: '/checklist', label: 'Checklist' },
  { href: '/review', label: 'Review' },
  { href: '/bieu-mau', label: 'Biểu mẫu' },
  { href: '/patch', label: 'Patch' },
  { href: '/nguon-hoc', label: 'Nguồn học' },
];

export function SiteHeader() {
  const pathname = usePathname();
  const { openPalette } = useCommandPalette();

  return (
    <header className={styles.header}>
      <div className={[styles.inner, 'wide-container'].join(' ')}>
        <Link className={styles.brand} href="/" aria-label="Baron TFT home">
          <span className={styles.mark}>◆</span>
          BARON <em>TFT</em>
        </Link>
        <nav aria-label="Điều hướng chính" className={styles.nav}>
          {links.map((link) => {
            const isActive = isNavigationRouteActive(pathname, link.href);

            return (
              <Link aria-current={isActive ? 'page' : undefined} className={styles.link} href={link.href} key={link.href}>
                {link.label}
              </Link>
            );
          })}
        </nav>
        <div className={styles.actions}>
          <button className={styles.searchButton} type="button" onClick={openPalette}>
            Ctrl K / Tìm
          </button>
          <Button href="/checklist" size="sm" variant="primary">
            Mở checklist
          </Button>
        </div>
      </div>
    </header>
  );
}
