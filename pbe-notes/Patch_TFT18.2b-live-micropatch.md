# Patch TFT 18.2b — Micropatch LIVE (nerf Fast 9 + reroll)

**Nguồn gốc:**
- Thông báo trước: <https://x.com/TFT/status/2099662661470519763> (@TFT, 7:52 AM 15/09/2026 giờ trình duyệt)
- Xác nhận live: <https://x.com/TFT/status/2099889251932655797> — "Patch 18.2 B is now live in All Riot Regions!" (10:53 PM 15/09/2026)
- Cả hai chỉ có text, KHÔNG có ảnh bảng số liệu (khác Truexy PBE). Link trong tweet trỏ về trang tin Riot 18.2 nhưng trang đó KHÔNG có nội dung B-patch (đã xác minh).
- Số liệu chi tiết lấy từ 2 nguồn thứ cấp đối chiếu chéo: **Hotspawn.com** (bài báo đầy đủ) và **tftips.app/en/patches/18.2b** (diff dữ liệu game thật) — khớp nhau gần như hoàn toàn, người dùng đã xác nhận điểm sai lệch duy nhất (Brambleback Armor Ignore mốc 3 sao = 90).

**Thời điểm:** live 15/09/2026 giờ Mỹ.
**Phiên bản dùng cho site:** `Live 15/09/2026 (18.2b)`.
**Baseline trước đó:** `Live 09/09/2026 (18.2)`.

Quy ước: ▲ buff · ▼ nerf · ◆ cơ chế/không phải buff-nerf thuần.

## Bối cảnh (nguyên văn @TFT)

> Tomorrow morning, our 18.2 B-patch will go live, which is set out to nerf the dominant fast 9 strategies by rolling back some of our 18.1 buffs to them, while preemptively nerfing reroll comps that are already powerful despite the meta favoring Legendary units.
>
> In addition to balance changes, we've packed the patch with bug fixes and a few performance/stability improvements.

Hai trục nerf: **Fast 9** (tăng lại chi phí lên cấp 9/10, đảo một phần buff của 18.2) · **Reroll mạnh** (Camille/LeBlanc/Teemo là carry reroll phổ biến).

## Hệ thống (không gắn entity, không có bảng DB — chỉ patch report, đúng tiền lệ `patch-tft18-2.ts`)

| Thay đổi | Từ | Đến | Hướng |
|---|---|---|---|
| XP cấp 8→9 | 64 | 68 | ▼ |
| XP cấp 9→10 | 64 | 68 | ▼ |

Đảo ngược đúng phần buff mà bản 18.2 (`patch-tft18-2.ts`) từng đưa cấp 8→9 và 9→10 từ 68 xuống 64 — xác nhận qua chính draft cũ.

## Tướng — kết quả đối chiếu DB (6 mục theo tftips, nhưng chỉ 2 mục có anchor sạch)

