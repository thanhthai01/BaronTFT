// Draft bản vá PBE — nội dung/số liệu lấy từ ảnh gốc Truexy đăng
// (https://x.com/TheTruexy/status/2090142868971356507, "(8/19) 'Final' PBE
// Patch notes"), đã được người dùng xác nhận qua
// Website/pbe-notes/_pending/tft18-1ag-candidate.md. Bản vá tiếp theo 18.1af
// (18/08/2026) — không có bản vá ngày 19/08 nào khác trước bản này.
//
// Tên tiếng Việt chính, tên gốc phụ trong ngoặc: champion/trait/wisp/augment
// có entityId thì /patch tự tra nameVi qua entity-index — chỉ cần viết
// entry.name bằng tên gốc (tiếng Anh), KHÔNG tự dịch tay ở đây.
//
// Ghi chú đặc biệt:
// - Comeback Story: ảnh gốc vẽ mũi tên ▲ nhưng % Attack Speed theo máu thiếu
//   GIẢM (0.4% → 0.3%) — người dùng xác nhận đây là NERF thật, không theo
//   mũi tên ảnh (một reply dưới bài gốc cũng thắc mắc y hệt).
// - Flame On!: người dùng xác nhận augment này bị xoá hoàn toàn khỏi Set 18
//   — xử lý giống Death's Defiance ở 18.1af (category augment, kind mechanic,
//   không có changes, chỉ note mô tả việc gỡ bỏ).
// - Buried Treasures II: patch note ghi "II" nhưng DB chỉ có duy nhất augment
//   "Buried Treasures III" (augment:da_buriedtreasuresiii) — không có bản II
//   hay bản gốc nào khác (đã tự kiểm tra DB trực tiếp, không phải generated
//   file thiếu). Người dùng chọn: map entityId vào III trong DB, nhưng GIỮ
//   tên hiển thị theo đúng patch note "Buried Treasures II" — trang /patch
//   vì vậy sẽ hiện "Kho Báu Chôn Giấu III (Buried Treasures II)" (nameVi lấy
//   từ entity III, tên gốc theo patch note ghi II). Đây là lựa chọn người
//   dùng đã duyệt rõ ràng, không phải lỗi.
// - Elderwood: tách 2 entry theo đúng HƯỚNG THẬT của từng thay đổi (đừng theo
//   mũi tên gộp ▲ của cả nhóm) — hiệu ứng Protector (Slam Damage) là buff,
//   nhưng 9 Piece HP Bonus giảm 60%→55% là nerf.
// - Ezreal "Spell AS": người dùng xác nhận đây là Tốc Độ Đánh cộng thêm SAU
//   KHI dùng kỹ năng (không phải AS nền).
import type { PatchReport } from '../../../src/content/patch-notes';

