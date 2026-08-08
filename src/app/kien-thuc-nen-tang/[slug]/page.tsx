import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { KnowledgeReader } from '@/components/features/knowledge-reader/KnowledgeReader';
import { getLesson, lessons } from '@/content/lessons';
import { SITE_URL } from '@/lib/site';
import styles from '../page.module.css';

export function generateStaticParams() {
  return lessons.map((lesson) => ({ slug: lesson.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const lesson = getLesson(slug);
  if (!lesson) return {};
  return {
    title: lesson.title,
    description: lesson.summary,
    alternates: { canonical: `/kien-thuc-nen-tang/${slug}` },
    openGraph: { title: lesson.title, description: lesson.summary },
  };
}

export default async function LessonDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const lesson = getLesson(slug);
  if (!lesson) notFound();

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: lesson.title,
    description: lesson.summary,
    inLanguage: 'vi-VN',
    isPartOf: { '@type': 'WebSite', name: 'Baron TFT', url: SITE_URL },
    mainEntityOfPage: `${SITE_URL}/kien-thuc-nen-tang/${slug}`,
  };

  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} type="application/ld+json" />
      <header className={styles.header}>
        <div className="wide-container">
          <span className="kicker">{lesson.module}</span>
          <h1>{lesson.title}</h1>
          <p>{lesson.summary}</p>
        </div>
      </header>
      <section aria-label="Nội dung kiến thức nền tảng" className={styles.readerSection}>
        <div className="wide-container">
          <KnowledgeReader initialSlug={slug} />
        </div>
      </section>
    </>
  );
}
