# Patch TFT 18.1d — Micropatch cân bằng LIVE đầu tiên của Mùa 18

**Nguồn gốc:** <https://x.com/TheTruexy/status/2094595183572549650> — Truexy (dev TFT), đăng 01/09/2026 8:16 AM PDT, kèm ảnh bảng "18.1 Mid-Patch Balance Adjustments".
**Thời điểm:** vá lên live "later tonight" giờ Mỹ ⇒ rạng sáng **02/09/2026 giờ Việt Nam**.
**Phiên bản dùng cho site:** `Live 02/09/2026 (18.1d)`.
**Baseline trước đó:** `Live 26/08/2026 (18.1)`.
**Không có bài trên trang tin Riot** — B/C/D-patch của TFT chỉ công bố qua X, đã kiểm tra cả `en-us` và `vi-vn`.

Quy ước: ▲ buff · ▼ nerf · ◆ cơ chế/không phải buff-nerf thuần.

## Bối cảnh từ chính Truexy (nguyên văn)

> We're focusing on nerfing the overly consistent strategies that have some unhealthy gameplay patterns. Cassio/Fiddle dominating Stage 3/4 with cheap boards, Cinderling/Pebbles scaling into the lategame with 7 Riftbeast, and the Ahri/Morgana chipping the backline too quickly into combat.
>
> The meta is fairly good for an opening patch, but these comps put those B-tier or fringe champions on too tight of a timer, pushing them out of viability.
>
> Since this is mostly nerf-heavy, expect 18.2 to be mostly champion buffs (focusing on early game champions) and system adjustments like Artifacts/Wisps.

Ba trục nerf: **Cassiopeia/Fiddlesticks** ép Stage 3-4 bằng đội hình rẻ · **Cinderling/Pebbles** cuộn tuyết sang cuối ván bằng 7 Quái Rừng · **Ahri/Morgana** dọn hàng sau quá nhanh ngay đầu giao tranh.

## Tộc/Hệ

| Tộc/Hệ | entityId | Thay đổi | Hướng |
|---|---|---|---|
| Thực Vật (Flora Fatalis) | `trait:florafatalis` | Năng Lượng: 10 → 8 (mốc 1)<br>Hồi máu tối đa: 8% → 6% (mốc 2) | ▼ |
| Quái Rừng (Riftbeast) | `trait:riftbeast` | Chỉ số mốc 7: 6% → 5% (AD, AP, Tốc Độ Đánh) | ▼ |

Nerf Thực Vật là đòn gián tiếp vào Soraka/Fiddlesticks — đúng trục "Cassio/Fiddle" mà Truexy nêu.

## Tướng

| Tướng | entityId | Giá | Thay đổi | Hướng |
|---|---|---|---|---|
| Cinderling | `champion:tft18_cinderling` | 1 | Base AD: 45 → 40<br>Sát thương chiêu: 340/510/765/1300 → 310/465/700/1200 AD | ▼ |
| Cassiopeia | `champion:tft18_cassiopeia` | 3 | Sát thương chiêu: 440/660/1050 → 400/600/950 AP | ▼ |
| Master Yi | `champion:tft18_masteryi` | 3 | Giáp & Kháng Phép: 60 → 55 | ▼ |
| Ahri | `champion:tft18_ahri` | 4 | Sát thương chiêu: 450/675 → 425/640 AP | ▼ |
| Morgana | `champion:tft18_morgana` | 4 | Năng Lượng: 0/60 → 0/65 | ▼ |
| Amumu | `champion:tft18_amumu` | 4 | Năng Lượng: 30/140 → 30/125<br>Hồi máu theo % Máu tối đa: 2.2% → 2.5% | ▲ |
| Soraka | `champion:tft18_soraka` | 4 | Sát thương tinh tú đầu: 190/285 → 225/335 AP | ▲ |
| Draven | `champion:tft18_draven` | 5 | Năng Lượng: 0/120 → 0/110<br>Tốc Độ Đánh gốc: 0.8 → 0.85 | ▲ |
| The Elder Dragon | `champion:tft18_elderdragon` | 5 | Base AD: 115 → 125 | ▲ |
| Lux | `champion:tft18_lux` | 5 | Sát thương chiêu: 330/520 → 355/550 AP<br>Thưởng Mặt Trăng — Suy Yếu: 10% → 8% | ▲ kèm ▼ |

Lux là mục **duy nhất trộn cả hai hướng**: buff sát thương chiêu chung, nhưng nerf riêng phần thưởng dạng Mặt Trăng. Trên `/patch` gộp thành **một** entry Lux, không tách đôi.

## Trang bị / Nâng Cấp / Tinh Linh / Encounter

Ảnh gốc không có mục nào cho các nhóm này.

> Nguồn phụ tftips ghi nhận Nâng Cấp **Chế Tạo Bằng Hữu (Forge A Friend)** bị gỡ khỏi bể. Thay đổi này **không** xuất hiện trong ảnh gốc của Truexy ⇒ người dùng đã chốt **loại khỏi phạm vi 18.1d**.

## Thay đổi ngoài số liệu (Truexy nêu trong phần giải thích)

