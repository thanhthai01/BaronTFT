'use client';

import { useState, type ReactNode } from 'react';
import type { MetaCompRankKey } from '@/content/meta-comps';
import { Tabs, tabElementId, tabPanelId } from '@/components/design-system/Tabs/Tabs';
import { formatViInteger } from './meta-matrix-model';
import styles from './RankSwitcher.module.css';

const ID_PREFIX = 'meta-matrix-rank-';

export type RankPanel = {
  key: MetaCompRankKey;
  label: string;
  sampleSize: number;
  node: ReactNode;
};

/** Bộ chuyển mức rank cho /doi-hinh-meta. Ma trận của cả 3 mức rank được
 * render sẵn ở server (page.tsx truyền vào qua `panels`) — component này
 * chỉ là lớp client mỏng để ẩn/hiện panel đang chọn bằng `hidden`, giữ JS
 * phía client ở mức tối thiểu. Khi tắt JS, `useState` vẫn khởi tạo bằng
 * `defaultRank` nên panel mặc định luôn hiển thị (hidden=false) ngay từ lần
 * render server đầu tiên. */
export function RankSwitcher({
  defaultRank,
  panels,
  source,
}: {
  defaultRank: MetaCompRankKey;
  panels: RankPanel[];
  source: string;
}) {
  const [value, setValue] = useState<MetaCompRankKey>(defaultRank);
  const active = panels.find((panel) => panel.key === value) ?? panels[0];

  return (
    <div className={styles.switcher}>
      <div className={styles.controls}>
        <Tabs
          className={styles.tabs}
          idPrefix={ID_PREFIX}
          label="Chọn mức rank"
          tabs={panels.map((panel) => ({ id: panel.key, label: panel.label }))}
          value={value}
          onChange={(next) => setValue(next as MetaCompRankKey)}
        />
        {active ? (
          <p className={styles.meta}>
            Số liệu {source} · {active.label} · {formatViInteger(active.sampleSize)} đội hình
          </p>
        ) : null}
      </div>

      {panels.map((panel) => (
        <div
          aria-labelledby={tabElementId(ID_PREFIX, panel.key)}
          hidden={panel.key !== value}
          id={tabPanelId(ID_PREFIX, panel.key)}
          key={panel.key}
          role="tabpanel"
        >
          {panel.node}
        </div>
      ))}
    </div>
  );
}
