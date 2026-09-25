# Routine cập nhật trang /doi-hinh-meta

Hướng dẫn cho phiên Claude chạy định kỳ (routine trên claude.ai, lịch mỗi ngày). Làm đúng thứ tự.
Mục tiêu: theo dõi meta đội hình theo số liệu MetaTFT, phân tích thay đổi, và **mở PR** cập nhật
trang `/doi-hinh-meta` để chủ site duyệt. **Không bao giờ push thẳng lên `main`.**

Mọi lệnh chạy từ gốc repo. Script chỉ dùng thư viện chuẩn Python 3 (`python3` hoặc `python`).

## Bước 0 — Lấy dữ liệu các lần chụp trước

```bash
python3 scripts/meta/sync_data.py pull
```

## Bước 1 — Quyết định có làm không (rẻ, làm trước mọi thứ)

```bash
python3 scripts/meta/meta_snapshot.py status
```

In JSON có `mode`:

- `skip` → lần chụp gần nhất còn mới (< 44 giờ) và không có bản vá mới. **Dừng ngay**, trả lời một
  dòng "Không có việc: …" kèm JSON. Không cài gì, không chạy thêm lệnh nào.
- `regular` → đã ~2 ngày kể từ lần chụp trước. Làm tiếp Bước 2.
- `patch` → `/patch` của repo vừa có bản vá Live mới hơn lần chụp gần nhất. Làm tiếp Bước 2 và
  **thêm Bước 3P** (dự đoán theo bản vá).

`clusterChanged: true` nghĩa là MetaTFT đã phân cụm lại đội hình. Bước 4 sẽ tự ghép lại, nhưng phải
đọc kỹ khối "CẦN XEM".

## Bước 2 — Chụp và so sánh

```bash
python3 scripts/meta/meta_snapshot.py fetch
python3 scripts/meta/meta_snapshot.py compare            # Lục Bảo+ (rank chính của chủ site)
python3 scripts/meta/meta_snapshot.py compare --rank master
python3 scripts/meta/sync_data.py push "Lần chụp <YYYY-MM-DD> (<patch>)"
```

Báo cáo Markdown nằm ở `data/meta-snapshots/reports/`. Nếu `fetch` lỗi mạng (MetaTFT không truy cập
được) → dừng, báo lỗi, không làm gì thêm.

Push dữ liệu **luôn** làm, kể cả khi sau đó không mở PR, để lần chạy sau có mốc so sánh.

## Bước 3 — Phân tích và sửa `scripts/meta/comps.json`

`comps.json` là danh sách đội hiện trên trang. Mỗi đội: `cluster` (mã cụm MetaTFT), `metatftName`,
`id`, `name` (tên tiếng Việt: tên tộc/hệ tiếng Việt + tên tướng tiếng Anh, vd "Zyra Dũng Sĩ"),
`carries`, `damage` (AP/AD), `cost` (giá carry chính → hàng của ma trận), `playstyle`, `units`,
`prediction`, `note`. Tên tộc/hệ tiếng Việt lấy ở `src/content/set18/set18-traits.ts` (trường `vi`).

Dựa trên báo cáo Lục Bảo+:

1. **🆕 Mới nổi / ⬆️ Mạnh lên rõ** mà chưa có trong `comps.json` và có hạng TB ≤ 4,40 với ≥ 1.000 trận
   → thêm đội. Lấy `cluster`, `units`, `metatftName` từ báo cáo/`catalog.json.gz` của lần chụp mới.
2. **⬇️ Tụt hạng — nên né** → cập nhật `note` nói rõ đội đang tụt (không cần xoá; trang tự xếp ✕/○).
3. Đội có hạng TB > 4,75 ở cả Lục Bảo+ lẫn Cao Thủ+ **và** tỉ lệ chọn < 1% → xoá khỏi danh sách.
4. `prediction` của bản vá cũ mà đội đã có ≥ 1.000 trận ở bản vá mới → đặt về `null`.
5. Giữ danh sách khoảng 15–22 đội, mỗi ô giá × AP/AD tối đa 4 đội.

