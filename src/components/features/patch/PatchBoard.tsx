'use client';

import Image from 'next/image';
import { useMemo, useState, type CSSProperties } from 'react';
import { Tabs, tabElementId, tabPanelId } from '@/components/design-system/Tabs/Tabs';
import { findSet18Entity, set18EntityById } from '@/content/set18/set18-entity-index';
import {
  patchCategoryMeta,
  patchCategoryTabs,
  patchKindMeta,
  patchKindOrder,
  patchReports,
  type PatchCategory,
  type PatchChangeKind,
  type PatchEntry,
} from '@/content/patch-notes';
import type { Set18EntityKind } from '@/content/set18/set18-types';
import styles from './PatchBoard.module.css';

const HISTORY_PREFIX = 'patch-history-';
const CATEGORY_PREFIX = 'patch-category-';

/** Icon tộc hệ là silhouette trắng nền trong suốt, icon nâng cấp đã tô màu theo
 * độ hiếm. Entity index giữ đúng phần dữ liệu trình bày tối thiểu để trang Patch
 * không phải tải toàn bộ codex. */
type ResolvedIcon = { src: string; variant: 'champion' | 'trait' | 'augment' | 'plain'; accent?: string };

function entityKind(category: PatchCategory): Set18EntityKind | null {
  if (category === 'champion' || category === 'trait' || category === 'augment' || category === 'wisp') return category;
  return null;
}

function resolveIcon(entry: PatchEntry): ResolvedIcon | null {
  const kind = entityKind(entry.category);
  const entity = entry.entityId
    ? set18EntityById.get(entry.entityId)
    : kind
      ? findSet18Entity(kind, entry.name)
      : undefined;
  const src = entity?.icon ?? entry.icon;
  if (!src) return null;
  if (entry.category === 'champion') return { src, variant: 'champion' };
  if (entry.category === 'trait') return { src, variant: 'trait', accent: entity?.accent };
  if (entry.category === 'augment') return { src, variant: 'augment', accent: entity?.accent };
  return { src, variant: 'plain' };
}

