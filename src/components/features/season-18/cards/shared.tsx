import Image from 'next/image';
import type { CSSProperties } from 'react';
import type { Set18Trait } from '@/content/set18/set18-types';
import styles from '../Set18Codex.module.css';

export function traitTitle(trait: Set18Trait) {
  return `${trait.vi} (${trait.name}) — ${trait.typeVi}, mốc ${trait.breaksLabel}`;
}

/**
 * Mọi icon tộc hệ đều là silhouette trắng nền trong suốt (chuẩn hoá bởi
 * Set18/normalize_trait_icons.py), nên chỉ cần một kiểu nền duy nhất — màu
 * nền lấy từ `trait.accent` trong dữ liệu, không suy đoán trong component.
 */
export function TraitIcon({ trait, size = 26 }: { trait: Set18Trait; size?: number }) {
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
export function CostPill({ cost, color }: { cost: number; color: string }) {
  return (
    <span className={styles.costPill} style={{ '--cost-color': color } as CSSProperties}>
      <i className={styles.costPillIcon} />
      {cost}
    </span>
  );
}
