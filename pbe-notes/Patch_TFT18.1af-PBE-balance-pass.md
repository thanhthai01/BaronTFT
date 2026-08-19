# Patch TFT18.1af — PBE Balance Pass (8/18/2026)

**Nguồn:** https://x.com/TheTruexy/status/2089782014769865134 (đăng 1:30 AM · Aug 19, 2026)
**Phiên bản dự kiến:** PBE 18/08/2026 (18.1af) — kế tiếp trực tiếp sau 18.1ae (14/08/2026); không có bản vá ngày 17/08 (Truexy tự xác nhận nghỉ 1 ngày, dự kiến 1-2 bản nữa trước khi khoá bản đầu tiên).
**Quy ước mũi tên:** ▲ xanh = buff, ▼ đỏ = nerf, theo đúng ảnh gốc Truexy.

Tóm tắt của Truexy: còn 1 đợt fine-tuning nữa dự kiến ngày mai (Augments, một số Traits, thay đổi nhỏ), sau đó dự định khoá bản để phát hành (trừ bug nghiêm trọng). Phần lớn tướng/tộc hệ đã ổn cho launch, mối lo lớn nhất hiện tại là tần suất/sức mạnh Artifact+Emblem — 2 hệ thống này có lợi cho reroll hơn đội hình cost cao, và phụ thuộc nhiều vào Augment.

---

## Champions

### 1 Cost
| Tướng | entityId | Thay đổi | Hướng |
|---|---|---|---|
| Cinderling | `champion:tft18_cinderling` | Base AD: 40 → 45 | Buff |
| Ornn | `champion:tft18_ornn` | Damage Needed for Each Artifact: 90k/145k/180k → 90k/155k/180k | Nerf |
| Pebbles | `champion:tft18_pebbles` | Base AD: 30 → 35; Spell Damage: 160/240/360 → 155/235/350 AP | Nerf (dòng "Mana: 30/70" trong ảnh không có mũi tên/thay đổi — có vẻ chỉ liệt kê lại, KHÔNG đưa vào draft) |
| Xayah | `champion:tft18_xayah` | Spell Damage: 72/108/165 → 68/102/155 AD | Nerf |

### 2 Cost
| Tướng | entityId | Thay đổi | Hướng |
|---|---|---|---|
| Warwick | `champion:tft18_warwick` | Reduced the amount Warwick's cast time scales with Attack Speed (không có số liệu before/after cụ thể trong ảnh) | Nerf |
| Yunara | `champion:tft18_yunara` | Spell Damage: 155/230/350 → 150/225/335 AD | Nerf |

### 3 Cost
| Tướng | entityId | Thay đổi | Hướng |
|---|---|---|---|
| Kha'Zix | `champion:tft18_khazix` | Health: 850 → 950; Spell Damage Base: 260/370/550 → 285/400/580 AP | Buff |
| Raptor (Truexy gọi "Mama Beak" — xem [[project_set18_champion_patchnote_aliases]]) | `champion:tft18_raptor` | Base AD: 60 → 65 | Buff |
| Rengar | `champion:tft18_rengar` | Heal Max: 150/220/300 → 120/180/300 AP; Heal Min: 70/100/130 → 60/90/150 AP | Nerf |
| Vi | `champion:tft18_vi` | Initial Heal: 225/300/400 → 200/265/360 AP | Nerf |

### 4 Cost
| Tướng | entityId | Thay đổi | Hướng |
|---|---|---|---|
| Brambleback | `champion:tft18_brambleback` | Base AD: 110 → 115 | Buff |
| Nidalee (AP) | `champion:tft18_nidalee` | Empowered Spell Damage: 320/480 → 285/425 AP | Nerf |

### 5 Cost
| Tướng | entityId | Thay đổi | Hướng |
|---|---|---|---|
| Alune | `champion:tft18_alune` | Moonshard Damage: 50/75 → 53/80 AP | Buff |
| Kennen | `champion:tft18_kennen` | Spell Damage: 450/675 → 475/715 AP | Buff |
| Lux | `champion:tft18_lux` | Solar Bonus Damage Per 3-star: 10% → 12% | Buff |

---

## Items

