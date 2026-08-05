// AUTO-GENERATED bởi scripts/convert-evergreen-lessons.mjs — KHÔNG sửa tay.
// Sửa nội dung ở docs/evergreen rồi chạy lại `pnpm content:sync`.
export type PracticeForm = { id: string; title: string; template: string };

export const practiceForms: PracticeForm[] = [
  {
    "id": "phieu-truoc-phien",
    "title": "Phiếu trước phiên",
    "template": "Ngày:\nPatch:\nRank/LP:\nSố trận dự kiến:\nKỹ năng duy nhất cần luyện:\nBa line quen thuộc:\n1.\n2.\n3.\nTín hiệu khiến tôi dừng phiên:"
  },
  {
    "id": "phieu-mot-tran-60-giay",
    "title": "Phiếu một trận 60 giây",
    "template": "Kết quả:\nOpener:\nĐội hình cuối:\nMáu ở đầu Stage 4:\nRound rolldown:\nVàng trước/sau:\nSố người tranh:\nNhãn lỗi chính:\nRound lỗi đầu tiên:\nMột hành động sửa:"
  },
  {
    "id": "phieu-board-strength",
    "title": "Phiếu board strength",
    "template": "Carry:\nFrontline:\nNâng sao:\nTrang bị:\nTộc/hệ:\nPositioning:\nTổng:"
  },
  {
    "id": "phieu-truoc-rolldown",
    "title": "Phiếu trước rolldown",
    "template": "Level:\nMáu:\nVàng:\nBreakpoint:\nCarry A / B / C:\nTank A / B / C:\nQuân cần giữ:\nQuân có thể bán:\nSố người tranh:\nNgưỡng dừng roll:"
  },
  {
    "id": "phieu-patch",
    "title": "Phiếu patch",
    "template": "Patch:\nThay đổi hệ thống:\nTướng được buff đáng chú ý:\nTướng bị nerf đáng chú ý:\nNâng Cấp thay đổi:\nTrang bị thay đổi:\nBa opener:\nBa line chính:\nCarry giữ đồ vật lý:\nCarry giữ đồ phép:\nTank giữ đồ:\nĐiều chưa chắc cần kiểm chứng:"
  },
  {
    "id": "phieu-20-tran",
    "title": "Phiếu 20 trận",
    "template": "Số trận:\nAverage placement:\nTop 4:\nTop 1:\nTop 7–8:\n\nECO:\nHP:\nTEMPO:\nBOARD:\nITEM:\nAUG:\nLEVEL:\nROLL:\nPIVOT:\nSCOUT:\nPOS:\nCAP:\nMENTAL:\n\nLỗi lặp lại nhiều nhất:\nBài tập 10 trận tiếp:\nTiêu chí hoàn thành:"
  }
];

export const practiceReviewQuestions: string[] = [
  "Tôi bắt đầu mất kiểm soát từ round nào?",
  "Khi đó tôi có thông tin gì?",
  "Tôi đã bỏ qua tín hiệu nào?",
  "Có lựa chọn rẻ hơn nhưng hiệu quả tương đương không?",
  "Tôi roll/lên cấp vì mục tiêu cụ thể hay vì hoảng?",
  "Tôi có giữ đồ quá lâu không?",
  "Tôi có đánh giá sai lobby không?",
  "Tôi có bị tranh nhưng không đổi kế hoạch không?",
  "Positioning có thể cứu round nào?",
  "Quyết định nào đúng dù kết quả xấu?"
];
