// Draft bản vá PBE — nội dung/số liệu đã được duyệt trong
// Website/pbe-notes/Patch_TFT18.1af-PBE-balance-pass.md (Truexy tự ghi là bản
// vá cho ngày 8/18, đăng lúc 1:30 AM giờ hiển thị Aug 19, 2026, tiếp theo bản
// 18.1ae 14/08 — không có bản vá ngày 17/08). File này chỉ chuyển nội dung đó
// thành PatchReport để áp vào DB (pnpm db:apply-patch) rồi pull ra
// patch-notes.generated.ts (pnpm db:pull).
//
// Tên tiếng Việt chính, tên gốc phụ trong ngoặc: champion/trait/wisp có
// entityId thì /patch tự tra nameVi qua entity-index. Item KHÔNG có cơ chế
// tra tự động — viết sẵn "<Tiếng Việt> (<Tên gốc>)" lấy nguyên từ
// set18_items.nameVi.
//
// Ghi chú đặc biệt:
// - Death's Defiance: gỡ bỏ hoàn toàn khỏi game do bug (không phải nerf số
//   liệu) — category mechanic, kind rework.
// - Inferno: người dùng xác nhận đây là "điều chỉnh" (rework), không phải
//   buff/nerf rõ ràng — kind rework.
// - Hand of Justice: người dùng xác nhận patch nói tới bản Radiant (AD/AP
//   30%→35%), không phải bản thường (15%).
// - Executioner Emblem: người dùng xác nhận dòng "Critical Strike Damage"
//   thay thế cho field "Damage Amp" cũ trong statBadges — đây là đổi mechanic,
//   không chỉ đổi số.
// - Pebbles Mana 30/70: KHÔNG đưa vào entries — ảnh gốc không có mũi tên thay
//   đổi, người dùng sẽ gửi lại ảnh xác nhận sau.
import type { PatchReport } from '../../../src/content/patch-notes';

