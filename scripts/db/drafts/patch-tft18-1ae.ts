// Draft bản vá PBE — nội dung/số liệu đã được duyệt trong
// Website/pbe-notes/Patch_TFT18.1ae-PBE-big-balance-pass.md (Truexy tự ghi là
// bản vá cho ngày 8/14, đăng lúc 2:10 AM giờ hiển thị Aug 15, 2026, tiếp theo
// bản 18.1ad 12/08 — không có bản vá ngày 13/08). File này chỉ chuyển nội
// dung đó thành PatchReport để áp vào DB (pnpm db:apply-patch) rồi pull ra
// patch-notes.generated.ts (pnpm db:pull).
//
// Tên tiếng Việt chính, tên gốc phụ trong ngoặc: champion/trait/wisp/augment
// có entityId thì /patch tự tra nameVi qua entity-index (không cần sửa
// `name`). Mechanic (bugfix) KHÔNG có cơ chế tra tự động — PatchBoard hiện
// `name` y nguyên — nên category này viết sẵn "<Tiếng Việt> (<Tên gốc>)".
// Augment "Build a Bud" không tồn tại trong set18-entity-index.ts/DB codex —
// người dùng xác nhận đây là augment hoàn toàn mới của patch này và sẽ bổ
// sung thông tin/bản dịch sau; entry ở đây giữ tên gốc tiếng Anh, không có
// entityId, không đoán bản dịch.
import type { PatchReport } from '../../../src/content/patch-notes';

