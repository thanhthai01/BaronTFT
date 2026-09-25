import type { MetaCompRankKey } from '@/content/meta-comps';
import type { MetaMatrixRow } from './meta-matrix-model';
import { CompCard } from './CompCard';
import styles from './MetaMatrix.module.css';

/** Ma trận 5 hàng (giá vàng carry, 5→1) x 2 cột (AP/AD), số liệu theo
 * `rankKey`. Ở màn hẹp (≤760px, xem MetaMatrix.module.css) 2 cột xếp chồng
 * thành khối AP rồi khối AD cho từng hàng — .mobileColLabel (ẩn trên
 * desktop) làm nhãn khối đó khi đã xếp dọc. */
export function MetaMatrix({ rows, rankKey }: { rows: MetaMatrixRow[]; rankKey: MetaCompRankKey }) {
  return (
    <div className={styles.matrix}>
      <div aria-hidden="true" className={styles.header}>
        <span className={styles.headerSpacer} />
        <span className={styles.headerCol}>
          AP
          <small>Sát thương phép</small>
        </span>
        <span className={styles.headerCol}>
          AD
          <small>Sát thương vật lý</small>
        </span>
      </div>

      {rows.map((row) => (
        <div className={styles.row} key={row.cost}>
          <div className={styles.rowLabel}>{row.cost} vàng</div>

          <div className={styles.cell}>
            <span className={styles.mobileColLabel}>AP · Sát thương phép</span>
            {row.ap.comps.length ? (
              row.ap.comps.map((comp) => <CompCard comp={comp} key={comp.id} rankKey={rankKey} />)
            ) : (
              <p className={styles.empty}>Chưa có đội đủ mạnh</p>
            )}
          </div>

          <div className={styles.cell}>
            <span className={styles.mobileColLabel}>AD · Sát thương vật lý</span>
            {row.ad.comps.length ? (
              row.ad.comps.map((comp) => <CompCard comp={comp} key={comp.id} rankKey={rankKey} />)
            ) : (
              <p className={styles.empty}>Chưa có đội đủ mạnh</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
