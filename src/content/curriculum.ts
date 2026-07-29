export type CurriculumModule = {
  slug: string;
  title: string;
  summary: string;
  skill: string;
  duration: string;
  exercise: string;
  lessonSlug: string;
};

export const curriculumModules: CurriculumModule[] = [
  {
    slug: 'nen-tang-xuyen-mua',
    title: 'Nền tảng không đổi qua các mùa',
    summary: 'Ba lớp kiến thức, bốn tài nguyên cốt lõi và công thức ra quyết định trong mọi set.',
    skill: 'Decision fundamentals',
    duration: '35 phút đọc',
    exercise: '10 trận ghi lại quyết định dùng vàng và máu.',
    lessonSlug: 'nen-tang-xuyen-mua',
  },
  {
    slug: 'suc-manh-ban-dau',
    title: 'Đánh giá sức mạnh bàn đấu',
    summary: 'Đọc frontline, damage, item, nâng cấp và trạng thái lobby trước khi chọn nhịp.',
    skill: 'Strongest board',
    duration: '30 phút đọc',
    exercise: 'Mỗi round trả lời: mình mạnh hay yếu so với lobby?',
    lessonSlug: 'suc-manh-ban-dau',
  },
  {
    slug: 'kinh-te-level-roll',
    title: 'Kinh tế, lên cấp và roll',
    summary: 'Biết khi nào tích lũy, ổn định hoặc tất tay; roll phải có mục tiêu cụ thể.',
    skill: 'Gold / Roll',
    duration: '40 phút đọc',
    exercise: 'Trước mỗi rolldown ghi đúng unit, cấp và số vàng sẽ dùng.',
    lessonSlug: 'kinh-te-level-roll',
  },
  {
    slug: 'trang-bi-nang-cap',
    title: 'Trang bị và nâng cấp',
    summary: 'Học item theo chức năng, không học thuộc recipe; chọn augment theo trạng thái trận.',
    skill: 'Items / Augment',
    duration: '30 phút đọc',
    exercise: '10 trận slam đồ với lý do tempo hoặc cap rõ ràng.',
    lessonSlug: 'trang-bi-nang-cap',
  },
  {
    slug: 'flex-pivot',
    title: 'Flex, pivot và xây đội hình',
    summary: 'Dùng thang cam kết 0–4 để pivot sớm hơn và tránh chết vì cố chấp.',
    skill: 'Pivot',
    duration: '35 phút đọc',
    exercise: 'Sau mỗi round stage 3 ghi mức cam kết hiện tại.',
    lessonSlug: 'flex-pivot',
  },
  {
    slug: 'scout-positioning',
    title: 'Scouting và positioning',
    summary: 'Scout có mục tiêu, đổi vị trí theo lobby thật, không theo một ảnh chụp mẫu.',
    skill: 'Scout / Position',
    duration: '30 phút đọc',
    exercise: 'Mỗi round cuối stage 4 đổi ít nhất một vị trí có lý do.',
    lessonSlug: 'scout-positioning',
  },
  {
    slug: 'cay-quyet-dinh-stage',
    title: 'Cây quyết định theo giai đoạn',
    summary: 'Stage 1 đến late game: mỗi giai đoạn có câu hỏi và hành động khác nhau.',
    skill: 'Tempo',
    duration: '35 phút đọc',
    exercise: 'Dùng stage checklist trong 10 trận liên tiếp.',
    lessonSlug: 'cay-quyet-dinh-stage',
  },
  {
    slug: 'review-on-dinh-rank',
    title: 'Review và ổn định thứ hạng',
    summary: 'Tìm lỗi đầu tiên có thể sửa, phân biệt quyết định đúng/sai với kết quả tốt/xấu.',
    skill: 'Review',
    duration: '30 phút đọc',
    exercise: 'Review 5 trận thua bằng summary Markdown.',
    lessonSlug: 'review-on-dinh-rank',
  },
];

export const trainingWeeks = [
  'Strongest board',
  'Kinh tế và chuỗi',
  'Trang bị',
  'Level và roll',
  'Flex và pivot',
  'Scouting',
  'Positioning',
  'Review và ổn định thứ hạng',
];