| Tướng | Giá | Patch note ghi | DB thật hiện tại | Kết luận |
|---|---|---|---|---|
| **Camille** | 1 | Sát thương chiêu 160/240/410/700 ⇒ 150/225/375/640 AD | `ability`/`abilityVi`/`forms[0].abilityHtmlVi` = tổng **160/240/410** (khớp "from", bỏ mốc 4 vì DB không lưu); `calcs[0].terms` = `150/225/385×AD + 10/15/25×AP` | ✓ **Anchor sạch.** Tổng mới 150/225/375. Suy ra hệ số AD mới = 140/210/350 (giữ nguyên phần AP 10/15/25, chưa được Riot công bố riêng — xem mục quyết định bên dưới). |
| **Teemo** | 2 | Sát thương nấm nhỏ 60/90/135 ⇒ 55/82/130 AP | `ability`/`abilityVi`/`forms[0].abilityHtmlVi` chứa đúng chuỗi **60/90/135** (duy nhất, không trùng với "135/200/310" của nấm to) | ✓ **Anchor sạch.** Thay thẳng bằng `replaceExact`. |
| **LeBlanc** | 2 | Tỉ lệ tạo bản sao 10/15/40% ⇒ 10/15/30% | `ability` chỉ ghi **"10% chance ... increased by 4% per takedown"** — không có mảng 3 mốc sao nào trong text hay `calcs` (rỗng `[]`) | ✗ **Không có anchor.** Số "40%"/"30%" không tồn tại ở bất kỳ field nào hiện có — đây là hạn chế dữ liệu có sẵn từ trước, không phải do bản vá này. |
| **Brambleback** | 4 | Armor Ignore mốc 3 sao 85% ⇒ 90% (người dùng đã xác nhận) | `ability`/`abilityHtmlVi` ghi **"ignore 30% Armor"** (hằng số, không phải mảng theo sao); `calcs[0].total` = `"30%"` | ✗ **Cấu trúc DB khác hẳn** — không phải lệch số, mà lệch MÔ HÌNH dữ liệu (DB coi Armor Ignore là hằng số 30%, không tách theo 3 mốc sao như tftips mô tả 45/45/85). Không có số "85" hay "90" ở đâu trong DB hiện tại. |
| **Ashe** | 5 | DoT (Damage over time) 5/8 AD ⇒ 9/14 AD; Trail Duration 4s ⇒ 3s (mốc 1-2 sao) | `ability` ghi Trail Duration là hằng số **"4 seconds"** (không phải mảng "4/4/20"); `calcs[0]` = `25/38/200×AD + 1(flat)` → tổng **30/46/220** — không khớp bất kỳ con số nào trong patch note (5,8,9,14) hoặc tftips (5/8/200 → 9/14/200) | ✗ **Không tìm được anchor khớp.** Số liệu DB và cả 2 nguồn ngoài dùng đơn vị/công thức hoàn toàn khác nhau, không suy ra được phép quy đổi an toàn. |
| **Maokai** | 5 | Max Mana 90 ⇒ 100 (mana khởi đầu 30 giữ nguyên) | `mana` (chuỗi top-level) = **"30 / 90"** (khớp "from" ở cả 2 số!) NHƯNG `stats.mana` (top-level) và `forms[0].mana`/`forms[0].stats.mana` đã là **[40, 100]** — tức là max mana ở field cấu trúc ĐÃ SẴN 100 (giá trị "to"), còn field chuỗi hiển thị top-level thì vẫn ở "from" | ⚠ **Nội bộ DB đã tự mâu thuẫn từ trước** (chuỗi `mana` top-level lệch với `stats.mana`/`forms`), không phải do 18.2b. Có thể chỉ cần sửa chuỗi `mana` top-level "30/90" → "30/100" để đồng bộ với `stats`/`forms` đã đúng sẵn. |

**Chỉ 2/6 tướng (Camille, Teemo) có anchor sạch hoàn toàn.** 4 tướng còn lại đều là kiểu lệch khác nhau: LeBlanc/Ashe thiếu hẳn dữ liệu cấu trúc, Brambleback lệch mô hình (hằng số vs mảng sao), Maokai lệch nội bộ giữa 2 field. Đây có vẻ là drift dữ liệu **có sẵn từ trước** bản vá này (giống ghi chú "Ghi chú lệch dữ liệu có sẵn từ trước" ở 18.1d) — không phải lỗi số liệu patch note.

## Tộc/Hệ — Bounty Seeker (Draven)

DB lưu bounties dạng mảng object `{mission, reward, difficulty}` (tiếng Việt, đã dịch sẵn) + `description` (tiếng Anh thô). Cả 5 mục đổi số đều có anchor sạch, xác nhận bằng cả hai field:

