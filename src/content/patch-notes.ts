// Dữ liệu bản vá hiển thị ở trang /patch. Không phải file generate — sửa trực
// tiếp ở đây mỗi khi có bản vá mới. `patchReports[0]` luôn là bản mới nhất.
//
// Cách thêm bản vá mới: copy một object trong `patchReports`, đổi id/version/
// summary, rồi liệt kê từng thay đổi vào `entries`. Với champion/trait/augment/
// wisp, ưu tiên điền `entityId` từ `set18-entity-index.ts`; `name` vẫn là nhãn
// hiển thị và được dùng làm fallback tương thích cho dữ liệu cũ.

export type PatchChangeKind = 'buff' | 'nerf' | 'rework' | 'mechanic';

export type PatchCategory = 'champion' | 'trait' | 'item' | 'wisp' | 'augment' | 'mechanic';

export type PatchStatChange = {
  label: string;
  from: string;
  to: string;
};

export type PatchEntry = {
  id: string;
  /** Stable Set18 entity ID; preferred over display-name matching when available. */
  entityId?: string;
  category: PatchCategory;
  kind: PatchChangeKind;
  /** Nhãn hiển thị; đồng thời là fallback lookup khi entry cũ chưa có `entityId`. */
  name: string;
  /** Ghi chú ngắn cạnh tên, vd mốc kích hoạt "(7)" hoặc slot đồ. */
  note?: string;
  /** Icon thủ công cho các mục không có trong codex (trang bị, cơ chế). */
  icon?: string;
  reason: string;
  changes?: PatchStatChange[];
};

export type PatchReport = {
  id: string;
  version: string;
  title: string;
  author: string;
  dateVi: string;
  summaryVi: string;
  entries: PatchEntry[];
};

export const patchCategoryMeta: Record<PatchCategory, { label: string; plural: string }> = {
  champion: { label: 'Tướng', plural: 'Tướng' },
  trait: { label: 'Tộc hệ', plural: 'Tộc hệ' },
  item: { label: 'Trang bị', plural: 'Trang bị' },
  wisp: { label: 'Linh hỏa', plural: 'Linh hỏa' },
  augment: { label: 'Nâng cấp', plural: 'Nâng cấp' },
  mechanic: { label: 'Cơ chế', plural: 'Cơ chế' },
};

export const patchKindMeta: Record<PatchChangeKind, { label: string; tone: 'buff' | 'nerf' | 'rework' | 'mechanic' }> = {
  buff: { label: 'Tăng sức mạnh', tone: 'buff' },
  nerf: { label: 'Giảm sức mạnh', tone: 'nerf' },
  rework: { label: 'Điều chỉnh', tone: 'rework' },
  mechanic: { label: 'Thay đổi cơ chế', tone: 'mechanic' },
};

