import { set18VisibleCounts } from './set18-visible-counts';

/** Hai section Tinh Linh/Nâng cấp có số đếm đổi theo DB (bản vá ẩn mục bị Riot
 *  gỡ, hoặc thêm mục mới), nên KHÔNG lấy `hint` cứng trong set18-meta.ts —
 *  file đó sinh bởi Set18/generate_website_set18_data.py nằm ngoài repo, chỉ
 *  cập nhật khi chạy lại script scrape, nên số trong đó lệch ngay lần vá kế.
 *  Các section còn lại (ma trận, tướng, tộc hệ, hiệu ứng) giữ nguyên `hint`. */
export function set18SectionHint(section: { id: string; hint: string }): string {
  if (section.id === 'tinh-linh') return `${set18VisibleCounts.wisps} Tinh Linh`;
  if (section.id === 'nang-cap') return `${set18VisibleCounts.augments} nâng cấp`;
  return section.hint;
}
