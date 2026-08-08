import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { Set18Codex } from '@/components/features/season-18/Set18Codex';
import { set18Sections } from '@/content/set18/set18-meta';
import styles from '../page.module.css';

export function generateStaticParams() {
  return set18Sections.map((section) => ({ section: section.id }));
}

function findSection(section: string) {
  return set18Sections.find((entry) => entry.id === section);
}

export async function generateMetadata({ params }: { params: Promise<{ section: string }> }): Promise<Metadata> {
  const { section } = await params;
  const meta = findSection(section);
  if (!meta) return {};
  return {
    title: meta.label,
    description: `${meta.label} — ${meta.hint}. Dữ liệu Mùa 18 Baron TFT.`,
    alternates: { canonical: `/mua-18/${section}` },
  };
}

export default async function Season18SectionPage({ params }: { params: Promise<{ section: string }> }) {
  const { section } = await params;
  const meta = findSection(section);
  if (!meta) notFound();

  return (
    <>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <span className="kicker">Mùa 18</span>
          <h1>{meta.label}</h1>
          <p>{meta.hint}</p>
        </div>
      </header>
      <section aria-label={meta.label} className={styles.readerSection}>
        <Suspense fallback={null}>
          <Set18Codex section={meta.id} />
        </Suspense>
      </section>
    </>
  );
}
