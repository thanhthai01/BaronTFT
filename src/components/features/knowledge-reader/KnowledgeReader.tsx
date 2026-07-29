'use client';

import { useMemo, useState } from 'react';
import { Button } from '@/components/design-system/Button/Button';
import { lessons, type LessonBlock } from '@/content/lessons';
import styles from './KnowledgeReader.module.css';

function BlockRenderer({ block }: { block: LessonBlock }) {
  if (block.type === 'principles') {
    return (
      <section className={styles.block}>
        <h3>{block.title}</h3>
        <ul className={styles.principles}>
          {block.items.map((item) => <li key={item}>{item}</li>)}
        </ul>
      </section>
    );
  }

  if (block.type === 'scenario') {
    return (
      <section className={styles.block}>
        <h3>{block.title}</h3>
        <div className={styles.scenario}>
          <div className={styles.scenarioCard}>
            <strong>Tình huống</strong>
            <p>{block.setup}</p>
          </div>
          <div className={styles.scenarioCard}>
            <strong>Quyết định tốt</strong>
            <p>{block.decision}</p>
          </div>
          <div className={styles.scenarioCard}>
            <strong>Tránh</strong>
            <p>{block.avoid}</p>
          </div>
        </div>
      </section>
    );
  }

  if (block.type === 'checklist') {
    return (
      <section className={styles.block}>
        <h3>{block.title}</h3>
        <ul className={styles.checklist}>
          {block.items.map((item, index) => (
            <li className={styles.checkItem} key={item}>
              <p><strong>Câu {index + 1}</strong>{item}</p>
            </li>
          ))}
        </ul>
      </section>
    );
  }

  if (block.type === 'drill') {
    return (
      <section className={styles.block}>
        <h3>{block.title}</h3>
        <div className={styles.drill}>
          <p className={styles.drillGoal}>{block.goal}</p>
          <ol>
            {block.steps.map((step) => <li key={step}>{step}</li>)}
          </ol>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.block}>
      <h3>{block.title}</h3>
      <div className={styles.matrix}>
        {block.rows.map((row) => (
          <div className={styles.matrixRow} key={row.state}>
            <strong className={styles.state}>{row.state}</strong>
            <p><span className={styles.matrixHead}>Đọc tín hiệu</span>{row.read}</p>
            <p><span className={styles.matrixHead}>Hành động</span>{row.action}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export function KnowledgeReader({ initialSlug }: { initialSlug?: string }) {
  const initialLesson = useMemo(() => lessons.find((lesson) => lesson.slug === initialSlug) ?? lessons[0], [initialSlug]);
  const [activeSlug, setActiveSlug] = useState(initialLesson.slug);
  const activeLesson = lessons.find((lesson) => lesson.slug === activeSlug) ?? lessons[0];

  return (
    <div className={styles.shell}>
      <aside className={styles.toc} aria-label="Mục lục kiến thức nền tảng">
        <h2 className={styles.tocTitle}>Mục lục</h2>
        <div className={styles.tocList}>
          {lessons.map((lesson, index) => (
            <button
              aria-current={lesson.slug === activeLesson.slug}
              className={styles.tocItem}
              key={lesson.slug}
              type="button"
              onClick={() => setActiveSlug(lesson.slug)}
            >
              <strong>{lesson.shortTitle}</strong>
              <span>{String(index + 1).padStart(2, '0')} · {lesson.skill}</span>
            </button>
          ))}
        </div>
      </aside>

      <article className={styles.article}>
        <label className="kicker" htmlFor="lesson-select">Chọn bài học</label>
        <select className={styles.mobileSelect} id="lesson-select" value={activeSlug} onChange={(event) => setActiveSlug(event.target.value)}>
          {lessons.map((lesson) => <option key={lesson.slug} value={lesson.slug}>{lesson.title}</option>)}
        </select>

        <header className={styles.articleHead}>
          <span className="kicker">{activeLesson.module}</span>
          <h2>{activeLesson.title}</h2>
          <p>{activeLesson.summary}</p>
          <div className={styles.metaRow}>
            <span>{activeLesson.duration}</span>
            <span>{activeLesson.skill}</span>
            <span>{activeLesson.exercise}</span>
          </div>
        </header>

        {activeLesson.blocks.map((block) => <BlockRenderer block={block} key={`${activeLesson.slug}-${block.title}`} />)}
      </article>

      <aside className={styles.apply}>
        <h2 className={styles.applyTitle}>Áp dụng ngay</h2>
        <span className={styles.badge}>Lỗi hay gặp</span>
        <p>{activeLesson.commonMistake}</p>
        <ul>
          {activeLesson.applyQuestions.map((question) => <li key={question}>{question}</li>)}
        </ul>
        <div className={styles.applyActions}>
          <Button href="/checklist" variant="secondary" block>Mở checklist</Button>
          <Button href="/review" variant="ghost" block>Review trận vừa chơi</Button>
        </div>
      </aside>
    </div>
  );
}