const report: PatchReport = {
  id: 'patch-tft18-1af',
  version: 'PBE 18/08/2026 (18.1af)',
  title: 'Balance pass',
  author: 'Baron TFT (dịch)',
  source: {
    label: 'PBE — TheTruexy (dev PBE chính thức)',
    url: 'https://x.com/TheTruexy/status/2089782014769865134',
  },
  entitySet: 18,
  dateVi: '18/08/2026',
  summaryVi:
    'Truexy dự kiến còn 1 đợt fine-tuning nữa (Augments, một số Traits, thay đổi nhỏ) trước khi khoá bản để phát hành. Phần lớn tướng/tộc hệ đã ổn cho launch, mối lo lớn nhất là tần suất/sức mạnh Artifact+Emblem (có lợi cho reroll hơn cost cao). Nerf loạt tướng đang mạnh (Ornn, Pebbles, Xayah, Warwick, Yunara, Rengar, Vi, Nidalee), buff Kha\'Zix/Raptor/Brambleback/Alune/Kennen/Lux/Cinderling. Death\'s Defiance bị gỡ bỏ hoàn toàn khỏi game do bug. Nerf mạnh 4 Emblem (Brawler/Executioner/Juggernaut/Vanguard) và trait Vanguard, buff hàng loạt Wisp (Backrow Star, Giant Growth, Killer\'s Regret, Snacktime!, Stealthy, Iron Core, Ironwood, Radiantize, Terraforming) và trait Blossom/Elderwood. Kèm 13 bugfix.',
  summaryOrigin: 'official',
  entries: [
    // ── Tướng 1 vàng ──────────────────────────────────────────────
    {
      id: 'pbe0818af-champ-cinderling',
      category: 'champion',
      kind: 'buff',
      name: 'Cinderling',
      entityId: 'champion:tft18_cinderling',
      changes: [{ label: 'Sát thương vật lý cộng thêm', from: '40', to: '45' }],
    },
    {
      id: 'pbe0818af-champ-ornn',
      category: 'champion',
      kind: 'nerf',
      name: 'Ornn',
      entityId: 'champion:tft18_ornn',
      changes: [{ label: 'Sát thương cần để tạo mỗi Artifact', from: '90k/145k/180k', to: '90k/155k/180k' }],
    },
    {
      id: 'pbe0818af-champ-pebbles',
      category: 'champion',
      kind: 'nerf',
      name: 'Pebbles',
      entityId: 'champion:tft18_pebbles',
      changes: [
        { label: 'Sát thương vật lý cộng thêm', from: '30', to: '35' },
        { label: 'Sát thương chiêu', from: '160/240/360 AP', to: '155/235/350 AP' },
      ],
    },
    {
      id: 'pbe0818af-champ-xayah',
      category: 'champion',
      kind: 'nerf',
      name: 'Xayah',
      entityId: 'champion:tft18_xayah',
      changes: [{ label: 'Sát thương chiêu', from: '72/108/165 AD', to: '68/102/155 AD' }],
    },

    // ── Tướng 2 vàng ──────────────────────────────────────────────
    {
      id: 'pbe0818af-champ-warwick',
      category: 'champion',
      kind: 'nerf',
      name: 'Warwick',
      entityId: 'champion:tft18_warwick',
      note: 'Giảm mức độ thời gian tung chiêu co giãn theo Tốc Độ Đánh (không có số liệu before/after cụ thể)',
    },
    {
      id: 'pbe0818af-champ-yunara',
      category: 'champion',
      kind: 'nerf',
      name: 'Yunara',
      entityId: 'champion:tft18_yunara',
      changes: [{ label: 'Sát thương chiêu', from: '155/230/350 AD', to: '150/225/335 AD' }],
    },

    // ── Tướng 3 vàng ──────────────────────────────────────────────
    {
      id: 'pbe0818af-champ-khazix',
      category: 'champion',
      kind: 'buff',
      name: "Kha'Zix",
      entityId: 'champion:tft18_khazix',
      changes: [
        { label: 'Máu', from: '850', to: '950' },
        { label: 'Sát thương chiêu nền', from: '260/370/550 AP', to: '285/400/580 AP' },
      ],
    },
    {
      // Truexy gọi tướng này là "Mama Beak" trong caption — codex Set 18 dùng
      // tên Raptor, xem [[project_set18_champion_patchnote_aliases]].
      id: 'pbe0818af-champ-raptor',
      category: 'champion',
      kind: 'buff',
      name: 'Raptor',
      entityId: 'champion:tft18_raptor',
      changes: [{ label: 'Sát thương vật lý cộng thêm', from: '60', to: '65' }],
    },
    {
      id: 'pbe0818af-champ-rengar',
      category: 'champion',
      kind: 'nerf',
      name: 'Rengar',
      entityId: 'champion:tft18_rengar',
      changes: [
        { label: 'Hồi máu tối đa', from: '150/220/300 AP', to: '120/180/300 AP' },
        { label: 'Hồi máu tối thiểu', from: '70/100/130 AP', to: '60/90/150 AP' },
      ],
    },
    {
      id: 'pbe0818af-champ-vi',
      category: 'champion',
      kind: 'nerf',
      name: 'Vi',
      entityId: 'champion:tft18_vi',
      changes: [{ label: 'Hồi máu ban đầu', from: '225/300/400 AP', to: '200/265/360 AP' }],
    },

    // ── Tướng 4 vàng ──────────────────────────────────────────────
    {
      id: 'pbe0818af-champ-brambleback',
      category: 'champion',
      kind: 'buff',
      name: 'Brambleback',
      entityId: 'champion:tft18_brambleback',
      changes: [{ label: 'Sát thương vật lý cộng thêm', from: '110', to: '115' }],
    },
    {
      id: 'pbe0818af-champ-nidalee',
      category: 'champion',
      kind: 'nerf',
      name: 'Nidalee',
      entityId: 'champion:tft18_nidalee',
      note: 'Dạng AP',
      changes: [{ label: 'Sát thương chiêu tăng cường', from: '320/480 AP', to: '285/425 AP' }],
    },

    // ── Tướng 5 vàng ──────────────────────────────────────────────
    {
      id: 'pbe0818af-champ-alune',
      category: 'champion',
      kind: 'buff',
      name: 'Alune',
      entityId: 'champion:tft18_alune',
      changes: [{ label: 'Sát thương Mảnh Trăng', from: '50/75 AP', to: '53/80 AP' }],
    },
    {
      id: 'pbe0818af-champ-kennen',
      category: 'champion',
      kind: 'buff',
      name: 'Kennen',
      entityId: 'champion:tft18_kennen',
      changes: [{ label: 'Sát thương chiêu', from: '450/675 AP', to: '475/715 AP' }],
    },
    {
      id: 'pbe0818af-champ-lux',
      category: 'champion',
      kind: 'buff',
      name: 'Lux',
      entityId: 'champion:tft18_lux',
      changes: [{ label: 'Sát thương Mặt Trời cộng thêm mỗi 3 sao', from: '10%', to: '12%' }],
    },

    // ── Trang Bị ────────────────────────────────────────────────
    {
      id: 'pbe0818af-item-deathsdefiance',
      category: 'item',
      kind: 'mechanic',
      name: 'Vũ Khúc Tử Thần (Death\'s Defiance)',
      note: 'Gỡ bỏ hoàn toàn khỏi game do bug — không phải thay đổi số liệu',
    },
    {
      id: 'pbe0818af-item-aegisofdusk',
      category: 'item',
      kind: 'buff',
      name: 'Khiên Hoàng Hôn (Aegis of Dusk)',
      changes: [{ label: 'Tỉ lệ sát thương phép theo Kháng Phép', from: '15%', to: '18%' }],
    },
    {
      id: 'pbe0818af-item-manazane',
      category: 'item',
      kind: 'buff',
      name: 'Thánh Kiếm Manazane (Manazane)',
      changes: [{ label: 'Hồi Năng Lượng', from: '100', to: '110' }],
    },
    {
      id: 'pbe0818af-item-rapidfirecannon',
      category: 'item',
      kind: 'nerf',
      name: 'Đại Bác Liên Thanh (Rapid Firecannon)',
      changes: [{ label: 'Tốc Độ Đánh', from: '65%', to: '55%' }],
    },
    {
      id: 'pbe0818af-item-silvermeredawn',
      category: 'item',
      kind: 'buff',
      name: 'Chùy Bạch Ngân (Silvermere Dawn)',
      changes: [{ label: 'Hút Máu Toàn Phần', from: '20%', to: '30%' }],
    },
    {
      id: 'pbe0818af-item-witsend',
      category: 'item',
      kind: 'nerf',
      name: 'Đao Tím (Wit\'s End)',
      changes: [{ label: 'Máu', from: '400', to: '300' }],
    },
    {
      id: 'pbe0818af-item-adaptivehelm',
      category: 'item',
      kind: 'mechanic',
      name: 'Mũ Thích Nghi Ánh Sáng (Radiant Adaptive Helm)',
      note: 'Sửa lỗi cấp sai lượng Năng Lượng cộng thêm',
    },
    {
      id: 'pbe0818af-item-gargoylestoneplate',
      category: 'item',
      kind: 'buff',
      name: 'Thú Tượng Thạch Giáp Ánh Sáng (Radiant Gargoyle Stoneplate)',
      changes: [{ label: 'Máu', from: '300', to: '400' }],
    },
    {
      id: 'pbe0818af-item-handofjustice',
      category: 'item',
      kind: 'buff',
      name: 'Bàn Tay Công Lý Ánh Sáng (Radiant Hand of Justice)',
      changes: [{ label: 'Sức Mạnh Công Kích/Phép Thuật', from: '30%', to: '35%' }],
    },
    {
      id: 'pbe0818af-item-steadfastheart',
      category: 'item',
      kind: 'nerf',
      name: 'Trái Tim Kiên Định Ánh Sáng (Radiant Steadfast Heart)',
      changes: [{ label: 'Máu', from: '600', to: '500' }],
    },
    {
      id: 'pbe0818af-item-brawleremblem',
      category: 'item',
      kind: 'nerf',
      name: 'Ấn Đấu Sĩ (Brawler Emblem)',
      changes: [{ label: 'Sát thương phép theo Máu tối đa', from: '2.5%', to: '2%' }],
    },
    {
      id: 'pbe0818af-item-executioneremblem',
      category: 'item',
      kind: 'rework',
      name: 'Ấn Đao Phủ (Executioner Emblem)',
      note: 'Đổi mechanic — thay field Khuếch Đại Sát Thương cũ bằng Sát Thương Chí Mạng',
      changes: [
        { label: 'Sát Thương Chí Mạng (mới, thay Khuếch Đại Sát Thương cũ)', from: '10%', to: '8%' },
        { label: 'Ngưỡng Hành Quyết', from: '12%', to: '8%' },
      ],
    },
    {
      id: 'pbe0818af-item-juggernautemblem',
      category: 'item',
      kind: 'nerf',
      name: 'Ấn Dũng Sĩ (Juggernaut Emblem)',
      changes: [{ label: 'Máu nền', from: '400', to: '350' }],
    },
    {
      id: 'pbe0818af-item-vanguardemblem',
      category: 'item',
      kind: 'nerf',
      name: 'Ấn Tiên Phong (Vanguard Emblem)',
      changes: [{ label: 'Thời gian sống sót để nhận Máu Linh Thú', from: '20 giây', to: '22 giây' }],
    },

    // ── Tộc hệ ──────────────────────────────────────────────────────
    {
      id: 'pbe0818af-trait-blossom',
      category: 'trait',
      kind: 'buff',
      name: 'Blossom',
      entityId: 'trait:blossom',
      note: 'Áp dụng cho mốc 3/5/7/9; mốc 11 giữ nguyên 100%',
      changes: [{ label: 'AD/AP (mốc 3/5/7/9)', from: '12/30/40/45%', to: '12/30/45/50%' }],
    },
    {
      id: 'pbe0818af-trait-elderwood',
      category: 'trait',
      kind: 'buff',
      name: 'Elderwood',
      entityId: 'trait:elderwood',
      breakpoint: '7',
      changes: [{ label: 'Máu nền Hộ Vệ Rừng', from: '400', to: '450' }],
    },
    {
      id: 'pbe0818af-trait-inferno',
      category: 'trait',
      kind: 'rework',
      name: 'Inferno',
      entityId: 'trait:inferno',
      note: 'Người dùng xác nhận đây là điều chỉnh cơ chế, không phải buff/nerf thuần',
      changes: [
        { label: 'Thời lượng Thiêu Đốt', from: '4 giây', to: '3 giây' },
        { label: 'Lượng Thiêu Đốt mỗi mốc', from: '1/1/2/3%', to: '1/1/3/3.5%' },
      ],
    },
    {
      id: 'pbe0818af-trait-vanguard',
      category: 'trait',
      kind: 'nerf',
      name: 'Vanguard',
      entityId: 'trait:vanguard',
      changes: [{ label: 'Lượng Khiên theo Máu tối đa', from: '18/32/42%', to: '18/30/40%' }],
    },

    // ── Tinh Linh (Wisp) ──────────────────────────────────────────
    {
      id: 'pbe0818af-wisp-artifactinate',
      category: 'wisp',
      kind: 'nerf',
      name: 'Artifactinate',
      entityId: 'wisp:artifactinate',
      changes: [{ label: 'Giá', from: '0 vàng', to: '2 vàng' }],
      note: 'Kèm giảm tần suất xuất hiện (không có số liệu cụ thể)',
    },
    {
      id: 'pbe0818af-wisp-backrowstar',
      category: 'wisp',
      kind: 'buff',
      name: 'Backrow Star',
      entityId: 'wisp:backrow-star',
      changes: [
        { label: 'Giá', from: '4', to: '3' },
        { label: 'Tốc Độ Đánh', from: '75/100%', to: '85/115%' },
      ],
    },
    {
      id: 'pbe0818af-wisp-giantgrowth',
      category: 'wisp',
      kind: 'buff',
      name: 'Giant Growth',
      entityId: 'wisp:giant-growth',
      changes: [{ label: 'Máu', from: '700', to: '750' }],
    },
    {
      id: 'pbe0818af-wisp-killersregret',
      category: 'wisp',
      kind: 'buff',
      name: "Killer's Regret",
      entityId: 'wisp:killer-s-regret',
      changes: [{ label: 'Thời gian choáng', from: '1.25/1.5 giây', to: '1.5/1.75 giây' }],
    },
    {
      id: 'pbe0818af-wisp-moonrise',
      category: 'wisp',
      kind: 'mechanic',
      name: 'Moonrise',
      entityId: 'wisp:moonrise',
      note: 'Đổi mốc xuất hiện từ 3-5 sang 4-1',
    },
    {
      id: 'pbe0818af-wisp-snacktime',
      category: 'wisp',
      kind: 'buff',
      name: 'Snacktime!',
      entityId: 'wisp:snacktime',
      changes: [
        { label: 'Giá', from: '3', to: '2' },
        { label: 'BFF Execute', from: '15%/20%', to: '16/22%' },
      ],
    },
    {
      id: 'pbe0818af-wisp-stealthy',
      category: 'wisp',
      kind: 'buff',
      name: 'Stealthy',
      entityId: 'wisp:stealthy',
      changes: [{ label: 'Giá', from: '1', to: '0' }],
    },
    {
      id: 'pbe0818af-wisp-ironcore',
      category: 'wisp',
      kind: 'buff',
      name: 'Iron Core',
      entityId: 'wisp:iron-core',
      note: 'Đổi mốc xuất hiện từ 3-5 sang 4-1',
      changes: [{ label: 'Máu mỗi đơn vị hàng đầu', from: '4/6%', to: '6/8%' }],
    },
    {
      id: 'pbe0818af-wisp-ironwood',
      category: 'wisp',
      kind: 'buff',
      name: 'Ironwood',
      entityId: 'wisp:ironwood',
      changes: [{ label: 'Giảm Sát Thương', from: '12/18%', to: '14/20%' }],
    },
    {
      id: 'pbe0818af-wisp-radiantize',
      category: 'wisp',
      kind: 'buff',
      name: 'Radiantize',
      entityId: 'wisp:radiantize',
      changes: [{ label: 'Giá', from: '5', to: '4' }],
    },
    {
      id: 'pbe0818af-wisp-terraforming',
      category: 'wisp',
      kind: 'buff',
      name: 'Terraforming',
      entityId: 'wisp:terraforming',
      changes: [{ label: 'Số hạt giống', from: '5/9', to: '7/10' }],
    },

    // ── Bugfix ────────────────────────────────────────────────────
    {
      id: 'pbe0818af-bugfix-covenvanguard',
      category: 'mechanic',
      kind: 'mechanic',
      name: 'Sửa lỗi kết hợp Coven Acolyte và Vanguard Emblem có thể cấp dư Máu Linh Thú',
    },
    {
      id: 'pbe0818af-bugfix-ivern-dance',
      category: 'mechanic',
      kind: 'mechanic',
      name: '3 sao Ivern không còn giữ hiệu ứng buộc nhảy múa sang giao tranh kế tiếp gây thua/hoà oan',
    },
    {
      id: 'pbe0818af-bugfix-ivern-reapply',
      category: 'mechanic',
      kind: 'mechanic',
      name: 'Hiệu ứng 3 sao Ivern áp lại thường xuyên hơn để bắt kịp kẻ địch đang di chuyển',
    },
    {
      id: 'pbe0818af-bugfix-alphamark-vfx',
      category: 'mechanic',
      kind: 'mechanic',
      name: 'Hiệu ứng hình ảnh Alpha Mark không còn tồn tại xuyên qua Recombobulator/Polymorph',
    },
    {
      id: 'pbe0818af-bugfix-polymorph-draven',
      category: 'mechanic',
      kind: 'mechanic',
      name: 'Biến hình tướng 4 vàng 3 sao thành Draven 3 sao không còn làm hỏng Draven',
    },
    {
      id: 'pbe0818af-bugfix-recombobulate-kayle',
      category: 'mechanic',
      kind: 'mechanic',
      name: 'Tái Tổ Hợp Kayle 3 sao không còn làm vô hình một phần tướng mới',
    },
    {
      id: 'pbe0818af-bugfix-invested-gold',
      category: 'mechanic',
      kind: 'mechanic',
      name: 'Invested giờ theo dõi đúng số vàng ở cuối vòng thay vì đầu vòng kế tiếp',
    },
    {
      id: 'pbe0818af-bugfix-noscoutnopivot',
      category: 'mechanic',
      kind: 'mechanic',
      name: 'NO SCOUT NO PIVOT giờ khoá đúng đơn vị kể cả khi bị hiến tế trong ô Blackthorn',
    },
    {
      id: 'pbe0818af-bugfix-soloplate',
      category: 'mechanic',
      kind: 'mechanic',
      name: 'Solo Plate hoạt động đúng trên bàn đấu vắng mặt',
    },
    {
      id: 'pbe0818af-bugfix-calltochaos',
      category: 'mechanic',
      kind: 'mechanic',
      name: 'Call to Chaos không còn hiện tooltip sai khi người chơi nhận thưởng Spatula + Frying Pan',
    },
    {
      id: 'pbe0818af-bugfix-gromp-riftbeast',
      category: 'mechanic',
      kind: 'mechanic',
      name: 'Sửa lỗi Gromp vẫn xuất hiện trong Riftbeast Shop sau khi đã 3 sao nếu đang ở dạng AD Adaptor',
    },
    {
      id: 'pbe0818af-bugfix-partialascension',
      category: 'mechanic',
      kind: 'mechanic',
      name: 'Partial Ascension giờ áp dụng đúng cho toàn bộ đơn vị trên bàn thay vì chỉ những đơn vị có mặt lúc mua augment',
    },
    {
      id: 'pbe0818af-bugfix-radiantize-revert',
      category: 'mechanic',
      kind: 'mechanic',
      name: 'Mọi trang bị tiếp tục hoạt động đúng sau khi bị Ánh Sáng Hoá rồi trở về dạng thường',
    },
  ],
};

export default report;
