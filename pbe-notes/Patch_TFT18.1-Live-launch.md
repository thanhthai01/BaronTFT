# Patch TFT18.1 — Bản vá LIVE đầu tiên của Set 18 (Đại Ngàn Kỳ Bí)

## Nguồn

- Trang tổng hợp (nguồn phát hiện mới, bổ sung từ 26/08/2026): <https://liquipedia.net/tft/Main_Page> → <https://liquipedia.net/tft/Patch_TFT18.1>
- Patch note gốc EN: <https://teamfighttactics.leagueoflegends.com/en-us/news/game-updates/teamfight-tactics-patch-18-1/>
- Patch note gốc VI: <https://teamfighttactics.leagueoflegends.com/vi-vn/news/game-updates/teamfight-tactics-patch-18-1/>
- Tác giả: Rodger "Riot Prism" Caudill, Katie "Riot Ukime" Guo
- Thời điểm đăng: 2026-08-25T18:00:00Z → **26/08/2026** giờ VN
- Phiên bản dự kiến trong DB: `Live 26/08/2026 (18.1)`

Đây là bản vá LIVE đầu tiên của Set 18, nối tiếp chuỗi PBE `18.1x → 18.1ah`. **Không có mục cân bằng tướng/tộc hệ Set 18** trong patch note — toàn bộ số liệu tướng/tộc hệ đã chốt qua giai đoạn PBE. Trọng tâm bản vá là: hệ thống (Tinh Linh, Vòng Đi Chợ, chọn mục tiêu, Vòng Kỳ Ngộ), xoay vòng Nâng Cấp, Trang Bị Ánh Sáng, Tạo Tác, và một cân bằng nhỏ cho Set 17.

## Quy ước

- ⬆️ buff · ⬇️ nerf · 🔄 rework · ⚙️ cơ chế · 🐞 sửa lỗi
- `[REPORT]` = chỉ lên patch report `/patch`
- `[CODEX]` = cần đồng bộ số liệu hiện tại vào DB Set 18
- `[SKIP]` = cố ý không đưa vào (kèm lý do)

---

## 1. Hệ thống

### ⚙️ Cơ chế mùa: Tinh Linh (Wisps) — `[REPORT]`

- Tinh Linh chia thành 7 phân loại: Tướng, Giao Tranh, Hỗn Hợp, Cửa Hàng, Vàng/XP, Rủi Ro, Trang Bị. Mỗi phân loại có màu/biểu tượng riêng; biểu tượng hiện cạnh thanh máu Linh Thú sau khi mua.
- Chỉ mua được Tinh Linh trong giai đoạn dàn trận. Hết dàn trận, Tinh Linh bay đi, để lộ vị tướng ẩn sau nó.
- Cứ hai lần làm mới cửa hàng, Tinh Linh xuất hiện một lần.
- Từ giai đoạn 5 trở đi, cứ hai lần Tinh Linh xuất hiện thì có một lần chắc chắn là Tinh Linh Giao Tranh.

> Đây là phần "highlights" Riot tóm tắt lại, không phải thay đổi so với PBE. Đưa vào report như một entry cơ chế để người đọc live mới nắm được luật.

### ⚙️ Vòng Đi Chợ (Carousel) — `[REPORT]`

- Vòng Đi Chợ đã trở lại.
- Vòng Đi Chợ giờ có cơ hội xuất hiện nhiều tướng hơn và/hoặc tướng giá cao hơn bình thường.

### ⚙️ Chọn mục tiêu — `[REPORT]`

- Các đơn vị **không còn chọn lại mục tiêu** sau khi thoát khỏi hiệu ứng Khống Chế.
- Lý do Riot nêu: cơ chế cũ (Hextech) ép retarget kẻ địch gần nhất sau CC, gây "mất trí nhớ mục tiêu" — bất lợi cho Sát Thủ đã lẻn vào tuyến sau.

### ⚙️ Báu vật PvE — `[REPORT]`

- Phần thưởng bị bỏ lỡ từ Giai Đoạn 4-7 hoặc các vòng PvE sau đó giờ được chuyển sang vòng PvE kế tiếp.

### ⚙️ Vòng Kỳ Ngộ Khai Cuộc — `[REPORT]`

