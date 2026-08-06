'use client';

import Link from 'next/link';
import { Fragment, useEffect, useMemo, useRef, useState } from 'react';
import { Button } from '@/components/design-system/Button/Button';
import { Callout } from '@/components/design-system/Callout/Callout';
import { lessons, type LessonBlock } from '@/content/lessons';
import { BlockTypeIcon, ChevronIcon, ClockIcon, FlagIcon, PencilIcon } from './BlockIcons';
import styles from './KnowledgeReader.module.css';

function BlockHeading({ title, type }: { title: string; type: LessonBlock['type'] }) {
  return (
    <h3 className={styles.blockHeading}>
      <span className={styles.blockIcon}>
        <BlockTypeIcon type={type} />
      </span>
      {title}
    </h3>
  );
}

function BlockRenderer({ block, anchorId }: { block: LessonBlock; anchorId: string }) {
  if (block.type === 'principles') {
    return (
      <section className={styles.block} id={anchorId}>
        <BlockHeading title={block.title} type={block.type} />
        <ul className={styles.principles}>
          {block.items.map((item) => <li key={item}>{item}</li>)}
        </ul>
      </section>
    );
  }

  if (block.type === 'scenario') {
    return (
      <section className={styles.block} id={anchorId}>
        <BlockHeading title={block.title} type={block.type} />
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
      <section className={styles.block} id={anchorId}>
        <BlockHeading title={block.title} type={block.type} />
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
      <section className={styles.block} id={anchorId}>
        <BlockHeading title={block.title} type={block.type} />
        <div className={styles.drill}>
          {block.goal && <p className={styles.drillGoal}>{block.goal}</p>}
          <ol>
            {block.steps.map((step) => <li key={step}>{step}</li>)}
          </ol>
        </div>
      </section>
    );
  }

  if (block.type === 'concept') {
    return (
      <section className={styles.block} id={anchorId}>
        <BlockHeading title={block.title} type={block.type} />
        <div className={`prose ${styles.conceptBody}`} dangerouslySetInnerHTML={{ __html: block.html }} />
      </section>
    );
  }

  if (block.type === 'pitfalls') {
    return (
      <section className={styles.block} id={anchorId}>
        <Callout title={block.title} tone="warning">
          <ul>
            {block.items.map((item) => <li key={item}>{item}</li>)}
          </ul>
        </Callout>
      </section>
    );
  }

  return (
    <section className={styles.block} id={anchorId}>
      <BlockHeading title={block.title} type={block.type} />
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

const PRACTICE_BLOCK_TYPES = new Set<LessonBlock['type']>(['pitfalls', 'checklist', 'drill']);

export function KnowledgeReader({ initialSlug }: { initialSlug?: string }) {
  const initialLesson = useMemo(() => lessons.find((lesson) => lesson.slug === initialSlug) ?? lessons[0], [initialSlug]);
  const [activeSlug, setActiveSlug] = useState(initialLesson.slug);
  const activeLesson = lessons.find((lesson) => lesson.slug === activeSlug) ?? lessons[0];
  const [expandedCategory, setExpandedCategory] = useState(initialLesson.module);
  const [activeAnchor, setActiveAnchor] = useState<string | null>(null);
  const applyRef = useRef<HTMLElement>(null);

  const groupedLessons = useMemo(() => {
    const groups: Array<{ category: string; items: typeof lessons }> = [];
    for (const lesson of lessons) {
      const group = groups.find((entry) => entry.category === lesson.module);
      if (group) group.items.push(lesson);
      else groups.push({ category: lesson.module, items: [lesson] });
    }
    return groups;
  }, []);

  // Bài học vừa chọn luôn kéo nhóm chứa nó ra — nhưng không đụng vào nhóm
  // người dùng đang tự mở/đóng tay nếu nó không phải nhóm vừa đổi tới.
  useEffect(() => {
    setExpandedCategory(activeLesson.module);
  }, [activeLesson.module]);

  // Scrollspy: mục đang đọc là block CUỐI CÙNG có mép trên đã vượt qua mốc
  // tham chiếu gần đỉnh viewport — không dùng "đang intersect" vì block dài
  // phía trước vẫn còn intersect dải quan sát dù đã đọc qua, gây lệch nhịp.
  useEffect(() => {
    const ids = activeLesson.blocks.map((_, index) => `${activeLesson.slug}-block-${index}`);
    const sections = ids.map((id) => document.getElementById(id)).filter((el): el is HTMLElement => el !== null);
    if (sections.length === 0) {
      setActiveAnchor(null);
      return;
    }

    const REFERENCE_OFFSET = 140;

    function updateActive() {
      let current = sections[0].id;
      for (const section of sections) {
        if (section.getBoundingClientRect().top <= REFERENCE_OFFSET) current = section.id;
        else break;
      }
      setActiveAnchor(current);
    }

    updateActive();
    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        updateActive();
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [activeLesson.slug, activeLesson.blocks]);

  // Panel "Mục lục nội dung" + "Áp dụng ngay" dùng chung một scroll ở cấp
  // .apply (không có scrollbox lồng riêng cho từng phần) — khi scrollspy đổi
  // mục active, kéo mục đó vào tầm nhìn trong scroll đó nếu cần. Tự tính
  // scrollTop trên chính container thay vì dùng Element.scrollIntoView(), vì
  // hàm đó có thể "leo" lên cuộn cả window khi container không có overflow
  // (trường hợp mobile, .apply không giới hạn chiều cao) — từng gây window
  // tự nhảy xuống mỗi lần scrollspy đổi mục.
  useEffect(() => {
    if (!activeAnchor || !applyRef.current) return;
    const container = applyRef.current;
    const link = container.querySelector<HTMLAnchorElement>(`a[href="#${activeAnchor}"]`);
    if (!link) return;
    const containerRect = container.getBoundingClientRect();
    const linkRect = link.getBoundingClientRect();
    if (linkRect.top < containerRect.top) {
      container.scrollTop -= containerRect.top - linkRect.top;
    } else if (linkRect.bottom > containerRect.bottom) {
      container.scrollTop += linkRect.bottom - containerRect.bottom;
    }
  }, [activeAnchor]);

  const practiceStartIndex = activeLesson.blocks.findIndex((block) => PRACTICE_BLOCK_TYPES.has(block.type));

  return (
    <div className={styles.shell}>
      <aside className={styles.toc} aria-label="Mục lục kiến thức nền tảng">
        <h2 className={styles.tocTitle}>Mục lục</h2>
        <div className={styles.tocGroups}>
          {groupedLessons.map((group) => {
            const isExpanded = group.category === expandedCategory;
            return (
              <div className={styles.tocGroup} key={group.category}>
                <button
                  aria-expanded={isExpanded}
                  className={styles.tocGroupHeader}
                  type="button"
                  onClick={() => setExpandedCategory((current) => (current === group.category ? '' : group.category))}
                >
                  <span className={styles.tocGroupTitle}>{group.category}</span>
                  <span className={styles.tocGroupMeta}>
                    <span className={styles.tocGroupCount}>{group.items.length}</span>
                    <span className={styles.tocChevron}>
                      <ChevronIcon expanded={isExpanded} />
                    </span>
                  </span>
                </button>
                {isExpanded && (
                  <div className={styles.tocList}>
                    {group.items.map((lesson) => (
                      <button
                        aria-current={lesson.slug === activeLesson.slug}
                        className={styles.tocItem}
                        key={lesson.slug}
                        type="button"
                        onClick={() => setActiveSlug(lesson.slug)}
                      >
                        <span className={styles.tocItemIndex}>{String(lessons.indexOf(lesson) + 1).padStart(2, '0')}</span>
                        <span className={styles.tocItemTitle}>{lesson.shortTitle}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </aside>

      <article className={styles.article}>
        <select aria-label="Chọn bài học" className={styles.mobileSelect} value={activeSlug} onChange={(event) => setActiveSlug(event.target.value)}>
          {groupedLessons.map((group) => (
            <optgroup key={group.category} label={group.category}>
              {group.items.map((lesson) => <option key={lesson.slug} value={lesson.slug}>{lesson.title}</option>)}
            </optgroup>
          ))}
        </select>

        <header className={styles.articleHead}>
          <span className="kicker">{activeLesson.module}</span>
          <h2>{activeLesson.title}</h2>
          <p>{activeLesson.summary}</p>
          <div className={styles.metaRow}>
            <span className={styles.metaChip}><ClockIcon /><span>{activeLesson.duration}</span></span>
            <span className={styles.metaChip}><FlagIcon /><span>{activeLesson.skill}</span></span>
            {activeLesson.exercise && <span className={styles.metaChip}><PencilIcon /><span>{activeLesson.exercise}</span></span>}
          </div>
        </header>

        {activeLesson.blocks.map((block, index) => (
          <Fragment key={`${activeLesson.slug}-${block.title}`}>
            {index === practiceStartIndex && (
              <div className={styles.sectionDivider}>
                <span>Thực hành</span>
              </div>
            )}
            <BlockRenderer anchorId={`${activeLesson.slug}-block-${index}`} block={block} />
          </Fragment>
        ))}

        {activeLesson.related.length > 0 && (
          <section className={styles.block}>
            <h3>Bài liên quan</h3>
            <div className={styles.relatedList}>
              {activeLesson.related.map((item) => (
                <Link className={styles.relatedLink} href={item.href} key={item.href}>
                  {item.label}
                </Link>
              ))}
            </div>
          </section>
        )}
      </article>

      <aside className={styles.apply} ref={applyRef}>
        <h2 className={styles.applyTitle}>Mục lục nội dung</h2>
        <div className={styles.jumpList}>
          {activeLesson.blocks.map((block, index) => {
            const anchorId = `${activeLesson.slug}-block-${index}`;
            return (
              <a
                aria-current={activeAnchor === anchorId ? 'true' : undefined}
                className={styles.jumpLink}
                href={`#${anchorId}`}
                key={`${activeLesson.slug}-jump-${index}`}
              >
                <span className={styles.jumpIcon}>
                  <BlockTypeIcon type={block.type} />
                </span>
                <span>{block.title}</span>
              </a>
            );
          })}
        </div>

        <h2 className={styles.applyTitle}>Áp dụng ngay</h2>
        <div className={styles.applyActions}>
          <Button href="/patch" variant="secondary" block>Patch cập nhật</Button>
          <Button href="/mua-18" variant="secondary" block>Xem Mùa 18</Button>
        </div>
      </aside>
    </div>
  );
}
