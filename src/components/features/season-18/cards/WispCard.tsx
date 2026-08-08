import Image from 'next/image';
import type { Set18Wisp } from '@/content/set18/set18-types';
import styles from '../Set18Codex.module.css';

export function WispCard({
  wisp,
  id,
}: {
  wisp: Set18Wisp;
  /** DOM id để search (?focus=slug) cuộn tới đúng thẻ — xem Set18Codex.tsx. */
  id?: string;
}) {
  const upgrade = wisp.blossomUpgradeDescriptionVi;
  const showCostArrow = upgrade && wisp.blossomUpgradeCost !== null && wisp.blossomUpgradeCost !== wisp.cost;
  const showAppearsArrow = wisp.appearsEnd && wisp.appearsEnd !== wisp.appearsStart;

  return (
    <article className={styles.wispCard} id={id}>
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
}
