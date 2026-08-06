// Types + hằng số hiển thị cho trang /patch. `patchReports` (dữ liệu thật, mảng
// PatchReport[]) không còn nằm trong file này — nó sống trong Postgres (Neon) và
// được re-export từ `./patch-notes.generated` (file generate bởi
// `scripts/db/pull-set18.ts`, KHÔNG sửa tay). `patchReports[0]` luôn là bản mới nhất.
//
// Cách thêm bản vá mới: soạn draft (xem `Website/pbe-notes/*.md` làm ví dụ tham
// khảo nội dung, rồi viết thành object PatchReport trong 1 file draft .ts), chạy
// `pnpm db:apply-patch <đường dẫn file draft>` để đẩy vào DB, rồi `pnpm db:pull`
// để đồng bộ lại `patch-notes.generated.ts`. Với champion/trait/augment/wisp, ưu
// tiên điền `entityId` từ `set18-entity-index.ts`; `name` vẫn là nhãn hiển thị và
// được dùng làm fallback tương thích cho dữ liệu cũ.
//
// `entries` chỉ chứa THAY ĐỔI, không chứa diễn giải: phần trên trang là nơi
// người ta quét số liệu, chú thích cho từng dòng chỉ làm nhiễu. Mọi nhận định
// nằm ở `impacts` — phân tích theo ĐỘI HÌNH chứ không theo từng tướng.
//
// QUAN TRỌNG — phân biệt nguồn nội dung: số liệu trước/sau (`changes`) luôn là
// dữ liệu gốc từ patch note. Phần diễn giải (`impacts`, `rhythmVi`, và cả
// `summaryVi` nếu tự viết) là ý kiến của người biên soạn — đánh dấu bằng
// `origin` / `summaryOrigin` để UI gắn nhãn, người đọc không nhầm lẫn giữa
// "Riot nói vậy" và "mình nghĩ vậy".

export type PatchChangeKind = 'buff' | 'nerf' | 'rework' | 'mechanic';

export type PatchCategory = 'champion' | 'trait' | 'item' | 'wisp' | 'augment' | 'mechanic';

/** `official` = dịch/trích từ patch note gốc. `analysis` = nhận định cá nhân. */
export type PatchContentOrigin = 'official' | 'analysis';

export const patchOriginMeta: Record<PatchContentOrigin, { label: string; note: string }> = {
  official: { label: 'Theo patch note gốc', note: 'Nội dung dịch lại từ thông báo chính thức.' },
  analysis: { label: 'Phân tích cá nhân', note: 'Nhận định của người biên soạn, không phải thông báo chính thức.' },
};

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
  /** Icon thủ công cho các mục không có trong codex (trang bị, cơ chế). Bỏ trống
   * thì UI hiện placeholder chữ viết tắt thay vì thẻ trống. */
  icon?: string;
  /** Giá vàng. Với tướng: 1-5, quyết định màu viền avatar và thứ tự 1 → 5 vàng.
   * Với Tinh Linh: giá mua, dùng để xếp thứ tự. Điền tay khi bản vá không thuộc
   * set đang có trong codex. */
  cost?: number;
  /** Bậc hiếm của nâng cấp — quyết định thứ tự Bạc → Vàng → Kim Cương. Bản vá
   * Set 18 tự lấy từ codex, mùa khác thì điền tay. */
  rarity?: PatchAugmentRarity;
  /** Cấp bậc Tinh Linh (1-3) và loại (Chiến đấu, Vật phẩm...). Bản vá Set 18 tự
   * suy ra từ tên file icon, mùa khác thì điền tay. */
  wispTier?: number;
  wispCategory?: string;
  /** Mốc kích hoạt bị đổi của tộc hệ, vd '5' hay '7'. Tách khỏi `note` và hiện
   * thành huy hiệu riêng — với một thay đổi tộc hệ thì "đổi ở mốc nào" là thứ
   * người đọc cần biết trước cả con số. */
  breakpoint?: string;
  /** Bậc màu thật của mốc trong game. Bỏ trống thì huy hiệu dùng màu trung tính
   * — thà không tô còn hơn tô sai bậc. */
  breakpointStyle?: PatchBreakpointStyle;
  changes?: PatchStatChange[];
};

export type PatchAugmentRarity = 'Silver' | 'Gold' | 'Prismatic';

/** Thứ tự Bạc → Vàng → Kim Cương, đúng cách người chơi đọc bảng nâng cấp. */
export const patchRarityMeta: Record<PatchAugmentRarity, { label: string; rank: number }> = {
  Silver: { label: 'Bạc', rank: 1 },
  Gold: { label: 'Vàng', rank: 2 },
  Prismatic: { label: 'Kim Cương', rank: 3 },
};

export type PatchBreakpointStyle = 'bronze' | 'silver' | 'gold' | 'chromatic' | 'unique';

/** Màu mốc kích hoạt thật của game (đo từ metatft.com/new-set). Dùng chung bảng
 * này ở mọi chỗ hiển thị mốc để không lệch màu giữa các trang. */
export const patchBreakpointColors: Record<PatchBreakpointStyle, { from: string; to: string }> = {
  bronze: { from: '#cd8256', to: '#995111' },
  silver: { from: '#9aafb6', to: '#a4c0c1' },
  gold: { from: '#dac379', to: '#a9873b' },
  unique: { from: '#f7aa36', to: '#f56a3d' },
  chromatic: { from: '#f9fdfe', to: '#bcd0c6' },
};

/** Nguồn gốc của bản vá — hiển thị ở bộ lọc bên trái. Không bắt buộc: bản vá tự
 * tổng hợp thì bỏ trống, UI sẽ hiện người biên soạn thay cho dòng nguồn. */
