# Patch TFT18.1aa (PBE) — Light pass, bug fixes (nháp, chưa duyệt)

> **Tên file tạm thời:** chưa rõ số patch chính thức theo Liquipedia. Bản trước là 18.1z (06/08), bản này tiếp theo trong cùng chu kỳ nên tạm gọi 18.1aa. Đổi tên file này khi có số phiên bản chính xác.

**Nguồn:** [@TheTruexy trên X](https://x.com/TheTruexy/status/2085809695017869378) — dev chính thức PBE.
**Thời điểm:** August 7th, 2026 - 13:00 PDT — "TheTruexy Patch Notes".

Truexy note kèm theo: bản PBE hôm nay nhẹ vì đội đang truy tìm vài lỗi gameplay nặng. Sẽ theo dõi qua cuối tuần, dự kiến có bản vá cân bằng lớn hơn vào thứ Hai. Đội cũng đang biết về vài lỗi liên quan tới Solar, Rengar, và Adaptors, hy vọng sửa được khi có thể.

Chú thích: ▲ = buff, ▼ = nerf, không có mũi tên = rework/cơ chế/bugfix.

---

## Balance

### Champions

#### 2 Cost

- ▲ **Caitlyn** (Enhanced)
  - Sát thương công cơ bản: 190/285/450 AD → 200/300/500 AD

#### 3 Cost

- ▼ **Raptor** (Mama Beak — tên chiêu/lore trong ability text `champion:tft18_raptor`, khớp bằng codex)
  - Giảm Giáp Alpha: 1 → 2
  - Sát thương phép (Tiny Beaks): 27/41/65 → 25/38/60
  - **Lưu ý đối chiếu codex:** ability text hiện tại của Raptor đã ghi "dealing 25/38/60 physical damage" — tức trường sát thương phép trong DB dường như đã ở giá trị "sau" patch, trong khi "reduces enemy Armor by 1" vẫn đang ở giá trị "trước" (1). Cần xác minh kỹ ở Bước 3 (dump dữ liệu thật trước khi sửa) — có thể chỉ cần áp phần Alpha Armor Reduction (1→2), bỏ qua phần sát thương phép nếu DB đã đúng.

#### 4 Cost

- **Malphite**
  - Tầm đánh chiêu (3 sao): 2 → 3 ô

#### 5 Cost

- ▲ **The Elder Dragon**
  - Sát thương công cơ bản gốc: 100 → 110
  - Sát thương phép: 200/300 → 250/375
  - Flame Breath giờ giảm 20% sát thương cho mỗi mục tiêu trúng đòn (tối thiểu 20%)
- ▲ **Maokai** (Enhanced)
  - Hồi máu theo AP: 300/400 → 330/400
  - Hồi máu theo % Máu tối đa còn thiếu: 8% → 10%

### Tộc Hệ

- ▼ **Blackthorn** — mốc 6 (đã đối chiếu codex: `breakpointDetails` mốc `"6"` đúng là cụm stat này — Health/AttackSpeed/AD/AP/Resists, không phải "6 mảnh" toàn đội)
  - Máu: 200 → 150
  - Tốc Đánh: 18% → 15%
  - Sát Thương/Sức Mạnh Phép: +18 → +15 (giá trị cộng thẳng, không phải %, dù patch note ghi chung "18% >>> 15%" cho cả 3 dòng)
  - Giáp/Kháng Phép: 15 → 10
- ▼ **Vanguard** — mốc 6
  - Khiên: 18/35/45% → 18/32/42% (mốc 6 đổi 45%→42%, mốc 2/4 giữ nguyên)
  - Chống Chịu (Durability, chỉ có ở mốc 6): 6% → 5%

### Trang bị (Ấn/Đá)

- ▼ **Brawler Emblem** (Ấn Đấu Sĩ) — Sát thương theo % Máu tối đa: 3% → 2.5%
- ▼ **Executioner Emblem** (Ấn Đao Phủ) — Tỉ lệ Chí Mạng: 35% → 20%; Sát thương Chí Mạng: 15% → 10%
- ▲ **Hunter Emblem** (Ấn Thợ Săn) — Sát thương công theo mỗi lượt hạ gục: 12% → 18%
- ▲ **Primal Emblem** (Ấn Nguyên Sinh) — Tốc Đánh: 15% → 25%
- ▲ **Ravager Emblem** (Ấn Tàn Phá) — Sát thương công/Sức mạnh phép: 15% → 20%
- ▲ **Blighting Jewel** (Đá Hắc Hóa) — Sức mạnh phép: 20% → 30%

### Linh Hỏa (Wisps)

- ▼ **Good Loss** (Thua Có Lời) — Kinh nghiệm mỗi lần thua: 6/8 XP → 4/6 XP

---

## Sửa Lỗi (Bugfixes)

- Vật trang trí Coven giờ đặt đúng vị trí trong chế độ Double Up.
- Hiệu ứng ăn mừng tộc hệ Eclipse không còn phát trên tất cả tướng hệ Lunar/Solar khi có người kích hoạt Eclipse.
- Tank phép không tiêu năng lượng (ví dụ cây Stonebark, hình nộm tập luyện) giờ có thuộc tính hút mục tiêu đúng, được ưu tiên hút mục tiêu như mọi tank khác.
- Sửa lỗi ô đồ trong tiệm bị đốt bởi Inferno thỉnh thoảng thành đồ 1 vàng.
- Kog'Maw trong Tocker's không còn bị khóa năng lượng.
- Curio và Peddler giờ đặt lựa chọn 0 vàng ở ô ngoài cùng bên phải, để nếu offer hết giờ bạn sẽ không bị trừ tiền cho món mình không chọn.
- Construct-a-Companion và Forge-a-Friend không còn tràn ra bàn đấu trong lúc combat.
- Nhận nâng cấp Destiny không còn tính là một lượt tiệm bổ sung cho nhịp Linh Hỏa (Wisp cadence).
- Sửa lỗi Golden Egg không bao giờ được chào bán.
- Đồng hồ đếm ngược Golden Egg giờ hiển thị đúng ở lượt đầu tiên.

---

## Ghi chú thêm (tweet gốc, không phải bảng số liệu)

Đội dev đang biết về một vài lỗi liên quan tới Solar, Rengar, và Adaptors, hy vọng sửa được khi có thể — chưa có chi tiết cụ thể nên không đưa vào bảng trên.
