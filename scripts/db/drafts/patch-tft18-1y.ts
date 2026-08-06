// Draft bản vá PBE 05/08/2026 ("TheTruexy Patch Notes — Moderate pass on balance").
// Nội dung/số liệu đã được duyệt trong
// Website/pbe-notes/Patch_TFT18.1y-PBE-moderate-balance-pass.md — file này chỉ
// chuyển nội dung đó thành PatchReport để áp vào DB (pnpm db:apply-patch) rồi
// pull ra patch-notes.generated.ts (pnpm db:pull). Bản này ra SAU bản 18.1x
// (04/08) và SAU bản patch-pbe-2026-08-06 (ngày chính thức đã xác nhận lại là
// 03/08, không phải 06/08) — là bản MỚI NHẤT trong 3 bản PBE, tách biệt,
// không bản nào là bổ sung cho bản khác. Tên file/version dùng số tạm "18.1y"
// vì Liquipedia chưa công bố số patch chính thức.
//
// Cassiopeia: ảnh gốc ghi mốc sát thương thứ 3 là "96" (khác định dạng 3 chữ
// số các mốc còn lại) — đã đối chiếu và xác nhận là lỗi đánh máy của "960",
// dùng 960 ở đây theo đúng ghi chú trong file .md gốc.
import type { PatchReport } from '../../../src/content/patch-notes';

