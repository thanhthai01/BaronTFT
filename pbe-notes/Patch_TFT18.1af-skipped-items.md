# TFT18.1af — Danh sách nội dung codex (đã cập nhật sau vòng duyệt tay)

Bạn đã duyệt tay từng mục trong file này — dưới đây là kết quả xử lý cuối cùng.

---

## Đã bổ sung vào codex sau vòng duyệt

- **Pebbles Spell Damage** — đối chiếu lịch sử patch xác nhận DB thật (150/225/340) là kết quả patch trước, không sai. Đã ghi 150/225/340 → 155/235/350.
- **Ornn** — Damage Needed for Each Artifact: ghi đè thẳng theo patch (90k/155k/180k), dù Forge Power thật trong DB không khớp "from".
- **Nidalee (AP)** — Empowered Spell Damage: ghi thẳng 285/425 vào field "đòn đánh thứ 3" (gần nghĩa nhất), theo chỉ đạo dùng số patch làm chuẩn khi không có anchor.
- **Kennen** — Spell Damage: ghi thẳng 475/715 vào firestorm tổng (600/900/2000 → 475/715/2000), theo chỉ đạo dùng số patch làm chuẩn.
- **Blossom** — xác nhận patch chỉ áp mốc 3/5/7/9 (mốc 11 giữ 100%). Mốc 3/5/7 DB đã đúng target sẵn (no-op), chỉ mốc 9 đổi 60%→50%.
- **Inferno Burn Duration** — tìm thấy anchor ở field `description` cấp trait (không phải breakpointDetails): "for 4 seconds" → "for 3 seconds". Đã gộp chung với phần Burn Amount đã ghi trước đó.
- **Moonrise** — xác nhận "Removed from 3-5 to 4-1" nghĩa là bỏ hoàn toàn ràng buộc mốc xuất hiện. Đã set `appearsStart`/`appearsEnd` = null, `appearsVi` = "Xuất hiện: Bất kỳ lúc nào".
- **Iron Core** — áp dụng cùng cách hiểu "bỏ ràng buộc" như Moonrise (dù DB thật trước đó là "4-2 đến 4-7", không khớp "3-5" của patch — tin theo kết quả cuối "không giới hạn" mà bạn xác nhận). Kèm phần % Health per front-row unit đã ghi trước đó (4%→6%).
- **Warwick** — xác nhận: chỉ ghi trong patch report (lịch sử `/patch`), KHÔNG ghi vào codex — đúng như quyết định ban đầu, không có gì thay đổi.

## Vẫn KHÔNG sync vào codex (đã xác nhận không có cách xử lý an toàn)

### Elderwood — 7 Piece Protector Base HP (400 → 450)

Đã đọc kỹ lại mô tả mốc 7 theo yêu cầu: `bullet.textVi` chỉ ghi "và Hộ Vệ Rừng" (nghĩa là tộc hệ triệu hồi thêm 1 đơn vị "Hộ Vệ Rừng"), `bullet.values` rỗng. Số HP 400/450 nhiều khả năng là chỉ số của ĐƠN VỊ triệu hồi đó (không phải field mô tả cấp trait) — schema `set18_traits.breakpointDetails` hiện không có chỗ lưu stat của unit triệu hồi. Không có bảng/field nào khác trong DB lưu khái niệm "Hộ Vệ Rừng" như một entity riêng để sửa.

### Adaptive Helm (Radiant) — bugfix cấp sai Năng Lượng

Patch chỉ nói "Fixed a bug where Radiant Adaptive Helm was providing the incorrect amount of bonus Mana" — không có số liệu đích cụ thể (không rõ giá trị ĐÚNG là bao nhiêu). Không đoán số — giữ nguyên "Gain an additional 30% Mana" hiện tại trong DB. Nếu bạn biết con số đúng, cho mình biết để bổ sung.

---

## Tổng kết phạm vi ĐÃ ghi vào codex (bản cập nhật cuối, để đối chiếu)

- **Champions (14):** Cinderling, Pebbles (Base AD + Spell Damage), Xayah, Ornn, Yunara, Kha'Zix, Raptor, Rengar (chỉ field EN), Vi, Brambleback, Nidalee, Kennen, Alune — đã ghi. Lux no-op (DB đã đúng từ trước).
- **Traits (3):** Inferno (Burn Amount + Burn Duration), Vanguard, Blossom.
- **Wisps (11):** Artifactinate, Backrow Star, Giant Growth, Killer's Regret, Snacktime!, Stealthy, Iron Core (% health + bỏ ràng buộc mốc), Ironwood, Radiantize, Terraforming, Moonrise (bỏ ràng buộc mốc).
- **Items (12):** Death's Defiance (ẩn khỏi UI), Aegis of Dusk, Manazane, Rapid Firecannon, Silvermere Dawn, Wit's End, Radiant Gargoyle Stoneplate, Radiant Hand of Justice, Radiant Steadfast Heart, Brawler Emblem, Executioner Emblem, Juggernaut Emblem, Vanguard Emblem.

**Còn lại 2 mục thực sự không có cách sync an toàn:** Elderwood 7pc HP, Adaptive Helm Radiant (không có số đích cụ thể).
