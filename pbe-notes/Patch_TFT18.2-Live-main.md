# Patch TFT 18.2 — Bản cập nhật CHÍNH đầu tiên của Đại Ngàn Kỳ Bí

**Nguồn gốc:** Patch note chính thức Riot.
- EN: <https://teamfighttactics.leagueoflegends.com/en-us/news/game-updates/teamfight-tactics-patch-18-2/>
- VI: <https://teamfighttactics.leagueoflegends.com/vi-vn/news/game-updates/teamfight-tactics-patch-18-2/>

**Thời điểm đăng:** 2026-09-09T18:00:00Z (giờ Mỹ) — phát hiện qua trang tin Riot ngày 2026-09-09 giờ VN.
**Phiên bản dùng cho site:** `Live 09/09/2026 (18.2)`.
**Baseline trước đó:** `Live 02/09/2026 (18.1d)`.
**Đối chiếu EN/VI:** đã so từng dòng số liệu — khớp 100%, không có lỗi dịch (khác 18.1 launch từng lệch giây/vàng).

Quy ước: ⬆️ buff · ⬇️ nerf · 🔄 rework (đổi hướng, vừa buff vừa nerf trong cùng 1 mục) · ⚙️ cơ chế/sửa lỗi.

## Bối cảnh (tóm tắt lời mở đầu Riot)

Bản cập nhật CHÍNH đầu tiên sau 18.1, trọng tâm buff các đội hình chưa nổi được dưới cái bóng của reroll/Ahri, đồng thời giảm giá gần như toàn bộ Tinh Linh và giảm gold cần lên cấp 8/9/10 để người chơi rủng rỉnh vàng hơn ở late game. Vẫn tiếp tục sửa lỗi/cải thiện hiệu năng (đã liệt kê ~15 mục performance/stability cho PC+Mobile, không đưa vào patch report vì không có số liệu before/after mang tính gameplay).

## Hệ thống

| Mục | Thay đổi | Hướng |
|---|---|---|
| XP mỗi cấp | Cấp 7→8: 60⇒56 · Cấp 8→9: 68⇒64 · Cấp 9→10: 68⇒64 | ⬆️ (rẻ hơn) |

## Tộc/Hệ

| Tộc/Hệ | entityId | Thay đổi | Hướng |
|---|---|---|---|
| Gai Đen (Blackthorn) | `trait:eldritch` | Máu: 175/300/550⇒175/350/600 · Đỡ Đòn Hiến Tế: 15⇒12 · SMCK Hiến Tế Tốc Độ Đánh: 12%⇒14% · SMPT Hiến Tế Hồi Năng Lượng: 1.7⇒2 · thêm nhiều mốc rút thưởng Coven có Caitlyn (xem toàn văn) | ⬆️ |
| Tiên Linh (Fae) | `trait:fae` | Mốc Pix Hoàng Kim: 200k/250k/330k/420k/510k/610k ⇒ 170k/200k/300k/400k/500k/600k | ⬆️ |
| Thợ Săn (Hunter) | `trait:hunter` | Thời gian tác dụng nhắm mục tiêu Khuếch Đại Sát Thương: 4s⇒3s | ⬆️ |
| Hỏa Ngục (Inferno) | `trait:inferno` | Thiêu Đốt: 1/1/3/3.5%⇒1/1/3.5/4.5% | ⬆️ |
| Liên Kích (Rapidfire) | `trait:rapidfire` | Tốc Độ Đánh mỗi đòn: 3/5/9/15%⇒3/5/8/12% | ⬇️ |
| Mặt Trời (Solar) | `trait:solar` | Sát thương phép ban đầu: 7%⇒8% · Tăng thưởng/3★: 1.5%⇒1% · Tốc Độ Đánh (3x3★): 18%⇒15% · Giáp/Kháng Phép (3x3★): 15⇒12 | ⬇️ (buff đầu trận, nerf tổng thể) |

## Tướng

