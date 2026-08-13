// Sinh bởi Set18/generate_website_set18_data.py từ data/*.json + reports/tft_set18_synergy_grid.html.
// Sửa nội dung/bản dịch/màu sắc trong Set18/data/set18_web_meta.json rồi chạy lại script.

export type Set18TraitType = 'Origin' | 'Class' | 'Unique';

export type Set18TraitTypeMeta = {
  vi: string;
  en: string;
  note: string;
  accent: string;
  accentSoft: string;
};

export type Set18TraitBreakpointValue = {
  row: string;
  value: string | null;
  icons: string[];
};

/** Nội dung cụ thể tại 1 mốc — vd Hoa Linh mốc (3): "Tinh Linh được nâng cấp, {0}"
 * với values[0] = "12%" + icon AD/AP. `textVi` giữ placeholder {0}, {1}... theo
 * đúng thứ tự trong `values` để component thay bằng chip icon+số khi render.
 * Chỉ có ở 21/36 trait — phần còn lại (trait 1 mốc kiểu Đặc biệt, hoặc trait có
 * template quá rối/thiếu dữ liệu để dịch tin cậy) không có field này. */
export type Set18TraitBreakpointBullet = {
  textVi: string;
  values: Set18TraitBreakpointValue[];
};

/** Màu mốc kích hoạt thật của game — bronze/silver/gold cho mốc 1-2-3, chromatic
 * (cầu vồng) cho mốc cao nhất khi có ≥4 mốc, unique cho trait Đặc biệt 1 mốc. */
export type Set18TraitBreakpoint = {
  threshold: string;
  style: 'bronze' | 'silver' | 'gold' | 'chromatic' | 'unique';
  color: string;
  bullet?: Set18TraitBreakpointBullet;
};

export type Set18Trait = {
  name: string;
  vi: string;
  type: Set18TraitType;
  typeVi: string;
  accent: string;
  accentSoft: string;
  breakpoints: string[];
  breaksLabel: string;
  breakpointDetails: Set18TraitBreakpoint[];
  iconSlug: string;
  icon: string;
  description: string;
  descriptionVi: string;
  champions: string[];
  /** Chip tham khảo phụ (vd 5 pha mặt trăng của Hòa Hợp, các loại ô đất của Thụ
   * Thần) — thông tin có thật nhưng không phải mốc kích hoạt, tách khỏi đoạn mô
   * tả chính để khỏi dồn thành một câu dài khó đọc. */
  infoChips?: string[];
  /** Chỉ Săn Thưởng (Draven) có: 11 cặp nhiệm vụ/phần thưởng, tách khỏi
   * đoạn mô tả chính thành danh sách để đọc được thay vì 1 khối văn bản dính liền. */
  /** `difficulty` không có trong dữ liệu game — bổ sung từ bảng
   * metatft.com/tables/draven-bounties bởi scripts/add_draven_bounty_difficulty.py.
   * Hai pool rút riêng và không có trọng số, nên xác suất trong mỗi pool là đều. */
  bounties?: { mission: string; reward: string; difficulty: 'standard' | 'hard' }[];
  /** Danh sách hiệu ứng phụ có nhãn, KHÔNG phải mốc kích hoạt — dùng cho 2 trait
   * mà dữ liệu game dồn tất cả vào một đoạn văn dính liền:
   *  · Nguyên Sinh: 4 Phước Lành để chọn (Gấu/Phượng Hoàng/Hổ/Rùa)
   *  · Mặt Trời: thưởng thêm theo số tướng 3 sao khác nhau (3/5/8)
   * Tách ra để hai thẻ này đọc giống các thẻ có `breakpointDetails[].bullet`. */
  subEffects?: { title?: string; items: { label: string; text: string }[] };
  /** Dòng chú giải in nghiêng đặt cuối thẻ — tương đương style `<Rules>` của game
   * (vd Đao Phủ giải thích "Chính Xác" nghĩa là gì). Tách khỏi bullet của mốc vì
   * nó giải nghĩa thuật ngữ chứ không phải hiệu ứng riêng của mốc đó. */
  note?: string;
  /** Điều kiện kích hoạt của trait ẩn — trait không nằm trong danh sách chọn và
   * không có tướng nào mang nó, nên `breakpoints` là ["0"] và vô nghĩa khi hiện
   * dưới dạng chip mốc. Chỉ Thiên Thực có. */
  activation?: string;
  /** true = thẻ trait này chiếm trọn 1 hàng riêng trong lưới (nội dung dài hơn
   * hẳn các trait Đặc biệt khác, ví dụ Săn Thưởng). */
  wide?: boolean;
};

export type Set18ChampionStats = {
  health: number[];
  mana: number[];
  attackDamage: number[];
  abilityPower: number;
  armor: number;
  magicResist: number;
  attackSpeed: number;
  critChance: number;
  critChance_pct: string;
  critMultiplier: number;
  critMultiplier_pct: string;
  range: number;
};

export type Set18ChampionAbilityCalc = {
  id: string;
  label: string;
  style: string;
  total: string;
  terms: string;
};

/** Một "dạng" của tướng: Lux có 10 dạng theo trait chọn, Nidalee có dạng báo sư tử,
 * 4 tướng Thích Ứng (Akali, Gromp, Kog'Maw, Master Yi) có 2 dạng AD/AP — mỗi dạng có
 * ảnh/tộc hệ/kỹ năng/số liệu riêng. `abilityHtmlVi` là HTML đã render sẵn (màu theo
 * game, icon inline) từ Set18/generate_champion_cards.py, dùng cho dangerouslySetInnerHTML. */
