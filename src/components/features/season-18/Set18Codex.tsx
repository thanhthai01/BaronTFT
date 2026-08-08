'use client';

import gsap from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import { set18Costs, set18Sections, set18TraitTypes, type Set18SectionId } from '@/content/set18/set18-meta';
import type {
  Set18Augment,
  Set18Champion,
  Set18CostMeta,
  Set18Trait,
  Set18TraitType,
  Set18Wisp,
} from '@/content/set18/set18-types';
import type { Set18EffectCategory, Set18EffectSource } from '@/content/set18-effects';
import { buildSlugRefMap } from '@/content/set18/set18-slug-index';
import styles from './Set18Codex.module.css';

gsap.registerPlugin(ScrollToPlugin);
import { AugmentCard } from './cards/AugmentCard';
import { ChampionCard, MIN_CARD_HEIGHT } from './cards/ChampionCard';
import { CostPill, TraitIcon, traitTitle } from './cards/shared';
import { TraitCard } from './cards/TraitCard';
import { WispCard } from './cards/WispCard';

let set18Traits: Set18Trait[] = [];
let set18Champions: Set18Champion[] = [];
let set18Wisps: Set18Wisp[] = [];
let set18Augments: Set18Augment[] = [];
let set18EffectCategories: Set18EffectCategory[] = [];
let set18TraitByName = new Map<string, Set18Trait>();
let set18ChampionByName = new Map<string, Set18Champion>();
/** Khóa bằng `nameVi` chứ không phải `name`: cột tên tiếng Anh trong set18-wisps.ts đang lệch
 * hàng so với phần tiếng Việt (lỗi ghép cặp từ lúc scrape), nên chỉ `nameVi` là tham chiếu tin
 * cậy. 3 Tinh Linh trùng `nameVi` — giữ bản xuất hiện trước, đủ dùng vì set18-effects.ts không
 * trỏ tới cái nào trong số đó. */
let set18WispByNameVi = new Map<string, Set18Wisp>();

/** slug theo tham chiếu object — chỉ nạp khi section đó thật sự cần (xem
 * loadSectionData), dùng để gắn id DOM cho search (?focus=slug) cuộn tới đúng
 * thẻ. Rỗng nếu chưa nạp — card khi đó chỉ đơn giản không có id, không lỗi. */
let set18ChampionSlugByRef = new Map<Set18Champion, string>();
let set18TraitSlugByRef = new Map<Set18Trait, string>();
let set18WispSlugByRef = new Map<Set18Wisp, string>();
let set18AugmentSlugByRef = new Map<Set18Augment, string>();

const SECTIONS = set18Sections;
type SectionId = Set18SectionId;

/** Tiền tố id DOM mỗi card tự gắn (xem ChampionCard/TraitCard/WispCard/AugmentCard
 * trong cards/) — dùng để tìm đúng thẻ cần cuộn tới khi tới từ search ?focus=slug.
 * Section không có ở đây (ma-tran-toc-he, hieu-ung) không phải lưới card đơn lẻ
 * theo slug nên không hỗ trợ focus. */
const FOCUS_ID_PREFIX: Partial<Record<SectionId, string>> = {
  'chi-tiet-tuong': 'champion',
  'chi-tiet-toc-he': 'trait',
  'tinh-linh': 'wisp',
  'nang-cap': 'augment',
};

function traitLabel(name: string) {
  const trait = set18TraitByName.get(name);
  return trait ? `${trait.vi} (${trait.name})` : name;
}

type TooltipState = { champion: Set18Champion; x: number; y: number } | null;

function ChampionTooltip({ state }: { state: TooltipState }) {
  if (!state) return null;
  const { champion, x, y } = state;

  return (
    <div className={styles.tooltip} role="tooltip" style={{ left: `${x}px`, top: `${y}px`, borderColor: champion.costColor }}>
      <div className={styles.tooltipHead}>
        <Image
          alt=""
          className={styles.tooltipPortrait}
          height={48}
          src={champion.image}
          style={{ borderColor: champion.costColor }}
          width={48}
        />
        <div>
          <strong>{champion.name}</strong>
          <span className={styles.tooltipMeta}>
            <CostPill color={champion.costColor} cost={champion.cost} />
            {champion.range ? ` · ${champion.range}` : ''}
          </span>
        </div>
      </div>
      <p className={styles.tooltipTraits}>{champion.traits.map(traitLabel).join(' · ')}</p>
      <p className={styles.tooltipAbility}>
        <strong>{champion.abilityNameVi || champion.abilityName}</strong>
        <span className={styles.tooltipMana}> · {champion.mana} mana</span>
      </p>
      <p className={styles.tooltipText}>{champion.abilityVi}</p>
    </div>
  );
}

function ChampionLogo({
  champion,
  size,
  image,
  onShow,
  onHide,
}: {
  champion: Set18Champion;
  size: number;
  /** Ghi đè ảnh hiển thị (vd icon riêng của 1 dạng Lux) — tooltip vẫn dùng dữ liệu kỹ năng gốc của champion. */
  image?: string;
  onShow: (champion: Set18Champion, x: number, y: number) => void;
  onHide: () => void;
}) {
  const show = (target: HTMLElement) => {
    const rect = target.getBoundingClientRect();
    onShow(champion, rect.right, rect.bottom);
  };

  return (
    <button
      aria-label={`Xem nhanh ${champion.name} — ${champion.costLabel}`}
      className={styles.champLogo}
      onBlur={onHide}
      onFocus={(event) => show(event.currentTarget)}
      onPointerEnter={(event) => show(event.currentTarget)}
      onPointerLeave={onHide}
      style={{ borderColor: champion.costColor, width: size, height: size }}
      title={`${champion.name} — ${champion.costLabel}`}
      type="button"
    >
      <Image alt="" className={styles.champLogoImage} height={size} src={image ?? champion.image} width={size} />
    </button>
  );
}

