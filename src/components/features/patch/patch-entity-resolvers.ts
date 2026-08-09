import { findSet18Entity, set18EntityById } from '@/content/set18/set18-entity-index';
import type { PatchCategory, PatchEntry } from '@/content/patch-notes';
import type { Set18EntityKind } from '@/content/set18/set18-types';

/** Mỗi loại icon có "khung tự nhiên" riêng nên không dùng chung một kiểu:
 * - champion: ảnh vuông đầy khung → cover, viền tô theo màu giá tiền 1-5 vàng.
 * - trait: silhouette trắng nền trong suốt → cần plate màu hệ mới nhìn ra.
 * - augment: silhouette tối màu → cần plate radial nhuộm theo độ hiếm.
 * - item / wisp: art đã tự đủ khung hoặc nền trong suốt và đủ tương phản → để
 *   icon tràn hết ô, bỏ viền và padding (viền + padding chỉ làm icon bé lại).
 * - mechanic: icon lấy từ `text_icons/` là silhouette gần trắng, vẽ cho nền tối
 *   của game → trên thẻ nền trắng phải có plate tối mới nhìn thấy. */
export type IconVariant = 'champion' | 'trait' | 'augment' | 'item' | 'wisp' | 'mechanic';

export type ResolvedIcon = { src: string | null; variant: IconVariant; accent?: string; cost?: number };

export const iconVariantByCategory: Record<PatchCategory, IconVariant> = {
  champion: 'champion',
  trait: 'trait',
  augment: 'augment',
  item: 'item',
  wisp: 'wisp',
  mechanic: 'mechanic',
};

function entityKind(category: PatchCategory): Set18EntityKind | null {
  if (category === 'champion' || category === 'trait' || category === 'augment' || category === 'wisp') return category;
  return null;
}

/** Chỉ tra codex khi bản vá đúng là của Set 18. Bản vá mùa cũ trùng tên tướng
 * (Gnar Set 17 là 2 vàng, Set 18 là 5 vàng) mà lấy bừa dữ liệu Set 18 thì icon
 * và màu giá tiền đều sai — thà để placeholder còn hơn hiển thị sai. */
export function resolveEntity(entry: PatchEntry, entitySet: number) {
  if (entitySet !== 18) return undefined;
  const kind = entityKind(entry.category);
  if (entry.entityId) return set18EntityById.get(entry.entityId);
  return kind ? findSet18Entity(kind, entry.name) : undefined;
}

/** Tên hiển thị: tiếng Việt chuẩn từ codex (đậm) + tiếng Anh gốc (phụ), đúng
 * convention /mua-18 đang dùng cho trait/augment/wisp. Tướng không có
 * `nameVi` trong entity-index (quy ước: tên tướng luôn giữ tiếng Anh) nên
 * `en` trả về null — nơi gọi chỉ hiện 1 dòng như cũ, không đổi hành vi. */
export function resolveDisplayName(entry: PatchEntry, entitySet: number): { vi: string; en: string | null } {
  const entity = resolveEntity(entry, entitySet);
  return entity?.nameVi ? { vi: entity.nameVi, en: entry.name } : { vi: entry.name, en: null };
}

/** Icon Tinh Linh của Set 18 mã hoá sẵn loại + cấp trong tên file, vd
 * `t_shopcardsicon18_misc_tier2.png`. Đọc từ đó thay vì kéo cả bảng Tinh Linh
 * vào bundle chỉ để lấy hai con số dùng cho việc xếp thứ tự. */
export function wispFacetsFromIcon(icon: string | undefined) {
  const match = icon?.match(/shopcardsicon\d*_([a-z]+)_tier(\d+)/i);
  if (!match) return {};
  return { wispCategory: match[1].toLowerCase(), wispTier: Number(match[2]) };
}

/** Nhãn tiếng Việt cho `wispCategory` — đối chiếu tay với `category`/`categoryVi`
 * thật trong set18-wisps.ts (7 giá trị cố định, không đổi giữa các bản vá). */
export const WISP_CATEGORY_LABEL: Record<string, string> = {
  shop: 'Cửa Hàng',
  combat: 'Giao Tranh',
  goldxp: 'Vàng/XP',
  misc: 'Hỗn Hợp',
  risky: 'Rủi Ro',
  champion: 'Tướng',
  item: 'Trang Bị',
};

export function resolveIcon(entry: PatchEntry, entitySet: number): ResolvedIcon {
  const entity = resolveEntity(entry, entitySet);
  const cost = entry.cost ?? entity?.cost;
  return {
    src: entity?.icon ?? entry.icon ?? null,
    variant: iconVariantByCategory[entry.category],
    // Màu viền tướng luôn lấy từ token giá tiền để trùng với phần còn lại của
    // site; các loại khác dùng accent của codex (màu hệ / độ hiếm).
    accent: entry.category === 'champion' ? (cost ? `var(--cost-${cost})` : undefined) : entity?.accent,
    cost,
  };
}

/** Viết tắt cho placeholder: lấy chữ cái đầu của tối đa 2 từ ("Tuyệt Diệt" →
 * "TD") thay vì cắt 2 ký tự đầu ("Tu") — dễ đoán ra tên hơn. */
export function initialsOf(name: string) {
  const words = name.split(/[\s'’-]+/).filter(Boolean);
  const initials = words.length > 1 ? words.slice(0, 2).map((word) => word[0]).join('') : words[0].slice(0, 2);
  return initials.toUpperCase();
}
