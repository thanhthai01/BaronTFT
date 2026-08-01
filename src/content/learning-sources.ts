/** Nguồn học ngoài cho trang /nguon-hoc.
 *
 * Định hướng: các trang TFT lớn trùng chức năng gần hết — trang nào cũng có tier list
 * đội hình, bảng tướng/trang bị/nâng cấp, hồ sơ người chơi. Liệt kê song song 7 cái
 * giống nhau thì vô dụng, nên mỗi nguồn phải nói rõ nó GIỎI NHẤT ở việc gì (`best`) —
 * đó mới là thứ quyết định mở trang nào. Nguồn không hơn nguồn khác ở điểm nào thì bỏ
 * hẳn khỏi danh sách, đừng thêm cho dài.
 *
 * Nhóm theo CÂU HỎI mà nguồn đó trả lời, không theo tên nguồn — người đã leo rank mở
 * trang này khi đang có sẵn câu hỏi cụ thể. Mỗi nguồn chỉ xuất hiện ở đúng một nhóm.
 *
 * `deepLinks` cố ý tránh URL có nhúng số set (vd tftflow /composition/set17/...,
 * tftacademy /tierlist/comps/set-17-...): chúng sẽ chết khi sang set mới. Chỉ dùng
 * đường dẫn không gắn set để trang tự trỏ về set hiện hành.
 *
 * Toàn bộ URL đã kiểm tra trả 200 ngày 2026-08-01. Khi thêm nguồn mới nhớ kiểm lại —
 * link chết trên trang nguồn học còn tệ hơn không có link.
 */

