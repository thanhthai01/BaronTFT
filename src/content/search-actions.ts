export type SearchAction = {
  id: string;
  group: 'Bài học' | 'Checklist' | 'Cây quyết định' | 'Mùa 18' | 'Góp ý';
  label: string;
  description: string;
  href: string;
  keywords: string[];
};

export const searchActions: SearchAction[] = [
  {
    id: 'mua18-ma-tran',
    group: 'Mùa 18',
    label: 'Xem ma trận tộc hệ Mùa 18',
    description: 'Tra cứu nhanh tướng theo từng cặp tộc × hệ.',
    href: '/mua-18?section=ma-tran-toc-he',
    keywords: ['mùa 18', 'set 18', 'ma trận', 'tộc hệ', 'matrix'],
  },
  {
    id: 'mua18-tuong',
    group: 'Mùa 18',
    label: 'Xem chi tiết tướng Mùa 18',
    description: '65 tướng theo giá vàng, kỹ năng, tộc hệ và số liệu.',
    href: '/mua-18?section=chi-tiet-tuong',
    keywords: ['mùa 18', 'set 18', 'tướng', 'champion', 'skill', 'kỹ năng'],
  },
  {
    id: 'mua18-toc-he',
    group: 'Mùa 18',
    label: 'Xem chi tiết tộc hệ Mùa 18',
    description: '36 trait cùng mốc kích hoạt và toàn bộ tướng thuộc trait.',
    href: '/mua-18?section=chi-tiet-toc-he',
    keywords: ['mùa 18', 'set 18', 'tộc hệ', 'trait', 'mốc kích hoạt'],
  },
  {
    id: 'mua18-tinh-linh',
    group: 'Mùa 18',
    label: 'Xem Tinh Linh Mùa 18',
    description: '176 Tinh Linh (wisp), nhóm theo loại hiệu ứng.',
    href: '/mua-18?section=tinh-linh',
    keywords: ['mùa 18', 'set 18', 'tinh linh', 'wisp'],
  },
  {
    id: 'mua18-nang-cap',
    group: 'Mùa 18',
    label: 'Xem nâng cấp Mùa 18',
    description: '261 nâng cấp (augment), lọc theo độ hiếm và phân loại.',
    href: '/mua-18?section=nang-cap',
    keywords: ['mùa 18', 'set 18', 'nâng cấp', 'augment'],
  },
  {
    id: 'learn-tempo',
    group: 'Bài học',
    label: 'Đọc bài Tempo',
    description: 'Hiểu khi nào mua nhịp, giữ máu hoặc giữ vàng.',
    href: '/kien-thuc-nen-tang',
    keywords: ['tempo', 'nhịp', 'stage', 'level'],
  },
  {
    id: 'roll-checklist',
    group: 'Checklist',
    label: 'Mở checklist trước rolldown',
    description: 'Chốt mục tiêu roll và điểm dừng trước khi tiêu vàng.',
    href: '/checklist',
    keywords: ['roll', 'rolldown', 'vàng', 'gold'],
  },
  {
    id: 'decision-roll',
    group: 'Cây quyết định',
    label: 'Xem cây quyết định khi nào roll',
    description: 'Phân biệt roll vì tempo, xác suất hay all-in cứu máu.',
    href: '/cay-quyet-dinh',
    keywords: ['roll', 'decision', 'cây', 'all-in'],
  },
  {
    id: 'items-lesson',
    group: 'Bài học',
    label: 'Đọc bài slam đồ hay giữ đồ',
    description: 'Học item theo chức năng thay vì chờ công thức hoàn hảo.',
    href: '/kien-thuc-nen-tang',
    keywords: ['item', 'đồ', 'slam', 'trang bị'],
  },
  {
    id: 'feedback-page',
    group: 'Góp ý',
    label: 'Gửi góp ý cho Baron TFT',
    description: 'Báo lỗi dữ liệu hoặc đề xuất tính năng qua email.',
    href: '/gop-y',
    keywords: ['góp ý', 'feedback', 'liên hệ', 'contact', 'báo lỗi'],
  },
];
