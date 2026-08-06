// AUTO-GENERATED bởi scripts/convert-evergreen-lessons.mjs — KHÔNG sửa tay.
// Sửa nội dung ở docs/evergreen rồi chạy lại `pnpm content:sync`.
import type { Lesson } from './lessons';

export const lessons: Lesson[] = [
  {
    "slug": "tu-duy-tft-xuyen-mua",
    "title": "Tư duy TFT xuyên mùa",
    "module": "Ra quyết định",
    "shortTitle": "Tư duy TFT xuyên mùa",
    "summary": "Hiểu TFT là bài toán ra quyết định dưới bất định.",
    "skill": "Ra quyết định",
    "duration": "~25 phút",
    "exercise": "Trong 10 trận, trước mỗi quyết định lớn ghi một câu Nếu… thì… vì….",
    "commonMistake": "Dùng kết quả để viết lại thông tin mình có ở thời điểm quyết định.",
    "applyQuestions": [
      "Tôi đã gọi tên nút thắt cụ thể.",
      "Tôi có ít nhất hai phương án thực tế.",
      "Tôi biết lợi ích và giá phải trả."
    ],
    "related": [
      {
        "label": "Tài nguyên và giá trị lựa chọn",
        "href": "/kien-thuc-nen-tang"
      },
      {
        "label": "Đọc trạng thái và mục tiêu thứ hạng",
        "href": "/kien-thuc-nen-tang"
      },
      {
        "label": "VOD review và phân loại lỗi",
        "href": "/kien-thuc-nen-tang"
      }
    ],
    "blocks": [
      {
        "type": "principles",
        "title": "Mục tiêu",
        "items": [
          "Hiểu TFT là bài toán ra quyết định dưới bất định.",
          "Tách chất lượng quyết định khỏi kết quả một trận.",
          "Dùng một vòng lặp ngắn để biến thông tin thành hành động."
        ]
      },
      {
        "type": "concept",
        "title": "Mô hình trung tâm",
        "html": "<pre><code class=\"language-text\">Quan sát → Diễn giải → Chọn mục tiêu → Hành động → Kiểm tra lại\n</code></pre>\n<p>Người chơi yếu thường nhảy từ quan sát sang hành động: thấy một carry, lập tức ép bài; thua hai round, lập tức roll; thấy item có chỉ số cao, lập tức ghép. Người chơi mạnh dành một nhịp để hỏi tín hiệu đó <strong>có ý nghĩa gì trong trạng thái hiện tại</strong>.</p>"
      },
      {
        "type": "concept",
        "title": "Bốn câu hỏi trước quyết định lớn",
        "html": "<ol>\n<li><strong>Trạng thái:</strong> máu, vàng, level, board và lobby hiện tại ra sao?</li>\n<li><strong>Mục tiêu:</strong> cần thắng ngay, giảm thua, giữ lựa chọn hay nâng trần?</li>\n<li><strong>Phương án:</strong> có ít nhất hai lựa chọn thực tế nào?</li>\n<li><strong>Giá phải trả:</strong> mỗi lựa chọn mất kinh tế, máu, thời gian và độ linh hoạt bao nhiêu?</li>\n</ol>"
      },
      {
        "type": "concept",
        "title": "Công thức giá trị quyết định",
        "html": "<p>Không cần tính số chính xác, nhưng nên nhìn đủ thành phần:</p>\n<pre><code class=\"language-text\">Giá trị kỳ vọng\n= sức mạnh ngay\n+ máu giữ được\n+ giá trị chuỗi\n+ trần tương lai\n+ thông tin/lựa chọn mở ra\n- vàng và XP mất\n- độ linh hoạt mất\n- rủi ro không hit\n</code></pre>"
      },
      {
        "type": "concept",
        "title": "Kiểm tra lập luận trước khi tin",
        "html": "<ul>\n<li>Tách một lập luận macro thành từng tiền đề riêng, rồi thử phủ định từng tiền đề một. Lập luận chỉ đáng tin nếu không tiền đề nào sụp khi bị thách thức trực tiếp.</li>\n<li>Phủ định một tiền đề (hoặc bác bỏ một kết luận) không tự động chứng minh điều ngược lại đúng. Bác bỏ &quot;lose-streak luôn tốt&quot; không có nghĩa &quot;win-streak luôn tốt&quot; — kiểm tra riêng từng nhánh, đừng suy diễn nhị phân từ việc bác bỏ một phía.</li>\n</ul>"
      },
      {
        "type": "concept",
        "title": "Bốn năng lực ra quyết định",
        "html": "<p>Một quyết định tệ thường chỉ do một trong bốn năng lực dưới đây yếu, không phải toàn bộ quy trình sai:</p>\n<ul>\n<li><strong>Đọc tình huống:</strong> thu thập đúng tín hiệu (máu, vàng, board, lobby).</li>\n<li><strong>Suy luận:</strong> nối tín hiệu thành kết luận có căn cứ, không nhảy cóc.</li>\n<li><strong>Thao tác:</strong> thực thi đúng lúc, đủ nhanh để giá trị không mất vì chậm tay.</li>\n<li><strong>Kiến thức game:</strong> biết đúng cơ chế/con số nền để suy luận không xuất phát từ tiền đề sai.</li>\n</ul>\n<p>Xác định đúng năng lực đang yếu trước khi luyện, thay vì luyện lan man cả quy trình.</p>"
      },
      {
        "type": "concept",
        "title": "Quy trình áp dụng",
        "html": "<h4>Bước 1 — Gọi tên vấn đề</h4>\n<p>Không nói “board yếu”. Hãy cụ thể:</p>\n<ul>\n<li>frontline chết trước cast thứ hai;</li>\n<li>carry không xuyên được tank;</li>\n<li>thiếu một slot để kích utility;</li>\n<li>lobby sắp rolldown, board hiện tại thua lớn;</li>\n<li>bench quá đầy nên không thể giữ outs.</li>\n</ul>\n<h4>Bước 2 — Xác định quyết định có thể thay đổi</h4>\n<p>Chỉ tập trung vào thứ có thể tác động:</p>\n<ul>\n<li>mua/bán;</li>\n<li>lên cấp/roll;</li>\n<li>ghép/chuyển item;</li>\n<li>đổi unit/trait;</li>\n<li>scout/position;</li>\n<li>đổi mục tiêu thứ hạng.</li>\n</ul>\n<h4>Bước 3 — Đặt giả thuyết</h4>\n<p>Ví dụ:</p>\n<blockquote>\n<p>Nếu roll 20 vàng ở level hiện tại, tôi có ba nhóm outs giúp nâng carry, tank hoặc utility; chỉ cần hit một nhóm là giảm thua rõ.</p>\n</blockquote>\n<h4>Bước 4 — Hành động có ngưỡng dừng</h4>\n<p>Không hành động vô hạn. Roll đến breakpoint; reposition để xử lý một mối đe dọa; ghép item để giải quyết một nút thắt.</p>\n<h4>Bước 5 — Đánh giá lại</h4>\n<p>Sau một round hoặc sau rolldown:</p>\n<ul>\n<li>vấn đề ban đầu đã được giải quyết chưa?</li>\n<li>nút thắt mới là gì?</li>\n<li>mục tiêu thứ hạng có đổi không?</li>\n</ul>"
      },
      {
        "type": "concept",
        "title": "Quyết định tốt và kết quả xấu",
        "html": "<ul>\n<li>Roll đúng level, có nhiều outs, nhưng không hit.</li>\n<li>Position hợp lý, đối thủ đổi bên phút cuối.</li>\n<li>Chọn line ít tranh, shop vẫn không cho nâng cấp.</li>\n</ul>"
      },
      {
        "type": "concept",
        "title": "Quyết định xấu và kết quả tốt",
        "html": "<ul>\n<li>Ép line bị nhiều người tranh nhưng high-roll.</li>\n<li>Giữ item quá lâu rồi tình cờ nhận đúng linh kiện.</li>\n<li>Không scout nhưng đối thủ tự xếp sai.</li>\n</ul>\n<p>Một trận không đủ để kết luận. Hãy kiểm tra quy trình trên nhiều tình huống tương tự.</p>"
      },
      {
        "type": "pitfalls",
        "title": "Lỗi thường gặp",
        "items": [
          "Dùng kết quả để viết lại thông tin mình có ở thời điểm quyết định.",
          "Chơi nhanh để trông “pro” thay vì dành thời gian cho quyết định quan trọng.",
          "Dùng checklist dài đến mức không còn thời gian thao tác.",
          "Xem một nguyên tắc như luật tuyệt đối, không kiểm tra điều kiện.",
          "Đổ mọi thất bại cho RNG nên không tìm hành động có thể sửa."
        ]
      },
      {
        "type": "concept",
        "title": "Bài tập",
        "html": "<h4>Nhật ký giả thuyết</h4>\n<p>Trong 10 trận, trước mỗi quyết định lớn ghi một câu <code>Nếu… thì… vì…</code>. Sau round đánh dấu:</p>\n<ul>\n<li>giả thuyết đúng;</li>\n<li>giả thuyết sai;</li>\n<li>chưa đủ dữ kiện.</li>\n</ul>\n<h4>Dừng hình VOD</h4>\n<p>Tại 2-1, 3-2, trước rolldown và trước round bị loại:</p>\n<ol>\n<li>liệt kê thông tin nhìn thấy;</li>\n<li>chọn hai phương án;</li>\n<li>nêu trade-off;</li>\n<li>sau đó mới xem quyết định thật.</li>\n</ol>"
      },
      {
        "type": "checklist",
        "title": "Checklist",
        "items": [
          "Tôi đã gọi tên nút thắt cụ thể.",
          "Tôi có ít nhất hai phương án thực tế.",
          "Tôi biết lợi ích và giá phải trả.",
          "Hành động có breakpoint/ngưỡng dừng.",
          "Tôi sẽ đánh giá lại ở mốc nào."
        ]
      }
    ]
  },
  {
    "slug": "tai-nguyen-va-gia-tri-lua-chon",
    "title": "Tài nguyên và giá trị của lựa chọn",
    "module": "Ra quyết định",
    "shortTitle": "Tài nguyên và giá trị của lựa chọn",
    "summary": "Nhìn thấy cả tài nguyên hữu hình và vô hình.",
    "skill": "Ra quyết định",
    "duration": "~20 phút",
    "exercise": "Mỗi trận chọn ba quyết định và ghi:",
    "commonMistake": "Gọi lợi tức là “vàng miễn phí” mà không tính unit và máu đã bán đổi.",
    "applyQuestions": [
      "Tôi đang tối ưu vàng hay tối ưu placement?",
      "Giữ lựa chọn này tốn bao nhiêu máu/vàng/bench?",
      "Quyết định có đảo ngược được không?"
    ],
    "related": [
      {
        "label": "Kinh tế, máu, chuỗi và tempo",
        "href": "/kien-thuc-nen-tang"
      },
      {
        "label": "Flex, transition và pivot",
        "href": "/kien-thuc-nen-tang"
      },
      {
        "label": "Trang bị và phân bổ chỉ số",
        "href": "/kien-thuc-nen-tang"
      }
    ],
    "blocks": [
      {
        "type": "principles",
        "title": "Mục tiêu",
        "items": [
          "Nhìn thấy cả tài nguyên hữu hình và vô hình.",
          "Hiểu chi phí cơ hội của việc giữ hoặc tiêu tài nguyên.",
          "Bảo vệ khả năng pivot mà không trở thành người “không dám commit”."
        ]
      },
      {
        "type": "concept",
        "title": "Sáu tài nguyên cốt lõi",
        "html": "<h4>1. Vàng</h4>\n<p>Dùng để mua quân, lên cấp, roll và tạo lợi tức. Vàng chỉ có giá trị khi sau này được chuyển thành sức mạnh hoặc thêm lựa chọn.</p>\n<h4>2. Máu</h4>\n<p>Là ngân sách thời gian và bảo hiểm rủi ro. Máu cao cho phép chờ shop tốt hơn; máu thấp làm giá trị của sức mạnh ngay tăng mạnh.</p>\n<h4>3. Trang bị</h4>\n<p>Tài nguyên khó hoàn tác. Giá trị gồm sức mạnh hiện tại, độ linh hoạt, độ phù hợp holder và khả năng xử lý lobby.</p>\n<h4>4. Shop tự nhiên</h4>\n<p>Mỗi round cho thêm cơ hội thấy unit mà không trả tiền roll. Bán cặp hoặc bỏ line tự nhiên để lấy một mốc lãi có thể làm mất giá trị này.</p>\n<h4>5. Bench và thời gian thao tác</h4>\n<p>Bench trống cho phép giữ outs. Thời gian chuẩn bị giúp scout, tính rolldown và position. Cả hai đều có giới hạn.</p>\n<h4>6. Không gian lựa chọn</h4>\n<p>Bao gồm item chưa khóa, holder có thể bán, augment ít điều kiện, carry/tank thay thế và đủ vàng để chuyển hướng.</p>"
      },
      {
        "type": "concept",
        "title": "Chi phí cơ hội",
        "html": "<p>Mọi lựa chọn đều loại bỏ một lựa chọn khác:</p>\n<ul>\n<li>giữ cặp có thể mất một mốc lãi;</li>\n<li>bán cặp có thể mất nâng cấp tự nhiên;</li>\n<li>giữ linh kiện có thể mất máu;</li>\n<li>ghép item có thể mất độ linh hoạt;</li>\n<li>lên cấp có thể làm hết tiền roll;</li>\n<li>giữ 50 vàng có thể làm mất hai round sống sót.</li>\n</ul>\n<p>Câu hỏi đúng không phải “có mất tài nguyên không?” mà là:</p>\n<blockquote>\n<p>Tài nguyên bị mất có rẻ hơn lợi ích nhận được và các phương án còn lại không?</p>\n</blockquote>"
      },
      {
        "type": "concept",
        "title": "Giá trị của tính đảo ngược",
        "html": "<p>Một quyết định dễ hoàn tác có thể kém tối ưu trước mắt nhưng giữ nhiều nhánh tương lai. Ví dụ:</p>\n<ul>\n<li>item linh hoạt thay vì món chỉ một carry dùng tốt;</li>\n<li>holder mạnh có thể bán thay vì đặt đồ lên unit phải giữ cuối trận;</li>\n<li>khung vai trò mở thay vì kích vertical bằng trait bot yếu.</li>\n</ul>\n<p>Tuy nhiên, giữ lựa chọn cũng có giá. Nếu trì hoãn làm mất quá nhiều máu, “linh hoạt” trở thành không hành động.</p>"
      },
      {
        "type": "concept",
        "title": "Quy trình phân bổ tài nguyên",
        "html": "<ol>\n<li>Xác định nút thắt trong 1–3 round tới.</li>\n<li>Ước lượng máu có thể mất nếu không xử lý.</li>\n<li>Liệt kê tài nguyên có thể chuyển đổi.</li>\n<li>Chọn hành động rẻ nhất đạt breakpoint.</li>\n<li>Giữ lại lựa chọn chỉ khi giá trị chờ lớn hơn delay cost.</li>\n<li>Đánh giá lại sau round.</li>\n</ol>"
      },
      {
        "type": "concept",
        "title": "Ví dụ",
        "html": "<p>Bạn có 31 vàng, một cặp tank đang dùng, một cặp carry dự phòng và có thể bán cả hai để chạm mốc 40.</p>\n<ul>\n<li>Nếu board đang thắng phần lớn lobby: bán có thể hợp lý nếu cặp không phải nâng cấp lớn.</li>\n<li>Nếu board đang thua lớn: giữ cặp có thể tạo nhiều giá trị hơn 1 vàng lợi tức.</li>\n<li>Nếu bench nghẹt: giữ mọi cặp làm giảm khả năng mua outs khác.</li>\n</ul>\n<p>Không có câu trả lời chỉ dựa trên con số 40 vàng.</p>"
      },
      {
        "type": "pitfalls",
        "title": "Lỗi thường gặp",
        "items": [
          "Gọi lợi tức là “vàng miễn phí” mà không tính unit và máu đã bán đổi.",
          "Giữ item/bench quá lâu với lý do flex.",
          "Commit sớm chỉ vì có một unit hoặc một món đồ.",
          "Không tính thời gian thao tác như tài nguyên trước rolldown.",
          "Dùng toàn bộ vàng để roll dù board đã đạt breakpoint."
        ]
      },
      {
        "type": "concept",
        "title": "Bài tập",
        "html": "<h4>Sổ cái chi phí cơ hội</h4>\n<p>Mỗi trận chọn ba quyết định và ghi:</p>\n<table>\n<thead>\n<tr>\n<th>Quyết định</th>\n<th>Lợi ích nhận</th>\n<th>Tài nguyên mất</th>\n<th>Phương án bị bỏ</th>\n</tr>\n</thead>\n<tbody><tr>\n<td></td>\n<td></td>\n<td></td>\n<td></td>\n</tr>\n</tbody></table>\n<h4>Bài tập bench</h4>\n<p>Trong 10 trận, trước mỗi vòng người chơi hỏi: mỗi unit trên bench thuộc nhóm <code>nâng cấp gần</code>, <code>out thay thế</code>, <code>định hướng xa</code> hay <code>không còn giá trị</code>. Bán nhóm cuối trước rolldown.</p>"
      },
      {
        "type": "checklist",
        "title": "Checklist",
        "items": [
          "Tôi đang tối ưu vàng hay tối ưu placement?",
          "Giữ lựa chọn này tốn bao nhiêu máu/vàng/bench?",
          "Quyết định có đảo ngược được không?",
          "Tôi đang chờ vì có tín hiệu hay vì sợ commit?",
          "Breakpoint rẻ nhất là gì?"
        ]
      }
    ]
  },
  {
    "slug": "doc-trang-thai-va-muc-tieu-thu-hang",
    "title": "Đọc trạng thái và chọn mục tiêu thứ hạng",
    "module": "Ra quyết định",
    "shortTitle": "Đọc trạng thái và chọn mục tiêu thứ hạng",
    "summary": "Mô tả trạng thái trận bằng dữ kiện thay vì cảm giác.",
    "skill": "Ra quyết định",
    "duration": "~20 phút",
    "exercise": "Ở đầu Stage 4, ghi phạm vi kỳ vọng 1–2, 3–4, 5–6 hoặc 7–8, cùng ba lý do.",
    "commonMistake": "Chơi cho top 1 trong mọi trận.",
    "applyQuestions": [
      "Tôi mạnh/yếu so với ai?",
      "Tôi còn chịu được bao nhiêu round thua?",
      "Board cần ổn định hay nâng cap?"
    ],
    "related": [
      {
        "label": "Strongest board và opener",
        "href": "/kien-thuc-nen-tang"
      },
      {
        "label": "Kế hoạch theo stage",
        "href": "/kien-thuc-nen-tang"
      },
      {
        "label": "Scouting và lobby ecology",
        "href": "/kien-thuc-nen-tang"
      }
    ],
    "blocks": [
      {
        "type": "principles",
        "title": "Mục tiêu",
        "items": [
          "Mô tả trạng thái trận bằng dữ kiện thay vì cảm giác.",
          "Chọn đúng mức rủi ro cho top 1, top 4 hoặc cứu placement.",
          "Chuyển mục tiêu kịp thời khi điều kiện thay đổi."
        ]
      },
      {
        "type": "concept",
        "title": "Bảng trạng thái 2 × 2",
        "html": "<table>\n<thead>\n<tr>\n<th></th>\n<th>Giàu</th>\n<th>Nghèo</th>\n</tr>\n</thead>\n<tbody><tr>\n<td><strong>Mạnh</strong></td>\n<td>Có thể giữ chuỗi, nâng cap hoặc tham level</td>\n<td>Bảo vệ chuỗi, tránh chi vô ích</td>\n</tr>\n<tr>\n<td><strong>Yếu</strong></td>\n<td>Có tiền để ổn định; cần chọn đúng breakpoint</td>\n<td>Khẩn cấp: dùng tài nguyên tạo sức mạnh ngay</td>\n</tr>\n</tbody></table>\n<p>Thêm hai biến điều chỉnh:</p>\n<ul>\n<li><strong>Máu:</strong> còn bao nhiêu round thua?</li>\n<li><strong>Lobby:</strong> thua nhẹ hay thua lớn trước các đối thủ có thể gặp?</li>\n</ul>"
      },
      {
        "type": "concept",
        "title": "Survival horizon",
        "html": "<p>Ước lượng số round còn sống:</p>\n<pre><code class=\"language-text\">Survival horizon ≈ Máu hiện tại / sát thương thua dự kiến mỗi round\n</code></pre>\n<p>Đây không phải công thức chính xác. Nó buộc người chơi so sánh kế hoạch tương lai với thời gian thực tế.</p>\n<ul>\n<li>Còn 5+ round: có thể chờ breakpoint tốt hơn nếu board không mất máu lớn.</li>\n<li>Còn 2–4 round: ưu tiên ổn định, giảm tham.</li>\n<li>Có thể chết trong một round: mọi tài nguyên xa tương lai gần như mất giá trị.</li>\n</ul>"
      },
      {
        "type": "concept",
        "title": "Ba mục tiêu thứ hạng",
        "html": "<h4>Chơi cho top 1</h4>\n<p>Điều kiện thường có:</p>\n<ul>\n<li>máu và kinh tế cao;</li>\n<li>board đã ổn định;</li>\n<li>có đường nâng cap rõ;</li>\n<li>không cần roll quá sâu để sống.</li>\n</ul>\n<p>Hành động: level cao hơn, tìm nâng cấp đắt tiền, giữ item/slot cho trần board, position theo từng đối thủ.</p>\n<h4>Chơi cho top 4</h4>\n<p>Khi board đủ cạnh tranh nhưng không có lợi thế rõ để thắng lobby.</p>\n<p>Hành động: loại bỏ unit một sao cốt lõi, tránh kế hoạch quá tham, ưu tiên consistency và matchup có thể thắng.</p>\n<h4>Cứu placement</h4>\n<p>Khi máu thấp, kinh tế xấu hoặc line không còn đường hoàn thiện hợp lý.</p>\n<p>Hành động: all-in, dùng item không hoàn hảo, chọn board thay thế, đổi mục tiêu từ “đẹp” sang “sống thêm round”.</p>"
      },
      {
        "type": "concept",
        "title": "Quy trình đọc trạng thái mỗi stage",
        "html": "<ol>\n<li>Ghi máu, vàng, level.</li>\n<li>Chấm carry, frontline, nâng sao, item, trait và positioning từ 0–2.</li>\n<li>Scout 2–3 board mạnh/yếu gần mình.</li>\n<li>Ước lượng sát thương thua.</li>\n<li>Xác định survival horizon.</li>\n<li>Chọn mục tiêu placement.</li>\n<li>Chọn hành động tương ứng.</li>\n</ol>"
      },
      {
        "type": "concept",
        "title": "Ví dụ",
        "html": "<p>Bạn còn 32 máu ở Stage 4, carry một sao, tank một sao, 42 vàng, hai người contest.</p>\n<ul>\n<li>Kế hoạch lên 9 có trần cao nhưng vượt quá survival horizon.</li>\n<li>Roll để tìm nhiều outs ở 8 có thể hạ cap nhưng tăng xác suất sống.</li>\n<li>Nếu đối thủ contest sắp bị loại, có thể roll vừa đủ giảm thua rồi đánh giá lại; không mặc định chờ họ chết.</li>\n</ul>"
      },
      {
        "type": "pitfalls",
        "title": "Lỗi thường gặp",
        "items": [
          "Chơi cho top 1 trong mọi trận.",
          "Chỉ nhìn máu mà không nhìn sát thương thua dự kiến.",
          "Chỉ nhìn board tuyệt đối, không so với lobby.",
          "Tiếp tục kế hoạch cũ vì đã đầu tư nhiều tài nguyên.",
          "Đợi đến một mạng mới chuyển sang chế độ cứu placement."
        ]
      },
      {
        "type": "concept",
        "title": "Bài tập",
        "html": "<h4>Dự đoán placement</h4>\n<p>Ở đầu Stage 4, ghi phạm vi kỳ vọng <code>1–2</code>, <code>3–4</code>, <code>5–6</code> hoặc <code>7–8</code>, cùng ba lý do. Sau trận kiểm tra sai ở dữ kiện hay diễn giải.</p>\n<h4>Nhật ký chuyển mục tiêu</h4>\n<p>Ghi round mục tiêu đổi và tín hiệu kích hoạt: mất chuỗi, không hit, contest tăng, board đối thủ cap nhanh hơn hoặc máu xuống ngưỡng.</p>"
      },
      {
        "type": "checklist",
        "title": "Checklist",
        "items": [
          "Tôi mạnh/yếu so với ai?",
          "Tôi còn chịu được bao nhiêu round thua?",
          "Board cần ổn định hay nâng cap?",
          "Mục tiêu placement hiện tại là gì?",
          "Tín hiệu nào sẽ buộc tôi đổi mục tiêu?"
        ]
      }
    ]
  },
  {
    "slug": "strongest-board-va-opener",
    "title": "Strongest board và opener",
    "module": "Vận hành kinh tế",
    "shortTitle": "Strongest board và opener",
    "summary": "Tạo board mạnh nhất từ tài nguyên hiện có.",
    "skill": "Kinh tế / Tempo",
    "duration": "~20 phút",
    "exercise": "10 trận chụp board ở 2-1 và 3-2; sau trận tìm một unit đáng lẽ nên vào sân.",
    "commonMistake": "Chơi unit một sao trong “bài cuối” thay cho unit hai sao mạnh.",
    "applyQuestions": [
      "Có damage ổn định.",
      "Có frontline đủ thời gian.",
      "Item đang hoạt động."
    ],
    "related": [
      {
        "label": "Kinh tế, máu, chuỗi và tempo",
        "href": "/kien-thuc-nen-tang"
      },
      {
        "label": "Vai trò, tộc hệ và board cap",
        "href": "/kien-thuc-nen-tang"
      },
      {
        "label": "Positioning, targeting và pathing",
        "href": "/kien-thuc-nen-tang"
      }
    ],
    "blocks": [
      {
        "type": "principles",
        "title": "Mục tiêu",
        "items": [
          "Tạo board mạnh nhất từ tài nguyên hiện có.",
          "Dùng opener như khung chuyển tiếp, không như lời cam kết đội hình cuối.",
          "Nhận diện nút thắt carry, frontline và utility."
        ]
      },
      {
        "type": "concept",
        "title": "Strongest board là gì?",
        "html": "<p>Strongest board là đội hình tạo xác suất thắng hoặc giảm thua tốt nhất <strong>ở round hiện tại</strong>, sau khi tính:</p>\n<ul>\n<li>chất lượng unit và nâng sao;</li>\n<li>item holder;</li>\n<li>trait có giá trị thật;</li>\n<li>vai trò carry/frontline/utility;</li>\n<li>positioning;</li>\n<li>chi phí kinh tế để đưa board vào sân.</li>\n</ul>\n<p>Nó không nhất thiết giống đội hình cuối và không phải board có nhiều trait nhất.</p>"
      },
      {
        "type": "concept",
        "title": "Sáu trụ sức mạnh",
        "html": "<p>Chấm nhanh 0–2:</p>\n<ol>\n<li><strong>Carry:</strong> có damage ổn định và đánh đúng mục tiêu không?</li>\n<li><strong>Frontline:</strong> sống đủ để carry hoạt động không?</li>\n<li><strong>Nâng sao:</strong> unit quan trọng đã nâng cấp chưa?</li>\n<li><strong>Trang bị:</strong> item đang tạo giá trị hay nằm trên bench/sai holder?</li>\n<li><strong>Trait/utility:</strong> mốc đang kích có bù nút thắt không?</li>\n<li><strong>Positioning:</strong> target, pathing và góc đánh có hợp matchup không?</li>\n</ol>\n<p>Điểm dùng để so sánh và đặt câu hỏi, không phải mô hình toán tuyệt đối.</p>"
      },
      {
        "type": "concept",
        "title": "Xây opener theo vai trò",
        "html": "<p>Một opener hoạt động thường cần:</p>\n<ul>\n<li>một nguồn damage;</li>\n<li>một frontline đủ thời gian;</li>\n<li>holder có thể bán/chuyển item;</li>\n<li>một hoặc hai mốc trait hiệu quả;</li>\n<li>bench còn không gian cho cặp và hướng thay thế.</li>\n</ul>"
      },
      {
        "type": "concept",
        "title": "Quy trình mỗi round",
        "html": "<ol>\n<li>Đưa unit nâng sao mạnh nhất vào danh sách ứng viên.</li>\n<li>Xác định carry và tank holder tốt nhất.</li>\n<li>Kiểm tra trait bot có yếu hơn unit chất lượng cao không.</li>\n<li>Kiểm tra thêm một level/slot có tạo bước nhảy thật không.</li>\n<li>Position theo nhóm đối thủ có thể gặp.</li>\n<li>So chi phí board với giá trị máu/chuỗi nhận được.</li>\n</ol>"
      },
      {
        "type": "concept",
        "title": "Khi nào không cần dùng board mạnh tuyệt đối?",
        "html": "<ul>\n<li>Chủ động thua chuỗi và có thể thua nhỏ.</li>\n<li>Đưa unit mạnh vào sẽ phá kinh tế lớn nhưng không đổi matchup.</li>\n<li>Muốn giữ một cặp trên bench vì giá trị nâng cấp lớn hơn.</li>\n<li>Board “mạnh hơn” làm mất holder hoặc đường transition quan trọng mà không cứu đủ máu.</li>\n</ul>\n<p>Đây là ngoại lệ có điều kiện, không phải lý do để để unit mạnh trên bench theo thói quen.</p>"
      },
      {
        "type": "concept",
        "title": "Ví dụ chẩn đoán",
        "html": "<h4>Frontline chết ngay</h4>\n<p>Hướng xử lý: nâng sao tank, ghép phòng thủ, thêm body/CC, đổi vị trí hoặc giảm unit trait yếu.</p>\n<h4>Frontline sống nhưng không hạ được ai</h4>\n<p>Hướng xử lý: nâng carry, thêm damage/penetration, đổi target, tăng uptime hoặc thêm nguồn kết liễu.</p>\n<h4>Board đủ stats nhưng thua</h4>\n<p>Kiểm tra targeting, pathing, crowding, range và timing utility.</p>"
      },
      {
        "type": "pitfalls",
        "title": "Lỗi thường gặp",
        "items": [
          "Chơi unit một sao trong “bài cuối” thay cho unit hai sao mạnh.",
          "Kích trait đẹp bằng unit không tạo giá trị.",
          "Để item trên bench vì chờ carry cuối.",
          "Dùng cùng opener cho mọi dạng item/shop.",
          "Đánh giá board bằng cost hoặc số trait thay vì hiệu quả combat."
        ]
      },
      {
        "type": "drill",
        "title": "Bài tập",
        "goal": "",
        "steps": [
          "10 trận chụp board ở 2-1 và 3-2; sau trận tìm một unit đáng lẽ nên vào sân.",
          "Trước mỗi round, gọi tên unit yếu nhất trên board và ba cách nâng vị trí đó.",
          "Review một round thua: nút thắt thuộc carry, frontline, utility hay positioning?"
        ]
      },
      {
        "type": "checklist",
        "title": "Checklist",
        "items": [
          "Có damage ổn định.",
          "Có frontline đủ thời gian.",
          "Item đang hoạt động.",
          "Trait bot tạo giá trị lớn hơn unit thay thế.",
          "Unit mạnh không nằm vô lý trên bench.",
          "Board phù hợp mục tiêu chuỗi."
        ]
      }
    ]
  },
  {
    "slug": "kinh-te-mau-chuoi-va-tempo",
    "title": "Kinh tế, máu, chuỗi và tempo",
    "module": "Vận hành kinh tế",
    "shortTitle": "Kinh tế, máu, chuỗi và tempo",
    "summary": "Không xem eco và tempo như hai phong cách loại trừ nhau.",
    "skill": "Kinh tế / Tempo",
    "duration": "~20 phút",
    "exercise": "Ghi mọi lần bán để chạm mốc.",
    "commonMistake": "Eco đến 50 bất kể board/máu.",
    "applyQuestions": [
      "Tôi đang tích lũy, stabilize hay all-in?",
      "Không chi sẽ mất bao nhiêu máu?",
      "Khoản chi tạo breakpoint nào?"
    ],
    "related": [
      {
        "label": "Level, roll, outs và breakpoint",
        "href": "/kien-thuc-nen-tang"
      },
      {
        "label": "Đọc trạng thái và mục tiêu thứ hạng",
        "href": "/kien-thuc-nen-tang"
      },
      {
        "label": "Trang bị và phân bổ chỉ số",
        "href": "/kien-thuc-nen-tang"
      }
    ],
    "blocks": [
      {
        "type": "principles",
        "title": "Mục tiêu",
        "items": [
          "Không xem eco và tempo như hai phong cách loại trừ nhau.",
          "Biết khi nào chuyển vàng thành sức mạnh.",
          "Quản lý chuỗi thắng/thua với stop-loss rõ ràng."
        ]
      },
      {
        "type": "concept",
        "title": "Định nghĩa thực dụng",
        "html": "<ul>\n<li><strong>Eco:</strong> ưu tiên tích lũy sức mua tương lai.</li>\n<li><strong>Tempo:</strong> ưu tiên sức mạnh hiện tại để giữ máu, chuỗi hoặc gây áp lực.</li>\n<li><strong>Stabilize:</strong> chi vừa đủ để ngừng thua lớn.</li>\n<li><strong>All-in:</strong> chuyển gần như toàn bộ tài nguyên khả dụng thành sức mạnh ngay.</li>\n</ul>\n<p>Cùng một trận có thể đi qua cả bốn trạng thái.</p>"
      },
      {
        "type": "concept",
        "title": "Vàng không phải mục tiêu",
        "html": "<p>50 vàng chỉ là một breakpoint kinh tế. Nếu để đạt nó bạn phải:</p>\n<ul>\n<li>bán cặp quan trọng;</li>\n<li>bỏ shop tự nhiên;</li>\n<li>mất chuỗi thắng;</li>\n<li>nhận thêm 20–30 máu;</li>\n<li>đến rolldown với board quá thấp;</li>\n</ul>\n<p>thì “lợi tức” đã được mua bằng các tài nguyên khác.</p>"
      },
      {
        "type": "concept",
        "title": "Máu là thời gian và bảo hiểm",
        "html": "<p>Máu cao:</p>\n<ul>\n<li>cho thêm shop tự nhiên;</li>\n<li>cho phép chờ level/odds tốt hơn;</li>\n<li>giảm áp lực phải hit trong một rolldown;</li>\n<li>giữ quyền chơi cho top cao.</li>\n</ul>\n<p>Máu thấp:</p>\n<ul>\n<li>tăng giá trị sức mạnh ngay;</li>\n<li>giảm giá trị mốc lãi xa;</li>\n<li>làm mọi lần roll hẹp hơn và áp lực hơn.</li>\n</ul>"
      },
      {
        "type": "concept",
        "title": "Chuỗi thắng",
        "html": "<p>Đáng bảo vệ khi:</p>\n<ul>\n<li>board thật sự nằm trong nhóm mạnh;</li>\n<li>lên level/ghép đồ tạo bước nhảy rõ;</li>\n<li>đối thủ có thể gặp vẫn thắng được sau đầu tư;</li>\n<li>khoản chi không phá hoàn toàn kế hoạch tiếp theo.</li>\n</ul>\n<p>Không đuổi chuỗi khi cần chi quá nhiều cho lợi ích không chắc chắn.</p>"
      },
      {
        "type": "concept",
        "title": "Chuỗi thua có kiểm soát",
        "html": "<p>Cần bốn điều kiện:</p>\n<ol>\n<li>board yếu tự nhiên;</li>\n<li>có thể thua nhỏ;</li>\n<li>lợi ích kinh tế thực sự tồn tại;</li>\n<li>có mốc và ngân sách ổn định bàn.</li>\n</ol>\n<p>Đặt stop-loss theo máu, stage hoặc mức sát thương. Không biến “chờ thêm một round” thành mặc định.</p>"
      },
      {
        "type": "concept",
        "title": "Đọc tempo lobby",
        "html": "<p>Dấu hiệu tempo cao:</p>\n<ul>\n<li>nhiều người lên level sớm;</li>\n<li>item được slam;</li>\n<li>nhiều unit hai sao;</li>\n<li>nhiều board roll để giữ chuỗi;</li>\n<li>sát thương thua lớn.</li>\n</ul>\n<p>Phản ứng không phải luôn “đua lên cấp”. Bạn có thể:</p>\n<ul>\n<li>đẩy tempo nếu board và tài nguyên cho phép;</li>\n<li>stabilize sớm;</li>\n<li>chấp nhận thua nhỏ, tích lũy và chọn mốc phản công;</li>\n<li>đổi mục tiêu placement.</li>\n</ul>"
      },
      {
        "type": "concept",
        "title": "Cây quyết định chi vàng",
        "html": "<ol>\n<li>Nếu không chi, dự kiến mất bao nhiêu máu?</li>\n<li>Chi bao nhiêu tạo xác suất đạt breakpoint đáng kể?</li>\n<li>Breakpoint giữ chuỗi, giảm thua hay nâng cap?</li>\n<li>Sau khi chi còn kế hoạch level/roll tiếp không?</li>\n<li>Lobby có buộc hành động sớm hơn lịch mặc định không?</li>\n</ol>"
      },
      {
        "type": "pitfalls",
        "title": "Lỗi thường gặp",
        "items": [
          "Eco đến 50 bất kể board/máu.",
          "Đánh tempo bằng cách mua mọi thứ và phá toàn bộ kinh tế.",
          "Chuỗi thua không stop-loss.",
          "Lên cấp nhưng không có unit đưa vào.",
          "Roll vì hoảng, không biết board cần gì.",
          "Copy lịch level mà không scout lobby."
        ]
      },
      {
        "type": "concept",
        "title": "Bài tập",
        "html": "<h4>Nhật ký mốc lãi</h4>\n<p>Ghi mọi lần bán để chạm mốc. Sau trận đánh giá unit/cặp đã bán, máu mất và vàng roll bù.</p>\n<h4>Dự đoán sát thương</h4>\n<p>Trước mỗi round Stage 3–4, dự đoán <code>thắng</code>, <code>thua nhỏ</code> hoặc <code>thua lớn</code>. Sai lệch liên tục cho thấy lỗi đọc board/tempo.</p>\n<h4>Stop-loss</h4>\n<p>Khi chọn loss streak, ghi trước mốc máu và round stabilize. Không sửa sau khi biết kết quả.</p>"
      },
      {
        "type": "checklist",
        "title": "Checklist",
        "items": [
          "Tôi đang tích lũy, stabilize hay all-in?",
          "Không chi sẽ mất bao nhiêu máu?",
          "Khoản chi tạo breakpoint nào?",
          "Chuỗi có đáng bảo vệ không?",
          "Loss streak có stop-loss không?",
          "Nhịp lobby khác lịch mặc định thế nào?"
        ]
      }
    ]
  },
  {
    "slug": "level-roll-outs-va-breakpoint",
    "title": "Level, roll, outs và breakpoint",
    "module": "Vận hành kinh tế",
    "shortTitle": "Level, roll, outs và breakpoint",
    "summary": "Mọi lần level/roll đều có lý do và ngưỡng dừng.",
    "skill": "Kinh tế / Tempo",
    "duration": "~25 phút",
    "exercise": "Trước roll ghi:",
    "commonMistake": "Roll một số vàng ngẫu nhiên.",
    "applyQuestions": [
      "Level mới tạo slot hoặc odds có ích.",
      "Tôi có ít nhất ba nhóm outs.",
      "Tôi biết contest/pool tương đối."
    ],
    "related": [
      {
        "label": "Kinh tế, máu, chuỗi và tempo",
        "href": "/kien-thuc-nen-tang"
      },
      {
        "label": "Scouting, contest và lobby ecology",
        "href": "/kien-thuc-nen-tang"
      },
      {
        "label": "Xác suất shop, pool và variance",
        "href": "/kien-thuc-nen-tang"
      }
    ],
    "blocks": [
      {
        "type": "principles",
        "title": "Mục tiêu",
        "items": [
          "Mọi lần level/roll đều có lý do và ngưỡng dừng.",
          "Tăng xác suất cải thiện board bằng cách mở rộng outs.",
          "Giảm rolldown hẹp và phụ thuộc một carry duy nhất."
        ]
      },
      {
        "type": "concept",
        "title": "Level là mua slot và phân phối shop",
        "html": "<p>Trước khi lên cấp, hỏi:</p>\n<ol>\n<li>Slot mới đưa unit nào vào?</li>\n<li>Unit đó tạo damage, frontline, utility hay trait có giá trị?</li>\n<li>Level mới cải thiện hay làm xấu odds của nhóm tướng cần tìm?</li>\n<li>Sau khi lên cấp còn đủ vàng roll/mua unit không?</li>\n<li>Việc lên cấp giữ chuỗi hoặc giảm thua bao nhiêu?</li>\n</ol>\n<p>Không level chỉ vì “đến đúng round”.</p>"
      },
      {
        "type": "concept",
        "title": "Roll là mua nhiều mẫu shop",
        "html": "<p>Mỗi lần roll đổi vàng thành cơ hội thấy:</p>\n<ul>\n<li>hit trực tiếp: unit mục tiêu;</li>\n<li>hit thay thế: carry/tank khác dùng được;</li>\n<li>hit utility: CC, shred, support, trait;</li>\n<li>nâng cấp cặp;</li>\n<li>unit chất lượng cao thay vị trí yếu nhất.</li>\n</ul>\n<p><strong>Xác suất thực dụng</strong> là khả năng một shop tạo bất kỳ cải thiện đủ tốt nào, không chỉ đúng một tên unit.</p>"
      },
      {
        "type": "concept",
        "title": "Thiết kế outs trước rolldown",
        "html": "<p>Chia thành ba nhóm:</p>\n<ul>\n<li><strong>A — bắt buộc:</strong> thiếu nó board khó sống.</li>\n<li><strong>B — thay thế:</strong> khác tên nhưng cùng chức năng.</li>\n<li><strong>C — nâng cap/utility:</strong> không bắt buộc nhưng tăng matchup.</li>\n</ul>\n<p>Chuẩn bị holder và sơ đồ board cho ít nhất hai nhánh.</p>"
      },
      {
        "type": "concept",
        "title": "Breakpoint",
        "html": "<p>Một breakpoint là trạng thái board đủ thay đổi quyết định tiếp theo:</p>\n<ul>\n<li>carry hoặc tank hai sao;</li>\n<li>thay hai unit một sao yếu;</li>\n<li>thêm shred/CC/frontline;</li>\n<li>kích trait có giá trị biên lớn;</li>\n<li>giảm mức thua từ lớn xuống nhỏ;</li>\n<li>thắng phần lớn nhóm đối thủ dự kiến.</li>\n</ul>\n<p>Khi đạt breakpoint, dừng và đánh giá lại. Không roll tiếp chỉ vì còn vàng.</p>"
      },
      {
        "type": "concept",
        "title": "Ngưỡng dừng",
        "html": "<p>Có thể đặt theo:</p>\n<ul>\n<li>vàng còn lại;</li>\n<li>số round sống sót;</li>\n<li>board state;</li>\n<li>số outs còn trong pool;</li>\n<li>mục tiêu placement.</li>\n</ul>\n<p>Ngưỡng dừng phải linh hoạt: nếu board chưa đủ sống, giữ 20 vàng có thể vô nghĩa; nếu đã ổn định, roll về 0 có thể phá cap.</p>"
      },
      {
        "type": "concept",
        "title": "Pool và contest",
        "html": "<p>Shop odds chỉ là lớp đầu. Cần xem:</p>\n<ul>\n<li>người khác đang giữ bao nhiêu bản;</li>\n<li>đối thủ contest còn sống bao lâu;</li>\n<li>frontline/utility cũng đang bị tranh hay không;</li>\n<li>bench có đủ để giữ cặp;</li>\n<li>người bị loại trả unit về pool có kịp survival horizon của bạn không.</li>\n</ul>\n<p>Không chờ đối thủ chết nếu bạn có thể chết trước.</p>"
      },
      {
        "type": "pitfalls",
        "title": "Lỗi thường gặp",
        "items": [
          "Roll một số vàng ngẫu nhiên.",
          "Chỉ đếm carry chính là out.",
          "Lên cấp xong không có tiền roll hoặc unit để thêm.",
          "Roll tiếp sau khi board đã đủ mạnh.",
          "Giữ quá nhiều cặp xa vời làm nghẹt bench/kinh tế.",
          "Tin rằng nhiều vàng tự động làm lần roll “bớt đen”."
        ]
      },
      {
        "type": "concept",
        "title": "Bài tập",
        "html": "<h4>Phiếu rolldown</h4>\n<p>Trước roll ghi:</p>\n<pre><code class=\"language-text\">Level / Máu / Vàng:\nNút thắt:\nOut A:\nOut B:\nOut C:\nBreakpoint:\nNgưỡng dừng:\nKế hoạch nếu không hit:\n</code></pre>\n<h4>Review hiệu suất vàng</h4>\n<p>Sau roll, chia vàng đã tiêu thành:</p>\n<ul>\n<li>nâng sao;</li>\n<li>thay unit;</li>\n<li>mua bench không dùng;</li>\n<li>roll sau breakpoint.</li>\n</ul>\n<p>Mục tiêu là giảm hai nhóm cuối.</p>"
      },
      {
        "type": "checklist",
        "title": "Checklist",
        "items": [
          "Level mới tạo slot hoặc odds có ích.",
          "Tôi có ít nhất ba nhóm outs.",
          "Tôi biết contest/pool tương đối.",
          "Tôi đã định nghĩa breakpoint.",
          "Tôi có ngưỡng dừng và phương án không hit."
        ]
      }
    ]
  },
  {
    "slug": "ke-hoach-tft-theo-stage",
    "title": "Kế hoạch theo stage và điều kiện thắng",
    "module": "Vận hành kinh tế",
    "shortTitle": "Kế hoạch theo stage và điều kiện thắng",
    "summary": "Các mốc cụ thể có thể đổi khi Riot thay XP, shop odds hoặc sát thương người chơi.",
    "skill": "Kinh tế / Tempo",
    "duration": "~20 phút",
    "exercise": "10 trận ghi một câu kế hoạch ở đầu mỗi stage.",
    "commonMistake": "Áp lịch level của guide vào mọi lobby.",
    "applyQuestions": [
      "Đầu trận: giữ thông tin và cặp có giá trị.",
      "Stage 2: chọn chuỗi.",
      "Stage 3: xác định lõi, contest, mốc stabilize."
    ],
    "related": [
      {
        "label": "Strongest board và opener",
        "href": "/kien-thuc-nen-tang"
      },
      {
        "label": "Level, roll, outs và breakpoint",
        "href": "/kien-thuc-nen-tang"
      },
      {
        "label": "Flex, transition và pivot",
        "href": "/kien-thuc-nen-tang"
      },
      {
        "label": "Cập nhật Set và patch",
        "href": "/kien-thuc-nen-tang"
      }
    ],
    "blocks": [
      {
        "type": "concept",
        "title": "Giới thiệu",
        "html": "<p>Các mốc cụ thể có thể đổi khi Riot thay XP, shop odds hoặc sát thương người chơi. Dùng stage như <strong>điểm kiểm tra</strong>, không như lịch hành động cứng.</p>"
      },
      {
        "type": "concept",
        "title": "Stage 1 — Thu thập thông tin",
        "html": "<p>Mục tiêu:</p>\n<ul>\n<li>nhặt cặp và unit chất lượng;</li>\n<li>xác định linh kiện/chức năng item;</li>\n<li>nhận diện holder;</li>\n<li>giữ nhiều nhánh với chi phí hợp lý.</li>\n</ul>\n<p>Câu hỏi: shop tự nhiên đang cho damage, frontline hay utility? Có unit nào đáng giữ hơn một mốc lãi nhỏ?</p>"
      },
      {
        "type": "concept",
        "title": "Stage 2 — Chọn trạng thái chuỗi",
        "html": "<p>Mục tiêu:</p>\n<ul>\n<li>thắng chuỗi có chủ đích;</li>\n<li>thua chuỗi có kiểm soát;</li>\n<li>hoặc trung lập để giữ kinh tế mà không mất máu lớn.</li>\n</ul>\n<p>Tránh trạng thái thắng-thua xen kẽ vì vừa mất máu vừa không nhận đủ giá trị chuỗi.</p>"
      },
      {
        "type": "concept",
        "title": "Stage 3 — Xây lõi midgame",
        "html": "<p>Mục tiêu:</p>\n<ul>\n<li>chuyển opener sang khung vai trò ổn định;</li>\n<li>đánh giá tempo lobby;</li>\n<li>xác định archetype vận hành;</li>\n<li>chọn mốc roll/level đầu tiên;</li>\n<li>theo dõi contest.</li>\n</ul>\n<p>Đây là stage nhiều người mất quyền lựa chọn vì giữ board cũ quá lâu hoặc ép đội hình cuối quá sớm.</p>\n<h4>Đặt hạn chót cho cặp chưa lên sao</h4>\n<p>Nếu bàn đang giữ nhiều cặp tướng (2 bản) chưa lên 2 sao, đặt trước một mốc vòng cứng (ví dụ hết Stage 3, hoặc trước rolldown kế tiếp). Đến mốc đó mà cặp vẫn chưa hoàn thành, buộc phải chọn ngay một trong các hướng: bán, pivot sang khung khác, ghép item tạm cho bản một sao, hoặc gộp vào rolldown sắp tới thay vì tiếp tục &quot;chờ thêm một round nữa&quot;. Không có hạn chót, việc chờ pool dễ kéo dài đến khi mất luôn quyền lựa chọn.</p>"
      },
      {
        "type": "concept",
        "title": "Stage 4 — Rolldown và transition",
        "html": "<p>Trước rolldown:</p>\n<ul>\n<li>dọn bench;</li>\n<li>chuẩn bị outs;</li>\n<li>biết holder cần bán;</li>\n<li>định nghĩa board tối thiểu và ngưỡng dừng.</li>\n</ul>\n<p>Trong rolldown:</p>\n<ol>\n<li>mua nâng cấp đang dùng;</li>\n<li>mua carry/tank thay thế phù hợp item;</li>\n<li>thay unit yếu nhất;</li>\n<li>kích utility/trait có giá trị;</li>\n<li>dừng khi đủ sống.</li>\n</ol>\n<p>Sau rolldown:</p>\n<ul>\n<li>chuyển item;</li>\n<li>position lại;</li>\n<li>đánh giá mục tiêu placement;</li>\n<li>chọn roll tiếp hay lên cấp.</li>\n</ul>"
      },
      {
        "type": "concept",
        "title": "Stage 5+ — Chơi theo điều kiện thắng",
        "html": "<h4>Nếu có cửa top 1</h4>\n<ul>\n<li>nâng level/cap;</li>\n<li>tìm unit chất lượng và nâng sao đắt tiền;</li>\n<li>thay trait bot;</li>\n<li>position theo từng matchup;</li>\n<li>giữ tài nguyên cho trần thực tế.</li>\n</ul>\n<h4>Nếu chơi top 4</h4>\n<ul>\n<li>loại bỏ unit một sao cốt lõi;</li>\n<li>ưu tiên consistency;</li>\n<li>không tham level nếu có thể chết trước;</li>\n<li>nhắm matchup thắng được.</li>\n</ul>\n<h4>Nếu cứu placement</h4>\n<ul>\n<li>dùng toàn bộ tài nguyên có giá trị hiện tại;</li>\n<li>chấp nhận item/board không hoàn hảo;</li>\n<li>chọn spike rẻ nhất;</li>\n<li>tối ưu từng round sống thêm.</li>\n</ul>"
      },
      {
        "type": "concept",
        "title": "Archetype không phải lịch cứng",
        "html": "<ul>\n<li><strong>Reroll:</strong> cần nhiều bản sao, odds phù hợp, ít contest và cap đủ.</li>\n<li><strong>Fast 8:</strong> cần máu, kinh tế, board chuyển tiếp và đủ tiền rolldown.</li>\n<li><strong>Fast 9:</strong> chỉ hợp khi board đã ổn định và level 9 thực sự nâng cap.</li>\n</ul>\n<p>Tên archetype mô tả cách phân bổ tài nguyên, không thay thế việc đọc trạng thái.</p>"
      },
      {
        "type": "pitfalls",
        "title": "Lỗi thường gặp",
        "items": [
          "Áp lịch level của guide vào mọi lobby.",
          "Đến rolldown mới nghĩ carry/tank thay thế.",
          "Chuyển toàn bộ board cùng lúc khi chưa mua đủ unit.",
          "Lên 9 với board chưa ổn định và không còn tiền mua unit.",
          "Không đổi mục tiêu placement sau khi rolldown thất bại."
        ]
      },
      {
        "type": "drill",
        "title": "Bài tập",
        "goal": "",
        "steps": [
          "10 trận ghi một câu kế hoạch ở đầu mỗi stage.",
          "Trước rolldown, vẽ board tối thiểu và board cap.",
          "Sau trận, tìm stage đầu tiên kế hoạch không còn phù hợp nhưng bạn chưa đổi."
        ]
      },
      {
        "type": "checklist",
        "title": "Checklist theo stage",
        "items": [
          "Đầu trận: giữ thông tin và cặp có giá trị.",
          "Stage 2: chọn chuỗi.",
          "Stage 3: xác định lõi, contest, mốc stabilize.",
          "Stage 4: rolldown có outs/breakpoint.",
          "Stage 5+: chơi theo điều kiện thắng thực tế."
        ]
      }
    ]
  },
  {
    "slug": "vai-tro-toc-he-va-board-cap",
    "title": "Vai trò, tộc hệ và board cap",
    "module": "Xây dựng đội hình",
    "shortTitle": "Vai trò, tộc hệ và board cap",
    "summary": "Xây đội hình từ chức năng thay vì tên tộc hệ.",
    "skill": "Đội hình / Item",
    "duration": "~20 phút",
    "exercise": "Mỗi trận gọi tên vai trò của từng unit; unit không có vai trò là ứng viên thay.",
    "commonMistake": "Kích nhiều trait nhưng thiếu damage hoặc frontline.",
    "applyQuestions": [
      "Có damage chính và điều kiện hoạt động.",
      "Frontline tạo đủ thời gian.",
      "Có utility/xuyên khi matchup cần."
    ],
    "related": [
      {
        "label": "Trang bị và phân bổ chỉ số",
        "href": "/kien-thuc-nen-tang"
      },
      {
        "label": "Chọn Nâng Cấp",
        "href": "/kien-thuc-nen-tang"
      },
      {
        "label": "Roll, lobby, item và trait nâng cao",
        "href": "/kien-thuc-nen-tang"
      }
    ],
    "blocks": [
      {
        "type": "principles",
        "title": "Mục tiêu",
        "items": [
          "Xây đội hình từ chức năng thay vì tên tộc hệ.",
          "Đánh giá giá trị biên của một mốc trait.",
          "Nâng cap bằng unit chất lượng, utility và matchup phù hợp."
        ]
      },
      {
        "type": "concept",
        "title": "Sáu vai trò thường cần",
        "html": "<ol>\n<li><strong>Damage chính:</strong> nguồn sát thương ổn định.</li>\n<li><strong>Damage phụ/kết liễu:</strong> xử lý mục tiêu hoặc phần máu carry chính bỏ lại.</li>\n<li><strong>Tank chính:</strong> hấp thụ đợt damage quan trọng.</li>\n<li><strong>Frontline phụ/câu giờ:</strong> tạo thời gian và đường di chuyển.</li>\n<li><strong>Utility:</strong> CC, hồi phục, shield, buff, debuff.</li>\n<li><strong>Xuyên/giảm phòng thủ:</strong> giúp damage chuyển thành máu thật.</li>\n</ol>\n<p>Một unit có thể làm nhiều vai trò. Mục tiêu là đủ chức năng, không phải đủ số lượng unit theo danh sách.</p>"
      },
      {
        "type": "concept",
        "title": "Trait là phương tiện",
        "html": "<p>Giá trị thật của mốc trait:</p>\n<pre><code class=\"language-text\">Bonus nhận được\n- chất lượng unit phải thêm\n- utility/unit phải bỏ\n- chi phí slot\n- chi phí positioning\n- chỉ số bị thừa hoặc không dùng hết\n</code></pre>\n<h4>Trait bot</h4>\n<p>Unit chỉ dùng để kích mốc nhưng:</p>\n<ul>\n<li>không có item;</li>\n<li>một sao;</li>\n<li>kỹ năng ít giá trị;</li>\n<li>làm xấu pathing/position;</li>\n<li>thay chỗ unit utility mạnh.</li>\n</ul>\n<p>Trait bot có thể đúng, nhưng phải chứng minh bonus mốc lớn hơn chi phí slot.</p>"
      },
      {
        "type": "concept",
        "title": "Vertical và horizontal",
        "html": "<ul>\n<li><strong>Vertical:</strong> đầu tư sâu vào một trait; thường có trần rõ nhưng dễ phụ thuộc unit/emblem.</li>\n<li><strong>Horizontal:</strong> nhiều mốc nhỏ và unit chất lượng; linh hoạt nhưng cần hiểu vai trò.</li>\n</ul>\n<p>Không có kiểu luôn tốt hơn. Chọn theo item, unit nâng sao, augment, lobby và cap thực tế.</p>"
      },
      {
        "type": "concept",
        "title": "Board cap",
        "html": "<p>Cap không chỉ là cost hoặc số unit 5 vàng. Board cap tăng khi:</p>\n<ul>\n<li>nâng sao vị trí cốt lõi;</li>\n<li>thay unit yếu bằng unit chất lượng;</li>\n<li>thêm utility đúng matchup;</li>\n<li>đạt trait breakpoint có giá trị biên cao;</li>\n<li>cân bằng damage/frontline;</li>\n<li>cải thiện positioning và cast order.</li>\n</ul>"
      },
      {
        "type": "concept",
        "title": "Quy trình xây board",
        "html": "<ol>\n<li>Gọi tên carry và damage profile.</li>\n<li>Ước lượng thời gian frontline cần tạo.</li>\n<li>Bổ sung shred/sunder/anti-heal/CC khi cần.</li>\n<li>Kiểm tra unit yếu nhất.</li>\n<li>So unit thay thế với mốc trait mất/được.</li>\n<li>Kiểm tra board có bị nghẽn vị trí hoặc item không.</li>\n<li>Chọn nâng cap phù hợp mục tiêu placement.</li>\n</ol>"
      },
      {
        "type": "pitfalls",
        "title": "Lỗi thường gặp",
        "items": [
          "Kích nhiều trait nhưng thiếu damage hoặc frontline.",
          "Giữ vertical cao bằng unit một sao yếu.",
          "Đếm số người hưởng trait mà không kiểm tra ai thực sự dùng chỉ số.",
          "Thêm damage khi nút thắt là uptime.",
          "Chơi board cap theo ảnh mẫu, không theo lobby."
        ]
      },
      {
        "type": "drill",
        "title": "Bài tập",
        "goal": "",
        "steps": [
          "Mỗi trận gọi tên vai trò của từng unit; unit không có vai trò là ứng viên thay.",
          "Trước khi kích mốc trait cao hơn, ghi unit vào, unit ra và chức năng đổi.",
          "Review một combat để xác định chức năng thiếu đầu tiên."
        ]
      },
      {
        "type": "checklist",
        "title": "Checklist",
        "items": [
          "Có damage chính và điều kiện hoạt động.",
          "Frontline tạo đủ thời gian.",
          "Có utility/xuyên khi matchup cần.",
          "Trait bot tạo giá trị ròng dương.",
          "Unit yếu nhất đã được nhận diện.",
          "Cap phù hợp mục tiêu placement."
        ]
      }
    ]
  },
  {
    "slug": "trang-bi-va-phan-bo-chi-so",
    "title": "Trang bị và phân bổ chỉ số",
    "module": "Xây dựng đội hình",
    "shortTitle": "Trang bị và phân bổ chỉ số",
    "summary": "Ghép item theo chức năng và nút thắt.",
    "skill": "Đội hình / Item",
    "duration": "~20 phút",
    "exercise": "Sau mỗi trận, phân loại linh kiện vào carry, tank, utility.",
    "commonMistake": "Chạy theo 100% crit hoặc một stat nổi bật.",
    "applyQuestions": [
      "Item giải quyết nút thắt cụ thể.",
      "Carry và tank đều có điều kiện hoạt động.",
      "Có xuyên/utility khi cần."
    ],
    "related": [
      {
        "label": "Chỉ số, item, tộc hệ, crit và blind spots",
        "href": "/kien-thuc-nen-tang"
      },
      {
        "label": "Mana, chu kỳ cast và animation",
        "href": "/kien-thuc-nen-tang"
      },
      {
        "label": "Đọc dữ liệu không bị đánh lừa",
        "href": "/kien-thuc-nen-tang"
      }
    ],
    "blocks": [
      {
        "type": "principles",
        "title": "Mục tiêu",
        "items": [
          "Ghép item theo chức năng và nút thắt.",
          "Cân bằng carry, frontline và utility trên toàn board.",
          "Phân biệt BIS lý thuyết với giá trị thực trong thời gian trận."
        ]
      },
      {
        "type": "concept",
        "title": "Công thức damage thực dụng",
        "html": "<pre><code class=\"language-text\">Damage thực\n≈ damage nền × tần suất hành động × khuếch đại × xuyên phòng thủ × uptime\n</code></pre>\n<p>Dồn toàn bộ item vào một nhóm chỉ số có thể kém hơn sửa nhóm đang thiếu. Ví dụ, thêm crit vào carry đã đủ damage nhưng thiếu thời gian hoạt động không giải quyết nút thắt.</p>\n<p>Quy tắc &quot;chống loãng chỉ số&quot; ở trên chỉ đúng khi so sánh các phương án dùng <strong>cùng lượng tài nguyên</strong> (cùng số ô đồ, cùng linh kiện sẵn có). Chi phí cơ hội thực tế của một ô đồ — món đó có thể ghép cho holder khác tốt hơn không — đôi khi khiến lựa chọn &quot;kém tối ưu&quot; trên giấy vẫn là quyết định đúng, vì tài nguyên bỏ ra để đổi sang phương án cân bằng hơn không rảnh để dùng chỗ khác.</p>"
      },
      {
        "type": "concept",
        "title": "Công thức tank thực dụng",
        "html": "<p>Tank cần phối hợp:</p>\n<ul>\n<li>máu;</li>\n<li>giáp/kháng phép phù hợp damage lobby;</li>\n<li>giảm damage, shield hoặc hồi phục;</li>\n<li>thời gian kích hoạt;</li>\n<li>utility tạo ra trước khi chết.</li>\n</ul>\n<p>Nhiều máu không tự động “trâu” nếu thiếu kháng; nhiều kháng cũng kém nếu lượng máu nền quá thấp.</p>"
      },
      {
        "type": "concept",
        "title": "Ba lớp item trên board",
        "html": "<ol>\n<li><strong>Carry hoạt động:</strong> damage, mana/AS, xuyên hoặc sustain cần thiết.</li>\n<li><strong>Frontline sống đủ:</strong> EHP và khả năng chống damage chính.</li>\n<li><strong>Utility toàn board:</strong> shred/sunder, anti-heal, CC, support.</li>\n</ol>\n<p>Không dồn tám linh kiện vào carry nếu frontline chết trước khi carry dùng được chúng.</p>"
      },
      {
        "type": "concept",
        "title": "Slam hay giữ?",
        "html": "<h4>Slam khi</h4>\n<ul>\n<li>item dùng được trên nhiều holder;</li>\n<li>cứu chuỗi hoặc nhiều máu;</li>\n<li>board đang thiếu đúng chức năng;</li>\n<li>lobby tempo cao;</li>\n<li>delay cost lớn hơn phần tối ưu BIS.</li>\n</ul>\n<h4>Giữ khi</h4>\n<ul>\n<li>board vẫn đủ mạnh;</li>\n<li>sắp có thêm lựa chọn item;</li>\n<li>linh kiện là nút thắt cho nhiều món thiết yếu;</li>\n<li>món hiện tại khóa line quá sâu mà không tạo spike.</li>\n</ul>"
      },
      {
        "type": "concept",
        "title": "Item holder",
        "html": "<p>Holder tốt:</p>\n<ul>\n<li>dùng được phần lớn stats;</li>\n<li>có thể bán/chuyển đồ đúng mốc;</li>\n<li>đủ nâng sao hoặc uptime để tạo giá trị;</li>\n<li>không buộc giữ một unit yếu quá lâu.</li>\n</ul>"
      },
      {
        "type": "concept",
        "title": "So sánh gói trang bị thay vì từng món rời rạc",
        "html": "<p>Khi có nhiều linh kiện trên bench (ví dụ 4 mảnh), đừng đánh giá từng món một cách rời rạc. Dựng thử ít nhất hai &quot;gói 2-món hoàn chỉnh&quot; khả thi từ đúng số linh kiện đang có, rồi so sánh trực tiếp hai gói đó theo nút thắt cần giải quyết — cách này phản ánh đúng đánh đổi thật hơn là chọn món có vẻ mạnh nhất trong danh sách.</p>"
      },
      {
        "type": "concept",
        "title": "Quy trình ghép item",
        "html": "<ol>\n<li>Chẩn đoán board thiếu damage, frontline hay utility.</li>\n<li>Xác định holder hiện tại và holder cuối.</li>\n<li>Liệt kê món giải quyết nút thắt.</li>\n<li>Ước lượng giá trị trong 3–5 round tới.</li>\n<li>So với delay cost và độ linh hoạt mất.</li>\n<li>Sau combat, kiểm tra item có tạo thêm cast, thêm target hạ được hoặc thêm thời gian sống không.</li>\n</ol>"
      },
      {
        "type": "pitfalls",
        "title": "Lỗi thường gặp",
        "items": [
          "Chạy theo 100% crit hoặc một stat nổi bật.",
          "Build tank chỉ theo máu/giáp mà không nhìn damage lobby.",
          "Chờ BIS trong khi mất máu lớn.",
          "Ghép theo quán tính, không gọi tên chức năng.",
          "Đánh giá item theo carry riêng lẻ thay vì toàn board.",
          "Không tính thời gian kích hoạt và combat duration."
        ]
      },
      {
        "type": "concept",
        "title": "Bài tập",
        "html": "<h4>Audit tám linh kiện</h4>\n<p>Sau mỗi trận, phân loại linh kiện vào carry, tank, utility. Ghi vị trí nào bị thiếu và vì sao.</p>\n<h4>Review giá trị combat</h4>\n<p>Với mỗi item chính, trả lời:</p>\n<ul>\n<li>tạo thêm bao nhiêu thời gian sống/cast/target hạ được?</li>\n<li>hiệu ứng có kích hoạt trước khi combat kết thúc không?</li>\n<li>item khác có sửa nút thắt tốt hơn không?</li>\n</ul>"
      },
      {
        "type": "checklist",
        "title": "Checklist",
        "items": [
          "Item giải quyết nút thắt cụ thể.",
          "Carry và tank đều có điều kiện hoạt động.",
          "Có xuyên/utility khi cần.",
          "Holder dùng được stats và có kế hoạch chuyển.",
          "Delay cost không vượt giá trị chờ BIS.",
          "Không dồn quá nhiều cùng một nhóm chỉ số."
        ]
      }
    ]
  },
  {
    "slug": "chon-nang-cap-tft",
    "title": "Chọn Nâng Cấp theo trạng thái board",
    "module": "Xây dựng đội hình",
    "shortTitle": "Chọn Nâng Cấp theo trạng thái board",
    "summary": "Đánh giá Nâng Cấp theo timing, điều kiện và board hiện tại.",
    "skill": "Đội hình / Item",
    "duration": "~15 phút",
    "exercise": "Trước mỗi lựa chọn, chụp board và viết nút thắt trong một câu.",
    "commonMistake": "Chọn augment S-tier trong mọi trạng thái.",
    "applyQuestions": [
      "Augment sửa nút thắt hoặc nâng mục tiêu rõ.",
      "Giá trị đến kịp survival horizon.",
      "Điều kiện kích hoạt thực tế."
    ],
    "related": [
      {
        "label": "Đọc trạng thái và mục tiêu thứ hạng",
        "href": "/kien-thuc-nen-tang"
      },
      {
        "label": "Trang bị và phân bổ chỉ số",
        "href": "/kien-thuc-nen-tang"
      },
      {
        "label": "Đọc dữ liệu không bị đánh lừa",
        "href": "/kien-thuc-nen-tang"
      }
    ],
    "blocks": [
      {
        "type": "principles",
        "title": "Mục tiêu",
        "items": [
          "Đánh giá Nâng Cấp theo timing, điều kiện và board hiện tại.",
          "Cân bằng sức mạnh ngay, kinh tế, độ linh hoạt và trần.",
          "Tránh chọn theo tier list mà bỏ qua context."
        ]
      },
      {
        "type": "concept",
        "title": "Bốn nhóm chức năng",
        "html": "<ul>\n<li><strong>Tempo/combat:</strong> tăng sức mạnh ngay, giữ máu/chuỗi.</li>\n<li><strong>Kinh tế:</strong> vàng, XP hoặc tài nguyên tương lai.</li>\n<li><strong>Định hướng:</strong> trait, emblem hoặc cơ chế khóa line.</li>\n<li><strong>Nâng cap:</strong> giá trị lớn khi board hoàn thiện hoặc combat kéo dài.</li>\n</ul>\n<p>Một augment có thể thuộc nhiều nhóm; cần hỏi giá trị xuất hiện <strong>khi nào</strong>.</p>"
      },
      {
        "type": "concept",
        "title": "Ma trận đánh giá",
        "html": "<table>\n<thead>\n<tr>\n<th>Tiêu chí</th>\n<th>Câu hỏi</th>\n</tr>\n</thead>\n<tbody><tr>\n<td>Sức mạnh ngay</td>\n<td>Có đổi 2–3 matchup tiếp theo không?</td>\n</tr>\n<tr>\n<td>Timing</td>\n<td>Giá trị xuất hiện ngay hay sau nhiều round?</td>\n</tr>\n<tr>\n<td>Phù hợp</td>\n<td>Board/item/unit hiện tại dùng được bao nhiêu phần?</td>\n</tr>\n<tr>\n<td>Điều kiện</td>\n<td>Cần thêm bao nhiêu thứ mới để hoạt động?</td>\n</tr>\n<tr>\n<td>Linh hoạt</td>\n<td>Nếu không hit line dự kiến, còn dùng được không?</td>\n</tr>\n<tr>\n<td>Trần</td>\n<td>Cuối trận còn đóng góp gì?</td>\n</tr>\n<tr>\n<td>Cơ hội</td>\n<td>Chọn nó làm mất lựa chọn nào khác?</td>\n</tr>\n</tbody></table>"
      },
      {
        "type": "concept",
        "title": "Quy trình chọn",
        "html": "<ol>\n<li>Đọc trạng thái board trước khi nhìn tier list.</li>\n<li>Gọi tên nút thắt: damage, frontline, kinh tế, item, slot, contest.</li>\n<li>Ước lượng survival horizon.</li>\n<li>Với mỗi lựa chọn, nêu giá trị ngay và giá trị muộn.</li>\n<li>Loại lựa chọn cần quá nhiều điều kiện.</li>\n<li>Chọn augment phù hợp mục tiêu placement.</li>\n</ol>"
      },
      {
        "type": "concept",
        "title": "Cân bằng augment với item/board",
        "html": "<p>Augment không tồn tại độc lập. Nếu board đã có nhiều tank nhưng thiếu damage, augment phòng thủ tốt trên data có thể tạo “thừa tank, thiếu damage”. Nếu item đã cung cấp shred, augment utility trùng chức năng có thể kém hơn nguồn damage hoặc frontline.</p>"
      },
      {
        "type": "concept",
        "title": "Khi chọn kinh tế",
        "html": "<p>Hợp lý khi:</p>\n<ul>\n<li>máu và board cho phép chờ;</li>\n<li>tài nguyên chắc chắn chuyển thành spike;</li>\n<li>không làm mất chuỗi/tempo quá đắt;</li>\n<li>có kế hoạch tiêu vàng/XP.</li>\n</ul>\n<p>Không chọn chỉ vì giá trị vàng lý thuyết cao.</p>"
      },
      {
        "type": "concept",
        "title": "Khi chọn định hướng",
        "html": "<p>Cần kiểm tra:</p>\n<ul>\n<li>item có phù hợp không;</li>\n<li>unit cốt lõi có sẵn/ít contest không;</li>\n<li>emblem giải phóng slot hay buộc thêm trait bot;</li>\n<li>pivot cost nếu shop không hợp tác.</li>\n</ul>"
      },
      {
        "type": "pitfalls",
        "title": "Lỗi thường gặp",
        "items": [
          "Chọn augment S-tier trong mọi trạng thái.",
          "Chồng thêm điểm mạnh nhưng không sửa nút thắt.",
          "Chọn kinh tế khi máu không đủ thời gian hoàn vốn.",
          "Tự khóa line vì emblem sớm.",
          "Chỉ nhìn trần top 1, bỏ qua độ ổn định top 4."
        ]
      },
      {
        "type": "drill",
        "title": "Bài tập",
        "goal": "",
        "steps": [
          "Trước mỗi lựa chọn, chụp board và viết nút thắt trong một câu.",
          "Chấm từng augment 0–2 ở bảy tiêu chí; sau trận kiểm tra tiêu chí đã đánh giá sai.",
          "Review các trận chọn augment kinh tế: nó hoàn vốn ở round nào và đã tốn bao nhiêu máu?"
        ]
      },
      {
        "type": "checklist",
        "title": "Checklist",
        "items": [
          "Augment sửa nút thắt hoặc nâng mục tiêu rõ.",
          "Giá trị đến kịp survival horizon.",
          "Điều kiện kích hoạt thực tế.",
          "Không trùng chức năng vô ích với item/trait.",
          "Có đường dùng nếu không hit line chính.",
          "Phù hợp mục tiêu top 1/top 4/cứu placement."
        ]
      }
    ]
  },
  {
    "slug": "flex-transition-va-pivot",
    "title": "Flex, transition và pivot",
    "module": "Xây dựng đội hình",
    "shortTitle": "Flex, transition và pivot",
    "summary": "Hiểu flex là chuyển tài nguyên hiệu quả, không phải chơi thật nhiều đội hình.",
    "skill": "Đội hình / Item",
    "duration": "~25 phút",
    "exercise": "Với mỗi bộ item phổ biến, viết:",
    "commonMistake": "Flex bằng cách giữ quá nhiều unit và phá kinh tế.",
    "applyQuestions": [
      "Tôi đang ở mức cam kết nào?",
      "Line thay thế dùng lại được item/unit gì?",
      "Pivot cost có nhỏ hơn chi phí tiếp tục line cũ?"
    ],
    "related": [
      {
        "label": "Tài nguyên và giá trị lựa chọn",
        "href": "/kien-thuc-nen-tang"
      },
      {
        "label": "Level, roll, outs và breakpoint",
        "href": "/kien-thuc-nen-tang"
      },
      {
        "label": "Scouting, contest và lobby ecology",
        "href": "/kien-thuc-nen-tang"
      }
    ],
    "blocks": [
      {
        "type": "principles",
        "title": "Mục tiêu",
        "items": [
          "Hiểu flex là chuyển tài nguyên hiệu quả, không phải chơi thật nhiều đội hình.",
          "Transition từng phần mà không tự làm yếu board.",
          "Pivot theo tín hiệu và chi phí, không theo cảm xúc."
        ]
      },
      {
        "type": "concept",
        "title": "Flex là gì?",
        "html": "<p>Flex là giữ và chọn những nhánh có thể biến tổ hợp hiện tại của:</p>\n<ul>\n<li>item;</li>\n<li>unit/shop tự nhiên;</li>\n<li>augment;</li>\n<li>vàng/máu;</li>\n<li>lobby/contest;</li>\n<li>thời gian và kỹ năng thao tác</li>\n</ul>\n<p>thành kết quả kỳ vọng tốt nhất.</p>\n<p>Biết 20 đội hình nhưng không biết holder, vai trò và đường chuyển không phải flex.</p>"
      },
      {
        "type": "concept",
        "title": "Thang cam kết 0–4",
        "html": "<ul>\n<li><strong>0 — Mở:</strong> linh kiện chung, chưa có unit/augment khóa hướng.</li>\n<li><strong>1 — Nghiêng:</strong> có opener/holder hoặc một món phù hợp.</li>\n<li><strong>2 — Lõi chuyển tiếp:</strong> có khung carry–tank và một số unit cuối.</li>\n<li><strong>3 — Cam kết cao:</strong> item/augment/emblem/unit hiếm làm pivot đắt.</li>\n<li><strong>4 — Khó đảo:</strong> đã nâng cấp và đầu tư sâu; đổi làm yếu rõ.</li>\n</ul>\n<p>Sai lầm phổ biến là tự coi mức 1 thành mức 3.</p>"
      },
      {
        "type": "concept",
        "title": "Transition an toàn",
        "html": "<ol>\n<li>Xác định vai trò cần giữ: damage, tank, utility.</li>\n<li>Mua unit mới trên bench trước.</li>\n<li>Giữ board mạnh nhất trong khi tích lũy khung mới.</li>\n<li>Chuẩn bị holder cần bán và thứ tự chuyển item.</li>\n<li>Chuyển một cụm chức năng, không thay toàn board nếu chưa đủ unit.</li>\n<li>Sau chuyển, kiểm tra trait, positioning và mục tiêu placement.</li>\n</ol>"
      },
      {
        "type": "concept",
        "title": "Tín hiệu pivot",
        "html": "<p>Nên pivot khi có nhiều tín hiệu cùng lúc:</p>\n<ul>\n<li>contest trực tiếp nặng;</li>\n<li>item không còn phù hợp;</li>\n<li>shop tự nhiên cho lõi khác;</li>\n<li>augment mở line mạnh hơn;</li>\n<li>đã tiêu ngân sách hợp lý nhưng không hit;</li>\n<li>máu không cho phép chờ;</li>\n<li>board thay thế dùng lại nhiều tài nguyên hiện có.</li>\n</ul>\n<p>Không pivot chỉ vì thua một round hoặc thấy người khác high-roll.</p>"
      },
      {
        "type": "concept",
        "title": "Pivot cost",
        "html": "<pre><code class=\"language-text\">Pivot cost\n= vàng mua/bán\n+ nâng sao mất\n+ item mismatch\n+ trait/augment mất giá trị\n+ thời gian thao tác\n+ máu có thể mất trong lúc chuyển\n</code></pre>\n<p>Một line yếu hơn trên tier list nhưng pivot cost thấp và ít contest có thể tốt hơn line “S-tier” đang quá đắt.</p>\n<h4>Pivot phòng thủ rẻ hơn pivot sát thương</h4>\n<p>Hai loại pivot không cùng chi phí:</p>\n<ul>\n<li><strong>Đổi kiểu chống chịu</strong> (giáp trước damage vật lý ↔ kháng phép trước damage phép) chỉ cần đổi phân bổ đồ trên tank hiện có — pivot cost thấp, làm được ngay giữa trận.</li>\n<li><strong>Đổi kiểu sát thương</strong> (carry vật lý ↔ carry phép, hoặc đổi hẳn nguồn damage chính) kéo theo đổi carry, đổi lõi item và thường đổi cả trait — pivot cost cao, tương đương một lần transition thật sự.</li>\n</ul>\n<p>Vì bất đối xứng này, đừng mặc định pivot damage là phản ứng nhanh cho một lobby damage-check bất lợi; thường điều chỉnh chống chịu trước là lựa chọn rẻ hơn và đủ để sống sót.</p>"
      },
      {
        "type": "concept",
        "title": "Chuẩn bị flex trước rolldown",
        "html": "<ul>\n<li>hai đến ba carry dùng được item;</li>\n<li>hai đến ba tank holder;</li>\n<li>board tối thiểu cho từng nhánh;</li>\n<li>unit giao nhau giữa các nhánh;</li>\n<li>thứ tự ưu tiên khi bench đầy;</li>\n<li>breakpoint dừng.</li>\n</ul>"
      },
      {
        "type": "pitfalls",
        "title": "Lỗi thường gặp",
        "items": [
          "Flex bằng cách giữ quá nhiều unit và phá kinh tế.",
          "Chuyển toàn board trong một nhịp, thiếu thời gian position.",
          "Bán lõi cũ trước khi mua đủ lõi mới.",
          "Pivot sang line có item/augment không phù hợp.",
          "Không pivot vì sunk cost.",
          "Pivot quá nhiều vì phản ứng với từng shop."
        ]
      },
      {
        "type": "concept",
        "title": "Bài tập",
        "html": "<h4>Bản đồ nhánh</h4>\n<p>Với mỗi bộ item phổ biến, viết:</p>\n<ul>\n<li>hai carry chính;</li>\n<li>một carry tạm;</li>\n<li>hai frontline;</li>\n<li>utility giao nhau;</li>\n<li>điều kiện loại từng nhánh.</li>\n</ul>\n<h4>Nhật ký mức cam kết</h4>\n<p>Ghi mức 0–4 ở 2-1, 3-2, 4-1 và sau augment. Review xem cam kết tăng vì tín hiệu hay vì quán tính.</p>"
      },
      {
        "type": "checklist",
        "title": "Checklist",
        "items": [
          "Tôi đang ở mức cam kết nào?",
          "Line thay thế dùng lại được item/unit gì?",
          "Pivot cost có nhỏ hơn chi phí tiếp tục line cũ?",
          "Khung mới đã đủ hoạt động trước khi bán khung cũ?",
          "Có đủ thời gian thao tác và position?",
          "Mục tiêu placement sau pivot là gì?"
        ]
      }
    ]
  },
  {
    "slug": "scouting-contest-va-lobby-ecology",
    "title": "Scouting, contest và lobby ecology",
    "module": "Đọc lobby và giao tranh",
    "shortTitle": "Scouting, contest và lobby ecology",
    "summary": "Scout để thay đổi quyết định, không chỉ thu thập hình ảnh.",
    "skill": "Lobby / Combat",
    "duration": "~20 phút",
    "exercise": "Mỗi stage chọn một câu hỏi scout và ghi quyết định phát sinh.",
    "commonMistake": "Scout tất cả nhưng không có câu hỏi.",
    "applyQuestions": [
      "Tôi scout để trả lời câu hỏi gì?",
      "Contest nằm ở carry, frontline hay utility?",
      "Ai sẽ roll trước tôi?"
    ],
    "related": [
      {
        "label": "Level, roll, outs và breakpoint",
        "href": "/kien-thuc-nen-tang"
      },
      {
        "label": "Positioning, targeting và pathing",
        "href": "/kien-thuc-nen-tang"
      },
      {
        "label": "Roll, lobby, item và trait nâng cao",
        "href": "/kien-thuc-nen-tang"
      }
    ],
    "blocks": [
      {
        "type": "principles",
        "title": "Mục tiêu",
        "items": [
          "Scout để thay đổi quyết định, không chỉ thu thập hình ảnh.",
          "Phân loại contest theo chức năng.",
          "Đọc lobby như một hệ sinh thái tài nguyên và tempo."
        ]
      },
      {
        "type": "concept",
        "title": "Scouting có mục tiêu",
        "html": "<p>Mỗi lần scout chỉ cần trả lời một câu hỏi:</p>\n<ul>\n<li>Ai mạnh hơn tôi ở nhịp này?</li>\n<li>Ai đang giữ carry/tank/utility tôi cần?</li>\n<li>Lobby thiên damage vật lý hay phép?</li>\n<li>Ai sắp rolldown hoặc lên level?</li>\n<li>Đối thủ có thể gặp đứng carry/tank bên nào?</li>\n<li>Ai có thể bị loại và trả unit về pool?</li>\n</ul>\n<p>Thông tin không dẫn đến hành động là noise.</p>"
      },
      {
        "type": "concept",
        "title": "Hai lỗi đối nghịch khi xử lý thông tin scout",
        "html": "<ul>\n<li><strong>Thiếu thông tin → điểm mù:</strong> scout không đủ nên bỏ sót contest/tempo quan trọng, ra quyết định dựa trên giả định sai về lobby.</li>\n<li><strong>Thừa thông tin rời rạc → quá tải:</strong> scout quá nhiều chi tiết không nối lại thành hành động, dẫn đến do dự hoặc đứng hình giữa round vì không biết ưu tiên tín hiệu nào.</li>\n</ul>\n<p>Mục tiêu không phải scout nhiều nhất mà là dừng đúng lúc — đủ để trả lời câu hỏi đang đặt ra, không hơn.</p>"
      },
      {
        "type": "concept",
        "title": "Năm loại contest",
        "html": "<ol>\n<li><strong>Carry:</strong> cùng unit damage chính.</li>\n<li><strong>Frontline:</strong> cùng tank hoặc khung tank hiếm.</li>\n<li><strong>Utility:</strong> CC, shred, support đắt tiền.</li>\n<li><strong>Tempo:</strong> cùng mốc level/rolldown, làm pool bị rút trước.</li>\n<li><strong>Item/resource:</strong> cùng ưu tiên carousel hoặc component.</li>\n</ol>\n<p>Hai line khác tên vẫn có thể contest nặng ở frontline và utility.</p>"
      },
      {
        "type": "concept",
        "title": "Mức độ contest",
        "html": "<ul>\n<li><strong>Nhẹ:</strong> giữ vài bản, chưa commit.</li>\n<li><strong>Chức năng:</strong> khác line nhưng dùng cùng unit quan trọng.</li>\n<li><strong>Trực tiếp:</strong> cùng carry/tank và cùng mốc roll.</li>\n<li><strong>Nguy hiểm:</strong> nhiều người sống khỏe, đã có item/augment cam kết và cần nhiều bản.</li>\n</ul>\n<p>Contest là thang, không phải có/không.</p>"
      },
      {
        "type": "concept",
        "title": "Tempo map của lobby",
        "html": "<p>Ghi nhanh:</p>\n<ul>\n<li>số người reroll;</li>\n<li>số người dự kiến Fast 8/9;</li>\n<li>board mạnh nhất/yếu nhất;</li>\n<li>số người giữ item;</li>\n<li>lượng máu trung bình;</li>\n<li>thời điểm nhiều người có thể spike.</li>\n</ul>\n<p>Thông tin này quyết định bạn có thể greed, cần roll trước hay nên chọn line ít “lobby tax” hơn.</p>"
      },
      {
        "type": "concept",
        "title": "Lobby tax",
        "html": "<p>Một line phổ biến phải trả thêm:</p>\n<ul>\n<li>odds thấp hơn vì pool bị rút;</li>\n<li>phải roll sớm hơn;</li>\n<li>frontline/utility khó nâng;</li>\n<li>item bị tranh;</li>\n<li>cap cần cao hơn để thắng mirror.</li>\n</ul>\n<p>Tier list không luôn phản ánh đầy đủ thuế này trong lobby cụ thể.</p>"
      },
      {
        "type": "concept",
        "title": "Chu trình scout 8 giây",
        "html": "<ol>\n<li>Chọn 2–3 đối thủ có thể gặp.</li>\n<li>Xem carry, tank, threat hàng sau.</li>\n<li>Ghi một tín hiệu contest/tempo.</li>\n<li>Ra một hành động: mua/giữ/bán, roll/level, ghép item hoặc đổi vị trí.</li>\n<li>Không đổi board quá nhiều nếu thông tin chưa chắc.</li>\n</ol>"
      },
      {
        "type": "pitfalls",
        "title": "Lỗi thường gặp",
        "items": [
          "Scout tất cả nhưng không có câu hỏi.",
          "Chỉ đếm người chơi cùng tên đội hình.",
          "Phát hiện contest sau rolldown.",
          "Chờ người contest chết dù survival horizon không đủ.",
          "Position chống một ảnh chụp cũ.",
          "Không cập nhật sau khi đối thủ pivot hoặc bị loại."
        ]
      },
      {
        "type": "drill",
        "title": "Bài tập",
        "goal": "",
        "steps": [
          "Mỗi stage chọn một câu hỏi scout và ghi quyết định phát sinh.",
          "Trước rolldown, lập bảng contest carry/frontline/utility riêng.",
          "Dự đoán hai người sẽ spike ở stage kế tiếp; review độ chính xác."
        ]
      },
      {
        "type": "checklist",
        "title": "Checklist",
        "items": [
          "Tôi scout để trả lời câu hỏi gì?",
          "Contest nằm ở carry, frontline hay utility?",
          "Ai sẽ roll trước tôi?",
          "Lobby đang nhanh hay chậm?",
          "Ai có thể bị loại và có kịp giúp pool không?",
          "Thông tin này thay đổi hành động nào?"
        ]
      }
    ]
  },
  {
    "slug": "positioning-targeting-va-pathing",
    "title": "Positioning, targeting và pathing",
    "module": "Đọc lobby và giao tranh",
    "shortTitle": "Positioning, targeting và pathing",
    "summary": "Xếp cờ theo mục tiêu combat, không copy sơ đồ cố định.",
    "skill": "Lobby / Combat",
    "duration": "~20 phút",
    "exercise": "Mỗi round cuối game dự đoán target đầu của carry và tank.",
    "commonMistake": "Copy vị trí mẫu suốt trận.",
    "applyQuestions": [
      "Tank nhận damage trước carry.",
      "Carry có góc đánh và đường thoát.",
      "Unit không tự chặn nhau."
    ],
    "related": [
      {
        "label": "Scouting, contest và lobby ecology",
        "href": "/kien-thuc-nen-tang"
      },
      {
        "label": "Mana, chu kỳ cast và animation",
        "href": "/kien-thuc-nen-tang"
      },
      {
        "label": "VOD review và phân loại lỗi",
        "href": "/kien-thuc-nen-tang"
      }
    ],
    "blocks": [
      {
        "type": "principles",
        "title": "Mục tiêu",
        "items": [
          "Xếp cờ theo mục tiêu combat, không copy sơ đồ cố định.",
          "Hiểu target đầu, đường di chuyển và không gian quanh carry.",
          "Dùng positioning để tạo tài nguyên mà không hy sinh nền tảng board."
        ]
      },
      {
        "type": "concept",
        "title": "Thứ tự ưu tiên",
        "html": "<ol>\n<li>Board có đủ sức mạnh cơ bản không?</li>\n<li>Tank có nhận damage trước carry không?</li>\n<li>Carry có góc đánh và uptime không?</li>\n<li>Unit có tự chặn đường nhau không?</li>\n<li>Utility/CC có chạm đúng mục tiêu không?</li>\n<li>Có cần “scam” matchup cụ thể không?</li>\n</ol>\n<p>Positioning không bù được board quá yếu một cách ổn định.</p>"
      },
      {
        "type": "concept",
        "title": "Targeting và pathing",
        "html": "<p>Combat thường bị quyết định bởi:</p>\n<ul>\n<li>target đầu tiên;</li>\n<li>target hợp lệ khi unit cũ chết/di chuyển;</li>\n<li>khoảng cách và ô trống;</li>\n<li>unit trung gian tạo hoặc phá “cầu” đến carry;</li>\n<li>tầm đánh tay dài/tay ngắn;</li>\n<li>kỹ năng lao, móc, AoE hoặc đổi target.</li>\n</ul>\n<p>Không học mẹo vị trí mà bỏ qua lý do target/pathing phía sau.</p>"
      },
      {
        "type": "concept",
        "title": "Di chuyển là thời gian không sát thương",
        "html": "<ul>\n<li>Mỗi giây carry hoặc utility phải di chuyển là một giây không tạo sát thương/hiệu ứng. Tối ưu theo hai hướng: rút ngắn đường đi của quân mình (đặt carry gần điểm combat dự kiến), hoặc kéo dài đường đi của carry đối thủ (dùng mồi/cầu chắn đúng lối).</li>\n<li>Khi hai cách xếp cho kỳ vọng gần tương đương, ưu tiên cách cần di chuyển ít quân hơn: quyết định nhanh hơn trong lúc chuẩn bị, và đối thủ có ít thời gian đọc vị đội hình để phản ứng lại.</li>\n</ul>"
      },
      {
        "type": "concept",
        "title": "Bốn matchup khung",
        "html": "<h4>Tay dài vs tay dài</h4>\n<p>Mục tiêu: bảo vệ carry, kiểm soát góc focus và tránh AoE. Cùng bên/đối góc chỉ đúng khi target và threat cụ thể ủng hộ.</p>\n<h4>Tay dài vs tay ngắn</h4>\n<p>Mục tiêu: kéo dài đường tiếp cận, dùng mồi/frontline tạo đường đi bất lợi và giữ khoảng trống cho carry đổi target.</p>\n<h4>Tay ngắn vs tay dài</h4>\n<p>Mục tiêu: tạo đường vào carry, tránh bị kẹt trên tank không phù hợp, phân tán để giảm AoE khi cần.</p>\n<h4>Tay ngắn vs tay ngắn</h4>\n<p>Mục tiêu: chọn góc va chạm, focus, hàng đứng và nhịp vào combat. Đổi bên có thể thay target đầu và đường đi của toàn đội.</p>"
      },
      {
        "type": "concept",
        "title": "Unit mồi và cầu",
        "html": "<p>Một unit mồi có thể:</p>\n<ul>\n<li>nhận target đầu;</li>\n<li>kéo carry đối thủ đi bộ;</li>\n<li>giữ một ô/path;</li>\n<li>tách AoE;</li>\n<li>câu kỹ năng.</li>\n</ul>\n<p>Giá trị phải lớn hơn việc mất unit hoặc trait/utility. Không dùng mẹo mồi nếu làm frontline vỡ ngay.</p>"
      },
      {
        "type": "concept",
        "title": "Positioning theo xác suất gặp",
        "html": "<p>Cuối trận:</p>\n<ol>\n<li>xác định 2–3 đối thủ có thể gặp;</li>\n<li>tìm cách xếp có kỳ vọng tốt nhất trước nhóm đó;</li>\n<li>chỉ hard-counter một nhà khi xác suất gặp hoặc hậu quả matchup đủ lớn;</li>\n<li>chuẩn bị thao tác đổi bên cuối giây nhưng không vượt khả năng xử lý.</li>\n</ol>"
      },
      {
        "type": "concept",
        "title": "Thắng đậm, không chỉ thắng",
        "html": "<ul>\n<li>Mục tiêu combat không dừng ở thắng round: giữ được càng nhiều quân sống, sát thương gây cho đối thủ (player damage) càng lớn, rút ngắn thời gian trận đấu của họ.</li>\n<li>Bàn mạnh hơn không mặc nhiên chịu ít thiệt hại hơn. Dọn sạch một cánh quá nhanh có thể khiến carry tay ngắn của mình lao sâu vào đội hình đối thủ, đổi sang mục tiêu bất lợi, hoặc kích hoạt sớm các công cụ phòng thủ (CC, shield, execute) mà đối thủ đang giữ. Xếp cờ để giữ nhịp dọn dẹp đều hai cánh, không chỉ tối đa tốc độ thắng.</li>\n</ul>"
      },
      {
        "type": "concept",
        "title": "Quy trình review combat",
        "html": "<p>Theo dõi lần lượt:</p>\n<ul>\n<li>ai bị target đầu;</li>\n<li>tank chết lúc nào;</li>\n<li>carry phải di chuyển bao lâu;</li>\n<li>unit nào chặn đường;</li>\n<li>CC/AoE trúng ai;</li>\n<li>target đổi ở mốc nào;</li>\n<li>thay một ô có thể đổi chuỗi sự kiện nào.</li>\n</ul>"
      },
      {
        "type": "pitfalls",
        "title": "Lỗi thường gặp",
        "items": [
          "Copy vị trí mẫu suốt trận.",
          "Đổi vị trí không có giả thuyết.",
          "Dùng tank chính cạnh carry tay ngắn theo thói quen.",
          "Gom board trước AoE.",
          "Dạt cánh/high-risk trick không có điều kiện bảo vệ.",
          "Quá tập trung positioning trong khi board/item/eco là lỗi lớn hơn."
        ]
      },
      {
        "type": "drill",
        "title": "Bài tập",
        "goal": "",
        "steps": [
          "Mỗi round cuối game dự đoán target đầu của carry và tank.",
          "Review 10 combat, chỉ theo dõi đường đi của một unit.",
          "Thử hai vị trí trong hai matchup tương tự; ghi giả thuyết và kết quả.",
          "Ghi một round positioning tạo thêm máu/placement mà không tốn vàng."
        ]
      },
      {
        "type": "checklist",
        "title": "Checklist",
        "items": [
          "Tank nhận damage trước carry.",
          "Carry có góc đánh và đường thoát.",
          "Unit không tự chặn nhau.",
          "Mồi/cầu có mục đích rõ.",
          "Đội hình không quá dễ trúng AoE.",
          "Cách xếp phù hợp nhóm đối thủ có thể gặp."
        ]
      }
    ]
  },
  {
    "slug": "mana-chu-ky-cast-va-animation",
    "title": "Mana, tốc độ tạo mana và chu kỳ cast cơ bản",
    "module": "Đọc lobby và giao tranh",
    "shortTitle": "Mana, tốc độ tạo mana và chu kỳ cast cơ bản",
    "summary": "Hiểu vì sao \"đầy mana\" khác \"sẵn sàng cast\".",
    "skill": "Lobby / Combat",
    "duration": "~25 phút",
    "exercise": "Chọn một tướng bạn đang dùng nhiều nhất.",
    "commonMistake": "Coi \"đầy mana\" đồng nghĩa \"sẵn sàng cast\" mà bỏ qua target/CC/action lock.",
    "applyQuestions": [
      "Tôi phân biệt được \"đầy mana\" và \"sẵn sàng cast\".",
      "Tôi biết nguồn mana chính của từng vai trò trên board mình dùng.",
      "Tôi ước lượng được attack uptime thay vì chỉ nhìn Attack Speed trên bảng chỉ số."
    ],
    "related": [
      {
        "label": "Cast time và animation lock",
        "href": "/kien-thuc-nen-tang"
      },
      {
        "label": "Breakpoint mana nâng cao",
        "href": "/kien-thuc-nen-tang"
      },
      {
        "label": "Positioning, targeting và pathing",
        "href": "/kien-thuc-nen-tang"
      },
      {
        "label": "Trang bị và phân bổ chỉ số",
        "href": "/kien-thuc-nen-tang"
      }
    ],
    "blocks": [
      {
        "type": "principles",
        "title": "Mục tiêu",
        "items": [
          "Hiểu vì sao \"đầy mana\" khác \"sẵn sàng cast\".",
          "Tính tốc độ tạo mana thực tế theo vai trò, không chỉ theo mana/attack trên bảng chỉ số.",
          "Phân biệt vai trò của starting mana và Mana Regen trong một trận đấu."
        ]
      },
      {
        "type": "concept",
        "title": "Bốn điều kiện để bắt đầu cast",
        "html": "<p>Câu hỏi &quot;tướng có cast thêm một lần không&quot; là cần thiết nhưng chưa đủ. Câu hỏi chính xác hơn: tướng bắt đầu cast lúc nào, kỹ năng chạm mục tiêu lúc nào, và sau cast mất bao lâu mới quay lại chu kỳ gây sát thương.</p>\n<p>Đầy mana chỉ là một trong bốn điều kiện, và các điều kiện này thường <strong>chồng lên nhau về thời gian</strong> thay vì cộng tuyến tính:</p>\n<pre><code class=\"language-text\">Thời điểm bắt đầu cast\n= giá trị lớn nhất trong nhóm:\n  mana đã sẵn sàng\n  không còn hành động khác khóa (đang đánh, đang cast cũ)\n  hết crowd control\n  có mục tiêu hợp lệ\n</code></pre>\n<p>Tướng vừa đi bộ vừa nhận Mana Regen, tank vừa chịu sát thương vừa tạo mana, hoặc projectile đang bay trong khi caster đã bắt đầu hành động tiếp theo — đều là các khoảng thời gian chồng nhau, không phải cộng dồn. Ngược lại, tướng đầy mana nhưng chưa có target hợp lệ hoặc vẫn đang bị khóa hành động thì cast vẫn bị trì hoãn dù mana đã đủ từ trước.</p>"
      },
      {
        "type": "concept",
        "title": "Một chu kỳ kỹ năng gồm những giai đoạn nào",
        "html": "<pre><code class=\"language-text\">1. Tìm và khóa mục tiêu\n2. Di chuyển vào vị trí có thể hành động\n3. Tạo đủ mana\n4. Chờ hành động hiện tại kết thúc\n5. Bắt đầu cast\n6. Animation / channel / projectile\n7. Kỹ năng resolve\n8. Mana lock và phục hồi để quay lại vòng mới\n</code></pre>\n<p>Ba giai đoạn đầu quyết định phần lớn khác biệt giữa các vai trò và là trọng tâm của bài này:</p>\n<ul>\n<li><strong>Target acquisition:</strong> nếu mục tiêu đã trong tầm, cast có thể bắt đầu ngay khi mana đủ; nếu tướng đang đánh mục tiêu khác, mục tiêu chết trước khi cast, hoặc kỹ năng tự chọn target khác với target đang đánh, cast bị trì hoãn dù mana đầy.</li>\n<li><strong>Pathing và di chuyển:</strong> mỗi giây di chuyển thường không làm mất Mana Regen theo thời gian, nhưng làm mất mana từ đòn đánh, sát thương đòn đánh và cơ hội kích hoạt item — tức là làm chậm phần mana đến từ attack.</li>\n<li><strong>Mana fill:</strong> mana có thể đến từ Mana Regen theo giây, đòn đánh, nhận sát thương (tùy vai trò), item, trait, augment, kỹ năng đồng minh, ngưỡng máu hoặc takedown.</li>\n</ul>\n<p>Giai đoạn 5–8 (cast windup, animation/projectile, resolve, mana lock) quyết định khoảng cách giữa &quot;sẵn sàng cast&quot; và &quot;kỹ năng thực sự tạo giá trị&quot; — xem <a href=\"04-cast-time-va-animation-lock.md\">Cast time và animation lock</a>.</p>"
      },
      {
        "type": "concept",
        "title": "Vai trò tạo mana khác nhau ra sao",
        "html": "<p>Cơ chế tạo mana theo vai trò có thể đổi giữa các Set, nhưng mô hình thực dụng dưới đây vẫn hữu ích để chẩn đoán:</p>\n<table>\n<thead>\n<tr>\n<th>Vai trò</th>\n<th>Nguồn mana chính</th>\n<th>Điểm cần chú ý</th>\n</tr>\n</thead>\n<tbody><tr>\n<td>Tank</td>\n<td>Đòn đánh + chịu sát thương</td>\n<td>Aggro vừa tăng mana vừa tăng nguy cơ chết trước breakpoint</td>\n</tr>\n<tr>\n<td>Fighter</td>\n<td>Đòn đánh</td>\n<td>Dễ mất uptime vì đi bộ, bị CC và đổi target</td>\n</tr>\n<tr>\n<td>Assassin</td>\n<td>Đòn đánh</td>\n<td>Targeting và thời gian tiếp cận ảnh hưởng mạnh tới tốc độ cast</td>\n</tr>\n<tr>\n<td>Marksman</td>\n<td>Đòn đánh</td>\n<td>Attack Speed thường tăng cả DPS lẫn tốc độ tạo mana cùng lúc</td>\n</tr>\n<tr>\n<td>Caster</td>\n<td>Mana Regen nền + đòn đánh</td>\n<td>Ổn định hơn khi không thể đánh liên tục</td>\n</tr>\n<tr>\n<td>Specialist</td>\n<td>Cơ chế riêng</td>\n<td>Không áp dụng công thức mana chuẩn trước khi xác minh cơ chế cụ thể</td>\n</tr>\n</tbody></table>\n<p>Hai điểm dễ bỏ sót:</p>\n<ul>\n<li><strong>Tank</strong> chỉ cast nhanh nếu thật sự bị nhiều đối thủ đánh và sống đủ lâu qua breakpoint mana — nhiều máu không đồng nghĩa nhiều mana nếu không bị focus.</li>\n<li><strong>Fighter/Marksman</strong> có tốc độ đánh lý thuyết cao trên bảng chỉ số nhưng tốc độ tạo mana thực tế phụ thuộc mạnh vào việc có được đánh liên tục hay không (xem phần tiếp theo).</li>\n</ul>"
      },
      {
        "type": "concept",
        "title": "Công thức tốc độ tạo mana thực tế",
        "html": "<pre><code class=\"language-text\">Tốc độ tạo mana thực tế\n≈ mana regen nền\n+ (attack speed × mana mỗi đòn đánh × tỷ lệ thời gian thực sự đánh được)\n+ mana trung bình từ nhận sát thương hoặc nguồn đặc biệt\n</code></pre>\n<p>Phần dễ bị bỏ qua nhất là <strong>tỷ lệ thời gian thực sự đánh được</strong> (attack uptime) — không phải Attack Speed lý thuyết. Hai ví dụ minh họa:</p>\n<pre><code class=\"language-text\">Marksman:\n  attack speed 0,8/giây, 10 mana/đòn, mana regen item 2, uptime 90%\n  tốc độ mana ≈ 2 + 0,8 × 10 × 0,9 = 9,2 mana/giây\n\nFighter kẹt đường:\n  attack speed 1,0/giây, 10 mana/đòn, không regen, uptime 45%\n  tốc độ mana ≈ 1,0 × 10 × 0,45 = 4,5 mana/giây\n\n  Tăng 30% Attack Speed mà uptime vẫn 45%: ≈ 5,85 mana/giây\n  Giữ nguyên Attack Speed nhưng sửa vị trí để uptime lên 80%: ≈ 8 mana/giây\n</code></pre>\n<blockquote>\n<p>Positioning có thể hoạt động như một trang bị mana vô hình: sửa đường tiếp cận để tăng uptime đôi khi tạo nhiều mana hơn một món đồ mana thật.</p>\n</blockquote>"
      },
      {
        "type": "concept",
        "title": "Starting mana và Mana Regen không cùng chức năng",
        "html": "<p>Hai nguồn mana này thường bị gộp chung khi đánh giá trang bị, nhưng phục vụ mục đích khác nhau:</p>\n<table>\n<thead>\n<tr>\n<th></th>\n<th>Đóng góp chính</th>\n<th>Hết tác dụng khi nào</th>\n</tr>\n</thead>\n<tbody><tr>\n<td>Starting mana</td>\n<td>Cast đầu, buff mở combat, CC mở giao tranh, shield/debuff trước burst của carry</td>\n<td>Sau cast đầu tiên, không còn đóng góp</td>\n</tr>\n<tr>\n<td>Mana Regen</td>\n<td>Cast đầu, cast thứ hai, cast thứ ba, mana trong lúc di chuyển hoặc không đánh được</td>\n<td>Vẫn hoạt động xuyên suốt trận, trừ khi bị mana lock</td>\n</tr>\n<tr>\n<td>Mana tức thời có điều kiện</td>\n<td>Combat Start, lifeline, nhận sát thương, crit, takedown, kỹ năng đồng minh</td>\n<td>Chỉ khi điều kiện kích hoạt xảy ra</td>\n</tr>\n</tbody></table>\n<p>So sánh hai tướng cùng mana tối đa và cùng Mana Regen mà bỏ qua bảng trên dễ dẫn tới kết luận sai: tướng cần cast nhiều lần phụ thuộc Mana Regen và attack uptime nhiều hơn; tướng chỉ cần một cast quyết định (ví dụ CC mở combat) phụ thuộc starting mana nhiều hơn.</p>"
      },
      {
        "type": "pitfalls",
        "title": "Lỗi thường gặp",
        "items": [
          "Coi \"đầy mana\" đồng nghĩa \"sẵn sàng cast\" mà bỏ qua target/CC/action lock.",
          "Tính tốc độ tạo mana theo Attack Speed trên bảng chỉ số, quên nhân với attack uptime thực tế.",
          "Áp công thức mana chuẩn cho Specialist trước khi xác minh cơ chế resource riêng.",
          "Bỏ qua mana từ nhận sát thương khi đánh giá tank.",
          "So sánh hai tướng cùng mana tối đa mà quên chúng khác vai trò và khác nguồn mana chính.",
          "Không phân biệt giá trị của starting mana (chỉ cast đầu) với Mana Regen (xuyên suốt trận)."
        ]
      },
      {
        "type": "concept",
        "title": "Bài tập",
        "html": "<h4>Tính tốc độ mana thực tế</h4>\n<p>Chọn một tướng bạn đang dùng nhiều nhất. Ghi lại attack speed, mana/đòn, mana regen và ước lượng attack uptime từ 2-3 trận gần nhất. Tính tốc độ tạo mana thực tế theo công thức trên và so với con số &quot;lý thuyết&quot; nếu uptime là 100%.</p>\n<h4>Nhật ký attack uptime</h4>\n<p>Trong 5 trận, mỗi trận ghi ước lượng attack uptime của carry chính ở round giao tranh quan trọng nhất. Ghi thêm nguyên nhân uptime thấp nếu có (di chuyển, CC, đổi target).</p>\n<h4>Điền bảng vai trò-nguồn mana</h4>\n<p>Với đội hình bạn dùng nhiều nhất, điền một dòng bảng vai trò-nguồn mana cho mỗi unit chính: nguồn mana chính, điểm cần chú ý riêng của unit đó.</p>"
      },
      {
        "type": "checklist",
        "title": "Checklist",
        "items": [
          "Tôi phân biệt được \"đầy mana\" và \"sẵn sàng cast\".",
          "Tôi biết nguồn mana chính của từng vai trò trên board mình dùng.",
          "Tôi ước lượng được attack uptime thay vì chỉ nhìn Attack Speed trên bảng chỉ số.",
          "Tôi biết tướng nào phụ thuộc starting mana, tướng nào phụ thuộc Mana Regen.",
          "Tôi không áp công thức mana chuẩn cho Specialist chưa xác minh cơ chế.",
          "Tôi cân nhắc sửa positioning trước khi thêm item mana để tăng uptime."
        ]
      }
    ]
  },
  {
    "slug": "cast-time-va-animation-lock",
    "title": "Cast time, animation lock và bốn loại thời gian chết",
    "module": "Đọc lobby và giao tranh",
    "shortTitle": "Cast time, animation lock và bốn loại thời gian chết",
    "summary": "Tách thời điểm mana đầy khỏi thời điểm kỹ năng thực sự chạm mục tiêu.",
    "skill": "Lobby / Combat",
    "duration": "~20 phút",
    "exercise": "Chọn một tướng, ước tính cast windup và projectile travel từ VOD hoặc combat replay.",
    "commonMistake": "Coi cast animation luôn co giãn theo Attack Speed mà không kiểm chứng.",
    "applyQuestions": [
      "Tôi tách được thời điểm mana đầy khỏi thời điểm kỹ năng thực sự chạm mục tiêu.",
      "Tôi tính mana lock khi so sánh giá trị của hai món đồ mana.",
      "Tôi không mặc định animation co giãn theo Attack Speed."
    ],
    "related": [
      {
        "label": "Mana và chu kỳ cast cơ bản",
        "href": "/kien-thuc-nen-tang"
      },
      {
        "label": "Breakpoint mana nâng cao",
        "href": "/kien-thuc-nen-tang"
      },
      {
        "label": "Positioning, targeting và pathing",
        "href": "/kien-thuc-nen-tang"
      }
    ],
    "blocks": [
      {
        "type": "principles",
        "title": "Mục tiêu",
        "items": [
          "Tách thời điểm mana đầy khỏi thời điểm kỹ năng thực sự chạm mục tiêu.",
          "Hiểu mana lock như một sàn tối thiểu cho tốc độ cast, không chỉ là chi tiết phụ.",
          "Phân loại bốn dạng \"thời gian chết\" để biết đang tối ưu đúng chỗ."
        ]
      },
      {
        "type": "concept",
        "title": "Từ mana đầy đến kỹ năng chạm mục tiêu",
        "html": "<pre><code class=\"language-text\">Thời điểm bắt đầu cast\n= giá trị lớn nhất trong nhóm:\n  mana sẵn sàng, hết action lock, hết CC, có mục tiêu hợp lệ\n\nThời điểm kỹ năng chạm mục tiêu\n= thời điểm bắt đầu cast\n+ thời gian cast (windup)\n+ thời gian bay của projectile (nếu có)\n</code></pre>\n<p>Ví dụ minh họa:</p>\n<pre><code class=\"language-text\">Tướng có 80 mana tối đa, 20 mana đầu trận, tạo 10 mana/giây,\ncast windup 1,2 giây, projectile bay 0,5 giây.\n\nMana đầy ở giây: (80 - 20) / 10 = 6\nKỹ năng trúng ở giây: 6 + 1,2 + 0,5 = 7,7\n\nNếu tướng bị stun từ giây 5,5 đến giây 7:\n  mana vẫn đầy ở giây 6, nhưng cast không thể bắt đầu trước giây 7\n  kỹ năng trúng ở giây: 7 + 1,2 + 0,5 = 8,7\n</code></pre>\n<p>Windup không đồng nhất giữa các kỹ năng: có kỹ năng gây tác dụng ngay khi bắt đầu, có kỹ năng chỉ gây tác dụng ở cuối animation, có kỹ năng áp shield/CC trước rồi mới đến damage. Sau windup, projectile có thể cần thời gian bay riêng, và target có thể chết hoặc trở nên untargetable trong lúc projectile đang bay — kỹ năng coi như &quot;đã cast&quot; nhưng không tạo giá trị.</p>"
      },
      {
        "type": "concept",
        "title": "Mana lock: nút thắt thường bị bỏ qua",
        "html": "<p>Mana lock là khoảng thời gian sau hoặc trong một kỹ năng mà tướng không thể tiến tới cast tiếp theo — có thể là không nhận mana, Mana Regen bị tạm dừng, hoặc các nguồn mana khác không hoạt động. Quy tắc cụ thể phụ thuộc từng kỹ năng, nhưng hệ quả chung là: <strong>thêm Mana Regen không nhất thiết rút ngắn chu kỳ cast theo đúng tỷ lệ</strong>.</p>\n<pre><code class=\"language-text\">Tướng cần 60 mana, có 10 mana regen/giây, mỗi kỹ năng tạo mana lock 2 giây.\n\nTrong một chu kỳ 8 giây: chỉ 6 giây được nhận regen, 2 giây lock không có tiến triển.\n\nThêm 5 mana regen: mana đầy nhanh hơn, nhưng vẫn còn 2 giây lock cố định\n→ chu kỳ không giảm hoàn toàn theo tỷ lệ mana thêm vào.\n</code></pre>\n<p>Trường hợp cực đoan: nếu mana fill chỉ mất 1 giây nhưng mana lock và animation chiếm 3 giây, thêm Mana Regen gần như không thể đưa chu kỳ xuống dưới khoảng 3-4 giây — lúc này một món damage hoặc survivability có thể tạo giá trị lớn hơn món mana tiếp theo.</p>"
      },
      {
        "type": "concept",
        "title": "Animation không phải lúc nào cũng scale theo Attack Speed",
        "html": "<p>Không có quy tắc chung rằng Attack Speed làm mọi animation nhanh hơn — cần kiểm chứng từng tướng, thường rơi vào một trong ba dạng:</p>\n<table>\n<thead>\n<tr>\n<th>Dạng</th>\n<th>Attack Speed ảnh hưởng gì</th>\n</tr>\n</thead>\n<tbody><tr>\n<td>Animation cố định</td>\n<td>Chỉ giúp đầy mana nhanh hơn trước cast và đánh nhanh hơn sau cast</td>\n</tr>\n<tr>\n<td>Animation scale theo AS</td>\n<td>Tạo mana nhanh hơn, cast nhanh hơn, quay lại đánh sớm hơn</td>\n</tr>\n<tr>\n<td>Channel có duration riêng</td>\n<td>Có thể chỉ tăng số hit trong channel, chỉ đổi thời lượng, đổi cả hai, hoặc hoàn toàn không liên quan</td>\n</tr>\n</tbody></table>"
      },
      {
        "type": "concept",
        "title": "Bốn loại \"thời gian chết\"",
        "html": "<table>\n<thead>\n<tr>\n<th>Loại</th>\n<th>Đặc điểm</th>\n<th>Ví dụ</th>\n</tr>\n</thead>\n<tbody><tr>\n<td>Hard dead time</td>\n<td>Hoàn toàn không tạo giá trị mới</td>\n<td>Bị stun, knock-up, mana lock không cho nhận mana, đứng khựng do pathing</td>\n</tr>\n<tr>\n<td>Soft dead time</td>\n<td>Đang làm gì đó nhưng không tạo đầu ra mong muốn</td>\n<td>Đi bộ, đổi target, đánh một summon không quan trọng, cast vào tank sắp chết</td>\n</tr>\n<tr>\n<td>Productive lock time</td>\n<td>Bị khóa hành động nhưng kỹ năng vẫn đang tạo giá trị</td>\n<td>Channel gây damage, đang untargetable, đang giữ CC, đang tạo shield/heal theo thời gian</td>\n</tr>\n<tr>\n<td>Hidden dead time</td>\n<td>Khó nhìn thấy bằng mắt thường</td>\n<td>Attack bị hủy trước khi projectile xuất hiện, projectile bay tới mục tiêu đã chết, hai nguồn CC cùng khóa một target trong cùng khoảng thời gian</td>\n</tr>\n</tbody></table>\n<p>Nhầm productive lock time với dead time thật là lỗi phổ biến nhất: một tướng &quot;đứng yên&quot; trong lúc channel vẫn có thể đang tạo phần lớn giá trị của lượt cast đó.</p>"
      },
      {
        "type": "concept",
        "title": "Attack Speed và bốn tác dụng lên chu kỳ cast",
        "html": "<p>Attack Speed ảnh hưởng chu kỳ cast theo bốn cách: tăng mana từ đòn đánh, giảm thời gian giữa các đòn, có thể rút ngắn animation nếu kỹ năng cho phép co giãn, và tăng độ ổn định trước khi bị CC hoặc đổi target.</p>\n<pre><code class=\"language-text\">Attack uptime = thời gian thực sự attack ÷ tổng thời gian sống\n</code></pre>\n<p>Nếu uptime chỉ 40%, phần lớn Attack Speed tiềm năng không được chuyển thành đòn đánh — Attack Speed bị giảm giá trị khi tướng dành nhiều thời gian cast, channel, di chuyển, mana lock hoặc bị khống chế.</p>"
      },
      {
        "type": "pitfalls",
        "title": "Lỗi thường gặp",
        "items": [
          "Coi cast animation luôn co giãn theo Attack Speed mà không kiểm chứng.",
          "Bỏ qua projectile travel khi tính thời điểm impact thực, nhất là khi target có thể chết trước khi projectile tới.",
          "So sánh hai món đồ mana mà không tính mana lock của kỹ năng.",
          "Nhầm productive lock time (đang tạo giá trị dù bị khóa) với dead time thật.",
          "Đánh giá Attack Speed cao là luôn tốt mà không nhìn attack uptime thực tế."
        ]
      },
      {
        "type": "concept",
        "title": "Bài tập",
        "html": "<h4>Đo khoảng cách mana đầy → impact thực</h4>\n<p>Chọn một tướng, ước tính cast windup và projectile travel từ VOD hoặc combat replay. Ghi lại thời điểm mana đầy và thời điểm kỹ năng thực sự chạm mục tiêu, so sánh chênh lệch.</p>\n<h4>Gắn nhãn dead time</h4>\n<p>Xem lại 5 trận, chọn 3 khoảnh khắc carry chính không tạo damage. Gắn nhãn hard/soft/productive/hidden cho mỗi khoảnh khắc và ghi nguyên nhân.</p>\n<h4>Tính attack uptime thực tế</h4>\n<p>Với một carry, ước lượng attack uptime qua 3 round giao tranh khác nhau. So sánh với giả định 100% và ghi nguyên nhân chênh lệch chính (di chuyển, CC, đổi target, cast animation).</p>"
      },
      {
        "type": "checklist",
        "title": "Checklist",
        "items": [
          "Tôi tách được thời điểm mana đầy khỏi thời điểm kỹ năng thực sự chạm mục tiêu.",
          "Tôi tính mana lock khi so sánh giá trị của hai món đồ mana.",
          "Tôi không mặc định animation co giãn theo Attack Speed.",
          "Tôi phân biệt được bốn loại thời gian chết, đặc biệt productive lock time.",
          "Tôi ước lượng attack uptime thay vì chỉ nhìn chỉ số Attack Speed.",
          "Tôi kiểm tra projectile travel khi đánh giá một cast có thực sự tạo giá trị không."
        ]
      }
    ]
  },
  {
    "slug": "breakpoint-mana-nang-cao",
    "title": "Breakpoint mana, cast order và review combat nâng cao",
    "module": "Đọc lobby và giao tranh",
    "shortTitle": "Breakpoint mana, cast order và review combat nâng cao",
    "summary": "Đánh giá trang bị và kỹ năng mana theo breakpoint giao tranh, không theo mana trung bình.",
    "skill": "Lobby / Combat",
    "duration": "~25 phút",
    "exercise": "Với đội hình bạn dùng nhiều nhất, ghi lại cast order thực tế trong 3 trận và so với chuỗi chuẩn 6 bước.",
    "commonMistake": "Tối ưu cast đầu của một tướng mà quên cast order của toàn đội.",
    "applyQuestions": [
      "Tôi biết đồ mana đang thêm vào đổi được breakpoint nào, không chỉ tăng mana trung bình.",
      "Tôi kiểm tra cast order của cả đội, không chỉ tối ưu từng tướng.",
      "Tôi phân biệt starting mana và Mana Regen khi đánh giá một cast quan trọng."
    ],
    "related": [
      {
        "label": "Mana và chu kỳ cast cơ bản",
        "href": "/kien-thuc-nen-tang"
      },
      {
        "label": "Cast time và animation lock",
        "href": "/kien-thuc-nen-tang"
      },
      {
        "label": "Positioning, targeting và pathing",
        "href": "/kien-thuc-nen-tang"
      }
    ],
    "blocks": [
      {
        "type": "principles",
        "title": "Mục tiêu",
        "items": [
          "Đánh giá trang bị và kỹ năng mana theo breakpoint giao tranh, không theo mana trung bình.",
          "Sắp cast order cho toàn đội thay vì tối ưu từng tướng riêng lẻ.",
          "Dùng khung review combat và checklist để chẩn đoán đúng nút thắt."
        ]
      },
      {
        "type": "concept",
        "title": "Vì sao cast sớm hơn có thể làm đội yếu đi",
        "html": "<p>Trực giác thường coi &quot;cast sớm hơn = tốt hơn&quot;, nhưng nhiều tình huống cho kết quả ngược lại:</p>\n<ul>\n<li><strong>AoE cast trước khi đối thủ gom lại:</strong> cast sớm chỉ trúng tank đầu; cast muộn hơn một nhịp có thể trúng nhiều mục tiêu hơn khi đối thủ đã hội tụ quanh frontline.</li>\n<li><strong>Carry cast trước Sunder/Shred của đồng minh:</strong> mana item làm carry cast quá sớm có thể khiến carry mất hẳn lợi ích từ debuff giáp/kháng phép mà đồng minh sắp áp dụng.</li>\n<li><strong>Hai nguồn CC trùng nhau:</strong> nếu hai tướng stun cùng lúc, tổng thời gian kiểm soát thực tế có thể thấp hơn khi chúng cast nối tiếp nhau.</li>\n<li><strong>Heal hoặc shield quá sớm:</strong> heal bị lãng phí vì máu chưa mất, hoặc shield hết hạn trước khi burst chính của đối thủ tới.</li>\n<li><strong>Cast vào target sắp chết:</strong> kỹ năng overkill một tank sắp chết thay vì đánh trúng mục tiêu quan trọng phía sau.</li>\n<li><strong>Kỹ năng kéo/đẩy cast sớm:</strong> có thể làm lệch vị trí mục tiêu trước khi kỹ năng AoE chính của đồng minh kích hoạt.</li>\n</ul>\n<pre><code class=\"language-text\">Timeline xấu:\n3,0s  carry cast\n4,0s  đồng minh mới áp dụng Shred (đã trễ, carry đã cast xong)\n\nTimeline tốt:\n3,0s  đồng minh áp dụng Shred\n3,5s  carry cast (đã hưởng debuff)\n</code></pre>"
      },
      {
        "type": "concept",
        "title": "Cast order toàn đội",
        "html": "<p>Không nên tối ưu từng tướng độc lập. Chuỗi tiêu chuẩn để tham chiếu khi review hoặc lên kế hoạch:</p>\n<pre><code class=\"language-text\">1. Mở giao tranh\n2. Gom hoặc giữ mục tiêu\n3. Áp dụng Sunder/Shred/Vulnerable\n4. Carry dùng kỹ năng chính\n5. Execute hoặc reset\n6. Heal/Shield giữ nhịp thứ hai\n</code></pre>\n<table>\n<thead>\n<tr>\n<th align=\"right\">Thời điểm</th>\n<th>Timeline tốt</th>\n<th>Timeline xấu</th>\n</tr>\n</thead>\n<tbody><tr>\n<td align=\"right\">~0-2s</td>\n<td>Buff Combat Start, tank khóa aggro</td>\n<td>Carry nuke khi đối thủ chưa gom</td>\n</tr>\n<tr>\n<td align=\"right\">~2,5-3,5s</td>\n<td>Utility gom mục tiêu, Shred được áp dụng</td>\n<td>Utility kéo mục tiêu sang vị trí khác</td>\n</tr>\n<tr>\n<td align=\"right\">~3,5-4s</td>\n<td>Carry tung kỹ năng chính sau debuff</td>\n<td>Shred xuất hiện sau khi carry đã cast</td>\n</tr>\n<tr>\n<td align=\"right\">~4-6s</td>\n<td>Fighter hoàn tất mục tiêu, healer phục hồi</td>\n<td>Hai tank cùng dùng CC cùng lúc</td>\n</tr>\n<tr>\n<td align=\"right\">~6-8s</td>\n<td>Carry cast lần hai</td>\n<td>Healer cast khi frontline đã chết</td>\n</tr>\n</tbody></table>"
      },
      {
        "type": "concept",
        "title": "Breakpoint quan trọng hơn mana trung bình",
        "html": "<p>Một món đồ mana chỉ có giá trị nếu nó đổi được một trong các breakpoint sau, không phải vì nó làm mana trung bình tăng:</p>\n<ul>\n<li><strong>First-cast breakpoint:</strong> ai cast trước — tank mình hay tank đối thủ, carry mình hay CC đối thủ, shred hay nuke.</li>\n<li><strong>Second-cast breakpoint:</strong> carry có cast lần hai trước khi frontline chết, bị dive, hoặc đối thủ tung heal lớn hay không.</li>\n<li><strong>Pre-death breakpoint:</strong> tướng có kịp cast trước khi chết không — nếu đã đầy mana nhưng bị CC hoặc animation khóa, thêm mana không giải quyết được gì.</li>\n<li><strong>Stack breakpoint:</strong> cast đầu có mở khóa một tiến trình khác không (item stack, trait tăng tiến, takedown, summon, buff đồng minh).</li>\n<li><strong>CC-chain breakpoint:</strong> cast thứ hai diễn ra sau khi CC đầu tiên hết hay trùng lên nó.</li>\n</ul>"
      },
      {
        "type": "concept",
        "title": "Đánh giá trang bị mana theo loại tướng",
        "html": "<table>\n<thead>\n<tr>\n<th>Vai trò</th>\n<th>Câu hỏi cần kiểm tra trước khi thêm đồ mana</th>\n</tr>\n</thead>\n<tbody><tr>\n<td>Caster tuyến sau</td>\n<td>Mana tối đa, Mana Regen nền, attack uptime, cast animation, cast đầu có cần chờ debuff không, có bị khóa mana trong animation không</td>\n</tr>\n<tr>\n<td>Marksman</td>\n<td>Attack Speed có tăng cả DPS lẫn mana không; Mana Regen có đáng hơn nếu tướng hay phải di chuyển hoặc bị giảm AS</td>\n</tr>\n<tr>\n<td>Tank</td>\n<td>Có bị đủ nhiều mục tiêu đánh không, sát thương đến dạng nhiều hit hay burst, tank có sống đủ lâu qua breakpoint không, mana lock có dài không</td>\n</tr>\n<tr>\n<td>Fighter cận chiến</td>\n<td>Nút thắt là thời gian tiếp cận, body-block, CC hay thiếu target — nhiều khi sửa positioning tạo nhiều cast hơn item mana</td>\n</tr>\n<tr>\n<td>Channeler</td>\n<td>Tách riêng thời gian fill mana, thời gian channel, mana lock, số tick, khả năng bị ngắt và có nhận mana trong channel không</td>\n</tr>\n<tr>\n<td>Specialist</td>\n<td>Không áp công thức mana chuẩn cho đến khi xác định rõ resource cụ thể</td>\n</tr>\n</tbody></table>"
      },
      {
        "type": "concept",
        "title": "Mẫu bản đồ chu kỳ cast (dùng khi review VOD)",
        "html": "<table>\n<thead>\n<tr>\n<th>Thành phần</th>\n<th>Ghi lại</th>\n</tr>\n</thead>\n<tbody><tr>\n<td>Vai trò, mana đầu, mana tối đa</td>\n<td></td>\n</tr>\n<tr>\n<td>Mana mỗi attack, Mana Regen nền + từ item/trait</td>\n<td></td>\n</tr>\n<tr>\n<td>Attack Speed, attack uptime ước tính</td>\n<td></td>\n</tr>\n<tr>\n<td>Thời điểm đầy mana, thời điểm bắt đầu cast</td>\n<td></td>\n</tr>\n<tr>\n<td>Cast windup, projectile travel, mana lock</td>\n<td></td>\n</tr>\n<tr>\n<td>Target đầu, debuff đồng đội đang hoạt động</td>\n<td></td>\n</tr>\n<tr>\n<td>First impact, second impact, số cast trước khi chết</td>\n<td></td>\n</tr>\n</tbody></table>\n<p>Khi review, gắn một trong các nhãn sau cho mỗi cast bị chậm: <code>MANA</code> (thiếu mana), <code>PATH</code> (phải di chuyển), <code>CC</code> (bị khống chế), <code>LOCK</code> (mana lock), <code>ANIM</code> (animation dài), <code>TARGET</code> (không có/đổi mục tiêu), <code>TRAVEL</code> (projectile chậm), <code>SEQ</code> (sai thứ tự với đồng đội), <code>SURVIVE</code> (chết trước breakpoint).</p>"
      },
      {
        "type": "pitfalls",
        "title": "Lỗi thường gặp",
        "items": [
          "Tối ưu cast đầu của một tướng mà quên cast order của toàn đội.",
          "Thêm mana item mà không xác định rõ nó đổi được breakpoint nào.",
          "Không phân biệt starting mana (chỉ cast đầu) và Mana Regen (xuyên suốt trận) khi review.",
          "Mặc định tướng cast sớm hơn luôn tốt hơn, bỏ qua sequencing với debuff/CC đồng minh.",
          "Đổ lỗi cho \"thiếu mana\" trong khi nút thắt thật là target/pathing/CC/animation."
        ]
      },
      {
        "type": "concept",
        "title": "Bài tập",
        "html": "<h4>Ghi cast order thực tế</h4>\n<p>Với đội hình bạn dùng nhiều nhất, ghi lại cast order thực tế trong 3 trận và so với chuỗi chuẩn 6 bước. Ghi rõ bước nào bị đảo hoặc thiếu.</p>\n<h4>Điền bản đồ chu kỳ cast</h4>\n<p>Điền bảng &quot;mẫu bản đồ chu kỳ cast&quot; cho carry chính từ một VOD hoặc combat replay gần nhất.</p>\n<h4>Review một trận thua bằng nhãn nguyên nhân</h4>\n<p>Chọn một trận thua, liệt kê 5 cast quan trọng nhất và gắn nhãn nguyên nhân chậm cast (MANA/PATH/CC/LOCK/ANIM/TARGET/TRAVEL/SEQ/SURVIVE) cho từng cast.</p>"
      },
      {
        "type": "checklist",
        "title": "Checklist",
        "items": [
          "Tôi biết đồ mana đang thêm vào đổi được breakpoint nào, không chỉ tăng mana trung bình.",
          "Tôi kiểm tra cast order của cả đội, không chỉ tối ưu từng tướng.",
          "Tôi phân biệt starting mana và Mana Regen khi đánh giá một cast quan trọng.",
          "Tôi không mặc định cast sớm hơn luôn tốt hơn.",
          "Tôi dùng nhãn nguyên nhân để chẩn đoán đúng nút thắt (mana/target/CC/pathing/animation).",
          "Tôi review được cast thứ hai, không chỉ cast đầu."
        ]
      }
    ]
  },
  {
    "slug": "doc-du-lieu-tft-khong-bi-danh-lua",
    "title": "Đọc dữ liệu TFT không bị đánh lừa",
    "module": "Dữ liệu và thích nghi",
    "shortTitle": "Đọc dữ liệu TFT không bị đánh lừa",
    "summary": "Dùng data để đặt câu hỏi và kiểm chứng, không thay thế tư duy.",
    "skill": "Dữ liệu / Patch",
    "duration": "~20 phút",
    "exercise": "Chọn một câu như “item X là BIS”.",
    "commonMistake": "Copy top comps không đọc điều kiện.",
    "applyQuestions": [
      "Đúng patch/rank/sample.",
      "Tôi biết lựa chọn xuất hiện trong điều kiện nào.",
      "Đã so với phương án tương đương."
    ],
    "related": [
      {
        "label": "Cập nhật Set và patch",
        "href": "/kien-thuc-nen-tang"
      },
      {
        "label": "Trang bị và phân bổ chỉ số",
        "href": "/kien-thuc-nen-tang"
      },
      {
        "label": "Unknown unknowns và kiểm chứng",
        "href": "/kien-thuc-nen-tang"
      }
    ],
    "blocks": [
      {
        "type": "principles",
        "title": "Mục tiêu",
        "items": [
          "Dùng data để đặt câu hỏi và kiểm chứng, không thay thế tư duy.",
          "Nhận diện selection bias, sample nhỏ và điều kiện ẩn.",
          "Chuyển số liệu thành giả thuyết có thể thử trong game/VOD."
        ]
      },
      {
        "type": "concept",
        "title": "Các chỉ số thường gặp",
        "html": "<ul>\n<li><strong>Average placement:</strong> kết quả trung bình; không nói nguyên nhân.</li>\n<li><strong>Top-4 rate:</strong> độ ổn định tương đối.</li>\n<li><strong>Win rate:</strong> khả năng top 1; dễ bị kéo bởi điều kiện high-roll.</li>\n<li><strong>Pick/play rate:</strong> độ phổ biến và mức contest tiềm năng.</li>\n<li><strong>Sample size:</strong> độ ổn định của ước lượng.</li>\n<li><strong>Delta:</strong> chênh lệch khi có/không có một yếu tố; vẫn có thể bị confounding.</li>\n</ul>"
      },
      {
        "type": "concept",
        "title": "Selection bias",
        "html": "<p>Một item có placement đẹp có thể vì:</p>\n<ul>\n<li>chỉ được ghép khi carry đã hai sao;</li>\n<li>xuất hiện trong line high-roll;</li>\n<li>người chơi chỉ chọn khi có augment/emblem phù hợp;</li>\n<li>holder sống đủ lâu trong những board vốn đã mạnh.</li>\n</ul>\n<p>Data mô tả nhóm trận đã xảy ra, không tự chứng minh item làm board mạnh.</p>"
      },
      {
        "type": "concept",
        "title": "Bộ lọc tối thiểu",
        "html": "<ul>\n<li>patch;</li>\n<li>rank;</li>\n<li>khu vực nếu meta khác;</li>\n<li>thời gian sau patch;</li>\n<li>vị trí augment/item;</li>\n<li>đội hình/unit holder;</li>\n<li>star level;</li>\n<li>điều kiện emblem/artifact/radiant;</li>\n<li>sample size.</li>\n</ul>"
      },
      {
        "type": "concept",
        "title": "Quy trình đọc data",
        "html": "<ol>\n<li>Viết câu hỏi trước khi mở bảng số liệu.</li>\n<li>Chọn đúng population và patch.</li>\n<li>Kiểm tra sample/pick rate.</li>\n<li>Tìm điều kiện làm lựa chọn xuất hiện.</li>\n<li>So với phương án thay thế gần nhất.</li>\n<li>Xem VOD để hiểu timing và cách vận hành.</li>\n<li>Thử trong tình huống phù hợp, ghi kết quả nhiều trận.</li>\n</ol>"
      },
      {
        "type": "concept",
        "title": "Data dùng tốt cho việc gì?",
        "html": "<ul>\n<li>phát hiện lựa chọn bị đánh giá thấp/cao;</li>\n<li>tìm pattern đáng xem VOD;</li>\n<li>kiểm tra item/augment phổ biến;</li>\n<li>so sánh nhánh trong điều kiện gần nhau;</li>\n<li>theo dõi lỗi cá nhân qua match history.</li>\n</ul>"
      },
      {
        "type": "concept",
        "title": "Data không trả lời trực tiếp",
        "html": "<ul>\n<li>round nào nên slam;</li>\n<li>bạn có đủ máu để greed không;</li>\n<li>matchup sắp gặp cần position gì;</li>\n<li>vì sao người chơi chọn line;</li>\n<li>lựa chọn nào họ đã bỏ qua;</li>\n<li>một interaction có hoạt động đúng tooltip không.</li>\n</ul>"
      },
      {
        "type": "pitfalls",
        "title": "Lỗi thường gặp",
        "items": [
          "Copy top comps không đọc điều kiện.",
          "Kết luận meta từ vài giờ đầu patch.",
          "So dữ liệu khác rank/patch.",
          "Nhìn average placement nhưng bỏ pick rate.",
          "Tin sample nhỏ của tổ hợp hiếm.",
          "Biến tương quan thành quan hệ nhân quả."
        ]
      },
      {
        "type": "concept",
        "title": "Bài tập",
        "html": "<h4>Audit một claim</h4>\n<p>Chọn một câu như “item X là BIS”. Ghi:</p>\n<ul>\n<li>population;</li>\n<li>sample;</li>\n<li>điều kiện xuất hiện;</li>\n<li>phương án so sánh;</li>\n<li>giả thuyết nhân quả;</li>\n<li>VOD/tooltip cần kiểm tra.</li>\n</ul>\n<h4>Review dữ liệu cá nhân</h4>\n<p>Sau 20 trận, đếm nhãn lỗi và trạng thái ở Stage 4. Không chỉ nhìn average placement.</p>"
      },
      {
        "type": "checklist",
        "title": "Checklist",
        "items": [
          "Đúng patch/rank/sample.",
          "Tôi biết lựa chọn xuất hiện trong điều kiện nào.",
          "Đã so với phương án tương đương.",
          "Không suy luận nhân quả chỉ từ placement.",
          "Đã xem cách vận hành hoặc kiểm tra tooltip.",
          "Claim có thể thử/đo lại."
        ]
      }
    ]
  },
  {
    "slug": "cap-nhat-set-va-patch-tft",
    "title": "Cập nhật kiến thức khi đổi Set và patch",
    "module": "Dữ liệu và thích nghi",
    "shortTitle": "Cập nhật kiến thức khi đổi Set và patch",
    "summary": "Giữ nguyên nền tảng và chỉ cập nhật phần thật sự thay đổi.",
    "skill": "Dữ liệu / Patch",
    "duration": "~20 phút",
    "exercise": "Mỗi patch viết ba thay đổi có thể ảnh hưởng quyết định và ba thứ không cần học lại.",
    "commonMistake": "Học 10 đội hình cùng lúc.",
    "applyQuestions": [
      "Đã đọc nguồn Riot.",
      "Đã phân loại evergreen/Set/patch.",
      "Starter kit đủ nhỏ để luyện."
    ],
    "related": [
      {
        "label": "Kế hoạch theo stage",
        "href": "/kien-thuc-nen-tang"
      },
      {
        "label": "Đọc dữ liệu không bị đánh lừa",
        "href": "/kien-thuc-nen-tang"
      }
    ],
    "blocks": [
      {
        "type": "principles",
        "title": "Mục tiêu",
        "items": [
          "Giữ nguyên nền tảng và chỉ cập nhật phần thật sự thay đổi.",
          "Xây bộ starter kit đủ chơi thay vì học toàn bộ meta.",
          "Kiểm chứng guide/data theo đúng thời điểm."
        ]
      },
      {
        "type": "concept",
        "title": "Tách ba lớp",
        "html": "<h4>Evergreen</h4>\n<p>Tài nguyên, board strength, tempo, roles, flex, scouting, positioning, review.</p>\n<h4>Theo Set</h4>\n<p>Cơ chế mùa, dàn tướng/trait, item holder, opener, line chuyển tiếp, archetype.</p>\n<h4>Theo patch</h4>\n<p>Sức mạnh tương đối, BIS, augment, nhịp roll, bug/interaction và mức contest.</p>"
      },
      {
        "type": "concept",
        "title": "Phiếu Set 60 phút",
        "html": "<h4>Hệ thống</h4>\n<ul>\n<li>XP và shop odds có đổi không?</li>\n<li>pool size, player damage, item distribution?</li>\n<li>augment/cơ chế riêng xuất hiện khi nào?</li>\n<li>vòng đặc biệt ảnh hưởng tempo ra sao?</li>\n</ul>\n<h4>Bản đồ vai trò</h4>\n<ul>\n<li>carry AD/AP theo cost;</li>\n<li>tank holder và tank cuối;</li>\n<li>utility/CC/shred;</li>\n<li>unit chuyển tiếp mạnh;</li>\n<li>unit có thể dùng nhiều loại item.</li>\n</ul>\n<h4>Starter kit</h4>\n<ul>\n<li>ba opener;</li>\n<li>một reroll;</li>\n<li>một line Fast 8;</li>\n<li>một line linh hoạt;</li>\n<li>holder vật lý/phép/tank;</li>\n<li>hai sơ đồ positioning mặc định có giải thích.</li>\n</ul>"
      },
      {
        "type": "concept",
        "title": "Phiếu patch 30 phút",
        "html": "<ol>\n<li>Đọc patch notes Riot.</li>\n<li>Tách thay đổi hệ thống, item, augment, unit/trait.</li>\n<li>Dự đoán tác động bằng nguyên tắc nền tảng.</li>\n<li>Chờ sample đủ trước kết luận data.</li>\n<li>Xem VOD để hiểu vận hành và timing.</li>\n<li>Cập nhật starter kit, không viết lại toàn giáo trình.</li>\n<li>Ghi claim chưa chắc để kiểm chứng.</li>\n</ol>"
      },
      {
        "type": "concept",
        "title": "Cách dùng TFTAcademy/guide",
        "html": "<p>Với mỗi guide, lấy:</p>\n<ul>\n<li>điều kiện vào line;</li>\n<li>opener/holder;</li>\n<li>mốc stabilize;</li>\n<li>carry/tank thay thế;</li>\n<li>điều kiện nâng cap;</li>\n<li>dấu hiệu không nên chơi.</li>\n</ul>\n<p>Không chỉ lấy board cuối và BIS.</p>"
      },
      {
        "type": "concept",
        "title": "Patch-memory trap",
        "html": "<p>Một quy tắc đúng mùa trước có thể sai vì:</p>\n<ul>\n<li>odds/XP/pool đổi;</li>\n<li>item/trait đổi timing;</li>\n<li>cast/target interaction đổi;</li>\n<li>player damage đổi;</li>\n<li>tempo meta khác.</li>\n</ul>\n<p>Giữ nguyên câu hỏi, kiểm tra lại câu trả lời.</p>"
      },
      {
        "type": "pitfalls",
        "title": "Lỗi thường gặp",
        "items": [
          "Học 10 đội hình cùng lúc.",
          "Kết luận meta từ PBE/vài giờ đầu.",
          "Copy guide cũ nhưng không kiểm tra patch.",
          "Coi ví dụ Set-specific là luật evergreen.",
          "Bỏ qua B-patch/hotfix.",
          "Chỉ cập nhật carry, quên frontline/utility/tempo."
        ]
      },
      {
        "type": "drill",
        "title": "Bài tập",
        "goal": "",
        "steps": [
          "Mỗi patch viết ba thay đổi có thể ảnh hưởng quyết định và ba thứ không cần học lại.",
          "Chọn một guide, chuyển thành bảng điều kiện vào / mốc roll / outs / điều kiện thoát.",
          "Sau 10 trận, cập nhật starter kit theo lỗi thật thay vì tier list."
        ]
      },
      {
        "type": "checklist",
        "title": "Checklist",
        "items": [
          "Đã đọc nguồn Riot.",
          "Đã phân loại evergreen/Set/patch.",
          "Starter kit đủ nhỏ để luyện.",
          "Guide có điều kiện vào và thoát.",
          "Data có sample phù hợp.",
          "Claim cơ chế đã kiểm tra tooltip/VOD."
        ]
      }
    ]
  },
  {
    "slug": "xac-suat-shop-pool-va-variance",
    "title": "Xác suất shop, pool và variance",
    "module": "Dữ liệu và thích nghi",
    "shortTitle": "Xác suất shop, pool và variance",
    "summary": "Hiểu shop odds chỉ là một phần của xác suất thực dụng.",
    "skill": "Dữ liệu / Patch",
    "duration": "~20 phút",
    "exercise": "Trước 10 rolldown, đếm outs A/B/C và dự đoán board sau roll.",
    "commonMistake": "Gambler's fallacy: đã xui lâu nên lần tới phải may.",
    "applyQuestions": [
      "Level phù hợp nhóm unit cần tìm.",
      "Đã scout pool/contest.",
      "Có nhiều outs theo chức năng."
    ],
    "related": [
      {
        "label": "Level, roll, outs và breakpoint",
        "href": "/kien-thuc-nen-tang"
      },
      {
        "label": "Scouting, contest và lobby ecology",
        "href": "/kien-thuc-nen-tang"
      },
      {
        "label": "Roll, lobby, item và trait nâng cao",
        "href": "/kien-thuc-nen-tang"
      }
    ],
    "blocks": [
      {
        "type": "principles",
        "title": "Mục tiêu",
        "items": [
          "Hiểu shop odds chỉ là một phần của xác suất thực dụng.",
          "Dùng pool/contest để điều chỉnh quyết định, không dự đoán chắc chắn.",
          "Thiết kế rolldown giảm variance."
        ]
      },
      {
        "type": "concept",
        "title": "Ba lớp xác suất",
        "html": "<h4>1. Phân phối tier theo level</h4>\n<p>Cho biết mỗi ô shop có xác suất thuộc nhóm giá nào. Con số cụ thể có thể đổi theo Set/patch.</p>\n<h4>2. Phân phối trong pool</h4>\n<p>Phụ thuộc số bản sao còn lại của các unit cùng tier và số bản bị người chơi giữ.</p>\n<h4>3. Xác suất cải thiện board</h4>\n<p>Phụ thuộc toàn bộ outs:</p>\n<ul>\n<li>carry/tank chính;</li>\n<li>unit thay thế;</li>\n<li>nâng cấp cặp;</li>\n<li>utility;</li>\n<li>trait breakpoint;</li>\n<li>unit thay vị trí yếu.</li>\n</ul>\n<p>Đây là xác suất quan trọng nhất khi quyết định roll.</p>"
      },
      {
        "type": "concept",
        "title": "Conditional probability",
        "html": "<p>Lịch sử tài nguyên hoặc cơ chế bag/bad-luck protection chỉ hữu ích nếu hệ thống thật sự có quy tắc liên quan. Dùng như tiebreaker giữa lựa chọn gần nhau, không như lời hứa rằng món/unit “đến lượt phải ra”.</p>"
      },
      {
        "type": "concept",
        "title": "Variance của rolldown hẹp",
        "html": "<p>Nếu chỉ một kết quả thành công:</p>\n<ul>\n<li>xác suất fail cao;</li>\n<li>bench ít linh hoạt;</li>\n<li>dễ roll quá breakpoint;</li>\n<li>tâm lý dễ tilt;</li>\n<li>nhiều vàng không tự làm shop “công bằng”.</li>\n</ul>\n<p>Mở rộng outs và board thay thế làm nhiều ô shop trở nên hữu ích.</p>"
      },
      {
        "type": "concept",
        "title": "Pool dynamics",
        "html": "<ul>\n<li>Unit trên bench vẫn rời pool.</li>\n<li>Người bị loại trả unit về pool.</li>\n<li>Nhiều người có thể tranh frontline dù khác carry.</li>\n<li>Pool thinning thay đổi xác suất tương đối trong cùng tier.</li>\n<li>Tác động phải so với survival horizon; chờ pool mở quá lâu có thể sai.</li>\n</ul>"
      },
      {
        "type": "concept",
        "title": "Pool đồ (item/component) khác pool tướng",
        "html": "<p>Pool tướng ở trên nói về unit trong shop. Mảnh trang bị rơi ra từ PvE/quái là một cơ chế khác, không dùng chung logic:</p>\n<ul>\n<li>Đừng mặc định các lượt rơi đồ độc lập và đồng xác suất với nhau; nhiều hệ thống cân bằng ngẫu nhiên có xu hướng bù lại chuỗi thiếu hụt trước đó, nhưng cơ chế cụ thể và con số thay đổi theo Set/patch nên không nêu ở đây — chỉ cần biết &quot;độc lập tuyệt đối&quot; là giả định sai để không quy hoạch cứng nhắc theo nó.</li>\n<li>Ra quyết định giữ/dùng một mảnh cần xét cả nhu cầu hiện tại lẫn khả năng vòng PvE sắp tới bù đắp được phần thiếu — không vội gò một món tạm bợ nếu sắp có thêm lượt rơi.</li>\n<li>Khi thiếu thời gian tính toán, một heuristic đi đúng hướng (ví dụ: ưu tiên mảnh còn thiếu nhiều nhất trong công thức mục tiêu) hữu dụng hơn cố tính xác suất chính xác.</li>\n<li>Theo dõi lịch sử mảnh đã nhận được trong trận biến một cơ chế vốn ẩn thành thông tin hành động được — ví dụ nhận diện mình đang thiếu hẳn một loại mảnh để chủ động đổi hướng ghép đồ.</li>\n</ul>\n<p>Số liệu tỷ lệ rơi cụ thể (nếu có) luôn cần gắn Set/patch và kiểm tra lại trước khi dùng làm căn cứ chắc chắn.</p>"
      },
      {
        "type": "concept",
        "title": "Quy trình ra quyết định",
        "html": "<ol>\n<li>Kiểm tra level phù hợp tier mục tiêu.</li>\n<li>Scout số bản bị giữ và người contest.</li>\n<li>Liệt kê outs theo chức năng.</li>\n<li>Ước lượng số shop mua được sau khi giữ tiền mua unit.</li>\n<li>Đặt breakpoint và phương án fail.</li>\n<li>Roll theo trạng thái, không theo cảm giác “đến lượt”.</li>\n</ol>"
      },
      {
        "type": "pitfalls",
        "title": "Lỗi thường gặp",
        "items": [
          "Gambler's fallacy: đã xui lâu nên lần tới phải may.",
          "Chỉ nhìn odds tier, bỏ pool.",
          "Chỉ đếm một unit là hit.",
          "Roll hết vàng nhưng không giữ tiền mua unit.",
          "Chờ người contest chết dù có thể chết trước.",
          "Dùng cơ chế pool item của một Set như luật chung."
        ]
      },
      {
        "type": "drill",
        "title": "Bài tập",
        "goal": "",
        "steps": [
          "Trước 10 rolldown, đếm outs A/B/C và dự đoán board sau roll.",
          "Review số shop vô ích vì không chuẩn bị nhánh thay thế.",
          "Với một quyết định chờ pool, so số round đối thủ dự kiến sống với survival horizon của bạn."
        ]
      },
      {
        "type": "checklist",
        "title": "Checklist",
        "items": [
          "Level phù hợp nhóm unit cần tìm.",
          "Đã scout pool/contest.",
          "Có nhiều outs theo chức năng.",
          "Có đủ vàng mua unit sau roll.",
          "Có breakpoint/ngưỡng dừng.",
          "Không dùng lịch sử xui như bằng chứng chắc chắn."
        ]
      }
    ]
  },
  {
    "slug": "vod-review-va-phan-loai-loi",
    "title": "VOD review và phân loại lỗi",
    "module": "Luyện tập và review",
    "shortTitle": "VOD review và phân loại lỗi",
    "summary": "Tìm lỗi đầu tiên làm mất quyền lựa chọn.",
    "skill": "Luyện tập / Review",
    "duration": "~20 phút",
    "exercise": "Review một trận xấu và một trận placement tốt nhưng có quyết định đáng ngờ.",
    "commonMistake": "Review chỉ trận top 8 hoặc chỉ round chết.",
    "applyQuestions": [
      "Dùng thông tin có tại thời điểm quyết định.",
      "Có ít nhất hai phương án.",
      "Đã tìm lỗi đầu tiên."
    ],
    "related": [
      {
        "label": "Tư duy TFT xuyên mùa",
        "href": "/kien-thuc-nen-tang"
      },
      {
        "label": "Bài tập theo kỹ năng",
        "href": "/kien-thuc-nen-tang"
      }
    ],
    "blocks": [
      {
        "type": "principles",
        "title": "Mục tiêu",
        "items": [
          "Tìm lỗi đầu tiên làm mất quyền lựa chọn.",
          "Tách quyết định, điều kiện và thao tác.",
          "Biến review thành một hành động sửa cho trận sau."
        ]
      },
      {
        "type": "concept",
        "title": "Mốc dừng VOD",
        "html": "<ul>\n<li>2-1;</li>\n<li>3-2;</li>\n<li>trước augment/rolldown lớn;</li>\n<li>sau rolldown;</li>\n<li>round đầu mất máu lớn;</li>\n<li>hai round trước khi bị loại.</li>\n</ul>"
      },
      {
        "type": "concept",
        "title": "Quy trình 15 phút",
        "html": "<h4>Bước 1 — Che kết quả tương lai</h4>\n<p>Tại mỗi mốc, chỉ dùng thông tin có lúc đó.</p>\n<h4>Bước 2 — Ghi trạng thái</h4>\n<ul>\n<li>máu/vàng/level;</li>\n<li>board strength;</li>\n<li>item/bench;</li>\n<li>contest/lobby tempo;</li>\n<li>survival horizon;</li>\n<li>mục tiêu placement.</li>\n</ul>\n<h4>Bước 3 — Liệt kê phương án</h4>\n<p>Tối thiểu hai lựa chọn và trade-off. Nếu chỉ thấy một, có thể bạn đã bỏ thông tin hoặc mất lựa chọn từ lỗi sớm hơn.</p>\n<h4>Bước 4 — Tìm lỗi đầu tiên</h4>\n<p>Không bắt đầu ở round bị loại. Tìm mốc làm:</p>\n<ul>\n<li>mất máu;</li>\n<li>mất kinh tế;</li>\n<li>khóa item/line;</li>\n<li>nghẹt bench;</li>\n<li>bỏ lỡ spike;</li>\n<li>không còn thời gian pivot.</li>\n</ul>\n<h4>Bước 5 — Tạo hành động sửa</h4>\n<p>Ví dụ: “trước mọi rolldown ghi ba nhóm outs”, không phải “roll tốt hơn”.</p>"
      },
      {
        "type": "concept",
        "title": "Taxonomy lỗi",
        "html": "<ul>\n<li><code>INFO</code>: thiếu thông tin/scout.</li>\n<li><code>STATE</code>: đọc sai board/máu/tempo.</li>\n<li><code>GOAL</code>: sai mục tiêu placement.</li>\n<li><code>ECO</code>: quản lý lợi tức/shop/bench.</li>\n<li><code>HP</code>: greed quá survival horizon.</li>\n<li><code>BOARD</code>: strongest board.</li>\n<li><code>ITEM</code>: slam/holder/phân bổ.</li>\n<li><code>AUG</code>: chọn augment sai context.</li>\n<li><code>LEVEL</code>: lên cấp không có spike.</li>\n<li><code>ROLL</code>: sai level/outs/breakpoint.</li>\n<li><code>PIVOT</code>: cam kết/pivot cost.</li>\n<li><code>POS</code>: targeting/pathing/matchup.</li>\n<li><code>EXEC</code>: thao tác/thời gian.</li>\n<li><code>MENTAL</code>: tilt, autopilot, outcome bias.</li>\n</ul>\n<p>Chỉ chọn một nhãn chính; nhãn phụ chỉ để ghi chú.</p>"
      },
      {
        "type": "concept",
        "title": "Ba loại lỗi cần tách",
        "html": "<ul>\n<li><strong>Ý tưởng sai:</strong> giả thuyết không hợp trạng thái.</li>\n<li><strong>Điều kiện sai:</strong> nguyên tắc đúng nhưng dùng sai timing/lobby.</li>\n<li><strong>Thực thi sai:</strong> quyết định đúng nhưng thao tác, bench hoặc position thất bại.</li>\n</ul>"
      },
      {
        "type": "pitfalls",
        "title": "Lỗi thường gặp",
        "items": [
          "Review chỉ trận top 8 hoặc chỉ round chết.",
          "Dùng thông tin biết sau để phán xét trước.",
          "Ghi quá nhiều nhãn nên không có ưu tiên.",
          "Kết luận từ một trận.",
          "Chỉ xem lỗi, không ghi quyết định tốt có kết quả xấu."
        ]
      },
      {
        "type": "concept",
        "title": "Bài tập",
        "html": "<h4>Hai trận đối chiếu</h4>\n<p>Review một trận xấu và một trận placement tốt nhưng có quyết định đáng ngờ. Điều này giảm outcome bias.</p>\n<h4>Chuỗi nguyên nhân</h4>\n<p>Viết:</p>\n<pre><code class=\"language-text\">Tín hiệu bỏ qua → quyết định → tài nguyên mất → breakpoint bỏ lỡ → placement\n</code></pre>"
      },
      {
        "type": "checklist",
        "title": "Checklist",
        "items": [
          "Dùng thông tin có tại thời điểm quyết định.",
          "Có ít nhất hai phương án.",
          "Đã tìm lỗi đầu tiên.",
          "Tách ý tưởng/điều kiện/thực thi.",
          "Chỉ chọn một nhãn chính.",
          "Có hành động sửa quan sát được."
        ]
      }
    ]
  },
  {
    "slug": "bai-tap-tft-theo-ky-nang",
    "title": "Bài tập TFT theo kỹ năng",
    "module": "Luyện tập và review",
    "shortTitle": "Bài tập TFT theo kỹ năng",
    "summary": "Mỗi block kéo dài 10–20 trận và chỉ chọn một bài tập chính.",
    "skill": "Luyện tập / Review",
    "duration": "~20 phút",
    "exercise": "",
    "commonMistake": "",
    "applyQuestions": [],
    "related": [
      {
        "label": "Lộ trình 8 tuần",
        "href": "/lo-trinh"
      },
      {
        "label": "VOD review và phân loại lỗi",
        "href": "/kien-thuc-nen-tang"
      }
    ],
    "blocks": [
      {
        "type": "concept",
        "title": "Giới thiệu",
        "html": "<p>Mỗi block kéo dài 10–20 trận và chỉ chọn <strong>một</strong> bài tập chính.</p>"
      },
      {
        "type": "concept",
        "title": "Strongest board",
        "html": "<ul>\n<li>Chụp board 2-1/3-2.</li>\n<li>Gọi tên unit yếu nhất mỗi round.</li>\n<li>Sau trận tìm unit mạnh đã để trên bench.</li>\n</ul>\n<p><strong>Đạt:</strong> giải thích được vai trò từng unit.</p>"
      },
      {
        "type": "concept",
        "title": "Economy và tempo",
        "html": "<ul>\n<li>Ghi mọi lần phá mốc lãi.</li>\n<li>Dự đoán thắng/thua nhỏ/thua lớn.</li>\n<li>Đặt stop-loss cho loss streak.</li>\n</ul>\n<p><strong>Đạt:</strong> chi vàng có breakpoint, không theo hoảng loạn.</p>"
      },
      {
        "type": "concept",
        "title": "Itemization",
        "html": "<ul>\n<li>Gọi tên chức năng trước khi ghép.</li>\n<li>Audit tám linh kiện theo carry/tank/utility.</li>\n<li>Đo item bằng cast, thời gian sống hoặc target hạ được.</li>\n</ul>\n<p><strong>Đạt:</strong> giảm linh kiện chết và không phụ thuộc BIS.</p>"
      },
      {
        "type": "concept",
        "title": "Level và roll",
        "html": "<ul>\n<li>Điền phiếu rolldown.</li>\n<li>Liệt kê outs A/B/C.</li>\n<li>Ghi vàng roll sau khi đã đạt breakpoint.</li>\n</ul>\n<p><strong>Đạt:</strong> dừng roll được và có phương án fail.</p>"
      },
      {
        "type": "concept",
        "title": "Flex và pivot",
        "html": "<ul>\n<li>Ghi mức cam kết 0–4.</li>\n<li>Chuẩn bị hai carry/tank dùng được đồ.</li>\n<li>Ghi pivot cost trước khi đổi.</li>\n</ul>\n<p><strong>Đạt:</strong> mô tả line bằng điều kiện/vai trò.</p>"
      },
      {
        "type": "concept",
        "title": "Scouting",
        "html": "<ul>\n<li>Mỗi stage một câu hỏi.</li>\n<li>Đếm contest theo carry/frontline/utility.</li>\n<li>Ghi một hành động do scout tạo ra.</li>\n</ul>\n<p><strong>Đạt:</strong> thông tin scout thay đổi quyết định.</p>"
      },
      {
        "type": "concept",
        "title": "Positioning",
        "html": "<ul>\n<li>Dự đoán target đầu.</li>\n<li>Theo dõi pathing của một unit.</li>\n<li>So hai cách xếp trong matchup tương tự.</li>\n</ul>\n<p><strong>Đạt:</strong> mọi thay đổi vị trí có giả thuyết.</p>"
      },
      {
        "type": "concept",
        "title": "Data và patch",
        "html": "<ul>\n<li>Audit một claim BIS/tier list.</li>\n<li>Chuyển guide thành điều kiện vào/thoát.</li>\n<li>Ghi phần evergreen và phần phải kiểm tra lại.</li>\n</ul>\n<p><strong>Đạt:</strong> không copy số liệu ngoài context.</p>"
      },
      {
        "type": "concept",
        "title": "Review và mental",
        "html": "<ul>\n<li>Một nhãn lỗi chính/trận.</li>\n<li>Review một trận xấu và một trận thắng đáng ngờ.</li>\n<li>Dừng phiên khi vi phạm tiêu chí stop.</li>\n</ul>\n<p><strong>Đạt:</strong> sau 20 trận xác định được lỗi ưu tiên tiếp theo.</p>"
      },
      {
        "type": "concept",
        "title": "Học sâu một đội hình trước khi mở rộng",
        "html": "<p>Trước khi luyện phản xạ với nhiều đội hình khác nhau, chọn một đội hình chuẩn và chơi lặp lại đủ số trận để nhận diện nhanh cấu trúc bàn, thứ tự mua/ghép đồ và các nhánh chuyển hướng phổ biến của riêng nó. Mục tiêu là giảm tải nhận thức: khi một đội hình đã thành phản xạ, phần năng lực còn lại dành được cho đọc lobby và ra quyết định thay vì phải nhớ lại cấu trúc cơ bản mỗi trận. Đây là góc nhìn bổ sung cho nguyên tắc &quot;mỗi tuần một năng lực&quot; ở lộ trình 8 tuần, không thay thế nó — luyện năng lực theo tuần, nhưng nên có một đội hình quen thuộc làm nền để luyện trên đó trước khi tổng quát hóa.</p>"
      },
      {
        "type": "concept",
        "title": "Cách chọn bài tập",
        "html": "<p>Ưu tiên bài tập:</p>\n<ol>\n<li>sửa lỗi xuất hiện sớm;</li>\n<li>có tần suất cao;</li>\n<li>quan sát được;</li>\n<li>nằm trong khả năng hiện tại;</li>\n<li>không phụ thuộc một comp/patch duy nhất.</li>\n</ol>"
      },
      {
        "type": "concept",
        "title": "Mẫu theo dõi",
        "html": "<pre><code class=\"language-text\">Kỹ năng:\nHành vi mục tiêu:\nSố trận:\nSố lần thực hiện đúng:\nNhãn lỗi liên quan:\nMột clip/VOD tiêu biểu:\nTiêu chí qua module:\n</code></pre>"
      }
    ]
  },
  {
    "slug": "quan-ly-phien-choi-va-mindset",
    "title": "Quản lý phiên chơi và mindset",
    "module": "Luyện tập và review",
    "shortTitle": "Quản lý phiên chơi và mindset",
    "summary": "Bảo vệ chất lượng quyết định qua nhiều trận.",
    "skill": "Luyện tập / Review",
    "duration": "~20 phút",
    "exercise": "Theo dõi ba số:",
    "commonMistake": "Đặt mục tiêu LP cho một phiên ngắn.",
    "applyQuestions": [
      "Một kỹ năng/một hành vi.",
      "Có tín hiệu dừng.",
      "Không queue để gỡ."
    ],
    "related": [
      {
        "label": "VOD review và phân loại lỗi",
        "href": "/kien-thuc-nen-tang"
      }
    ],
    "blocks": [
      {
        "type": "principles",
        "title": "Mục tiêu",
        "items": [
          "Bảo vệ chất lượng quyết định qua nhiều trận.",
          "Giảm tilt, autopilot và xử lý quá nhanh.",
          "Đo tiến bộ bằng quy trình thay vì LP ngắn hạn."
        ]
      },
      {
        "type": "concept",
        "title": "Pro không phải xử lý nhanh mọi thứ",
        "html": "<p>Người chơi mạnh phân bổ thời gian theo tác động:</p>\n<ul>\n<li>quyết định khó đảo ngược: nghĩ kỹ;</li>\n<li>lựa chọn gần tương đương: đặt timebox;</li>\n<li>rolldown: chuẩn bị trước rồi thao tác nhanh;</li>\n<li>pattern quen: dùng game sense nhưng vẫn kiểm tra khi điều kiện lạ.</li>\n</ul>\n<p>Chơi nhanh hơn năng lực xử lý chỉ tạo lỗi execution.</p>\n<p>Khung dễ nhớ cho rolldown và các quyết định gấp: <strong>Think then Burst</strong> — dồn hết công sức tìm phương án tốt nhất trước (đọc board, tính outs, dựng thứ tự mua), rồi thực thi dứt khoát không do dự giữa chừng. Tách rời hai pha &quot;nghĩ&quot; và &quot;làm&quot; giảm lỗi vừa nghĩ vừa thao tác chậm.</p>"
      },
      {
        "type": "concept",
        "title": "Cấu trúc một phiên",
        "html": "<h4>Trước phiên</h4>\n<ul>\n<li>một kỹ năng;</li>\n<li>một hành vi quan sát được;</li>\n<li>số trận dự kiến;</li>\n<li>ba line quen thuộc;</li>\n<li>tín hiệu dừng.</li>\n</ul>\n<h4>Trong phiên</h4>\n<ul>\n<li>ghi ngắn sau trận;</li>\n<li>nghỉ 2–5 phút sau trận tilt/top 8;</li>\n<li>không mở quá nhiều guide/data giữa trận;</li>\n<li>kiểm tra mình có còn thực hiện bài tập không.</li>\n</ul>\n<h4>Sau phiên</h4>\n<ul>\n<li>review một trận;</li>\n<li>chọn lỗi đầu tiên;</li>\n<li>ghi một quyết định tốt dù kết quả xấu;</li>\n<li>đặt hành động sửa cho phiên sau.</li>\n</ul>"
      },
      {
        "type": "concept",
        "title": "Tín hiệu dừng",
        "html": "<ul>\n<li>queue ngay để “gỡ”;</li>\n<li>bỏ scouting/bài tập;</li>\n<li>thao tác nhanh nhưng sai nhiều;</li>\n<li>đổ mọi kết quả cho RNG;</li>\n<li>đổi comp theo từng trận;</li>\n<li>mệt, đói hoặc mất tập trung.</li>\n</ul>\n<p>Dừng không phải yếu; đó là bảo vệ sample luyện tập.</p>"
      },
      {
        "type": "concept",
        "title": "Xử lý RNG",
        "html": "<p>Không phủ nhận randomness. Hãy tách:</p>\n<ul>\n<li>phần không kiểm soát: shop, matchup, item roll;</li>\n<li>phần kiểm soát: outs, timing, board thay thế, stop-loss, position;</li>\n<li>phần kiểm chứng: interaction/odds/claim chưa chắc.</li>\n</ul>\n<p>Câu hỏi sau bad beat:</p>\n<blockquote>\n<p>Trước khi RNG xảy ra, tôi đã tối đa số kết quả có thể dùng và giữ đủ máu để chịu fail chưa?</p>\n</blockquote>"
      },
      {
        "type": "concept",
        "title": "Mục tiêu theo giai đoạn trình độ",
        "html": "<ul>\n<li>Rank thấp: strongest board, item hoạt động, economy cơ bản.</li>\n<li>Trung cấp: tempo, roll breakpoint, flex, scouting.</li>\n<li>Cao: lobby ecology, cap, matchup, data, execution time.</li>\n</ul>\n<p>Không dùng kỹ thuật cao để né lỗi nền tảng.</p>"
      },
      {
        "type": "pitfalls",
        "title": "Lỗi thường gặp",
        "items": [
          "Đặt mục tiêu LP cho một phiên ngắn.",
          "Học nhiều module cùng lúc.",
          "Queue khi tilt.",
          "Review chỉ trận thua.",
          "Tự thưởng quyết định xấu vì top cao.",
          "Cố bắt chước tốc độ thao tác của tuyển thủ."
        ]
      },
      {
        "type": "concept",
        "title": "Bài tập",
        "html": "<h4>Chỉ số quy trình</h4>\n<p>Theo dõi ba số:</p>\n<ul>\n<li>tỷ lệ hoàn thành hành vi mục tiêu;</li>\n<li>số lỗi cùng nhãn/20 trận;</li>\n<li>số trận dừng đúng tín hiệu.</li>\n</ul>\n<h4>Reset 90 giây</h4>\n<p>Sau trận cảm xúc cao:</p>\n<ol>\n<li>rời màn hình;</li>\n<li>thở/đi lại;</li>\n<li>ghi một dòng sự kiện;</li>\n<li>quyết định có đủ tập trung để queue không.</li>\n</ol>"
      },
      {
        "type": "checklist",
        "title": "Checklist",
        "items": [
          "Một kỹ năng/một hành vi.",
          "Có tín hiệu dừng.",
          "Không queue để gỡ.",
          "Đo process, không chỉ LP.",
          "Tách RNG và lựa chọn.",
          "Tốc độ thao tác không vượt chuẩn bị."
        ]
      }
    ]
  },
  {
    "slug": "chi-so-trang-bi-chi-mang-can-bang",
    "title": "Chỉ số tướng, trang bị và chí mạng — nguyên lý cân bằng",
    "module": "Chuyên đề nâng cao",
    "shortTitle": "Chỉ số tướng, trang bị và chí mạng — nguyên lý cân bằng",
    "summary": "Đọc đúng tướng đang thiếu nhóm chỉ số nào trước khi ghép item, thay vì chọn \"ba món mạnh nhất\".",
    "skill": "Chuyên đề",
    "duration": "~30 phút",
    "exercise": "Với mỗi trận, chọn một carry và điền: nhóm chỉ số đang cao nhất, nhóm đang thấp nhất, và một món đồ cụ thể sẽ sửa đúng nhóm thấp nhất — không phải món \"mạnh nhất\" trên giấy.",
    "commonMistake": "Chạy theo 100% Crit Chance mà chưa mở quyền spell crit cho damage source chính.",
    "applyQuestions": [
      "Tôi biết carry/tank đang thiếu nhóm chỉ số nào trước khi ghép đồ.",
      "Tôi kiểm tra damage chính có quyền crit trước khi build theo Crit Chance.",
      "Tôi không dồn quá hai nguồn cùng nhóm nếu nhóm đó đã gần bão hòa."
    ],
    "related": [
      {
        "label": "Trang bị và phân bổ chỉ số",
        "href": "/kien-thuc-nen-tang"
      },
      {
        "label": "Item index nâng cao và blind spots",
        "href": "/kien-thuc-nen-tang"
      },
      {
        "label": "Unknown unknowns và kiểm chứng cơ chế TFT",
        "href": "/kien-thuc-nen-tang"
      }
    ],
    "blocks": [
      {
        "type": "principles",
        "title": "Mục tiêu",
        "items": [
          "Đọc đúng tướng đang thiếu nhóm chỉ số nào trước khi ghép item, thay vì chọn \"ba món mạnh nhất\".",
          "Nhận diện năm dạng \"loãng chỉ số\" và biết khi nào một nhóm chỉ số đã gần bão hòa.",
          "Dùng công thức giá trị kỳ vọng của chí mạng để so sánh Crit Chance với Crit Damage và với các nhóm chỉ số khác."
        ]
      },
      {
        "type": "concept",
        "title": "Mô hình sức mạnh của carry và tank",
        "html": "<pre><code class=\"language-text\">Sát thương thực tế\n≈ sát thương mỗi lần × tần suất hành động × khuếch đại × xuyên phòng thủ × thời gian hoạt động\n\nTankiness\n≈ HP × Resists × Durability × Healing/Shield × Uptime\n</code></pre>\n<p>Đây là mô hình tích số: các nhóm nhân với nhau, không cộng. Dồn toàn bộ ba ô đồ vào cùng một nhóm thường kém hơn sửa đúng nhóm đang là nút thắt.</p>"
      },
      {
        "type": "concept",
        "title": "\"Loãng chỉ số\" là gì",
        "html": "<p>Loãng chỉ số không có nghĩa game bí mật giảm hiệu quả trang bị. Ba nguyên nhân phổ biến:</p>\n<ul>\n<li>Nhiều nguồn cùng loại cộng vào cùng một nhóm — phần cộng thêm sau ngày càng nhỏ so với tổng hiện có.</li>\n<li>Một nhóm khác trong công thức đã là nút thắt thật sự (ví dụ đủ damage nhưng chết trước khi dùng được).</li>\n<li>Chưa đạt breakpoint mới (mana, tốc độ đánh) nên phần cộng thêm không tạo thêm hành động trong thời lượng combat thực tế.</li>\n</ul>\n<p>Ví dụ với tốc độ đánh (+30% từ một món đồ):</p>\n<table>\n<thead>\n<tr>\n<th align=\"right\">AS cộng thêm đang có</th>\n<th align=\"right\">Trước</th>\n<th align=\"right\">Sau</th>\n<th align=\"right\">Mức tăng tương đối</th>\n</tr>\n</thead>\n<tbody><tr>\n<td align=\"right\">0%</td>\n<td align=\"right\">1,00</td>\n<td align=\"right\">1,30</td>\n<td align=\"right\">+30%</td>\n</tr>\n<tr>\n<td align=\"right\">50%</td>\n<td align=\"right\">1,50</td>\n<td align=\"right\">1,80</td>\n<td align=\"right\">+20%</td>\n</tr>\n<tr>\n<td align=\"right\">100%</td>\n<td align=\"right\">2,00</td>\n<td align=\"right\">2,30</td>\n<td align=\"right\">+15%</td>\n</tr>\n<tr>\n<td align=\"right\">200%</td>\n<td align=\"right\">3,00</td>\n<td align=\"right\">3,30</td>\n<td align=\"right\">+10%</td>\n</tr>\n</tbody></table>\n<p>Và giữa dồn một nhóm so với chia ba nhóm độc lập (cùng tổng +90%):</p>\n<pre><code class=\"language-text\">Dồn 1 nhóm:      1 + 0,90        = 1,90\nChia 3 nhóm đều: 1,3 × 1,3 × 1,3 = 2,197\n</code></pre>\n<p>Cùng lượng chỉ số danh nghĩa, phương án cân bằng ba nhóm độc lập cho hệ số nhân cao hơn.</p>"
      },
      {
        "type": "concept",
        "title": "Năm dạng loãng chỉ số",
        "html": "<ol>\n<li><strong>Cộng quá nhiều cùng một chỉ số</strong> — ba món AS, ba món AP thuần, quá nhiều Damage Amp nhưng thiếu AD/AP nền.</li>\n<li><strong>Không sửa đúng nút thắt</strong> — nhiều AD nhưng đánh chậm, không xuyên được tank, bị khống chế, chết trước khi cast.</li>\n<li><strong>Không đạt breakpoint mới</strong> — mana/AS bổ sung không tạo thêm một lần cast/đánh trong thời lượng combat thực tế.</li>\n<li><strong>Thời gian hoạt động thấp</strong> — 150 DPS × 3 giây (450 dmg) có thể kém 110 DPS × 8 giây (880 dmg); kháng khống chế, hút máu, khiên, tầm đánh và positioning đều là &quot;sát thương gián tiếp&quot;.</li>\n<li><strong>Loãng cấp toàn đội</strong> — đội đã có Giảm Giáp/Kháng phép diện rộng, giảm hồi máu, buff AS toàn đội hoặc CC mạnh thì thêm một nguồn trùng chức năng thường kém hơn bổ sung chức năng còn thiếu.</li>\n</ol>"
      },
      {
        "type": "concept",
        "title": "Đọc chỉ số của một tướng",
        "html": "<p>Đọc theo hai lớp: loại sát thương (Attack / Magic / Hybrid) và vai trò (Tank, Fighter, Assassin, Marksman, Caster, Specialist). Với Hybrid, phải tách từng phần kỹ năng — phần nào scale AD, phần nào scale AP, phần nào chỉ tăng khiên/hồi máu — thay vì gộp chung.</p>\n<table>\n<thead>\n<tr>\n<th>Nhóm</th>\n<th>Tăng gì</th>\n<th>Mạnh khi</th>\n<th>Bị loãng khi</th>\n</tr>\n</thead>\n<tbody><tr>\n<td>AD</td>\n<td>Đòn đánh, thành phần kỹ năng scale AD, hiệu ứng on-hit</td>\n<td>Tỷ lệ AD cao, nhiều lần đánh, có crit</td>\n<td>Trait đã cho nhiều AD, thiếu AS, không xuyên Giáp</td>\n</tr>\n<tr>\n<td>AP</td>\n<td>Sát thương, khiên, hồi máu, số mục tiêu</td>\n<td>Base damage cao, đủ mana/amp</td>\n<td>Nhiều AP nhưng ít cast</td>\n</tr>\n<tr>\n<td>Tốc độ đánh</td>\n<td>DPS đòn đánh, tạo mana, kích on-hit</td>\n<td>Hoạt ảnh cast ngắn, damage/hit đủ</td>\n<td>Trait đã cho nhiều AS, cast dài, hay bị CC</td>\n</tr>\n<tr>\n<td>Mana/Regen</td>\n<td>Tần suất cast</td>\n<td>Tạo thêm một lần cast trong combat</td>\n<td>Không đổi được số lần cast thực tế</td>\n</tr>\n<tr>\n<td>Crit</td>\n<td>Khuếch đại damage</td>\n<td>Đủ AD/AP nền, đủ uptime</td>\n<td>Damage nền thấp, damage không có quyền crit</td>\n</tr>\n<tr>\n<td>Damage Amp</td>\n<td>Nhân lên sức mạnh đã có</td>\n<td>Đã đủ nền, tần suất, xuyên, uptime</td>\n<td>Thiếu mana/AS/xuyên — Amp không tự sửa được</td>\n</tr>\n</tbody></table>"
      },
      {
        "type": "concept",
        "title": "Máu, giáp và kháng phép",
        "html": "<pre><code class=\"language-text\">EHP vật lý = HP × (1 + Armor/100)\nEHP phép   = HP × (1 + MR/100)\n</code></pre>\n<table>\n<thead>\n<tr>\n<th align=\"right\">Giáp</th>\n<th align=\"right\">Giảm sát thương gần đúng</th>\n<th align=\"right\">EHP (HP gốc 2.000)</th>\n</tr>\n</thead>\n<tbody><tr>\n<td align=\"right\">0</td>\n<td align=\"right\">0%</td>\n<td align=\"right\">2.000</td>\n</tr>\n<tr>\n<td align=\"right\">50</td>\n<td align=\"right\">33,3%</td>\n<td align=\"right\">3.000</td>\n</tr>\n<tr>\n<td align=\"right\">100</td>\n<td align=\"right\">50%</td>\n<td align=\"right\">4.000</td>\n</tr>\n<tr>\n<td align=\"right\">200</td>\n<td align=\"right\">66,7%</td>\n<td align=\"right\">6.000</td>\n</tr>\n</tbody></table>\n<p>Dù % giảm sát thương có &quot;lợi suất giảm dần&quot;, EHP vẫn tăng tuyến tính theo mỗi điểm kháng trên cùng lượng máu. Vì HP và kháng nhân với nhau, nhiều máu + ít kháng → thêm kháng rất mạnh, và ngược lại; khiên/hồi máu cũng được kháng khuếch đại.</p>"
      },
      {
        "type": "concept",
        "title": "Ba mẫu phân bổ item cho carry",
        "html": "<ul>\n<li><strong>Carry đánh tay tuyến sau:</strong> 1 nguồn damage gốc + 1 nguồn tần suất/khuếch đại + 1 nguồn xuyên hoặc bảo vệ.</li>\n<li><strong>Caster tuyến sau:</strong> 1 nguồn chu kỳ kỹ năng + 1 nguồn AP/Damage Amp + 1 nguồn xuyên MR/spell crit/phòng thủ.</li>\n<li><strong>Carry cận chiến:</strong> 1 nguồn damage + 1 nguồn sống sót/hồi phục + 1 nguồn chống burst/CC hoặc scaling theo thời gian.</li>\n</ul>\n<p>Tank dùng cùng logic ba slot: nền EHP (HP nếu trait đã cho nhiều kháng, kháng nếu trait đã cho nhiều HP) → chống đúng loại damage chính của lobby → chức năng (anti-heal, CC, giảm AS, khiên, câu giờ, buff đồng minh).</p>"
      },
      {
        "type": "concept",
        "title": "Chí mạng: bốn cơ chế và giá trị kỳ vọng",
        "html": "<p>Chí mạng gồm bốn phần tách biệt: quyền được crit, tỷ lệ crit, sát thương crit, và hiệu ứng kích hoạt khi crit. 100% Crit Chance không giúp một kỹ năng crit nếu kỹ năng đó chưa có quyền spell crit (ví dụ từ Infinity Edge, Jeweled Gauntlet, augment Ability Crit hoặc trait). Loại sát thương (physical/magic) không quyết định quyền crit — câu hỏi đúng là &quot;damage instance này có tag cho phép crit không?&quot;</p>\n<p>Công thức giá trị kỳ vọng:</p>\n<pre><code class=\"language-text\">Ecrit = 1 + p × (c - 1)\np = Crit Chance (thập phân), c = hệ số Crit Damage\n</code></pre>\n<p>Ví dụ p=25%, c=140%: E = 1 + 0,25×0,4 = 1,10 — crit tăng damage trung bình khoảng 10% trong mẫu đủ lớn. Tăng Crit Chance từ 25% lên 45%: E = 1,18, tức mức tăng tương đối chỉ khoảng +7,3% (không phải +20%). Crit Chance và Crit Damage bổ trợ nhau: Crit Chance có giá trị cao hơn khi Crit Damage cao và ngược lại — thêm một vế khi vế kia còn thấp thường không đáng.</p>\n<table>\n<thead>\n<tr>\n<th align=\"right\">Crit Chance</th>\n<th align=\"right\">Hệ số damage kỳ vọng (c=140%)</th>\n<th align=\"right\">Tăng so với mốc trước</th>\n</tr>\n</thead>\n<tbody><tr>\n<td align=\"right\">25%</td>\n<td align=\"right\">1,10</td>\n<td align=\"right\">—</td>\n</tr>\n<tr>\n<td align=\"right\">45%</td>\n<td align=\"right\">1,18</td>\n<td align=\"right\">+7,3%</td>\n</tr>\n<tr>\n<td align=\"right\">65%</td>\n<td align=\"right\">1,26</td>\n<td align=\"right\">+6,8%</td>\n</tr>\n<tr>\n<td align=\"right\">85%</td>\n<td align=\"right\">1,34</td>\n<td align=\"right\">+6,4%</td>\n</tr>\n<tr>\n<td align=\"right\">100%</td>\n<td align=\"right\">1,40</td>\n<td align=\"right\">+4,5%</td>\n</tr>\n</tbody></table>\n<p>Một số hệ thống TFT chuyển Crit Chance vượt 100% thành Crit Damage theo tỷ lệ cố định (ví dụ 2:1) — luôn kiểm tra quy tắc overcap của patch hiện tại trước khi giả định.</p>\n<p>&quot;Always critically strikes if able&quot; bảo đảm kết quả crit nhưng không nhất thiết cộng Crit Chance thật vào bảng chỉ số — điều này ảnh hưởng đến overcap và mọi cơ chế đọc theo Crit Chance. Infinity Edge/Jeweled Gauntlet mở một hệ số nhân mới nếu kỹ năng chưa có spell crit; nếu đã có, phải so sánh với lựa chọn khác thay vì ghép theo quán tính.</p>"
      },
      {
        "type": "pitfalls",
        "title": "Lỗi thường gặp",
        "items": [
          "Chạy theo 100% Crit Chance mà chưa mở quyền spell crit cho damage source chính.",
          "Dồn cả ba ô đồ vào cùng một nhóm chỉ số dù nhóm đó đã gần bão hòa.",
          "Build tank chỉ theo máu hoặc chỉ theo kháng mà không cân bằng cả hai.",
          "Ghép Damage Amp cho carry còn thiếu tần suất hoặc chưa xuyên được phòng thủ.",
          "Tính breakpoint bằng tổng chỉ số thay vì bằng số lần cast/đánh thực đạt được trong thời lượng combat.",
          "Bỏ qua chi phí cơ hội: dồn chỉ số cho một carry trong khi board vẫn thiếu tankiness hoặc utility."
        ]
      },
      {
        "type": "concept",
        "title": "Bài tập",
        "html": "<h4>Bảng nhận diện loãng chỉ số</h4>\n<p>Với mỗi trận, chọn một carry và điền: nhóm chỉ số đang cao nhất, nhóm đang thấp nhất, và một món đồ cụ thể sẽ sửa đúng nhóm thấp nhất — không phải món &quot;mạnh nhất&quot; trên giấy.</p>\n<h4>Audit bảy nhóm trước khi ghép đồ lớn</h4>\n<pre><code class=\"language-text\">AD/AP nền:\nTần suất đánh/cast:\nCrit/Damage Amp:\nXuyên phòng thủ:\nSustain:\nAnti-CC/Uptime:\nFrontline:\n</code></pre>\n<p>Ghi mức thấp/trung bình/cao cho từng nhóm, sau đó ghép đúng món sửa nhóm thấp nhất — không phải nhóm đã cao sẵn.</p>"
      },
      {
        "type": "checklist",
        "title": "Checklist",
        "items": [
          "Tôi biết carry/tank đang thiếu nhóm chỉ số nào trước khi ghép đồ.",
          "Tôi kiểm tra damage chính có quyền crit trước khi build theo Crit Chance.",
          "Tôi không dồn quá hai nguồn cùng nhóm nếu nhóm đó đã gần bão hòa.",
          "Tôi tính breakpoint theo số lần cast/đánh thực tế, không theo tổng chỉ số.",
          "Tôi cân bằng HP và kháng thay vì chỉ tối đa một phía.",
          "Tôi đánh giá item theo toàn board, không chỉ theo một carry."
        ]
      }
    ]
  },
  {
    "slug": "roll-lobby-item-trait-nang-cao",
    "title": "Xác suất shop và giá trị roll nâng cao",
    "module": "Chuyên đề nâng cao",
    "shortTitle": "Xác suất shop và giá trị roll nâng cao",
    "summary": "Tính giá trị kỳ vọng của một lần roll thay vì chỉ nhìn tỷ lệ ra tướng.",
    "skill": "Chuyên đề",
    "duration": "~20 phút",
    "exercise": "Ghi lại 5 lần rolldown gần nhất: liệt kê outs theo ba cấp độ, ước lượng T_i, và so kết quả thực tế với dự đoán.",
    "commonMistake": "Chỉ đếm hit trực tiếp, bỏ qua hit thay thế và hit tùy chọn khi ước lượng EV.",
    "applyQuestions": [
      "Tôi đã liệt kê outs theo ba cấp độ, không chỉ một tướng mục tiêu.",
      "Tôi có ước lượng T_i — còn bao nhiêu round để dùng nâng cấp này.",
      "Tôi biết survival horizon hiện tại và có điều chỉnh mức độ mạo hiểm theo đó."
    ],
    "related": [
      {
        "label": "Level, roll, outs và breakpoint",
        "href": "/kien-thuc-nen-tang"
      },
      {
        "label": "Xác suất shop, pool và variance",
        "href": "/kien-thuc-nen-tang"
      },
      {
        "label": "Scouting, contest và lobby ecology",
        "href": "/kien-thuc-nen-tang"
      },
      {
        "label": "Lobby ecology nâng cao",
        "href": "/kien-thuc-nen-tang"
      },
      {
        "label": "Giá trị trang bị theo thời gian và trait breakpoint nâng cao",
        "href": "/kien-thuc-nen-tang"
      }
    ],
    "blocks": [
      {
        "type": "principles",
        "title": "Mục tiêu",
        "items": [
          "Tính giá trị kỳ vọng của một lần roll thay vì chỉ nhìn tỷ lệ ra tướng.",
          "Phân biệt ba cấp độ hit để không bỏ sót option value.",
          "Định lượng khi nào nên giữ một cặp tướng thay vì giữ kinh tế.",
          "Dùng survival horizon và thang contest để quyết định mức độ mạo hiểm khi roll."
        ]
      },
      {
        "type": "concept",
        "title": "Outs và ngưỡng dừng — đã có ở bài nền",
        "html": "<p>Khái niệm outs A/B/C, breakpoint, ngưỡng dừng và pool/contest cơ bản đã trình bày đầy đủ ở hai bài:</p>\n<ul>\n<li>Xem thêm: <a href=\"../02-van-hanh-kinh-te/03-level-roll-outs-va-breakpoint.md\">Level, roll, outs và breakpoint</a></li>\n<li>Xem thêm: <a href=\"../05-du-lieu-va-thich-nghi/03-xac-suat-shop-pool-va-variance.md\">Xác suất shop, pool và variance</a></li>\n</ul>\n<p>Phần còn lại của bài này giả định đã nắm được hai bài trên.</p>"
      },
      {
        "type": "concept",
        "title": "Ba cấp độ hit",
        "html": "<p>Không phải kết quả shop nào cũng có giá trị như nhau, kể cả khi đều được tính là &quot;out&quot;.</p>\n<h4>Hit trực tiếp</h4>\n<p>Hoàn thiện đúng unit mục tiêu: carry hai sao, tank hai sao, unit kích mốc quan trọng.</p>\n<h4>Hit thay thế</h4>\n<p>Không phải mục tiêu lý tưởng nhưng đủ dùng: carry khác hợp trang bị, tank khác cùng vai trò, legendary utility thay cho trait còn thiếu.</p>\n<h4>Hit tùy chọn</h4>\n<p>Chưa tăng sức mạnh ngay nhưng mở thêm hướng: giữ một cặp, mua một unit chờ thêm bản, giữ carry dự phòng trong lúc chưa commit.</p>\n<blockquote>\n<p>Một lần roll tốt không nhất thiết phải ra đúng tướng. Nó có thể chỉ tăng option value — giá trị của việc còn nhiều lựa chọn.</p>\n</blockquote>"
      },
      {
        "type": "concept",
        "title": "Giá trị kỳ vọng của một lần roll",
        "html": "<pre><code class=\"language-text\">EV_roll\n= Σ (P_i × ΔBoard_i × T_i)\n+ V_option\n- C_gold\n- C_future\n</code></pre>\n<ul>\n<li><code>P_i</code>: xác suất xuất hiện kết quả hữu ích i.</li>\n<li><code>ΔBoard_i</code>: sức mạnh board tăng thêm nếu hit.</li>\n<li><code>T_i</code>: số round còn lại để tận dụng sức mạnh đó.</li>\n<li><code>V_option</code>: giá trị từ việc mở thêm hướng chơi (hit tùy chọn).</li>\n<li><code>C_gold</code>: vàng tiêu ngay lập tức.</li>\n<li><code>C_future</code>: kinh tế/level tương lai bị mất.</li>\n</ul>\n<p>Biến hay bị bỏ qua nhất là <code>T_i</code>. Cùng một nâng cấp board, hit ở Stage 3 tạo giá trị trong mười round; hit cùng thứ đó ở round cuối chỉ dùng được một round. Vì vậy hai lần roll cho &quot;cùng một out&quot; không có cùng giá trị nếu thời điểm khác nhau.</p>"
      },
      {
        "type": "concept",
        "title": "Survival horizon quyết định mức độ mạo hiểm",
        "html": "<p>Survival horizon là số round thua bạn chịu được trước khi bị loại — nó quyết định giá trị tương lai của vàng đáng bao nhiêu ngay bây giờ.</p>\n<ul>\n<li><strong>Máu cao, thua nhẹ:</strong> còn nhiều nhịp thử, có thể roll rải, chờ level tốt hơn.</li>\n<li><strong>Máu trung bình (thua 10–15/round):</strong> chỉ còn vài lần thử, phải chấp nhận hit thay thế thay vì chờ hit trực tiếp.</li>\n<li><strong>Máu thấp (thua một round là chết):</strong> giá trị vàng tương lai gần như bằng 0. Không giữ 30–50 vàng &quot;cho đẹp kinh tế&quot;, không bỏ qua nâng cấp nhỏ, không chờ đúng BIS.</li>\n</ul>\n<pre><code class=\"language-text\">Máu thấp → V_gold_future ≈ 0 → mọi vàng không hoá sức mạnh ngay là vàng chết\n</code></pre>"
      },
      {
        "type": "concept",
        "title": "Giữ cặp tướng hay giữ kinh tế",
        "html": "<p>Giữ một cặp tốn vàng và chiếm bench, nhưng tăng khả năng shop tiếp theo tạo nâng cấp:</p>\n<pre><code class=\"language-text\">V_pair = P_complete × ΔBoard - C_econ - C_bench\n</code></pre>\n<p><strong>Nên giữ</strong> khi: hoàn thiện hai sao tạo nâng cấp lớn, sắp rolldown, unit dùng được ở nhiều nhánh, bench còn chỗ.</p>\n<p><strong>Nên bán</strong> khi: unit không còn vào board, chỉ hoàn thiện nâng cấp rất nhỏ, giữ cặp phá liên tiếp mốc lãi, bench nghẽn làm mất lựa chọn tốt hơn.</p>\n<blockquote>\n<p>Một cặp tướng không chỉ là vài vàng bị giữ lại — nó là một quyền chọn mua sức mạnh trong shop tương lai, và quyền chọn đó có giá.</p>\n</blockquote>"
      },
      {
        "type": "concept",
        "title": "Contest áp dụng vào quyết định roll",
        "html": "<p>Thang mức độ contest (nhẹ/chức năng/trực tiếp/nguy hiểm) đã trình bày ở bài scouting — xem <a href=\"../04-doc-lobby-va-giao-tranh/01-scouting-contest-va-lobby-ecology.md\">Scouting, contest và lobby ecology</a>. Khi áp vào quyết định roll, câu hỏi thêm là: người contest có thực sự commit và còn đủ vàng để roll tiếp không, và nếu họ chết, phần pool được trả lại có kịp giúp bạn trong survival horizon của chính mình hay không. Không bỏ line chỉ vì thấy một người giữ một bản; cũng không tiếp tục line chỉ vì carry của bạn &quot;chưa bị hai sao&quot;.</p>"
      },
      {
        "type": "pitfalls",
        "title": "Lỗi thường gặp",
        "items": [
          "Chỉ đếm hit trực tiếp, bỏ qua hit thay thế và hit tùy chọn khi ước lượng EV.",
          "Coi mọi lần hit có giá trị như nhau bất kể còn bao nhiêu round để dùng.",
          "Giữ cặp đến hết trận vì \"sắp hoàn thiện\" dù đã phá nhiều mốc lãi.",
          "Giữ vàng ở mức máu thấp vì thói quen quản lý kinh tế, quên rằng vàng tương lai gần như vô giá trị lúc đó.",
          "Roll tiếp hoặc dừng roll chỉ theo cảm giác \"đến lượt\", không theo outs còn lại."
        ]
      },
      {
        "type": "concept",
        "title": "Bài tập",
        "html": "<h4>Tính EV cho một tình huống thật</h4>\n<p>Ghi lại 5 lần rolldown gần nhất: liệt kê outs theo ba cấp độ, ước lượng T_i, và so kết quả thực tế với dự đoán.</p>\n<h4>Kiểm tra quyết định giữ cặp</h4>\n<p>Với ba cặp tướng gần đây bạn từng giữ, viết lại V_pair ước lượng lúc đó và đối chiếu với kết quả cuối trận — cặp nào đáng giữ, cặp nào lẽ ra nên bán sớm hơn.</p>"
      },
      {
        "type": "checklist",
        "title": "Checklist",
        "items": [
          "Tôi đã liệt kê outs theo ba cấp độ, không chỉ một tướng mục tiêu.",
          "Tôi có ước lượng T_i — còn bao nhiêu round để dùng nâng cấp này.",
          "Tôi biết survival horizon hiện tại và có điều chỉnh mức độ mạo hiểm theo đó.",
          "Quyết định giữ/bán cặp dựa trên V_pair, không theo thói quen.",
          "Tôi đã kiểm tra người contest có thực sự commit trước khi đổi quyết định."
        ]
      }
    ]
  },
  {
    "slug": "unknown-unknowns-va-kiem-chung-tft",
    "title": "Unknown unknowns và kiểm chứng cơ chế TFT",
    "module": "Chuyên đề nâng cao",
    "shortTitle": "Unknown unknowns và kiểm chứng cơ chế TFT",
    "summary": "Nhận diện khi tooltip/data không đủ để kết luận.",
    "skill": "Chuyên đề",
    "duration": "~20 phút",
    "exercise": "```text",
    "commonMistake": "Tin tooltip giải thích toàn bộ timing.",
    "applyQuestions": [
      "Claim có thể bị chứng minh sai.",
      "Đã gắn patch/Set.",
      "Có đối chứng hoặc nhiều mẫu."
    ],
    "related": [
      {
        "label": "Mana, chu kỳ cast và animation",
        "href": "/kien-thuc-nen-tang"
      },
      {
        "label": "Chỉ số, item, tộc hệ, crit và blind spots",
        "href": "/kien-thuc-nen-tang"
      },
      {
        "label": "Đọc dữ liệu không bị đánh lừa",
        "href": "/kien-thuc-nen-tang"
      }
    ],
    "blocks": [
      {
        "type": "principles",
        "title": "Mục tiêu",
        "items": [
          "Nhận diện khi tooltip/data không đủ để kết luận.",
          "Thiết kế phép kiểm tra đơn giản cho interaction.",
          "Tránh biến chi tiết patch-specific thành luật evergreen."
        ]
      },
      {
        "type": "concept",
        "title": "Bốn vùng hiểu biết",
        "html": "<ul>\n<li><strong>Known known:</strong> biết cơ chế và đã kiểm chứng.</li>\n<li><strong>Known unknown:</strong> biết mình thiếu dữ kiện.</li>\n<li><strong>Unknown known:</strong> từng thấy pattern nhưng chưa diễn đạt được.</li>\n<li><strong>Unknown unknown:</strong> không biết có biến ẩn đang tác động.</li>\n</ul>\n<p>Giáo trình nền tảng giúp hỏi đúng; kiểm chứng giúp tránh tự tin sai.</p>"
      },
      {
        "type": "concept",
        "title": "Các biến ẩn thường gặp",
        "html": "<ul>\n<li>damage có nhiều packet/source;</li>\n<li>snapshot hay dynamic scaling;</li>\n<li>mana lock/action queue;</li>\n<li>projectile travel/cast animation;</li>\n<li>target/pathing thay đổi;</li>\n<li>item/trait có uptime không hoàn hảo;</li>\n<li>effect trùng lặp hoặc không stack;</li>\n<li>breakpoint quan trọng hơn DPS trung bình;</li>\n<li>data bị selection bias;</li>\n<li>patch-memory trap.</li>\n</ul>"
      },
      {
        "type": "concept",
        "title": "Thứ tự nguồn",
        "html": "<ol>\n<li>Patch notes/tooltip chính thức.</li>\n<li>Tài liệu hệ thống Riot nếu có.</li>\n<li>Quan sát combat có timestamp.</li>\n<li>Thử nghiệm có đối chứng.</li>\n<li>Data mẫu lớn phù hợp patch.</li>\n<li>Guide/community claim để tạo giả thuyết.</li>\n</ol>"
      },
      {
        "type": "concept",
        "title": "Quy trình kiểm chứng",
        "html": "<h4>1. Viết claim falsifiable</h4>\n<p>Sai: “item này mạnh”.</p>\n<p>Tốt: “item này giúp unit đạt cast thứ hai trước khi frontline chết trong cùng điều kiện”.</p>\n<h4>2. Cố định biến</h4>\n<p>Giữ star level, item còn lại, đối thủ, positioning và augment càng giống càng tốt.</p>\n<h4>3. Chọn chỉ số quan sát</h4>\n<ul>\n<li>thời điểm cast/impact;</li>\n<li>target;</li>\n<li>damage packet;</li>\n<li>thời gian sống;</li>\n<li>số cast;</li>\n<li>shield/heal/CC uptime.</li>\n</ul>\n<h4>4. Lặp và ghi sai lệch</h4>\n<p>Một combat có variance. Lặp nhiều lần hoặc dùng VOD tương đương.</p>\n<h4>5. Gắn phiên bản</h4>\n<p>Mọi kết luận cơ chế phải có Set/patch/ngày kiểm tra.</p>"
      },
      {
        "type": "concept",
        "title": "Khi không thể kiểm chứng",
        "html": "<ul>\n<li>Ghi rõ mức tin cậy.</li>\n<li>Không dùng số chính xác.</li>\n<li>Giữ claim dưới dạng câu hỏi.</li>\n<li>Tránh đưa vào bài foundation như luật.</li>\n<li>Đặt trong source map/claim ledger để kiểm tra sau.</li>\n</ul>"
      },
      {
        "type": "pitfalls",
        "title": "Lỗi thường gặp",
        "items": [
          "Tin tooltip giải thích toàn bộ timing.",
          "Dùng một clip làm bằng chứng chắc chắn.",
          "Không kiểm soát positioning/target.",
          "Quên interaction có thể đã đổi patch.",
          "Data đẹp được coi là cơ chế nhân quả.",
          "Dùng tên item/unit cũ mà không gắn phiên bản."
        ]
      },
      {
        "type": "concept",
        "title": "Bài tập",
        "html": "<h4>Lab một interaction</h4>\n<pre><code class=\"language-text\">Claim:\nPatch/Set:\nBiến giữ cố định:\nBiến thay đổi:\nKết quả đo:\nSố lần thử:\nKết luận:\nMức tin cậy:\nĐiều chưa biết:\n</code></pre>\n<h4>Review combat frame-by-frame</h4>\n<p>Theo dõi mana đầy, cast start, impact, mana lock, target đổi và death. Gắn nhãn nguyên nhân thay vì chỉ nói “cast chậm”.</p>"
      },
      {
        "type": "checklist",
        "title": "Checklist",
        "items": [
          "Claim có thể bị chứng minh sai.",
          "Đã gắn patch/Set.",
          "Có đối chứng hoặc nhiều mẫu.",
          "Đã tách timing, targeting và stats.",
          "Mức tin cậy được ghi rõ.",
          "Không nâng ví dụ thành luật evergreen."
        ]
      }
    ]
  },
  {
    "slug": "item-index-nang-cao-va-blind-spots",
    "title": "Item index nâng cao và blind spots",
    "module": "Chuyên đề nâng cao",
    "shortTitle": "Item index nâng cao và blind spots",
    "summary": "Đọc đúng trait/augment/mod đang cấp miễn phí nhóm chỉ số nào, để chọn item bù đúng nhóm còn thiếu thay vì lặp lại nhóm đã dư.",
    "skill": "Chuyên đề",
    "duration": "~25 phút",
    "exercise": "Với Set đang chơi, liệt kê 3-4 tộc hệ carry hay dùng nhất.",
    "commonMistake": "Coi \"Abilities can critically strike\" là lý do đủ để ghép Jeweled Gauntlet mà chưa biết tỷ trọng damage đến từ đâu.",
    "applyQuestions": [
      "Tôi biết trait/augment/mod đang cấp miễn phí nhóm chỉ số nào cho carry.",
      "Tôi không ghép item lặp lại nhóm chỉ số trait đã cấp đủ.",
      "Tôi kiểm tra damage instance có tag cho phép crit trước khi build theo crit."
    ],
    "related": [
      {
        "label": "Chỉ số tướng, trang bị và chí mạng: nguyên lý cân bằng",
        "href": "/kien-thuc-nen-tang"
      },
      {
        "label": "Unknown unknowns và kiểm chứng cơ chế TFT",
        "href": "/kien-thuc-nen-tang"
      },
      {
        "label": "Trang bị và phân bổ chỉ số",
        "href": "/kien-thuc-nen-tang"
      }
    ],
    "blocks": [
      {
        "type": "principles",
        "title": "Mục tiêu",
        "items": [
          "Đọc đúng trait/augment/mod đang cấp miễn phí nhóm chỉ số nào, để chọn item bù đúng nhóm còn thiếu thay vì lặp lại nhóm đã dư.",
          "Nắm các tương tác chí mạng nâng cao: tạo tài nguyên, kích hoạt Damage Amp, xuyên phòng thủ, overkill và variance.",
          "Nhận diện các blind spot đặc thù khi đọc chỉ số/item — nơi tooltip và dữ liệu dễ đánh lừa nhất."
        ]
      },
      {
        "type": "concept",
        "title": "Nguyên lý đọc index tộc hệ/trait",
        "html": "<pre><code class=\"language-text\">Trait/augment/mod đã cấp rất nhiều nhóm A (máu, AS, xuyên, execute...)\n→ item nên bổ sung nhóm B đang thiếu\n→ không lặp lại nhóm đã dư\n</code></pre>\n<p>Trước khi ghép item, luôn hỏi: tướng này đã nhận miễn phí bao nhiêu từ trait, augment và cơ chế mùa? Utility toàn đội (giảm Giáp/MR, buff AS...) chỉ tính là &quot;đã có&quot; nếu kiểm tra được ba điều: có kích hoạt đủ sớm, có phủ đúng mục tiêu, và unit cấp utility có sống đủ lâu không.</p>\n<blockquote class=\"case-study\">\n<p><strong>Case study — Set 17:</strong> ví dụ minh họa cách áp dụng nguyên lý trên qua các tộc hệ Set 17 (Mecha, Brawler, Challenger, N.O.V.A., Psionic, Stargazer, Dark Star).\nPhần có thể tái sử dụng: nguyên tắc &quot;trait/mod đã cấp nhiều nhóm A → item nên bổ sung nhóm B&quot;, và yêu cầu luôn kiểm tra uptime trước khi coi một utility là &quot;đã có&quot;.\nPhần phải kiểm tra lại: tên tộc hệ, cơ chế mod cụ thể và mọi số liệu — đã có thể lỗi thời qua các Set sau.</p>\n</blockquote>\n<table>\n<thead>\n<tr>\n<th>Tộc hệ Set 17</th>\n<th>Đã cấp miễn phí</th>\n<th>Item nên ưu tiên</th>\n</tr>\n</thead>\n<tbody><tr>\n<td>Mecha</td>\n<td>Lượng lớn máu</td>\n<td>Giáp/MR/Durability thay vì tiếp tục dồn máu</td>\n</tr>\n<tr>\n<td>Brawler</td>\n<td>Nhiều HP</td>\n<td>Kháng, Durability, khiên, hồi phục thay vì máu thuần</td>\n</tr>\n<tr>\n<td>Challenger</td>\n<td>Nhiều tốc độ đánh</td>\n<td>AD/AP nền, crit, Damage Amp, xuyên, bảo vệ uptime</td>\n</tr>\n<tr>\n<td>N.O.V.A.</td>\n<td>Giảm Giáp/MR hoặc buff AS toàn đội</td>\n<td>Giảm nhu cầu tự mang chức năng đó — nếu utility đủ uptime</td>\n</tr>\n<tr>\n<td>Psionic</td>\n<td>Mod thay đổi theo hiệu ứng (AS+Omnivamp, Mana Regen, Damage Amp, Shred/Sunder)</td>\n<td>BIS đổi theo đúng hiệu ứng mod đang cấp</td>\n</tr>\n<tr>\n<td>Stargazer</td>\n<td>Cơ chế mùa cấp AS/AD/AP/Durability miễn phí</td>\n<td>Giảm nhu cầu item cùng nhóm; greed damage nếu Durability đã đủ</td>\n</tr>\n<tr>\n<td>Dark Star</td>\n<td>Execute ở ngưỡng máu thấp</td>\n<td>Ưu tiên đưa mục tiêu xuống ngưỡng execute, xuyên phòng thủ, AoE, uptime</td>\n</tr>\n</tbody></table>"
      },
      {
        "type": "concept",
        "title": "Chí mạng nâng cao: tương tác ít ai để ý",
        "html": "<h4>Crit có thể tạo tài nguyên</h4>\n<p>Nếu item cho thêm mana khi crit (ví dụ đòn thường 2 mana, đòn crit 4 mana):</p>\n<pre><code class=\"language-text\">Mana kỳ vọng mỗi đòn = (1 - p) × 2 + p × 4 = 2 + 2p\n</code></pre>\n<p>Với p=25%: 2,5 mana/đòn. Với p=45%: 2,9 mana/đòn — crit lúc này tăng cả damage lẫn tốc độ cast.</p>\n<h4>Crit có thể kích hoạt Damage Amp theo stack</h4>\n<p>Nếu item cần <code>k</code> lần crit để đạt full stack, tướng tạo <code>r</code> packet/giây với Crit Chance <code>p</code>:</p>\n<pre><code class=\"language-text\">Thời gian kỳ vọng đạt đủ stack ≈ k / (r × p)\n</code></pre>\n<p>Ví dụ cần 4 crit, 2 packet/giây: khoảng 8 giây ở p=25%, khoảng 4,4 giây ở p=45%. Trong combat ngắn, khác biệt về thời gian đạt stack có thể quan trọng hơn mức tăng damage trung bình.</p>\n<h4>Crit và xuyên phòng thủ</h4>\n<p>Crit khuếch đại damage nhưng không giúp carry vượt Giáp/MR cao. Nếu đã có nhiều Crit Chance mà chưa có xuyên phòng thủ, một món Sunder/Shred/Penetration có thể mạnh hơn thêm crit — miễn là utility đó kích hoạt đủ sớm và phủ đúng mục tiêu.</p>\n<h4>Overkill</h4>\n<p>Đòn crit 168 damage vào mục tiêu còn 100 HP vẫn chỉ giết một lần — 68 damage dư là overkill. Đặc biệt đáng chú ý với kỹ năng một hit lớn, execute trait, kỹ năng nhắm mục tiêu thấp máu, hoặc đội hình đã có công cụ xử lý phần máu cuối.</p>\n<h4>Variance: một hit lớn so với nhiều hit nhỏ</h4>\n<p>Nếu mỗi packet roll crit độc lập:</p>\n<pre><code class=\"language-text\">P(có ít nhất một crit trong n packet) = 1 - (1 - p)^n\n</code></pre>\n<p>Với p=25%: 1 packet → 25%; 4 packet → 68,4%; 8 packet → 90,0%; 12 packet → 96,8%. Kỹ năng một-hit-lớn có variance cao (có thể one-shot hoặc trắng tay); kỹ năng nhiều-hit hội tụ gần giá trị kỳ vọng hơn, phù hợp mục tiêu giữ top 4 ổn định. Không được suy số packet chỉ từ animation — phải biết cách kỹ năng thực sự được triển khai.</p>"
      },
      {
        "type": "concept",
        "title": "Blind spots khi đọc chỉ số và item",
        "html": "<p>Đây là các điểm mù cụ thể cho itemization/crit; xem <a href=\"03-unknown-unknowns-va-kiem-chung.md\">Unknown unknowns và kiểm chứng cơ chế TFT</a> để có khung tổng quát và quy trình kiểm chứng.</p>\n<ul>\n<li><strong>Damage source có tag riêng:</strong> không phải mọi damage đều crit được, nhận Damage Amp, kích Omnivamp hoặc tính là &quot;cast&quot; theo cùng quy tắc. Luôn hỏi: phần damage nào trong tooltip thực sự hưởng item đang ghép?</li>\n<li><strong>Một kỹ năng có nhiều packet:</strong> hit chính + hit phụ, damage ban đầu + DoT, physical + magic component — mỗi loại có thể roll crit khác nhau.</li>\n<li><strong>Snapshot và dynamic scaling:</strong> buff có thể được đọc lúc combat bắt đầu, lúc cast, lúc tạo projectile, hoặc liên tục — ảnh hưởng trực tiếp đến giá trị của item buff theo thời gian.</li>\n<li><strong>Star level thay đổi giá trị item AD:</strong> %AD nhân trên Base AD, nên tướng sao cao hoặc Base AD lớn khai thác item AD tốt hơn — hỏi item đang nhân trên nền lớn hay nhỏ.</li>\n<li><strong>Dữ liệu item có selection bias:</strong> average placement cao có thể chỉ vì item được ghép lúc high-roll, đi cùng carry 2 sao, hoặc trong line tốt — dữ liệu mô tả điều đã xảy ra, không tự trả lời có nên ghép trong trận hiện tại hay không.</li>\n<li><strong>Patch-memory trap:</strong> spell crit, crit overcap, cách IE/JG hoạt động và cách scale AD thường đổi giữa các patch — nhớ cơ chế cũ và tưởng vẫn đúng là rủi ro lớn nhất.</li>\n<li><strong>Breakpoint quan trọng hơn DPS trung bình:</strong> câu hỏi đúng là &quot;có giết tank trước cast thứ hai không, có full stack trước khi frontline chết không, có tránh được một đòn quyết định không&quot; — không phải &quot;DPS trung bình cao hơn bao nhiêu&quot;.</li>\n</ul>"
      },
      {
        "type": "pitfalls",
        "title": "Lỗi thường gặp",
        "items": [
          "Coi \"Abilities can critically strike\" là lý do đủ để ghép Jeweled Gauntlet mà chưa biết tỷ trọng damage đến từ đâu.",
          "Copy Set trước sang Set hiện tại: tưởng một tộc hệ vẫn cấp free-stat như cũ mà không đọc lại tooltip mùa mới.",
          "Ước lượng số packet chỉ từ animation thay vì kiểm tra cách kỹ năng thực sự triển khai.",
          "Dùng average placement của item làm hướng dẫn nhân quả mà không lọc theo patch, rank và điều kiện ghép.",
          "Bỏ qua overkill khi build damage cho kỹ năng execute hoặc one-shot.",
          "Quên rằng utility toàn đội (Sunder/Shred/buff AS) có uptime không hoàn hảo, không phải hằng số \"đã có\"."
        ]
      },
      {
        "type": "concept",
        "title": "Bài tập",
        "html": "<h4>Audit index tộc hệ hiện tại</h4>\n<p>Với Set đang chơi, liệt kê 3-4 tộc hệ carry hay dùng nhất. Với mỗi tộc hệ, ghi: trait cấp miễn phí nhóm chỉ số nào, và item nào nên tránh vì trùng nhóm đó.</p>\n<h4>Lab một tương tác crit</h4>\n<pre><code class=\"language-text\">Claim:\nPatch/Set:\nTướng và item liên quan:\nDamage instance nào đang được đo:\nSố lần thử/quan sát:\nKết quả:\nOverkill có xảy ra không:\nKết luận:\n</code></pre>"
      },
      {
        "type": "checklist",
        "title": "Checklist",
        "items": [
          "Tôi biết trait/augment/mod đang cấp miễn phí nhóm chỉ số nào cho carry.",
          "Tôi không ghép item lặp lại nhóm chỉ số trait đã cấp đủ.",
          "Tôi kiểm tra damage instance có tag cho phép crit trước khi build theo crit.",
          "Tôi tính thời gian đạt breakpoint/full stack, không chỉ DPS trung bình.",
          "Tôi cân nhắc overkill trước khi dồn thêm damage cho kỹ năng execute/one-shot.",
          "Tôi gắn Set/patch cho mọi ví dụ tộc hệ hoặc số liệu cụ thể."
        ]
      }
    ]
  },
  {
    "slug": "lobby-ecology-nang-cao",
    "title": "Lobby ecology nâng cao",
    "module": "Chuyên đề nâng cao",
    "shortTitle": "Lobby ecology nâng cao",
    "summary": "Đọc lobby theo bốn archetype tempo và hệ quả cụ thể của từng loại.",
    "skill": "Chuyên đề",
    "duration": "~15 phút",
    "exercise": "Ở ba trận gần nhất, ghi lại archetype lobby chi phối tại Stage 3 và Stage 4, và đối chiếu với quyết định roll/level bạn đã đưa ra lúc đó — có khớp với hệ quả archetype không.",
    "commonMistake": "Chỉ xếp lobby vào \"nhanh\" hoặc \"chậm\" mà không xác định archetype cụ thể đang chi phối.",
    "applyQuestions": [
      "Tôi đã xác định lobby đang thuộc archetype nào và hệ quả kèm theo.",
      "Tôi đã tính lobby tax thay vì chỉ dựa vào tier list.",
      "Tôi cân nhắc chủ động ép tempo khi board đủ mạnh, không chỉ phòng thủ."
    ],
    "related": [
      {
        "label": "Scouting, contest và lobby ecology",
        "href": "/kien-thuc-nen-tang"
      },
      {
        "label": "Kinh tế, máu, chuỗi và tempo",
        "href": "/kien-thuc-nen-tang"
      },
      {
        "label": "Xác suất shop và giá trị roll nâng cao",
        "href": "/kien-thuc-nen-tang"
      }
    ],
    "blocks": [
      {
        "type": "principles",
        "title": "Mục tiêu",
        "items": [
          "Đọc lobby theo bốn archetype tempo và hệ quả cụ thể của từng loại.",
          "Định lượng lobby tax bằng công thức thay vì chỉ cảm tính \"line này bị tranh\".",
          "Biết khi nào nên chủ động ép tempo thay vì chỉ phản ứng bị động với lobby.",
          "Cân nhắc đánh đổi giữa chờ đối thủ bị loại để pool mở ra và mất máu trong lúc chờ."
        ]
      },
      {
        "type": "concept",
        "title": "Bốn archetype tempo của lobby",
        "html": "<h4>Lobby reroll</h4>\n<p>Nhiều người giữ level thấp và roll unit giá thấp. Hệ quả: một số board mạnh sớm, máu tụt nhanh ở Stage 3–4, người fast 8 chịu áp lực lớn hơn bình thường, carry ba sao có thể quyết định combat.</p>\n<h4>Lobby fast 8</h4>\n<p>Nhiều người giữ tiền và lên level nhanh. Hệ quả: early game nhẹ hơn, Stage 4 rolldown rất cạnh tranh, carry/tank bốn vàng bị lấy nhanh, ai lên level trước có lợi thế pool.</p>\n<h4>Lobby tempo cao</h4>\n<p>Nhiều người slam item, lên cấp và giữ chuỗi liên tục. Hệ quả: không thể greed lâu, board yếu mất máu nhanh, cần đánh giá lại strongest board thường xuyên hơn bình thường.</p>\n<h4>Lobby tempo thấp</h4>\n<p>Nhiều người giữ đồ và kinh tế, không vội slam. Hệ quả: có thể tham lam hơn một chút, nhưng người duy nhất chủ động đánh tempo có thể giữ win streak rất dài vì ít ai cản.</p>"
      },
      {
        "type": "concept",
        "title": "Ép tempo chủ động, không chỉ phản ứng bị động",
        "html": "<p>Phần lớn mô tả về lobby tempo cao chỉ nói theo hướng bị động: &quot;lobby tempo cao thì không thể greed lâu&quot;. Nhưng tempo cao còn có một công dụng chủ động: ép đối thủ đang thua chuỗi phải tiêu vàng sớm hơn kế hoạch của họ.</p>\n<p>Khi bạn chủ động đẩy tempo — lên cấp sớm, slam item, giữ áp lực chuỗi — người đang thua không chỉ mất máu. Họ còn bị buộc phải roll hoặc lên level sớm hơn mức họ muốn để tránh chết ngay, làm giảm khả năng họ tích lũy đủ vàng cho một bàn cuối trận mạnh. Đây là một dạng tấn công kinh tế gián tiếp: bạn không lấy vàng của họ, nhưng buộc họ tiêu vàng ở thời điểm bất lợi hơn.</p>\n<blockquote>\n<p>Ép tempo không chỉ để mình mạnh lên. Nó còn làm nghèo tương lai của người đang thua chuỗi, bằng cách buộc họ tiêu tài nguyên sớm hơn dự định.</p>\n</blockquote>\n<p>Điều này có nghĩa: khi bạn đang giữ board đủ mạnh so với lobby, tiếp tục đẩy tempo (thay vì chuyển sang giữ đồ chờ hoàn thiện BIS) có thể mang lại lợi ích kép — sức mạnh hiện tại cho bạn, và một lobby yếu hơn ở các round sau vì đối thủ bị ép tiêu sớm.</p>"
      },
      {
        "type": "concept",
        "title": "Lobby tax — định lượng chi phí chơi một line phổ biến",
        "html": "<pre><code class=\"language-text\">V_line\n= V_base\n- C_contest\n- C_timing\n- C_item_mismatch\n- C_HP\n</code></pre>\n<p><code>V_base</code> là sức mạnh line theo tier list/dữ liệu chung. Bốn khoản trừ phản ánh: bạn bị tranh đến đâu, bạn vào line muộn hay sớm so với người khác, item hiện có khớp line này đến đâu, và bạn đang mất bao nhiêu máu để theo đuổi nó.</p>\n<p>Một line tier A không bị tranh có thể tốt hơn một line tier S đang chịu thuế lobby quá cao — hai người đã commit, cả ba cùng cần một tank, item của bạn chỉ khớp trung bình, bạn vào line muộn hơn và máu đang thấp hơn nhóm kia.</p>"
      },
      {
        "type": "concept",
        "title": "Chờ đối thủ bị loại hay hành động ngay?",
        "html": "<p>Một đối thủ đang giữ nhiều bản carry/tank bạn cần nhưng chỉ còn ít máu và sắp gặp board mạnh. Nếu họ chết, tướng họ giữ được trả lại pool và xác suất hit của bạn tăng lên.</p>\n<p>Nhưng chờ cũng có chi phí: bạn có thể mất thêm máu trong lúc chờ, người khác có thể mua các bản vừa được trả trước bạn, và bạn có thể không còn đủ round để tận dụng kết quả dù có hit.</p>\n<pre><code class=\"language-text\">So sánh: V_wait_for_release  và  C_HP_loss trong lúc chờ\n</code></pre>\n<p>Không có đáp án cố định — phải đối chiếu với survival horizon của chính bạn, không chỉ với khả năng đối thủ chết.</p>"
      },
      {
        "type": "concept",
        "title": "Đọc sức mạnh tương đối, không tuyệt đối",
        "html": "<p>Board của bạn không cần hoàn hảo, chỉ cần đủ mạnh so với lobby hiện tại. Trong lobby yếu, một carry một sao với frontline hai sao có thể đủ giữ chuỗi. Cùng board đó trong lobby mạnh có thể thua 15 máu mỗi round.</p>\n<p>Câu hỏi đúng không phải &quot;board này có mạnh không&quot;, mà là &quot;board này đứng thứ mấy trong lobby hiện tại, và thua bao nhiêu máu trước các nhóm đối thủ mạnh nhất&quot;. Vì vậy cùng một board có thể greed được ở lobby này nhưng buộc phải roll ở lobby khác.</p>"
      },
      {
        "type": "pitfalls",
        "title": "Lỗi thường gặp",
        "items": [
          "Chỉ xếp lobby vào \"nhanh\" hoặc \"chậm\" mà không xác định archetype cụ thể đang chi phối.",
          "Đánh giá line theo tier list mà bỏ qua lobby tax thực tế đang phải trả.",
          "Luôn coi tempo cao là phản ứng phòng thủ, bỏ qua giá trị chủ động của việc ép đối thủ tiêu vàng sớm.",
          "Chờ đối thủ chết mà không kiểm tra survival horizon của chính mình có đủ không.",
          "Đánh giá sức mạnh board theo con số tuyệt đối thay vì so với lobby đang chơi."
        ]
      },
      {
        "type": "concept",
        "title": "Bài tập",
        "html": "<h4>Phân loại archetype</h4>\n<p>Ở ba trận gần nhất, ghi lại archetype lobby chi phối tại Stage 3 và Stage 4, và đối chiếu với quyết định roll/level bạn đã đưa ra lúc đó — có khớp với hệ quả archetype không.</p>\n<h4>Tính lobby tax cho một line đã chơi</h4>\n<p>Chọn một line từng chơi, ước lượng V_base theo tier list, rồi trừ lần lượt C_contest, C_timing, C_item_mismatch, C_HP để ra V_line thực tế. So sánh với cảm nhận ban đầu.</p>"
      },
      {
        "type": "checklist",
        "title": "Checklist",
        "items": [
          "Tôi đã xác định lobby đang thuộc archetype nào và hệ quả kèm theo.",
          "Tôi đã tính lobby tax thay vì chỉ dựa vào tier list.",
          "Tôi cân nhắc chủ động ép tempo khi board đủ mạnh, không chỉ phòng thủ.",
          "Quyết định chờ hay hành động ngay dựa trên survival horizon của tôi, không chỉ khả năng đối thủ chết.",
          "Tôi đánh giá sức mạnh board theo tương quan với lobby, không theo con số tuyệt đối."
        ]
      }
    ]
  },
  {
    "slug": "item-value-va-trait-breakpoint-nang-cao",
    "title": "Giá trị trang bị theo thời gian và trait breakpoint nâng cao",
    "module": "Chuyên đề nâng cao",
    "shortTitle": "Giá trị trang bị theo thời gian và trait breakpoint nâng cao",
    "summary": "Tính tổng giá trị một trang bị qua nhiều thành phần, không chỉ sát thương gây ra.",
    "skill": "Chuyên đề",
    "duration": "~25 phút",
    "exercise": "Với ba lần ghép đồ gần đây, ước lượng từng thành phần của V_item (combat now, HP saved, streak, future scaling) và xem thành phần nào bạn đã bỏ qua lúc quyết định.",
    "commonMistake": "Đánh giá item chỉ theo trần sức mạnh cuối trận, bỏ qua giá trị giữ máu và giữ chuỗi ở giữa trận.",
    "applyQuestions": [
      "Tôi đánh giá item theo nhiều thành phần giá trị, không chỉ trần sức mạnh cuối.",
      "Tôi phân biệt được item front-loaded, scaling và conditional trước khi ghép.",
      "Tôi biết chi phí giữ linh kiện chờ BIS đang là bao nhiêu máu/kinh tế/linh hoạt."
    ],
    "related": [
      {
        "label": "Trang bị và phân bố chỉ số",
        "href": "/kien-thuc-nen-tang"
      },
      {
        "label": "Vai trò, tộc hệ và board cap",
        "href": "/kien-thuc-nen-tang"
      },
      {
        "label": "Xác suất shop và giá trị roll nâng cao",
        "href": "/kien-thuc-nen-tang"
      }
    ],
    "blocks": [
      {
        "type": "principles",
        "title": "Mục tiêu",
        "items": [
          "Tính tổng giá trị một trang bị qua nhiều thành phần, không chỉ sát thương gây ra.",
          "Phân biệt item front-loaded, scaling và conditional để chọn đúng thời điểm ghép.",
          "Tính giá trị biên — không phải giá trị tổng — khi cân nhắc đẩy một mốc trait.",
          "Nhận diện khi nào một trait bot đáng dùng và khi nào nó làm board yếu đi."
        ]
      },
      {
        "type": "concept",
        "title": "Phần A — Giá trị trang bị theo thời gian",
        "html": "<h4>Tổng giá trị một trang bị</h4>\n<p>Một món đồ có ít nhất bốn loại giá trị: sức mạnh giao tranh hiện tại, máu được bảo toàn, kinh tế gián tiếp từ chuỗi, và trần sức mạnh cuối trận. Người chơi thường chỉ đánh giá loại cuối cùng.</p>\n<pre><code class=\"language-text\">V_item\n= V_combat_now\n+ V_HP_saved\n+ V_streak\n+ V_future_scaling\n+ V_flexibility\n- C_delay\n- C_opportunity\n</code></pre>\n<ul>\n<li><code>V_combat_now</code>: board mạnh hơn bao nhiêu ngay lập tức.</li>\n<li><code>V_HP_saved</code>: giảm bao nhiêu máu mất ở các round tới.</li>\n<li><code>V_streak</code>: có giữ hoặc phá chuỗi thắng/thua không.</li>\n<li><code>V_future_scaling</code>: món đồ có còn mạnh trên carry cuối không.</li>\n<li><code>V_flexibility</code>: bao nhiêu tướng có thể dùng được món này.</li>\n<li><code>C_delay</code>: cái giá của việc chờ thêm linh kiện.</li>\n<li><code>C_opportunity</code>: ghép món này khiến bạn không ghép được món khác nào.</li>\n</ul>\n<h4>Front-loaded, scaling và conditional</h4>\n<p><strong>Front-loaded</strong> — mạnh ngay từ đầu combat (chỉ số phẳng, mana đầu, shield mở trận, sát thương lập tức): phù hợp khi cần giữ chuỗi, lobby tempo cao, combat ngắn, hoặc board cần vượt breakpoint sớm.</p>\n<p><strong>Scaling</strong> — mạnh dần theo thời gian (tích Attack Speed/AP, damage amp cộng dồn, tăng sau mỗi lần cast): phù hợp khi frontline sống lâu, combat kéo dài, carry được bảo vệ tốt.</p>\n<p><strong>Conditional</strong> — chỉ mạnh khi đạt điều kiện (đánh tank, bị nhiều mục tiêu nhắm tới, dưới ngưỡng HP, đủ số lần crit):</p>\n<pre><code class=\"language-text\">V_conditional = P_condition_active × V_when_active\n</code></pre>\n<p>Một món rất mạnh khi kích hoạt nhưng chỉ kích hoạt 30% thời gian có thể kém một món ổn định hơn tưởng tượng.</p>\n<h4>Slam sớm tạo lợi tức kép</h4>\n<pre><code class=\"language-text\">Slam item sớm\n→ Board mạnh hơn\n→ Giữ máu/giữ chuỗi\n→ Kinh tế tốt hơn\n→ Lên level sớm hơn\n→ Hit unit tốt trước người khác\n</code></pre>\n<p>Giá trị của việc ghép đồ sớm không chỉ nằm ở sát thương món đồ tạo ra — nó khởi động một chuỗi lợi ích cộng dồn qua nhiều round.</p>\n<h4>Chi phí giữ linh kiện chờ BIS</h4>\n<p>Giữ linh kiện để chờ đúng BIS tạo ba loại chi phí: máu (board yếu hơn nhiều round), kinh tế (mất win streak hoặc phải roll sớm để bù sức mạnh thiếu), và linh hoạt (bắt đầu khóa mình vào một carry chưa chắc xuất hiện). Một Sword và một Glove chưa ghép trông có vẻ linh hoạt, nhưng nếu bạn từ chối mọi slam để chờ đúng carry, chúng trở thành <strong>linh hoạt giả</strong> — linh hoạt thật là có nhiều line đủ mạnh sẵn sàng chuyển sang, không phải giữ mọi linh kiện chỉ chấp nhận một bộ BIS.</p>\n<h4>Thời điểm kích hoạt quan trọng hơn trần sức mạnh</h4>\n<p>Nếu combat trung bình kéo dài tám giây, một món đạt full stack ở giây 12 gần như không bao giờ chạm trần trong phần lớn combat — một món mạnh ngay từ giây 0 dù trần thấp hơn có thể tốt hơn nhiều trong lobby đó. Ngược lại nếu frontline rất mạnh và combat thường kéo dài 18 giây, món scaling có thể vượt trội. Câu hỏi cần hỏi là &quot;combat thực tế của đội hình kéo dài bao lâu&quot;, không phải &quot;món này đạt trần mạnh đến mức nào&quot;.</p>"
      },
      {
        "type": "concept",
        "title": "Phần B — Trait breakpoint nâng cao",
        "html": "<h4>Giá trị ròng của một mốc trait</h4>\n<p>Mốc 6 không tự động tốt hơn mốc 4. Câu hỏi cần trả lời là: để lên mốc 6, phải đưa vào unit nào và bỏ unit nào.</p>\n<pre><code class=\"language-text\">V_breakpoint\n= B_new_trait\n- C_unit_slot\n- C_lost_utility\n- C_star_quality\n- C_positioning\n- C_item_mismatch\n</code></pre>\n<p><code>C_lost_utility</code> là utility bị mất khi bỏ một unit khác (khống chế, sunder/shred, heal, tank phụ). <code>C_star_quality</code> là chi phí khi unit thêm vào chỉ một sao trong khi unit bị thay đã hai sao. <code>C_item_mismatch</code> là khi trait cộng thêm đúng chỉ số carry đã dư thừa.</p>\n<h4>Giá trị tổng khác giá trị biên</h4>\n<p>Ví dụ mốc 4 cho 40 đơn vị sức mạnh, mốc 6 cho 55. Giá trị tổng của mốc 6 là 55, nhưng giá trị <strong>biên</strong> từ 4 lên 6 chỉ là 15. Nếu để lấy 15 đó phải bỏ một unit utility đang tạo 20 sức mạnh, board trở nên yếu hơn dù trait &quot;nhìn cao hơn&quot; trên giấy.</p>\n<h4>Trait bot: khi nào dùng được, khi nào không</h4>\n<p>Trait bot là unit đưa vào chủ yếu để kích mốc, bản thân tạo ít giá trị. Chấp nhận được khi mốc trait cực mạnh, unit vẫn có chút utility, không có lựa chọn tốt hơn, hoặc unit có thể cầm item hỗ trợ. Trở nên tệ khi: một sao và chết trước khi cast, chiếm vị trí của tank/utility hai sao, không hưởng item, làm positioning xấu, hoặc trait đang buff một chỉ số đã bị loãng.</p>\n<h4>Vertical và horizontal</h4>\n<p><strong>Vertical</strong> — đẩy một trait lên mốc cao: sức mạnh tập trung, dễ hiểu điều kiện thắng, nhưng phụ thuộc trait bot, dễ bị tranh, ít utility.</p>\n<p><strong>Horizontal</strong> — kết hợp nhiều mốc nhỏ (một trait damage, một trait tank, một nguồn CC, một legendary độc lập): nhiều lớp sức mạnh, linh hoạt, ít loãng chỉ số, nhưng có thể thiếu trần sức mạnh và khó xác định win condition.</p>\n<p>Không có hướng nào luôn đúng — phụ thuộc unit sẵn có và lobby.</p>\n<h4>Breakpoint tấn công và phòng thủ — xác định nút thắt trước khi kích mốc</h4>\n<p><strong>Tấn công:</strong> giết tank trước cast thứ hai, one-shot carry, đạt execute threshold. <strong>Phòng thủ:</strong> tank sống tới cast thứ hai, carry sống qua burst đầu, đội hình đạt đủ thời gian stacking.</p>\n<p>Khi board thiếu frontline, thêm mốc damage không giải quyết vấn đề. Khi board thiếu damage, thêm một tank utility chỉ làm trận thua kéo dài hơn. Phải xác định nút thắt trước khi quyết định kích mốc nào.</p>\n<h4>Emblem giải phóng một slot, không chỉ cộng thêm chỉ số</h4>\n<pre><code class=\"language-text\">V_emblem\n= V_trait_increment\n+ V_holder_synergy\n+ V_slot_liberated\n</code></pre>\n<p>Phần <code>V_slot_liberated</code> thường bị đánh giá thấp: một emblem giúp đạt mốc mà không cần đưa unit một sao yếu vào board có thể tạo giá trị lớn hơn chỉ số trait hiển thị trên tooltip.</p>"
      },
      {
        "type": "pitfalls",
        "title": "Lỗi thường gặp",
        "items": [
          "Đánh giá item chỉ theo trần sức mạnh cuối trận, bỏ qua giá trị giữ máu và giữ chuỗi ở giữa trận.",
          "Giữ linh kiện chờ BIS đến mức tự khóa mình vào một carry chưa chắc xuất hiện.",
          "So sánh mốc trait bằng giá trị tổng thay vì giá trị biên sau khi trừ chi phí unit slot.",
          "Dùng trait bot một sao ở vị trí lẽ ra dành cho tank/utility hai sao.",
          "Kích thêm mốc damage khi nút thắt thực sự là frontline, hoặc ngược lại.",
          "Bỏ qua phần \"slot liberated\" khi định giá một emblem."
        ]
      },
      {
        "type": "concept",
        "title": "Bài tập",
        "html": "<h4>Chấm điểm ba món đồ gần nhất</h4>\n<p>Với ba lần ghép đồ gần đây, ước lượng từng thành phần của V_item (combat now, HP saved, streak, future scaling) và xem thành phần nào bạn đã bỏ qua lúc quyết định.</p>\n<h4>So giá trị biên hai mốc trait</h4>\n<p>Chọn một trait bạn từng đẩy lên mốc cao, ước lượng giá trị tổng ở hai mốc liền kề, trừ chi phí unit slot/utility mất, rồi tính giá trị biên thực tế — có đáng đẩy mốc như đã làm không.</p>"
      },
      {
        "type": "checklist",
        "title": "Checklist",
        "items": [
          "Tôi đánh giá item theo nhiều thành phần giá trị, không chỉ trần sức mạnh cuối.",
          "Tôi phân biệt được item front-loaded, scaling và conditional trước khi ghép.",
          "Tôi biết chi phí giữ linh kiện chờ BIS đang là bao nhiêu máu/kinh tế/linh hoạt.",
          "Tôi tính giá trị biên, không phải giá trị tổng, khi cân nhắc mốc trait tiếp theo.",
          "Tôi đã xác định nút thắt tấn công/phòng thủ trước khi chọn kích mốc nào."
        ]
      }
    ]
  }
];

export function getLesson(slug: string): Lesson | undefined {
  return lessons.find((lesson) => lesson.slug === slug);
}