export type LearningSource = {
  name: string;
  href: string;
  /** Nhãn ngắn cạnh tên, vd ngôn ngữ hoặc điểm khác biệt chính. */
  tag?: string;
  /** Việc mà nguồn này làm tốt hơn hẳn phần còn lại — lý do nó có mặt trong danh sách. */
  best: string;
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
        best: 'Nguồn gốc, tiếng Việt',
        use: 'Ghi chú phiên bản đầy đủ do Riot Việt Nam phát hành — gốc của mọi con số bạn đọc lại ở nơi khác.',
        caveat: 'Thường lên sau bản tiếng Anh, nên patch mới nhất có thể chưa có ở đây.',
      },
      {
        name: 'Riot · Game Updates',
        href: 'https://teamfighttactics.leagueoflegends.com/en-us/news/game-updates/',
        tag: 'Tiếng Anh · lên sớm hơn',
        best: 'Lên trước vài ngày',
        use: 'Cùng nội dung nhưng đăng sớm hơn, và không rơi mất số liệu trong lúc dịch.',
      },
    ],
  },
  {
    id: 'trien-khai',
    question: 'Đội hình này triển khai thế nào?',
    hint: 'Phần các trang ngoài làm sâu nhất — mốc lên cấp, thứ tự trang bị, vị trí đứng, khắc chế.',
    sources: [
      {
        name: 'TFT Flow',
        href: 'https://tftflow.com/',
        best: 'Flowchart theo điều kiện',
        use: 'Sơ đồ chọn hướng chơi theo thứ bạn thật sự nhặt được — nâng cấp, cổ vật, khai cuộc. Trang từng đội hình có bảng theo mỗi cấp kèm tỉ lệ thắng vòng, vị trí đứng, nâng cấp pro chọn và VOD.',
        caveat: 'Đường dẫn từng đội hình có nhúng số set nên sẽ chết sang set sau — vào từ Tier list thay vì lưu link cũ.',
        deepLinks: [
          { label: 'Flowchart điều kiện', href: 'https://tftflow.com/conditions' },
          { label: 'Tier list đội hình', href: 'https://tftflow.com/tier-list' },
        ],
      },
      {
        name: 'TFT Academy',
        href: 'https://tftacademy.com/',
        best: 'Hướng dẫn từng bước',
        use: 'Hướng dẫn triển khai gọn hơn TFT Flow: thứ tự ghép trang bị, mốc lên cấp, cách xếp đội.',
        caveat: 'Lấy ý tưởng thôi — bảng hướng dẫn không biết bạn đang cầm gì trong tay.',
        deepLinks: [{ label: 'Tier list đội hình', href: 'https://tftacademy.com/tierlist/comps' }],
      },
    ],
  },
  {
    id: 'so-lieu',
    question: 'Số liệu đang nói gì?',
    hint: 'Dùng để kiểm chứng linh cảm của mình, không phải để chọn hộ đội hình.',
    sources: [
      {
        name: 'MetaTFT',
        href: 'https://www.metatft.com/',
        best: 'Nhiều chỉ số nhất',
        use: 'Bộ chỉ số sâu nhất, cập nhật nhanh sau mỗi patch, kèm bảng tra riêng cho từng cơ chế của set — thứ mà trang khác thường bỏ qua.',
        deepLinks: [
          { label: 'Đội hình', href: 'https://www.metatft.com/comps' },
          { label: 'Tướng', href: 'https://www.metatft.com/units' },
        ],
      },
      {
        name: 'Tactics.tools',
        href: 'https://tactics.tools/',
        best: 'Lọc theo bậc rank',
        use: 'Thứ hạng trung bình, tỉ lệ top 4 và cỡ mẫu, tách riêng từng bậc rank — dùng khi cần biết số liệu này có đúng với lobby của mình không.',
        caveat: 'Số liệu Kim Cương+ không mô tả lobby Vàng. Đặt bộ lọc trước khi đọc con số.',
        deepLinks: [
          { label: 'Đội hình', href: 'https://tactics.tools/team-compositions' },
          { label: 'Tướng', href: 'https://tactics.tools/units' },
          { label: 'Trang bị', href: 'https://tactics.tools/items' },
          { label: 'Nâng cấp', href: 'https://tactics.tools/augments' },
        ],
      },
    ],
  },
  {
    id: 'meo-luyen-tap',
    question: 'Có mẹo nào mình chưa biết, và luyện tay ở đâu?',
    hint: 'Mẹo lẻ và công cụ luyện tập — thứ không nằm trong bất kỳ tier list nào.',
    sources: [
      {
        name: 'DataTFT',
        href: 'https://www.datatft.com/',
        tag: 'Có tiếng Việt',
        best: 'Kho mẹo tra được & mô phỏng roll',
        use: 'Mục Mẹo cho lọc theo trang bị / tộc hệ / tướng / nâng cấp / vị trí đứng, và có cả nhánh bác tin đồn. Mô phỏng roll cho luyện rolldown mà không tốn ván thật. Trang All-in-one kèm hướng dẫn Core / Khai cuộc / Giữa / Cuối viết bằng tiếng Việt.',
        caveat: 'Mặc định mở ra tiếng Anh — đổi sang Tiếng Việt trong menu ngôn ngữ ở góc phải trên.',
        deepLinks: [
          { label: 'Mẹo', href: 'https://www.datatft.com/tip' },
          { label: 'All-in-one', href: 'https://www.datatft.com/comp/allinone' },
          { label: 'Mô phỏng roll', href: 'https://www.datatft.com/rolldown' },
          { label: 'Máy tính roll', href: 'https://www.datatft.com/calculator' },
        ],
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
        best: 'Lịch sử đấu của chính bạn',
        use: 'Tra hồ sơ và lịch sử đấu của mình lẫn của người trong lobby, mở lại từng vòng của ván vừa chơi.',
        caveat: 'Soi quyết định giữa ván — vàng, mốc lên cấp, thời điểm roll — chứ không chỉ nhìn đội hình cuối.',
        deepLinks: [
          { label: 'Meta', href: 'https://lolchess.gg/meta' },
          { label: 'Bảng xếp hạng', href: 'https://lolchess.gg/leaderboards' },
        ],
      },
    ],
  },
];
