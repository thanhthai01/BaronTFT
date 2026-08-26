// Draft bản vá LIVE 18.1 — bản vá chính thức đầu tiên của Set 18 (Đại Ngàn Kỳ
// Bí) trên máy chủ phát hành. Nội dung/số liệu đã soạn và duyệt trong
// Website/pbe-notes/Patch_TFT18.1-Live-launch.md. File này chỉ chuyển nội dung
// đó thành PatchReport để áp vào DB (pnpm db:apply-patch) rồi pull ra
// patch-notes.generated.ts (pnpm db:pull).
//
// Nguồn: patch note chính thức của Riot, bản EN + bản VI (đối chiếu song song).
// Ưu tiên bản EN khi hai bản lệch nhau — bản VI dịch "Going Long: 16 giây ⇒ 10
// giây" trong khi EN ghi rõ "16g ⇒ 10g" (vàng).
//
// Phạm vi cố ý KHÔNG đưa vào entries (xem mục 7 của file .md):
// - Ghi chú hiệu năng/cấu hình tối thiểu/Lumie Vinh Quang: thông báo vận hành.
// - Toàn bộ danh sách vật phẩm trang trí: hàng trăm mục, không phải gameplay.
// - Phần "highlights" cơ chế Tinh Linh: đây là tóm tắt luật cho người chơi live
//   mới, không phải thay đổi — codex Set 18 trên site đã có đủ.
// - 43 Nâng Cấp bị loại bỏ + 23 Nâng Cấp quay trở lại: gộp thành 1 entry cơ chế
//   ghi số lượng. Liệt kê 66 tên trong vùng số liệu sẽ vỡ bố cục và phần lớn là
//   Nâng Cấp mùa cũ không có trong codex Set 18. Danh sách đầy đủ ở file .md.
//
// Tên tiếng Việt chính, tên gốc phụ trong ngoặc: champion/trait/wisp/augment có
// entityId thì /patch tự tra nameVi qua entity-index. Item và mechanic KHÔNG có
// cơ chế tra tự động — viết sẵn "<Tiếng Việt> (<Tên gốc>)" lấy nguyên từ
// set18_items.nameVi. Nâng Cấp không có trong codex Set 18 (Bronze for Life,
// Build-a-Bud, Buried Treasures II, Forged in Strength, Slightly Magical) cũng
// phải viết tay vì không có entityId để tra.
import type { PatchReport } from '../../../src/content/patch-notes';

