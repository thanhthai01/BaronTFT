/** Nguồn học ngoài cho trang /nguon-hoc.
 *
 * Nhóm theo CÂU HỎI mà nguồn đó trả lời, không theo tên nguồn — người đã leo rank mở
 * trang này khi đang có sẵn một câu hỏi cụ thể ("patch vừa đổi gì", "đội hình này lên
 * cấp lúc nào"), nên đường đi ngắn nhất là hỏi trước rồi mới tới tên trang.
 *
 * Mỗi nguồn chỉ xuất hiện ở đúng một nhóm để danh sách không đọc như bị lặp; muốn tới
 * thẳng trang con thì dùng `deepLinks`.
 *
 * Toàn bộ URL đã kiểm tra trả 200 ngày 2026-08-01. Khi thêm nguồn mới nhớ kiểm lại —
 * link chết trên trang nguồn học còn tệ hơn không có link.
 */

export type LearningSource = {
  name: string;
  href: string;
  /** Nhãn ngắn cạnh tên, vd ngôn ngữ hoặc điểm khác biệt chính. */
  tag?: string;
  /** Mở nguồn này ra để làm gì — một dòng. */
  use: string;
  /** Cách dùng sai thường gặp. Bỏ trống nếu nguồn không có bẫy đáng nói. */
  caveat?: string;
  /** Trang con đi thẳng vào thứ cần tra, khỏi phải lần từ trang chủ. */
  deepLinks?: { label: string; href: string }[];
};

export type LearningGroup = {
  id: string;
  question: string;
  hint: string;
  sources: LearningSource[];
};

export const learningGroups: LearningGroup[] = [
  {
    id: 'patch',
    question: 'Bản patch vừa đổi gì?',
    hint: 'Đọc trước khi tin bất kỳ tier list nào — số liệu luôn chậm hơn patch vài ngày.',
    sources: [
      {
        name: 'Riot · Cập Nhật Trò Chơi',
        href: 'https://teamfighttactics.leagueoflegends.com/vi-vn/news/game-updates/',
        tag: 'Tiếng Việt · chính chủ',
        use: 'Ghi chú phiên bản đầy đủ do Riot Việt Nam phát hành — gốc của mọi con số bạn đọc lại ở nơi khác.',
        caveat: 'Thường lên sau bản tiếng Anh, nên patch mới nhất có thể chưa có ở đây.',
      },
      {
        name: 'Riot · Game Updates',
        href: 'https://teamfighttactics.leagueoflegends.com/en-us/news/game-updates/',
        tag: 'Tiếng Anh · lên sớm hơn',
        use: 'Cùng nội dung nhưng đăng trước, và không rơi mất số liệu trong lúc dịch.',
      },
    ],
  },
  {
    id: 'so-lieu',
    question: 'Số liệu đang nói gì?',
    hint: 'Dùng để kiểm chứng linh cảm của mình, không phải để chọn hộ đội hình.',
    sources: [
      {
        name: 'Tactics.tools',
        href: 'https://tactics.tools/',
        use: 'Thứ hạng trung bình, tỉ lệ top 4 và cỡ mẫu cho đội hình, tướng, trang bị, nâng cấp.',
        caveat: 'Luôn lọc theo bậc rank của mình — số liệu Kim Cương+ không mô tả lobby bạn đang chơi.',
        deepLinks: [
          { label: 'Đội hình', href: 'https://tactics.tools/team-compositions' },
          { label: 'Tướng', href: 'https://tactics.tools/units' },
          { label: 'Trang bị', href: 'https://tactics.tools/items' },
          { label: 'Nâng cấp', href: 'https://tactics.tools/augments' },
        ],
      },
      {
        name: 'MetaTFT',
        href: 'https://www.metatft.com/',
        use: 'Cùng loại số liệu, cập nhật nhanh sau mỗi patch, kèm bảng tra riêng cho từng cơ chế của set.',
        deepLinks: [
          { label: 'Đội hình', href: 'https://www.metatft.com/comps' },
          { label: 'Tướng', href: 'https://www.metatft.com/units' },
        ],
      },
    ],
  },
  {
    id: 'doi-hinh',
    question: 'Đội hình này chơi thế nào?',
    hint: 'Xem để biết đường đi chuẩn, rồi tự sửa theo thứ bạn thật sự nhặt được.',
    sources: [
      {
        name: 'TFT Academy',
        href: 'https://tftacademy.com/',
        use: 'Hướng dẫn từng đội hình: thứ tự ghép trang bị, mốc lên cấp, cách xếp đội.',
        caveat: 'Lấy ý tưởng thôi — bảng hướng dẫn không biết bạn đang cầm gì trong tay.',
        deepLinks: [{ label: 'Tier list đội hình', href: 'https://tftacademy.com/tierlist/comps' }],
      },
      {
        name: 'Mobalytics',
        href: 'https://mobalytics.gg/tft',
        use: 'Tier list và hướng dẫn đội hình, trình bày gọn khi cần liếc nhanh giữa hai ván.',
      },
    ],
  },
  {
    id: 'tu-review',
    question: 'Mình vừa chơi sai ở đâu?',
    hint: 'Phần duy nhất trong danh sách này thật sự làm bạn lên rank.',
    sources: [
      {
        name: 'LoLCHESS',
        href: 'https://lolchess.gg/',
        use: 'Tra lịch sử đấu của chính mình và của người trong lobby, mở lại từng vòng của ván vừa chơi.',
        caveat: 'Soi quyết định giữa ván — vàng, mốc lên cấp, thời điểm roll — chứ không chỉ nhìn đội hình cuối.',
        deepLinks: [
          { label: 'Meta', href: 'https://lolchess.gg/meta' },
          { label: 'Bảng xếp hạng', href: 'https://lolchess.gg/leaderboards' },
        ],
      },
    ],
  },
];
