import type { MetaCompTrend, MetaCompVerdict } from '@/content/meta-comps';
import { formatViDecimal } from './meta-matrix-model';
import { VerdictSymbol } from './VerdictSymbol';
import styles from './Legend.module.css';

const TREND_ITEMS: { trend: MetaCompTrend; symbol: string; label: string }[] = [
  { trend: 'up', symbol: '▲', label: 'Mạnh lên' },
  { trend: 'down', symbol: '▼', label: 'Yếu đi' },
  { trend: 'flat', symbol: '–', label: 'Giữ nguyên' },
];

const VERDICT_ORDER: MetaCompVerdict[] = ['meta', 'predicted', 'viable', 'avoid'];

/** Chú giải ký hiệu — luôn hiển thị phía trên ma trận (không ẩn sau tooltip)
 * vì cả trang chỉ dùng ký hiệu để truyền tải verdict/trend/badge. Ngưỡng của
 * "Bị tranh"/"Giữ điểm"/"Ăn top 1" đọc từ metaCompsSnapshot.thresholds nên
 * luôn khớp số liệu thật trong meta-comps.ts. */
export function Legend({
  previousPatch,
  thresholds,
}: {
  previousPatch: string;
  thresholds: { contestedPick: number; holdTop4: number; ceilingWin: number };
}) {
  return (
    <div className={styles.legend}>
      <div className={styles.group}>
        <span className={styles.groupLabel}>Xếp loại</span>
        <ul className={styles.items}>
          {VERDICT_ORDER.map((verdict) => (
            <li className={styles.item} key={verdict}>
              <VerdictSymbol showLabel verdict={verdict} />
            </li>
          ))}
        </ul>
      </div>

      <div className={styles.group}>
        <span className={styles.groupLabel}>Xu hướng so với {previousPatch}</span>
        <ul className={styles.items}>
          {TREND_ITEMS.map(({ trend, symbol, label }) => (
            <li className={styles.item} key={trend}>
              <span className={styles.trendSymbol} data-trend={trend}>
                <span aria-hidden="true">{symbol}</span>
                <span className={styles.trendLabel}>{label}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>

      <p className={styles.note}>Hạng trung bình càng thấp càng tốt (1 = nhất, 8 = bét).</p>
      <p className={styles.note}>
        Bị tranh: tỉ lệ chọn ≥ {formatViDecimal(thresholds.contestedPick, 0)}% · Giữ điểm: Top 4 ≥{' '}
        {formatViDecimal(thresholds.holdTop4, 0)}% · Ăn top 1: Top 1 ≥ {formatViDecimal(thresholds.ceilingWin, 0)}%
      </p>
    </div>
  );
}
