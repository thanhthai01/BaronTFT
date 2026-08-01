/** Nguồn học ngoài cho trang /nguon-hoc.
 *
 * Định hướng: các trang TFT lớn trùng chức năng gần hết — trang nào cũng có tier list
 * đội hình, bảng tướng/trang bị/nâng cấp, hồ sơ người chơi. Liệt kê song song 8 cái
 * giống nhau thì vô dụng, nên mỗi nguồn phải nói rõ nó GIỎI NHẤT ở việc gì (`best`) —
 * đó mới là thứ quyết định mở trang nào. Nguồn không hơn nguồn khác ở điểm nào thì bỏ
 * hẳn khỏi danh sách, đừng thêm cho dài.
 *
 * Nhóm theo CÂU HỎI mà nguồn đó trả lời, không theo tên nguồn — người đã leo rank mở
 * trang này khi đang có sẵn câu hỏi cụ thể. Mỗi nguồn chỉ xuất hiện ở đúng một nhóm.
 *
 * Trang để LIẾC chứ không để đọc: logo dẫn đường nhận diện, `best` là chip, `note` một
 * dòng, `caveat` chỉ giữ khi nó ngăn được một sai lầm thật. Viết dài hơn là hỏng mục đích.
 *
 * `deepLinks` cố ý tránh URL có nhúng số set (vd tftflow /composition/set17/...,
 * tftacademy /tierlist/comps/set-17-...): chúng sẽ chết khi sang set mới. Chỉ dùng
 * đường dẫn không gắn set để trang tự trỏ về set hiện hành. Riêng tftflow: bản
 * /conditions/set18 CHƯA tồn tại (404 — trang vẫn đang ở Set 17 / patch 17.8), nên
 * dùng /conditions không gắn set; đổi sang set18 khi nào họ mở.
 *
 * Lọc sẵn theo yêu cầu, chỉ ở nơi trang cho phép đặt qua URL (kiểm 2026-08-01):
 *   · tactics.tools — hậu tố /top = Cao Thủ trở lên (mặc định của trang là Kim Cương+)
 *   · lolchess      — ?region=vn cho bảng xếp hạng khu vực Việt Nam
 * Không đặt được qua URL, đành ghi vào `caveat`:
 *   · metatft  — rank giữ trong localStorage, mọi ?rank=/?tier= đều bị bỏ qua
 *   · datatft  — ?lang=vi không đổi ngôn ngữ; phải bấm menu, sau đó trang tự nhớ
 *   · tactics.tools / tftacademy — không có bản tiếng Việt
 *
 * Toàn bộ URL đã kiểm tra trả 200 ngày 2026-08-01. Khi thêm nguồn mới nhớ kiểm lại —
 * link chết trên trang nguồn học còn tệ hơn không có link.
 */

