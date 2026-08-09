'use client';

import Image from 'next/image';
import { useId, useLayoutEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import type { Set18Champion, Set18ChampionForm, Set18ChampionStats, Set18Trait } from '@/content/set18/set18-types';
import styles from '../Set18Codex.module.css';
import { CostPill, TraitIcon, traitTitle } from './shared';

export function statRows(s: Set18ChampionStats) {
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

function resolveTraits(names: string[], traitByName: Map<string, Set18Trait>): Set18Trait[] {
  return names.map((name) => traitByName.get(name)).filter((trait): trait is Set18Trait => Boolean(trait));
}

/** Tướng không có nhiều dạng chỉ dùng field cấp tướng làm 1 "dạng" duy nhất, để
 * ChampionCard luôn render qua chung một đường (form-based), không tách 2 nhánh code. */
export function escapeAbilityText(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .split('\n')
    .join('<br>');
}

export function championForms(champion: Set18Champion): Set18ChampionForm[] {
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

/** Sàn chiều cao thẻ tướng — dưới mức này thẻ trông hụt so với ảnh và hàng chỉ số.
 * Export vì ChampionCostGrid (Set18Codex.tsx) cũng dùng làm sàn khi cào bằng
 * chiều cao lưới theo card cao nhất. */
export const MIN_CARD_HEIGHT = 400;

/** Cả mặt thẻ là vùng bấm để lật (thay cho nút "Xem số liệu" ở góc). Vì dùng
 * div role="button" nên phải tự nối phím: trình duyệt chỉ tự xử lý Enter/Space
 * cho <button> thật. preventDefault ở Space để trang không cuộn xuống. */
function flipKeyDown(action: () => void) {
  return (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    event.preventDefault();
    action();
  };
}

/** Phần nội dung mặt trước (định danh + kỹ năng) — tách riêng để thước đo ẩn
 * dựng lại được y hệt cho MỌI dạng, phục vụ việc khoá chiều cao thẻ. */
export function CardFrontContent({
  champion,
  form,
  traitRow,
  frontIdRef,
  bodyRef,
}: {
  champion: Set18Champion;
  form: Set18ChampionForm;
  traitRow: React.ReactNode;
  frontIdRef?: React.Ref<HTMLDivElement>;
  bodyRef?: React.Ref<HTMLDivElement>;
}) {
  return (
    <>
      <div className={styles.frontId} ref={frontIdRef}>
        <div className={styles.miniHead}>
          <Image alt={champion.name} className={styles.miniLogo} height={56} sizes="56px" src={form.image} width={56} />
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
            <Image alt="" className={styles.abilityIcon} height={28} sizes="28px" src={form.abilityIcon} width={28} />
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
    </>
  );
}

/** Thẻ lật — mặt trước logo mini + kỹ năng đầy đủ (icon, mana, mô tả màu theo game,
 * công thức sát thương), mặt sau ảnh lớn + số liệu. Tướng nhiều dạng (Lux, Nidalee,
 * 4 tướng Thích Ứng AD/AP) có thêm rail chọn dạng nằm cạnh thẻ, không xoay theo khi lật.
 * Chuyển từ Set18/reports/set18_champion_cards.html (đã duyệt qua nhiều vòng preview).
 *
 * `traitByName` được truyền vào thay vì đọc biến module-level: component này
 * dùng chung giữa Set18Codex (đọc từ dữ liệu lazy-load theo section) và các
 * route chi tiết /mua-18/tuong/[slug] (server component truyền thẳng dữ liệu). */
export function ChampionCard({
  champion,
  traitByName,
  id,
}: {
  champion: Set18Champion;
  traitByName: Map<string, Set18Trait>;
  /** DOM id để search (?focus=slug) cuộn tới đúng thẻ — xem Set18Codex.tsx. */
  id?: string;
}) {
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
  const sizerRef = useRef<HTMLDivElement>(null);

  const form = forms[Math.min(activeForm, forms.length - 1)];

  // Chiều cao phải tính theo dạng DÀI NHẤT, không theo dạng đang chọn. Trước đây
  // effect phụ thuộc vào `form` nên đổi dạng Lux là thẻ co lại — và vì lưới
  // (ChampionCostGrid) cào bằng chiều cao mọi thẻ theo thẻ cao nhất, Lux co thì
  // kéo tụt luôn cả lưới. Thước đo ẩn dựng sẵn mọi dạng để lấy max một lần.
  //
  // Chỉ CÔNG BỐ chiều cao nội dung qua data-natural-height, không tự gán style:
  // việc chọn chiều cao chung là của lưới. Đo từ scrollHeight của phần nội dung
  // nên không phụ thuộc chiều cao lưới đang áp — nhờ vậy con số này luôn là nhu
  // cầu thật, giảm được chứ không chỉ tăng.
  useLayoutEffect(() => {
    const frontH = (frontIdRef.current?.offsetHeight ?? 0) + (bodyRef.current?.scrollHeight ?? 0);
    const backH = backRef.current
      ? Array.from(backRef.current.children).reduce((sum, child) => sum + (child as HTMLElement).offsetHeight, 0)
      : 0;
    const sizerH = sizerRef.current
      ? Array.from(sizerRef.current.children).reduce(
          (max, child) => Math.max(max, (child as HTMLElement).offsetHeight),
          0,
        )
      : 0;
    if (flipRef.current) {
      flipRef.current.dataset.naturalHeight = String(Math.max(MIN_CARD_HEIGHT, frontH, backH, sizerH));
    }
  });

  const traits = resolveTraits(form.traits, traitByName);
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
      id={id}
      ref={flipRef}
      style={{ '--cost-color': champion.costColor } as CSSProperties}
    >
      {forms.length > 1 ? (
        <div className={styles.rail}>
          {forms.map((f, index) => {
            const isAdAp = f.label === 'AD' || f.label === 'AP';
            const railColor = f.label === 'AD' ? '#c97a1e' : f.label === 'AP' ? '#6e5ce0' : undefined;
            const formTraits = isAdAp ? [] : resolveTraits(f.traits, traitByName);
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

      {/* Thước đo ẩn: dựng mặt trước của mọi dạng để lấy chiều cao lớn nhất một
          lần, rồi khoá thẻ ở đó. Không đọc được bởi trình đọc màn hình và không
          nhận chuột. Chỉ dựng khi tướng có nhiều hơn 1 dạng. */}
      {forms.length > 1 ? (
        <div aria-hidden className={styles.sizer} ref={sizerRef}>
          {forms.map((f) => (
            <div className={styles.sizerFace} key={f.label}>
              <CardFrontContent
                champion={champion}
                form={f}
                traitRow={
                  <div className={styles.traitsRow}>
                    {resolveTraits(f.traits, traitByName).map((trait) => (
                      <span className={styles.traitChip} key={trait.name}>
                        <TraitIcon size={22} trait={trait} />
                        {trait.vi}
                      </span>
                    ))}
                  </div>
                }
              />
            </div>
          ))}
        </div>
      ) : null}

      <div className={styles.flipInner}>
          <div
            aria-controls={backFaceId}
            aria-hidden={flipped}
            aria-label={`Xem số liệu của ${champion.name}, dạng ${form.label}`}
            aria-pressed={flipped}
            className={`${styles.face} ${styles.faceClickable}`}
            id={frontFaceId}
            inert={flipped ? true : undefined}
            onClick={() => setFlipped(true)}
            onKeyDown={flipKeyDown(() => setFlipped(true))}
            role="button"
            tabIndex={flipped ? -1 : 0}
          >
            <CardFrontContent
              bodyRef={bodyRef}
              champion={champion}
              form={form}
              frontIdRef={frontIdRef}
              traitRow={traitRow}
            />
          </div>

          <div
            aria-controls={frontFaceId}
            aria-hidden={!flipped}
            aria-label={`Xem kỹ năng của ${champion.name}, dạng ${form.label}`}
            aria-pressed={flipped}
            className={`${styles.face} ${styles.back} ${styles.faceClickable}`}
            id={backFaceId}
            inert={!flipped ? true : undefined}
            onClick={() => setFlipped(false)}
            onKeyDown={flipKeyDown(() => setFlipped(false))}
            ref={backRef}
            role="button"
            tabIndex={flipped ? 0 : -1}
          >
            <div className={styles.backHead}>
              <div className={styles.nameRow}>
                <strong className={styles.uname}>{champion.name}</strong>
                <span className={styles.urole}>{champion.role}</span>
              </div>
              <CostPill color={champion.costColor} cost={champion.cost} />
            </div>
            <div className={styles.thumbWrap}>
              <Image
                alt={champion.name}
                className={styles.bigThumb}
                height={220}
                sizes="(min-width: 1280px) 340px, (min-width: 768px) 28vw, 90vw"
                src={form.bigImage}
                width={340}
              />
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
          </div>
        </div>
      </article>
  );
}