const report: PatchReport = {
  id: 'patch-tft18-1ag',
  version: 'PBE 19/08/2026 (18.1ag)',
  title: '"Final" PBE Patch notes',
  author: 'Baron TFT (dịch)',
  source: {
    label: 'PBE — TheTruexy (dev PBE chính thức)',
    url: 'https://x.com/TheTruexy/status/2090142868971356507',
  },
  entitySet: 18,
  dateVi: '19/08/2026',
  summaryVi:
    'Bản vá nhỏ, chủ yếu buff nhẹ và chỉnh Augment trước khi khoá bản phát hành — meta đã ổn định cả tuần nên không phản ứng mạnh với bản vá vừa/trung bình hôm trước. Buff 9 tướng (Akali, Gromp, Azir, Cassiopeia, Fiddlesticks, Ezreal, Lillia, Elder Dragon, Maokai), nerf Blackthorn, buff Elderwood/Juggernaut (kèm giảm nhẹ HP Bonus mốc 9 Elderwood). 13 Augment được chỉnh (2 bugfix, riêng Flame On! bị gỡ bỏ hoàn toàn khỏi game), nerf wisp Heroic Sacrifice. Kèm 1 bugfix liên quan Riftbeast/Alpha Mark ở ô Blackthorn.',
  summaryOrigin: 'official',
  entries: [
    // ── Tướng 1 vàng ──────────────────────────────────────────────
    {
      id: 'pbe0819ag-champ-akali',
      category: 'champion',
      kind: 'buff',
      name: 'Akali',
      entityId: 'champion:tft18_akali',
      changes: [
        { label: 'Sát thương chiêu (dạng AD)', from: '145/220/345/590', to: '145/220/380/645' },
        { label: 'Sát thương chiêu (dạng AP)', from: '140/210/340/535', to: '140/210/365/620' },
      ],
    },

    // ── Tướng 2 vàng ──────────────────────────────────────────────
    {
      id: 'pbe0819ag-champ-gromp',
      category: 'champion',
      kind: 'buff',
      name: 'Gromp',
      entityId: 'champion:tft18_gromp',
      note: 'Dạng AP',
      changes: [{ label: 'Sát thương phụ chiêu', from: '145/220/345/585', to: '160/240/360/610' }],
    },

    // ── Tướng 3 vàng ──────────────────────────────────────────────
    {
      id: 'pbe0819ag-champ-azir',
      category: 'champion',
      kind: 'buff',
      name: 'Azir',
      entityId: 'champion:tft18_azir',
      changes: [{ label: 'Sát thương Chiến Binh', from: '46/69/110/195', to: '48/72/115/205' }],
    },
    {
      id: 'pbe0819ag-champ-cassiopeia',
      category: 'champion',
      kind: 'buff',
      name: 'Cassiopeia',
      entityId: 'champion:tft18_cassiopeia',
      changes: [{ label: 'Sát thương chiêu', from: '425/640/1020/1625', to: '440/660/1050/1650' }],
    },
    {
      id: 'pbe0819ag-champ-fiddlesticks',
      category: 'champion',
      kind: 'buff',
      name: 'Fiddlesticks',
      entityId: 'champion:tft18_fiddlesticks',
      changes: [{ label: 'Hồi máu', from: '395/470/790/1110', to: '410/485/850/1200' }],
    },

    // ── Tướng 4 vàng ──────────────────────────────────────────────
    {
      id: 'pbe0819ag-champ-ezreal',
      category: 'champion',
      kind: 'buff',
      name: 'Ezreal',
      entityId: 'champion:tft18_ezreal',
      changes: [{ label: 'Tốc Độ Đánh cộng thêm sau khi dùng kỹ năng', from: '25%', to: '30%' }],
    },
    {
      id: 'pbe0819ag-champ-lillia',
      category: 'champion',
      kind: 'buff',
      name: 'Lillia',
      entityId: 'champion:tft18_lillia',
      changes: [{ label: 'Hồi máu chiêu', from: '300/400', to: '325/475' }],
    },

    // ── Tướng 5 vàng ──────────────────────────────────────────────
    {
      id: 'pbe0819ag-champ-elderdragon',
      category: 'champion',
      kind: 'buff',
      name: 'Elder Dragon',
      entityId: 'champion:tft18_elderdragon',
      changes: [{ label: 'Sức Mạnh Công Kích', from: '110', to: '115' }],
    },
    {
      id: 'pbe0819ag-champ-maokai',
      category: 'champion',
      kind: 'buff',
      name: 'Maokai',
      entityId: 'champion:tft18_maokai',
      changes: [{ label: 'Máu', from: '1100', to: '1150' }],
    },

    // ── Tộc hệ ──────────────────────────────────────────────────────
    {
      id: 'pbe0819ag-trait-blackthorn',
      category: 'trait',
      kind: 'nerf',
      name: 'Blackthorn',
      entityId: 'trait:eldritch',
      changes: [{ label: 'Chỉ số hiến tế cho Tank (HP/Kháng)', from: '20% HP / 17 Kháng', to: '17% HP / 17 Kháng' }],
    },
    {
      id: 'pbe0819ag-trait-elderwood-protector',
      category: 'trait',
      kind: 'buff',
      name: 'Elderwood',
      entityId: 'trait:elderwood',
      note: 'Hiệu ứng Protector',
      changes: [
        { label: 'Sát thương Slam (nền)', from: '445/670', to: '500/750' },
        { label: 'Sát thương Slam (diện rộng)', from: '220/335', to: '250/375' },
      ],
    },
    {
      id: 'pbe0819ag-trait-elderwood-9pc',
      category: 'trait',
      kind: 'nerf',
      name: 'Elderwood',
      entityId: 'trait:elderwood',
      breakpoint: '9',
      changes: [{ label: 'Máu cộng thêm mốc 9', from: '60%', to: '55%' }],
    },
    {
      id: 'pbe0819ag-trait-juggernaut',
      category: 'trait',
      kind: 'buff',
      name: 'Juggernaut',
      entityId: 'trait:juggernaut',
      changes: [{ label: 'Giảm Sát Thương khi đơn độc', from: '20/30/40%', to: '20/33/45%' }],
    },

    // ── Augment ────────────────────────────────────────────────────
    {
      id: 'pbe0819ag-augment-bandofthievesii',
      category: 'augment',
      kind: 'buff',
      name: 'Band of Thieves II',
      entityId: 'augment:da_bandofthievesii',
      changes: [{ label: 'Độ trễ kích hoạt', from: '6 lượt giao tranh', to: '5 lượt giao tranh' }],
    },
    {
      id: 'pbe0819ag-augment-boosterpack',
      category: 'augment',
      kind: 'mechanic',
      name: 'Booster Pack',
      entityId: 'augment:da_boosterpack',
      note: 'Sửa lỗi chỉ cấp 10 vàng tướng thay vì đúng lượng dự kiến',
    },
    {
      id: 'pbe0819ag-augment-bonusgifts',
      category: 'augment',
      kind: 'nerf',
      name: 'Bonus Gifts',
      entityId: 'augment:da_bonusgift',
      changes: [{ label: 'Số Rương Vật Phẩm ban đầu', from: '2', to: '1' }],
    },
    {
      id: 'pbe0819ag-augment-bonusgiftsplus1',
      category: 'augment',
      kind: 'nerf',
      name: 'Bonus Gifts (+1)',
      entityId: 'augment:da_bonusgiftplus',
      changes: [{ label: 'Số Rương Vật Phẩm ban đầu', from: '3', to: '2' }],
    },
    {
      id: 'pbe0819ag-augment-buriedtreasuresii',
      category: 'augment',
      kind: 'buff',
      name: 'Buried Treasures II',
      entityId: 'augment:da_buriedtreasuresiii',
      changes: [{ label: 'Số vòng', from: '5', to: '6' }],
    },
    {
      id: 'pbe0819ag-augment-capitalgainsii',
      category: 'augment',
      kind: 'buff',
      name: 'Capital Gains II',
      entityId: 'augment:da_capitalgainsii',
      changes: [{ label: 'Vàng ban đầu', from: '1', to: '2' }],
    },
    {
      id: 'pbe0819ag-augment-comebackstory',
      category: 'augment',
      kind: 'nerf',
      name: 'Comeback Story',
      entityId: 'augment:da_comebackstory',
      changes: [{ label: 'Tốc Độ Đánh mỗi % máu thiếu', from: '0.4%', to: '0.3%' }],
    },
    {
      id: 'pbe0819ag-augment-dummify',
      category: 'augment',
      kind: 'mechanic',
      name: 'Dummify',
      entityId: 'augment:da_dummify',
      note: 'Sửa lỗi Hình Nhân có ít hơn 1000 máu so với dự kiến',
    },
    {
      id: 'pbe0819ag-augment-flameon',
      category: 'augment',
      kind: 'mechanic',
      name: 'Flame On!',
      entityId: 'augment:da_18_infernotraitaugment',
      note: 'Gỡ bỏ hoàn toàn khỏi game',
    },
    {
      id: 'pbe0819ag-augment-goldendragon',
      category: 'augment',
      kind: 'nerf',
      name: 'Golden Dragon',
      entityId: 'augment:da_thegoldendragon',
      changes: [{ label: 'Máu cộng thêm', from: '700', to: '600' }],
    },
    {
      id: 'pbe0819ag-augment-investmentstrategyii',
      category: 'augment',
      kind: 'buff',
      name: 'Investment Strategy II',
      entityId: 'augment:da_investmentstrategy',
      changes: [{ label: 'Máu mỗi điểm lãi', from: '8', to: '9' }],
    },
    {
      id: 'pbe0819ag-augment-livingforge',
      category: 'augment',
      kind: 'nerf',
      name: 'Living Forge',
      entityId: 'augment:da_livingforge',
      changes: [{ label: 'Số vòng', from: '9', to: '10' }],
    },
    {
      id: 'pbe0819ag-augment-moneyhungryplus',
      category: 'augment',
      kind: 'buff',
      name: 'Money Hungry+',
      entityId: 'augment:da_moneyhungryplus',
      changes: [{ label: 'Vàng ban đầu', from: '10', to: '13' }],
    },
    {
      id: 'pbe0819ag-augment-nestinganvilsplus',
      category: 'augment',
      kind: 'nerf',
      name: 'Nesting Anvils (+)',
      entityId: 'augment:da_nestinganvilsplus',
      changes: [{ label: 'Vàng', from: '8/12', to: '4/8' }],
    },

    // ── Tinh Linh (Wisp) ──────────────────────────────────────────
    {
      id: 'pbe0819ag-wisp-heroicsacrifice',
      category: 'wisp',
      kind: 'nerf',
      name: 'Heroic Sacrifice',
      entityId: 'wisp:heroic-sacrifice',
      changes: [{ label: 'Máu', from: '1500/1800', to: '1200/1500' }],
    },

    // ── Bugfix ────────────────────────────────────────────────────
    {
      id: 'pbe0819ag-bugfix-riftbeast-alphamark',
      category: 'mechanic',
      kind: 'mechanic',
      name: 'Hiến tế Riftbeast mang Alpha Mark vào ô Blackthorn giờ chặn việc chọn lại Alpha mới trong cùng vòng lúc giao tranh bắt đầu',
    },
  ],
};

export default report;
