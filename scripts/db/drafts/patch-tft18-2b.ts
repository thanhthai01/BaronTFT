// Draft bản vá LIVE 18.2b — micropatch nerf Fast 9 + reroll (Camille/LeBlanc/
// Teemo), sau khi bản 18.2 (patch-tft18-2.ts) tạo quá nhiều khoảng trống cho
// chiến lược lên cấp nhanh. Nội dung/số liệu đã soạn và duyệt trong
// Website/pbe-notes/Patch_TFT18.2b-live-micropatch.md.
//
// Nguồn: 2 tweet text của @TFT (không ảnh) + đối chiếu chéo Hotspawn.com và
// tftips.app/en/patches/18.2b (khớp gần như 100%). Người dùng đã xác nhận
// trực tiếp giá trị Brambleback Armor Ignore mốc 3 sao = 90%.
//
// Phạm vi cố ý CHỈ patch report, KHÔNG sync codex (không tìm được anchor an
// toàn trong DB hiện tại, xem .md để biết chi tiết từng trường hợp):
// - LeBlanc: DB chỉ lưu "10%" phẳng, không có mảng 3 mốc sao cho tỉ lệ bản sao.
// - Ashe: breakdown DB (25/38/200×AD+1) không khớp đơn vị với patch note/tftips.
// - Expected Unexpectedness: augment hoàn toàn chưa tồn tại trong set18_augments.
// - Nesting Dolls: chỉ "tạm thời vô hiệu hóa", field `visible` DB chưa rõ đúng
//   ngữ nghĩa pool-status hay chỉ hiển thị trang codex — theo quyết định người
//   dùng, KHÔNG đụng field này.
// - Polymorph/Minor/Major Polymorph: điều kiện thời gian hoàn toàn mới, DB
//   không có field tương ứng để đồng bộ.
// - Augment reward-table (Booster Pack, Warpath...): quá dày, giống tiền lệ
//   18.2 đã loại "Loot Orb reward table" khỏi entries.
//
// CÓ sync codex (xem scripts/db/apply-pbe-balance-tft18-2b.ts):
// - Camille: tổng sát thương chiêu + suy ra lại hệ số AD trong calcs (giữ
//   nguyên phần AP, theo quyết định người dùng).
// - Teemo: sát thương nấm nhỏ.
// - Brambleback: đổi hằng số Armor Ignore 30% → 90% (theo xác nhận người
//   dùng; DB không phân biệt theo mốc sao nên chỉ có 1 giá trị để sửa).
// - Maokai: sửa chuỗi hiển thị `mana` top-level "30/90" → "30/100" để đồng bộ
//   với `stats.mana`/`forms` vốn đã đúng sẵn (drift có từ trước, không phải
//   do bản vá này).
// - Bounty Seeker (Draven): 5 mục bounty, anchor sạch cả EN lẫn VI.
import type { PatchReport } from '../../../src/content/patch-notes';

