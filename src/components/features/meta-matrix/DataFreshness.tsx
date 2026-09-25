'use client';

import { useEffect, useState } from 'react';
import styles from './DataFreshness.module.css';

/** So lệch theo NGÀY LỊCH (không phải 24h tròn) — vd chụp 23h hôm qua, xem 00h05
 * hôm nay vẫn tính "1 ngày trước" chứ không phải "hôm nay". */
function diffCalendarDays(fetchedAt: string, now: Date): number {
  const fetched = new Date(fetchedAt);
  const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
  return Math.round((startOfDay(now) - startOfDay(fetched)) / 86_400_000);
}

function relativeLabel(diffDays: number): string {
  if (diffDays <= 0) return 'hôm nay';
  if (diffDays === 1) return '1 ngày trước';
  return `${diffDays} ngày trước`;
}

/** Dòng "cập nhật {ngày}" — số ngày tương đối chỉ tính sau khi mount (client có
 * giờ thật của người xem), tránh lệch giờ server/client gây hydration mismatch.
 * Trước khi mount chỉ hiện ngày tĩnh (khớp với những gì server đã render). */
export function DataFreshness({ fetchedAt, updatedVi }: { fetchedAt: string; updatedVi: string }) {
  const [diffDays, setDiffDays] = useState<number | null>(null);

  useEffect(() => {
    setDiffDays(diffCalendarDays(fetchedAt, new Date()));
  }, [fetchedAt]);

  const isStale = diffDays !== null && diffDays > 4;

  return (
    <>
      <p className={styles.freshness}>
        cập nhật {updatedVi}
        {diffDays !== null ? <> · {relativeLabel(diffDays)}</> : null}
      </p>
      {isStale ? <p className={styles.stale}>Số liệu có thể đã cũ — meta có thể đã đổi.</p> : null}
    </>
  );
}
