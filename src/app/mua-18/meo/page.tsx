import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { set18Tips } from '@/content/set18/set18-tips';
import { set18EntityById } from '@/content/set18/set18-entity-index';
import { set18EntityUrl } from '@/lib/set18-entity-url';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'Mẹo Mùa 18',
  description: 'Mẹo chơi Mùa 18 dịch và biên soạn từ datatft, gắn trực tiếp với tướng và tộc hệ liên quan trong codex.',
  alternates: { canonical: '/mua-18/meo' },
};

/** Mỗi mẹo tự liệt kê entity codex liên quan (đã gắn tay lúc soát bản dịch —
 * xem set18_tips.championIds/traitIds) thay vì chỉ nói suông tên tướng/tộc hệ,
 * để người đọc bấm thẳng sang trang chi tiết tương ứng. */
function TipEntityChips({ ids }: { ids: string[] }) {
  if (!ids.length) return null;
  return (
    <ul className={styles.entityChips}>
      {ids.map((id) => {
        const entity = set18EntityById.get(id);
        const href = set18EntityUrl(id);
        if (!entity || !href) return null;
        return (
          <li key={id}>
            <Link className={styles.entityChip} href={href}>
              <Image alt="" height={28} src={entity.icon} width={28} />
              <span>{entity.nameVi ?? entity.name}</span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

export default function TipsPage() {
  return (
    <section className={styles.page}>
      <div className="wide-container">
        <header className={styles.header}>
          <span className="kicker">Mùa 18 · Mẹo</span>
          <h1>Mẹo Mùa 18</h1>
          <p>Mẹo chơi dịch và biên soạn tay từ datatft, gắn trực tiếp với tướng/tộc hệ liên quan trong codex.</p>
        </header>

        {set18Tips.length === 0 ? (
          <p className={styles.empty}>Chưa có mẹo nào được duyệt — đang được biên soạn.</p>
        ) : (
          <div className={styles.list}>
            {set18Tips.map((tip) => (
              <article className={styles.card} id={tip.slug} key={tip.id}>
                <h2>{tip.titleVi}</h2>
                <p>{tip.contentVi}</p>
                <TipEntityChips ids={[...tip.championIds, ...tip.traitIds]} />
                {tip.sourceUrl && (
                  <a className={styles.source} href={tip.sourceUrl} rel="noreferrer" target="_blank">
                    Nguồn gốc ↗
                  </a>
                )}
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