| Tướng | entityId | Giá | Thay đổi | Hướng |
|---|---|---|---|---|
| Akali | `champion:tft18_akali` | 1 | Dạng SMCK — Năng Lượng: 0/30⇒0/25 | ⬆️ |
| Leona | `champion:tft18_leona` | 1 | Năng Lượng: 40/100⇒30/90 · Chống Chịu Giảm Dần: 60/70/80/100⇒60/80/100/130 | ⬆️ |
| Varus | `champion:tft18_varus` | 1 | Sát thương chiêu: 385/580/925/1530⇒415/625/1000/1700 AD | ⬆️ |
| Veigar | `champion:tft18_veigar` | 1 | Sửa lỗi tooltip: SMPT/mạng hạ gục hiển thị 1.5%→3% (không đổi số thực tế) | ⚙️ |
| LeBlanc | `champion:tft18_leblanc` | 2 | Sát thương chiêu: 250/375/565/955⇒260/390/615/1045 AP · Sát thương diện rộng: 85/130/190/325⇒100/150/230 AP | 🔄 (chuyển sức mạnh từ nhân bản sang sát thương chiêu) |
| Kayle | `champion:tft18_kayle` | 2 | SMPT trên đòn đánh: 56/84/95⇒62/92/105 AP · Sát thương sóng: 40/40/40/50⇒35/35/35/45 AP | ⬆️ |
| Shen | `champion:tft18_shen` | 2 | Lá chắn: 325/400/500/600⇒350/430/550/700 AP | ⬆️ |
| Warwick | `champion:tft18_warwick` | 2 | SMCK: 40⇒45 | ⬆️ |
| Yunara | `champion:tft18_yunara` | 2 | Sát thương chiêu: 150/225/335/570⇒160/240/370/630 AD | ⬆️ |
| Azir | `champion:tft18_azir` | 3 | Sát thương chiêu Lính Cát: 40/60/96/165⇒43/65/103/175 AP | ⬆️ |
| Diana | `champion:tft18_diana` | 3 | Sát thương/quả cầu: 70/105/170⇒75/115/180 AP · Lá chắn: 150/275/400⇒150/275/500 | ⬆️ |
| Kha'Zix | `champion:tft18_khazix` | 3 | SMCK cơ bản: 30⇒40 | ⬆️ |
| Chim Mẹ (Mama Beak / codex: Raptor) | `champion:tft18_raptor` | 3 | SMCK cơ bản: 50⇒55 · Sát thương chiêu: 20/30/48⇒22/33/48 AD | ⬆️ |
| Master Yi | `champion:tft18_masteryi` | 3 | Dạng SMCK — SMCK cơ bản: 65⇒60 · Dạng SMPT — Sát thương chiêu: 140/210/335⇒125/190/285 AP | ⬇️ |
| Rengar | `champion:tft18_rengar` | 3 | Tốc Độ Đánh cơ bản: 0.8⇒0.75 | ⬇️ |
| Ahri | `champion:tft18_ahri` | 4 | Sát thương chiêu: 425/640⇒455/685 AP · Sát thương giảm dần/ô: 20%⇒21% | ⬆️ |
| Người Đá (Sentinel / codex: Ancient Sentinel) | `champion:tft18_ancientsentinel` | 4 | Sửa lỗi nhắm mục tiêu (giờ nhắm hàng đông nhất, không bắt buộc gồm mục tiêu hiện tại) · Lá chắn: 400/500⇒350/450 AP | ⬇️ |
| Bụi Gai Đỏ (Brambleback) | `champion:tft18_brambleback` | 4 | SMCK cơ bản: 115⇒120 · Bỏ qua giáp cơ bản: 10%⇒15% · Sát thương nhảy (1-2★): 170/255⇒155/235 AD · **3★**: Bỏ qua giáp 10+50%AP⇒10+70%AP, Sát thương nhảy 600%AD⇒1000%AD, SMCK chiêu cộng thêm 280%⇒300% | 🔄 (nerf nhẹ 1-2★, buff mạnh 3★) |
| Ezreal | `champion:tft18_ezreal` | 4 | Sát thương chiêu chính: 235/355⇒250/375 AD | ⬆️ |
| Nidalee | `champion:tft18_nidalee` | 4 | Dạng SMPT — Sức mạnh công kích cường hóa: 285/425⇒300/450 AP · **3★ Dạng SMCK** — Sát thương chiêu: 2500%⇒3000% AD | ⬆️ |
| Zyra | `champion:tft18_zyra` | 4 | Sát thương chiêu: 37/55⇒35/53 AP | ⬇️ |
| Ashe | `champion:tft18_ashe` | 5 | Sửa lỗi nhắm mục tiêu · Sát thương mũi tên: 440/660⇒465/700 AD | ⬆️ |
| Ivern | `champion:tft18_ivern` | 5 | Số ô bắt đầu: 2⇒3 · Lá chắn: 165/300⇒185/350 AP · Sát thương chiêu: 140/210⇒155/235 AP | ⬆️ |
| Kennen | `champion:tft18_kennen` | 5 | Cải thiện AI nhắm mục tiêu nhóm cho Bão Lửa (không có số liệu) | ⚙️ |
| Lux | `champion:tft18_lux` | 5 | Sát thương chiêu: 355/550⇒375/565 AP · **3★** Sát thương Laser: 5000⇒6500 AP | ⬆️ |
| Maokai | `champion:tft18_maokai` | 5 | Năng Lượng: 40/100⇒30/90 | ⬆️ |
| Taric | `champion:tft18_taric` | 5 | Lá chắn nội tại: 175/350+10%HP⇒100/225+15%HP · Hồi máu kích hoạt: 200/300⇒250/375 AP | ⬆️ |
| Gnar | `champion:tft18_gnar` | 5 | **3★** Nộ/đòn đánh: 5⇒20 · Giảm Chống Chịu: 100⇒250 · Máu cộng thêm: 10000⇒15000 | ⬆️ |

