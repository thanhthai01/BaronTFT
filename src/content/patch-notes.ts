// Dữ liệu bản vá hiển thị ở trang /patch. Không phải file generate — sửa trực
// tiếp ở đây mỗi khi có bản vá mới. `patchReports[0]` luôn là bản mới nhất.
//
// Cách thêm bản vá mới: copy một object trong `patchReports`, đổi id/version/
// summary, rồi liệt kê từng thay đổi vào `entries`. Với champion/trait/augment/
// wisp, ưu tiên điền `entityId` từ `set18-entity-index.ts`; `name` vẫn là nhãn
// hiển thị và được dùng làm fallback tương thích cho dữ liệu cũ.
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
   * Với linh hỏa: giá mua, dùng để xếp thứ tự. Điền tay khi bản vá không thuộc
   * set đang có trong codex. */
  cost?: number;
  /** Bậc hiếm của nâng cấp — quyết định thứ tự Bạc → Vàng → Kim Cương. Bản vá
   * Set 18 tự lấy từ codex, mùa khác thì điền tay. */
  rarity?: PatchAugmentRarity;
  /** Cấp bậc linh hỏa (1-3) và loại (Chiến đấu, Vật phẩm...). Bản vá Set 18 tự
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
  wisp: { label: 'Linh hỏa', plural: 'Linh hỏa' },
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

export const patchReports: PatchReport[] = [
  {
    id: 'patch-17-8',
    version: 'Bản cập nhật 17.8',
    title: 'Bản cập nhật TFT 17.8',
    author: 'Baron TFT (dịch)',
    source: {
      label: 'Riot Games — Bản cập nhật TFT 17.8',
      url: 'https://teamfighttactics.leagueoflegends.com/vi-vn/news/game-updates/teamfight-tactics-patch-17-8/',
    },
    // Mùa 17 — codex trên site mới chỉ có Set 18, nên toàn bộ mục ở đây dùng
    // placeholder. Giá tiền tướng điền tay để vẫn có màu viền và thứ tự đúng.
    entitySet: 17,
    dateVi: '28/07/2026',
    summaryVi:
      'Bản vá xoay vòng Truyền Thuyết & Huyền Thoại Của Choncc sang Kho Báu Cổ Điển Của Choncc, kèm một loạt chỉnh nhẹ cho tướng và cho trang bị của hai tộc hệ Siêu Thú, Siêu Linh.',
    summaryOrigin: 'official',
    rhythmVi: [
      'Siết cả ba trang bị Siêu Thú và nới cả bốn trang bị Siêu Linh — kéo hai tộc hệ trang bị về gần nhau.',
      'Đẩy nhóm carry đang yếu ở bậc 1-4: Briar, Twisted Fate, cả hai bản Miss Fortune và Riven.',
      'Gnar với Morgana được thêm tộc hệ, đổi lại bị cắt chỉ số nền để không quá mạnh sau khi linh hoạt hơn.',
    ],
    entries: [
      {
        id: 'p178-briar',
        category: 'champion',
        kind: 'buff',
        name: 'Briar',
        cost: 1,
        changes: [{ label: 'SMCK', from: '35', to: '40' }],
      },
      {
        id: 'p178-twisted-fate',
        category: 'champion',
        kind: 'buff',
        name: 'Twisted Fate',
        cost: 1,
        changes: [
          { label: 'Sát thương kỹ năng tối đa (SMPT)', from: '410/610/920/1565', to: '450/675/1015/1725' },
        ],
      },
      {
        id: 'p178-akali',
        category: 'champion',
        kind: 'nerf',
        name: 'Akali',
        cost: 2,
        changes: [
          { label: 'Sát thương mỗi giây N.O.V.A. (SMCK)', from: '15/22/28', to: '14/18/25' },
        ],
      },
      {
        id: 'p178-gnar',
        category: 'champion',
        kind: 'rework',
        name: 'Gnar',
        cost: 2,
        changes: [{ label: 'Tộc hệ', from: '—', to: 'Thêm Đấu Sĩ' }],
      },
      {
        id: 'p178-miss-fortune-nhan-ban',
        category: 'champion',
        kind: 'buff',
        name: 'Miss Fortune',
        note: '(Nhân Bản)',
        cost: 3,
        changes: [{ label: 'Sát thương theo SMCK', from: '275/415/660', to: '300/450/675' }],
      },
      {
        id: 'p178-miss-fortune-dan-truyen',
        category: 'champion',
        kind: 'buff',
        name: 'Miss Fortune',
        note: '(Dẫn Truyền)',
        cost: 3,
        changes: [{ label: 'Sát thương kỹ năng theo SMCK', from: '80/120/190', to: '90/135/225' }],
      },
      {
        id: 'p178-samira',
        category: 'champion',
        kind: 'nerf',
        name: 'Samira',
        cost: 3,
        changes: [
          { label: 'Sát thương nội tại (SMCK)', from: '55/80/130', to: '45/68/115' },
          { label: 'Thời gian hất tung', from: '1 giây', to: '0,75 giây' },
        ],
      },
      {
        id: 'p178-diana',
        category: 'champion',
        kind: 'rework',
        name: 'Diana',
        cost: 3,
        changes: [
          { label: 'Năng lượng', from: '0/50', to: '0/40' },
          { label: 'Lá chắn (SMPT)', from: '275/325/515', to: '230/280/450' },
        ],
      },
      {
        id: 'p178-morgana',
        category: 'champion',
        kind: 'rework',
        name: 'Morgana',
        cost: 4,
        changes: [
          { label: 'Tộc hệ', from: '—', to: 'Thêm Dẫn Truyền' },
          { label: 'Năng lượng', from: '30/80', to: '45/95' },
          { label: 'Hồi máu cơ bản (SMPT)', from: '600/700', to: '550/650' },
        ],
      },
      {
        id: 'p178-riven',
        category: 'champion',
        kind: 'buff',
        name: 'Riven',
        cost: 4,
        changes: [
          { label: 'Sát thương lần thi triển nhỏ (SMCK)', from: '90/135', to: '100/150' },
          { label: 'Sát thương lần thi triển thứ 3 (SMCK)', from: '160/240', to: '180/270' },
        ],
      },
      {
        id: 'p178-zed',
        category: 'champion',
        kind: 'nerf',
        name: 'Zed',
        cost: 5,
        changes: [{ label: 'Mức giảm máu', from: '33/40%', to: '25/35%' }],
      },
      {
        id: 'p178-sieu-thu-bang-bau-vat',
        category: 'trait',
        kind: 'rework',
        name: 'Siêu Thú',
        note: '(Bảng Báu Vật)',
        breakpoint: '5',
        changes: [
          { label: 'Tùy chọn mới', from: '—', to: '9 vàng / 2 tướng 4 vàng / 3 Máy Sao Chép Tí Hon + 3 vàng' },
          { label: 'Tùy chọn bị loại bỏ', from: '1 Găng Tay Đạo Tặc / Ấn Viễn Chinh', to: '—' },
          { label: 'Ô tướng 5 vàng', from: '2 tướng 5 vàng + 1 vàng', to: '1 tướng 5 vàng + 3 vàng' },
          { label: 'Ô Ấn Thách Đấu', from: 'Ấn Thách Đấu + 1 vàng', to: 'Ấn Thách Đấu' },
          { label: 'Ô trang bị thành phần', from: '1 thành phần + 5 vàng', to: '1 thành phần + 2 vàng' },
        ],
      },
      {
        id: 'p178-dan-truyen',
        category: 'trait',
        kind: 'nerf',
        name: 'Dẫn Truyền',
        breakpoint: '5',
        changes: [{ label: 'Năng lượng cho đồng đội', from: '3 hồi phục năng lượng', to: '2 hồi phục năng lượng' }],
      },
      {
        id: 'p178-tuyet-diet',
        category: 'item',
        kind: 'nerf',
        name: 'Tuyệt Diệt',
        note: '(Siêu Thú)',
        changes: [
          { label: 'SMPT', from: '30%', to: '25%' },
          { label: 'Hồi năng lượng', from: '5', to: '4' },
        ],
      },
      {
        id: 'p178-giap-han-bang',
        category: 'item',
        kind: 'nerf',
        name: 'Giáp Hàn Băng',
        note: '(Siêu Thú)',
        changes: [
          { label: 'Thời gian choáng', from: '2 giây', to: '1,5 giây' },
          { label: 'Giá trị lá chắn', from: '25%', to: '20%' },
        ],
      },
      {
        id: 'p178-su-tu-doa-day',
        category: 'item',
        kind: 'nerf',
        name: 'Sư Tử Đọa Đày',
        note: '(Siêu Thú)',
        changes: [
          { label: 'Giáp + kháng phép', from: '30', to: '25' },
          { label: 'Đánh cắp chống chịu', from: '4', to: '3' },
        ],
      },
      {
        id: 'p178-bao-ton-sinh-chat',
        category: 'item',
        kind: 'buff',
        name: 'Bảo Tồn Sinh Chất',
        note: '(Siêu Linh)',
        changes: [
          { label: 'Máu cơ bản', from: '550', to: '650' },
          { label: 'Tăng hồi máu', from: '22%', to: '30%' },
        ],
      },
      {
        id: 'p178-ket-noi-drone',
        category: 'item',
        kind: 'buff',
        name: 'Kết Nối Drone',
        note: '(Siêu Linh)',
        changes: [{ label: 'Sát thương drone thứ 2', from: '20%', to: '30%' }],
      },
      {
        id: 'p178-ma-tran-ma-doc',
        category: 'item',
        kind: 'buff',
        name: 'Ma Trận Mã Độc',
        note: '(Siêu Linh)',
        changes: [
          { label: 'Khuếch đại sát thương', from: '10%', to: '15%' },
          { label: 'Sát thương lan (SMCK)', from: '75%', to: '100%' },
        ],
      },
      {
        id: 'p178-kinh-khoa-muc-tieu',
        category: 'item',
        kind: 'buff',
        name: 'Kính Khóa Mục Tiêu',
        note: '(Siêu Linh)',
        changes: [
          { label: 'SMPT/SMCK', from: '20%', to: '30%' },
          { label: 'Hồi máu', from: '20%', to: '30%' },
        ],
      },
      {
        id: 'p178-tai-lap-vu-tru',
        category: 'augment',
        kind: 'buff',
        name: 'Tái Lập Vũ Trụ',
        changes: [{ label: 'Lượt đổi', from: '8', to: '15' }],
      },
      {
        id: 'p178-kho-bau-co-dien',
        category: 'mechanic',
        kind: 'mechanic',
        name: 'Kho Báu Cổ Điển Của Choncc',
      },
    ],
    // `context` là chỗ điền SỐ THẬT từ nguồn của bạn (tỉ lệ chơi, tỉ lệ top 4,
    // buff ở bản trước). Mấy dòng dưới đây đang là chỗ trống có gợi ý — thay
    // bằng số đo được rồi hãy đăng.
    impacts: [
      {
        id: 'p178-impact-dan-truyen-tf',
        title: 'Twisted Fate carry — Dẫn Truyền',
        direction: 'mixed',
        verdict: 'Bản thân TF khoẻ hơn rõ, nhưng trục Dẫn Truyền quanh cậu ta thì bị siết lại.',
        relatedEntryIds: ['p178-twisted-fate', 'p178-miss-fortune-dan-truyen', 'p178-dan-truyen', 'p178-morgana'],
        context: [
          '⟨điền tỉ lệ chơi & tỉ lệ top 4 của bài TF carry ở 17.7⟩',
          '⟨điền các buff của bài này ở những bản vá trước⟩',
        ],
        body: 'Trần sát thương của TF tăng ~10% ở mọi mốc sao, và Miss Fortune bản Dẫn Truyền — carry phụ hay đi kèm — cũng lên ~12%. Nhưng mốc Dẫn Truyền (5) mất một bậc hồi năng lượng cho đồng đội, tức cả đội hình tung chiêu chậm hơn, đúng thứ mà một bài xoay quanh sát thương kỹ năng phụ thuộc nhiều nhất. Bù lại Morgana giờ mang sẵn Dẫn Truyền nên dễ đủ mốc hơn, dù bản thân Morgana tốn thêm 15 năng lượng mỗi chiêu. Tổng lại: sát thương mỗi lần tung tăng, số lần tung giảm — bài này không mạnh thẳng lên mà đổi sang lối chơi ít nhịp, mỗi nhịp nặng hơn.',
      },
      {
        id: 'p178-impact-sieu-thu',
        title: 'Đội hình Siêu Thú',
        direction: 'down',
        verdict: 'Cả ba trang bị đặc trưng đều bị cắt cùng lúc — đây là mục tiêu chính của bản vá.',
        relatedEntryIds: ['p178-tuyet-diet', 'p178-giap-han-bang', 'p178-su-tu-doa-day', 'p178-sieu-thu-bang-bau-vat'],
        context: ['⟨điền tỉ lệ top 4 của Siêu Thú ở 17.7 để đo mức độ vượt trội trước khi bị siết⟩'],
        body: 'Không phải một đòn mà là ba: Tuyệt Diệt mất 5% SMPT và 1 hồi năng lượng, Giáp Hàn Băng ngắn choáng đi 0,5 giây và mỏng lá chắn, Sư Tử Đọa Đày giảm cả chống chịu nền lẫn lượng đánh cắp. Cộng thêm Bảng Báu Vật ở mốc 5 bị rút bớt vàng kèm theo và bỏ hai ô trang bị. Khi một tộc hệ bị chạm vào bốn chỗ trong cùng một bản vá thì đó là tín hiệu nó đang vượt trội, không phải chỉnh nhẹ.',
      },
      {
        id: 'p178-impact-sieu-linh',
        title: 'Đội hình Siêu Linh',
        direction: 'up',
        verdict: 'Toàn bộ bốn trang bị đều được nới, mức tăng lớn nhất bản vá.',
        relatedEntryIds: [
          'p178-bao-ton-sinh-chat',
          'p178-ket-noi-drone',
          'p178-ma-tran-ma-doc',
          'p178-kinh-khoa-muc-tieu',
        ],
        context: ['⟨điền tỉ lệ chơi của Siêu Linh ở 17.7 — nếu đang rất thấp thì mức buff này dễ thành quá đà⟩'],
        body: 'Kính Khóa Mục Tiêu và Ma Trận Mã Độc đều nhảy 10 điểm phần trăm, Bảo Tồn Sinh Chất thêm 100 máu nền cùng 8 điểm hồi máu, Kết Nối Drone tăng một nửa sát thương drone thứ hai. Đây là mặt còn lại của việc siết Siêu Thú: Riot kéo hai bộ trang bị tộc hệ về gần nhau thay vì chỉ hạ bên mạnh xuống. Đội hình xếp sát nhau hưởng lợi nhất vì Ma Trận Mã Độc giờ lan đủ 100% SMCK.',
      },
      {
        id: 'p178-impact-carry-re',
        title: 'Trục carry SMCK giá rẻ',
        direction: 'up',
        verdict: 'Bốn carry bậc 1-4 cùng được đẩy lên, mở đường cho lối chơi giữ máu leo cấp.',
        relatedEntryIds: [
          'p178-briar',
          'p178-twisted-fate',
          'p178-miss-fortune-nhan-ban',
          'p178-riven',
          'p178-akali',
          'p178-samira',
          'p178-zed',
        ],
        context: ['⟨điền: các carry này đang ở khoảng tỉ lệ top 4 bao nhiêu trước bản vá⟩'],
        body: 'Briar, Twisted Fate, Miss Fortune bản Nhân Bản và Riven đều tăng sát thương, trong khi Akali, Samira và Zed bị cắt. Nhóm bị cắt đúng là nhóm carry "đánh nhanh thắng nhanh" ở giai đoạn giữa; nhóm được đẩy là nhóm cần thời gian dựng đồ. Hướng chung: giai đoạn giữa ván bớt bị trừng phạt, người giữ được máu để leo cấp có nhiều đường ra hơn.',
      },
    ],
  },
  {
    id: 'patch-18-3-vi-du',
    version: 'Patch 18.3 (ví dụ minh hoạ)',
    title: 'Ví dụ minh hoạ: cách đọc một bản vá',
    author: 'Đội ngũ giáo trình',
    source: { label: 'Riot Games — TFT Patch Notes', url: 'https://teamfighttactics.leagueoflegends.com/vi-vn/news/game-updates/' },
    dateVi: '31/07/2026',
    summaryVi:
      'Đây là dữ liệu mẫu để minh hoạ cách trang này trình bày một bản vá — thay bằng patch note thật (dịch từ nguồn Riot/Mortdog hoặc datatft.com) khi có bản vá mới.',
    rhythmVi: [
      'Siết tộc Thần Rừng đang quá dễ đứng top ở mốc cao.',
      'Đẩy mạnh vài tướng carry đang vắng mặt khỏi meta.',
      'Chỉnh nhẹ cơ chế loot để đội hình cứu top 6 có đường ra.',
    ],
    entries: [
      {
        id: 'trait-elderwood-nerf',
        category: 'trait',
        kind: 'nerf',
        entityId: 'trait:elderwood',
        name: 'Elderwood',
        breakpoint: '7',
        breakpointStyle: 'chromatic',
        changes: [{ label: 'Giáp & kháng phép', from: '+45', to: '+35' }],
      },
      {
        id: 'trait-sprykin-buff',
        category: 'trait',
        kind: 'buff',
        entityId: 'trait:sprykin',
        name: 'Sprykin',
        breakpoint: '3',
        breakpointStyle: 'gold',
        changes: [{ label: 'Tốc đánh cộng thêm', from: '+15%', to: '+25%' }],
      },
      {
        id: 'champion-diana-nerf',
        category: 'champion',
        kind: 'nerf',
        entityId: 'champion:tft18_diana',
        name: 'Diana',
        changes: [{ label: 'Sát thương chiêu (2 sao)', from: '340', to: '300' }],
      },
      {
        id: 'champion-rengar-buff',
        category: 'champion',
        kind: 'buff',
        entityId: 'champion:tft18_rengar',
        name: 'Rengar',
        changes: [{ label: 'Sát thương chiêu', from: '250', to: '280' }],
      },
      {
        id: 'champion-kobuko-rework',
        category: 'champion',
        kind: 'rework',
        entityId: 'champion:tft18_kobuko',
        name: 'Kobuko',
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
        changes: [{ label: 'Tỉ lệ chí mạng cộng thêm', from: '+75%', to: '+65%' }],
      },
      {
        id: 'item-archangels-staff-buff',
        category: 'item',
        kind: 'buff',
        name: "Archangel's Staff",
        icon: '/set18/assets/items/full/da_archangelsstaff.png',
        changes: [{ label: 'Sức mạnh phép cộng dồn / 5s', from: '+6', to: '+8' }],
      },
      {
        id: 'wisp-doodad-sack-buff',
        category: 'wisp',
        kind: 'buff',
        entityId: 'wisp:doodad-sack',
        name: 'Doodad Sack',
      },
      {
        id: 'augment-loaded-dice-buff',
        category: 'augment',
        kind: 'buff',
        entityId: 'augment:da_loadeddice',
        name: 'Loaded Dice',
        changes: [{ label: 'Số lượt quay lại', from: '2', to: '4' }],
      },
      {
        id: 'mechanic-late-loot',
        category: 'mechanic',
        kind: 'mechanic',
        name: 'Loot cứu top 6',
        icon: '/set18/assets/text_icons/icon_coin.png',
      },
    ],
    impacts: [
      {
        id: 'p183-impact-than-rung',
        title: 'Đội hình Thần Rừng đứng trụ',
        direction: 'down',
        verdict: 'Mốc 7 mất 10 giáp/kháng phép — đội hình all-in nhanh xuyên được trở lại.',
        relatedEntryIds: ['trait-elderwood-nerf', 'champion-kobuko-rework'],
        context: ['⟨điền tỉ lệ top 4 của Thần Rừng 7 ở bản trước⟩'],
        body: 'Đây là ví dụ minh hoạ cách viết một nhận định cấp đội hình: nối thay đổi tộc hệ với thay đổi tướng trụ của nó, rồi kết luận đội hình nào được lợi từ việc đó.',
      },
      {
        id: 'p183-impact-carry-yeu',
        title: 'Nhóm carry đang vắng mặt',
        direction: 'up',
        verdict: 'Rengar đủ sức làm carry chính, Diana không còn ăn đứt ở mốc 2 sao.',
        relatedEntryIds: ['champion-rengar-buff', 'champion-diana-nerf'],
        body: 'Ví dụ minh hoạ: nhận định gộp một buff và một nerf cùng ảnh hưởng tới một chỗ đứng trong đội hình.',
      },
    ],
  },
  {
    id: 'patch-18-2-vi-du',
    version: 'Patch 18.2 (ví dụ minh hoạ)',
    title: 'Ví dụ minh hoạ: bản vá trước đó',
    author: 'Đội ngũ giáo trình',
    dateVi: '24/07/2026',
    summaryVi: 'Dữ liệu mẫu cho bản vá trước — dùng để minh hoạ khu vực xem lại lịch sử patch.',
    rhythmVi: [
      'Siết một nâng cấp đang quá vượt trội so với chi phí đánh đổi.',
      'Nới nhẹ một tộc hệ tuyến dưới đang không đủ sức trụ đầu trận.',
    ],
    entries: [
      {
        id: 'augment-verticality-nerf',
        category: 'augment',
        kind: 'nerf',
        entityId: 'augment:da_verticalityi',
        name: 'Verticality I',
        changes: [{ label: 'Số tướng cùng tộc tối thiểu', from: '4', to: '5' }],
      },
      {
        id: 'trait-fae-buff',
        category: 'trait',
        kind: 'buff',
        entityId: 'trait:fae',
        name: 'Fae',
        breakpoint: '2',
        breakpointStyle: 'silver',
        changes: [{ label: 'Khiên', from: '250', to: '300' }],
      },
      {
        id: 'champion-ashe-rework',
        category: 'champion',
        kind: 'rework',
        entityId: 'champion:tft18_ashe',
        name: 'Ashe',
      },
    ],
  },
];

/** Thứ tự đọc một bản vá: tướng trước (và trong tướng thì 1 → 5 vàng), rồi tộc
 * hệ đi kèm tướng, đến nâng cấp, trang bị, linh hỏa, cuối cùng mới tới cơ chế /
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
