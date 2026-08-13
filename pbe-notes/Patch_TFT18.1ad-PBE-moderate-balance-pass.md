# Patch TFT18.1ad (PBE) — Moderate pass on balance (nháp, chưa duyệt)

> **Tên file tạm thời:** chưa rõ số patch chính thức theo Liquipedia (kiểu `Patch_TFT18.1`). Đặt tiếp theo 18.1ac (11/08) nên tạm gọi 18.1ad.

**Nguồn:** [@TheTruexy trên X](https://x.com/TheTruexy/status/2087635892190286143) — dev chính thức PBE.
**Thời điểm:** Truexy tự ghi trong caption là bản vá cho ngày "8/12". Timestamp hiển thị trên trang X (chưa đăng nhập, múi giờ không xác định chắc chắn): 3:22 AM · Aug 13, 2026.
**Ảnh gốc đã tải về (đối chiếu số liệu):**

- `pbe-notes/_pending/tft18-1ad-images/image1.png` (Cosmetics, Traits/Blackthorn, Primal, Set Mechanic/Wisps, Items/Artifact Items)
- `pbe-notes/_pending/tft18-1ad-images/image2.png` (Bug Fixes)

Truexy note kèm theo caption text (nguyên văn, dịch ý): bản vá nhẹ về balance hôm nay, nhưng có một loạt bugfix gameplay, một số cosmetic được bật, và bản rework Blackthorn. Về Artifacts, đội ngũ muốn giữ nhất quán rằng Artifact nên là trải nghiệm sắc bén/đáng nhớ, nên rất cẩn trọng không nerf mất phần thú vị của các item này. Tuy vậy vẫn cần cân bằng nhất quán, một phần là giới hạn tần suất Artifact xuất hiện và tần suất người chơi stack nhiều Artifact — với Ornn và Wisps, tỉ lệ ra Anvil hiện tại đang cao hơn mức đội ngũ mong muốn.

Chú thích: ▲ = buff, ▼ = nerf, không có mũi tên = rework/cơ chế/bugfix.

---

## Cosmetics

- Thêm một đợt tactician bậc Mythic có finisher, chọn được trong hàng chờ Enchanted Wilds trên PBE.

## Traits

### Blackthorn (Gai Đen)

- ▲ **Base Sacrifice Stats**
  - Tank: 17% Máu tối đa và 17 Kháng >>> 20% Máu tối đa và 17 Kháng
  - Attack Champion: 22% Sát thương vật lý + 10% Tốc độ đánh >>> 24% Sát thương vật lý + 12% Tốc độ đánh
  - Magic Champion: 13% Tăng sát thương phép + 1.7 Hồi Năng lượng >>> 14% Tăng sát thương phép + 1.7 Hồi Năng lượng
- ▼ **6-Piece Rework** (đổi cơ chế, không phải buff/nerf thuần)
  - Máu: 350 >>> 500
  - Tăng chỉ số nhận được thêm 50%
  - Đơn vị bị hiến tế giờ chết như mốc 2/4 (trước đó khác cơ chế chết)
  - Bỏ bonus stat riêng của mốc 6
- **Bugfixes**
  - Hex không còn bị dính lại trên màn hình hoặc lỗi không hiện trong một số điều kiện nhất định
  - Bảng xem trước chỉ số (stats preview) trong tooltip cập nhật phản hồi nhanh hơn

### Primal (Nguyên Sinh)

- Phoenix giờ tính cả pha hạ gục (takedown) lên đơn vị không phải tướng (non-champion).

## Set Mechanic — Wisps

- ▼ **Curio Cart (Quầy Đồ Lạ)**
  - Không còn thể cấp một Artifact ngẫu nhiên
  - Cập nhật tooltip để phản ánh đúng mức giá tối đa — DB hiện ghi "Trang bị có giá từ 0 đến 14 vàng" (descriptionVi), patch note ghi giá tối đa 15 vàng → lệch 1 mốc (14 vs 15), cần đối chiếu kỹ trước khi sync (xem Ghi chú soạn thảo)

## Items — Artifact Items

- ▼ **Dawncore (Lõi Bình Minh)**
  - AD/AP: 15 >>> 20
  - Giảm Năng lượng mỗi lần đánh phép (Mana Reduction Per Cast): 4% >>> 5%
  - Năng lượng tối thiểu (Minimum Mana): 10 >>> 15
  - Hồi Năng lượng (Mana Regen): 2 >>> 1
- ▼ **Eternal Pact (Khế Ước Vĩnh Hằng)**
  - AP cơ bản: 40 >>> 35
- ▼ **Fishbones (Pháo Xương Cá)**
  - Tốc độ đánh: 30% >>> 25%
  - Sát thương vật lý: 30% >>> 25%
- ▲ **Forbidden Idol** (DB chưa có bản dịch tiếng Việt cho tên/mô tả — `nameVi`/`descriptionVi` hiện đang trùng bản tiếng Anh)
  - Máu: 250 >>> 400
  - Tỉ lệ chuyển đổi Lá chắn (Shield Conversion): 35% >>> 40%
- ▲ **Talisman of Ascension (Bùa Thăng Hoa)**
  - Hồi Năng lượng khi đã Ascended (Ascended Mana Regen): 8 >>> 12
- ▼ **Titanic Hydra (Rìu Đại Mãng Xà)**
  - % Máu tối đa gây thêm sát thương (% Health as Bonus Damage): 4% >>> 2%

## Bug Fixes

(Tên riêng kèm bản dịch tiếng Việt lấy từ DB — `set18_augments`/`set18_wisps`/`set18_items`/`set18_traits` qua các file `src/content/set18/*.ts`; mục nào DB chưa có bản dịch hoặc chưa có entity tương ứng được ghi chú rõ.)

- **Hard Commit** (Chỉ Một Con Đường) không còn cấp emblem thiếu unit đủ mọi mốc giá tiền.
- Sửa lỗi **Booster Pack++** (Gói Tăng Cường++) trả thưởng sai.
- Wisp **Salvager** (Máy Tái Chế) không còn phá vỡ trang bị tạm thời do nhóm Wisp dòng Phantom cấp (Giáp Bóng Ma/Phantom Armor, Găng Ma Mị/Phantom Gloves, Giáp Ma Mị/Phantom Vest, Ấn Ma Mị/Phantom Emblem).
- **Find Your Center** (Tiền Vệ Trung Tâm) không còn spam SFX khi có unit đứng trong hex.
- **Abandon Ship** (Rời Tàu) không còn xoá anvil đang để trên ghế dự bị (bench).
- **Deadlier Caps** (Mũ Tử Thần), **Deadlier Blades** (Kiếm Tử Thần), **Solo Leveling** (Tôi Thăng Cấp Một Mình) không còn tác dụng lên đơn vị không phải tướng.
- **Collector** giờ hoạt động được trên đơn vị không phải tướng — không tìm thấy entity tên chính xác "Collector" trong DB hiện tại (chỉ có item "Gold Collector"/Đại Bác Hải Tặc — có thể không phải cùng một thứ, cần người dùng xác nhận đây là augment/mechanic nào).
- **Recombobulator** (Xoay Bài Tự Động) không còn chạy trên đội quân ma (ghost army) khi vừa được tạo ra.
- Biến hình sang non-base form qua **Recombobulator** (Xoay Bài Tự Động), **Pandora's Bench** (Hàng Chờ Pandora), hoặc **Polymorph** (Biến Hóa) không còn cấp tăng chỉ số bất thường.
- Tướng tạm thời do Wisp **"Hireling"** (Ngôi Sao Khách Mời) và **"Late Bloomer"** (Lớn Muộn) cấp không còn đóng góp vào Tộc hệ trong lượt combat.
- **Nesting Dolls** (Búp Bê Xây Tổ), **Sun and Moon** (Mặt Trời và Mặt Trăng — lưu ý DB đang có 2 bản ghi trùng tên khác nhau ở nameVi, một bản có dấu "+" thừa), **Makeshift Armor** (Giáp Tự Chế — DB có 2 mốc I/II), **Master of All Origins** (DB chưa có bản dịch, giữ nguyên tên gốc) lọc đúng lại (filter chính xác).
- **Phantom Splash** (Anh Hùng Bất Ngờ) hoạt động đúng với trait **Elderwood** (Thần Rừng) khi ở Away board.
- **Blood Money** (Tài Lộc Từ Máu) giờ chỉ rớt vàng khi tướng địch chết (trước đó có thể rớt sai điều kiện).
- Script quản lý form Lux cập nhật, dọn tàn dư hệ thống cũ cho tộc Lux — Lux trong shop giờ luôn là bản duy nhất khi chưa chọn form Lux.
- **Ride the Wave** (Đón Sóng) không còn thêm bản sao Lux vào shop bị tính tộc hệ tách rời, không cộng dồn với các bản Lux khác.
- LeBlanc không còn cấp bản sao Lux bị tính tộc hệ tách rời, không cộng dồn với các Lux khác.
- **Time Skip** (Vượt Thời Gian) không còn vô hiệu hoá shop suốt cả trận.

---

## Ghi chú soạn thảo

- Patch này **không đổi số liệu Champions/Wisps/Augments** — chỉ đổi Traits (Blackthorn rework, Primal bugfix), Items (6 Artifact Items), Set Mechanic (Curio Cart), Cosmetics, và một loạt Bugfixes gameplay/UI không có số liệu để sync.
- Cần sync codex DB (`set18_items`, `set18_traits`): 6 Artifact Items (Dawncore, Eternal Pact, Fishbones, Forbidden Idol, Talisman of Ascension, Titanic Hydra) và trait Blackthorn (base sacrifice stats theo 3 loại role + 6-piece rework). 
- Tên/mô tả tiếng Việt trong file này lấy nguyên từ `src/content/set18/set18-traits.ts`, `set18-wisps.ts`, `set18-items.ts` (generated từ DB) — không tự dịch. Forbidden Idol hiện chưa có bản dịch trong DB (nameVi/descriptionVi = bản tiếng Anh), giữ nguyên tên gốc cho tới khi DB có bản dịch. (chưa có bản dịch thì tạm thời dùng bản tiếng anh, sau này tôi sẽ bổ sung thêm cho db, )
- Curio Cart (Wisp) đổi mô tả cơ chế (không cấp Artifact ngẫu nhiên nữa). Về giá tối đa: DB hiện ghi descriptionVi "giá từ 0 đến 14 vàng", patch note nói tooltip cập nhật thành "15 vàng" — lệch 1 đơn vị so với DB hiện tại (14 vs 15). Cần người dùng xác nhận trước khi sync: có thể patch note tính "giá tối đa hiển thị" khác cách DB ghi "giá tối đa thực" (0-14 = 15 mức giá), hoặc DB đang lệch thật và cần sửa 14→15. (giá trị chính xác là 0 -> 15)
- Cosmetics và Bug Fixes: chỉ lên patch report, không có bảng codex tương ứng để sync.
- Primal (Phoenix bugfix): không có số liệu, chỉ lên patch report dạng bugfix/mechanic.
- **Cập nhật sau khi người dùng duyệt:** Blackthorn mốc 6 và 6 Artifact Items ban đầu định bỏ qua vì thiếu anchor an toàn — theo yêu cầu người dùng, đã bổ sung vào DB thay vì bỏ qua (xem `scripts/db/apply-pbe-balance-tft18-1ad.ts`):
  - Blackthorn mốc 6: viết mới `breakpointDetails` (không phải replaceExact có assert) để phản ánh cơ chế mới — rủi ro cao hơn phần còn lại, cần soát kỹ trước khi chạy.
  - 6 Artifact Items — **soát lại 2 lần** sau khi người dùng chỉ ra bỏ sót anchor: lần 1 ở description (Titanic Hydra), lần 2 ở `statLine` (Dawncore/Eternal Pact/Fishbones — statLine thực ra khớp "from" patch note, ban đầu tôi đánh giá nhầm là dữ liệu scrape không đáng tin). Kết quả cuối, dùng `replaceExact` (có assert) ở cả description LẪN statLine tuỳ item; chỉ những field thực sự không có anchor ở đâu cả mới ghi `statBadges` (field soát tay, chưa UI nào tiêu thụ nên an toàn để ghi mới):
    - Dawncore: replaceExact statLine "15% 15% 2"→"20% 20% 1" (khớp AD=15/AP=15/ManaRegen=2). replaceExact description "to a minimum of 10."→"...15." (Minimum Mana) cho cả EN/VI. Mana Reduction Per Cast: description ghi "7%" nhưng patch "from" là "4%" — LỆCH, không đủ tin cậy để replaceExact, chỉ ghi statBadges "to"=5%, cần soát lại vì sao lệch.
    - Eternal Pact: replaceExact statLine "40% 1"→"35% 1" (khớp Base AP=40). "40% Ability Power" trong description trùng số nhưng là cơ chế proc-on-death khác hẳn Base AP — cố ý KHÔNG đụng description.
    - Fishbones: replaceExact statLine "30% 30%"→"25% 25%" (khớp AS=30/AD=30). Description không có % nào khớp.
    - Forbidden Idol: replaceExact description "Shields have 35%...instead."→"...40%..." cho cả EN/VI (2 field hiện đang trùng hệt nhau vì chưa dịch). statLine "350 2": người dùng xác nhận đây là **lỗi nhập liệu cũ** (đáng lẽ "250 2" khớp "from" patch) — sửa luôn thành "400 2" (assert theo giá trị thực tế 350, không theo "from" patch 250). statBadges health=400 ghi song song.
    - Talisman of Ascension: replaceExact description "8 Mana Regen"→"12 Mana Regen" — CHỈ ở bản EN; descriptionVi không có cụm này (bản dịch thiếu), bù bằng statBadges. statLine "450 20% 20%" không khớp "8" — không đụng statLine.
    - Titanic Hydra: replaceExact description "4%...max Health"/"4% Máu tối đa"→"2%..." cho cả EN/VI — đây chính là chỗ người dùng phát hiện tôi bỏ sót ở lần soát đầu. statLine "300 20% 20%" không khớp "4%" — không đụng statLine.
