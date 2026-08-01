'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useId, useLayoutEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import { set18Costs, set18Sections, set18TraitTypes, type Set18SectionId } from '@/content/set18/set18-meta';
import type {
  Set18Augment,
  Set18Champion,
  Set18ChampionForm,
  Set18ChampionStats,
  Set18CostMeta,
  Set18Trait,
  Set18TraitBreakpointBullet,
  Set18TraitType,
  Set18Wisp,
} from '@/content/set18/set18-types';
import type { Set18EffectCategory, Set18EffectSource } from '@/content/set18-effects';
import styles from './Set18Codex.module.css';

let set18Traits: Set18Trait[] = [];
let set18Champions: Set18Champion[] = [];
let set18Wisps: Set18Wisp[] = [];
let set18Augments: Set18Augment[] = [];
let set18EffectCategories: Set18EffectCategory[] = [];
let set18TraitByName = new Map<string, Set18Trait>();
let set18ChampionByName = new Map<string, Set18Champion>();
/** Khóa bằng `nameVi` chứ không phải `name`: cột tên tiếng Anh trong set18-wisps.ts đang lệch
 * hàng so với phần tiếng Việt (lỗi ghép cặp từ lúc scrape), nên chỉ `nameVi` là tham chiếu tin
 * cậy. 3 linh hỏa trùng `nameVi` — giữ bản xuất hiện trước, đủ dùng vì set18-effects.ts không
 * trỏ tới cái nào trong số đó. */
let set18WispByNameVi = new Map<string, Set18Wisp>();

const SECTIONS = set18Sections;
type SectionId = Set18SectionId;

function traitLabel(name: string) {
  const trait = set18TraitByName.get(name);
  return trait ? `${trait.vi} (${trait.name})` : name;
}

function traitTitle(trait: Set18Trait) {
  return `${trait.vi} (${trait.name}) — ${trait.typeVi}, mốc ${trait.breaksLabel}`;
}

/**
 * Mọi icon tộc hệ đều là silhouette trắng nền trong suốt (chuẩn hoá bởi
 * Set18/normalize_trait_icons.py), nên chỉ cần một kiểu nền duy nhất — màu
 * nền lấy từ `trait.accent` trong dữ liệu, không suy đoán trong component.
 */
function TraitIcon({ trait, size = 26 }: { trait: Set18Trait; size?: number }) {
  return (
    <span
      className={styles.iconWrap}
      style={{ background: trait.accent, width: size, height: size } as CSSProperties}
    >
      <Image alt="" height={Math.round(size * 0.68)} src={trait.icon} width={Math.round(size * 0.68)} />
    </span>
  );
}

/** Badge giá vàng dùng chung ở mọi nơi hiện giá (thẻ tướng, tooltip, thẻ nguồn hiệu
 * ứng) — icon vàng + số, nền/viền đổi màu theo `--cost-color` (đúng bậc giá của
 * tướng đó), thay cho chấm tròn/chữ "X vàng" trước đây. */