export type Set18ChampionForm = {
  label: string;
  image: string;
  bigImage: string;
  traits: string[];
  abilityIcon: string;
  abilityName: string;
  abilityNameVi: string;
  abilityHtmlVi: string;
  mana: string;
  calcs: Set18ChampionAbilityCalc[];
  stats: Set18ChampionStats;
};

export type Set18Champion = {
  name: string;
  /** Biệt danh/lore tiếng Việt — KHÔNG thay tên hiển thị chính (vẫn là `name`
   * tiếng Anh theo quy ước site). Chỉ điền khi có bản dịch xác nhận, phần lớn
   * tướng để trống. */
  nicknameVi?: string;
  cost: number;
  costLabel: string;
  costColor: string;
  image: string;
  traits: string[];
  mana: string;
  range: string;
  /** Phân loại chiến đấu kiểu MetaTFT, vd "Đấu Sĩ Vật Lý" — hiển thị dưới tên tướng trên thẻ. */
  role: string;
  abilityIcon: string;
  abilityName: string;
  abilityNameVi: string;
  ability: string;
  abilityVi: string;
  stats: Set18ChampionStats;
  /** Chỉ có ở 6 tướng nhiều dạng; các tướng khác dùng field cấp tướng ở trên làm dạng duy nhất. */
  forms?: Set18ChampionForm[];
};

/** Nguồn: Set18/assets/wisps/wisps.json (scrape DOM trực tiếp metatft.com, không
 * qua data/metatft_set18_vi.json vì file đó không có field wisps). */
export type Set18Wisp = {
  name: string;
  nameVi: string;
  category: string;
  categoryVi: string;
  categoryIcon: string;
  tier: number;
  /** null = Tinh Linh không hiện giá mua riêng (thường là phần thưởng miễn phí). */
  cost: number | null;
  description: string;
  descriptionVi: string;
  blossomUpgradeCost: number | null;
  blossomUpgradeDescriptionVi: string | null;
  appearsVi: string;
  appearsStart: string | null;
  appearsEnd: string | null;
  conditionsVi: string[];
};

/** Nguồn: data/metatft_set18_vi.json (261 nâng cấp). `rounds`/`roundVariants`
 * lấy từ metatft.com/new-set (vòng đấu augment này có thể xuất hiện, vd
 * ["3-2", "4-2"] / ["Mid", "Late"]) — xem Set18/enrich_augment_rounds.py. */
export type Set18Augment = {
  name: string;
  nameVi: string;
  rarity: 'Silver' | 'Gold' | 'Prismatic';
  rarityColor: string;
  category: string;
  categoryVi: string;
  description: string;
  descriptionVi: string;
  icon: string;
  associatedTraits: string[];
  rounds: string[];
  roundVariants: string[];
};

/** 'Radiant'/'Artifact' là ràng buộc hiển thị: quyết định viền vàng (Radiant)
 * hay viền Ornn cam/đỏ (Artifact) trên thẻ item — không có category nào khác
 * đổi kiểu viền. 'Armory' = vật phẩm tiêu hao (không trang bị lên tướng). */
export type Set18ItemCategory = 'Component' | 'Normal' | 'Emblem' | 'Artifact' | 'Radiant' | 'Other' | 'Armory';

export type Set18ItemStatBadge = { stat: string; value: string };

/** Nguồn: Set18/data/metatft_set18_vi.json (items + armory_items), đối chiếu
 * phân loại với datatft.com/database#item. `statBadges` chỉ có ở item đã soát
 * tay khớp game thật — item chưa soát dùng `statLine` thô làm fallback hiển thị.
 * `icon` là ảnh trang bị thật; icon+màu cho từng chỉ số trong statBadges là
 * hằng số phía UI (STAT_ICON/STAT_COLOR), không lưu trong dữ liệu này. */
export type Set18Item = {
  apiName: string;
  name: string;
  nameVi: string;
  category: Set18ItemCategory;
  description: string;
  descriptionVi: string;
  icon: string;
  statLine?: string;
  compositionApi: string[];
  unique: boolean;
  statBadges?: Set18ItemStatBadge[];
  /** false = có trong DB nhưng ẩn khỏi UI (vd item lấy từ nguồn tham khảo
   * mùa khác, chưa xác nhận có thật trong Set 18). */
  visible: boolean;
  /** Mùa mà dữ liệu item này thật sự thuộc về — 161 item gốc luôn là 18. */
  season: number;
};

export type Set18CostMeta = { cost: number; label: string; color: string };

/** Mẹo Mùa 18 dịch tay từ datatft.com/tip, gắn với entity codex khi liên quan
 * — nguồn dữ liệu thật ở bảng `set18_tips` (Neon), xem src/db/schema.ts. */
export type Set18Tip = {
  id: string;
  slug: string;
  titleVi: string;
  contentVi: string;
  /** Canonical related codex entities. Falls back to championIds/traitIds for legacy generated content. */
  entityIds?: string[];
  championIds: string[];
  traitIds: string[];
  sourceUrl: string | null;
};


export type Set18EntityKind = 'champion' | 'trait' | 'augment' | 'wisp';

export type Set18EntityIndexEntry = {
  id: string;
  kind: Set18EntityKind;
  name: string;
  nameVi?: string;
  icon: string;
  accent?: string;
  cost?: number;
  rarity?: 'Silver' | 'Gold' | 'Prismatic';
};

export type Set18SlugEntry = {
  slug: string;
  id: string;
  kind: Set18EntityKind;
};
