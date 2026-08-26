-- Add UI visibility flag to set18_augments and set18_wisps.
-- Mirrors the `visible` column already on set18_items (0003): khi Riot gỡ một
-- Augment/Tinh Linh khỏi game giữa mùa (bản PBE 18.1ah gỡ 3 Augment và 2 Tinh
-- Linh), ta KHÔNG xoá dòng dữ liệu — chỉ đánh dấu visible=false để codex ẩn đi
-- mà bản ghi vẫn còn để tra cứu.
--
-- Vì sao không tái dùng set18_augments.is_published: is_published mang nghĩa
-- "đã soát và cho lên web chưa" và `pullAugments()` LỌC theo nó ngay ở tầng
-- pull, mà rows sau lọc lại là nguồn dựng set18-entity-index.ts. Ẩn bằng
-- is_published sẽ làm mục đó biến mất khỏi entity index, kéo theo /patch mất
-- tên tiếng Việt + icon của chính mục vừa bị gỡ — đúng thứ người đọc cần thấy
-- trong bản vá. `visible` được pull ra generated file và chỉ lọc ở tầng UI
-- codex, nên entity index vẫn đầy đủ.
--
-- Run `pnpm db:validate-constraints` against the intended target before applying.

ALTER TABLE "set18_augments"
  ADD COLUMN IF NOT EXISTS "visible" boolean NOT NULL DEFAULT true;

ALTER TABLE "set18_wisps"
  ADD COLUMN IF NOT EXISTS "visible" boolean NOT NULL DEFAULT true;
