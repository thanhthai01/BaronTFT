# TFT 18.1ah — Các mục cần xử lý riêng ngoài luồng `replaceExact`

Kèm theo [Patch_TFT18.1ah-PBE-pre-launch-patch.md](Patch_TFT18.1ah-PBE-pre-launch-patch.md).
Bản đầu của file này liệt kê các mục "không có anchor". Sau vòng duyệt tay, người dùng đã quyết từng mục — dưới đây là trạng thái cuối.

## A. Đã xử lý theo chỉ đạo người dùng

### A1. Tà Thuật (Dark Ritual) — 7 mốc AP đổi thưởng → **bổ sung text mới**
Mô tả gốc không chứa bất kỳ con số cashout nào nên không có gì để thay. Theo chỉ đạo, **nối thêm** một câu liệt kê 7 mốc sau bản vá vào cả `description` và `descriptionVi`:
- EN: `Ability Power per cashout: 5 / 12 / 40 / 60 / 100 / 175 / 250.`
- VI: `Sức Mạnh Phép Thuật mỗi lần đổi thưởng: 5 / 12 / 40 / 60 / 100 / 175 / 250.`

Hàm `appendAugmentText` idempotent — chạy lại không nhân đôi câu.

### A2. Hóa Thù Thành Bạn (Unrivaled) — Kha'Zix Mana Share → **bổ sung text mới, cả 2 lõi**
Áp cho **cả hai bản ghi**: `augment:da_18_rivalsaugment` và `augment:da_18_rivalsaugmentplus`.
- EN: `Kha'Zix Mana Share: 70%.`
- VI: `Tỉ lệ chia năng lượng của Kha'Zix: 70%.`

Ảnh gốc chỉ cho con số đích, không mô tả cơ chế hoạt động, nên câu bổ sung dừng đúng ở mức đó — không suy diễn thêm.

### A3. Beggar's Wisp → **tạo mới bản ghi**
Không tồn tại trong DB (đã dò cả 176 dòng theo tên EN, tên VI và theo mô tả). Tạo mới với đúng phần thông tin patch note cho biết:

| Trường | Giá trị | Nguồn |
|---|---|---|
| `id` | `wisp:beggars-wisp` | đặt theo quy ước |
| `name` | `Beggar's Wisp` | ảnh patch |
| `nameVi` | `Beggar's Wisp` | **giữ nguyên tên gốc** — chưa có bản dịch chính thức, không tự dịch |
| `description` / `descriptionVi` | `Gain 3 gold.` / `Nhận 3 vàng.` | giá trị thường **sau** vá |
| `blossomUpgradeDescriptionVi` | `Nhận 5 vàng.` | giá trị nâng cấp **sau** vá (`3/6` → `3/5`) |
| `category` / `tier` / `cost` | `GoldXP` / `1` / `0` | suy từ nhóm Tinh Linh cho vàng cùng loại (Coin Flip, Truce) |
| `appearsVi` | `Xuất hiện: chưa có dữ liệu` | patch note không nói |
| `conditionsVi` | `[]` | patch note không nói |

Khi có lần scrape mới đầy đủ, các trường suy đoán (`category`/`tier`/`cost`/`appears`) và `nameVi` nên được ghi đè lại.

### A4. Vô hiệu hoá 3 Augment + 2 Tinh Linh → **thêm cột `visible` vào DB**
Migration mới: [`0006_set18_augments_wisps_visibility.sql`](../src/db/migrations/0006_set18_augments_wisps_visibility.sql) — thêm `visible boolean NOT NULL DEFAULT true` cho `set18_augments` và `set18_wisps`, khớp cột `visible` đã có sẵn ở `set18_items` (migration 0003).

**Vì sao không tái dùng `set18_augments.is_published` có sẵn:** `pullAugments()` lọc theo `is_published` **ngay ở tầng pull**, mà rows sau lọc lại chính là nguồn dựng `set18-entity-index.ts`. Ẩn bằng `is_published` sẽ làm mục đó biến mất khỏi entity index → `/patch` mất tên tiếng Việt + icon của **đúng mục vừa bị gỡ**, tức là thông tin người đọc bản vá cần thấy nhất. `visible` được pull ra generated file và chỉ lọc ở tầng UI codex nên entity index vẫn đầy đủ.

Đã sửa kèm: `src/db/schema.ts`, `src/content/set18/set18-types.ts`, và `Set18Codex.tsx` (lọc `visible !== false` ở 3 chỗ nạp dữ liệu; `buildSlugRefMap` vẫn nhận danh sách **đầy đủ** để link cũ không chết).

Đặt `visible = false` cho: Double Trouble, Calculated Loss, Construct a Companion, Clone Companion, Memorial Dummy, và Hullcrusher (`set18_items`).