const report: PatchReport = {
  id: 'patch-tft18-1-live',
  version: 'Live 26/08/2026 (18.1)',
  title: 'Đại Ngàn Kỳ Bí ra mắt',
  author: 'Baron TFT (dịch)',
  source: {
    label: 'Riot Games — patch note chính thức 18.1',
    url: 'https://teamfighttactics.leagueoflegends.com/vi-vn/news/game-updates/teamfight-tactics-patch-18-1/',
  },
  entitySet: 18,
  dateVi: '26/08/2026',
  summaryVi:
    'Set 18 Đại Ngàn Kỳ Bí chính thức lên máy chủ phát hành, đồng thời là bản vá đầu tiên chạy trên engine Unreal. Không có cân bằng tướng hay tộc hệ Set 18 — toàn bộ số liệu đã chốt qua chuỗi PBE 18.1x → 18.1ah. Thay đổi nằm ở tầng hệ thống: Vòng Đi Chợ trở lại và có cơ hội ra tướng giá cao hơn, đơn vị không còn mất mục tiêu sau khi thoát Khống Chế, phần thưởng PvE bỏ lỡ được chuyển sang vòng sau, ba Vòng Kỳ Ngộ Khai Cuộc biến động mạnh bị thay bằng ba vòng thiên về trang bị. Bể Nâng Cấp xoay vòng lớn: loại 43, đưa trở lại 23, kèm 17 mục điều chỉnh trong đó Sinh Nhật Đoàn Tụ, Đội Hình Tối Ưu và Cầu Hồi Phục được làm lại, Chuẩn Xác và Uyển Chuyển đổi tên thành Ân Huệ Thách Đấu. Trang bị là mảng đổi nhiều nhất: 3 Trang Bị Ánh Sáng chỉnh chỉ số, 2 Tạo Tác cấm trở lại (Dị Vật Tai Ương, Thánh Kiếm Manazane), 12 Tạo Tác điều chỉnh và 3 Tạo Tác bị gỡ. Kèm cân bằng nhỏ cho Thần Không Gian (Mùa 17) vẫn chơi song song.',
  summaryOrigin: 'official',
  entries: [
    // ── Hệ thống ──────────────────────────────────────────────────
    {
      id: 'live181-mech-carousel',
      category: 'mechanic',
      kind: 'mechanic',
      name: 'Vòng Đi Chợ (Carousel)',
      changes: [
        { label: 'Vòng Đi Chợ', from: 'Không có trong Mùa 17', to: 'Trở lại' },
        {
          label: 'Nội dung vòng',
          from: 'Số lượng và giá tướng cố định',
          to: 'Có cơ hội ra nhiều tướng hơn và/hoặc tướng giá cao hơn',
        },
      ],
    },
    {
      id: 'live181-mech-targeting',
      category: 'mechanic',
      kind: 'mechanic',
      name: 'Chọn mục tiêu (Targeting)',
      changes: [
        {
          label: 'Sau khi thoát khỏi Khống Chế',
          from: 'Chọn lại mục tiêu, nhắm kẻ địch gần nhất',
          to: 'Giữ nguyên mục tiêu cũ',
        },
      ],
    },
    {
      id: 'live181-mech-pveloot',
      category: 'mechanic',
      kind: 'buff',
      name: 'Báu vật PvE (PVE Loot)',
      changes: [
        {
          label: 'Phần thưởng bỏ lỡ từ Giai đoạn 4-7 trở đi',
          from: 'Mất hẳn',
          to: 'Chuyển sang vòng PvE kế tiếp',
        },
      ],
    },
    {
      id: 'live181-mech-openingencounters',
      category: 'mechanic',
      kind: 'mechanic',
      name: 'Vòng Kỳ Ngộ Khai Cuộc (Opening Encounters)',
      changes: [
        {
          label: 'Thêm mới',
          from: '—',
          to: 'Khởi Đầu Với Gói Trang Bị Hoàn Chỉnh · Gói Đổi Lại · Lò Rèn Trang Bị',
        },
        {
          label: 'Loại bỏ',
          from: 'Đăng Ký Báu Vật · Gói Trang Bị Tạo Tác · Bắt Đầu Reroll',
          to: '—',
        },
      ],
    },
    {
      id: 'live181-mech-augmentcycling',
      category: 'mechanic',
      kind: 'mechanic',
      name: 'Xoay vòng Nâng Cấp (Augment Cycling)',
      note: 'Danh sách đầy đủ nằm trong patch note gốc',
      changes: [
        {
          label: 'Bể Nâng Cấp',
          from: 'Bể của Mùa 17',
          to: 'Loại bỏ 43 Nâng Cấp, đưa trở lại 23 Nâng Cấp',
        },
      ],
    },

    // ── Nâng Cấp ──────────────────────────────────────────────────
    {
      id: 'live181-aug-bandofthieves2',
      category: 'augment',
      kind: 'buff',
      name: 'Band of Thieves II',
      entityId: 'augment:da_bandofthievesii',
      changes: [{ label: 'Thời gian trễ', from: '6 vòng giao tranh người chơi', to: '5 vòng' }],
    },
    {
      id: 'live181-aug-backlineblueprint',
      category: 'augment',
      kind: 'mechanic',
      name: 'Backline Blueprint',
      entityId: 'augment:da_backlineblueprint',
      changes: [
        {
          label: 'Ấn nhận được',
          from: 'Khớp tộc/hệ liệt kê cuối cùng của tướng',
          to: 'Khớp tộc/hệ (class) của tướng',
        },
      ],
    },
    {
      id: 'live181-aug-frontlinefoundation',
      category: 'augment',
      kind: 'mechanic',
      name: 'Frontline Foundation',
      entityId: 'augment:da_frontlinefoundation',
      changes: [
        {
          label: 'Ấn nhận được',
          from: 'Khớp tộc/hệ liệt kê cuối cùng của tướng',
          to: 'Khớp tộc/hệ (class) của tướng',
        },
      ],
    },
    {
      id: 'live181-aug-birthdayreunion',
      category: 'augment',
      kind: 'rework',
      name: 'Birthday Reunion',
      entityId: 'augment:da_birthdayreunion',
      changes: [
        {
          label: 'Hiệu ứng',
          from: 'Nhận 1 tướng 2 vàng 2 sao ngẫu nhiên',
          to: 'Nhận 1 tướng 2 vàng 2 sao ngẫu nhiên · Cấp 6: 1 trang bị thành phần ngẫu nhiên · Cấp 9: 1 tướng 5 vàng 2 sao ngẫu nhiên',
        },
      ],
    },
    {
      id: 'live181-aug-bronzeforlife',
      category: 'augment',
      kind: 'buff',
      name: 'Tất Tay Bậc Đồng I/II (Bronze for Life I/II)',
      changes: [{ label: 'Khuếch Đại Sát Thương', from: '2%', to: '2.5%' }],
    },
    {
      id: 'live181-aug-buildabud',
      category: 'augment',
      kind: 'nerf',
      name: 'Tự Lập Đội (Build-a-Bud)',
      changes: [{ label: 'Vàng ban đầu', from: '10', to: '6' }],
    },
    {
      id: 'live181-aug-buriedtreasures2',
      category: 'augment',
      kind: 'buff',
      name: 'Kho Báu Chôn Giấu II (Buried Treasures II)',
      changes: [{ label: 'Số vòng nhận thưởng', from: '5', to: '6' }],
    },
    {
      id: 'live181-aug-challengersgrace',
      category: 'augment',
      kind: 'mechanic',
      name: "Challenger's Grace",
      entityId: 'augment:da_challengersgrace',
      note: '"Chuẩn Xác" cũng là từ khoá của chí mạng kỹ năng, dễ gây nhầm',
      changes: [
        {
          label: 'Tên gọi',
          from: 'Chuẩn Xác và Uyển Chuyển (Precision and Grace)',
          to: "Ân Huệ Thách Đấu (Challenger's Grace)",
        },
      ],
    },
    {
      id: 'live181-aug-comebackstory',
      category: 'augment',
      kind: 'nerf',
      name: 'Comeback Story',
      entityId: 'augment:da_comebackstory',
      changes: [
        { label: 'Tốc Độ Đánh mỗi Máu người chơi đã mất', from: '0.4%', to: '0.3%' },
      ],
    },
    {
      id: 'live181-aug-healingorbs',
      category: 'augment',
      kind: 'rework',
      name: 'Healing Orbs I/II',
      entityId: 'augment:da_healingorbsi',
      changes: [
        { label: 'Thời điểm hồi máu', from: 'Có độ trễ', to: 'Ngay lập tức' },
        {
          label: 'Chọn mục tiêu hồi máu',
          from: 'Đồng minh gần nhất',
          to: 'Đồng minh có % Máu thấp nhất trong 3 ô quanh mục tiêu (mặc định gần nhất nếu không có ai trong 3 ô)',
        },
      ],
    },
    {
      id: 'live181-aug-forgedinstrength',
      category: 'augment',
      kind: 'rework',
      name: 'Tôi Luyện Sức Mạnh (Forged in Strength)',
      changes: [
        { label: 'Ngưỡng Máu', from: '30', to: '35' },
        {
          label: 'Phần thưởng',
          from: '3 Tạo Tác ngẫu nhiên',
          to: '1 Tạo Tác · 1 trang bị hoàn chỉnh ngẫu nhiên · 2 thành phần ngẫu nhiên',
        },
      ],
    },
    {
      id: 'live181-aug-goinglong',
      category: 'augment',
      kind: 'nerf',
      name: 'Going Long',
      entityId: 'augment:da_goinglong',
      changes: [{ label: 'Vàng ngay lập tức', from: '16', to: '10' }],
    },
    {
      id: 'live181-aug-livingforge',
      category: 'augment',
      kind: 'nerf',
      name: 'Living Forge',
      entityId: 'augment:da_livingforge',
      changes: [{ label: 'Số vòng giữa mỗi Gói Trang Bị Tạo Tác', from: '9', to: '10' }],
    },
    {
      id: 'live181-aug-luxurysubscription',
      category: 'augment',
      kind: 'nerf',
      name: 'Luxury Subscription',
      entityId: 'augment:da_luxurysubscription',
      changes: [{ label: 'Vàng trong gói', from: '7', to: '3' }],
    },
    {
      id: 'live181-aug-maxbuild',
      category: 'augment',
      kind: 'rework',
      name: 'Max Build',
      entityId: 'augment:da_maxbuild',
      changes: [
        {
          label: 'Hiệu ứng',
          from: 'Hiệu ứng cũ của Mùa 17',
          to: '10 lượt đổi cửa hàng miễn phí · Cấp 9: thêm 3 lượt đổi và 1 Máy Sao Chép Tướng',
        },
      ],
    },
    {
      id: 'live181-aug-moneyhungryplus',
      category: 'augment',
      kind: 'buff',
      name: 'Money Hungry+',
      entityId: 'augment:da_moneyhungryplus',
      changes: [{ label: 'Vàng ban đầu', from: '10', to: '13' }],
    },
    {
      id: 'live181-aug-pandorasbench',
      category: 'augment',
      kind: 'mechanic',
      name: "Pandora's Bench",
      entityId: 'augment:da_pandorasbench',
      changes: [
        {
          label: 'Cách quay tướng',
          from: 'Quay độc lập, không xét số bản sao còn lại trong bể',
          to: 'Ít khả năng đổi ra tướng 2 sao khi bể tướng còn ít bản sao',
        },
      ],
    },
    {
      id: 'live181-aug-slightlymagical',
      category: 'augment',
      kind: 'mechanic',
      name: 'Quay Trúng Thưởng (Slightly Magical)',
      changes: [{ label: 'Mốc rút thưởng 6', from: 'Xẻng Vàng', to: 'Ấn ngẫu nhiên' }],
    },

    // ── Trang Bị Ánh Sáng ─────────────────────────────────────────
    {
      id: 'live181-item-radiantgargoyle',
      category: 'item',
      kind: 'buff',
      name: 'Thú Tượng Thạch Giáp Ánh Sáng (Radiant Gargoyle Stoneplate)',
      changes: [{ label: 'Máu', from: '300', to: '400' }],
    },
    {
      id: 'live181-item-radianthoj',
      category: 'item',
      kind: 'buff',
      name: 'Bàn Tay Công Lý Ánh Sáng (Radiant Hand of Justice)',
      changes: [{ label: 'SMCK/SMPT', from: '30', to: '35' }],
    },
    {
      id: 'live181-item-radiantsteadfast',
      category: 'item',
      kind: 'nerf',
      name: 'Trái Tim Kiên Định Ánh Sáng (Radiant Steadfast Heart)',
      changes: [{ label: 'Máu', from: '600', to: '500' }],
    },

    // ── Tạo Tác quay trở lại ──────────────────────────────────────
    {
      id: 'live181-item-forbiddenidol',
      category: 'item',
      kind: 'mechanic',
      name: 'Dị Vật Tai Ương (Forbidden Idol)',
      note: 'Tạo Tác quay trở lại',
      changes: [
        { label: 'Máu', from: '—', to: '400' },
        { label: 'Hồi Năng Lượng', from: '—', to: '2' },
        { label: 'Hiệu ứng', from: '—', to: '40% giá trị lá chắn chuyển thành Máu tối đa' },
      ],
    },
    {
      id: 'live181-item-manazane',
      category: 'item',
      kind: 'mechanic',
      name: 'Thánh Kiếm Manazane (Manazane)',
      note: 'Tạo Tác quay trở lại',
      changes: [
        { label: 'Sức Mạnh Công Kích', from: '—', to: '15%' },
        { label: 'Sức Mạnh Phép Thuật', from: '—', to: '15%' },
        { label: 'Hồi Năng Lượng', from: '—', to: '1' },
      ],
    },

    // ── Điều chỉnh Tạo Tác ────────────────────────────────────────
    {
      id: 'live181-item-aegisofdusk',
      category: 'item',
      kind: 'buff',
      name: 'Khiên Hoàng Hôn (Aegis of Dusk)',
      changes: [{ label: 'Sát thương theo Kháng Phép', from: '15%', to: '18%' }],
    },
    {
      id: 'live181-item-blightingjewel',
      category: 'item',
      kind: 'rework',
      name: 'Đá Hắc Hóa (Blighting Jewel)',
      changes: [
        { label: 'SMPT cơ bản', from: '60%', to: '30%' },
        { label: 'Năng lượng khi mục tiêu còn 0 Kháng Phép', from: '2', to: '4' },
      ],
    },
    {
      id: 'live181-item-dawncore',
      category: 'item',
      kind: 'rework',
      name: 'Lõi Bình Minh (Dawncore)',
      changes: [
        { label: 'SMCK/SMPT', from: '15', to: '20' },
        { label: 'Giảm Năng Lượng mỗi lần thi triển', from: '4%', to: '5%' },
        { label: 'Năng Lượng tối thiểu', from: '10', to: '15' },
        { label: 'Hồi Năng Lượng', from: '2', to: '1' },
      ],
    },
    {
      id: 'live181-item-fishbones',
      category: 'item',
      kind: 'rework',
      name: 'Pháo Xương Cá (Fishbones)',
      changes: [
        { label: 'Tầm Đánh', from: '—', to: '+2' },
        { label: 'SMCK/SMPT', from: '50%', to: '25%' },
      ],
    },
    {
      id: 'live181-item-eternalpact',
      category: 'item',
      kind: 'nerf',
      name: 'Khế Ước Vĩnh Hằng (Eternal Pact)',
      changes: [{ label: 'SMPT cơ bản', from: '40', to: '35' }],
    },
    {
      id: 'live181-item-hellfirehatchet',
      category: 'item',
      kind: 'rework',
      name: 'Rìu Hỏa Ngục (Hellfire Hatchet)',
      changes: [
        { label: 'Máu cơ bản', from: '150', to: '400' },
        { label: 'SMCK cơ bản', from: '20%', to: 'Loại bỏ' },
        { label: 'Tốc Độ Đánh mỗi 1% Máu đã mất', from: '1%', to: '1.5%' },
      ],
    },
    {
      id: 'live181-item-rapidfirecannon',
      category: 'item',
      kind: 'nerf',
      name: 'Đại Bác Liên Thanh (Rapid Firecannon)',
      changes: [{ label: 'Tốc Độ Đánh', from: '65%', to: '55%' }],
    },
    {
      id: 'live181-item-silvermeredawn',
      category: 'item',
      kind: 'rework',
      name: 'Chùy Bạch Ngân (Silvermere Dawn)',
      changes: [
        { label: 'Hút Máu Toàn Phần', from: '—', to: '30%' },
        { label: 'Sức Mạnh Công Kích', from: '140%', to: '125%' },
        { label: 'Giáp và Kháng Phép', from: '80', to: '30' },
      ],
    },
    {
      id: 'live181-item-statikkshiv',
      category: 'item',
      kind: 'rework',
      name: 'Dao Điện Statikk (Statikk Shiv)',
      changes: [
        { label: 'Số kẻ địch bị tia sét nảy trúng', from: '4', to: '6' },
        { label: 'Sát thương cơ bản', from: '30', to: '15' },
        { label: 'Sát thương tia sét theo SMPT', from: '50%', to: '35%' },
        { label: 'Tốc Độ Đánh', from: '50%', to: '40%' },
      ],
    },
    {
      id: 'live181-item-talismanofascension',
      category: 'item',
      kind: 'buff',
      name: 'Bùa Thăng Hoa (Talisman of Ascension)',
      changes: [{ label: 'Hồi Năng Lượng khi Thăng Hoa', from: '—', to: '12' }],
    },
    {
      id: 'live181-item-titanichydra',
      category: 'item',
      kind: 'nerf',
      name: 'Rìu Đại Mãng Xà (Titanic Hydra)',
      changes: [
        { label: '% SMCK cơ bản thành sát thương cộng thêm', from: '6%', to: '2%' },
      ],
    },
    {
      id: 'live181-item-witsend',
      category: 'item',
      kind: 'rework',
      name: "Đao Tím (Wit's End)",
      changes: [
        { label: 'Máu', from: '400', to: '300' },
        { label: 'Hồi máu cộng thêm', from: '30%', to: '25%' },
        {
          label: 'Sát thương phép cộng thêm',
          from: '30/30/45/65/86/100',
          to: '30/30/55/75/95/115',
        },
      ],
    },

    // ── Loại bỏ Tạo Tác ───────────────────────────────────────────
    {
      id: 'live181-item-deathsdefiance',
      category: 'item',
      kind: 'mechanic',
      name: "Vũ Khúc Tử Thần (Death's Defiance)",
      note: 'Gỡ khỏi game',
    },
    {
      id: 'live181-item-hullcrusher',
      category: 'item',
      kind: 'mechanic',
      name: 'Thần Búa Tiến Công (Hullcrusher)',
      note: 'Gỡ khỏi game',
    },
    {
      id: 'live181-item-snipersfocus',
      category: 'item',
      kind: 'mechanic',
      name: "Kính Nhắm Thiện Xạ (Sniper's Focus)",
      note: 'Gỡ khỏi game',
      icon: '/set18/assets/items/full/vntft_kinh-nham-thien-xa.png',
    },

    // ── Thần Không Gian (Mùa 17) ──────────────────────────────────
    {
      id: 'live181-mech-spacegods',
      category: 'mechanic',
      kind: 'mechanic',
      name: 'Thần Không Gian (Mùa 17)',
      note: 'Mùa 17 vẫn chơi được song song với Set 18',
      changes: [
        {
          label: 'Twisted Fate — số lần tung xúc xắc tối thiểu ở vòng 1-2',
          from: 'Không có sàn',
          to: '5',
        },
        { label: 'Milio — Năng Lượng', from: '0/30', to: '0/40' },
      ],
    },
  ],
};

export default report;
