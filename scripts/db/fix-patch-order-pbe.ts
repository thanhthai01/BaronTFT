// DONE — KHÔNG CHẠY LẠI (đã chạy lần 2 để sửa lại sau khi xác nhận ngày
// chính thức của "patch-pbe-2026-08-06" thực ra là 03/08/2026, không phải
// 06/08 như tên id — xem log patch chính thức: "August 3rd, 2026 - 12:00
// PDT" / "Major pass on balance & bug fixes"). Thứ tự thời gian thật của 3
// bản PBE là 03/08 (patch-pbe-2026-08-06) → 04/08 (18.1x) → 05/08 (18.1y,
// MỚI NHẤT). Giữ nguyên vị trí các bản cũ hơn (17.8 và 2 bản ví dụ minh hoạ)
// phía sau.
import { eq } from 'drizzle-orm';
import { db } from '../../src/db/client';
import { patchReports } from '../../src/db/schema';

const ORDER: Array<[string, number]> = [
  ['patch-tft18-1y', 0],
  ['patch-tft18-1x', 1],
  ['patch-pbe-2026-08-06', 2],
  ['patch-17-8', 3],
  ['patch-18-3-vi-du', 4],
  ['patch-18-2-vi-du', 5],
];

async function main() {
  for (const [id, reportOrder] of ORDER) {
    const result = await db.update(patchReports).set({ reportOrder }).where(eq(patchReports.id, id));
    console.log(`✓ ${id} → reportOrder=${reportOrder}`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