### Artifact Items
| Item | Tên Việt | Thay đổi | Hướng |
|---|---|---|---|
| Aegis of Dusk | Khiên Hoàng Hôn | MR Damage Percent: 15% → 18% (anchor: statLine "400 70" — không thấy 15%/18% trong description; **không có anchor rõ, cần soát lại**) | Buff |
| Death's Defiance | Vũ Khúc Tử Thần | **Removed due to a bug** — gỡ bỏ hoàn toàn khỏi game, không phải buff/nerf số liệu | — |
| Manazane | Thánh Kiếm Manazane | Mana Gain: 100 → 110 (statLine "15% 15% 1" — không khớp 100/110; description không có số 100 — **không có anchor rõ**) | Buff |
| Rapid Firecannon | Đại Bác Liên Thanh | Attack Speed: 65% → 55% (statLine "65% 5%" — "65%" khớp đúng "from"! Anchor tốt qua statLine) | Nerf |
| Silvermere Dawn | Chùy Bạch Ngân | Omnivamp: 20% → 30% (statLine "125% 30 30 20%" — "20%" khớp đúng "from" qua statLine) | Buff |
| Wit's End | Đao Tím | Health: 400 → 300 (statLine "400 20 20 25%" — "400" khớp đúng "from" qua statLine) | Nerf |

### Radiant Items
| Item | Tên Việt | Thay đổi | Hướng |
|---|---|---|---|
| Adaptive Helm | Mũ Thích Nghi | Fixed a bug where Radiant Adaptive Helm was providing the incorrect amount of bonus Mana (bugfix, không có số liệu before/after) | Bugfix |
| Gargoyle Stoneplate | Thú Tượng Thạch Giáp | Health: 300 → 400 (statLine "100 25 25" — không thấy 300/400, description "10 Armor/MR mỗi kẻ địch" không liên quan Health — **không có anchor rõ, DB có thể track Health ở field khác không phải Normal-tier item này; hoặc cần kiểm tra Radiant Gargoyle Stoneplate riêng nếu tồn tại**) | Buff |
| Hand of Justice | Bàn Tay Công Lý (Ánh Sáng) | AD/AP: 30 → 35 (ảnh không ghi %, nhưng patch liệt kê dưới mục "Radiant Items" → khớp với **Radiant Hand of Justice** có AD/AP 30%, không phải bản thường 15%. statLine Radiant "40% 2" không khớp trực tiếp — **cần xác nhận đúng biến thể trước khi ghi**) | Buff |
| Steadfast Heart | Trái Tim Kiên Định | Health: 600 → 500 (statLine "? 20 20%" — không có 600/500 — **không có anchor rõ**) | Nerf |

### Emblems
| Item | Tên Việt | Thay đổi | Hướng |
|---|---|---|---|
| Brawler Emblem | Ấn Đấu Sĩ | Max Health Damage: 2.5% → 2% (description hiện ghi **"3%"**, không khớp "from"=2.5% ảnh gốc — lệch nhiều hơn các trường hợp lệch nhỏ thường gặp, **cần soát lại trước khi ghi**) | Nerf |
| Executioner Emblem | Ấn Đao Phủ | Critical Strike Damage: 10% → 8% (không có anchor — statLine "35% 15%" không khớp); Execute Threshold: 12% → 8% (description có "12%" khớp đúng "from" — anchor tốt cho riêng dòng này) | Nerf |
| Juggernaut Emblem | Ấn Dũng Sĩ | Base Health: 400 → 350 (statLine "400" khớp đúng "from" — anchor tốt) | Nerf |
| Vanguard Emblem | Ấn Tiên Phong | Time for Bonus Player Health: 20 → 22 (description có "20 seconds" khớp đúng "from" — anchor tốt) | Nerf |

---

## Traits

| Tộc hệ | entityId | Thay đổi | Hướng |
|---|---|---|---|
| Blossom | `trait:blossom` | AD/AP: 12/30/40/45% → 12/30/45/50% | Buff |
| Elderwood | `trait:elderwood` | 7 Piece Protector Base HP: 400 → 450 | Buff |
| Inferno | `trait:inferno` | Burn Duration: 4s → 3s; Burn Amount: 1/1/2/3% → 1/1/3/3.5% | **Không rõ hướng — ảnh gốc không có ▲/▼ rõ ràng cho mục này, cần bạn xác nhận** |
| Vanguard | `trait:vanguard` | Shield Amount: 18/32/42% → 18/30/40% | Nerf |

---

## Wisps

| Wisp | entityId | Thay đổi | Hướng |
|---|---|---|---|
| Artifactinate | `wisp:artifactinate` | Cost: 0g → 2g; Appearance rate decreased (không có số cụ thể) | Nerf |
| Backrow Star | `wisp:backrow-star` | Cost: 4 → 3; Attack Speed: 75/100% → 85/115% | Buff |
| Giant Growth | `wisp:giant-growth` | Health: 700 → 750 | Buff |
| Killer's Regret | `wisp:killer-s-regret` | Stun Duration: 1.25/1.5s → 1.5/1.75s | Buff |
| Moonrise | `wisp:moonrise` | Removed from 3-5 to 4-1 (đổi mốc xuất hiện, không phải buff/nerf số liệu) | — |
| Snacktime! | `wisp:snacktime` | Cost: 3 → 2; BFF Execute: 15%/20% → 16/22% | Buff |
| Stealthy | `wisp:stealthy` | Cost: 1 → 0 | Buff |
| Iron Core | `wisp:iron-core` | Removed from 3-5 to 4-1 (đổi mốc xuất hiện); Health Per Frontrow Unit: 4/6% → 6/8% | Buff |
| Ironwood | `wisp:ironwood` | Damage Reduction: 12/18% → 14/20% | Buff |
| Radiantize | `wisp:radiantize` | Cost: 5 → 4 | Buff |
| Terraforming | `wisp:terraforming` | Seeds: 5/9 → 7/10 | Buff |

