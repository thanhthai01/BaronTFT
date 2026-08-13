// Draft bản vá PBE — nội dung/số liệu đã được duyệt trong
// Website/pbe-notes/Patch_TFT18.1ad-PBE-moderate-balance-pass.md (Truexy tự
// ghi là bản vá cho ngày 8/12, đăng lúc 3:22 AM giờ hiển thị Aug 13, 2026,
// tiếp theo bản 18.1ac 11/08). File này chỉ chuyển nội dung đó thành
// PatchReport để áp vào DB (pnpm db:apply-patch) rồi pull ra
// patch-notes.generated.ts (pnpm db:pull).
//
// Tên tiếng Việt chính, tên gốc phụ trong ngoặc: champion/trait/wisp/augment
// có entityId thì /patch tự tra nameVi qua entity-index (không cần sửa
// `name`). Item và mechanic (bugfix/cosmetics) KHÔNG có cơ chế tra tự động —
// PatchBoard hiện `name` y nguyên — nên với 2 category này, `name` viết sẵn
// "<Tiếng Việt> (<Tên gốc>)" lấy nguyên từ set18_items/wisps/augments/traits
// .nameVi, không tự dịch. Vài mục DB chưa có bản dịch (Forbidden Idol,
// Master of All Origins) hoặc không tìm thấy entity đúng tên (Collector) thì
// giữ nguyên tên gốc, có ghi chú tại chỗ.
import type { PatchReport } from '../../../src/content/patch-notes';

