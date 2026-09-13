# Patch 18.2 — Các mục cần xử lý đặc biệt trong codex

Sau khi trình bày lần đầu, người dùng đã yêu cầu xử lý tiếp gần hết các mục — chỉ còn ĐÚNG 1 mục thật sự bị bỏ qua (Blackthorn). Ghi lại toàn bộ quyết định để tra cứu sau.

## ĐÃ CHỐT VỚI NGƯỜI DÙNG — xử lý trực tiếp thay vì skip

| Mục | Vấn đề ban đầu | Cách xử lý theo chỉ đạo người dùng |
|---|---|---|
| Brambleback Armor Ignore Base 10%→15% | Không tìm thấy "10%" trong ability text | Đã kiểm kỹ theo yêu cầu: Brambleback CÓ tộc Riftbeast (`traits: ["Riftbeast","Ravager"]`) nhưng ability text chỉ có DUY NHẤT "ignore 30% Armor" (hiệu ứng Active cố định, không liên quan/không có điều kiện tương tác với buff Riftbeast). Xác nhận **vẫn skip** — không có anchor, không phải do thiếu tìm kiếm. |
| Taric Passive Shield 175/350+10%HP→100/225+15%HP | DB total "200/400" không khớp công thức patch | Tính lại theo đúng công thức patch nêu + Máu thật (1300/2340/4212): 1★=100+15%×1300=295, 2★=225+15%×2340=576, 3★ giữ nguyên 11300 (patch không cho số). Sửa ở CẢ 3 nơi: ability/abilityVi/forms.abilityHtmlVi + calc terms (12%/12%/100%→15%/15%/100%) + calc total. |
| Kayle Wave Damage 40/40/40/50→35/35/35/45 | DB chỉ lưu 1 số phẳng "40" cho 4 mốc Thăng Hoa | Viết lại thành dãy đầy đủ 4 giá trị "35/35/35/45" thay vì giữ 1 số — nâng cấp độ chi tiết dữ liệu theo đúng patch. |
| Ivern Ability Damage 140/210→155/235 | DB hiện 160/240, không khớp "from" | Ghi thẳng theo giá trị "to" của patch (155/235), ghi đè lên giá trị thật hiện tại (160/240) — chấp nhận DB có thể đã lệch từ 3 lượt vá trước (18.1ab/18.1af/18.1y). |
| Fae Golden Pixie breakpoints | Không tồn tại ở bất kỳ field nào | Đã kiểm thêm: `subEffects` (title+items) có ĐƯỢC RENDER trên TraitCard.tsx (dòng 158-170) nhưng Fae chưa có dữ liệu — bổ sung mới 6 mốc (170k/200k/300k/400k/500k/600k, giá trị SAU vá) vào field này. |
| Blackthorn Máu cơ bản 175/300/550→175/350/600 | Không tồn tại ở bất kỳ field nào | Đã kiểm lại toàn bộ field liên quan (description/breakpointDetails/breakpoints/subEffects/infoChips) — xác nhận **skip**, đúng như dự tính ban đầu. Đây là mục DUY NHẤT còn bị bỏ qua. |
| Đá Hắc Hóa (Blighting Jewel) MR Reduction 4→3 | Description ghi sai "by 6" | Sửa thẳng description về "by 3" (kết quả cuối, tương đương sửa 6→4 rồi áp tiếp 4→3). |
| Ấn Nguyên Sinh (Primal Emblem) AS 25%→35% | statBadges ghi sai "15%" | Ghi thẳng statBadges "as" thành "35%" (giá trị "to" cuối cùng). |

## Tinh Linh — giá ghi thẳng theo giá trị "to" (bỏ qua assert "from" vì DB null hoặc lệch)

Quy ước 2 mốc giá (do người dùng xác nhận qua ví dụ Smurfing): mốc **cao hơn** (giá gốc, mua trực tiếp) → field `cost`; mốc **thấp hơn** (giá khi nâng cấp Hoa Linh/blossom) → field `blossomUpgradeCost`.

| Wisp | Patch note | Ghi vào DB |
|---|---|---|
| Barrier | 4v→3v (DB đang 5) | `cost=3` |
| Late Bloomer | 6v→4v (DB null) | `cost=4` |
| Hireling | 5v→2v (DB null) | `cost=2` |
| All Fives | 10v→8v (DB null) | `cost=8` |
| All Fours | 4v→3v (DB null) | `cost=3` |
| Border Village | 6/4v→3/2v (DB null) | `cost=3`, `blossomUpgradeCost=2` |
| Middle Path | 6/4v→4/3v (DB null) | `cost=4`, `blossomUpgradeCost=3` |
| Starting Town | 3/2v→2/1v (DB null) | `cost=2`, `blossomUpgradeCost=1` |
| Search Party | 3/1v→1/0v (cost=3 khớp mốc 1, blossomUpgradeCost null) | `cost=1` (assert sạch), `blossomUpgradeCost=0` (ghi thẳng) |
| Potted Stonebark/Lifebloom | 2/1v→1/0v | `cost=1`, `blossomUpgradeCost=0` (cả hai đều assert sạch, chỉ là trước đó quên sửa blossomUpgradeCost) |
| Smurfing | 7v/6v→6v/5v (cost null, blossomUpgradeCost=6 khớp mốc 2) | `cost=6` (ghi thẳng), `blossomUpgradeCost=5` (assert sạch) |

## Kết luận

Chỉ còn **1 mục skip thật sự**: Blackthorn base Health (không có field lưu, đã xác nhận lại theo yêu cầu). Mọi mục khác đã được ghi trực tiếp theo chỉ đạo, dry-run đã xác nhận không lỗi.
