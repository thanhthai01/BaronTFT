# Patch 18.1ag — Codex DB sync: các mục KHÔNG có anchor an toàn

Đã dump trực tiếp dữ liệu thật từ DB (production) để đối chiếu — không đoán theo patch note. Dưới đây là các mục mà "from" trong patch note KHÔNG khớp với bất kỳ field nào trong DB, hoặc DB không có chỗ lưu khái niệm đó. Patch REPORT (`patch-tft18-1ag.ts`) vẫn có đầy đủ các mục này (người đọc thấy đúng số liệu Truexy công bố) — chỉ codex DB sống (trang chi tiết tướng/tộc/wisp) là không tự động cập nhật cho các mục dưới đây.

## 1. Akali — AD Damage (145/220/345/590 → 145/220/380/645)

DB thật (calc total dạng AD): `140/210/320` — hoàn toàn không khớp "from" 145/220/345 của patch (lệch đều +5/+10/+25, không phải kiểu lệch 1 chu kỳ patch thường thấy). Dạng AP của Akali lại khớp hoàn hảo (140/210/340) — chỉ riêng AD lệch.

**Cần quyết định:** ghi đè thẳng theo "to" tính từ DB thật (140/210/320 + cùng độ lệch ước tính) hay bỏ qua hoàn toàn?

## 2. Ezreal — Spell AS (25% → 30%)

Ability text thật: "gain **25%/25%/100%** Attack Speed" (3 mốc sao, không phải 1 số duy nhất). Patch chỉ ghi 1 số "25%→30%".

**Cần quyết định:** đổi mốc 1 sao thôi (25%→30%, giữ nguyên 25%/100% còn lại) hay đổi tất cả 3 mốc theo cùng tỉ lệ?

## 3. Elder Dragon — AD (110 → 115)

DB thật `stats.attackDamage: [100, 150, 225]` — không có giá trị "110" nào trong đó. "AD: 110" trong patch note không khớp cấu trúc 3-tier chuẩn.

**Cần quyết định:** đây có phải field khác (vd base AD hiển thị ở nơi khác) hay bỏ qua?

## 4. Maokai — HP (1100 → 1150)

DB thật `stats.health: [0, 0, 0]` — Maokai hiện có dữ liệu placeholder/chưa công bố đầy đủ (ability text cũng dùng dấu "?" thay số). Không có anchor.

**Khuyến nghị: bỏ qua, chờ Maokai được cập nhật dữ liệu đầy đủ.**

## 5 & 6. Elderwood — Protector Slam Damage + 9 Piece HP Bonus

Giống hệt case "Elderwood 7pc" đã gặp ở patch 18.1af: `breakpointDetails` threshold 7 và threshold 9 đều có `bullet.values: []` (rỗng) — schema không lưu số liệu riêng cho hiệu ứng Hộ Vệ Rừng (Protector) hay HP Bonus theo %.

**Khuyến nghị: bỏ qua (đã có tiền lệ ở 18.1af), không có chỗ lưu.**

## 7. Nesting Anvils (+) — Gold (8/12 → 4/8)

DB thật chỉ có DUY NHẤT số "12 gold" trong description, không có số "8" nào ở đâu cả (EN: Artifact Anvil → Component Anvil → 12 gold; VI lại có thêm 1 bước "Gói Trang Bị Thành Phần" mà EN không có — 2 field lệch cấu trúc từ trước, không phải do patch này).

**Cần quyết định:** patch's "8/12→4/8" ứng với đâu trong chuỗi 2 bước hiện có? Hay chỉ đổi số "12"→"8" (bỏ qua số 8→4 vì không có field)?

## 8. Heroic Sacrifice (wisp) — Health (1500/1800 → 1200/1500)

Bảng `set18_wisps` không có field lưu "Health" cho wisp nào cả (chỉ có `cost`, `description`, `appearsVi`...). Không có chỗ lưu.

**Khuyến nghị: bỏ qua, schema không hỗ trợ.**

## 9. Cassiopeia — không phải "thiếu anchor" mà là DB đã ở sẵn giá trị "to"

Ability/abilityVi (text thường) hiện ĐÃ LÀ `440/660/1050` — trùng khớp giá trị ĐÍCH của patch này, không phải "from" (425/640/1020). Có thể đã được đồng bộ từ trước hoặc trùng hợp. Riêng `abilityHtmlVi` (bản HTML hiển thị) lại đang stale ở `400/600/960` — khác cả from lẫn to.

**Đề xuất: chỉ sửa `abilityHtmlVi` cho khớp lại `440/660/1050` (đồng bộ nội bộ, không phải áp dụng patch này) — không cần hỏi, sẽ tự làm trừ khi bạn phản đối.**

---

## Các mục ĐÃ CÓ anchor rõ ràng, sẽ tự động sync (không cần duyệt riêng)

- Akali AP: 140/210/340 → 140/210/365 (bỏ qua số thứ 4 "535→620", DB chỉ lưu 3 mốc sao)
- Gromp AP Form Secondary: 145/220/345 → 160/240/360 (bỏ qua số thứ 4)
- Azir Soldier Damage: 46/69/110 → 48/72/115 (bỏ qua số thứ 4)
- Fiddlesticks Heal: 395/470/790 → 410/485/850 (bỏ qua số thứ 4)
- Lillia Heal: 300/400/800 → 325/475/800 (mốc 3 sao giữ nguyên, patch không nhắc tới)
- Blackthorn: Tank Sacrifice HP Bonus 20%→17% (Resist giữ nguyên 17, khớp)
- Juggernaut: Durability mốc 4: 30%→33%, mốc 6: 40%→45% (mốc 2 giữ nguyên 20%)
- Band of Thieves II: 6→5 lượt giao tranh
- Bonus Gifts: 2→1 hộp vật phẩm xám
- Bonus Gifts (+1): 3→2 hộp vật phẩm xám
- Buried Treasures II (map vào augment:da_buriedtreasuresiii): 5→6 vòng
- Capital Gains II: 1→2 vàng ban đầu
- Comeback Story: 0.4%→0.3% Tốc Độ Đánh
- Golden Dragon: 700→600 Máu
- Investment Strategy II: 8→9 Máu mỗi điểm lãi
- Living Forge: 9→10 vòng
- Money Hungry+: 10→13 vàng ban đầu
- Flame On!: set `isPublished: false` (gỡ khỏi game — bảng augment CÓ field này, khác items dùng `visible`)
- Booster Pack, Dummify: chỉ là bugfix, description hiện tại đã đúng giá trị mong đợi — không cần đổi text.

**Về "Nesting Anvils (+)" và số 8 chưa xác định** — nếu bạn không có ý kiến khác, đề xuất mặc định: chỉ đổi số "12"→"8" (bỏ số 4 vì không rõ ứng với đâu), documented rõ trong script.
