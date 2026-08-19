'use client';

import dynamic from 'next/dynamic';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useId, useMemo, useState, type CSSProperties } from 'react';
import { Tabs, tabElementId, tabPanelId } from '@/components/design-system/Tabs/Tabs';
import { PatchVersionSelect } from './PatchVersionSelect';
import { set18EntityUrl } from '@/lib/set18-entity-url';
import {
  initialsOf,
  resolveDisplayName,
  resolveEntity,
  resolveIcon,
} from './patch-entity-resolvers';
import {
  patchBreakpointColors,
  patchCategoryMeta,
  patchCategoryOrder,
  patchCategoryTabLabel,
  patchImpactMeta,
  patchKindMeta,
  patchKindOrder,
  patchOriginMeta,
  patchRarityMeta,
  patchReports,
  type PatchCategory,
  type PatchChangeKind,
  type PatchContentOrigin,
  type PatchEntry,
} from '@/content/patch-notes';
import { buildPatchBoardModel } from './patch-board-model';
import styles from './PatchBoard.module.css';

const PatchPresentation = dynamic(() => import('./PatchPresentation').then((mod) => mod.PatchPresentation), {
  ssr: false,
});

const CATEGORY_PREFIX = 'patch-category-';

/** Neo để chip dẫn chứng ở phần phân tích nhảy thẳng tới thẻ thay đổi tương
 * ứng; cũng là target của hiệu ứng nháy khi tới nơi. */
const entryAnchorId = (id: string) => `entry-${id}`;

/** Neo cho từng thẻ "Tác động tới đội hình" — đây là đơn vị nội dung mà mẹo,
 * codex và video (kế hoạch trình chiếu) cần trỏ tới được, không chỉ trỏ vào
 * cả trang bản vá chung chung. */
const impactAnchorId = (id: string) => `impact-${id}`;

/** Icon thay luôn nhãn nhóm bằng chữ, nên nó phải tự nói được "đây là cái gì" —
 * `size` chỉ chọn giữa ô ở lưới chính và ô nhỏ hơn ở phần đọc sâu. */
function EntryIcon({
  entry,
  entitySet,
  size = 'md',
}: {
  entry: PatchEntry;
  entitySet: number;
  size?: 'md' | 'sm' | 'xs';
}) {
  const icon = resolveIcon(entry, entitySet);
  const label = icon.cost
    ? `${patchCategoryMeta[entry.category].label} ${icon.cost} vàng`
    : patchCategoryMeta[entry.category].label;
  const className = [
    styles.iconWrap,
    styles[`variant-${icon.variant}`],
    icon.src ? null : styles.placeholder,
    size === 'sm' ? styles.iconSm : null,
    size === 'xs' ? styles.iconXs : null,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <span
      className={className}
      style={icon.accent ? ({ '--icon-accent': icon.accent } as CSSProperties) : undefined}
      title={icon.src ? label : `${label} — chưa có ảnh trong dữ liệu`}
    >
      {icon.src ? (
        <Image alt="" height={96} sizes="96px" src={icon.src} width={96} />
      ) : (
        <span aria-hidden="true" className={styles.placeholderText}>
          {initialsOf(entry.name)}
        </span>
      )}
    </span>
  );
}

/** Huy hiệu bậc của từng loại — thang bậc người chơi quen dùng khi đọc patch:
 * tướng mấy vàng, nâng cấp bậc gì, Tinh Linh cấp mấy, tộc hệ đổi ở mốc nào.
 * Đây cũng chính là khoá xếp thứ tự trong nhóm, nên hiện nó ra để người đọc
 * thấy được vì sao các thẻ đứng theo trật tự đó. */
function RankBadge({ entry, entitySet }: { entry: PatchEntry; entitySet: number }) {
  const entity = resolveEntity(entry, entitySet);

  if (entry.category === 'trait' && entry.breakpoint) {
    const style = entry.breakpointStyle ? patchBreakpointColors[entry.breakpointStyle] : null;
    return (
      <span
        className={styles.breakpointBadge}
        style={
          style
            ? ({ background: `linear-gradient(180deg, ${style.from}, ${style.to})`, color: '#111' } as CSSProperties)
            : undefined
        }
        title={`Thay đổi ở mốc kích hoạt ${entry.breakpoint}`}
      >
        Mốc {entry.breakpoint}
      </span>
    );
  }

  if (entry.category === 'augment') {
    const rarity = entry.rarity ?? entity?.rarity;
    if (!rarity) return null;
    return (
      <span className={[styles.rankBadge, styles[`rarity-${rarity}`]].join(' ')}>{patchRarityMeta[rarity].label}</span>
    );
  }

  if (entry.category === 'champion') {
    const cost = entry.cost ?? entity?.cost;
    if (!cost) return null;
    return (
      <span className={styles.rankBadge} style={{ '--icon-accent': `var(--cost-${cost})` } as CSSProperties}>
        {cost} vàng
      </span>
    );
  }

  return null;
}

