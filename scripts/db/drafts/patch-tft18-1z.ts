// Draft bản vá PBE — nội dung/số liệu đã được duyệt trong
// Website/pbe-notes/Patch_TFT18.1z-PBE-minor-balance-pass.md (đăng
// August 6th, 2026 - 12:00 PDT, tiếp theo bản 18.1y 05/08). File này chỉ
// chuyển nội dung đó thành PatchReport để áp vào DB (pnpm db:apply-patch) rồi
// pull ra patch-notes.generated.ts (pnpm db:pull).
import type { PatchReport } from '../../../src/content/patch-notes';

const report: PatchReport = {
  id: 'patch-tft18-1z',
  version: 'PBE 06/08/2026 (18.1z)',
  title: 'Minor pass on balance & bug fixes',
  author: 'Baron TFT (dịch)',
  source: {
    label: 'PBE — TheTruexy (dev PBE chính thức)',
    url: 'https://x.com/TheTruexy/status/2085418741870088311',
  },
  entitySet: 18,
  dateVi: '06/08/2026',
  summaryVi:
    'Bản vá PBE nhẹ, chủ yếu bugfix — Ashe được rework chuyển sức mạnh ra khỏi sát thương diện rộng backline, Coven và Fae bị siết nhẹ, hai Linh Hỏa Greater Chaos và Hand of Baron bị nerf.',
  summaryOrigin: 'official',
  entries: [
    // ── Tướng ───────────────────────────────────────────────────────
    {
      id: 'pbe0806z-ashe',
      category: 'champion',
      kind: 'rework',
      name: 'Ashe',
      cost: 5,
      entityId: 'champion:tft18_ashe',
      note: 'chuyển sức mạnh ra khỏi sát thương backline',
      changes: [
        { label: 'Năng lượng tối đa', from: '30/90', to: '20/80' },
        { label: 'Sát thương mũi tên', from: '260/400 AD', to: '400/600 AD' },
        { label: 'Suy giảm sát thương mỗi mục tiêu', from: '40%', to: '80%' },
        { label: 'Sát thương DoT (theo AD)', from: '20/30 AD', to: '5/8 AD' },
        { label: 'Sát thương DoT (theo AP)', from: '5/8 AP', to: '2/3 AP' },
      ],
    },

    // ── Tộc hệ ──────────────────────────────────────────────────────
    {
      id: 'pbe0806z-trait-coven',
      category: 'trait',
      kind: 'mechanic',
      name: 'Coven',
      entityId: 'trait:coven',
      changes: [
        { label: 'Tinh chất mỗi lần thua', from: '20/25/35/100', to: '20/25/30/80' },
        { label: 'Tinh chất mỗi lần hạ gục', from: '1/2/2/7', to: '1/2/3/10' },
      ],
    },
    {
      id: 'pbe0806z-trait-fae',
      category: 'trait',
      kind: 'nerf',
      name: 'Fae',
      entityId: 'trait:fae',
      changes: [{ label: 'Vàng Tiên Bụi Vàng', from: '5/10/15/25/35/65', to: '5/8/12/18/25/50' }],
    },

    // ── Linh Hỏa (Wisps) ────────────────────────────────────────────
    {
      id: 'pbe0806z-wisp-greaterchaos',
      category: 'wisp',
      kind: 'nerf',
      name: 'Greater Chaos',
      entityId: 'wisp:greater-chaos',
      changes: [{ label: 'Cast Circle of Elders', from: 'Có thể', to: 'Không còn' }],
    },
    {
      id: 'pbe0806z-wisp-handofbaron',
      category: 'wisp',
      kind: 'nerf',
      name: 'Hand of Baron',
      entityId: 'wisp:hand-of-baron',
      changes: [
        { label: 'Hồi năng lượng', from: 'Có', to: 'Không còn' },
        { label: 'Sát thương công cơ bản', from: '4/6%', to: '3/5%' },
        { label: 'Sức mạnh phép', from: '4/6%', to: '3/5%' },
        { label: 'Tốc đánh', from: '4/6%', to: '3/5%' },
        { label: 'Máu', from: '40/60', to: '33/55' },
        { label: 'Giáp và Kháng phép', from: '4/6', to: '3/5' },
        { label: 'Hút máu toàn phần', from: '4/6%', to: '3/5%' },
      ],
    },

    // ── Sửa Lỗi (Bugfixes) ──────────────────────────────────────────
    {
      id: 'pbe0806z-bugfix-covencashout',
      category: 'mechanic',
      kind: 'mechanic',
      name: "Sửa lỗi cashout 800 Essence của Coven trao sai phần thưởng",
    },
    {
      id: 'pbe0806z-bugfix-clonecompanion',
      category: 'mechanic',
      kind: 'mechanic',
      name: 'Clone Companion clone giờ không còn cộng tộc hệ cho đội hình của bạn',
    },
    {
      id: 'pbe0806z-bugfix-nidaleefishbones',
      category: 'mechanic',
      kind: 'mechanic',
      name: 'Sửa lỗi Nidalee (dạng SMCK) và Fishbones tương tác không đúng',
    },
    {
      id: 'pbe0806z-bugfix-sprykinbff',
      category: 'mechanic',
      kind: 'mechanic',
      name: "Sửa lỗi Sprykin's BFF có thể bị tàng hình",
    },
    {
      id: 'pbe0806z-bugfix-infernoburn',
      category: 'mechanic',
      kind: 'mechanic',
      name: 'Sửa lỗi sát thương Burn của Inferno áp dụng ngay lập tức thay vì đợi đúng chu kỳ',
    },
    {
      id: 'pbe0806z-bugfix-lilliahorizonfocus',
      category: 'mechanic',
      kind: 'mechanic',
      name: 'Chiêu của Lillia giờ tương tác đúng với Horizon Focus',
    },
    {
      id: 'pbe0806z-bugfix-cookingpot',
      category: 'mechanic',
      kind: 'mechanic',
      name: 'Sửa lỗi Cooking Pot cho nhiều máu hơn dự kiến',
    },
    {
      id: 'pbe0806z-bugfix-unrivaled',
      category: 'mechanic',
      kind: 'mechanic',
      name: 'Sửa lỗi Unrivaled trao nhiều lượt hạ gục hơn dự kiến',
    },
    {
      id: 'pbe0806z-bugfix-hustler',
      category: 'mechanic',
      kind: 'mechanic',
      name: 'Augment Hustler giờ chỉ cho vàng ở vòng đấu người',
    },
    {
      id: 'pbe0806z-bugfix-magicroll',
      category: 'mechanic',
      kind: 'mechanic',
      name: 'Sửa lỗi máu cộng thêm và roll kích cỡ của Magic Roll hoạt động sai',
    },
  ],
};

export default report;