export type PatchSource = {
  label: string;
  url?: string;
};

/** Một nhận định ở cấp đội hình, không phải cấp từng tướng. Đây mới là thứ người
 * đọc cần: "TF được buff, mà bài TF carry vốn đã được nới ở bản trước, nên bài
 * này sẽ mạnh lên đáng kể" — chứ không phải 22 đoạn giải thích rời rạc cho 22
 * dòng chỉ số. Mỗi mục trỏ ngược về các thay đổi liên quan trong chính bản vá. */
export type PatchImpact = {
  id: string;
  /** Tên đội hình / trục sức mạnh, vd "Twisted Fate carry — Dẫn Truyền". */
  title: string;
  /** Hướng đi của đội hình sau bản vá. */
  direction: 'up' | 'down' | 'mixed';
  /** Kết luận một câu — in đậm ở đầu thẻ. */
  verdict: string;
  /** `id` của các entry trong `entries` mà nhận định này dựa vào; UI hiện icon +
   * chỉ số của chúng ngay trong thẻ để không phải cuộn ngược lên đối chiếu. */
  relatedEntryIds?: string[];
  /** Dữ kiện NGOÀI bản vá này: buff từ bản trước, tỉ lệ chơi, tỉ lệ top 4...
   * Điền số thật từ nguồn của bạn (lolchess/metatft), đừng đoán. */
  context?: string[];
  /** Đoạn phân tích nối các dữ kiện trên thành kết luận. */
  body: string;
  /** Mặc định `analysis` — gần như luôn là nhận định cá nhân. */
  origin?: PatchContentOrigin;
};

export const patchImpactMeta: Record<PatchImpact['direction'], { label: string; arrow: string }> = {
  up: { label: 'Mạnh lên', arrow: '▲' },
  down: { label: 'Yếu đi', arrow: '▼' },
  mixed: { label: 'Đổi hướng', arrow: '◆' },
};

export type PatchReport = {
  id: string;
  version: string;
  title: string;
  /** Người biên soạn/dịch bản vá này trên site. */
  author: string;
  /** Nguồn gốc patch note (Riot, Mortdog, datatft...) nếu có. */
  source?: PatchSource;
  /** Set mà bản vá thuộc về. Mặc định 18 = tra icon/giá tiền từ codex Set 18.
   * Bản vá mùa khác phải khai báo đúng số set để UI KHÔNG tra nhầm codex —
   * tướng trùng tên giữa hai mùa thường khác giá và khác ảnh. */
  entitySet?: number;
  dateVi: string;
  summaryVi: string;
  /** Mặc định `official` — tóm tắt thường là dịch lại phần mở đầu patch note. */
  summaryOrigin?: PatchContentOrigin;
  /** Nhịp chỉnh sửa: 2-4 gạch đầu dòng nói hướng đi chung của bản vá. Luôn là
   * nhận định cá nhân nên UI gắn nhãn cố định, không có field riêng. */
  rhythmVi?: string[];
  entries: PatchEntry[];
  /** Phân tích cấp đội hình — phần "bản vá này ảnh hưởng gì tới game". */
  impacts?: PatchImpact[];
};

export const patchCategoryMeta: Record<PatchCategory, { label: string; plural: string }> = {
  champion: { label: 'Tướng', plural: 'Tướng' },
  trait: { label: 'Tộc hệ', plural: 'Tộc hệ' },
  item: { label: 'Trang bị', plural: 'Trang bị' },
  wisp: { label: 'Tinh Linh', plural: 'Tinh Linh' },
  augment: { label: 'Nâng cấp', plural: 'Nâng cấp' },
  mechanic: { label: 'Cơ chế', plural: 'Cơ chế' },
};

/** `short` dùng cho chỗ hẹp (thẻ chọn bản vá ở cột trái) — nơi nhãn đầy đủ sẽ
 * chiếm hết 2 dòng và làm danh sách bản vá dài ra vô ích. */
export const patchKindMeta: Record<
  PatchChangeKind,
  { label: string; short: string; tone: 'buff' | 'nerf' | 'rework' | 'mechanic' }
> = {
  buff: { label: 'Tăng sức mạnh', short: 'tăng', tone: 'buff' },
  nerf: { label: 'Giảm sức mạnh', short: 'giảm', tone: 'nerf' },
  rework: { label: 'Điều chỉnh', short: 'chỉnh', tone: 'rework' },
  mechanic: { label: 'Thay đổi cơ chế', short: 'cơ chế', tone: 'mechanic' },
};

export { patchReports } from './patch-notes.generated';

/** Thứ tự đọc một bản vá: tướng trước (và trong tướng thì 1 → 5 vàng), rồi tộc
 * hệ đi kèm tướng, đến nâng cấp, trang bị, Tinh Linh, cuối cùng mới tới cơ chế /
 * sửa lỗi. Dùng cho cả nhóm nội dung ở giữa lẫn bộ lọc bên trái. */
export const patchCategoryReadingOrder: PatchCategory[] = [
  'champion',
  'trait',
  'augment',
  'item',
  'wisp',
  'mechanic',
];

export const patchCategoryOrder: (PatchCategory | 'all')[] = ['all', ...patchCategoryReadingOrder];

export const patchCategoryTabLabel = (id: PatchCategory | 'all') =>
  id === 'all' ? 'Tất cả' : patchCategoryMeta[id].label;

export const patchKindOrder: PatchChangeKind[] = ['nerf', 'buff', 'rework', 'mechanic'];
