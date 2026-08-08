import Link from 'next/link';
import { patchKindMeta } from '@/content/patch-notes';
import { findLatestPatchForEntity } from '@/lib/patch-entity-lookup';
import styles from './EntityDetailShell.module.css';

/** Dải "Bản vá gần nhất" ở trang chi tiết tướng/tộc hệ — chiều ngược của link
 * patch → codex. Không render gì nếu entity chưa từng xuất hiện trong bản vá
 * nào. `/patch/${report.id}` luôn đúng kể cả khi report là bản mới nhất — route
 * đó tự redirect về `/patch` (xem app/patch/[version]/page.tsx), không cần rẽ
 * nhánh riêng ở đây. */
export function LatestPatchNote({ entityId }: { entityId: string }) {
  const found = findLatestPatchForEntity(entityId);
  if (!found) return null;
  const { report, entry } = found;
  return (
    <p className={styles.patchNote}>
      <span className={styles.patchNoteKind}>{patchKindMeta[entry.kind].label}</span>
      {' ở bản '}
      <Link className={styles.inlineLink} href={`/patch/${report.id}`}>{report.version}</Link>
      {entry.note ? ` (${entry.note})` : ''}
    </p>
  );
}
