export type LessonBlock =
  | {
      type: 'principles';
      title: string;
      items: string[];
    }
  | {
      type: 'scenario';
      title: string;
      setup: string;
      decision: string;
      avoid: string;
    }
  | {
      type: 'checklist';
      title: string;
      items: string[];
    }
  | {
      type: 'drill';
      title: string;
      goal: string;
      steps: string[];
    }
  | {
      type: 'matrix';
      title: string;
      rows: Array<{ state: string; read: string; action: string }>;
    };

export type Lesson = {
  slug: string;
  title: string;
  module: string;
  shortTitle: string;
  summary: string;
  skill: string;
  duration: string;
  exercise: string;
  commonMistake: string;
  applyQuestions: string[];
  blocks: LessonBlock[];
};

export const lessons: Lesson[] = [
  {
    slug: 'nen-tang-xuyen-mua',
    title: 'Nền tảng không đổi qua các mùa',
    shortTitle: 'Nền tảng',
    module: 'Mở khóa cách nghĩ',
    summary: 'Tách kiến thức xuyên mùa, theo set và theo patch để không bị cuốn vào meta mỗi tuần.',
    skill: 'Decision fundamentals',
    duration: '35 phút',
    exercise: '10 trận ghi lại quyết định dùng vàng và máu.',
    commonMistake: 'Học đội hình mới trước khi hiểu mình đang thiếu tài nguyên nào.',
    applyQuestions: ['Tài nguyên thiếu nhất của mình đang là gì?', 'Quyết định này mua máu, mua vàng hay mua thông tin?', 'Sau trận mình sẽ review lựa chọn nào?'],
    blocks: [
      {
        type: 'matrix',
        title: 'Ba lớp kiến thức',
        rows: [
          { state: 'Xuyên mùa', read: 'Vàng, máu, tempo, strongest board, scout.', action: 'Ưu tiên luyện trước vì set nào cũng dùng.' },
          { state: 'Theo set', read: 'Cơ chế mùa, trait, unit, item đặc thù.', action: 'Học đủ để không mất phương hướng khi vào lobby.' },
          { state: 'Theo patch', read: 'Buff/nerf và data đang thay đổi.', action: 'Dùng để đặt giả thuyết, không thay đổi toàn bộ playbook.' },
        ],
      },
      {
        type: 'scenario',
        title: 'Một round nên đọc như thế nào',
        setup: 'Bạn còn 64 máu, 42 vàng, board yếu hơn hai nhà trong lobby và đang giữ hai mảnh đồ damage.',
        decision: 'Đừng hỏi “comp nào mạnh?”. Hỏi “mình có thể mua bao nhiêu máu bằng một món đồ và một lần level?”.',
        avoid: 'Giữ vàng đẹp chỉ để chết ở stage 4 với board chưa từng thật sự mạnh.',
      },
      {
        type: 'checklist',
        title: 'Câu hỏi nền tảng',
        items: ['Mình đang chơi vì top 1, top 4 hay cứu top 6?', 'Mình thiếu damage, frontline, econ hay thông tin?', 'Nếu quyết định sai, dấu hiệu sai sẽ xuất hiện ở round nào?'],
      },
    ],
  },
  {
    slug: 'suc-manh-ban-dau',
    title: 'Đánh giá sức mạnh bàn đấu',
    shortTitle: 'Board strength',
    module: 'Đọc board',
    summary: 'Biết board mạnh/yếu so với lobby trước khi quyết định greed, level hoặc roll.',
    skill: 'Strongest board',
    duration: '30 phút',
    exercise: 'Mỗi round trả lời: mình mạnh hay yếu so với lobby?',
    commonMistake: 'Đánh giá board theo comp cuối, không theo round sắp đánh.',
    applyQuestions: ['Carry có đủ damage để giết frontline không?', 'Frontline sống đủ lâu cho carry cast không?', 'Item hiện tại có đang nằm đúng chức năng không?'],
    blocks: [
      {
        type: 'principles',
        title: 'Sáu trụ sức mạnh',
        items: ['Sao tướng và chất lượng unit hiện tại.', 'Frontline sống được bao lâu.', 'Damage có chạm được backline không.', 'Item đã tạo spike thật chưa.', 'Augment có kích hoạt ngay hay chỉ hứa hẹn late.', 'Matchup sắp gặp trong lobby.'],
      },
      {
        type: 'matrix',
        title: 'Đọc trạng thái trận',
        rows: [
          { state: 'Mạnh và giàu', read: 'Đang winstreak, máu cao, vàng đẹp.', action: 'Giữ nhịp, level đúng breakpoint để bảo vệ streak.' },
          { state: 'Mạnh nhưng nghèo', read: 'Board ổn nhưng vừa tiêu nhiều vàng.', action: 'Ổn định, không roll tiếp nếu không có mục tiêu rõ.' },
          { state: 'Yếu nhưng giàu', read: 'Eco đẹp nhưng mất máu nhanh.', action: 'Chuẩn bị mua tempo trước khi HP mất quyền chọn.' },
          { state: 'Yếu và nghèo', read: 'Không streak, board yếu, vàng thấp.', action: 'Chọn đường cứu top 6, không mơ cap quá xa.' },
        ],
      },
    ],
  },
  {
    slug: 'kinh-te-level-roll',
    title: 'Kinh tế, lên cấp và roll',
    shortTitle: 'Gold / Roll',
    module: 'Tiêu vàng có mục tiêu',
    summary: 'Roll và level để mua xác suất, tempo hoặc máu — không roll vì hoảng.',
    skill: 'Gold / Roll',
    duration: '40 phút',
    exercise: 'Trước mỗi rolldown ghi đúng unit, cấp và số vàng sẽ dùng.',
    commonMistake: 'Roll đến hết vàng mà không đặt điểm dừng.',
    applyQuestions: ['Mình roll để tìm gì?', 'Nếu không ra, board tạm ổn bằng gì?', 'Điểm dừng là bao nhiêu vàng hoặc nâng cấp nào?'],
    blocks: [
      {
        type: 'scenario',
        title: 'Trước một rolldown tốt',
        setup: 'Bạn level 8 ở 4-2 với 46 vàng. Board thiếu một tank 2 sao và một carry thay đồ.',
        decision: 'Mục tiêu roll là ổn định frontline trước, rồi mới tìm cap damage. Điểm dừng có thể là 20 vàng nếu frontline đã lên.',
        avoid: 'Roll vì “cần mạnh hơn” nhưng không biết unit nào làm board mạnh hơn.',
      },
      {
        type: 'checklist',
        title: 'Ba câu trước khi tiêu vàng',
        items: ['Cấp hiện tại có đúng odds cho unit mình cần không?', 'HP có bắt buộc mình mua máu ngay không?', 'Sau khi roll, mình còn đủ vàng để chơi round tiếp không?'],
      },
      {
        type: 'drill',
        title: 'Drill 10 trận: điểm dừng rolldown',
        goal: 'Không có rolldown vô định.',
        steps: ['Trước khi roll, ghi 2 unit cần tìm.', 'Ghi số vàng dừng lại.', 'Sau rolldown, ghi “ra/không ra” và board đã đủ ổn chưa.'],
      },
    ],
  },
  {
    slug: 'trang-bi-nang-cap',
    title: 'Trang bị và nâng cấp',
    shortTitle: 'Item / Augment',
    module: 'Spike đúng lúc',
    summary: 'Học item theo chức năng và chọn augment theo trạng thái trận, không theo tier list trống ngữ cảnh.',
    skill: 'Items / Augment',
    duration: '30 phút',
    exercise: '10 trận slam đồ với lý do tempo hoặc cap rõ ràng.',
    commonMistake: 'Giữ đồ quá lâu vì đợi BIS trong khi board đang mất máu.',
    applyQuestions: ['Món này tăng damage, frontline hay utility?', 'Augment này giải quyết vấn đề hiện tại hay chỉ hứa hẹn late?', 'Nếu chọn lõi greed, HP có chịu được không?'],
    blocks: [
      {
        type: 'matrix',
        title: 'Slam hay giữ',
        rows: [
          { state: 'Slam ngay', read: 'Món đồ tăng sức mạnh cho board hiện tại và giữ streak/máu.', action: 'Ghép, rồi chơi quanh chức năng món đồ.' },
          { state: 'Giữ một phần', read: 'Có component quan trọng cho nhiều line nhưng chưa cần spike ngay.', action: 'Giữ có deadline; không giữ vô hạn.' },
          { state: 'Không nên giữ', read: 'Board yếu, HP rơi nhanh, item trên bench không tạo giá trị.', action: 'Ghép món tốt nhất hiện tại, không chờ hoàn hảo.' },
        ],
      },
      {
        type: 'principles',
        title: 'Bốn kiểu augment',
        items: ['Combat ngay lập tức.', 'Economy để mua tương lai.', 'Direction để mở line.', 'Cap để thắng lobby khi đã có nền.'],
      },
    ],
  },
  {
    slug: 'flex-pivot',
    title: 'Flex, pivot và xây đội hình',
    shortTitle: 'Flex / Pivot',
    module: 'Không chết vì cố chấp',
    summary: 'Dùng thang cam kết 0–4 để biết khi nào mở hướng, khi nào khóa bài và khi nào đổi.',
    skill: 'Pivot',
    duration: '35 phút',
    exercise: 'Sau mỗi round stage 3 ghi mức cam kết hiện tại.',
    commonMistake: 'Gọi mình là flex nhưng thực tế đã khóa bài từ stage 2.',
    applyQuestions: ['Mức cam kết hiện tại là mấy?', 'Item và augment đang khóa mình vào vai trò nào?', 'Pivot này giữ lại được bao nhiêu tài nguyên?'],
    blocks: [
      {
        type: 'principles',
        title: 'Thang cam kết 0–4',
        items: ['0: Chưa cam kết, chơi unit mạnh nhất.', '1: Nghiêng hướng nhưng vẫn mở.', '2: Có lõi chuyển tiếp, ưu tiên line chính.', '3: Cam kết cao, chỉ pivot nếu tín hiệu rất mạnh.', '4: Không thể đổi hợp lý, tối ưu vị trí và cap.'],
      },
      {
        type: 'scenario',
        title: 'Pivot an toàn không phải đổi hết bàn',
        setup: 'Bạn có item AD, frontline 2 sao, nhưng carry chính bị contest nặng.',
        decision: 'Giữ frontline và item shell, đổi carry/trait quanh cùng chức năng damage.',
        avoid: 'Bán sạch board để chạy sang một comp “đang meta” nhưng không giữ lại spike nào.',
      },
    ],
  },
  {
    slug: 'scout-positioning',
    title: 'Scouting và positioning',
    shortTitle: 'Scout / Position',
    module: 'Đánh lobby thật',
    summary: 'Scout có mục tiêu, đổi vị trí theo đối thủ còn sống, không copy một ảnh mẫu.',
    skill: 'Scout / Position',
    duration: '30 phút',
    exercise: 'Mỗi round cuối stage 4 đổi ít nhất một vị trí có lý do.',
    commonMistake: 'Scout xong không đổi quyết định nào.',
    applyQuestions: ['Ai là người có thể giết mình round sau?', 'Carry đang né đúng mối nguy lớn nhất chưa?', 'Tank đang điều khiển target như mình muốn chưa?'],
    blocks: [
      {
        type: 'drill',
        title: 'Chu trình scout 8 giây',
        goal: 'Scout để ra hành động, không scout cho có.',
        steps: ['2 giây: ai đang mạnh nhất lobby?', '2 giây: ai contest mình?', '2 giây: mối nguy position là gì?', '2 giây: đổi một vị trí hoặc giữ nguyên có lý do.'],
      },
      {
        type: 'checklist',
        title: 'Positioning late game',
        items: ['Carry có bị matchup nguy hiểm chạm sớm không?', 'Tank chính có kéo đúng góc đánh không?', 'Unit utility có cast trước khi chết không?'],
      },
    ],
  },
  {
    slug: 'cay-quyet-dinh-stage',
    title: 'Cây quyết định theo giai đoạn',
    shortTitle: 'Stage plan',
    module: 'Mỗi stage một việc',
    summary: 'Stage 1 đến late game: cùng một câu hỏi không dùng cho mọi thời điểm.',
    skill: 'Tempo',
    duration: '35 phút',
    exercise: 'Dùng stage checklist trong 10 trận liên tiếp.',
    commonMistake: 'Stage nào cũng hỏi “comp mình là gì?” thay vì hỏi đúng việc của stage đó.',
    applyQuestions: ['Stage này cần thông tin, máu, vàng hay cap?', 'Hành động tiếp theo có deadline không?', 'Mục tiêu placement đã đổi chưa?'],
    blocks: [
      {
        type: 'matrix',
        title: 'Stage đọc gì',
        rows: [
          { state: 'Stage 1', read: 'Item, shop, augment/portal.', action: 'Mở 2 hướng khởi đầu.' },
          { state: 'Stage 2', read: 'Board mạnh/yếu và streak.', action: 'Chọn thắng chuỗi, thua chuỗi hoặc ổn định.' },
          { state: 'Stage 3', read: 'Line chính, contest, econ.', action: 'Xác định hướng và nhịp level/roll.' },
          { state: 'Stage 4', read: 'HP, board thiếu gì, odds.', action: 'Rolldown có mục tiêu hoặc pivot.' },
          { state: 'Stage 5+', read: 'Đối thủ còn lại và điều kiện thắng.', action: 'Chọn top 1, top 4 hoặc cứu top 6.' },
        ],
      },
    ],
  },
  {
    slug: 'review-on-dinh-rank',
    title: 'Review và ổn định thứ hạng',
    shortTitle: 'Review',
    module: 'Sửa đúng lỗi',
    summary: 'Review để tìm lỗi đầu tiên có thể sửa, không để tự trách hoặc kể lại cả trận.',
    skill: 'Review',
    duration: '30 phút',
    exercise: 'Review 5 trận thua bằng summary Markdown.',
    commonMistake: 'Review placement thay vì review quyết định.',
    applyQuestions: ['Turning point thật sự ở stage nào?', 'Đây là quyết định tốt kết quả xấu hay quyết định xấu kết quả tốt?', 'Trận sau chỉ sửa một hành vi nào?'],
    blocks: [
      {
        type: 'scenario',
        title: 'Không nhìn kết quả trước',
        setup: 'Bạn bot 6 nhưng trận có một round stage 3 giữ vàng đúng và một rolldown stage 4 sai mục tiêu.',
        decision: 'Giữ lại quyết định đúng dù kết quả xấu. Chỉ sửa rolldown sai mục tiêu.',
        avoid: 'Kết luận “comp này yếu” chỉ vì placement thấp.',
      },
      {
        type: 'checklist',
        title: 'Review 15 phút',
        items: ['Ghi stage yếu nhất.', 'Chọn một turning point.', 'Chọn lỗi đầu tiên có thể sửa.', 'Viết quyết định thay thế cho trận sau.'],
      },
    ],
  },
];

export function getLesson(slug: string): Lesson | undefined {
  return lessons.find((lesson) => lesson.slug === slug);
}