/** Ghi chú "N sao" (vd Malphite "3 sao" — thay đổi chỉ áp dụng ở mốc sao đó)
 * bắt riêng ra để thay bằng asset sao vàng thật của game thay vì chữ suông —
 * dễ nhận ra ngay là huy hiệu mốc sao, không lẫn với ghi chú chữ khác. */
const STAR_NOTE_PATTERN = /^(\d)\s*sao$/i;

/** Ghi chú NGẮN theo mẫu cố định ("3 sao") mới hợp badge — câu mô tả dài
 * (lý do đổi/cơ chế) nhét vào badge bo tròn kiểu "pill" mà wrap nhiều dòng
 * nhìn như bong bóng nổi tách khỏi thẻ, vỡ khung (đã xảy ra thật kể cả khi
 * thẻ có `changes` đi kèm, vd Tâm Sắt/Iron Core). Notes dạng câu luôn xuống
 * nội dung chính của thẻ — xem chỗ gọi `entry.note` bên dưới cardHeadInner. */
function isStarNote(note: string) {
  return STAR_NOTE_PATTERN.test(note);
}

function NoteBadge({ note }: { note: string }) {
  const starMatch = note.match(STAR_NOTE_PATTERN);
  if (!starMatch) return null;
  const level = starMatch[1];
  return (
    <span className={styles.starBadge} title={`Chỉ áp dụng ở mốc ${level} sao`}>
      <Image alt={`${level} sao`} height={16} sizes="48px" src={`/set18/assets/text_icons/star${level}.png`} width={48} />
    </span>
  );
}

/** Nhãn phân biệt "Riot nói vậy" và "mình nghĩ vậy" — bắt buộc ở mọi khối diễn
 * giải để người đọc không tưởng nhận định cá nhân là thông báo chính thức. */
function OriginBadge({ origin }: { origin: PatchContentOrigin }) {
  return (
    <span className={[styles.originBadge, styles[`origin-${origin}`]].join(' ')} title={patchOriginMeta[origin].note}>
      {patchOriginMeta[origin].label}
    </span>
  );
}

