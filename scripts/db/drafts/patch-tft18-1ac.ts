// Draft bản vá PBE — nội dung/số liệu đã được duyệt trong
// Website/pbe-notes/Patch_TFT18.1ac-PBE-minor-balance-pass.md (Truexy tự ghi
// là bản vá cho ngày 8/11, đăng lúc 12:04 AM giờ hiển thị Aug 12, 2026, tiếp
// theo bản 18.1ab 10/08). File này chỉ chuyển nội dung đó thành PatchReport để
// áp vào DB (pnpm db:apply-patch) rồi pull ra patch-notes.generated.ts
// (pnpm db:pull).
import type { PatchReport } from '../../../src/content/patch-notes';

const report: PatchReport = {
  id: 'patch-tft18-1ac',
  version: 'PBE 11/08/2026 (18.1ac)',
  title: 'Minor pass, balance',
  author: 'Baron TFT (dịch)',
  source: {
    label: 'PBE — TheTruexy (dev PBE chính thức)',
    url: 'https://x.com/TheTruexy/status/2087223629058908343',
  },
  entitySet: 18,
  dateVi: '11/08/2026',
  summaryVi:
    'Bản vá nhỏ, tập trung vào các mục ít được chú ý hoặc từng bị nerf quá tay: buff loạt tướng rẻ tiền (Karma, Varus, Elise, Scuttlecrab, Warwick, Cassiopeia, Kha\'Zix, Krug, Raptor), nerf nhẹ Master Yi/Ancient Sentinel/Lux; buff nhiều Tinh Linh (Barrier, Giant Growth, Ironwood, Mana-Rich Soil, Phantom Emblem, Quicken); tái cân bằng cách stack Essence của Coven.',
  summaryOrigin: 'official',
  entries: [
    // ── Tướng — 1 vàng ──────────────────────────────────────────────
    {
      id: 'pbe0811ac-karma',
      category: 'champion',
      kind: 'buff',
      name: 'Karma',
      cost: 1,
      entityId: 'champion:tft18_karma',
      changes: [
        { label: 'Sát thương Tether', from: '260/390/585/995 AP', to: '280/420/630/1070 AP' },
        { label: 'Sát thương AoE', from: '110/165/250/420 AP', to: '120/180/270/460 AP' },
      ],
    },
    {
      id: 'pbe0811ac-varus',
      category: 'champion',
      kind: 'buff',
      name: 'Varus',
      cost: 1,
      entityId: 'champion:tft18_varus',
      changes: [{ label: 'Sát thương chiêu', from: '350/525/790/1340 AD', to: '350/525/840/1390 AD' }],
    },

    // ── Tướng — 2 vàng ──────────────────────────────────────────────
    {
      id: 'pbe0811ac-elise',
      category: 'champion',
      kind: 'buff',
      name: 'Elise',
      cost: 2,
      entityId: 'champion:tft18_elise',
      changes: [{ label: 'Hồi máu khi đánh thường', from: '55/85/160', to: '55/90/170' }],
    },
    {
      id: 'pbe0811ac-scuttlecrab',
      category: 'champion',
      kind: 'buff',
      name: 'Scuttlecrab',
      cost: 2,
      entityId: 'champion:tft18_scuttlecrab',
      changes: [{ label: 'Hồi máu khi Burrow', from: '300/375/625', to: '325/400/675' }],
    },
    {
      id: 'pbe0811ac-warwick',
      category: 'champion',
      kind: 'buff',
      name: 'Warwick',
      cost: 2,
      entityId: 'champion:tft18_warwick',
      changes: [{ label: 'Tốc Đánh khi tung chiêu', from: '20%', to: '25%' }],
    },

    // ── Tướng — 3 vàng ──────────────────────────────────────────────
    {
      id: 'pbe0811ac-cassiopeia',
      category: 'champion',
      kind: 'buff',
      name: 'Cassiopeia',
      cost: 3,
      entityId: 'champion:tft18_cassiopeia',
      changes: [{ label: 'Sát thương chiêu', from: '425/640/1020 AP', to: '440/660/1050 AP' }],
    },
    {
      id: 'pbe0811ac-masteryi',
      category: 'champion',
      kind: 'nerf',
      name: 'Master Yi',
      cost: 3,
      entityId: 'champion:tft18_masteryi',
      changes: [{ label: 'SMCK gốc (dạng AD)', from: '70', to: '67' }],
    },
    {
      // Dải số liệu có thêm 1 mốc (4 giá trị thay vì 3) — người dùng xác nhận
      // đây là chỉ số ở cấp 4 sao, không phải lỗi đọc ảnh.
      id: 'pbe0811ac-khazix',
      category: 'champion',
      kind: 'buff',
      name: "Kha'Zix",
      cost: 3,
      entityId: 'champion:tft18_khazix',
      changes: [
        { label: 'Sát thương chiêu', from: '240/360/540 AP', to: '260/370/550/935 AP' },
        { label: 'Sát thương khi cô lập (Isolation)', from: '290/435/650 AP', to: '310/445/660/1150 AP' },
      ],
    },
    {
      id: 'pbe0811ac-krug',
      category: 'champion',
      kind: 'buff',
      name: 'Krug',
      cost: 3,
      entityId: 'champion:tft18_krug',
      changes: [{ label: 'Máu tối đa cộng thêm theo chiêu', from: '175/225/325', to: '185/240/350' }],
    },
    {
      // Patch note gốc gọi "Mama Beak" — đây là biệt danh dùng trong caption
      // của Truexy cho Raptor, không phải tên trong codex. Đối chiếu qua icon
      // + cost khớp champion:tft18_raptor; hiển thị đúng tên codex "Raptor",
      // không hiện alias lên /patch (xem ghi chú project_set18_champion_patchnote_aliases).
      id: 'pbe0811ac-raptor',
      category: 'champion',
      kind: 'buff',
      name: 'Raptor',
      cost: 3,
      entityId: 'champion:tft18_raptor',
      changes: [{ label: 'Sát thương đòn phụ (mini)', from: '25/38/60 AD', to: '27/41/65 AD' }],
    },

    // ── Tướng — 4 vàng ──────────────────────────────────────────────
    {
      id: 'pbe0811ac-ancientsentinel',
      category: 'champion',
      kind: 'nerf',
      name: 'Ancient Sentinel',
      cost: 4,
      entityId: 'champion:tft18_ancientsentinel',
      changes: [{ label: 'Mana Reave', from: '15', to: '10' }],
    },

    // ── Tướng — 5 vàng ──────────────────────────────────────────────
    {
      id: 'pbe0811ac-lux',
      category: 'champion',
      kind: 'nerf',
      name: 'Lux',
      cost: 5,
      entityId: 'champion:tft18_lux',
      changes: [{ label: 'Giảm Kháng Phép (Coven)', from: '12', to: '8' }],
    },

    // ── Tộc hệ ──────────────────────────────────────────────────────
    {
      // Không phải buff/nerf đồng nhất — mốc breakpoint thấp giảm nhẹ, mốc
      // cao (Per Loss 80→60) giảm mạnh, trong khi Per Kill mốc thấp nhất lại
      // tăng. Đúng như caption: tái định hình cách stack essence (breakpoint
      // cao + losestreak, hoặc winstreak chậm hơn) chứ không đơn thuần buff/nerf.
      id: 'pbe0811ac-trait-coven',
      category: 'trait',
      kind: 'mechanic',
      name: 'Coven',
      entityId: 'trait:coven',
      changes: [
        { label: 'Essence mỗi lượt thua', from: '20/25/30/80', to: '18/25/32/60' },
        { label: 'Essence mỗi lượt giết', from: '1/2/3/10', to: '2/2/3/10' },
      ],
    },
    {
      id: 'pbe0811ac-trait-eclipse',
      category: 'trait',
      kind: 'buff',
      name: 'Eclipse',
      entityId: 'trait:eclipse',
      changes: [{ label: 'Hồi chiêu tia Beam', from: '4 giây', to: '3.5 giây' }],
    },
    {
      id: 'pbe0811ac-trait-elderwood',
      category: 'trait',
      kind: 'buff',
      name: 'Elderwood',
      entityId: 'trait:elderwood',
      breakpoint: '5',
      changes: [{ label: 'Máu cộng thêm (mốc 5)', from: '150', to: '200' }],
    },
    {
      id: 'pbe0811ac-trait-primal',
      category: 'trait',
      kind: 'buff',
      name: 'Primal',
      entityId: 'trait:primal',
      changes: [{ label: 'Tốc Đánh cộng thêm (đơn vị hệ Tiger)', from: '30%', to: '35%' }],
    },
    {
      id: 'pbe0811ac-trait-sprykin',
      category: 'trait',
      kind: 'buff',
      name: 'Sprykin',
      entityId: 'trait:sprykin',
      breakpoint: '5',
      changes: [
        { label: 'Máu cộng thêm (mốc 5)', from: '30%', to: '40%' },
        { label: 'Tốc Đánh cộng thêm (mốc 5)', from: '30%', to: '35%' },
      ],
    },

    // ── Nâng cấp (Augments) ─────────────────────────────────────────
    {
      // Augment này chưa có entity trong codex DB (set18_augments) — không tra
      // được entityId an toàn, không đoán slug. Chỉ lên patch report dạng
      // mechanic, không sync codex.
      id: 'pbe0811ac-aug-buildabud',
      category: 'augment',
      kind: 'mechanic',
      name: 'Build-a-Bud',
      changes: [{ label: 'Trạng thái', from: 'Đã tắt', to: 'Kích hoạt lại (re-enabled)' }],
    },
    {
      id: 'pbe0811ac-aug-heartofsteel',
      category: 'augment',
      kind: 'mechanic',
      name: 'Heart of Steel',
      entityId: 'augment:da_heartofsteel',
      changes: [
        {
          label: 'Sửa lỗi',
          from: 'Steadfast tích lũy trong suốt combat celebration phase',
          to: 'Steadfast chỉ tích lũy đến hết combat (đã sửa lỗi tích lũy quá thời gian)',
        },
      ],
    },

    // ── Linh Hỏa (Wisps) ────────────────────────────────────────────
    {
      id: 'pbe0811ac-wisp-barrier',
      category: 'wisp',
      kind: 'buff',
      name: 'Barrier',
      entityId: 'wisp:barrier',
      changes: [
        { label: 'Giá', from: '6g', to: '4g' },
        { label: 'Thời gian Khiên', from: '5 giây', to: '6 giây' },
        { label: 'Lượng Khiên', from: '1200', to: '1250' },
      ],
    },
    {
      id: 'pbe0811ac-wisp-giantgrowth',
      category: 'wisp',
      kind: 'buff',
      name: 'Giant Growth',
      entityId: 'wisp:giant-growth',
      changes: [{ label: 'Máu cộng thêm', from: '600', to: '700' }],
    },
    {
      id: 'pbe0811ac-wisp-homingfireflies',
      category: 'wisp',
      kind: 'nerf',
      name: 'Homing Fireflies',
      entityId: 'wisp:homing-fireflies',
      changes: [{ label: 'Sát thương', from: '125', to: '110' }],
    },
    {
      id: 'pbe0811ac-wisp-infliction',
      category: 'wisp',
      kind: 'nerf',
      name: 'Infliction',
      entityId: 'wisp:infliction',
      changes: [{ label: 'Tỉ lệ làm chậm', from: '30%', to: '20%' }],
    },
    {
      id: 'pbe0811ac-wisp-ironwood',
      category: 'wisp',
      kind: 'buff',
      name: 'Ironwood',
      entityId: 'wisp:ironwood',
      changes: [{ label: 'Giảm sát thương nhận', from: '10/14%', to: '12/18%' }],
    },
    {
      id: 'pbe0811ac-wisp-manarichsoil',
      category: 'wisp',
      kind: 'buff',
      name: 'Mana-Rich Soil',
      entityId: 'wisp:mana-rich-soil',
      changes: [{ label: 'Giảm Năng Lượng cần', from: '15%', to: '18%' }],
    },
    {
      id: 'pbe0811ac-wisp-phantomemblem',
      category: 'wisp',
      kind: 'buff',
      name: 'Phantom Emblem',
      entityId: 'wisp:phantom-emblem',
      changes: [{ label: 'Giá', from: '4/2 vàng', to: '3/1 vàng' }],
    },
    {
      id: 'pbe0811ac-wisp-quicken',
      category: 'wisp',
      kind: 'buff',
      name: 'Quicken',
      entityId: 'wisp:quicken',
      changes: [
        { label: 'Giá', from: '3g', to: '2g' },
        { label: 'Thời gian Tốc Đánh', from: '3/4 giây', to: '4/5 giây' },
      ],
    },
    {
      id: 'pbe0811ac-wisp-stealthy',
      category: 'wisp',
      kind: 'mechanic',
      name: 'Stealthy',
      entityId: 'wisp:stealthy',
      changes: [
        {
          label: 'Sửa lỗi',
          from: 'Bản nâng cấp Blossom không kiểm tra Sát Thủ/Đấu Sĩ đã lên đồ',
          to: 'Bản nâng cấp Blossom giờ cũng kiểm tra Sát Thủ/Đấu Sĩ đã lên đồ, giống bản gốc',
        },
      ],
    },

    // ── Sửa Lỗi (Bugfixes) ──────────────────────────────────────────
    {
      id: 'pbe0811ac-bugfix-prismaticdestiny',
      category: 'mechanic',
      kind: 'mechanic',
      name: 'Sửa lỗi Prismatic Destiny (augment) được chào mời thường xuyên hơn dự kiến',
    },
    {
      id: 'pbe0811ac-bugfix-dravenbountyhunter',
      category: 'mechanic',
      kind: 'mechanic',
      name: 'Draven không còn có thể cho tướng khác nhận đồ Tactician (Crown/Shield/Cape) qua Bounty Hunter',
    },
    {
      id: 'pbe0811ac-bugfix-phantomsplash',
      category: 'mechanic',
      kind: 'mechanic',
      name: 'Phantom Splash giờ hoạt động đúng với một số tộc hệ nhất định (vd Elderwood/Solar/Blackthorn)',
    },
    {
      id: 'pbe0811ac-bugfix-voidgauntlet',
      category: 'mechanic',
      kind: 'mechanic',
      name: 'Void Gauntlet không còn gây hòa (draw) khi gây sát thương lúc người mang là đơn vị sống sót cuối cùng',
    },
    {
      id: 'pbe0811ac-bugfix-khazixravager',
      category: 'mechanic',
      kind: 'mechanic',
      name: "Kha'Zix giờ pop đúng Ravager Emblem khi evolve Ravager trong lúc đang mang emblem đó",
    },
    {
      id: 'pbe0811ac-bugfix-ahriorb',
      category: 'mechanic',
      kind: 'mechanic',
      name: 'Sửa lỗi quả cầu của Ahri bị kẹt bật qua lại và chững giữa 2 mục tiêu cách đều (thường gặp nhất ở 2 đơn vị góc sau đối diện)',
    },
  ],
};

export default report;
