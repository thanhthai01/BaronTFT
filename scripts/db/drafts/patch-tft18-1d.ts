// Draft bản vá LIVE 18.1d — micropatch cân bằng đầu tiên của Mùa 18.
// Nội dung/số liệu đã được duyệt trong
// Website/pbe-notes/Patch_TFT18.1d-live-micropatch.md.
//
// Nguồn: ảnh "18.1 Mid-Patch Balance Adjustments" + caption của Truexy
// (dev TFT) đăng 01/09/2026 8:16 AM PDT; vá lên live "later tonight" giờ Mỹ
// ⇒ rạng sáng 02/09/2026 giờ VN. KHÔNG có bài trên trang tin Riot —
// B/C/D-patch của TFT chỉ công bố qua X (đã kiểm tra cả en-us và vi-vn).
//
// Ghi chú nội dung:
// - Lux là mục duy nhất trộn hai hướng (buff sát thương chiêu + nerf Suy Yếu
//   dạng Mặt Trăng) ⇒ gộp thành MỘT entry, kind buff, nerf ghi rõ trong
//   changes. Nguồn phụ tftips tách nhầm thành 2 mục "Lux"/"Lux (Lunar)".
// - Cinderling ghi đủ 4 mốc sao theo đúng ảnh gốc (340/510/765/1300); codex
//   chỉ lưu 3 mốc nên script balance bỏ mốc thứ tư — người dùng đã chốt.
// - Nâng Cấp "Chế Tạo Bằng Hữu" (Forge A Friend) mà tftips ghi nhận KHÔNG có
//   trong ảnh gốc ⇒ người dùng chốt loại khỏi phạm vi bản vá này.
// - 3 mục cuối (kéo-thả, particle, Thích Ứng) là mechanic thuần (PatchChangeKind
//   không có 'bugfix'), không có số liệu cân bằng before/after.
import type { PatchReport } from '../../../src/content/patch-notes';

