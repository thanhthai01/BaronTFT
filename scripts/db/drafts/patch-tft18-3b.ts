// Draft bản vá LIVE 18.3b — micropatch 24/09/2026. Nội dung/số liệu đã soạn và
// duyệt trong Website/pbe-notes/Patch_TFT18.3b-live-micropatch.md.
//
// Nguồn: mục "MID-PATCH UPDATE — SEPTEMBER 24TH" Riot chèn vào trang patch 18.3
// bản EN (bản VI không có mục này ⇒ tên Việt lấy từ nameVi trong DB).
//
// CÓ sync codex (xem scripts/db/apply-live-balance-tft18-3b.ts):
// - Kha'Zix: 2 dãy sát thương chiêu.
// - Blackthorn: row APSacrificeDamageAmpBonus ở mốc 2 và 4.
//
// Chỉ patch report:
// - Brambleback: Riot không công bố số, DB không có field thời gian tung chiêu.
// - Nhóm khôi phục 18.2b (Camille/Teemo/LeBlanc/Ashe/Draven): DB chưa từng bị
//   hoàn tác như trong game ⇒ đã đúng giá trị mới (Camille/Teemo/Draven), hoặc
//   vốn là report-only từ 18.2b (LeBlanc/Ashe).
// - 4 Nâng Cấp bị tắt: không đụng field `visible` (tiền lệ 18.2b).
import type { PatchReport } from '../../../src/content/patch-notes';

const RESTORED_NOTE = 'Khôi phục thay đổi của 18.2b, vốn bị vô tình hoàn tác ở bản 18.3';

