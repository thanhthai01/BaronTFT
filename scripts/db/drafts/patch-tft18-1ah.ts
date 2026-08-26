// Draft bản vá PBE — nội dung/số liệu đã được duyệt trong
// Website/pbe-notes/Patch_TFT18.1ah-PBE-pre-launch-patch.md (Truexy tự ghi là
// bản vá cho ngày 8/24, đăng lúc 2:11 AM giờ hiển thị Aug 25, 2026, tiếp theo
// bản 18.1ag 19/08). File này chỉ chuyển nội dung đó thành PatchReport để áp
// vào DB (pnpm db:apply-patch) rồi pull ra patch-notes.generated.ts
// (pnpm db:pull).
//
// Tên tiếng Việt chính, tên gốc phụ trong ngoặc: champion/trait/wisp/augment
// có entityId thì /patch tự tra nameVi qua entity-index. Item và mechanic
// KHÔNG có cơ chế tra tự động — viết sẵn "<Tiếng Việt> (<Tên gốc>)" lấy
// nguyên từ set18_items.nameVi.
//
// Ghi chú nội dung:
// - Azir và Raptor ("Mama Beak" trong caption gốc) là 2 bugfix lớn kèm nerf số
//   liệu — kind rework, vì vừa sửa cơ chế vừa đổi số, không phải nerf thuần.
// - Diana Shield: ảnh gốc ghi "150/275/400 AP" nhưng tác giả tự đính chính
//   trong reply rằng lá chắn KHÔNG scale AP — bỏ đơn vị AP.
// - Các mục vô hiệu hoá (3 Augment, 2 Wisp, Hullcrusher) dùng kind mechanic:
//   đây là gỡ khỏi game, không phải nerf số liệu.
import type { PatchReport } from '../../../src/content/patch-notes';

