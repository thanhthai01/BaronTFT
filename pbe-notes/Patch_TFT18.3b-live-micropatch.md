# Bản vá LIVE 18.3b — Micropatch 24/09/2026

- **Phiên bản:** `Live 24/09/2026 (18.3b)`
- **Nguồn gốc:** mục **"MID-PATCH UPDATE — SEPTEMBER 24TH"** do Riot chèn vào đầu trang patch 18.3 bản **EN**: https://teamfighttactics.leagueoflegends.com/en-us/news/game-updates/teamfight-tactics-patch-18-3/ (kiểm tra 25/09/2026). Bản `vi-vn` cùng bài **không có** mục này ⇒ tên tiếng Việt lấy từ `nameVi` trong DB, không tự dịch.
- **Nguồn phụ:** lolchess.gg/guide/patch-notes/504 — chép lại, khớp 100%.
- **Khác tiền lệ:** 18.1d và 18.2b chỉ có trên X; đây là lần đầu micropatch LIVE có trên trang tin Riot.

Quy ước: ⬆️ buff · ⬇️ nerf · 🔄 cơ chế/khác · ↩️ bật lại thay đổi cũ

## Lời dẫn của Riot (dịch)

> Bản B 18.3 vừa để xử lý những biến chuyển meta chưa kịp đưa vào bản chính, vừa để khôi phục vài thay đổi cân bằng của 18.2 B bị vô tình hoàn tác khi chuyển sang 18.3.

## 1. Thay đổi cân bằng mới của 18.3 B

| Mục | entityId | Thay đổi | Hướng | Sync codex? |
|---|---|---|---|---|
| Gai Đen (Blackthorn) | `trait:eldritch` | Khuếch đại sát thương cơ bản khi hiến tế tướng SMPT: 14% ⇒ 12% | ⬇️ | ✅ `breakpointDetails` row `APSacrificeDamageAmpBonus` ở mốc 2 và 4 (cùng giá trị nền 14%). **Không** đụng `ADSacrificeASBonus` dù cũng là 14%. |
| Kha'Zix | `champion:tft18_khazix` | Sát thương chiêu cơ bản: 285/400/580 ⇒ 265/370/535 AP | ⬇️ | ✅ dãy trần duy nhất trong `ability`/`abilityVi`/`forms[0].abilityHtmlVi` |
| Kha'Zix | (cùng entry) | Sát thương khi mục tiêu bị cô lập: 310/445/660 ⇒ 285/410/605 AP | ⬇️ | ✅ như trên |
| Brambleback | `champion:tft18_brambleback` | Tung chiêu nhanh hơn một chút | ⬆️ | ❌ Riot không cho số, DB không có field thời gian tung chiêu ⇒ chỉ patch report |

## 2. Nhắm mục tiêu của tướng (giải thích, không phải thay đổi mới)

Riot giải thích bản 18.3 đã chủ động hoàn tác một thay đổi nhỏ về nhắm mục tiêu từ 18.2 (một bản sửa lỗi di chuyển gây tác dụng phụ ở giai đoạn đầu giao tranh cho tướng cận chiến), và đang tìm cách khác để đưa cơ chế nhắm mục tiêu về giống Mùa 17. ⇒ Ghi 1 entry `mechanic`, không sync codex.

## 3. Khôi phục thay đổi của 18.2 B (bị vô tình hoàn tác ở 18.3) ↩️

Trong game: 18.2b nerf → 18.3 vô tình hoàn tác → 18.3b bật lại. **DB của ta chưa từng hoàn tác** (đã soát bằng dump codex 25/09):

| Mục | Thay đổi | DB hiện tại | Sync codex? |
|---|---|---|---|
| Camille | Sát thương chiêu 160/240/410/700 ⇒ 150/225/375/640 AD | Đã là `150/225/375` | Không cần (no-op) |
| Teemo | Sát thương nấm nhỏ 60/90/135 ⇒ 55/82/130 AP | Đã là `55/82/130`, không còn `60/90/135` | Không cần |
| LeBlanc | Tỉ lệ bản sao 10/15/40% ⇒ 10/15/30% | Report-only từ 18.2b (DB chỉ có "10%" phẳng) | Không |
| Ashe | Vệt 4s ⇒ 3s · DoT 5/8 ⇒ 9/14 AD | Report-only từ 18.2b (lệch mô hình) | Không |
| Săn Thưởng (Draven) | 5 mốc bounty như 18.2b | Cả 5 đã là giá trị mới (6 lần tung chiêu, 6 lượt đổi, 60 đòn đánh, 10000 sát thương, 8 hạ gục) | Không cần |

## 4. Nâng Cấp tạm thời vô hiệu hóa 🔄

| Nâng Cấp | entityId | Lý do Riot nêu | Ghi chú |
|---|---|---|---|
| Ân Huệ Thách Đấu (Challenger's Grace) | `augment:da_challengersgrace` | Lỗi | Vừa được buff 3s⇒4s ở 18.3 |
| Tà Thuật (Dark Ritual) | `augment:da_18_coventraitaugment_loottoap` | (không nêu) | |
| Bảo Hộ Vô Tận (Infinity Protection) | `augment:da_infinityprotection` | Lỗi | Đã ghi "vô hiệu hóa do lỗi" ở 18.3 — nay Riot nhắc lại |
| Búp Bê Xây Tổ (Nesting Dolls) | `augment:da_nestingdolls` | Lỗi | Đã tắt ở 18.2b, vẫn tắt |

Theo quyết định ở 18.2b: **không đụng field `visible`** của augment (chưa rõ ngữ nghĩa) ⇒ chỉ patch report.

## Tóm tắt phạm vi

- **Sync codex:** Kha'Zix (2 dãy sát thương), Gai Đen (row `APSacrificeDamageAmpBonus` mốc 2 + 4).
- **Chỉ patch report:** Brambleback, nhắm mục tiêu, nhóm khôi phục 18.2b, 4 Nâng Cấp bị tắt.