const report: PatchReport = {
  id: 'patch-tft18-3b',
  version: 'Live 24/09/2026 (18.3b)',
  title: 'Micropatch — nerf Kha\'Zix, Gai Đen và khôi phục các thay đổi 18.2b',
  author: 'Baron TFT (dịch)',
  source: {
    label: 'Riot Games — mục "Mid-Patch Update" (24/09) trong patch note 18.3 bản tiếng Anh',
    url: 'https://teamfighttactics.leagueoflegends.com/en-us/news/game-updates/teamfight-tactics-patch-18-3/',
  },
  entitySet: 18,
  dateVi: '24/09/2026',
  summaryVi:
    'Bản B của 18.3 vừa xử lý những biến chuyển meta chưa kịp đưa vào bản chính, vừa khôi phục vài thay đổi cân bằng của 18.2b bị vô tình hoàn tác khi chuyển sang 18.3. Kha\'Zix và nhánh hiến tế tướng SMPT của Gai Đen bị giảm sức mạnh, Brambleback tung chiêu nhanh hơn một chút. Các nerf 18.2b cho Camille, LeBlanc, Teemo, Ashe và Săn Thưởng của Draven được bật lại. Bốn Nâng Cấp tạm thời bị vô hiệu hóa do lỗi hoặc mất cân bằng nghiêm trọng.',
  summaryOrigin: 'official',
  entries: [
    {
      id: 'live183b-trait-blackthorn',
      entityId: 'trait:eldritch',
      category: 'trait',
      kind: 'nerf',
      name: 'Blackthorn',
      changes: [{ label: 'Khuếch đại sát thương cơ bản khi hiến tế tướng SMPT', from: '14%', to: '12%' }],
    },
    {
      id: 'live183b-champ-khazix',
      entityId: 'champion:tft18_khazix',
      category: 'champion',
      kind: 'nerf',
      name: "Kha'Zix",
      changes: [
        { label: 'Sát thương chiêu cơ bản', from: '285/400/580 AP', to: '265/370/535 AP' },
        { label: 'Sát thương khi mục tiêu bị cô lập', from: '310/445/660 AP', to: '285/410/605 AP' },
      ],
    },
    {
      id: 'live183b-champ-brambleback',
      entityId: 'champion:tft18_brambleback',
      category: 'champion',
      kind: 'buff',
      name: 'Brambleback',
      note: 'Tung chiêu nhanh hơn một chút (Riot không công bố số liệu cụ thể)',
    },
    {
      id: 'live183b-mech-targeting',
      category: 'mechanic',
      kind: 'mechanic',
      name: 'Nhắm mục tiêu của tướng',
      note: 'Bản 18.3 đã chủ động hoàn tác một thay đổi nhỏ về nhắm mục tiêu từ 18.2, vốn gây tác dụng phụ cho tướng cận chiến ở đầu giao tranh. Riot đang tìm cách khác để đưa cơ chế nhắm mục tiêu về giống Mùa 17.',
    },
    {
      id: 'live183b-champ-camille',
      entityId: 'champion:tft18_camille',
      category: 'champion',
      kind: 'nerf',
      name: 'Camille',
      note: RESTORED_NOTE,
      changes: [{ label: 'Sát thương chiêu', from: '160/240/410/700', to: '150/225/375/640' }],
    },
    {
      id: 'live183b-champ-leblanc',
      entityId: 'champion:tft18_leblanc',
      category: 'champion',
      kind: 'nerf',
      name: 'LeBlanc',
      note: RESTORED_NOTE,
      changes: [{ label: 'Tỉ lệ tạo bản sao', from: '10/15/40%', to: '10/15/30%' }],
    },
    {
      id: 'live183b-champ-teemo',
      entityId: 'champion:tft18_teemo',
      category: 'champion',
      kind: 'nerf',
      name: 'Teemo',
      note: RESTORED_NOTE,
      changes: [{ label: 'Sát thương nấm nhỏ', from: '60/90/135', to: '55/82/130' }],
    },
    {
      id: 'live183b-champ-ashe',
      entityId: 'champion:tft18_ashe',
      category: 'champion',
      kind: 'rework',
      name: 'Ashe',
      note: RESTORED_NOTE,
      changes: [
        { label: 'Thời lượng vệt', from: '4 giây', to: '3 giây' },
        { label: 'Sát thương vệt mỗi giây', from: '5/8 AD', to: '9/14 AD' },
      ],
    },
    {
      id: 'live183b-trait-bountyseeker',
      entityId: 'trait:bountyseeker',
      category: 'trait',
      kind: 'nerf',
      name: 'Bounty Seeker',
      note: RESTORED_NOTE,
      changes: [
        { label: 'Hạ gục nhận 12 vàng', from: '6', to: '8' },
        { label: 'Tung chiêu nhận 2 tướng 4 vàng', from: '5', to: '6' },
        { label: 'Tấn công nhận 1 tướng 5 vàng', from: '50', to: '60' },
        { label: 'Sát thương nhận 7 vàng', from: '8000', to: '10000' },
        { label: 'Phần thưởng khi tung chiêu 8 lần', from: '10 lượt đổi cửa hàng', to: '6 lượt đổi cửa hàng' },
      ],
    },
    {
      id: 'live183b-aug-challengersgrace',
      entityId: 'augment:da_challengersgrace',
      category: 'augment',
      kind: 'mechanic',
      name: "Ân Huệ Thách Đấu (Challenger's Grace)",
      changes: [{ label: 'Trạng thái', from: 'Đang hoạt động', to: 'Tạm thời vô hiệu hóa (lỗi)' }],
    },
    {
      id: 'live183b-aug-darkritual',
      entityId: 'augment:da_18_coventraitaugment_loottoap',
      category: 'augment',
      kind: 'mechanic',
      name: 'Tà Thuật (Dark Ritual)',
      changes: [{ label: 'Trạng thái', from: 'Đang hoạt động', to: 'Tạm thời vô hiệu hóa' }],
    },
    {
      id: 'live183b-aug-infinityprotection',
      entityId: 'augment:da_infinityprotection',
      category: 'augment',
      kind: 'mechanic',
      name: 'Bảo Hộ Vô Tận (Infinity Protection)',
      changes: [{ label: 'Trạng thái', from: 'Đang hoạt động', to: 'Tạm thời vô hiệu hóa (lỗi)' }],
    },
    {
      id: 'live183b-aug-nestingdolls',
      entityId: 'augment:da_nestingdolls',
      category: 'augment',
      kind: 'mechanic',
      name: 'Búp Bê Xây Tổ (Nesting Dolls)',
      note: 'Tiếp tục bị vô hiệu hóa từ bản 18.2b',
      changes: [{ label: 'Trạng thái', from: 'Vô hiệu hóa', to: 'Vẫn vô hiệu hóa (lỗi)' }],
    },
  ],
};

export default report;
