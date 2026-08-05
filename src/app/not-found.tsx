import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/design-system/Button/Button';
import styles from './not-found.module.css';

export const metadata: Metadata = { title: '404' };

const quickLinks = [
  { href: '/kien-thuc-nen-tang', label: 'Kiến thức nền tảng', dot: 'var(--cost-3)' },
  { href: '/mua-18', label: 'Mùa 18', dot: 'var(--cost-1)' },
  { href: '/checklist', label: 'Checklist', dot: 'var(--cost-5)' },
  { href: '/patch', label: 'Patch', dot: 'var(--cost-3)' },
  { href: '/nguon-hoc', label: 'Nguồn học', dot: 'var(--cost-1)' },
];

export default function NotFound() {
  return (
    <section className={styles.wrap}>
      <div className="container">
        <div className={styles.window}>
          <div className={styles.titlebar}>
            <span className={styles.dots} aria-hidden="true">
              <span className={styles.dot} style={{ background: 'var(--cost-1)' }} />
              <span className={styles.dot} style={{ background: 'var(--cost-3)' }} />
              <span className={styles.dot} style={{ background: 'var(--cost-5)' }} />
            </span>
            <span className={styles.brandMini}>
              <Image alt="" className={styles.brandMark} height={40} src="/logo/logo-main.png" width={34} />
              baron-tft — zsh
            </span>
          </div>
          <div className={styles.body}>
            <p className={styles.term}>
              <span className={styles.prompt}>$</span> cd <span className={styles.path}>trang-nay-khong-ton-tai/</span>
              <span className={styles.err}>zsh: no such file or directory (404)</span>
            </p>
            <h1 className={styles.title}>
              <span className={styles.code404}>404</span> Không tìm thấy trang.
            </h1>
            <p className={styles.desc}>
              Đường dẫn này không khớp với nội dung nào trên <span className={styles.nowrap}>Baron TFT</span>. Có
              thể trang đã đổi tên, bị gỡ, hoặc URL gõ sai. Thử một trong các mục sau:
            </p>
            <nav aria-label="Gợi ý điều hướng" className={styles.links}>
              {quickLinks.map((link) => (
                <Link
                  className={styles.chip}
                  href={link.href}
                  key={link.href}
                  style={{ '--dot-color': link.dot } as React.CSSProperties}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            <Button href="/" size="md" variant="primary">
              Về trang chủ
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
