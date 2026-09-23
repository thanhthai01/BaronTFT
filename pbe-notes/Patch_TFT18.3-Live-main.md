# Patch TFT 18.3 — Bản cập nhật CHÍNH, tập trung Champs/Traits nhỏ gọn + buff Augment giao tranh

**Nguồn gốc:** Patch note chính thức Riot.
- EN: <https://teamfighttactics.leagueoflegends.com/en-us/news/game-updates/teamfight-tactics-patch-18-3/>
- VI: <https://teamfighttactics.leagueoflegends.com/vi-vn/news/game-updates/teamfight-tactics-patch-18-3/> — **CHƯA XUẤT BẢN (404)** tại thời điểm soạn (23/09/2026). Toàn bộ tên tướng/tộc hệ/trang bị/augment/wisp dưới đây dùng lại tên tiếng Việt CHÍNH THỨC đã có sẵn trong DB từ các bản vá trước (không tự dịch mới) — không có thực thể nào mới phát sinh trong bản 18.3 này.

**Thời điểm đăng:** 2026-09-22T18:00:00Z (giờ Mỹ) — phát hiện qua trang tin Riot en-us ngày 2026-09-23 giờ VN.
**Phiên bản dùng cho site:** `Live 23/09/2026 (18.3)`.
**Baseline trước đó:** `Live 15/09/2026 (18.2b)`.
**Tác giả:** Rodger "Riot Prism" Caudill, Katie "Riot Ukime" Guo.

Quy ước: ⬆️ buff · ⬇️ nerf · 🔄 rework (đổi hướng, vừa buff vừa nerf trong cùng 1 mục) · ⚙️ cơ chế/sửa lỗi.

## Bối cảnh (tóm tắt lời mở đầu Riot)

Bản vá cỡ vừa, thu hẹp phạm vi so với 18.2 — chủ yếu nerf trần sức mạnh (power ceiling) hoặc nâng sàn sức mạnh (power floor) cho Champs/Traits, cùng loạt buff diện rộng cho các Augment giao tranh (combat) từng bị lép vế trước Augment kinh tế. Điểm nhấn: hồi sinh Wolf Bros (Warwick + Murkwolf) làm đội hình reroll cấp 6, nerf Blossom (3) khi splash vào đội hình mạnh, bug fix PvE và UI chọn Augment.

## Tộc/Hệ

| Tộc/Hệ | entityId | Thay đổi | Hướng |
|---|---|---|---|
| Vệ Quân (Defender) | `trait:defender` | Chống Chịu (mốc cao nhất): 120⇒115 | ⬇️ |
| Thợ Săn (Hunter) | `trait:hunter` | SMCK cộng thêm (mốc cao nhất): 65%⇒60% (các mốc thấp hơn giữ nguyên 20/30/40%) | ⬇️ |
| Hỏa Ngục (Inferno) | `trait:inferno` | Thiêu Đốt (2 mốc cao nhất): 3.5/4.5%⇒3/4% (2 mốc thấp giữ nguyên 1/1%) | ⬇️ |
| Thuật Sĩ (Invoker) | `trait:invoker` | Hồi Năng Lượng (mốc cao nhất): 9⇒8 (các mốc thấp giữ nguyên 3/4/6) | ⬇️ |
| Tiên Hắc Ám (Coven) | `trait:coven` | Tinh Túy mỗi lượt thua: 18/25/32/60⇒22/28/35/60 (mốc cuối giữ nguyên) | ⬆️ |

Lý do Riot nêu: Defender/Hunter/Invoker/Inferno chỉ nerf ở breakpoint cao nhất (nơi Ấn/Emblem mạnh cho quá nhiều giá trị), cố tình chia nhỏ để không làm vô dụng cả breakpoint lẫn Emblem tương ứng — sẽ còn tiếp tục nerf Emblem ở các bản sau. Coven được buff cashout vì bản gốc quá dè dặt so với các tộc/hệ high-stakes trước đây.

