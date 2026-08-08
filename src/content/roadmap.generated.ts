// AUTO-GENERATED bởi scripts/convert-evergreen-lessons.mjs — KHÔNG sửa tay.
// Sửa nội dung ở docs/evergreen rồi chạy lại `pnpm content:sync`.
export type RoadmapTier = { tier: string; question: string; skill: string };
export type RoadmapSymptom = { symptom: string; label: string; href: string };
export type RoadmapWeek = { title: string; read: Array<{ label: string; href: string }>; exercises: string[]; outcome: string };

export const roadmapTiers: RoadmapTier[] = [
  {
    "tier": "1. Trạng thái",
    "question": "Tôi đang mạnh/yếu, giàu/nghèo, an toàn/nguy hiểm đến đâu?",
    "skill": "Board strength, máu, kinh tế, survival horizon"
  },
  {
    "tier": "2. Mục tiêu",
    "question": "Tôi đang chơi cho top 1, top 4 hay cứu placement?",
    "skill": "Quản trị rủi ro, chuyển mục tiêu"
  },
  {
    "tier": "3. Phân bổ",
    "question": "Vàng, level, roll, trang bị nên đổi thành sức mạnh lúc nào?",
    "skill": "Tempo, streak, breakpoint, slam item"
  },
  {
    "tier": "4. Cấu trúc",
    "question": "Board đang thiếu sát thương, frontline hay utility?",
    "skill": "Vai trò, itemization, trait, augment, cap"
  },
  {
    "tier": "5. Thông tin",
    "question": "Lobby đang ép tôi thay đổi quyết định nào?",
    "skill": "Scouting, contest, pool, positioning"
  },
  {
    "tier": "6. Học tập",
    "question": "Lỗi đầu tiên có thể sửa là gì?",
    "skill": "VOD review, phân loại lỗi, deliberate practice"
  }
];

export const roadmapSymptoms: RoadmapSymptom[] = [
  {
    "symptom": "Ép bài từ Stage 2",
    "label": "Strongest board và opener",
    "href": "/kien-thuc-nen-tang/strongest-board-va-opener"
  },
  {
    "symptom": "Luôn có 50 vàng nhưng chết sớm",
    "label": "Kinh tế, máu, chuỗi và tempo",
    "href": "/kien-thuc-nen-tang/kinh-te-mau-chuoi-va-tempo"
  },
  {
    "symptom": "Roll nhiều nhưng board ít đổi",
    "label": "Level, roll, outs và breakpoint",
    "href": "/kien-thuc-nen-tang/level-roll-outs-va-breakpoint"
  },
  {
    "symptom": "Chờ BIS, mất quá nhiều máu",
    "label": "Trang bị và phân bổ chỉ số",
    "href": "/kien-thuc-nen-tang/trang-bi-va-phan-bo-chi-so"
  },
  {
    "symptom": "Nhiều tộc hệ nhưng board yếu",
    "label": "Vai trò, tộc hệ và board cap",
    "href": "/kien-thuc-nen-tang/vai-tro-toc-he-va-board-cap"
  },
  {
    "symptom": "Không biết khi nào đổi bài",
    "label": "Flex, transition và pivot",
    "href": "/kien-thuc-nen-tang/flex-transition-va-pivot"
  },
  {
    "symptom": "Bị tranh nhưng phát hiện quá muộn",
    "label": "Scouting, contest và lobby ecology",
    "href": "/kien-thuc-nen-tang/scouting-contest-va-lobby-ecology"
  },
  {
    "symptom": "Board đủ quân vẫn thua kèo",
    "label": "Positioning, targeting và pathing",
    "href": "/kien-thuc-nen-tang/positioning-targeting-va-pathing"
  },
  {
    "symptom": "Copy data nhưng kết quả không giống",
    "label": "Đọc dữ liệu không bị đánh lừa",
    "href": "/kien-thuc-nen-tang/doc-du-lieu-tft-khong-bi-danh-lua"
  },
  {
    "symptom": "Review chỉ thấy “không ra tướng”",
    "label": "VOD review và phân loại lỗi",
    "href": "/kien-thuc-nen-tang/vod-review-va-phan-loai-loi"
  }
];

