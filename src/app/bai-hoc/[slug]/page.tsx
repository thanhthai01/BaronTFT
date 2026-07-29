import type { Metadata } from 'next';
import { KnowledgeReader } from '@/components/features/knowledge-reader/KnowledgeReader';
import { getLesson, lessons } from '@/content/lessons';
import styles from '../../kien-thuc-nen-tang/page.module.css';

export function generateStaticParams() {
  return lessons.map((lesson) => ({ slug: lesson.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const lesson = getLesson(slug);
  return { title: lesson ? `${lesson.shortTitle} · Kiến thức nền tảng` : 'Kiến thức nền tảng' };
}

export default async function LessonPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const lesson = getLesson(slug) ?? lessons[0];

  return (
    <>
      <header className={styles.header}>
        <div className="wide-container">
          <span className="kicker">Kiến thức nền tảng</span>
          <h1>{lesson.shortTitle}</h1>
          <p>Đang mở đúng bài từ mục lục nền tảng. Chọn bài khác ở cột trái để đổi nội dung mà không rời khỏi phòng đọc.</p>
        </div>
      </header>
      <section className={styles.readerSection} aria-label="Nội dung kiến thức nền tảng">
        <div className="wide-container">
          <KnowledgeReader initialSlug={lesson.slug} />
        </div>
      </section>
    </>
  );
}
