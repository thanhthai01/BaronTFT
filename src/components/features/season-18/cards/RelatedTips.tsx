import Link from 'next/link';
import { set18Tips } from '@/content/set18/set18-tips';
import styles from './EntityDetailShell.module.css';

/** Chiều ngược của TipEntityChips ở /mua-18/meo — mẹo nào có gắn entity này
 * (qua championIds/traitIds, gắn tay lúc soát bản dịch) thì hiện lại ở đây.
 * Không render gì nếu chưa có mẹo nào nhắc tới (đúng trạng thái hiện tại: bảng
 * set18_tips còn rỗng cho tới khi có mẹo đầu tiên được duyệt). */
export function RelatedTips({ entityId }: { entityId: string }) {
  const tips = set18Tips.filter((tip) => tip.championIds.includes(entityId) || tip.traitIds.includes(entityId));
  if (!tips.length) return null;
  return (
    <div className={styles.patchNote}>
      <span className={styles.patchNoteKind}>Mẹo liên quan</span>{' '}
      {tips.map((tip, index) => (
        <span key={tip.id}>
          {index > 0 ? ', ' : ''}
          <Link className={styles.inlineLink} href={`/mua-18/meo#${tip.slug}`}>{tip.titleVi}</Link>
        </span>
      ))}
    </div>
  );
}
