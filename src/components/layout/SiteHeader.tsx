'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { isNavigationRouteActive } from '@/lib/navigation';
import { useCommandPalette } from '../features/command-palette/CommandPaletteProvider';
import { Button } from '../design-system/Button/Button';
import styles from './SiteHeader.module.css';

/** Thanh tiến độ đọc trang — nằm sát mép dưới navbar (header dùng position:
 * sticky nên đã là containing block cho .progressTrack absolute), dài theo
 * % đã cuộn qua toàn trang. Đo bằng scrollY / (scrollHeight - viewport) thay
 * vì IntersectionObserver vì cần áp dụng chung cho mọi trang, không riêng gì
 * các trang có nội dung "đọc" dài (docs, review...). */
function ReadingProgressBar() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const updateProgress = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      const pct = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
      setProgress(Math.min(100, Math.max(0, pct)));
    };

    updateProgress();
    window.addEventListener('scroll', updateProgress, { passive: true });
    window.addEventListener('resize', updateProgress);
    return () => {
      window.removeEventListener('scroll', updateProgress);
      window.removeEventListener('resize', updateProgress);
    };
  }, []);

  return (
    <div aria-hidden="true" className={styles.progressTrack}>
      <div className={styles.progressFill} style={{ width: `${progress}%` }} />
    </div>
  );
}

const links = [
  { href: '/kien-thuc-nen-tang', label: 'Kiến thức nền tảng' },
  { href: '/mua-18', label: 'Mùa 18' },
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
          <button aria-label="Mở tìm kiếm nhanh" className={styles.searchButton} type="button" onClick={openPalette}>
            <span className={styles.searchShortcut}>Ctrl K / </span>
            Tìm
          </button>
          <span className={styles.checklistAction}>
            <Button href="/checklist" size="sm" variant="primary">
              Mở checklist
            </Button>
          </span>
        </div>
      </div>
      <ReadingProgressBar />
    </header>
  );
}
