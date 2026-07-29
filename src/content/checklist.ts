export type ChecklistItem = {
  id: string;
  text: string;
  focus?: boolean;
};

export type ChecklistStage = {
  id: string;
  label: string;
  items: ChecklistItem[];
};

export const checklistStages: ChecklistStage[] = [
  {
    id: 'lobby',
    label: 'Lobby',
    items: [
      { id: 'lobby-augment', text: 'Lõi/portal đang khuyến khích tempo, econ hay reroll?', focus: true },
      { id: 'lobby-lines', text: 'Mình có 2 line khởi đầu nào nếu item/shop rẽ hướng?' },
      { id: 'lobby-players', text: 'Có ai contest line quen thuộc của mình từ sớm không?' },
    ],
  },
  {
    id: 'stage-2',
    label: 'Stage 2',
    items: [
      { id: 's2-strength', text: 'Board mình mạnh hay yếu so với lobby?', focus: true },
      { id: 's2-streak', text: 'Mình đang chơi để giữ winstreak, losestreak hay máu ổn định?' },
      { id: 's2-items', text: 'Có món nào nên slam để mua máu/tempo không?', focus: true },
      { id: 's2-bench', text: 'Bench có unit giúp board mạnh hơn ngay bây giờ không?' },
    ],
  },
  {
    id: 'stage-3',
    label: 'Stage 3',
    items: [
      { id: 's3-plan', text: 'Line chính và line dự phòng của mình là gì?', focus: true },
      { id: 's3-econ', text: 'Vàng, HP và streak có cho phép greed thêm một round không?' },
      { id: 's3-commit', text: 'Mức cam kết hiện tại là 0, 1, 2, 3 hay 4?' },
      { id: 's3-scout', text: 'Ai đang mạnh hơn mình và mình có cần né matchup không?' },
    ],
  },
  {
    id: 'stage-4',
    label: 'Stage 4',
    items: [
      { id: 's4-roll-target', text: 'Nếu roll bây giờ, mình đang tìm chính xác điều gì?', focus: true },
      { id: 's4-stop', text: 'Điểm dừng rolldown là vàng, nâng cấp hay board ổn định nào?' },
      { id: 's4-pivot', text: 'Nếu không ra bài, pivot an toàn nhất là gì?', focus: true },
      { id: 's4-position', text: 'Carry và tank đã xếp theo lobby thật chưa?' },
    ],
  },
  {
    id: 'late',
    label: 'Late game',
    items: [
      { id: 'late-goal', text: 'Mình đang đánh top 1, top 4 hay cứu top 5–6?', focus: true },
      { id: 'late-upgrade', text: 'Nâng cấp nào thật sự đổi matchup tiếp theo?' },
      { id: 'late-scout', text: 'Đối thủ còn lại có mối nguy nào cần né ngay?' },
    ],
  },
  {
    id: 'post',
    label: 'Sau trận',
    items: [
      { id: 'post-first-error', text: 'Lỗi đầu tiên có thể sửa nằm ở stage nào?', focus: true },
      { id: 'post-good-bad', text: 'Đây là quyết định tốt kết quả xấu hay quyết định xấu kết quả tốt?' },
      { id: 'post-next', text: 'Trận sau mình chỉ sửa một hành vi nào?' },
    ],
  },
];
