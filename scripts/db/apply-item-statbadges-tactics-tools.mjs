// Ghi statBadges cho set18_items từ dữ liệu đối chiếu tactics.tools/info/items
// (Set 17 — TFT chưa có trang Items riêng cho Set 18 vì set còn đang PBE).
//
// Phạm vi:
// - 31 item Normal + 31 item Radiant: pool item craftable cơ bản, dùng chung
//   ổn định qua nhiều set — coi tactics.tools đáng tin cho nhóm này.
// - 25 item Artifact "carry-over" (tên trùng và có mặt trên tactics.tools):
//   DỮ LIỆU TẠM, chưa xác minh khớp game Set 18 thật — Artifact là item thiết
//   kế riêng theo set nên số liệu có thể lệch (đã xác nhận thật với Dawncore:
//   tactics.tools ghi 10%/tối thiểu 10, Set 18 PBE thật là 5%/tối thiểu 15).
//   Người dùng đã duyệt dùng tạm để có dữ liệu, sẽ tự tay soát lại khi Set 18
//   chính thức live.
// - 2 item Artifact mới hoàn toàn của Set 18 (Horizon Focus, Manazane): KHÔNG
//   có trên tactics.tools (site Set 17 không có) — bỏ qua, không ghi.
//
// Chỉ ghi khi statBadges hiện đang null (không ghi đè dữ liệu đã soát tay).
import { neon } from '@neondatabase/serverless';
import fs from 'node:fs';

const sql = neon(process.env.DATABASE_URL);

const normalRadiantPlan = JSON.parse(fs.readFileSync('scripts/db/_tmp-item-badges-plan.json', 'utf8'));
const artifactPlan = JSON.parse(fs.readFileSync('scripts/db/_tmp-artifact-badges-plan.json', 'utf8'));

const allItems = [...normalRadiantPlan.normal, ...normalRadiantPlan.radiant, ...artifactPlan.plan];

let written = 0;
let skipped = 0;
for (const item of allItems) {
  const [row] = await sql`select stat_badges from set18_items where name = ${item.dbName}`;
  if (!row) {
    console.log(`✗ Không tìm thấy trong DB: ${item.dbName}`);
    continue;
  }
  if (row.stat_badges !== null) {
    console.log(`- Bỏ qua (đã có statBadges): ${item.dbName}`);
    skipped++;
    continue;
  }
  await sql`update set18_items set stat_badges = ${JSON.stringify(item.badges)}::jsonb, updated_at = now() where name = ${item.dbName}`;
  console.log(`✓ ${item.dbName}`);
  written++;
}

console.log(`\nHoàn tất: ${written} item đã ghi, ${skipped} item bỏ qua (đã có sẵn).`);
console.log('2 item mới Set 18 chưa có dữ liệu (cần bạn tự bổ sung sau):', artifactPlan.newInSet18);
