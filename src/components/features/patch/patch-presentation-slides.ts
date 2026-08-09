import {
  patchRarityMeta,
  type PatchAugmentRarity,
  type PatchChangeKind,
  type PatchContentOrigin,
  type PatchEntry,
  type PatchImpact,
  type PatchReport,
  type PatchSource,
} from '@/content/patch-notes';
import { resolveDisplayName, resolveEntity, resolveIcon, WISP_CATEGORY_LABEL, wispFacetsFromIcon } from './patch-entity-resolvers';

export type PatchStatCounts = { total: number; buff: number; nerf: number; rework: number; mechanic: number };

export type PatchSlide =
  | { kind: 'cover'; version: string; title: string; dateVi: string; author: string; source?: PatchSource; stats: PatchStatCounts }
  | { kind: 'overview'; stats: PatchStatCounts; buffs: PatchEntry[]; nerfs: PatchEntry[]; others: PatchEntry[] }
  | { kind: 'rhythm'; lines: string[] }
  | { kind: 'grid'; eyebrow: string; heading: string; badge?: string; entries: PatchEntry[]; cardSize?: 'md' | 'sm' }
  | { kind: 'mechanic'; eyebrow: string; entries: PatchEntry[] }
  | { kind: 'impact'; impact: PatchImpact }
  | { kind: 'quote'; summaryVi: string; summaryLines: string[]; summaryOrigin: PatchContentOrigin; stats: PatchStatCounts; dateVi: string }
  | { kind: 'outro'; url: string };

function chunk<T>(items: T[], size: number): T[][] {
  const pages: T[][] = [];
  for (let i = 0; i < items.length; i += size) pages.push(items.slice(i, i + size));
  return pages.length ? pages : [];
}

/** Không còn cắt số dòng số liệu trong một thẻ (yêu cầu: nội dung chi tiết
 * phải hiện đầy đủ, không "+N khác") — nên phải chia trang theo ƯỚC LƯỢNG
 * CHIỀU CAO thật của từng thẻ thay vì đếm số lượng cố định. Một thẻ 1 dòng và
 * một thẻ 11 dòng (vd tộc hệ nhiều mốc) không thể tính là "1 đơn vị" như
 * nhau — đếm phẳng theo số lượng khiến trang chứa thẻ dài bị tràn còn trang
 * toàn thẻ ngắn thì trống thừa (đúng hai lỗi đã gặp trước đó). Dùng cho thẻ cỡ
 * 'md' (tướng/tộc hệ/trang bị) — Tinh Linh (cardSm) có hàm riêng bên dưới vì
 * padding/cỡ chữ khác hẳn. */
function cardHeightPx(entry: PatchEntry): number {
  const lines = entry.changes?.length ?? 0;
  return 130 + lines * 42;
}

/** Chia trang theo tổng chiều cao ước lượng thay vì đếm số lượng; vẫn chặn
 * thêm số lượng tối đa để không nhồi quá nhiều thẻ ngắn vào một trang (rối
 * mắt dù kỹ thuật vẫn đủ chỗ). Ngân sách tính bảo thủ hơn "chiều cao khung ×
 * số cột" vì flex-wrap ghép cặp 2 thẻ/hàng không đảm bảo cân bằng chiều cao
 * giữa hai cột — chừa dư địa an toàn thay vì tính khít. */
function chunkByHeight<T>(items: T[], heightOf: (item: T) => number, budget: number, maxCount: number): T[][] {
  const pages: T[][] = [];
  let current: T[] = [];
  let currentHeight = 0;
  for (const item of items) {
    const h = heightOf(item);
    if (current.length > 0 && (current.length >= maxCount || currentHeight + h > budget)) {
      pages.push(current);
      current = [];
      currentHeight = 0;
    }
    current.push(item);
    currentHeight += h;
  }
  if (current.length) pages.push(current);
  return pages.length ? pages : [];
}

function computeStats(entries: PatchEntry[]): PatchStatCounts {
  const counts: PatchStatCounts = { total: entries.length, buff: 0, nerf: 0, rework: 0, mechanic: 0 };
  for (const entry of entries) counts[entry.kind as PatchChangeKind]++;
  return counts;
}

/** `summaryVi` là một câu dài duy nhất — bổ dồn hết vào một khối chữ giữa
 * slide thì đẹp nhưng phải đọc hết mới nắm được ý, không quét nhanh được. Tách
 * theo dấu phẩy Ở CẤP NGOÀI CÙNG (bỏ qua dấu phẩy bên trong ngoặc, vd danh
 * sách tướng "(Akali, Cinderling, ...)") thành từng dòng ngắn — giữ NGUYÊN
 * từng chữ gốc, chỉ đổi cách trình bày từ một câu thành danh sách quét được. */