## Trang bị

| Trang bị | Thay đổi | Hướng |
|---|---|---|
| Huyết Kiếm (Bloodthirster) | Máu kích hoạt: 40%⇒50% · SMCK/SMPT: 15%⇒18% · Lá chắn: 25%⇒30% HP tối đa | ⬆️ |
| Áo Choàng Bóng Tối (Edge of Night) | Máu kích hoạt: 60%⇒40% · Hồi máu đã mất: 20%⇒15% | ⬇️ (kích hoạt sớm hơn nhưng hồi máu ít hơn — Riot ghi chú net là buff nhẹ ~1% HP tối đa, nhưng số liệu chính giảm) |
| Bàn Tay Công Lý (Hand of Justice) | SMCK/SMPT cơ bản: 15%⇒18% · Hút máu toàn phần cơ bản: 12%⇒15% | ⬆️ |
| Huyết Kiếm Ánh Sáng (Radiant Bloodthirster) | Máu kích hoạt: 40%⇒50% · SMCK/SMPT: 30%⇒40% · Lá chắn: 50%⇒60% HP tối đa | ⬆️ |
| Áo Choàng Bóng Tối Ánh Sáng (Radiant Edge of Night) | Máu kích hoạt: 60%⇒40% | ⬇️ |
| Bàn Tay Công Lý Ánh Sáng (Radiant Hand of Justice) | Hút máu toàn phần cơ bản: 24%⇒30% | ⬆️ |

## Tạo Tác (Artifacts)

