import type { MetaCompVerdict } from '@/content/meta-comps';
import styles from './VerdictSymbol.module.css';

/** Ký hiệu + nhãn tiếng Việt cho từng mức verdict — dùng ở cả legend và từng
 * thẻ đội hình. Không dựa màu đơn thuần: luôn kèm chữ (label hiện hoặc
 * ẩn qua sr-only) để đọc được khi mù màu / dùng trình đọc màn hình. */
export const VERDICT_META: Record<MetaCompVerdict, { symbol: string; label: string }> = {
  meta: { symbol: '★', label: 'Mạnh' },
  predicted: { symbol: '◆', label: 'Dự đoán mạnh' },
  viable: { symbol: '○', label: 'Chơi được' },
  avoid: { symbol: '✕', label: 'Tránh' },
};

export function VerdictSymbol({
  verdict,
  showLabel = false,
}: {
  verdict: MetaCompVerdict;
  showLabel?: boolean;
}) {
  const meta = VERDICT_META[verdict];
  return (
    <span className={styles.symbol} data-verdict={verdict}>
      <span aria-hidden="true">{meta.symbol}</span>
      {showLabel ? (
        <span className={styles.label}>{meta.label}</span>
      ) : (
        <span className="visually-hidden">{meta.label}</span>
      )}
    </span>
  );
}