const report: PatchReport = {
  id: 'patch-tft18-2b',
  version: 'Live 15/09/2026 (18.2b)',
  title: 'Micropatch — nerf Fast 9 và reroll mạnh',
  author: 'Baron TFT (dịch)',
  source: {
    label: '@TFT trên X (không có bài trên trang tin Riot) — đối chiếu Hotspawn.com + tftips.app',
    url: 'https://x.com/TFT/status/2099889251932655797',
  },
  entitySet: 18,
  dateVi: '15/09/2026',
  summaryVi:
    'Micropatch nhắm vào hai vấn đề nổi bật của 18.2: đảo một phần buff lên cấp (XP cấp 8-9 và 9-10 tăng lại 64→68) để hãm chiến lược Fast 9, đồng thời nerf các tướng reroll đang quá mạnh (Camille, LeBlanc, Teemo) cùng nhánh Săn Thưởng của Draven. Maokai và Brambleback nhận điều chỉnh nhỏ, Ashe đổi cách phân bổ sát thương vệt. Nâng Cấp Expected Unexpectedness được bật lại, Nesting Dolls tạm thời vô hiệu hóa do lỗi. Tinh Linh Biến Hóa (Polymorph) giờ chỉ chào bán trong 3 giây đầu giai đoạn chuẩn bị.',
  summaryOrigin: 'official',
  entries: [
    {
      id: 'live182b-mech-xpperlevel',
      category: 'mechanic',
      kind: 'nerf',
      name: 'XP mỗi cấp',
      note: 'Đảo lại một phần mức giảm gold lên cấp của bản 18.2 để hãm chiến lược Fast 9',
      changes: [
        { label: 'Cấp 8 → 9', from: '64', to: '68' },
        { label: 'Cấp 9 → 10', from: '64', to: '68' },
      ],
    },
    {
      id: 'live182b-champ-camille',
      entityId: 'champion:tft18_camille',
      category: 'champion',
      kind: 'nerf',
      name: 'Camille',
      changes: [{ label: 'Sát thương chiêu', from: '160/240/410', to: '150/225/375' }],
    },
    {
      id: 'live182b-champ-leblanc',
      entityId: 'champion:tft18_leblanc',
      category: 'champion',
      kind: 'nerf',
      name: 'LeBlanc',
      changes: [{ label: 'Tỉ lệ tạo bản sao', from: '10/15/40%', to: '10/15/30%' }],
    },
    {
      id: 'live182b-champ-teemo',
      entityId: 'champion:tft18_teemo',
      category: 'champion',
      kind: 'nerf',
      name: 'Teemo',
      changes: [{ label: 'Sát thương nấm nhỏ', from: '60/90/135', to: '55/82/130' }],
    },
    {
      id: 'live182b-champ-brambleback',
      entityId: 'champion:tft18_brambleback',
      category: 'champion',
      kind: 'mechanic',
      name: 'Brambleback',
      note: 'Sửa lỗi tính toán Giảm Giáp',
      changes: [{ label: 'Giảm Giáp (Armor Ignore)', from: '85%', to: '90%' }],
    },
    {
      id: 'live182b-champ-ashe',
      entityId: 'champion:tft18_ashe',
      category: 'champion',
      kind: 'rework',
      name: 'Ashe',
      changes: [
        { label: 'Thời lượng vệt (Trail Duration)', from: '4 giây', to: '3 giây' },
        { label: 'Sát thương vệt mỗi giây', from: '5/8 AD', to: '9/14 AD' },
      ],
    },
    {
      id: 'live182b-champ-maokai',
      entityId: 'champion:tft18_maokai',
      category: 'champion',
      kind: 'buff',
      name: 'Maokai',
      changes: [{ label: 'Năng Lượng tối đa', from: '90', to: '100' }],
    },
    {
      id: 'live182b-trait-bountyseeker',
      entityId: 'trait:bountyseeker',
      category: 'trait',
      kind: 'nerf',
      name: 'Bounty Seeker',
      changes: [
        { label: 'Hạ gục nhận 12 vàng', from: '6', to: '8' },
        { label: 'Tung chiêu nhận 2 tướng 4 vàng', from: '5', to: '6' },
        { label: 'Tấn công nhận 1 tướng 5 vàng', from: '50', to: '60' },
        { label: 'Sát thương nhận 7 vàng', from: '8000', to: '10000' },
        { label: 'Phần thưởng khi tung chiêu 8 lần', from: '10 lượt đổi cửa hàng', to: '6 lượt đổi cửa hàng' },
      ],
    },
    {
      id: 'live182b-mech-expectedunexpectedness',
      category: 'mechanic',
      kind: 'mechanic',
      name: 'Expected Unexpectedness',
      changes: [{ label: 'Trạng thái', from: 'Bị vô hiệu hóa', to: 'Đã bật lại (re-enabled)' }],
    },
    {
      id: 'live182b-mech-nestingdolls',
      entityId: 'augment:da_nestingdolls',
      category: 'mechanic',
      kind: 'mechanic',
      name: 'Nesting Dolls',
      note: 'Có thể được bật lại ở các bản vá sau',
      changes: [{ label: 'Trạng thái', from: 'Đang hoạt động', to: 'Tạm thời vô hiệu hóa (lỗi)' }],
    },
    {
      id: 'live182b-wisp-polymorph-timing',
      category: 'wisp',
      kind: 'mechanic',
      name: 'Polymorph / Minor Polymorph / Major Polymorph',
      note: 'Áp dụng cho cả 3 cấp độ Biến Hóa',
      changes: [{ label: 'Điều kiện xuất hiện', from: 'Không giới hạn thời gian', to: 'Chỉ 3 giây đầu giai đoạn chuẩn bị' }],
    },
  ],
};

export default report;