### Wisp gắn với Blossom — nerf hàng loạt (gọi chung "Blossom Charms" trong patch note)

Lý do: các Wisp này khi splash cùng Blossom (3) cho quá nhiều giá trị. Đây là 13 **Wisp** riêng biệt bị nerf trực tiếp (không phải thay đổi trait Blossom):

| Wisp | entityId | Thay đổi | Hướng |
|---|---|---|---|
| Cửa Hàng Động (Animate Shop) | `wisp:animate-shop` | Thời gian: 26s⇒24s | ⬇️ |
| Lửa Rừng Già (Blaze) | `wisp:blaze` | Sát thương: 1.5% Máu tối đa⇒1.25% Máu tối đa | ⬇️ |
| Tài Lộc Từ Máu (Blood Money) | `wisp:blood-money` | Giá: 1v⇒2v | ⬇️ |
| Nổ Cảm Tử (Combust) | `wisp:combust` | Sát thương: 22%⇒18% | ⬇️ |
| Quầy Đồ Lạ (Curio Cart) | `wisp:curio-cart` | Vàng thưởng: 2v⇒1v | ⬇️ |
| Kình Địch Nảy Lửa (Heated Rivalry) | `wisp:heated-rivalry` | Số lần Hạ Gục cần: 7⇒5 | ⬇️ |
| Hy Sinh Anh Dũng (Heroic Sacrifice) | `wisp:heroic-sacrifice` | SMCK/SMPT: 40%⇒35% · Giáp/Kháng Phép: 40⇒35 | ⬇️ |
| Khổng Lồ Hóa (Hugify) | `wisp:hugify` | Máu: 600⇒500 | ⬇️ |
| Bậc Thầy Thuật Sư (Mana-Rich Soil) | `wisp:mana-rich-soil` | Giảm Năng Lượng: 25%⇒20% | ⬇️ |
| Ngoại Binh (Mercenary Force) | `wisp:mercenary-force` | Khuếch Đại Sát Thương: 4.5%⇒4% | ⬇️ |
| Nghi Thức Ánh Trăng (Moonlight Ritual) | `wisp:moonlight-ritual` | Giá: 2v⇒3v | ⬇️ |
| Giao Kèo Hắc Ám (Sinister Deal) | `wisp:sinister-deal` | Vàng: 3v⇒2v · Máu mất: 3HP⇒2HP | ⬇️ |
| Đứng Một Mình (Stand Alone) | `wisp:stand-alone` | Máu/Sát thương cộng thêm: 22%⇒20% | ⬇️ |

## Tướng

