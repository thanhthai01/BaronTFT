import Image from 'next/image';
import type { CSSProperties } from 'react';
import type { Set18Augment } from '@/content/set18/set18-types';
import styles from '../Set18Codex.module.css';

export type AugmentCategoryKey = 'combat' | 'items' | 'econ' | 'traits' | 'strategic';

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

export function splitAugmentContent(text: string): { main: string; secondary: string | null } {
  const match = AUGMENT_SENTENCE_SPLIT.exec(text);
  if (!match) return { main: text, secondary: null };
  const main = text.slice(0, match.index + 1).trim();
  const secondary = text.slice(match.index + match[0].length).trim();
  return { main, secondary: secondary.length > 0 ? secondary : null };
}

export function AugmentCard({
  augment,
  id,
}: {
  augment: Set18Augment;
  /** DOM id để search (?focus=slug) cuộn tới đúng thẻ — xem Set18Codex.tsx. */
  id?: string;
}) {
  const chip = AUGMENT_CATEGORY_CHIP[augment.category];
  const { main, secondary } = splitAugmentContent(augment.descriptionVi);

  return (
    <article className={styles.augmentCard} id={id} style={{ '--rarity-color': augment.rarityColor } as CSSProperties}>
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
        <Image alt="" height={112} sizes="112px" src={augment.icon} width={112} />
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
}
