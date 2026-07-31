// Nội dung phần "06 · Hiệu ứng" trên /mua-18 — biên soạn tay từ Set18/reports/TFT_Set18_Effect_Sources_VI.html,
// quét bổ sung toàn bộ kỹ năng tướng + mốc tộc/hệ + augment trong Set18/data/metatft_set18_vi.json (2026-08).
// Tham chiếu tướng/trait/augment qua `name` (tiếng Anh) khớp với set18ChampionByName/set18TraitByName/
// set18Augments trong set18-codex.ts để dùng chung icon, màu giá, tooltip có sẵn — chỉ trang bị (item) là
// dữ liệu độc lập vì set18-codex.ts chưa có mảng item.

export type Set18EffectSource =
  | { kind: 'champion'; name: string; form?: string; tag: string; quote: string }
  | { kind: 'trait'; name: string; tag: string; quote: string }
  | { kind: 'item'; name: string; nameEn: string; icon: string; tag: string; quote: string }
  | { kind: 'augment'; name: string; tag: string; quote: string };

export type Set18EffectGroup = {
  label: string;
  note?: string;
  sources: Set18EffectSource[];
};

export type Set18EffectSpotlight = {
  traitName: string;
  title: string;
  badge: string;
  body: string;
  fine: string;
};

export type Set18LuxFormRow = {
  form: string;
  trait: string;
  bonus: string;
};

export type Set18Effect = {
  id: string;
  name: string;
  tag: string;
  description: string;
  sources?: Set18EffectSource[];
  groups?: Set18EffectGroup[];
  note?: string;
  spotlights?: Set18EffectSpotlight[];
  luxForms?: Set18LuxFormRow[];
  luxNote?: string;
};

export type Set18EffectCategory = {
  id: string;
  index: string;
  accent: string;
  eyebrow: string;
  title: string;
  effects: Set18Effect[];
};

const ITEM_ICON = (file: string) => `/set18/assets/items/full/${file}`;