| Tạo Tác | Thay đổi | Hướng |
|---|---|---|
| Đá Hắc Hóa (Blighting Jewel) | Giảm Kháng Phép: 4⇒3 | ⬇️ |
| Đao Chớp Navori (Flickerblades) | Tốc Độ Đánh/đòn: 5%⇒4% | ⬇️ |
| Dị Vật Tai Ương (Forbidden Idol) | Máu: 400⇒500 | ⬆️ |
| Bão Tố Luden (Luden's Tempest) | Sát thương cố định khi hạ gục: 100⇒130 | ⬆️ |
| Chùy Bạch Ngân (Silvermere Dawn) | SMCK: 125%⇒150% | ⬆️ |
| Đao Tím (Wit's End) | Sát thương trên đòn (giai đoạn 2-5): 30/55/75/95/115⇒25/45/65/85/100 | ⬇️ |

## Ấn (Emblems)

| Ấn | Thay đổi | Hướng |
|---|---|---|
| Ấn Đấu Sĩ (Brawler) | Máu: 250⇒150 | ⬇️ |
| Ấn Tiên Linh (Fae) | Máu: 250⇒200 · SMCK/SMPT: 15%⇒10% | ⬇️ |
| Ấn Thợ Săn (Hunter) | SMCK cơ bản: 30%⇒25% | ⬇️ |
| Ấn Thuật Sĩ (Invoker) | SMPT/năng lượng tiêu hao: 10%⇒8% | ⬇️ |
| Ấn Dũng Sĩ (Juggernaut) | Máu: 350⇒250 | ⬇️ |
| Ấn Nguyên Sinh (Primal) | Tốc Độ Đánh: 25%⇒35% | ⬆️ |
| Ấn Tinh Nghịch (Sprykin) | Tốc Độ Đánh cộng thêm Kỵ Sĩ: 30%⇒20% · Chống Chịu cơ bản: 20⇒15 · Chống Chịu bổ sung Kỵ Sĩ: 20⇒15 | ⬇️ |
| Ấn Tiên Phong (Vanguard) | Giáp/Kháng Phép: 30⇒25 | ⬇️ |

## Nâng Cấp

| Nâng Cấp | entityId | Thay đổi | Hướng |
|---|---|---|---|
| Hang Ổ Baron | `augment:da_baronslair` | Chỉ số nhận được: 5%⇒4% | ⬇️ |
| Tăng Vốn II | `augment:da_capitalgainsii` | Vàng khởi đầu: 2⇒3 | ⬆️ |
| Vương Miện Hắc Hóa | `augment:da_cursedcrown` | Không còn tăng 4% Chống Chịu | ⬇️ |
| Thực Vật Hấp Thụ (Consuming Flora) — cả 3 bậc Sớm/Giữa/Muộn | `augment:da_18_florafatalisaugment` / `...plus` / `...plusplus` | Hiệu quả tộc/hệ: 200%⇒150% · Giờ chỉ 1 người/sảnh | ⬇️ |
| Tín Đồ Tiên Hắc Ám (Coven Acolyte) | `augment:da_18_coventraitaugment` | Giờ chỉ 1 người/sảnh, loại trừ lẫn nhau với Tà Thuật | ⚙️ |
| Tà Thuật (Dark Ritual) | `augment:da_18_coventraitaugment_loottoap` | SMPT cashout: 5⇒7, 12⇒15, 40⇒50, 60⇒75, 100⇒125, 175⇒200, 250⇒300 · Giờ chỉ 1 người/sảnh, loại trừ lẫn nhau với Tín Đồ Tiên Hắc Ám | ⬆️ |
| Hình Nhân Hóa (Dummify) | `augment:da_dummify` | HP mỗi vòng: 1000⇒1150 | ⬆️ |
| Thích Mở Rộng (Going Long) | `augment:da_goinglong` | XP chỉ nhận sau Player Combat (trước đó nhận cả PvE) | ⬇️ |
| Vận Mệnh Vàng+ (Gold Destiny+) | `augment:da_golddestinyplus` | Vàng: 6⇒5 | ⬇️ |
| Kim Long (Golden Dragon) | `augment:da_thegoldendragon` | Chống Chịu: 20%⇒15% | ⬇️ |
| Giữ Vững Hàng Ngũ (Hold The Line) | `augment:da_holdtheline` | SMPT nhận: 9%⇒10 · SMCK nhận: 8%⇒9 | ⬆️ |
| Chiến Thuật Đầu Tư II (Investment Strategy II) | `augment:da_investmentstrategy` | Máu nhận được: 9⇒10 | ⬆️ |
| Xúc Xắc Ma Pháp (Magic Roll) | `augment:da_magicroll` | Sửa lỗi phần thưởng tướng cho ít vàng hơn dự kiến | ⚙️ |
| Vận Mệnh Kim Cương+ (Prismatic Destiny+) | `augment:da_prismaticdestinyplus` | Vàng: 10⇒7 | ⬇️ |
| Tinh Túy Kim Long (Shimmerscale Essence) | `augment:da_shimmerscaleessence` | Số vòng trì hoãn: 7⇒8 | ⬇️ |
| Cắm Rễ Phân Tán (Spreading Roots) | `augment:da_spreadingroots` | Giờ cho 1 Ấn ngay + 1 Ấn sau 3 vòng, bỏ Vàng khởi đầu | 🔄 |
| Cắm Rễ Phân Tán+ (Spreading Roots+) | `augment:da_spreadingrootsplus` | Không còn cho búa rèn (reforger) | ⬇️ |
| Thứ Hạng Tộc Hệ (Trait Ladder) | `augment:da_traitladder` | Giờ chỉ 1 người/sảnh · Mốc 10 tộc/hệ: 18 Vàng · Mốc 11 tộc/hệ: Trang Bị Linh Thú (mốc mới) | 🔄 |
| Cây Tộc/Hệ+ (Trait Tree+) & Nồi Nấu Ăn (Cooking Pot) | `augment:da_thetraittreeplus` / `augment:da_cookingpot` | Giờ loại trừ lẫn nhau | ⚙️ |
| Không Đối Thủ (Unrivaled) — cả 2 bậc | `augment:da_18_rivalsaugment` / `...plus` | Năng lượng từ Kha'Zix cho Rengar: 70%⇒50% · Hồi máu từ Rengar cho Kha'Zix: 50%⇒25% | ⬇️ |

**Sửa `nameVi` sai lệch trong lượt này (đã được người dùng duyệt):** `Unrivaled` DB đang ghi `nameVi = "Hóa Thù Thành Bạn"`, patch note chính thức gọi là **"Không Đối Thủ"** — sửa cả 2 bậc (`da_18_rivalsaugment`, `da_18_rivalsaugmentplus`) trong codex update script.

## Tinh Linh (Wisp) — giảm giá hàng loạt

Người dùng đã chọn gộp hiển thị theo nhóm trên `/patch` (không tạo entry riêng cho từng Wisp), nhưng toàn bộ entityId/giá cũ-mới dưới đây đều đã tra đúng để phục vụ tra cứu và ghi note đầy đủ.

### Tinh Linh Giao Tranh (Combat) — hầu hết giảm giá 1-2 vàng

| Wisp | entityId | Giá cũ⇒mới | Ghi chú khác |
|---|---|---|---|
| Lá Chắn (Barrier) | `wisp:barrier` | 4⇒3 | |
| Ngôi Sao Hàng Sau (Backrow Star) | `wisp:backrow-star` | 3⇒1 | |
| Trang Bị Vay Mượn (Borrowed Gear) | `wisp:borrowed-gear` | (không đổi giá) | Đổi cơ chế: cho trang bị vào ĐẦU giai đoạn giao tranh |
| Mưa Đai Lưng (Bunch-o'-Belts) | `wisp:bunch-o-belts` | 2⇒1 | |
| Nổ Cảm Tử (Combust) | `wisp:combust` | 5⇒3 | Sát thương theo HP tối đa: 15%⇒12% |
| Mưa Như Trút (Downpour) | `wisp:downpour` | 3⇒2 | |
| Trừng Trị (Infliction) | `wisp:infliction` | 6⇒4 | |
| Khối Chắn Cùn (Ironwood) | `wisp:ironwood` | 3⇒2 | |
| Lớn Muộn (Late Bloomer) | `wisp:late-bloomer` | 6⇒4 | |
| Bão Sét (Lightning Storm) | `wisp:lightning-storm` | 5⇒3 | |
| Sét Đánh (Lightning Strike) | `wisp:lightning-strike` | 2⇒1 | |
| Lửa Rừng Già (Blaze) | `wisp:blaze` | 5⇒3 | |
| Linh Thú Cường Tráng (Fellowship) | `wisp:fellowship` | 4⇒3 | |
| Hầm Nhừ (Giant's Aura) | `wisp:giant-s-aura` | 5⇒3 | |
| Siêu Hùng Giáng Thế (Hero's Entrance) | `wisp:hero-s-entrance` | 4⇒2 | |
| Ngôi Sao Khách Mời (Hireling) | `wisp:hireling` | 5⇒2 | |
| Tâm Sắt (Iron Core) | `wisp:iron-core` | 2⇒1 | |
| Cuồng Nộ Sát Nhân (Killing Frenzy) | `wisp:killing-frenzy` | 3⇒2 | |
| Ác Giả Ác Báo (Killer's Regret) | `wisp:killer-s-regret` | 2⇒1 | |
| Bậc Thầy Thuật Sư (Mana-Rich Soil) | `wisp:mana-rich-soil` | 3⇒2 | |
| Lá Chắn Thù Hận (Petrify Shields) | `wisp:petrify-shields` | 2⇒1 | |
| Hạt Cây Vỏ Đá (Potted Stonebark) | `wisp:potted-stonebark` | 2/1⇒1/0 | |
| Hạt Giống Hoa Sinh Mệnh (Potted Lifebloom) | `wisp:potted-lifebloom` | 2/1⇒1/0 | |
| Ấn Ma Mị (Phantom Emblem) | `wisp:phantom-emblem` | 3⇒2 | |
| Ánh Sáng Hóa (Radiantize) | `wisp:radiantize` | 4⇒3 | |
| Sức Mạnh Báo Thù (Revenge) | `wisp:revenge` | 3⇒2 | |
| Áo Choàng Cô Độc (Solitude's Cloak) | `wisp:solitude-s-cloak` | 3⇒2 | |
| Đứng Một Mình (Stand Alone) | `wisp:stand-alone` | 3⇒2 | |
| Siêu Chí Mạng (Supercritical) | `wisp:supercritical` | 3⇒2 | |
| Cung Thủ Ngọn Cây (Treetop Archers) | `wisp:treetop-archers` | 5⇒3 | |
| Động Đất (Tremors) | `wisp:tremors` | 4⇒3 | |
| Linh Hồn Yordle (Yordle Spirit) | `wisp:yordle-spirit` | 3⇒2 | |

### Tinh Linh Kinh Tế (Economy)

| Wisp | entityId | Giá cũ⇒mới | Ghi chú khác |
|---|---|---|---|
| Móc Túi (Cutpurse) | `wisp:cutpurse` | 3⇒2 | Tỉ lệ Vàng: 15%⇒20% |
| Thua Có Lời (Good Loss) | `wisp:good-loss` | 5⇒4 | |
| Hoàn Tất Phi Vụ (Payday) | `wisp:payday` | 4⇒3 | |
| Học Chậm (Slow Study) | `wisp:slow-study` | 4⇒2 | |

**Sửa `nameVi` sai lệch (đã duyệt):**
- `wisp:cutpurse`: DB `"Thịnh Vượng Muôn Năm"` → **"Móc Túi"**
- `wisp:payday`: DB `"Điểm Thưởng Bùng Nổ"` → **"Hoàn Tất Phi Vụ"**
- `wisp:slow-study`: DB `"Giữ Để Học"` → **"Học Chậm"**

### Tinh Linh Cửa Hàng (Shop)

| Wisp | entityId | Giá cũ⇒mới | Ghi chú khác |
|---|---|---|---|
| Chỉ 5 Vàng (All Fives) | `wisp:all-fives` | 10⇒8 | |
| Chỉ 4 Vàng (All Fours) | `wisp:all-fours` | 4⇒3 | |
| Ngôi Làng Vùng Biên (Border Village) | `wisp:border-village` | 6/4⇒3/2 | |
| Chuột Nhắt Lan Tràn (Field of Mice) | `wisp:field-of-mice` | — | **Đã bị LOẠI BỎ hoàn toàn khỏi game** |
| Bàn Nóng (Flash Fire) | `wisp:flash-fire` | 2⇒1 | |
| Chơi Đường Giữa (Middle Path) | `wisp:middle-path` | 6/4⇒4/3 | |
| Càng Đông Càng Vui (Roly-Polys) | `wisp:roly-polys` | 4⇒3 | |
| Tổ Đội Tìm Kiếm (Search Party) | `wisp:search-party` | 3/1⇒1/0 | |
| Thị Trấn Khởi Động (Starting Town) | `wisp:starting-town` | 3/2⇒2/1 | |

**Sửa `nameVi` sai lệch (đã duyệt):**
- `wisp:field-of-mice`: DB `"Đội Quân 1 Vàng"` → **"Chuột Nhắt Lan Tràn"** (dù bị gỡ khỏi game, vẫn sửa để lịch sử hiển thị đúng nếu còn tham chiếu)
- `wisp:middle-path`: DB `"Quận Trung Tâm"` → **"Chơi Đường Giữa"**
- `wisp:roly-polys`: DB `"Giữ Để Đổi Lại"` → **"Càng Đông Càng Vui"**
- `wisp:search-party`: DB `"Lựa Và Chọn"` → **"Tổ Đội Tìm Kiếm"**

### Tinh Linh Khác (Other)

| Wisp | entityId | Giá cũ⇒mới |
|---|---|---|
| Chế Tạo Thuốc (Potioncraft) | `wisp:potioncraft` | 3⇒2 |
| Smurf (Smurfing) | `wisp:smurfing` | 7/6⇒6/5 |

## Sửa lỗi đáng chú ý (đưa vào patch report — dạng mechanic)

Theo tiền lệ bản 18.1 launch: **không** đưa toàn bộ ~20 mục sửa lỗi nhỏ (VFX, tooltip, UI hiển thị...) vào patch report vì không có giá trị tra cứu và làm loãng trang. Chỉ 2 mục dưới đây đáng chú ý vì là **tính năng/vật phẩm từng bị vô hiệu hóa nay được bật lại** — người chơi có thể thấy khác biệt thật khi build đội hình:

| Mục | Thay đổi |
|---|---|
| Double Trouble | Đã bật lại (re-enabled); sửa lỗi Adaptor khác loại không nhận hiệu ứng; sửa lỗi tướng 2★ tạo ra đôi khi đếm nhân đôi tộc/hệ |
| Hullcrusher (Tạo Tác) | Máu được giữ khi tướng triệu hồi trong combat — đã bật lại (re-enabled) |

Các mục còn lại (MOBILE login persistence, Early Learning nhân đôi đúng cho 1 vàng, Augment 1-người-1-sảnh, Sentinel/Elderwood knockup + Unstoppable, Yorick tooltip, Coven Emblem carousel, Draven's Bounty Seeker, 2★ shop highlight, PvE loot placement, Akali Lich Bane, Krug's Alpha Mark, Thief's Gloves ghost board, Murk Wolf leap range, Edge of Night + Salvager, Kha'Zix visual timing, Blossom gold display, Burn VFX, melee range VFX, Yorick bench display, health bar color, Tactician right-click) — **không đưa vào patch report**, chỉ lưu trong file này để tham khảo nếu cần.

## Vật phẩm trang trí (Cosmetics)

39 vật phẩm trang trí được chuyển đổi trong 18.2 (Legendary Arenas, Mythic Arenas/Chibi/Unbound, Prestige Boom/Chibi, Standard Arena/Boom, Little Legend). **Không thuộc phạm vi codex/patch board** (theo tiền lệ 18.1 launch) — chi tiết đầy đủ nằm trong toàn văn EN đã lấy ở `_pending/tft18-2-candidate.md`.

## Vấn đề dữ liệu phát hiện thêm (đã người dùng duyệt xử lý trong lượt này)

`nameVi` của một số Wisp/Augment trong DB **không khớp bản dịch chính thức của Riot** — lỗi có sẵn từ trước (không do bản vá này gây ra), khả năng do nguồn scrape (metatft) dùng bản dịch khác/cũ hơn bản dịch chính thức mà Riot công bố qua patch note. Đã sửa cho đúng các mục bị chạm trong 18.2 (liệt kê ở từng mục trên). Có thể còn nhiều Wisp/Augment khác ngoài phạm vi bản vá này cũng bị lệch tương tự — cần audit riêng sau, không thuộc phạm vi lượt này.

## Tổng kết phạm vi ghi DB

**Patch report** (`scripts/db/drafts/patch-tft18-2.ts`): 1 report mới.
- 1 entry hệ thống (XP mỗi cấp)
- 6 entry tộc/hệ
- 28 entry tướng (gồm cả các dòng 3★ gộp vào entry gốc)
- 6 entry trang bị (3 thường + 3 ánh sáng)
- 6 entry tạo tác
- 8 entry ấn
- ~20 entry nâng cấp
- 4 entry Tinh Linh gộp theo nhóm (Combat/Economy/Shop/Other)
- 2 entry mechanic (Double Trouble, Hullcrusher re-enable)

**Codex sync** (`scripts/db/apply-live-balance-tft18-2.ts`):
- `set18_traits`: 6 tộc/hệ (Blackthorn, Fae, Hunter, Inferno, Rapidfire, Solar) — số liệu + text mô tả nếu anchor sạch.
- `set18_champions`: 28 tướng — stats/forms/calcs theo bảng trên.
- `set18_items`: 6 item thường/ánh sáng + 6 tạo tác + 8 ấn — statBadges/description theo giá trị mới.
- `set18_augments`: ~20 augment — số liệu + **sửa nameVi Unrivaled** (2 bậc).
- `set18_wisps`: giá 4 nhóm (~48 wisp) + gỡ Field of Mice + **sửa nameVi 4 wisp lệch** (Cutpurse, Payday, Slow Study, Field of Mice) + 3 wisp lệch nhóm Shop (Middle Path, Roly-Polys, Search Party).

Không đụng `set18_tips` — bản vá không có nội dung liên quan.
