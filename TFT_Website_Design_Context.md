# TFT Website Design Context

File này là context handoff cho Claude Design hoặc bất kỳ Claude agent nào cần thiết kế website cho bộ tài liệu `TFT Evergreen Rank Pack`.

## 1. Sản phẩm là gì?

Website cần thiết kế là bản web app/website học TFT bằng tiếng Việt dựa trên bộ tài liệu:

- `..\README.md`
- `..\docs\evergreen\TFT_Evergreen_Rank_Manual.md`
- `..\docs\evergreen\TFT_Practice_and_Review_Templates.md`
- `..\docs\evergreen\TFT_Evergreen_Rank_Manual.html`

Tên làm việc: **TFT Evergreen Rank Manual**.

Đây không phải website meta comps, tier list hay wiki tướng. Đây là **phòng huấn luyện chiến thuật TFT** giúp người chơi leo rank xuyên mùa bằng kỹ năng ra quyết định.

Website phải giúp người chơi trả lời 3 câu hỏi:

1. Hôm nay nên học kỹ năng gì?
2. Trong trận cần nhìn gì để ra quyết định đúng?
3. Sau trận cần sửa lỗi nào?

## 2. Đối tượng người dùng

Người dùng chính là người chơi TFT Việt Nam từ Gold đến Master, đã biết luật chơi cơ bản nhưng muốn leo rank có hệ thống.

Họ thường gặp các lỗi:

- Roll không có mục tiêu rõ.
- Giữ đồ quá lâu vì sợ sai meta.
- Không biết khi nào lên cấp.
- Pivot quá muộn.
- Scout nhưng không đổi positioning.
- Không phân biệt trận nên đánh top 1, top 4 hay cứu top 6.
- Thua xong không biết lỗi đầu tiên nằm ở đâu.
- Học quá nhiều đội hình meta nhưng thiếu nền tảng xuyên mùa.

## 3. Định vị thiết kế

Concept chính: **TFT War Room**.

Website nên có cảm giác như một phòng chiến thuật leo rank: sắc, rõ, có kỷ luật, thực chiến. Tránh cảm giác landing page SaaS generic hoặc wiki game màu mè.

Không nên thiết kế theo hướng:

- Hero gradient tím xanh generic.
- Trang tài liệu markdown khô cứng.
- Fantasy game UI quá nặng.
- Web tier list/meta comps.
- Quá nhiều neon glow hoặc animation rối.

Nên lấy cảm hứng từ:

- Hex board của TFT.
- Shop odds.
- Gold economy.
- Stage timeline.
- Coach notebook.
- Review tape.
- Lobby scouting grid.
- Decision tree trong trận.

## 4. Single job của website

> Giúp người chơi biết hôm nay nên học gì, trong trận cần nhìn gì, sau trận cần sửa lỗi nào.

Mọi trang, CTA và component nên phục vụ single job này.

## 5. Hero thesis

Hero không nên chỉ là hình minh họa đẹp. Hero là tuyên ngôn của sản phẩm.

Headline đề xuất:

> Học cách thắng lobby, không học thuộc đội hình.

Subheadline đề xuất:

> Một giáo trình TFT xuyên mùa giúp bạn đọc sức mạnh bàn đấu, quản lý tài nguyên, chọn nhịp roll và review lỗi sau mỗi phiên leo rank.

CTA chính:

- Bắt đầu lộ trình

CTA phụ:

- Mở checklist trong trận

## 6. Signature design element

Signature element nên là **Interactive Hex Decision Board**.

Đây là một bàn cờ hex tương tác ở hero hoặc home page. Mỗi ô là một kỹ năng evergreen:

- Gold
- HP
- Items
- Tempo
- Scout
- Pivot
- Roll
- Position
- Augment
- Strongest board

Khi hover/click vào một ô, panel bên cạnh đổi nội dung:

- Dấu hiệu bạn đang mắc lỗi kỹ năng đó.
- Bài học nên đọc.
- Checklist nên mở.
- Bài tập 10 trận đề xuất.

Lý do chọn aesthetic risk này: người chơi TFT tư duy bằng bàn đấu và trạng thái lobby. Biến board thành navigation giúp website khác biệt với trang tài liệu thông thường.