export const set18EffectCategories: Set18EffectCategory[] = [
  {
    id: 'giam-phong-thu',
    index: 'A',
    accent: '#d23a22',
    eyebrow: 'Ưu tiên 1 · Bào mòn sức chống chịu của địch',
    title: 'Giảm Phòng Thủ & Hồi Phục Của Địch',
    effects: [
      {
        id: 'giam-hoi-mau-dich',
        name: 'Giảm Hồi Máu Địch',
        tag: 'Vết Thương Sâu · Wound',
        description:
          'Giảm % lượng hồi máu mà mục tiêu nhận được trong thời gian hiệu lực — vô hiệu hóa một phần các cơ chế hồi máu/tự chữa lành của đối phương.',
        sources: [
          {
            kind: 'trait',
            name: 'Inferno',
            tag: 'Tộc/Hệ · Inferno',
            quote:
              'Sát thương từ tướng Hỏa Ngục luôn kèm Vết Thương Sâu 33% trong 4 giây — cố định, không tăng theo mốc kích hoạt (khác với % Thiêu Đốt).',
          },
          {
            kind: 'champion',
            name: 'Cinderling',
            tag: 'Cinderling · triệu hồi Quái Rừng',
            quote: 'Lá Sắc Lẹm áp Vết Thương Sâu 20% cùng lúc với Thiêu Đốt, trong 4 giây.',
          },
        ],
      },
      {
        id: 'giam-giap-khang-phep-pt',
        name: 'Giảm Giáp / Kháng Phép Địch (%)',
        tag: 'Phân Tách & Cào Xé · Sunder / Shred',
        description:
          'Phân Tách (Sunder) giảm % Giáp, Cào Xé (Shred) giảm % Kháng Phép của mục tiêu trong thời gian hiệu lực — tác động mạnh hơn trừ thẳng lên tướng vốn đã có nhiều phòng thủ, vì trừ theo phần trăm chỉ số hiện tại.',
        sources: [
          {
            kind: 'trait',
            name: 'Caustic',
            tag: 'Tộc/Hệ · Caustic · gắn riêng Kog\'Maw',
            quote: "Toàn bộ sát thương của Kog'Maw Phân Tách + Cào Xé mục tiêu 30% trong 4 giây.",
          },
          {
            kind: 'champion',
            name: 'Kayle',
            tag: 'Phán Quyết Mặt Trời · Thăng Hoa 2',
            quote: 'Từ mốc thăng hoa 2, đòn đánh của Kayle Cào Xé 20% Kháng Phép mục tiêu trong 2 giây.',
          },
          {
            kind: 'item',
            name: 'Cung Xanh',
            nameEn: 'Last Whisper',
            icon: ITEM_ICON('da_lastwhisper.png'),
            tag: 'Trang bị',
            quote: 'Sát thương Kỹ Năng và Đòn Đánh của chủ sở hữu Phân Tách 30% Giáp mục tiêu trong 3 giây, không cộng dồn.',
          },
          {
            kind: 'item',
            name: 'Trượng Hư Vô',
            nameEn: 'Void Staff',
            icon: ITEM_ICON('da_voidstaff.png'),
            tag: 'Trang bị',
            quote: 'Sát thương Kỹ Năng và Đòn Đánh của chủ sở hữu Cào Xé 30% Kháng Phép mục tiêu trong 5 giây, không cộng dồn.',
          },
          {
            kind: 'item',
            name: 'Giáp Vai Nguyệt Thần',
            nameEn: 'Evenshroud',
            icon: ITEM_ICON('da_evenshroud.png'),
            tag: 'Trang bị',
            quote:
              'Kích hoạt tức thì: Phân Tách 30% Giáp mọi kẻ địch trong bán kính 2 ô, đồng thời cho chủ sở hữu Giáp/Kháng Phép cộng thêm đầu trận.',
          },
          {
            kind: 'item',
            name: 'Nỏ Sét',
            nameEn: 'Ionic Spark',
            icon: ITEM_ICON('da_ionicspark.png'),
            tag: 'Trang bị',
            quote: 'Kích hoạt tức thì: Cào Xé 30% Kháng Phép mọi kẻ địch trong bán kính 2 ô, cộng thêm sát thương phép khi kẻ địch dùng chiêu.',
          },
        ],
        note: 'Ngoài ra 2 charm ngẫu nhiên cũng gây cả hai: Trừng Trị (Infliction — kèm Làm Chậm, Thiêu Đốt) và Phá Giáp Trụ (Tattered Armor — 30% hoặc 90% ở bản Prismatic).',
      },
      {
        id: 'giam-giap-khang-phep-flat',
        name: 'Giảm Giáp / Kháng Phép Địch (Trừ Thẳng)',
        tag: 'Flat reduction',
        description:
          'Trừ thẳng một số điểm chỉ số phòng thủ cố định của mục tiêu — không theo %, nên hiệu quả ổn định bất kể mục tiêu đang có bao nhiêu Giáp/Kháng Phép.',
        sources: [
          {
            kind: 'champion',
            name: 'Lux',
            form: 'Tiên Hắc Ám',
            tag: 'Thưởng Coven',
            quote: 'Mục tiêu trúng laser giảm 12 Giáp và Kháng Phép đến hết giao tranh.',
          },
          {
            kind: 'champion',
            name: 'Gnar',
            tag: 'Đột Biến Gien (dạng khổng lồ)',
            quote: 'Kẻ địch trong bán kính 2 ô giảm 15/20/100 Giáp và Kháng Phép, kèm Choáng 1s.',
          },
        ],
      },
    ],
  },
  {
    id: 'sat-thuong-cong-don',
    index: 'B',
    accent: '#ff5a1f',
    eyebrow: 'Ưu tiên 2 · Sát thương theo thời gian & khuếch đại',
    title: 'Sát Thương Cộng Dồn & Khuếch Đại',
    effects: [
      {
        id: 'thieu-dot',
        name: 'Thiêu Đốt',
        tag: 'Burn',
        description:
          'Sát thương chuẩn (true damage) mỗi giây bằng % Máu tối đa của mục tiêu, không bị Giáp/Kháng Phép giảm bớt. Nhiều nguồn Thiêu Đốt cộng dồn với nhau.',
        sources: [
          {
            kind: 'trait',
            name: 'Inferno',
            tag: 'Tộc/Hệ · Inferno',
            quote:
              'Sát thương từ tướng Hỏa Ngục luôn kèm Thiêu Đốt. Mốc (2) 1% · (5) 2% · (7) 3% Máu tối đa/giây trong 4 giây. 6 tướng hệ: Akali, Varus, Shen, Amumu, Lux, Kennen.',
          },
          {
            kind: 'champion',
            name: 'Cinderling',
            tag: 'Cinderling · triệu hồi Quái Rừng',
            quote:
              'Lá Sắc Lẹm: 5 chiếc lá đồng loạt tấn công mục tiêu, gây 300/450/680 sát thương vật lý và áp Vết Thương Sâu 20% + Thiêu Đốt 1% trong 4 giây.',
          },
          {
            kind: 'champion',
            name: 'The Elder Dragon',
            tag: 'Elder Dragon · Bá Chủ / Quái Rừng',
            quote: 'Cả nội tại lẫn Phun Lửa (Flame Breath) đều Thiêu Đốt 4 giây, gây thêm 2% Máu tối đa/giây bằng sát thương vật lý.',
          },
        ],
      },
      {
        id: 'suy-yeu',
        name: 'Suy Yếu',
        tag: 'Vulnerable / Weaken',
        description:
          'Trong Set 18, "Suy Yếu" là tên hiển thị dùng chung cho hai cơ chế khác nhau — cả hai chỉ tồn tại trên Lux, mỗi phiên bản một kiểu, nên rất dễ nhầm nếu chỉ đọc tên hiệu ứng.',
        sources: [
          {
            kind: 'champion',
            name: 'Lux',
            form: 'Mặt Trăng',
            tag: 'Thưởng Lunar · tăng sát thương gánh chịu',
            quote: 'Kẻ địch trúng laser Suy Yếu 12% trong 6 giây — tăng sát thương mà chúng phải nhận.',
          },
          {
            kind: 'champion',
            name: 'Lux',
            form: 'Mặt Trời',
            tag: 'Thưởng Solar · giảm sát thương gây ra',
            quote: 'Kẻ địch trúng laser Suy Yếu 12% trong 6 giây — giảm sát thương mà chúng gây ra.',
          },
        ],
      },
    ],
  },
  {
    id: 'khong-che',
    index: 'C',
    accent: '#2a44c8',
    eyebrow: 'Ưu tiên 3 · Vô hiệu hóa hoặc bẻ nhịp giao tranh',
    title: 'Khống Chế',
    effects: [
      {
        id: 'choang',
        name: 'Choáng',
        tag: 'Stun',
        description:
          'Vô hiệu hóa hoàn toàn mục tiêu (không di chuyển, không đánh, không dùng chiêu) trong thời gian hiệu lực. Trong Set 18 chia rõ theo cách nhắm: đơn mục tiêu hay diện rộng.',
        groups: [
          {
            label: 'Đơn mục tiêu',
            sources: [
              { kind: 'champion', name: 'Leona', tag: 'Nện Khiên', quote: 'Đập vào mục tiêu hiện tại, gây sát thương phép và Choáng 1.5s.' },
              {
                kind: 'champion',
                name: 'Alistar',
                tag: 'Tiếng Gầm Chiến Thắng',
                quote: 'Hồi máu, giải hiệu ứng khống chế cho bản thân, sau đó nện mục tiêu hiện tại và Choáng 1.5s.',
              },
              {
                kind: 'champion',
                name: 'Hecarim',
                tag: 'Nhiếp Hồn Trận',
                quote: 'Ném lựu đạn vào kẻ địch gần nhất, gây sát thương phép và Choáng chúng.',
              },
            ],
          },
          {
            label: 'Diện rộng',
            sources: [
              {
                kind: 'champion',
                name: 'Amumu',
                tag: 'Giận Dữ',
                quote: 'Gây sát thương phép và Choáng mọi kẻ địch trong bán kính 2 ô, 1s — kéo dài hơn nếu mục tiêu đang Bỏng.',
              },
              {
                kind: 'champion',
                name: 'Gnar',
                tag: 'Đột Biến Gien (dạng khổng lồ)',
                quote: 'Nhảy vào nhóm đông kẻ địch nhất, gây sát thương và Choáng bán kính 2 ô trong 1s, kèm giảm Giáp/Kháng Phép.',
              },
              {
                kind: 'champion',
                name: "Rek'Sai",
                tag: 'Nhổ Rễ',
                quote: 'Lao lên từ mặt đất, Choáng mọi kẻ địch liền kề trong 1s.',
              },
              {
                kind: 'champion',
                name: 'Lux',
                form: 'Kỳ Quái',
                tag: 'Thưởng Blackthorn',
                quote: 'Cầu Vồng Tối Thượng Choáng 1s mọi mục tiêu bị laser trúng đòn — riêng phiên bản Kỳ Quái mới có thưởng này.',
              },
            ],
          },
          {
            label: 'Trang bị kích hoạt',
            sources: [
              {
                kind: 'item',
                name: 'Chùy Bạch Ngân',
                nameEn: 'Silvermere Dawn',
                icon: ITEM_ICON('da_artifact_silvermeredawn.png'),
                tag: 'Trang bị',
                quote: 'Chủ sở hữu miễn nhiễm Choáng; đòn đánh của chủ sở hữu Choáng kẻ địch 0.8s (Tốc Độ Đánh cố định 0.5).',
              },
              {
                kind: 'item',
                name: 'Kính Nhắm Ma Pháp',
                nameEn: 'Horizon Focus',
                icon: ITEM_ICON('da_artifact_horizonfocus.png'),
                tag: 'Trang bị · ăn theo Choáng',
                quote:
                  'Không tự gây Choáng, nhưng khi chủ sở hữu Làm Choáng kẻ địch sẽ triệu hồi sét đánh trúng, gây sát thương phép bằng 30% Máu tối đa mục tiêu.',
              },
            ],
          },
          {
            label: 'Ghi chú · nhắm theo số lượng cố định (khác Choáng diện rộng)',
            note: 'Không gây Choáng, nhưng 2 tướng này nhắm đúng 3 kẻ địch gần nhất theo số lượng thay vì bán kính.',
            sources: [
              {
                kind: 'champion',
                name: 'Alune',
                tag: 'Trăng Mờ',
                quote: 'Chia 9 mảnh trăng đều cho 3 kẻ địch gần nhất.',
              },
              {
                kind: 'champion',
                name: 'Diana',
                tag: 'Lá Chắn Nhợt Nhạt',
                quote: 'Phóng cầu ánh trăng về phía 3 kẻ địch gần nhất.',
              },
            ],
          },
        ],
      },
      {
        id: 'khieu-khich',
        name: 'Khiêu Khích',
        tag: 'Taunt',
        description: 'Buộc kẻ địch trong tầm phải đổi mục tiêu tấn công sang tướng đang khiêu khích — dùng để hút đòn đánh, bảo vệ đội hình phía sau.',
        sources: [
          {
            kind: 'champion',
            name: 'Rammus',
            tag: 'Thế Thủ',
            quote:
              'Khiêu khích, buộc kẻ địch tấn công Rammus trong 4 giây, đồng thời nhận Lá Chắn cùng 60 Giáp/Kháng Phép. Khi Lá Chắn vỡ, gây sát thương vật lý bán kính 2 ô.',
          },
        ],
      },
      {
        id: 'ngu',
        name: 'Ngủ',
        tag: 'Sleep',
        description:
          'Vô hiệu hóa mục tiêu tương tự Choáng, nhưng có thể bị hủy sớm nếu mục tiêu nhận đủ sát thương trong lúc đang ngủ — đổi lại chịu thêm sát thương khi "tỉnh dậy".',
        sources: [
          {
            kind: 'champion',
            name: 'Lillia',
            tag: 'Khúc Ru Rừng Thẳm',
            quote:
              'Hồi máu và phóng bướm khiến mục tiêu trúng chiêu Ngủ 1.5s. Nếu nhận đủ 1000 sát thương trong lúc ngủ, mục tiêu tỉnh dậy sớm và chịu thêm 10% sát thương phép theo Máu tối đa.',
          },
        ],
      },
      {
        id: 'lam-cham',
        name: 'Làm Chậm',
        tag: 'Slow',
        description: 'Giảm Tốc Độ Đánh của mục tiêu trong thời gian hiệu lực — không khống chế hoàn toàn như Choáng/Ngủ, chỉ làm giảm tốc độ đánh.',
        sources: [
          {
            kind: 'champion',
            name: 'Karma',
            tag: 'Liên Kết Nghiệp Duyên',
            quote: 'Kẻ địch trong bán kính 1 ô quanh mục tiêu bị Làm Chậm 30% trong 2 giây.',
          },
          {
            kind: 'champion',
            name: 'Gromp',
            tag: 'Bong Bóng Ợ Hơi',
            quote: 'Dạng biến hình (Bộ Chuyển Đổi) Làm Chậm mạnh mục tiêu trúng chiêu.',
          },
          {
            kind: 'item',
            name: 'Găng Đấu Sĩ',
            nameEn: 'Mittens',
            icon: ITEM_ICON('da_artifact_mittens.png'),
            tag: 'Trang bị · miễn nhiễm, không gây hiệu ứng',
            quote: 'Chủ sở hữu miễn nhiễm Làm Chậm, Thiêu Đốt và Vết Thương Sâu — phòng ngự chéo cả 3 hiệu ứng ở nhóm A và B.',
          },
        ],
      },
    ],
  },
  {
    id: 'ho-tro-dong-minh',
    index: 'D',
    accent: '#1e9e57',
    eyebrow: 'Ưu tiên 4 · Buff chỉ số & hồi máu cho tướng nhà',
    title: 'Hỗ Trợ Đồng Minh',
    effects: [
      {
        id: 'buff-giap-khang-phep',
        name: 'Giáp & Kháng Phép',
        tag: 'Armor & MR',
        description: 'Tăng thẳng chỉ số phòng thủ cho đồng minh hoặc cả đội — thường đến từ tộc/hệ tướng đỡ đòn hoặc augment cộng chỉ số đầu trận.',
        sources: [
          {
            kind: 'trait',
            name: 'Defender',
            tag: 'Tộc/Hệ · Vệ Quân',
            quote: 'Đội của bạn nhận 12 Giáp và Kháng Phép; tướng Vệ Quân nhận nhiều hơn. Mốc (2) 25 · (4) 55 · (6) 110.',
          },
          {
            kind: 'augment',
            name: 'Plot Armor',
            tag: 'Nâng cấp · tăng theo Máu',
            quote: 'Đội của bạn nhận 8 Giáp và Kháng Phép; khi còn dưới 50% Máu, hiệu ứng tăng lên 40.',
          },
          {
            kind: 'augment',
            name: 'Twin Guardians',
            tag: 'Nâng cấp · theo đội hình 2 hàng đầu',
            quote: 'Đội của bạn nhận 2 Giáp và Kháng Phép với mỗi đồng minh bắt đầu giao tranh ở 2 hàng đầu.',
          },
        ],
      },
      {
        id: 'buff-toc-do-danh',
        name: 'Tốc Độ Đánh',
        tag: 'Attack Speed',
        description: 'Tăng nhịp đánh cho đồng minh — có thể là buff tức thời, buff cộng dồn theo thời gian, hoặc buff nhắm vào 1 đồng minh cụ thể sau khi đủ điều kiện.',
        sources: [
          {
            kind: 'trait',
            name: 'Rapidfire',
            tag: 'Tộc/Hệ · Liên Kích',
            quote: 'Đội của bạn nhận thêm 10% Tốc Độ Đánh; tướng Liên Kích cộng dồn thêm theo mỗi đòn đánh, tối đa 10 lần.',
          },
          {
            kind: 'augment',
            name: 'Clockwork Accelerator',
            tag: 'Nâng cấp · cộng dồn theo thời gian',
            quote: 'Đội của bạn được tăng 10% Tốc Độ Đánh sau mỗi 3 giây giao tranh.',
          },
          {
            kind: 'champion',
            name: 'Shen',
            tag: 'Lá Chắn Kiếm Khí · buff 1 đồng minh chịu sát thương',
            quote: 'Trao Lá Chắn cho Shen và 1 đồng minh chịu sát thương gần đó; 3 đòn đánh tiếp theo của họ nhận 40% Tốc Độ Đánh.',
          },
          {
            kind: 'champion',
            name: 'Rakan',
            tag: 'Điệu Vũ Mê Hồn · buff đồng minh gây sát thương nhiều nhất',
            quote: 'Tự nhận Lá Chắn, sau đó ban 1.9/2/2.3 Tốc Độ Đánh (giảm dần 4 giây) cho đồng minh đã gây nhiều sát thương nhất trận.',
          },
        ],
      },
      {
        id: 'buff-ad-ap',
        name: 'Sức Mạnh Công Kích & Phép Thuật',
        tag: 'AD & AP',
        description: 'Tăng sát thương đầu ra cho đồng minh — theo tộc/hệ (chỉ tướng cùng hệ), theo augment (cả đội), hoặc cả hai chỉ số cùng lúc.',
        sources: [
          {
            kind: 'trait',
            name: 'Spellweaver',
            tag: 'Tộc/Hệ · Thuật Sư · Sức Mạnh Phép Thuật',
            quote: 'Đội của bạn nhận 10% Sức Mạnh Phép Thuật; tướng Thuật Sư nhận nhiều hơn và cộng dồn thêm mỗi lần thi triển Kỹ Năng.',
          },
          {
            kind: 'trait',
            name: 'Blossom',
            tag: 'Tộc/Hệ · Hoa Linh · cả AD lẫn AP',
            quote: 'Tướng Hoa Linh nhận Sức Mạnh Công Kích, Sức Mạnh Phép Thuật và 12% Máu tối đa sau giao tranh.',
          },
          {
            kind: 'augment',
            name: 'Focused Fire',
            tag: 'Nâng cấp · Sức Mạnh Công Kích, cộng dồn',
            quote: 'Đội của bạn nhận thêm 10% Sức Mạnh Công Kích; cứ mỗi 5 giây nhận thêm 5% nữa.',
          },
          {
            kind: 'augment',
            name: 'Tons of Stats!',
            tag: 'Nâng cấp · cộng đủ mọi chỉ số',
            quote: 'Đội của bạn nhận thêm Máu, Sức Mạnh Công Kích, Sức Mạnh Phép Thuật, Giáp, Kháng Phép, Tốc Độ Đánh và Năng Lượng cùng lúc.',
          },
        ],
      },
      {
        id: 'buff-hoi-mau',
        name: 'Hồi Máu & Hút Máu',
        tag: 'Healing & Omnivamp',
        description: 'Trả lại Máu cho đồng minh theo thời gian, theo sát thương gây ra, hoặc qua Hút Máu Toàn Phần (Omnivamp) áp dụng cho mọi nguồn sát thương của cả đội.',
        sources: [
          {
            kind: 'champion',
            name: 'Alistar',
            tag: 'Tiếng Gầm Chiến Thắng · hồi máu đồng minh máu thấp',
            quote: 'Tự hồi máu, giải khống chế cho bản thân, rồi hồi thêm 80/105/130 Máu cho 2 đồng minh có % Máu thấp nhất.',
          },
          {
            kind: 'trait',
            name: 'Fae',
            tag: 'Tộc/Hệ · Tiên Linh · hồi máu khi thấp Máu',
            quote: 'Sau khi tụt xuống dưới 50% Máu, tướng Tiên Linh hồi máu theo mỗi Pix đã thu hút. Mốc (2) 5% · (4) 8%.',
          },
          {
            kind: 'augment',
            name: 'Celestial Blessing II',
            tag: 'Nâng cấp · Omnivamp cả đội',
            quote: 'Đội của bạn nhận 18% Hút Máu Toàn Phần; lượng hồi máu phụ trội chuyển thành Lá Chắn, tối đa 400 Máu.',
          },
        ],
      },
      {
        id: 'buff-la-chan',
        name: 'Lá Chắn',
        tag: 'Shield',
        description: 'Hấp thụ sát thương tạm thời cho đồng minh — kích hoạt ngay khi vào giao tranh, khi đồng minh xuống thấp Máu, hoặc nhắm theo bán kính quanh người dùng chiêu.',
        sources: [
          {
            kind: 'champion',
            name: 'Taric',
            tag: 'Lục Bảo Huy Hoàng · khiên đồng minh theo bán kính',
            quote: 'Lần đầu Taric hoặc đồng minh ghép cặp dưới 50% Máu, tạo Lá Chắn cho mọi đồng minh trong bán kính 3 ô trong 3 giây.',
          },
          {
            kind: 'champion',
            name: 'Ivern',
            tag: 'Hạt Hư Hỏng · khiên + khuếch đại sát thương',
            quote: 'Ban Lá Chắn và 10% Khuếch Đại Sát Thương trong 6 giây cho 2 đồng minh gần nhất; đủ 6 lần thi triển còn cộng dồn 100% Tốc Độ Đánh cho mục tiêu.',
          },
        ],
      },
      {
        id: 'buff-chong-chiu',
        name: 'Chống Chịu',
        tag: 'Durability',
        description: 'Giảm % sát thương nhận vào cho đồng minh — mạnh hơn Giáp/Kháng Phép thông thường vì áp dụng lên mọi loại sát thương, kể cả chuẩn (true damage).',
        sources: [
          {
            kind: 'trait',
            name: 'Vanguard',
            tag: 'Tộc/Hệ · Tiền Phong · mốc cao nhất',
            quote: 'Đầu giao tranh và khi còn 50% Máu, nhận Lá Chắn theo Máu tối đa; mốc (6) 45% Lá Chắn kèm 8% Chống Chịu khi đang có khiên.',
          },
          {
            kind: 'augment',
            name: 'Gilded Steel',
            tag: 'Nâng cấp · theo đội hình có tướng 5 vàng',
            quote: 'Nếu đội hình có ít nhất 1 tướng 5 vàng, các tướng 1–4 vàng còn lại nhận 8% Chống Chịu.',
          },
        ],
      },
    ],
  },
  {
    id: 'dac-biet',
    index: 'E',
    accent: '#6b5aa8',
    eyebrow: 'Ưu tiên 5 · Thay đổi khung đội hình thay vì chỉ số trận đấu',
    title: 'Hiệu Ứng Đặc Biệt',
    effects: [
      {
        id: 'board-moc-toc-he',
        name: 'Board / Mốc Tộc Hệ',
        tag: 'Board / Trait Bonus',
        description:
          'Các cơ chế hiếm trong Set 18 tác động trực tiếp lên khung đội hình hoặc mốc tộc/hệ, thay vì chỉ gây sát thương hay khống chế — đến từ cả trait lẫn augment.',
        spotlights: [
          {
            traitName: 'Avatar',
            title: 'Nhân đôi 1 mốc tộc/hệ',
            badge: 'Thế Thần · Avatar',
            body:
              'Lux là tướng Thế Thần duy nhất trong Set 18. Cô mang một trong 9 Tộc/Hệ (chọn qua phiên bản/trang bị), và Tộc/Hệ đó được tính gấp đôi cho các mốc thưởng — gần như "cộng thêm 1 tướng ảo" vào đúng tộc/hệ đang cần mốc. Chỉ 1 người chơi được sở hữu Thế Thần theo mỗi Tộc/Hệ.',
            fine: 'Nguồn: trait "Thế Thần" (Avatar), duy nhất — gắn riêng cho Lux (5 vàng).',
          },
          {
            traitName: 'Apex Predator',
            title: 'Chiếm 2 ô đổi lấy sức mạnh',
            badge: 'Bá Chủ · Apex Predator',
            body:
              'Rồng Ngàn Tuổi (Elder Dragon) chiếm 2 ô đội hình thay vì 1, đổi lại cộng thẳng +2 mốc vào tộc Quái Rừng — coi như một tướng "đếm gấp đôi" cho tộc/hệ mà không cần thêm quân số thật.',
            fine: 'Nguồn: trait "Bá Chủ" (Apex Predator), gắn riêng cho Rồng Ngàn Tuổi (5 vàng). Cùng mẫu hình "chiếm 2 ô đổi sức mạnh" còn có augment Kim Long (The Golden Dragon) — tướng mang Giáp Đại Hãn chiếm 2 ô, đổi lại nhận thêm Máu và % Chống Chịu.',
          },
          {
            traitName: 'Riftbeast',
            title: '+2 số lượng tướng tối đa',
            badge: 'Quái Rừng · mốc (10)',
            body:
              'Đủ 10 tướng Quái Rừng trên bàn mở khóa mốc cao nhất của tộc Quái Rừng (Riftbeast): toàn đội được cộng thẳng +2 ô tướng tối đa — cơ chế hiếm trong Set 18 tăng sức chứa đội hình thay vì chỉ tăng chỉ số.',
            fine: 'Nguồn: trait "Quái Rừng" (Riftbeast), mốc kích hoạt ở 10 tướng hệ. Cũng đạt được qua augment Vương Miện Hắc Hóa (Cursed Crown, Prismatic) — kèm 4% Chống Chịu, đổi lại nhận gấp đôi sát thương lên Linh Thú khi thua giao tranh.',
          },
        ],
        luxForms: [
          { form: 'Kỳ Quái', trait: 'Blackthorn', bonus: 'Làm Choáng mục tiêu trúng đòn trong 1 giây.' },
          { form: 'Hoa Linh', trait: 'Blossom', bonus: 'Mục tiêu đầu tiên trúng đòn nhận thêm 15% sát thương.' },
          { form: 'Tiên Hắc Ám', trait: 'Coven', bonus: 'Giảm Giáp và Kháng Phép của mục tiêu trúng chiêu đi 12 đến hết giao tranh.' },
          { form: 'Thần Rừng', trait: 'Elderwood', bonus: 'Toàn đội nhận thêm 5% Máu tối đa đến hết giao tranh.' },
          { form: 'Tiên Linh', trait: 'Fae', bonus: 'Hồi máu đồng minh máu thấp nhất bằng 18% sát thương kỹ năng đã gây.' },
          { form: 'Hỏa Ngục', trait: 'Inferno', bonus: 'Hồi lại 8 năng lượng mỗi lần tham gia hạ gục.' },
          { form: 'Mặt Trăng', trait: 'Lunar', bonus: 'Gây Suy Yếu 12% lên kẻ địch trúng chiêu trong 6 giây (tăng sát thương gánh chịu).' },
          { form: 'Nguyên Sinh', trait: 'Primal', bonus: 'Bản thân nhận 60% Tốc Độ Đánh trong 6 giây sau khi thi triển.' },
          { form: 'Mặt Trời', trait: 'Solar', bonus: 'Làm Suy Yếu kẻ địch trúng đòn đi 12% trong 6 giây (giảm sát thương gây ra).' },
        ],
        luxNote:
          'Kỹ năng gốc — Cầu Vồng Tối Thượng — giống nhau ở mọi phiên bản: bắn laser vào hướng đông kẻ địch nhất, gây 370/580/5000 sát thương phép, giảm 20%/kẻ địch trúng chiêu (tối thiểu 40%). Nội tại: đồng minh cùng Tộc/Hệ Thế Thần đang chọn nhận năng lượng khi Lux thi triển.',
      },
    ],
  },
];
