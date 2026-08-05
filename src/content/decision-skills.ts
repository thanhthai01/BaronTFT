export type DecisionSkill = {
  id: string;
  label: string;
  shortLabel: string;
  signal: string;
  lesson: string;
  checklist: string;
  drill: string;
  href: string;
};

export const decisionSkills: DecisionSkill[] = [
  {
    id: 'gold',
    label: 'Gold',
    shortLabel: 'GOLD',
    signal: 'Bạn roll vì hoảng, không biết mình đang mua xác suất hay mua tempo.',
    lesson: 'Kinh tế, lên cấp và roll',
    checklist: 'Trước rolldown: đang tìm chính xác điều gì?',
    drill: '10 trận ghi lại số vàng trước và sau mỗi rolldown.',
    href: '/bai-hoc/kinh-te-mau-chuoi-va-tempo',
  },
  {
    id: 'hp',
    label: 'HP',
    shortLabel: 'HP',
    signal: 'Bạn giữ vàng đẹp nhưng mất quá nhiều máu để còn quyền chọn line.',
    lesson: 'Bốn tài nguyên cốt lõi',
    checklist: 'Mình đang chơi vì top 1, top 4 hay cứu top 6?',
    drill: 'Sau stage 3 ghi HP có còn đủ để greed không.',
    href: '/bai-hoc/tai-nguyen-va-gia-tri-lua-chon',
  },
  {
    id: 'items',
    label: 'Items',
    shortLabel: 'ITEM',
    signal: 'Bạn giữ đồ quá lâu vì chờ bài hoàn hảo, làm board yếu hơn lobby.',
    lesson: 'Trang bị và nâng cấp',
    checklist: 'Món này tăng damage, frontline hay tempo ngay bây giờ?',
    drill: '10 trận slam đồ sớm và ghi lý do chức năng.',
    href: '/bai-hoc/trang-bi-va-phan-bo-chi-so',
  },
  {
    id: 'tempo',
    label: 'Tempo',
    shortLabel: 'TEMP',
    signal: 'Bạn lên cấp hoặc eco theo thói quen, không theo sức mạnh lobby.',
    lesson: 'Cây quyết định theo giai đoạn',
    checklist: 'Round tiếp theo cần thắng, giữ máu hay giữ vàng?',
    drill: 'Mỗi stage chọn một mục tiêu tempo trước khi bấm roll/level.',
    href: '/bai-hoc/ke-hoach-tft-theo-stage',
  },
  {
    id: 'scout',
    label: 'Scout',
    shortLabel: 'SCT',
    signal: 'Bạn nhìn lobby nhưng không đổi quyết định nào sau khi scout.',
    lesson: 'Scouting có mục tiêu',
    checklist: 'Ai contest mình, ai mạnh hơn mình, ai cần né vị trí?',
    drill: 'Chu trình scout 8 giây ở mỗi round stage 4.',
    href: '/bai-hoc/scouting-contest-va-lobby-ecology',
  },
  {
    id: 'pivot',
    label: 'Pivot',
    shortLabel: 'PVT',
    signal: 'Bạn đổi bài quá muộn hoặc khóa bài quá sớm vì không biết mức cam kết.',
    lesson: 'Flex, pivot và xây đội hình',
    checklist: 'Mức cam kết của mình đang là 0, 1, 2, 3 hay 4?',
    drill: 'Sau mỗi augment ghi một line chính và một line dự phòng.',
    href: '/bai-hoc/flex-transition-va-pivot',
  },
  {
    id: 'roll',
    label: 'Roll',
    shortLabel: 'ROLL',
    signal: 'Bạn roll đến hết vàng nhưng không biết điểm dừng hợp lý.',
    lesson: 'Ba chế độ kinh tế',
    checklist: 'Nếu không ra unit, board tạm ổn bằng phương án nào?',
    drill: 'Đặt điểm dừng trước khi roll: vàng, HP hoặc nâng cấp cụ thể.',
    href: '/bai-hoc/level-roll-outs-va-breakpoint',
  },
  {
    id: 'position',
    label: 'Position',
    shortLabel: 'POS',
    signal: 'Bạn copy vị trí mẫu nhưng không né carry, Zephyr, hook hoặc matchup thật.',
    lesson: 'Nguyên tắc positioning xuyên mùa',
    checklist: 'Carry mình đang được bảo vệ khỏi mối nguy lớn nhất chưa?',
    drill: 'Mỗi round late game đổi một vị trí và ghi matchup cần xử lý.',
    href: '/bai-hoc/positioning-targeting-va-pathing',
  },
  {
    id: 'augment',
    label: 'Augment',
    shortLabel: 'AUG',
    signal: 'Bạn chọn lõi mạnh trên giấy nhưng không khớp item, board, HP hoặc econ.',
    lesson: 'Ma trận chọn Nâng Cấp',
    checklist: 'Lõi này giải quyết vấn đề hiện tại hay chỉ làm cap về sau?',
    drill: 'Mỗi augment ghi một lý do hiện tại và một rủi ro.',
    href: '/bai-hoc/chon-nang-cap-tft',
  },
  {
    id: 'strongest-board',
    label: 'Strongest board',
    shortLabel: 'BEST',
    signal: 'Bạn để unit đúng bài trên bench trong khi board hiện tại yếu hơn lobby.',
    lesson: 'Đánh giá sức mạnh bàn đấu',
    checklist: 'Board mạnh nhất trong shop/bench hiện tại là gì?',
    drill: '10 trận stage 2 chỉ tối ưu board mạnh nhất, chưa nghĩ comp cuối.',
    href: '/bai-hoc/strongest-board-va-opener',
  },
];
