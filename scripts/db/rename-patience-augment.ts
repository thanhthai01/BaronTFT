// Một lần — đổi nameVi theo yêu cầu người dùng: "Kiên Nhẫn Là Một Đức Tính" ->
// "Kiên Nhẫn Học Tập". (Call to Chaos giữ nguyên "Triệu Gọi Hỗn Mang" — user
// xác nhận đúng, không cần đổi.)
import { eq } from 'drizzle-orm';
import { db } from '../../src/db/client';
import { set18Augments } from '../../src/db/schema';

async function main() {
  const [row] = await db.select().from(set18Augments).where(eq(set18Augments.id, 'augment:da_patienceisavirtue'));
  if (!row) throw new Error('augment:da_patienceisavirtue không tìm thấy');
  await db
    .update(set18Augments)
    .set({ nameVi: 'Kiên Nhẫn Học Tập', updatedAt: new Date() })
    .where(eq(set18Augments.id, 'augment:da_patienceisavirtue'));
  console.log('✓ đổi tên "Patience is a Virtue" -> Kiên Nhẫn Học Tập');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