---

## Bug Fixes (category `mechanic`, không có entityId)

- Fixed an issue where a combination of Coven Acolyte and Vanguard Emblem could grant excessive player Health.
- 3* Ivern's forced dance no longer persists into the next combat which caused losses or ties.
- 3* Ivern's effect reapplies more frequently so it catches walking enemies more quickly.
- Alpha Mark VFX no longer persist through Recombobulator/Polymorph.
- Polymorphing a 3-star 4-cost into a 3-star Draven no longer breaks Draven.
- Recombobulating a 3-star Kayle no longer makes parts of the new champion invisible.
- Invested now correctly tracks gold at the end of the round rather than the start of the next.
- NO SCOUT NO PIVOT now correctly locks units even if they're sacrificed in the Blackthorn hex.
- Solo Plate now works correctly on away boards.
- Call to Chaos no longer displays an incorrect tooltip when the player receives the Spatula + Frying Pan reward.
- Fixed an issue where Gromp would still show up in your Riftbeast Shop after him being 3*'d if he was in his AD Adaptor form.
- Partial Ascension now will correctly apply to all units on your board instead of only to ones that were on your board when the augment was purchased.
- All items should continue to function after being Radiantized and returning to their normal form.

---

## Việc cần soát trước khi vào draft (Bước 2)

1. **Death's Defiance** — gỡ bỏ hoàn toàn khỏi game do bug. Đề xuất: patch report ghi category `mechanic`/kind `rework` (không phải `nerf` số liệu), codex có thể cần đánh dấu `isPublished: false` hoặc giữ nguyên tuỳ bạn quyết định (chưa chắc web có cơ chế "unpublish" item — cần kiểm tra `set18_items.isPublished` trước). điều chỉnh thông tin trên db để phù hợp với mùa
2. **Inferno** — không rõ hướng buff/nerf (ảnh gốc không có ▲/▼). đây  là điều chỉnh
3. **Hand of Justice** — patch liệt kê dưới "Radiant Items" nên nhiều khả năng là **Radiant Hand of Justice** (AD/AP 30%→35%), không phải bản thường (15%). Cần bạn xác nhận đúng biến thể. đúng vậy, ở đây nhắc tới item radiant
4. **Brawler Emblem** — DB hiện ghi 3% Max Health Damage, ảnh gốc "from"=2.5% — lệch khá nhiều (không phải kiểu lệch nhỏ 1 đơn vị thường gặp). Cần soát lại xem có phải nhầm augment/tier khác không. chỉnh sửa lại giúp tôi lấy patch làm chuẩn. thay đổi trong db cho phù hơpk
5. **Aegis of Dusk, Manazane, Gargoyle Stoneplate, Steadfast Heart** — không tìm được anchor rõ ràng trong description/descriptionVi/statLine cho số liệu patch nêu. Có thể là field ẩn không hiển thị trong text (giống case Tower/Trait Ladder ở patch trước) — sẽ chỉ ghi patch report, không sync codex nếu không tìm thêm được anchor. kiểm tra kĩ lại trong db, tên tiếng việt tiếng anh, đây là trang bị tạo tác, artifact, sau đó bổ sung số liệu cho phù hợp
6. **Executioner Emblem — Critical Strike Damage 10%→8%** — không tìm được anchor (chỉ dòng Execute Threshold 12%→8% có anchor rõ qua description). chỉnh sửa lại trong db, trước đây dòngnayf là sát thương khuếch đại, bầy giờ sửa lại theo patch
7. **Pebbles Mana 30/70** — ảnh liệt kê dòng này không có mũi tên/thay đổi, đã loại khỏi bảng trên (không đưa vào draft). dò lại thông tin dòng, tôi sẽ gửi lại ảnh để bạn kiểm tra


Phần lớn Champions/Traits/Wisps đã có entityId rõ ràng và sẵn sàng cho Bước 2. Riêng 7 điểm trên cần bạn xác nhận/xem lại ảnh gốc `tft18-1af-images/image1.png` (Champions), `image2.png` (Items/Traits) trước khi mình soạn PatchReport draft.
