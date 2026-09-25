import Image from 'next/image';
import type { CSSProperties } from 'react';
import styles from './CostPortrait.module.css';

/** Ánh xạ giá vàng -> token màu viền đã có sẵn trong tokens.css
 * (--cost-1..--cost-5, dùng chung với thẻ tướng ở trang Set 18). */
function costColorVar(cost: number): string {
  const clamped = Math.min(5, Math.max(1, Math.round(cost)));
  return `var(--cost-${clamped})`;
}

export function CostPortrait({
  name,
  cost,
  image,
  size = 40,
  large = false,
}: {
  name: string;
  cost: number;
  image: string;
  size?: number;
  large?: boolean;
}) {
  const style = { '--cost-color': costColorVar(cost) } as CSSProperties;
  return (
    <span className={[styles.portrait, large ? styles.large : ''].join(' ')} style={style} title={name}>
      <Image alt={name} height={size} sizes={`${size}px`} src={image} width={size} />
    </span>
  );
}