- **Mới:**
  - Khởi Đầu Với Gói Trang Bị Hoàn Chỉnh (Completed Item Anvil Start): tất cả người chơi bắt đầu với 1 Gói Trang Bị Hoàn Chỉnh.
  - Gói Đổi Lại (Reroll Subscription): nhận lượt đổi khi bắt đầu mỗi giai đoạn.
  - Lò Rèn Trang Bị (Item Forge): tất cả người chơi bắt đầu với 2 Gói Trang Bị Hoàn Chỉnh.
- **Loại bỏ:** Đăng Ký Báu Vật (Loot Subscription), Gói Trang Bị Tạo Tác (Artifact Anvil), Bắt Đầu Reroll (Reroll Start).

---

## 2. Xoay vòng Nâng Cấp

### ⚙️ Loại bỏ — 43 Nâng Cấp `[REPORT — gộp 1 entry]`

AFK · Cái Giá Phải Trả · Aura Farming · Huyết Tế · Thua Có Tính Toán · Chuyển Đổi Năng Lượng I/II · Leo Hạng I/II · Bạn Đồng Hành Tự Chế · Tái Lập Vũ Trụ · Hình Nộm Thử Nghiệm Va Chạm · Độc Hành I/II · Nếm Mùi Lửa · Nghĩ Về Tương Lai · Vương Miện Nặng Trĩu · Kamekameha · Nắm Rõ Đối Thủ · Những Người Bạn Nhỏ · Tiền Ăn Trưa · Trên Đà Phát Triển · Tứ Phương Tiếp Viện · Tái Khởi Động Nhiệm Vụ · Nước Đi Liều Lĩnh · Tài Khoản Tiết Kiệm · Ngọn Gió Thứ Hai · Sức Sống Mới II · Phản Ứng Phụ · Dịch Vụ Gói Đăng Ký · Phóng Hỏa · Khổng Lồ Tí Hon · Khổng Lồ Hóa · Nhỏ Mà Có Võ · Bộ Ba Hoàn Hảo I/II · Cặp Đôi Siêu Cứng · 2 Vàng Là Nhất · Hút Sinh Lực I · Chiến Tướng Khải Hoàn · Toàn Thắng · Tiêu Dùng Thông Minh · Cây Cung Thần Tốc

> `[SKIP]` chi tiết từng dòng trên `/patch`: đây là Nâng Cấp của các mùa trước, phần lớn không nằm trong codex Set 18. Liệt kê 43 tên trong vùng số liệu sẽ làm vỡ bố cục và không phục vụ người đọc Set 18. Gộp thành 1 entry cơ chế ghi số lượng; danh sách đầy đủ giữ ở file này.

### ⚙️ Quay trở lại — 23 Nâng Cấp `[REPORT — gộp 1 entry]`

Đòn Quyết Định · Chúc Phúc Của Bụt · Thiên Giới Ban Phước · Nồi Nấu Ăn · Lên Ngôi Vương · Vận Mệnh Bạc / + / ++ · Vận Mệnh Vàng / + · Vận Mệnh Kim Cương / + · Thương Vụ Khó Xơi · Chiến Thuật Đầu Tư · Đồ Vương · Nắm Rõ Đối Thủ · Đội Hình Tối Ưu · Sảnh Đông Đúc · Hàng Chờ Pandora · Chuẩn Xác và Uyển Chuyển · Thệ Ước Bảo Hộ · Vượt Thời Gian · Trẻ, Khỏe & Tự Do

> Lưu ý mâu thuẫn trong chính patch note gốc: **Nắm Rõ Đối Thủ (Know Your Enemy)** xuất hiện ở CẢ hai danh sách "loại bỏ" và "quay trở lại". Ghi nhận nguyên trạng, không tự sửa.

### Điều chỉnh Nâng Cấp

