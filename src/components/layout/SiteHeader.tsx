'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { isNavigationRouteActive } from '@/lib/navigation';
import { useCommandPalette } from '../features/command-palette/CommandPaletteProvider';
import { Button } from '../design-system/Button/Button';
import styles from './SiteHeader.module.css';

const PROGRESS_KEYFRAMES: Keyframe[] = [{ transform: 'scaleX(0)' }, { transform: 'scaleX(1)' }];

/** Thang thời gian ảo cho nhánh fallback: chỉ dùng để quy đổi % cuộn sang
 *  currentTime, không phải thời lượng thật vì animation luôn ở trạng thái pause. */
const FALLBACK_TIMELINE_MS = 1000;

/** Thanh tiến độ đọc trang — nằm sát mép dưới navbar (header dùng position:
 * sticky nên đã là containing block cho .progressTrack absolute), dài theo
 * % đã cuộn qua toàn trang. Tính trên toàn tài liệu thay vì IntersectionObserver
 * vì cần áp dụng chung cho mọi trang, không riêng gì các trang có nội dung
 * "đọc" dài (docs, review...).
 *
 * Chạy bằng Web Animations API trên transform (không phải width) để tránh
 * layout mỗi frame, và không giữ state React nào — nếu không sẽ re-render cả
 * header mỗi frame khi user cuộn. Hai nhánh drive cùng một keyframe:
 *  - ScrollTimeline: trình duyệt tự tua theo scroll, 0 công việc trên main thread.
 *  - Fallback (Safari < 26, Firefox cũ): tự set currentTime, gộp về 1 lần ghi/frame.
 *
 * Lưu ý: animation tạo bằng script không chịu ảnh hưởng của block
 * prefers-reduced-motion trong globals.css — và ở đây là đúng ý, vì thanh này
 * bám 1:1 theo thao tác cuộn của user chứ không phải chuyển động tự thân. */
function ReadingProgressBar() {
  const fillRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fill = fillRef.current;
    if (!fill || typeof fill.animate !== 'function') return;

    if (typeof ScrollTimeline === 'function') {
      const animation = fill.animate(PROGRESS_KEYFRAMES, {
        fill: 'both',
        timeline: new ScrollTimeline({ source: document.documentElement, axis: 'block' }),
      });
      return () => animation.cancel();
    }

    const animation = fill.animate(PROGRESS_KEYFRAMES, { duration: FALLBACK_TIMELINE_MS, fill: 'both' });
    animation.pause();

    let frame = 0;
    const sync = () => {
      frame = 0;
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      const ratio = scrollable > 0 ? window.scrollY / scrollable : 0;
      animation.currentTime = Math.min(1, Math.max(0, ratio)) * FALLBACK_TIMELINE_MS;
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(sync);
    };

    sync();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      animation.cancel();
    };
  }, []);

  return (
    <div aria-hidden="true" className={styles.progressTrack}>
      <div className={styles.progressFill} ref={fillRef} />
    </div>
  );
}

const links = [
  { href: '/kien-thuc-nen-tang', label: 'Kiến thức nền tảng' },
  { href: '/cay-quyet-dinh', label: 'Cây quyết định' },
  { href: '/lo-trinh', label: 'Lộ trình' },
  { href: '/mua-18', label: 'Mùa 18' },
  { href: '/checklist', label: 'Checklist' },
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
          <Image alt="" className={styles.mark} height={64} priority src="/logo/logo-main.png" width={64} />
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
