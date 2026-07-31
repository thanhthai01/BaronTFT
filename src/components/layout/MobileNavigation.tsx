'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { isNavigationRouteActive } from '@/lib/navigation';
import { useCommandPalette } from '../features/command-palette/CommandPaletteProvider';
import styles from './MobileNavigation.module.css';

const links = [
  { href: '/kien-thuc-nen-tang', label: 'Học' },
  { href: '/checklist', label: 'Checklist' },
];

export function MobileNavigation() {
  const pathname = usePathname();
  const { openPalette } = useCommandPalette();

  return (
    <nav aria-label="Điều hướng nhanh trên điện thoại" className={styles.nav}>
      {links.map((link) => {
        const isActive = isNavigationRouteActive(pathname, link.href);

        return (
          <Link aria-current={isActive ? 'page' : undefined} className={styles.item} href={link.href} key={link.href}>
            {link.label}
          </Link>
        );
      })}
      <button className={styles.item} type="button" onClick={openPalette}>Tìm</button>
    </nav>
  );
}