| Nâng Cấp | Thay đổi | Trạng thái DB Set 18 |
|---|---|---|
| ⬆️ Băng Trộm II (Band of Thieves II) | Thời gian trễ: 6 ⇒ 5 Vòng Giao Tranh Người Chơi | ✅ DB đã đúng ("Sau 5 giao tranh") → `[REPORT]` |
| ⚙️ Sơ Đồ Tuyến Sau / Củng Cố Tuyến Trước | Mô tả: 'tộc/hệ liệt kê cuối cùng' ⇒ 'tộc/hệ' (class) | ⚠️ EN đã đúng, **VI còn "tộc/hệ cuối cùng"** → `[CODEX]` |
| 🔄 Sinh Nhật Đoàn Tụ (Birthday Reunion) | Làm lại: tướng 2 vàng 2 sao → Cấp 6 nhận **trang bị thành phần ngẫu nhiên** → Cấp 9 nhận tướng 5 vàng 2 sao | ⚠️ EN đúng, **VI dịch sai thành "1 Găng Đạo Tặc"** → `[CODEX]` |
| ⬆️ Tất Tay Bậc Đồng I/II (Bronze for Life) | Khuếch Đại Sát Thương: 2% ⇒ 2,5% | ❌ Không có trong codex Set 18 → `[REPORT]` |
| ⬇️ Tự Lập Đội (Build-a-Bud) | Vàng ban đầu: 10 ⇒ 6 | ❌ Không có trong codex → `[REPORT]` |
| ⬆️ Kho Báu Chôn Giấu II (Buried Treasures II) | Số vòng: 5 ⇒ 6 | ❌ Codex chỉ có bản III → `[REPORT]` |
| ⚙️ Ân Huệ Thách Đấu (Challenger's Grace) | Đổi tên từ **Chuẩn Xác và Uyển Chuyển** (Precision and Grace) — tránh nhầm với từ khoá "Chuẩn Xác" của chí mạng kỹ năng | ⚠️ EN đã đổi, **nameVi vẫn là "Chuẩn Xác và Uyển Chuyển"** → `[CODEX]` |
| ⬇️ Cố Gắng Lật Kèo (Comeback Story) | Tốc Độ Đánh mỗi Máu người chơi đã mất: 0,4% ⇒ 0,3% | ✅ DB đã đúng → `[REPORT]` |
| 🔄 Cầu Hồi Phục (Healing Orbs) | Hồi máu **ngay lập tức**; xét đồng minh trong 3 ô quanh mục tiêu và chọn đồng minh **% Máu thấp nhất** (thay vì gần nhất); mặc định chọn gần nhất nếu không ai trong 3 ô | ⚠️ DB (I và II) vẫn ghi "tướng đồng minh gần nhất" → `[CODEX]` |
| 🔄 Tôi Luyện Sức Mạnh (Forged in Strength) | Ngưỡng Máu: 30 ⇒ 35. Thưởng: 3 Tạo Tác ⇒ 1 Tạo Tác + 1 trang bị hoàn chỉnh + 2 thành phần | ❌ Không có trong codex → `[REPORT]` |
| ⬇️ Thích Mở Rộng (Going Long) | Vàng ngay lập tức: 16 ⇒ 10 | ✅ DB đã đúng (10 vàng) → `[REPORT]` |
| ⬇️ Chế Tạo Tại Chỗ (Living Forge) | Số vòng: 9 ⇒ 10 | ✅ DB đã đúng → `[REPORT]` |
| ⬇️ Gói Đăng Ký Hạng Sang (Luxury Subscription) | Vàng: 7 ⇒ 3 | ⚠️ **Cả "from" lẫn "to" đều không khớp DB** (DB ghi 5 vàng) — xem mục "Anchor lệch" bên dưới |
| 🔄 Đội Hình Tối Ưu (Max Build) | Làm lại: 10 lượt đổi miễn phí; Cấp 9 nhận 3 lượt đổi + 1 Máy Sao Chép Tướng | ✅ DB đã đúng → `[REPORT]` |
| ⬆️ Cơn Khát Vàng+ (Money Hungry+) | Vàng ban đầu: 10 ⇒ 13 | ✅ DB đã đúng → `[REPORT]` |
| ⚙️ Hàng Chờ Pandora (Pandora's Bench) | Ít có khả năng đổi ra tướng 2 sao khi bể tướng còn ít bản sao | Không có số liệu → `[REPORT]` |
| ⚙️ Quay Trúng Thưởng (Slightly Magical) | Mốc rút thưởng 6: Xẻng Vàng ⇒ Ấn ngẫu nhiên | ❌ Không có trong codex → `[REPORT]` |

**Lỗi dịch trong patch note VI gốc** (ghi nhận, không đưa lên site): "Thích Mở Rộng - Vàng Ngay Lập Tức: 16 **giây** ⇒ 10 **giây**" — bản EN ghi rõ `16g ⇒ 10g` (vàng). Dùng theo EN.

---

## 3. Trang Bị Ánh Sáng (Radiant)

| Trang bị | Thay đổi | Trạng thái DB |
|---|---|---|
| ⬆️ Thú Tượng Thạch Giáp Ánh Sáng | Máu: 300 ⇒ 400 | ✅ statLine + statBadges đã là 400 → `[REPORT]` |
| ⬆️ Bàn Tay Công Lý Ánh Sáng | SMCK/SMPT: 30 ⇒ 35 | ⚠️ EN đã 35%, **descriptionVi vẫn 30%** → `[CODEX]` |
| ⬇️ Trái Tim Kiên Định Ánh Sáng | Máu: 600 ⇒ 500 | ✅ statBadges đã 500 → `[REPORT]` |

---

## 4. Tạo Tác quay trở lại

| Tạo Tác | Chỉ số | Trạng thái DB |
|---|---|---|
| Dị Vật Tai Ương (Forbidden Idol) | Máu 400 · Hồi Năng Lượng 2 · 40% giá trị lá chắn chuyển thành Máu tối đa | ⚠️ Item đã có, số liệu đúng, nhưng **`descriptionVi` chưa dịch (còn nguyên tiếng Anh)** → `[CODEX]` |
| Thánh Kiếm Manazane | SMCK 15% · SMPT 15% · Hồi Năng Lượng 1 | ⚠️ statLine `15% 15% 1` đúng, nhưng **statBadges sai**: `ap 10`, `as 10%` (không có manaregen) → `[CODEX]` |

---

## 5. Điều chỉnh Tạo Tác

| Tạo Tác | Thay đổi (EN ⇒) | Trạng thái DB |
|---|---|---|
| ⬆️ Khiên Hoàng Hôn (Aegis of Dusk) | % Sát thương theo Kháng Phép: 15% ⇒ 18% | ✅ desc + descVi đã 18% → `[REPORT]` |
| 🔄 Đá Hắc Hóa (Blighting Jewel) | SMPT cơ bản: 60% ⇒ 30%; Năng lượng khi mục tiêu 0 Kháng Phép: 2 ⇒ 4 | ⚠️ desc/descVi đã ghi 4 Năng Lượng ✅, nhưng **statBadges vẫn `ap 60`**; statLine ghi `35% 4` (lệch cả 60 lẫn 30) → xem "Anchor lệch" |
| 🔄 Lõi Bình Minh (Dawncore) | SMCK/SMPT 15 ⇒ 20 · Giảm NL mỗi lần thi triển 4% ⇒ 5% · NL tối thiểu 10 ⇒ 15 · Hồi NL 2 ⇒ 1 | ✅ Toàn bộ đã đúng trong DB → `[REPORT]` |
| 🔄 Pháo Xương Cá (Fishbones) | **Mới: +2 Tầm Đánh**; SMCK/SMPT: 50% ⇒ 25% | ⚠️ statBadges 25% ✅, EN desc có "+2 Attack Range" ✅, **descVi thiếu câu +2 Tầm Đánh** → `[CODEX]` |
| ⬇️ Khế Ước Vĩnh Hằng (Eternal Pact) | SMPT cơ bản: 40 ⇒ 35 | ✅ statBadges `ap 35` → `[REPORT]` |
| 🔄 Rìu Hỏa Ngục (Hellfire Hatchet) | Máu cơ bản 150 ⇒ 400 · **SMCK cơ bản: loại bỏ** · TĐĐ theo Máu đã mất 1% ⇒ 1,5% | ⚠️ desc đã 1.5% ✅, statLine `400 20%` ✅, nhưng **statBadges vẫn `health 150` và còn `ad 20%`** → `[CODEX]` |
| ⬇️ Đại Bác Liên Thanh (Rapid Firecannon) | Tốc Độ Đánh: 65% ⇒ 55% | ⚠️ statLine `55%` ✅, **statBadges vẫn `as 65%`** → `[CODEX]` |
| 🔄 Chùy Bạch Ngân (Silvermere Dawn) | **Mới: 30% Hút Máu Toàn Phần** · SMCK 140% ⇒ 125% · Chống chịu 80 ⇒ 30 | ⚠️ statLine `125% 30 30 30%` ✅, **statBadges vẫn `ad 140%`, `armor 80`, `mr 80`, thiếu omnivamp** → `[CODEX]` |
| 🔄 Dao Điện Statikk (Statikk Shiv) | Tia sét nảy 4 ⇒ 6 · Sát thương cơ bản 30 ⇒ 15 · SMPT tia sét 50% ⇒ 35% · Tốc Độ Đánh 50% ⇒ 40% | ⚠️ Nảy 6 ✅, statLine `15% 40%` ✅, nhưng **statBadges `as 50%`, `ap 15`** và **desc vẫn ghi "20 + 50% SMPT"** → `[CODEX]` + xem "Anchor lệch" |
| ⬆️ Bùa Thăng Hoa (Talisman of Ascension) | **MỚI**: khi Thăng Hoa nhận 12 Hồi Năng Lượng | ⚠️ EN desc đã có ✅, **descVi thiếu "12 Hồi Năng Lượng"** → `[CODEX]` |
| ⬇️ Rìu Đại Mãng Xà (Titanic Hydra) | % SMCK cơ bản thành sát thương cộng thêm: 6% ⇒ 2% | ⚠️ desc/descVi vẫn ghi "2% Máu tối đa + **6%** SMCK" → `[CODEX]` |
| 🔄 Đao Tím (Wit's End) | Máu 400 ⇒ 300 · Hồi máu cộng thêm 30% ⇒ 25% · Sát thương phép cộng thêm 30/30/45/65/86/100 ⇒ 30/30/55/75/95/115 | ⚠️ Hồi máu 25% ✅, statLine `300` ✅, **statBadges `health 400`**, và **desc/descVi để "?" ở chỗ sát thương phép** → `[CODEX]` |

### ⚙️ Loại bỏ Tạo Tác — `[REPORT]`

- Vũ Khúc Tử Thần (Death's Defiance) — ✅ DB đã `visible: false`
- Thần Búa Tiến Công (Hullcrusher) — ✅ DB đã `visible: false` (vô hiệu hoá từ 18.1ah)
- Kính Nhắm Thiện Xạ (Sniper's Focus) — ✅ DB đã `visible: false`

---

## 6. Thần Không Gian (Set 17) — `[REPORT]`

- Twisted Fate: chỉ trong vòng 1-2, số lần tung xúc xắc tối thiểu được đặt là 5.
- Milio — Năng Lượng: 0/30 ⇒ 0/40

> `[SKIP]` codex: đây là tướng Set 17, không nằm trong codex Set 18. Chỉ hiển thị trên `/patch` như một entry cơ chế.

---

## 7. Ghi chú vận hành / hiệu năng — `[SKIP]`

Các mục sau chỉ mang tính thông báo, không phải thay đổi gameplay, nên không lên `/patch`:

- Ghi chú hiệu năng khi ra mắt (bug, thời gian tải, ping & bản đồ nhỏ tạm gỡ, theo dõi trận bạn bè chưa có, dung lượng bản cập nhật lớn, Hiệu Ứng Kết Liễu tạm hiển thị dạng video trên Thủy Thần, vật phẩm trang trí chuyển dần).
- Cấu hình tối thiểu: PC Windows 10 (19041+), DirectX 11 (Feature Level 4.3), Shader Model 5. Bỏ hỗ trợ iOS 2GB và Android 2/3GB.
- Lumie Vinh Quang cho người đạt Bậc Vàng+ Xếp Hạng/Cặp Đôi Hoàn Hảo mùa Thần Không Gian.
- Danh sách vật phẩm trang trí (Sân Đấu / Chưởng Lực / Chiến Thuật Gia) — hàng trăm mục, không thuộc phạm vi codex hay patch board.
- Danh sách "Các chiến hữu bên thứ ba".

---

## 8. Anchor lệch — ĐÃ CHỐT

Bốn mục dưới đây có số "from" trong patch note **không khớp** giá trị thật trong DB. Đã đối chiếu ngược `pbe-notes/*.md` và các draft cũ, không tìm thấy bản vá PBE nào đã đổi các giá trị này. Người dùng đã quyết định từng mục (26/08/2026):

1. **Gói Đăng Ký Hạng Sang (Luxury Subscription)** — patch: Vàng `7 ⇒ 3`. DB ghi mô tả "…1 tướng 1 vàng 2 sao và **5 vàng**".
   → **CHỐT:** ghi `7 -> 3`. Patch report hiện `7 ⇒ 3`, DB ghi đè về `3 vàng`.

2. **Đá Hắc Hóa (Blighting Jewel)** — patch: SMPT cơ bản `60% ⇒ 30%`. DB: `statBadges.ap = 60` (khớp "from").
   → **CHỐT:** đặt `statBadges.ap = 30` (có assert `from = 60`). Đã soát lại các cột còn lại theo yêu cầu:
   - `description` / `descriptionVi`: **đã đúng bản sau vá** — "giảm Kháng Phép đi 6", "cho chủ sở hữu **4** Năng Lượng" khớp `to` của patch (`2 ⇒ 4`). Không cần đổi.
   - `statLine = "35% 4"`: token `4` khớp đúng phần Năng Lượng ở mô tả ✅, nhưng token `35%` **không khớp cả `60` lẫn `30`**. → không đụng vào. ⚠️ Cần bạn biết: nếu tin `statLine` là bản scrape mới nhất thì SMPT thật có thể là `35%` chứ không phải `30%` như patch note ghi.
   - `statBadges.manaregen = "2%"`: nhiều khả năng là **scrape nhầm** từ giá trị CŨ "Mana gained at 0 MR: 2" (vốn là hiệu ứng trong mô tả, không phải chỉ số hồi năng lượng). → không tự ý xoá, chờ bạn quyết.

3. **Dao Điện Statikk (Statikk Shiv)** — patch: Sát thương cơ bản `30 ⇒ 15`, SMPT tia sét `50% ⇒ 35%`. DB desc ghi `"20 + 50%..."`.
   → **CHỐT — làm hai bước tường minh trong script:**
   - Bước 1: `20 + 50%` → `30 + 50%` (đưa DB về đúng giá trị TRƯỚC bản vá, khớp "from" của patch note).
   - Bước 2: `30 + 50%` → `15 + 35%` (áp bản vá).
   - Cả hai bước đều dùng `replaceExact` có assert, dry-run pass.

4. **Đao Tím (Wit's End)** — desc EN/VI đang để `"?"` ở vị trí sát thương phép cộng thêm (lỗi scrape từ trước, không phải do patch này).
   → **CHỐT:** thay `?` bằng dãy mới `30/30/55/75/95/115`.

---

## 8b. Rà soát bản dịch `set18_champions` / `set18_traits` / `set18_wisps`

Yêu cầu bổ sung (26/08/2026): hoàn thiện bản dịch cho ba bảng này. Đã rà soát toàn bộ, kể cả các field lồng nhau. Script: `scripts/db/fix-vi-gaps-set18-traits-wisps.ts` (tách riêng khỏi script bản vá — đây là lỗ hổng dữ liệu có sẵn, không phải nội dung của 18.1).

**Nguồn:** `Set18/data/metatft_set18_lookup_vi_vn.json` (bản dịch chính thức của Riot, trích từ client) và `Set18/data/metatft_set18_wisps.json`.

> ⚠️ `metatft_set18_wisps.json` **lệch hàng tên tiếng Anh** — vd hàng `name_en: "Bear's Visit"` lại mang `name_vi: "Bậc Thầy Thuật Sư"`. Mọi tra cứu đều khớp theo `name_vi` ↔ `nameVi`. Nếu tra theo `name_en` thì **12/15 mục sẽ gắn nhầm nội dung**.

### `set18_champions` (65 dòng) — KHÔNG có lỗ hổng ✅

Đã soát `abilityVi`, `abilityNameVi`, và `forms[].abilityHtmlVi` của cả 6 tướng nhiều dạng. Không dòng nào còn nguyên tiếng Anh hay trùng khít bản EN. Không cần ghi gì.

### `set18_traits` (36 dòng) — 2 sửa

3 tộc hệ có `description`/`descriptionVi` **rỗng**: Đao Phủ (Executioner), Quái Rừng (Riftbeast), Khắc Tinh (Rival). Đây **không phải lỗi dịch** — trong dữ liệu game gốc cả ba đều có `desc: null`, phần chú giải nằm ở `postTierDesc`, tương ứng cột `note` của bảng.

| Tộc hệ | Sửa |
|---|---|
| Đao Phủ (Executioner) | Thuật ngữ `Precision` đang dịch là **"Chính Xác"**, bản chính thức là **"Chuẩn Xác"** — sửa ở cả `note` và `breakpointDetails[0].bullet.textVi`. `note` lấy nguyên văn bản VI chính thức. |
| Khắc Tinh (Rival) | `note` đang trống → thêm "Chỉ áp dụng cho tướng Khắc Tinh mạnh nhất của bạn." (bản VI chính thức của `<Rules>Only applies to your strongest Rival.</>`) |
| Quái Rừng (Riftbeast) | **Không làm được** — `postTierDesc` trong dữ liệu game là placeholder chưa resolve `{Set18.Trait.Riftbeast.ShopTooltip}`. Không có câu chú giải thật để điền, không tự viết. |

Ghi chú thuật ngữ: "Chuẩn Xác" là đúng, xác nhận ở 2 nguồn độc lập — (1) `postTierDesc` bản VI của Riot, (2) chính patch note 18.1: *"Chuẩn Xác và Uyển Chuyển đã được đổi tên thành Ân Huệ Thách Đấu … do 'Chuẩn Xác' cũng là một từ khóa dùng cho cơ chế kỹ năng gây chí mạng."* Toàn bộ phần còn lại của codex đã dùng "Chuẩn Xác" (30 chỗ), chỉ Đao Phủ còn lệch (2 chỗ).

### `set18_wisps` (177 dòng) — 5 sửa

| Tinh Linh | Sửa | Nguồn |
|---|---|---|
| Chủ Nghĩa Hoàn Hảo (Idle Craftsman) | Thêm `blossomUpgradeDescriptionVi` | metatft, khớp theo `name_vi` |
| Nhịn Nhục Để Lớn Mạnh (Propagate) | Thêm `blossomUpgradeDescriptionVi` | metatft, khớp theo `name_vi` |
| Ấn Ma Mị (Phantom Emblem) | Thêm `blossomUpgradeDescriptionVi` | metatft, khớp theo `name_vi` |
| Hero Of Prophecy | `nameVi` → **"Anh Hùng Tiên Tri"**, `descriptionVi` → "Nhận 1 tướng 5 vàng. Nhận lại tướng đó mỗi vòng đấu MÃI MÃI." | **Dịch tay** — Riot chưa localize (1 trong đúng 2 charm còn tiếng Anh trên tổng 370 ở bản `vi_vn` của chính Riot). Theo tiền lệ Curio Cart → "Quầy Đồ Lạ" (`fix-curiocart-vi.ts`, 07/08/2026) |
| Beggar's Wisp | `nameVi` → **"Tinh Linh Hành Khất"** | **Dịch tay** — không có trong nguồn metatft (tạo tay ở PBE 18.1ah từ ảnh Truexy) |

**Cố ý bỏ qua (thiếu nguồn, không tự bịa):**

- 12 Tinh Linh còn thiếu `blossomUpgradeDescriptionVi`: Nguyên Phân, Hổ Đến Thăm, Thêm bốn, Quầy Đồ Lạ, Tung Xu Liên Hoàn, Thương Nhân Du Hành, Hạt Giống Hoa Sinh Mệnh, Hạt Cây Vỏ Đá, Ba Chúng Tôi, Ngựa Ghé Thăm, Rùa Ghé Thăm, Hero Of Prophecy. Tra theo `name_vi` thì nguồn đều trả `null` — **nguồn không có nội dung**, không phải chưa dịch.
- `Beggar's Wisp.appearsVi` vẫn là "Xuất hiện: chưa có dữ liệu" — Tinh Linh này không tồn tại trong metatft (đã dò cả 176 dòng), không có mốc xuất hiện để điền.

---

## 9. Tổng kết phạm vi ghi DB

**Patch report** (`scripts/db/drafts/patch-tft18-1-live.ts`): 1 report mới, các entry hệ thống + nâng cấp + trang bị + Set 17.

**Codex sync** (`scripts/db/apply-live-balance-tft18-1.ts`):

- `set18_augments`: Backline Blueprint (VI), Frontline Foundation (VI), Birthday Reunion (VI), Challenger's Grace (nameVi), Healing Orbs I + II (EN/VI), Luxury Subscription (EN/VI — anchor lệch).
- `set18_items`: Radiant Hand of Justice (descVi), Forbidden Idol (descVi), Manazane (statBadges), Blighting Jewel (statBadges), Fishbones (descVi), Hellfire Hatchet (statBadges), Rapid Firecannon (statBadges), Silvermere Dawn (statBadges), Statikk Shiv (statBadges + desc), Talisman of Ascension (descVi), Titanic Hydra (desc/descVi), Wit's End (statBadges + desc/descVi).
- Không đụng `set18_champions`, `set18_traits`, `set18_wisps` — bản vá không có thay đổi số liệu cho ba bảng này.