| Bounty | Từ | Đến | Anchor |
|---|---|---|---|
| Kills → 12 vàng | 6 | 8 | `bounties[].mission` = "Draven có được 6 mạng hạ gục." (duy nhất) |
| Casts → 2 tướng 4-cost | 5 | 6 | `bounties[].mission` = "Draven tung chiêu 5 lần." (duy nhất) |
| Attacks → 1 tướng 5-cost | 50 | 60 | `bounties[].mission` = "Draven tung đòn đánh 50 lần." (duy nhất) |
| Damage → 7 vàng | 8000 | 10000 | `bounties[].mission` = "Draven gây 8000 sát thương." (duy nhất) |
| Casts 8 → reroll | 10 rerolls | 6 rerolls | `bounties[].reward` = "10 lượt đổi cửa hàng" gắn với mission "Draven tung chiêu 8 lần." |

Không đụng các bounty khác (35000 dmg→BF Sword, 15 kills→item, v.v.) — patch note không nhắc tới, giữ nguyên.

## Nâng Cấp

| Nâng Cấp | Thay đổi | DB hiện tại | Kết luận |
|---|---|---|---|
| Expected Unexpectedness | Được thêm lại vào bể (Added) | **Không tồn tại trong DB** (0 kết quả tìm theo tên ở `set18_augments`) | Patch-report-only, dạng `mechanic`, không entityId — không thể sync codex vì chưa có bản ghi. |
| Nesting Dolls (3 biến thể: base/+/++) | Bị gỡ khỏi bể do lỗi (Removed) | Có `visible: true` ở cả 3 dòng | Có khả năng `visible` chính là cờ pool-status, nhưng **chưa chắc chắn semantics** (có thể chỉ điều khiển hiển thị trang codex công khai, không phải trạng thái trong bể thật). Cần quyết định trước khi đụng field này. |
| Booster Pack / Booster Pack+ / Booster Pack++ / Warpath — bảng tỉ lệ | Rất nhiều dòng đổi tỉ lệ thưởng | Chưa kiểm | **Đề xuất bỏ ngoài phạm vi** patch report — quá dày, không có giá trị tra cứu nhanh, giống tiền lệ 18.2 đã loại "Loot Orb reward table" khỏi entries. |

## Tinh Linh — Polymorph / Minor Polymorph / Major Polymorph

Patch note: thêm điều kiện "chỉ xuất hiện trong 3 giây đầu giai đoạn chuẩn bị". DB hiện có field `conditionsVi` (mảng điều kiện) và `appearsStart`/`appearsEnd`, nhưng **không có field nào biểu diễn giới hạn thời gian trong vòng**. Đây là điều kiện hoàn toàn mới, không phải sửa giá trị cũ — nếu đồng bộ codex sẽ là THÊM một dòng vào `conditionsVi`, không phải `replaceExact`.

## Phạm vi đề xuất cho PatchReport (chờ xác nhận)

**Đưa vào patch report (8 mục xác định số liệu, xem câu hỏi bên dưới cho phần đồng bộ codex):**
1. Hệ thống: XP cấp 8→9, 9→10 (patch-report-only, không có bảng DB)
2. Camille — nerf sát thương chiêu
3. Teemo — nerf sát thương nấm nhỏ
4. LeBlanc — nerf tỉ lệ tạo bản sao (patch-report-only do thiếu anchor)
5. Brambleback — sửa lỗi Armor Ignore (patch-report-only do lệch mô hình dữ liệu)
6. Ashe — chỉnh Trail Duration + DoT (patch-report-only do không khớp anchor)
7. Maokai — tăng Max Mana (patch-report + có thể sync chuỗi `mana` top-level)
8. Bounty Seeker (Draven) — 5 mục bounty (anchor sạch, sync codex được)

**Cố ý loại khỏi phạm vi:**
- Augment Booster Pack/Warpath reward-table (quá dày, giống tiền lệ 18.2)
- Bugfix/perf improvements không có số liệu (nêu trong caption @TFT nhưng không chi tiết)

**Nâng Cấp + Tinh Linh Polymorph:** đưa vào patch report dạng `mechanic` (giống "Double Trouble"/"Hullcrusher" ở 18.2), không sync codex trừ khi người dùng xác nhận `visible` là đúng cờ cho Nesting Dolls.