## B. Xác nhận bỏ qua

### B1. Gai Đen (Blackthorn) — Hệ số Hiến Tế (1★5v `1.5→1.4`, 2★4v `2.25→2.1`, 2★3v `1.8→1.75`)
`breakpointDetails` chỉ lưu `TankSacrificeHPBonus`, `TankSacrificeResistBonus`, `ADSacrifice*`, `APSacrifice*`, `SacrificeTeamHealth`, `SacrificeStatsIncreasePercent` — **không có field nào cho hệ số nhân theo cấp sao/giá tướng**.
→ Người dùng xác nhận **bỏ qua** (hằng số nội bộ, codex chưa từng hiển thị).
*Phần Giáp/Kháng Phép `17 → 15` thì có anchor và **đã áp** ở 2 mốc (2 và 4).*

### B2. Lux — Tốc Độ Đánh Nguyên Sinh `50% → 60%`
Đã kiểm tra thêm theo yêu cầu, cả hai nơi:
- `forms[8] "Nguyên Sinh"` của Lux: *"Nhận **60%** Tốc Độ Đánh trong 6 giây sau khi thi triển"* — **đã là giá trị đích**.
- Trait `Primal` (Nguyên Sinh): *"After 6 seconds, Primal champions gain **30%** Attack Speed and your team gains **15%** Attack Speed"* — là chỉ số của tộc hệ, không phải của Lux, và không có con số `50%` nào.

→ **Không nơi nào trong DB chứa `50%`**, không có gì để đổi. Mục này vẫn hiện đầy đủ trên `/patch`.

## C. Điểm cần biết về cách ghi (đã xử lý, không cần quyết)

| Mục | Xử lý |
|---|---|
| **Caitlyn** | Patch ghi `200/300/500 AD` = hệ số trong `calcs[].terms`, còn text chiêu hiển thị `220/330/545` là **tổng đã tính**. Công thức: `total = (200/300/500 × AD) + (20/30/45 × AP)`, AD/AP mặc định ×1 → `200+20=220` ✓. Đổi terms sang `190/285/470` thì tổng mới là `210/315/515`. Ghi cả hai. |
| **Azir** | Patch ghi 4 mốc `48/72/115/205`, DB chỉ lưu 3 mốc (1/2/3 sao). Chỉ đổi 3 mốc đầu → `40/60/96`. Mốc 4 sao (`165`) không có chỗ lưu. |
| **Diana** | Patch 3 mốc, DB lưu `65/100/155/270` (có mốc 4 sao). Chỉ đổi 3 mốc đầu → `70/105/170/270`. Lá chắn ghi `150/275/400`, **bỏ chữ "AP"** theo đính chính của tác giả. |
| **Raptor** | `abilityVi` + `forms[].abilityHtmlVi` chứa đúng `27/41/65` (khớp "from"), nhưng `ability` (EN) là `25/38/60` — lệch có sẵn. Ghi cả hai về `20/30/48`. |
| **Raptor (AD)** | `forms[0].stats.attackDamage[0] = 65` khớp "from", nhưng `stats.attackDamage[0]` cấp trên là `60` — lệch do 18.1af chỉ sửa `forms`, bỏ sót `stats`. Ghi **cả hai** về `50`. |
| **Leona / Elder Dragon** | Patch chỉ cho 1 con số (Máu `750`, Kháng `75`) trong khi DB lưu mảng 3 mốc sao. Theo tiền lệ Master Yi ở 18.1ae: **chỉ ghi mốc 1 sao**, không suy diễn mốc 2/3 sao. |
| **Wisp có mốc "thường/nâng cấp"** | Các số dạng `10/12`, `8/15%`, `100/175` = giá trị thường / sau nâng cấp Hoa Linh, nằm ở `description(Vi)` và `blossomUpgradeDescriptionVi`. Ghi cả hai. |
| **Abandon Ship** | Patch đổi Lượt đổi + XP nhưng **KHÔNG đổi Vàng** — giữ nguyên `10`/`12` vàng. |

## D. Giới hạn còn lại (không nằm trong bản vá này)

Trang codex **trang bị** hiện chưa đọc cờ `visible` ở đâu cả — `set18_items.visible` được `pull-set18.ts` xuất ra generated nhưng không component nào lọc theo nó. Nghĩa là Death's Defiance (gỡ ở 18.1af) và Hullcrusher (gỡ ở bản này) vẫn hiện trong danh sách trang bị dù cờ đã đúng. Đây là lỗ hổng **có sẵn từ 18.1af**, không phải do bản vá này gây ra, và nằm ngoài phạm vi đã duyệt — cần một lượt sửa UI riêng.