## 7. Các trang cần thiết

### 7.1 Home / Landing

Mục tiêu: giải thích website khác guide meta như thế nào và dẫn người dùng vào đúng chế độ học.

Nội dung nên có:

- Hero với Interactive Hex Decision Board.
- 3 entry paths:
  - Tôi muốn học từ đầu.
  - Tôi đang kẹt rank.
  - Tôi vừa thua và muốn review.
- Section “Bạn đang mất rank vì…”.
- Preview giáo án 8 tuần.
- Checklist nhanh trước trận.
- CTA vào lộ trình và checklist.

### 7.2 Curriculum / Lộ trình học

Mục tiêu: biến manual dài thành lộ trình học có thứ tự.

Các module chính lấy từ `..\docs\evergreen\TFT_Evergreen_Rank_Manual.md`:

1. Nền tảng không đổi qua các mùa
2. Đánh giá sức mạnh bàn đấu
3. Kinh tế, lên cấp và roll
4. Trang bị và nâng cấp
5. Flex, pivot và xây đội hình
6. Scouting và positioning
7. Cây quyết định theo giai đoạn
8. Hệ thống cập nhật mỗi mùa/patch
9. Giáo án 8 tuần
10. Review VOD và phân tích lỗi
11. Quản lý phiên leo rank
12. Checklist nhanh
13. Mẫu ghi chép
14. Nguồn học và cách dùng
15. 12 nguyên tắc cốt lõi

UI gợi ý:

- Rank climb map hoặc module board.
- Mỗi module có trạng thái: chưa học, đang luyện, đã hoàn thành, cần review lại.
- Mỗi module hiển thị kỹ năng chính, thời lượng đọc, bài tập áp dụng và link lesson.

### 7.3 Lesson Detail / Trang bài học

Mục tiêu: đọc từng bài học dễ hơn Markdown dài, đồng thời biết cách áp dụng ngay.

Desktop layout nên là 3 cột:

- Left sticky module list.
- Center article content.
- Right sticky “Apply now” panel.

Apply panel nên có:

- Checklist mini.
- Câu hỏi tự kiểm tra.
- Bài tập 10 trận.
- Lỗi thường gặp.
- Link tới review/template liên quan.

Trang bài học không nên chỉ là article. Nó nên giống coach notes panel.

### 7.4 In-game Checklist / Checklist trong trận

Mục tiêu: dùng được khi đang chơi TFT.

Tabs đề xuất:

- Lobby
- Stage 2
- Stage 3
- Stage 4
- Late game
- Sau trận

Tính năng:

- Checkbox local state.
- Reset cho trận mới.
- Focus mode chỉ hiện 3 câu hỏi quan trọng nhất.
- Font lớn, đọc nhanh, dùng tốt trên điện thoại hoặc màn hình phụ.

Ví dụ câu hỏi focus:

- Board mình mạnh hay yếu so với lobby?
- Mình đang chơi vì top 4 hay top 1?
- Nếu roll bây giờ, mình đang tìm chính xác điều gì?

### 7.5 Practice Templates / Biểu mẫu luyện tập

Mục tiêu: chuyển `..\docs\evergreen\TFT_Practice_and_Review_Templates.md` thành công cụ nhập liệu.

Các biểu mẫu cần có:

1. Phiếu trước phiên
2. Phiếu một trận 60 giây
3. Phiếu board strength
4. Phiếu trước rolldown
5. Phiếu patch
6. Phiếu 20 trận
7. Bộ câu hỏi review sâu

Tính năng đề xuất:

- Form nhanh điền.
- Copy Markdown.
- Export JSON hoặc tải file nếu cần.
- Lưu local storage cho MVP.
- Tag lỗi: Economy, Tempo, Item, Augment, Pivot, Scout, Positioning, Rolldown, Tilt.

### 7.6 Review Lab / Phòng review sau trận

Mục tiêu: giúp người chơi phân tích một trận thua trong 15 phút.

Flow đề xuất:

1. Nhập placement, comp, stage yếu nhất, stage chết nếu có.
2. Chọn turning point trên timeline stage 2 → 3 → 4 → 5.
3. Chọn lỗi đầu tiên có thể sửa.
4. Gắn nhãn lỗi.
5. Viết quyết định thay thế.
6. Copy review summary dạng Markdown.