export type LearningSource = {
  name: string;
  href: string;
  /** Tên file trong public/sources/ (không đuôi) — tải bởi scripts/fetch_source_logos.py. */
  logo: string;
  /** Bật khi logo gần như trắng hoàn toàn (vd Riot) — nó chìm nghỉm trên nền sáng nên
   * ô logo phải đổi sang nền tối. fetch_source_logos.py sẽ cảnh báo nếu có logo mới
   * rơi vào nhóm này. */
  logoOnDark?: boolean;
  /** Việc nguồn này làm tốt hơn hẳn phần còn lại — lý do nó có mặt trong danh sách. */
  best: string;
  /** Một dòng, tối đa ~15 chữ. */
  note: string;
  /** Cách dùng sai thường gặp, một câu ngắn. Bỏ trống nếu không có bẫy đáng nói. */
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
    hint: 'Đọc trước khi tin bất kỳ tier list nào.',
    sources: [
      {
        name: 'Riot · Cập Nhật Trò Chơi',
        href: 'https://teamfighttactics.leagueoflegends.com/vi-vn/news/game-updates/',
        logo: 'riot',
        logoOnDark: true,
        best: 'Nguồn gốc · tiếng Việt',
        note: 'Ghi chú phiên bản chính thức, bản dịch của Riot Việt Nam.',
        caveat: 'Lên sau bản tiếng Anh.',
      },
      {
        name: 'Riot · Game Updates',
        href: 'https://teamfighttactics.leagueoflegends.com/en-us/news/game-updates/',
        logo: 'riot',
        logoOnDark: true,
        best: 'Lên sớm hơn',
        note: 'Cùng nội dung, không rơi số liệu trong lúc dịch.',
      },
    ],
  },
  {
    id: 'trien-khai',
    question: 'Đội hình này triển khai thế nào?',
    hint: 'Phần các trang ngoài làm sâu nhất.',
    sources: [
      {
        name: 'TFT Flow',
        href: 'https://tftflow.com/',
        logo: 'tftflow',
        best: 'Flowchart theo điều kiện',
        note: 'Chọn hướng theo thứ bạn nhặt được; comp kèm tỉ lệ thắng từng vòng và VOD.',
        caveat: 'Link comp cũ chết khi sang set mới.',
        deepLinks: [
          { label: 'Flowchart', href: 'https://tftflow.com/conditions' },
          { label: 'Tier list', href: 'https://tftflow.com/tier-list' },
        ],
      },
      {
        name: 'TFT Academy',
        href: 'https://tftacademy.com/',
        logo: 'tftacademy',
        best: 'Hướng dẫn từng bước',
        note: 'Thứ tự ghép trang bị, mốc lên cấp, cách xếp đội.',
        caveat: 'Lấy ý tưởng thôi, đừng bê nguyên.',
        deepLinks: [{ label: 'Tier list', href: 'https://tftacademy.com/tierlist/comps' }],
      },
    ],
  },
  {
    id: 'so-lieu',
    question: 'Số liệu đang nói gì?',
    hint: 'Để kiểm chứng, không phải để chọn hộ đội hình.',
    sources: [
      {
        name: 'MetaTFT',
        href: 'https://www.metatft.com/',
        logo: 'metatft',
        best: 'Nhiều chỉ số nhất',
        note: 'Chỉ số sâu nhất, kèm bảng tra riêng cho từng cơ chế của set.',
        caveat: 'Bộ lọc rank không nằm trên URL — phải tự chỉnh từ Bạch Kim+ lên Cao Thủ+.',
        deepLinks: [
          { label: 'Đội hình', href: 'https://www.metatft.com/comps' },
          { label: 'Tướng', href: 'https://www.metatft.com/units' },
        ],
      },
      {
        name: 'Tactics.tools',
        href: 'https://tactics.tools/',
        logo: 'tacticstools',
        best: 'Lọc theo bậc rank',
        note: 'Thứ hạng trung bình, tỉ lệ top 4, cỡ mẫu — tách theo từng bậc rank.',
        caveat: 'Các link dưới đã đặt sẵn Cao Thủ trở lên; mặc định của trang là Kim Cương+.',
        deepLinks: [
          { label: 'Đội hình', href: 'https://tactics.tools/team-compositions/top' },
          { label: 'Tướng', href: 'https://tactics.tools/units/top' },
          { label: 'Trang bị', href: 'https://tactics.tools/items/top' },
          { label: 'Nâng cấp', href: 'https://tactics.tools/augments/top' },
        ],
      },
    ],
  },
  {
    id: 'meo-luyen-tap',
    question: 'Có mẹo nào mình chưa biết?',
    hint: 'Thứ không nằm trong bất kỳ tier list nào.',
    sources: [
      {
        name: 'DataTFT',
        href: 'https://www.datatft.com/',
        logo: 'datatft',
        best: 'Kho mẹo & mô phỏng roll',
        note: 'Lọc mẹo theo trang bị, tộc hệ, vị trí. Luyện rolldown không tốn ván.',
        caveat: 'Đổi sang Tiếng Việt ở menu góc phải trên — không đặt được qua link, nhưng đổi 1 lần là trang nhớ.',
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
    hint: 'Phần duy nhất thật sự làm bạn lên rank.',
    sources: [
      {
        name: 'LoLCHESS',
        href: 'https://lolchess.gg/',
        logo: 'lolchess',
        best: 'Lịch sử đấu của bạn',
        note: 'Mở lại từng vòng của ván vừa chơi, cả người trong lobby.',
        caveat: 'Soi quyết định giữa ván, không chỉ đội hình cuối.',
        deepLinks: [
          { label: 'Meta', href: 'https://lolchess.gg/meta' },
          { label: 'BXH Việt Nam', href: 'https://lolchess.gg/leaderboards?region=vn' },
        ],
      },
    ],
  },
];