export const patchReports: PatchReport[] = [
  {
    id: 'patch-18-3-vi-du',
    version: 'Patch 18.3 (ví dụ minh hoạ)',
    title: 'Ví dụ minh hoạ: cách đọc một bản vá',
    author: 'Đội ngũ giáo trình',
    dateVi: '31/07/2026',
    summaryVi:
      'Đây là dữ liệu mẫu để minh hoạ cách trang này trình bày một bản vá — thay bằng patch note thật (dịch từ nguồn Riot/Mortdog hoặc datatft.com) khi có bản vá mới. Nhịp chỉnh sửa mẫu: siết tộc Thần Rừng đang quá dễ đứng top, đẩy mạnh vài tướng carry đang yếu, và chỉnh nhẹ cơ chế cứu top 6.',
    entries: [
      {
        id: 'trait-elderwood-nerf',
        category: 'trait',
        kind: 'nerf',
        entityId: 'trait:elderwood',
        name: 'Elderwood',
        note: '(mốc 7)',
        reason:
          'Đội hình Thần Rừng đủ mốc cao đang khiên/giáp quá dày so với sát thương đối phương phải chuẩn bị, khiến các đội hình all-in nhanh không xuyên nổi. Giảm giáp và kháng phép cộng thêm ở mốc cao nhất.',
        changes: [{ label: 'Giáp & kháng phép (mốc 7)', from: '+45', to: '+35' }],
      },
      {
        id: 'trait-sprykin-buff',
        category: 'trait',
        kind: 'buff',
        entityId: 'trait:sprykin',
        name: 'Sprykin',
        note: '(mốc 3)',
        reason: 'Tộc Tinh Nghịch hiếm khi đủ mốc 3 vì phần thưởng chưa đủ hấp dẫn để đánh đổi slot đội hình. Tăng tốc đánh cộng thêm để đội hình dồn sát thương nhanh hơn.',
        changes: [{ label: 'Tốc đánh cộng thêm (mốc 3)', from: '+15%', to: '+25%' }],
      },
      {
        id: 'champion-diana-nerf',
        category: 'champion',
        kind: 'nerf',
        entityId: 'champion:tft18_diana',
        name: 'Diana',
        reason: 'Diana 2 sao đang mạnh hơn dự kiến, khiến người chơi ổn định top 4 mà không cần lên 3 sao. Giảm sát thương chiêu để buộc phải đầu tư lên 3 sao mới đạt mức sát thương tương đương.',
        changes: [{ label: 'Sát thương chiêu (2 sao)', from: '340', to: '300' }],
      },
      {
        id: 'champion-rengar-buff',
        category: 'champion',
        kind: 'buff',
        entityId: 'champion:tft18_rengar',
        name: 'Rengar',
        reason: 'Rengar gần như biến mất khỏi các đội hình carry vì tốc độ dọn quái chậm so với 3 vàng khác. Tăng sát thương chiêu để đủ sức làm carry chính thay vì chỉ đi phụ.',
        changes: [{ label: 'Sát thương chiêu', from: '250', to: '280' }],
      },
      {
        id: 'champion-kobuko-rework',
        category: 'champion',
        kind: 'rework',
        entityId: 'champion:tft18_kobuko',
        name: 'Kobuko',
        reason: 'Thêm hệ Đấu Sĩ để Kobuko ghép được vào nhiều đội hình tiền tuyến hơn, đổi lại giảm nhẹ máu nền để không phá vỡ những đội hình đang dùng Kobuko làm hi sinh.',
        changes: [
          { label: 'Hệ', from: 'Nguyên Sinh', to: 'Nguyên Sinh, Đấu Sĩ' },
          { label: 'Máu tối đa', from: '900', to: '850' },
        ],
      },
      {
        id: 'item-infinity-edge-nerf',
        category: 'item',
        kind: 'nerf',
        name: 'Infinity Edge',
        icon: '/set18/assets/items/full/da_infinityedge.png',
        reason: 'Tỉ lệ chí mạng quá cao khiến mọi đội hình chí mạng tối ưu quanh một món đồ duy nhất. Giảm tỉ lệ chí mạng cộng thêm để cần kết hợp thêm nguồn chí mạng khác.',
        changes: [{ label: 'Tỉ lệ chí mạng cộng thêm', from: '+75%', to: '+65%' }],
      },
      {
        id: 'item-archangels-staff-buff',
        category: 'item',
        kind: 'buff',
        name: "Archangel's Staff",
        icon: '/set18/assets/items/full/da_archangelsstaff.png',
        reason: 'Đồ tăng trưởng phép thuật đang bị đồ tăng trưởng công vật lý bỏ xa về hiệu quả cuối trận. Tăng lượng sức mạnh phép cộng dồn mỗi 5 giây.',
        changes: [{ label: 'Sức mạnh phép cộng dồn / 5s', from: '+6', to: '+8' }],
      },
      {
        id: 'wisp-doodad-sack-buff',
        category: 'wisp',
        kind: 'buff',
        entityId: 'wisp:doodad-sack',
        name: 'Doodad Sack',
        reason: 'Linh hỏa loại vật phẩm ngẫu nhiên hiếm khi được chọn vì phần thưởng cảm giác không đáng giá slot. Tăng số lượng thành phần nhận được để đáng cân nhắc hơn ở đầu ván.',
      },
      {
        id: 'augment-loaded-dice-buff',
        category: 'augment',
        kind: 'buff',
        entityId: 'augment:da_loadeddice',
        name: 'Loaded Dice',
        reason: 'Nâng cấp đổi trang bị ngẫu nhiên đang quá rủi ro so với phần thưởng. Tăng số lượt quay lại được phép để giảm rủi ro ăn phải đồ không dùng được.',
        changes: [{ label: 'Số lượt quay lại', from: '2', to: '4' }],
      },
      {
        id: 'mechanic-late-loot',
        category: 'mechanic',
        kind: 'mechanic',
        name: 'Loot cứu top 6',
        icon: '/set18/assets/text_icons/icon_coin.png',
        reason: 'Từ vòng PvE Stage 6 trở đi, mỗi 2 vòng sẽ rớt thêm một túi thành phần ngẫu nhiên. Mục tiêu: đội hình đang cứu top 6 có thêm cơ hội hoàn thiện đồ thay vì bất lực nhìn đối thủ giàu đồ hơn.',
      },
    ],
  },
  {
    id: 'patch-18-2-vi-du',
    version: 'Patch 18.2 (ví dụ minh hoạ)',
    title: 'Ví dụ minh hoạ: bản vá trước đó',
    author: 'Đội ngũ giáo trình',
    dateVi: '24/07/2026',
    summaryVi:
      'Dữ liệu mẫu cho bản vá trước — dùng để minh hoạ khu vực xem lại lịch sử patch. Nhịp chỉnh sửa mẫu: siết một augment đang quá vượt trội, nới nhẹ một tộc hệ tuyến dưới.',
    entries: [
      {
        id: 'augment-verticality-nerf',
        category: 'augment',
        kind: 'nerf',
        entityId: 'augment:da_verticalityi',
        name: 'Verticality I',
        reason: 'Augment chỉ một hướng đội hình đang cho phần thưởng vượt trội so với chi phí đánh đổi flex. Giảm mốc số tướng cùng tộc cần có để nhận thưởng.',
        changes: [{ label: 'Số tướng cùng tộc tối thiểu', from: '4', to: '5' }],
      },
      {
        id: 'trait-fae-buff',
        category: 'trait',
        kind: 'buff',
        entityId: 'trait:fae',
        name: 'Fae',
        note: '(mốc 2)',
        reason: 'Tộc Tiên Linh mốc thấp chưa đủ sức bảo vệ đội hình tuyến dưới khỏi đòn dồn sát thương đầu trận. Tăng khiên nhận được ở mốc 2.',
        changes: [{ label: 'Khiên (mốc 2)', from: '250', to: '300' }],
      },
      {
        id: 'champion-ashe-rework',
        category: 'champion',
        kind: 'rework',
        entityId: 'champion:tft18_ashe',
        name: 'Ashe',
        reason: 'Gộp lại hai chỉ số tăng trưởng sát thương chí mạng đang trùng lặp giữa chiêu và nội tại để dễ tính toán sát thương hơn, sức mạnh tổng thể giữ nguyên.',
      },
    ],
  },
];

export const patchCategoryTabs: { id: PatchCategory | 'all'; label: string }[] = [
  { id: 'all', label: 'Tất cả' },
  { id: 'champion', label: patchCategoryMeta.champion.label },
  { id: 'trait', label: patchCategoryMeta.trait.label },
  { id: 'item', label: patchCategoryMeta.item.label },
  { id: 'wisp', label: patchCategoryMeta.wisp.label },
  { id: 'augment', label: patchCategoryMeta.augment.label },
  { id: 'mechanic', label: patchCategoryMeta.mechanic.label },
];

export const patchKindOrder: PatchChangeKind[] = ['nerf', 'buff', 'rework', 'mechanic'];
