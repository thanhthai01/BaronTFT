'use client';

import Image from 'next/image';
import { useId, useMemo, useState, type CSSProperties } from 'react';
import { Tabs, tabElementId, tabPanelId } from '@/components/design-system/Tabs/Tabs';
import { findSet18Entity, set18EntityById } from '@/content/set18/set18-entity-index';
import {
  patchBreakpointColors,
  patchCategoryMeta,
  patchCategoryOrder,
  patchCategoryReadingOrder,
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
import type { Set18EntityKind } from '@/content/set18/set18-types';
import styles from './PatchBoard.module.css';

const CATEGORY_PREFIX = 'patch-category-';

/** Neo để chip dẫn chứng ở phần phân tích nhảy thẳng tới thẻ thay đổi tương
 * ứng; cũng là target của hiệu ứng nháy khi tới nơi. */
const entryAnchorId = (id: string) => `entry-${id}`;

/** Mỗi loại icon có "khung tự nhiên" riêng nên không dùng chung một kiểu:
 * - champion: ảnh vuông đầy khung → cover, viền tô theo màu giá tiền 1-5 vàng.
 * - trait: silhouette trắng nền trong suốt → cần plate màu hệ mới nhìn ra.
 * - augment: silhouette tối màu → cần plate radial nhuộm theo độ hiếm.
 * - item / wisp: art đã tự đủ khung hoặc nền trong suốt và đủ tương phản → để
 *   icon tràn hết ô, bỏ viền và padding (viền + padding chỉ làm icon bé lại).
 * - mechanic: icon lấy từ `text_icons/` là silhouette gần trắng, vẽ cho nền tối
 *   của game → trên thẻ nền trắng phải có plate tối mới nhìn thấy. */
type IconVariant = 'champion' | 'trait' | 'augment' | 'item' | 'wisp' | 'mechanic';

type ResolvedIcon = { src: string | null; variant: IconVariant; accent?: string; cost?: number };

const iconVariantByCategory: Record<PatchCategory, IconVariant> = {
  champion: 'champion',
  trait: 'trait',
  augment: 'augment',
  item: 'item',
  wisp: 'wisp',
  mechanic: 'mechanic',
};

function entityKind(category: PatchCategory): Set18EntityKind | null {
  if (category === 'champion' || category === 'trait' || category === 'augment' || category === 'wisp') return category;
  return null;
}

/** Chỉ tra codex khi bản vá đúng là của Set 18. Bản vá mùa cũ trùng tên tướng
 * (Gnar Set 17 là 2 vàng, Set 18 là 5 vàng) mà lấy bừa dữ liệu Set 18 thì icon
 * và màu giá tiền đều sai — thà để placeholder còn hơn hiển thị sai. */
function resolveEntity(entry: PatchEntry, entitySet: number) {
  if (entitySet !== 18) return undefined;
  const kind = entityKind(entry.category);
  if (entry.entityId) return set18EntityById.get(entry.entityId);
  return kind ? findSet18Entity(kind, entry.name) : undefined;
}

/** Tên hiển thị: tiếng Việt chuẩn từ codex (đậm) + tiếng Anh gốc (phụ), đúng
 * convention /mua-18 đang dùng cho trait/augment/wisp. Tướng không có
 * `nameVi` trong entity-index (quy ước: tên tướng luôn giữ tiếng Anh) nên
 * `en` trả về null — nơi gọi chỉ hiện 1 dòng như cũ, không đổi hành vi. */
function resolveDisplayName(entry: PatchEntry, entitySet: number): { vi: string; en: string | null } {
  const entity = resolveEntity(entry, entitySet);
  return entity?.nameVi ? { vi: entity.nameVi, en: entry.name } : { vi: entry.name, en: null };
}

/** Icon Tinh Linh của Set 18 mã hoá sẵn loại + cấp trong tên file, vd
 * `t_shopcardsicon18_misc_tier2.png`. Đọc từ đó thay vì kéo cả bảng Tinh Linh
 * vào bundle chỉ để lấy hai con số dùng cho việc xếp thứ tự. */
function wispFacetsFromIcon(icon: string | undefined) {
  const match = icon?.match(/shopcardsicon\d*_([a-z]+)_tier(\d+)/i);
  if (!match) return {};
  return { wispCategory: match[1], wispTier: Number(match[2]) };
}

function resolveIcon(entry: PatchEntry, entitySet: number): ResolvedIcon {
  const entity = resolveEntity(entry, entitySet);
  const cost = entry.cost ?? entity?.cost;
  return {
    src: entity?.icon ?? entry.icon ?? null,
    variant: iconVariantByCategory[entry.category],
    // Màu viền tướng luôn lấy từ token giá tiền để trùng với phần còn lại của
    // site; các loại khác dùng accent của codex (màu hệ / độ hiếm).
    accent: entry.category === 'champion' ? (cost ? `var(--cost-${cost})` : undefined) : entity?.accent,
    cost,
  };
}

/** Viết tắt cho placeholder: lấy chữ cái đầu của tối đa 2 từ ("Tuyệt Diệt" →
 * "TD") thay vì cắt 2 ký tự đầu ("Tu") — dễ đoán ra tên hơn. */
function initialsOf(name: string) {
  const words = name.split(/[\s'’-]+/).filter(Boolean);
  const initials = words.length > 1 ? words.slice(0, 2).map((word) => word[0]).join('') : words[0].slice(0, 2);
  return initials.toUpperCase();
}

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
        <Image alt="" height={96} src={icon.src} width={96} />
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

  if (entry.category === 'wisp') {
    const facets = wispFacetsFromIcon(entity?.icon ?? entry.icon);
    const tier = entry.wispTier ?? facets.wispTier;
    if (!tier) return null;
    return <span className={styles.rankBadge}>Cấp {tier}</span>;
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

/** Nhãn phân biệt "Riot nói vậy" và "mình nghĩ vậy" — bắt buộc ở mọi khối diễn
 * giải để người đọc không tưởng nhận định cá nhân là thông báo chính thức. */
function OriginBadge({ origin }: { origin: PatchContentOrigin }) {
  return (
    <span className={[styles.originBadge, styles[`origin-${origin}`]].join(' ')} title={patchOriginMeta[origin].note}>
      {patchOriginMeta[origin].label}
    </span>
  );
}

export function PatchBoard() {
  const selectId = useId();
  const [reportId, setReportId] = useState(patchReports[0].id);
  const [category, setCategory] = useState<PatchCategory | 'all'>('all');
  const [kindFilter, setKindFilter] = useState<PatchChangeKind | 'all'>('all');
  const report = patchReports.find((item) => item.id === reportId) ?? patchReports[0];
  const entitySet = report.entitySet ?? 18;

  /** Hai bộ lọc chồng nhau nên số đếm của mỗi bên phải tính theo bộ lọc CÒN LẠI,
   * không phải theo cả bản vá — nếu không sẽ có cảnh bấm vào ô ghi "7" mà lưới
   * hiện ra rỗng. */
  const byKind = kindFilter === 'all' ? report.entries : report.entries.filter((e) => e.kind === kindFilter);
  const byCategory = category === 'all' ? report.entries : report.entries.filter((e) => e.category === category);

  const categoryCounts = useMemo(() => {
    const base = { all: byKind.length } as Record<PatchCategory | 'all', number>;
    patchCategoryReadingOrder.forEach((key) => {
      base[key] = byKind.filter((entry) => entry.category === key).length;
    });
    return base;
  }, [byKind]);

  const kindCounts = useMemo(() => {
    const base = { all: byCategory.length } as Record<PatchChangeKind | 'all', number>;
    patchKindOrder.forEach((kind) => {
      base[kind] = byCategory.filter((entry) => entry.kind === kind).length;
    });
    return base;
  }, [byCategory]);

  const filtered = byCategory.filter((entry) => kindFilter === 'all' || entry.kind === kindFilter);

  /** Nhóm theo đúng thứ tự người ta đọc patch note, và trong mỗi nhóm thì xếp
   * theo đúng thang bậc người chơi quen dùng cho loại đó: tướng theo giá vàng,
   * nâng cấp theo Bạc → Vàng → Kim Cương, Tinh Linh theo cấp rồi tới loại, tộc
   * hệ theo mốc kích hoạt. Cùng bậc thì xếp tăng/giảm cạnh nhau để dễ so. */
  const groups = useMemo(() => {
    const kindRank = (kind: PatchChangeKind) => patchKindOrder.indexOf(kind);

    const rankOf = (entry: PatchEntry) => {
      const entity = resolveEntity(entry, entitySet);
      switch (entry.category) {
        case 'champion':
          return entry.cost ?? entity?.cost ?? 0;
        case 'augment': {
          const rarity = entry.rarity ?? entity?.rarity;
          return rarity ? patchRarityMeta[rarity].rank : 0;
        }
        case 'wisp': {
          const facets = wispFacetsFromIcon(entity?.icon ?? entry.icon);
          return entry.wispTier ?? facets.wispTier ?? entry.cost ?? 0;
        }
        case 'trait':
          return Number(entry.breakpoint ?? 0);
        default:
          return 0;
      }
    };

    // Tinh Linh cùng cấp thì gom theo loại (Chiến đấu, Vật phẩm...) cho liền mạch.
    const subRankOf = (entry: PatchEntry) => {
      if (entry.category !== 'wisp') return '';
      const entity = resolveEntity(entry, entitySet);
      return entry.wispCategory ?? wispFacetsFromIcon(entity?.icon ?? entry.icon).wispCategory ?? '';
    };

    return patchCategoryReadingOrder
      .map((key) => ({
        category: key,
        entries: filtered
          .filter((entry) => entry.category === key)
          .slice()
          .sort((a, b) => {
            const rankDiff = rankOf(a) - rankOf(b);
            if (rankDiff !== 0) return rankDiff;
            const subDiff = subRankOf(a).localeCompare(subRankOf(b));
            if (subDiff !== 0) return subDiff;
            if (a.kind !== b.kind) return kindRank(a.kind) - kindRank(b.kind);
            return a.name.localeCompare(b.name);
          }),
      }))
      .filter((group) => group.entries.length > 0);
  }, [filtered, entitySet]);

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

        {/* Danh sách bản vá sẽ dài dần theo mùa nên dùng select: dù có vài chục
            bản, phần lọc theo nhóm bên dưới vẫn nằm nguyên trong tầm mắt. */}
        <div className={styles.filterBlock}>
          <label className={styles.filterLabel} htmlFor={selectId}>
            Chọn bản vá
          </label>
          <select
            className={styles.select}
            id={selectId}
            value={reportId}
            onChange={(event) => setReportId(event.target.value)}
          >
            {patchReports.map((item) => (
              <option key={item.id} value={item.id}>
                {item.version} — {item.dateVi}
              </option>
            ))}
          </select>
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
              <div className={styles.cards}>
                {group.entries.map((entry) => {
                  const name = resolveDisplayName(entry, entitySet);
                  return (
                  <article
                    className={[styles.card, styles[`edge-${entry.kind}`]].join(' ')}
                    id={entryAnchorId(entry.id)}
                    key={entry.id}
                  >
                    <div className={styles.cardHead}>
                      <EntryIcon entry={entry} entitySet={entitySet} />
                      <div className={styles.cardHeadText}>
                        <h3 className={styles.name}>
                          {name.vi}
                          {name.en ? <span className={styles.nameEn}> {name.en}</span> : null}
                          {entry.note ? <span className={styles.note}> {entry.note}</span> : null}
                        </h3>
                        <span className={styles.cardTags}>
                          <RankBadge entry={entry} entitySet={entitySet} />
                          <span className={[styles.kindTag, styles[entry.kind]].join(' ')}>
                            {patchKindMeta[entry.kind].label}
                          </span>
                        </span>
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
                              <span className={[styles.changeTo, styles[`to-${entry.kind}`]].join(' ')}>{change.to}</span>
                            </span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <span className={styles.mechanicLabel}>Không có chỉ số trước/sau</span>
                    )}
                  </article>
                  );
                })}
              </div>
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
                    <article className={[styles.impactCard, styles[`dir-${impact.direction}`]].join(' ')} key={impact.id}>
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
