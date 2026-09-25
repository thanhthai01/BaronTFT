import type { Metadata } from 'next';
import { metaComps, metaCompsSnapshot } from '@/content/meta-comps';
import { buildMetaMatrix } from '@/components/features/meta-matrix/meta-matrix-model';
import { Legend } from '@/components/features/meta-matrix/Legend';
import { MetaMatrix } from '@/components/features/meta-matrix/MetaMatrix';
import { RankSwitcher, type RankPanel } from '@/components/features/meta-matrix/RankSwitcher';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'Đội hình meta',
  description:
    'Ma trận đội hình TFT đang mạnh hoặc dự đoán sẽ mạnh trong bản vá hiện tại, xếp theo loại sát thương (AP/AD) và giá vàng carry, kèm số liệu Top 4/Top 1 và trang bị theo từng mức rank.',
  alternates: { canonical: '/doi-hinh-meta' },
};

export default function MetaMatrixPage() {
  const { patch, previousPatch, updatedVi, source, ranks, defaultRank, thresholds } = metaCompsSnapshot;

  const panels: RankPanel[] = ranks.map((rank) => ({
    key: rank.key,
    label: rank.label,
    sampleSize: rank.sampleSize,
    node: <MetaMatrix rankKey={rank.key} rows={buildMetaMatrix(metaComps, rank.key)} />,
  }));

  return (
    <>
      <header className={['page-header', styles.header].join(' ')}>
        <div className="wide-container">
          <span className="kicker">Đội hình meta · {patch}</span>
          <h1>Ma trận đội hình leo rank</h1>
          <p>
            Số liệu {source} · cập nhật {updatedVi}
          </p>
        </div>
      </header>

      <section className={['section', styles.section].join(' ')}>
        <div className={['wide-container', styles.stack].join(' ')}>
          <Legend previousPatch={previousPatch} thresholds={thresholds} />
          <RankSwitcher defaultRank={defaultRank} panels={panels} source={source} />
        </div>
      </section>
    </>
  );
}