const report: PatchReport = {
  id: 'patch-tft18-1y',
  version: 'PBE 05/08/2026 (18.1y)',
  title: 'Cập nhật PBE 05/08/2026 — Moderate balance pass',
  author: 'Baron TFT (dịch)',
  source: {
    label: 'PBE — TheTruexy (dev PBE chính thức)',
    url: 'https://x.com/TheTruexy/status/2085154566526693831',
  },
  entitySet: 18,
  dateVi: '05/08/2026',
  summaryVi:
    'Bản vá vừa, khớp lại XP lên cấp với bản Live, đẩy mạnh loạt tướng bậc 1-4 (Akali, Cinderling, Yunara, Cassiopeia, Nidalee...), siết Kennen/Taric/Ivern bậc 5, và chỉnh lại breakpoint Coven.',
  summaryOrigin: 'official',
  entries: [
    // ── Hệ thống ────────────────────────────────────────────────────
    {
      id: 'pbe0805-mechanic-levelxp',
      category: 'mechanic',
      kind: 'mechanic',
      name: 'Kinh nghiệm lên cấp (khớp lại với bản Live)',
      changes: [
        { label: 'Lên cấp 8', from: '56 XP', to: '60 XP' },
        { label: 'Lên cấp 9', from: '64 XP', to: '68 XP' },
      ],
    },

    // ── Tướng — 1 vàng ──────────────────────────────────────────────
    {
      id: 'pbe0805-akali',
      category: 'champion',
      kind: 'buff',
      name: 'Akali',
      cost: 1,
      entityId: 'champion:tft18_akali',
      changes: [
        { label: 'Dạng SMCK — Sát thương chiêu', from: '130/195/295', to: '145/220/325' },
        { label: 'Dạng SMCK — Sát thương cộng thêm', from: '30/45/68', to: '35/52/80' },
      ],
    },
    {
      id: 'pbe0805-cinderling',
      category: 'champion',
      kind: 'buff',
      name: 'Cinderling',
      cost: 1,
      entityId: 'champion:tft18_cinderling',
      changes: [{ label: 'Sát thương chiêu', from: '270/405/610', to: '340/510/765' }],
    },
    {
      id: 'pbe0805-pebbles',
      category: 'champion',
      kind: 'buff',
      name: 'Pebbles',
      cost: 1,
      entityId: 'champion:tft18_pebbles',
      changes: [{ label: 'Sát thương mỗi giây', from: '150/225/340', to: '160/240/360' }],
    },
    {
      id: 'pbe0805-yorick',
      category: 'champion',
      kind: 'buff',
      name: 'Yorick',
      cost: 1,
      entityId: 'champion:tft18_yorick',
      changes: [
        { label: 'Hồi máu', from: '280/325/410', to: '280/325/435' },
        { label: 'Máu cơ bản hồn ma', from: '200/400/700', to: '200/400/750' },
      ],
    },

    // ── Tướng — 2 vàng ──────────────────────────────────────────────
    {
      id: 'pbe0805-scuttlecrab',
      category: 'champion',
      kind: 'buff',
      name: 'Scuttlecrab',
      cost: 2,
      entityId: 'champion:tft18_scuttlecrab',
      changes: [{ label: 'Hồi máu', from: '250/325/525/725', to: '300/375/575/775' }],
    },
    {
      id: 'pbe0805-yunara',
      category: 'champion',
      kind: 'buff',
      name: 'Yunara',
      cost: 2,
      entityId: 'champion:tft18_yunara',
      changes: [{ label: 'Sát thương chiêu chính', from: '170/255/400/680', to: '170/255/450/730' }],
    },

    // ── Tướng — 3 vàng ──────────────────────────────────────────────
    {
      id: 'pbe0805-cassiopeia',
      category: 'champion',
      kind: 'buff',
      name: 'Cassiopeia',
      cost: 3,
      entityId: 'champion:tft18_cassiopeia',
      note: 'đã đối chiếu số "96" trong ảnh gốc → 960',
      changes: [{ label: 'Sát thương chiêu', from: '400/600/960/1530', to: '425/640/1020/1625' }],
    },
    {
      id: 'pbe0805-razorbeak',
      category: 'champion',
      kind: 'buff',
      name: 'Razorbeak',
      cost: 3,
      changes: [{ label: 'Sát thương mỗi đòn (đòn nhỏ)', from: '25/38/60/95', to: '27/41/65/105' }],
    },

    // ── Tướng — 4 vàng ──────────────────────────────────────────────
    {
      id: 'pbe0805-ezreal',
      category: 'champion',
      kind: 'mechanic',
      name: 'Ezreal',
      cost: 4,
      entityId: 'champion:tft18_ezreal',
      changes: [{ label: 'Logic né trước khi tung chiêu', from: 'Cơ bản', to: 'Cải thiện, né an toàn hơn' }],
    },
    {
      id: 'pbe0805-nidalee',
      category: 'champion',
      kind: 'buff',
      name: 'Nidalee',
      cost: 4,
      entityId: 'champion:tft18_nidalee',
      changes: [
        { label: 'Dạng SMCK — Kháng chống chịu', from: '60', to: '65' },
        { label: 'Dạng SMCK — Hồi máu', from: '275/400', to: '300/450' },
        { label: 'Dạng SMPT — Sát thương đòn tăng cường', from: '160/240', to: '170/255' },
        { label: 'Dạng SMPT — Sát thương đòn đánh thứ 3', from: '300/450', to: '320/480' },
      ],
    },
    {
      id: 'pbe0805-sivir',
      category: 'champion',
      kind: 'buff',
      name: 'Sivir',
      cost: 4,
      entityId: 'champion:tft18_sivir',
      changes: [{ label: 'Sát thương chiêu', from: '165/250', to: '180/270' }],
    },

    // ── Tướng — 5 vàng ──────────────────────────────────────────────
    {
      id: 'pbe0805-kennen',
      category: 'champion',
      kind: 'nerf',
      name: 'Kennen',
      cost: 5,
      entityId: 'champion:tft18_kennen',
      changes: [
        { label: 'Tốc đánh', from: '0.9', to: '0.85' },
        { label: 'Sát thương chiêu (theo SMPT)', from: '550/825', to: '525/785' },
      ],
    },
    {
      id: 'pbe0805-taric',
      category: 'champion',
      kind: 'nerf',
      name: 'Taric',
      cost: 5,
      entityId: 'champion:tft18_taric',
      changes: [
        { label: 'Khiên nội tại', from: '200/400 + 12% máu tối đa', to: '175/350 + 10% máu tối đa' },
        { label: 'Hồi máu (theo SMPT)', from: '225/325', to: '200/300' },
      ],
    },
    {
      id: 'pbe0805-ivern',
      category: 'champion',
      kind: 'nerf',
      name: 'Ivern',
      cost: 5,
      entityId: 'champion:tft18_ivern',
      changes: [{ label: 'Khiên (theo SMPT)', from: '165/325', to: '150/275' }],
    },

    // ── Tộc hệ ──────────────────────────────────────────────────────
    {
      id: 'pbe0805-trait-adaptor',
      category: 'trait',
      kind: 'buff',
      name: 'Adaptor',
      entityId: 'trait:adaptor',
      changes: [{ label: 'SMCK hoặc Sức mạnh phép cộng thêm', from: '20/30/50%', to: '25/35/55%' }],
    },
    {
      id: 'pbe0805-trait-blossom',
      category: 'trait',
      kind: 'nerf',
      name: 'Blossom',
      entityId: 'trait:blossom',
      changes: [{ label: 'Máu cộng thêm', from: '12%', to: '10%' }],
    },
    {
      id: 'pbe0805-trait-coven',
      category: 'trait',
      kind: 'buff',
      name: 'Coven',
      entityId: 'trait:coven',
      changes: [
        { label: 'Mốc 3', from: '140', to: '130' },
        { label: 'Mốc 4', from: '200', to: '185' },
        { label: 'Mốc 5', from: '275', to: '250' },
        { label: 'Mốc 6', from: '375', to: '365' },
      ],
    },
    {
      id: 'pbe0805-trait-riftbeast',
      category: 'trait',
      kind: 'buff',
      name: 'Riftbeast',
      entityId: 'trait:riftbeast',
      breakpoint: '7',
      changes: [{ label: 'Giáp / Kháng phép', from: '3', to: '5' }],
    },
    {
      id: 'pbe0805-trait-solar',
      category: 'trait',
      kind: 'nerf',
      name: 'Solar',
      entityId: 'trait:solar',
      breakpoint: '3',
      changes: [{ label: 'Tốc đánh cộng thêm (mốc 3)', from: '25%', to: '18%' }],
    },

    // ── Nâng cấp ────────────────────────────────────────────────────
    {
      id: 'pbe0805-aug-calltochaos',
      category: 'augment',
      kind: 'nerf',
      name: 'Call to Chaos',
      changes: [{ label: 'Số đe trang bị thành phần trong trứng thưởng ban đầu', from: '2', to: '1' }],
    },
    {
      id: 'pbe0805-aug-junglepathing',
      category: 'augment',
      kind: 'mechanic',
      name: 'Jungle Pathing',
      entityId: 'augment:da_18_riftbeasttraitaugmentstampede',
      changes: [{ label: 'Trạng thái', from: 'Có trong hồ', to: 'Đã gỡ bỏ' }],
    },
    {
      id: 'pbe0805-aug-patienceisavirtue',
      category: 'augment',
      kind: 'nerf',
      name: 'Patience is a Virtue',
      note: 'khớp lại với bản Live',
      changes: [
        { label: 'Số lượt reroll mỗi turn', from: '2', to: '1' },
        { label: 'Số lượt reroll ban đầu', from: '0', to: '4' },
      ],
    },
    {
      id: 'pbe0805-aug-nestingdolls',
      category: 'augment',
      kind: 'buff',
      name: 'Nesting Dolls',
      entityId: 'augment:da_nestingdolls',
      changes: [
        { label: 'Xuất hiện ở vòng 2-1', from: 'Có', to: 'Đã gỡ bỏ' },
        { label: 'Máu lính triệu hồi', from: '50%', to: '70%' },
      ],
    },
    {
      id: 'pbe0805-aug-sunandmoonplus',
      category: 'augment',
      kind: 'nerf',
      name: 'Sun and Moon +',
      entityId: 'augment:da_18_lunartraitaugmentplus',
      changes: [{ label: 'Leona tặng kèm', from: '2 sao', to: '1 sao' }],
    },

    // ── Linh Hỏa (Wisps) ────────────────────────────────────────────
    {
      id: 'pbe0805-wisp-animateshop',
      category: 'wisp',
      kind: 'nerf',
      name: 'Animate Shop',
      entityId: 'wisp:animate-shop',
      changes: [{ label: 'Thời lượng', from: '20/30s', to: '18/26s' }],
    },
    {
      id: 'pbe0805-wisp-barkarmor',
      category: 'wisp',
      kind: 'nerf',
      name: 'Bark Armor',
      entityId: 'wisp:bark-armor',
      changes: [
        { label: 'Giá', from: '1g', to: '0g' },
        { label: 'Điều kiện đề xuất', from: 'Không giới hạn', to: 'Chỉ khi đang thắng streak 1+' },
      ],
    },
    {
      id: 'pbe0805-wisp-barter',
      category: 'wisp',
      kind: 'nerf',
      name: 'Barter',
      entityId: 'wisp:barter',
      changes: [{ label: 'Giá', from: '1g', to: '2g' }],
    },
    {
      id: 'pbe0805-wisp-componentbounty',
      category: 'wisp',
      kind: 'nerf',
      name: 'Component Bounty',
      entityId: 'wisp:component-bounty',
      changes: [{ label: 'Phần thưởng', from: 'Đe trang bị thành phần', to: 'Trang bị thành phần ngẫu nhiên' }],
    },
    {
      id: 'pbe0805-wisp-doodadbag',
      category: 'wisp',
      kind: 'buff',
      name: 'Doodad Bag',
      entityId: 'wisp:doodad-bag',
      changes: [{ label: 'Giá', from: '2g', to: '1g' }],
    },
    {
      id: 'pbe0805-wisp-doodadjar',
      category: 'wisp',
      kind: 'buff',
      name: 'Doodad Jar',
      entityId: 'wisp:doodad-jar',
      changes: [
        { label: 'Giá', from: '1g', to: '0g' },
        { label: 'Số lượng Bảo Bối (nâng cấp)', from: '1', to: '2' },
      ],
    },
    {
      id: 'pbe0805-wisp-foundfriend',
      category: 'wisp',
      kind: 'buff',
      name: 'Found Friend',
      entityId: 'wisp:found-friend',
      changes: [
        { label: 'Giá', from: '1g', to: '0g' },
        { label: 'Điều kiện đề xuất', from: 'Không giới hạn', to: 'Chỉ khi đang thắng streak 1+' },
      ],
    },
    {
      id: 'pbe0805-wisp-goldengoose',
      category: 'wisp',
      kind: 'nerf',
      name: 'Golden Goose',
      entityId: 'wisp:golden-goose',
      changes: [{ label: 'Sát thương mỗi 1 vàng', from: '1500/900', to: '1700/1000' }],
    },
    {
      id: 'pbe0805-wisp-knickknackbag',
      category: 'wisp',
      kind: 'buff',
      name: 'Knick-Knack Bag',
      entityId: 'wisp:knick-knack-bag',
      changes: [{ label: 'Giá', from: '2g', to: '1g' }],
    },
    {
      id: 'pbe0805-wisp-knickknackjar',
      category: 'wisp',
      kind: 'buff',
      name: 'Knick-Knack Jar',
      entityId: 'wisp:knick-knack-jar',
      changes: [
        { label: 'Giá', from: '1g', to: '0g' },
        { label: 'Số lượng đồ lỉnh kỉnh (nâng cấp)', from: '1', to: '2' },
      ],
    },
    {
      id: 'pbe0805-wisp-lifedebt',
      category: 'wisp',
      kind: 'nerf',
      name: 'Life Debt',
      entityId: 'wisp:life-debt',
      changes: [{ label: 'Máu thiếu mỗi 1 vàng', from: '10', to: '12' }],
    },
    {
      id: 'pbe0805-wisp-majorgambit',
      category: 'wisp',
      kind: 'nerf',
      name: 'Major Gambit',
      entityId: 'wisp:major-gambit',
      changes: [{ label: 'Vàng khi thắng', from: '10/12', to: '8/10' }],
    },
    {
      id: 'pbe0805-wisp-majorpolymorph',
      category: 'wisp',
      kind: 'buff',
      name: 'Major Polymorph',
      entityId: 'wisp:major-polymorph',
      changes: [{ label: 'Giá', from: '1g', to: '0g' }],
    },
    {
      id: 'pbe0805-wisp-minorpolymorph',
      category: 'wisp',
      kind: 'buff',
      name: 'Minor Polymorph',
      entityId: 'wisp:minor-polymorph',
      changes: [{ label: 'Giá', from: '1g', to: '0g' }],
    },
    {
      id: 'pbe0805-wisp-polymorph',
      category: 'wisp',
      kind: 'buff',
      name: 'Polymorph',
      entityId: 'wisp:polymorph',
      changes: [{ label: 'Giá', from: '1g', to: '0g' }],
    },
    {
      id: 'pbe0805-wisp-salvager',
      category: 'wisp',
      kind: 'mechanic',
      name: 'Salvager',
      entityId: 'wisp:salvager',
      changes: [{ label: 'Điều kiện đề xuất cùng lúc', from: 'Không giới hạn', to: 'Không đề xuất cùng No Scout No Pivot' }],
    },
    {
      id: 'pbe0805-wisp-thingamajigbag',
      category: 'wisp',
      kind: 'buff',
      name: 'Thingamajig Bag',
      entityId: 'wisp:thingamajig-bag',
      changes: [{ label: 'Giá', from: '2g', to: '1g' }],
    },
    {
      id: 'pbe0805-wisp-thingamajigjar',
      category: 'wisp',
      kind: 'buff',
      name: 'Thingamajig Jar',
      entityId: 'wisp:thingamajig-jar',
      changes: [
        { label: 'Giá', from: '1g', to: '0g' },
        { label: 'Số lượng đồ vặt vãnh (nâng cấp)', from: '1', to: '2' },
      ],
    },
  ],
};

export default report;
