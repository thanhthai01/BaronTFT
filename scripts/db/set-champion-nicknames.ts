// Điền cột nickname_vi (thêm 07/08/2026, xem migration schema ở src/db/schema.ts)
// cho các tướng có bản dịch lore/biệt danh tiếng Việt xác nhận từ người dùng.
// Field optional — không điền thì để trống, KHÔNG đoán.
import { eq } from 'drizzle-orm';
import { db } from '../../src/db/client';
import { set18Champions } from '../../src/db/schema';

async function main() {
  const [row] = await db.select().from(set18Champions).where(eq(set18Champions.name, 'Raptor'));
  if (!row) throw new Error('Champion không tìm thấy: Raptor');

  await db.update(set18Champions).set({ nicknameVi: 'Chim Quỷ Biến Dị', updatedAt: new Date() }).where(eq(set18Champions.name, 'Raptor'));
  console.log('✓ champion Raptor (nicknameVi = "Chim Quỷ Biến Dị")');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