export function PatchBoard({ reportId }: { reportId?: string } = {}) {
  const router = useRouter();
  const selectId = useId();
  const [category, setCategory] = useState<PatchCategory | 'all'>('all');
  const [kindFilter, setKindFilter] = useState<PatchChangeKind | 'all'>('all');
  // `reportId` đến từ route (/patch → không truyền = mới nhất; /patch/[version]
  // → truyền id bản vá cụ thể). Không dùng state nội bộ nữa: trước đây chuyển
  // bản vá chỉ đổi state, URL đứng yên nên không rank/không chia sẻ được theo
  // từng bản vá — xem plan Đợt 2.
  const report = patchReports.find((item) => item.id === reportId) ?? patchReports[0];
  const entitySet = report.entitySet ?? 18;

  /** Hai bộ lọc chồng nhau nên số đếm của mỗi bên phải tính theo bộ lọc CÒN LẠI,
   * không phải theo cả bản vá — nếu không sẽ có cảnh bấm vào ô ghi "7" mà lưới
   * hiện ra rỗng. Model thuần nằm riêng để khóa bằng unit test. */
  const { categoryCounts, kindCounts, filtered, groups } = useMemo(
    () => buildPatchBoardModel(report.entries, entitySet, category, kindFilter),
    [category, entitySet, kindFilter, report.entries],
  );

  const categoryTabs = patchCategoryOrder.map((id) => ({
    id,
    ariaLabel: `${patchCategoryTabLabel(id)}, ${categoryCounts[id]} thay đổi`,
    className: [styles.filterItem, categoryCounts[id] === 0 ? styles.filterEmpty : null].filter(Boolean).join(' '),
    label: (
      <>
        <span>{patchCategoryTabLabel(id)}</span>
        <span className={styles.filterCount}>{categoryCounts[id]}</span>
      </>
    ),
  }));

  return (
    <div className={styles.layout}>
      <aside className={styles.sidebar}>
        <div className={styles.brand}>
          <span className={styles.eyebrow}>Bản vá Set 18</span>
          <h1 className={styles.pageTitle}>Patch</h1>
        </div>

        <div className={[styles.filterBlock, styles.presentationBlock].join(' ')}>
          <PatchPresentation report={report} url={report.id === patchReports[0].id ? '/patch' : `/patch/${report.id}`} />
        </div>

        {/* Danh sách bản vá sẽ dài dần theo mùa nên dùng select: dù có vài chục
            bản, phần lọc theo nhóm bên dưới vẫn nằm nguyên trong tầm mắt. */}
        <div className={styles.filterBlock}>
          <label className={styles.filterLabel} htmlFor={selectId}>
            Chọn bản vá
          </label>
          <PatchVersionSelect
            id={selectId}
            options={patchReports.map((item) => ({ id: item.id, label: `${item.version} — ${item.dateVi}` }))}
            value={report.id}
            onChange={(id) => router.push(id === patchReports[0].id ? '/patch' : `/patch/${id}`)}
          />
          {/* Danh tính bản vá (ngày + nguồn) chỉ nói một lần ở đây; thanh đầu cột
              phải chỉ giữ con số của lượt xem hiện tại. */}
          <p className={styles.selectMeta}>
            <span>Cập nhật {report.dateVi}</span>
            {report.source ? (
              <span>
                Nguồn:{' '}
                {report.source.url ? (
                  <a className={styles.sourceLink} href={report.source.url} rel="noreferrer" target="_blank">
                    {report.source.label}
                    {' ↗'}
                  </a>
                ) : (
                  report.source.label
                )}
              </span>
            ) : (
              <span>Biên soạn: {report.author}</span>
            )}
          </p>
        </div>

        {/* Lọc theo loại thay đổi — dùng nút bật/tắt chứ không phải tablist thứ
            hai, vì một vùng nội dung chỉ nên có một tablist điều khiển nó. */}
        <div className={styles.filterBlock} role="group" aria-label="Lọc theo loại thay đổi">
          <span className={styles.filterLabel}>Lọc theo loại</span>
          <div className={styles.kindList}>
            {(['all', ...patchKindOrder] as const).map((kind) => (
              <button
                aria-pressed={kindFilter === kind}
                className={[styles.kindChip, kind === 'all' ? null : styles[kind]].filter(Boolean).join(' ')}
                key={kind}
                type="button"
                onClick={() => setKindFilter(kind)}
              >
                {kind === 'all' ? 'Tất cả' : patchKindMeta[kind].short}
                <span className={styles.filterCount}>{kindCounts[kind]}</span>
              </button>
            ))}
          </div>
        </div>

        <div className={styles.filterBlock}>
          <span className={styles.filterLabel}>Lọc theo nhóm</span>
          <Tabs
            className={styles.filterList}
            idPrefix={CATEGORY_PREFIX}
            label="Lọc bản vá theo nhóm"
            orientation="vertical"
            tabs={categoryTabs}
            value={category}
            onChange={(value) => setCategory(value as PatchCategory | 'all')}
          />
        </div>
      </aside>

      <div className={styles.main}>
        {/* Chỉ một dòng: tên bản vá, số mục đang hiện, và lối thoát khỏi bộ lọc.
            Số theo tăng/giảm đã nằm ở chip lọc bên trái nên không lặp lại ở đây. */}
        <header className={styles.head}>
          <div className={styles.headMeta}>
            <span className={styles.version}>{report.version}</span>
            <span aria-hidden="true" className={styles.dot}>•</span>
            <span className={styles.entryTotal}>{filtered.length} thay đổi</span>
            {category === 'all' ? null : (
              <button className={styles.clearFilter} type="button" onClick={() => setCategory('all')}>
                {patchCategoryTabLabel(category)} ✕
              </button>
            )}
            {kindFilter === 'all' ? null : (
              <button className={styles.clearFilter} type="button" onClick={() => setKindFilter('all')}>
                {patchKindMeta[kindFilter].label} ✕
              </button>
            )}
          </div>
        </header>

        <div
          aria-labelledby={tabElementId(CATEGORY_PREFIX, category)}
          className={styles.groups}
          id={tabPanelId(CATEGORY_PREFIX, category)}
          role="tabpanel"
        >
          {groups.length === 0 ? <p className={styles.empty}>Chưa có thay đổi nào ở nhóm này trong bản vá này.</p> : null}
          {groups.map((group) => (
            <section aria-labelledby={`${group.category}-heading`} className={styles.group} key={group.category}>
              <h2 className={styles.groupTitle} id={`${group.category}-heading`}>
                {patchCategoryMeta[group.category].label}
                <span className={styles.groupCount}>{group.entries.length}</span>
              </h2>
              {group.category === 'mechanic' ? (
                /* Cơ chế/sửa lỗi thường là một câu mô tả dài, không phải số
                   liệu ngắn — nhét vào thẻ lưới 13rem như tướng/tộc hệ thì chữ
                   bị bóp hẹp và icon viết tắt 2 chữ cái (vd "CA", "NN") không
                   nói lên được gì. Đổi sang danh sách hàng ngang full-width:
                   chấm màu theo tăng/giảm thay icon, câu mô tả đọc trọn dòng. */
                <ul className={styles.mechanicList}>
                  {group.entries.map((entry) => (
                    <li className={[styles.mechanicRow, styles[`edge-${entry.kind}`]].join(' ')} id={entryAnchorId(entry.id)} key={entry.id}>
                      <span aria-hidden="true" className={[styles.mechanicBullet, styles[`bullet-${entry.kind}`]].join(' ')} />
                      <div className={styles.mechanicBody}>
                        <p className={styles.mechanicText}>{entry.name}</p>
                        {entry.changes?.length ? (
                          <ul className={styles.changes}>
                            {entry.changes.map((change, index) => (
                              <li key={`${change.label}-${index}`}>
                                <span className={styles.changeLabel}>{change.label}</span>
                                <span className={styles.changeValues}>
                                  <span className={styles.changeFrom}>{change.from}</span>
                                  <span aria-hidden="true" className={styles.arrow}>→</span>
                                  <span className={[styles.changeTo, styles[`to-${entry.kind}`]].join(' ')}>{change.to}</span>
                                </span>
                              </li>
                            ))}
                          </ul>
                        ) : null}
                      </div>
                      <span className={[styles.kindTag, styles.mechanicKindTag, styles[entry.kind]].join(' ')}>
                        {patchKindMeta[entry.kind].label}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className={styles.cards}>
                  {group.entries.map((entry) => {
                    const name = resolveDisplayName(entry, entitySet);
                    // Chỉ tướng/tộc hệ/nâng cấp/Tinh Linh Set 18 mới có trang codex để
                    // trỏ tới — bản vá mùa khác hoặc mục "mechanic" giữ nguyên không link.
                    const entityHref = set18EntityUrl(entry.entityId);
                    const hasChanges = !!entry.changes?.length;
                    // Ghi chú CẢ CÂU (mô tả cơ chế/lý do đổi) mà nhét vào badge bo
                    // tròn kiểu "pill" thì wrap nhiều dòng nhìn như bong bóng nổi
                    // tách khỏi thẻ, vỡ khung — kể cả khi thẻ VẪN CÓ `changes` đi
                    // kèm (vd Tâm Sắt/Iron Core: có số liệu HP nhưng note đổi mốc
                    // xuất hiện vẫn tràn badge). Chỉ note NGẮN dạng "N sao" mới hợp
                    // badge (xem isStarNote/NoteBadge); mọi note câu dài luôn xuống
                    // nội dung chính của thẻ, không phụ thuộc có/không có changes.
                    const noteIsStar = entry.note ? isStarNote(entry.note) : false;
                    const cardHeadInner = (
                      <>
                        <EntryIcon entry={entry} entitySet={entitySet} />
                        <div className={styles.cardHeadText}>
                          <h3 className={styles.name}>
                            {name.vi}
                            {name.en ? <span className={styles.nameEn}> {name.en}</span> : null}
                          </h3>
                          <span className={styles.cardTags}>
                            <RankBadge entry={entry} entitySet={entitySet} />
                            {entry.note && noteIsStar ? <NoteBadge note={entry.note} /> : null}
                            <span className={[styles.kindTag, styles[entry.kind]].join(' ')}>
                              {patchKindMeta[entry.kind].label}
                            </span>
                          </span>
                        </div>
                      </>
                    );
                    return (
                    <article
                      className={[styles.card, styles[`edge-${entry.kind}`]].join(' ')}
                      id={entryAnchorId(entry.id)}
                      key={entry.id}
                    >
                      {entityHref ? (
                        <Link className={styles.cardHead} href={entityHref}>
                          {cardHeadInner}
                        </Link>
                      ) : (
                        <div className={styles.cardHead}>{cardHeadInner}</div>
                      )}

                      {entry.note && !noteIsStar ? <p className={styles.mechanicText}>{entry.note}</p> : null}

                      {hasChanges ? (
                        <ul className={styles.changes}>
                          {entry.changes!.map((change, index) => (
                            <li key={`${change.label}-${index}`}>
                              <span className={styles.changeLabel}>{change.label}</span>
                              <span className={styles.changeValues}>
                                <span className={styles.changeFrom}>{change.from}</span>
                                <span aria-hidden="true" className={styles.arrow}>→</span>
                                <span className={[styles.changeTo, styles[`to-${entry.kind}`]].join(' ')}>{change.to}</span>
                              </span>
                            </li>
                          ))}
                        </ul>
                      ) : !entry.note ? (
                        <span className={styles.mechanicLabel}>Không có chỉ số trước/sau</span>
                      ) : null}
                    </article>
                    );
                  })}
                </div>
              )}
            </section>
          ))}
        </div>

        {/* Đọc sâu — phần trên chỉ có thay đổi, mọi diễn giải dồn xuống đây và ở
            cấp ĐỘI HÌNH: một nhận định nối nhiều thay đổi lại thành kết luận
            "bài này mạnh lên hay yếu đi", thay vì chú thích rời cho từng dòng. */}
        <section aria-labelledby="patch-analysis-heading" className={styles.analysis}>
          <header className={styles.analysisHead}>
            <span className={styles.analysisEyebrow}>Đọc sâu</span>
            <h2 id="patch-analysis-heading">Bản vá này ảnh hưởng gì tới game</h2>
            <p>
              Phần trên là số liệu gốc của bản vá. Từ đây trở xuống là diễn giải — mỗi khối đều có nhãn cho biết đó là
              nội dung chính thức hay nhận định cá nhân.
            </p>
          </header>

          <div className={styles.contextGrid}>
            <article className={[styles.contextCard, styles[`edge-${report.summaryOrigin ?? 'official'}`]].join(' ')}>
              <div className={styles.contextHead}>
                <h3>Tóm tắt phiên bản</h3>
                <OriginBadge origin={report.summaryOrigin ?? 'official'} />
              </div>
              <p>{report.summaryVi}</p>
            </article>
            {report.rhythmVi?.length ? (
              <article className={[styles.contextCard, styles['edge-analysis']].join(' ')}>
                <div className={styles.contextHead}>
                  <h3>Nhịp chỉnh sửa</h3>
                  <OriginBadge origin="analysis" />
                </div>
                <ul className={styles.rhythmList}>
                  {report.rhythmVi.map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
              </article>
            ) : null}
          </div>

          {report.impacts?.length ? (
            <>
              <div className={styles.impactHead}>
                <h3 id="patch-impact-heading">Tác động tới đội hình</h3>
                <OriginBadge origin="analysis" />
              </div>
              <div aria-labelledby="patch-impact-heading" className={styles.impactGrid}>
                {report.impacts.map((impact) => {
                  const related = (impact.relatedEntryIds ?? [])
                    .map((id) => report.entries.find((entry) => entry.id === id))
                    .filter((entry): entry is PatchEntry => Boolean(entry));
                  return (
                    <article
                      className={[styles.impactCard, styles[`dir-${impact.direction}`]].join(' ')}
                      id={impactAnchorId(impact.id)}
                      key={impact.id}
                    >
                      <div className={styles.impactTop}>
                        <span className={styles.impactDir}>
                          <span aria-hidden="true">{patchImpactMeta[impact.direction].arrow}</span>
                          {patchImpactMeta[impact.direction].label}
                        </span>
                        <h4>{impact.title}</h4>
                      </div>
                      <p className={styles.impactVerdict}>{impact.verdict}</p>

                      {/* Các thay đổi mà nhận định này dựa vào — bấm là nhảy lên
                          đúng thẻ ở trên, khỏi phải cuộn tìm lại. */}
                      {related.length ? (
                        <ul className={styles.impactRelated}>
                          {related.map((entry) => {
                            const name = resolveDisplayName(entry, entitySet);
                            return (
                            <li key={entry.id}>
                              <a
                                className={[styles.impactChip, styles[`chip-${entry.kind}`]].join(' ')}
                                href={`#${entryAnchorId(entry.id)}`}
                              >
                                <EntryIcon entry={entry} entitySet={entitySet} size="xs" />
                                <span>
                                  {name.vi}
                                  {name.en ? <span className={styles.nameEn}> {name.en}</span> : null}
                                  {entry.note ? <span className={styles.note}> {entry.note}</span> : null}
                                </span>
                              </a>
                            </li>
                            );
                          })}
                        </ul>
                      ) : null}

                      {impact.context?.length ? (
                        <ul className={styles.impactContext}>
                          {impact.context.map((line) => (
                            <li key={line}>{line}</li>
                          ))}
                        </ul>
                      ) : null}

                      <p className={styles.impactBody}>{impact.body}</p>
                    </article>
                  );
                })}
              </div>
            </>
          ) : null}
        </section>
      </div>
    </div>
  );
}
