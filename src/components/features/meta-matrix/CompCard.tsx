import Image from 'next/image';
import type { MetaComp, MetaCompRankKey, MetaCompShape, MetaCompTrend } from '@/content/meta-comps';
import { metaCompsSnapshot } from '@/content/meta-comps';
import { formatViDecimal, formatViInteger } from './meta-matrix-model';
import { CostPortrait } from './CostPortrait';
import { VerdictSymbol } from './VerdictSymbol';
import styles from './CompCard.module.css';

const TREND_META: Record<MetaCompTrend, { symbol: string; label: string }> = {
  up: { symbol: '▲', label: 'Mạnh lên' },
  down: { symbol: '▼', label: 'Yếu đi' },
  flat: { symbol: '–', label: 'Giữ nguyên' },
};

const SHAPE_META: Record<MetaCompShape, { label: string }> = {
  hold: { label: 'Giữ điểm' },
  ceiling: { label: 'Ăn top 1' },
};

/** Thẻ đội hình gọn trong ma trận. Số liệu hiển thị (verdict/avg/trend/badge/
 * thứ tự xếp) theo `rankKey` đang chọn ở RankSwitcher — mỗi CompCard chỉ
 * render cho 1 mức rank vì ma trận được dựng riêng cho từng rank ở page.tsx.
 * Dùng <details>/<summary> để mở rộng xem item/đội hình đầy đủ — không cần
 * JS phía client, hoạt động cả khi tắt JS. */
export function CompCard({ comp, rankKey }: { comp: MetaComp; rankKey: MetaCompRankKey }) {
  const rank = comp.ranks[rankKey];
  const trend = TREND_META[rank.trend];
  const isAvoid = rank.verdict === 'avoid';
  const firstCarry = comp.carries[0];
  const restCarries = comp.carries.slice(1);
  const { thresholds, ranks: rankMeta } = metaCompsSnapshot;

  const deltaLabel = `Bản trước ${formatViDecimal(rank.prevAvg)} → hiện tại ${formatViDecimal(rank.avg)}`;
  const hasBadges = rank.contested || rank.shapes.length > 0;

  return (
    <details className={styles.card} data-verdict={rank.verdict}>
      <summary className={styles.summary}>
        <span className={styles.row1}>
          <span className={styles.headline}>
            <VerdictSymbol verdict={rank.verdict} />
            <span className={isAvoid ? styles.nameAvoid : styles.name}>{comp.name}</span>
          </span>

          <span className={styles.avgWrap} title={deltaLabel}>
            <span className={styles.avg}>{formatViDecimal(rank.avg)}</span>
            <span className={styles.trend} data-trend={rank.trend}>
              <span aria-hidden="true">{trend.symbol}</span>
              <span className="visually-hidden">{trend.label}</span>
            </span>
          </span>

          <span aria-hidden="true" className={styles.chevron} />
        </span>

        {hasBadges ? (
          <span className={styles.badgeRow}>
            {rank.contested ? (
              <span
                className={styles.contestedBadge}
                title={`Tỉ lệ chọn ${formatViDecimal(rank.pick, 1)}% — dễ đụng người cùng đội hình`}
              >
                Bị tranh
              </span>
            ) : null}
            {rank.shapes.map((shape) => (
              <span
                className={styles.shapeBadge}
                data-shape={shape}
                key={shape}
                title={
                  shape === 'hold'
                    ? `Top 4 ≥ ${formatViDecimal(thresholds.holdTop4, 0)}%`
                    : `Top 1 ≥ ${formatViDecimal(thresholds.ceilingWin, 0)}%`
                }
              >
                {SHAPE_META[shape].label}
              </span>
            ))}
          </span>
        ) : null}

        <span className={styles.row2}>
          <span className={styles.portraits}>
            {firstCarry ? <CostPortrait cost={firstCarry.cost} image={firstCarry.image} name={firstCarry.name} size={30} /> : null}
            {restCarries.map((carry) => (
              <CostPortrait cost={carry.cost} image={carry.image} key={carry.name} name={carry.name} size={20} />
            ))}
          </span>

          <span className={styles.playstyle}>{comp.playstyle}</span>

          <span className={styles.miniStats}>
            T4 {formatViDecimal(rank.top4, 1)}% · T1 {formatViDecimal(rank.win, 1)}%
          </span>
        </span>
      </summary>

      <div className={styles.expanded}>
        {comp.carries.map((carry) => (
          <div className={styles.carryDetail} key={carry.name}>
            <CostPortrait cost={carry.cost} image={carry.image} name={carry.name} size={22} />
            <span className={styles.carryDetailName} title={carry.name}>
              {carry.name}
            </span>
            <span className={styles.itemRow}>
              {/* Carry có thể cầm 2 món trùng (vd 2× Quyền Trượng Thiên Thần) nên key kèm vị trí.
               * Tên món đồ vào title (hover) + visually-hidden (đọc màn hình), không in chữ dài ra thẻ. */}
              {carry.items.map((item, index) => (
                <span className={styles.item} key={`${index}-${item.name}`} title={item.name}>
                  <Image alt="" className={styles.itemIcon} height={27} sizes="27px" src={item.icon} width={27} />
                  <span className="visually-hidden">{item.name}</span>
                </span>
              ))}
            </span>
          </div>
        ))}

        <div className={styles.unitsRow}>
          {comp.units.map((unit) => (
            <CostPortrait cost={unit.cost} image={unit.image} key={unit.name} name={unit.name} size={26} />
          ))}
        </div>

        <p className={styles.rankStrip}>
          {rankMeta.map((r, index) => (
            <span data-active={r.key === rankKey ? 'true' : undefined} key={r.key}>
              {index > 0 ? <span aria-hidden="true" className={styles.rankStripSep}>·</span> : null}
              {r.label} {formatViDecimal(comp.ranks[r.key].avg)}
            </span>
          ))}
        </p>

        <p className={styles.note}>{comp.note}</p>
        <p className={styles.sample}>
          {deltaLabel} · {formatViInteger(rank.n)} trận · tỉ lệ chọn {formatViDecimal(rank.pick, 1)}%
        </p>
      </div>
    </details>
  );
}