function SynergyMatrix({
  onShow,
  onHide,
}: {
  onShow: (champion: Set18Champion, x: number, y: number) => void;
  onHide: () => void;
}) {
  const [hover, setHover] = useState<{ row: number; col: number } | null>(null);
  const { classes, gridMap, matrixOrigins, specialChampions } = useMemo(() => {
    const origins = set18Traits.filter((trait) => trait.type === 'Origin');
    const classTraits = set18Traits.filter((trait) => trait.type === 'Class');
    const matrix: Set18Champion[][][] = origins.map(() => classTraits.map(() => []));
    const special: { champion: Set18Champion; uniqueTrait: Set18Trait | null }[] = [];

    for (const champion of set18Champions) {
      const championOrigins = champion.traits.filter((name) => set18TraitByName.get(name)?.type === 'Origin');
      const championClasses = champion.traits.filter((name) => set18TraitByName.get(name)?.type === 'Class');
      if (championOrigins.length === 0 || championClasses.length === 0) {
        const reasonName =
          champion.traits.find((name) => set18TraitByName.get(name)?.type === 'Unique') ?? champion.traits[0];
        special.push({ champion, uniqueTrait: reasonName ? (set18TraitByName.get(reasonName) ?? null) : null });
        continue;
      }
      for (const originName of championOrigins) {
        const originIndex = origins.findIndex((trait) => trait.name === originName);
        for (const className of championClasses) {
          const classIndex = classTraits.findIndex((trait) => trait.name === className);
          if (originIndex >= 0 && classIndex >= 0) matrix[originIndex][classIndex].push(champion);
        }
      }
    }

    return {
      classes: classTraits,
      gridMap: matrix,
      matrixOrigins: origins
        .map((trait, rowIndex) => ({ trait, rowIndex }))
        .filter(({ rowIndex }) => matrix[rowIndex].some((cell) => cell.length > 0)),
      specialChampions: special,
    };
  }, []);

  return (
    <section className={styles.section} id="ma-tran-toc-he">
      <header className={styles.sectionHead}>
        <span className={styles.eyebrow}>01 · Ma trận</span>
        <h2>Ma trận tộc hệ</h2>
      </header>

      <div className={styles.matrixWrap} style={{ '--matrix-rows': matrixOrigins.length } as CSSProperties}>
        <table className={styles.matrix}>
          <thead>
            <tr>
              <th className={styles.corner} scope="col">
                Tộc ╲ Hệ
              </th>
              {classes.map((trait, colIndex) => (
                <th
                  className={`${styles.colHead} ${hover?.col === colIndex ? styles.headActive : ''}`}
                  key={trait.name}
                  scope="col"
                  title={traitTitle(trait)}
                >
                  <TraitIcon trait={trait} />
                  <span className={styles.headLabel}>{trait.vi}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {matrixOrigins.map(({ trait: originTrait, rowIndex }) => (
              <tr key={originTrait.name}>
                <th
                  className={`${styles.rowHead} ${hover?.row === rowIndex ? styles.headActive : ''}`}
                  scope="row"
                  title={traitTitle(originTrait)}
                >
                  <span className={styles.rowHeadInner}>
                    <TraitIcon size={20} trait={originTrait} />
                    <span className={styles.headLabel}>{originTrait.vi}</span>
                  </span>
                </th>
                {classes.map((classTrait, colIndex) => {
                  const cellChampions = gridMap[rowIndex][colIndex];
                  const isCross = hover?.row === rowIndex || hover?.col === colIndex;
                  return (
                    <td
                      className={`${styles.cell} ${isCross ? styles.cellCross : ''} ${
                        cellChampions.length ? '' : styles.cellEmpty
                      }`}
                      key={classTrait.name}
                      onMouseEnter={() => setHover({ row: rowIndex, col: colIndex })}
                      onMouseLeave={() => setHover(null)}
                    >
                      {cellChampions.length ? (
                        <div className={styles.cellChamps}>
                          {cellChampions.map((champion) => (
                            <ChampionLogo champion={champion} key={champion.name} onHide={onHide} onShow={onShow} size={42} />
                          ))}
                        </div>
                      ) : null}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className={styles.specialBox}>
        <h3>Tướng đứng ngoài ma trận</h3>
        <p>Những tướng chỉ mang trait Đặc biệt (Unique) nên không nằm ở giao điểm tộc × hệ nào.</p>
        <div className={styles.specialList}>
          {specialChampions.map(({ champion, uniqueTrait }) => (
            <div className={styles.specialItem} key={champion.name}>
              <ChampionLogo champion={champion} onHide={onHide} onShow={onShow} size={48} />
              <div>
                <strong>{champion.name}</strong>
                {uniqueTrait ? (
                  <span
                    className={styles.specialTrait}
                    style={{ '--trait-accent': uniqueTrait.accent, '--trait-accent-soft': uniqueTrait.accentSoft } as CSSProperties}
                  >
                    <TraitIcon size={16} trait={uniqueTrait} />
                    {uniqueTrait.vi}
                  </span>
                ) : (
                  <span className={styles.specialTrait}>Thiếu tộc hoặc hệ</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

type ChampionCostGroup = Set18CostMeta & { champions: Set18Champion[] };

type DragState = { startX: number; startScrollLeft: number; scrollPerPx: number };

/** Bọc 1 hàng chip lọc để cuộn ngang bằng thanh cuộn tự vẽ (mảnh, màu accent, kéo
 * được) thay cho scrollbar mặc định của trình duyệt — ẩn hẳn scrollbar gốc bằng
 * CSS (`.scrollableRowInner`) rồi vẽ track/thumb riêng, đồng bộ vị trí qua
 * ResizeObserver + sự kiện scroll thay vì dùng React state để tránh re-render. */
function ScrollableRow({ children }: { children: React.ReactNode }) {
  const barRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<DragState | null>(null);

  const syncThumb = useCallback(() => {
    const bar = barRef.current;
    const track = trackRef.current;
    const thumb = thumbRef.current;
    if (!bar || !track || !thumb) return;
    const { scrollWidth, clientWidth, scrollLeft } = bar;
    const overflow = scrollWidth - clientWidth > 1;
    track.style.opacity = overflow ? '1' : '0';
    track.style.pointerEvents = overflow ? 'auto' : 'none';
    if (!overflow) return;
    const thumbWidthPct = Math.max((clientWidth / scrollWidth) * 100, 10);
    const maxScroll = scrollWidth - clientWidth;
    const scrollRatio = maxScroll > 0 ? scrollLeft / maxScroll : 0;
    thumb.style.width = `${thumbWidthPct}%`;
    thumb.style.left = `${scrollRatio * (100 - thumbWidthPct)}%`;
  }, []);

  useLayoutEffect(() => {
    syncThumb();
    const bar = barRef.current;
    if (!bar) return;
    const observer = new ResizeObserver(syncThumb);
    observer.observe(bar);
    window.addEventListener('resize', syncThumb);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', syncThumb);
    };
  });

  const onThumbPointerDown = useCallback((event: React.PointerEvent<HTMLDivElement>) => {
    const bar = barRef.current;
    const track = trackRef.current;
    const thumb = thumbRef.current;
    if (!bar || !track || !thumb) return;
    const maxScroll = bar.scrollWidth - bar.clientWidth;
    const draggableRangePx = track.clientWidth - thumb.offsetWidth;
    dragRef.current = {
      startX: event.clientX,
      startScrollLeft: bar.scrollLeft,
      scrollPerPx: draggableRangePx > 0 ? maxScroll / draggableRangePx : 0,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  }, []);

  const onThumbPointerMove = useCallback((event: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    const bar = barRef.current;
    if (!drag || !bar) return;
    bar.scrollLeft = drag.startScrollLeft + (event.clientX - drag.startX) * drag.scrollPerPx;
  }, []);

  const onThumbPointerUp = useCallback((event: React.PointerEvent<HTMLDivElement>) => {
    dragRef.current = null;
    event.currentTarget.releasePointerCapture(event.pointerId);
  }, []);

  return (
    <div className={styles.scrollableRow}>
      <div className={styles.scrollableRowInner} onScroll={syncThumb} ref={barRef}>
        {children}
      </div>
      <div className={styles.filterScrollTrack} ref={trackRef}>
        <div
          className={styles.filterScrollThumb}
          onPointerDown={onThumbPointerDown}
          onPointerMove={onThumbPointerMove}
          onPointerUp={onThumbPointerUp}
          ref={thumbRef}
        />
      </div>
    </div>
  );
}

/** Bộ lọc giá vàng — dùng chung cho khối trong mục lục trái (desktop) và khối dự
 * phòng trong nội dung chính (mobile, khi mục lục trái bị ẩn). */
function ChampionCostFilter({
  costFilter,
  groups,
  onChange,
}: {
  costFilter: number | 'all';
  groups: ChampionCostGroup[];
  onChange: (value: number | 'all') => void;
}) {
  return (
    <>
      <button aria-pressed={costFilter === 'all'} className={styles.filterChip} onClick={() => onChange('all')} type="button">
        <span className={styles.filterChipLabel}>Tất cả ({set18Champions.length})</span>
      </button>
      {groups.map((group) => (
        <button
          aria-pressed={costFilter === group.cost}
          className={styles.filterChip}
          key={group.cost}
          onClick={() => onChange(group.cost)}
          type="button"
        >
          <i className={styles.legendDot} style={{ background: group.color }} />
          <span className={styles.filterChipLabel}>
            {group.label} ({group.champions.length})
          </span>
        </button>
      ))}
    </>
  );
}

/** Bộ lọc Tộc/Hệ/Đặc biệt — dùng chung cho khối trong mục lục trái và khối dự
 * phòng trong nội dung chính (mobile). */
function TraitTypeFilter({
  typeFilter,
  onChange,
}: {
  typeFilter: Set18TraitType | 'all';
  onChange: (value: Set18TraitType | 'all') => void;
}) {
  return (
    <>
      <button aria-pressed={typeFilter === 'all'} className={styles.filterChip} onClick={() => onChange('all')} type="button">
        <span className={styles.filterChipLabel}>Tất cả ({set18Traits.length})</span>
      </button>
      {set18TraitTypes.map((group) => (
        <button
          aria-pressed={typeFilter === group.type}
          className={styles.filterChip}
          key={group.type}
          onClick={() => onChange(group.type)}
          type="button"
        >
          <i className={styles.legendDot} style={{ background: group.accent }} />
          <span className={styles.filterChipLabel}>
            {group.vi} ({set18Traits.filter((trait) => trait.type === group.type).length})
          </span>
        </button>
      ))}
    </>
  );
}

/** Mỗi thẻ tướng tự đo chiều cao theo nội dung riêng của nó (xem useLayoutEffect
 * trong ChampionCard — mặt trước/sau lật 3D nằm absolute nên không thể tự auto-
 * height qua CSS, phải đo bằng JS). Bọc thêm 1 lớp effect ở đây, chạy SAU effect
 * của từng thẻ con (React flush layout effect từ con lên cha), để kéo toàn bộ thẻ
 * trong cùng 1 khối giá vàng về chung chiều cao = max của khối đó — tương tự cách
 * .wispCard tự nhiên bằng chiều cao nhờ CSS grid stretch, nhưng thẻ tướng cần làm
 * tay vì chiều cao vốn đã bị JS ghi đè (style.height), CSS align-items không còn
 * tác dụng nữa. */
/** Mọi thẻ dùng chung một chiều cao: chiều cao của thẻ có nội dung dài nhất.
 *
 * Đọc `data-natural-height` (nhu cầu nội dung thật, do từng thẻ tự công bố) chứ
 * KHÔNG đọc getBoundingClientRect: rect trả về đúng chiều cao mà chính effect
 * này vừa gán ở lần chạy trước, nên chuẩn chung sẽ chỉ tăng chứ không bao giờ
 * giảm — một lần đo hụt lúc font chưa tải xong là khoá luôn con số phồng đó,
 * và nội dung có rút ngắn về sau cũng không thu lại được. */
function ChampionCostGrid({ champions }: { champions: Set18Champion[] }) {
  const gridRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;
    const cards = Array.from(grid.querySelectorAll<HTMLElement>('[data-flip-card]'));
    if (!cards.length) return;
    const maxHeight = cards.reduce(
      (max, card) => Math.max(max, Number(card.dataset.naturalHeight) || 0),
      MIN_CARD_HEIGHT,
    );
    cards.forEach((card) => {
      card.style.height = `${maxHeight}px`;
    });
  });

  return (
    <div className={styles.championGrid} ref={gridRef}>
      {champions.map((champion) => (
        <ChampionCard
          champion={champion}
          id={set18ChampionSlugByRef.has(champion) ? `champion-${set18ChampionSlugByRef.get(champion)}` : undefined}
          key={champion.name}
          traitByName={set18TraitByName}
        />
      ))}
    </div>
  );
}

function ChampionDetails({ costFilter, grouped }: { costFilter: number | 'all'; grouped: ChampionCostGroup[] }) {
  return (
    <section className={styles.section} id="chi-tiet-tuong">
      <header className={styles.sectionHead}>
        <span className={styles.eyebrow}>02 · Tướng</span>
        <h2>Chi tiết tướng</h2>
      </header>

      {grouped
        .filter((group) => costFilter === 'all' || costFilter === group.cost)
        .map((group) => (
          <div className={styles.costGroup} key={group.cost}>
            <h3 className={styles.groupHeading} style={{ borderColor: group.color }}>
              <i className={styles.legendDot} style={{ background: group.color }} />
              {group.label}
              <span>{group.champions.length} tướng</span>
            </h3>
            <ChampionCostGrid champions={group.champions} />
          </div>
        ))}
    </section>
  );
}

function TraitDetails({
  onShow,
  onHide,
  typeFilter,
}: {
  onShow: (champion: Set18Champion, x: number, y: number) => void;
  onHide: () => void;
  typeFilter: Set18TraitType | 'all';
}) {
  return (
    <section className={styles.section} id="chi-tiet-toc-he">
      <header className={styles.sectionHead}>
        <span className={styles.eyebrow}>03 · Tộc hệ</span>
        <h2>Chi tiết tộc hệ</h2>
        <p>
          {set18Traits.length} trait của Set 18, kèm mốc kích hoạt và toàn bộ tướng thuộc trait đó (sắp theo giá vàng).
          Rê chuột vào logo tướng để xem chi tiết kỹ năng.
        </p>
      </header>

      {set18TraitTypes
        .filter((group) => typeFilter === 'all' || typeFilter === group.type)
        .map((group) => {
          const traits = set18Traits.filter((trait) => trait.type === group.type);
          return (
          <div className={styles.traitGroup} key={group.type}>
            <h3 className={styles.groupHeading} style={{ borderColor: group.accent }}>
              {group.vi} ({group.en})<span>{group.note}</span>
            </h3>
            <div className={styles.traitGrid}>
              {traits.map((trait) => (
                <TraitCard
                  championNames={trait.champions}
                  id={set18TraitSlugByRef.has(trait) ? `trait-${set18TraitSlugByRef.get(trait)}` : undefined}
                  key={trait.name}
                  renderChampion={(name) => {
                    const champion = set18ChampionByName.get(name);
                    if (!champion) return null;
                    return <ChampionLogo champion={champion} key={name} onHide={onHide} onShow={onShow} size={30} />;
                  }}
                  trait={trait}
                />
              ))}
            </div>
          </div>
        );
      })}
    </section>
  );
}

const WISP_CATEGORY_ORDER = ['Combat', 'Misc', 'Shop', 'Risky', 'Champion', 'GoldXP', 'Item'] as const;

type WispCategoryGroup = { category: string; categoryVi: string; items: Set18Wisp[] };

/** Bộ lọc phân loại Tinh Linh — dùng chung cho khối trong mục lục trái và khối dự
 * phòng trong nội dung chính (mobile). */
function WispCategoryFilter({
  categoryFilter,
  groups,
  onChange,
}: {
  categoryFilter: string | 'all';
  groups: WispCategoryGroup[];
  onChange: (value: string | 'all') => void;
}) {
  return (
    <>
      <button aria-pressed={categoryFilter === 'all'} className={styles.filterChip} onClick={() => onChange('all')} type="button">
        <span className={styles.filterChipLabel}>Tất cả ({set18Wisps.length})</span>
      </button>
      {groups.map((group) => (
        <button
          aria-pressed={categoryFilter === group.category}
          className={styles.filterChip}
          key={group.category}
          onClick={() => onChange(group.category)}
          type="button"
        >
          <span className={styles.filterChipLabel}>
            {group.categoryVi} ({group.items.length})
          </span>
        </button>
      ))}
    </>
  );
}

function WispSection({
  categoryFilter,
  groups,
  focusSlug,
}: {
  categoryFilter: string | 'all';
  groups: WispCategoryGroup[];
  focusSlug: string | null;
}) {
  const batchSize = 48;
  const [visibleCount, setVisibleCount] = useState(batchSize);
  const visible = groups.filter((group) => categoryFilter === 'all' || categoryFilter === group.category);
  const total = visible.reduce((sum, group) => sum + group.items.length, 0);
  const visibleNames = new Set(visible.flatMap((group) => group.items).slice(0, visibleCount).map((wisp) => wisp.name));
  const batchedGroups = visible
    .map((group) => ({ ...group, items: group.items.filter((wisp) => visibleNames.has(wisp.name)) }))
    .filter((group) => group.items.length > 0);

  useEffect(() => setVisibleCount(batchSize), [categoryFilter]);

  // Tới từ search (?focus=slug): nếu Tinh Linh đó nằm ngoài batch 48 đang hiện,
  // hiện thêm đủ để nó lọt vào DOM — nếu không, hiệu ứng cuộn của Set18Codex tìm
  // document.getElementById() sẽ ra null (phần tử chưa từng render), search tới
  // đúng trang nhưng không cuộn tới thẻ.
  useEffect(() => {
    if (!focusSlug) return;
    const targetIndex = visible.flatMap((group) => group.items).findIndex((wisp) => set18WispSlugByRef.get(wisp) === focusSlug);
    if (targetIndex >= 0) setVisibleCount((count) => Math.max(count, targetIndex + 1));
  }, [focusSlug, visible]);

  return (
    <section className={styles.section} id="tinh-linh">
      <header className={styles.sectionHead}>
        <span className={styles.eyebrow}>04 · Tinh Linh</span>
        <h2>Tinh Linh (Wisp)</h2>
        <p>{set18Wisps.length} Tinh Linh Set 18, nhóm theo loại hiệu ứng và xếp từ rẻ đến đắt trong mỗi nhóm.</p>
      </header>

      {batchedGroups.map((group) => (
        <div className={styles.wispGroup} key={group.category}>
          <h3 className={styles.groupHeading}>
            {group.categoryVi}
            <span>{visible.find((item) => item.category === group.category)?.items.length ?? group.items.length} Tinh Linh</span>
          </h3>
          <div className={styles.wispGrid}>
            {group.items.map((wisp) => (
              <WispCard
                id={set18WispSlugByRef.has(wisp) ? `wisp-${set18WispSlugByRef.get(wisp)}` : undefined}
                key={wisp.name}
                wisp={wisp}
              />
            ))}
          </div>
        </div>
      ))}

      <div className={styles.batchControls}>
        <span aria-live="polite">Đang hiển thị {Math.min(visibleCount, total)} / {total} Tinh Linh</span>
        {visibleCount < total ? (
          <>
            <button onClick={() => setVisibleCount((count) => Math.min(total, count + batchSize))} type="button">
              Hiển thị thêm {Math.min(batchSize, total - visibleCount)}
            </button>
            <button onClick={() => setVisibleCount(total)} type="button">Hiển thị tất cả</button>
          </>
        ) : null}
      </div>
    </section>
  );
}

const AUGMENT_RARITIES = ['Silver', 'Gold', 'Prismatic'] as const;
const AUGMENT_CATEGORY_ORDER = ['Economic', 'Items', 'Trait', 'Reroll', 'Random', 'Other'] as const;

type AugmentCategoryGroup = { category: string; categoryVi: string; items: Set18Augment[] };

/** Bộ lọc nâng cấp — gộp độ hiếm + phân loại vào 1 hàng chip duy nhất thay vì 2
 * hàng có nhãn riêng, để dùng chung ScrollableRow (thanh cuộn tự vẽ) như mọi
 * mục khác thay vì phải tự vẽ 2 track cuộn độc lập. Chỉ 1 chip "Tất cả" dùng
 * chung, reset cả 2 bộ lọc cùng lúc; chip độ hiếm (có chấm màu) và chip phân
 * loại (không có chấm màu) vẫn set 2 state độc lập như trước — AugmentDetails
 * lọc kết hợp cả 2 (AND). */
function AugmentFilterRow({
  rarityFilter,
  categoryFilter,
  groups,
  onRarityChange,
  onCategoryChange,
}: {
  rarityFilter: Set18Augment['rarity'] | 'all';
  categoryFilter: string | 'all';
  groups: AugmentCategoryGroup[];
  onRarityChange: (value: Set18Augment['rarity'] | 'all') => void;
  onCategoryChange: (value: string | 'all') => void;
}) {
  const isAll = rarityFilter === 'all' && categoryFilter === 'all';

  return (
    <>
      <button
        aria-pressed={isAll}
        className={styles.filterChip}
        onClick={() => {
          onRarityChange('all');
          onCategoryChange('all');
        }}
        type="button"
      >
        <span className={styles.filterChipLabel}>Tất cả ({set18Augments.length})</span>
      </button>
      {AUGMENT_RARITIES.map((rarity) => {
        const count = set18Augments.filter((a) => a.rarity === rarity).length;
        const color = set18Augments.find((a) => a.rarity === rarity)?.rarityColor;
        return (
          <button
            aria-pressed={rarityFilter === rarity}
            className={styles.filterChip}
            key={rarity}
            onClick={() => onRarityChange(rarity)}
            type="button"
          >
            <i className={styles.legendDot} style={{ background: color }} />
            <span className={styles.filterChipLabel}>
              {rarity} ({count})
            </span>
          </button>
        );
      })}
      {groups.map((group) => (
        <button
          aria-pressed={categoryFilter === group.category}
          className={styles.filterChip}
          key={group.category}
          onClick={() => onCategoryChange(group.category)}
          type="button"
        >
          <span className={styles.filterChipLabel}>
            {group.categoryVi} ({group.items.length})
          </span>
        </button>
      ))}
    </>
  );
}

function AugmentDetails({
  rarityFilter,
  categoryFilter,
  focusSlug,
}: {
  rarityFilter: Set18Augment['rarity'] | 'all';
  categoryFilter: string | 'all';
  focusSlug: string | null;
}) {
  const batchSize = 48;
  const [visibleCount, setVisibleCount] = useState(batchSize);
  const filtered = set18Augments.filter(
    (a) => (rarityFilter === 'all' || a.rarity === rarityFilter) && (categoryFilter === 'all' || a.category === categoryFilter),
  );
  const visible = filtered.slice(0, visibleCount);

  useEffect(() => setVisibleCount(batchSize), [categoryFilter, rarityFilter]);

  // Tới từ search (?focus=slug): xem giải thích ở WispSection — cùng lý do,
  // hiện thêm đủ để nâng cấp cần cuộn tới lọt vào DOM trước khi hiệu ứng cuộn
  // của Set18Codex chạy.
  useEffect(() => {
    if (!focusSlug) return;
    const targetIndex = filtered.findIndex((augment) => set18AugmentSlugByRef.get(augment) === focusSlug);
    if (targetIndex >= 0) setVisibleCount((count) => Math.max(count, targetIndex + 1));
  }, [focusSlug, filtered]);

  return (
    <section className={styles.section} id="nang-cap">
      <header className={styles.sectionHead}>
        <span className={styles.eyebrow}>05 · Nâng cấp</span>
        <h2>Nâng cấp (Augment)</h2>
      </header>

      <div className={styles.augmentGrid}>
        {visible.map((augment) => (
          <AugmentCard
            augment={augment}
            id={set18AugmentSlugByRef.has(augment) ? `augment-${set18AugmentSlugByRef.get(augment)}` : undefined}
            key={augment.icon}
          />
        ))}
      </div>

      <div className={styles.batchControls}>
        <span aria-live="polite">Đang hiển thị {visible.length} / {filtered.length} nâng cấp</span>
        {visible.length < filtered.length ? (
          <>
            <button onClick={() => setVisibleCount((count) => Math.min(filtered.length, count + batchSize))} type="button">
              Hiển thị thêm {Math.min(batchSize, filtered.length - visible.length)}
            </button>
            <button onClick={() => setVisibleCount(filtered.length)} type="button">Hiển thị tất cả</button>
          </>
        ) : null}
      </div>
    </section>
  );
}

/** Icon cho 1 nguồn hiệu ứng — tướng dùng lại ChampionLogo (tooltip có sẵn), tộc/hệ
 * dùng lại TraitIcon. Tinh Linh không có icon riêng từng cái trong dữ liệu, chỉ có icon
 * theo phân loại + bậc (`categoryIcon`), nên vẽ ảnh trần không khung nền — giống cách
 * phần 04 hiển thị .wispCategoryBadge. */
function EffectSourceIcon({
  source,
  onShow,
  onHide,
}: {
  source: Set18EffectSource;
  onShow: (champion: Set18Champion, x: number, y: number) => void;
  onHide: () => void;
}) {
  if (source.kind === 'champion') {
    const champion = set18ChampionByName.get(source.name);
    if (!champion) return null;
    const formImage = source.form ? champion.forms?.find((f) => f.label === source.form)?.image : undefined;
    return <ChampionLogo champion={champion} image={formImage} onHide={onHide} onShow={onShow} size={40} />;
  }
  if (source.kind === 'trait') {
    const trait = set18TraitByName.get(source.name);
    if (!trait) return null;
    return <TraitIcon size={34} trait={trait} />;
  }
  const wisp = set18WispByNameVi.get(source.name);
  if (!wisp) return null;
  return (
    <span className={styles.effectWispIcon}>
      <Image alt={wisp.categoryVi} height={40} src={wisp.categoryIcon} width={40} />
    </span>
  );
}

/** Vàng của Tinh Linh không chia bậc màu như giá tướng — dùng chung một tông vàng xu với
 * .statIconCoin ở phần 04 để hai chỗ hiển thị giá Tinh Linh trông cùng một hệ. */
const WISP_COST_COLOR = '#c0851c';

function effectSourceCostColor(source: Set18EffectSource): string | undefined {
  if (source.kind === 'champion') return set18ChampionByName.get(source.name)?.costColor;
  if (source.kind === 'wisp') return WISP_COST_COLOR;
  return undefined;
}

/** null = Tinh Linh không hiện giá mua riêng (phần thưởng miễn phí) → không vẽ pill.
 * Giá 0 vẫn vẽ, vì "0 vàng" là thông tin thật chứ không phải thiếu dữ liệu. */
function effectSourceCost(source: Set18EffectSource): number | undefined {
  if (source.kind === 'champion') return set18ChampionByName.get(source.name)?.cost;
  if (source.kind === 'wisp') return set18WispByNameVi.get(source.name)?.cost ?? undefined;
  return undefined;
}

function EffectSourceCard({
  source,
  onShow,
  onHide,
}: {
  source: Set18EffectSource;
  onShow: (champion: Set18Champion, x: number, y: number) => void;
  onHide: () => void;
}) {
  const displayName = source.kind === 'champion' && source.form ? `${source.name} (${source.form})` : source.name;
  const cost = effectSourceCost(source);
  const costColor = effectSourceCostColor(source);

  return (
    <article className={styles.effectCard}>
      <div className={styles.effectCardHead}>
        <EffectSourceIcon onHide={onHide} onShow={onShow} source={source} />
        <div className={styles.effectCardName}>
          <strong>{displayName}</strong>
          <span className={styles.effectCardTag}>{source.tag}</span>
        </div>
        {cost !== undefined && costColor ? <CostPill color={costColor} cost={cost} /> : null}
      </div>
      <p className={styles.effectQuote}>{source.quote}</p>
    </article>
  );
}

function EffectDetails({
  onShow,
  onHide,
}: {
  onShow: (champion: Set18Champion, x: number, y: number) => void;
  onHide: () => void;
}) {
  return (
    <section className={styles.section} id="hieu-ung">
      <header className={styles.sectionHead}>
        <span className={styles.eyebrow}>06 · Hiệu ứng</span>
        <h2>Hiệu Ứng &amp; Nguồn Gốc</h2>
      </header>

      <div className={styles.filterBar}>
        <div className={styles.effectToc}>
          {set18EffectCategories.map((category) => (
            <a className={styles.effectTocLink} href={`#effect-${category.id}`} key={category.id}>
              <span className={styles.effectTocIndex} style={{ background: category.accent }}>
                {category.index}
              </span>
              {category.title}
            </a>
          ))}
        </div>
      </div>

      {set18EffectCategories.map((category) => (
        <div className={styles.effectCategory} id={`effect-${category.id}`} key={category.id}>
          <div className={styles.effectCategoryHead} title={category.eyebrow}>
            <span className={styles.effectCategoryIndex} style={{ background: category.accent }}>
              {category.index}
            </span>
            <h3 className={styles.effectCategoryTitle}>{category.title}</h3>
          </div>

          {category.effects.map((effect) => (
            <div className={styles.effectBlock} key={effect.id}>
              <div className={styles.effectHead} style={{ '--trait-accent': category.accent } as CSSProperties}>
                <h4>{effect.name}</h4>
                <span className={styles.effectHeadTag}>{effect.tag}</span>
              </div>
              <p className={styles.effectDesc}>{effect.description}</p>

              {effect.sources ? (
                <div className={styles.effectGrid}>
                  {effect.sources.map((source, index) => (
                    <EffectSourceCard key={`${source.kind}-${source.name}-${index}`} onHide={onHide} onShow={onShow} source={source} />
                  ))}
                </div>
              ) : null}

              {effect.groups?.map((group) => (
                <div key={group.label}>
                  <h5 className={styles.effectGroupLabel}>{group.label}</h5>
                  {group.note ? <p className={styles.effectGroupNote}>{group.note}</p> : null}
                  <div className={styles.effectGrid}>
                    {group.sources.map((source, index) => (
                      <EffectSourceCard key={`${source.kind}-${source.name}-${index}`} onHide={onHide} onShow={onShow} source={source} />
                    ))}
                  </div>
                </div>
              ))}

              {effect.note ? <p className={styles.effectFine}>{effect.note}</p> : null}

              {effect.spotlights ? (
                <div className={styles.effectSpotlightGrid}>
                  {effect.spotlights.map((spotlight) => {
                    const trait = set18TraitByName.get(spotlight.traitName);
                    return (
                      <div className={styles.effectSpotlight} key={spotlight.traitName}>
                        <div className={styles.effectSpotlightHead}>
                          {trait ? <TraitIcon size={38} trait={trait} /> : null}
                          <div>
                            <strong>{spotlight.title}</strong>
                            <span className={styles.effectSpotlightBadge}>{spotlight.badge}</span>
                          </div>
                        </div>
                        <p>{spotlight.body}</p>
                        <span className={styles.effectFine}>{spotlight.fine}</span>
                      </div>
                    );
                  })}
                </div>
              ) : null}

              {effect.luxForms ? (
                <>
                  <h5 className={styles.effectGroupLabel}>
                    Lux qua 10 phiên bản — mỗi phiên bản mang 1 Tộc/Hệ Thế Thần, cùng kỹ năng gốc nhưng thưởng riêng khi trúng chiêu
                  </h5>
                  <div className={styles.effectLuxTableWrap}>
                    <table className={styles.effectLuxTable}>
                      <thead>
                        <tr>
                          <th>Phiên bản</th>
                          <th>Tộc/Hệ Thế Thần</th>
                          <th>Thưởng khi trúng Cầu Vồng Tối Thượng</th>
                        </tr>
                      </thead>
                      <tbody>
                        {effect.luxForms.map((row) => {
                          const lux = set18ChampionByName.get('Lux');
                          const image = lux?.forms?.find((f) => f.label === row.form)?.image;
                          return (
                            <tr key={row.form}>
                              <td>
                                <div className={styles.effectLuxFormCell}>
                                  {image ? <Image alt={row.form} height={28} src={image} width={28} /> : null}
                                  <span>{row.form}</span>
                                </div>
                              </td>
                              <td className={styles.effectLuxTrait}>{row.trait}</td>
                              <td>{row.bonus}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                  {effect.luxNote ? <p className={styles.effectFine}>{effect.luxNote}</p> : null}
                </>
              ) : null}
            </div>
          ))}
        </div>
      ))}
    </section>
  );
}

export function Set18Codex({ section: activeSection }: { section: SectionId }) {
  const router = useRouter();
  const sectionHref = useCallback((section: SectionId) => `/mua-18/${section}`, []);
  const [loadedSection, setLoadedSection] = useState<SectionId | null>(null);
  const [loadError, setLoadError] = useState(false);
  const [tooltip, setTooltip] = useState<TooltipState>(null);
  const [costFilter, setCostFilter] = useState<number | 'all'>('all');
  const [traitTypeFilter, setTraitTypeFilter] = useState<Set18TraitType | 'all'>('all');
  const [wispCategoryFilter, setWispCategoryFilter] = useState<string | 'all'>('all');
  const [augmentRarityFilter, setAugmentRarityFilter] = useState<Set18Augment['rarity'] | 'all'>('all');
  const [augmentCategoryFilter, setAugmentCategoryFilter] = useState<string | 'all'>('all');

  useEffect(() => {
    let cancelled = false;
    setLoadedSection(null);
    setLoadError(false);
    setTooltip(null);

    // Chỉ nạp entity-index + slugs (132KB) khi section thật sự cần gắn id DOM
    // cho search focus (xem FOCUS_ID_PREFIX) — 2 section còn lại (ma-tran-toc-he,
    // hieu-ung) không có card đơn lẻ theo slug nên bỏ qua, giữ payload nhỏ nhất.
    async function loadSlugMaps() {
      const [entityIndexModule, slugsModule] = await Promise.all([
        import('@/content/set18/set18-entity-index'),
        import('@/content/set18/set18-slugs.generated'),
      ]);
      return { entityIndex: entityIndexModule.set18EntityIndex, slugById: slugsModule.set18SlugById };
    }

    async function loadSectionData() {
      try {
        if (activeSection === 'tinh-linh') {
          const wisps = await import('@/content/set18/set18-wisps');
          set18Wisps = wisps.set18Wisps;
          const { entityIndex, slugById } = await loadSlugMaps();
          set18WispSlugByRef = buildSlugRefMap('wisp', wisps.set18Wisps, entityIndex, slugById);
        } else if (activeSection === 'nang-cap') {
          const augments = await import('@/content/set18/set18-augments');
          set18Augments = augments.set18Augments;
          const { entityIndex, slugById } = await loadSlugMaps();
          set18AugmentSlugByRef = buildSlugRefMap('augment', augments.set18Augments, entityIndex, slugById);
        } else {
          const [traits, champions] = await Promise.all([
            import('@/content/set18/set18-traits'),
            import('@/content/set18/set18-champions'),
          ]);
          set18Traits = traits.set18Traits;
          set18TraitByName = traits.set18TraitByName;
          set18Champions = champions.set18Champions;
          set18ChampionByName = champions.set18ChampionByName;

          if (activeSection === 'chi-tiet-tuong' || activeSection === 'chi-tiet-toc-he') {
            const { entityIndex, slugById } = await loadSlugMaps();
            set18ChampionSlugByRef = buildSlugRefMap('champion', champions.set18Champions, entityIndex, slugById);
            set18TraitSlugByRef = buildSlugRefMap('trait', traits.set18Traits, entityIndex, slugById);
          }

          if (activeSection === 'hieu-ung') {
            const [wisps, effects] = await Promise.all([
              import('@/content/set18/set18-wisps'),
              import('@/content/set18-effects'),
            ]);
            set18Wisps = wisps.set18Wisps;
            set18WispByNameVi = new Map();
            for (const wisp of wisps.set18Wisps) {
              if (!set18WispByNameVi.has(wisp.nameVi)) set18WispByNameVi.set(wisp.nameVi, wisp);
            }
            set18EffectCategories = effects.set18EffectCategories;
          }
        }
        if (!cancelled) setLoadedSection(activeSection);
      } catch {
        if (!cancelled) setLoadError(true);
      }
    }

    void loadSectionData();
    return () => {
      cancelled = true;
    };
  }, [activeSection]);

  const wispGroups = useMemo<WispCategoryGroup[]>(
    () =>
      loadedSection === 'tinh-linh'
        ? WISP_CATEGORY_ORDER.map((category) => {
            const items = set18Wisps.filter((wisp) => wisp.category === category);
            return { category, categoryVi: items[0]?.categoryVi ?? category, items };
          }).filter((group) => group.items.length > 0)
        : [],
    [loadedSection],
  );
  const augmentGroups = useMemo<AugmentCategoryGroup[]>(
    () =>
      loadedSection === 'nang-cap'
        ? AUGMENT_CATEGORY_ORDER.map((category) => {
            const items = set18Augments.filter((augment) => augment.category === category);
            return { category, categoryVi: items[0]?.categoryVi ?? category, items };
          }).filter((group) => group.items.length > 0)
        : [],
    [loadedSection],
  );
  const championGroups = useMemo(
    () =>
      loadedSection
        ? set18Costs.map((entry) => ({
            ...entry,
            champions: set18Champions.filter((champion) => champion.cost === entry.cost),
          }))
        : [],
    [loadedSection],
  );

  const showTooltip = useCallback((champion: Set18Champion, x: number, y: number) => {
    const width = 340;
    const height = 260;
    const left = Math.min(x + 16, window.innerWidth - width - 12);
    const top = Math.min(y + 16, window.innerHeight - height - 12);
    setTooltip({ champion, x: Math.max(12, left), y: Math.max(12, top) });
  }, []);

  const hideTooltip = useCallback(() => setTooltip(null), []);
  const isSectionReady = loadedSection === activeSection;

  // Search (Ctrl+K) trỏ tới lưới tương tác này kèm ?focus=slug thay vì trang
  // chi tiết đơn lẻ — người dùng vừa thấy đúng thẻ vừa có nguyên bối cảnh lưới
  // xung quanh (lọc, so sánh tướng cạnh nhau) như đã dùng quen ở /mua-18. Đợi
  // `isSectionReady` mới tìm phần tử vì dữ liệu section nạp lazy qua import().
  //
  // Cuộn bằng GSAP ScrollToPlugin thay vì scrollIntoView({behavior:'smooth'}):
  // easing mặc định của trình duyệt không tuỳ chỉnh được, còn ở đây cần đúng
  // cảm giác "nảy nhẹ rồi dừng" (back.inOut) cho thao tác "nhảy tới kết quả tìm
  // kiếm" — khác hẳn cảm giác tuyến tính của cuộn trang thông thường.
  const focusSlug = useSearchParams().get('focus');
  useEffect(() => {
    if (!isSectionReady || !focusSlug) return;
    const prefix = FOCUS_ID_PREFIX[activeSection];
    if (!prefix) return;

    // Tinh Linh/Nâng cấp phân trang theo lô 48 — nếu thẻ cần cuộn tới nằm ngoài
    // lô đang hiện, WispSection/AugmentDetails tự mở rộng visibleCount (effect
    // riêng của chúng), nhưng đó là một lượt re-render KHÁC, chạy SAU lượt commit
    // hiện tại (effect của component con chạy trước component cha trong cùng 1
    // commit, nhưng state con vừa set chỉ áp dụng ở commit tiếp theo). Poll vài
    // lần thay vì tìm đúng 1 lần duy nhất, để không bỏ cuộc ngay khi thẻ chưa kịp
    // render — dừng ngay khi thấy, không đợi hết số lần thử.
    let cancelled = false;
    let attempt = 0;
    const maxAttempts = 20;

    function tryScroll() {
      if (cancelled) return;
      const target = document.getElementById(`${prefix}-${focusSlug}`);
      if (!target) {
        attempt += 1;
        if (attempt < maxAttempts) setTimeout(tryScroll, 50);
        return;
      }
      waitForStableLayout(target, 0, undefined, performance.now());
    }

    // Thẻ VỪA tồn tại trong DOM không có nghĩa layout đã ổn định — khi mở rộng
    // hết batch (261 nâng cấp/176 Tinh Linh), trình duyệt còn vài khung hình để
    // chèn xong các thẻ còn lại quanh nó, làm rect.top của thẻ đích còn xê dịch.
    // Bắt đầu tween khi layout còn đang dồn dịch sẽ giật/lag do main thread bận
    // — đợi vị trí đứng yên 2 khung liên tiếp rồi mới cuộn, thay vì cuộn ngay khi
    // vừa thấy phần tử.
    //
    // Chặn trần theo THỜI GIAN THỰC (300ms), không đếm số khung hình: đo bằng
    // requestAnimationFrame() dưới tab bị trình duyệt hạ ưu tiên (tab nền, cửa sổ
    // bị che, DevTools/automation) có thể tụt xuống ~1 khung/giây — chặn theo số
    // khung sẽ khiến việc "đợi ổn định" kéo dài hàng giây thay vì ~50ms như dự
    // tính, làm animation trông như bị treo thay vì mượt hơn.
    function waitForStableLayout(target: HTMLElement, streak: number, lastTop: number | undefined, startedAt: number) {
      if (cancelled) return;
      const top = target.getBoundingClientRect().top;
      const isStable = lastTop !== undefined && Math.abs(top - lastTop) < 1;
      const nextStreak = isStable ? streak + 1 : 0;
      if (nextStreak >= 2 || performance.now() - startedAt >= 300) {
        startScroll(target);
        return;
      }
      requestAnimationFrame(() => waitForStableLayout(target, nextStreak, top, startedAt));
    }

    function startScroll(target: HTMLElement) {
      const rect = target.getBoundingClientRect();
      const centeredY = Math.max(0, window.scrollY + rect.top - (window.innerHeight - rect.height) / 2);
      const distance = Math.abs(centeredY - window.scrollY);
      // Thời lượng cố định (0.85s) làm quãng ngắn (Ahri, ~vài trăm px) thì ổn,
      // nhưng quãng dài (Cây Tộc/Hệ nằm cuối 261 nâng cấp, có thể ~40-50 nghìn
      // px) bị nén vào cùng 0.85s đó thì tốc độ quá nhanh để mắt kịp nhận ra là
      // đang cuộn — trông như nhảy cóc thay vì cuộn. Cho thời lượng tỉ lệ theo
      // quãng đường (fps tương đối ổn định), kẹp trong khoảng vẫn còn "nhanh gọn"
      // (0.5s) tới "đủ để thấy rõ chuyển động" (1.8s) ở quãng xa nhất có thể có.
      const duration = Math.min(1.8, Math.max(0.5, distance / 12000));

      // ScrollToPlugin cuộn `window` bằng cách gọi window.scrollTo(x, y) native
      // ở MỖI tick (xem node_modules/gsap/ScrollToPlugin.js) — lệnh này tuân theo
      // CSS `scroll-behavior` trên <html>. globals.css đặt `scroll-behavior: smooth`
      // toàn cục (cho anchor link nhảy mục lục), nên mỗi tick của GSAP lại kích
      // thêm MỘT lượt smooth-scroll native của trình duyệt tới đúng điểm tick đó —
      // hai hệ animation giẫm lên nhau suốt tween, ra kết quả chập chờn: có lúc
      // trông mượt (hai bên tình cờ khớp nhịp), có lúc gần như không thấy chuyển
      // động (bên native liên tục bị GSAP đặt lại đích trước khi kịp tới nơi).
      // Tắt tạm `scroll-behavior` trong lúc GSAP tự điều khiển, trả lại sau khi
      // xong để không ảnh hưởng anchor link nơi khác.
      const html = document.documentElement;
      const previousScrollBehavior = html.style.scrollBehavior;
      html.style.scrollBehavior = 'auto';

      gsap.to(window, {
        duration,
        ease: 'back.inOut(1.7)',
        overwrite: true,
        scrollTo: { y: centeredY },
        onComplete: () => {
          html.style.scrollBehavior = previousScrollBehavior;
        },
      });
      target.classList.add(styles.focusPulse);
      // Giữ vòng sáng thêm ~1.35s SAU KHI tween cuộn xong (không phải sau khi
      // BẮT ĐẦU) — quãng dài giờ có duration tới 1.8s, nếu vẫn trừ cứng theo mốc
      // cũ (2.2s tính từ lúc bắt đầu) thì vòng sáng tắt gần như ngay khi vừa
      // dừng cuộn, không kịp cho người dùng nhìn thấy.
      setTimeout(() => target.classList.remove(styles.focusPulse), duration * 1000 + 1350);
    }

    const frame = requestAnimationFrame(tryScroll);
    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
    };
  }, [activeSection, focusSlug, isSectionReady]);

  return (
    <div className={styles.shell}>
      <div className={styles.tocColumn}>
        <aside aria-label="Mục lục Mùa 18" className={styles.toc}>
          <h2 className={styles.tocTitle}>Mục lục</h2>
          <div className={styles.tocList}>
            {SECTIONS.map((section, index) => (
              <Link
                aria-current={section.id === activeSection ? 'page' : undefined}
                className={styles.tocItem}
                href={sectionHref(section.id)}
                key={section.id}
                scroll={false}
              >
                <strong>{section.label}</strong>
                <span>
                  {String(index + 1).padStart(2, '0')} · {section.hint}
                </span>
              </Link>
            ))}
          </div>
        </aside>
      </div>

      <div className={styles.main}>
        <select
          aria-label="Chọn phần nội dung"
          className={styles.mobileSelect}
          onChange={(event) => router.push(sectionHref(event.target.value as SectionId), { scroll: false })}
          value={activeSection}
        >
          {SECTIONS.map((section) => (
            <option key={section.id} value={section.id}>
              {section.label}
            </option>
          ))}
        </select>

        {loadError ? <p className={styles.loadState}>Không thể tải dữ liệu phần này. Hãy thử tải lại trang.</p> : null}
        {!loadError && !isSectionReady ? <p className={styles.loadState}>Đang tải dữ liệu Mùa 18…</p> : null}

        {isSectionReady && activeSection === 'chi-tiet-tuong' ? (
          <div className={styles.filterBar}>
            <ScrollableRow>
              <ChampionCostFilter costFilter={costFilter} groups={championGroups} onChange={setCostFilter} />
            </ScrollableRow>
          </div>
        ) : null}

        {isSectionReady && activeSection === 'chi-tiet-toc-he' ? (
          <div className={styles.filterBar}>
            <ScrollableRow>
              <TraitTypeFilter onChange={setTraitTypeFilter} typeFilter={traitTypeFilter} />
            </ScrollableRow>
          </div>
        ) : null}

        {isSectionReady && activeSection === 'tinh-linh' ? (
          <div className={styles.filterBar}>
            <ScrollableRow>
              <WispCategoryFilter categoryFilter={wispCategoryFilter} groups={wispGroups} onChange={setWispCategoryFilter} />
            </ScrollableRow>
          </div>
        ) : null}

        {isSectionReady && activeSection === 'nang-cap' ? (
          <div className={styles.filterBar}>
            <ScrollableRow>
              <AugmentFilterRow
                categoryFilter={augmentCategoryFilter}
                groups={augmentGroups}
                onCategoryChange={setAugmentCategoryFilter}
                onRarityChange={setAugmentRarityFilter}
                rarityFilter={augmentRarityFilter}
              />
            </ScrollableRow>
          </div>
        ) : null}

        {isSectionReady && activeSection === 'ma-tran-toc-he' ? <SynergyMatrix onHide={hideTooltip} onShow={showTooltip} /> : null}
        {isSectionReady && activeSection === 'chi-tiet-tuong' ? <ChampionDetails costFilter={costFilter} grouped={championGroups} /> : null}
        {isSectionReady && activeSection === 'chi-tiet-toc-he' ? (
          <TraitDetails onHide={hideTooltip} onShow={showTooltip} typeFilter={traitTypeFilter} />
        ) : null}
        {isSectionReady && activeSection === 'tinh-linh' ? (
          <WispSection categoryFilter={wispCategoryFilter} focusSlug={focusSlug} groups={wispGroups} />
        ) : null}
        {isSectionReady && activeSection === 'nang-cap' ? (
          <AugmentDetails categoryFilter={augmentCategoryFilter} focusSlug={focusSlug} rarityFilter={augmentRarityFilter} />
        ) : null}
        {isSectionReady && activeSection === 'hieu-ung' ? <EffectDetails onHide={hideTooltip} onShow={showTooltip} /> : null}
      </div>

      <ChampionTooltip state={tooltip} />
    </div>
  );
}
