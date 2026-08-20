# Patch TFT18.1ag — PBE "Final" Patch notes

**Nguồn:** https://x.com/TheTruexy/status/2090142868971356507 (Truexy, dev PBE chính thức)
**Thời điểm:** đăng 1:24 AM Aug 20, 2026 giờ hiển thị Twitter, Truexy tự ghi "(8/19)" — tiếp theo bản 18.1af (18/08/2026)
**Phiên bản dự kiến:** PBE 19/08/2026 (18.1ag)

Caption gốc: "(8/19) 'Final' PBE Patch notes. Smaller one today, with small buffs and Augment adjustments. The meta's been pretty stable the last week, so we're not overreacting to yesterday's medium-sized patch. As with every Set, we'll re-evaluate early next week to see if anything warrants a last-second balance change to make sure the launch patch is the best it can be."

Quy ước mũi tên: ▲ = buff, ▼ = nerf trong ảnh gốc — **lưu ý 2 trường hợp mũi tên KHÔNG khớp hướng thực tế của số liệu**, xem mục "Ghi chú mâu thuẫn hướng" bên dưới.

## Champions

| Tướng | Giá | Thay đổi |
|---|---|---|
| Akali | 1 | AD dmg 145/220/345/590→145/220/380/645; AP dmg 140/210/340/535→140/210/365/620 |
| Gromp | 2 | AP Form Secondary Damage 145/220/345/585→160/240/360/610 |
| Azir | 3 | Soldier Damage 46/69/110/195→48/72/115/205 |
| Cassiopeia | 3 | Spell Damage 425/640/1020/1625→440/660/1050/1650 |
| Fiddlesticks | 3 | Heal 395/470/790/1110→410/485/850/1200 |
| Ezreal | 4 | Spell AS 25%→30% (Tốc Độ Đánh cộng thêm SAU khi dùng kỹ năng — xác nhận với người dùng) |
| Lillia | 4 | Spell Healing 300/400→325/475 |
| Elder Dragon | 5 | AD 110→115 |
| Maokai | 5 | HP 1100→1150 |

Toàn bộ 9 tướng đều buff, không có nerf tướng nào trong bản này.

## Traits

- **Blackthorn** (▼ nerf): Tank Sacrifice Stats 20% HP/17 Resists → 17% HP/17 Resists.
- **Elderwood** (▲ buff, nhưng tách 2 hướng thật — xem ghi chú mâu thuẫn):
  - Protector — Slam Primary Damage 445/670→500/750; Slam AoE Damage 220/335→250/375 (buff thật).
  - 9 Piece HP Bonus 60%→55% (**nerf thật**, dù cùng nhóm ▲ với Protector trong ảnh).
- **Juggernaut** (▲ buff): Selfish Damage Reduction 20/30/40%→20/33/45%.

## Augments

| Augment | Thay đổi | Hướng thật |
|---|---|---|
| Band of Thieves II | Delay 6→5 lượt | buff |
| Booster Pack | Fixed: chỉ cấp 10 vàng tướng thay vì đúng lượng | bugfix |
| Bonus Gifts | Initial Loot Orbs 2→1 | nerf |
| Bonus Gifts (+1) | Initial Loot Orbs 3→2 | nerf |
| Buried Treasures II | Num Rounds 5→6 | buff |
| Capital Gains II | Initial Gold 1→2 | buff |
| Comeback Story | AS Per Missing Health 0.4%→0.3% | **nerf thật** dù ảnh vẽ ▲ (xem ghi chú mâu thuẫn) |
| Dummify | Fixed: Dummy có ít hơn 1000 máu so với dự kiến | bugfix |
| Flame On! | Removed — gỡ bỏ hoàn toàn khỏi game | rework/removal |
| Golden Dragon | Bonus Health 700→600 | nerf |
| Investment Strategy II | Health Per Interest 8→9 | buff |
| Living Forge | Rounds 9→10 | nerf |
| Money Hungry+ | Initial Gold 10→13 | buff |
| Nesting Anvils (+) | Gold 8/12→4/8 | nerf |

## Wisps

- **Heroic Sacrifice** (▼ nerf): Health 1500/1800→1200/1500.

## Bug Fixes

- Sacrificing a Riftbeast with the Alpha Mark to the Blackthorn hex now prevents you from re-selecting a new Alpha that same round during combat arrival.

## Ghi chú mâu thuẫn hướng buff/nerf so với mũi tên ảnh

1. **Comeback Story**: ảnh vẽ ▲ nhưng % Attack Speed theo máu thiếu GIẢM (0.4%→0.3%) — về hiệu quả thực tế đây là nerf. Một reply dưới bài gốc cũng thắc mắc y hệt ("Is it a buff for comeback story? I think it is a nerf."). **Người dùng đã xác nhận: đây là NERF**, ghi kind: nerf trong draft.
2. **Elderwood 9 Piece HP Bonus**: nằm trong nhóm ▲ chung của Elderwood (vì Protector buff), nhưng riêng số 60%→55% là giảm — tách thành entry riêng với kind: nerf, breakpoint '9'.

## Phân loại patch report vs codex DB

Tất cả các thay đổi số liệu ở trên đều là candidate cho CẢ patch report (`patch-tft18-1ag.ts`) LẪN codex DB sống (`set18_champions`, `set18_traits`, `set18_wisps`, `set18_augments`) — patch này không có mục nào chỉ mang tính lịch sử/không cần sync. Riêng Flame On! cần xử lý đặc biệt ở codex (đánh dấu removed/inactive), không chỉ ghi patch report.

## Còn thiếu / đã xác nhận qua candidate.md

Xem `Website/pbe-notes/_pending/tft18-1ag-candidate.md` mục "Còn thiếu" — cả 4 điểm (Comeback Story hướng nerf, Flame On! xoá khỏi game, Ezreal Spell AS = tốc đánh sau kỹ năng, Elder Dragon = tướng 5 vàng không trùng tên) đã được người dùng xác nhận trực tiếp trong file đó.

Riêng "Buried Treasures II" phát sinh thêm trong lúc soạn draft (không nằm trong candidate.md ban đầu): DB chỉ có "Buried Treasures III", không có bản II — đã hỏi riêng qua AskUserQuestion, người dùng chọn map entityId vào III nhưng giữ tên hiển thị theo patch note "Buried Treasures II".