| Tướng | entityId | Giá | Thay đổi | Hướng |
|---|---|---|---|---|
| Karma | `champion:tft18_karma` | 1 | Sát thương chiêu (Nổ): 120/180/270/460⇒125/185/300/515 AP | ⬆️ |
| Ornn | `champion:tft18_ornn` | 1 | **3★**: Thưởng Sức Mạnh Rèn +100%⇒+85% · Ngưỡng Tạo Tác thứ 2: 155,000⇒140,000 Sức Mạnh Rèn | ⬇️ |
| Veigar | `champion:tft18_veigar` | 1 | SMPT/mạng hạ gục: 3%⇒2% · Sát thương chiêu cơ bản: 175/265/395/670⇒200/300/450/765 AP · Sát thương chiêu cường hóa: 265/400/595/1015⇒300/450/675/1015 | ⬇️ (giảm scale theo mạng hạ gục, đổi lại buff sát thương cơ bản — Riot ghi rõ mục tiêu là giảm trần sức mạnh) |
| Alistar | `champion:tft18_alistar` | 2 | Hồi máu: 200/260/320⇒230/300/400 AP · Sát thương chiêu: 100/150/225⇒180/270/420 AP | ⬆️ |
| Gromp | `champion:tft18_gromp` | 2 | Dạng SMPT — Sát thương theo thời gian: 160/240/360⇒175/265/410 AP · Dạng SMCK — Tốc Độ Đánh: 0.7⇒0.75 · SMCK cơ bản: 45⇒50 | ⬆️ |
| Murkwolf | `champion:tft18_murkwolf` | 2 | Sát thương đòn nhảy cường hóa: 60/90/135⇒65/100/160 AD | ⬆️ |
| Warwick | `champion:tft18_warwick` | 2 | Sát thương chiêu: 215/325/500⇒230/345/535 AD · Hồi máu: 20%⇒25% | ⬆️ |
| Azir | `champion:tft18_azir` | 3 | Sát thương chiêu Lính Cát: 43/65/103⇒46/69/110 | ⬆️ |
| Cassiopeia | `champion:tft18_cassiopeia` | 3 | Sát thương chiêu: 400/600/950⇒425/630/1020 | ⬆️ |
| Rammus | `champion:tft18_rammus` | 3 | Lá chắn: 350/450/550⇒400/550/725 | ⬆️ |
| Lillia | `champion:tft18_lillia` | 4 | Hồi máu: 325/475⇒350/525 AP | ⬆️ |
| Nidalee | `champion:tft18_nidalee` | 4 | Sửa lỗi: Dạng SMCK đang giảm 60% Giáp địch thay vì đúng 40% — hiển thị nay đổi 40%⇒60% (không đổi số thực tế) · Dạng SMCK — Sát thương chiêu: 225/340⇒210/315 AD (nerf thật, sau khi tính cả phần sửa lỗi giáp) · Dạng SMPT — Sát thương đòn đánh thứ 3: 300/450⇒330/500 AP | 🔄 (nerf dạng SMCK đang mạnh nhất, buff dạng SMPT ít được lên đồ) |
| Lux | `champion:tft18_lux` | 5 | **Dạng Mặt Trời (Solar)** — Thưởng sát thương mỗi 3★: 12%⇒15% | ⬆️ |
| Taric | `champion:tft18_taric` | 5 | Lá chắn nội tại cơ bản: 100/225⇒75/150 · Hồi máu kích hoạt: 250/375⇒275/450 AP | 🔄 (giảm lá chắn thụ động cố định, tăng hồi máu scale AP) |

**Ghi chú Nidalee:** patch note tách 1 dòng sửa lỗi (giáp xuyên hiển thị sai, không đổi số thực tế) và 1 dòng nerf thật liền kề nhau, dễ gây hiểu nhầm là 2 thay đổi độc lập — thực chất "sát thương chiêu Dạng SMCK giảm 225/340⇒210/315 AD" đã là con số SAU khi tính cả phần sửa lỗi giáp, không cần cộng dồn 2 hiệu ứng.

## Trang bị / Tạo Tác

| Trang bị | Thay đổi | Hướng |
|---|---|---|
| Đại Bác Hải Tặc (Gold Collector — patch note gọi tắt "The Collector") | SMCK: 40%⇒35% | ⬇️ |
| Khế Ước Vĩnh Hằng (Eternal Pact) | Năng Lượng khi Tank dùng chiêu: 15⇒10 | ⬇️ |
| Dao Điện Statikk (Statikk Shiv) | SMPT cơ bản: 15%⇒25% | ⬆️ |

**Lưu ý tên:** patch note Riot gọi tắt là "The Collector" (tên quen thuộc từ các mùa trước), nhưng DB Set 18 lưu tên đầy đủ **"Gold Collector"** (nameVi "Đại Bác Hải Tặc") — cùng một item (execute + rơi vàng, cộng SMCK), không phải 2 item khác nhau. Icon/tra cứu dùng đúng tên DB "Gold Collector" để khớp `set18-item-icons.ts`.

## Ấn (Emblems)