export function PatchBoard() {
  const [reportId, setReportId] = useState(patchReports[0].id);
  const [category, setCategory] = useState<PatchCategory | 'all'>('all');
  const report = patchReports.find((item) => item.id === reportId) ?? patchReports[0];

  const counts = useMemo(() => {
    const base: Record<PatchChangeKind, number> = { buff: 0, nerf: 0, rework: 0, mechanic: 0 };
    report.entries.forEach((entry) => {
      base[entry.kind] += 1;
    });
    return base;
  }, [report]);

  const filtered = category === 'all' ? report.entries : report.entries.filter((entry) => entry.category === category);
  const groups = patchKindOrder
    .map((kind) => ({ kind, entries: filtered.filter((entry) => entry.kind === kind) }))
    .filter((group) => group.entries.length > 0);

  const historyTabs = patchReports.map((item) => ({
    id: item.id,
    ariaLabel: `${item.version}, ${item.dateVi}`,
    className: styles.historyItem,
    label: (
      <>
        <span className={styles.historyVersion}>{item.version}</span>
        <span className={styles.historyDate}>{item.dateVi}</span>
      </>
    ),
  }));

  return (
    <div className={styles.board}>
      {patchReports.length > 1 ? (
        <div className={styles.history}>
          <Tabs idPrefix={HISTORY_PREFIX} label="Lịch sử bản vá" tabs={historyTabs} value={reportId} onChange={setReportId} />
        </div>
      ) : null}

      <div
        aria-labelledby={tabElementId(HISTORY_PREFIX, report.id)}
        id={tabPanelId(HISTORY_PREFIX, report.id)}
        role="tabpanel"
      >
        <header className={styles.head}>
          <div className={styles.headMeta}>
            <span className={styles.version}>{report.version}</span>
            <span className={styles.dot} aria-hidden="true">•</span>
            <span>{report.author}</span>
            <span className={styles.dot} aria-hidden="true">•</span>
            <span>{report.dateVi}</span>
          </div>
          <p className={styles.summary}>{report.summaryVi}</p>
          <div className={styles.statRow}>
            {patchKindOrder.map((kind) => (
              <span className={[styles.stat, styles[kind]].join(' ')} key={kind}>
                <strong>{counts[kind]}</strong> {patchKindMeta[kind].label}
              </span>
            ))}
          </div>
        </header>

        <div className={styles.categoryTabs}>
          <Tabs
            idPrefix={CATEGORY_PREFIX}
            label="Lọc bản vá theo nhóm"
            tabs={patchCategoryTabs}
            value={category}
            onChange={(value) => setCategory(value as PatchCategory | 'all')}
          />
        </div>

        <div
          aria-labelledby={tabElementId(CATEGORY_PREFIX, category)}
          className={styles.groups}
          id={tabPanelId(CATEGORY_PREFIX, category)}
          role="tabpanel"
        >
          {groups.length === 0 ? <p className={styles.empty}>Chưa có thay đổi nào ở nhóm này trong bản vá này.</p> : null}
          {groups.map((group) => (
            <section aria-labelledby={`${group.kind}-heading`} className={styles.group} key={group.kind}>
              <h2 className={[styles.groupTitle, styles[group.kind]].join(' ')} id={`${group.kind}-heading`}>
                {patchKindMeta[group.kind].label}
              </h2>
              <div className={styles.cards}>
                {group.entries.map((entry) => {
                  const icon = resolveIcon(entry);
                  return (
                    <article className={styles.card} key={entry.id}>
                      <div className={styles.cardHead}>
                        {icon ? (
                          <span
                            className={[styles.iconWrap, styles[`variant-${icon.variant}`]].join(' ')}
                            style={icon.accent ? ({ '--icon-accent': icon.accent } as CSSProperties) : undefined}
                          >
                            <Image alt="" height={32} src={icon.src} width={32} />
                          </span>
                        ) : (
                          <span aria-hidden="true" className={styles.iconFallback}>{entry.name.slice(0, 2)}</span>
                        )}
                        <div className={styles.cardHeadText}>
                          <span className={styles.category}>{patchCategoryMeta[entry.category].label}</span>
                          <h3 className={styles.name}>
                            {entry.name}
                            {entry.note ? <span className={styles.note}> {entry.note}</span> : null}
                          </h3>
                        </div>
                      </div>

                      {entry.changes?.length ? (
                        <ul className={styles.changes}>
                          {entry.changes.map((change, index) => (
                            <li key={`${change.label}-${index}`}>
                              <span className={styles.changeLabel}>{change.label}</span>
                              <span className={styles.changeValues}>
                                <span className={styles.changeFrom}>{change.from}</span>
                                <span aria-hidden="true" className={styles.arrow}>→</span>
                                <span className={[styles.changeTo, styles[`to-${group.kind}`]].join(' ')}>{change.to}</span>
                              </span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <span className={styles.mechanicLabel}>Thay đổi không có chỉ số trước/sau</span>
                      )}
                    </article>
                  );
                })}
              </div>
            </section>
          ))}
        </div>

        <section aria-labelledby="patch-analysis-heading" className={styles.analysis}>
          <header className={styles.analysisHead}>
            <span className={styles.analysisEyebrow}>Đọc sâu</span>
            <h2 id="patch-analysis-heading">Phân tích thay đổi</h2>
            <p>Lý do và tác động dự kiến của từng thay đổi đang hiển thị ở phía trên.</p>
          </header>
          <div className={styles.analysisGrid}>
            {filtered.map((entry) => (
              <article className={styles.analysisCard} key={entry.id}>
                <span className={[styles.analysisKind, styles[entry.kind]].join(' ')}>{patchKindMeta[entry.kind].label}</span>
                <h3>{entry.name}{entry.note ? ` ${entry.note}` : ''}</h3>
                <p>{entry.reason}</p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