- Cải thiện độ mượt thao tác kéo-thả tướng.
- Nâng cấp công cụ xả particle ⇒ tăng hiệu năng cuối ván ở lúc chuyển vòng và Vòng Đi Chợ.
- Sửa lỗi Thích Ứng (Maladaptive): dùng Gậy Gỡ Trang Bị lên tướng Thích Ứng đã lên sao không còn bị trả về hệ số 1 sao.

Ba mục này thuộc dạng `mechanic`/`bugfix`, không có số liệu before/after.

## Sai lệch nguồn — đã xác minh và xử lý

1. **tftips bỏ sót hoàn toàn nerf Thực Vật.** Trang tộc/hệ của họ vẫn hiển thị `10 Năng Lượng / 8% máu` (giá trị trước vá) lúc kiểm tra 02/09/2026. Chỉ ảnh gốc Truexy có mục này ⇒ tin ảnh gốc.
2. **Cinderling có 4 mốc sao, tftips chỉ hiện 3** và làm tròn sai mốc 3 sao thành `770` (thật là `765`).
3. **Amumu**: Riot ghi theo `% Máu tối đa`; tftips render thành số tính sẵn theo AP ⇒ dùng bản gốc.
4. **Lux**: tftips tách nhầm thành 2 mục "Lux" và "Lux (Lunar)" ⇒ gộp lại.
5. **Loại tin sai**: một tweet tiếng Nhật dạng *dự kiến* (đăng trước khi vá lên) nhắc buff "AP Malphite / Ezreal" — không có trong danh sách chính thức.

## Đối chiếu DB — mục nào chỉ là patch report, mục nào cần sync codex

**Anchor khớp sạch, sync codex được ngay (8 mục):**

| Mục | Anchor trong DB | Trạng thái |
|---|---|---|
| Thực Vật — Năng Lượng | `breakpointDetails[threshold=1].bullet.values[row=Mana].value = "10"` | ✓ khớp |
| Thực Vật — Hồi máu | `breakpointDetails[threshold=2].bullet.values[row=PercentHeal].value = "8%"` | ✓ khớp |
| Quái Rừng — mốc 7 | `breakpointDetails[threshold=7]` rows `CapstoneAD/AP/Aspd` = `"6%"` | ✓ khớp |
| Cassiopeia | `440/660/1050` trong `ability`, `abilityVi`, `forms[0].abilityHtmlVi` | ✓ khớp |
| Master Yi | `stats.armor = 60`, `stats.magicResist = 60` (top-level + cả 2 form) | ✓ khớp |
| Ahri | `450/675/3500` trong `ability`, `abilityVi`, `forms[0].abilityHtmlVi` | ✓ khớp |
| Morgana | `stats.mana = [0,60]`, `mana = "0 / 60"` | ✓ khớp |
| Soraka | `190/285/1000` trong `ability`, `abilityVi`, `forms[0].abilityHtmlVi` | ✓ khớp |
| Draven | `stats.mana = [0,120]`, `stats.attackSpeed = 0.8` | ✓ khớp |
| Lux — sát thương | `330/520/5000` ở `ability`, `abilityVi` và **cả 10 form** | ✓ khớp |
| Lux — Suy Yếu Mặt Trăng | `forms[label="Mặt Trăng"].abilityHtmlVi` chứa `Suy Yếu ... 10%` | ✓ khớp |
| Cinderling — Base AD | `forms[].stats.attackDamage[0] = 45` | ✓ khớp |
| Amumu — Năng Lượng | `stats.mana = [30,140]`, `mana = "30 / 140"` | ✓ khớp |
| Amumu — hệ số hồi máu | `forms[0].calcs[0].terms` chứa `2.2%` (2 lần) | ✓ khớp |

**Cần người dùng quyết trước khi ghi:** xem `Patch_TFT18.1d-skipped-items.md`.

## Ghi chú lệch dữ liệu có sẵn từ trước (KHÔNG do bản vá này gây ra)

- **Quái Rừng mốc 7 — chỉ số phẳng**: DB lưu `Armor 6 / MR 6 / Health 60`, trong khi dữ liệu game hiện hành là `+5 / +5 / +50`. Bản vá 18.1d không đụng tới các giá trị này (ảnh gốc chỉ nêu 3 con số phần trăm), nên đây là drift có sẵn từ trước — ghi nhận, không sửa trong phạm vi patch này.
- **`stats` top-level vs `forms[].stats`**: nhiều tướng có `attackDamage[0]` lệch nhau giữa hai chỗ (Cinderling 40 vs 45, Draven 48 vs 40, Elder Dragon 110 vs 100, Master Yi 67 vs 65). Tiền lệ từ 18.1af: **base AD ghi vào `forms[].stats.attackDamage[0]`**, không ghi top-level.
- **Draven `mana` top-level** = `"0 / 140"` trong khi `stats.mana` = `[0,120]` và `forms[0].mana` = `"0 / 120"`. Bản vá đổi 120 → 110; sẽ ghi vào `stats.mana` + `forms[].mana`, để nguyên chuỗi top-level lệch sẵn.