const report: PatchReport = {
  id: 'patch-tft18-1ah',
  version: 'PBE 24/08/2026 (18.1ah)',
  title: 'A-Patch trước Launch',
  author: 'Baron TFT (dịch)',
  source: {
    label: 'PBE — TheTruexy (dev PBE chính thức)',
    url: 'https://x.com/TheTruexy/status/2091966719015403673',
  },
  entitySet: 18,
  dateVi: '24/08/2026',
  summaryVi:
    'Bản PBE cuối trước khi Set 18 lên live 26/08 — Truexy gọi đây là "A-Patch" thường lệ nhưng chu kỳ Unreal cho phép vá linh hoạt hơn, trọng tâm là bugfix. Hai fix lớn nhất là Azir và Raptor: chiêu của cả hai trước giờ chạy sai (Azir không ăn hiệu ứng Triệu Hồi Sư, Raptor không scale theo cấp sao), nay sửa đúng nên phải hạ số liệu gốc bù lại. Buff Leona, Warwick, Diana, Alune, Elder Dragon, Lux; nerf Caitlyn, Ahri, Nidalee. Nerf Gai Đen và Mặt Trời, buff nhẹ Tiên Linh. Vô hiệu hoá 3 Augment (Double Trouble, Calculated Loss, Construct a Companion), 2 Tinh Linh (Clone Companion, Memorial Dummy) và trang bị Cổ Vật Hullcrusher. Dark Ritual đổi lại toàn bộ 7 mốc thưởng theo hướng đẩy phần thưởng về cuối. Nerf 5 Tinh Linh, Tinh Linh giờ luôn biến mất khi vào giao tranh kể cả khi đã khoá cửa hàng. Kèm 4 bugfix.',
  summaryOrigin: 'official',
  entries: [
    // ── Tướng 1 vàng ──────────────────────────────────────────────
    {
      id: 'pbe0824ah-champ-leona',
      category: 'champion',
      kind: 'buff',
      name: 'Leona',
      entityId: 'champion:tft18_leona',
      changes: [{ label: 'Máu', from: '700', to: '750' }],
    },

    // ── Tướng 2 vàng ──────────────────────────────────────────────
    {
      id: 'pbe0824ah-champ-caitlyn',
      category: 'champion',
      kind: 'nerf',
      name: 'Caitlyn',
      entityId: 'champion:tft18_caitlyn',
      changes: [{ label: 'Sát thương chiêu', from: '200/300/500 AD', to: '190/285/470 AD' }],
    },
    {
      id: 'pbe0824ah-champ-warwick',
      category: 'champion',
      kind: 'buff',
      name: 'Warwick',
      entityId: 'champion:tft18_warwick',
      changes: [{ label: 'Sát thương chiêu', from: '200/300/450 AD', to: '215/325/500 AD' }],
    },

    // ── Tướng 3 vàng ──────────────────────────────────────────────
    {
      id: 'pbe0824ah-champ-azir',
      category: 'champion',
      kind: 'rework',
      name: 'Azir',
      entityId: 'champion:tft18_azir',
      note: 'Sửa lỗi: sát thương chiêu giờ ăn đúng hiệu ứng Triệu Hồi Sư',
      changes: [
        { label: 'Thưởng Triệu Hồi Sư (2)', from: '45%', to: '20%' },
        { label: 'Thưởng Triệu Hồi Sư (3)', from: '67.5%', to: '30%' },
        { label: 'Sát thương chiêu', from: '48/72/115/205 AP', to: '40/60/96/165 AP' },
      ],
    },
    {
      id: 'pbe0824ah-champ-diana',
      category: 'champion',
      kind: 'buff',
      name: 'Diana',
      entityId: 'champion:tft18_diana',
      note: 'Lá chắn không scale theo Sức Mạnh Phép Thuật',
      changes: [
        { label: 'Sát thương chiêu', from: '65/100/155 AP', to: '70/105/170 AP' },
        { label: 'Lá chắn', from: '150/225/300', to: '150/275/400' },
      ],
    },
    {
      // Truexy gọi tướng này là "Mama Beak" trong caption — codex Set 18 dùng
      // tên Raptor, xem [[project_set18_champion_patchnote_aliases]].
      id: 'pbe0824ah-champ-raptor',
      category: 'champion',
      kind: 'rework',
      name: 'Raptor',
      entityId: 'champion:tft18_raptor',
      note: 'Sửa lỗi: sát thương chiêu giờ scale đúng theo cấp sao',
      changes: [
        { label: 'Sát thương vật lý cộng thêm', from: '65', to: '50' },
        { label: 'Sát thương chiêu', from: '27/41/65 AD', to: '20/30/48 AD' },
      ],
    },

    // ── Tướng 4 vàng ──────────────────────────────────────────────
    {
      id: 'pbe0824ah-champ-ahri',
      category: 'champion',
      kind: 'nerf',
      name: 'Ahri',
      entityId: 'champion:tft18_ahri',
      changes: [{ label: 'Sát thương chiêu', from: '485/735 AP', to: '450/675 AP' }],
    },
    {
      id: 'pbe0824ah-champ-nidalee',
      category: 'champion',
      kind: 'nerf',
      name: 'Nidalee',
      entityId: 'champion:tft18_nidalee',
      changes: [{ label: 'Năng lượng', from: '0/40', to: '0/45' }],
    },

    // ── Tướng 5 vàng ──────────────────────────────────────────────
    {
      id: 'pbe0824ah-champ-alune',
      category: 'champion',
      kind: 'buff',
      name: 'Alune',
      entityId: 'champion:tft18_alune',
      changes: [{ label: 'Sát thương Mảnh Trăng', from: '53/80 AP', to: '55/83' }],
    },
    {
      id: 'pbe0824ah-champ-elderdragon',
      category: 'champion',
      kind: 'buff',
      name: 'The Elder Dragon',
      entityId: 'champion:tft18_elderdragon',
      changes: [
        { label: 'Sát thương chiêu', from: '265/400 AD', to: '285/435 AD' },
        { label: 'Giáp và Kháng Phép', from: '70', to: '75' },
      ],
    },
    {
      id: 'pbe0824ah-champ-lux',
      category: 'champion',
      kind: 'buff',
      name: 'Lux',
      entityId: 'champion:tft18_lux',
      changes: [
        { label: 'Hồi năng lượng Hoả Ngục', from: '8', to: '10' },
        { label: 'Tốc Độ Đánh Nguyên Sinh', from: '50%', to: '60%' },
      ],
    },

    // ── Tộc Hệ ────────────────────────────────────────────────────
    {
      id: 'pbe0824ah-trait-blackthorn',
      category: 'trait',
      kind: 'nerf',
      name: 'Blackthorn',
      entityId: 'trait:eldritch',
      changes: [
        { label: 'Hệ số Hiến Tế — 1★ tướng 5 vàng', from: '1.5', to: '1.4' },
        { label: 'Hệ số Hiến Tế — 2★ tướng 4 vàng', from: '2.25', to: '2.1' },
        { label: 'Hệ số Hiến Tế — 2★ tướng 3 vàng', from: '1.8', to: '1.75' },
        { label: 'Giáp/Kháng Phép khi hiến tế tướng Đỡ Đòn', from: '17', to: '15' },
      ],
    },
    {
      id: 'pbe0824ah-trait-fae',
      category: 'trait',
      kind: 'buff',
      name: 'Fae',
      entityId: 'trait:fae',
      breakpoint: '2',
      breakpointStyle: 'bronze',
      changes: [{ label: 'Hồi máu', from: '2%', to: '2.5%' }],
    },
    {
      id: 'pbe0824ah-trait-solar',
      category: 'trait',
      kind: 'nerf',
      name: 'Solar',
      entityId: 'trait:solar',
      breakpoint: '5',
      note: 'Áp dụng cho tướng 3 sao',
      changes: [{ label: 'Chuyển đổi sang sát thương chuẩn', from: '50%', to: '40%' }],
    },

    // ── Cơ chế Set ────────────────────────────────────────────────
    {
      id: 'pbe0824ah-mech-wisps-fade',
      category: 'mechanic',
      kind: 'mechanic',
      name: 'Tinh Linh (Wisps)',
      changes: [
        {
          label: 'Biến mất khi vào giao tranh',
          from: 'Không biến mất nếu người chơi đã khoá cửa hàng',
          to: 'Luôn biến mất khi bắt đầu giao tranh',
        },
      ],
    },

    // ── Nâng Cấp ──────────────────────────────────────────────────
    {
      id: 'pbe0824ah-aug-doubletrouble',
      category: 'augment',
      kind: 'mechanic',
      name: 'Double Trouble',
      entityId: 'augment:da_doubletrouble',
      note: 'Vô hiệu hoá',
    },
    {
      id: 'pbe0824ah-aug-calculatedloss',
      category: 'augment',
      kind: 'mechanic',
      name: 'Calculated Loss',
      entityId: 'augment:da_calculatedloss',
      note: 'Vô hiệu hoá',
    },
    {
      id: 'pbe0824ah-aug-constructacompanion',
      category: 'augment',
      kind: 'mechanic',
      name: 'Construct a Companion',
      entityId: 'augment:da_constructacompanion',
      note: 'Vô hiệu hoá',
    },
    {
      id: 'pbe0824ah-aug-chosenofthesun',
      category: 'augment',
      kind: 'buff',
      name: 'Chosen of the Sun',
      entityId: 'augment:da_18_solartraitaugment',
      changes: [{ label: 'Máu tối đa Leona nhận mỗi vòng', from: '60', to: '70' }],
    },
    {
      id: 'pbe0824ah-aug-darkritual',
      category: 'augment',
      kind: 'buff',
      name: 'Dark Ritual',
      entityId: 'augment:da_18_coventraitaugment_loottoap',
      note: 'Hai mốc đầu giảm, từ mốc 3 trở đi tăng',
      changes: [
        { label: 'SMPT mỗi lần đổi thưởng — lần 1', from: '8', to: '5' },
        { label: 'Lần 2', from: '20', to: '12' },
        { label: 'Lần 3', from: '32', to: '40' },
        { label: 'Lần 4', from: '48', to: '60' },
        { label: 'Lần 5', from: '80', to: '100' },
        { label: 'Lần 6', from: '152', to: '175' },
        { label: 'Lần 7', from: '200', to: '250' },
      ],
    },
    {
      id: 'pbe0824ah-aug-fourcing',
      category: 'augment',
      kind: 'nerf',
      name: 'FOURcing',
      entityId: 'augment:da_18_fourcing',
      changes: [{ label: 'Máu mỗi trang bị', from: '120', to: '100' }],
    },
    {
      id: 'pbe0824ah-aug-itemextraction',
      category: 'augment',
      kind: 'buff',
      name: 'Item Extraction',
      entityId: 'augment:da_blackthorntraitaugment',
      changes: [{ label: 'Số trang bị nhận được', from: '3', to: '4' }],
    },
    {
      id: 'pbe0824ah-aug-unrivaled',
      category: 'augment',
      kind: 'nerf',
      name: 'Unrivaled',
      entityId: 'augment:da_18_rivalsaugment',
      changes: [{ label: "Tỉ lệ chia năng lượng của Kha'Zix", from: '100%', to: '70%' }],
    },

    // ── Tinh Linh ─────────────────────────────────────────────────
    {
      id: 'pbe0824ah-wisp-clonecompanion',
      category: 'wisp',
      kind: 'mechanic',
      name: 'Clone Companion',
      entityId: 'wisp:clone-companion',
      note: 'Vô hiệu hoá — cả bản thường, nâng cấp và ngọc',
    },
    {
      id: 'pbe0824ah-wisp-memorialdummy',
      category: 'wisp',
      kind: 'mechanic',
      name: 'Memorial Dummy',
      entityId: 'wisp:memorial-dummy',
      note: 'Vô hiệu hoá — cả bản thường và nâng cấp',
    },
    {
      id: 'pbe0824ah-wisp-goldtoappear',
      category: 'wisp',
      kind: 'mechanic',
      name: 'Toàn bộ Tinh Linh mốc 1/2/3/4/5',
      changes: [
        {
          label: 'Điều kiện vàng tối thiểu để xuất hiện',
          from: 'Chưa hợp lý',
          to: 'Đã chỉnh lại cho hợp lý hơn',
        },
      ],
    },
    {
      id: 'pbe0824ah-wisp-abandonship',
      category: 'wisp',
      kind: 'nerf',
      name: 'Abandon Ship',
      entityId: 'wisp:abandon-ship',
      note: 'Số thứ hai là giá trị sau nâng cấp Hoa Linh; lượng vàng giữ nguyên',
      changes: [
        { label: 'Số lượt đổi', from: '10/12', to: '8/10' },
        { label: 'Kinh nghiệm', from: '10/12', to: '8/10' },
      ],
    },
    {
      id: 'pbe0824ah-wisp-beggarswisp',
      category: 'wisp',
      kind: 'nerf',
      name: "Beggar's Wisp",
      entityId: 'wisp:beggars-wisp',
      note: 'Số thứ hai là giá trị sau nâng cấp Hoa Linh',
      changes: [{ label: 'Vàng nhận được', from: '3/6', to: '3/5' }],
    },
    {
      id: 'pbe0824ah-wisp-forestmage',
      category: 'wisp',
      kind: 'nerf',
      name: 'Forest Mage',
      entityId: 'wisp:forest-mage',
      changes: [{ label: 'Giá', from: '0 vàng', to: '1 vàng' }],
    },
    {
      id: 'pbe0824ah-wisp-prolificpower',
      category: 'wisp',
      kind: 'nerf',
      name: 'Prolific Power',
      entityId: 'wisp:prolific-power',
      note: 'Số thứ hai là giá trị sau nâng cấp Hoa Linh',
      changes: [{ label: 'Sức Mạnh Công Kích và Phép Thuật', from: '8/15%', to: '4/6%' }],
    },
    {
      id: 'pbe0824ah-wisp-verdantvitality',
      category: 'wisp',
      kind: 'nerf',
      name: 'Verdant Vitality',
      entityId: 'wisp:verdant-vitality',
      note: 'Số thứ hai là giá trị sau nâng cấp Hoa Linh',
      changes: [{ label: 'Máu', from: '100/175', to: '50/75' }],
    },

    // ── Trang Bị ──────────────────────────────────────────────────
    {
      id: 'pbe0824ah-item-hullcrusher',
      category: 'item',
      kind: 'mechanic',
      name: 'Thần Búa Tiến Công (Hullcrusher)',
      note: 'Trang bị Cổ Vật — vô hiệu hoá',
    },

    // ── Sửa Lỗi ───────────────────────────────────────────────────
    {
      id: 'pbe0824ah-fix-blossom',
      category: 'mechanic',
      kind: 'mechanic',
      name: 'Sửa lỗi — Hoa Linh (Blossom)',
      note: 'Chỉ áp dụng cho Giai đoạn 1',
      changes: [
        {
          label: 'Tinh Linh nâng cấp ở vòng 2-1',
          from: 'Không được trao dù đã kích hoạt ở 1-4',
          to: 'Được trao nếu đã kích hoạt ở 1-4',
        },
      ],
    },
    {
      id: 'pbe0824ah-fix-nidalee',
      category: 'mechanic',
      kind: 'mechanic',
      name: 'Sửa lỗi — Nidalee',
      changes: [
        {
          label: 'Bị choáng đúng lúc đang tung chiêu',
          from: 'Kẹt animation đánh thường, không tấn công suốt phần còn lại của giao tranh',
          to: 'Tấn công bình thường trở lại',
        },
      ],
    },
    {
      id: 'pbe0824ah-fix-masterwork',
      category: 'mechanic',
      kind: 'mechanic',
      name: 'Sửa lỗi — Nâng Cấp Kiệt Tác (Masterwork Upgrade)',
      changes: [
        {
          label: 'Dùng lên tướng ở hàng chờ trong lúc giao tranh',
          from: 'Hoạt động sai',
          to: 'Hoạt động đúng',
        },
      ],
    },
    {
      id: 'pbe0824ah-fix-polymorph',
      category: 'mechanic',
      kind: 'mechanic',
      name: 'Sửa lỗi — Hiệu ứng biến hình',
      note: 'Ví dụ Đại Biến Hình (Major Polymorph)',
      changes: [
        {
          label: 'Tướng 5 vàng 2 sao gặp hiệu ứng biến hình',
          from: 'Có thể biến thành Lux 1 sao',
          to: 'Không còn biến thành Lux 1 sao',
        },
      ],
    },
  ],
};

export default report;