| Ấn | Thay đổi | Hướng |
|---|---|---|
| Ấn Đấu Sĩ (Brawler Emblem) | Sát thương: 2% Máu tối đa⇒2.5% Máu tối đa | ⬆️ |
| Ấn Thợ Săn (Hunter Emblem) | SMCK/mạng hạ gục: 18%⇒15% | ⬇️ |
| Ấn Thuật Sĩ (Invoker Emblem) | Hồi Năng Lượng: 3⇒2 | ⬇️ |
| Ấn Dũng Sĩ (Juggernaut Emblem) | Hồi Năng Lượng khi hạ gục: 15⇒10 | ⬇️ |

Lý do: Emblem nerf đi kèm nerf breakpoint cao nhất của trait tương ứng (Hunter/Invoker/Juggernaut ở trên/dưới), chỉ Brawler được buff riêng lẻ.

## Nâng Cấp (Augments)

| Nâng Cấp | entityId | Thay đổi | Hướng |
|---|---|---|---|
| Quà Tặng Bất Ngờ (Bonus Gift/+) | `augment:da_bonusgift` / `...plus` | Đổi tên hiển thị (số nhiều "Bonus Gifts"), không đổi hiệu ứng | ⚙️ |
| Lời Mời Hoa Linh (Blossom's Call) | `augment:da_18_blossomtraitaugment` | Chi phí Tinh Linh tối thiểu để thấy tướng 4 vàng theo giai đoạn: 15/6/4/0v⇒15/5/3/0v và X/15/8/5/0⇒X/15/8/4/0 | ⬇️ (khó thấy tướng 4 vàng hơn — buff cho người chơi vì chi phí thấp hơn để KÍCH HOẠT điều kiện) |
| Ân Sủng Thách Đấu (Challenger's Grace) | `augment:da_challengersgrace` | Thời gian hiệu ứng: 3s⇒4s | ⬆️ |
| Học Sớm (Early Learnings) | `augment:da_earlylearnings` | SMCK/SMPT nền: 5%⇒3% | ⬇️ |
| Điện Giật I (Electrocharge I) | `augment:da_electrochargei` | Sát thương theo giai đoạn: 30/50/70/90⇒25/40/60/80 | ⬇️ |
| Bảo Vệ Vô Tận (Infinity Protection) | `augment:da_infinityprotection` | **Vô hiệu hóa do lỗi** | ⬇️ |
| Khai Thác Trang Bị (Item Extraction) | `augment:da_blackthorntraitaugment` | Số lần khai thác: 4⇒3 · Giờ tặng kèm thêm 1 Azir | 🔄 |
| Cả Làng Cùng Vô Địch (It's Me, Baby) | `augment:da_itsmebaby` | Đổi tên ô trống được cường hóa từ "Spotlight" sang "Championship" | ⚙️ |
| Vận May Mỉm Cười (Feeling Lucky) | `augment:da_feelinglucky` | Sửa lỗi: lật mặt Ngửa không còn cho dư 4 vàng ngoài dự kiến | ⚙️ |
| Nền Tảng Tiền Tuyến (Frontline Foundation) | `augment:da_frontlinefoundation` | Giờ có thể tặng Ấn Yorick + Ấn Dũng Sĩ | ⬆️ |
| Tập Trung Tương Lai (Future Focused) | `augment:da_futurefocused` | Vàng: 8⇒5 | ⬇️ |
| To Xác Và Mạnh Mẽ (Giant and Mighty) | `augment:da_giantandmighty` | Máu: 200⇒225 | ⬆️ |
| Ôm Nhóm I (Group Hug I) | `augment:da_grouphugi` | Chống Chịu: 6⇒7 | ⬆️ |
| Ôm Nhóm II (Group Hug II) | `augment:da_grouphugii` | Chống Chịu: 9⇒10 | ⬆️ |
| Túi Quà Anh Hùng (Heroic Grab Bag) | `augment:da_heroicgrabbag` | Vàng khởi đầu: 4v⇒6v | ⬆️ |
| Giữ Vững Hàng Ngũ (Hold the Line) | `augment:da_holdtheline` | SMCK: 9%⇒11% · SMPT: 10%⇒11% | ⬆️ |
| Hoa Sen Ngọc Bích I (Jeweled Lotus I) | `augment:da_jeweledlotus_i` | Tỉ lệ Chí Mạng: 10%⇒15% | ⬆️ |
| Báo Ứng (Retribution) | `augment:da_retribution` | Tỉ lệ Chí Mạng: 25%⇒15% | ⬇️ |
| Tinh Túy Kim Long (Shimmerscale Essence) | `augment:da_shimmerscaleessence` | Số vòng trì hoãn: 8⇒6 · Đổi thứ tự trang bị: món đầu tiên giờ là Lưỡi Kiếm May Mắn, món thứ hai là Áo Giáp Đại Vương (đảo ngược so với trước) | 🔄 |
| Tinh Thần Cứu Rỗi (Spirit of Redemption) | `augment:da_spiritofredemption` | Hồi máu: 7.5%⇒9% | ⬆️ |
| Cơ Động Đi Lên (Upward Mobility) | `augment:da_upwardmobility` | Số lần reroll miễn phí khi lên cấp: 1⇒2 | ⬆️ |
| Chiều Cao (Verticality) | `augment:da_verticalityi` (và các bậc liên quan) | Giờ yêu cầu tối thiểu 4 tướng cùng tộc/hệ mới được đề xuất | ⬇️ (khó roll trúng hơn) |
| Đồng Lòng Sát Cánh (We Stick Together) | `augment:da_westicktogether` | Không còn cho trùng 1 Ấn cho nhiều người chơi · không cho Ấn của tộc/hệ quá nhỏ · loại trừ Ấn Dũng Sĩ/Đấu Sĩ/Vệ Quân | ⬇️ |
| Cân Đo Giá Trị (Weight the Worth) | `augment:da_18_weighttheworth` | Không còn tặng kèm 1 Máy Nhân Bản Tướng Nhỏ | ⬇️ |

**Chưa xác nhận entityId chính xác cho bậc "Verticality":** patch note chỉ ghi chung "Verticality" không phân biệt bậc I/II/III — DB có 3 bậc riêng (`da_verticalityi/ii/iii`). Cần xác nhận áp dụng cho cả 3 bậc hay chỉ 1 bậc cụ thể trước khi ghi draft.

## Wisps (ngoài nhóm Blossom Charms ở trên)

| Wisp | entityId | Thay đổi | Hướng |
|---|---|---|---|
| Máu Và Sắt (Blood and Iron) | `wisp:blood-and-iron` | Giá: 3v⇒4v | ⬇️ |
| Ba Chúng Tôi (Three Me) | `wisp:three-me` | Giá: 9v⇒10v | ⬇️ |

**Chưa xác định rõ "Stat Boosters" và "Thingamajig Wisps":**
- Patch note ghi "Stat Boosters — Armor and MR Boost: 10⇒8, Attack Speed Boost: 8%⇒6%" như một NHÓM, không nêu tên Wisp cụ thể. Đã rà DB (`set18_wisps`) không tìm thấy Wisp nào có mô tả khớp chính xác 2 dòng này (đã thử Bark Armor/Tattered Armor/Booster Shot/Phantom Armor — không khớp). Có thể đây là các Wisp chưa được đặt tên riêng biệt trong scrape/DB hiện tại, hoặc là buff/debuff áp dụng cho một class chung không lưu thành entity riêng. **Cần hỏi người dùng** trước khi ghi vào patch report — không đoán entityId.
- "Thingamajig Wisps: giảm khả năng cho Bình Hồi Năng Lượng" — đã xác định 3 Wisp khớp tên (`wisp:thingamajig-bag`, `wisp:thingamajig-jar`, `wisp:thingamajig-sack`), nhưng thay đổi mô tả là XÁC SUẤT rơi loot, không có số liệu before/after cụ thể — có thể chỉ ghi dạng `mechanic`, không có `changes` số liệu.

## Bug Fixes (gameplay + performance/stability)

Theo tiền lệ các bản trước: **không** đưa toàn bộ danh sách bugfix nhỏ vào patch report vì không có giá trị tra cứu số liệu. Toàn văn đầy đủ ~40 mục đã lưu ở `pbe-notes/_pending/18.3-candidate.md`. Không có mục nào nổi bật kiểu "tính năng bị vô hiệu hóa nay bật lại" (như Double Trouble/Hullcrusher ở 18.2) — chỉ có 1 mục đáng chú ý gameplay-wise:

| Mục | Thay đổi |
|---|---|
| Sửa lỗi Augment UI | Nút thu nhỏ giao diện có thể vô tình huỷ Augment vừa chọn khi bấm ngay sau khi chọn — đã sửa |

Còn lại (PvE spawn, Pandora's Bench double-count, Carousel disappear, animation timing, tooltip, v.v.) — không đưa vào patch report.

## Vật phẩm trang trí (Cosmetics)

34 vật phẩm trang trí được chuyển đổi trong 18.3 (Legendary Arenas/Booms, Mythic Arena/Boom/Chibi/Unbound, Prestige Chibi, Base Chibi). **Không thuộc phạm vi codex/patch board** (theo tiền lệ). Toàn văn đầy đủ ở `_pending/18.3-candidate.md`.

## Vấn đề dữ liệu phát hiện — CẦN NGƯỜI DÙNG QUYẾT ĐỊNH trước khi ghi draft

1. **"The Collector" (patch note) = "Gold Collector" (DB)** — cùng 1 item, tên gọi tắt vs tên đầy đủ. Đề xuất: dùng nguyên tên DB "Gold Collector" trong draft để icon/lookup hoạt động đúng, ghi chú tên gọi tắt trong `note`. Không cần hỏi, đây là suy luận chắc chắn (mô tả execute+gold match 100%).
2. **"Stat Boosters" (Armor/MR Boost, Attack Speed Boost)** — không tìm được Wisp cụ thể khớp trong DB. Cần hỏi: bỏ qua mục này (không đưa vào patch report vì thiếu anchor), hay người dùng biết tên Wisp thật tương ứng?
3. **"Verticality"** — patch note không phân biệt bậc I/II/III. Cần hỏi: áp dụng cho cả 3 bậc hay chỉ 1 bậc?
4. **"Thingamajig Wisps"** — có entity nhưng thay đổi là xác suất, không có số liệu before/after rõ ràng để ghi `changes`. Đề xuất: ghi dạng ghi chú `mechanic` không kèm số liệu, hoặc bỏ qua. Cần xác nhận.

## Tổng kết phạm vi ghi DB (dự kiến, chờ chốt các điểm ở trên)

**Patch report** (`scripts/db/drafts/patch-tft18-3.ts`):
- 5 entry tộc/hệ (Defender, Hunter, Inferno, Invoker, Coven)
- 13 entry wisp (nhóm "Blossom Charms")
- 14 entry tướng
- 3 entry trang bị/tạo tác
- 4 entry ấn
- ~23 entry augment (tuỳ chốt điểm Verticality có tách bậc không)
- 2-4 entry wisp khác (Blood and Iron, Three Me, + Stat Boosters/Thingamajig nếu chốt được)
- 1 entry mechanic (bugfix Augment UI)

**Codex sync** (`scripts/db/apply-live-balance-tft18-3.ts`):
- `set18_traits`: 5 tộc/hệ
- `set18_champions`: 14 tướng — cần dump trước để xác nhận anchor (đặc biệt Nidalee có bugfix lồng nerf, Lux chỉ form Solar, Ornn/Taric có nhiều field)
- `set18_items`: 3 item + 4 ấn
- `set18_augments`: ~23-27 augment
- `set18_wisps`: 15-17 wisp (13 Blossom Charms + Blood and Iron + Three Me + tuỳ Thingamajig/Stat Boosters)

Không đụng `set18_tips`.
