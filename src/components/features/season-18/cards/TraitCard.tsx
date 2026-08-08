import type { CSSProperties, ReactNode } from 'react';
import type { Set18Trait, Set18TraitBreakpointBullet } from '@/content/set18/set18-types';
import styles from '../Set18Codex.module.css';
import { TraitIcon } from './shared';

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
export function BulletText({ bullet }: { bullet: Set18TraitBreakpointBullet }) {
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
export function BountyBoard({ bounties }: { bounties: Set18Bounty[] }) {
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

/** Thẻ chi tiết 1 trait, dùng chung giữa lưới `/mua-18/toc-he` (Set18Codex) và
 * route chi tiết `/mua-18/toc-he/[slug]`. Danh sách tướng thuộc trait được
 * render qua `renderChampion` thay vì cố định logic tooltip: Set18Codex dùng
 * ChampionLogo (hover tooltip), route chi tiết dùng Link (điều hướng SEO). */
export function TraitCard({
  trait,
  championNames,
  renderChampion,
  id,
}: {
  trait: Set18Trait;
  championNames: string[];
  renderChampion: (name: string) => ReactNode;
  /** DOM id để search (?focus=slug) cuộn tới đúng thẻ — xem Set18Codex.tsx. */
  id?: string;
}) {
  return (
    <article
      className={trait.wide ? `${styles.traitCard} ${styles.traitCardWide}` : styles.traitCard}
      id={id}
      style={{ '--trait-accent': trait.accent } as CSSProperties}
    >
      <header className={styles.traitHead}>
        <TraitIcon size={30} trait={trait} />
        <div>
          <strong>{trait.vi}</strong>
          <span className={styles.traitEn}>{trait.name}</span>
        </div>
      </header>

      {/* Trait ẩn (Thiên Thực) không có mốc chọn được — chip "0" và
          "0 tướng" chỉ gây hiểu nhầm, thay bằng điều kiện kích hoạt. */}
      {trait.activation ? (
        <p className={styles.traitActivation}>{trait.activation}</p>
      ) : (
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
      )}

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

      {trait.subEffects?.items.length ? (
        <div className={styles.traitSubEffects}>
          {trait.subEffects.title ? <span className={styles.traitSubTitle}>{trait.subEffects.title}</span> : null}
          <ul className={styles.traitSubList}>
            {trait.subEffects.items.map((item) => (
              <li key={item.label}>
                <span className={styles.traitSubLabel}>{item.label}</span>
                <span>{item.text}</span>
              </li>
            ))}
          </ul>
        </div>
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

      {trait.note ? <p className={styles.traitNote}>{trait.note}</p> : null}

      {trait.bounties?.length ? <BountyBoard bounties={trait.bounties} /> : null}

      {championNames.length ? (
        <div className={styles.traitMembers}>
          <span className={styles.breakLabel}>{championNames.length} tướng</span>
          <div className={styles.memberLogos}>{championNames.map((name) => renderChampion(name))}</div>
        </div>
      ) : null}
    </article>
  );
}
