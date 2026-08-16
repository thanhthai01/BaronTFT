'use client';

import Link from 'next/link';
import { Fragment, useEffect, useMemo, useRef, useState } from 'react';
import { Button } from '@/components/design-system/Button/Button';
import { Callout } from '@/components/design-system/Callout/Callout';
import { lessons, type Lesson, type LessonBlock } from '@/content/lessons';
import { assertTrustedHtml } from '@/lib/trusted-html';
import { BlockTypeIcon, ChevronIcon, ClockIcon, FlagIcon, PencilIcon } from './BlockIcons';
import styles from './KnowledgeReader.module.css';

function BlockHeading({ title, type }: { title: string; type: LessonBlock['type'] }) {
  return (
    <h2 className={styles.blockHeading}>
      <span className={styles.blockIcon}>
        <BlockTypeIcon type={type} />
      </span>
      {title}
    </h2>
  );
}

function BlockRenderer({ block, anchorId }: { block: LessonBlock; anchorId: string }) {
  if (block.type === 'principles') {
    return (
      <section className={styles.block} data-block-type={block.type} id={anchorId}>
        <BlockHeading title={block.title} type={block.type} />
        <ul className={styles.principles}>
          {block.items.map((item) => <li key={item}>{item}</li>)}
        </ul>
      </section>
    );
  }

  if (block.type === 'scenario') {
    return (
      <section className={styles.block} data-block-type={block.type} id={anchorId}>
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
      <section className={styles.block} data-block-type={block.type} id={anchorId}>
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
      <section className={styles.block} data-block-type={block.type} id={anchorId}>
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
      <section className={styles.block} data-block-type={block.type} id={anchorId}>
        <BlockHeading title={block.title} type={block.type} />
        <div className={`prose ${styles.conceptBody}`} dangerouslySetInnerHTML={{ __html: assertTrustedHtml(block.html, 'evergreenMarkdownHtml', `lesson:${anchorId}`) }} />
      </section>
    );
  }

  if (block.type === 'pitfalls') {
    return (
      <section className={styles.block} data-block-type={block.type} id={anchorId}>
        <Callout title={block.title} tone="warning">
          <ul>
            {block.items.map((item) => <li key={item}>{item}</li>)}
          </ul>
        </Callout>
      </section>
    );
  }

  return (
    <section className={styles.block} data-block-type={block.type} id={anchorId}>
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

function LessonJumpList({
  lesson,
  activeAnchor,
  onNavigate,
}: {
  lesson: Lesson;
  activeAnchor: string | null;
  onNavigate?: () => void;
}) {
  return (
    <div className={styles.jumpList}>
      {lesson.blocks.map((block) => (
        <a
          aria-current={activeAnchor === block.anchor ? 'true' : undefined}
          className={styles.jumpLink}
          href={`#${block.anchor}`}
          key={`${lesson.slug}-jump-${block.anchor}`}
          onClick={onNavigate}
        >
          <span className={styles.jumpIcon}>
            <BlockTypeIcon type={block.type} />
          </span>
          <span>{block.title}</span>
        </a>
      ))}
    </div>
  );
}

type LessonGroup = { category: string; items: Lesson[] };

function LessonNavigation({
  activeLesson,
  expandedCategory,
  groups,
  onExpandedCategoryChange,
  onNavigate,
}: {
  activeLesson: Lesson;
  expandedCategory: string;
  groups: LessonGroup[];
  onExpandedCategoryChange: (category: string) => void;
  onNavigate?: () => void;
}) {
  return (
    <div className={styles.tocGroups}>
      {groups.map((group) => {
        const isExpanded = group.category === expandedCategory;

        return (
          <div className={styles.tocGroup} key={group.category}>
            <button
              aria-expanded={isExpanded}
              className={styles.tocGroupHeader}
              type="button"
              onClick={() => onExpandedCategoryChange(isExpanded ? '' : group.category)}
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
                  <Link
                    aria-current={lesson.slug === activeLesson.slug ? 'page' : undefined}
                    className={styles.tocItem}
                    href={`/kien-thuc-nen-tang/${lesson.slug}`}
                    key={lesson.slug}
                    onClick={onNavigate}
                  >
                    <span className={styles.tocItemIndex}>{String(lessons.indexOf(lesson) + 1).padStart(2, '0')}</span>
                    <span className={styles.tocItemTitle}>{lesson.shortTitle}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function LessonApplyPanel({ lesson }: { lesson: Lesson }) {
  const hasDeepReviewAction = lesson.slug !== 'vod-review-va-phan-loai-loi';

  return (
    <div className={styles.applyPanel}>
      <div className={styles.applyActions}>
        <Button href="/checklist" variant="secondary" block>Mở checklist</Button>
        {hasDeepReviewAction && (
          <Button href="/kien-thuc-nen-tang/vod-review-va-phan-loai-loi" variant="ghost" block>
            Đào sâu bằng VOD review
          </Button>
        )}
      </div>
    </div>
  );
}

export function KnowledgeReader({ initialSlug }: { initialSlug?: string }) {
  // Bài đang đọc luôn bám theo URL (initialSlug đến từ route param của
  // page.tsx) thay vì state riêng — điều hướng qua <Link> nên route đổi,
  // Next.js re-render page.tsx với slug mới, props này đổi theo. Trước đây
  // dùng useState(initialLesson.slug) chỉ seed giá trị lúc mount nên URL và
  // nội dung hiển thị có thể lệch nhau khi chuyển bài.
  const activeLesson = useMemo(
    () => lessons.find((lesson) => lesson.slug === initialSlug) ?? lessons[0],
    [initialSlug],
  );
  const [expandedCategory, setExpandedCategory] = useState(activeLesson.module);
  const [activeAnchor, setActiveAnchor] = useState<string | null>(null);
  const [activePanel, setActivePanel] = useState<'lessons' | 'contents' | null>(null);
  const applyRef = useRef<HTMLElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const lessonTriggerRef = useRef<HTMLButtonElement>(null);
  const contentsTriggerRef = useRef<HTMLButtonElement>(null);
  const returnFocusRef = useRef<HTMLButtonElement | null>(null);

  const groupedLessons = useMemo(() => {
    const groups: LessonGroup[] = [];
    for (const lesson of lessons) {
      const group = groups.find((entry) => entry.category === lesson.module);
      if (group) group.items.push(lesson);
      else groups.push({ category: lesson.module, items: [lesson] });
    }
    return groups;
  }, []);

  // Chiều ngược của `prerequisite`: bài nào lấy bài đang đọc làm nền, để cuối
  // bài nền có lối đi tiếp sang bản nâng cao thay vì phải tự tìm trong Mục lục.
  const advancedFollowUps = useMemo(
    () => lessons.filter((lesson) => lesson.prerequisite?.href === `/kien-thuc-nen-tang/${activeLesson.slug}`),
    [activeLesson.slug],
  );

  // Bài học vừa chọn luôn kéo nhóm chứa nó ra — nhưng không đụng vào nhóm
  // người dùng đang tự mở/đóng tay nếu nó không phải nhóm vừa đổi tới.
  useEffect(() => {
    setExpandedCategory(activeLesson.module);
  }, [activeLesson.module]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (activePanel && !dialog.open) dialog.showModal();
    if (!activePanel && dialog.open) dialog.close();
  }, [activePanel]);

  // Scrollspy: mục đang đọc là block CUỐI CÙNG có mép trên đã vượt qua mốc
  // tham chiếu gần đỉnh viewport — không dùng "đang intersect" vì block dài
  // phía trước vẫn còn intersect dải quan sát dù đã đọc qua, gây lệch nhịp.
  useEffect(() => {
    const ids = activeLesson.blocks.map((block) => block.anchor);
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
  const panelTitle = activePanel === 'lessons' ? 'Danh sách bài' : 'Mục lục bài';

  function openPanel(panel: 'lessons' | 'contents') {
    returnFocusRef.current = panel === 'lessons' ? lessonTriggerRef.current : contentsTriggerRef.current;
    setActivePanel(panel);
  }

  function closePanel() {
    setActivePanel(null);
  }

  return (
    <div className={styles.shell}>
      <article className={styles.article} data-knowledge-reader>
        <header className={styles.articleHead}>
          <span className="kicker">{activeLesson.module}</span>
          <h1>{activeLesson.title}</h1>
          <p className={styles.articleLead}>{activeLesson.summary}</p>
          <div className={styles.metaRow}>
            <span className={styles.metaChip}><ClockIcon /><span>{activeLesson.duration}</span></span>
            <span className={styles.metaChip}><FlagIcon /><span>{activeLesson.skill}</span></span>
            {activeLesson.exercise && <span className={styles.metaChip}><PencilIcon /><span>{activeLesson.exercise}</span></span>}
          </div>
        </header>

        <nav aria-label="Công cụ đọc" className={styles.readerToolbar}>
          <button
            aria-controls="reader-panel"
            aria-expanded={activePanel === 'lessons'}
            aria-label="Mở danh sách bài"
            ref={lessonTriggerRef}
            type="button"
            onClick={() => openPanel('lessons')}
          >
            Danh sách bài
          </button>
          <button
            aria-controls="reader-panel"
            aria-expanded={activePanel === 'contents'}
            aria-label="Mở mục lục bài"
            ref={contentsTriggerRef}
            type="button"
            onClick={() => openPanel('contents')}
          >
            Mục lục bài
          </button>
        </nav>

        {/* Bài nâng cao trong một chuỗi cơ bản→nâng cao (xem frontmatter
            `prerequisite:`) nhắc rõ nên đọc bài nền nào trước — người lạc vào
            thẳng bài nâng cao biết đường lùi thay vì đọc thiếu ngữ cảnh. */}
        {activeLesson.prerequisite && (
          <Callout title="Nên đọc trước" tone="tip">
            <p>
              Bài này giả định bạn đã nắm <Link href={activeLesson.prerequisite.href}>{activeLesson.prerequisite.label}</Link>.
            </p>
          </Callout>
        )}

        {activeLesson.blocks.map((block, index) => (
          <Fragment key={`${activeLesson.slug}-${block.anchor}`}>
            {index === practiceStartIndex && (
              <div className={styles.sectionDivider}>
                <span>Thực hành</span>
              </div>
            )}
            <BlockRenderer anchorId={block.anchor} block={block} />
          </Fragment>
        ))}

        {activeLesson.related.length > 0 && (
          <section className={styles.block}>
            <h2>Bài liên quan</h2>
            <div className={styles.relatedList}>
              {activeLesson.related.map((item) => (
                <Link className={styles.relatedLink} href={item.href} key={item.href}>
                  {item.label}
                </Link>
              ))}
            </div>
          </section>
        )}

        {advancedFollowUps.length > 0 && (
          <section className={styles.block}>
            <h2>Đọc tiếp nâng cao</h2>
            <div className={styles.relatedList}>
              {advancedFollowUps.map((lesson) => (
                <Link className={styles.relatedLink} href={`/kien-thuc-nen-tang/${lesson.slug}`} key={lesson.slug}>
                  {lesson.title}
                </Link>
              ))}
            </div>
          </section>
        )}

        <section aria-labelledby="reader-actions-title" className={styles.readerActions} data-reader-actions>
          <div className={styles.actionsCopy}>
            <span className={styles.actionsKicker}>Tiếp tục luyện tập</span>
            <h2 id="reader-actions-title">Áp dụng vào trận tiếp theo</h2>
            <p>Chuyển điều vừa đọc thành một câu hỏi cụ thể cho trận đấu kế tiếp.</p>
          </div>
          <LessonApplyPanel lesson={activeLesson} />
        </section>
      </article>

      <aside aria-label="Mục lục bài" className={styles.apply} ref={applyRef}>
        <h2 className={styles.applyTitle}>Trong bài</h2>
        <LessonJumpList activeAnchor={activeAnchor} lesson={activeLesson} />
      </aside>

      <dialog
        aria-labelledby="reader-panel-title"
        className={styles.readerDialog}
        id="reader-panel"
        ref={dialogRef}
        onCancel={closePanel}
        onClick={(event) => {
          if (event.target === event.currentTarget) closePanel();
        }}
        onClose={() => {
          setActivePanel(null);
          const trigger = returnFocusRef.current;
          requestAnimationFrame(() => trigger?.focus());
        }}
      >
        <div className={styles.dialogPanel}>
          <header className={styles.dialogHead}>
            <div>
              <span className={styles.dialogKicker}>Kiến thức nền tảng</span>
              <h2 id="reader-panel-title">{panelTitle}</h2>
            </div>
            <button aria-label={`Đóng ${panelTitle.toLocaleLowerCase('vi')}`} className={styles.dialogClose} type="button" onClick={closePanel}>
              <span aria-hidden="true">×</span>
            </button>
          </header>
          <div className={styles.dialogBody}>
            {activePanel === 'lessons' ? (
              <LessonNavigation
                activeLesson={activeLesson}
                expandedCategory={expandedCategory}
                groups={groupedLessons}
                onExpandedCategoryChange={setExpandedCategory}
                onNavigate={closePanel}
              />
            ) : (
              <LessonJumpList activeAnchor={activeAnchor} lesson={activeLesson} onNavigate={closePanel} />
            )}
          </div>
        </div>
      </dialog>
    </div>
  );
}