export const roadmapWeeks: RoadmapWeek[] = [
  {
    "title": "Tuần 0 — Thiết lập baseline",
    "read": [],
    "exercises": [
      "Chơi 5 trận như bình thường.",
      "Sau mỗi trận điền phiếu một trận 60 giây (dùng checklist ở phần kiến thức nền tảng).",
      "Đếm nhãn lỗi và chọn lỗi xuất hiện sớm nhất/nhiều nhất."
    ],
    "outcome": "một kỹ năng ưu tiên và một chỉ số theo dõi."
  },
  {
    "title": "Tuần 1 — Strongest board",
    "read": [
      {
        "label": "Strongest board và opener",
        "href": "/kien-thuc-nen-tang/strongest-board-va-opener"
      }
    ],
    "exercises": [
      "Ở 2-1 và 3-2, chụp hoặc ghi board mạnh nhất có thể tạo ngay.",
      "Mỗi round hỏi: có quân hai sao, holder hoặc slot nào đang nằm sai chỗ không?",
      "Không giữ quá ba hướng đội hình trên bench nếu việc giữ làm mất mốc lãi."
    ],
    "outcome": "giải thích được vai trò của từng quân trên board và giảm số round mất máu vì để quân mạnh trên bench."
  },
  {
    "title": "Tuần 2 — Kinh tế, chuỗi và tempo",
    "read": [
      {
        "label": "Kinh tế, máu, chuỗi và tempo",
        "href": "/kien-thuc-nen-tang/kinh-te-mau-chuoi-va-tempo"
      }
    ],
    "exercises": [
      "Trước 2-1, chọn trạng thái: thắng chuỗi, thua chuỗi có kiểm soát hoặc trung lập.",
      "Ghi mọi lần phá mốc lãi và lý do.",
      "Sau round, kiểm tra vàng đã chi có thực sự đổi xác suất thắng hay giảm sát thương thua không."
    ],
    "outcome": "không còn coi 50 vàng là mục tiêu độc lập với máu và board."
  },
  {
    "title": "Tuần 3 — Trang bị và cân bằng board",
    "read": [
      {
        "label": "Trang bị và phân bổ chỉ số",
        "href": "/kien-thuc-nen-tang/trang-bi-va-phan-bo-chi-so"
      }
    ],
    "exercises": [
      "Trước khi ghép, gọi tên chức năng món đồ và nút thắt nó giải quyết.",
      "Ghi một món đã cứu máu/chuỗi và một món có giá trị thấp vì ghép theo quán tính.",
      "Theo dõi tỷ lệ linh kiện nằm chết quá ba round."
    ],
    "outcome": "không phụ thuộc một bộ BIS và biết cân bằng carry–frontline–utility."
  },
  {
    "title": "Tuần 4 — Level, roll và breakpoint",
    "read": [
      {
        "label": "Level, roll, outs và breakpoint",
        "href": "/kien-thuc-nen-tang/level-roll-outs-va-breakpoint"
      }
    ],
    "exercises": [
      "Trước mỗi rolldown, viết tối đa ba nhóm outs.",
      "Đặt ngưỡng dừng theo board state, không theo cảm xúc.",
      "Sau rolldown, ghi vàng đã đổi thành nâng cấp nào."
    ],
    "outcome": "mọi lần level/roll đều có mục tiêu và bạn dừng được sau khi board đủ mạnh."
  },
  {
    "title": "Tuần 5 — Flex và transition",
    "read": [
      {
        "label": "Flex, transition và pivot",
        "href": "/kien-thuc-nen-tang/flex-transition-va-pivot"
      }
    ],
    "exercises": [
      "Ghi mức cam kết 0–4 ở 2-1, 3-2 và trước rolldown chính.",
      "Luôn chuẩn bị tối thiểu hai carry/tank có thể dùng đồ hiện tại.",
      "Chỉ pivot khi có tín hiệu, không pivot vì thua một round."
    ],
    "outcome": "có thể mô tả line bằng điều kiện và vai trò thay vì một tên đội hình duy nhất."
  },
  {
    "title": "Tuần 6 — Scouting và lobby ecology",
    "read": [
      {
        "label": "Scouting, contest và lobby ecology",
        "href": "/kien-thuc-nen-tang/scouting-contest-va-lobby-ecology"
      }
    ],
    "exercises": [
      "Mỗi lần scout chỉ trả lời một câu hỏi.",
      "Trước rolldown, đếm contest ở carry, frontline và utility riêng biệt.",
      "Ghi một quyết định được thay đổi trực tiếp bởi thông tin lobby."
    ],
    "outcome": "mô tả được lobby bằng một câu có ích cho quyết định tiếp theo."
  },
  {
    "title": "Tuần 7 — Positioning và combat review",
    "read": [
      {
        "label": "Positioning, targeting và pathing",
        "href": "/kien-thuc-nen-tang/positioning-targeting-va-pathing"
      }
    ],
    "exercises": [
      "Xác định hai đối thủ có khả năng gặp.",
      "Theo dõi target đầu tiên, đường đi, thời điểm tank chết và góc hoạt động của carry.",
      "Mỗi trận ghi một round thắng/thua do xếp cờ."
    ],
    "outcome": "không giữ nguyên đội hình mẫu và mọi thay đổi vị trí đều có giả thuyết."
  },
  {
    "title": "Tuần 8 — Review và quản trị placement",
    "read": [
      {
        "label": "VOD review và phân loại lỗi",
        "href": "/kien-thuc-nen-tang/vod-review-va-phan-loai-loi"
      },
      {
        "label": "Đọc trạng thái và mục tiêu thứ hạng",
        "href": "/kien-thuc-nen-tang/doc-trang-thai-va-muc-tieu-thu-hang"
      }
    ],
    "exercises": [
      "Review toàn bộ top 7–8 và hai trận top 4 có quyết định đáng ngờ.",
      "Tìm lỗi đầu tiên làm mất quyền lựa chọn.",
      "Ghi round chuyển mục tiêu từ top 1 sang top 4 hoặc cứu placement."
    ],
    "outcome": "mỗi trận thua tạo ra một hành động sửa có thể quan sát ở trận sau."
  }
];

export const roadmapAfterSteps: string[] = [
  "Điền Phiếu 20 trận.",
  "So sánh với baseline Tuần 0.",
  "Chọn module có nhãn lỗi cao nhất.",
  "Lặp chu kỳ 10–20 trận; không cần học lại từ đầu."
];
