// Nội dung phần "06 · Hiệu ứng" trên /mua-18 — soạn từ 3 nguồn dữ liệu trong game, quét toàn bộ
// Set18/data + src/content/set18/*.ts (36 tộc/hệ, 65 tướng + 20 dạng phụ, 176 linh hỏa):
//   · trait      → set18-traits.ts (descriptionVi + bullet từng mốc kích hoạt)
//   · champion   → set18-champions.ts (abilityVi, forms[].abilityHtmlVi cho tướng nhiều dạng)
//   · wisp       → set18-wisps.ts (descriptionVi)
// Cố ý KHÔNG lấy nguồn từ nâng cấp (augment) và trang bị (item): hai nguồn đó đã có mục riêng, và
// phần này chỉ mô tả hiệu ứng đến từ khung đội hình cố định — tộc/hệ, kỹ năng tướng, linh hỏa.
//
// Tham chiếu:
//   · trait/champion qua `name` (tiếng Anh) — khớp set18TraitByName / set18ChampionByName để dùng
//     chung icon, màu giá, tooltip có sẵn.
//   · wisp qua `name` = `nameVi` (tiếng Việt), KHÔNG dùng tên tiếng Anh: cột `name` trong
//     set18-wisps.ts đang lệch hàng so với `nameVi`/`descriptionVi` (lỗi ghép cặp từ lúc scrape,
//     xem Set18/assets/wisps/wisps.json). Cặp nameVi + descriptionVi thì khớp nhau đúng.