const report: PatchReport = {
  id: 'patch-tft18-1d',
  version: 'Live 02/09/2026 (18.1d)',
  title: 'Micropatch cân bằng đầu tiên',
  author: 'Baron TFT (dịch)',
  source: {
    label: 'Truexy (dev TFT) — micropatch cân bằng 18.1d',
    url: 'https://x.com/TheTruexy/status/2094595183572549650',
  },
  entitySet: 18,
  dateVi: '02/09/2026',
  summaryVi:
    'Micropatch cân bằng đầu tiên của Mùa 18, nghiêng hẳn về nerf. Truexy nhắm vào ba lối chơi quá ổn định đang bóp thời gian của phần còn lại: Cassiopeia/Fiddlesticks ép Stage 3-4 bằng đội hình rẻ, Cinderling/Pebbles cuộn tuyết sang cuối ván bằng 7 Quái Rừng, và Ahri/Morgana dọn hàng sau quá nhanh ngay đầu giao tranh. Hai tộc/hệ bị hạ: Thực Vật mất năng lượng lẫn lượng hồi máu, Quái Rừng giảm chỉ số tăng trưởng ở mốc 7. Bảy tướng bị nerf gồm Cinderling (hạ cả AD gốc lẫn sát thương chiêu), Cassiopeia, Master Yi, Ahri, Morgana và phần thưởng Mặt Trăng của Lux. Bốn tướng được buff bù: Amumu và Soraka lấy lại sức sau bản ra mắt khó khăn, Draven — tướng 5 vàng yếu nhất bản vá — được tăng cả tốc đánh lẫn tốc lên chiêu, The Elder Dragon tăng sát thương đánh thường. Kèm ba cải thiện ngoài số liệu: kéo-thả mượt hơn, hiệu năng cuối ván tốt hơn ở lúc chuyển vòng và Vòng Đi Chợ, và sửa lỗi Thích Ứng bị trả về hệ số 1 sao khi gỡ trang bị. Truexy báo trước 18.2 sẽ ngược lại — chủ yếu buff tướng đầu ván và chỉnh hệ thống Tạo Tác/Tinh Linh.',
  summaryOrigin: 'official',
  entries: [
    // ── Tộc/Hệ ────────────────────────────────────────────────────
    {
      id: 'live181d-trait-florafatalis',
      category: 'trait',
      kind: 'nerf',
      name: 'Flora Fatalis',
      entityId: 'trait:florafatalis',
      changes: [
        { label: 'Năng Lượng (mốc 1)', from: '10', to: '8' },
        { label: 'Hồi Máu tối đa cho đồng minh thấp máu nhất (mốc 2)', from: '8%', to: '6%' },
      ],
    },
    {
      id: 'live181d-trait-riftbeast',
      category: 'trait',
      kind: 'nerf',
      name: 'Riftbeast',
      entityId: 'trait:riftbeast',
      breakpoint: '7',
      breakpointStyle: 'gold',
      changes: [
        { label: 'Chỉ số tăng trưởng mỗi 5 giây', from: '6% AD/AP/Tốc Đánh', to: '5% AD/AP/Tốc Đánh' },
      ],
    },

    // ── Tướng 1 vàng ──────────────────────────────────────────────
    {
      id: 'live181d-champ-cinderling',
      category: 'champion',
      kind: 'nerf',
      name: 'Cinderling',
      entityId: 'champion:tft18_cinderling',
      changes: [
        { label: 'Sức Mạnh Công Kích gốc', from: '45', to: '40' },
        { label: 'Sát thương chiêu', from: '340/510/765/1300 AD', to: '310/465/700/1200 AD' },
      ],
    },

    // ── Tướng 3 vàng ──────────────────────────────────────────────
    {
      id: 'live181d-champ-cassiopeia',
      category: 'champion',
      kind: 'nerf',
      name: 'Cassiopeia',
      entityId: 'champion:tft18_cassiopeia',
      changes: [{ label: 'Sát thương chiêu', from: '440/660/1050 AP', to: '400/600/950 AP' }],
    },
    {
      id: 'live181d-champ-masteryi',
      category: 'champion',
      kind: 'nerf',
      name: 'Master Yi',
      entityId: 'champion:tft18_masteryi',
      changes: [{ label: 'Giáp và Kháng Phép', from: '60', to: '55' }],
    },

    // ── Tướng 4 vàng ──────────────────────────────────────────────
    {
      id: 'live181d-champ-ahri',
      category: 'champion',
      kind: 'nerf',
      name: 'Ahri',
      entityId: 'champion:tft18_ahri',
      changes: [{ label: 'Sát thương chiêu', from: '450/675 AP', to: '425/640 AP' }],
    },
    {
      id: 'live181d-champ-morgana',
      category: 'champion',
      kind: 'nerf',
      name: 'Morgana',
      entityId: 'champion:tft18_morgana',
      changes: [{ label: 'Năng Lượng', from: '0/60', to: '0/65' }],
    },
    {
      id: 'live181d-champ-amumu',
      category: 'champion',
      kind: 'buff',
      name: 'Amumu',
      entityId: 'champion:tft18_amumu',
      changes: [
        { label: 'Năng Lượng', from: '30/140', to: '30/125' },
        { label: 'Hồi Máu theo % Máu tối đa', from: '2.2%', to: '2.5%' },
      ],
    },
    {
      id: 'live181d-champ-soraka',
      category: 'champion',
      kind: 'buff',
      name: 'Soraka',
      entityId: 'champion:tft18_soraka',
      changes: [{ label: 'Sát thương tinh tú đầu', from: '190/285 AP', to: '225/335 AP' }],
    },

    // ── Tướng 5 vàng ──────────────────────────────────────────────
    {
      id: 'live181d-champ-draven',
      category: 'champion',
      kind: 'buff',
      name: 'Draven',
      entityId: 'champion:tft18_draven',
      changes: [
        { label: 'Năng Lượng', from: '0/120', to: '0/110' },
        { label: 'Tốc Độ Đánh gốc', from: '0.8', to: '0.85' },
      ],
    },
    {
      id: 'live181d-champ-elderdragon',
      category: 'champion',
      kind: 'buff',
      name: 'The Elder Dragon',
      entityId: 'champion:tft18_elderdragon',
      changes: [{ label: 'Sức Mạnh Công Kích gốc', from: '115', to: '125' }],
    },
    {
      id: 'live181d-champ-lux',
      category: 'champion',
      kind: 'buff',
      name: 'Lux',
      entityId: 'champion:tft18_lux',
      changes: [
        { label: 'Sát thương chiêu', from: '330/520 AP', to: '355/550 AP' },
        { label: 'Thưởng Mặt Trăng — Suy Yếu', from: '10%', to: '8%' },
      ],
    },

    // ── Cơ chế và sửa lỗi ─────────────────────────────────────────
    {
      id: 'live181d-mech-dragdrop',
      category: 'mechanic',
      kind: 'mechanic',
      name: 'Kéo thả tướng',
      changes: [{ label: 'Độ nhạy thao tác', from: 'Phản hồi chậm', to: 'Mượt và nhạy hơn' }],
    },
    {
      id: 'live181d-mech-performance',
      category: 'mechanic',
      kind: 'mechanic',
      name: 'Hiệu năng cuối ván',
      changes: [
        {
          label: 'Xả hiệu ứng hình ảnh',
          from: 'Tồn đọng gây tụt khung hình',
          to: 'Xả ở lúc chuyển vòng và Vòng Đi Chợ',
        },
      ],
    },
    {
      id: 'live181d-bugfix-adaptor',
      category: 'mechanic',
      kind: 'mechanic',
      name: 'Thích Ứng (Adaptor)',
      changes: [
        {
          label: 'Gỡ trang bị khỏi tướng đã lên sao',
          from: 'Bị trả về hệ số 1 sao',
          to: 'Giữ đúng hệ số theo cấp sao',
        },
      ],
    },
  ],
};

export default report;
