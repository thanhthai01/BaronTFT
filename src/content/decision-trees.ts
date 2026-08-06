export type DecisionEdgeTone = 'good' | 'bad' | 'neutral';

export type DecisionAction = {
  kind: 'action';
  id: string;
  label: string;
  action: string;
  detail: string;
  watchFor?: string;
  related?: { label: string; href: string };
  /** Trỏ sang một cây quyết định khác trong cùng trang, để đào sâu thêm vào một chủ đề cụ thể của giai đoạn này. */
  relatedTree?: { treeId: string; label: string };
};

export type DecisionQuestion = {
  kind: 'question';
  id: string;
  label: string;
  question: string;
  detail: string;
  branches: DecisionBranch[];
};

export type DecisionBranch = {
  edgeLabel: string;
  tone: DecisionEdgeTone;
  node: DecisionNode;
};

export type DecisionNode = DecisionQuestion | DecisionAction;

export type DecisionTree = {
  id: string;
  title: string;
  kicker: string;
  summary: string;
  root: DecisionQuestion;
};

const KIEN_THUC_HREF = { label: 'Mở bài học liên quan', href: '/kien-thuc-nen-tang' };
const CHECKLIST_HREF = { label: 'Mở checklist trong trận', href: '/checklist' };

// Quy ước thứ tự nhánh trong toàn bộ file này: nhánh bên TRÁI luôn là trạng
// thái/tin yếu hơn (tone 'bad', hoặc 'neutral' khi ghép với 'good'), nhánh
// bên PHẢI luôn là trạng thái/tin khẳng định, mạnh hơn (tone 'good', hoặc
// 'neutral' khi ghép với 'bad') — khớp layout trái→phải của decision-tree-layout.
// Ngoại lệ duy nhất: root của cây "giai-doan-tran-dau" giữ thứ tự Stage 2→3→4→5+
// vì đó là trình tự thời gian, không phải yếu→mạnh.
export const decisionTrees: DecisionTree[] = [
  {
    id: 'giai-doan-tran-dau',
    title: 'Tổng hợp theo giai đoạn trận đấu',
    kicker: 'Tổng hợp — đọc trận đấu',
    summary: 'Điểm vào nhanh cho từng giai đoạn ván đấu: xác định đang ở đâu, ưu tiên gì, rồi đào sâu vào đúng cây quyết định chuyên đề nếu cần.',
    root: {
      kind: 'question',
      id: 'giai-doan-root',
      label: 'Đang ở giai đoạn nào?',
      question: 'Trận đấu hiện tại đang ở giai đoạn nào — stage 2, stage 3, rolldown lớn stage 4, hay cuối ván stage 5 trở đi?',
      detail: 'Mỗi giai đoạn có một câu hỏi trọng tâm khác nhau. Đây là điểm vào nhanh: xác định giai đoạn trước, rồi trả lời đúng câu hỏi của giai đoạn đó thay vì áp dụng một tư duy chung cho cả ván.',
      branches: [
        {
          edgeLabel: 'Stage 2',
          tone: 'neutral',
          node: {
            kind: 'question',
            id: 'giai-doan-stage2',
            label: 'Bench/shop cho board mạnh bất ngờ?',
            question: 'Ở stage 2, bench và shop có đang cho một board mạnh hơn kỳ vọng, hay board vẫn bình thường/yếu?',
            detail: 'Stage 2 là giai đoạn thăm dò strongest board. Câu hỏi trọng tâm không phải "line cuối là gì" mà là "board mạnh nhất mình ghép được ngay bây giờ là gì".',
            branches: [
              {
                edgeLabel: 'Bình thường/yếu',
                tone: 'bad',
                node: {
                  kind: 'action',
                  id: 'giai-doan-stage2-yeu',
                  label: 'Tối giản, ưu tiên kinh tế',
                  action: 'Chơi board tối giản, ưu tiên giữ breakpoint kinh tế, chuẩn bị line linh hoạt cho stage 3.',
                  detail: 'Board chưa mạnh ở stage 2 không đáng lo — ưu tiên kinh tế sạch để có nhiều lựa chọn hơn khi bước sang stage 3, thay vì gồng board yếu để giữ round.',
                  relatedTree: { treeId: 'len-cap', label: 'Đào sâu: Khi nào lên cấp' },
                },
              },
              {
                edgeLabel: 'Mạnh bất ngờ',
                tone: 'good',
                node: {
                  kind: 'action',
                  id: 'giai-doan-stage2-manh',
                  label: 'Đẩy nhanh, cân nhắc winstreak',
                  action: 'Tối ưu board mạnh nhất hiện có, cân nhắc nuôi winstreak nếu không phải gồng.',
                  detail: 'Board mạnh bất ngờ ở stage 2 là cơ hội winstreak gần như miễn phí. Đừng vội khóa line cuối — cứ chơi board mạnh nhất và giữ độ mở.',
                  relatedTree: { treeId: 'streak', label: 'Đào sâu: Khi nào chơi winstreak/losestreak' },
                },
              },
            ],
          },
        },
        {
          edgeLabel: 'Stage 3',
          tone: 'neutral',
          node: {
            kind: 'question',
            id: 'giai-doan-stage3',
            label: 'Đã xác định line chính chưa?',
            question: 'Ở stage 3, bạn đã xác định được line chính (tộc hệ/carry) muốn đầu tư hay chưa?',
            detail: 'Stage 3 là giai đoạn chuyển từ thăm dò sang cam kết. Câu hỏi trọng tâm là mức độ chắc chắn về hướng đi, vì nó quyết định có nên bắt đầu lên đồ nặng hay chưa.',
            branches: [
              {
                edgeLabel: 'Chưa rõ line',
                tone: 'bad',
                node: {
                  kind: 'action',
                  id: 'giai-doan-stage3-chua-ro',
                  label: 'Giữ flex, ưu tiên scout',
                  action: 'Chưa lên đồ thành phẩm nặng, tăng tần suất scout để chọn line dựa trên dữ liệu thật của lobby.',
                  detail: 'Cam kết sớm khi chưa rõ hướng đi thường dẫn tới pivot đắt đỏ sau này. Giữ flex ở stage 3 rẻ hơn nhiều so với pivot ở stage 4.',
                  relatedTree: { treeId: 'scout', label: 'Đào sâu: Khi nào scout' },
                },
              },
              {
                edgeLabel: 'Đã rõ line',
                tone: 'good',
                node: {
                  kind: 'action',
                  id: 'giai-doan-stage3-ro',
                  label: 'Đầu tư đồ, lên cấp theo breakpoint',
                  action: 'Bắt đầu lên đồ nặng cho carry chính, lên cấp theo breakpoint, theo dõi mức độ bị contest.',
                  detail: 'Đã xác định line thì đây là lúc chuyển tài nguyên (đồ, vàng) vào đúng hướng đó một cách có kỷ luật, không dàn trải nữa.',
                  relatedTree: { treeId: 'slam-do', label: 'Đào sâu: Khi nào slam đồ hoặc giữ đồ' },
                },
              },
            ],
          },
        },
        {
          edgeLabel: 'Stage 4 — rolldown lớn',
          tone: 'neutral',
          node: {
            kind: 'question',
            id: 'giai-doan-stage4',
            label: 'Board đủ mạnh qua rolldown lobby?',
            question: 'Ở stage 4, board hiện tại có đang đủ mạnh để chịu được các rolldown lớn của lobby hay không?',
            detail: 'Stage 4 là nơi phần lớn lobby rolldown quyết định. Câu hỏi trọng tâm là bạn đang chủ động rolldown để hoàn thiện, hay bị động rolldown để cứu vãn.',
            branches: [
              {
                edgeLabel: 'Chưa đủ mạnh',
                tone: 'bad',
                node: {
                  kind: 'action',
                  id: 'giai-doan-stage4-chua-du',
                  label: 'Rolldown khẩn cấp hoặc pivot gấp',
                  action: 'Xác định nhanh: còn cứu được board hiện tại bằng rolldown, hay cần pivot gấp sang line khác đang mở.',
                  detail: 'Đây là cửa sổ quyết định của ván đấu. Chần chừ giữa hai lựa chọn tốn round quý giá hơn là chọn sai một trong hai và đi dứt khoát.',
                  relatedTree: { treeId: 'pivot', label: 'Đào sâu: Khi nào pivot' },
                },
              },
              {
                edgeLabel: 'Đủ mạnh',
                tone: 'good',
                node: {
                  kind: 'action',
                  id: 'giai-doan-stage4-du-manh',
                  label: 'Rolldown hoàn thiện đội hình',
                  action: 'Rolldown có kế hoạch để hoàn thiện 2-3 sao carry và chốt vị trí, không cần vội vàng.',
                  detail: 'Board đã đủ mạnh thì rolldown lúc này là để tối ưu, không phải để sống sót — có thể chọn thời điểm tốt nhất thay vì bị ép bởi HP.',
                  relatedTree: { treeId: 'roll', label: 'Đào sâu: Khi nào roll' },
                },
              },
            ],
          },
        },
        {
          edgeLabel: 'Stage 5+ — cuối ván',
          tone: 'neutral',
          node: {
            kind: 'question',
            id: 'giai-doan-stage5',
            label: 'Thuộc nhóm dẫn đầu hay nguy hiểm?',
            question: 'Ở giai đoạn cuối ván, bạn đang thuộc nhóm dẫn đầu lobby hay nhóm HP nguy hiểm?',
            detail: 'Cuối ván không còn thời gian để tối ưu dài hạn — mọi quyết định phục vụ trực tiếp cho placement cuối cùng.',
            branches: [
              {
                edgeLabel: 'Nguy hiểm',
                tone: 'bad',
                node: {
                  kind: 'action',
                  id: 'giai-doan-stage5-nguy-hiem',
                  label: 'Chuyển sang phòng thủ, cứu top 6',
                  action: 'Tối giản mục tiêu về sống sót: đổi carry rẻ chống mối nguy trước mắt, bỏ tham vọng cao hơn.',
                  detail: 'Ở trạng thái nguy hiểm cuối ván, một placement thấp hơn dự kiến vẫn tốt hơn bị loại sớm vì cố gỡ liều lĩnh.',
                  relatedTree: { treeId: 'top1-top4-cuu-top6', label: 'Đào sâu: Đánh top 1, top 4 hay cứu top 6' },
                },
              },
              {
                edgeLabel: 'Dẫn đầu',
                tone: 'good',
                node: {
                  kind: 'action',
                  id: 'giai-doan-stage5-dan-dau',
                  label: 'Chơi vì top 1, greed có kiểm soát',
                  action: 'Tiếp tục hoàn thiện board, greed thêm nếu HP còn cho phép, tránh sai lầm không đáng ở round cuối.',
                  detail: 'Đang dẫn đầu thì mục tiêu là giữ vững, không phải liều lĩnh thêm. Chỉ greed khi HP thực sự còn dư địa.',
                  relatedTree: { treeId: 'top1-top4-cuu-top6', label: 'Đào sâu: Đánh top 1, top 4 hay cứu top 6' },
                },
              },
            ],
          },
        },
      ],
    },
  },
  {
    id: 'len-cap',
    title: 'Khi nào lên cấp',
    kicker: 'Kinh tế & tempo',
    summary: 'Lên cấp là mua xác suất bắt bài tier cao hơn. Chỉ đáng mua khi board hiện tại cần nó hơn là cần thêm vàng lãi.',
    root: {
      kind: 'question',
      id: 'len-cap-root',
      label: 'Board đang thắng round?',
      question: 'Board hiện tại có đang thắng phần lớn round gần đây (ngang hoặc mạnh hơn lobby)?',
      detail: 'Đây là câu hỏi gốc: lên cấp trong lúc đang thắng khác hẳn lên cấp trong lúc đang thua, vì mục tiêu khác nhau — một bên đè tempo, một bên tìm đường sống.',
      branches: [
        {
          edgeLabel: 'Đang thua',
          tone: 'bad',
          node: {
            kind: 'question',
            id: 'len-cap-thua',
            label: 'HP còn trên 50?',
            question: 'HP hiện tại còn trên 50 và chưa ở mức nguy hiểm?',
            detail: 'Khi đang thua, câu hỏi không còn là "tối ưu vàng" mà là "còn bao nhiêu thời gian để sửa board" — HP quyết định bạn có quyền lên cấp từ từ hay phải hành động ngay.',
            branches: [
              {
                edgeLabel: 'HP nguy hiểm',
                tone: 'bad',
                node: {
                  kind: 'action',
                  id: 'len-cap-gap',
                  label: 'Lên cấp gấp rồi roll cứu HP',
                  action: 'Lên cấp ngay 1 lần rồi roll toàn bộ vàng còn lại để cứu board.',
                  detail: 'HP thấp nghĩa là bạn hết quyền chờ đợi. Lên cấp một lần để mở xác suất bắt bài tốt hơn, sau đó roll dứt khoát — trì hoãn thêm chỉ tốn round trong khi máu vẫn mất.',
                  watchFor: 'Đặt điểm dừng roll trước khi bấm: hết vàng hoặc hết mục tiêu rõ ràng thì dừng, không roll theo cảm tính.',
                  related: CHECKLIST_HREF,
                },
              },
              {
                edgeLabel: 'HP còn an toàn',
                tone: 'neutral',
                node: {
                  kind: 'action',
                  id: 'len-cap-tu-tu',
                  label: 'Lên cấp để mở tier bài mới',
                  action: 'Lên cấp đều đặn để mở tier tiếp theo, chưa cần roll cứu gấp.',
                  detail: 'Bạn vẫn còn khoảng đệm HP để chịu vài round thua thêm. Ưu tiên lên cấp mở tier bài, tìm unit nâng board thay vì đốt vàng roll ở tier hiện tại.',
                  related: KIEN_THUC_HREF,
                },
              },
            ],
          },
        },
        {
          edgeLabel: 'Đang thắng',
          tone: 'good',
          node: {
            kind: 'question',
            id: 'len-cap-thang',
            label: 'Sắp chạm breakpoint 50 vàng?',
            question: 'Bạn có đang giữ vàng để chạm breakpoint kinh tế lớn (thường là 50) trong 1–2 round tới?',
            detail: 'Breakpoint 50 vàng cho lãi tối đa mỗi round. Phá vỡ nó sớm chỉ để lên cấp thường lỗ nhiều vàng lãi hơn phần tempo nhận lại được.',
            branches: [
              {
                edgeLabel: 'Sắp chạm 50',
                tone: 'neutral',
                node: {
                  kind: 'action',
                  id: 'len-cap-giu-vang',
                  label: 'Giữ vàng, hoãn lên cấp',
                  action: 'Giữ vàng thêm 1–2 round rồi mới lên cấp.',
                  detail: 'Đang thắng nghĩa là bạn có quyền chờ. Chạm breakpoint trước, lên cấp sau — bạn vẫn giữ tempo tốt mà không mất lãi.',
                  watchFor: 'Đừng chờ quá 2 round: thắng streak có thể đứt bất ngờ nếu lobby đổi nhịp.',
                  related: KIEN_THUC_HREF,
                },
              },
              {
                edgeLabel: 'Còn xa 50',
                tone: 'good',
                node: {
                  kind: 'action',
                  id: 'len-cap-ngay',
                  label: 'Lên cấp ngay, đè tempo',
                  action: 'Lên cấp ngay để mở rộng bàn và giữ vị trí dẫn đầu.',
                  detail: 'Không có breakpoint gần để chờ, nên phần thưởng từ tempo lớn hơn phần vàng lãi bị mất. Lên cấp lúc đang mạnh giúp bạn nới rộng khoảng cách với lobby.',
                  related: KIEN_THUC_HREF,
                },
              },
            ],
          },
        },
      ],
    },
  },
  {
    id: 'roll',
    title: 'Khi nào roll',
    kicker: 'Kinh tế & tempo',
    summary: 'Roll là đổi vàng lấy xác suất. Chỉ roll khi bạn biết chính xác mình đang tìm gì và biết điểm dừng trước khi bấm.',
    root: {
      kind: 'question',
      id: 'roll-root',
      label: 'Có mục tiêu roll rõ ràng?',
      question: 'Trước khi roll, bạn có xác định chính xác đang tìm unit hoặc nâng cấp nào không?',
      detail: 'Roll không có mục tiêu là dấu hiệu roll vì hoảng, không phải vì tính toán. Đây luôn là câu hỏi đầu tiên trước khi chạm vào nút roll.',
      branches: [
        {
          edgeLabel: 'Không có mục tiêu',
          tone: 'bad',
          node: {
            kind: 'question',
            id: 'roll-khong-muc-tieu',
            label: 'Board có đang thua rõ rệt?',
            question: 'Board hiện tại có đang thua rõ rệt so với lobby, đến mức không roll cũng nguy hiểm?',
            detail: 'Không có mục tiêu rõ không có nghĩa là không được roll — nó có nghĩa là bạn phải dừng lại xác định mục tiêu trước, hoặc nhận ra mình chưa cần roll.',
            branches: [
              {
                edgeLabel: 'Đang thua rõ',
                tone: 'bad',
                node: {
                  kind: 'action',
                  id: 'roll-xac-dinh-lai',
                  label: 'Dừng, xác định mục tiêu rồi mới roll',
                  action: 'Dành 5 giây scout bench và shop, chọn đúng 1 mục tiêu, rồi mới roll.',
                  detail: 'Roll khi đang hoảng dễ tiêu hết vàng mà không giải quyết đúng vấn đề. Xác định mục tiêu trước — dù chỉ vài giây — vẫn tốt hơn roll ngẫu nhiên.',
                  related: CHECKLIST_HREF,
                },
              },
              {
                edgeLabel: 'Board vẫn ổn',
                tone: 'good',
                node: {
                  kind: 'action',
                  id: 'roll-chua-can',
                  label: 'Chưa cần roll, giữ vàng',
                  action: 'Giữ vàng, tiếp tục lên cấp hoặc chờ shop tự nhiên đổi.',
                  detail: 'Board vẫn đủ sống được thì roll lúc này chỉ đốt lãi không cần thiết. Vàng giữ được hôm nay là tempo bạn có quyền dùng đúng lúc hơn.',
                  related: KIEN_THUC_HREF,
                },
              },
            ],
          },
        },
        {
          edgeLabel: 'Có mục tiêu',
          tone: 'good',
          node: {
            kind: 'question',
            id: 'roll-co-muc-tieu',
            label: 'Đủ vàng qua breakpoint sau roll?',
            question: 'Sau khi roll xong, bạn còn đủ vàng để giữ ít nhất một breakpoint kinh tế (10/20/30/50)?',
            detail: 'Roll xuống 0 tuyệt đối sạch vàng lãi là chấp nhận được ở rolldown quyết định, nhưng roll nửa vời làm mất breakpoint mà không đổi được board là lỗ kép.',
            branches: [
              {
                edgeLabel: 'Cần roll sâu',
                tone: 'neutral',
                node: {
                  kind: 'action',
                  id: 'roll-sau',
                  label: 'Rolldown dứt khoát',
                  action: 'Roll toàn bộ vàng cho mục tiêu, chấp nhận mất breakpoint round này.',
                  detail: 'Nếu mục tiêu đủ lớn (2 sao carry chính, hoặc cứu board trước rolldown địch), phá breakpoint một lần là hợp lý — miễn là bạn dừng đúng lúc hết mục tiêu, không roll tiếp theo quán tính.',
                  watchFor: 'Ghi lại số vàng trước và sau rolldown để biết mình có đang roll quá tay không.',
                  related: CHECKLIST_HREF,
                },
              },
              {
                edgeLabel: 'Còn breakpoint',
                tone: 'good',
                node: {
                  kind: 'action',
                  id: 'roll-nhe',
                  label: 'Roll nhẹ đến điểm dừng đã đặt',
                  action: 'Roll đến khi đạt mục tiêu hoặc chạm breakpoint kế tiếp, rồi dừng.',
                  detail: 'Đây là roll thăm dò: không phá kinh tế, chỉ tận dụng xác suất dư trong khi vẫn giữ lãi. Dừng đúng lúc quan trọng hơn roll thêm vài lượt.',
                  related: KIEN_THUC_HREF,
                },
              },
            ],
          },
        },
      ],
    },
  },
  {
    id: 'pivot',
    title: 'Khi nào pivot',
    kicker: 'Flex & xây đội hình',
    summary: 'Pivot là đổi hướng đội hình. Mức cam kết vào comp hiện tại quyết định pivot có rẻ hay đắt.',
    root: {
      kind: 'question',
      id: 'pivot-root',
      label: 'Comp hiện tại có đang yếu hơn lobby?',
      question: 'Comp hiện tại có đang rõ ràng yếu hơn mặt bằng lobby ở stage này?',
      detail: 'Pivot chỉ đáng cân nhắc khi có bằng chứng — thua liên tiếp, thiếu hụt tộc hệ, hoặc bị contest gắt — không phải vì thấy comp khác đang thắng.',
      branches: [
        {
          edgeLabel: 'Đang yếu hơn',
          tone: 'bad',
          node: {
            kind: 'question',
            id: 'pivot-yeu-hon',
            label: 'Mức cam kết còn thấp (0–1)?',
            question: 'Bạn đã đầu tư bao nhiêu vào comp hiện tại — mức cam kết còn ở 0–1 (chưa lên đồ nặng, chưa 2-3 sao carry)?',
            detail: 'Cam kết thấp nghĩa là chi phí pivot rẻ: bạn chưa mất nhiều item hay vàng để đổi hướng. Cam kết cao thì pivot cần lý do mạnh hơn nhiều.',
            branches: [
              {
                edgeLabel: 'Cam kết cao',
                tone: 'neutral',
                node: {
                  kind: 'action',
                  id: 'pivot-flex-tung-phan',
                  label: 'Flex từng phần, giữ core còn dùng được',
                  action: 'Chỉ đổi phần đang yếu nhất (thường là 1 tộc hệ hoặc 1 slot carry), giữ lại item và unit còn dùng chung được.',
                  detail: 'Đã lên đồ nặng thì pivot toàn bộ quá đắt. Tìm comp lân cận dùng chung được carry hoặc item chính, coi đây là điều chỉnh chứ không phải đổi hẳn.',
                  watchFor: 'Nếu không có comp lân cận nào dùng chung được đồ, chấp nhận chơi tiếp để cứu top 4 thay vì đổi trắng tay.',
                  related: KIEN_THUC_HREF,
                },
              },
              {
                edgeLabel: 'Cam kết thấp',
                tone: 'good',
                node: {
                  kind: 'action',
                  id: 'pivot-doi-ngay',
                  label: 'Pivot ngay sang line mạnh nhất bench/shop',
                  action: 'Đổi hướng ngay sang comp mà bench và shop đang hỗ trợ tốt nhất.',
                  detail: 'Chưa mất nhiều để giữ line cũ, nên đổi sớm gần như miễn phí. Chọn line dựa trên unit đang có, không dựa trên comp đang thắng trên bảng xếp hạng.',
                  related: KIEN_THUC_HREF,
                },
              },
            ],
          },
        },
        {
          edgeLabel: 'Vẫn ổn',
          tone: 'good',
          node: {
            kind: 'question',
            id: 'pivot-van-on',
            label: 'Có bị contest gắt bởi 2+ người?',
            question: 'Dù comp vẫn ổn, có đang bị 2 người trở lên contest gắt cùng tộc hệ/carry chính không?',
            detail: 'Comp ổn nhưng bị contest nặng vẫn có thể cần pivot phòng ngừa trước khi tình hình xấu đi, thay vì đợi đến lúc đã yếu mới xử lý.',
            branches: [
              {
                edgeLabel: 'Bị contest gắt',
                tone: 'neutral',
                node: {
                  kind: 'action',
                  id: 'pivot-du-phong',
                  label: 'Chuẩn bị line dự phòng, chưa đổi ngay',
                  action: 'Giữ line hiện tại, đồng thời lên bench 1–2 unit của line dự phòng để sẵn sàng đổi khi cần.',
                  detail: 'Chưa cần pivot ngay vì board vẫn ổn, nhưng chuẩn bị trước giúp bạn không bị động nếu contest khiến shop cạn bài trong vài round tới.',
                  related: KIEN_THUC_HREF,
                },
              },
              {
                edgeLabel: 'Không bị contest',
                tone: 'good',
                node: {
                  kind: 'action',
                  id: 'pivot-khong-can',
                  label: 'Không pivot, đi tiếp line hiện tại',
                  action: 'Tiếp tục đầu tư vào comp hiện tại, không cần đổi hướng.',
                  detail: 'Không có tín hiệu nào đòi hỏi đổi hướng. Pivot khi không cần thiết chỉ làm chậm sức mạnh board mà không có lợi ích tương xứng.',
                  related: KIEN_THUC_HREF,
                },
              },
            ],
          },
        },
      ],
    },
  },
  {
    id: 'slam-do',
    title: 'Khi nào slam đồ hoặc giữ đồ',
    kicker: 'Trang bị',
    summary: 'Đồ có chức năng, không chỉ có sức mạnh trên giấy. Slam khi nó giải quyết vấn đề hiện tại, giữ khi chưa rõ vấn đề là gì.',
    root: {
      kind: 'question',
      id: 'slam-do-root',
      label: 'Món đồ khớp carry hiện tại?',
      question: 'Món đồ vừa nhặt/mua có khớp với carry hoặc core hiện tại của board không?',
      detail: 'Đồ mạnh nhưng sai carry vẫn là đồ chết trên bench. Câu hỏi đầu tiên luôn là khớp hay không khớp, chưa phải mạnh hay yếu.',
      branches: [
        {
          edgeLabel: 'Không khớp carry',
          tone: 'bad',
          node: {
            kind: 'question',
            id: 'slam-do-khong-khop',
            label: 'Có carry phụ hoặc tank dùng được?',
            question: 'Có carry phụ, tank, hoặc unit tuyến 2 nào trong board dùng được món đồ này không?',
            detail: 'Đồ không khớp carry chính chưa chắc vô dụng — nhiều đồ phòng thủ hoặc hỗ trợ vẫn có giá trị lớn trên unit khác.',
            branches: [
              {
                edgeLabel: 'Không unit nào dùng được',
                tone: 'bad',
                node: {
                  kind: 'action',
                  id: 'slam-do-giu-cho-pivot',
                  label: 'Giữ nguyên liệu, chờ pivot hoặc unit mới',
                  action: 'Giữ nguyên liệu thô trên bench, chưa ghép, chờ carry phù hợp hoặc pivot.',
                  detail: 'Ghép combo sai chỉ để "dùng cho hết" là lãng phí — đồ thành phẩm khó tháo lại đúng combo khác. Giữ nguyên liệu linh hoạt hơn giữ đồ thành phẩm sai.',
                  related: KIEN_THUC_HREF,
                },
              },
              {
                edgeLabel: 'Có unit khác dùng được',
                tone: 'neutral',
                node: {
                  kind: 'action',
                  id: 'slam-do-unit-khac',
                  label: 'Gắn cho unit tuyến 2 phù hợp',
                  action: 'Gắn đồ lên tank hoặc carry phụ để tận dụng ngay, không để bench.',
                  detail: 'Tận dụng chức năng trên unit khác vẫn tốt hơn giữ đồ chết. Đồ phòng thủ trên tank thường vẫn tăng sức chịu đựng cho toàn đội.',
                  related: KIEN_THUC_HREF,
                },
              },
            ],
          },
        },
        {
          edgeLabel: 'Khớp carry',
          tone: 'good',
          node: {
            kind: 'question',
            id: 'slam-do-khop',
            label: 'Đang cần damage/frontline/tempo ngay?',
            question: 'Board hiện tại có đang thiếu hụt rõ ràng về damage, frontline, hoặc tempo ngay bây giờ?',
            detail: 'Slam đồ đáng giá nhất khi nó lấp đúng lỗ hổng hiện tại — không phải khi board đã đủ mạnh và bạn slam chỉ vì "có đồ thì dùng".',
            branches: [
              {
                edgeLabel: 'Board đã đủ mạnh',
                tone: 'neutral',
                node: {
                  kind: 'action',
                  id: 'slam-do-cho',
                  label: 'Giữ 1 round, chờ combo tốt hơn',
                  action: 'Giữ đồ trên bench thêm 1 round để chờ nguyên liệu ghép combo tối ưu hơn.',
                  detail: 'Board đã ổn nên bạn có quyền chờ ngắn hạn — nhưng đặt giới hạn thời gian rõ ràng (1 round), không để đồ nằm chết vô thời hạn.',
                  watchFor: 'Nếu quá 1–2 round vẫn chưa ghép được, slam luôn thay vì tiếp tục chờ.',
                  related: KIEN_THUC_HREF,
                },
              },
              {
                edgeLabel: 'Đang thiếu hụt',
                tone: 'good',
                node: {
                  kind: 'action',
                  id: 'slam-do-ngay',
                  label: 'Slam ngay',
                  action: 'Gắn đồ ngay lên carry hoặc tank đang thiếu hụt tương ứng.',
                  detail: 'Lợi ích tức thời (thắng round, giữ HP, giữ tempo) ở đây lớn hơn rủi ro "có thể tìm được combo tốt hơn sau". Đừng để đồ nằm bench chờ hoàn hảo.',
                  related: KIEN_THUC_HREF,
                },
              },
            ],
          },
        },
      ],
    },
  },
  {
    id: 'streak',
    title: 'Khi nào chơi winstreak/losestreak',
    kicker: 'Kinh tế & tempo',
    summary: 'Streak (thắng hoặc thua liên tục) là vàng miễn phí — nhưng chỉ đáng đuổi theo khi chi phí cơ hội thấp hơn phần thưởng.',
    root: {
      kind: 'question',
      id: 'streak-root',
      label: 'Đang thắng hay thua liên tục?',
      question: 'Bạn đang trong chuỗi thắng liên tục hay thua liên tục ở giai đoạn đầu ván (stage 2–3)?',
      detail: 'Streak sớm (stage 2–3) đáng cân nhắc nuôi vì phần thưởng vàng cộng dồn lớn; streak muộn thường không còn đáng đánh đổi tempo.',
      branches: [
        {
          edgeLabel: 'Đang losestreak',
          tone: 'bad',
          node: {
            kind: 'question',
            id: 'streak-lose',
            label: 'HP còn đủ đệm để chịu thêm?',
            question: 'HP hiện tại còn đủ đệm để chịu thêm vài round thua nữa mà không nguy hiểm?',
            detail: 'Losestreak có kiểm soát (đủ HP đệm) là chiến thuật hợp lệ để nuôi kinh tế; losestreak mất kiểm soát (HP mỏng) là rủi ro bị loại sớm.',
            branches: [
              {
                edgeLabel: 'HP mỏng',
                tone: 'bad',
                node: {
                  kind: 'action',
                  id: 'streak-lose-ngat',
                  label: 'Ngắt losestreak ngay, ưu tiên sống',
                  action: 'Dừng chiến thuật losestreak, roll hoặc lên cấp ngay để thắng round tiếp theo.',
                  detail: 'HP mỏng loại bỏ mọi lợi ích lý thuyết của losestreak — mục tiêu duy nhất lúc này là sống sót qua stage 3, không phải tối ưu kinh tế.',
                  watchFor: 'Đừng để "đang nuôi econ" trở thành lý do biện minh cho việc phớt lờ HP nguy hiểm.',
                  related: CHECKLIST_HREF,
                },
              },
              {
                edgeLabel: 'HP còn đệm',
                tone: 'neutral',
                node: {
                  kind: 'action',
                  id: 'streak-lose-co-chu-dich',
                  label: 'Losestreak có chủ đích để nuôi econ',
                  action: 'Giữ board tối giản, ưu tiên lãi vàng thay vì cố thắng round lẻ tẻ.',
                  detail: 'Nếu HP còn nhiều, losestreak có kiểm soát giúp bạn tích vàng nhanh hơn để có rolldown mạnh ở stage 3–4. Đây là lựa chọn chủ động, không phải bị động thua.',
                  related: KIEN_THUC_HREF,
                },
              },
            ],
          },
        },
        {
          edgeLabel: 'Đang winstreak',
          tone: 'good',
          node: {
            kind: 'question',
            id: 'streak-win',
            label: 'Board đang mạnh tự nhiên, không gồng?',
            question: 'Board hiện tại có đang mạnh một cách tự nhiên (không cần lên cấp/roll ngoài kế hoạch để giữ streak)?',
            detail: 'Winstreak đáng nuôi khi nó đến miễn phí. Nếu phải gồng — lên cấp sớm hơn dự định, roll ngoài kế hoạch — phần thưởng vàng thường không bù được tempo mất.',
            branches: [
              {
                edgeLabel: 'Phải gồng để giữ',
                tone: 'neutral',
                node: {
                  kind: 'action',
                  id: 'streak-buong',
                  label: 'Sẵn sàng buông streak, ưu tiên kế hoạch econ',
                  action: 'Quay lại kế hoạch lên cấp/roll ban đầu, chấp nhận đứt streak nếu cần.',
                  detail: 'Streak chỉ đáng vài vàng mỗi round bị đứt sớm. Gồng để giữ nó thường phá vỡ breakpoint hoặc tempo, khiến bạn lỗ nhiều hơn phần thưởng nhận lại.',
                  related: KIEN_THUC_HREF,
                },
              },
              {
                edgeLabel: 'Mạnh tự nhiên',
                tone: 'good',
                node: {
                  kind: 'action',
                  id: 'streak-nuoi',
                  label: 'Tiếp tục nuôi streak, chưa cần can thiệp',
                  action: 'Giữ nguyên nhịp chơi, để streak tự nhiên tiếp diễn.',
                  detail: 'Đây là vàng miễn phí — không cần đổi kế hoạch econ hay lên cấp chỉ để giữ nó. Cứ chơi đúng nhịp, streak sẽ tự duy trì nếu board đủ mạnh.',
                  related: KIEN_THUC_HREF,
                },
              },
            ],
          },
        },
      ],
    },
  },
  {
    id: 'top1-top4-cuu-top6',
    title: 'Đánh top 1, top 4 hay cứu top 6',
    kicker: 'Đọc trận đấu',
    summary: 'Mỗi trận chỉ nên chơi vì đúng một mục tiêu. Xác định sai mục tiêu là nguyên nhân phổ biến nhất của quyết định sai ở giữa và cuối ván.',
    root: {
      kind: 'question',
      id: 'placement-root',
      label: 'Board đang top 1–2 lobby?',
      question: 'Ở stage hiện tại, board của bạn có đang nằm trong nhóm 1–2 mạnh nhất lobby?',
      detail: 'Vị trí sức mạnh tương đối trong lobby — không phải placement hiện tại trên bảng — quyết định bạn nên chơi vì top 1, top 4 hay chỉ cứu top 6.',
      branches: [
        {
          edgeLabel: 'Không thuộc top 1–2',
          tone: 'bad',
          node: {
            kind: 'question',
            id: 'placement-yeu',
            label: 'HP còn trên mức nguy hiểm?',
            question: 'HP hiện tại có còn trên mức nguy hiểm (đủ để chơi tiếp vài round mà chưa bị loại)?',
            detail: 'Khi board không thuộc nhóm mạnh nhất, HP là yếu tố quyết định bạn còn quyền chơi vì top 4 hay chỉ còn có thể cố cứu top 6.',
            branches: [
              {
                edgeLabel: 'HP nguy hiểm',
                tone: 'bad',
                node: {
                  kind: 'action',
                  id: 'placement-cuu-top6',
                  label: 'Chuyển sang cứu top 6',
                  action: 'Tối giản mục tiêu: chỉ cần sống thêm càng nhiều round càng tốt, chấp nhận bỏ tham vọng cao hơn.',
                  detail: 'Ở trạng thái này, mọi quyết định nên phục vụ việc kéo dài thời gian sống — đổi carry rẻ tiền chống lại mối nguy trước mắt, không tiếc unit hay item nữa.',
                  watchFor: 'Đừng cố "gỡ" bằng cách all-in mạo hiểm — cứu top 6 là mục tiêu phòng thủ, không phải phục hồi.',
                  related: CHECKLIST_HREF,
                },
              },
              {
                edgeLabel: 'HP còn ổn',
                tone: 'neutral',
                node: {
                  kind: 'action',
                  id: 'placement-danh-top4',
                  label: 'Chơi vì top 4',
                  action: 'Ổn định board đủ dùng, ưu tiên sống qua các rolldown lớn của lobby.',
                  detail: 'Mục tiêu thực tế nhất là giữ vị trí giữa bảng. Không cần mạo hiểm đổi lấy top 1 khi board chưa đủ mạnh — tập trung không chết trước các cú rolldown mạnh của đối thủ.',
                  related: KIEN_THUC_HREF,
                },
              },
            ],
          },
        },
        {
          edgeLabel: 'Top 1–2 lobby',
          tone: 'good',
          node: {
            kind: 'question',
            id: 'placement-manh',
            label: 'HP còn đủ để greed thêm?',
            question: 'HP hiện tại có còn đủ cao để tiếp tục đầu tư sâu hơn (greed) mà không sợ bị loại sớm?',
            detail: 'Board mạnh chưa chắc nên all-in top 1 nếu HP đã mỏng — đôi khi giữ chắc top 4 an toàn hơn là mạo hiểm đổi lấy top 1 không chắc chắn.',
            branches: [
              {
                edgeLabel: 'HP đã mỏng',
                tone: 'neutral',
                node: {
                  kind: 'action',
                  id: 'placement-giu-top4',
                  label: 'Giữ chắc top 4, hạn chế rủi ro thêm',
                  action: 'Ưu tiên phòng thủ, tránh đổi mạo hiểm chỉ để đuổi top 1.',
                  detail: 'Top 4 chắc chắn thường có giá trị kỳ vọng cao hơn một canh bạc top 1 khi HP không còn nhiều dư địa sai số.',
                  related: KIEN_THUC_HREF,
                },
              },
              {
                edgeLabel: 'HP còn dày',
                tone: 'good',
                node: {
                  kind: 'action',
                  id: 'placement-choi-top1',
                  label: 'Chơi vì top 1',
                  action: 'Đầu tư tối đa vào board: lên sao, hoàn thiện item, greed thêm unit tối ưu.',
                  detail: 'Đây là lúc bung sức mạnh tối đa. Chấp nhận rủi ro cao hơn vì phần thưởng (top 1 thay vì top 4) đủ lớn và bạn có đệm HP để chịu sai số.',
                  related: KIEN_THUC_HREF,
                },
              },
            ],
          },
        },
      ],
    },
  },
  {
    id: 'scout',
    title: 'Khi nào scout',
    kicker: 'Scouting & positioning',
    summary: 'Scout chỉ có giá trị khi nó đổi được một quyết định cụ thể. Nhìn bàn người khác mà không đổi gì là scout vô ích.',
    root: {
      kind: 'question',
      id: 'scout-root',
      label: 'Sắp có quyết định cần thông tin lobby?',
      question: 'Bạn sắp phải ra một quyết định (roll, lên cấp, đổi vị trí) mà kết quả phụ thuộc vào thông tin lobby?',
      detail: 'Scout nên được kích hoạt bởi một quyết định sắp tới, không phải theo thói quen bấm xem bàn ngẫu nhiên.',
      branches: [
        {
          edgeLabel: 'Chưa có quyết định',
          tone: 'bad',
          node: {
            kind: 'question',
            id: 'scout-chua-co-quyet-dinh',
            label: 'Chuẩn bị bước vào rolldown lớn?',
            question: 'Dù chưa có quyết định ngay, bạn có sắp bước vào một rolldown lớn (stage 4 trở đi) cần chuẩn bị trước?',
            detail: 'Trước rolldown lớn, scout phòng ngừa (dù chưa cần quyết định ngay) vẫn đáng làm để chuẩn bị tâm lý và kế hoạch item.',
            branches: [
              {
                edgeLabel: 'Sắp rolldown lớn',
                tone: 'neutral',
                node: {
                  kind: 'action',
                  id: 'scout-chuan-bi',
                  label: 'Scout chuẩn bị, chưa cần đổi gì ngay',
                  action: 'Ghi nhận nhanh comp mạnh nhất lobby và mối nguy tiềm tàng, chưa cần hành động.',
                  detail: 'Đây là scout phòng ngừa — thu thập thông tin để dùng cho quyết định vài round tới, không phải để đổi gì ngay bây giờ.',
                  related: KIEN_THUC_HREF,
                },
              },
              {
                edgeLabel: 'Chưa cần',
                tone: 'good',
                node: {
                  kind: 'action',
                  id: 'scout-bo-qua',
                  label: 'Bỏ qua, tập trung board của mình',
                  action: 'Không scout round này, dồn thời gian xử lý bench và shop của bản thân.',
                  detail: 'Scout không dẫn tới quyết định nào là thời gian lãng phí. Tốt hơn nên dùng round này để tối ưu board của chính mình.',
                  related: KIEN_THUC_HREF,
                },
              },
            ],
          },
        },
        {
          edgeLabel: 'Có quyết định sắp tới',
          tone: 'good',
          node: {
            kind: 'question',
            id: 'scout-co-quyet-dinh',
            label: 'Là quyết định combat hay kinh tế?',
            question: 'Quyết định đó liên quan đến trận đấu sắp tới (positioning, matchup) hay liên quan đến kinh tế/roll?',
            detail: 'Hai loại quyết định cần nhìn hai thứ khác nhau trên bàn địch — nhầm lẫn giữa chúng khiến bạn scout đúng bàn nhưng đọc sai thông tin.',
            branches: [
              {
                edgeLabel: 'Liên quan kinh tế',
                tone: 'neutral',
                node: {
                  kind: 'action',
                  id: 'scout-toan-lobby',
                  label: 'Scout nhanh toàn lobby, đổi kế hoạch roll',
                  action: 'Quét nhanh ai đang mạnh, ai contest cùng tộc hệ, để quyết định roll ngay hay chờ.',
                  detail: 'Thông tin cần là "mình đang đứng đâu trong lobby" — nếu nhiều người mạnh hơn đang contest cùng line, cân nhắc roll sớm hơn hoặc chuẩn bị pivot.',
                  related: KIEN_THUC_HREF,
                },
              },
              {
                edgeLabel: 'Liên quan combat',
                tone: 'good',
                node: {
                  kind: 'action',
                  id: 'scout-doi-thu-round-toi',
                  label: 'Scout đối thủ round tới, đổi positioning',
                  action: 'Xem trước đối thủ sắp đấu (nếu game hiển thị), xác định carry và mối nguy chính, đổi vị trí ngay.',
                  detail: 'Mục tiêu là né đúng carry hoặc hiệu ứng nguy hiểm nhất (backline access, AoE, CC diện rộng) của đối thủ sắp gặp — không cần xem toàn bộ 7 bàn còn lại.',
                  related: KIEN_THUC_HREF,
                },
              },
            ],
          },
        },
      ],
    },
  },
  {
    id: 'all-in',
    title: 'Khi nào all-in',
    kicker: 'Đọc trận đấu',
    summary: 'All-in là dồn toàn bộ vàng và HP vào một cửa sổ quyết định. Chỉ đáng làm khi cơ hội rõ ràng và cái giá của việc không all-in còn tệ hơn.',
    root: {
      kind: 'question',
      id: 'allin-root',
      label: 'Có cửa sổ cơ hội rõ ràng?',
      question: 'Có đang xuất hiện một cửa sổ cơ hội rõ ràng — augment mạnh vừa xuất hiện, shop đang có đúng combo carry, hoặc lobby đang yếu đi tạm thời?',
      detail: 'All-in không phải là "cháy hết vàng khi tuyệt vọng" — nó là quyết định chủ động khi cơ hội cụ thể xuất hiện và đủ giá trị để đánh đổi.',
      branches: [
        {
          edgeLabel: 'Không có cơ hội rõ',
          tone: 'bad',
          node: {
            kind: 'question',
            id: 'allin-khong-co-co-hoi',
            label: 'HP đang ở mức nguy hiểm?',
            question: 'Dù không có cơ hội rõ ràng, HP hiện tại có đang ở mức nguy hiểm buộc phải hành động?',
            detail: 'All-in vì tuyệt vọng (không có cơ hội, chỉ vì sắp chết) là kịch bản khác hẳn all-in vì cơ hội — vẫn có thể cần thiết, nhưng nên nhận diện đúng bản chất.',
            branches: [
              {
                edgeLabel: 'HP nguy hiểm',
                tone: 'bad',
                node: {
                  kind: 'action',
                  id: 'allin-tuyet-vong',
                  label: 'All-in phòng thủ để kéo dài thời gian sống',
                  action: 'Roll tìm frontline/CC rẻ nhất có thể để chịu đòn thêm vài round, không kỳ vọng thắng lớn.',
                  detail: 'Đây không phải all-in để thắng, mà để không chết ngay. Ưu tiên tank và giảm sát thương nhận vào hơn là tìm carry mới.',
                  related: CHECKLIST_HREF,
                },
              },
              {
                edgeLabel: 'HP vẫn an toàn',
                tone: 'good',
                node: {
                  kind: 'action',
                  id: 'allin-cho',
                  label: 'Chưa all-in, tiếp tục chờ cơ hội',
                  action: 'Giữ vàng, chơi ổn định, chờ cơ hội rõ ràng hơn xuất hiện.',
                  detail: 'Không có cơ hội và không bị ép bởi HP thì không có lý do để all-in. Kiên nhẫn giữ vàng vẫn là lựa chọn có giá trị kỳ vọng cao hơn.',
                  related: KIEN_THUC_HREF,
                },
              },
            ],
          },
        },
        {
          edgeLabel: 'Có cơ hội rõ',
          tone: 'good',
          node: {
            kind: 'question',
            id: 'allin-co-co-hoi',
            label: 'HP đủ chịu nếu all-in thất bại?',
            question: 'Nếu all-in không ra bài như kỳ vọng, HP còn lại có đủ để bạn vẫn sống sót qua round tiếp theo?',
            detail: 'Cơ hội tốt vẫn có thể thất bại vì xác suất. All-in chỉ an toàn khi kịch bản xấu nhất (không ra bài) vẫn chưa loại bạn khỏi trận.',
            branches: [
              {
                edgeLabel: 'Rủi ro quá cao',
                tone: 'neutral',
                node: {
                  kind: 'action',
                  id: 'allin-giam-quy-mo',
                  label: 'Giảm quy mô, all-in một phần',
                  action: 'Chỉ roll một phần vàng, giữ lại đủ để không rơi vào nguy hiểm nếu thất bại.',
                  detail: 'Vẫn tận dụng được một phần cơ hội mà không đặt cược toàn bộ trận đấu vào một lần roll. Đây là phiên bản thận trọng của all-in.',
                  related: KIEN_THUC_HREF,
                },
              },
              {
                edgeLabel: 'Đủ chịu rủi ro',
                tone: 'good',
                node: {
                  kind: 'action',
                  id: 'allin-thuc-hien',
                  label: 'All-in ngay',
                  action: 'Roll toàn bộ vàng, lên cấp nếu cần, dồn hết vào cửa sổ cơ hội này.',
                  detail: 'Điều kiện đã đủ: cơ hội rõ ràng và bạn chịu được kịch bản xấu nhất. Chần chừ thêm chỉ làm mất giá trị của cửa sổ cơ hội (shop đổi, augment hết tác dụng, lobby mạnh lại).',
                  watchFor: 'Đặt điểm dừng: hết vàng hoặc đã ra đủ bài thì dừng ngay, không roll thêm ngoài kế hoạch.',
                  related: CHECKLIST_HREF,
                },
              },
            ],
          },
        },
      ],
    },
  },
];

export function getDecisionTree(id: string): DecisionTree {
  return decisionTrees.find((tree) => tree.id === id) ?? decisionTrees[0];
}