export type Set18EffectSource =
  | { kind: 'champion'; name: string; form?: string; tag: string; quote: string }
  | { kind: 'trait'; name: string; tag: string; quote: string }
  | { kind: 'wisp'; name: string; tag: string; quote: string };

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
            tag: 'Tộc/Hệ · Hỏa Ngục',
            quote:
              'Sát thương từ tướng Hỏa Ngục luôn kèm Vết Thương Sâu 33% trong 4 giây — cố định, không tăng theo mốc kích hoạt (khác với % Thiêu Đốt).',
          },
          {
            kind: 'champion',
            name: 'Cinderling',
            tag: 'Lá Sắc Lẹm',
            quote: 'Lá Sắc Lẹm áp Vết Thương Sâu 20% cùng lúc với Thiêu Đốt 1%, trong 4 giây.',
          },
          {
            kind: 'wisp',
            name: 'Dương Hỏa Thuật',
            tag: 'Linh hỏa · Giao Tranh T1',
            quote: 'Gây Thiêu Đốt và Vết Thương Sâu lên kẻ địch trong 10 giây (15 giây sau nâng cấp Hoa Linh).',
          },
        ],
        note: 'Chỉ 3 nguồn này áp Vết Thương Sâu — nếu địch có nhiều hồi máu/hút máu mà bạn không chơi Hỏa Ngục, linh hỏa là cách duy nhất để bù.',
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
            tag: "Tộc/Hệ · Ăn Mòn · gắn riêng Kog'Maw",
            quote: "Toàn bộ sát thương của Kog'Maw Cào Xé và Phân Tách mục tiêu 30% trong 4 giây.",
          },
          {
            kind: 'champion',
            name: 'Kayle',
            tag: 'Phán Quyết Mặt Trời · Thăng Hoa 2',
            quote: 'Từ mốc thăng hoa 2, đòn đánh của Kayle Cào Xé 20% Kháng Phép mục tiêu trong 2 giây.',
          },
          {
            kind: 'wisp',
            name: 'Phá Giáp Trụ',
            tag: 'Linh hỏa · Giao Tranh T1',
            quote: 'Gây Cào Xé và Phân Tách 30% lên kẻ địch trong 10 giây (15 giây sau nâng cấp Hoa Linh).',
          },
          {
            kind: 'wisp',
            name: 'Trừng Trị',
            tag: 'Linh hỏa · Giao Tranh T3',
            quote: 'Gộp 4 hiệu ứng cùng lúc: Làm Chậm, Thiêu Đốt, Cào Xé và Phân Tách lên kẻ địch trong 8 giây (14 giây sau nâng cấp).',
          },
        ],
        note: 'Đây là hiệu ứng khan hiếm nhất trong Set 18 — chỉ 1 tộc/hệ Đặc biệt và 1 tướng có sẵn, còn lại phải mua bằng linh hỏa.',
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
            tag: 'Thưởng Tiên Hắc Ám',
            quote: 'Mục tiêu trúng laser giảm 12 Giáp và Kháng Phép cho đến hết giao tranh.',
          },
          {
            kind: 'champion',
            name: 'Gnar',
            tag: 'Đột Biến Gien · dạng khổng lồ',
            quote: 'Kẻ địch trong phạm vi 2 ô giảm 15/20/100 Giáp và Kháng Phép, kèm Choáng 1 giây.',
          },
          {
            kind: 'champion',
            name: 'Fiddlesticks',
            tag: 'Thu Hoạch · chỉ Kháng Phép',
            quote: 'Giảm 10 Kháng Phép của 3 kẻ địch gần nhất trước khi hút sinh lực từ chúng trong 2 giây.',
          },
        ],
      },
      {
        id: 'giam-la-chan-dich',
        name: 'Giảm Lá Chắn Địch',
        tag: 'Shield reduction',
        description:
          'Cắt bớt % Lá Chắn mà đối phương tạo ra — hiệu ứng phản đòn duy nhất trong Set 18 nhắm thẳng vào các đội hình sống bằng khiên (Tiên Phong, Mặt Trời, Taric, Malphite).',
        sources: [
          {
            kind: 'wisp',
            name: 'Lá chắn thù hận',
            tag: 'Linh hỏa · Giao Tranh T1',
            quote: 'Làm Chậm kẻ địch 10% và giảm 20% lá chắn của chúng trong 10 giây (30% sau nâng cấp Hoa Linh).',
          },
        ],
        note: 'Không có tộc/hệ hay kỹ năng tướng nào giảm Lá Chắn địch — chỉ tồn tại đúng 1 nguồn duy nhất này.',
      },
      {
        id: 'pha-nang-luong',
        name: 'Chặn Năng Lượng Địch',
        tag: 'Phá Năng Lượng · Mana Reave',
        description:
          'Tăng lượng Năng Lượng mà kẻ địch cần để tung chiêu tiếp theo — đẩy lùi thời điểm địch dùng chiêu thay vì giảm sát thương của chiêu đó.',
        sources: [
          {
            kind: 'champion',
            name: 'Ancient Sentinel',
            tag: 'Sóng Xung Kích Lam',
            quote: 'Kẻ địch trúng vết nứt bị Phá Năng Lượng 15 — tăng tiêu hao Năng Lượng của lần dùng Kỹ Năng tiếp theo.',
          },
          {
            kind: 'wisp',
            name: 'Phản Phép',
            tag: 'Linh hỏa · Giao Tranh T2',
            quote: 'Tăng Năng Lượng Tối Đa của tất cả kẻ địch thêm 15 cho đến lần tung chiêu tiếp theo của chúng.',
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
            tag: 'Tộc/Hệ · Hỏa Ngục',
            quote:
              'Sát thương từ tướng Hỏa Ngục luôn kèm Thiêu Đốt. Mốc (2) 1% · (5) 2% · (7) 3% Máu tối đa mỗi giây, trong 4 giây. 6 tướng hệ: Akali, Varus, Shen, Amumu, Kennen, Lux.',
          },
          {
            kind: 'champion',
            name: 'Cinderling',
            tag: 'Lá Sắc Lẹm',
            quote: '5 chiếc lá đồng loạt đánh mục tiêu, gây 300/450/680 sát thương vật lý và áp Vết Thương Sâu 20% + Thiêu Đốt 1% trong 4 giây.',
          },
          {
            kind: 'champion',
            name: 'The Elder Dragon',
            tag: 'Sức Nóng Vô Song · nội tại + Hơi Thở Lửa',
            quote: 'Cả cú hạ cánh lẫn Hơi Thở Lửa đều Thiêu Đốt 4 giây; kẻ địch bị Thiêu Đốt chịu thêm 2% Máu tối đa mỗi giây bằng sát thương vật lý.',
          },
          {
            kind: 'wisp',
            name: 'Dương Hỏa Thuật',
            tag: 'Linh hỏa · Giao Tranh T1',
            quote: 'Gây Thiêu Đốt và Vết Thương Sâu lên kẻ địch trong 10 giây.',
          },
          {
            kind: 'wisp',
            name: 'Trừng Trị',
            tag: 'Linh hỏa · Giao Tranh T3',
            quote: 'Gây Làm Chậm, Thiêu Đốt, Cào Xé và Phân Tách lên kẻ địch trong 8 giây.',
          },
        ],
        note: 'Amumu không tự gây Thiêu Đốt nhưng ăn theo: thời gian Choáng của Giận Dữ kéo dài hơn nếu mục tiêu đang Bỏng — nên Amumu luôn muốn đứng chung đội hình Hỏa Ngục.',
      },
      {
        id: 'chay-mau',
        name: 'Chảy Máu',
        tag: 'Bleed',
        description:
          'Cộng dồn sát thương vật lý trả dần theo thời gian. Khác Thiêu Đốt ở chỗ số cộng dồn có thể bị "tiêu hao" để nổ ra toàn bộ phần sát thương còn lại ngay lập tức.',
        sources: [
          {
            kind: 'champion',
            name: 'Draven',
            tag: 'Lốc Xoáy Tử Vong · nội tại + kích hoạt',
            quote:
              'Mỗi đòn đánh áp 1 cộng dồn chảy máu (150/225/1000 sát thương vật lý trải trong 12 giây); 12% cơ hội áp 2 cộng dồn. Kích hoạt ném rìu vào kẻ địch chảy máu nặng nhất và tiêu hao toàn bộ cộng dồn ngay.',
          },
          {
            kind: 'trait',
            name: 'Executioner',
            tag: 'Tộc/Hệ · Đao Phủ · mốc (3)/(4)',
            quote: 'Từ mốc (3), kẻ địch đang chảy máu chịu thêm 30% sát thương chuẩn trong 3 giây; mốc (4) nâng lên 50%.',
          },
        ],
        note: 'Đao Phủ không tự tạo Chảy Máu — mốc (3)/(4) chỉ khuếch đại lên mục tiêu đã chảy máu sẵn, nên cặp Draven + Đao Phủ là kết hợp có chủ đích.',
      },
      {
        id: 'suy-yeu',
        name: 'Suy Yếu',
        tag: 'Vulnerable / Weaken',
        description:
          'Trong Set 18, "Suy Yếu" là tên hiển thị dùng chung cho hai cơ chế ngược nhau — cả hai chỉ tồn tại trên Lux, mỗi phiên bản một kiểu, nên rất dễ nhầm nếu chỉ đọc tên hiệu ứng.',
        sources: [
          {
            kind: 'champion',
            name: 'Lux',
            form: 'Mặt Trăng',
            tag: 'Thưởng Mặt Trăng · tăng sát thương gánh chịu',
            quote: 'Kẻ địch trúng laser Suy Yếu 12% trong 6 giây — tăng sát thương mà chúng phải nhận.',
          },
          {
            kind: 'champion',
            name: 'Lux',
            form: 'Mặt Trời',
            tag: 'Thưởng Mặt Trời · giảm sát thương gây ra',
            quote: 'Kẻ địch trúng laser Suy Yếu 12% trong 6 giây — giảm sát thương mà chúng gây ra.',
          },
          {
            kind: 'wisp',
            name: 'Khối Chắn Cùn',
            tag: 'Linh hỏa · Giao Tranh T2',
            quote: 'Cùng tác dụng với Suy Yếu bản Mặt Trời nhưng có điều kiện: kẻ địch tấn công tướng nhiều Máu nhất của bạn bị giảm 10% sát thương gây ra.',
          },
        ],
      },
      {
        id: 'khuech-dai-sat-thuong',
        name: 'Khuếch Đại Sát Thương',
        tag: 'Damage Amp',
        description:
          'Nhân thêm % lên mọi sát thương tướng nhà gây ra, sau khi đã tính Giáp/Kháng Phép — nên cộng dồn rất tốt với các nguồn tăng chỉ số thuần (AD/AP).',
        sources: [
          {
            kind: 'trait',
            name: 'Hunter',
            tag: 'Tộc/Hệ · Thợ Săn · thưởng khi giữ mục tiêu',
            quote: 'Nếu tướng Thợ Săn không đổi mục tiêu trong 4 giây, nhận thêm 10% Khuếch Đại Sát Thương.',
          },
          {
            kind: 'trait',
            name: 'Attuned',
            tag: 'Tộc/Hệ · Hòa Hợp · gắn riêng Alune',
            quote: 'Khi mặt trăng ở pha tròn hơn bán nguyệt, cả đội nhận 7% Khuếch Đại Sát Thương; các pha còn lại đổi thành 7% Chống Chịu.',
          },
          {
            kind: 'champion',
            name: 'Ivern',
            tag: 'Hạt Hư Hỏng · buff 2 đồng minh',
            quote: 'Ban Lá Chắn và 10% Khuếch Đại Sát Thương trong 6 giây cho 2 đồng minh; sau 6 lần thi triển còn cộng thêm 100% Tốc Độ Đánh.',
          },
          {
            kind: 'wisp',
            name: 'Siêu Thăng Hoa',
            tag: 'Linh hỏa · Giao Tranh T1',
            quote: 'Sau 25 giây, đồng minh nhận 300% Khuếch Đại Sát Thương — chỉ có tác dụng ở những ván kéo dài quá thời gian giao tranh thường lệ.',
          },
          {
            kind: 'wisp',
            name: 'Sức Mạnh Báo Thù',
            tag: 'Linh hỏa · Giao Tranh T2',
            quote: 'Mỗi khi một đồng minh hy sinh, các tướng còn lại nhận 4% Khuếch Đại Sát Thương cộng dồn.',
          },
          {
            kind: 'wisp',
            name: 'Ngoại Binh',
            tag: 'Linh hỏa · Giao Tranh T2',
            quote: 'Nhận 3% Khuếch Đại Sát Thương với mỗi 10 vàng đang giữ — thưởng cho lối chơi tích vàng.',
          },
        ],
      },
      {
        id: 'chi-mang-chuan-xac',
        name: 'Chí Mạng & Chuẩn Xác',
        tag: 'Crit / Precision',
        description:
          'Chuẩn Xác (Precision) là từ khóa riêng của Set 18: cho phép sát thương Kỹ Năng — và cả Lá Chắn của Ivern — chí mạng được, kèm cộng thêm Sát Thương Chí Mạng.',
        sources: [
          {
            kind: 'trait',
            name: 'Executioner',
            tag: 'Tộc/Hệ · Đao Phủ · nguồn Chuẩn Xác chính',
            quote: 'Mốc (2): Đao Phủ nhận Chuẩn Xác và 35% Tỉ Lệ Chí Mạng. Chuẩn Xác: sát thương kỹ năng có thể chí mạng, cộng thêm 10% Sát Thương Chí Mạng.',
          },
          {
            kind: 'champion',
            name: 'Murkwolf',
            tag: 'Vuốt Xé · Bùa Xám',
            quote: 'Với Bùa Xám, Murkwolf nhận Chuẩn Xác và 25% Tỉ Lệ Chí Mạng, tăng tối đa lên 50% theo lượng Máu đã mất.',
          },
          {
            kind: 'champion',
            name: 'Ivern',
            tag: 'Hạt Hư Hỏng · nội tại',
            quote: 'Trường hợp đặc biệt duy nhất: Lá Chắn từ kỹ năng của Ivern cũng có thể chí mạng khi có Chuẩn Xác.',
          },
          {
            kind: 'wisp',
            name: 'Siêu Chí Mạng',
            tag: 'Linh hỏa · Giao Tranh T2',
            quote: 'Các tướng đang mang Chuẩn Xác nhận thêm 25% Sát Thương Chí Mạng (40% sau nâng cấp Hoa Linh).',
          },
        ],
        note: 'Linh hỏa Siêu Chí Mạng vô dụng nếu đội hình chưa có nguồn Chuẩn Xác — luôn kiểm tra Đao Phủ (2) hoặc Bùa Xám trước khi nhặt.',
      },
      {
        id: 'xu-tu',
        name: 'Xử Tử',
        tag: 'Execute',
        description: 'Hạ gục thẳng mục tiêu khi Máu của nó xuống dưới một ngưỡng %, bỏ qua toàn bộ phần sát thương còn phải gây.',
        sources: [
          {
            kind: 'champion',
            name: 'The Elder Dragon',
            tag: 'Hiệu Ứng Rồng Thượng Cổ',
            quote: 'Sát thương từ Rồng Ngàn Tuổi lên kẻ địch còn dưới 12% Máu sẽ kết liễu chúng ngay.',
          },
          {
            kind: 'trait',
            name: 'Eclipse',
            tag: 'Tộc/Hệ · Thiên Thực',
            quote: 'Sau 10 giây giao tranh, tướng Thiên Thực hạ gục kẻ địch có Máu thấp nhất, lặp lại mỗi 3 giây.',
          },
          {
            kind: 'wisp',
            name: 'Cuồng Nộ Sát Nhân',
            tag: 'Linh hỏa · Giao Tranh T2',
            quote: 'Tướng Đấu Sĩ kết liễu mục tiêu còn dưới 10% Máu (12% sau nâng cấp) và nhận 15% Tốc Độ Đánh khi hạ gục.',
          },
          {
            kind: 'wisp',
            name: 'Đến Giờ Ăn Nhẹ Rồi!',
            tag: 'Linh hỏa · Giao Tranh T2',
            quote: 'Lông Xù Khổng Lồ nuốt sống kẻ địch còn dưới 12% Máu tối đa mà nó gây sát thương lên — chỉ dùng được với đội hình Tinh Nghịch.',
          },
        ],
        note: 'Thiên Thực hiện chưa gắn với tướng nào trong dữ liệu Set 18 (0 tướng, không có mốc kích hoạt) — liệt kê ở đây để đủ danh mục, chưa dùng được thực tế.',
      },
      {
        id: 'phan-don-no-tu-vong',
        name: 'Phản Đòn & Nổ Khi Hy Sinh',
        tag: 'Thorns / Death blast',
        description:
          'Sát thương phát ra từ việc chịu đòn hoặc bị hạ gục, thay vì từ đòn đánh/kỹ năng chủ động — nguồn sát thương phụ cho các đội hình đỡ đòn.',
        sources: [
          {
            kind: 'champion',
            name: 'Maokai',
            tag: 'Gieo Hạt Giống · nội tại',
            quote: 'Sau mỗi 650 sát thương chặn được, 1 chồi non nhảy sang kẻ địch lân cận; khi Maokai bị hạ gục thì bật ra 3 chồi cùng lúc.',
          },
          {
            kind: 'champion',
            name: 'Rammus',
            tag: 'Thế Thủ · khi Lá Chắn vỡ',
            quote: 'Sau 4 giây khiêu khích, Lá Chắn vỡ và gây 40/60/100 sát thương vật lý lên kẻ địch trong phạm vi 2 ô.',
          },
          {
            kind: 'wisp',
            name: 'Bao Phủ Bởi Gai',
            tag: 'Linh hỏa · Giao Tranh T1',
            quote: 'Các Tướng Chống Chịu phản lại 12% sát thương nhận vào lên kẻ địch liền kề, mỗi 4 giây (18% sau nâng cấp Hoa Linh).',
          },
          {
            kind: 'wisp',
            name: 'Nổ Cảm Tử',
            tag: 'Linh hỏa · Giao Tranh T3',
            quote: 'Mọi tướng của bạn phát nổ khi bị hạ gục, gây sát thương phép bằng 15% Máu tối đa của chính chúng.',
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
          'Vô hiệu hóa hoàn toàn mục tiêu (không di chuyển, không đánh, không dùng chiêu) trong thời gian hiệu lực. Trong Set 18 chia rõ theo cách nhắm: đơn mục tiêu, diện rộng, hay theo nhịp đồng hồ.',
        groups: [
          {
            label: 'Đơn mục tiêu',
            sources: [
              { kind: 'champion', name: 'Leona', tag: 'Nện Khiên', quote: 'Đập vào mục tiêu hiện tại, gây 60/108/162 sát thương phép và Choáng 1.5 giây.' },
              {
                kind: 'champion',
                name: 'Alistar',
                tag: 'Tiếng Gầm Chiến Thắng',
                quote: 'Hồi máu, tự giải khống chế, sau đó nện mục tiêu hiện tại gây 100/150/225 sát thương phép và Choáng 1.5 giây.',
              },
              {
                kind: 'champion',
                name: 'Hecarim',
                tag: 'Nhiếp Hồn Trận',
                quote: 'Ném lựu đạn vào kẻ địch gần nhất, gây 80/120/195 sát thương phép và Choáng chúng.',
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
                quote: 'Gây 100/150/2000 sát thương phép và Choáng mọi kẻ địch trong phạm vi 2 ô, 1 giây — kéo dài hơn nếu mục tiêu đang Bỏng.',
              },
              {
                kind: 'champion',
                name: 'Gnar',
                tag: 'Đột Biến Gien · dạng khổng lồ',
                quote: 'Nhảy vào nhóm đông kẻ địch nhất, Choáng phạm vi 2 ô trong 1 giây, kèm giảm thẳng 15/20/100 Giáp và Kháng Phép.',
              },
              {
                kind: 'champion',
                name: "Rek'Sai",
                tag: 'Nhổ Rễ',
                quote: 'Lao lên từ mặt đất, Choáng mọi kẻ địch liền kề trong 1 giây và gây 70/105/160 sát thương phép.',
              },
              {
                kind: 'champion',
                name: 'The Elder Dragon',
                tag: 'Sức Nóng Vô Song · toàn sân',
                quote: 'Choáng dài nhất và rộng nhất Set 18: khi hạ cánh, choáng toàn bộ kẻ địch trên sân trong 1.25 giây và Thiêu Đốt chúng 4 giây.',
              },
              {
                kind: 'champion',
                name: 'Lux',
                form: 'Kỳ Quái',
                tag: 'Thưởng Kỳ Quái',
                quote: 'Cầu Vồng Tối Thượng Choáng 1 giây mọi mục tiêu bị laser trúng đòn — riêng phiên bản Kỳ Quái mới có thưởng này.',
              },
            ],
          },
          {
            label: 'Linh hỏa · Choáng theo nhịp hoặc theo điều kiện',
            note: 'Nguồn Choáng không phụ thuộc đội hình — hữu ích khi bạn thiếu tướng đỡ đòn có khống chế.',
            sources: [
              {
                kind: 'wisp',
                name: 'Dư Chấn',
                tag: 'Linh hỏa · Giao Tranh T2',
                quote: 'Sau 8 giây, Choáng tất cả kẻ địch 1.5 giây; sau nâng cấp Hoa Linh thì lặp lại ở giây thứ 18.',
              },
              {
                kind: 'wisp',
                name: 'Động Đất',
                tag: 'Linh hỏa · Giao Tranh T3',
                quote: 'Mỗi 8 giây, Làm Choáng kẻ địch trong 1 giây.',
              },
              {
                kind: 'wisp',
                name: 'Đất Hiện Thế',
                tag: 'Linh hỏa · Giao Tranh T2',
                quote: 'Mỗi 4 giây, rễ cây trói chân làm Choáng 1 kẻ địch trong 1 giây (2 kẻ địch sau nâng cấp Hoa Linh).',
              },
              {
                kind: 'wisp',
                name: 'Ác Giả Ác Báo',
                tag: 'Linh hỏa · Giao Tranh T3',
                quote: '3 tướng đầu tiên của bạn bị hạ gục sẽ Choáng kẻ đã hạ gục họ trong 1 giây (4 tướng · 1.25 giây sau nâng cấp).',
              },
            ],
          },
          {
            label: 'Ghi chú · nhắm theo số lượng cố định (khác Choáng diện rộng)',
            note: 'Không gây Choáng, nhưng 2 tướng này nhắm đúng 3 kẻ địch gần nhất theo số lượng thay vì theo bán kính — dễ bị nhầm là hiệu ứng diện rộng.',
            sources: [
              {
                kind: 'champion',
                name: 'Alune',
                tag: 'Trăng Mờ',
                quote: 'Chia 9 mảnh trăng đều cho 3 kẻ địch gần nhất; nếu trăng tròn thì cả mặt trăng giáng xuống toàn sân.',
              },
              {
                kind: 'champion',
                name: 'Diana',
                tag: 'Lá Chắn Nhợt Nhạt',
                quote: 'Nhận 150/225/300 lá chắn và phóng cầu ánh trăng về phía 3 kẻ địch gần nhất.',
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
              'Khiêu khích, buộc kẻ địch tấn công Rammus trong 4 giây, đồng thời nhận 325/400/500 Lá Chắn cùng 60 Giáp và Kháng Phép. Khi Lá Chắn vỡ, gây sát thương vật lý phạm vi 2 ô.',
          },
        ],
        note: 'Rammus là nguồn Khiêu Khích duy nhất của Set 18 — không có tộc/hệ hay linh hỏa nào thay thế được.',
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
              'Hồi 250/325/600 Máu và phóng 4 cánh bướm; kẻ địch trúng chiêu Ngủ 1.5 giây. Nếu nhận đủ 1000 sát thương trong lúc ngủ, chúng tỉnh sớm và chịu thêm 10% sát thương phép theo Máu tối đa.',
          },
        ],
        note: 'Cũng là nguồn duy nhất — và là con dao hai lưỡi: dồn sát thương vào mục tiêu đang Ngủ sẽ đánh thức nó sớm.',
      },
      {
        id: 'lam-cham',
        name: 'Làm Chậm',
        tag: 'Slow',
        description: 'Giảm Tốc Độ Đánh của mục tiêu trong thời gian hiệu lực — không khống chế hoàn toàn như Choáng/Ngủ, chỉ kéo giãn nhịp ra đòn.',
        sources: [
          {
            kind: 'champion',
            name: 'Karma',
            tag: 'Liên Kết Nghiệp Duyên',
            quote: 'Kẻ địch trong phạm vi 1 ô quanh mục tiêu bị Làm Chậm 30% trong 2 giây.',
          },
          {
            kind: 'champion',
            name: 'Gromp',
            tag: 'Bong Bóng Ợ Hơi · dạng Bộ Chuyển Đổi',
            quote: 'Dạng Bộ Chuyển Đổi (AD) đổi hiệu ứng nổ thành Làm Chậm mạnh mục tiêu trúng chiêu.',
          },
          {
            kind: 'wisp',
            name: 'Trừng Trị',
            tag: 'Linh hỏa · Giao Tranh T3',
            quote: 'Làm Chậm nằm trong gói 4 hiệu ứng cùng lúc, kéo dài 8 giây (14 giây sau nâng cấp).',
          },
          {
            kind: 'wisp',
            name: 'Lá chắn thù hận',
            tag: 'Linh hỏa · Giao Tranh T1',
            quote: 'Làm Chậm kẻ địch 10% kèm giảm 20% Lá Chắn của chúng trong 10 giây.',
          },
        ],
      },
      {
        id: 'hat-tung',
        name: 'Hất Tung & Dịch Chuyển',
        tag: 'Knock-up / Displacement',
        description:
          'Đẩy mục tiêu ra khỏi vị trí đang đứng — khống chế trong khoảnh khắc, nhưng quan trọng hơn là phá vỡ đội hình và ngắt nhịp đánh của địch.',
        sources: [
          {
            kind: 'champion',
            name: 'Ancient Sentinel',
            tag: 'Sóng Xung Kích Lam',
            quote: 'Vết nứt hất tung kẻ địch trúng chiêu trong chốc lát, gây 100/150/3500 sát thương phép kèm Phá Năng Lượng 15.',
          },
          {
            kind: 'champion',
            name: 'Gnar',
            tag: 'Nắm & Quăng · dạng khổng lồ',
            quote:
              'Quăng mục tiêu về phía kẻ địch xa nhất, gây sát thương lên cả mục tiêu lẫn những kẻ địch nó bay xuyên qua. Nếu chỉ còn 1 kẻ địch, ném thẳng nó khỏi sàn đấu.',
          },
        ],
      },
      {
        id: 'mien-nhiem-ne-tranh',
        name: 'Miễn Nhiễm & Né Tránh',
        tag: 'CC immunity / Untargetable',
        description: 'Mặt phòng ngự của nhóm khống chế — vô hiệu hóa hiệu ứng của địch bằng miễn nhiễm, không thể bị chọn làm mục tiêu, hoặc né đòn.',
        groups: [
          {
            label: 'Miễn nhiễm & giải khống chế',
            sources: [
              {
                kind: 'champion',
                name: 'Alistar',
                tag: 'Tiếng Gầm Chiến Thắng',
                quote: 'Nguồn tự giải khống chế duy nhất từ kỹ năng tướng: khi gầm thét, Alistar loại bỏ mọi hiệu ứng khống chế đang chịu.',
              },
              {
                kind: 'wisp',
                name: 'Cận Vệ Bạc',
                tag: 'Linh hỏa · Giao Tranh T1',
                quote: 'Toàn đội miễn nhiễm Khống Chế và nhận 15% Tốc Độ Đánh trong 10 giây (15 giây sau nâng cấp Hoa Linh).',
              },
            ],
          },
          {
            label: 'Không thể bị chọn làm mục tiêu & né đòn',
            sources: [
              {
                kind: 'champion',
                name: 'The Elder Dragon',
                tag: 'Sức Nóng Vô Song · pha bay lên',
                quote: 'Trong lúc bay lên không, Rồng Ngàn Tuổi miễn nhắm và nhận 15% Hút Máu Toàn Phần trước khi hạ cánh.',
              },
              {
                kind: 'wisp',
                name: 'Ẩn Náu',
                tag: 'Linh hỏa · Giao Tranh T1',
                quote: '2 Đấu Sĩ hoặc Sát Thủ mạnh nhất của bạn không thể bị chọn làm mục tiêu trong 6 giây.',
              },
              {
                kind: 'wisp',
                name: 'Linh Hồn Yordle',
                tag: 'Linh hỏa · Giao Tranh T2',
                quote: 'Tướng của bạn có 99% cơ hội né đòn trong 4 giây — chỉ né đòn đánh, không chặn được sát thương kỹ năng.',
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'ho-tro-dong-minh',
    index: 'D',
    accent: '#1e9e57',
    eyebrow: 'Ưu tiên 4 · Buff chỉ số & hồi phục cho tướng nhà',
    title: 'Hỗ Trợ Đồng Minh',
    effects: [
      {
        id: 'buff-giap-khang-phep',
        name: 'Giáp & Kháng Phép',
        tag: 'Armor & MR',
        description: 'Tăng thẳng chỉ số phòng thủ — nền tảng chống chịu rẻ nhất, đến từ hệ đỡ đòn hoặc từ nội tại/kỹ năng của chính tướng tuyến đầu.',
        sources: [
          {
            kind: 'trait',
            name: 'Defender',
            tag: 'Tộc/Hệ · Vệ Quân · buff cả đội',
            quote: 'Đội của bạn nhận 12 Giáp và Kháng Phép; riêng tướng Vệ Quân nhận thêm mốc (2) 25 · (4) 55 · (6) 110.',
          },
          {
            kind: 'trait',
            name: 'Monolith',
            tag: 'Tộc/Hệ · Cự Thạch · gắn riêng Malphite',
            quote: 'Tướng Cự Thạch tăng 10 Giáp và Kháng Phép với mỗi kẻ địch đang nhắm vào họ — càng bị vây càng cứng.',
          },
          {
            kind: 'champion',
            name: 'Leona',
            tag: 'Nện Khiên · nội tại',
            quote: 'Bắt đầu giao tranh với 60/70/80 Giáp và Kháng Phép cộng thêm, giảm dần trong 10 giây.',
          },
          {
            kind: 'champion',
            name: 'Hecarim',
            tag: 'Nhiếp Hồn Trận',
            quote: 'Nhận 50 Giáp và Kháng Phép trong 3 giây, đồng thời hồi 375/475/700 Máu trong thời gian hiệu lực.',
          },
        ],
      },
      {
        id: 'buff-toc-do-danh',
        name: 'Tốc Độ Đánh',
        tag: 'Attack Speed',
        description: 'Tăng nhịp đánh — có thể là buff nền cho cả đội, buff cộng dồn theo mỗi đòn đánh, hoặc buff dồn vào đúng 1 đồng minh sau khi đủ điều kiện.',
        sources: [
          {
            kind: 'trait',
            name: 'Rapidfire',
            tag: 'Tộc/Hệ · Liên Kích · cộng dồn theo đòn đánh',
            quote: 'Đội nhận 10% Tốc Độ Đánh; tướng Liên Kích cộng thêm mốc (2) 3% · (3) 5% · (4) 9% · (5) 15% mỗi đòn đánh, tối đa 10 cộng dồn.',
          },
          {
            kind: 'trait',
            name: 'Lunar',
            tag: 'Tộc/Hệ · Mặt Trăng · buff theo vị trí đứng',
            quote: 'Tướng Mặt Trăng và đồng minh đứng liền kề nhận mốc (2) 7% · (3) 10% · (4) 15% · (5) 20% Tốc Độ Đánh và Sức Mạnh Phép Thuật; tướng Mặt Trăng nhận gấp đôi.',
          },
          {
            kind: 'champion',
            name: 'Shen',
            tag: 'Lá Chắn Kiếm Khí · buff 1 đồng minh đang chịu sát thương',
            quote: 'Trao 325/400/500 Lá Chắn cho Shen và 1 đồng minh chịu sát thương gần đó; 3 đòn đánh tiếp theo của họ nhận 40% Tốc Độ Đánh.',
          },
          {
            kind: 'champion',
            name: 'Rakan',
            tag: 'Điệu Vũ Mê Hồn · buff đồng minh gây sát thương nhiều nhất',
            quote: 'Tự nhận Lá Chắn, sau đó ban 1.9/2/2.3 Tốc Độ Đánh (giảm dần trong 4 giây) cho đồng minh đã gây nhiều sát thương nhất trận.',
          },
          {
            kind: 'wisp',
            name: 'Nhanh Lẹ',
            tag: 'Linh hỏa · Giao Tranh T1',
            quote: 'Mỗi lần thi triển kỹ năng, tướng của bạn nhận 25% Tốc Độ Đánh trong 3 giây.',
          },
          {
            kind: 'wisp',
            name: 'Tức Giận Tăng Tiến',
            tag: 'Linh hỏa · Giao Tranh T2',
            quote: 'Đòn đánh của tướng Xạ Thủ cho 3% Tốc Độ Đánh cộng dồn (5% sau nâng cấp Hoa Linh).',
          },
        ],
      },
      {
        id: 'buff-ad-ap',
        name: 'Sức Mạnh Công Kích & Phép Thuật',
        tag: 'AD & AP',
        description: 'Tăng chỉ số sát thương đầu ra — nguồn dày nhất Set 18, chia theo hệ (chỉ tướng cùng hệ), theo vị trí đứng, hoặc theo tiến trình giao tranh.',
        sources: [
          {
            kind: 'trait',
            name: 'Spellweaver',
            tag: 'Tộc/Hệ · Thuật Sư · AP, cộng dồn theo lần thi triển',
            quote: 'Đội nhận 10% Sức Mạnh Phép Thuật; tướng Thuật Sư nhận thêm mốc (2) 10% · (4) 30% · (6) 55%, cộng thêm 1–2% mỗi lần một Thuật Sư tung chiêu.',
          },
          {
            kind: 'trait',
            name: 'Hunter',
            tag: 'Tộc/Hệ · Thợ Săn · AD',
            quote: 'Tướng Thợ Săn nhận thêm mốc (2) 15% · (3) 25% · (4) 40% · (5) 60% Sức Mạnh Công Kích.',
          },
          {
            kind: 'trait',
            name: 'Adaptor',
            tag: 'Tộc/Hệ · Thích Ứng · tự chọn AD hoặc AP',
            quote: 'Tướng Thích Ứng nhận mốc (2) 20% · (3) 30% · (4) 50% vào chỉ số đang cao hơn, và kỹ năng đổi hẳn phiên bản theo chỉ số đó.',
          },
          {
            kind: 'trait',
            name: 'Fae',
            tag: 'Tộc/Hệ · Tiên Linh · cộng dồn theo Pix',
            quote: 'Sát thương, hồi máu và tạo lá chắn của đội đều thu hút Pix; mỗi Pix cho tướng Tiên Linh mốc (2) 5% · (4) 8% Sức Mạnh Công Kích và Phép Thuật.',
          },
          {
            kind: 'trait',
            name: 'Blossom',
            tag: 'Tộc/Hệ · Hoa Linh · buff vĩnh viễn sau giao tranh',
            quote: 'Sau mỗi giao tranh, tướng Hoa Linh nhận thêm Sức Mạnh Công Kích, Sức Mạnh Phép Thuật và 12% Máu tối đa, tăng dần theo mốc tới 100% ở mốc (11).',
          },
          {
            kind: 'wisp',
            name: 'Sức Mạnh Dồi Dào',
            tag: 'Linh hỏa · Giao Tranh T1',
            quote: 'Tướng của bạn nhận 8% Sức Mạnh Công Kích và Sức Mạnh Phép Thuật (15% sau nâng cấp Hoa Linh).',
          },
        ],
      },
      {
        id: 'buff-mau-toi-da',
        name: 'Máu Tối Đa',
        tag: 'Max Health',
        description: 'Tăng thẳng bể máu — cộng dồn tốt với Giáp/Kháng Phép và với các hiệu ứng tạo Lá Chắn tính theo % Máu tối đa.',
        sources: [
          {
            kind: 'trait',
            name: 'Brawler',
            tag: 'Tộc/Hệ · Đấu Sĩ',
            quote: 'Đội của bạn nhận thêm 120 Máu tối đa; tướng Đấu Sĩ nhận thêm mốc (2) 25% · (4) 40% · (6) 65%.',
          },
          {
            kind: 'trait',
            name: 'Blackthorn',
            tag: 'Tộc/Hệ · Kỳ Quái · đổi tướng lấy Máu',
            quote:
              'Đồng minh đứng trên ô Kỳ Quái bị hiến tế khi vào giao tranh, đổi lại cả đội nhận mốc (2) 175 · (4) 300 · (6) 350 Máu. Từ mốc (6), vật hiến tế không chết.',
          },
          {
            kind: 'trait',
            name: 'Old Growth',
            tag: 'Tộc/Hệ · Cổ Thụ · cộng dồn vĩnh viễn',
            quote: 'Mỗi khi một kẻ địch trong phạm vi 3 ô bị hạ gục, Maokai nhận vĩnh viễn 30 Máu tối đa — tích lũy qua nhiều vòng.',
          },
          {
            kind: 'champion',
            name: 'Lux',
            form: 'Thần Rừng',
            tag: 'Thưởng Thần Rừng',
            quote: 'Mỗi lần thi triển, toàn đội nhận thêm 5% Máu tối đa cho đến hết giao tranh.',
          },
        ],
      },
      {
        id: 'buff-hoi-mau',
        name: 'Hồi Máu',
        tag: 'Healing',
        description: 'Trả lại Máu theo thời gian hoặc theo sự kiện (hạ gục, tụt dưới ngưỡng Máu) — khác Lá Chắn ở chỗ hồi phục là vĩnh viễn, không hết hạn.',
        sources: [
          {
            kind: 'trait',
            name: 'Primal',
            tag: 'Tộc/Hệ · Nguyên Sinh · hồi theo chu kỳ',
            quote: 'Đội của bạn hồi lại 4% Máu tối đa sau mỗi chu kỳ, song song với việc chọn 1 trong 4 Phước Lành Nguyên Sinh.',
          },
          {
            kind: 'trait',
            name: 'Fae',
            tag: 'Tộc/Hệ · Tiên Linh · kích hoạt khi thấp Máu',
            quote: 'Sau khi tụt xuống dưới 50% Máu, tướng Tiên Linh hồi máu theo mỗi Pix đã thu hút: mốc (2) 2% · (4) 4%.',
          },
          {
            kind: 'trait',
            name: 'Flora Fatalis',
            tag: 'Tộc/Hệ · Thực Vật · thưởng khi hạ gục',
            quote: 'Mốc (2): mỗi lần tướng Thực Vật tham gia hạ gục, đồng minh có Máu thấp nhất được hồi 8% Máu tối đa.',
          },
          {
            kind: 'champion',
            name: 'Alistar',
            tag: 'Tiếng Gầm Chiến Thắng · hồi cho 2 đồng minh thấp Máu',
            quote: 'Tự hồi 276/336/396 Máu, giải khống chế, rồi hồi thêm 80/105/130 Máu cho 2 đồng minh có % Máu thấp nhất.',
          },
          {
            kind: 'champion',
            name: 'Lux',
            form: 'Tiên Linh',
            tag: 'Thưởng Tiên Linh · hồi theo sát thương gây ra',
            quote: 'Hồi cho đồng minh có % Máu thấp nhất một lượng bằng 18% sát thương kỹ năng Lux vừa gây ra.',
          },
          {
            kind: 'wisp',
            name: 'Máu Phục hồi',
            tag: 'Linh hỏa · Giao Tranh T2',
            quote: 'Đội của bạn hồi 1% Máu tối đa mỗi giây trong suốt giao tranh.',
          },
        ],
      },
      {
        id: 'buff-hut-mau',
        name: 'Hút Máu Toàn Phần',
        tag: 'Omnivamp',
        description:
          'Chuyển một phần sát thương đã gây thành Máu hồi lại — áp dụng cho mọi nguồn sát thương (đòn đánh lẫn kỹ năng), nên bị Vết Thương Sâu của địch khắc chế trực tiếp.',
        sources: [
          {
            kind: 'trait',
            name: 'Ravager',
            tag: 'Tộc/Hệ · Tàn Phá · nguồn Omnivamp cả hệ',
            quote:
              'Tướng Tàn Phá nhận 10% Hút Máu Toàn Phần, kèm sát thương cộng thêm mốc (2) 12% · (4) 25% · (6) 40% — nhân đôi khi đánh kẻ địch còn dưới 50% Máu.',
          },
          {
            kind: 'champion',
            name: 'Morgana',
            tag: 'Lời Nguyền Tàn Úa · nội tại',
            quote: 'Nguồn Omnivamp đơn lẻ mạnh nhất: Morgana nhận thẳng 25% Hút Máu Toàn Phần ngay từ nội tại, không cần điều kiện.',
          },
          {
            kind: 'champion',
            name: 'The Elder Dragon',
            tag: 'Sức Nóng Vô Song · trong lúc bay',
            quote: 'Khi bay lên không và miễn nhắm, Rồng Ngàn Tuổi nhận 15% Hút Máu Toàn Phần.',
          },
        ],
      },
      {
        id: 'buff-la-chan',
        name: 'Lá Chắn',
        tag: 'Shield',
        description: 'Hấp thụ sát thương tạm thời — kích hoạt khi vào giao tranh, khi tụt dưới ngưỡng Máu, hoặc theo bán kính quanh người dùng chiêu.',
        sources: [
          {
            kind: 'trait',
            name: 'Vanguard',
            tag: 'Tộc/Hệ · Tiên Phong · 2 lần mỗi trận',
            quote: 'Đầu giao tranh và khi còn 50% Máu, nhận Lá Chắn bằng mốc (2) 18% · (4) 35% · (6) 45% Máu tối đa trong 10 giây.',
          },
          {
            kind: 'trait',
            name: 'Solar',
            tag: 'Tộc/Hệ · Mặt Trời · tăng theo số tướng 3 sao',
            quote: 'Mốc (3): cả đội nhận Lá Chắn bằng 5% Máu tối đa và 7% sát thương phép cộng thêm, cả hai tăng thêm 2.5% với mỗi tướng 3 sao khác nhau.',
          },
          {
            kind: 'champion',
            name: 'Taric',
            tag: 'Lục Bảo Huy Hoàng · khiên diện rộng',
            quote: 'Lần đầu Taric hoặc đồng minh ghép cặp tụt dưới 50% Máu, tạo 406/656/11300 Lá Chắn cho mọi đồng minh trong phạm vi 3 ô, trong 3 giây.',
          },
          {
            kind: 'champion',
            name: 'Malphite',
            tag: 'Vỏ Cây Hóa Đá · khiên đổi lấy sát thương',
            quote: 'Nhận 700/850/2000 Lá Chắn trong 4 giây và hóa đá; khi khiên vỡ thì giải phóng sóng năng lượng lên kẻ địch phạm vi 2 ô.',
          },
          {
            kind: 'wisp',
            name: 'Lá Chắn Gia Cường',
            tag: 'Linh hỏa · Giao Tranh T2',
            quote: 'Khuếch đại mọi Lá Chắn của bạn thêm 15% (20% sau nâng cấp) và cấp thêm 150 lá chắn trong 10 giây.',
          },
          {
            kind: 'wisp',
            name: 'Chiến Lũy',
            tag: 'Linh hỏa · Giao Tranh T2',
            quote: 'Tướng Đỡ Đòn nhận lá chắn bằng 20% Máu tối đa khi còn dưới 50% Máu (30% sau nâng cấp Hoa Linh).',
          },
        ],
      },
      {
        id: 'buff-chong-chiu',
        name: 'Chống Chịu',
        tag: 'Durability',
        description: 'Giảm % sát thương nhận vào — mạnh hơn Giáp/Kháng Phép vì áp dụng lên mọi loại sát thương, kể cả sát thương chuẩn (true damage).',
        sources: [
          {
            kind: 'trait',
            name: 'Juggernaut',
            tag: 'Tộc/Hệ · Dũng Sĩ · nguồn Chống Chịu chính',
            quote: 'Đội nhận mốc (2)/(4) 4% · (6) 8% Chống Chịu; riêng Dũng Sĩ nhận (2) 20% · (4) 28% · (6) 34%.',
          },
          {
            kind: 'trait',
            name: 'Thornmaiden',
            tag: 'Tộc/Hệ · Vườn Gai · gắn riêng Zyra',
            quote: 'Đội của bạn nhận 5% Chống Chịu, tăng lên 10% nếu có tối thiểu 6 cây của Zyra đang còn sống.',
          },
          {
            kind: 'trait',
            name: 'Attuned',
            tag: 'Tộc/Hệ · Hòa Hợp · đổi theo pha trăng',
            quote: 'Khi mặt trăng ở pha bán nguyệt hoặc khuyết hơn, cả đội nhận 7% Chống Chịu; các pha còn lại đổi thành 7% Khuếch Đại Sát Thương.',
          },
          {
            kind: 'trait',
            name: 'Vanguard',
            tag: 'Tộc/Hệ · Tiên Phong · chỉ ở mốc (6)',
            quote: 'Mốc (6) cộng thêm 8% Chống Chịu trong lúc tướng đang có Lá Chắn — cộng dồn với Dũng Sĩ.',
          },
          {
            kind: 'wisp',
            name: 'Chống Chịu',
            tag: 'Linh hỏa · Giao Tranh T1',
            quote: 'Trừ thẳng chứ không theo %: Tướng Đỡ Đòn được giảm 15 sát thương mỗi lần nhận sát thương — hiệu quả nhất trước các đòn đánh nhỏ và dồn dập.',
          },
        ],
      },
      {
        id: 'buff-nang-luong',
        name: 'Năng Lượng & Hồi Năng Lượng',
        tag: 'Mana & Mana Regen',
        description: 'Rút ngắn thời gian giữa các lần tung chiêu — đòn bẩy gián tiếp nhưng mạnh nhất cho mọi đội hình sống bằng kỹ năng.',
        sources: [
          {
            kind: 'trait',
            name: 'Invoker',
            tag: 'Tộc/Hệ · Thuật Sĩ · nguồn hồi năng lượng chính',
            quote: 'Đội nhận mốc (2)/(3) 1 · (4)/(5) 2 Hồi Năng Lượng; riêng Thuật Sĩ nhận thêm (2) 2 · (3) 3 · (4) 5 · (5) 8.',
          },
          {
            kind: 'trait',
            name: 'Flora Fatalis',
            tag: 'Tộc/Hệ · Thực Vật · thưởng khi hạ gục',
            quote: 'Mốc (1): tướng Thực Vật nhận 10 Năng Lượng mỗi lần tham gia hạ gục kẻ địch.',
          },
          {
            kind: 'champion',
            name: 'Ancient Sentinel',
            tag: 'Sóng Xung Kích Lam · Bùa Xanh',
            quote: 'Với Bùa Xanh, mỗi lần Người Đá tung chiêu thì đồng minh nhận thêm 2 Hồi Năng Lượng.',
          },
          {
            kind: 'champion',
            name: 'Lux',
            form: 'Hỏa Ngục',
            tag: 'Thưởng Hỏa Ngục',
            quote: 'Lux hồi lại 8 năng lượng mỗi lần tham gia hạ gục.',
          },
          {
            kind: 'wisp',
            name: 'Mưa Như Trút',
            tag: 'Linh hỏa · Giao Tranh T2',
            quote: 'Đội của bạn nhận 2 Hồi Năng Lượng (bản T1 rẻ hơn tên "Mưa" cho 1 Hồi Năng Lượng).',
          },
        ],
        note: 'Nội tại của Lux ở mọi phiên bản: đồng minh cùng Tộc/Hệ Thế Thần đang chọn cũng nhận năng lượng mỗi khi Lux thi triển.',
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
          'Các cơ chế hiếm trong Set 18 tác động trực tiếp lên khung đội hình hoặc mốc tộc/hệ, thay vì chỉ gây sát thương hay khống chế — cả ba đều đến từ tộc/hệ Đặc biệt gắn riêng cho 1 tướng.',
        spotlights: [
          {
            traitName: 'Avatar',
            title: 'Nhân đôi 1 mốc tộc/hệ',
            badge: 'Thế Thần · Avatar',
            body:
              'Lux là tướng Thế Thần duy nhất trong Set 18. Cô mang một trong 9 Tộc/Hệ (chọn qua phiên bản), và Tộc/Hệ đó được tính gấp đôi cho các mốc thưởng — gần như "cộng thêm 1 tướng ảo" vào đúng tộc/hệ đang cần mốc. Chỉ 1 người chơi được sở hữu Thế Thần theo mỗi Tộc/Hệ.',
            fine: 'Nguồn: tộc/hệ "Thế Thần" (Avatar), Đặc biệt 1 mốc — gắn riêng cho Lux (5 vàng).',
          },
          {
            traitName: 'Apex Predator',
            title: 'Chiếm 2 ô đổi lấy sức mạnh',
            badge: 'Bá Chủ · Apex Predator',
            body:
              'Rồng Ngàn Tuổi (Elder Dragon) chiếm 2 vị trí đội hình thay vì 1, đổi lại cộng thẳng +2 mốc vào tộc Quái Rừng — coi như một tướng "đếm gấp đôi" cho tộc/hệ mà không cần thêm quân số thật.',
            fine: 'Nguồn: tộc/hệ "Bá Chủ" (Apex Predator), Đặc biệt 1 mốc — gắn riêng cho Rồng Ngàn Tuổi (5 vàng).',
          },
          {
            traitName: 'Riftbeast',
            title: '+2 số lượng tướng tối đa',
            badge: 'Quái Rừng · mốc (10)',
            body:
              'Đủ 10 tướng Quái Rừng trên bàn mở khóa mốc cao nhất của tộc Quái Rừng (Riftbeast): toàn đội được cộng thẳng +2 ô tướng tối đa — cơ chế duy nhất trong nhóm tộc/hệ tăng sức chứa đội hình thay vì chỉ tăng chỉ số.',
            fine: 'Nguồn: tộc/hệ "Quái Rừng" (Riftbeast), mốc kích hoạt ở 10 tướng hệ. Các mốc thấp hơn cho Dấu Alpha (3), cửa hàng tràn Quái Rừng (5) và buff lớn dần mỗi 5 giây (7).',
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
          'Kỹ năng gốc — Cầu Vồng Tối Thượng — giống nhau ở mọi phiên bản: bắn laser vào hướng đông kẻ địch nhất, gây 370/580/5000 sát thương phép, giảm 20% với mỗi kẻ địch trúng chiêu (tối thiểu 40%). Nội tại: đồng minh cùng Tộc/Hệ Thế Thần đang chọn nhận năng lượng khi Lux thi triển.',
      },
      {
        id: 'moc-toc-he-tam-thoi',
        name: 'Mượn Mốc Tộc/Hệ Tạm Thời',
        tag: 'Trait borrowing',
        description:
          'Kích hoạt hoặc nâng mốc tộc/hệ trong đúng một giao tranh mà không cần đổi đội hình — cách duy nhất ngoài tộc/hệ Đặc biệt để chạm mốc bạn còn thiếu, và toàn bộ đều đến từ linh hỏa.',
        sources: [
          {
            kind: 'wisp',
            name: 'Anh Hùng Bất Ngờ',
            tag: 'Linh hỏa · Giao Tranh T2',
            quote: 'Khi bắt đầu giao tranh, tối đa 2 tộc/hệ chưa kích hoạt sẽ được kích hoạt ở mốc thấp nhất.',
          },
          {
            kind: 'wisp',
            name: 'Ấn Ma Mị',
            tag: 'Linh hỏa · Giao Tranh T3',
            quote: 'Nhận 1 ấn tạm thời cho tộc/hệ đang kích hoạt cao nhất của bạn — đẩy thẳng lên mốc kế tiếp.',
          },
          {
            kind: 'wisp',
            name: 'Đa Dạng Hóa',
            tag: 'Linh hỏa · Giao Tranh T2',
            quote: 'Thưởng cho đội hình dàn trải: nhận 30 Máu cho mỗi tộc/hệ không độc nhất đang kích hoạt.',
          },
        ],
      },
      {
        id: 'tam-danh-vi-tri',
        name: 'Tầm Đánh & Vị Trí Đứng',
        tag: 'Range / Positioning',
        description:
          'Hiệu ứng đọc vị trí đứng trên bàn hoặc thay đổi tầm đánh — nhóm duy nhất mà cách bạn xếp quân quyết định hiệu quả, không phải chỉ số tướng.',
        sources: [
          {
            kind: 'trait',
            name: 'Lunar',
            tag: 'Tộc/Hệ · Mặt Trăng · buff ô liền kề',
            quote: 'Chỉ đồng minh đứng liền kề tướng Mặt Trăng mới nhận buff Tốc Độ Đánh / Sức Mạnh Phép Thuật — xếp sát nhau là điều kiện bắt buộc.',
          },
          {
            kind: 'trait',
            name: 'Blackthorn',
            tag: 'Tộc/Hệ · Kỳ Quái · ô hiến tế',
            quote: 'Ô Kỳ Quái là ô đặc biệt trên bàn: đồng minh đứng lên đó sẽ bị hiến tế khi vào giao tranh để đổi lấy Máu cho cả đội.',
          },
          {
            kind: 'wisp',
            name: 'Tăng Tầm Với',
            tag: 'Linh hỏa · Giao Tranh T2',
            quote: 'Các Đấu Sĩ của bạn nhận thêm 1 tầm đánh — biến tướng cận chiến thành tướng đánh xa 1 ô.',
          },
          {
            kind: 'wisp',
            name: 'Đứng Một Mình',
            tag: 'Linh hỏa · Giao Tranh T2',
            quote: 'Tướng đứng một mình trên hàng của họ nhận 15% Máu và 15% Khuếch Đại Sát Thương (22% sau nâng cấp Hoa Linh).',
          },
        ],
        note: 'Cặp linh hỏa "Đứng Một Mình" (một mình một hàng) và "Áo Choàng Cô Độc" (không có đồng minh liền kề) có điều kiện khác nhau dù mô tả gần giống — đọc kỹ trước khi xếp lại đội hình.',
      },
    ],
  },
];