Cần có panel phân biệt:

- Quyết định tốt, kết quả xấu.
- Quyết định xấu, kết quả tốt.

### 7.7 8-Week Training Plan / Giáo án 8 tuần

Các tuần:

1. Strongest board
2. Kinh tế và chuỗi
3. Trang bị
4. Level và roll
5. Flex và pivot
6. Scouting
7. Positioning
8. Review và ổn định thứ hạng

Mỗi tuần nên có:

- Mục tiêu học.
- 3 nguyên tắc chính.
- Bài tập 10–20 trận.
- Checklist trong trận.
- Dấu hiệu đã tiến bộ.
- Link bài học liên quan.
- Link template review.

### 7.8 Patch Update System / Hệ thống cập nhật patch

Mục tiêu: dạy người chơi cập nhật theo patch mà không học lại từ đầu.

Nội dung:

- Phiếu mùa 60 phút.
- Phiếu patch 30 phút.
- Cách đọc dữ liệu đúng: average placement, pick rate, top-4 rate, win rate, sample size, filter.

Cảnh báo quan trọng trong UI:

> Đừng đổi toàn bộ cách chơi chỉ vì một chỉ số win rate.

### 7.9 Decision Trees / Cây quyết định

Các cây quyết định nên có:

- Khi nào lên cấp.
- Khi nào roll.
- Khi nào pivot.
- Khi nào slam đồ hoặc giữ đồ.
- Khi nào chơi winstreak/losestreak.
- Khi nào đánh top 1/top 4/cứu top 6.
- Khi nào scout.
- Khi nào all-in.

UI gợi ý:

- Interactive flowchart.
- Node dạng câu hỏi yes/no hoặc chọn trạng thái.
- Kết quả cuối là hành động cụ thể.
- Có link “xem bài học liên quan”.

### 7.10 Resources / Nguồn học

Nguồn trong manual:

- Riot official.
- Tactics.tools.
- TFT Academy.
- LoLCHESS.

Trang này không nên chỉ là danh sách link. Phải dạy cách dùng nguồn đúng.

Thông điệp chính:

> Nguồn dữ liệu không thay bạn ra quyết định. Nó chỉ cho biết bạn nên đặt câu hỏi ở đâu.

### 7.11 Search / Tra cứu nhanh

Mục tiêu: tìm nhanh khái niệm trong toàn bộ manual.

Nên có command palette `Ctrl + K`.

Search result nên là action, không chỉ link:

- Đọc bài Tempo.
- Mở checklist trước rolldown.
- Điền phiếu review 20 trận.
- Xem cây quyết định khi nào roll.

Filter:

- Bài học
- Checklist
- Biểu mẫu
- Cây quyết định
- Lỗi thường gặp

## 8. Navigation chính

Top navigation đề xuất:

1. Lộ trình
2. Bài học
3. Checklist
4. Review
5. Biểu mẫu
6. Patch
7. Nguồn học

Nút cố định/quick access:

- `Ctrl + K` / Tìm nhanh
- Checklist trong trận
- Review trận vừa chơi

Mobile bottom nav:

- Học
- Checklist
- Review
- Tìm

## 9. Visual system

### Color tokens

| Token | Hex | Vai trò |
|---|---:|---|
| Board Midnight | `#111827` | Background chính |
| Hex Slate | `#1F2937` | Card/panel |
| Tactician Ivory | `#E7E2D6` | Text chính trên nền tối |
| Economy Gold | `#D6A84F` | CTA, gold, breakpoint |
| Augment Violet | `#8B5CF6` | Highlight kỹ năng/augment |
| Health Red | `#E0564A` | Cảnh báo, máu, lỗi |
| Mana Cyan | `#38BDF8` | Link, focus, thông tin phụ |

Có thể thêm reading mode sáng:

- Parchment Sand: `#F3EFE4`
- Ink Navy: `#172033`

### Typography

Font cần hỗ trợ tiếng Việt tốt.

- Display/Heading: `Be Vietnam Pro` ExtraBold hoặc Black.
- Body: `Be Vietnam Pro` Regular/Medium.
- Utility/Data/Labels: `JetBrains Mono` hoặc `IBM Plex Mono`.

