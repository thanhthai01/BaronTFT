# scripts/meta — pipeline trang /doi-hinh-meta

Tài liệu kỹ thuật (lệnh, dữ liệu, quy tắc). Quy trình làm việc + phần phán đoán nằm ở skill
`tft-meta-update`. Mọi lệnh chạy từ gốc repo; chỉ cần Python 3 thư viện chuẩn.

## Lệnh

| Lệnh | Làm gì | Mạng |
|---|---|---|
| `python scripts/meta/sync_data.py pull` | Lấy các lần chụp từ nhánh `meta-snapshots` về `data/meta-snapshots/` | git |
| `python scripts/meta/meta_snapshot.py status` | JSON `mode`: `patch` (repo có bản vá Live mới hơn lần chụp cuối), `regular` (lần chụp cuối ≥ 44 giờ), `skip`; kèm `clusterChanged` | 1 request |
| `python scripts/meta/meta_snapshot.py fetch` | Chụp lát 24 giờ gần nhất × 3 rank (~5 KB). Nhãn bản vá lấy từ repo | 4 request |
| `python scripts/meta/meta_snapshot.py compare [OLD] [NEW] [--rank emerald\|diamond\|master]` | Báo cáo Markdown vào `data/meta-snapshots/reports/` | — |
| `python scripts/meta/meta_snapshot.py impact [--report patch-tft18-3b]` | Buff/nerf của bản vá (từ `patch-notes.generated.ts`) và đội bị ảnh hưởng | — |
| `python scripts/meta/gen_meta_comps.py [--snapshot X] [--base Y]` | Sinh `src/content/meta-comps.ts` | — |
| `python scripts/meta/sync_data.py push "<message>"` | Đẩy lần chụp mới lên nhánh `meta-snapshots` | git push |
| `pnpm test:meta` | Test Python của pipeline | — |

Alias trong `package.json`: `meta:status`, `meta:fetch`, `meta:compare`, `meta:gen`.

## Dữ liệu

- `data/meta-snapshots/<YYYY-MM-DD_HHMM>_<patch>/`: `meta.json`, `stats_<rank>_d1.json.gz`,
  `catalog.json.gz` (chỉ khi cấu trúc đội đổi; nếu không, `meta.catalogRef` trỏ tới lần chụp giữ nó).
- Thư mục này bị `.gitignore` trên `main`; nguồn thật là nhánh orphan `meta-snapshots` (tắt deploy
  trong `vercel.json`). Không commit nó vào `main`.
- `days=N` của MetaTFT = N ngày gần nhất **trong** bản vá được chọn. API trả số liệu hiện tại cho cả
  nhãn bản vá không tồn tại → không dò bản vá qua MetaTFT (dùng `/patch` của repo).
- MetaTFT thỉnh thoảng **phân cụm lại** (vd 424 → 425 ngày 25/09/2026): mã cụm đổi hết.

## `comps.json`

Danh sách đội được tuyển chọn. Mỗi đội:

| Trường | Ý nghĩa |
|---|---|
| `cluster`, `metatftName` | Mã cụm + tên gọi MetaTFT (`name_string`) — dùng để ghép lại khi phân cụm lại |
| `id` | slug ổn định, không đổi khi cập nhật |
| `name` | Tên tộc/hệ tiếng Việt (`set18-traits.ts` → `vi`) + tên tướng tiếng Anh, vd "Zyra Dũng Sĩ" |
| `carries` | Tên tướng theo `set18-champions.ts`; phần tử đầu là carry chính (dùng cho "Bị tranh") |
| `damage`, `cost` | AP/AD và giá carry chính → cột/hàng của ma trận |
| `playstyle` | "Reroll cấp 7", "Fast 8", … |
| `units` | Tướng của đội, dùng để ghép cụm và tính `impact` |
| `prediction` | `null` hoặc `{"direction": "up"\|"down", "reason": "..."}` — chỉ có tác dụng khi đội < 1.000 trận |
| `note` | **Hiện công khai trên trang.** 1–2 câu cho người chơi, không ghi suy luận nội bộ |

`gen_meta_comps.py` in khối **"CẦN XEM"** khi một đội không ghép được với cụm mới (điểm < 0,85):
chọn cụm đúng (sửa `cluster` + `metatftName`) hoặc xoá đội, rồi chạy lại. Chỉ lần chụp mới nhất mới
ghi mã cụm mới vào `comps.json`.

## Quy tắc xếp loại (`rules.py`)

- ★ `meta`: hạng TB ≤ 4,40 **và** cận trên (avg + 2 sai số) < 4,50 — chắc chắn tốt hơn mức hoà lobby.
- ◆ `predicted`: hạng TB ≤ 4,40 nhưng mẫu chưa đủ chắc, hoặc ≤ 4,45 với < 1.000 trận, hoặc
  `prediction: up` khi < 1.000 trận.
- ○ `viable`: ≤ 4,65. ✕ `avoid`: > 4,65. Ký hiệu chỉ nói **sức mạnh hiện tại**.
- Nhãn biến động riêng: `falling` "Vừa tụt" (tệ đi ≥ 0,15 hạng và vượt nhiễu), `trend` ▲▼.
- "Bị tranh": carry chính cầm đồ ở ≥ 10% đội hình (cộng mọi cụm mà carry đó là tướng cầm đồ chính,
  ≥ 50% lượt build) ≈ 0,7 đối thủ mỗi ván.
- "Giữ điểm" Top 4 ≥ 54%, "Ăn top 1" Top 1 ≥ 18% — đều phải vượt nhiễu thống kê.

Đổi ngưỡng thì sửa `rules.py` + test trong `tests/test_rules.py`, rồi chạy lại `gen_meta_comps.py`.