const report: PatchReport = {
  id: 'patch-tft18-1ad',
  version: 'PBE 12/08/2026 (18.1ad)',
  title: 'Moderate pass, balance',
  author: 'Baron TFT (dịch)',
  source: {
    label: 'PBE — TheTruexy (dev PBE chính thức)',
    url: 'https://x.com/TheTruexy/status/2087635892190286143',
  },
  entitySet: 18,
  dateVi: '12/08/2026',
  summaryVi:
    'Bản vá nhẹ về balance nhưng có rework tộc Gai Đen (Blackthorn): buff base sacrifice stats mốc 2/4, đổi hẳn cơ chế mốc 6 (Máu 350→500, +50% chỉ số nhận, đơn vị hiến tế chết như mốc 2/4, bỏ bonus riêng). Wisp Quầy Đồ Lạ (Curio Cart) không còn cấp Artifact ngẫu nhiên, giá tối đa đúng ra là 15 vàng (sửa nhầm lẫn trước đó). 6 trang bị Artifact đổi số liệu: nerf Lõi Bình Minh/Khế Ước Vĩnh Hằng/Pháo Xương Cá/Rìu Đại Mãng Xà, buff Forbidden Idol/Bùa Thăng Hoa. Thêm cosmetics Mythic tactician và một loạt bugfix gameplay/UI (Chỉ Một Con Đường, Gói Tăng Cường++, Máy Tái Chế, Xoay Bài Tự Động, Lux trait dedup, Vượt Thời Gian, v.v.).',
  summaryOrigin: 'official',
  entries: [
    // ── Cosmetics ─────────────────────────────────────────────────
    {
      id: 'pbe0812ad-cosmetics-mythic',
      category: 'mechanic',
      kind: 'mechanic',
      name: 'Thêm một đợt tactician bậc Mythic có finisher, chọn được trong hàng chờ Enchanted Wilds trên PBE',
    },

    // ── Tộc hệ ──────────────────────────────────────────────────────
    {
      id: 'pbe0812ad-trait-blackthorn-base',
      category: 'trait',
      kind: 'buff',
      name: 'Blackthorn',
      entityId: 'trait:eldritch',
      breakpoint: '2/4',
      changes: [
        { label: 'Tank — Máu cộng thêm', from: '17%', to: '20%' },
        { label: 'Attack Champion — Sát thương vật lý cộng thêm', from: '22', to: '24' },
        { label: 'Attack Champion — Tốc Đánh cộng thêm', from: '10%', to: '12%' },
        { label: 'Magic Champion — Khuếch Đại Sát Thương cộng thêm', from: '13%', to: '14%' },
      ],
    },
    {
      // Không phải buff/nerf đồng nhất — đổi hẳn cơ chế mốc 6 (bỏ bonus stat
      // riêng, đơn vị hiến tế giờ chết như mốc 2/4, tăng Máu nền + % chỉ số
      // nhận). Cấu trúc breakpointDetails cũ (bonus stat cố định) khác hẳn hệ
      // thống mới — theo yêu cầu người dùng, codex ĐƯỢC viết mới (không phải
      // replaceExact có assert) trong apply-pbe-balance-tft18-1ad.ts, xem
      // ghi chú rủi ro ở đầu file đó.
      id: 'pbe0812ad-trait-blackthorn-6piece',
      category: 'trait',
      kind: 'rework',
      name: 'Blackthorn',
      entityId: 'trait:eldritch',
      breakpoint: '6',
      changes: [
        { label: 'Máu', from: '350', to: '500' },
        { label: 'Tăng chỉ số nhận được', from: '(không có)', to: '+50%' },
        { label: 'Cơ chế chết của đơn vị hiến tế', from: 'Cơ chế riêng mốc 6', to: 'Chết như mốc 2/4' },
        { label: 'Bonus stat cố định của mốc 6', from: 'Có (Máu/Tốc Đánh/AD/AP/Kháng)', to: 'Đã bỏ' },
      ],
    },
    {
      id: 'pbe0812ad-trait-blackthorn-bugfix',
      category: 'trait',
      kind: 'mechanic',
      name: 'Blackthorn',
      entityId: 'trait:eldritch',
      note: 'Bugfix',
      changes: [
        {
          label: 'Sửa lỗi',
          from: 'Hex bị dính lại trên màn hình hoặc lỗi không hiện trong một số điều kiện; stats preview trong tooltip cập nhật chậm',
          to: 'Hex hiện đúng, stats preview cập nhật phản hồi nhanh hơn',
        },
      ],
    },
    {
      id: 'pbe0812ad-trait-primal-bugfix',
      category: 'trait',
      kind: 'mechanic',
      name: 'Primal',
      entityId: 'trait:primal',
      note: 'Bugfix',
      changes: [{ label: 'Phoenix tính takedown', from: 'Chỉ tính hạ gục tướng', to: 'Tính cả hạ gục đơn vị không phải tướng' }],
    },

    // ── Linh Hỏa (Wisps) ────────────────────────────────────────────
    {
      id: 'pbe0812ad-wisp-curiocart',
      category: 'wisp',
      kind: 'nerf',
      name: 'Curio Cart',
      entityId: 'wisp:curio-cart',
      changes: [
        { label: 'Cấp Artifact ngẫu nhiên', from: 'Có thể cấp', to: 'Không còn cấp' },
        { label: 'Giá trang bị tối đa trong cửa hàng', from: '14 vàng (tooltip cũ, đã sai)', to: '15 vàng' },
      ],
    },

    // ── Trang bị (Artifact Items) ─────────────────────────────────
    // Item không có cơ chế tra nameVi tự động trên /patch (chỉ champion/
    // trait/wisp/augment có entityId khớp entity-index) — viết tên tiếng
    // Việt trực tiếp vào `name` (chính) kèm tên gốc (phụ), lấy nguyên từ
    // set18_items.nameVi. Forbidden Idol DB chưa có bản dịch (nameVi trùng
    // bản Anh) nên giữ nguyên tên gốc.
    {
      id: 'pbe0812ad-item-dawncore',
      category: 'item',
      kind: 'nerf',
      name: 'Lõi Bình Minh (Dawncore)',
      icon: '/set18/assets/items/full/da_artifact_dawncore.png',
      changes: [
        { label: 'AD/AP', from: '15', to: '20' },
        { label: 'Giảm Năng Lượng mỗi lần đánh phép', from: '4%', to: '5%' },
        { label: 'Năng Lượng tối thiểu', from: '10', to: '15' },
        { label: 'Hồi Năng Lượng', from: '2', to: '1' },
      ],
    },
    {
      id: 'pbe0812ad-item-eternalpact',
      category: 'item',
      kind: 'nerf',
      name: 'Khế Ước Vĩnh Hằng (Eternal Pact)',
      icon: '/set18/assets/items/full/da_artifact_eternalpact.png',
      changes: [{ label: 'AP cơ bản', from: '40', to: '35' }],
    },
    {
      id: 'pbe0812ad-item-fishbones',
      category: 'item',
      kind: 'nerf',
      name: 'Pháo Xương Cá (Fishbones)',
      icon: '/set18/assets/items/full/da_artifact_fishbones.png',
      changes: [
        { label: 'Tốc Độ Đánh', from: '30%', to: '25%' },
        { label: 'Sát Thương Vật Lý', from: '30%', to: '25%' },
      ],
    },
    {
      id: 'pbe0812ad-item-forbiddenidol',
      category: 'item',
      kind: 'buff',
      name: 'Forbidden Idol', // DB chưa có bản dịch (nameVi = bản Anh), giữ nguyên
      icon: '/set18/assets/items/full/da_artifact_forbiddenidol.png',
      changes: [
        { label: 'Máu', from: '250', to: '400' },
        { label: 'Tỉ lệ chuyển đổi Lá Chắn', from: '35%', to: '40%' },
      ],
    },
    {
      id: 'pbe0812ad-item-talismanofascension',
      category: 'item',
      kind: 'buff',
      name: 'Bùa Thăng Hoa (Talisman of Ascension)',
      icon: '/set18/assets/items/full/da_item_artifact_talismanofascension.png',
      changes: [{ label: 'Hồi Năng Lượng khi đã Ascended', from: '8', to: '12' }],
    },
    {
      id: 'pbe0812ad-item-titanichydra',
      category: 'item',
      kind: 'nerf',
      name: 'Rìu Đại Mãng Xà (Titanic Hydra)',
      icon: '/set18/assets/items/full/da_artifact_titanichydra.png',
      changes: [{ label: '% Máu tối đa gây thêm sát thương', from: '4%', to: '2%' }],
    },

    // ── Sửa Lỗi (Bugfixes) ──────────────────────────────────────────
    // Cũng không có cơ chế tra tự động (category 'mechanic' luôn hiện
    // `name` thô) — tên riêng viết "<Tiếng Việt> (<Tên gốc>)" lấy từ
    // set18_augments/set18_wisps/set18_traits.nameVi/vi khi có; giữ tên gốc
    // nếu DB chưa dịch (Collector không tìm thấy entity đúng tên, Master of
    // All Origins DB chưa dịch).
    {
      id: 'pbe0812ad-bugfix-hardcommit',
      category: 'mechanic',
      kind: 'mechanic',
      name: 'Chỉ Một Con Đường (Hard Commit) không còn cấp emblem thiếu unit đủ mọi mốc giá tiền',
    },
    {
      id: 'pbe0812ad-bugfix-boosterpack',
      category: 'mechanic',
      kind: 'mechanic',
      name: 'Sửa lỗi Gói Tăng Cường++ (Booster Pack++) trả thưởng sai',
    },
    {
      id: 'pbe0812ad-bugfix-salvager',
      category: 'mechanic',
      kind: 'mechanic',
      name: 'Wisp Máy Tái Chế (Salvager) không còn phá vỡ trang bị tạm thời do nhóm Wisp dòng Phantom cấp (Giáp Bóng Ma, Găng Ma Mị, Giáp Ma Mị, Ấn Ma Mị)',
    },
    {
      id: 'pbe0812ad-bugfix-findyourcenter',
      category: 'mechanic',
      kind: 'mechanic',
      name: 'Tiền Vệ Trung Tâm (Find Your Center) không còn spam SFX khi có unit đứng trong hex',
    },
    {
      id: 'pbe0812ad-bugfix-abandonship',
      category: 'mechanic',
      kind: 'mechanic',
      name: 'Rời Tàu (Abandon Ship) không còn xoá anvil đang để trên ghế dự bị',
    },
    {
      id: 'pbe0812ad-bugfix-deadliernonchamp',
      category: 'mechanic',
      kind: 'mechanic',
      name: 'Mũ Tử Thần (Deadlier Caps), Kiếm Tử Thần (Deadlier Blades), Tôi Thăng Cấp Một Mình (Solo Leveling) không còn tác dụng lên đơn vị không phải tướng',
    },
    {
      id: 'pbe0812ad-bugfix-collector',
      category: 'mechanic',
      kind: 'mechanic',
      name: 'Collector giờ hoạt động được trên đơn vị không phải tướng (không tìm thấy entity đúng tên "Collector" trong DB, giữ nguyên tên gốc)',
    },
    {
      id: 'pbe0812ad-bugfix-recombobulator-ghostarmy',
      category: 'mechanic',
      kind: 'mechanic',
      name: 'Xoay Bài Tự Động (Recombobulator) không còn chạy trên đội quân ma khi vừa được tạo ra',
    },
    {
      id: 'pbe0812ad-bugfix-nonbaseform-stats',
      category: 'mechanic',
      kind: 'mechanic',
      name: "Biến hình sang non-base form qua Xoay Bài Tự Động (Recombobulator), Hàng Chờ Pandora (Pandora's Bench), hoặc Biến Hóa (Polymorph) không còn cấp tăng chỉ số bất thường",
    },
    {
      id: 'pbe0812ad-bugfix-hireling-latebloomer-traits',
      category: 'mechanic',
      kind: 'mechanic',
      name: 'Tướng tạm thời do Wisp Ngôi Sao Khách Mời (Hireling) và Lớn Muộn (Late Bloomer) cấp không còn đóng góp vào Tộc hệ trong lượt combat',
    },
    {
      id: 'pbe0812ad-bugfix-filter-augments',
      category: 'mechanic',
      kind: 'mechanic',
      name: 'Búp Bê Xây Tổ (Nesting Dolls), Mặt Trời và Mặt Trăng (Sun and Moon), Giáp Tự Chế (Makeshift Armor), Master of All Origins (DB chưa dịch) lọc đúng lại (filter chính xác)',
    },
    {
      id: 'pbe0812ad-bugfix-phantomsplash-elderwood',
      category: 'mechanic',
      kind: 'mechanic',
      name: 'Anh Hùng Bất Ngờ (Phantom Splash) hoạt động đúng với tộc Thần Rừng (Elderwood) khi ở Away board',
    },
    {
      id: 'pbe0812ad-bugfix-bloodmoney',
      category: 'mechanic',
      kind: 'mechanic',
      name: 'Tài Lộc Từ Máu (Blood Money) giờ chỉ rớt vàng khi tướng địch chết',
    },
    {
      id: 'pbe0812ad-bugfix-lux-dedup',
      category: 'mechanic',
      kind: 'mechanic',
      name: 'Script quản lý form Lux cập nhật, dọn tàn dư hệ thống cũ — Lux trong shop luôn là bản duy nhất khi chưa chọn form; Đón Sóng (Ride the Wave) và LeBlanc không còn cấp bản sao Lux bị tính tộc hệ tách rời',
    },
    {
      id: 'pbe0812ad-bugfix-timeskip',
      category: 'mechanic',
      kind: 'mechanic',
      name: 'Vượt Thời Gian (Time Skip) không còn vô hiệu hoá shop suốt cả trận',
    },
  ],
};

export default report;