Type style:

- Heading ngắn, chắc, giống lệnh chiến thuật.
- Body dễ đọc, không quá nhỏ.
- Label mono để tạo cảm giác tactical overlay.

## 10. Copy voice

Tone nên rõ, thực chiến, giống coach nói với người chơi.

Nên viết:

- “Mở checklist trong trận”
- “Chọn lỗi đầu tiên có thể sửa”
- “Bạn đang chơi vì top 4 hay top 1?”
- “Nếu roll bây giờ, bạn đang tìm chính xác điều gì?”

Không nên viết:

- “Master every comp”
- “Dominate the meta”
- “Unlock your true potential”
- “Submit” cho action form

Các action nên dùng động từ rõ:

- Bắt đầu lộ trình
- Reset trận mới
- Copy review summary
- Lưu phiên luyện
- Mở bài học liên quan

## 11. MVP scope

Nếu cần prototype đầu tiên, ưu tiên:

1. Home
2. Lesson Detail
3. Checklist trong trận
4. Review Lab
5. Search command palette

Các trang khác có thể làm preview/placeholder trong prototype:

- Curriculum
- Practice Templates
- Patch Update System
- Decision Trees
- Resources

## 12. Không nên làm ở MVP

Không cần:

- Đăng nhập tài khoản.
- Database cloud.
- Leaderboard.
- AI coach trực tiếp.
- Meta comps theo patch.
- Đồng bộ Riot account.

Lý do: sản phẩm là giáo trình evergreen. Nếu thêm live meta quá sớm, website mất trọng tâm.

## 13. Responsive requirements

Desktop:

- Lesson page dùng layout 3 cột.
- Sidebar trái sticky.
- Apply panel phải sticky.
- Command palette search.

Tablet:

- Sidebar module chuyển thành dropdown.
- Apply panel chuyển xuống dưới bài.

Mobile:

- Ưu tiên checklist và review.
- Bottom nav.
- Reading mode thoáng.
- Không nhồi nhiều panel cạnh nhau.

## 14. Accessibility requirements

- Tất cả checklist dùng được bằng keyboard.
- Focus state rõ bằng Mana Cyan `#38BDF8`.
- Respect `prefers-reduced-motion`.
- Contrast tốt trên nền tối.
- Không dùng màu làm tín hiệu duy nhất; lỗi phải có icon/label kèm màu.
- Font tiếng Việt phải render dấu tốt.

## 15. Motion direction

Dùng motion ít nhưng có chủ đích.

Nên dùng:

- Hex board hero reveal theo cụm kỹ năng.
- Hover/click hex cell đổi panel nội dung.
- Checklist tick nhẹ.
- Review timeline marker trượt khi chọn stage.

Không nên dùng:

- Parallax nặng.
- Neon glow khắp nơi.
- Animation liên tục.
- Loading screen dài.

## 16. Wireframe nhanh

### Home

```text
┌────────────────────────────────────────────────────────────┐
│ Logo        Lộ trình  Bài học  Checklist  Review   Search  │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  HỌC CÁCH THẮNG LOBBY          ┌────────────────────────┐  │
│  Không học thuộc đội hình.     │  Interactive Hex Board │  │
│  Học cách đọc trận.            │  Gold / HP / Pivot     │  │
│                                │  Scout / Roll / Items  │  │
│  [Bắt đầu lộ trình]            └────────────────────────┘  │
│  [Mở checklist trong trận]                                  │
│                                                            │
├────────────────────────────────────────────────────────────┤
│  Tôi muốn...                                                │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────────┐    │
│  │ Học từ đầu   │ │ Sửa lỗi rank │ │ Review trận thua │    │
│  └──────────────┘ └──────────────┘ └──────────────────┘    │
├────────────────────────────────────────────────────────────┤
│  Lộ trình 8 tuần                                            │
│  Week 1 → Week 2 → Week 3 → ... → Week 8                    │
└────────────────────────────────────────────────────────────┘
```

### Lesson Detail