### Bước 3P — chỉ khi `mode = patch`

```bash
python3 scripts/meta/meta_snapshot.py impact
```

In các tướng/tộc hệ được buff/nerf trong bản vá (lấy từ `src/content/patch-notes.generated.ts`) và
đội nào bị ảnh hưởng (`role: carry` quan trọng hơn `unit`). Với mỗi đội:

- carry chính được buff, hoặc ≥ 2 tướng chủ lực được buff → `"prediction": {"direction": "up", "reason": "..."}`
- carry chính bị nerf → `"prediction": {"direction": "down", "reason": "..."}`
- tộc hệ chính của đội bị buff/nerf → cân nhắc tương tự, ghi lý do.

Có thể thêm đội **chưa có số liệu** nhưng lõi được buff mạnh (vd tướng mới được làm lại) với
`prediction: up` — trang sẽ hiện ◆ Dự đoán mạnh. Đọc thêm phần mô tả trong patch note để hiểu mức
buff/nerf, đừng chỉ dựa vào chữ "buff".

### Quy tắc viết `note` (hiện công khai trên trang)

- Viết cho người chơi, 1–2 câu tiếng Việt, nói **vì sao** đội mạnh/yếu hoặc nên chơi khi nào.
- **Không** ghi suy luận nội bộ, ngưỡng, tên script, "routine", "dự đoán do Claude"…
- Không bịa số liệu; số trên trang đã tự hiện, note không cần lặp lại số.

## Bước 4 — Sinh dữ liệu trang

```bash
python3 scripts/meta/gen_meta_comps.py
```

- Nếu in khối **"CẦN XEM"**: đội đó chưa ghép được với cụm mới. Xem các ứng viên (tướng, tên gọi
  MetaTFT, hạng TB, số trận), chọn cụm đúng bằng cách sửa `cluster` + `metatftName` trong
  `comps.json`, hoặc xoá đội nếu cụm đã biến mất. Chạy lại đến khi hết "CẦN XEM".
- Đội có `carries` phải là tướng có trong `units` của cụm; tên tướng theo `set18-champions.ts`.

## Bước 5 — Kiểm tra

```bash
pnpm install --frozen-lockfile
pnpm typecheck
pnpm exec vitest run tests/unit/meta-matrix-model.test.ts
pnpm exec eslint src/app/doi-hinh-meta src/components/features/meta-matrix
```

Nếu test trong `meta-matrix-model.test.ts` hỏng chỉ vì dữ liệu đổi (vd test giả định một đội cụ thể
đứng ở ô nào) → sửa test cho khớp dữ liệu mới, ghi rõ trong PR. Lỗi khác → dừng, không mở PR, báo lỗi.

## Bước 6 — Mở PR

Chỉ mở PR khi `comps.json` hoặc `src/content/meta-comps.ts` thực sự đổi so với `main`.

- Nhánh: `meta/<YYYY-MM-DD>`; commit chỉ gồm `scripts/meta/comps.json`, `src/content/meta-comps.ts`
  (và test nếu phải sửa). Không commit `data/`.
- Tiêu đề: `Đội hình meta <DD/MM> — <patch>` (thêm ` · dự đoán bản vá` nếu `mode = patch`).
- Nội dung PR (tiếng Việt, ngắn):
  - Chế độ chạy + mốc so sánh (lần chụp cũ → mới).
  - 3–6 gạch đầu dòng quan trọng nhất cho người chơi Lục Bảo: đội mới nổi, đội mạnh lên, đội nên né,
    đội đang bị tranh nhanh.
  - Nếu `patch`: bảng đội được đánh dấu dự đoán ▲/▼ và lý do.
  - Đội thêm/xoá/ghép lại cụm.
  - Lệnh kiểm tra đã chạy và kết quả.
  - Dán nguyên báo cáo `compare` Lục Bảo+ trong khối `<details>`.
- Nếu đã có PR `meta/*` cũ chưa merge: đóng PR cũ với ghi chú "thay bằng #<mới>".