function splitSummaryLines(text: string): string[] {
  const lines: string[] = [];
  let depth = 0;
  let current = '';
  for (const char of text) {
    if (char === '(') depth++;
    else if (char === ')') depth--;
    if (char === ',' && depth <= 0) {
      lines.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  if (current.trim()) lines.push(current.trim());
  return lines.filter(Boolean);
}

function byNameVi(entitySet: number) {
  return (a: PatchEntry, b: PatchEntry) =>
    resolveDisplayName(a, entitySet).vi.localeCompare(resolveDisplayName(b, entitySet).vi, 'vi');
}

/** Tướng chia theo TỪNG mốc giá (1 → 5 vàng) — mỗi mốc một slide riêng, đúng
 * cách người chơi đọc bảng buff/nerf: unit 1 vàng và 2 vàng đóng vai trò khác
 * hẳn nhau trong game, gộp chung "1-2 vàng" làm mất phân biệt đó. */
const CHAMPION_COST_BANDS: { label: string; match: (cost: number) => boolean }[] = [1, 2, 3, 4, 5].map((cost) => ({
  label: `${cost} Vàng`,
  match: (c: number) => c === cost,
}));

const GRID_HEIGHT_BUDGET = 1180;
const GRID_MAX_COUNT = 6;

/** Thẻ Tinh Linh (cardSm), đo thật: 130 + 46×số dòng (13 dòng ≈ 728px, khớp
 * chiều cao đo được ngoài trình duyệt — công thức cũ 92+34n ước non gần 1/3).
 * Đây là hàm RIÊNG cho cardSm, không dùng chung với cardHeightPx (thẻ tướng/
 * tộc hệ cỡ 'md' có padding/cỡ chữ khác hẳn). */
function wispCardHeightPx(entry: PatchEntry): number {
  const lines = entry.changes?.length ?? 0;
  return 130 + lines * 46;
}

const WISP_PER_ROW = 4;
// An toàn dưới max-height:900px của .cardGrid (chừa lề cho sai số làm tròn).
// Không còn tiêu đề mục theo loại trên slide (chỉ còn khoảng trắng phân
// nhóm ở tầng sắp xếp) nên không cần cộng thêm chiều cao tiêu đề/khoảng cách
// mục mỗi lần đổi loại nữa — cộng thêm đó từng khiến trang bị ngắt SỚM dù
// còn thừa rất nhiều chỗ trống, để lại trang kế tiếp chỉ vài thẻ lẻ loi.
const WISP_STACK_BUDGET = 820;

/** Không thể chia trang Tinh Linh bằng tổng-chiều-cao/4 đơn giản: MỘT thẻ cao
 * bất thường (vd 13 dòng số liệu) chiếm nguyên chiều cao của cả hàng 4 thẻ nó
 * đứng — không "trung bình hoá" được với 3 thẻ ngắn cùng hàng. Mô phỏng đúng
 * cách flex-wrap xếp 4 thẻ/hàng, sang trang mới ngay khi tổng ước tính vượt
 * ngân sách — đảm bảo không trang nào tràn khung, đồng thời lấp kín từng
 * trang trước khi mở trang mới (không ngắt giữa chừng vì đổi loại). */
function wispGroupPaginate(ordered: PatchEntry[]): PatchEntry[][] {
  const pages: PatchEntry[][] = [];
  let page: PatchEntry[] = [];
  let committedHeight = 0;
  let rowMax = 0;
  let rowCount = 0;

  for (const entry of ordered) {
    const h = wispCardHeightPx(entry);
    const rowFull = rowCount >= WISP_PER_ROW;

    const tentativeCommitted = rowFull ? committedHeight + rowMax : committedHeight;
    const tentativeRowMax = rowFull ? h : Math.max(rowMax, h);
    const projected = tentativeCommitted + tentativeRowMax;

    if (page.length > 0 && projected > WISP_STACK_BUDGET) {
      pages.push(page);
      page = [entry];
      committedHeight = 0;
      rowMax = h;
      rowCount = 1;
      continue;
    }

    if (rowFull) {
      committedHeight = tentativeCommitted;
      rowMax = h;
      rowCount = 1;
    } else {
      rowMax = tentativeRowMax;
      rowCount += 1;
    }
    page.push(entry);
  }
  if (page.length) pages.push(page);
  return pages;
}

function championGridSlides(entries: PatchEntry[]): Extract<PatchSlide, { kind: 'grid' }>[] {
  const eyebrow = `Tướng · ${entries.length} thay đổi · xếp theo mốc vàng`;
  const slides: Extract<PatchSlide, { kind: 'grid' }>[] = [];
  for (const band of CHAMPION_COST_BANDS) {
    const bandEntries = entries.filter((entry) => entry.cost != null && band.match(entry.cost));
    for (const page of chunkByHeight(bandEntries, (e) => cardHeightPx(e), GRID_HEIGHT_BUDGET, GRID_MAX_COUNT)) {
      slides.push({ kind: 'grid', eyebrow, heading: 'Tướng', badge: band.label, entries: page });
    }
  }
  return slides;
}

function categoryGridSlides(entries: PatchEntry[], heading: string): Extract<PatchSlide, { kind: 'grid' }>[] {
  if (!entries.length) return [];
  const eyebrow = `${heading} · ${entries.length} thay đổi`;
  return chunkByHeight(entries, (e) => cardHeightPx(e), GRID_HEIGHT_BUDGET, GRID_MAX_COUNT).map((page) => ({
    kind: 'grid',
    eyebrow,
    heading,
    entries: page,
  }));
}

/** Nâng cấp: MỖI BẬC HIẾM một slide riêng (không còn 3 bậc chung 1 slide —
 * bậc nhiều mục tự nhiên chiếm hết chỗ, bậc ít mục bị ép hẹp lại và tràn/thiếu
 * cân đối). Rarity không nằm sẵn trên `entry` (script apply-patch chưa
 * backfill), phải tra codex qua `entityId` giống cách PatchBoard tra icon.
 * Hiện thẻ đầy đủ (như tướng/tộc hệ/Tinh Linh) thay vì chip icon+tên trơn —
 * người xem cần biết CHI TIẾT số liệu đổi, không chỉ "cái gì có đổi". Không
 * còn gộp theo tăng/giảm/chỉnh — chỉ giữ đúng một trục sắp xếp: a-z tiếng Việt. */
function augmentGroupSlides(entries: PatchEntry[], entitySet: number): Extract<PatchSlide, { kind: 'grid' }>[] {
  if (!entries.length) return [];
  const byRarity = new Map<PatchAugmentRarity, PatchEntry[]>();
  for (const entry of entries) {
    const rarity = entry.rarity ?? resolveEntity(entry, entitySet)?.rarity;
    if (!rarity) continue;
    const list = byRarity.get(rarity) ?? [];
    list.push(entry);
    byRarity.set(rarity, list);
  }

  const slides: Extract<PatchSlide, { kind: 'grid' }>[] = [];
  const rarities = (Object.keys(patchRarityMeta) as PatchAugmentRarity[]).sort(
    (a, b) => patchRarityMeta[a].rank - patchRarityMeta[b].rank,
  );
  for (const rarity of rarities) {
    const rarityEntries = byRarity.get(rarity);
    if (!rarityEntries?.length) continue;
    const eyebrow = `Nâng cấp · Bậc ${patchRarityMeta[rarity].label} · ${rarityEntries.length} thay đổi`;
    const ordered = [...rarityEntries].sort(byNameVi(entitySet));
    for (const page of chunkByHeight(ordered, (e) => cardHeightPx(e), GRID_HEIGHT_BUDGET, GRID_MAX_COUNT)) {
      slides.push({ kind: 'grid', eyebrow, heading: 'Nâng cấp', badge: `Bậc ${patchRarityMeta[rarity].label}`, entries: page });
    }
  }
  return slides;
}

/** Tinh Linh: MỖI CẤP một slide riêng (1 → 3), giữ thẻ đầy đủ (số liệu quan
 * trọng hơn với Tinh Linh vì giá/thời lượng/máu đổi trực tiếp cách dùng). Vẫn
 * SẮP theo LOẠI (Giao Tranh/Cửa Hàng/Rủi Ro...) → a-z tiếng Việt để các thẻ
 * cùng loại đứng gần nhau, nhưng không còn tiêu đề mục/ngắt trang theo loại —
 * dồn hết vào MỘT lưới liên tục như tướng/tộc hệ/nâng cấp, lấp kín từng trang
 * trước khi mở trang mới (trước đó ngắt trang mỗi khi đổi loại, để lại trang
 * cuối chỉ 1-2 thẻ lẻ loi dù còn thừa rất nhiều chỗ). */
function wispGroupSlides(entries: PatchEntry[], entitySet: number): Extract<PatchSlide, { kind: 'grid' }>[] {
  if (!entries.length) return [];
  const byTier = new Map<number, PatchEntry[]>();
  for (const entry of entries) {
    const icon = resolveIcon(entry, entitySet).src ?? undefined;
    const tier = entry.wispTier ?? wispFacetsFromIcon(icon).wispTier;
    if (tier == null) continue;
    const list = byTier.get(tier) ?? [];
    list.push(entry);
    byTier.set(tier, list);
  }

  const slides: Extract<PatchSlide, { kind: 'grid' }>[] = [];
  const tiers = [...byTier.keys()].sort((a, b) => a - b);
  for (const tier of tiers) {
    const tierEntries = byTier.get(tier);
    if (!tierEntries?.length) continue;
    const eyebrow = `Tinh Linh (Linh Hỏa) · Cấp ${tier} · ${tierEntries.length} thay đổi`;
    const categoryOf = (entry: PatchEntry) => {
      const icon = resolveIcon(entry, entitySet).src ?? undefined;
      const key = entry.wispCategory ?? wispFacetsFromIcon(icon).wispCategory ?? '';
      return WISP_CATEGORY_LABEL[key] ?? 'Khác';
    };
    const ordered = [...tierEntries].sort((a, b) => {
      const catDiff = categoryOf(a).localeCompare(categoryOf(b), 'vi');
      return catDiff !== 0 ? catDiff : byNameVi(entitySet)(a, b);
    });
    for (const page of wispGroupPaginate(ordered)) {
      slides.push({ kind: 'grid', eyebrow, heading: 'Tinh Linh', badge: `Cấp ${tier}`, entries: page, cardSize: 'sm' });
    }
  }
  return slides;
}

/** Dựng bộ slide trực tiếp từ dữ liệu bản vá đã có — không cần soạn thêm nội
 * dung riêng cho việc trình chiếu. `url` truyền vào thay vì tự suy từ
 * `report.id` vì bản mới nhất có URL canonical là `/patch`, không phải
 * `/patch/<id-của-chính-nó>` (xem app/patch/[version]/page.tsx::redirect). */
export function buildPatchSlides(report: PatchReport, url: string): PatchSlide[] {
  const entitySet = report.entitySet ?? 18;
  const stats = computeStats(report.entries);
  const byCategory = (category: PatchEntry['category']) => report.entries.filter((entry) => entry.category === category);

  const slides: PatchSlide[] = [
    { kind: 'cover', version: report.version, title: report.title, dateVi: report.dateVi, author: report.author, source: report.source, stats },
    {
      kind: 'overview',
      stats,
      buffs: report.entries.filter((entry) => entry.kind === 'buff'),
      nerfs: report.entries.filter((entry) => entry.kind === 'nerf'),
      others: report.entries.filter((entry) => entry.kind === 'rework' || entry.kind === 'mechanic'),
    },
  ];

  if (report.rhythmVi?.length) slides.push({ kind: 'rhythm', lines: report.rhythmVi });

  slides.push(...championGridSlides(byCategory('champion')));
  slides.push(...categoryGridSlides(byCategory('trait'), 'Tộc hệ'));
  slides.push(...augmentGroupSlides(byCategory('augment'), entitySet));
  slides.push(...categoryGridSlides(byCategory('item'), 'Trang bị'));
  slides.push(...wispGroupSlides(byCategory('wisp'), entitySet));

  const mechanicEntries = byCategory('mechanic');
  if (mechanicEntries.length) {
    const eyebrow = `Cơ chế · ${mechanicEntries.length} thay đổi`;
    // Danh sách 2 cột không còn khung thẻ riêng (xem PatchPresentation.module.css
    // .mechanicList) nên chứa được nhiều hơn hẳn kiểu 1 cột cũ — 10/trang từng để
    // thừa gần nửa khung trống. 16 vẫn còn dư địa an toàn dưới max-height 760px.
    for (const page of chunk(mechanicEntries, 16)) slides.push({ kind: 'mechanic', eyebrow, entries: page });
  }

  for (const impact of report.impacts ?? []) slides.push({ kind: 'impact', impact });

  slides.push({
    kind: 'quote',
    summaryVi: report.summaryVi,
    summaryLines: splitSummaryLines(report.summaryVi),
    summaryOrigin: report.summaryOrigin ?? 'official',
    stats,
    dateVi: report.dateVi,
  });
  slides.push({ kind: 'outro', url });
  return slides;
}