```text
┌───────────────┬──────────────────────────────┬──────────────┐
│ Module list   │ Lesson content                │ Apply now    │
│               │                               │              │
│  Tempo        │ # Tempo                       │ Checklist    │
│  Economy      │ Nội dung bài học              │ Câu hỏi      │
│  Items        │ Ví dụ thực chiến              │ Bài tập      │
│  Pivot        │ Lỗi thường gặp                │ Link review  │
└───────────────┴──────────────────────────────┴──────────────┘
```

### Checklist

```text
┌────────────────────────────────────────────────────────────┐
│ Checklist trong trận                              Reset     │
├────────────────────────────────────────────────────────────┤
│ Lobby | Stage 2 | Stage 3 | Stage 4 | Late | Sau trận       │
├────────────────────────────────────────────────────────────┤
│ □ Board mình mạnh hay yếu so với lobby?                     │
│ □ Mình đang giữ vàng vì lý do gì?                           │
│ □ Nếu roll, mình cần nâng cấp slot nào?                     │
│ □ Scout ai có thể giết mình round tới?                      │
└────────────────────────────────────────────────────────────┘
```

### Review Lab

```text
┌────────────────────────────────────────────────────────────┐
│ Review trận vừa chơi                                       │
├────────────────────────────────────────────────────────────┤
│ Placement: [ ]   Comp: [ ]   Stage yếu nhất: [ ]            │
├────────────────────────────────────────────────────────────┤
│ Timeline: Stage 2 ── Stage 3 ── Stage 4 ── Stage 5          │
│                    ▲ Turning point                          │
├────────────────────────────────────────────────────────────┤
│ Lỗi đầu tiên có thể sửa:                                   │
│ [ Economy ] [ Tempo ] [ Item ] [ Scout ] [ Positioning ]    │
├────────────────────────────────────────────────────────────┤
│ Quyết định thay thế lần sau:                               │
│ [ textarea ]                                                │
│                                                            │
│ [Copy review summary]                                      │
└────────────────────────────────────────────────────────────┘
```

## 17. Prompt ngắn để gửi Claude Design

```text
Thiết kế prototype website cho TFT Evergreen Rank Manual, một giáo trình tiếng Việt giúp người chơi Teamfight Tactics leo rank xuyên mùa bằng kỹ năng ra quyết định, không phụ thuộc meta.

Concept: TFT War Room — phòng chiến thuật leo rank. Website cần sắc, rõ, có kỷ luật, giống coach dashboard hơn là wiki meta. Hero phải có interactive hex decision board lấy cảm hứng từ bàn cờ TFT. Mỗi ô đại diện kỹ năng evergreen như Gold, HP, Items, Tempo, Scout, Pivot, Roll, Position. Khi hover/click, panel bên cạnh hiện dấu hiệu lỗi, bài học liên quan và checklist nên dùng.

Audience: người chơi TFT Việt Nam từ Gold đến Master, biết game cơ bản nhưng muốn luyện có hệ thống.

Single job: giúp người chơi biết hôm nay nên học gì, trong trận cần nhìn gì, sau trận cần sửa lỗi nào.

MVP pages: Home, Lesson Detail, Checklist trong trận, Review Lab, Search command palette. Các trang Curriculum, Practice Templates, Patch, Decision Trees, Resources có thể là preview/placeholder.

Hero copy:
Headline: Học cách thắng lobby, không học thuộc đội hình.
Subheadline: Một giáo trình TFT xuyên mùa giúp bạn đọc sức mạnh bàn đấu, quản lý tài nguyên, chọn nhịp roll và review lỗi sau mỗi phiên leo rank.
CTA chính: Bắt đầu lộ trình
CTA phụ: Mở checklist trong trận

Palette:
Board Midnight #111827, Hex Slate #1F2937, Tactician Ivory #E7E2D6, Economy Gold #D6A84F, Augment Violet #8B5CF6, Health Red #E0564A, Mana Cyan #38BDF8.

Typography: Be Vietnam Pro cho heading/body, JetBrains Mono hoặc IBM Plex Mono cho utility/data labels. Font phải hỗ trợ tiếng Việt tốt.

Key interactions: Ctrl+K search, checklist reset trận mới, review timeline stage 2–5, copy review summary Markdown, reduced motion support, keyboard focus rõ.
```
