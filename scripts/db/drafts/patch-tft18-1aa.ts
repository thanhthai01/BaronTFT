// Draft bản vá PBE — nội dung/số liệu đã được duyệt trong
// Website/pbe-notes/Patch_TFT18.1aa-PBE-light-pass.md (đăng
// August 7th, 2026 - 13:00 PDT, tiếp theo bản 18.1z 06/08). File này chỉ
// chuyển nội dung đó thành PatchReport để áp vào DB (pnpm db:apply-patch) rồi
// pull ra patch-notes.generated.ts (pnpm db:pull).
import type { PatchReport } from '../../../src/content/patch-notes';

const report: PatchReport = {
  id: 'patch-tft18-1aa',
  version: 'PBE 07/08/2026 (18.1aa)',
  title: 'Light pass, bug fixes',
  author: 'Baron TFT (dịch)',
  source: {
    label: 'PBE — TheTruexy (dev PBE chính thức)',
    url: 'https://x.com/TheTruexy/status/2085809695017869378',
  },
  entitySet: 18,
  dateVi: '07/08/2026',
  summaryVi:
    'Bản vá PBE nhẹ vì đội đang truy tìm vài lỗi gameplay nặng — buff Caitlyn, Elder Dragon, Maokai; nerf Raptor (Mama Beak), Blackthorn, Vanguard, Good Loss; xoay vòng sức mạnh giữa các Ấn (Emblem) và Blighting Jewel.',
  summaryOrigin: 'official',
  entries: [
    // ── Tướng ───────────────────────────────────────────────────────
    {
      id: 'pbe0807aa-caitlyn',
      category: 'champion',
      kind: 'buff',
      name: 'Caitlyn',
      cost: 2,
      entityId: 'champion:tft18_caitlyn',
      // "(Enhanced)" trong patch note gốc — không rõ nghĩa/không tra được định
      // nghĩa trong codex Set 18, nên bỏ, không hiện lên báo cáo (theo yêu cầu
      // người dùng 08/08/2026).
      changes: [{ label: 'Sát thương công cơ bản', from: '190/285/450 AD', to: '200/300/500 AD' }],
    },
    {
      // Raptor = "chim quỷ biến dị". "Mama Beak" chỉ là tên chiêu/lore trong
      // ability text (không phải tên hiển thị) — KHÔNG đưa vào `note` để hiện
      // lên báo cáo, chỉ ghi chú ở đây để các bản cập nhật sau nhận ra nhanh
      // đây chính là Raptor khi patch note gốc gọi bằng "Mama Beak".
      id: 'pbe0807aa-raptor',
      category: 'champion',
      kind: 'nerf',
      name: 'Raptor',
      cost: 3,
      entityId: 'champion:tft18_raptor',
      changes: [
        { label: 'Giảm Giáp Alpha', from: '1', to: '2' },
        { label: 'Sát thương phép (Tiny Beaks)', from: '27/41/65', to: '25/38/60' },
      ],
    },
    {
      id: 'pbe0807aa-malphite',
      category: 'champion',
      kind: 'buff',
      name: 'Malphite',
      cost: 4,
      entityId: 'champion:tft18_malphite',
      note: '3 sao',
      changes: [{ label: 'Tầm đánh chiêu', from: '2 ô', to: '3 ô' }],
    },
    {
      id: 'pbe0807aa-elderdragon',
      category: 'champion',
      kind: 'buff',
      name: 'The Elder Dragon',
      cost: 5,
      entityId: 'champion:tft18_elderdragon',
      changes: [
        { label: 'Sát thương công cơ bản gốc', from: '100', to: '110' },
        { label: 'Sát thương phép', from: '200/300', to: '250/375' },
        { label: 'Flame Breath', from: 'Không giảm theo số mục tiêu', to: 'Giảm 20% mỗi mục tiêu trúng đòn (tối thiểu 20%)' },
      ],
    },
    {
      id: 'pbe0807aa-maokai',
      category: 'champion',
      kind: 'buff',
      name: 'Maokai',
      cost: 5,
      entityId: 'champion:tft18_maokai',
      changes: [
        { label: 'Hồi máu theo AP', from: '300/400 AP', to: '330/400 AP' },
        { label: 'Hồi máu theo % Máu tối đa còn thiếu', from: '8%', to: '10%' },
      ],
    },

    // ── Tộc hệ ──────────────────────────────────────────────────────
    {
      id: 'pbe0807aa-trait-blackthorn',
      category: 'trait',
      kind: 'nerf',
      name: 'Blackthorn',
      entityId: 'trait:eldritch',
      breakpoint: '6',
      breakpointStyle: 'gold',
      changes: [
        { label: 'Máu', from: '200', to: '150' },
        { label: 'Tốc Đánh', from: '18%', to: '15%' },
        { label: 'Sát Thương/Sức Mạnh Phép', from: '+18', to: '+15' },
        { label: 'Giáp/Kháng Phép', from: '15', to: '10' },
      ],
    },
    {
      id: 'pbe0807aa-trait-vanguard',
      category: 'trait',
      kind: 'nerf',
      name: 'Vanguard',
      entityId: 'trait:vanguard',
      breakpoint: '6',
      breakpointStyle: 'gold',
      changes: [
        { label: 'Khiên (mốc 6)', from: '45%', to: '42%' },
        { label: 'Chống Chịu khi có khiên', from: '6%', to: '5%' },
      ],
    },

    // ── Trang bị (Ấn/Đá) ────────────────────────────────────────────
    {
      id: 'pbe0807aa-item-brawleremblem',
      category: 'item',
      kind: 'nerf',
      name: 'Brawler Emblem',
      icon: '/set18/assets/items/full/da_18_emblembrawler.png',
      changes: [{ label: 'Sát thương theo % Máu tối đa', from: '3%', to: '2.5%' }],
    },
    {
      id: 'pbe0807aa-item-executioneremblem',
      category: 'item',
      kind: 'nerf',
      name: 'Executioner Emblem',
      icon: '/set18/assets/items/full/da_18_emblemexecutioner.png',
      changes: [
        { label: 'Tỉ lệ Chí Mạng', from: '35%', to: '20%' },
        { label: 'Sát thương Chí Mạng', from: '15%', to: '10%' },
      ],
    },
    {
      id: 'pbe0807aa-item-hunteremblem',
      category: 'item',
      kind: 'buff',
      name: 'Hunter Emblem',
      icon: '/set18/assets/items/full/da_18_emblemhunter.png',
      changes: [{ label: 'Sát thương công theo mỗi lượt hạ gục', from: '12%', to: '18%' }],
    },
    {
      id: 'pbe0807aa-item-primalemblem',
      category: 'item',
      kind: 'buff',
      name: 'Primal Emblem',
      icon: '/set18/assets/items/full/da_18_emblemprimal.png',
      changes: [{ label: 'Tốc Đánh', from: '15%', to: '25%' }],
    },
    {
      id: 'pbe0807aa-item-ravageremblem',
      category: 'item',
      kind: 'buff',
      name: 'Ravager Emblem',
      icon: '/set18/assets/items/full/da_18_emblemslayer.png',
      changes: [{ label: 'Sát thương công/Sức mạnh phép', from: '15%', to: '20%' }],
    },
    {
      id: 'pbe0807aa-item-blightingjewel',
      category: 'item',
      kind: 'buff',
      name: 'Blighting Jewel',
      icon: '/set18/assets/items/full/da_artifact_blightingjewel.png',
      changes: [{ label: 'Sức mạnh phép', from: '20%', to: '30%' }],
    },

    // ── Linh Hỏa (Wisps) ────────────────────────────────────────────
    {
      id: 'pbe0807aa-wisp-goodloss',
      category: 'wisp',
      kind: 'nerf',
      name: 'Good Loss',
      entityId: 'wisp:good-loss',
      changes: [{ label: 'Kinh nghiệm mỗi lần thua', from: '6/8 XP', to: '4/6 XP' }],
    },

    // ── Sửa Lỗi (Bugfixes) ──────────────────────────────────────────
    {
      id: 'pbe0807aa-bugfix-covenprops',
      category: 'mechanic',
      kind: 'mechanic',
      name: 'Vật trang trí Coven giờ đặt đúng vị trí trong chế độ Double Up',
    },
    {
      id: 'pbe0807aa-bugfix-eclipsecelebration',
      category: 'mechanic',
      kind: 'mechanic',
      name: 'Hiệu ứng ăn mừng tộc hệ Eclipse không còn phát trên tất cả tướng hệ Lunar/Solar khi có người kích hoạt Eclipse',
    },
    {
      id: 'pbe0807aa-bugfix-manalessaggro',
      category: 'mechanic',
      kind: 'mechanic',
      name: 'Tank phép không tiêu năng lượng (vd Stonebark, hình nộm tập luyện) giờ có thuộc tính hút mục tiêu đúng như mọi tank khác',
    },
    {
      id: 'pbe0807aa-bugfix-infernoshopslots',
      category: 'mechanic',
      kind: 'mechanic',
      name: 'Sửa lỗi ô đồ trong tiệm bị đốt bởi Inferno thỉnh thoảng thành đồ 1 vàng',
    },
    {
      id: 'pbe0807aa-bugfix-kogmawtockers',
      category: 'mechanic',
      kind: 'mechanic',
      name: "Kog'Maw trong Tocker's không còn bị khóa năng lượng",
    },
    {
      id: 'pbe0807aa-bugfix-curiopeddler',
      category: 'mechanic',
      kind: 'mechanic',
      name: 'Curio và Peddler giờ đặt lựa chọn 0 vàng ở ô ngoài cùng bên phải, tránh bị trừ tiền cho món không chọn khi offer hết giờ',
    },
    {
      id: 'pbe0807aa-bugfix-constructforge',
      category: 'mechanic',
      kind: 'mechanic',
      name: 'Construct-a-Companion và Forge-a-Friend không còn tràn ra bàn đấu trong lúc combat',
    },
    {
      id: 'pbe0807aa-bugfix-destinywispcadence',
      category: 'mechanic',
      kind: 'mechanic',
      name: 'Nhận nâng cấp Destiny không còn tính là một lượt tiệm bổ sung cho nhịp Linh Hỏa',
    },
    {
      id: 'pbe0807aa-bugfix-goldeneggoffer',
      category: 'mechanic',
      kind: 'mechanic',
      name: 'Sửa lỗi Golden Egg không bao giờ được chào bán',
    },
    {
      id: 'pbe0807aa-bugfix-goldeneggcountdown',
      category: 'mechanic',
      kind: 'mechanic',
      name: 'Đồng hồ đếm ngược Golden Egg giờ hiển thị đúng ở lượt đầu tiên',
    },
  ],
};

export default report;