const report: PatchReport = {
  id: 'patch-tft18-1ae',
  version: 'PBE 14/08/2026 (18.1ae)',
  title: 'Big balance pass',
  author: 'Baron TFT (dịch)',
  source: {
    label: 'PBE — TheTruexy (dev PBE chính thức)',
    url: 'https://x.com/TheTruexy/status/2088342541288755224',
  },
  entitySet: 18,
  dateVi: '14/08/2026',
  summaryVi:
    'Bản vá lớn, Truexy dự kiến chỉ còn 1-2 đợt nữa trước khi khoá bản đầu tiên. Mục tiêu giảm độ phân cực ở vài dây reroll được Wisp tempo đẩy mạnh. Nerf loạt 1-3 vàng đang mạnh (Akali, Rakan, Teemo, Warwick, Yunara, Azir, Master Yi, Tristana), buff nhiều 4-5 vàng và tộc hệ hỗ trợ (Aphelios đổi hẳn hướng build sang Rageblade, Elderwood, Riftbeast, Blackthorn, Defender). Nerf mạnh augment The Tower và Adaptor, Executioner, Primal, Component Quest, Double Trouble, It\'s Me Baby, Small Furry Friend, 2 Wisp Radiantize/Solar Gift; buff Trait Ladder, Verticality III, Bronze For Life, Nesting Dolls, Shopping Spree, Flame On!, Fourcing, và augment mới Build a Bud. Kèm 10 bugfix, trong đó có lỗi "Rengar Blackthorn" (Blackthorn cấp Damage Amp sai + sacrifice value cập nhật trễ) và Lux đổi hình dạng sai giữa combat.',
  summaryOrigin: 'official',
  entries: [
    // ── Tướng 1 vàng ──────────────────────────────────────────────
    {
      id: 'pbe0814ae-champ-akali',
      category: 'champion',
      kind: 'nerf',
      name: 'Akali',
      entityId: 'champion:tft18_akali',
      changes: [{ label: 'AP Form — Sát thương chiêu', from: '155/235/385/650 AP', to: '140/210/340/585 AP' }],
    },
    {
      id: 'pbe0814ae-champ-camille',
      category: 'champion',
      kind: 'buff',
      name: 'Camille',
      entityId: 'champion:tft18_camille',
      changes: [{ label: 'Khiên', from: '60/85/160', to: '60/90/200' }],
    },
    {
      id: 'pbe0814ae-champ-kobuko',
      category: 'champion',
      kind: 'buff',
      name: 'Kobuko',
      entityId: 'champion:tft18_kobuko',
      changes: [{ label: 'Hồi máu', from: '265/315/435', to: '265/315/460' }],
    },
    {
      id: 'pbe0814ae-champ-rakan',
      category: 'champion',
      kind: 'nerf',
      name: 'Rakan',
      entityId: 'champion:tft18_rakan',
      changes: [
        { label: 'Mana', from: '20/90', to: '35/105' },
        { label: 'Khiên', from: '250/300/375 AP', to: '270/320/415 AP' },
      ],
    },
    {
      id: 'pbe0814ae-champ-varus',
      category: 'champion',
      kind: 'buff',
      name: 'Varus',
      entityId: 'champion:tft18_varus',
      changes: [{ label: 'Sát thương chiêu', from: '350/525/840 AD', to: '385/580/925 AD' }],
    },

    // ── Tướng 2 vàng ──────────────────────────────────────────────
    {
      id: 'pbe0814ae-champ-teemo',
      category: 'champion',
      kind: 'nerf',
      name: 'Teemo',
      entityId: 'champion:tft18_teemo',
      changes: [{ label: 'Sát thương Nấm Lớn', from: '150/225/350 AP', to: '135/200/310 AP' }],
    },
    {
      id: 'pbe0814ae-champ-warwick',
      category: 'champion',
      kind: 'nerf',
      name: 'Warwick',
      entityId: 'champion:tft18_warwick',
      changes: [{ label: 'Tốc Đánh cộng dồn khi tung chiêu', from: '25%', to: '20%' }],
    },
    {
      id: 'pbe0814ae-champ-yunara',
      category: 'champion',
      kind: 'nerf',
      name: 'Yunara',
      entityId: 'champion:tft18_yunara',
      changes: [{ label: 'Sát thương chiêu', from: '170/255/415 AD', to: '155/230/350 AD' }],
    },

    // ── Tướng 3 vàng ──────────────────────────────────────────────
    {
      id: 'pbe0814ae-champ-azir',
      category: 'champion',
      kind: 'nerf',
      name: 'Azir',
      entityId: 'champion:tft18_azir',
      changes: [{ label: 'Sát thương chiêu', from: '50/75/120 AP', to: '46/69/110 AP' }],
    },
    {
      id: 'pbe0814ae-champ-masteryi',
      category: 'champion',
      kind: 'nerf',
      name: 'Master Yi',
      entityId: 'champion:tft18_masteryi',
      changes: [
        { label: 'AD Form — Sát thương vật lý cộng thêm', from: '67', to: '65' },
        { label: 'AP Form — Sát thương phép mỗi đòn đánh', from: '145/220/350 AP', to: '140/210/335 AP' },
      ],
    },
    {
      // Truexy gọi tướng này là "Mama Beak" trong caption — codex Set 18 dùng
      // tên Raptor, xem [[project_set18_champion_patchnote_aliases]]. Không
      // hiện alias lên /patch, chỉ đối chiếu nội bộ.
      id: 'pbe0814ae-champ-raptor',
      category: 'champion',
      kind: 'buff',
      name: 'Raptor',
      entityId: 'champion:tft18_raptor',
      changes: [{ label: 'Mana', from: '30/70', to: '20/60' }],
    },
    {
      id: 'pbe0814ae-champ-khazix',
      category: 'champion',
      kind: 'buff',
      name: "Kha'Zix",
      entityId: 'champion:tft18_khazix',
      changes: [{ label: 'Tốc Đánh', from: '0.8', to: '0.85' }],
    },
    {
      id: 'pbe0814ae-champ-tristana',
      category: 'champion',
      kind: 'nerf',
      name: 'Tristana',
      entityId: 'champion:tft18_tristana',
      changes: [{ label: 'Sát thương chiêu nền', from: '200/300/480 AD', to: '160/240/385 AD' }],
    },

    // ── Tướng 4 vàng ──────────────────────────────────────────────
    {
      id: 'pbe0814ae-champ-aphelios',
      category: 'champion',
      kind: 'buff',
      name: 'Aphelios',
      entityId: 'champion:tft18_aphelios',
      note: 'Đổi hướng build sang Rageblade — càng nhiều Tốc Đánh càng lợi',
      changes: [
        { label: 'Số lần vung vũ khí cơ bản', from: '6', to: '5' },
        { label: 'Tốc Đánh cộng thêm cần để +1 lần vung', from: '35%', to: '20%' },
      ],
    },
    {
      id: 'pbe0814ae-champ-ezreal',
      category: 'champion',
      kind: 'buff',
      name: 'Ezreal',
      entityId: 'champion:tft18_ezreal',
      changes: [{ label: 'Sát thương đòn đánh nhỏ', from: '225/340 AD', to: '235/355 AD' }],
    },
    {
      id: 'pbe0814ae-champ-sivir',
      category: 'champion',
      kind: 'buff',
      name: 'Sivir',
      entityId: 'champion:tft18_sivir',
      changes: [{ label: 'Sát thương chiêu', from: '180/270 AD', to: '190/285 AD' }],
    },
    {
      id: 'pbe0814ae-champ-zyra',
      category: 'champion',
      kind: 'buff',
      name: 'Zyra',
      entityId: 'champion:tft18_zyra',
      changes: [{ label: 'Sát thương chiêu', from: '35/52 AP', to: '37/55 AP' }],
    },
    {
      id: 'pbe0814ae-champ-lillia',
      category: 'champion',
      kind: 'buff',
      name: 'Lillia',
      entityId: 'champion:tft18_lillia',
      changes: [{ label: 'Hồi máu', from: '280/360 AP', to: '300/400 AP' }],
    },

    // ── Tướng 5 vàng ──────────────────────────────────────────────
    {
      id: 'pbe0814ae-champ-alune',
      category: 'champion',
      kind: 'buff',
      name: 'Alune',
      entityId: 'champion:tft18_alune',
      changes: [{ label: 'Sát thương Ánh Trăng', from: '2200/3400 AP', to: '2350/3600 AP' }],
    },
    {
      id: 'pbe0814ae-champ-elderdragon',
      category: 'champion',
      kind: 'buff',
      name: 'The Elder Dragon',
      entityId: 'champion:tft18_elderdragon',
      changes: [{ label: 'Sát thương chiêu', from: '250/375 AD', to: '265/400 AD' }],
    },

    // ── Tộc hệ ──────────────────────────────────────────────────────
    {
      id: 'pbe0814ae-trait-adaptor',
      category: 'trait',
      kind: 'nerf',
      name: 'Adaptor',
      entityId: 'trait:adaptor',
      changes: [{ label: 'AD/AP', from: '20/30/55%', to: '20/30/50%' }],
    },
    {
      id: 'pbe0814ae-trait-blackthorn',
      category: 'trait',
      kind: 'buff',
      name: 'Blackthorn',
      entityId: 'trait:eldritch',
      changes: [
        { label: '4 mốc — Hiệu ứng khuếch đại', from: '25%', to: '30%' },
        { label: '6 mốc — Hiệu ứng khuếch đại', from: '50%', to: '60%' },
        { label: '6 mốc — Máu toàn đội', from: '500', to: '550' },
      ],
    },
    {
      id: 'pbe0814ae-trait-defender',
      category: 'trait',
      kind: 'buff',
      name: 'Defender',
      entityId: 'trait:defender',
      changes: [{ label: 'Kháng (Giáp/Kháng Phép)', from: '25/55/110', to: '25/60/120' }],
    },
    {
      id: 'pbe0814ae-trait-elderwood',
      category: 'trait',
      kind: 'buff',
      name: 'Elderwood',
      entityId: 'trait:elderwood',
      changes: [{ label: 'Protector — Tỉ lệ hồi máu khi Cuồng Nộ', from: '10%', to: '12%' }],
    },
    {
      id: 'pbe0814ae-trait-executioner',
      category: 'trait',
      kind: 'nerf',
      name: 'Executioner',
      entityId: 'trait:executioner',
      breakpoint: '4',
      changes: [{ label: 'Chảy máu cộng thêm', from: '50%', to: '40%' }],
    },
    {
      id: 'pbe0814ae-trait-invoker',
      category: 'trait',
      kind: 'buff',
      name: 'Invoker',
      entityId: 'trait:invoker',
      changes: [{ label: 'Hồi Mana ích kỷ', from: '2/3/5/8', to: '3/4/6/9' }],
    },
    {
      id: 'pbe0814ae-trait-primal',
      category: 'trait',
      kind: 'nerf',
      name: 'Primal',
      entityId: 'trait:primal',
      changes: [
        { label: 'Phoenix — Số lần hạ gục mỗi trang bị', from: '14', to: '15' },
        { label: 'Bear — Ngưỡng Máu xử tử', from: '15%', to: '12%' },
      ],
    },
    {
      id: 'pbe0814ae-trait-riftbeast',
      category: 'trait',
      kind: 'buff',
      name: 'Riftbeast',
      entityId: 'trait:riftbeast',
      breakpoint: '7',
      changes: [{ label: 'AD/AP/Tốc Đánh cộng thêm', from: '5%', to: '6%' }],
    },

    // ── Tinh Linh (Wisp) ──────────────────────────────────────────
    {
      id: 'pbe0814ae-wisp-radiantize',
      category: 'wisp',
      kind: 'nerf',
      name: 'Radiantize',
      entityId: 'wisp:radiantize',
      changes: [{ label: 'Độ trễ nâng cấp', from: '10/7 giây', to: '8/5 giây' }],
    },
    {
      id: 'pbe0814ae-wisp-solargift',
      category: 'wisp',
      kind: 'nerf',
      name: 'Solar Gift',
      entityId: 'wisp:solar-gift',
      changes: [{ label: 'Giá', from: '5/2 vàng', to: '6/4 vàng' }],
    },

    // ── Nâng Cấp (Augment) ────────────────────────────────────────
    {
      // Augment hoàn toàn mới — đã insert placeholder vào set18_augments
      // (rarity/category là đoán, cần người dùng xác nhận lại + bổ sung icon
      // thật, xem apply-pbe-balance-tft18-1ae.ts).
      id: 'pbe0814ae-augment-buildabud',
      category: 'augment',
      kind: 'buff',
      name: 'Build a Bud',
      entityId: 'augment:da_18_buildabud',
      note: 'Augment mới',
      changes: [{ label: 'Vàng khởi đầu', from: '3 vàng', to: '6 vàng' }],
    },
    {
      id: 'pbe0814ae-augment-bronzeforlifei',
      category: 'augment',
      kind: 'buff',
      name: 'Bronze For Life I',
      entityId: 'augment:da_bronzeforlifei',
      changes: [{ label: 'Khuếch Đại Sát Thương mỗi tộc/hệ bậc Đồng', from: '2%', to: '2.5%' }],
    },
    {
      id: 'pbe0814ae-augment-bronzeforlifeii',
      category: 'augment',
      kind: 'buff',
      name: 'Bronze For Life II',
      entityId: 'augment:da_bronzeforlifeii',
      changes: [{ label: 'Khuếch Đại Sát Thương mỗi tộc/hệ bậc Đồng', from: '2%', to: '2.5%' }],
    },
    {
      id: 'pbe0814ae-augment-componentquest',
      category: 'augment',
      kind: 'nerf',
      name: 'Component Quest',
      entityId: 'augment:da_componentquest',
      changes: [{ label: 'Vàng thưởng', from: '8', to: '5' }],
    },
    {
      id: 'pbe0814ae-augment-doubletrouble',
      category: 'augment',
      kind: 'nerf',
      name: 'Double Trouble',
      entityId: 'augment:da_doubletrouble',
      changes: [
        { label: 'AD/AP', from: '30%', to: '25%' },
        { label: 'Kháng', from: '30%', to: '25%' },
      ],
    },
    {
      id: 'pbe0814ae-augment-flameon',
      category: 'augment',
      kind: 'buff',
      name: 'Flame On!',
      entityId: 'augment:da_18_infernotraitaugment',
      changes: [{ label: 'Tốc Đánh', from: '40%', to: '55%' }],
    },
    {
      id: 'pbe0814ae-augment-fourcing',
      category: 'augment',
      kind: 'buff',
      name: 'FOURcing',
      entityId: 'augment:da_18_fourcing',
      changes: [{ label: 'Máu mỗi trang bị', from: '95', to: '120' }],
    },
    {
      id: 'pbe0814ae-augment-itsmebaby',
      category: 'augment',
      kind: 'nerf',
      name: "It's Me, Baby",
      entityId: 'augment:da_itsmebaby',
      changes: [{ label: 'Số lần hạ gục cần cho mỗi vàng', from: '4', to: '5' }],
    },
    {
      id: 'pbe0814ae-augment-nestingdolls',
      category: 'augment',
      kind: 'buff',
      name: 'Nesting Dolls',
      entityId: 'augment:da_nestingdolls',
      changes: [{ label: 'Máu bản sao', from: '50%', to: '60%' }],
    },
    {
      id: 'pbe0814ae-augment-nestingdollsplus',
      category: 'augment',
      kind: 'buff',
      name: 'Nesting Dolls+',
      entityId: 'augment:da_nestingdollsplus',
      changes: [{ label: 'Máu bản sao', from: '50%', to: '60%' }],
    },
    {
      id: 'pbe0814ae-augment-nestingdollsplusplus',
      category: 'augment',
      kind: 'buff',
      name: 'Nesting Dolls++',
      entityId: 'augment:da_nestingdollsplusplus',
      changes: [{ label: 'Máu bản sao', from: '50%', to: '60%' }],
    },
    {
      id: 'pbe0814ae-augment-shoppingspree',
      category: 'augment',
      kind: 'buff',
      name: 'Shopping Spree',
      entityId: 'augment:da_shoppingspree',
      changes: [{ label: 'Vàng khởi đầu', from: '2', to: '6' }],
    },
    {
      id: 'pbe0814ae-augment-smallfurryfriend',
      category: 'augment',
      kind: 'nerf',
      name: 'Small Furry Friend',
      entityId: 'augment:da_smallfurryfriend',
      changes: [{ label: 'Hiệu quả', from: '50%', to: '35%' }],
    },
    {
      id: 'pbe0814ae-augment-thetower',
      category: 'augment',
      kind: 'nerf',
      name: 'The Tower',
      entityId: 'augment:da_thetower',
      changes: [{ label: 'Máu Tháp', from: '1000/1000/1400/2200/2800', to: '450/450/700/1250/1600' }],
    },
    {
      id: 'pbe0814ae-augment-traitladder',
      category: 'augment',
      kind: 'buff',
      name: 'Trait Ladder',
      entityId: 'augment:da_traitladder',
      changes: [
        { label: '2 tộc/hệ', from: '1 Reforger', to: '1 Reforger + 1 vàng' },
        { label: '3 tộc/hệ', from: '2 vàng', to: '3 vàng' },
        { label: '4 tộc/hệ', from: '4 vàng', to: '6 vàng' },
        { label: '6 tộc/hệ (mốc vàng)', from: '9 vàng', to: '10 vàng' },
        { label: '6 tộc/hệ (mốc trang bị)', from: '2x trang bị 3 thành phần + 2 vàng', to: '3x trang bị 3 thành phần' },
        { label: '7 tộc/hệ', from: 'Đe Component Anvil + 5 vàng', to: 'Đe Component Anvil + 8 vàng' },
      ],
    },
    {
      id: 'pbe0814ae-augment-verticalityiii',
      category: 'augment',
      kind: 'buff',
      name: 'Verticality III',
      entityId: 'augment:da_verticalityiii',
      changes: [{ label: 'Chỉ số cộng thêm', from: '3%', to: '3.5%' }],
    },

    // ── Bugfix ────────────────────────────────────────────────────
    {
      id: 'pbe0814ae-bugfix-deathsdefiance',
      category: 'mechanic',
      kind: 'mechanic',
      name: "Death's Defiance không còn gây thêm sát thương cho người mang trang bị",
    },
    {
      id: 'pbe0814ae-bugfix-rollingbones',
      category: 'mechanic',
      kind: 'mechanic',
      name: 'Rolling Bones chỉ cấp lượt đổi bài đúng khi hạ gục tướng (trước đó cấp sai điều kiện)',
    },
    {
      id: 'pbe0814ae-bugfix-blackthorn-sacrifice',
      category: 'mechanic',
      kind: 'mechanic',
      name: 'Blackthorn cập nhật đúng giá trị hiến tế ở giai đoạn chuẩn bị kế tiếp nếu tướng tạm thời (như Training Dummy từ Wisp) bị hiến tế',
    },
    {
      id: 'pbe0814ae-bugfix-blackthorn-dmgamp',
      category: 'mechanic',
      kind: 'mechanic',
      name: 'Blackthorn không còn cấp Khuếch Đại Sát Thương trong các trường hợp không nên cấp (kết hợp với lỗi sacrifice value tạo ra vấn đề "Rengar Blackthorn")',
    },
    {
      id: 'pbe0814ae-bugfix-heartofsteel-stack',
      category: 'mechanic',
      kind: 'mechanic',
      name: 'Heart of Steel không còn thỉnh thoảng lỗi không cộng dồn',
    },
    {
      id: 'pbe0814ae-bugfix-heartofsteel-bench',
      category: 'mechanic',
      kind: 'mechanic',
      name: 'Heart of Steel không còn cộng dồn khi tướng đang ở băng ghế dự bị',
    },
    {
      id: 'pbe0814ae-bugfix-luckygloves',
      category: 'mechanic',
      kind: 'mechanic',
      name: 'Lucky Gloves không còn cấp dư 1 Sparring Glove ở lượt sau',
    },
    {
      id: 'pbe0814ae-bugfix-greenexplosion',
      category: 'mechanic',
      kind: 'mechanic',
      name: 'Hiệu ứng nổ xanh không còn thỉnh thoảng bị kẹt lặp lại trên bàn đấu suốt cả trận',
    },
    {
      id: 'pbe0814ae-bugfix-rengar-gold',
      category: 'mechanic',
      kind: 'mechanic',
      name: 'Rengar không còn lỗi thiếu vàng khi đạt mốc hạ gục nếu vượt qua đúng mốc đó (vd hạ gục Rival khác trước)',
    },
    {
      id: 'pbe0814ae-bugfix-lux',
      category: 'mechanic',
      kind: 'mechanic',
      name: 'Lux không còn đổi hình dạng sai giữa combat, hoặc khi tướng khác biến hình',
    },
  ],
};

export default report;
