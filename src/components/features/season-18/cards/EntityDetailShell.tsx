import Link from 'next/link';
import type { ReactNode } from 'react';
import { SITE_URL } from '@/lib/site';
import styles from './EntityDetailShell.module.css';

/** Khung dùng chung cho 4 route chi tiết entity Mùa 18 (tướng/tộc/tinh linh/nâng
 * cấp) — breadcrumb về mục lục section, tiêu đề, 1 card focus + khối "liên quan"
 * bắt buộc (chống thin content, xem CLAUDE plan Phase 2), kèm BreadcrumbList
 * JSON-LD khớp breadcrumb hiển thị (giúp Google hiện breadcrumb rich result). */
export function EntityDetailShell({
  breadcrumbLabel,
  breadcrumbHref,
  canonicalPath,
  eyebrow,
  title,
  description,
  card,
  relatedTitle,
  related,
}: {
  breadcrumbLabel: string;
  breadcrumbHref: string;
  canonicalPath: string;
  eyebrow: string;
  title: string;
  description: string;
  card: ReactNode;
  relatedTitle: string;
  related: ReactNode;
}) {
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Mùa 18', item: `${SITE_URL}/mua-18/ma-tran-toc-he` },
      { '@type': 'ListItem', position: 2, name: breadcrumbLabel, item: `${SITE_URL}${breadcrumbHref}` },
      { '@type': 'ListItem', position: 3, name: title, item: `${SITE_URL}${canonicalPath}` },
    ],
  };

  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} type="application/ld+json" />
      <header className={styles.header}>
        <div className="wide-container">
          <p className={styles.breadcrumb}>
            <Link href="/mua-18">Mùa 18</Link>
            <span>/</span>
            <Link href={breadcrumbHref}>{breadcrumbLabel}</Link>
          </p>
          <span className="kicker">{eyebrow}</span>
          <h1>{title}</h1>
          <p>{description}</p>
        </div>
      </header>
      <section aria-label={title} className={styles.body}>
        <div className="wide-container">
          <div className={styles.focusCard}>{card}</div>
          <div className={styles.relatedSection}>
            <h2 className={styles.relatedTitle}>{relatedTitle}</h2>
            {related}
          </div>
        </div>
      </section>
    </>
  );
}
