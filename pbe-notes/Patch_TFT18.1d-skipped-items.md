# Patch TFT18.1d — Các mục cần người dùng quyết trước khi ghi DB

Tất cả mục dưới đây **chưa** được đưa vào script codex update. Trả lời từng điểm rồi mình mới viết script.

Mọi mục khác trong bản vá đã có anchor khớp sạch (xem bảng cuối `Patch_TFT18.1d-live-micropatch.md`) và sẽ được ghi bình thường.

---

## 1. Cinderling — Sát thương chiêu (340/510/765 → 310/465/700)

**DB thật:**

- `ability` / `abilityVi` / `forms[0].abilityHtmlVi`: `300/450/680`
- `forms[0].calcs[0].total`: `"300/450/680"`
- `forms[0].calcs[0].terms`: `270/405/610 × AD` + `30/45/70 × AP`

**"From" của patch note (340/510/765) không khớp DB (300/450/680)** — nhưng đây KHÔNG phải lỗi nguồn. Đã truy ra nguyên nhân chính xác:

Bản 18.1af buff Base AD của Cinderling 40 → 45 (script `apply-pbe-balance-tft18-1af.ts` dòng 234-242). Script đó **chỉ đổi `attackDamage`, không tính lại sát thương chiêu dẫn xuất**. Kiểm chứng bằng phép nhân:

```
300 × 45/40 = 337.5 ≈ 340
450 × 45/40 = 506.25 ≈ 510
680 × 45/40 = 765      ✓ khớp chính xác
```

⇒ `300/450/680` trong DB là giá trị ở mức AD 40 (trước 18.1af). Riot ghi `340/510/765` vì tính ở AD 45. **DB đang trễ 1 nhịp so với live.**

Giá trị đích Riot công bố sau vá: **310/465/700** (ở mức AD mới 40).

**Cần quyết:**

- **(a)** Ghi `300/450/680` → `310/465/700` ở `ability`, `abilityVi`, `abilityHtmlVi`, `calcs.total`; đồng thời chỉnh `calcs.terms` `270/405/610` → `280/420/630` để tổng vẫn cộng đúng (`280+30=310`, `420+45=465`, `630+70=700`). **← khuyến nghị**, giữ dữ liệu nội bộ nhất quán.
- **(b)** Chỉ ghi các field hiển thị (`ability`/`abilityVi`/`abilityHtmlVi`/`calcs.total`), để nguyên `terms` — chấp nhận terms không cộng ra total nữa.
- **(c)** Bỏ qua hoàn toàn, chỉ ghi vào patch report, không sync codex.

---

## 2. Cinderling — mốc sao thứ tư (1300 → 1200)

Riot ghi 4 giá trị: `340/510/765/1300 ⇒ 310/465/700/1200`. Schema `set18_champions` chỉ lưu **3 mốc sao**; không có chỗ cho giá trị thứ tư.

**Khuyến nghị: bỏ qua** (không có field). Sẽ ghi đủ 4 mốc trong patch report để người đọc vẫn thấy, chỉ codex là 3 mốc.

---

## 3. The Elder Dragon — Base AD (115 → 125)

**DB thật:**

- `stats.attackDamage` (top-level): `[110, 150, 225]`
- `forms[0].stats.attackDamage`: `[100, 150, 225]`

Không chỗ nào có `115`. Nguyên nhân đã truy ra:

Bản **18.1ag** có mục "Elder Dragon AD 110→115" nhưng **đã bị SKIP** (xem `Patch_TFT18.1ag-skipped-items.md` mục 3 và comment dòng 33-34 trong `apply-pbe-balance-tft18-1ag.ts`) vì lúc đó đối chiếu nhầm với `forms[0]` (=100) chứ không phải top-level (=110).

⇒ Chuỗi thật của Riot: `110` → `115` (18.1ag, **ta bỏ lỡ**) → `125` (18.1d). Giá trị `110` ở top-level chính là mốc gốc trước 18.1ag, khớp đúng "from" của bản vá bị bỏ lỡ đó.

**Cần quyết:**

- **(a)** Ghi `125` vào **`forms[].stats.attackDamage[0]`** (đúng tiền lệ 18.1af — base AD luôn ghi vào `forms`), assert giá trị hiện tại `100`. Đồng thời ghi top-level `110` → `125` cho khớp. **← khuyến nghị**, đưa cả hai field về đúng giá trị live, bù luôn nhịp bỏ lỡ ở 18.1ag.
- **(b)** Chỉ ghi top-level `110` → `125` (field duy nhất từng khớp chuỗi số của Riot), để nguyên `forms` = 100.
- **(c)** Bỏ qua tiếp như 18.1ag.

---

## 4. Amumu — số hồi máu hiển thị (dẫn xuất từ 2.2% → 2.5%)

Hệ số gốc có anchor sạch: `forms[0].calcs[0].terms` chứa `2.2%` (2 lần) → đổi thành `2.5%`. Không có gì phải hỏi ở đây.

Vấn đề nằm ở **số hiển thị dẫn xuất**: `calcs[0].total` = `"29.04/29.15/30.8"`, và cùng dãy số đó nằm trong `ability`, `abilityVi`, `forms[0].abilityHtmlVi` ("hồi phục 29.04/29.15/30.8 Máu"). Riot không công bố số mới cho dãy này.

Nhân theo tỉ lệ `2.5/2.2`: `29.04 → 33.0`, `29.15 → 33.13`, `30.8 → 35.0`.

**Cần quyết:**

- **(a)** Tính lại theo tỉ lệ và ghi `33/33.13/35`. Codex hiển thị đúng độ lớn mới, nhưng là số **do mình suy ra**, không phải số Riot công bố.
- **(b)** Chỉ đổi `2.2%` → `2.5%` trong `terms`, để nguyên dãy `29.04/29.15/30.8`. An toàn về nguồn nhưng codex hiển thị số cũ, mâu thuẫn với hệ số ngay bên cạnh. **← khuyến nghị** nếu ưu tiên "không bịa số", theo đúng tiền lệ 18.1ah (Leona/Elder Dragon: "chỉ ghi mốc được công bố, không suy diễn").

---

## 5. Quái Rừng mốc 7 — chỉ số phẳng lệch sẵn (KHÔNG cần quyết, chỉ báo cáo)

DB lưu `Armor 6 / MR 6 / Health 60`; dữ liệu game hiện hành là `+5 / +5 / +50`. Bản vá 18.1d **không** đụng tới các số này (ảnh gốc chỉ nêu 3 con số phần trăm AD/AP/AS).

⇒ Drift có sẵn từ trước bản vá này, **ngoài phạm vi**. Không sửa ở đây. Nếu muốn dọn, nên làm ở một lượt sync dữ liệu riêng.
