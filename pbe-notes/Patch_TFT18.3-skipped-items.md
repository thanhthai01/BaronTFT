# Patch 18.3 — các mục KHÔNG có anchor an toàn trong codex (cần quyết định)

Toàn bộ các mục dưới đây đã có mặt trong **patch report** (đã ghi rõ ràng, người dùng đọc được đúng số liệu Riot công bố ở `/patch`). Vấn đề chỉ nằm ở việc đồng bộ **codex sống** (`/mua-18` — số liệu tướng/tộc hệ/trang bị hiện hành) vì DB hiện tại không khớp/không có field tương ứng.

## 1. Rammus — Lá chắn

- Patch note: `350/450/550 ⇒ 400/550/725`
- DB thực tế (`ability`/`abilityVi`): `325/400/500` — **không khớp** "from" của patch.
- Đã grep lịch sử (`pbe-notes/*.md`, `scripts/db/apply-*.ts`) không tìm thấy bản vá nào từng đổi Rammus Shield trước đó để giải thích lệch.
- Không tìm được phép nhân tỉ lệ nào giải thích 325→350 hay 400→450.
- **Đề xuất:** bỏ qua, không sửa codex. Patch report vẫn hiển thị đúng số liệu Riot.

## 2. Taric — Lá chắn nội tại (Passive Shield)

- Patch note: `Base Value: 100/225 ⇒ 75/150`
- DB thực tế: lưu dưới dạng **công thức %Máu tối đa**, không phải giá trị AP cố định — `calc.terms = "15%/15%/100% × Health"`, `total = "295/576/11300"`.
- Đây là lệch MÔ HÌNH dữ liệu (không phải lệch số): DB không có field "base value" tách biệt kiểu patch note mô tả, chỉ có hệ số % Máu tối đa.
- **Đề xuất:** bỏ qua field này trong codex. (Phần "Taric Heal: 250/375⇒275/450" đã có anchor sạch, vẫn áp dụng bình thường.)

## 3. Alistar — Hồi máu (Heal)

- Patch note: `200/260/320 AP ⇒ 230/300/400 AP`
- DB thực tế: `calc.terms = "1 + 8% × Health"`, `total = "276/336/396"` — giá trị "1" ở đây trông như lỗi nhập liệu (đáng lẽ phải là mảng base value thật), và số liệu tổng không tính ra khớp gọn với cách patch mô tả.
- Thử ngược nhiều cách suy luận (base cố định + %Máu tối đa theo từng mốc sao) đều không khớp cả 3 mốc cùng lúc.
- **Đề xuất:** bỏ qua field này trong codex. (Phần "Alistar Ability Damage: 100/150/225⇒180/270/420" đã có anchor sạch, vẫn áp dụng bình thường.)

## 4. Ornn — Thưởng Sức Mạnh Rèn 3 sao (+100%⇒+85%)

- Patch note: `three-star Forge Power Bonus: +100% ⇒ +85%`
- DB thực tế: mô tả bằng CHỮ "doubled at 3-star" ("nhân đôi ở mốc 3 sao"), không có con số "100%" nào trong text để thay.
- **Đề xuất:** bỏ qua riêng dòng này. (Phần "2nd Artifact Threshold: 155,000⇒140,000" đã có anchor sạch — khớp chính xác với `Forge Power: 90000/155000/180000` trong DB — vẫn áp dụng bình thường.)

## 5. Lux — Solar Bonus Damage per 3-star (12%⇒15%)

- Patch note: `Solar Lux Bonus Damage per 3-star: 12% ⇒ 15%`
- Đây không phải số liệu riêng của Lux mà thuộc **trait Solar** (bonus theo số tướng 3 sao). DB text của Solar có đoạn mô tả EN bị lỗi/không rõ ràng:
  `"1 : Increase shield and magic damage by 1% for each 3-star. \n3 : 15% and 12\n5 : Convert 40%..."`
  — dòng "3 : 15% and 12" trông như bị cắt cụt, không rõ "12" là gì (không có đơn vị/hậu tố đi kèm).
- **Đề xuất:** bỏ qua, không đủ tin cậy để sửa. Đây có thể là lỗi dữ liệu scrape có sẵn từ trước, không phải do bản vá này.

## 6. Coven — Essence Per Loss (mốc thứ 2 trong 4 mốc)

- Patch note: `18/25/32/60 ⇒ 22/28/35/60`
- DB thực tế 4 mốc (threshold 3/4/5/7): `18/22/32/60` — mốc thứ 2 (threshold 4) hiện là **22**, không phải **25** như "from" của patch.
- 3 mốc còn lại khớp hoàn toàn: threshold 3 (18→22 ✓), threshold 5 (32→35 ✓), threshold 7 (60, không đổi ✓).
- **Đề xuất:** áp dụng 3 mốc khớp, bỏ qua riêng mốc threshold 4 (giữ nguyên 22, không có anchor an toàn để xác nhận nó nên thành 28 hay giữ nguyên).

## 7. Hunter Emblem — SMCK mỗi mạng hạ gục (18%⇒15%)

- Patch note: `Hunter Emblem AD Per Takedown: 18% ⇒ 15%`
- DB có 3 giá trị khác nhau cho cùng 1 khái niệm, không cái nào khớp "18%":
  - `description`: "Takedowns grant **12%** Attack Damage."
  - `statLine`: "**30%**"
  - `statBadges`: `{"stat":"ad","value":"25%"}`
- Không rõ nên tin field nào, và không field nào khớp patch note để làm anchor.
- **Đề xuất:** bỏ qua hoàn toàn, không sửa bất kỳ field nào. Đây là dữ liệu DB không nhất quán có sẵn từ trước bản vá này — cần audit riêng, ngoài phạm vi 18.3.

---

**Tất cả các mục trên đều đã đề xuất "bỏ qua codex" (giữ nguyên DB hiện tại), patch report vẫn hiển thị đúng số liệu Riot công bố.** Nếu người dùng đồng ý với toàn bộ đề xuất, script `apply-live-balance-tft18-3.ts` sẽ áp dụng đúng như liệt kê (skip 7 mục trên, áp dụng mọi anchor sạch khác).
