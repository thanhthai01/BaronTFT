// Draft bản vá PBE 04/08/2026 ("TheTruexy Patch Notes — Minor pass on balance").
// Nội dung/số liệu đã được duyệt trong
// Website/pbe-notes/Patch_TFT18.1x-PBE-minor-balance-pass.md — file này chỉ
// chuyển nội dung đó thành PatchReport để áp vào DB (pnpm db:apply-patch) rồi
// pull ra patch-notes.generated.ts (pnpm db:pull). Bản này ra SAU bản
// patch-pbe-2026-08-06 (ngày chính thức đã xác nhận lại là 03/08, không phải
// 06/08) và TRƯỚC bản 18.1y (05/08) — không phải bổ sung cho bản nào cả. Tên
// file/version dùng số tạm "18.1x" vì Liquipedia chưa công bố số patch chính
// thức, đổi lại khi có số thật.
import type { PatchReport } from '../../../src/content/patch-notes';

const report: PatchReport = {
  id: 'patch-tft18-1x',
  version: 'PBE 04/08/2026 (18.1x)',
  title: 'Cập nhật PBE 04/08/2026 — Minor balance pass',
  author: 'Baron TFT (dịch)',
  source: {
    label: 'PBE — TheTruexy (dev PBE chính thức)',
    url: 'https://x.com/TheTruexy/status/2084692206330544336',
  },
  entitySet: 18,
  dateVi: '04/08/2026',
  summaryVi:
    'Bản vá nhỏ trước bản 06/08 — siết nhẹ Krug và Gnar, đẩy mốc 3 sao của Amumu/Lillia/Nidalee (AD), và hồi sinh Linh Hỏa Nature\'s Wrath với giá rẻ hơn hẳn.',
  summaryOrigin: 'official',
  entries: [
    // ── Tướng ───────────────────────────────────────────────────────
    {
      id: 'pbe0804-krug',
      category: 'champion',
      kind: 'nerf',
      name: 'Krug',
      cost: 3,
      entityId: 'champion:tft18_krug',
      changes: [{ label: 'Sát thương chiêu (theo % máu tối đa)', from: '10%', to: '8%' }],
    },
    {
      id: 'pbe0804-gnar',
      category: 'champion',
      kind: 'nerf',
      name: 'Gnar',
      cost: 5,
      entityId: 'champion:tft18_gnar',
      changes: [{ label: 'Sát thương nhảy (theo SMCK)', from: '150/225', to: '100/150' }],
    },
    {
      id: 'pbe0804-amumu',
      category: 'champion',
      kind: 'buff',
      name: 'Amumu',
      note: 'mốc 3 sao',
      cost: 4,
      entityId: 'champion:tft18_amumu',
      changes: [{ label: 'Hồi máu tối đa (3 sao, theo % máu tối đa)', from: '2.2%', to: '4%' }],
    },
    {
      id: 'pbe0804-lillia',
      category: 'champion',
      kind: 'buff',
      name: 'Lillia',
      note: 'mốc 3 sao',
      cost: 4,
      entityId: 'champion:tft18_lillia',
      changes: [{ label: 'Hồi máu (3 sao, theo SMPT)', from: '600', to: '800' }],
    },
    {
      id: 'pbe0804-nidalee',
      category: 'champion',
      kind: 'buff',
      name: 'Nidalee',
      note: 'Dạng SMCK, mốc 3 sao',
      cost: 4,
      entityId: 'champion:tft18_nidalee',
      changes: [{ label: 'Xuyên giáp (3 sao)', from: '40%', to: '80%' }],
    },

    // ── Tộc hệ ──────────────────────────────────────────────────────
    {
      id: 'pbe0804-trait-blossom',
      category: 'trait',
      kind: 'nerf',
      name: 'Blossom',
      entityId: 'trait:blossom',
      changes: [{ label: 'Vàng mỗi lần mua Bùa', from: '5', to: '4' }],
    },
    {
      id: 'pbe0804-trait-coven',
      category: 'trait',
      kind: 'mechanic',
      name: 'Coven',
      entityId: 'trait:coven',
      changes: [{ label: 'Tùy chọn quy đổi 500 Tinh Chất', from: '500 Tinh Chất đổi 4 ấn ngẫu nhiên', to: 'Đã gỡ bỏ' }],
    },

    // ── Linh Hỏa (Wisps) ────────────────────────────────────────────
    {
      id: 'pbe0804-wisp-natureswrath',
      category: 'wisp',
      kind: 'buff',
      name: "Nature's Wrath",
      entityId: 'wisp:nature-s-wrath',
      note: 'hồi sinh',
      changes: [
        { label: 'Trạng thái', from: 'Đã gỡ bỏ', to: 'Bật lại (đã chỉnh lại điều kiện đề xuất)' },
        { label: 'Giá', from: '6g', to: '1g' },
        { label: 'Độ trễ', from: '8s', to: '10s' },
        { label: 'Độ trễ (nâng cấp)', from: '6s', to: '8s' },
      ],
    },

    // ── Nâng cấp ────────────────────────────────────────────────────
    {
      id: 'pbe0804-aug-consumingflora',
      category: 'augment',
      kind: 'buff',
      name: 'Consuming Flora',
      note: '(2-1 và 3-2)',
      entityId: 'augment:da_18_florafatalisaugment',
      changes: [{ label: 'Vàng thưởng', from: 'Không có', to: '3 vàng' }],
    },
    {
      id: 'pbe0804-aug-consumingfloraplusplus',
      category: 'augment',
      kind: 'mechanic',
      name: 'Consuming Flora ++',
      note: '(4-2)',
      entityId: 'augment:da_18_florafatalisaugmentplusplus',
      changes: [{ label: 'Trạng thái', from: 'Có trong hồ', to: 'Đã gỡ bỏ' }],
    },
    {
      id: 'pbe0804-aug-traitladder',
      category: 'augment',
      kind: 'mechanic',
      name: 'Trait Ladder',
      entityId: 'augment:da_traitladder',
      changes: [{ label: 'Loại trừ', from: 'Không loại trừ Coronation', to: 'Loại trừ với Coronation' }],
    },
    {
      id: 'pbe0804-aug-slightlymagicalroll',
      category: 'augment',
      kind: 'nerf',
      name: 'Slightly Magical Roll',
      changes: [{ label: 'Phần thưởng ở lượt quay thứ 6', from: 'Đũa Phép (Spatula)', to: 'Ấn ngẫu nhiên' }],
    },

    // ── Trang bị ────────────────────────────────────────────────────
    {
      id: 'pbe0804-item-dawncore',
      category: 'item',
      kind: 'nerf',
      name: 'Dawncore',
      changes: [{ label: 'Giảm hồi năng lượng mỗi đòn', from: '7%', to: '4%' }],
    },
    {
      id: 'pbe0804-item-cappajuice',
      category: 'item',
      kind: 'mechanic',
      name: 'Cappa Juice',
      changes: [{ label: 'Trạng thái', from: 'Có trong game', to: 'Đã gỡ bỏ (lỗi)' }],
    },
    {
      id: 'pbe0804-item-titanichydra',
      category: 'item',
      kind: 'nerf',
      name: 'Titanic Hydra',
      changes: [{ label: 'SMCK cơ bản thành sát thương cộng thêm', from: '6%', to: '4%' }],
    },
    {
      id: 'pbe0804-item-witsend',
      category: 'item',
      kind: 'nerf',
      name: "Wit's End",
      changes: [{ label: 'Sát thương cộng thêm khi đánh trúng', from: '40/40/60/80/100/115', to: '30/30/55/75/95/115' }],
    },

    // ── Encounters ──────────────────────────────────────────────────
    {
      id: 'pbe0804-mechanic-emblemensemble',
      category: 'mechanic',
      kind: 'mechanic',
      name: 'Emblem Ensemble — thêm loại trừ Augment hợp lệ',
    },
    {
      id: 'pbe0804-mechanic-rerollsubscription',
      category: 'mechanic',
      kind: 'mechanic',
      name: 'Reroll Subscription — thêm loại trừ Augment hợp lệ',
    },

    // ── Sửa lỗi ─────────────────────────────────────────────────────
    {
      id: 'pbe0804-bugfix-florafatalisemblem',
      category: 'mechanic',
      kind: 'mechanic',
      name: 'Ấn Flora Fatalis đặc biệt không còn được cấp từ nguồn nào khác ngoài augment',
    },
    {
      id: 'pbe0804-bugfix-ahriorb',
      category: 'mechanic',
      kind: 'mechanic',
      name: "Sửa lỗi quả cầu Ahri đôi khi bị kẹt tại chỗ khi nảy",
    },
  ],
};

export default report;
