export type SearchAction = {
  id: string;
  group: 'Bài học' | 'Checklist' | 'Review' | 'Biểu mẫu' | 'Cây quyết định';
  label: string;
  description: string;
  href: string;
  keywords: string[];
};

export const searchActions: SearchAction[] = [
  {
    id: 'learn-tempo',
    group: 'Bài học',
    label: 'Đọc bài Tempo',
    description: 'Hiểu khi nào mua nhịp, giữ máu hoặc giữ vàng.',
    href: '/bai-hoc/cay-quyet-dinh-stage',
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
    id: 'review-loss',
    group: 'Review',
    label: 'Review trận vừa thua',
    description: 'Tìm lỗi đầu tiên có thể sửa trong 15 phút.',
    href: '/review',
    keywords: ['review', 'thua', 'vod', 'lỗi'],
  },
  {
    id: 'template-session',
    group: 'Biểu mẫu',
    label: 'Điền phiếu trước phiên',
    description: 'Chọn một kỹ năng duy nhất để luyện trong phiên leo rank.',
    href: '/bieu-mau',
    keywords: ['phiếu', 'template', 'session', 'luyện'],
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
    href: '/bai-hoc/trang-bi-nang-cap',
    keywords: ['item', 'đồ', 'slam', 'trang bị'],
  },
];