function CostPill({ cost, color }: { cost: number; color: string }) {
  return (
    <span className={styles.costPill} style={{ '--cost-color': color } as CSSProperties}>
      <i className={styles.costPillIcon} />
      {cost}
    </span>
  );
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

function statRows(s: Set18ChampionStats) {
  return [
    { key: 'health', label: 'Máu', icon: styles.statIconHealth, value: s.health.join('/') },
    { key: 'mana', label: 'Mana', icon: styles.statIconMana, value: s.mana.join('/') },
    { key: 'attackDamage', label: 'Sát thương tấn công', icon: styles.statIconAd, value: s.attackDamage.join('/') },
    { key: 'abilityPower', label: 'Sát thương kỹ năng', icon: styles.statIconAp, value: String(s.abilityPower) },
    { key: 'armor', label: 'Giáp', icon: styles.statIconArmor, value: String(s.armor) },
    { key: 'magicResist', label: 'Kháng phép', icon: styles.statIconMr, value: String(s.magicResist) },
    { key: 'attackSpeed', label: 'Tốc độ tấn công', icon: styles.statIconAs, value: String(s.attackSpeed) },
    { key: 'critChance', label: 'Tỷ lệ chí mạng', icon: styles.statIconCritChance, value: s.critChance_pct },
    { key: 'critMultiplier', label: 'Sát thương chí mạng', icon: styles.statIconCritDmg, value: s.critMultiplier_pct },
    { key: 'range', label: 'Tầm bắn', icon: styles.statIconRange, value: String(s.range) },
  ];
}

function resolveTraits(names: string[]): Set18Trait[] {
  return names.map((name) => set18TraitByName.get(name)).filter((trait): trait is Set18Trait => Boolean(trait));
}

/** Tướng không có nhiều dạng chỉ dùng field cấp tướng làm 1 "dạng" duy nhất, để
 * ChampionCard luôn render qua chung một đường (form-based), không tách 2 nhánh code. */
function escapeAbilityText(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .split('\n')
    .join('<br>');
}

function championForms(champion: Set18Champion): Set18ChampionForm[] {
  if (champion.forms?.length) return champion.forms;
  return [
    {
      label: '',
      image: champion.image,
      bigImage: champion.image,
      traits: champion.traits,
      abilityIcon: champion.abilityIcon,
      abilityName: champion.abilityName,
      abilityNameVi: champion.abilityNameVi,
      abilityHtmlVi: escapeAbilityText(champion.abilityVi),
      mana: champion.mana,
      calcs: [],
      stats: champion.stats,
    },
  ];
}

/** Thẻ lật — mặt trước logo mini + kỹ năng đầy đủ (icon, mana, mô tả màu theo game,
 * công thức sát thương), mặt sau ảnh lớn + số liệu. Tướng nhiều dạng (Lux, Nidalee,
 * 4 tướng Thích Ứng AD/AP) có thêm rail chọn dạng nằm cạnh thẻ, không xoay theo khi lật.
 * Chuyển từ Set18/reports/set18_champion_cards.html (đã duyệt qua nhiều vòng preview). */
function ChampionCard({ champion }: { champion: Set18Champion }) {
  const forms = useMemo(() => championForms(champion), [champion]);
  const [activeForm, setActiveForm] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const faceId = useId();
  const frontFaceId = `${faceId}-front`;
  const backFaceId = `${faceId}-back`;
  const flipRef = useRef<HTMLElement>(null);
  const frontIdRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const backRef = useRef<HTMLDivElement>(null);

  const form = forms[Math.min(activeForm, forms.length - 1)];

  useLayoutEffect(() => {
    const frontH = (frontIdRef.current?.offsetHeight ?? 0) + (bodyRef.current?.scrollHeight ?? 0);
    const backH = backRef.current
      ? Array.from(backRef.current.children).reduce((sum, child) => sum + (child as HTMLElement).offsetHeight, 0)
      : 0;
    if (flipRef.current) flipRef.current.style.height = `${Math.max(400, frontH, backH)}px`;
  }, [champion, form]);

  const traits = resolveTraits(form.traits);
  const traitRow = (
    <div className={styles.traitsRow}>
      {traits.map((trait) => (
        <span className={styles.traitChip} key={trait.name} title={traitTitle(trait)}>
          <TraitIcon size={22} trait={trait} />
          {trait.vi}
        </span>
      ))}
    </div>
  );

  return (
    <article
      className={`${styles.flip} ${flipped ? styles.flipOn : ''}`}
      data-flip-card=""
      ref={flipRef}
      style={{ '--cost-color': champion.costColor } as CSSProperties}
    >
      {forms.length > 1 ? (
        <div className={styles.rail}>
          {forms.map((f, index) => {
            const isAdAp = f.label === 'AD' || f.label === 'AP';
            const railColor = f.label === 'AD' ? '#c97a1e' : f.label === 'AP' ? '#6e5ce0' : undefined;
            const formTraits = isAdAp ? [] : resolveTraits(f.traits);
            // ưu tiên tộc (Origin) làm logo dạng; nếu không có (vd Lux Mặc định chỉ
            // mang Avatar) thì dùng trait đầu tiên đang có, thay vì hiện dấu * chung chung.
            const railTrait = formTraits.find((trait) => trait.type === 'Origin') ?? formTraits[0];
            return (
              <button
                aria-label={`Chọn dạng ${f.label} của ${champion.name}`}
                aria-pressed={index === activeForm}
                className={`${styles.railBtn} ${index === activeForm ? styles.railBtnOn : ''}`}
                key={f.label}
                onClick={() => setActiveForm(index)}
                style={railColor ? ({ '--rail-color': railColor } as CSSProperties) : undefined}
                title={f.label}
                type="button"
              >
                {isAdAp ? (
                  <span
                    className={`${styles.railIcon} ${f.label === 'AD' ? styles.statIconAd : styles.statIconAp}`}
                  />
                ) : railTrait ? (
                  <TraitIcon size={20} trait={railTrait} />
                ) : null}
              </button>
            );
          })}
        </div>
      ) : null}

      <div className={styles.flipInner}>
          <div aria-hidden={flipped} className={styles.face} id={frontFaceId} inert={flipped ? true : undefined}>
            <div className={styles.frontId} ref={frontIdRef}>
              <div className={styles.miniHead}>
                <Image alt={champion.name} className={styles.miniLogo} height={56} src={form.image} width={56} />
                <div className={styles.nameCol}>
                  <strong className={styles.uname}>{champion.name}</strong>
                  <span className={styles.urole}>{champion.role}</span>
                </div>
                <CostPill color={champion.costColor} cost={champion.cost} />
              </div>
              {traitRow}
            </div>
            <div className={styles.body} ref={bodyRef}>
              <div className={styles.abhead}>
                {form.abilityIcon ? (
                  <Image alt="" className={styles.abilityIcon} height={28} src={form.abilityIcon} width={28} />
                ) : null}
                <strong className={styles.abname}>{form.abilityNameVi || form.abilityName}</strong>
                <span className={styles.manaTag}>
                  <span className={`${styles.statIcon} ${styles.statIconMana}`} />
                  {form.mana}
                </span>
              </div>
              <p className={styles.abdesc} dangerouslySetInnerHTML={{ __html: form.abilityHtmlVi }} />
              {form.calcs.length ? (
                <div className={styles.calcs}>
                  {form.calcs.map((calc) => (
                    <div key={calc.id}>
                      <div className={styles.calc}>
                        <span className={calc.style}>{calc.label}:</span>
                        <span>{calc.total}</span>
                      </div>
                      <div className={styles.calcTerms} dangerouslySetInnerHTML={{ __html: calc.terms }} />
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
            <button
              aria-controls={`${frontFaceId} ${backFaceId}`}
              aria-label={`Xem số liệu của ${champion.name}, dạng ${form.label}`}
              aria-pressed={flipped}
              className={styles.flipButton}
              onClick={() => setFlipped(true)}
              type="button"
            >
              Xem số liệu
            </button>
          </div>

          <div
            aria-hidden={!flipped}
            className={`${styles.face} ${styles.back}`}
            id={backFaceId}
            inert={!flipped ? true : undefined}
            ref={backRef}
          >
            <div className={styles.backHead}>
              <div className={styles.nameRow}>
                <strong className={styles.uname}>{champion.name}</strong>
                <span className={styles.urole}>{champion.role}</span>
              </div>
              <CostPill color={champion.costColor} cost={champion.cost} />
            </div>
            <div className={styles.thumbWrap}>
              <Image alt={champion.name} className={styles.bigThumb} height={220} src={form.bigImage} width={340} />
            </div>
            {traitRow}
            <div className={styles.stats}>
              {statRows(form.stats).map((row) => (
                <div className={styles.stat} key={row.key}>
                  <div className={styles.val} title={row.label}>
                    <span className={`${styles.statIcon} ${row.icon}`} />
                    {row.value}
                  </div>
                </div>
              ))}
            </div>
            <button
              aria-controls={`${frontFaceId} ${backFaceId}`}
              aria-label={`Xem kỹ năng của ${champion.name}, dạng ${form.label}`}
              aria-pressed={flipped}
              className={styles.flipButton}
              onClick={() => setFlipped(false)}
              type="button"
            >
              Xem kỹ năng
            </button>
          </div>
        </div>
      </article>
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
function ChampionCostGrid({ champions }: { champions: Set18Champion[] }) {
  const gridRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;
    const cards = Array.from(grid.querySelectorAll<HTMLElement>('[data-flip-card]'));
    if (!cards.length) return;
    const maxHeight = Math.max(...cards.map((card) => card.getBoundingClientRect().height));
    cards.forEach((card) => {
      card.style.height = `${maxHeight}px`;
    });
  });

  return (
    <div className={styles.championGrid} ref={gridRef}>
      {champions.map((champion) => (
        <ChampionCard champion={champion} key={champion.name} />
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

const BULLET_ICON_CLASS: Record<string, string> = {
  ad: styles.statIconAd,
  ap: styles.statIconAp,
  armor: styles.statIconArmor,
  as: styles.statIconAs,
  health: styles.statIconHealth,
  mr: styles.statIconMr,
  mana: styles.statIconMana,
  critchance: styles.statIconCritChance,
  dura: styles.statIconDura,
  manaregen: styles.statIconManaRegen,
  omnivamp: styles.statIconOmnivamp,
};

/** Chèn chip icon+giá trị vào đúng vị trí {0}, {1}... trong câu đã dịch — vd
 * "Tinh Linh được nâng cấp, {0}" + values[0]="12%" (icon AD/AP) -> câu kèm chip màu. */
function BulletText({ bullet }: { bullet: Set18TraitBreakpointBullet }) {
  const parts = bullet.textVi.split(/(\{\d+\})/g);
  return (
    <>
      {parts.map((part, index) => {
        const match = /^\{(\d+)\}$/.exec(part);
        if (!match) return <span key={index}>{part}</span>;
        const value = bullet.values[Number(match[1])];
        if (!value) return null;
        return (
          <strong className={styles.bulletValue} key={index}>
            {value.icons.map((icon) => (
              <span className={`${styles.statIcon} ${BULLET_ICON_CLASS[icon] ?? ''}`} key={icon} />
            ))}
            {value.value ?? '?'}
          </strong>
        );
      })}
    </>
  );
}

type Set18Bounty = NonNullable<Set18Trait['bounties']>[number];

const BOUNTY_POOLS = [
  { key: 'standard' as const, label: 'Tiêu chuẩn' },
  { key: 'hard' as const, label: 'Khó' },
];

/** Bảng nhiệm vụ của Săn Thưởng, tách theo 2 pool rút của game thay vì đổ
 * chung 11 ô như trước: người chơi chọn bounty theo việc mình gánh Draven được đến
 * đâu, nên độ khó là thứ cần đọc trước cả nội dung nhiệm vụ. Hai pool không có
 * trọng số nên xác suất trong mỗi pool bằng nhau — hiển thị luôn 1/N ở đầu nhóm.
 *
 * Bỏ tiền tố "Draven " khỏi câu nhiệm vụ khi hiển thị: cả 11 câu đều bắt đầu bằng
 * đúng chữ đó và thẻ đã mang tên trait rồi, cắt đi thì mỗi ô còn lại phần khác biệt
 * thật. Dữ liệu vẫn giữ nguyên văn bản gốc của game. */
function BountyBoard({ bounties }: { bounties: Set18Bounty[] }) {
  return (
    <div className={styles.bountyBoard}>
      {BOUNTY_POOLS.map((pool) => {
        const items = bounties.filter((bounty) => bounty.difficulty === pool.key);
        if (!items.length) return null;

        return (
          <div className={styles.bountyPool} data-difficulty={pool.key} key={pool.key}>
            <div className={styles.bountyPoolHead}>
              <span className={styles.bountyPoolName}>{pool.label}</span>
              <span className={styles.bountyPoolMeta}>
                {items.length} nhiệm vụ · mỗi nhiệm vụ 1/{items.length}
              </span>
            </div>
            <ul className={styles.bountyList}>
              {items.map((bounty) => (
                <li className={styles.bountyRow} key={bounty.mission}>
                  <span className={styles.bountyMission}>{bounty.mission.replace(/^Draven /, '')}</span>
                  <span className={styles.bountyReward}>{bounty.reward}</span>
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </div>
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
                <article
                  className={trait.wide ? `${styles.traitCard} ${styles.traitCardWide}` : styles.traitCard}
                  key={trait.name}
                  style={{ '--trait-accent': trait.accent } as CSSProperties}
                >
                  <header className={styles.traitHead}>
                    <TraitIcon size={30} trait={trait} />
                    <div>
                      <strong>{trait.vi}</strong>
                      <span className={styles.traitEn}>{trait.name}</span>
                    </div>
                  </header>

                  <div className={styles.breakpointRow}>
                    <span className={styles.breakLabel}>Mốc</span>
                    {trait.breakpointDetails.map((bp, index) => (
                      <span className={styles.breakChipGroup} key={bp.threshold}>
                        {index > 0 ? <span className={styles.breakArrow}>›</span> : null}
                        <span className={styles.breakChip} style={{ '--break-color': bp.color } as CSSProperties} title={bp.style}>
                          {bp.threshold}
                        </span>
                      </span>
                    ))}
                  </div>

                  {trait.descriptionVi || trait.description ? (
                    <p className={styles.traitDesc}>{trait.descriptionVi || trait.description}</p>
                  ) : null}

                  {trait.breakpointDetails.some((bp) => bp.bullet) ? (
                    <ul className={styles.traitBulletList}>
                      {trait.breakpointDetails.map((bp) =>
                        bp.bullet ? (
                          <li key={bp.threshold}>
                            <span className={styles.bulletMark} style={{ '--break-color': bp.color } as CSSProperties}>
                              {bp.threshold}
                            </span>
                            <span>
                              <BulletText bullet={bp.bullet} />
                            </span>
                          </li>
                        ) : null,
                      )}
                    </ul>
                  ) : null}

                  {trait.infoChips?.length ? (
                    <div className={styles.traitInfoChips}>
                      {trait.infoChips.map((chip) => (
                        <span className={styles.traitInfoChip} key={chip}>
                          {chip}
                        </span>
                      ))}
                    </div>
                  ) : null}

                  {trait.bounties?.length ? <BountyBoard bounties={trait.bounties} /> : null}

                  <div className={styles.traitMembers}>
                    <span className={styles.breakLabel}>{trait.champions.length} tướng</span>
                    <div className={styles.memberLogos}>
                      {trait.champions.map((name) => {
                        const champion = set18ChampionByName.get(name);
                        if (!champion) return null;
                        return <ChampionLogo champion={champion} key={name} onHide={onHide} onShow={onShow} size={30} />;
                      })}
                    </div>
                  </div>
                </article>
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

/** Bộ lọc phân loại linh hỏa — dùng chung cho khối trong mục lục trái và khối dự
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

function WispSection({ categoryFilter, groups }: { categoryFilter: string | 'all'; groups: WispCategoryGroup[] }) {
  const batchSize = 48;
  const [visibleCount, setVisibleCount] = useState(batchSize);
  const visible = groups.filter((group) => categoryFilter === 'all' || categoryFilter === group.category);
  const total = visible.reduce((sum, group) => sum + group.items.length, 0);
  const visibleNames = new Set(visible.flatMap((group) => group.items).slice(0, visibleCount).map((wisp) => wisp.name));
  const batchedGroups = visible
    .map((group) => ({ ...group, items: group.items.filter((wisp) => visibleNames.has(wisp.name)) }))
    .filter((group) => group.items.length > 0);

  useEffect(() => setVisibleCount(batchSize), [categoryFilter]);

  return (
    <section className={styles.section} id="linh-hoa">
      <header className={styles.sectionHead}>
        <span className={styles.eyebrow}>04 · Linh hỏa</span>
        <h2>Linh hỏa (Wisp)</h2>
        <p>{set18Wisps.length} linh hỏa Set 18, nhóm theo loại hiệu ứng và xếp từ rẻ đến đắt trong mỗi nhóm.</p>
      </header>

      {batchedGroups.map((group) => (
        <div className={styles.wispGroup} key={group.category}>
          <h3 className={styles.groupHeading}>
            {group.categoryVi}
            <span>{visible.find((item) => item.category === group.category)?.items.length ?? group.items.length} linh hỏa</span>
          </h3>
          <div className={styles.wispGrid}>
            {group.items.map((wisp) => {
              const upgrade = wisp.blossomUpgradeDescriptionVi;
              const showCostArrow = upgrade && wisp.blossomUpgradeCost !== null && wisp.blossomUpgradeCost !== wisp.cost;
              const showAppearsArrow = wisp.appearsEnd && wisp.appearsEnd !== wisp.appearsStart;
              return (
                <article className={styles.wispCard} key={wisp.name}>
                  <div className={styles.wispBadgeRow}>
                    <div className={styles.wispBadgeStack}>
                      <span className={`${styles.wispBadge} ${styles.wispCostBadge}`}>
                        <span className={`${styles.statIcon} ${styles.statIconCoin}`} />
                        {wisp.cost !== null ? wisp.cost : 'NaN'}
                      </span>
                      {showCostArrow ? (
                        <>
                          <span className={styles.wispBadgeArrow}>↓</span>
                          <span className={`${styles.wispBadge} ${styles.wispCostBadge} ${styles.wispBadgeUpgrade}`}>
                            <span className={`${styles.statIcon} ${styles.statIconCoin}`} />
                            {wisp.blossomUpgradeCost}
                          </span>
                        </>
                      ) : null}
                    </div>
                    <span className={styles.wispCategoryBadge} title={wisp.categoryVi}>
                      <Image alt="" height={40} src={wisp.categoryIcon} width={40} />
                    </span>
                    <div className={styles.wispBadgeStack}>
                      {wisp.appearsStart ? (
                        <>
                          <span className={`${styles.wispBadge} ${styles.wispBadgeAppears}`}>{wisp.appearsStart}</span>
                          {showAppearsArrow ? (
                            <>
                              <span className={styles.wispBadgeArrow}>↓</span>
                              <span className={`${styles.wispBadge} ${styles.wispBadgeAppears}`}>{wisp.appearsEnd}</span>
                            </>
                          ) : null}
                        </>
                      ) : null}
                    </div>
                  </div>

                  <div className={styles.wispNames}>
                    <strong className={styles.wispNameVi}>{wisp.nameVi}</strong>
                    <span className={styles.wispNameEn}>{wisp.name}</span>
                  </div>

                  <p className={styles.wispDesc}>{wisp.descriptionVi}</p>

                  {upgrade ? (
                    <div className={styles.wispSection}>
                      <span className={styles.wispSectionLabelUpgrade}>Nâng cấp Hoa Linh</span>
                      <p className={styles.wispSectionBox}>
                        {upgrade}
                        {wisp.blossomUpgradeCost !== null ? ` (${wisp.blossomUpgradeCost} vàng)` : ''}
                      </p>
                    </div>
                  ) : null}

                  {wisp.conditionsVi.length ? (
                    <div className={styles.wispSection}>
                      <span className={styles.wispSectionLabel}>Yêu cầu</span>
                      <ul className={styles.wispConditionList}>
                        {wisp.conditionsVi.map((condition) => (
                          <li key={condition}>{condition}</li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                </article>
              );
            })}
          </div>
        </div>
      ))}

      <div className={styles.batchControls}>
        <span aria-live="polite">Đang hiển thị {Math.min(visibleCount, total)} / {total} linh hỏa</span>
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

type AugmentCategoryKey = 'combat' | 'items' | 'econ' | 'traits' | 'strategic';

const AUGMENT_CATEGORY_COLOR: Record<AugmentCategoryKey, string> = {
  combat: '#a8332a',
  items: '#28568f',
  econ: '#8f6710',
  traits: '#a05a18',
  strategic: '#227a63',
};

/** category (set18-codex.ts) -> 1 trong 5 nhóm combat/items/econ/traits/strategic,
 * tham khảo cách metatft.com/new-set#Augments phân loại augment. "Other"/"Khác"
 * (88/261 augment) cố tình KHÔNG có ở đây: theo build_augments_data.py, augment
 * rơi vào "Other" vì lookup không có tag Augment.Category.* nào cả — đây là fallback
 * rỗng, không phải một loại thật, nên card của nhóm này không hiện chip phân loại
 * thay vì gán bừa 1 trong 5 màu. Không có augment nào map sang "combat" trong data
 * hiện tại (icon/màu vẫn định nghĩa sẵn, phòng khi nguồn dữ liệu bổ sung sau này). */
const AUGMENT_CATEGORY_CHIP: Partial<Record<string, { key: AugmentCategoryKey; label: string }>> = {
  Economic: { key: 'econ', label: 'Econ' },
  Items: { key: 'items', label: 'Items' },
  Trait: { key: 'traits', label: 'Traits' },
  Reroll: { key: 'strategic', label: 'Strategic' },
  Random: { key: 'strategic', label: 'Strategic' },
};

function CategoryGlyph({ category }: { category: AugmentCategoryKey }) {
  switch (category) {
    case 'combat':
      return (
        <svg viewBox="0 0 24 24">
          <path d="M5 19L19 5M19 5h-4M19 5v4" />
          <path d="M19 19L5 5M5 5h4M5 5v4" />
        </svg>
      );
    case 'items':
      return (
        <svg viewBox="0 0 24 24">
          <path d="M7 9h10l-1 10a2 2 0 0 1-2 2H10a2 2 0 0 1-2-2L7 9z" />
          <path d="M9 9V7a3 3 0 0 1 6 0v2" />
        </svg>
      );
    case 'econ':
      return (
        <svg viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="8" />
          <path d="M9 9.5c0-1 1-1.6 2.4-1.6 1.6 0 2.4.7 2.4 1.6 0 2-4.8 1-4.8 3 0 1 1 1.6 2.4 1.6 1.4 0 2.4-.6 2.4-1.6" />
        </svg>
      );
    case 'traits':
      return (
        <svg viewBox="0 0 24 24">
          <path d="M12 3l1.6 5.4L19 10l-5.4 1.6L12 17l-1.6-5.4L5 10l5.4-1.6L12 3z" />
        </svg>
      );
    case 'strategic':
      return (
        <svg viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="8" />
          <path d="M15 9l-2 5-5 2 2-5 5-2z" />
        </svg>
      );
  }
}

/** Tách 1 câu đầu (nội dung chính) khỏi phần còn lại (nội dung phụ, "nếu có") —
 * cắt tại dấu câu đầu tiên theo sau bởi khoảng trắng + chữ hoa/ngoặc, để không cắt
 * nhầm số thập phân (vd "1.5 giây") hay dấu "...". */
const AUGMENT_SENTENCE_SPLIT = /[.!?]\s+(?=[\p{Lu}(])/u;

function splitAugmentContent(text: string): { main: string; secondary: string | null } {
  const match = AUGMENT_SENTENCE_SPLIT.exec(text);
  if (!match) return { main: text, secondary: null };
  const main = text.slice(0, match.index + 1).trim();
  const secondary = text.slice(match.index + match[0].length).trim();
  return { main, secondary: secondary.length > 0 ? secondary : null };
}

function AugmentDetails({
  rarityFilter,
  categoryFilter,
}: {
  rarityFilter: Set18Augment['rarity'] | 'all';
  categoryFilter: string | 'all';
}) {
  const batchSize = 48;
  const [visibleCount, setVisibleCount] = useState(batchSize);
  const filtered = set18Augments.filter(
    (a) => (rarityFilter === 'all' || a.rarity === rarityFilter) && (categoryFilter === 'all' || a.category === categoryFilter),
  );
  const visible = filtered.slice(0, visibleCount);

  useEffect(() => setVisibleCount(batchSize), [categoryFilter, rarityFilter]);

  return (
    <section className={styles.section} id="nang-cap">
      <header className={styles.sectionHead}>
        <span className={styles.eyebrow}>05 · Nâng cấp</span>
        <h2>Nâng cấp (Augment)</h2>
      </header>

      <div className={styles.augmentGrid}>
        {visible.map((augment) => {
          const chip = AUGMENT_CATEGORY_CHIP[augment.category];
          const { main, secondary } = splitAugmentContent(augment.descriptionVi);
          return (
            <article
              className={styles.augmentCard}
              key={augment.icon}
              style={{ '--rarity-color': augment.rarityColor } as CSSProperties}
            >
              {chip || augment.rounds.length > 0 ? (
                <div className={styles.augmentTop}>
                  {chip ? (
                    <span
                      className={styles.categoryChip}
                      style={{ '--cat-color': AUGMENT_CATEGORY_COLOR[chip.key] } as CSSProperties}
                      title={`${chip.label} (map từ category = ${augment.categoryVi})`}
                    >
                      <CategoryGlyph category={chip.key} />
                      <span>{chip.label}</span>
                    </span>
                  ) : (
                    <span />
                  )}
                  {augment.rounds.length > 0 ? (
                    <div className={styles.stagePills} title="Vòng có thể xuất hiện">
                      {augment.rounds.map((round) => (
                        <span className={styles.stagePill} key={round}>
                          {round}
                        </span>
                      ))}
                    </div>
                  ) : null}
                </div>
              ) : null}

              <div className={styles.augmentIconPlate}>
                <Image alt="" height={112} src={augment.icon} width={112} />
              </div>

              <div className={styles.augmentNameBlock}>
                <strong className={styles.augmentNameVi}>{augment.nameVi}</strong>
                <span className={styles.augmentNameEn}>{augment.name}</span>
              </div>

              <div className={styles.augmentContent}>
                <p className={styles.augmentContentMain}>{main}</p>
                {secondary ? <p className={styles.augmentContentSecondary}>{secondary}</p> : null}
              </div>
            </article>
          );
        })}
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
 * dùng lại TraitIcon. Linh hỏa không có icon riêng từng cái trong dữ liệu, chỉ có icon
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

/** Vàng của linh hỏa không chia bậc màu như giá tướng — dùng chung một tông vàng xu với
 * .statIconCoin ở phần 04 để hai chỗ hiển thị giá linh hỏa trông cùng một hệ. */
const WISP_COST_COLOR = '#c0851c';

function effectSourceCostColor(source: Set18EffectSource): string | undefined {
  if (source.kind === 'champion') return set18ChampionByName.get(source.name)?.costColor;
  if (source.kind === 'wisp') return WISP_COST_COLOR;
  return undefined;
}

/** null = linh hỏa không hiện giá mua riêng (phần thưởng miễn phí) → không vẽ pill.
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

export function Set18Codex() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const requestedSection = searchParams.get('section');
  const activeSection: SectionId = SECTIONS.some((section) => section.id === requestedSection)
    ? (requestedSection as SectionId)
    : 'ma-tran-toc-he';
  const sectionHref = useCallback(
    (section: SectionId) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set('section', section);
      return `/mua-18?${params.toString()}`;
    },
    [searchParams],
  );
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

    async function loadSectionData() {
      try {
        if (activeSection === 'linh-hoa') {
          const wisps = await import('@/content/set18/set18-wisps');
          set18Wisps = wisps.set18Wisps;
        } else if (activeSection === 'nang-cap') {
          const augments = await import('@/content/set18/set18-augments');
          set18Augments = augments.set18Augments;
        } else {
          const [traits, champions] = await Promise.all([
            import('@/content/set18/set18-traits'),
            import('@/content/set18/set18-champions'),
          ]);
          set18Traits = traits.set18Traits;
          set18TraitByName = traits.set18TraitByName;
          set18Champions = champions.set18Champions;
          set18ChampionByName = champions.set18ChampionByName;

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
      loadedSection === 'linh-hoa'
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

        {isSectionReady && activeSection === 'linh-hoa' ? (
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
        {isSectionReady && activeSection === 'linh-hoa' ? <WispSection categoryFilter={wispCategoryFilter} groups={wispGroups} /> : null}
        {isSectionReady && activeSection === 'nang-cap' ? (
          <AugmentDetails categoryFilter={augmentCategoryFilter} rarityFilter={augmentRarityFilter} />
        ) : null}
        {isSectionReady && activeSection === 'hieu-ung' ? <EffectDetails onHide={hideTooltip} onShow={showTooltip} /> : null}
      </div>

      <ChampionTooltip state={tooltip} />
    </div>
  );
}
